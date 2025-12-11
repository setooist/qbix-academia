"use client";

import { useState } from "react";
import { Plus, Minus, HelpCircle } from "lucide-react";

interface FaqItem {
    question: string;
    answer: string;
}

interface FaqSectionProps {
    data: FaqItem[];
    seo?: any;
}

const FaqSection = ({ data, seo }: FaqSectionProps) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const hasFaqs = data && data.length > 0;

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Use fetched SEO schema if available, otherwise generate default FAQ schema
    const jsonLd = seo?.structuredData ? seo.structuredData : {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: data?.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })) || [],
    };

    return (
        <section className="py-20 bg-gray-50">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold mb-4">
                        <HelpCircle size={16} /> FAQ
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-primary-text)] mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Get answers to common questions about our services and processes.
                    </p>
                </div>

                <div className="space-y-4">
                    {hasFaqs ? (
                        data.map((faq, index) => (
                            <div
                                key={index}
                                className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${openIndex === index
                                    ? "border-blue-500 shadow-md"
                                    : "border-gray-200 shadow-sm hover:border-blue-300"
                                    }`}
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                                >
                                    <span className={`text-lg font-medium pr-8 ${openIndex === index ? "text-blue-700" : "text-gray-800"}`}>
                                        {faq.question}
                                    </span>
                                    <span className={`flex-shrink-0 transition-transform duration-300 text-blue-500 ${openIndex === index ? "rotate-180" : ""}`}>
                                        {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                                    </span>
                                </button>

                                <div
                                    className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-8 bg-white rounded-lg border border-dashed border-gray-300 text-gray-500">
                            No questions added yet. Check back soon!
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FaqSection;
