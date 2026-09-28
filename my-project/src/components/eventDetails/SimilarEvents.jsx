import { useCollection } from "@/hooks/useApi";
import { eventCard } from "@/lib/catalog";
import ShareEvent from "./ShareEvent";
import SimilarEventCard from "./SimilarEventCard";
import {useParams} from 'react-router-dom';
import {api} from '@/lib/api';
import toast from 'react-hot-toast';

const SimilarEvents = () => {
  const { data: events } = useCollection("/events/", eventCard);
  const {id}=useParams();
  const {data:saved,reload}=useCollection('/saved-events/');
  const toggle=async eventId=>{
    try{await api('/saved-events/',{method:saved.some(row=>row.id===eventId)?'DELETE':'POST',body:{event:eventId}});reload();}
    catch(error){toast.error(error.message);}
  };
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
      <ShareEvent />

      <h3 className="text-[20px] font-semibold text-[#000000] tracking-wider">
        Similar Events
      </h3>

      <div className="space-y-3">
        {events.filter(event=>event.id!==id).slice(0, 2).map(event => <SimilarEventCard key={event.id} id={event.id} saved={saved.some(row=>row.id===event.id)} onSave={()=>toggle(event.id)} image={event.image} alt={event.text} title={event.text} date={event.date} location={event.text2} price={event.text3} />)}
      </div>
    </div>
  );
};

export default SimilarEvents;
