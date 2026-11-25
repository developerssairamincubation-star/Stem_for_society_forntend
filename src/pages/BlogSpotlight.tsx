import BlogContent from "../components/BlogContent";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CaretLeft } from "@phosphor-icons/react";
import { PageFrame, PageHero } from "@/sfs/components/page/PageFrame";
import { PageLoading } from "@/sfs/components/page/PageStatus";
import { api } from "../lib/api";
import { withDevPreview } from "@/preview/devPreview";
import { GenericError, GenericResponse } from "../lib/types";
import { Blog } from "./BlogListing";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import Errorbox from "../components/Errorbox";
import { formatDate } from "../lib/utils";
import { Reveal } from "@/sfs/components/ui/Reveal";

function useBlog(slug: string) {
  return useQuery<GenericResponse<Blog>, AxiosError<GenericError>>({
    queryKey: ["blogs", slug],
    queryFn: async () => {
      return (await withDevPreview(() => api().get(`/blogs/${slug}`), "blog", slug)).data;
    },
    staleTime: 1000 * 60 * 300,
  });
}

function BlogSpotlight() {
  const { id } = useParams();
  const navigate = useNavigate();
  if (!id) {
    navigate(-1);
  }
  const { data, isPending, error } = useBlog(id!);

  if (isPending) {
    return <PageLoading label="Loading article…" />;
  }

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

  const blog = data?.data;

  if (!blog) {
    return (
      <PageFrame tone="surface">
        <div className="container-x pt-32 pb-16">
          <h1 className="t-title">Invalid blog!</h1>
        </div>
      </PageFrame>
    );
  }

  const initials = blog.blogAuthor.name
    .split(" ")
    .map((x) => x[0].toUpperCase())
    .join("");

  return (
    <PageFrame>
      <PageHero
        kicker={
          // @ts-expect-error back navigation, as before
          <Link to={-1} className="nudge inline-flex items-center gap-2 text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white">
            <CaretLeft size={16} aria-hidden="true" />
            Back
          </Link>
        }
        title={blog.title}
        description={
          <span className="flex flex-wrap items-center gap-3">
            {blog.category && <span className="chip !bg-white/10 !text-white">{blog.category}</span>}
            <span className="t-small text-white/75">
              {blog.blogAuthor.name} · {formatDate(blog.createdAt)}
            </span>
          </span>
        }
        image={blog.coverImage ? { src: blog.coverImage, alt: "" } : undefined}
      />

      <article className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16">
          <Reveal className="content prose-sfs">
            <BlogContent markdownContent={blog.content}></BlogContent>
          </Reveal>

          <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="About the author">
            <Reveal className="card grid gap-4 p-6" delay={0.1}>
              <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-deep text-base font-semibold text-white">
                {initials}
              </span>
              <div>
                <p className="t-label text-ink/60">Written by</p>
                <p className="t-heading mt-1">{blog.blogAuthor.name}</p>
                {blog.blogAuthor.designation && <p className="t-small mt-1 text-ink/70">{blog.blogAuthor.designation}</p>}
              </div>
              {blog.blogAuthor.linkedin && (
                <a href={blog.blogAuthor.linkedin} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">
                  LinkedIn profile
                </a>
              )}
              <p className="t-small text-ink/60">Published {formatDate(blog.createdAt)}</p>
            </Reveal>
          </aside>
        </div>
      </article>
    </PageFrame>
  );
}

export default BlogSpotlight;
