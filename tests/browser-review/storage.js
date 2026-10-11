/* Preview-only test storage. Never reads, clears, or replaces normal game keys. */
(() => {
  const nativeStorage=window.localStorage,params=new URLSearchParams(location.search);
  const prefix='history-ui-review/'+(params.get('session')||'default')+'/'+(params.get('case')||'menus')+'/';
  const ownKeys=()=>Object.keys(nativeStorage).filter(k=>k.startsWith(prefix));
  const storage={getItem:key=>nativeStorage.getItem(prefix+key),setItem:(key,value)=>nativeStorage.setItem(prefix+key,String(value)),removeItem:key=>nativeStorage.removeItem(prefix+key),clear:()=>ownKeys().forEach(k=>nativeStorage.removeItem(k)),key:index=>ownKeys()[index]?.slice(prefix.length)||null,get length(){return ownKeys().length;}};
  Object.defineProperty(window,'localStorage',{value:storage,configurable:true});
})();
