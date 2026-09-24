import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
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
    const planNames = {
      bronze: "Bronze",
      silver: "Silver",
      diamond: "Diamond",
    };

    onNext(data);
    toast.success(`${planNames[data.plan]} plan selected!`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-10">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#1B5E20]">
          Choose Your Plan
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Unlock more features and enjoy the best of Abia with our flexible
          plans.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* PLANS */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const Icon = plan.icon || Gem;

            return (
              <label
                key={plan.id}
                className={`relative flex flex-col justify-between cursor-pointer rounded-2xl bg-white p-6 transition-all duration-200 shadow-sm ${
                  isSelected
                    ? "border-2 border-[#3F783D] shadow-md ring-1 ring-[#3F783D]/20"
                    : "border border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* POPULAR BADGE */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#3F783D] px-3.5 py-1 shadow-sm">
                    <span className="text-[10px] font-extrabold tracking-wider text-white">
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

                <div>
                  {/* PLAN NAME */}
                  <div>
                    <p
                      className={`text-xs font-bold uppercase tracking-wider ${
                        plan.color === "orange"
                          ? "text-[#E86618]"
                          : plan.color === "green"
                            ? "text-[#3F783D]"
                            : "text-[#4285E8]"
                      }`}
                    >
                      {plan.name}
                    </p>

                    {/* PRICE */}
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-[#172033]">
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-xs font-medium text-gray-400">
                          {plan.period}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-gray-500">
                      {plan.description}
                    </p>
                  </div>

                  {/* PLAN ICON */}
                  <div className="my-5 flex justify-center">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${
                        plan.color === "orange"
                          ? "bg-[#FFF0E8]"
                          : plan.color === "green"
                            ? "bg-[#EAF5EA]"
                            : "bg-[#EAF3FF]"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          plan.color === "orange"
                            ? "bg-[#D96B2A]"
                            : plan.color === "green"
                              ? "bg-[#3F783D]"
                              : "bg-[#4285E8]"
                        }`}
                      >
                        <Icon
                          size={16}
                          className="text-white"
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
                  <div className="space-y-3 pt-2 border-t border-gray-100">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2.5">
                        <CheckCircle2
                          size={16}
                          className={`mt-0.5 shrink-0 ${
                            plan.color === "orange"
                              ? "text-[#E86618]"
                              : plan.color === "green"
                                ? "text-[#3F783D]"
                                : "text-[#4285E8]"
                          }`}
                          fill="currentColor"
                          strokeWidth={1.5}
                        />
                        <span className="text-xs text-gray-600 font-medium leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PLAN BUTTON */}
                <div className="mt-6 pt-4">
                  {plan.id === "bronze" ? (
                    <div className="flex h-11 items-center justify-center rounded-xl bg-[#FCEDE5]">
                      <span className="text-xs font-bold text-[#E86618]">
                        Current Plan
                      </span>
                    </div>
                  ) : (
                    <div
                      className={`flex h-11 items-center justify-center rounded-xl font-bold text-xs shadow-sm transition-colors ${
                        plan.id === "silver"
                          ? "bg-[#3F783D] text-white"
                          : "bg-[#4285E8] text-white"
                      }`}
                    >
                      Choose {plan.name} Plan
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>

        {/* CANCEL ANYTIME */}
        <div className="mt-6 flex items-center gap-3 rounded-xl bg-white p-4 border border-gray-200 shadow-sm">
          <ShieldCheck size={20} className="shrink-0 text-[#3F783D]" />
          <div>
            <span className="text-xs font-bold text-[#172033]">
              Cancel anytime —{" "}
            </span>
            <span className="text-xs text-gray-500">
              You can upgrade, downgrade, or cancel your plan at any time.
            </span>
          </div>
        </div>

        {/* SECURE PAYMENT */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2.5">
            <LockKeyhole size={16} className="text-gray-400" />
            <span className="text-xs font-bold text-[#172033]">
              Secure payments
            </span>
            <span className="text-xs text-gray-400 hidden sm:inline">
              powered by trusted partners.
            </span>
          </div>

          {/* PAYMENT METHODS */}
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className="text-[#243B80]">VISA</span>
            <span className="text-[#E21B2D]">●</span>
            <span className="text-[#EF4B23]">Verve</span>
            <span className="text-[#2D9CDB]">Paystack</span>
            <span className="text-black"> Pay</span>
          </div>
        </div>

        {/* NAVIGATION BUTTONS */}
        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border border-[#3F783D] text-[#3F783D] font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            type="submit"
            className="flex-1 py-3.5 rounded-xl bg-[#F36B0A] text-white font-bold text-sm hover:bg-[#DF5F06] transition-colors shadow-sm"
          >
            Continue &rarr;
          </button>
        </div>
      </form>

      {/* BOTTOM IMAGE */}
      <div className="mt-8 h-32 w-full overflow-hidden rounded-2xl shadow-sm">
        <img
          src="/onboarding-bottom.png"
          alt="Abia decorative illustration"
          className="h-full w-full object-cover object-top"
        />
      </div>
    </div>
  );
};

export default ChoosePlan;
