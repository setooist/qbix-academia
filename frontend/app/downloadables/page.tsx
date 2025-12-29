import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckSquare, BookOpen, FileCheck, Download, Globe } from 'lucide-react';
import Link from 'next/link';

export default function DownloadablesPage() {
  return (
    <div className="flex flex-col min-h-screen">

      <section className="relative bg-gradient-to-br from-cobalt-blue to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Downloadables</h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Free resources, guides, and checklists to support your study abroad journey
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Free Resources to Guide Your Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access comprehensive guides, checklists, and tools designed to simplify your study abroad process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center mb-4">
                  <CheckSquare className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Application Checklists</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Step-by-step checklists to ensure you don't miss any critical requirements in your application process
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Country Guides</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Detailed guides covering education systems, visa processes, and living costs for popular study destinations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center mb-4">
                  <FileCheck className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl">Document Templates</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Professional templates for SOPs, resumes, and letters that meet international standards
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
                <FileText className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl md:text-4xl">Resources Coming Soon</CardTitle>
              <CardDescription className="text-lg mt-4">
                We're preparing comprehensive downloadable resources to support every step of your journey
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Our team is currently developing a library of valuable resources including detailed country guides,
                application checklists, document templates, scholarship databases, and pre-departure guides. These
                materials will be available to download and use throughout your study abroad planning process.
              </p>
              <p className="text-gray-700 leading-relaxed">
                In the meantime, our counselors can provide personalized guidance and share relevant materials
                during your consultation.
              </p>
              <Button asChild size="lg" className="transition-all duration-300 hover:shadow-lg">
                <Link href="/contact">
                  Contact Us for Resources
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">What You Can Expect</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our downloadables will cover comprehensive aspects of studying abroad
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Application Process Guides</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Comprehensive guides walking you through the application process for different countries,
                  including timeline planning, document preparation, and submission procedures.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Visa Documentation Checklists</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Country-specific checklists ensuring you have all required documents prepared correctly
                  for your visa application, reducing the risk of delays or rejections.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Financial Planning Worksheets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Tools to help you budget for tuition, living expenses, travel costs, and other financial
                  aspects of studying abroad, including scholarship opportunity listings.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">Pre-Departure Preparation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Essential checklists and guides covering everything from packing lists to cultural adjustment
                  tips, helping you prepare for a smooth transition to your new environment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary to-orange text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Need Guidance Now?</h2>
          <p className="text-xl mb-8 text-white/90">
            Don't wait—our counselors can provide personalized resources and guidance today
          </p>
          <Button asChild size="lg" variant="secondary" className="transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <Link href="/contact">Schedule a Free Consultation</Link>
          </Button>
        </div>
      </section>

    </div>
  );
}
