export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      
      <a
        href="/blog"
        className="inline-block mb-6 text-blue-600 hover:underline font-medium"
      >
        ← Back to Blo   gs
      </a>

      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        {slug.replace(/-/g, " ").toUpperCase()}
      </h1>

      <div className="flex items-center gap-4 text-gray-500 mb-8">
        <span className="text-sm">Published on Jan 20, 2025</span>
        <span className="text-sm">•</span>
        <span className="text-sm">Author: John Doe</span>
      </div>

      <div className="w-full h-64 rounded-lg overflow-hidden shadow mb-8">
        <img
          src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=60"
          alt="Blog cover"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="prose md:prose-lg prose-gray max-w-none">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id risus
          a libero congue dapibus. Vivamus id ultricies quam, et dictum neque.
          Proin ut odio sed risus sodales sollicitudin. Integer et convallis
          risus. Fusce volutpat erat sed risus suscipit, nec lacinia magna
          elementum.
        </p>

        <p>
          Curabitur vitae neque magna. Donec ac pretium lacus. Pellentesque
          maximus laoreet mauris, nec placerat lorem placerat sed. Nam quis erat
          consequat, maximus mi ac, dignissim augue.
        </p>

        <h2>Subheading Example</h2>
        <p>
          Suspendisse bibendum, dolor eget laoreet semper, nunc nisi posuere
          lectus, eget gravida mi nulla sit amet nunc.
        </p>

        <ul>
          <li>Bullet list item #1</li>
          <li>Bullet list item #2</li>
          <li>Bullet list item #3</li>
        </ul>

        <blockquote>
          “Inspirational quote or content highlight goes here for emphasis.”
        </blockquote>
      </div>
    </div>
  );
}
