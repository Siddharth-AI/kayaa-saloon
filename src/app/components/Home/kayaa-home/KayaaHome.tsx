"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/effect-fade";

// Import your existing images
import mainimage from "@/assets/kayaa-home/mainimage1.webp";
import mainimage1 from "@/assets/kayaa-home/scroolimage.jpg";
import mainimage2 from "@/assets/kayaa-home/scroolimage2.webp";
import Flawors from "@/assets/kayaa-home/merafool.webp";
import leftside from "@/assets/kayaa-home/leftsidebackground.webp";
import OwnerImg from "@/assets/kayaa-home/team.png";
import Image from "next/image";
import Mineral from "@/assets/kayaa-home/Mineralcard.webp";
import GeothermalSpa from "@/assets/kayaa-home/Geothermalcard.webp";
import MineralBaths from "@/assets/kayaa-home/MineralBaths.webp";
import facesScrub from "@/assets/kayaa-home/facescrub.webp";
import dailyProgram from "@/assets/kayaa-home/dailyProgram.webp";
import volcanicStones from "@/assets/kayaa-home/volcanicStones.webp";
import Finnish from "@/assets/kayaa-home/Finnishmasaaj.webp";
import videoimage from "@/assets/kayaa-home/videoimage.jpg";
import Aromatherapy from "@/assets/kayaa-home/Aromatherapy.webp";
import Hydrotherapy from "@/assets/kayaa-home/Hydrotherapy.webp";
import Facials from "@/assets/kayaa-home/Facials.webp";
import Victory from "@/assets/kayaa-home/victory.webp";
import advance from "@/assets/kayaa-home/advance.webp";
import Culpa from "@/assets/kayaa-home/clupa.webp";
import Herald from "@/assets/kayaa-home/victory.webp";
import Amazingspa from "@/assets/kayaa-home/Amazingspa.jpg";
import expert_title from "@/assets/kayaa-home/expert_near_title.webp";
export default function Page() {
  const slides = [
    {
      image: mainimage,
      title: "KAYA BEAUTY SPA",
      subtitle:
        "Enhancing your beauty for 20 years with top-tier holistic, ayurvedic, and cruelty-free products.",
    },
    {
      image: mainimage1,
      title: "SPECIALIZED SERVICES",
      subtitle:
        "We offer different Specialized Services such as the Ultrasonic and Hydra facials, Keratin Treatments, Threading, and Henna for Hair.",
    },
    {
      image: mainimage2,
      title: "PREMIUM PRODUCTS",
      subtitle:
        "We'll elevate your looks using AVEDA®, GlyMed Plus®, and Dermalogica® products and a host of beautifying services.",
    },
  ];

  const services = [
    {
      title: "Ultrasonic Facials",
      desc: "Ultrasonic Clinical Skin Treatment system use a highly effective and unique 3-stage system for safer mechanical therapy.",
      img: Mineral,
    },
    {
      title: "Hydra Facials",
      desc: "Our signature treatment includes the works! triple cleansing, dermasound elite microcurrent, powerful enzyme mask.",
      img: GeothermalSpa,
    },
    {
      title: "Keratin Treatments",
      desc: "Keratin Treatment upon consultation. Treat and rejuvenate damaged and dry hair with professional care and premium products.",
      img: MineralBaths,
    },
  ];

  const SaunaServices = [
    {
      icon: Finnish,
      title: "Threading",
      desc: "Eyebrow Threading, Chin, Upper Lip/Lower lip, Full Face. Professional threading services for perfect shaping.",
    },
    {
      icon: dailyProgram,
      title: "Henna for Hair",
      desc: "Henna Treatment with wash, Indigo with wash. Natural henna treatments for hair coloring and conditioning.",
    },
    {
      icon: volcanicStones,
      title: "Hair Color",
      desc: "Single Color Process, Partial Foil, Full Foil, Balayage. Professional hair coloring services.",
    },
    {
      icon: facesScrub,
      title: "Waxing Services",
      desc: "Eyebrow, Bikini, Brazilian, Full Legs. For Female only. Gentle and effective waxing services for smooth skin.",
    },
  ];

  const images = [GeothermalSpa, MineralBaths, mainimage];

  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const testimonials = [
    {
      text: "I've been coming to Kaya Beauty Spa for years and Anita always does an amazing job with my eyebrow threading. The Ayurvedic treatments are so relaxing and my skin always feels incredible afterward.",
      name: "Sarah M.",
      role: "Regular Client",
      image: GeothermalSpa,
    },
    {
      text: "The Hydra facial at Kaya Beauty Spa completely transformed my skin! The staff is so knowledgeable about Ayurvedic treatments and they use the best products. Highly recommend!",
      name: "Maria L.",
      role: "Happy Customer",
      image: MineralBaths,
    },
    {
      text: "Anita is the best! Her expertise with natural henna treatments is unmatched. I love that they use holistic and cruelty-free products. My hair has never looked better.",
      name: "Jennifer K.",
      role: "Satisfied Client",
      image: Mineral,
    },
  ];

  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const team = [
    { name: "Sarah Johnson", role: "Senior Esthetician", image: GeothermalSpa },
    {
      name: "Maria Rodriguez",
      role: "Hair Color Specialist",
      image: GeothermalSpa,
    },
    { name: "Lisa Chen", role: "Threading Expert", image: GeothermalSpa },
    { name: "Amanda Davis", role: "Facial Therapist", image: GeothermalSpa },
  ];

  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const Blissspa = [
    {
      img: Aromatherapy,
      title: "Chemical Exfoliation",
      desc: "Lactic Peel, Jessner Peel, Vitamin A Peel, 5 Berry Pigment Control Peel. Professional chemical peels for skin rejuvenation.",
    },
    {
      img: Hydrotherapy,
      title: "Micro Needling",
      desc: "Advanced Micro Needling treatment. This treatment focuses on fine lines and wrinkles with immediate tightening effect and deeper product penetration.",
    },
    {
      img: Facials,
      title: "Eye Lift Treatment",
      desc: "Eye Lift Treatment with Dermasound Elite 20 mins. This treatment focuses more directly on fine lines and wrinkles around the eye area.",
    },
  ];

  const logos = [
    { img: Victory, alt: "Victory" },
    { img: Culpa, alt: "Culpa" },
    { img: Herald, alt: "Herald" },
    { img: advance, alt: "Advance" },
    { img: Culpa, alt: "Culpa" },
  ];

  const posts = [
    {
      category: "MAKEUP",
      date: "September 27, 2022",
      title: "At What Age Should Girls Start Using Cosmetics?",
      desc: "But the team has been super welcoming and I couldn't be happier with my decision to join.",
      img: mainimage,
    },
    {
      category: "ECO CARE",
      date: "September 27, 2022",
      title: "Cosmetic Brands That Improve Acne Skin Conditions",
      desc: "The experience of being the first designer at Ueno LA comes with a ton of excitement.",
      img: mainimage,
    },
    {
      category: "SPA TIPS",
      date: "September 27, 2022",
      title: "Myths And Truths About Skin Care You Don't Know",
      desc: "The experience of being the first designer at Ueno LA comes with a ton of excitement.",
      img: mainimage,
    },
  ];

  return (
    <>
      <style jsx global>{`
        .hero-image-transition {
          transition: opacity 0.8s ease-in-out;
        }
      `}</style>

      <div className="overflow-x-hidden">
        {/* Hero Section - Fixed transition issue */}
        <section className="relative h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
          {/* Background Images with smooth transition */}
          <div className="absolute inset-0">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute bg-black inset-0 hero-image-transition brightness-70 ${
                  index === current ? "opacity-100" : "opacity-0"
                }`}>
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover brightness-75"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-pink-900/20" />
              </div>
            ))}
          </div>

          <div className="absolute inset-0 flex items-center justify-start px-10 md:px-16 lg:pl-24 z-10">
            <div className="text-white max-w-2xl">
              <motion.div
                key={`title-${current}`}
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}>
                <h1 className="md:text-6xl text-4xl lg:text-6xl dancing-script font-bold mb-4 text-pink-100">
                  {slides[current].title}
                </h1>
                <p className="text-xl lg:text-2xl open-sans font-light mb-8 text-gray-200 leading-relaxed">
                  {slides[current].subtitle}
                </p>
                <button className="bg-gradient-to-r from-pink-500 to-orange-400 text-white px-8 py-4 rounded-full open-sans font-medium tracking-wide hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                  BOOK NOW
                </button>
              </motion.div>
            </div>
          </div>

          {/* Slide indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === current ? "bg-pink-400" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </section>

        {/* KAYA BEAUTY SPA Section */}
        <section className="relative px-1 py-36 bg-gradient-to-br from-[#fefaf4] to-pink-50  min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background floral images */}
          <Image
            src={Flawors}
            width={500}
            height={300}
            alt="Spa floral decoration"
            className="absolute left-0 top-1/2 -translate-y-1/2  w-64 pointer-events-none"
          />
          <Image
            src={leftside}
            width={500}
            height={300}
            alt="Spa floral decoration"
            className="absolute right-0 top-1/2 -translate-y-1/2  w-64 pointer-events-none"
          />
          <Image
            src={Flawors}
            width={500}
            height={300}
            alt="Spa floral decoration"
            className="absolute top-8 left-1/2 -translate-x-1/2  w-72 pointer-events-none opacity-85"
          />

          <div className="flex flex-col items-center justify-center gap-20">
            <motion.div
              className="relative text-center max-w-4xl"
              initial={{ opacity: 0, y: 80 }} // start hidden, move from bottom
              whileInView={{ opacity: 1, y: 0 }} // animate when visible
              viewport={{ once: true, amount: 0.3 }} // trigger once when 30% visible
              transition={{ duration: 0.8, ease: "easeOut" }}>
              <h3 className="text-[#C59D5F] text-sm md:text-2xl font-medium mb-4 font-playfair leading-snug italic">
                WELCOME TO KAYA BEAUTY SPA!
              </h3>
              <h1 className=" md:text-5xl text-3xl font-playfair font-bold text-[#B11C5F] leading-tight tracking-wide mb-6">
                Enhancing your beauty for 20 years <br /> with top-tier
                services.
              </h1>
              <p className="text-[#444] font-lato md:text-lg leading-relaxed">
                We are a Spa offering a variety of personal care services for
                skin, and hair. We offer different Specialized Services such as
                the Ultrasonic and Hydra facials, Keratin Treatments, Threading,
                and Henna for Hair. We'll elevate your looks using AVEDA®,
                GlyMed Plus®, and Dermalogica® products and a host of
                beautifying services. Rejuvenation and relaxation are what you
                need to look and feel your best, and Kaya Beauty Spa can give
                that to you.
              </p>
            </motion.div>
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
              {services.map((service, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 80 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.8,
                    delay: idx * 0.2,
                    ease: "easeOut",
                  }}
                  className="relative overflow-hidden rounded-lg shadow-lg group">
                  {/* Background Image */}
                  <Image
                    src={service.img}
                    alt={service.title}
                    width={500}
                    height={600}
                    className="w-full h-[500px] object-cover group-hover:scale-110 transition-all duration-300 ease-in-out"
                  />
                  {/* Text Overlay Card */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white p-6  shadow-md w-11/12 max-w-sm text-center z-10">
                    <h3 className="text-2xl font-playfair text-[#B11C5F] font-medium mb-2">
                      {service.title}
                    </h3>
                    <p className="text-[#444] font-lato mb-4 leading-relaxed">
                      {service.desc}
                    </p>
                    <button className="font-lato uppercase tracking-wide text-[#F28C8C] hover:text-[#C59D5F] hover:-translate-0.5 active:translate-0.5 px-6 py-3 shadow-md transition">
                      Book Now
                    </button>
                  </div>
                  <div className="absolute inset-0 bg-pink-200 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"></div>{" "}
                </motion.div>
              ))}
            </div>
            {/* Our Services */}
            <div className="relative w-full overflow-hidden">
              {/* Decorative Background Flowers */}
              <Image
                src={leftside}
                width={250}
                height={250}
                alt="flower left"
                className="absolute bottom-0 left-0 opacity-40 pointer-events-none"
              />
              <Image
                src={Flawors}
                width={250}
                height={250}
                alt="flower right"
                className="absolute top-0 right-0 opacity-30 pointer-events-none"
              />

              {/* Services Grid */}
              <div className="max-w-7xl mx-auto px-6 pt-3 grid md:grid-cols-4 gap-12 text-center">
                {SaunaServices.map((SaunaServices, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 80 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                      duration: 0.8,
                      delay: idx * 0.2,
                      ease: "easeOut",
                    }}
                    className="flex flex-col items-center">
                    {/* Icon */}
                    <Image
                      src={SaunaServices.icon}
                      alt={SaunaServices.title}
                      width={100}
                      height={100}
                      className="mb-4"
                    />

                    {/* Title */}
                    <h3 className="cormorant font-semibold text-2xl text-[#B11C5F] leading-snug mb-2">
                      {SaunaServices.title}
                    </h3>

                    {/* Description */}
                    <p className="font-lato text-[#444444] leading-relaxed max-w-xs">
                      {SaunaServices.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* We are expert */}
        <section className="relative  pb-36 bg-gradient-to-tr from-[#fefaf4] to-pink-50">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center justify-between px-6">
            {/* LEFT: Image with slider */}
            <div className="relative w-full h-[550px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-0">
                  <Image
                    src={images[current]}
                    alt="Spa Slide"
                    fill
                    className="object-cover rounded-lg"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Arrows */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <button
                  onClick={prevSlide}
                  className="p-3 bg-[#F28C8C] text-white rounded-md hover:bg-[#C59D5F]">
                  <ArrowLeft />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-3 bg-[#F28C8C] text-white rounded-md hover:bg-[#C59D5F]">
                  <ArrowRight />
                </button>
              </div>
            </div>

            {/* RIGHT: Text Content */}
            <div>
              <h1 className="md:text-xl text-lg font-semibold text-[#C59D5F] mb-2">
                WE ARE EXPERTS
              </h1>
              <h2 className="md:text-6xl text-4xl font-playfair font-semibold text-[#B11C5F] mb-6 relative">
                Professional Facial Services
              </h2>

              <ul className="space-y-2 text-[#444] mb-6 md:text-lg">
                <li>
                  ✨ Kaya Signature Facial - customized for your skin type
                </li>
                <li>✨ Ultrasonic Facial - advanced skin treatment system</li>
                <li>✨ Hydra Facial - triple cleansing with microcurrent</li>
              </ul>

              <p className="text-gray-600 leading-relaxed mb-4 md:text-lg">
                Our skin specialist will customize this facial to meet the needs
                of your skin. Specific facial for any type of skin, specially
                for Age Management and Acneic Skin. This exclusive formulation
                is a super exfoliate and powerful antioxidant that re-textures
                the skin, restores skin hydration, tone and firmness.
              </p>

              <button className="font-lato uppercase tracking-wide text-[#F28C8C] hover:text-[#C59D5F] hover:-translate-0.5 active:translate-0.5 md:px-6 md:py-3 px-3 py-2 shadow-md transition">
                Book Service
              </button>
            </div>
          </div>
        </section>

        {/* Specialty Services Section */}
        <section className="pb-28 bg-gradient-to-br from-[#fefaf4] to-pink-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="md:text-5xl text-4xl font-playfair font-bold text-[#B11C5F] mb-4">
                Advanced Treatments
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#F28C8c] to-[#C59D5F] mx-auto mb-6 rounded-full"></div>
              <p className="font-lato text-[#444] max-w-2xl md:text-lg mx-auto">
                Enjoy a more youthful and gorgeous YOU after leaving our spa and
                salon in Somerville, Massachusetts. We plan on being here to
                help YOU look and feel more beautiful than you already are!
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {Blissspa.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden">
                    <Image
                      src={service.img}
                      alt={service.title}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover group-hover:animate-pulse"
                    />
                  </div>
                  <h4 className="cormorant text-2xl font-semibold text-[#B11C5F] mb-4">
                    {service.title}
                  </h4>
                  <p className="font-lato text-[#444] leading-relaxed">
                    {service.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section with Photos */}
        <section className="pb-20 pt-10 bg-gradient-to-tr from-[#fefaf4] to-pink-50 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl p-12 shadow-xl">
                <blockquote className="text-2xl cormorant italic text-gray-700 mb-8 leading-relaxed">
                  "{testimonials[testimonialIndex].text}"
                </blockquote>

                <div className="flex items-center justify-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg">
                    <Image
                      src={testimonials[testimonialIndex].image}
                      alt={testimonials[testimonialIndex].name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="cormorant text-xl font-semibold text-[#F28C8C]">
                      {testimonials[testimonialIndex].name}
                    </h4>
                    <p className="open-sans text-gray-500">
                      {testimonials[testimonialIndex].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setTestimonialIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === testimonialIndex ? "bg-[#C59D5F]" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="pt-10 pb-20 bg-gradient-to-br from-[#fefaf4] to-pink-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="md:text-5xl text-4xl font-playfair font-bold text-[#B11C5F] mb-4">
                Experienced Beauty Experts
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-[#F28C8c] to-[#C59D5F] mx-auto mb-6 rounded-full"></div>{" "}
              <p className="font-lato md:text-lg text-[#444] max-w-2xl mx-auto">
                Our skilled Experts specialize in Ultrasonic and Hydra facials,
                Keratin Treatments, Threading, and Henna for Hair using AVEDA®,
                GlyMed Plus®, and Dermalogica® products.
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group border-2 border-gray-200 rounded-lg shadow-lg pb-2">
                  <div className="relative mb-4 overflow-hidden rounded-t-lg">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={300}
                      height={300}
                      className="w-full h-72  object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#C59D5F]/30 to-transparent"></div>
                  </div>
                  <h4 className="cormorant text-xl font-semibold text-[#B11C5F] tracking-wide leading-tight">
                    {member.name}
                  </h4>
                  <p className="font-lato text-gray-500 leading-relaxed mb-3">
                    {member.role}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="pb-20 pt-10 bg-gradient-to-tr from-[#fefaf4] to-pink-50">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}>
              <div className="text-sm font-lato text-[#C59D5F] font-semibold mb-2 tracking-widest">
                KAYA BEAUTY SPA
              </div>
              <h2 className="text-4xl font-playfair font-bold text-gray-800 mb-4">
                <span className="text-[#B11C5F]">
                  Experience Our Spa Services
                </span>
              </h2>
              <p className="font-lato text-[#444] leading-relaxed mb-10 max-w-3xl mx-auto text-lg">
                Rejuvenation and relaxation are what you need to look and feel
                your best, and Kaya Beauty Spa can give that to you. We plan on
                being here to help YOU look and feel more beautiful than you
                already are!
              </p>

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer shadow-2xl max-w-4xl mx-auto"
                onClick={() => setIsVideoOpen(true)}>
                <Image
                  src={videoimage}
                  alt="Kaya Beauty Spa"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <Play
                      className="text-[#C59D5F] ml-1 group-hover:text-[#B11C5F]"
                      size={32}
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Skills Section with Progress Bars */}
        <section className="md:py-20 pt-0 pb-20 bg-gradient-to-tr from-[#fefaf4] to-pink-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center sm:flex-nowrap flex-wrap gap-16">
              {/* Left side - Image */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}>
                <Image
                  src={Amazingspa}
                  alt="Kaya Beauty Spa Treatment"
                  className="shadow-xl shadow-[#C59D5F]/30 h-[600px] w-full hidden sm:block"
                />
              </motion.div>

              {/* Right side - Skills */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}>
                <div className="md:text-xl text-lg font-lato text-[#C59D5F] font-bold mb-1 tracking-widest">
                  OUR EXPERTISE
                </div>
                <h2 className="md:text-5xl text-4xl font-playfair font-semibold text-[#B11C5F] mb-6 leading-tight">
                  <span>Beauty Excellence</span>
                  <br />
                  with Ayurvedic Expertise
                </h2>
                <p className="font-lato md:text-lg text-[#444] leading-relaxed mb-8">
                  We combine the best of beauty training with Ayurvedic and
                  holistic beauty experience. Our expertise includes Ultrasonic
                  and Hydra facials, Keratin Treatments, Threading, and Henna
                  for Hair using premium products.
                </p>

                {/* Progress Bars */}
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="open-sans text-[#C59D5F] font-medium">
                        Ayurvedic Treatments
                      </span>
                      <span className="text-[#C59D5F] font-semibold">95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "95%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-[#F28C8C] to-[#F28C8C] h-2 rounded-full"></motion.div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="open-sans text-[#C59D5F] font-medium">
                        Facial Services
                      </span>
                      <span className="text-[#C59D5F] font-semibold">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "92%" }}
                        transition={{ duration: 1.5, delay: 0.7 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-[#F28C8C] to-[#F28C8C] h-2 rounded-full"></motion.div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="open-sans text-[#C59D5F] font-medium">
                        Hair Care & Threading
                      </span>
                      <span className="text-[#C59D5F] font-semibold">88%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "88%" }}
                        transition={{ duration: 1.5, delay: 0.9 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-[#F28C8C] to-[#F28C8C] h-2 rounded-full"></motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Parallax Section */}
        <section
          className="relative h-[400px] w-full bg-fixed bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${mainimage.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}></section>
      </div>
    </>
  );
}
