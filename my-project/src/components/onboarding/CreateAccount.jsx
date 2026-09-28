import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from '../context/AuthContext';
import toast from "react-hot-toast";
import {
  MapPin,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";

const createAccountSchema = z.object({
  phone: z.string().min(10, "Please enter a valid phone number"),



  lga: z.string().min(1, "Please select your Local Government Area"),

  address: z.string().min(5, "Please enter your home address"),



  gender: z.string().min(1, "Please select your gender"),

  interests: z.array(z.string()).max(20).default([]),
});

const CreateAccount = ({ onNext }) => {
  const {user} = useAuth();


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createAccountSchema),

    defaultValues: {
      phone: user?.phone || "",

      lga: user?.lga || "",
      address: user?.address || "",

      gender: user?.gender || "",
      interests: user?.interests || [],
    },
  });

  const selectedInterests = watch("interests") || [];
  const interests = ["Music", "Culture", "Food", "Travel", "Sports", "Technology", "Business", "Arts", "Community events"];

  const onSubmit = async (data) => {
    try {
      await onNext({ ...data, whatsapp:data.phone });
      toast.success("Your profile is ready.");
    } catch (error) { toast.error(error.message); }
  };

  const lgas = [
    "Aba North",
    "Aba South",
    "Arochukwu",
    "Bende",
    "Ikwuano",
    "Isiala Ngwa North",
    "Isiala Ngwa South",
    "Isuikwuato",
    "Obi Ngwa",
    "Ohafia",
    "Osisioma Ngwa",
    "Ugwunagbo",
    "Ukwa East",
    "Ukwa West",
    "Umuahia North",
    "Umuahia South",
    "Umunneochi",
  ];

  return (
    <div className="min-h-screen bg-[#F7F9F7] px-4 py-6 sm:px-6 lg:px-8">
      {/* MAIN CARD */}
      <div className="mx-auto w-full max-w-[1020px] rounded-2xl bg-white px-5 py-6 shadow-sm sm:px-8 sm:py-8 lg:px-6 lg:py-6">
        {/* HEADER */}
        <div className="mb-5">
          <h1 className="text-[24px] font-bold leading-tight text-[#172033] sm:text-xl">
            Tell Us About <span className="text-[#3F783D]">You</span>
          </h1>

          <p className="mt-1 text-[13px] text-[#3D3E3E] sm:text-xs">
            Help us personalize your experience by providing a few details.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
            {/* LEFT SIDE */}
            <div className="space-y-4">
              {/* PHONE + WHATSAPP */}
              <div className="grid grid-cols-1 gap-4 ">
                {/* PHONE */}
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#374151]">
                    Phone Number (WhatsApp)
                  </label>

                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    {...register("phone")}
                    className={`h-11 w-full rounded-md border bg-white px-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#48782E] ${
                      errors.phone ? "border-red-400" : "border-gray-200"
                    }`}
                  />

                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

              </div>

              {/* LGA */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#374151]">
                  Local Government Area
                </label>

                <div className="relative">
                  <select
                    {...register("lga")}
                    className={`h-11 w-full appearance-none rounded-md border bg-white px-3 pr-8 text-sm text-gray-500 outline-none focus:border-[#48782E] ${
                      errors.lga ? "border-red-400" : "border-gray-200"
                    }`}
                  >
                    <option value="">Select your LGA</option>

                    {lgas.map((lga) => (
                      <option key={lga} value={lga}>
                        {lga}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={11}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                </div>

                {errors.lga && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.lga.message}
                  </p>
                )}
              </div>

              {/* HOME ADDRESS */}
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#374151]">
                  Home Address
                </label>

                <div className="relative">
                  <MapPin
                    size={11}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    placeholder="Enter your full address"
                    {...register("address")}
                    className={`h-11 w-full rounded-md border bg-white pl-7 pr-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#48782E] ${
                      errors.address ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                </div>

                {errors.address && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* DOB + GENDER */}
              <div className="grid grid-cols-1 gap-4 ">
                {/* GENDER */}
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[#374151]">
                    Gender
                  </label>

                  <div className="relative">
                    <select
                      {...register("gender")}
                      className={`h-11 w-full appearance-none rounded-md border bg-white px-3 pr-8 text-sm text-gray-500 outline-none focus:border-[#48782E] ${
                        errors.gender ? "border-red-400" : "border-gray-200"
                      }`}
                    >
                      <option value="">Select gender</option>

                      <option value="male">Male</option>

                      <option value="female">Female</option>

                      <option value="other">Other</option>

                      <option value="prefer-not-to-say">
                        Prefer not to say
                      </option>
                    </select>

                    <ChevronDown
                      size={11}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                  </div>

                  {errors.gender && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              </div>

              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold text-[#374151]">Tell us about yourself — what interests you?</legend>
                <p className="text-xs text-gray-500">Select any that apply. This is optional.</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{interests.map(interest => <label key={interest} className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 p-3 text-sm">
                  <input type="checkbox" value={interest} {...register("interests")} className="h-4 w-4 accent-[#3F783D]"/>
                  {interest}
                </label>)}</div>
                {errors.interests && <p role="alert" className="text-xs text-red-500">{errors.interests.message}</p>}
              </fieldset>

              {/* CONTINUE BUTTON */}
              <button
                type="submit" disabled={isSubmitting}
                className="h-11 w-full cursor-pointer rounded-lg bg-[#F36B0A] text-sm font-semibold text-white transition hover:bg-[#df5f06] active:scale-[0.99]"
              >
                Continue →
              </button>
            </div>

            {/* RIGHT SIDE */}
            <div className="hidden space-y-3 lg:block">
              <section className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <h2 className="text-sm font-bold">Your interests</h2>
                <p className="mt-2 text-sm text-gray-600">{selectedInterests.length ? selectedInterests.join(', ') : 'Choose the topics you enjoy.'}</p>
              </section>
              {/* WHY WE COLLECT THIS INFO */}
              <div className="relative overflow-hidden rounded-xl bg-[#EEF6EF] px-3 py-3">
                <h3 className="text-xs font-bold text-gray-800">
                  Why we collect this info
                </h3>

                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2
                      size={9}
                      className="shrink-0 text-[#3F783D]"
                    />

                    <span className="text-xs text-gray-600">
                      Personalize your experience
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <CheckCircle2
                      size={9}
                      className="shrink-0 text-[#3F783D]"
                    />

                    <span className="text-xs text-gray-600">
                      Save the topics you enjoy
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <CheckCircle2
                      size={9}
                      className="shrink-0 text-[#3F783D]"
                    />

                    <span className="text-xs text-gray-600">
                      Keep your contact details up to date
                    </span>
                  </div>
                </div>

                {/* Decorative image placeholder */}
                <div className="absolute bottom-0 right-0 h-12 w-12 overflow-hidden opacity-60">
                  <img
                    src="/info-decoration.png"
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* BOTTOM IMAGE PLACEHOLDER */}
      <div className="mx-auto h-24 w-full max-w-[1100px] overflow-hidden">
        <img
          src="/onboarding-bottom.png"
          alt="Abia decorative illustration"
          className="h-full w-full object-cover object-top"
        />
      </div>
    </div>
  );
};

export default CreateAccount;
