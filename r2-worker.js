/**
 * Cloudflare Worker to serve R2 audio files publicly
 * This allows streaming sermons from R2 bucket
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = decodeURIComponent(url.pathname.slice(1)); // Remove leading / and decode URL

    // Handle CORS for audio streaming
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': 'Range, Content-Type',
        },
      });
    }

    try {
      // Parse range header BEFORE fetching
      const rangeHeader = request.headers.get('Range');
      let rangeOptions = undefined;
      let start = 0;
      let end = undefined;

      if (rangeHeader) {
        const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
        if (match) {
          start = parseInt(match[1]);
          end = match[2] ? parseInt(match[2]) : undefined;

          // R2 range option: offset and optional length
          rangeOptions = {
            offset: start,
            length: end !== undefined ? end - start + 1 : undefined,
          };
        }
      }

      // Get object from R2 with optional range
      const object = await env.R2_BUCKET.get(key, { range: rangeOptions });

      if (object === null) {
        return new Response('File not found', { status: 404 });
      }

      // Get headers for response
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Cache-Control', 'public, max-age=31536000');
      headers.set('Accept-Ranges', 'bytes');

      // Handle range response
      if (rangeHeader && rangeOptions) {
        // For range requests, end defaults to file size - 1
        const actualEnd = end !== undefined ? end : object.size - 1;
        const contentLength = actualEnd - start + 1;

        headers.set('Content-Range', `bytes ${start}-${actualEnd}/${object.size}`);
        headers.set('Content-Length', contentLength.toString());

        return new Response(object.body, {
          status: 206,
          headers,
        });
      }

      // Return full file
      headers.set('Content-Length', object.size.toString());
      return new Response(object.body, {
        headers,
      });

    } catch (error) {
      return new Response('Error: ' + error.message, { status: 500 });
    }
  },
};
