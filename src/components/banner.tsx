"use client";

import Image from "next/image";
import React, { useRef } from "react";

import { ChevronLeft, ChevronRight, BookOpen, ArrowRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/effect-fade";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    title: "Discover Your Next Great Read in Our Cozy Online Stacks",
    subtitle:
      "From literary fiction to cosmic discoveries and rare historical manuscripts, explore hundreds of curated titles shared by our community.",
    image: "/assets/images/image.png",
  },
  {
    id: 2,
    title: "Share the Joy of Reading: Add a Book, Borrow, Return",
    subtitle:
      "Got a favorite book sitting on your shelf? Add it to BookNook and let another book lover immerse themselves in its pages.",
    image: "/assets/images/image1.png",
  },
  {
    id: 3,
    title: "A Quiet Sanctuary for Lifelong Learners and Dreamers",
    subtitle:
      "Borrow physical or digital volumes with ease, track your lending due dates, and return books with a single click.",
    image: "/assets/images/image2.png",
  },
];

interface HeroSliderProps {
  onBrowse: () => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onBrowse }) => {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="relative w-full overflow-hidden rounded-sm shadow-xl bg-stone-900 border border-stone-200/40 dark:border-stone-800">
      {/* Swiper */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={800}
        loop={true}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="w-full min-h-[480px]"
      >
        {SLIDES.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative min-h-[480px] w-full">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  className="object-cover object-center"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/60 to-stone-950/40" />
              </div>

              {/* Slide Content */}
              <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12 py-16 sm:py-24 flex flex-col justify-end min-h-[480px] text-white">
                {/* Title */}
                <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 leading-[1.15] text-balance">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-stone-200 text-sm sm:text-base md:text-lg max-w-2xl font-normal leading-relaxed mb-6 opacity-95">
                  {slide.subtitle}
                </p>

                {/* Browse Button */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 pt-2">
                  <button
                    onClick={onBrowse}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-sm bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm transition-all shadow-lg hover:shadow-amber-600/30 group whitespace-nowrap shrink-0 focus-visible:outline-none"
                  >
                    <BookOpen className="w-4 h-4" />

                    <span>Browse Books</span>

                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrows */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="p-2.5 rounded-sm bg-stone-900/60 hover:bg-stone-900/90 text-white border border-stone-700/60 backdrop-blur-md transition-all focus-visible:outline-none"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="p-2.5 rounded-sm bg-stone-900/60 hover:bg-stone-900/90 text-white border border-stone-700/60 backdrop-blur-md transition-all focus-visible:outline-none"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
