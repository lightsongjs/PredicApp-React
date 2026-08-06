const fs = require('fs');
const path = require('path');
const configPath = path.join(process.env.APPDATA, 'xdg.config', '.wrangler', 'config', 'default.toml');
const content = fs.readFileSync(configPath, 'utf8');
const tokenMatch = content.match(/oauth_token\s*=\s*"([^"]+)"/);
const token = tokenMatch[1];
const accountId = 'd37eaf1e511117845d7249a12456ea71';
const bucketName = 'prediciduminica';

async function listAll() {
  let cursor = '';
  let allKeys = [];
  let page = 0;

  do {
    page++;
    const url = 'https://api.cloudflare.com/client/v4/accounts/' + accountId + '/r2/buckets/' + bucketName + '/objects?prefix=audio/&per_page=1000' + (cursor ? '&cursor=' + cursor : '');
    const res = await fetch(url, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();

    if (data.success === false) {
      console.error('API Error:', JSON.stringify(data.errors));
      break;
    }

    const objects = data.result || [];
    for (const obj of objects) {
      allKeys.push(obj.key);
    }

    cursor = (data.result_info && data.result_info.cursor) ? data.result_info.cursor : '';
    console.error('Page ' + page + ': got ' + objects.length + ' objects (total: ' + allKeys.length + ')');
  } while (cursor);

  for (const key of allKeys) {
    console.log(key);
  }
  console.error('\nTotal audio files: ' + allKeys.length);
}

listAll().catch(e => console.error(e));
