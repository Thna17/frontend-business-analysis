"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-white px-4">
            <div className="max-w-2xl text-center">
                <h1 className="text-9xl font-serif mb-4 text-gray-200">404</h1>
                <h2 className="text-4xl md:text-5xl font-serif mb-6">
                    Page Not Found
                </h2>
                <p className="text-lg text-gray-600 mb-12 max-w-md mx-auto">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    Let&apos;s get you back to discovering exceptional pieces.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/">
                        <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8">
                            <Home className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                    <Button
                        size="lg"
                        variant="outline"
                        className="border-2 border-black hover:bg-black hover:text-white px-8"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    );
}
