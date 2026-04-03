"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, Facebook } from "lucide-react";
import { FOOTER_LINKS, SITE_CONFIG } from "@/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle newsletter subscription
        setSubscribed(true);
        setTimeout(() => {
            setEmail("");
            setSubscribed(false);
        }, 3000);
    };

    return (
        <footer className="bg-white border-t">
            <div className="container mx-auto px-4 lg:px-8 pt-16 pb-10">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
                    {/* Newsletter */}
                    <div className="max-w-md">
                        <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
                            STAY TUNED.
                        </h3>
                        <p className="text-sm text-gray-600 mt-3 mb-8">
                            Sign up to receive exclusive offers.
                        </p>
                        <form
                            onSubmit={handleSubscribe}
                            className="space-y-4"
                            suppressHydrationWarning
                        >
                            <Input
                                type="email"
                                placeholder="E-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11 border-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
                                suppressHydrationWarning
                            />
                            <Button
                                type="submit"
                                className="w-full h-11 bg-black text-white hover:bg-black/90 uppercase tracking-[0.2em] text-xs"
                            >
                                {subscribed ? "Subscribed!" : "Subscribe"}
                            </Button>
                        </form>
                    </div>

                    {/* Links + Badge */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
                        <div>
                            <h4 className="text-xs font-semibold tracking-[0.25em] uppercase mb-4 text-gray-700">
                                Company
                            </h4>
                            <ul className="space-y-2">
                                {FOOTER_LINKS.company.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-gray-600 hover:text-black transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-semibold tracking-[0.25em] uppercase mb-4 text-gray-700">
                                Shop
                            </h4>
                            <ul className="space-y-2">
                                {FOOTER_LINKS.shop.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-gray-600 hover:text-black transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col gap-6">
                            <div>
                                <h4 className="text-xs font-semibold tracking-[0.25em] uppercase mb-4 text-gray-700">
                                    Customer Care
                                </h4>
                                <ul className="space-y-2">
                                    {FOOTER_LINKS.service.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-sm text-gray-600 hover:text-black transition-colors"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="hidden lg:flex justify-end">
                                <div className="h-14 w-14 rounded-full border border-black/70 flex items-center justify-center">
                                    <Image
                                        src="/logo-ui.png"
                                        alt={`${SITE_CONFIG.name} logo`}
                                        width={36}
                                        height={36}
                                        className="h-9 w-9 object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-dashed border-gray-300" />
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pt-6">
                    <div className="flex items-center gap-5 text-gray-700">
                        <Link
                            href={SITE_CONFIG.links.twitter}
                            className="hover:text-black transition-colors"
                            aria-label="Twitter"
                        >
                            <Twitter className="h-5 w-5" />
                        </Link>
                        <Link
                            href={SITE_CONFIG.links.instagram}
                            className="hover:text-black transition-colors"
                            aria-label="Instagram"
                        >
                            <Instagram className="h-5 w-5" />
                        </Link>
                        <Link
                            href={SITE_CONFIG.links.facebook}
                            className="hover:text-black transition-colors"
                            aria-label="Facebook"
                        >
                            <Facebook className="h-5 w-5" />
                        </Link>
                    </div>
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
                    </p>
                    <div className="md:hidden flex justify-start">
                        <div className="h-12 w-12 rounded-full border border-black/70 flex items-center justify-center">
                            <Image
                                src="/logo-ui.png"
                                alt={`${SITE_CONFIG.name} logo`}
                                width={32}
                                height={32}
                                className="h-8 w-8 object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}



