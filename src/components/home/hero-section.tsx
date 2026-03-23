"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;

            // Only animate on desktop (CSS will hide/show appropriate layout)
            if (scrollPosition > 60) {
                setIsAnimated(true);
            } else if (scrollPosition <= 60) {
                setIsAnimated(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Premium spring animation - smoother and more refined
    const springConfig = {
        type: "spring" as const,
        stiffness: 60,
        damping: 25,
        mass: 0.8,
    };

    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-neutral-50 to-white">
            {/* MOBILE LAYOUT - All 3 images stacked vertically */}
            <div className="lg:hidden">
                <div className="min-h-screen bg-white">
                    {/* Image 1 - Hero */}
                    <div className="relative h-screen w-full">
                        <Image
                            src="/hero2.png"
                            alt="PHKA Blush collection"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50" />

                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                            <motion.p
                                className="text-white text-3xl md:text-4xl mb-6 leading-tight drop-shadow-2xl font-serif"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                            >
                                PHKA Blush: Glow Like a Flower
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                            >
                                <Link href="/campaign/phka-blush-b1g1?utm_source=facebook&utm_medium=live&utm_campaign=phka-b1g1">
                                    <button className="text-white text-xs font-medium tracking-widest uppercase underline hover:text-gray-200 transition-all duration-300 text-center">
                                        Shop PHKA Blush
                                    </button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>

                    {/* Image 2 - Left collection */}
                    <div className="relative h-[70vh] w-full">
                        <Image
                            src="/hero1.png"
                            alt="PHKA Blush seven shades"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />

                        <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                            <motion.p
                                className="text-white text-xl md:text-2xl mb-4 leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                PHKA Blush - 7 Shades
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <Link href="/new-arrivals">
                                    <button className="text-white text-xs font-medium tracking-widest uppercase underline hover:text-gray-200 transition-all">
                                        Discover
                                    </button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>

                    {/* Image 3 - Right collection */}
                    <div className="relative h-[70vh] w-full">
                        <Image
                            src="/hero3.png"
                            alt="Classic Blush"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />

                        <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                            <motion.p
                                className="text-white text-xl md:text-2xl mb-4 leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                Buy 1 Get 1 PHKA Blush
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <Link href="/campaign/phka-blush-b1g1?utm_source=facebook&utm_medium=live&utm_campaign=phka-b1g1">
                                    <button className="text-white text-xs font-medium tracking-widest uppercase underline hover:text-gray-200 transition-all">
                                        Shop Promo
                                    </button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* DESKTOP LAYOUT - 3-image animation */}
            <div className="hidden lg:block">
                {/* Images Container - Max Width 1346px with better spacing */}
                <div className="relative h-screen flex items-center justify-center gap-6 px-6 mx-auto" style={{ maxWidth: '1346px' }}>
                    {/* Left Image - Slides in from LEFT with hover effect */}
                    <motion.div
                        className="relative overflow-hidden group cursor-pointer"
                        initial={{
                            width: "0%",
                            x: "-100%",
                            opacity: 0
                        }}
                        animate={{
                            width: isAnimated ? "32%" : "0%",
                            x: isAnimated ? "0%" : "-100%",
                            opacity: isAnimated ? 1 : 0,
                        }}
                        transition={springConfig}
                        whileHover={isAnimated ? { scale: 1.02, y: -5 } : {}}
                        style={{ height: '633px' }}
                    >
                        <Image
                            src="/hero1.png"
                            alt="PHKA Blush campaign"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Subtle gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        {/* Shadow enhancement on hover */}
                        <div className="absolute inset-0 shadow-2xl" />

                        {/* Content Overlay - Bottom positioned */}
                        <AnimatePresence>
                            {isAnimated && (
                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 flex flex-col items-center p-8 text-center bg-gradient-to-t from-black/60 to-transparent"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                >
                                    <motion.p
                                        className="text-white text-sm md:text-base mb-3 leading-relaxed"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        PHKA Blush - 7 Shades
                                    </motion.p>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.8 }}
                                    >
                                        <Link href="/new-arrivals">
                                            <button className="text-white text-xs font-medium tracking-widest uppercase underline hover:text-gray-200 transition-all duration-300">
                                                Discover
                                            </button>
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Center Image - Shrinks with premium transition */}
                    <motion.div
                        className="relative overflow-hidden group cursor-pointer"
                        initial={{
                            width: "100%"
                        }}
                        animate={{
                            width: isAnimated ? "32%" : "100%"
                        }}
                        transition={springConfig}
                        whileHover={isAnimated ? { scale: 1.02, y: -5 } : {}}
                        style={{ height: '633px' }}
                    >
                        <Image
                            src="/hero2.png"
                            alt="PHKA official collection"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            priority
                        />
                        {/* Enhanced dark overlay for text readability */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/40"
                            animate={{
                                opacity: isAnimated ? 0.3 : 0.4,
                            }}
                        />
                        {/* Hover gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        {/* Premium shadow */}
                        <div className="absolute inset-0 shadow-2xl" />

                        {/* Content Overlay - Centered and more prominent */}
                        <motion.div
                            className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            <motion.p
                                className="text-white text-lg md:text-3xl lg:text-5xl mb-6 max-w-lg leading-relaxed drop-shadow-2xl font-serif"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                            >
                                PHKA Blush: Glow Like a Flower
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 }}
                            >
                                <Link href="/campaign/phka-blush-b1g1?utm_source=facebook&utm_medium=live&utm_campaign=phka-b1g1">
                                    <button className="text-white text-xs font-medium tracking-widest uppercase underline hover:text-gray-200 transition-all duration-300 text-center">
                                        Shop Collection
                                    </button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Right Image - Slides in from RIGHT with hover effect */}
                    <motion.div
                        className="relative overflow-hidden group cursor-pointer"
                        initial={{
                            width: "0%",
                            x: "100%",
                            opacity: 0
                        }}
                        animate={{
                            width: isAnimated ? "32%" : "0%",
                            x: isAnimated ? "0%" : "100%",
                            opacity: isAnimated ? 1 : 0,
                        }}
                        transition={springConfig}
                        whileHover={isAnimated ? { scale: 1.02, y: -5 } : {}}
                        style={{ height: '633px' }}
                    >
                        <Image
                            src="/hero3.png"
                            alt="PHKA blush promo"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Subtle gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        {/* Shadow enhancement */}
                        <div className="absolute inset-0 shadow-2xl" />

                        {/* Content Overlay - Bottom positioned */}
                        <AnimatePresence>
                            {isAnimated && (
                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end p-8 text-center bg-gradient-to-t from-black/60 to-transparent"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                >
                                    <motion.p
                                        className="text-white text-sm md:text-base mb-3 leading-relaxed"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                    >
                                        Buy 1 Get 1 PHKA Blush
                                    </motion.p>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.0 }}
                                    >
                                        <Link href="/campaign/phka-blush-b1g1?utm_source=facebook&utm_medium=live&utm_campaign=phka-b1g1">
                                            <button className="text-white text-xs font-medium tracking-widest uppercase underline hover:text-gray-200 transition-all duration-300 text-center">
                                                Shop Promo
                                            </button>
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Enhanced Scroll Indicator - Desktop only */}
                <AnimatePresence>
                    {!isAnimated && (
                        <motion.div
                            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.6, delay: 1.2 }}
                        >
                            <motion.div
                                className="flex flex-col items-center text-white drop-shadow-lg"
                                animate={{ y: [0, 12, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <span className="text-xs md:text-sm mb-2 tracking-[0.3em] font-light uppercase">
                                    Scroll to Explore
                                </span>
                                <motion.div
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <ChevronDown className="w-6 h-6" />
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Spacer for scrolling */}
                <div className="h-[300px]" />
            </div>
        </section>
    );
}
