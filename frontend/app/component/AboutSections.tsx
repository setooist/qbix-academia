"use client";
import Image from "next/image";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// Helper to fix image URLs
const getImageUrl = (url: string) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
}

export const AboutHero = ({ data }: { data: any }) => {
    const imageUrl = getImageUrl(data.coverImage?.[0]?.url);

    return (
        <section className="relative py-20 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-10 mb-10 md:mb-0 z-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--color-primary-text)]">{data.title}</h1>
                    <h2 className="text-xl md:text-2xl text-gray-600 mb-6 font-light">{data.subtitle}</h2>
                    <div className="prose prose-lg text-gray-600">
                        {data.description && <BlocksRenderer content={data.description} />}
                    </div>
                </div>
                <div className="md:w-1/2 relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
                    {imageUrl ? (
                        <Image src={imageUrl} alt={data.coverImage?.[0]?.alternativeText || "Hero Image"} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">No Image</div>
                    )}
                </div>
            </div>
        </section>
    );
};

export const WhoWeAre = ({ data }: { data: any }) => {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 text-center max-w-3xl">
                <h2 className="text-3xl font-bold mb-8 text-[var(--color-primary-text)]">{data.whoWeAreTitle}</h2>
                <div className="prose prose-lg mx-auto text-gray-600">
                    {data.description && <BlocksRenderer content={data.description} />}
                </div>
            </div>
        </section>
    );
};

export const VisionQuery = ({ data }: { data: any }) => {
    return (
        <section className="py-16 bg-blue-50">
            <div className="container mx-auto px-4 max-w-4xl text-center">
                <h2 className="text-3xl font-bold mb-6 text-[var(--color-primary-text)]">{data.title}</h2>
                <div className="prose prose-lg mx-auto text-gray-700">
                    {data.description && <BlocksRenderer content={data.description} />}
                </div>
            </div>
        </section>
    );
};

export const Mission = ({ data }: { data: any }) => {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-4xl text-center">
                <h2 className="text-3xl font-bold mb-6 text-[var(--color-primary-text)]">{data.title}</h2>
                <div className="prose prose-lg mx-auto text-gray-700">
                    {data.description && <BlocksRenderer content={data.description} />}
                </div>
            </div>
        </section>
    );
};

export const AboutVision = ({ data }: { data: any }) => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-3xl font-bold mb-6 text-center text-[var(--color-primary-text)]">{data.title}</h2>
                    <div className="prose prose-lg mx-auto text-gray-700">
                        {data.description && <BlocksRenderer content={data.description} />}
                    </div>
                </div>
            </div>
        </section>
    );
};

export const TimelineItem = ({ data }: { data: any }) => {
    return (
        <div className="relative pl-8 md:pl-0 md:w-1/2 ml-auto md:ml-0 md:even:mr-auto md:odd:ml-auto group mb-8 last:mb-0">
            {/* Use even/odd with parent grid/flex instead if not mapping directly */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-3">
                    {data.Year}
                </span>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{data.title}</h3>
                <div className="prose prose-sm text-gray-600">
                    {data.description && <BlocksRenderer content={data.description} />}
                </div>
            </div>
        </div>
    )
}
