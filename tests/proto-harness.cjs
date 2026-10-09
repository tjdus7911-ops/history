const fs=require('fs'),vm=require('vm');
exports.load=(overrides={})=>{
 let html='',saved=null;const handlers=[];
 const context=vm.createContext({Date,console,document:{querySelector:s=>s==='#app'?{set innerHTML(v){html=v}}:null,querySelectorAll:()=>[],addEventListener:(type,handler,capture)=>{if(type==='click')handlers.push({handler,capture})},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}},localStorage:{getItem:()=>saved,setItem:(k,v)=>saved=v},window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){},setInterval:()=>1,clearInterval(){}});
 const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(f=>f!=='pwa.js');
 vm.runInContext(scripts.map(f=>overrides[f]??fs.readFileSync('dist/'+f,'utf8')).join('\n'),context);
 const run=s=>vm.runInContext(s,context),copy=s=>JSON.parse(run('JSON.stringify('+s+')'));
 return {run,copy,context,html:()=>html,handlers};
};
