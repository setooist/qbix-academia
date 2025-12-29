import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, GraduationCap, User, Award } from 'lucide-react';
import Image from 'next/image';
import caseStudiesData from '@/lib/data/case-studies.json';

export default function CaseStudiesPage() {
  const caseStudies = caseStudiesData;

  return (
    <div className="flex flex-col min-h-screen">

      <section className="relative bg-gradient-to-br from-cobalt-blue to-secondary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Success stories background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Case Studies</h1>
            <p className="text-xl text-gray-200">
              Success stories from students who achieved their study abroad dreams
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((study) => (
              <Card key={study.id} className="border-2 hover:border-primary transition-all duration-500 hover:shadow-2xl group hover:-translate-y-2">
                {study.featured_image && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <Image
                      src={study.featured_image}
                      alt={study.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{study.destination_country}</Badge>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors duration-300">
                    {study.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {study.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{study.student_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4" />
                    <span>{study.university}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="w-4 h-4" />
                    <span>{study.program}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-700">{study.content}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
