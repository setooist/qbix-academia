import { Navigation } from '@/components/layout/navigation';
import { Footer } from '@/components/layout/footer';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">

      <section className="py-12 flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Last updated: December 19, 2024
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              By accessing or using QBIX Academia's services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Services</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              QBIX Academia provides educational counseling and application support services for students seeking to study abroad. Our services include, but are not limited to, university selection guidance, application assistance, test preparation, and visa support.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">User Responsibilities</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              As a user of our services, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Provide accurate and complete information</li>
              <li>Maintain the confidentiality of your account</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not misuse our services or interfere with their operation</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4">Limitations of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              While we strive to provide the best possible guidance, we cannot guarantee admission to any specific university or program. Application outcomes depend on multiple factors beyond our control.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              All content, materials, and resources provided by QBIX Academia are protected by intellectual property laws and remain the property of QBIX Academia.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We reserve the right to terminate or suspend access to our services at our discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or our business.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4">Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              For questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@qbixacademia.com" className="text-primary hover:underline">
                legal@qbixacademia.com
              </a>
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
