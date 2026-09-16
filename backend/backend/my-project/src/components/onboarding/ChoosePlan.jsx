import React from "react";
import { useForm } from "react-hook-form";
import {
  CheckCircle2,
  ShieldCheck,
  LockKeyhole,
  Star,
  Gem,
  ArrowLeft,
} from "lucide-react";

const ChoosePlan = ({ onNext, onBack }) => {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      plan: "silver",
    },
  });

  const selectedPlan = watch("plan");

  const plans = [
    {
      id: "bronze",
      name: "Bronze",
      price: "Free",
      period: "",
      description: "Perfect for getting started.",
      color: "orange",
      icon: Star,
      features: [
        "Access to free events",
        "Browse top destinations",
        "Basic event booking",
        "Save favorite places",
        "Community access",
      ],
    },

    {
      id: "silver",
      name: "Silver",
      price: "₦2,000",
      period: "/ month",
      description: "More access, more experiences.",
      color: "green",
      popular: true,
      features: [
        "Everything in Bronze",
        "Priority event booking",
        "Exclusive discounts (up to 15%)",
        "Early access to new events",
        "Save more favorites",
        "Ad-free experience",
      ],
    },

    {
      id: "diamond",
      name: "Diamond",
      price: "₦5,000",
      period: "/ month",
      description: "The ultimate Abia experience.",
      color: "blue",
      features: [
        "Everything in Silver",
        "VIP event access",
        "Exclusive discounts (up to 30%)",
        "Personalized recommendations",
        "Concierge support",
        "Special invites to VIP events",
      ],
    },
  ];

  const onSubmit = (data) => {
    console.log("Selected plan:", data);

    onNext(data);
  };

  return (
    <div className="min-h-screen bg-[#F7F9F7] px-4 py-5 sm:px-6 lg:px-8">
      {/* MAIN CONTENT */}
      <div className="mx-auto w-full max-w-[1020px]">
        {/* HEADER */}
        <div className="mb-5">
          <h1 className="text-[18px] font-bold text-[#172033] sm:text-xl">
            Choose Your Plan
          </h1>

          <p className="mt-1 text-[9px] text-gray-500 sm:text-[10px]">
            Unlock more features and enjoy the best of Abia with our flexible
            plans.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* PLANS */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id;

              const Icon = plan.icon || Gem;

              return (
                <label
                  key={plan.id}
                  className={`relative block cursor-pointer rounded-xl bg-white px-3 py-4 transition-all duration-200 ${
                    isSelected
                      ? "border-2 border-[#3F783D] shadow-md"
                      : "border border-gray-200"
                  }`}
                >
                  {/* POPULAR BADGE */}
                  {plan.popular && (
                    <div className="absolute -top-[9px] left-1/2 -translate-x-1/2 rounded-full bg-[#3F783D] px-3 py-[3px]">
                      <span className="text-[6px] font-bold tracking-[0.5px] text-white">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  {/* RADIO INPUT */}
                  <input
                    type="radio"
                    value={plan.id}
                    {...register("plan")}
                    className="sr-only"
                  />

                  {/* PLAN NAME */}
                  <div className="mt-1">
                    <p
                      className={`text-[9px] font-bold ${
                        plan.color === "orange"
                          ? "text-[#E86618]"
                          : plan.color === "green"
                            ? "text-[#66727D]"
                            : "text-[#4285E8]"
                      }`}
                    >
                      {plan.name}
                    </p>

                    {/* PRICE */}
                    <div className="mt-1 flex items-end gap-1">
                      <span className="text-[15px] font-bold text-[#172033]">
                        {plan.price}
                      </span>

                      {plan.period && (
                        <span className="mb-[1px] text-[7px] text-gray-400">
                          {plan.period}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-[7px] text-gray-400">
                      {plan.description}
                    </p>
                  </div>

                  {/* PLAN ICON */}
                  <div className="my-3 flex justify-center">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full ${
                        plan.color === "orange"
                          ? "bg-[#FFF0E8]"
                          : plan.color === "green"
                            ? "bg-[#EEF2F4]"
                            : "bg-[#EAF3FF]"
                      }`}
                    >
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full ${
                          plan.color === "orange"
                            ? "bg-[#D96B2A]"
                            : plan.color === "green"
                              ? "bg-[#B7BDC2]"
                              : "bg-[#D9ECFF]"
                        }`}
                      >
                        <Icon
                          size={14}
                          className={
                            plan.color === "orange"
                              ? "text-white"
                              : plan.color === "green"
                                ? "text-white"
                                : "text-[#4285E8]"
                          }
                          fill={
                            plan.color === "orange" || plan.color === "green"
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* FEATURES */}
                  <div className="space-y-2">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-1.5">
                        <CheckCircle2
                          size={8}
                          className={`mt-[1px] shrink-0 ${
                            plan.color === "orange"
                              ? "text-[#E86618]"
                              : plan.color === "green"
                                ? "text-[#3F783D]"
                                : "text-[#4285E8]"
                          }`}
                          fill="currentColor"
                          strokeWidth={1.5}
                        />

                        <span className="text-[7px] leading-3 text-gray-600">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* PLAN BUTTON */}
                  <div className="mt-4">
                    {plan.id === "bronze" ? (
                      <div className="flex h-6 items-center justify-center rounded-md bg-[#FCEDE5]">
                        <span className="text-[7px] font-semibold text-[#E86618]">
                          Current Plan
                        </span>
                      </div>
                    ) : (
                      <div
                        className={`flex h-6 items-center justify-center rounded-md ${
                          plan.id === "silver" ? "bg-[#3F783D]" : "bg-[#4285E8]"
                        }`}
                      >
                        <span className="text-[7px] font-semibold text-white">
                          Choose {plan.name} Plan
                        </span>
                      </div>
                    )}
                  </div>
                </label>
              );
            })}
          </div>

          {/* CANCEL ANYTIME */}
          <div className="mt-4 flex min-h-[25px] items-center gap-2 rounded-lg bg-white px-3 py-2">
            <ShieldCheck size={11} className="shrink-0 text-[#3F783D]" />

            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[7px] font-semibold text-[#172033]">
                Cancel anytime
              </span>

              <span className="text-[7px] text-gray-400">
                You can upgrade, downgrade or cancel your plan at any time.
              </span>
            </div>
          </div>

          {/* SECURE PAYMENT */}
          <div className="mt-2 flex min-h-[28px] items-center justify-between rounded-lg bg-white px-3 py-2">
            <div className="flex items-center gap-2">
              <LockKeyhole size={10} className="text-gray-400" />

              <span className="text-[7px] font-semibold text-[#172033]">
                Secure payments
              </span>

              <span className="hidden text-[7px] text-gray-400 sm:inline">
                powered by trusted partners.
              </span>
            </div>

            {/* PAYMENT METHODS */}
            <div className="flex items-center gap-2">
              <span className="text-[7px] font-bold text-[#243B80]">VISA</span>

              <span className="text-[7px] font-bold text-[#E21B2D]">●</span>

              <span className="text-[7px] font-bold text-[#EF4B23]">Verve</span>

              <span className="text-[7px] font-bold text-[#2D9CDB]">
                Paystack
              </span>

              <span className="text-[7px] font-bold text-black"> Pay</span>
            </div>
          </div>

          {/* NAVIGATION BUTTONS */}
          <div className="mt-5 flex justify-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="flex h-7 items-center gap-1 rounded-md border border-gray-300 bg-white px-4 text-[7px] font-medium text-gray-600 transition hover:bg-gray-50"
            >
              <ArrowLeft size={8} />
              Back
            </button>

            <button
              type="submit"
              className="h-7 rounded-md bg-[#F36B0A] px-4 text-[7px] font-semibold text-white transition hover:bg-[#DF5F06] active:scale-[0.98]"
            >
              Continue →
            </button>
          </div>
        </form>

        {/* BOTTOM IMAGE */}
        <div className="mt-1 h-24 w-full overflow-hidden">
          <img
            src="/onboarding-bottom.png"
            alt="Abia decorative illustration"
            className="h-full w-full object-cover object-top"
          />
        </div>
      </div>
    </div>
  );
};

export default ChoosePlan;
