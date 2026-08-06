import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function AuthSignup() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]  = useState(false);
  const [form, setForm]        = useState({ name: '', email: '', password: '' });
  const [focused, setFocused]  = useState('');

  const fields = [
    { key: 'name',     label: 'Full name',      Icon: User, type: 'text',     ph: 'Kaelen Vance' },
    { key: 'email',    label: 'Email address',   Icon: Mail, type: 'email',    ph: 'name@example.com' },
    { key: 'password', label: 'Create password', Icon: Lock, type: 'password', ph: '••••••••••' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1100));
    setLoading(false);
    navigate('/');
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthColor = ['bg-error','bg-tertiary','bg-secondary','bg-primary'][strength - 1] || 'bg-outline-variant/30';

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-secondary-container/20 rounded-full blur-[120px] animate-pulse-glow delay-1500" />
      </div>

      <main className="z-10 w-full max-w-md animate-fade-up">
        <div className="text-center mb-9">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dim mb-4 shadow-[0_0_35px_rgba(167,165,255,0.3)]">
            <Sparkles size={24} className="text-on-primary" />
          </div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-primary-fixed to-secondary bg-clip-text text-transparent mb-1.5">
            Join Obsidian AI
          </h1>
          <p className="text-on-surface-variant text-sm">Your intelligence layer awaits</p>
        </div>

        <div className="glass-card rounded-3xl p-8 border border-outline-variant/12 shadow-[0_24px_60px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label, Icon, type, ph }) => (
              <div key={key} className="space-y-1.5">
                <label className="block text-[10px] font-bold text-on-surface-variant ml-1 uppercase tracking-widest">{label}</label>
                <div className={`relative transition-all ${focused === key ? 'scale-[1.01]' : ''}`}>
                  <Icon size={14} className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${focused === key ? 'text-primary' : 'text-outline'}`} />
                  <input
                    type={key === 'password' && showPass ? 'text' : type}
                    required value={form[key]}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    onFocus={() => setFocused(key)}
                    onBlur={() => setFocused('')}
                    placeholder={ph}
                    className="w-full pl-11 pr-4 py-3.5 bg-surface-container-highest/40 border border-outline-variant/20 rounded-xl text-on-surface placeholder:text-outline/60 text-sm focus:border-primary/50 transition-all"
                  />
                  {key === 'password' && (
                    <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors">
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  )}
                  {focused === key && <div className="absolute inset-0 rounded-xl ring-1 ring-primary/20 pointer-events-none" />}
                </div>
                {key === 'password' && form.password && (
                  <div className="flex items-center gap-2 px-1">
                    <div className="flex gap-1 flex-1">
                      {[0,1,2,3].map(i => (
                        <div key={i} className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${i < strength ? strengthColor : 'bg-outline-variant/30'}`} />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-on-surface-variant">
                      {['','Weak','Fair','Good','Strong'][strength]}
                    </span>
                  </div>
                )}
              </div>
            ))}

            <p className="text-xs text-on-surface-variant text-center leading-relaxed">
              By creating an account you agree to our{' '}
              <a href="#" className="text-primary hover:underline">Terms</a> &{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>

            <button
              type="submit" disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary-dim text-on-primary font-bold rounded-xl shadow-[0_10px_25px_rgba(100,94,251,0.3)] hover:shadow-[0_15px_35px_rgba(100,94,251,0.45)] hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                : <><span>Create account</span><ArrowRight size={16} /></>
              }
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-on-surface-variant text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary-fixed font-bold ml-1 transition-colors">Sign in →</Link>
        </p>
      </main>
    </div>
  );
}
