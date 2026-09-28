import { Link } from 'react-router-dom';
export default function Updateed() {
  return <section className="my-10 flex flex-col items-center justify-between gap-5 rounded-[15px] bg-[#093517] p-5 text-white lg:flex-row">
    <div><h2 className="text-3xl font-bold">Discover events across Abia</h2><p className="mt-2 text-lg">Browse published events and check available tickets.</p></div>
    <Link to="/events" className="rounded-lg bg-[#F56608] px-5 py-3 font-semibold">Explore events</Link>
  </section>;
}
