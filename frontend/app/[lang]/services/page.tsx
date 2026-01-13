import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, GraduationCap, FileText, Globe, Users, Award, BookOpen, MessageSquare, UserCheck, Building2, FilePen, FileCheck, Briefcase, DollarSign, Banknote, Home, Plane } from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: UserCheck,
    title: 'Student Profile Evaluation',
    description: 'Our experts analyse your academics, test scores, extracurricular activities for profile evaluation. After a comprehensive analysis, we identify your strengths, area of improvement, and universities that best align with your academic profile and career goals.',
    number: '01',
  },
  {
    icon: Building2,
    title: 'University Selection',
    description: 'Choosing the right university is crucial for your academic success. QBIX Academia leverages our extensive knowledge of universities worldwide to identify programs that perfectly match your aspirations and academic background. We consider factors such as program curriculum, faculty expertise, research opportunities, campus life, and location to provide you with a tailored university shortlist.',
    number: '02',
  },
  {
    icon: FilePen,
    title: 'Admission / Application Guidance',
    description: 'Our team provides step-by-step guidance on completing online application forms, crafting compelling essays (SOPs) and personal statements, and requesting letters of recommendation. We ensure your application package showcases your unique qualifications and highlights your potential for success at your chosen universities.',
    number: '03',
  },
  {
    icon: FileCheck,
    title: 'Document Verification Support',
    description: 'Our meticulous team ensures all your application documents, transcripts, and letters of recommendation are properly formatted, translated if necessary, and submitted by the deadlines. We provide guidance on official document procurement and verification processes to avoid delays or application rejections.',
    number: '04',
  },
  {
    icon: Briefcase,
    title: 'Profile Building - (CV, SOP & LOR)',
    description: 'Beyond your academic records, universities seek well-rounded individuals. QBIX Academia assists you in crafting a stellar CV (resume) that highlights your skills, experiences, and achievements. We also guide you in writing impactful personal statements (SOPs) that showcase your motivations, future goals, and suitability for the program. We offer support in requesting strong letters of recommendation from professors or relevant professionals who can speak to your potential.',
    number: '05',
  },
  {
    icon: DollarSign,
    title: 'Assistance in Education Loans',
    description: 'Navigating education loan options can be overwhelming. QBIX Academia partners with reputable education loan providers to help you secure the financial support necessary for your studies abroad. We can guide you through the application process and ensure you understand the loan terms and conditions.',
    number: '06',
  },
  {
    icon: Banknote,
    title: 'Foreign Exchange Advisors',
    description: 'Our partnered foreign exchange advisors can assist you in managing currency exchange and international payments in a cost-effective and secure manner.',
    number: '07',
  },
  {
    icon: Home,
    title: 'Guidelines for Accommodation',
    description: 'Finding suitable accommodation abroad can be challenging. QBIX Academia provides guidance on exploring student housing options, dorms, or off-campus apartments that cater to your needs and budget.',
    number: '08',
  },
  {
    icon: FileText,
    title: 'VISA Documents & Application Guidance',
    description: 'The visa application process can be complex and vary depending on your destination country. QBIX Academia offers comprehensive guidance on visa requirements, document preparation, and application procedures.',
    number: '09',
  },
  {
    icon: MessageSquare,
    title: 'VISA Interview Preparations',
    description: 'We provide interview preparation tips and mock interviews to help you confidently navigate the visa interview process and increase your chances of success.',
    number: '10',
  },
  {
    icon: Plane,
    title: 'QBIX Signature Pre-departure Briefing',
    description: 'Prior to departure, QBIX Academia conducts a comprehensive pre-departure briefing to prepare you for a smooth transition to your new academic environment. This briefing covers essential topics such as cultural adjustment, academic expectations, visa regulations, health insurance, banking options, and local transportation.',
    number: '11',
  },
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen">

      <section className="relative bg-gradient-to-br from-cobalt-blue to-secondary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Services background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-gray-200 mb-4">
              Unlock a World of Possibilities! Study abroad with QBIX
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              QBIX Academia offers a comprehensive suite of services to support you throughout your entire overseas education journey. We guide you from initial consultation to visa application and pre-departure preparation.
            </p>
            <p className="text-lg text-gray-300 mt-4">
              Let's see how we can make your study abroad dreams come true.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-all duration-500 hover:shadow-2xl group">
                <CardHeader>
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <div className="absolute -top-2 -left-2 text-6xl font-bold text-gray-100 z-0">
                        {service.number}
                      </div>
                      <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-primary to-orange rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-lg">
                        <service.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-3 group-hover:text-primary transition-colors duration-300">
                        {service.title}
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-base leading-relaxed mt-4">
                    {service.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Why Choose QBIX Academia?</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              With 17 years of industry experience and a proven track record, we have helped thousands of students achieve their dreams of studying abroad.
            </p>
            <div className="grid md:grid-cols-4 gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">100+</div>
                <div className="text-gray-600">Top-tier Universities</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">17</div>
                <div className="text-gray-600">Years of Industry Presence</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">3800</div>
                <div className="text-gray-600">Students Assisted</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">15+</div>
                <div className="text-gray-600">Countries Present</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary to-orange text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-white/90">
            Book a free consultation with our expert counselors today
          </p>
          <Button asChild size="lg" variant="secondary" className="transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <Link href="/contact">Schedule Consultation</Link>
          </Button>
        </div>
      </section>

    </div>
  );
}
