import { useState } from 'react';
import { blogs } from '../data/blogs';
import BlogModal from './BlogModal';

export default function BlogSection() {
  const [selectedBlog, setSelectedBlog] = useState(null);

  return (
    <section id="blog" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cosmic-pink/80">Blog</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Stories that keep people going</h2>
          <p className="mt-4 text-base leading-7 text-white/70">
            Inspiration ambassadors share gentle stories for days that feel heavy, uncertain, or quiet.
          </p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="flex h-full flex-col rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.07]"
            >
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                <span className="text-cosmic-yellow">✦</span>
                Inspiration Ambassador
              </div>
              <h3 className="text-xl font-semibold leading-snug text-white">{blog.title}</h3>
              <p className="mt-3 text-sm text-white/55">{blog.author}</p>
              <p className="mt-4 flex-1 text-sm leading-7 text-white/75">{blog.summary}</p>
              <button
                type="button"
                onClick={() => setSelectedBlog(blog)}
                className="mt-6 inline-flex w-fit items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:border-cosmic-blue/50 hover:bg-white/15"
              >
                Read More
              </button>
            </article>
          ))}
        </div>
      </div>

      <BlogModal blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
    </section>
  );
}
