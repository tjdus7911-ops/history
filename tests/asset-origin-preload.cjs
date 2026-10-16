'use strict';
// Test-environment helper (run with `node -r ./tests/asset-origin-preload.cjs tests/<name>.cjs`).
// dist/assets is not stored in this repository's working tree; it is served from the pinned GitHub
// snapshot in config/deployment-asset-origin.json (same as serve.cjs and the vercel.json rewrite).
// Test servers that only serve ./dist would 404 those files, so any missing /assets/* request is
// streamed from the pinned snapshot. Nothing is mocked: the real binary files are fetched.
const fs = require('node:fs');
const http = require('node:http');
const https = require('node:https');
const path = require('node:path');
const origin = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config', 'deployment-asset-origin.json'), 'utf8'));
const remoteRoot = `https://raw.githubusercontent.com/${origin.repository}/${origin.commit}/${origin.sourcePath}`;
const dist = path.resolve(__dirname, '..', 'dist');
const createServer = http.createServer;
http.createServer = function patched(...args) {
  const listenerIndex = typeof args[0] === 'function' ? 0 : 1;
  const listener = args[listenerIndex];
  if (typeof listener === 'function') {
    args[listenerIndex] = function wrapped(req, res) {
      let name;
      try { name = decodeURIComponent((req.url || '').split('?')[0]); } catch { name = ''; }
      if (name.startsWith('/assets/') && !name.includes('..') && !fs.existsSync(path.join(dist, name))) {
        // stream the pinned snapshot bytes through the test server so pages stay same-origin
        // (canvas/getImageData checks would otherwise be tainted by a cross-origin redirect)
        https.get(encodeURI(remoteRoot + name.slice('/assets'.length)), upstream => {
          const type = upstream.headers['content-type'] || 'application/octet-stream';
          res.writeHead(upstream.statusCode || 502, { 'Content-Type': type, 'Cache-Control': 'public, max-age=300' });
          upstream.pipe(res);
        }).on('error', () => { res.writeHead(502); res.end('asset origin unavailable'); });
        return;
      }
      return listener.call(this, req, res);
    };
  }
  return createServer.apply(this, args);
};
