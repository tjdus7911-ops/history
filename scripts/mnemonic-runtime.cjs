const fs=require('fs'),vm=require('vm');
module.exports=function(){
 const context=vm.createContext({Date,console,document:{querySelector:s=>s==='#app'?{innerHTML:''}:null,querySelectorAll:()=>[],addEventListener(){},createElement:()=>({setAttribute(){},remove(){}}),body:{append(){}}},localStorage:{getItem:()=>null,setItem(){}},window:{scrollTo(){}},navigator:{},setTimeout:()=>0,clearTimeout(){}});
 const scripts=[...fs.readFileSync('dist/index.html','utf8').matchAll(/<script src="([^"]+)"/g)].map(m=>m[1]).filter(n=>n!=='pwa.js');
 vm.runInContext(scripts.map(n=>fs.readFileSync('dist/'+n,'utf8')).join('\n'),context);
 return JSON.parse(vm.runInContext('JSON.stringify({cards:globalThis.MNEMONIC_INVENTORY,memories:globalThis.ASSOCIATION_MEMORIES,official:globalThis.OFFICIAL_EXAM_CATALOG.map(e=>e.canonicalQuestionId),scenes:Object.keys(STORIES)})',context));
};
