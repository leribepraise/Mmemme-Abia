let installPrompt=null;
const listeners=new Set();
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;listeners.forEach(fn=>fn());});
window.addEventListener('appinstalled',()=>{installPrompt=null;listeners.forEach(fn=>fn());});
export function watchInstall(listener){listeners.add(listener);return()=>listeners.delete(listener);}
export const canInstall=()=>!!installPrompt;
export const isInstalled=()=>window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
export async function installApp(){const prompt=installPrompt;if(!prompt)return false;installPrompt=null;await prompt.prompt();const result=await prompt.userChoice;listeners.forEach(fn=>fn());return result.outcome==='accepted';}
