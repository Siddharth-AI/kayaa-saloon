"use client";
import { useState } from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import foterimage from "@/assets/kayaa-home/fotterimage.png";

const BlissFooter = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const currentYear = new Date().getFullYear().toString();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.firstName || !formData.email || !formData.message) {
        alert("Please fill in all required fields");
        return;
      }

      console.log("Form submitted:", formData);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <footer className="bg-gradient-to-r from-green-400 to-green-500 text-white">
      <div className="flex flex-col md:flex-row">
        {/* Left Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center space-y-8 relative bg-[#90a57c] py-16 overflow-hidden">
          <svg
            className="absolute top-0 left-0 w-full h-full opacity-20"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 1440 320">
            <path
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.5"
              d="M0,160 C360,220 1080,80 1440,160"
            />
            <path
              fill="none"
              stroke="#ffffff"
              strokeWidth="0.5"
              d="M0,220 C360,280 1080,120 1440,200"
            />
          </svg>
          <div>
            <h2 className="text-3xl md:text-4xl font-light mb-4 leading-tight">
              We will take
              <br />
              care of you!
            </h2>
            <p className="text-base md:text-lg opacity-90 leading-relaxed">
              For those who love gentle care with
              <br />
              natural ingredients only.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl md:text-2xl font-light tracking-wider">
              GET IN TOUCH
            </h3>

            <div className="space-y-3 text-base md:text-lg">
              <p>2118 Thornridge Cir.</p>
              <p>Syracuse, Connecticut 35624</p>
            </div>

            <p className="text-lg md:text-xl font-medium">(208) 555-0112</p>

            <div className="flex items-center justify-between pt-6">
              {/* Links */}
              <div className="space-y-3">
                <Link
                  href="https://instagram.com"
                  className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                  <Instagram size={20} />
                  <span className="underline">INSTAGRAM</span>
                </Link>
                <Link
                  href="https://facebook.com"
                  className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                  <Facebook size={20} />
                  <span className="underline">FACEBOOK</span>
                </Link>
                <Link
                  href="https://twitter.com"
                  className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                  <Twitter size={20} />
                  <span className="underline">TWITTER</span>
                </Link>
              </div>

              {/* Sirf ek image right side */}
              <Image
                src={foterimage}
                alt="footer"
                width={250}
                height={150}
                className="rounded-md mr-20 "
              />
            </div>
          </div>
        </div>

        {/* Right Section - Contact Form */}
        <div className="w-full md:w-1/2 bg-white text-gray-600 p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full space-y-8">
            <h2 className="text-3xl md:text-4xl font-light text-orange-500 mb-8">
              Welcome to Bliss!
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name *"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="p-3 border-b-2 border-gray-200 bg-transparent focus:border-orange-500 outline-none transition-colors placeholder-gray-400"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="p-3 border-b-2 border-gray-200 bg-transparent focus:border-orange-500 outline-none transition-colors placeholder-gray-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="p-3 border-b-2 border-gray-200 bg-transparent focus:border-orange-500 outline-none transition-colors placeholder-gray-400"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="p-3 border-b-2 border-gray-200 bg-transparent focus:border-orange-500 outline-none transition-colors placeholder-gray-400"
                />
              </div>

              <textarea
                name="message"
                placeholder="Message *"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full p-3 border-b-2 border-gray-200 bg-transparent focus:border-orange-500 outline-none transition-colors placeholder-gray-400 resize-none"
              />

              <button
                type="submit"
                className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-medium transition-colors duration-300">
                BOOK AN APPOINTMENT
              </button>
            </form>

            <nav className="flex flex-wrap gap-4 md:gap-6 text-sm text-orange-500 pt-8">
              <Link href="/" className="hover:underline">
                HOME
              </Link>
              <Link href="/pricing" className="hover:underline">
                PRICING
              </Link>
              <Link href="/gift-cards" className="hover:underline">
                GIFT CARDS
              </Link>
              <Link href="/sauna-rooms" className="hover:underline">
                SAUNA ROOMS
              </Link>
              <Link href="/experts" className="hover:underline">
                EXPERTS
              </Link>
              <Link href="/blog" className="hover:underline">
                BLOG
              </Link>
            </nav>

            <div className="text-xs text-gray-400 pt-4 space-y-1">
              <p suppressHydrationWarning>
                © {currentYear} Bliss. All Rights Reserved.
              </p>
              <p>
                Template by <span className="text-orange-500">wCopilot</span>.
                Powered by <span className="text-orange-500">Webflow</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default BlissFooter;
