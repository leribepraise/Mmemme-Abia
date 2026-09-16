import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const aboutYouSchema = z.object({
  phone: z.string().min(10, "Please enter a valid phone number"),

  gender: z.string().min(1, "Please select your gender"),

  address: z.string().min(5, "Please enter your address"),
});

const AboutYou = ({ onNext, onBack }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(aboutYouSchema),
    defaultValues: {
      phone: "",
      gender: "",
      address: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Step 2 data:", data);

    onNext(data);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1B5E20]">Tell Us About You</h1>

        <p className="mt-2 text-gray-500">
          Help us personalize your Mmemme Abia experience.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">
            Phone Number
          </label>

          <input
            type="tel"
            placeholder="Enter your phone number"
            {...register("phone")}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#48782E]"
          />

          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">
            Gender
          </label>

          <select
            {...register("gender")}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#48782E]"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>

          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">
            Address
          </label>

          <textarea
            placeholder="Enter your address"
            {...register("address")}
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#48782E] resize-none"
          />

          {errors.address && (
            <p className="text-red-500 text-xs mt-1">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3 rounded-lg border border-[#3F783D] text-[#3F783D] font-semibold"
          >
            Back
          </button>

          <button
            type="submit"
            className="flex-1 py-3 rounded-lg bg-[#1B5E20] text-white font-semibold hover:bg-[#3d6626] transition"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default AboutYou;
