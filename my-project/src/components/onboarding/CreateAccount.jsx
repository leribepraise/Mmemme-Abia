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
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:px-6">
      {/* MAIN CARD */}
      <div className="rounded-3xl bg-white px-6 py-8 sm:px-10 sm:py-10 shadow-sm border border-gray-100">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold leading-tight text-[#172033]">
            Tell Us About <span className="text-[#3F783D]">You</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Help us personalize your experience by providing a few details.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_260px]">
            {/* LEFT SIDE */}
            <div className="space-y-5">
              {/* PHONE + WHATSAPP */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* PHONE */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#374151]">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    {...register("phone")}
                    className={`h-11 w-full rounded-xl border bg-white px-4 text-xs text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#48782E] shadow-sm ${
                      errors.phone ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500 font-medium">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* WHATSAPP */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#374151]">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter your WhatsApp number"
                    {...register("whatsapp")}
                    className={`h-11 w-full rounded-xl border bg-white px-4 text-xs text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#48782E] shadow-sm ${
                      errors.whatsapp ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                  {errors.whatsapp && (
                    <p className="mt-1 text-xs text-red-500 font-medium">
                      {errors.whatsapp.message}
                    </p>
                  )}
                </div>
              </div>

              {/* LGA */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#374151]">
                  Local Government Area
                </label>
                <div className="relative">
                  <select
                    {...register("lga")}
                    className={`h-11 w-full appearance-none rounded-xl border bg-white px-4 pr-10 text-xs text-gray-700 outline-none focus:border-[#48782E] shadow-sm ${
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
                    size={16}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                </div>
                {errors.lga && (
                  <p className="mt-1 text-xs text-red-500 font-medium">
                    {errors.lga.message}
                  </p>
                )}
              </div>

              {/* HOME ADDRESS */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#374151]">
                  Home Address
                </label>
                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Enter your full address"
                    {...register("address")}
                    className={`h-11 w-full rounded-xl border bg-white pl-11 pr-4 text-xs text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#48782E] shadow-sm ${
                      errors.address ? "border-red-400" : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-xs text-red-500 font-medium">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* DOB + GENDER */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* DATE OF BIRTH */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#374151]">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      {...register("dateOfBirth")}
                      className={`h-11 w-full rounded-xl border bg-white px-4 text-xs text-gray-700 outline-none focus:border-[#48782E] shadow-sm ${
                        errors.dateOfBirth
                          ? "border-red-400"
                          : "border-gray-200"
                      }`}
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-xs text-red-500 font-medium">
                      {errors.dateOfBirth.message}
                    </p>
                  )}
                </div>

                {/* GENDER */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-[#374151]">
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      {...register("gender")}
                      className={`h-11 w-full appearance-none rounded-xl border bg-white px-4 pr-10 text-xs text-gray-700 outline-none focus:border-[#48782E] shadow-sm ${
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
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                  </div>
                  {errors.gender && (
                    <p className="mt-1 text-xs text-red-500 font-medium">
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              </div>

              {/* PROFILE PICTURE */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-[#374151]">
                  Profile Picture
                </label>
                <label
                  htmlFor="profile-picture"
                  className="flex h-20 cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-gray-300 px-4 transition hover:border-[#3F783D] hover:bg-[#F8FBF8]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 shadow-sm border border-gray-200">
                    {profilePreview ? (
                      <img
                        src={profilePreview}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Upload size={20} className="text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">
                      Upload a clear profile photo
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
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
                <label className="mb-1.5 block text-xs font-bold text-[#374151]">
                  Tell us a bit about yourself (optional)
                </label>
                <div className="relative">
                  <textarea
                    {...register("bio")}
                    maxLength={120}
                    rows={3}
                    placeholder="E.g. I love exploring new places, food and culture..."
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white p-3.5 text-xs text-gray-700 outline-none placeholder:text-gray-400 focus:border-[#48782E] shadow-sm"
                  />
                  <span className="absolute bottom-2.5 right-3 text-[10px] text-gray-400 font-medium">
                    {bioValue.length}/120
                  </span>
                </div>
                {errors.bio && (
                  <p className="mt-1 text-xs text-red-500 font-medium">
                    {errors.bio.message}
                  </p>
                )}
              </div>

              {/* CONTINUE BUTTON */}
              <button
                type="submit"
                className="h-12 w-full cursor-pointer rounded-xl bg-[#F36B0A] text-sm font-bold text-white transition hover:bg-[#df5f06] active:scale-[0.99] shadow-sm mt-4"
              >
                Continue &rarr;
              </button>
            </div>

            {/* RIGHT SIDE */}
            <div className="hidden space-y-5 lg:block">
              {/* PROFILE PREVIEW */}
              <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5 text-center shadow-sm">
                <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-sm">
                  {profilePreview ? (
                    <img
                      src={profilePreview}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserRound size={36} className="text-gray-400" />
                  )}
                </div>
                <h3 className="mt-3 text-xs font-bold text-gray-800">
                  Profile Preview
                </h3>
                <p className="mx-auto mt-1 max-w-[180px] text-xs leading-relaxed text-gray-500">
                  This is how you'll appear to other Mmemme Abia users.
                </p>
              </div>

              {/* WHY WE COLLECT THIS INFO */}
              <div className="relative overflow-hidden rounded-2xl bg-[#EEF6EF] p-5 border border-emerald-100 shadow-sm">
                <h3 className="text-xs font-bold text-gray-800">
                  Why we collect this info
                </h3>
                <div className="mt-3 space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2
                      size={16}
                      className="shrink-0 text-[#3F783D]"
                    />
                    <span className="text-xs text-gray-600 font-medium">
                      Personalize your experience
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2
                      size={16}
                      className="shrink-0 text-[#3F783D]"
                    />
                    <span className="text-xs text-gray-600 font-medium">
                      Improve event recommendations
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2
                      size={16}
                      className="shrink-0 text-[#3F783D]"
                    />
                    <span className="text-xs text-gray-600 font-medium">
                      Secure your account
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* BOTTOM IMAGE PLACEHOLDER */}
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

export default CreateAccount;