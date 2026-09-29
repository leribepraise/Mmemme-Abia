import { Link } from 'react-router-dom';
import { UserRound } from "lucide-react";

const AccountRecoveryCard = ({ user }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-[#EAF4EB] flex items-center justify-center shrink-0">
          <UserRound className="w-4 h-4 text-[#3F783D]" />
        </div>

        <div>
          <h3 className="font-bold text-base text-[#172033]">
            Account Recovery
          </h3>
          <p className="text-sm text-gray-500">
            Password reset links are sent to your verified account email.
          </p>
        </div>
      </div>

      <p className="break-all text-sm font-medium">{user?.email || 'No email available'}</p>
      <p className="mt-2 text-xs text-gray-500">Your optional profile phone is not used for password recovery.</p>
      <Link to="/profile?section=Settings&tab=Profile" className="mt-3 inline-block text-sm font-semibold text-[#3F783D] hover:underline">Edit profile</Link>
    </div>
  );
};

export default AccountRecoveryCard;
