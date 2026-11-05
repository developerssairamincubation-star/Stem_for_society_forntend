import React from 'react';
import { ArrowLeft, ShareNetwork, ArrowSquareOut } from '@phosphor-icons/react';
import { PageFrame } from '@/sfs/components/page/PageFrame';
import { PageLoading } from '@/sfs/components/page/PageStatus';
import { Link, useNavigate, useParams } from 'react-router-dom';
import BlogContent from "../components/BlogContent";
import { api } from "../lib/api";
import { GenericError, GenericResponse } from "../lib/types";
import { Blog } from "./BlogListing";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import Errorbox from "../components/Errorbox";
import { formatDate } from "../lib/utils";
import { useShare } from '@/hooks/useShare';
import { SharePopup } from '@/components1/ui/SharePopup';

function useBlog(slug: string) {
  return useQuery<GenericResponse<Blog>, AxiosError<GenericError>>({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const response = await api().get(`/blogs/${slug}`);
      return response.data;
    },
  });
};

// Helper function to check if a string is a valid URL
const isValidUrl = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Helper function to format URL for display
const formatUrlForDisplay = (url: string) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname + urlObj.pathname;
  } catch (_) {
    return url;
  }
};

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isShowing, handleShare } = useShare();
  
  if(!id) {
    navigate(-1);
  }
  const { data, isLoading, error } = useBlog(id!);

  if(isLoading) {
    return <PageLoading label="Loading article…" />;
  }

  if(error) {
    return (
      <PageFrame tone="surface">
        <div className="container-x pt-32 pb-16">
          {/* @ts-expect-error - error is of type AxiosError */}
          <Errorbox message={error.response?.data.error} />
        </div>
      </PageFrame>
    );
  }

  const blogPost = data?.data;
  return (
    <PageFrame>
      <article className="container-x pt-28 pb-16 sm:pb-20 lg:pt-32">
        <div className="mx-auto max-w-3xl">
          {/* Navigation */}
          <div className="mb-8 flex items-center justify-between gap-4">
            <Link to="/blog" className="t-label nudge inline-flex items-center gap-2 text-deep underline decoration-tint decoration-2 underline-offset-4 hover:decoration-deep">
              <ArrowLeft size={16} aria-hidden="true" />
              Back
            </Link>

            <button type="button" onClick={handleShare} className="btn btn-secondary">
              <ShareNetwork size={18} aria-hidden="true" />
              Share
            </button>
          </div>

          {/* Category */}
          <p className="chip mb-4 text-deep">{blogPost.category}</p>

          {/* Article Title */}
          <h1 className="t-display">{blogPost.title}</h1>

          {/* Author Info */}
          <div className="mt-6 flex flex-wrap items-center gap-3 border-b border-tint pb-6">
            <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-deep text-sm font-semibold text-white">
              {(blogPost.blogAuthor?.name || 'A').charAt(0).toUpperCase()}
            </span>
            <div className="t-small">
              <p className="font-medium">{blogPost.blogAuthor.name}</p>
              <p className="text-ink/60">{formatDate(blogPost.createdAt)}</p>
            </div>
          </div>

          {/* Featured Image */}
          <img src={blogPost.coverImage} alt={blogPost.title} className="mt-8 aspect-video w-full rounded-card bg-surface object-cover" />

          {/* Article Content */}
          <div className="prose-sfs mt-10 [&_.ql-editor]:p-0 [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-brand [&_blockquote]:pl-4 [&_blockquote]:italic [&_img]:my-6 [&_img]:rounded-card">
            <BlogContent markdownContent={blogPost.content} />
          </div>

          {/* References */}
          {blogPost.references && blogPost.references.length > 0 && (
            <section className="mt-12 border-t border-tint pt-8" aria-labelledby="references-title">
              <h2 id="references-title" className="t-heading">References</h2>
              <ol className="mt-4 grid gap-2.5">
                {blogPost.references.map((reference, index) => (
                  <li key={index} className="t-small flex items-start gap-2.5">
                    <span className="shrink-0 font-medium text-ink/60">[{index + 1}]</span>
                    {isValidUrl(reference) ? (
                      <a
                        href={reference}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-start gap-1.5 break-all text-deep underline decoration-tint decoration-2 underline-offset-4 hover:decoration-deep"
                      >
                        <span>{formatUrlForDisplay(reference)}</span>
                        <ArrowSquareOut size={14} className="mt-1 shrink-0" aria-hidden="true" />
                      </a>
                    ) : (
                      <span className="break-words text-ink/75">{reference}</span>
                    )}
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>
      </article>

      <SharePopup isVisible={isShowing} />
    </PageFrame>
  );
};

export default BlogPost;
