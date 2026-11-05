import BlogContent from "../components/BlogContent";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CaretLeft } from "@phosphor-icons/react";
import { PageFrame } from "@/sfs/components/page/PageFrame";
import { PageLoading } from "@/sfs/components/page/PageStatus";
import { api } from "../lib/api";
import { GenericError, GenericResponse } from "../lib/types";
import { Blog } from "./BlogListing";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import Errorbox from "../components/Errorbox";
import { formatDate } from "../lib/utils";

function useBlog(slug: string) {
  return useQuery<GenericResponse<Blog>, AxiosError<GenericError>>({
    queryKey: ["blogs", slug],
    queryFn: async () => {
      return (await api().get(`/blogs/${slug}`)).data;
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

  return (
    <PageFrame>
      <article className="container-x pt-28 pb-16 sm:pb-20 lg:pt-32">
        <div className="mx-auto max-w-3xl">
          {/* @ts-expect-error back navigation, as before */}
          <Link to={-1} className="t-label nudge mb-8 inline-flex items-center gap-2 text-deep underline decoration-tint decoration-2 underline-offset-4 hover:decoration-deep">
            <CaretLeft size={16} aria-hidden="true" />
            Back
          </Link>

          {!blog ? (
            <h1 className="t-title">Invalid blog!</h1>
          ) : (
            <>
              {blog.category && <p className="chip mb-4 text-deep">{blog.category}</p>}
              <h1 className="t-display">{blog.title}</h1>

              <div className="mt-6 flex flex-wrap items-center gap-3 border-b border-tint pb-6">
                <span
                  aria-hidden="true"
                  className="grid size-10 place-items-center rounded-full bg-deep text-sm font-semibold text-white"
                >
                  {blog.blogAuthor.name
                    .split(" ")
                    .map((x) => x[0].toUpperCase())
                    .join("")}
                </span>
                <div className="t-small">
                  <p className="font-medium">{blog.blogAuthor.name}</p>
                  <p className="text-ink/60">
                    {blog.blogAuthor.designation ? `${blog.blogAuthor.designation} • ` : ""}
                    {formatDate(blog.createdAt)}
                  </p>
                </div>
              </div>

              <img src={blog.coverImage} alt="" className="mt-8 aspect-video w-full rounded-card bg-surface object-cover" />

              <div className="content prose-sfs mt-10">
                <BlogContent markdownContent={blog.content}></BlogContent>
              </div>
            </>
          )}
        </div>
      </article>
    </PageFrame>
  );
}

export default BlogSpotlight;
