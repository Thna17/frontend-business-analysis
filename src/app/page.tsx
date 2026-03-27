import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import CompetencySection from "@/components/landing/CompetencySection";
import PricingSection from "@/components/landing/PricingSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import "./style.css"

export default function HomePage() {
  return (
    <main className="landing-page">
      <Navbar />
      <HeroSection />
      <CompetencySection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  );
}