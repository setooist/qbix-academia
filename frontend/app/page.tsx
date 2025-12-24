'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap, Globe, Users, Target, Award, CheckCircle2, FileText, CreditCard, Home, Plane, FileCheck, DollarSign, Building2, Map, Calendar, Instagram } from 'lucide-react';
import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AIAssistant } from '@/components/ui/ai-assistant';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { GradientMesh } from '@/components/ui/gradient-mesh';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const heroSlides = [
    {
      title: 'Unlock Your Global Potential',
      subtitle: 'Personalised guidance, expert university selection, and seamless visa support.',
      cta: 'Get your free consultation today!',
      link: '/contact'
    },
    {
      title: 'From Stepping Stone to Success',
      subtitle: 'Forge your route to success from day 1',
      description: 'QBIX Academia - Your trusted partner for overseas education success.',
      cta: 'Enquire Now',
      link: '/contact'
    },
    {
      title: 'Flight to Your Dreams Come True',
      subtitle: 'Study in destinations Germany | US | UK | Canada | Malaysia | Ireland | Australia | New Zealand',
      cta: 'Know More',
      link: '/services'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      {/* <AIAssistant /> */}

      <section className="relative bg-gradient-to-br from-cobalt-blue via-secondary to-cobalt-blue text-white overflow-hidden h-[600px]">
        <GradientMesh />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.2 }} />
                <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            <circle cx="200" cy="150" r="120" fill="url(#grad1)" />
            <circle cx="800" cy="250" r="180" fill="url(#grad1)" />
            <circle cx="150" cy="700" r="150" fill="url(#grad1)" />
            <circle cx="850" cy="800" r="200" fill="url(#grad1)" />
            <path d="M 300 400 Q 500 300 700 400" stroke="white" strokeWidth="2" fill="none" opacity="0.1" />
            <path d="M 200 600 Q 500 500 800 600" stroke="white" strokeWidth="2" fill="none" opacity="0.1" />
          </svg>
        </div>
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-xl md:text-2xl text-gray-200 mb-4 leading-relaxed">
                  {slide.subtitle}
                </p>
                {slide.description && (
                  <p className="text-lg text-gray-300 mb-8">
                    {slide.description}
                  </p>
                )}
                <Button asChild size="lg" className="text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl group">
                  <Link href={slide.link}>
                    {slide.cta}
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
                }`}
            />
          ))}
        </div>
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
                <p className="text-xl text-gray-700 leading-relaxed mb-4">
                  Are you ready to embark on an exciting academic journey abroad?
                </p>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  At QBIX Academia, our passionate team of overseas education consultants is here to turn your aspirations into reality.
                  With an in-depth understanding of international education systems and application procedures,
                  we've helped thousands of students secure their spots at prestigious institutions globally.
                </p>
                <Button asChild size="lg" className="text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl magnetic-button group bg-gradient-to-r from-primary to-orange">
                  <Link href="/contact">
                    Let's make your dream happen!
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                <img
                  src="https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Students studying together"
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

      <section className="py-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTSAwIDAgTCA2MCAwIEwgNjAgNjAgTCAwIDYwIFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMDIiLz48L3N2Zz4=')] opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '100+', label: 'Top-tier Universities' },
              { number: '17', label: 'Years of Industry Presence' },
              { number: '3800', label: 'Number of Students Assisted' },
              { number: '15+', label: 'Countries Present' },
            ].map((stat, index) => (
              <ScrollReveal key={index} delay={index * 100}>
                <div className="text-center group">
                  <div className="text-4xl md:text-5xl font-bold text-gradient mb-2 transition-transform duration-300 group-hover:scale-110">{stat.number}</div>
                  <div className="text-sm md:text-base text-foreground">{stat.label}</div>
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
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Us?</h2>
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
              <ScrollReveal key={index} delay={index * 100}>
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
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Services</h2>
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
              <ScrollReveal key={index} delay={index * 80}>
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
              <p className="text-xl text-gray-700 mb-4">
                At QBIX Academia, we're with you every step of the way from your first consultation to visa approval!
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Ready to make your study abroad dreams a reality?
              </p>
              <Button asChild size="lg" className="text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl magnetic-button bg-gradient-to-r from-primary to-orange group">
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
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {step.points.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
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
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <service.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.points.map((point, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
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
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Success Stories</h2>
              <p className="text-xl text-gray-700 mb-2">See it, Believe it!</p>
              <p className="text-gray-600">Get inspired by real students who achieved their overseas education dreams with QBIX Academia's guidance.</p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal delay={100}>
              <Card className="border-2 overflow-hidden group hover:border-primary transition-all duration-300 hover:shadow-2xl">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Success story"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <CardTitle className="absolute bottom-4 left-4 text-2xl text-white">Trushanti Shirodkar</CardTitle>
                </div>
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    An interior designer with a diploma and 10 years of experience faced obstacles due to the gap in her education when applying for programs abroad. Through QBIX's expert guidance, Trushanti secured admission to her desired program. Even more impressively, her visa application received approval in just 3 days – a testament to the effectiveness of QBIX's strategy.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    Trushanti's success story exemplifies QBIX's commitment to exceeding expectations. Her ongoing communication and sharing of experiences continue to inspire and motivate others with similar aspirations.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <Card className="border-2 overflow-hidden group hover:border-primary transition-all duration-300 hover:shadow-2xl">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/5905857/pexels-photo-5905857.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Doctor success story"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <CardTitle className="absolute bottom-4 left-4 text-2xl text-white">Doctor's Journey</CardTitle>
                </div>
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed">
                    A highly motivated doctor with a 15-year gap since her Homeopathy degree sought QBIX's guidance to pursue a Master's program abroad. Despite her extensive experience, the gap presented challenges. QBIX's strategic approach addressed these obstacles, resulting in a successful admission within a year.
                  </p>
                  <p className="text-gray-700 leading-relaxed mt-4">
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
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Testimonials</h2>
              <p className="text-xl text-gray-700">Don't just take our word for it!</p>
              <p className="text-gray-600">Discover what students are saying about their experience with QBIX Academia.</p>
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
              <ScrollReveal key={index} delay={index * 80}>
                <Card className="border-2 hover:border-primary/50 transition-all duration-300 group hover:-translate-y-1 h-full bg-white/70 backdrop-blur-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-orange transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  <CardHeader>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">{testimonial.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 text-sm leading-relaxed italic">"{testimonial.text}"</p>
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
              <p className="text-xl text-gray-700 mb-4">
                Gain access to expert insights through engaging blog posts on overseas education,
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Inspiring success stories from students who turned dreams into reality &
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Clear answers to frequently asked questions.
              </p>
              <Button asChild size="lg" className="text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl magnetic-button bg-gradient-to-r from-primary to-orange">
                <Link href="https://instagram.com" target="_blank">
                  <Instagram className="mr-2 w-5 h-5" />
                  Follow us!
                </Link>
              </Button>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal delay={100}>
              <Link href="/blogs">
                <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer group bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">Blogs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Expert insights and tips for your study abroad journey</p>
                  </CardContent>
                </Card>
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <Link href="/case-studies">
                <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer group bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">Success Stories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Real stories from students who achieved their dreams</p>
                  </CardContent>
                </Card>
              </Link>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <Link href="/contact">
                <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer group bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">Get in Touch</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Have questions? We're here to help!</p>
                  </CardContent>
                </Card>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Get Togethers</h2>
            <p className="text-xl text-gray-700 mb-2">Connect with Fellow Dreamers!</p>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Attend our upcoming get togethers to connect with fellow students interested
              in studying abroad. Ask questions, connect, share, and gain valuable insights from
              our expert consultants and students.
            </p>
          </div>

          <Card className="max-w-2xl mx-auto border-2 border-primary">
            <CardHeader className="text-center">
              <Calendar className="w-16 h-16 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl">Stay Tuned for Upcoming Events!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700 mb-6">
                We regularly organize events, webinars, and meetups. Check back soon for our next event or contact us to learn more.
              </p>
              <Button asChild size="lg">
                <Link href="/events">
                  View Events
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
