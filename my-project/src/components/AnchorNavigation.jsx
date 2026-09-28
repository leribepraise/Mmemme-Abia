import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

export default function AnchorNavigation(){
  const {pathname,hash}=useLocation();
  useEffect(()=>{
    if(!hash)return;
    let id;
    try{id=decodeURIComponent(hash.slice(1));}catch{return;}
    document.getElementById(id)?.scrollIntoView({block:'start'});
  },[pathname,hash]);
  return null;
}
