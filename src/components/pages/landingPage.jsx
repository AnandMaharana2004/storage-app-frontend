import React from "react";
import Navbar from "../navbar";
import HeroSection from "../heroSection";
// import { Features } from "tailwindcss";
import Pricing from "../pricing";
import Footer from "../footer";
import Features from "../features";

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <HeroSection />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
}

export default LandingPage;
