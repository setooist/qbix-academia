"use client";

import type React from "react";
import Image from "next/image";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { ArrowRight, CheckCircle } from "lucide-react";
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

  const trustLabels = trustIndicators?.filter((t: any) => t.trustLabel) || [];
  const pillars = trustIndicators?.filter(
    (t: any) => t.pillarTitle || t.pillarDescription
  ) || [];

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-background via-card to-background py-20 md:py-32">
      {backgroundImage?.url && (
        <Image
          src={backgroundImage.url || "/placeholder.svg"}
          alt={backgroundImage.alternativeText || "Hero Background"}
          fill
          className="absolute inset-0 object-cover -z-10 opacity-10"
        />
      )}

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8">
          <p className="text-sm md:text-base font-semibold text-primary mb-4 tracking-widest uppercase">Welcome</p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-4">{mainTitle}</h1>
          {subtitle && <p className="text-xl md:text-2xl text-secondary font-medium">{subtitle}</p>}
        </div>

        {/* Description with better styling */}
        {description && (
          <div className="text-base md:text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            <BlocksRenderer content={description} />
          </div>
        )}

        {/* CTA Button with improved design */}
        {buttonText && buttonLink && (
          <div className="flex justify-center mb-16">
            <CalendorModal
              title={buttonText}
              src={buttonLink}
              buttonStyle="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold hover:shadow-xl hover:shadow-primary/20 transform hover:scale-105 transition-all duration-300"
            >
              {buttonText}
              <ArrowRight className="w-5 h-5" />
            </CalendorModal>
          </div>
        )}

        {/* Trust section redesigned */}
        {trustLabels.length > 0 && (
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-8 max-w-4xl mx-auto mb-16">
            <p className="text-sm font-semibold text-primary mb-6 tracking-wide uppercase">
              Trusted by industry leaders
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trustLabels.map((t: any, idx: number) => (
                <div key={idx} className="flex items-center justify-center gap-3 text-center">
                  <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-foreground font-medium">{t.trustLabel}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mission statement */}
        {missionStatement && (
          <div className="mt-16 max-w-3xl mx-auto mb-16">
            <p className="text-2xl md:text-3xl font-semibold text-foreground leading-relaxed">{missionStatement}</p>
          </div>
        )}

        {/* Pillars cards redesigned */}
        {pillars.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pillars.map((p: any, idx: number) => (
              <div
                key={idx}
                className="bg-card/60 backdrop-blur-sm rounded-xl p-6 border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                {p.pillarTitle && <h3 className="text-lg font-bold text-primary mb-2">{p.pillarTitle}</h3>}
                {p.pillarDescription && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.pillarDescription}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
