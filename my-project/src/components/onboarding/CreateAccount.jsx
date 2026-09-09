import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Upload,
  MapPin,
  CalendarDays,
  ChevronDown,
  CheckCircle2,
  UserRound,
} from "lucide-react";

const createAccountSchema = z.object({
  phone: z.string().min(10, "Please enter a valid phone number"),

  whatsapp: z.string().min(10, "Please enter a valid WhatsApp number"),

  lga: z.string().min(1, "Please select your Local Government Area"),

  address: z.string().min(5, "Please enter your home address"),

  dateOfBirth: z.string().min(1, "Please select your date of birth"),

  gender: z.string().min(1, "Please select your gender"),

  bio: z.string().max(120, "Bio must not exceed 120 characters").optional(),
});

const CreateAccount = ({ onNext }) => {
  const [profilePreview, setProfilePreview] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createAccountSchema),

    defaultValues: {
      phone: "",
      whatsapp: "",
      lga: "",
      address: "",
      dateOfBirth: "",
      gender: "",
      bio: "",
    },
  });

  const bioValue = watch("bio") || "";

  const handleProfilePicture = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfilePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const onSubmit = (data) => {
    console.log("Create Account data:", data);

    onNext({
      ...data,
      profilePicture: profilePreview,
    });
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_188px]">
            {/* LEFT SIDE */}
            <div className="space-y-4">
              {/* PHONE + WHATSAPP */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* PHONE */}
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-[#374151]">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    {...register("phone")}
                    className={`h-8 w-full rounded-md border bg-white px-3 text-[9px] text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#48782E] ${
                      errors.phone ? "border-red-400" : "border-gray-200"
                    }`}
                  />

                  {errors.phone && (
                    <p className="mt-1 text-[8px] text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* WHATSAPP */}
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-[#374151]">
                    WhatsApp Number
                  </label>

                  <input
                    type="tel"
                    placeholder="Enter your WhatsApp number"
                    {...register("whatsapp")}
                    className={`h-8 w-full rounded-md border bg-white px-3 text-[9px] text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#48782E] ${
                      errors.whatsapp ? "border-red-400" : "border-gray-200"
                    }`}
                  />

                  {errors.whatsapp && (
                    <p className="mt-1 text-[8px] text-red-500">
                      {errors.whatsapp.message}
                    </p>
                  )}
                </div>
              </div>

              {/* LGA */}
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-[#374151]">
                  Local Government Area
                </label>

                <div className="relative">
                  <select
                    {...register("lga")}
                    className={`h-8 w-full appearance-none rounded-md border bg-white px-3 pr-8 text-[9px] text-gray-500 outline-none focus:border-[#48782E] ${
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
                  <p className="mt-1 text-[8px] text-red-500">
                    {errors.lga.message}
                  </p>
                )}
              </div>

              {/* HOME ADDRESS */}
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-[#374151]">
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
                    className={`h-8 w-full rounded-md border bg-white pl-7 pr-3 text-[9px] text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#48782E] ${
                      errors.address ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                </div>

                {errors.address && (
                  <p className="mt-1 text-[8px] text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* DOB + GENDER */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* DATE OF BIRTH */}
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-[#374151]">
                    Date of Birth
                  </label>

                  <div className="relative">
                    <input
                      type="date"
                      {...register("dateOfBirth")}
                      className={`h-8 w-full rounded-md border bg-white px-3 text-[9px] text-gray-500 outline-none focus:border-[#48782E] ${
                        errors.dateOfBirth
                          ? "border-red-400"
                          : "border-gray-200"
                      }`}
                    />

                    <CalendarDays
                      size={11}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>

                  {errors.dateOfBirth && (
                    <p className="mt-1 text-[8px] text-red-500">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>

                {/* GENDER */}
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-[#374151]">
                    Gender
                  </label>

                  <div className="relative">
                    <select
                      {...register("gender")}
                      className={`h-8 w-full appearance-none rounded-md border bg-white px-3 pr-8 text-[9px] text-gray-500 outline-none focus:border-[#48782E] ${
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
                    <p className="mt-1 text-[8px] text-red-500">
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              </div>

              {/* PROFILE PICTURE */}
              <div>
                <label className="mb-1 block text-[9px] font-medium text-[#374151]">
                  Profile Picture
                </label>

                <label
                  htmlFor="profile-picture"
                  className="flex h-[46px] cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 px-3 transition hover:border-[#3F783D] hover:bg-[#F8FBF8]"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
                    {profilePreview ? (
                      <img
                        src={profilePreview}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Upload size={13} className="text-gray-500" />
                    )}
                  </div>

                  <div>
                    <p className="text-[9px] font-semibold text-gray-700">
                      Upload a clear profile photo
                    </p>

                    <p className="text-[8px] text-gray-400">
                      JPG, PNG up to 5MB
                    </p>
                  </div>
                </label>

                <input
                  id="profile-picture"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleProfilePicture}
                  className="hidden"
                />
              </div>

              {/* BIO */}
              <div>
                <label className="mb-1 block text-[9px] font-medium text-[#374151]">
                  Tell us a bit about yourself (optional)
                </label>

                <div className="relative">
                  <textarea
                    {...register("bio")}
                    maxLength={120}
                    rows={2}
                    placeholder="E.g. I love exploring new places, food and culture..."
                    className="h-9 w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-[9px] text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#48782E]"
                  />

                  <span className="absolute bottom-1 right-2 text-[7px] text-gray-400">
                    {bioValue.length}/120
                  </span>
                </div>

                {errors.bio && (
                  <p className="mt-1 text-[8px] text-red-500">
                    {errors.bio.message}
                  </p>
                )}
              </div>

              {/* CONTINUE BUTTON */}
              <button
                type="submit"
                className="h-8 w-full cursor-pointer rounded-lg bg-[#F36B0A] text-[9px] font-semibold text-white transition hover:bg-[#df5f06] active:scale-[0.99]"
              >
                Continue →
              </button>
            </div>

            {/* RIGHT SIDE */}
            <div className="hidden space-y-3 lg:block">
              {/* PROFILE PREVIEW */}
              <div className="rounded-xl border border-gray-100 bg-white px-3 py-4 shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound size={25} className="text-gray-400" />
                  )}
                </div>

                <h3 className="mt-2 text-center text-[9px] font-bold text-gray-800">
                  Profile Preview
                </h3>

                <p className="mx-auto mt-1 max-w-[130px] text-center text-[7px] leading-3 text-gray-500">
                  This is how you'll appear to other Mmemme Abia users.
                </p>
              </div>

              {/* WHY WE COLLECT THIS INFO */}
              <div className="relative overflow-hidden rounded-xl bg-[#EEF6EF] px-3 py-3">
                <h3 className="text-[8px] font-bold text-gray-800">
                  Why we collect this info
                </h3>

                <div className="mt-2 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2
                      size={9}
                      className="shrink-0 text-[#3F783D]"
                    />

                    <span className="text-[7px] text-gray-600">
                      Personalize your experience
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <CheckCircle2
                      size={9}
                      className="shrink-0 text-[#3F783D]"
                    />

                    <span className="text-[7px] text-gray-600">
                      Improve event recommendations
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <CheckCircle2
                      size={9}
                      className="shrink-0 text-[#3F783D]"
                    />

                    <span className="text-[7px] text-gray-600">
                      Secure your account
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
