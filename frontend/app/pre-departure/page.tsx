import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  FileText,
  Globe,
  GraduationCap,
  DollarSign,
  HeadphonesIcon,
  Users,
  MessageSquare,
  Briefcase,
  Gamepad2,
  HelpCircle,
  Package
} from 'lucide-react';
import Link from 'next/link';

const benefits = [
  {
    icon: FileText,
    title: 'Visa and Documentation Assistance',
    description: 'Receive expert advice on visa applications and essential documentation to ensure a hassle-free process.',
  },
  {
    icon: Globe,
    title: 'Cultural Orientation',
    description: 'Learn about the cultural nuances and expectations of your destination country to help you adapt smoothly.',
  },
  {
    icon: GraduationCap,
    title: 'Academic Preparation',
    description: 'Understand the academic environment and expectations, including tips on how to excel in your studies abroad.',
  },
  {
    icon: DollarSign,
    title: 'Practical Advice',
    description: 'Get practical tips on everything from packing to managing finances while studying overseas.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Support and Guidance',
    description: 'Benefit from ongoing support from QBIX consultants, even after you have reached your destination.',
  },
];

const activities = [
  {
    icon: Users,
    title: 'Team Building Activities',
    description: 'Engage in fun and interactive team-building exercises to foster camaraderie and teamwork.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: MessageSquare,
    title: 'Informative Sessions',
    description: 'Attend sessions on visa processes, cultural adaptation, and academic expectations. Learn from the experiences of alumni who have successfully transitioned to studying abroad.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Briefcase,
    title: 'Interactive Workshops',
    description: 'Participate in workshops on topics like resume building, SOP (Statement of Purpose) writing, and interview preparation.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Users,
    title: 'Networking Opportunities',
    description: 'Meet and connect with other students who are also preparing to study abroad. Build relationships and create a support network that will be valuable throughout your journey.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Gamepad2,
    title: 'Fun and Games',
    description: 'Enjoy interactive games and activities designed to make learning fun and engaging. Participate in contests and win exciting prizes.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: HelpCircle,
    title: 'Expert Panels and Q&A',
    description: 'Interact with expert panels including QBIX consultants and alumni. Get answers to all your questions and concerns about studying abroad.',
    color: 'from-indigo-500 to-blue-500',
  },
];

export default function PreDeparturePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <section className="relative bg-gradient-to-br from-cobalt-blue to-secondary text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Pre-Departure Event at QBIX Academia</h1>
            <p className="text-xl text-gray-200 mb-8">
              Join us for an engaging and informative pre-departure event to ensure your smooth transition to studying abroad!
            </p>
            <Button asChild size="lg" variant="secondary" className="transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <Link href="/contact">Register Now</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-orange rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Benefits of Attending the Pre-Departure Event</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl group">
                  <CardHeader>
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {benefit.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Happens at the Pre-Departure Event?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The Pre-Departure Event is packed with a variety of activities designed to prepare you for your journey:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <Card key={index} className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl overflow-hidden group">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${activity.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900">{activity.title}</h3>
                        <p className="text-gray-700 leading-relaxed">{activity.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="border-4 border-primary/30 bg-white shadow-2xl">
            <CardContent className="p-10">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">Pre-Departure Kit</h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Receive a comprehensive pre-departure kit with all the necessary information and resources to help you start your journey smoothly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary/10 to-orange/10 rounded-3xl p-10 border-2 border-primary/20">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Pre-Departure Winter 2024</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              The Pre-Departure Winter 2024 event is an essential gathering for students who are about to embark on their academic journey abroad. This event is designed to provide you with comprehensive guidance and support, ensuring you are well-prepared for the challenges and opportunities that lie ahead.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              With a mix of interactive sessions, team activities, and informative briefings, you will gain valuable insights, build connections, and boost your confidence as you prepare to study overseas.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary to-orange text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Join the Adventure</h2>
          <p className="text-xl mb-8 text-white/90 leading-relaxed">
            Ready to embark on your study abroad adventure with confidence? Register now for the Pre-Departure Event at QBIX Academia and take the first step towards a successful academic journey abroad!
          </p>
          <Button asChild size="lg" variant="secondary" className="transition-all duration-300 hover:scale-105 hover:shadow-xl mb-8">
            <Link href="/contact">Register Now</Link>
          </Button>
          <p className="text-base text-white/90 max-w-2xl mx-auto">
            By attending our Pre-Departure Event, you will be fully equipped with the knowledge, skills, and support needed to make the most of your overseas education experience. We look forward to seeing you there!
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
