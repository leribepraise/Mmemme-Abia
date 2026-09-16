import { Link } from "react-router-dom";

export function Brand() {
  return (
    <Link to="/organizer/dashboard" className="brand" data-testid="link-brand">
      <span className="brand-mark">M</span>
      <span className="brand-copy">Mmemme<small>ABIA</small></span>
    </Link>
  );
}
