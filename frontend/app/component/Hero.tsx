"use client";

import React from "react";
import Image from "next/image";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { CheckCircle } from "lucide-react";
import CalendorModal from "./CalendorModal";

interface HeroProps {
  data: any; // Strapi Hero object
}

const Hero: React.FC<HeroProps> = ({ data }) => {
  const {
    mainTitle,
    subtitle,
    description,
    buttonText,
    buttonLink,
    missionStatement,
    backgroundImage,
    trustLabel,
    trustIndicators, // array of { trustLabel?, pillarTitle?, pillarDescription? }
  } = data;

  // Handle trustLabels (above mission statement)
  const trustLabels = trustIndicators?.filter((t: any) => t.trustLabel) || [];

  // Handle pillars/cards (below mission statement)
  const pillars = trustIndicators?.filter(
    (t: any) => t.pillarTitle || t.pillarDescription
  ) || [];

  return (
    <section className="relative w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#F6F5F2] via-white to-[#FFEECA]/20 py-10">

      {/* Background Image */}
      {backgroundImage?.url && (
        <Image
          src={backgroundImage.url}
          alt={backgroundImage.alternativeText || "Hero Background"}
          fill
          className="absolute inset-0 object-cover -z-10 opacity-20"
        />
      )}

      {/* Decorative Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-[#5D491B]/10 to-[#927949]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-[#FFEECA]/30 to-[#5D491B]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-[#927949]/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Titles */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#5D491B] leading-tight mb-6">
          <span className="block">{mainTitle}</span>
          {subtitle && (
            <span className="block text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-normal text-[#927949] mt-2">
              {subtitle}
            </span>
          )}
        </h1>

        {/* Description */}
        {description && (
          <div className="text-lg sm:text-xl text-[#927949] mb-12 max-w-6xl mx-auto leading-relaxed">
            <BlocksRenderer content={description} />
          </div>
        )}

        {/* CTA Button */}
        {buttonText && buttonLink && (
          <CalendorModal
            title={buttonText}
            src={buttonLink}
            buttonStyle="inline-flex items-center space-x-3 bg-gradient-to-r from-[#5D491B] to-[#927949] text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 mb-16"
          />
        )}

        {/* Trust Labels above mission statement */}
        {/* Trust Indicators */}
        {trustLabels.length > 0 && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-[#FFEECA] p-8 max-w-4xl mx-auto mb-12">
            <p className="text-lg font-semibold text-[#5D491B] mb-6 text-center">
              Your trusted partner in
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trustLabels.map((t: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-center space-x-3"
                >
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <span className="text-[#5D491B] font-medium">{t.trustLabel}</span>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Mission Statement */}
        {missionStatement && (
          <div className="mt-16 max-w-3xl mx-auto">
            <p className="text-xl text-[#5D491B] leading-relaxed text-center">
              {missionStatement}
            </p>
          </div>
        )}

        {/* Pillars with CheckCircle */}
        {pillars.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            {pillars.map((p: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-center space-x-3 bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[#FFEECA] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-left">
                  {p.pillarTitle && (
                    <h3 className="text-lg font-bold text-[#5D491B] mb-1">
                      {p.pillarTitle}
                    </h3>
                  )}
                  {p.pillarDescription && (
                    <p className="text-[#927949]">{p.pillarDescription}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
