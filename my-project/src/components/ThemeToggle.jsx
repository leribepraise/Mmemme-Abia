import { Moon, Sun } from 'lucide-react';
import { useTheme } from './context/ThemeContext';

export default function ThemeToggle({ compact = false }) {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';
  const Icon = dark ? Sun : Moon;
  return <button type="button" onClick={toggleTheme} aria-label="Dark mode" aria-pressed={dark}
    title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-3 rounded-lg border border-border bg-card px-3 text-sm text-foreground hover:bg-accent ${compact ? 'w-11' : 'w-full'}`}>
    <Icon size={18} aria-hidden="true"/>{!compact && <><span>Dark mode</span><span className="ml-auto text-xs text-muted-foreground">{dark ? 'On' : 'Off'}</span></>}
  </button>;
}
