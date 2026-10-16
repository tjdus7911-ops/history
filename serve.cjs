'use strict';

const http = require('node:http');
const https = require('node:https');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, 'dist');
const assetOrigin = JSON.parse(fs.readFileSync(path.join(__dirname, 'config', 'deployment-asset-origin.json'), 'utf8'));
const remoteAssetRoot = `https://raw.githubusercontent.com/${assetOrigin.repository}/${assetOrigin.commit}/${assetOrigin.sourcePath}`;
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

http.createServer((request, response) => {
  const name = decodeURIComponent(request.url.split('?')[0]);
  const file = path.resolve(root, `.${name === '/' ? '/index.html' : name}`);
  if (!file.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403);
    response.end();
    return;
  }

  fs.readFile(file, (error, data) => {
    if (error) {
      if (name.startsWith('/assets/')) {
        const remoteUrl = encodeURI(`${remoteAssetRoot}${name.slice('/assets'.length)}`);
        if (name.startsWith('/assets/ancient/three-complete/overlays/') && name.endsWith('.svg')) {
          https.get(remoteUrl, (upstream) => {
            response.writeHead(upstream.statusCode || 502, {
              'Content-Type': 'image/svg+xml; charset=utf-8',
              'Cache-Control': 'public, max-age=300',
            });
            upstream.pipe(response);
          }).on('error', () => {
            response.writeHead(502);
            response.end('Asset origin unavailable');
          });
          return;
        }
        response.writeHead(302, {
          Location: remoteUrl,
          'Cache-Control': 'public, max-age=300',
        });
        response.end();
        return;
      }
      response.writeHead(404);
      response.end('Not found');
      return;
    }
    response.setHeader('Content-Type', contentTypes[path.extname(file)] || 'application/octet-stream');
    if (name === '/sw.js') response.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.end(data);
  });
}).listen(4173, '127.0.0.1', () => console.log('http://127.0.0.1:4173'));
