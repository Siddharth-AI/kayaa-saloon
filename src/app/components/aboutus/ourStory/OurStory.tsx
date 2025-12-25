"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import OwnerImg from "@/assets/kayaa-home/team.png"; // Update this path to your actual image

export default function OurStory() {
  return (
    <div className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-[#fefaf4] to-pink-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-4 sm:top-16 sm:left-8 md:top-20 md:left-10 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#F28C8C]/10 to-[#C59D5F]/10 rounded-full animate-pulse"></div>
      <div className="absolute bottom-10 right-4 sm:bottom-16 sm:right-8 md:bottom-20 md:right-10 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-gradient-to-br from-[#C59D5F]/8 to-[#F28C8C]/8 rounded-full animate-float-slow"></div>

      {/* Decorative Journey Text - Absolute positioned in background */}
      <motion.div
        className="absolute -top-4 left-0 pointer-events-none z-0"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}>
        <div
          className="
             xs:text-[6rem] sm:text-[2rem] md:text-[6rem] lg:text-[10rem] xl:text-[14rem]
            font-light text-[#c59d5f] italic
            select-none pointer-events-none
            leading-none
            whitespace-nowrap
            opacity-25
            drop-shadow-sm
          "
          style={{ fontFamily: "Quentinregular, cursive" }}>
          Journey
        </div>
      </motion.div>

      {/* Meet Anita Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
          {/* Left side - Anita's Photo */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="relative">
            <div className="relative overflow-hidden rounded-lg shadow-2xl">
              <Image
                src={OwnerImg}
                alt="Anita - Owner of Kaya Beauty Spa"
                width={600}
                height={700}
                className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#C59D5F]/20 to-transparent"></div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 sm:-top-5 sm:-left-5 md:-top-6 md:-left-6 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#F28C8C] to-[#C59D5F] rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -right-4 sm:-bottom-5 sm:-right-5 md:-bottom-6 md:-right-6 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-[#C59D5F] to-[#F28C8C] rounded-full opacity-15"></div>
          </motion.div>

          {/* Right side - About Anita */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6">
            <div className="text-sm sm:text-base md:text-lg lg:text-xl font-lato text-[#C59D5F] font-bold mb-2 sm:mb-3 tracking-widest">
              MEET ANITA
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-[#B11C5F] leading-tight mb-4 sm:mb-6 md:mb-8">
              Owner & Master Cosmetologist
            </h2>

            <div className="space-y-4 sm:space-y-5 md:space-y-6 text-sm sm:text-base md:text-lg text-[#444] font-lato leading-relaxed">
              <p>
                Hello, I'm Anita, the owner of Kaya Beauty Spa. I am originally
                from Punjab, northern India, a region renowned for its friendly
                and open-hearted people.
              </p>

              <p>
                From a young age, I was captivated by beauty, my passion for
                beauty, especially Ayurvedic and holistic skin care, never
                waned.
              </p>

              <p>
                I moved to the US in 2003 and continued my journey by obtaining
                my cosmetology and instructor's licenses 20 years ago.
              </p>

              <p>
                I combine the best of my beauty training in the US with my
                Ayurvedic and holistic beauty experience from India. At Kaya
                Beauty Spa, you will experience beauty routines that reflect my
                deep-rooted passion and expertise.
              </p>

              <p className="text-[#B11C5F] font-semibold">
                There is nothing I enjoy more than caring for my clients and
                enhancing their beauty with natural, Ayurvedic products.
              </p>
            </div>

            {/* Credentials/Highlights */}
            <div className="grid md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mt-6 sm:mt-7 md:mt-8">
              <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-lg shadow-md">
                <h4 className="font-playfair text-lg sm:text-xl font-semibold text-[#B11C5F] mb-2">
                  Experience
                </h4>
                <p className="text-sm sm:text-base text-[#444] font-lato">
                  20+ years in cosmetology and instruction
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-lg shadow-md">
                <h4 className="font-playfair text-lg sm:text-xl font-semibold text-[#B11C5F] mb-2">
                  Specialty
                </h4>
                <p className="text-sm sm:text-base text-[#444] font-lato">
                  Ayurvedic and holistic beauty care
                </p>
              </div>
            </div>

            <div className="pt-4 sm:pt-5 md:pt-6">
              <button className="bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white px-6 sm:px-7 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-full font-lato font-medium text-sm sm:text-base tracking-wide hover:shadow-lg transform hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                Book Consultation with Anita
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
