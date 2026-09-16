import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../../lib/api";
import { useAuth } from "../../context/AuthContext";
export default function SignUpForm() {
  const navigate=useNavigate();
  const { login }=useAuth();
  const [form,setForm]=useState({first_name:"",last_name:"",email:"",phone:"",password:""});
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  async function submit(event) {
    event.preventDefault();setError("");setBusy(true);
    try {
      await api("/auth/register/",{method:"POST",body:form});
      await login({email:form.email,password:form.password});
      setForm(current=>({...current,password:""}));
      navigate("/account");
    } catch(error) { setError(error.message); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="p-8 md:p-10 space-y-4">
    <h1 className="text-3xl font-bold">Create your account</h1>
    <p className="text-gray-600">Discover and book experiences across Abia.</p>
    {[["first_name","First name","text"],["last_name","Last name","text"],["email","Email","email"],["phone","Phone","tel"],["password","Password","password"]].map(([field,label,type])=><label key={field} className="block">{label}<input required type={type} autoComplete={field==="password"?"new-password":field==="email"?"email":undefined} className="mt-1 w-full rounded-lg border p-3" value={form[field]} onChange={e=>setForm({...form,[field]:e.target.value})}/></label>)}
    <p className="text-sm text-gray-600">Use a strong password with at least 8 characters. You’ll receive an email to verify your account.</p>
    {error&&<p role="alert" className="text-red-700">{error}</p>}
    <button disabled={busy} className="w-full rounded-lg bg-[#3F7D3D] px-5 py-3 font-semibold text-white disabled:opacity-50">{busy?"Creating account…":"Create account"}</button>
    <p>Already registered? <Link className="text-[#3F7D3D]" to="/login">Log in</Link></p>
  </form>;
}
