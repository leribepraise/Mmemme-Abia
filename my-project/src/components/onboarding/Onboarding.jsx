import React, { useState } from "react";
import ProgressSteps from "./ProgressSteps";
import CreateAccount from "./CreateAccount";
import AboutYou from "./AboutYou";
import ChoosePlan from "./ChoosePlan";
import Welcome from "./Welcome";

const Onboarding = () => {
  const [step, setStep] = useState(1);

  const [userData, setUserData] = useState(() => {
    const savedData = sessionStorage.getItem("signupData");

    return savedData
      ? JSON.parse(savedData)
      : {
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          terms: false,
        };
  });

  const updateUserData = (data) => {
    setUserData((prevData) => {
      const updatedData = {
        ...prevData,
        ...data,
      };

      sessionStorage.setItem("signupData", JSON.stringify(updatedData));

      return updatedData;
    });
  };

  const nextStep = (data = {}) => {
    updateUserData(data);

    setStep((prevStep) => prevStep + 1);
  };

  const previousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  return (
    <div className="min-h-screen bg-[#F8F9F7]">
      <ProgressSteps currentStep={step} />

      <div className="mt-10">
        {step === 1 && <CreateAccount onNext={nextStep} />}

        {step === 2 && <ChoosePlan onNext={nextStep} onBack={previousStep} />}

        {step === 3 && <Welcome userData={userData} />}
      </div>
    </div>
  );
};

export default Onboarding;
