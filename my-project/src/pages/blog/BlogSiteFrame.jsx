import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function BlogSiteFrame({ children }) {
  return <><Header /><div className="blog-editor">{children}</div><Footer /></>;
}
