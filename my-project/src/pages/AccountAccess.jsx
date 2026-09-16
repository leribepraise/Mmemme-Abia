import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../components/context/AuthContext";
export default function AccountAccess({ verify=false }) {
  const [params]=useSearchParams();
  const { reloadUser, isLoggedIn }=useAuth();
  const [value,setValue]=useState("");
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const confirm=params.has("token");
  async function submit(event) {
    event.preventDefault();setBusy(true);setError("");
    try {
      const path=verify?"/auth/verify-email/":confirm?"/auth/password-reset/confirm/":"/auth/password-reset/";
      const body=verify?{token:params.get("token")}:confirm?{user:params.get("user"),token:params.get("token"),password:value}:{email:value};
      const result=await api(path,{method:"POST",body});
      setMessage(result.detail);setValue("");
      if(verify&&isLoggedIn) await reloadUser();
    }catch(error){setError(error.message);}finally{setBusy(false);}
  }
  return <main className="mx-auto max-w-lg p-8"><form onSubmit={submit} className="space-y-5 rounded-2xl border bg-white p-8">
    <h1 className="text-2xl font-bold">{verify?"Verify your email":confirm?"Choose a new password":"Reset your password"}</h1>
    {!verify&&<label className="block">{confirm?"New password":"Email"}<input required className="mt-2 w-full rounded-lg border p-3" type={confirm?"password":"email"} value={value} onChange={e=>setValue(e.target.value)} autoComplete={confirm?"new-password":"email"}/></label>}
    {error&&<p role="alert" className="text-red-700">{error}</p>}
    {message&&<p role="status" className="text-green-700">{message}</p>}
    {!message&&<button disabled={busy} className="rounded-lg bg-[#3F7D3D] px-5 py-3 text-white">{busy?"Please wait…":verify?"Verify email":confirm?"Reset password":"Send reset link"}</button>}
    <p><Link to="/login" className="text-[#3F7D3D]">Back to login</Link></p>
  </form></main>;
}
