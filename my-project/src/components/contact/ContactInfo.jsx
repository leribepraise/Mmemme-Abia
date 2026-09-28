import { Link } from 'react-router-dom';
export default function ContactInfo() {
  return <section className="space-y-5"><h1 className="text-4xl font-bold text-gray-900">Contact Mmemme Abia</h1><p className="text-gray-600">For account, booking or payment questions, send a message to our support team. Sign in so we can reply in your account.</p><Link to="/help" className="text-green-800 underline">Read common questions</Link></section>;
}
