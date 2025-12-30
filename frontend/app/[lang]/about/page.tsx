import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Eye, Award, Users, TrendingUp, BookOpen, Globe, HeartHandshake } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative bg-gradient-to-br from-cobalt-blue to-secondary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Education background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About Us</h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Welcome to QBIX Academia!
            </p>
            <p className="text-lg text-gray-300 mt-4 leading-relaxed">
              We are a passionate team of experienced overseas education consultants dedicated to guiding ambitious students like you towards fulfilling their dreams of studying abroad.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">Who We Are</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                At QBIX Academia, we are more than just an educational consultancy; we are your gateway to global educational opportunities. Since our establishment in 2007, we have dedicated ourselves to empowering students like you to navigate the complex world of overseas education. Our experienced team of consultants offers personalized guidance and expert insights, ensuring you choose the best path for your international academic journey.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Education counseling"
                className="rounded-2xl shadow-2xl w-full h-[350px] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-orange text-white p-6 rounded-xl shadow-xl">
                <p className="text-3xl font-bold">Since 2007</p>
                <p className="text-sm">Trusted Partner</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Journey</h2>
          <Card className="border-2">
            <CardContent className="pt-8">
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Founded in 2007 with the mission to help students stand out globally, QBIX Academia started by sending just one student abroad and has since become a cornerstone for those aspiring to study in top destinations like Germany, the USA, and the UK.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We emphasize a learning environment that fosters growth through peer interactions and real-world experiences, supporting each student through specialized guidance on applications and visa interviews, ensuring they not only meet their deadlines but also excel in their academic and professional pursuits worldwide.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Vision</h2>
          <Card className="border-2 border-primary">
            <CardContent className="pt-8">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange rounded-xl flex items-center justify-center flex-shrink-0">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-4">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Our vision is to help students achieve their academic and career goals on a global scale. We are dedicated to guiding them toward top universities and aligning their ambitions with opportunities in education and careers across different countries.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    By offering personalized support, essential resources, and valuable guidance, we aim to equip students with the skills, knowledge, and connections needed to succeed internationally. Our goal is to help students build rewarding careers that match their dreams while making a positive impact worldwide.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Mission</h2>
          <Card className="border-2 border-primary">
            <CardContent className="pt-8">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-4">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Our mission is to empower students by providing comprehensive and personalized guidance tailored to their academic and career aspirations. We simplify the admissions and visa processes, collaborate with reputable universities, and offer support with financial planning and scholarships to ensure affordability and accessibility.
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <BookOpen className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-gray-700 leading-relaxed">
                    To prepare students for life abroad, we provide pre-departure support, including cultural orientation, and equip them with career resources and access to robust alumni networks for long-term success.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <HeartHandshake className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <p className="text-gray-700 leading-relaxed">
                    With a focus on responsive customer support, active feedback, and valuable educational content, we aim to address students' immediate needs while fostering their personal and professional growth.
                  </p>
                </div>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed mt-6">
                By building trust and delivering reliable solutions, we position ourselves as a dedicated partner in every student's journey toward global opportunities.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Our dedicated team of experienced consultants brings together years of expertise in international education, admissions processes, and career guidance. With a deep understanding of global education systems and a passion for student success, we work tirelessly to help you achieve your dreams of studying abroad.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <Card className="border-2 hover:border-primary transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-center">Expert Counselors</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    15+ years of combined experience in overseas education consulting
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-primary transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-center">Global Network</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Partnerships with 100+ universities across 15+ countries
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2 hover:border-primary transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-center">Proven Track Record</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    3800+ students successfully placed in top universities worldwide
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            <div>
              <div className="text-5xl font-bold text-primary mb-2">100+</div>
              <div className="text-gray-700 font-medium">Top-tier Universities</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">17</div>
              <div className="text-gray-700 font-medium">Years of Industry Presence</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">3800</div>
              <div className="text-gray-700 font-medium">Students Assisted</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-primary mb-2">15+</div>
              <div className="text-gray-700 font-medium">Countries Present</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
