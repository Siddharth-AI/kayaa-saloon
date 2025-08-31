import React from "react";
import ContactForm from "@/components/contactus/user-contact/ContactForm";
import ContactSection from "@/components/contactus/contactwhitecard/ContactSection";
import StaticMapHero from "@/components/contactus/contact-map/StaticMapHero";

const contactus = () => {
  return (
    <>
      <StaticMapHero />
      <div className="hidden lg:block">
        <ContactForm />
      </div>
      <ContactSection />
    </>
  );
};

export default contactus;
