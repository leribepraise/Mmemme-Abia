import { Link } from 'wouter';
import { Bell, Search } from 'lucide-react';

export function PublicHeader() {
  return (
    <header className="public-header">
      <Link href="/login"><img src="/logo.png" alt="Mmemme Abia" className="public-logo" /></Link>
      <nav>
        <a>Home</a><a>Events</a><a>Hotels</a><a>Tourism</a><a>Transport</a><a>Food</a><a>Community</a><a>Blog</a><a>About us</a>
      </nav>
      <div className="public-actions"><Search size={16} /><Bell size={16} /><img src="/user.png" alt="" /></div>
    </header>
  );
}
