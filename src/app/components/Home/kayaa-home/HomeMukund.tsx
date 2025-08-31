"use client";
import { useEffect, useState } from "react";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
{
  /* scrool images */
}
import mainimage from "@/assets/kayaa-home/mainimage1.webp";
import mainimage1 from "@/assets/kayaa-home/scroolimage.jpg";
import mainimage2 from "@/assets/kayaa-home/scroolimage2.webp";

import Flawors from "@/assets/kayaa-home/merafool.webp";
import leftside from "@/assets/kayaa-home/leftsidebackground.webp";
import Image from "next/image";
{
  /* card */
}
import Mineral from "@/assets/kayaa-home/Mineralcard.webp";
import GeothermalSpa from "@/assets/kayaa-home/Geothermalcard.webp";
import MineralBaths from "@/assets/kayaa-home/MineralBaths.webp";
{
  /* SaunaServices */
}
import facesScrub from "@/assets/kayaa-home/facescrub.webp";
import dailyProgram from "@/assets/kayaa-home/dailyProgram.webp";
import volcanicStones from "@/assets/kayaa-home/volcanicStones.webp";
import Finnish from "@/assets/kayaa-home/Finnishmasaaj.webp";
{
  /* video section */
}
import videoimage from "@/assets/kayaa-home/videoimage.jpg";
import Aromatherapy from "@/assets/kayaa-home/Aromatherapy.webp";
import Hydrotherapy from "@/assets/kayaa-home/Hydrotherapy.webp";
import Facials from "@/assets/kayaa-home/Facials.webp";
{
  /* victory */
}
import Victory from "@/assets/kayaa-home/victory.webp";
import advance from "@/assets/kayaa-home/advance.webp";
import Culpa from "@/assets/kayaa-home/clupa.webp";
import Herald from "@/assets/kayaa-home/victory.webp";
import Amazingspa from "@/assets/kayaa-home/Amazingspa.jpg";
export default function Home() {
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
  const [current, setCurrent] = useState(0);

  // Auto slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  {
    /* testimonials */
  }
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
      image: GeothermalSpa,
    },
    {
      text: "Wonderful facial treatment with natural products. My skin feels so smooth and hydrated now.",
      name: "Sophia Lee",
      role: "Artist",
      image: GeothermalSpa,
    },
    {
      text: "Best spa service ever! Very professional and soothing environment.",
      name: "David Kim",
      role: "Entrepreneur",
      image: GeothermalSpa,
    },
  ];
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Auto slide testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  {
    /* teamMembers */
  }
  const team = [
    {
      name: "Violet Krasinski",
      role: "Physiotherapist",
      image: GeothermalSpa,
    },
    {
      name: "Bella Almost",
      role: "Chief Masseuse",
      image: GeothermalSpa,
    },
    {
      name: "Rita Parker",
      role: "Manager",
      image: GeothermalSpa,
    },
    {
      name: "Esme Shield",
      role: "Cosmetologist",
      image: GeothermalSpa,
    },
  ];
  {
    /* video section */
  }
  const [isOpen, setIsOpen] = useState(false);

  const Blissspa = [
    {
      img: Aromatherapy, // apna icon path
      title: "Aromatherapy",
      desc: "When you choose us as a service partner we bring expertise and experience as standard.",
    },
    {
      img: Hydrotherapy, // apna icon path
      title: "Hydrotherapy",
      desc: "When you choose us as a service partner we bring expertise and experience as standard.",
    },
    {
      img: Facials, // apna icon path
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
      desc: "But the team has been super welcoming and I couldn’t be happier with my decision to join.",
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
      title: "Myths And Truths About Skin Care You Don’t Know",
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
      <div className="relative w-full h-screen">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          className="w-full h-full">
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div className="w-full h-screen relative flex items-center justify-center">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={idx === 0}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Text Content */}
                <div className="relative z-10 text-center text-white px-4">
                  <h1 className="text-5xl font-serif mb-4">{slide.title}</h1>
                  <p className="text-lg mb-6">{slide.subtitle}</p>
                  <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-full font-medium">
                    Book an Appointment
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* DREAM SPA Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center bg-[#fefaf4] px-6 overflow-hidden">
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

        {/* Text Content with Scroll Animation */}
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
            Everybody is looking for places where to relax and get more energy.
            In our wellness center silence, energy, beauty and vitality meet.
            The treatments we offer will refresh both your body and soul. We'll
            be glad to welcome you and recommend our facilities and services.
          </p>
        </motion.div>
      </section>
      <section className="py-16 bg-[#fefaf4]">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: idx * 0.2, ease: "easeOut" }}
              className="relative overflow-hidden rounded-lg shadow-lg group">
              {/* Background Image */}
              <Image
                src={service.img}
                alt={service.title}
                width={500}
                height={600}
                className="w-full h-[500px] object-cover"
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
      </section>
      {/* Sauna Services */}
      <section className="relative w-full py-20 bg-[#fefaf4] overflow-hidden">
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
              transition={{ duration: 0.8, delay: idx * 0.2, ease: "easeOut" }}
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
      </section>

      {/* wait */}
      <section className="relative w-full bg-[#fefaf4] py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center px-6">
          {/* LEFT: Image with slider */}
          <div className="relative w-full h-[500px] overflow-hidden">
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
            <p className="text-sm font-semibold text-green-700 mb-2">
              WE ARE EXPERTS
            </p>
            <h2 className="text-4xl font-serif text-orange-600 mb-6">
              Skin Care and Face Masks
            </h2>

            <ul className="space-y-3 text-gray-700 mb-6">
              <li>✨ Treat yourself to most relaxing hour of your life!</li>
              <li>✨ Your athletic spa experience and recovery.</li>
              <li>✨ The salt contains the essential oil of juniper fruits.</li>
            </ul>

            <p className="text-gray-600 leading-relaxed mb-4">
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
      <section className="relative bg-[#90a57c] py-16 overflow-hidden">
        {/* SVG Curved Background */}
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

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="relative flex justify-center items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="w-full">
                {/* IMAGE */}
                <div className="flex justify-center mb-6">
                  <Image
                    src={testimonials[current].image}
                    alt={testimonials[current].name}
                    width={100}
                    height={100}
                    className="rounded-full border-4 border-white shadow-md object-cover"
                  />
                </div>

                {/* TEXT */}
                <p className="text-2xl italic mb-6 max-w-3xl mx-auto">
                  “ {testimonials[current].text} “
                </p>

                {/* NAME + ROLE */}
                <h4 className="text-lg font-semibold">
                  {testimonials[current].name}
                </h4>
                <p className="text-sm opacity-80">
                  {testimonials[current].role}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* DOTS */}
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full ${
                  current === index ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#fefaf4] relative overflow-hidden">
        {/* Heading */}
        <div className="relative z-10 text-center mb-12">
          <h4 className="text-green-700 uppercase tracking-wide">
            Meet our professionals
          </h4>
          <h2 className="text-4xl font-serif text-orange-600 mt-2">
            Meet the team of Bliss Spa
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            For those who love gentle care with natural ingredients only. We
            turn your skin care routine into a pleasant ritual.
          </p>
        </div>

        {/* Team Members */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto px-6">
          {team.map((member, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg shadow-md">
              {/* Member Image */}
              <img
                src={member.image.src}
                alt={member.name}
                className="w-full h-[380px] object-cover transform group-hover:scale-110 transition duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-green-700/90 flex flex-col items-center justify-between py-6 text-center text-white opacity-0 group-hover:opacity-100 transition duration-500">
                {/* Top Decorative Image */}
                <Image
                  src={leftside}
                  alt="flower right"
                  className="absolute top-0 right-0 opacity-80 pointer-events-none"
                />
                {/* Social Icons */}
                <div className="flex space-x-6 text-2xl">
                  <a href="#" className="hover:text-orange-400">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="hover:text-orange-400">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="hover:text-orange-400">
                    <i className="fab fa-whatsapp"></i>
                  </a>
                </div>

                {/* Bottom Decorative Image */}
                <Image
                  src={leftside}
                  alt="flower right"
                  className="absolute top-0 right-0 opacity-80 pointer-events-none"
                />
              </div>

              {/* Name & Role */}
              <div className="bg-white text-center py-4">
                <h3 className="text-lg font-semibold text-orange-600">
                  {member.name}
                </h3>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* video section */}
      <section className="relative bg-[#fefaf4] py-16 px-6 text-center overflow-hidden">
        {/* Decorative Background */}
        <Image
          src={Flawors}
          alt="decoration"
          className="hidden md:block absolute left-0 top-10 w-60 opacity-30"
        />
        <Image
          src={leftside}
          alt="decoration"
          className="hidden md:block absolute right-0 top-20 w-60 opacity-30"
        />

        {/* Heading */}
        <div className="relative z-10 max-w-3xl mx-auto mb-10">
          <h4 className="text-green-700 uppercase tracking-widest">
            Bliss Spa Studio
          </h4>
          <h2 className="text-4xl md:text-5xl font-serif text-orange-600 mt-2">
            Watch video and visit spa
          </h2>
          <p className="text-gray-600 mt-4 leading-relaxed">
            For those who love gentle care with natural ingredients only. We
            turn your skin care routine into a pleasant ritual.
          </p>
        </div>

        {/* Image with Play Button */}
        <div className="relative max-w-4xl mx-auto">
          <Image
            src={videoimage}
            alt="Spa video"
            className="w-full rounded-lg shadow-lg"
          />
          <button
            onClick={() => setIsOpen(true)}
            className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center transition hover:scale-110">
              <div className="w-0 h-0 border-l-[18px] border-l-orange-500 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
            </div>
          </button>
        </div>

        {/* Video Modal */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              <motion.div
                className="bg-black rounded-lg overflow-hidden shadow-2xl relative max-w-4xl w-full"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}>
                {/* Close Button */}
                <button
                  className="absolute top-2 right-2 text-white text-3xl font-bold"
                  onClick={() => setIsOpen(false)}>
                  &times;
                </button>

                {/* Embedded Video */}
                <div className="w-full h-[500px]">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/RZpYMLn2fDo?autoplay=1"
                    title="Spa Video"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen></iframe>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Blissspa */}
      <section className="bg-[#fefaf4] py-20 relative overflow-hidden">
        {/* Background decoration */}
        <Image
          src={leftside}
          alt="decoration"
          className="hidden md:block absolute left-0 bottom-10 w-32 opacity-40"
        />
        <Image
          src={Flawors}
          alt="decoration"
          className="hidden md:block absolute right-0 top-10 w-32 opacity-40"
        />

        {/* Services Grid */}
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {Blissspa.map((Blissspa, index) => (
            <div key={index} className="flex flex-col items-center">
              <Image
                src={Blissspa.img}
                alt={Blissspa.title}
                className="w-20 h-20 mb-6"
              />
              <h3 className="text-2xl font-serif text-orange-600 mb-3">
                {Blissspa.title}
              </h3>
              <p className="text-gray-600 max-w-xs">{Blissspa.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* logos green */}
      <section className="relative bg-[#90a57c] py-16 overflow-hidden">
        {/* Background Decorative Curves */}
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

        {/* Logos */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-10 items-center justify-center">
          {logos.map((logo, index) => (
            <div key={index} className="flex justify-center">
              <Image
                src={logo.img}
                alt={logo.alt}
                className="h-20 object-contain opacity-90 hover:opacity-100 transition"
              />
            </div>
          ))}
        </div>
      </section>
      {/* masa */}
      <section className="w-full bg-[#fdfaf5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center">
          {/* LEFT SIDE IMAGE */}
          <div className="w-full h-full">
            <Image
              src={Amazingspa}
              alt="Spa Treatment"
              width={800}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>

          {/* RIGHT SIDE CONTENT */}
          <motion.div
            className="p-10 md:p-16"
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}>
            <h4 className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-2">
              Our Skills
            </h4>

            <h2 className="text-3xl md:text-4xl font-serif text-orange-600 mb-6 leading-snug">
              Amazing spa treatment skills <br /> with full passion
            </h2>

            <p className="text-gray-600 mb-10">
              Our expertise includes architecture, planning, structural
              engineering, interior design, landscape architecture and
              construction services.
            </p>

            {/* Progress Bars */}
            <div className="space-y-6">
              {/* Hydro Procedures */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-orange-600">Hydro Procedures</span>
                  <span className="text-green-700">90%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded">
                  <div className="h-1.5 bg-green-700 rounded w-[90%]"></div>
                </div>
              </div>

              {/* Skin Care */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-orange-600">Skin Care</span>
                  <span className="text-green-700">97%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded">
                  <div className="h-1.5 bg-green-700 rounded w-[97%]"></div>
                </div>
              </div>

              {/* Massage */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-orange-600">Massage</span>
                  <span className="text-green-700">95%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded">
                  <div className="h-1.5 bg-green-700 rounded w-[95%]"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <section
        className="w-full py-16 bg-[#fcf8f2] relative"
        style={{
          backgroundImage: "url('/bg-pattern.png')", // apni background pattern image ka path yaha daalna
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}>
        <div className="text-center mb-12">
          <p className="text-sm text-gray-500 uppercase tracking-wide">
            Spa News
          </p>
          <h2 className="text-3xl md:text-4xl font-serif text-[#E55C2B]">
            Our tips from the world of beauty
          </h2>
          <p className="mt-2 text-gray-500">
            For those who love gentle care with natural ingredients only. We
            turn your skin care routine into a pleasant ritual.
          </p>
        </div>

        {/* Blog Cards */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
          {posts.map((post, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="relative">
                <Image
                  src={post.img}
                  alt={post.title}
                  width={500}
                  height={300}
                  className="w-full h-60 object-cover"
                />
                <span className="absolute top-3 left-3 bg-[#E55C2B] text-white text-xs px-3 py-1 rounded">
                  {post.category}
                </span>
              </div>
              <div className="p-6 text-left">
                <p className="text-sm text-gray-400">{post.date}</p>
                <h3 className="text-lg font-serif text-[#E55C2B] mt-2 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{post.desc}</p>
                <a
                  href="#"
                  className="text-sm font-medium text-[#E55C2B] hover:underline">
                  READ FULL POST
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* kuch bhi  */}

      <section className="relative w-full bg-[#fdfaf5] py-20 overflow-hidden">
        {/* Decorative background images */}
        <Image
          src={leftside}
          alt=""
          className="absolute top-10 left-10 w-28 opacity-30 pointer-events-none"
        />
        <Image
          src={Flawors}
          alt=""
          className="absolute bottom-10 right-10 w-32 opacity-30 pointer-events-none"
        />

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 relative z-10">
          <h4 className="text-sm font-semibold text-green-700 uppercase tracking-wide">
            Our Pricing Plan
          </h4>
          <h2 className="text-3xl md:text-4xl font-serif text-orange-600 mt-2">
            Pricing that suits your needs
          </h2>
          <p className="text-gray-600 mt-4">
            For those who love gentle care with natural ingredients only. We
            turn your skin care routine into a pleasant ritual.
          </p>
        </div>

        {/* Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 relative z-10">
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
