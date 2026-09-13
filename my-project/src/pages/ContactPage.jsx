import React from "react";
import Breadcrumb from "../components/contact/Breadcrumb";
import ContactInfo from "../components/contact/ContactInfo";
import ContactForm from "../components/contact/ContactForm";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-[#F9FAF8] rounded-2xl p-5 md:p-10">
        <Breadcrumb />

        <div className="mt-8 flex flex-col lg:flex-row gap-10 lg:gap-16">
          <div className="flex-1">
            <ContactInfo />
          </div>

          <div className="flex-1 lg:max-w-md">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
