import React from "react";

const ProgressSteps = ({ currentStep }) => {
  const steps = [
    {
      number: 1,
      title: "Tell Us About You",
    },
    {
      number: 2,
      title: "Choose Your Plan",
    },
    {
      number: 3,
      title: "Welcome Aboard",
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-6 pt-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;

          return (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-500 ${
                    isCompleted || isActive
                      ? "bg-[#3F783D] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {isCompleted ? "✓" : step.number}
                </div>

                <span
                  className={`mt-2 text-xs font-semibold transition-colors duration-500 ${
                    isActive || isCompleted
                      ? "text-[#3F783D]"
                      : "text-[#111827]"
                  }`}
                >
                  {step.title}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-[2px] mx-4 transition-all duration-500 ${
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
