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
      // Get object from R2
      const object = await env.R2_BUCKET.get(key);

      if (object === null) {
        return new Response('File not found', { status: 404 });
      }

      // Get headers for response
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('etag', object.httpEtag);
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year

      // Support range requests for audio seeking
      const rangeHeader = request.headers.get('Range');
      if (rangeHeader) {
        headers.set('Accept-Ranges', 'bytes');
        // Parse range header and return partial content
        const range = rangeHeader.match(/bytes=(\d+)-(\d*)/);
        if (range) {
          const start = parseInt(range[1]);
          const end = range[2] ? parseInt(range[2]) : object.size - 1;
          const length = end - start + 1;

          headers.set('Content-Range', `bytes ${start}-${end}/${object.size}`);
          headers.set('Content-Length', length.toString());

          return new Response(object.body, {
            status: 206,
            headers,
          });
        }
      }

      // Return full file
      return new Response(object.body, {
        headers,
      });

    } catch (error) {
      return new Response('Error: ' + error.message, { status: 500 });
    }
  },
};
