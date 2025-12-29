'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap, Globe, Users, Target, Award, CheckCircle2, FileText, CreditCard, Home, Plane, FileCheck, DollarSign, Building2, Map, Calendar, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AIAssistant } from '@/components/ui/ai-assistant';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { useEffect, useState, useRef } from 'react';
import { useCounter } from '@/lib/hooks/use-counter';

function AnimatedStat({ end, suffix = '', duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const { count, startCounting } = useCounter(end, duration);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          startCounting();
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [startCounting, hasAnimated]);

  return (
    <div ref={ref} className="text-6xl font-bold bg-gradient-to-r from-orange via-orange-400 to-orange bg-clip-text text-transparent mb-2">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative bg-gradient-to-br from-cobalt-blue via-[#1e2a42] to-[#2a3652] text-white overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjA4Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-60"></div>

        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-2 h-2 bg-orange rounded-full animate-pulse"></div>
            <div className="absolute top-1/4 right-1/4 w-1.5 h-1.5 bg-orange/70 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-orange/50 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-orange/60 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute bottom-1/4 right-1/6 w-1 h-1 bg-orange/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          <svg className="absolute right-0 top-0 h-full w-auto opacity-15" viewBox="0 0 400 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 100 0 L 400 800" stroke="rgba(250,129,17,0.5)" strokeWidth="2" />
            <path d="M 150 0 L 450 800" stroke="rgba(250,129,17,0.3)" strokeWidth="1" />
            <path d="M 50 0 L 350 800" stroke="rgba(250,129,17,0.2)" strokeWidth="1" />
          </svg>
        </div>

        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[700px] h-[700px] opacity-40 pointer-events-none">
          <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="glassGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fa8111" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#2a3652" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#fa8111" stopOpacity="0.8" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="15" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <ellipse cx="200" cy="150" rx="130" ry="110" fill="url(#glassGradient1)" opacity="0.6" filter="url(#glow)" transform="rotate(-30 200 150)">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="-30 200 150"
                to="330 200 150"
                dur="25s"
                repeatCount="indefinite"
              />
            </ellipse>

            <ellipse cx="200" cy="250" rx="150" ry="120" fill="url(#glassGradient1)" opacity="0.5" filter="url(#glow)" transform="rotate(45 200 250)">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="45 200 250"
                to="405 200 250"
                dur="30s"
                repeatCount="indefinite"
              />
            </ellipse>

            <circle cx="200" cy="200" r="80" fill="none" stroke="url(#glassGradient1)" strokeWidth="2" opacity="0.4">
              <animate attributeName="r" values="80;110;80" dur="5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0.6;0.4" dur="5s" repeatCount="indefinite" />
            </circle>

            <circle cx="200" cy="200" r="60" fill="none" stroke="url(#glassGradient1)" strokeWidth="1.5" opacity="0.3">
              <animate attributeName="r" values="60;80;60" dur="4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.5;0.3" dur="4s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-orange/20 rounded-full blur-[130px] animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-orange/15 rounded-full blur-[130px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cobalt-blue/30 rounded-full blur-[100px]"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center z-10">
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
              Transform your dreams
              <br />
              <span className="bg-gradient-to-r from-orange via-orange-400 to-orange bg-clip-text text-transparent animate-gradient">
                into global success
              </span>
              <br />
              with us!
            </h1>

            <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-xl">
              Your trusted partner in overseas education. We provide expert guidance, personalized support, and seamless visa assistance for your journey to top international universities.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange/50 group bg-gradient-to-r from-orange to-orange-600 shadow-lg shadow-orange/30">
                <Link href="/contact">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg border-2 border-orange/40 bg-white/5 backdrop-blur-sm hover:bg-orange/10 hover:border-orange/60 transition-all duration-300 text-white hover:text-white">
                <Link href="/services">
                  Explore Services
                </Link>
              </Button>
            </div>

          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-orange/10 to-transparent rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border-2 border-orange/30 p-12 space-y-10">
                <div className="flex items-center justify-center mb-8">
                  <div className="relative">
                    <div className="absolute inset-0 border-2 border-orange/40 rounded-full animate-spin-slow w-32 h-32"></div>
                    <div className="absolute inset-2 border-2 border-orange/30 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '20s' }}></div>
                    <div className="relative flex items-center justify-center w-32 h-32">
                      <Globe className="w-16 h-16 text-orange" />
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="text-center border-b border-orange/20 pb-6">
                    <AnimatedStat end={3800} suffix="+" duration={2500} />
                    <div className="text-base font-semibold text-white uppercase tracking-wide">Students Assisted</div>
                  </div>

                  <div className="text-center border-b border-orange/20 pb-6">
                    <AnimatedStat end={100} suffix="+" duration={2000} />
                    <div className="text-base font-semibold text-white uppercase tracking-wide">Universities</div>
                  </div>

                  <div className="text-center">
                    <AnimatedStat end={17} duration={1500} />
                    <div className="text-base font-semibold text-white uppercase tracking-wide">Years Experience</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <ScrollReveal>
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Welcome to QBIX Academia!</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Are you ready to embark on an exciting academic journey abroad?
                  At QBIX Academia, our passionate team of overseas education consultants is here to turn your aspirations into reality.
                </p>
                <p className="text-base text-gray-600 leading-relaxed mb-8">
                  With an in-depth understanding of international education systems and application procedures,
                  we've helped thousands of students secure their spots at prestigious institutions globally.
                </p>
                <Button asChild size="lg" className="text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group bg-gradient-to-r from-primary to-orange">
                  <Link href="/contact">
                    Let's make your dream happen!
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150} duration={400}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                <img
                  src="https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Students studying together"
                  loading="lazy"
                  className="relative rounded-2xl shadow-2xl w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-primary to-orange text-white p-6 rounded-xl shadow-xl animate-float">
                  <p className="text-3xl font-bold">3800+</p>
                  <p className="text-sm">Students Assisted</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTSAwIDAgTCA2MCAwIEwgNjAgNjAgTCAwIDYwIFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMDIiLz48L3N2Zz4=')] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '100+', label: 'Top-tier Universities' },
              { number: '17', label: 'Years of Industry Presence' },
              { number: '3800', label: 'Number of Students Assisted' },
              { number: '15+', label: 'Countries Present' },
            ].map((stat, index) => (
              <ScrollReveal key={index} delay={index * 75} duration={400}>
                <div className="text-center group">
                  <div className="text-4xl md:text-5xl font-bold text-gradient mb-3 transition-transform duration-300 group-hover:scale-110">{stat.number}</div>
                  <div className="text-base text-gray-700 font-medium">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-orange/5 to-transparent rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose Us?</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover what makes QBIX Academia the trusted choice for thousands of students pursuing their international education dreams.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'Free Counselling',
                description: 'QBIX provide free profile evaluation & direction to move forward.',
              },
              {
                icon: GraduationCap,
                title: 'Expert University Selection',
                description: 'Our team has in-depth knowledge of universities & programs globally.',
              },
              {
                icon: CheckCircle2,
                title: 'Maximising Success',
                description: 'We help craft strong applications to increase your chances of admission.',
              },
              {
                icon: FileCheck,
                title: 'Visa Guidance Made Easy',
                description: 'We navigate the complexities of visa applications for a smooth transition.',
              },
              {
                icon: Award,
                title: 'Proven Success Stories',
                description: 'We have a strong track record of helping students achieve their study abroad dreams.',
              },
            ].map((feature, index) => (
              <ScrollReveal key={index} delay={index * 70} duration={450}>
                <Card className="border-2 hover:border-primary transition-all duration-500 hover:shadow-2xl group hover:-translate-y-2 h-full bg-white/50 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange rounded-xl flex items-center justify-center mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-muted via-white to-muted relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Comprehensive support for every step of your overseas education journey.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'Career Counseling',
              },
              {
                icon: Building2,
                title: 'University Selection',
              },
              {
                icon: FileText,
                title: 'Admission Guidance',
              },
              {
                icon: FileCheck,
                title: 'Visa Assistance',
              },
              {
                icon: Plane,
                title: 'QBIX Pre-Departure Briefing',
              },
            ].map((service, index) => (
              <ScrollReveal key={index} delay={index * 60} duration={400}>
                <Card className="border-2 hover:border-primary transition-all duration-500 hover:shadow-xl group hover:-translate-y-2 text-center relative overflow-hidden bg-white/80 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-orange/0 group-hover:from-primary/10 group-hover:to-orange/10 transition-all duration-500"></div>
                  <CardHeader className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl shadow-lg animate-pulse-glow">
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{service.title}</CardTitle>
                  </CardHeader>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange/20 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Your Overseas Education Journey Made Effortless!</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6 max-w-3xl mx-auto">
                At QBIX Academia, we're with you every step of the way from your first consultation to visa approval!
              </p>
              <p className="text-base text-gray-600 mb-8 max-w-2xl mx-auto">
                Ready to make your study abroad dreams a reality?
              </p>
              <Button asChild size="lg" className="text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group bg-gradient-to-r from-primary to-orange">
                <Link href="/contact">
                  Get Started!
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Student Profile Evaluation',
                points: [
                  'Free career-oriented counselling with 15+ years of experience',
                  'Emphasis on understanding challenges and future opportunities',
                  'The next step of the process'
                ]
              },
              {
                title: 'University Selection',
                points: [
                  'Selecting/shortlisting suitable universities',
                  'Flawless application assistance',
                  'Guidance with resume building, SOPs, LORs',
                  'Application tracking and follow-ups'
                ]
              },
              {
                title: 'Admission / Application Guidance',
                points: [
                  'Assistance in Education Loans',
                  'Easy loan process with major financial institutions',
                  'Hassle-free documentation',
                  'Quick loan processing'
                ]
              },
              {
                title: 'Foreign Exchange Advisors',
                points: [
                  'Hassle free transactions with major forex dealers',
                  'Assistance with wire transactions, demand drafts, currency exchange'
                ]
              }
            ].map((step, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <Card className="border-2 hover:border-primary/50 transition-all duration-300 h-full bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {step.points.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-base text-gray-600">
                          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              {
                icon: Home,
                title: 'Guidelines for Accommodation',
                points: [
                  'Tailored housing accommodation',
                  'Diverse on-campus and off-campus options',
                  'Budget-friendly living'
                ]
              },
              {
                icon: FileCheck,
                title: 'VISA Documents & Application Guidance',
                points: [
                  'Guidance on visa documentation',
                  'Excellent visa to success ratio',
                  'Mock visa interviews'
                ]
              },
              {
                icon: Plane,
                title: 'QBIX Signature Pre-departure Briefing',
                points: [
                  'Pre-departure event to ease the entry of students',
                  'Pre-departure kit'
                ]
              }
            ].map((service, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <Card className="border-2 hover:border-primary transition-all duration-300 group hover:-translate-y-1 h-full bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <service.icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {service.points.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-base text-gray-600">
                          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 via-muted to-gray-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Success Stories</h2>
              <p className="text-lg text-gray-700 mb-3 font-medium">See it, Believe it!</p>
              <p className="text-base text-gray-600 max-w-3xl mx-auto">Get inspired by real students who achieved their overseas education dreams with QBIX Academia's guidance.</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal delay={80} duration={400}>
              <Card className="border-2 overflow-hidden group hover:border-primary transition-all duration-300 hover:shadow-2xl">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Success story"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <CardTitle className="absolute bottom-4 left-4 text-2xl text-white">Trushanti Shirodkar</CardTitle>
                </div>
                <CardContent className="pt-6">
                  <p className="text-base text-gray-700 leading-relaxed mb-4">
                    An interior designer with a diploma and 10 years of experience faced obstacles due to the gap in her education when applying for programs abroad. Through QBIX's expert guidance, Trushanti secured admission to her desired program. Even more impressively, her visa application received approval in just 3 days – a testament to the effectiveness of QBIX's strategy.
                  </p>
                  <p className="text-base text-gray-700 leading-relaxed">
                    Trushanti's success story exemplifies QBIX's commitment to exceeding expectations. Her ongoing communication and sharing of experiences continue to inspire and motivate others with similar aspirations.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={140} duration={400}>
              <Card className="border-2 overflow-hidden group hover:border-primary transition-all duration-300 hover:shadow-2xl">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/5905857/pexels-photo-5905857.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Doctor success story"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <CardTitle className="absolute bottom-4 left-4 text-2xl text-white">Doctor's Journey</CardTitle>
                </div>
                <CardContent className="pt-6">
                  <p className="text-base text-gray-700 leading-relaxed mb-4">
                    A highly motivated doctor with a 15-year gap since her Homeopathy degree sought QBIX's guidance to pursue a Master's program abroad. Despite her extensive experience, the gap presented challenges. QBIX's strategic approach addressed these obstacles, resulting in a successful admission within a year.
                  </p>
                  <p className="text-base text-gray-700 leading-relaxed">
                    Our commitment extends beyond admissions. We effectively guided the doctor through the visa process, ensuring a smooth transition. QBIX empowers students like this doctor, with significant gaps in education, to achieve their academic goals.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-orange/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Testimonials</h2>
              <p className="text-lg text-gray-700 mb-3 font-medium">Don't just take our word for it!</p>
              <p className="text-base text-gray-600 max-w-3xl mx-auto">Discover what students are saying about their experience with QBIX Academia.</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Rajas Kapure',
                text: 'Balukeshwar Sir is genuinely supportive. His decisive guidance and interview preparation helped me tackle every situation regarding visa queries. Regular mock interviews and Qbix\'s thorough document verification made the entire process seamless.'
              },
              {
                name: 'Abhishek Ghorpade',
                text: 'I had a challenging visa profile, yet Qbix prepared me thoroughly with all possible questions and comprehensive mock interviews. Their efforts were instrumental in my successful US visa application.'
              },
              {
                name: 'Samruddhi Patil',
                text: 'Qbix Academia provides holistic guidance for higher education abroad. They structured every step—from university shortlisting to final visa application—making the German university application process smooth and well-organized.'
              },
              {
                name: 'Amit Taro',
                text: 'My journey to pursue a Master in Management at Frankfurt School was made effortless by Qbix. Their expert support through every stage of the study abroad and visa process was truly exceptional.'
              },
              {
                name: 'Rohan Deshmukh',
                text: 'Qbix Academia is the perfect place for abroad study counseling. Along with a curated university list and one-on-one guidance, I received multiple admits from German public universities. Their systematic approach supports you at every stage.'
              },
            ].map((testimonial, index) => (
              <ScrollReveal key={index} delay={index * 60} duration={400}>
                <Card className="border-2 hover:border-primary/50 transition-all duration-300 group hover:-translate-y-1 h-full bg-white/70 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-orange transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{testimonial.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base text-gray-700 leading-relaxed italic">"{testimonial.text}"</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-muted via-white to-muted relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Join the QBIX Community!</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6 max-w-3xl mx-auto">
                Gain access to expert insights through engaging blog posts on overseas education, inspiring success stories from students who turned dreams into reality, and clear answers to frequently asked questions.
              </p>
              <Button asChild size="lg" className="text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group bg-gradient-to-r from-primary to-orange">
                <Link href="https://instagram.com" target="_blank">
                  <Instagram className="mr-2 w-5 h-5" />
                  Follow us!
                </Link>
              </Button>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal delay={70} duration={400}>
              <Link href="/blogs">
                <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer group bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">Blogs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base text-gray-600">Expert insights and tips for your study abroad journey</p>
                  </CardContent>
                </Card>
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={130} duration={400}>
              <Link href="/case-studies">
                <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer group bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">Success Stories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base text-gray-600">Real stories from students who achieved their dreams</p>
                  </CardContent>
                </Card>
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={190} duration={400}>
              <Link href="/contact">
                <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer group bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">Get in Touch</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base text-gray-600">Have questions? We're here to help!</p>
                  </CardContent>
                </Card>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-orange/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Get Togethers</h2>
              <p className="text-lg text-gray-700 mb-3 font-medium">Connect with Fellow Dreamers!</p>
              <p className="text-base text-gray-600 max-w-3xl mx-auto">
                Attend our upcoming get togethers to connect with fellow students interested
                in studying abroad. Ask questions, connect, share, and gain valuable insights from
                our expert consultants and students.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <Card className="max-w-2xl mx-auto border-2 border-primary hover:shadow-2xl transition-all duration-300 bg-white/70 backdrop-blur-sm">
              <CardHeader className="text-center">
                <Calendar className="w-16 h-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl">Stay Tuned for Upcoming Events!</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-base text-gray-700 leading-relaxed mb-6">
                  We regularly organize events, webinars, and meetups. Check back soon for our next event or contact us to learn more.
                </p>
                <Button asChild size="lg" className="text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group bg-gradient-to-r from-primary to-orange">
                  <Link href="/events">
                    View Events
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}