"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, X, User, Heart, ChevronDown } from "lucide-react";
import { NAVIGATION_ITEMS } from "@/constants";
import { useCart } from "@/contexts/cart-context";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { cn } from "@/lib/utils";
import { loadUserFromStorage } from "@/store/slices/authSlice";

export default function Header() {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
    const mounted = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false
    );
    const { itemCount } = useCart();

    useEffect(() => {
        dispatch(loadUserFromStorage());
    }, [dispatch]);

    const closeMenu = () => {
        setIsMobileMenuOpen(false);
        setActiveSubmenu(null);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled
                    ? "bg-white/95 backdrop-blur-md shadow-sm"
                    : "bg-transparent"
            )}
        >
            {/* Announcement Bar */}
            {/* <div className="bg-black text-white text-center py-2 text-xs md:text-sm tracking-wide">
                FREE SHIPPING ON ORDERS OVER $200 • COMPLIMENTARY GIFT WRAPPING
            </div> */}

            {/* Main Header */}
            <div className=" mx-auto px-2 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Menu Button */}
                    <button
                        className="p-2 rounded-full hover:bg-black/5 transition-colors"
                        onClick={() => setIsMobileMenuOpen(true)}
                        aria-label="Open menu"
                    >
                        <Image
                            src="/burger-menu.png"
                            alt="Menu"
                            width={24}
                            height={24}
                            className="h-6 w-6"
                            priority
                        />
                    </button>

                    {/* Logo */}
                    <Link
                        href="/"
                        className="absolute left-1/2 -translate-x-1/2"
                        aria-label="Home"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={120}
                                height={80}
                                className="h-12 md:h-18 w-auto"
                                priority
                            />
                        </motion.div>
                    </Link>

                    {/* Right Icons */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:text-gray-600 transition-colors" aria-label="Search">
                            <Search className="w-5 h-5" />
                        </button>

                        {!mounted ? (
                            // Show neutral state during SSR to prevent hydration mismatch
                            <div className="hidden md:block p-2">
                                <User className="w-5 h-5 text-gray-400" />
                            </div>
                        ) : isAuthenticated ? (
                            <Link href="/account" className="hidden md:block p-2 hover:text-gray-600 transition-colors">
                                <User className="w-5 h-5" />
                            </Link>
                        ) : (
                            <Link href="/login" className="hidden md:flex items-center text-sm font-medium hover:text-gray-600 transition-colors uppercase tracking-wider px-2">
                                Log in
                            </Link>
                        )}

                        <Link href="/wishlist" className="hidden md:block p-2 hover:text-gray-600 transition-colors">
                            <Heart className="w-5 h-5" />
                        </Link>
                        <Link href="/cart" className="relative p-2 hover:text-gray-600 transition-colors">
                            <ShoppingBag className="w-5 h-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Sidebar Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.button
                            type="button"
                            className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMenu}
                            aria-label="Close menu"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 260, damping: 30 }}
                            className="fixed top-0 left-0 h-full w-[86%] max-w-[380px] bg-white shadow-2xl"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Site navigation"
                        >
                            <div className="flex items-center justify-between px-6 py-5 border-b">
                                <span className="text-xs tracking-[0.35em] uppercase text-gray-500">Menu</span>
                                <button
                                    className="p-2 rounded-full hover:bg-black/5 transition-colors"
                                    onClick={closeMenu}
                                    aria-label="Close menu"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <nav className="px-6 py-6 space-y-3">
                                {NAVIGATION_ITEMS.map((item) => {
                                    const isOpen = activeSubmenu === item.name;
                                    return (
                                        <div key={item.name} className="border-b border-gray-100 pb-3">
                                            <div className="flex items-center justify-between">
                                                <Link
                                                    href={item.href}
                                                    className="text-sm tracking-wider uppercase py-2 hover:text-gray-600 transition-colors"
                                                    onClick={closeMenu}
                                                >
                                                    {item.name}
                                                </Link>
                                                {item.submenu && (
                                                    <button
                                                        type="button"
                                                        className="p-2 text-gray-500 hover:text-black transition-colors"
                                                        onClick={() =>
                                                            setActiveSubmenu(isOpen ? null : item.name)
                                                        }
                                                        aria-label={`Toggle ${item.name} submenu`}
                                                    >
                                                        <ChevronDown
                                                            className={cn(
                                                                "h-4 w-4 transition-transform",
                                                                isOpen ? "rotate-180" : "rotate-0"
                                                            )}
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                            {item.submenu && (
                                                <AnimatePresence>
                                                    {isOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="pl-3 pt-1 space-y-2 overflow-hidden"
                                                        >
                                                            {item.submenu.map((subitem) => (
                                                                <Link
                                                                    key={subitem.name}
                                                                    href={subitem.href}
                                                                    className="block text-sm text-gray-600 py-1 hover:text-black transition-colors"
                                                                    onClick={closeMenu}
                                                                >
                                                                    {subitem.name}
                                                                </Link>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            )}
                                        </div>
                                    );
                                })}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
