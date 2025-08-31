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
      title: "SAUNA ROOM",
      subtitle: "For those who love gentle care with natural ingredients only.",
    },
    {
      image: mainimage1,
      title: "RELAX & REFRESH",
      subtitle: "Experience the best spa treatments with organic oils.",
    },
    {
      image: mainimage2,
      title: "NATURAL CARE",
      subtitle: "Because your body deserves only the purest touch.",
    },
  ];

  const services = [
    {
      title: "Mineral Salt Scrub",
      desc: "Customized services for every skin type. Professional retail products available to continue taking care of your skin at home.",
      img: Mineral,
    },
    {
      title: "Geothermal Spa",
      desc: "Customized services for every skin type. Professional retail products available to continue taking care of your skin at home.",
      img: GeothermalSpa,
    },
    {
      title: "Mineral Baths",
      desc: "Customized services for every skin type. Professional retail products available to continue taking care of your skin at home.",
      img: MineralBaths,
    },
  ];

  const SaunaServices = [
    {
      icon: Finnish,
      title: "Finnish Sauna",
      desc: "When you choose us as a service partner we bring expertise and experience as standard.",
    },
    {
      icon: dailyProgram,
      title: "Daily Program",
      desc: "When you choose us as a service partner we bring expertise and experience as standard.",
    },
    {
      icon: volcanicStones,
      title: "Volcanic Stones",
      desc: "When you choose us as a service partner we bring expertise and experience as standard.",
    },
    {
      icon: facesScrub,
      title: "Scrub Massage",
      desc: "When you choose us as a service partner we bring expertise and experience as standard.",
    },
  ];

  const images = [GeothermalSpa, MineralBaths, mainimage];

  // Auto slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, []);

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
      text: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour.",
      name: "Bella Almost",
      role: "Designer",
      image: GeothermalSpa,
    },
    {
      text: "Spa experience was amazing! I felt refreshed and relaxed. Highly recommended for anyone looking for self-care.",
      name: "John Smith",
      role: "Developer",
      image: MineralBaths,
    },
    {
      text: "Wonderful facial treatment with natural products. My skin feels so smooth and hydrated now.",
      name: "Sophia Lee",
      role: "Artist",
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
    { name: "Violet Krasinski", role: "Physiotherapist", image: GeothermalSpa },
    { name: "Bella Almost", role: "Chief Masseuse", image: GeothermalSpa },
    { name: "Rita Parker", role: "Manager", image: GeothermalSpa },
    { name: "Esme Shield", role: "Cosmetologist", image: GeothermalSpa },
  ];

  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const Blissspa = [
    {
      img: Aromatherapy,
      title: "Aromatherapy",
      desc: "When you choose us as a service partner we bring expertise and experience as standard.",
    },
    {
      img: Hydrotherapy,
      title: "Hydrotherapy",
      desc: "When you choose us as a service partner we bring expertise and experience as standard.",
    },
    {
      img: Facials,
      title: "Facials",
      desc: "When you choose us as a service partner we bring expertise and experience as standard.",
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

  const plans = [
    {
      title: "A Blissful Spa Day",
      price: 238,
      features: [
        "50 Minute Relaxation Massage",
        "60 Minute River Relaxation Manicure",
        "50 Minute Pre-Natal Massage",
        "60 Minute River Relaxation Pedicure",
      ],
      button: "CHOOSE PLAN",
    },
    {
      title: "Spa Experience",
      price: 538,
      features: [
        "50 Minute Relaxation Massage",
        "60 Minute River Relaxation Manicure",
        "60 Minute River Relaxation Pedicure",
        "50 Minute Pre-Natal Massage",
        "40 Minutes of Face Lifting",
        "20 Minute Chocolate Wrap",
      ],
      button: "CHOOSE PLAN",
      highlight: true,
    },
    {
      title: "Spa Weekend",
      price: 338,
      features: [
        "50 Minute Relaxation Massage",
        "60 Minute River Relaxation Manicure",
        "50 Minute Pre-Natal Massage",
        "60 Minute River Relaxation Pedicure",
      ],
      button: "CHOOSE PLAN",
    },
  ];

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap");

        .dancing-script {
          font-family: "Dancing Script", cursive;
        }

        .cormorant {
          font-family: "Cormorant Garamond", serif;
        }

        .open-sans {
          font-family: "Open Sans", sans-serif;
        }

        .leaf-decoration {
          position: absolute;
          background-size: contain;
          background-repeat: no-repeat;
          pointer-events: none;
          opacity: 0.6;
        }

        .leaf-decoration.leaf-1 {
          top: 20px;
          left: 20px;
          width: 80px;
          height: 80px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23C8A882' viewBox='0 0 100 100'%3E%3Cpath d='M50 10C30 10 10 30 10 50C10 70 30 90 50 90C50 70 50 50 50 30C50 20 50 15 50 10Z'/%3E%3C/svg%3E");
        }

        .leaf-decoration.leaf-2 {
          top: 50%;
          right: 20px;
          width: 60px;
          height: 60px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23D4B896' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40'/%3E%3C/svg%3E");
        }

        .leaf-decoration.leaf-3 {
          bottom: 20px;
          left: 50%;
          width: 70px;
          height: 70px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23E6C9A8' viewBox='0 0 100 100'%3E%3Cpath d='M50 20L70 80L30 80Z'/%3E%3C/svg%3E");
        }

        .hero-image-transition {
          transition: opacity 0.8s ease-in-out;
        }
      `}</style>

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
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-pink-900/20" />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-start pl-16 lg:pl-24 z-10">
          <div className="text-white max-w-2xl">
            <motion.div
              key={`title-${current}`}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}>
              <h1 className="text-6xl lg:text-8xl dancing-script font-bold mb-4 text-pink-100">
                {slides[current].title}
              </h1>
              <p className="text-xl lg:text-2xl open-sans font-light mb-8 text-gray-200 leading-relaxed">
                {slides[current].subtitle}
              </p>
              <button className="bg-gradient-to-r from-pink-500 to-orange-400 text-white px-8 py-4 rounded-full open-sans font-medium tracking-wide hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                DISCOVER OUR SERVICES
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

      {/* Welcome Section */}

      {/* DREAM SPA Section */}
      <section className="relative py-36 bg-[#fefaf4] w-full min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background floral images */}
        <Image
          src={Flawors}
          width={500}
          height={300}
          alt="Spa floral decoration"
          className="absolute left-0 top-1/2 -translate-y-1/2 opacity-80 w-64 pointer-events-none"
        />
        <Image
          src={leftside}
          width={500}
          height={300}
          alt="Spa floral decoration"
          className="absolute right-0 top-1/2 -translate-y-1/2 opacity-80 w-64 pointer-events-none"
        />
        <Image
          src={Flawors}
          width={500}
          height={300}
          alt="Spa floral decoration"
          className="absolute top-0 left-1/2 -translate-x-1/2 opacity-80 w-72 pointer-events-none"
        />

        <div className="flex flex-col items-center justify-center gap-20">
          <motion.div
            className="relative text-center max-w-4xl"
            initial={{ opacity: 0, y: 80 }} // start hidden, move from bottom
            whileInView={{ opacity: 1, y: 0 }} // animate when visible
            viewport={{ once: true, amount: 0.3 }} // trigger once when 30% visible
            transition={{ duration: 0.8, ease: "easeOut" }}>
            <p className="text-green-700 tracking-widest mb-4">DREAM SPA</p>
            <h1 className="text-4xl md:text-5xl font-serif text-orange-600 leading-snug mb-6">
              Welcome to Home of Tranquility, <br /> Relaxation and Respite.
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Everybody is looking for places where to relax and get more
              energy. In our wellness center silence, energy, beauty and
              vitality meet. The treatments we offer will refresh both your body
              and soul. We'll be glad to welcome you and recommend our
              facilities and services.
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
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white p-6 rounded-md shadow-md w-11/12 max-w-sm text-center">
                  <h3 className="text-xl font-serif text-orange-600 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">{service.desc}</p>
                  <a
                    href="#"
                    className="text-green-700 font-medium hover:underline">
                    READ MORE
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
          {/* Sauna Services */}
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
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-center">
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
                    width={80}
                    height={80}
                    className="mb-4"
                  />

                  {/* Title */}
                  <h3 className="text-xl font-serif text-orange-600 mb-2">
                    {SaunaServices.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-700 text-sm leading-relaxed max-w-xs">
                    {SaunaServices.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* We are expert */}
      <section className="relative w-full pb-36 bg-[#fefaf4]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center justify-between px-6">
          {/* LEFT: Image with slider */}
          <div className="relative w-full h-[650px] overflow-hidden">
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
                className="p-3 bg-green-300 text-white rounded-md hover:bg-green-400">
                <ArrowLeft />
              </button>
              <button
                onClick={nextSlide}
                className="p-3 bg-green-300 text-white rounded-md hover:bg-green-400">
                <ArrowRight />
              </button>
            </div>
          </div>

          {/* RIGHT: Text Content */}
          <div>
            <h1 className="text-xl font-semibold text-green-700 mb-2">
              WE ARE EXPERTS
            </h1>
            <div className="flex">
              <h2 className="text-6xl font-serif text-orange-600 mb-6 relative flex-2">
                Skin Care and Face Masks
              </h2>
              <Image
                src={expert_title}
                alt="Spa Slide"
                width={200}
                height={200}
                className="object-cover rounded-lg opacity-90"
              />
            </div>

            <ul className="space-y-3 text-gray-700 mb-6 text-lg">
              <li>✨ Treat yourself to most relaxing hour of your life!</li>
              <li>✨ Your athletic spa experience and recovery.</li>
              <li>✨ The salt contains the essential oil of juniper fruits.</li>
            </ul>

            <p className="text-gray-600 leading-relaxed mb-4 text-lg">
              We offer a variety of facial services to suit your individual skin
              care needs. Our estheticians use only the finest Bioelements
              products based on trace minerals, essential oils, and plant
              extracts. Every facial includes a skin analysis, deep pore
              cleansing, gentle exfoliation, customized mask, and moisture
              treatment.
            </p>

            <a
              href="#"
              className="text-green-600 font-semibold hover:underline">
              LEARN MORE
            </a>
          </div>
        </div>
      </section>

      {/* Specialty Services Section */}
      <section className="pb-28 bg-gradient-to-br from-[#fefaf4] to-pink-50 relative overflow-hidden">
        <div className="leaf-decoration leaf-3"></div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-5xl dancing-script font-bold text-pink-800 mb-4">
              Special Services
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-pink-400 to-orange-400 mx-auto mb-6 rounded-full"></div>
            <p className="open-sans text-gray-600 max-w-2xl mx-auto">
              For those who love gentle care with natural ingredients only. We
              turn your skin care routine into a pleasant ritual.
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
                className="text-center bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden">
                  <Image
                    src={service.img}
                    alt={service.title}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="cormorant text-2xl font-semibold text-pink-800 mb-4">
                  {service.title}
                </h4>
                <p className="open-sans text-gray-600 leading-relaxed">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section with Photos */}
      <section className="py-20 bg-gradient-to-b from-pink-50 to-white relative overflow-hidden">
        <div className="leaf-decoration leaf-1"></div>

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
                  <h4 className="cormorant text-xl font-semibold text-pink-800">
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
                  index === testimonialIndex ? "bg-pink-400" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="pt-7 pb-20 bg-gradient-to-br from-white to-pink-50 relative overflow-hidden">
        <div className="leaf-decoration leaf-2"></div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-5xl dancing-script font-bold text-pink-800 mb-4">
              Our Amazing Team
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-pink-400 to-orange-400 mx-auto mb-6 rounded-full"></div>
            <p className="open-sans text-gray-600 max-w-2xl mx-auto">
              For those who love gentle care with natural ingredients only. We
              turn your skin care routine into a pleasant ritual.
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
                className="text-center group">
                <div className="relative mb-4 overflow-hidden rounded-2xl">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={300}
                    height={300}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-900/30 to-transparent"></div>
                </div>
                <h4 className="cormorant text-xl font-semibold text-pink-800 mb-2">
                  {member.name}
                </h4>
                <p className="open-sans text-gray-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-gradient-to-b from-pink-50 to-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}>
            <div className="text-sm open-sans text-green-600 font-semibold mb-4 tracking-widest">
              BLISS SPA STUDIO
            </div>
            <h2 className="text-4xl cormorant font-bold text-gray-800 mb-6">
              <span className="text-orange-500">Watch video and visit spa</span>
            </h2>
            <p className="open-sans text-gray-600 leading-relaxed mb-12 max-w-3xl mx-auto">
              For those who love gentle care with natural ingredients only. We
              turn your skin care routine into a pleasant ritual.
            </p>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative aspect-video rounded-3xl overflow-hidden group cursor-pointer shadow-2xl max-w-4xl mx-auto"
              onClick={() => setIsVideoOpen(true)}>
              <Image
                src={videoimage}
                alt="Spa Video"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <Play className="text-orange-500 ml-1" size={32} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-10 bg-gradient-to-r from-[#fefaf4] to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center space-x-16 opacity-80 gap-32">
            {logos.map((logo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center justify-center">
                <Image
                  src={logo.img}
                  alt={logo.alt}
                  width={100}
                  height={100}
                  className="invert sepia saturate-200 hue-rotate-[330deg] brightness-90 contrast-100"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section with Progress Bars */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-[#fefaf4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center gap-16">
            {/* Left side - Image */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}>
              <Image
                src={Amazingspa}
                alt="Spa Treatment"
                className="shadow-lg h-[650px] w-full"
              />
            </motion.div>

            {/* Right side - Skills */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}>
              <div className="text-xl open-sans text-green-600 font-semibold mb-4 tracking-widest">
                OUR SKILLS
              </div>
              <h2 className="text-5xl cormorant font-bold text-gray-800 mb-6 leading-tight">
                <span className="text-orange-500">
                  Amazing spa treatment skills
                </span>
                <br />
                with full passion
              </h2>
              <p className="open-sans text-lg text-gray-600 leading-relaxed mb-8">
                Our expertise includes architecture, planning, structural
                engineering, interior design, landscape architecture and
                construction services.
              </p>

              {/* Progress Bars */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="open-sans text-gray-700 font-medium">
                      Hydro Procedures
                    </span>
                    <span className="text-green-600 font-semibold">90%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "90%" }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      viewport={{ once: true }}
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"></motion.div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="open-sans text-gray-700 font-medium">
                      Skin Care
                    </span>
                    <span className="text-green-600 font-semibold">97%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "97%" }}
                      transition={{ duration: 1.5, delay: 0.7 }}
                      viewport={{ once: true }}
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"></motion.div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="open-sans text-gray-700 font-medium">
                      Massage
                    </span>
                    <span className="text-green-600 font-semibold">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "95%" }}
                      transition={{ duration: 1.5, delay: 0.9 }}
                      viewport={{ once: true }}
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"></motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rest of your sections remain the same... */}

      {/* Blog Section */}
      <section className="pb-20 pt-10 bg-gradient-to-br from-[#fefaf4] to-pink-50 relative overflow-hidden">
        <div className="leaf-decoration leaf-1"></div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-5xl dancing-script font-bold text-pink-800 mb-4">
              Spa News
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-pink-400 to-orange-400 mx-auto mb-6 rounded-full"></div>
            <p className="open-sans text-gray-600 max-w-2xl mx-auto">
              For those who love gentle care with natural ingredients only. We
              turn your skin care routine into a pleasant ritual.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.article
                key={index}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative overflow-hidden">
                  <Image
                    src={post.img}
                    alt={post.title}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="text-orange-500 open-sans text-sm font-semibold mb-2">
                    {post.category}
                  </div>
                  <div className="text-gray-500 open-sans text-sm mb-3">
                    {post.date}
                  </div>
                  <h3 className="cormorant text-xl font-semibold text-pink-800 mb-3 leading-tight">
                    {post.title}
                  </h3>
                  <p className="open-sans text-gray-600 text-sm leading-relaxed mb-4">
                    {post.desc}
                  </p>
                  <button className="text-orange-500 open-sans font-semibold text-sm hover:text-orange-600 transition-colors">
                    READ FULL POST
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pb-20 pt-10 bg-gradient-to-b from-pink-50 to-orange-50 relative overflow-hidden">
        <Image
          src={Flawors}
          alt=""
          className="absolute top-0 right-0 w-32 pointer-events-none"
        />
        <Image
          src={leftside}
          alt=""
          className="absolute top-10 left-10 w-28 opacity-90 pointer-events-none"
        />
        <Image
          src={Flawors}
          alt=""
          className="absolute bottom-10 right-10 w-32 opacity-90 pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-5xl dancing-script font-bold text-pink-800 mb-4">
              Our Packages
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-pink-400 to-orange-400 mx-auto mb-6 rounded-full"></div>
            <p className="open-sans text-gray-600 max-w-2xl mx-auto">
              For those who love gentle care with natural ingredients only. We
              turn your skin care routine into a pleasant ritual.
            </p>
          </div>
          {/* Cards */}
          <div className="max-w-6xl pt-10 mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 relative z-10">
            {plans.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                viewport={{ once: true }}
                className={`
              relative bg-white rounded-md shadow-md overflow-hidden text-center p-8 transition
              ${
                plan.highlight
                  ? "z-20 scale-110 shadow-xl border-t-4 border-green-600"
                  : "z-10 scale-95 opacity-90 shadow-md"
              }
            `}>
                {/* Top header with background floral */}
                <div className="relative bg-[#fffaf5] py-4 mb-6">
                  <Image
                    src={Flawors}
                    alt=""
                    className="absolute inset-0 w-full h-full opacity-70 object-cover"
                  />
                  <h3 className="relative text-lg font-serif text-orange-600">
                    {plan.title}
                  </h3>
                </div>
                {/* Price */}
                <p className="text-4xl font-serif text-orange-600 mb-6">
                  ${plan.price}
                  <span className="text-base text-gray-500 font-normal">
                    /month
                  </span>
                </p>

                {/* Features */}
                <ul className="space-y-3 text-gray-600 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  className={`px-6 py-2 rounded-full border transition font-medium
                ${
                  plan.highlight
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                }`}>
                  CHOOSE PLAN
                </button>
              </motion.div>
            ))}
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
    </>
  );
}
