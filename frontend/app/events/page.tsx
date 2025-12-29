import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Video } from 'lucide-react';
import Link from 'next/link';

export default function EventsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative bg-gradient-to-br from-cobalt-blue to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Events</h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Join our webinars, workshops, and seminars to guide your study abroad journey
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Stay Connected with Our Events</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Participate in our interactive sessions designed to help you make informed decisions about your education abroad
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center mb-4">
                  <Video className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Live Webinars</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Interactive online sessions with Q&A opportunities to learn from experts and ask your questions directly
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">In-Person Workshops</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Hands-on sessions where you can network with fellow students and get personalized guidance from our team
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Special Seminars</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Comprehensive sessions covering specific topics like visa applications, scholarships, and university selection
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-3xl mx-auto border-2 border-primary">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-orange rounded-full mb-6 mx-auto">
                <Calendar className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl md:text-4xl">Upcoming Events</CardTitle>
              <CardDescription className="text-lg mt-4">
                We regularly organize events, webinars, and meetups to help students like you achieve their study abroad dreams
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Our events cover a wide range of topics including university selection, application strategies,
                visa guidance, scholarship opportunities, and pre-departure preparation. Check back soon for our next scheduled event!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="transition-all duration-300 hover:shadow-lg">
                  <Link href="/contact">
                    Get Notified About Events
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="transition-all duration-300 hover:shadow-lg">
                  <Link href="/blogs">
                    Read Event Highlights
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What to Expect at Our Events</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our events are designed to provide maximum value and actionable insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Expert Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Learn from our experienced counselors who have helped thousands of students successfully navigate
                  the study abroad process. Get insider tips and strategies that work.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Interactive Q&A</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Ask your specific questions and get personalized answers. Our events are designed to be interactive,
                  ensuring you leave with clarity on your concerns.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Peer Networking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Connect with fellow students who share similar goals. Build relationships and learn from each
                  other's experiences and perspectives.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Resource Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Receive valuable handouts, checklists, and guides that you can reference throughout your
                  study abroad journey. Take home actionable resources.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary to-orange text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Don't Miss Our Next Event</h2>
          <p className="text-xl mb-8 text-white/90">
            Be the first to know when we announce new events and webinars
          </p>
          <Button asChild size="lg" variant="secondary" className="transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <Link href="/contact">Contact Us to Stay Informed</Link>
          </Button>
        </div>
      </section>

    </div>
  );
}
