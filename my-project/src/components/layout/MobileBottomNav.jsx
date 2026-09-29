import { Link, useLocation } from 'react-router-dom';
import { House, Search, CalendarDays, Bookmark, UserRound } from 'lucide-react';

export default function MobileBottomNav() {
  const { pathname, search } = useLocation();
  const section = new URLSearchParams(search).get('section');
  const active = pathname === '/' ? 'Home'
    : pathname === '/profile' && ['My Bookings', 'My Tickets'].includes(section) ? 'Bookings'
    : pathname === '/profile' && section === 'Saved Items' ? 'Saved'
    : pathname === '/profile' || pathname === '/dashboard' ? 'Profile'
    : ['/search', '/events', '/hotel', '/hotels', '/food', '/fooddetail', '/tourism', '/destinations', '/transport'].some(path => pathname === path || pathname.startsWith(path+'/')) ? 'Explore' : null;
  const items = [
    ['Home', '/', House],
    ['Explore', '/search', Search],
    ['Bookings', '/profile?section=My%20Bookings', CalendarDays],
    ['Saved', '/profile?section=Saved%20Items', Bookmark],
    ['Profile', '/profile', UserRound],
  ];
  return <>
    <div aria-hidden="true" className="h-[calc(76px+env(safe-area-inset-bottom))] lg:hidden" />
    <nav aria-label="Mobile primary navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-[#E4E7EC] bg-white pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="mx-auto grid h-[76px] max-w-2xl grid-cols-5">
        {items.map(([label,to,Icon]) => <Link key={label} to={to} aria-current={active===label?'page':undefined} className={`flex min-w-0 flex-col items-center justify-center gap-1.5 text-[12px] font-medium sm:text-sm ${active===label?'text-[#3F783D]':'text-[#98A2B3]'} focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-green-700`}>
          <Icon aria-hidden="true" className="h-7 w-7" strokeWidth={1.8}/><span>{label}</span>
        </Link>)}
      </div>
    </nav>
  </>;
}
