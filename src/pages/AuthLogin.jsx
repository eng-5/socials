import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sparkles, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [ef, setEf] = useState(false);
  const [pf, setPf] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[15%] -left-[10%] w-[55%] h-[55%] bg-secondary-container/25 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute -bottom-[15%] -right-[10%] w-[50%] h-[50%] bg-primary-dim/12 rounded-full blur-[140px] animate-pulse-glow delay-1500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-tertiary/5 rounded-full blur-[100px] animate-pulse-glow delay-500" />
      </div>

      <main className="z-10 w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dim mb-5 shadow-[0_0_40px_rgba(167,165,255,0.35)] relative">
            <Sparkles size={28} className="text-on-primary" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-primary-dim opacity-30 blur-xl scale-150" />
          </div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-primary-fixed to-secondary bg-clip-text text-transparent mb-2">
            Obsidian AI
          </h1>
          <p className="text-on-surface-variant text-sm tracking-wide">Enter the intelligence layer</p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8 border border-outline-variant/12 shadow-[0_24px_60px_rgba(0,0,0,0.6)] relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-on-surface-variant ml-1 uppercase tracking-widest">Email address</label>
              <div className={`relative transition-all ${ef ? 'scale-[1.01]' : ''}`}>
                <Mail size={15} className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${ef ? 'text-primary' : 'text-outline'}`} />
                <input
                  type="email" required value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  onFocus={() => setEf(true)} onBlur={() => setEf(false)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-4 bg-surface-container-highest/40 border border-outline-variant/20 rounded-xl text-on-surface placeholder:text-outline/60 text-sm focus:border-primary/50 transition-all"
                />
                {ef && <div className="absolute inset-0 rounded-xl ring-1 ring-primary/20 pointer-events-none" />}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between ml-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Password</label>
                <a href="#" className="text-xs font-semibold text-primary hover:text-primary-fixed transition-colors">Forgot?</a>
              </div>
              <div className={`relative transition-all ${pf ? 'scale-[1.01]' : ''}`}>
                <Lock size={15} className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${pf ? 'text-primary' : 'text-outline'}`} />
                <input
                  type={showPass ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  onFocus={() => setPf(true)} onBlur={() => setPf(false)}
                  placeholder="••••••••••"
                  className="w-full pl-11 pr-11 py-4 bg-surface-container-highest/40 border border-outline-variant/20 rounded-xl text-on-surface placeholder:text-outline/60 text-sm focus:border-primary/50 transition-all"
                />
                <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                {pf && <div className="absolute inset-0 rounded-xl ring-1 ring-primary/20 pointer-events-none" />}
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit" disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-primary to-primary-dim text-on-primary font-bold rounded-xl shadow-[0_10px_25px_rgba(100,94,251,0.3)] hover:shadow-[0_15px_35px_rgba(100,94,251,0.45)] hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading
                  ? <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                  : <><span>Sign in to Obsidian</span><ArrowRight size={16} /></>
                }
              </button>
            </div>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/15" /></div>
            <div className="relative flex justify-center"><span className="px-4 bg-transparent text-outline text-xs font-medium tracking-[0.2em] uppercase">or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Google', svg: <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg> },
              { label: 'Apple', svg: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-1.08 3.98-.7 1.5.32 2.66 1.32 3.08 2.74-2.42 1.14-2.14 4.43.22 5.52-.52 1.58-1.22 3.08-2.36 4.67zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg> },
            ].map(({ label, svg }) => (
              <button key={label} className="flex items-center justify-center gap-2.5 py-3 px-4 bg-surface-bright/20 border border-outline-variant/20 rounded-xl hover:bg-surface-bright/50 transition-all text-sm font-semibold">
                {svg}{label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-7 text-center text-on-surface-variant text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary hover:text-primary-fixed font-bold ml-1 transition-colors">Create account →</Link>
        </p>
      </main>
    </div>
  );
}
