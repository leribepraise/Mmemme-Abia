import { Link } from 'wouter';

export function Brand() {
  return (
    <Link href="/dashboard" className="brand" data-testid="link-brand">
      <span className="brand-mark">M</span>
      <span className="brand-copy">Mmemme<small>ABIA</small></span>
    </Link>
  );
}
