import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { useApi } from '@/hooks/useApi';

export default function SocialAuthButtons({ flow = 'user', signup = false, termsAccepted = true }) {
  const { data: config, loading } = useApi('/auth/social/config/');
  const begin = provider => {
    if (signup && !termsAccepted) {
      toast.error('Please accept the Terms & Conditions before creating an account.');
      return;
    }
    window.location.assign(`/api/v1/auth/social/${provider}/start/?flow=${encodeURIComponent(flow)}`);
  };
  return <div>
    <div className="grid grid-cols-2 gap-3">
      <button type="button" disabled={loading || !config?.google} onClick={() => begin('google')}
        className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Continue with Google">
        <FcGoogle aria-hidden="true" className="h-5 w-5" />Google
      </button>
      <button type="button" disabled={loading || !config?.apple} onClick={() => begin('apple')}
        className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Continue with Apple">
        <img src="/applelogo.png" alt="" className="h-5 w-5 object-contain" />Apple
      </button>
    </div>
  </div>;
}
