import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import GuestGuard from '../GuestGuard';
import { api } from '@/lib/api';
import ProgressSteps from './ProgressSteps';
import CreateAccount from './CreateAccount';
import Welcome from './Welcome';
export default function Onboarding(){
  const {user,updateUser,reloadUser}=useAuth();
  const [step,setStep]=useState(1);
  const complete=async data=>{await updateUser(data);await api('/auth/onboarding/complete/',{method:'POST'});await reloadUser();setStep(2);};
  const current=user?.onboarding_completed_at?2:step;
  return <GuestGuard><div className="min-h-screen bg-[#f7f9f7]"><ProgressSteps currentStep={current}/><div className="mt-8">{current===1?<CreateAccount onNext={complete}/>:<Welcome userData={user}/>}</div></div></GuestGuard>;
}
