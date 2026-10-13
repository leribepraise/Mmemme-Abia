import { useRef } from 'react';
import SiteImage from '@/components/SiteImage';
export default function VenueGallery({hotel}){
 const dialog=useRef(null);const pictures=hotel.gallery||[];
 if(!pictures.length)return <div className="rounded-2xl border p-6">Property photos have not been uploaded yet.</div>;
 return <section><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{pictures.slice(0,4).map((src,i)=><button key={src} aria-label={`View property photo ${i+1}`} onClick={()=>dialog.current?.showModal()}><SiteImage src={src} alt={`${hotel.name} photo ${i+1}`} className="w-full h-56 object-contain rounded-xl"/></button>)}</div><button className="mt-3 underline" onClick={()=>dialog.current?.showModal()}>View all {pictures.length} photos</button><dialog ref={dialog} className="m-auto max-w-[90vw] max-h-[90vh] p-4 rounded-xl backdrop:bg-black/60"><form method="dialog"><button className="underline mb-4">Close gallery</button></form>{pictures.map((src,i)=><SiteImage key={src} src={src} alt={`${hotel.name} photo ${i+1}`} className="w-full max-h-[70vh] object-contain mb-4"/>)}</dialog></section>;
}
