import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Quote, Users, Award, Calendar, Video, Star } from 'lucide-react';
import Link from 'next/link';

const testimonials = [
  {
    name: 'Pradeep Sawase',
    role: 'Parent',
    content: 'My son has recently graduated with his computer science bachelor degree, and I had made my mind to send him abroad immediately after his bachelor studies. I visited many consultancies before visiting QBIX and they all advised me that the process can be initiated and completed in a very short notice without worrying on the SOP-LOR preparation. But after meeting Mr. Altaf Chikodi I was guided that my son have some experience in India and then plan for abroad studies. This was very strange to me that why he was suggesting me to wait! which till date no other consultancy has thought this way. This has actually gave me strong feeling that they are more concerned on developing career rather than just sending students. I strongly recommend to visit QBIX, they will teach you how to be independent rather that just doing the task for you.',
    highlight: 'Unlike others, QBIX advised my son to gain experience before studying abroad. Their focus on long-term career growth truly sets them apart.',
    initials: 'PS',
  },
  {
    name: 'Tejas Chavan',
    role: 'Student',
    content: 'Altaf sir was very helpful and was always present for any doubts. The mock tests were conducted regularly which helped me to perform better in the main test. The material provided was up to date and completely helpful. Thank you Qbix and thank you Altaf sir.',
    highlight: 'Altaf Sir was always there to clear my doubts. Regular mock tests and updated study material really boosted my performance. Thank you, QBIX!',
    initials: 'TC',
  },
  {
    name: 'Ashish Bansal',
    role: 'Student',
    content: 'If anyone wants guidance regarding overseas education, you can approach this place without any hesitation. I joined this place regarding education in Germany and this place fulfilled each and every bit of it. I completed my A2 level German language and Bhagyashree ma\'am never left any topic unturned. And Balukeshwar is the most positive person one can ever meet. He will guide you in the best way. One who enters there will always find positive atmosphere.',
    highlight: 'For overseas education guidance, QBIX is the place to go! I studied German A2 here—Bhagyashree ma\'am was thorough, and Balukeshwar\'s positivity made the journey even better.',
    initials: 'AB',
  },
  {
    name: 'Kavita',
    role: 'Student',
    content: 'First I would like to mention that I found the coaching centre to be very friendly. Even though it is a class but the employees over here and very friendly and cooperative. Altaf sir, my instructor for the IELTS class was very cooperative. He motivates his students in a positive way. He also helps to solve our queries regularly. Although I am into half way of my course, I am much more confident to appear for my IELTS-Exams. Thanks to Altaf Sir, for his support and guidance.',
    highlight: 'QBIX has a friendly, supportive atmosphere. Altaf Sir\'s guidance in IELTS coaching has boosted my confidence—even mid-course, I feel exam-ready!',
    initials: 'K',
  },
  {
    name: 'Pratik',
    role: 'Student',
    content: 'Joined QBix as my friend suggested me and am glad I did... After careful evaluation of my profile got the clear-cut plan from Balukeshwar sir about things to do in a available time to successfully complete the applications before deadline. Got very good support from staff in each and everything starting from reviewing SOPs to sending applications. Thanks to careful planning got admission in one of the best university. Special efforts had been taken so that all students can interact and help each other which will be very important in foreign country. Thanks to QBix family for all the support.',
    highlight: 'Thanks to QBIX\'s clear planning and constant support, I got into a top university. From SOP reviews to peer interaction, everything was on point!',
    initials: 'P',
  },
];

export default function CommunityPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <section className="relative bg-gradient-to-br from-cobalt-blue to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Community</h1>
            <p className="text-2xl font-semibold text-gray-100 mb-4">
              Get Connected, Get Informed, Get Started!
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Welcome to the QBIX Academia community, your one-stop shop for all things study abroad! Here, you'll find everything you need to embark on your incredible journey of overseas education.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-orange rounded-full mb-6">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Get Inspired by our Successful Alumni</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get motivated by real students who achieved their study abroad dreams with QBIX Academia's guidance. Read their stories, learn from their experiences, and see yourself achieving your goals too!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Student Success Stories</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Real journeys from application to graduation, showcasing the diverse paths our students have taken to achieve their dreams.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center mb-4">
                  <Star className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Alumni Network</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Connect with our global alumni community across 15+ countries and learn from their experiences in top universities worldwide.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center mb-4">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Career Achievements</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Discover how QBIX alumni have leveraged their international education to build successful careers in leading organizations.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-orange rounded-full mb-6">
              <Quote className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Hear It From Our Students</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear firsthand what students are saying about QBIX Academia! We'll share written testimonials and video messages packed with valuable insights and genuine experiences.
            </p>
          </div>

          <div className="space-y-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-all duration-300 overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <Avatar className="w-16 h-16 border-4 border-primary">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-orange text-white text-xl font-bold">
                          {testimonial.initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900">{testimonial.name}</h3>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                      <div className="relative">
                        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary opacity-20" />
                        <p className="text-gray-700 leading-relaxed pl-6 mb-4">
                          {testimonial.content}
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-primary/10 to-orange/10 border-l-4 border-primary p-4 rounded-r-lg mt-4">
                        <p className="text-sm italic text-gray-800">
                          "{testimonial.highlight}"
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-orange rounded-full mb-6">
              <Video className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Engaging Webinars & Events</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our live webinars and events (both online and in-person!) where you can connect with experts, ask questions, and gain valuable knowledge about studying abroad. Stay tuned for upcoming events and register today!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Upcoming Events</CardTitle>
                    <CardDescription className="text-base">Live webinars and workshops</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Join our upcoming events to learn about university applications, visa processes, scholarship opportunities, and more from industry experts.
                </p>
                <Button asChild className="w-full">
                  <Link href="/events">View All Events</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center">
                    <Video className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Past Event Highlights</CardTitle>
                    <CardDescription className="text-base">Blogs and recordings</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Missed an event? Browse our collection of past webinar recordings, event photos, and detailed blog posts covering key insights.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/blogs">Read Event Blogs</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
            <p className="text-lg text-gray-700 leading-relaxed">
              <span className="font-semibold text-primary">QBIX Academia</span> is more than just a stepping stone; it's a vibrant community that grows with each student's journey. Join us today and start your own story of success and discovery. Get involved, get inspired, and get ready to explore your global possibilities with QBIX Academia!
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary to-orange text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Growing Community</h2>
          <p className="text-xl mb-8 text-white/90">
            Be part of a network of ambitious students and successful alumni
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <Link href="/contact">Get in Touch</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-300 hover:scale-105">
              <Link href="/events">Register for Events</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
