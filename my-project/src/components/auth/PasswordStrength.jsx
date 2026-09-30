import { passwordStrength } from '@/lib/passwordPolicy';

const colors = ['', 'bg-red-500', 'bg-amber-500', 'bg-emerald-600'];
const textColors = ['', 'text-red-700', 'text-amber-700', 'text-emerald-700'];

export default function PasswordStrength({ password = '' }) {
  const { level, label } = passwordStrength(password);
  return <div className="mt-2" aria-live="polite">
    <div className="flex gap-1.5" aria-hidden="true">
      {[1, 2, 3].map(step => <span key={step}
        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ease-out motion-reduce:transition-none ${level >= step ? colors[level] : 'bg-slate-200'}`} />)}
    </div>
    <p className={`mt-1 min-h-5 text-xs font-medium ${textColors[level] || 'text-slate-500'}`}>
      {label ? `Password strength: ${label}` : 'Password strength appears as you type.'}
    </p>
  </div>;
}
