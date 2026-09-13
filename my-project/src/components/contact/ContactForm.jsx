import React from "react";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "./validation/schemas/contactSchema";

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm({ resolver: zodResolver(contactSchema) });

  const onSubmit = (data) => {
    console.log("Contact form data:", data);

    // placeholder — real send logic (EmailJS/backend) goes here later
    reset();
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">
            Full Name
          </label>
          <input
            type="text"
            {...register("fullName")}
            placeholder="Enter your full name"
            className={`w-full border rounded-lg px-4 py-3 text-sm outline-none focus:border-[#3F783D] ${
              errors.fullName ? "border-red-400" : "border-gray-200"
            }`}
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">
            Email Address
          </label>
          <input
            type="email"
            {...register("email")}
            placeholder="Enter your email"
            className={`w-full border rounded-lg px-4 py-3 text-sm outline-none focus:border-[#3F783D] ${
              errors.email ? "border-red-400" : "border-gray-200"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">
            Subject
          </label>
          <input
            type="text"
            {...register("subject")}
            placeholder="What is this regarding?"
            className={`w-full border rounded-lg px-4 py-3 text-sm outline-none focus:border-[#3F783D] ${
              errors.subject ? "border-red-400" : "border-gray-200"
            }`}
          />
          {errors.subject && (
            <p className="text-red-500 text-xs mt-1">
              {errors.subject.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#374151] mb-2">
            Message
          </label>
          <textarea
            rows={5}
            {...register("message")}
            placeholder="Type your message here..."
            className={`w-full border rounded-lg px-4 py-3 text-sm outline-none resize-none focus:border-[#3F783D] ${
              errors.message ? "border-red-400" : "border-gray-200"
            }`}
          />
          {errors.message && (
            <p className="text-red-500 text-xs mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#3F783D] hover:bg-[#356433] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
        >
          Send Message
          <Send className="w-4 h-4" />
        </button>

        {isSubmitSuccessful && (
          <p className="text-center text-sm text-green-700 font-medium">
            Message sent successfully!
          </p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
