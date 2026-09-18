import { Route, Routes, Navigate, useParams, Link } from "react-router-dom";
import Layout from "./components/layout";
import GuestGuard from "./components/GuestGuard";
import Marketplace, { ServiceBooking } from "./pages/Marketplace";
import AccountDashboard, { PaymentReturn } from "./pages/AccountDashboard";
import ProviderConsole from "./pages/ProviderConsole";
import AccountAccess from "./pages/AccountAccess";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import DiscoverAbia from "./pages/DiscoverAbia";
function EventLink() { const {id}=useParams(); return <Navigate replace to={"/book/event/"+id}/>; }
function Home() {
  return <><section className="mx-auto max-w-6xl px-5 pt-12"><p className="font-semibold text-[#3F7D3D]">MMEMME ABIA</p><h1 className="mt-4 max-w-3xl text-4xl font-bold md:text-6xl">Experience Abia, your way.</h1><p className="mt-5 max-w-2xl text-lg text-gray-600">Discover events, plan a stay, enjoy local food and find your next journey.</p><Link to="/hotels" className="mt-6 inline-block rounded-lg bg-[#3F7D3D] px-5 py-3 text-white">Plan your stay</Link></section><Marketplace/></>;
}
export default function App() {
  return <div className="min-h-screen bg-[#f5f7f3]"><Routes>
    <Route element={<Layout/>}>
      <Route index element={<Home/>}/>
      <Route path="events" element={<Marketplace key="events"/>}/>
      <Route path="hotels" element={<Marketplace key="hotels" kind="HOTEL"/>}/>
      <Route path="restaurants" element={<Marketplace key="food" kind="FOOD"/>}/>
      <Route path="transport-routes" element={<Marketplace key="transport" kind="TRANSPORT"/>}/>
      <Route path="tourism" element={<Marketplace key="tourism" kind="TOURISM"/>}/>
      <Route path="about" element={<DiscoverAbia/>}/>
      <Route path="book/:kind/:id" element={<ServiceBooking/>}/>
      <Route path="events/:id" element={<EventLink/>}/>
      <Route path="account" element={<GuestGuard><AccountDashboard/></GuestGuard>}/>
      <Route path="payment/return" element={<GuestGuard><PaymentReturn/></GuestGuard>}/>
      <Route path="organizer/*" element={<GuestGuard><ProviderConsole/></GuestGuard>}/>
      <Route path="verify-email" element={<AccountAccess verify/>}/>
      <Route path="reset-password" element={<AccountAccess/>}/>
      {["profile","ticket","dashboard","message","checkout","Payment","Paymentsuccess","book-comfire","Signup/onboarding"].map(path=><Route key={path} path={path} element={<Navigate to="/account" replace/>}/>)}
      {[["hotel","hotels"],["food","restaurants"],["transport","transport-routes"],["panyu","hotels"],["fooddetail","restaurants"]].map(([from,to])=><Route key={from} path={from} element={<Navigate to={"/"+to} replace/>}/>)}
      <Route path="*" element={<NotFound/>}/>
    </Route>
    <Route path="login" element={<Login/>}/>
    <Route path="organizer/login" element={<Login/>}/>
    <Route path="signup" element={<SignUp/>}/>
  </Routes></div>;
}
