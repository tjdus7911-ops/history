if('serviceWorker' in navigator){
  window.addEventListener('load',async()=>{
    try{
      const registration=await navigator.serviceWorker.register('/sw.js',{scope:'/',updateViaCache:'none'});
      document.documentElement.dataset.serviceWorkerScope=registration.scope;
      registration.update();
    }catch(error){
      console.warn('Service worker registration failed.',error);
    }
  });
}
