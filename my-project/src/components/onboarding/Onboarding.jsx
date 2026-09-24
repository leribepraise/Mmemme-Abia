import { useAuth } from "../context/AuthContext";
import GuestGuard from "../GuestGuard";
import React, { useState } from "react";
import ProgressSteps from "./ProgressSteps";
import CreateAccount from "./CreateAccount";
import AboutYou from "./AboutYou";
import ChoosePlan from "./ChoosePlan";
import Welcome from "./Welcome";

const Onboarding = () => {
  const [step, setStep] = useState(1);

  const { user: userData, updateUser } = useAuth();
  const nextStep = async (data = {}) => {
    await updateUser(data);
    setStep(value => value + 1);
  };

  const previousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  return (
    <GuestGuard><div className="min-h-screen bg-[#F8F9F7]">
      <ProgressSteps currentStep={step} />

      <div className="mt-10">
        {step === 1 && <CreateAccount onNext={nextStep} />}

        {step === 2 && <ChoosePlan onNext={nextStep} onBack={previousStep} />}

        {step === 3 && <Welcome userData={userData} />}
      </div>
    </div></GuestGuard>
  );
};

export default Onboarding;
