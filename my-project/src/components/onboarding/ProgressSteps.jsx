import React from "react";

const ProgressSteps = ({ currentStep }) => {
  const steps = [
    {
      number: 1,
      title: "Create Account",
    },
    {
      number: 2,
      title: "Tell Us About You",
    },
    {
      number: 3,
      title: "Choose Your Plan",
    },
    {
      number: 4,
      title: "Welcome Aboard",
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;

          return (
            <React.Fragment key={step.number}>
              {/* STEP ITEM */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-sm ${
                    isCompleted || isActive
                      ? "bg-[#3F783D] text-white ring-4 ring-emerald-50"
                      : "bg-gray-100 text-gray-400 border border-gray-200"
                  }`}
                >
                  {isCompleted ? "✓" : step.number}
                </div>

                <span
                  className={`mt-2 text-[11px] sm:text-xs font-bold transition-colors duration-300 text-center max-w-[80px] sm:max-w-[100px] leading-tight ${
                    isActive || isCompleted
                      ? "text-[#3F783D]"
                      : "text-gray-400"
                  }`}
                >
                  {step.title}
                </span>
              </div>

              {/* CONNECTOR LINE */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-[2px] mx-2 sm:mx-4 transition-all duration-300 ${
                    currentStep > step.number ? "bg-[#3F783D]" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSteps;