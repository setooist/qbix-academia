import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Users, Target, BookOpen, GraduationCap, Globe } from 'lucide-react';
import Link from 'next/link';

export default function TeamPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <section className="relative bg-gradient-to-br from-cobalt-blue to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Team</h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Meet the dedicated experts guiding your study abroad journey
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Passionate Experts Committed to Your Success</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our team of experienced counselors brings together decades of expertise in international education
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold">17 Years of Excellence</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Since our inception, QBIX Academia has been built on a foundation of expertise, integrity,
                and unwavering commitment to student success. Our team comprises seasoned professionals
                who have guided thousands of students to prestigious institutions worldwide.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Each team member brings unique insights from their specialized areas, whether it's visa
                guidance, university selection, application strategy, or pre-departure preparation. Together,
                we form a comprehensive support system dedicated to making your study abroad dreams a reality.
              </p>
            </div>

            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle className="text-2xl">What Sets Our Team Apart</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Proven Track Record</h4>
                    <p className="text-gray-600">3800+ successful student placements in top universities globally</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Global Network</h4>
                    <p className="text-gray-600">Strong relationships with 100+ universities across 15+ countries</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Personalized Approach</h4>
                    <p className="text-gray-600">Individual attention to understand and fulfill each student's unique aspirations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Areas of Expertise</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive support across every aspect of your study abroad journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center mb-4">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Career Counseling</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Expert guidance to align your education choices with long-term career goals and aspirations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center mb-4">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">University Selection</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  In-depth knowledge of global institutions to match you with programs that fit your profile
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Application Strategy</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Meticulous support in crafting compelling applications that showcase your unique strengths
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-3xl mx-auto border-2 border-primary">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-orange rounded-full mb-6 mx-auto">
                <Users className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl md:text-4xl">Meet Our Counselors</CardTitle>
              <CardDescription className="text-lg mt-4">
                Schedule a consultation to meet our team of experts personally
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Our counselors are not just advisors—they're partners in your educational journey. Each brings
                specialized knowledge, genuine passion, and a proven commitment to student success. Get to know
                them through a free consultation where they'll take the time to understand your aspirations and
                provide personalized guidance.
              </p>
              <Button asChild size="lg" className="transition-all duration-300 hover:shadow-lg">
                <Link href="/contact">
                  Schedule a Free Consultation
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary to-orange text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-white/90">
            Our team is here to guide you every step of the way
          </p>
          <Button asChild size="lg" variant="secondary" className="transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <Link href="/contact">Get in Touch with Our Team</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
