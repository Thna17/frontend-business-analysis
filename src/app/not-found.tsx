"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background px-4 py-10">
            <div className="dashboard-container">
                <div className="mx-auto max-w-3xl">
                    <div className="dashboard-empty-state min-h-[70vh] justify-center">
                        <div className="dashboard-empty-state-icon">
                            <span className="font-heading text-lg font-semibold text-foreground">404</span>
                        </div>
                        <p className="dashboard-eyebrow">Route unavailable</p>
                        <h2 className="mt-3 font-heading text-4xl font-semibold tracking-[-0.04em] text-foreground md:text-5xl">
                            This workspace page doesn&apos;t exist
                        </h2>
                        <p className="mt-4 mb-10 max-w-xl text-base leading-7 text-muted-foreground">
                            The link may be outdated, the route may have moved, or this area may not belong to your current dashboard flow.
                            Return to your analytics workspace and continue from a known screen.
                        </p>

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Link href="/owner">
                                <Button size="lg" className="px-8">
                                    <Home className="w-4 h-4 mr-2" />
                                    Go to Dashboard
                                </Button>
                            </Link>
                            <Button
                                size="lg"
                                variant="outline"
                                className="px-8"
                                onClick={() => window.history.back()}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Go Back
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
