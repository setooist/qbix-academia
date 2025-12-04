import Link from "next/link";

export default async function BlogPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/articles`, {
    cache: "no-store",
  });

  const response = await res.json();
  const articles = response?.data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8 text-gray-100">Blogs</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> 
        {articles.map((item: any) => {
          return (
            <div
              key={item?.id}
              className="bg-white border rounded-xl shadow-sm hover:shadow-lg p-6 transition-all duration-300"
            >
              <h2 className="text-2xl font-semibold mb-3 text-gray-800">
                <Link href={`/blogpost/${item.slug}`}>{item?.title || "No Title"}</Link>
              </h2>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {item?.description || "No description available."}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
