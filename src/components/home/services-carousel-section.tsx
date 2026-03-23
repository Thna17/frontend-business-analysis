"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

const services = [
  {
    title: "Live Flash Deals",
    href: "/products",
    image: "/service_carousel1.png",
  },
  {
    title: "Buy 1 Free 1",
    href: "/new-arrivals",
    image: "/service_carousel2.png",
  },
  {
    title: "Limited Stock Drop",
    href: "/products",
    image: "/service_carousel3.png",
  },
  {
    title: "Bundle Gift Sets",
    href: "/products",
    image: "/service_carousel4.png",
  },
  {
    title: "ABA KHQR Checkout",
    href: "/checkout",
    image: "/service_carousel5.png",
  },
  {
    title: "J&T Nationwide Delivery",
    href: "/products",
    image: "/service_carousel6.png",
  },
  {
    title: "Official PHKA Channel",
    href: "https://t.me/phkaofficial",
    image: "/service_carousel7.png",
  },
];

export default function ServicesCarouselSection() {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [current, setCurrent] = React.useState(1);
  const [count, setCount] = React.useState(services.length);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;

    const update = () => {
      setCurrent(api.selectedScrollSnap() + 1);
      setCount(services.length);
    };

    update();
    api.on("select", update);
    api.on("reInit", update);

    return () => {
      api.off("select", update);
      api.off("reInit", update);
    };
  }, [api]);

  React.useEffect(() => {
    if (!api || isPaused) return;

    const autoplay = window.setInterval(() => {
      api.scrollNext();
    }, 2600);

    return () => {
      window.clearInterval(autoplay);
    };
  }, [api, isPaused]);

  return (
    <section className="relative overflow-hidden bg-neutral-50 py-20 lg:py-28">

      <div className="relative  mx-auto ">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[400px_minmax(0,1fr)]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <p className="font-serif text-center text-4xl leading-tight text-gray-800 lg:text-2xl">
              World of PHKA
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="relative"
          >
            <Carousel
              setApi={setApi}
              opts={{ align: "start", loop: true, slidesToScroll: 1, containScroll: "keepSnaps" }}
              className="relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              <CarouselContent className="-ml-6 py-6">
                {services.map((service, index) => (
                  <CarouselItem
                    key={`${service.title}-${index}`}
                    className="basis-[84%] pl-6 sm:basis-[64%] lg:basis-[44%] xl:basis-[38%] pointer-events-auto"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-120px" }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="group relative h-[360px] overflow-hidden bg-white sm:h-[440px] lg:h-[560px]"
                    >
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/55" />
                      <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 text-center text-white">
                        <div className="  px-4 py-5">
                          <p className="text-[11px] uppercase tracking-[0.25em] text-white/80">
                            Service
                          </p>
                          <p className="mt-2 text-lg font-medium leading-tight">{service.title}</p>
                          <Link
                            href={service.href}
                            className="mt-4 inline-flex items-center text-[11px] uppercase tracking-[0.32em] underline underline-offset-4 transition-colors hover:text-white/80"
                          >
                            Discover
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="pointer-events-none absolute -bottom-8 right-0 flex items-center gap-4 text-xs tracking-[0.35em] text-gray-500">
                <span className="pointer-events-auto text-sm font-medium tracking-[0.2em] text-gray-700">
                  {String(current).padStart(2, "0")} / {String(count || services.length).padStart(2, "0")}
                </span>
                <div className="pointer-events-auto flex items-center gap-3 px-8">
                  <button
                    type="button"
                    aria-label="Previous slide"
                    onClick={() => api?.scrollPrev()}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-900"
                  >
                    &#10094;
                  </button>
                  <button
                    type="button"
                    aria-label="Next slide"
                    onClick={() => api?.scrollNext()}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-900"
                  >
                    &#10095;
                  </button>
                </div>
              </div>
            </Carousel>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
