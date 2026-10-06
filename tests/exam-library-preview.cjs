// Isolated browser QA origin. Never use the player's saved-progress origin.
const http=require('http'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'../dist');
const types={'.html':'text/html;charset=utf-8','.js':'text/javascript;charset=utf-8','.css':'text/css;charset=utf-8','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png'};
http.createServer((req,res)=>{
 const pathname=decodeURIComponent(req.url.split('?')[0]),file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
 fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end();return}
 if(pathname==='/')data=data.toString().replace('<script src="pwa.js"></script>','<script>/* Completed-era fixture, only on this isolated QA server. */ meta().completedChapters=eraChapters("goryeo").map(ch=>ch.chapterId);navigate("exam-library");</script>');
 res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
 });
}).listen(4190,'127.0.0.1',()=>console.log('Isolated completed-era QA: http://127.0.0.1:4190/'));
