import React from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "./validation/schemas/contactSchema";

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    console.log("Contact form data:", data);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    reset();
  };

  return (
    <div className="w-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Full Name */}
        <div>
          <label className="mb-2 block text-sm font-extrabold text-gray-900 md:text-base">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("fullName")}
            placeholder="Enter your full name"
            className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 md:text-base ${
              errors.fullName
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:border-[#265F27] focus:ring-[#265F27]/20"
            }`}
          />
          {errors.fullName && (
            <p className="mt-1.5 text-xs font-bold text-red-500">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="mb-2 block text-sm font-extrabold text-gray-900 md:text-base">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            {...register("email")}
            placeholder="Enter your email"
            className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 md:text-base ${
              errors.email
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:border-[#265F27] focus:ring-[#265F27]/20"
            }`}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs font-bold text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label className="mb-2 block text-sm font-extrabold text-gray-900 md:text-base">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("subject")}
            placeholder="What is this regarding?"
            className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 md:text-base ${
              errors.subject
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:border-[#265F27] focus:ring-[#265F27]/20"
            }`}
          />
          {errors.subject && (
            <p className="mt-1.5 text-xs font-bold text-red-500">
              {errors.subject.message}
            </p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="mb-2 block text-sm font-extrabold text-gray-900 md:text-base">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            {...register("message")}
            placeholder="Type your message here..."
            className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold text-gray-900 placeholder-gray-400 transition focus:outline-none focus:ring-2 md:text-base ${
              errors.message
                ? "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:border-[#265F27] focus:ring-[#265F27]/20"
            }`}
          />
          {errors.message && (
            <p className="mt-1.5 text-xs font-bold text-red-500">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#265F27] py-4 text-sm font-extrabold text-white shadow-md transition hover:bg-[#1e4b1f] disabled:cursor-not-allowed disabled:opacity-70 md:text-base"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>Send Message</span>
              <Send className="h-4 w-4" />
            </>
          )}
        </button>

        {/* Success Feedback Banner */}
        {isSubmitSuccessful && (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-green-50 p-4 text-sm font-extrabold text-[#265F27]">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>Message sent successfully! We'll get back to you soon.</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactForm;