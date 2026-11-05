import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { PageFrame, PageHero } from "@/sfs/components/page/PageFrame";
import { Reveal } from "@/sfs/components/ui/Reveal";
import React from "react";
import { Link } from "react-router-dom";
import Errorbox from "../components/Errorbox";
import { api } from "../lib/api";
import { GenericError, GenericResponse } from "../lib/types";
import { formatDate } from "../lib/utils";

export type Blog = {
  id: string;
  slug: string;
  references?: string[];
  category: string;
  title: string;
  content: string;
  createdAt: string;
  coverImage: string;
  blogAuthor: {
    name: string;
    linkedin: string;
    designation?: string;
  };
};

function useBlogs() {
  return useQuery<GenericResponse<Blog[]>, AxiosError<GenericError>>({
    queryKey: ["blogs"],
    queryFn: async () => {
      return (await api().get("/blogs")).data;
    },
    staleTime: 1000 * 60 * 300,
  });
}

const BlogListing: React.FC = () => {
  const { data, isPending, error } = useBlogs();

  if (error) {
    return (
      <PageFrame tone="surface">
        <div className="container-x pt-32 pb-16">
          {/* @ts-expect-error - error is of type AxiosError */}
          <Errorbox message={error.response?.data.error} />
        </div>
      </PageFrame>
    );
  }

  const blogs = isPending ? [] : data.data;

  return (
    <PageFrame tone="surface">
      <PageHero
        title="Scientific Communication"
        description={
          <>
            <p>
              Stem for Society invites scientists, postdocs, PhD, master’s and bachelor students and researchers to write about their publications
              or scientific findings for the general public. Sharing what you learn builds community and starts conversations about your research.
            </p>
            <p className="mt-4">
              Make your research matter to everyone. Each month, the best scientific communication and outstanding contributions receive prizes
              and certificates of appreciation.
            </p>
          </>
        }
      />

      <section className="section" aria-label="Articles">
        <div className="container-x grid gap-10">
          <Reveal className="card flex flex-col items-center gap-4 p-8 text-center">
            <p className="t-body font-medium">Getting your article published typically takes about a day to get verified</p>
            <Link to={"/blogs/new"} className="btn btn-primary">
              Create article
            </Link>
          </Reveal>

          <div className="grid gap-8 lg:grid-cols-[1fr_18rem] lg:gap-12">
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3" aria-busy={isPending}>
              {isPending
                ? [0, 1, 2].map((i) => (
                    <li key={i} aria-hidden="true" className="card aspect-[4/3] animate-pulse bg-white" />
                  ))
                : blogs.map((blog) => (
                    <Reveal as="li" key={blog.id ?? blog.slug} className="h-full">
                      <Link
                        to={`/blogs/${blog.slug}`}
                        className="card group flex h-full flex-col overflow-hidden transition-[box-shadow,border-color] duration-300 hover:border-brand hover:shadow-raised"
                      >
                        <div className="aspect-video overflow-hidden bg-surface">
                          <img
                            src={blog.coverImage}
                            alt=""
                            loading="lazy"
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          />
                        </div>
                        <div className="flex flex-1 flex-col gap-2 p-5">
                          {blog.category && <span className="chip self-start text-deep">{blog.category}</span>}
                          <h2 className="t-heading mt-1 line-clamp-3">{blog.title}</h2>
                          <p className="t-small mt-auto pt-3 text-ink/70">by {blog.blogAuthor.name}</p>
                          <p className="text-xs text-ink/60">{formatDate(blog.createdAt)}</p>
                        </div>
                      </Link>
                    </Reveal>
                  ))}
            </ul>

            <aside className="grid content-start gap-6" aria-label="Search and categories">
              <div className="relative">
                <label htmlFor="blog-search" className="sr-only">
                  Search blogs
                </label>
                <MagnifyingGlass size={18} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink/50" aria-hidden="true" />
                <input id="blog-search" placeholder="Search blogs..." type="search" className="!pl-10" />
              </div>

              <div className="card p-5">
                <h3 className="t-heading">Blog Categories</h3>
                <p className="t-small mt-3 italic text-ink/60">No data</p>
                {/* Future categories can be listed here */}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </PageFrame>
  );
};

export default BlogListing;
