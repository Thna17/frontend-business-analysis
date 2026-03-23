"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ProductShowcaseSection() {
  return (
    <section className="bg-white">
      {/* Full Width Hero Product - PHKA Blush */}
      <div className="relative h-screen w-full overflow-hidden">
        <Image
          src="/product-showcase1.png"
          alt="PHKA Blush campaign"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/40" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.p
            className="text-white text-xs md:text-sm tracking-[0.3em] uppercase mb-6 font-light"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            PHKA Campaign
          </motion.p>

          <motion.h2
            className="text-white text-3xl md:text-5xl lg:text-6xl font-serif mb-8 max-w-4xl leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            PHKA Blush: 7 shades made for live-ready looks
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/campaign/phka-blush-b1g1?utm_source=instagram&utm_medium=reel&utm_campaign=phka-b1g1">
              <button className="text-white text-xs md:text-sm tracking-widest uppercase underline hover:text-gray-200 transition-all duration-300">
                Discover
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Split Section - Model + Product */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left - PHKA model shot */}
        <motion.div
          className="relative h-[60vh] lg:h-screen overflow-hidden"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/product-showcase2.png"
            alt="PHKA Blush model"
            fill
            className="object-cover hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/15 to-black/15" />
        </motion.div>


        {/* Right - Product Details (PHKA Blush) */}
        <motion.div
          className="relative flex min-h-[60vh] lg:min-h-screen items-end justify-center overflow-hidden pb-12"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Background Image */}
          <Image
            src="/product-showcase3.png"
            alt="PHKA Blush product"
            fill
            priority
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/40" />

          {/* Content */}
          <div className="relative z-10 max-w-md text-center ">
            <motion.p
              className="text-xs md:text-sm text-white tracking-wider uppercase mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Official PHKA
            </motion.p>

            <motion.h3
              className="text-2xl md:text-3xl lg:text-4xl font-serif text-white mb-12 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              PHKA Blush Collection
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link href="/campaign/phka-blush-b1g1?utm_source=instagram&utm_medium=reel&utm_campaign=phka-b1g1">
                <button className="text-white text-xs font-medium tracking-widest uppercase underline hover:text-gray-200 transition-all duration-300 text-center">
                  Discover
                </button>
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
