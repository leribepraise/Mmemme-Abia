import Seo from "../components/seo/Seo";
import React, { useState } from "react";
import SignUpLogo from "../components/auth/register/SignUpLogo";
import SignUpHero from "../components/auth/register/SignUpHero";
import SignUpForm from "../components/auth/register/SignUpForm";


const SignUp = () => {
  const [challenge,setChallenge]=useState(false);
  return (
    <div className={challenge ? "" : "min-h-screen bg-[#F5F7F3] px-5 py-8 md:px-12"}>
      <Seo title="Sign Up" noIndex path="/SignUp" />
      {!challenge && <SignUpLogo />}

      <div className={challenge ? "" : "max-w-5xl mx-auto bg-white rounded-[28px] overflow-hidden shadow-sm border border-gray-100"}>
        <div className={challenge ? "" : "grid md:grid-cols-2"}>
          {!challenge && <SignUpHero />}
          <SignUpForm onChallenge={setChallenge} />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
