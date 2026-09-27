import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Seo from '@/components/seo/Seo';

// Policy copy supplied in the project's Figma terms screen (797:1078).
export const termsSections = [
  ['Acceptance of Terms', 'By using Mmemme Abia, you agree to these terms and conditions. Please read them carefully before using our platform.'],
  ['User Responsibilities', 'Users agree to provide accurate information and use the platform lawfully and in accordance with our guidelines.'],
  ['Ticketing & Refunds', 'Mmemme Abia gets a 5% commission on every ticket sold. All ticket sales are final unless stated otherwise by the organizer. Refunds may be issued at the organizer’s discretion.'],
  ['Payments', 'Mmemme Abia processes all fees and payments securely via trusted payment partners.'],
  ['Limitation of Liability', 'Mmemme Abia is not responsible for any loss, damage, or injury resulting from the use of our platform or events.'],
  ['Termination', 'We reserve the right to suspend or terminate accounts that violate our terms or engage in prohibited activities.'],
];
export function TermsContent(){return <div className="space-y-7">{termsSections.map(([title,text],index)=><section key={title} id={`terms-${index}`} className="scroll-mt-28"><h2 className="text-lg font-semibold">{title}</h2><p className="mt-2 text-sm leading-7 text-slate-600">{text}</p></section>)}<section id="terms-contact"><h2 className="text-lg font-semibold">Contact</h2><p className="mt-2 text-sm leading-7 text-slate-600">For questions about these terms, <Link to="/contact" className="text-green-800 underline">contact our support team</Link>.</p></section></div>;}
export default function Terms(){return <div className="min-h-screen bg-[#f7f9f7]"><Seo title="Terms & Conditions" path="/terms"/><Header/><main className="mx-auto max-w-6xl px-6 py-10"><p className="text-sm text-slate-500"><Link to="/">Home</Link> / Terms & Conditions</p><h1 className="mt-6 text-3xl font-bold">Terms & Conditions</h1><p className="mt-2 text-xs text-slate-500">Version: September 2026</p><div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr]"><aside><h2 className="font-semibold">On this page</h2><nav className="mt-4 flex flex-col gap-4 text-sm text-green-800">{termsSections.map(([title],i)=><a key={title} href={`#terms-${i}`}>{title}</a>)}<a href="#terms-contact">Contact</a></nav></aside><article className="rounded-2xl bg-white p-6 sm:p-9"><TermsContent/></article></div></main><Footer/></div>;}
