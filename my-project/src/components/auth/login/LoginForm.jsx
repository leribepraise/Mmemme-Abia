import { useState } from "react";
import { Link } from "react-router-dom";
export default function LoginForm({ onLogin }) {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  async function submit(event) {
    event.preventDefault();setError("");setBusy(true);
    try { await onLogin({email,password}); }
    catch(error) { setError(error.message); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="p-8 md:p-12 space-y-5">
    <h1 className="text-3xl font-bold">Welcome back</h1>
    <label className="block">Email<input className="mt-2 w-full rounded-lg border p-3" type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/></label>
    <label className="block">Password<input className="mt-2 w-full rounded-lg border p-3" type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}/></label>
    {error&&<p role="alert" className="text-red-700">{error}</p>}
    <button disabled={busy} className="w-full rounded-lg bg-[#3F7D3D] px-5 py-3 font-semibold text-white disabled:opacity-50">{busy?"Logging in…":"Log in"}</button>
    <div className="flex justify-between"><Link className="text-[#3F7D3D]" to="/reset-password">Forgot password?</Link><Link className="text-[#3F7D3D]" to="/Signup">Create account</Link></div>
  </form>;
}
