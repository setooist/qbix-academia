'use client';

import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <section className="relative bg-gradient-to-br from-cobalt-blue to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-gray-200">
              Get in touch with our expert counselors
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        className="mt-1"
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
                <p className="text-gray-700 mb-8">
                  Have questions about studying abroad? Our experienced counselors are here to help. Reach out to us through any of the channels below.
                </p>
              </div>

              <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Email Us</CardTitle>
                      <CardDescription className="mt-2 text-base">
                        <a href="mailto:info@qbixacademia.com" className="text-primary hover:underline">
                          info@qbixacademia.com
                        </a>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Call Us</CardTitle>
                      <CardDescription className="mt-2 text-base">
                        <a href="tel:+1234567890" className="text-primary hover:underline">
                          +1 (234) 567-890
                        </a>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Visit Us</CardTitle>
                      <CardDescription className="mt-2 text-base">
                        123 Education Street<br />
                        City, Country
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Office Hours</CardTitle>
                      <CardDescription className="mt-2 text-base">
                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                        Saturday: 10:00 AM - 4:00 PM<br />
                        Sunday: Closed
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
