import Inbox from '@/components/notification/Inbox';
import Seo from '@/components/seo/Seo';
import Header from '@/components/layout/Header';
export default function NotificationsPage(){return <><Header/><main className="min-h-screen bg-[#F5F7F3] p-4 md:p-8"><Seo title="Notifications" noIndex path="/notifications"/><Inbox/></main></>;}
