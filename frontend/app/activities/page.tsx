import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';
import { CheckSquare } from 'lucide-react';

export default function ActivitiesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <section className="relative bg-gradient-to-br from-cobalt-blue to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Activities</h1>
            <p className="text-xl text-gray-200">
              Track your tasks and assignments
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <CheckSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Activities Coming Soon</h3>
            <p className="text-gray-600">
              Your activity management system is under development.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
