import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, ArrowLeft, ShareNetwork, FileText, PenNib, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { PageFrame, PageHero } from '@/sfs/components/page/PageFrame';
import { Reveal } from '@/sfs/components/ui/Reveal';
import { Link } from 'react-router-dom';
import { AxiosError } from "axios";
import Errorbox from "../components/Errorbox";
import { api } from "../lib/api";
import { GenericError, GenericResponse } from "../lib/types";
import { formatDate } from "../lib/utils";
import { useShare } from '@/hooks/useShare';
import { SharePopup } from '@/components1/ui/SharePopup';

export type Blog = {
  id: string;
  slug: string;
  reference: string[];
  category: string;
  title: string;
  content: string;
  createdAt: string;
  coverImage: string;
  blogAuthor: {
    name: string;
    linkedin: string;
    designation?: string;
  }
}

function useBlog() {
  return useQuery<GenericResponse<Blog[]>, AxiosError<GenericError>>({
    queryKey: ['blogs'],
    queryFn: async () => {
      const response = await api().get('/blogs');
      return response.data;
    },
    staleTime: 1000 * 60 * 300, // 5 minutes
  });
}

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const { data: blogPosts, isLoading, error } = useBlog();
  const { isShowing, handleShare } = useShare();
  
  /**
   * Memoised so the identity is stable, and declared before any early return.
   * The `if (error) return` used to sit above this hook, so a query going from
   * success to error (a failed background refetch, or a retry) rendered fewer
   * hooks than the previous pass and React tore the whole tree down with
   * "rendered fewer hooks than expected".
   */
  const blogs = useMemo(
    () => (isLoading ? [] : blogPosts?.data || []),
    [isLoading, blogPosts],
  );

  // Filter blogs based on search query with null/undefined checks
  const filteredBlogs = useMemo(() => {
    let filtered = blogs;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = blogs.filter(blog => {
        // Safe string comparisons with null/undefined checks
        const title = blog.title?.toLowerCase() || '';
        const content = blog.content?.toLowerCase() || '';
        const authorName = blog.blogAuthor?.name?.toLowerCase() || '';
        const category = blog.category?.toLowerCase() || '';
        const designation = blog.blogAuthor?.designation?.toLowerCase() || '';

        return (
          title.includes(query) ||
          content.includes(query) ||
          authorName.includes(query) ||
          category.includes(query) ||
          designation.includes(query)
        );
      });
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(blog => 
        blog.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    return filtered;
  }, [blogs, searchQuery, selectedCategory]);

  // Pagination logic
  const totalItems = filteredBlogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex);

  const categories = ["All", "Education", "Career", "Research", "Technology", "Innovation"];

  // Check if there are no blogs at all (not just filtered results)
  const noBlogsAvailable = !isLoading && blogs.length === 0;

  const intro = (
    <>
      <p>
        Join us in making your research matter to everyone—let's empower society with knowledge and encourage curiosity about the world
        around us! Every month for the best scientific communication and Outstanding contributions will be rewarded with prizes and
        certificates of appreciation, recognizing your efforts to make science accessible and engaging for all.
      </p>
      <p className="mt-4">
        Stem for Society invites Scientist, Postdoc, PhD, masters, bachelor students and researchers to share their research journey by
        writing blogs about their publication or scientific information aimed at the general public and society! By sharing insights and
        engaging with readers, you can foster community connections and encourage meaningful discussions around your research.
      </p>
    </>
  );

  const heroKicker = (
    <div className="flex items-center gap-6">
      <Link to="/" className="nudge inline-flex items-center gap-2 text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white">
        <ArrowLeft size={16} aria-hidden="true" />
        Back
      </Link>
      <button type="button" onClick={handleShare} className="nudge inline-flex items-center gap-2 text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white">
        <ShareNetwork size={16} aria-hidden="true" />
        Share
      </button>
    </div>
  );

  // Every hook above has run by this point, so returning early here is safe.
  if (error) {
    return (
      <PageFrame tone="surface">
        <div className="container-x pt-32 pb-16">
          {/* @ts-expect-error - error is of type AxiosError */}
          <Errorbox message={error.response?.data.error || 'An error occurred'} />
        </div>
      </PageFrame>
    );
  }

  // Show loading skeleton while data is loading
  if (isLoading) {
    return (
      <PageFrame tone="surface">
        <PageHero title="Scientific Communication" kicker="Explore Blogs" />
        <section className="section" aria-busy="true" aria-label="Loading articles">
          <div className="container-x grid gap-10">
            <div className="grid gap-3">
              <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-tint" />
              <div className="h-4 w-11/12 max-w-2xl animate-pulse rounded bg-tint" />
              <div className="h-4 w-10/12 max-w-2xl animate-pulse rounded bg-tint" />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="card overflow-hidden">
                  <div className="aspect-video animate-pulse bg-tint" />
                  <div className="grid gap-3 p-5">
                    <div className="h-5 w-16 animate-pulse rounded bg-tint" />
                    <div className="h-4 animate-pulse rounded bg-tint" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-tint" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </PageFrame>
    );
  }

  return (
    <PageFrame tone="surface">
      <PageHero kicker={heroKicker} title="Scientific Communication" description={intro} />

      <section className="section" aria-label="Articles">
        <div className="container-x grid gap-10">
          <Reveal className="card flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="t-body font-medium text-deep">Getting your article published typically takes about a day to get verified</p>
            <Link to="/blog-article" className="btn btn-primary shrink-0">
              CREATE ARTICLE
            </Link>
          </Reveal>

          {/* Blog Posts Grid */}
          {noBlogsAvailable ? (
            <div className="card px-6 py-16 text-center">
              <div className="relative mx-auto mb-6 grid size-24 place-items-center rounded-full bg-surface text-brand">
                <FileText size={44} aria-hidden="true" />
                <span className="absolute -top-1 -right-1 grid size-9 place-items-center rounded-full bg-deep text-white" aria-hidden="true">
                  <PenNib size={18} />
                </span>
              </div>
              <h2 className="t-title">Currently No Articles Available</h2>
              <p className="t-lead mt-3 text-ink/75">Be the first to share your knowledge and insights!</p>
              <p className="t-body mx-auto mt-2 max-w-md text-ink/60">
                Start the conversation by creating the first article on our Scientific Communication Platform.
              </p>
              <Link to="/blog-article" className="btn btn-primary mt-8">
                <Plus size={18} aria-hidden="true" />
                Create First Article
              </Link>
            </div>
          ) : (
            <>
              <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {paginatedBlogs.map((post) => (
                  <Reveal as="li" key={post.id} className="h-full">
                    <Link
                      to={`/blog-post/${post.slug}`}
                      className="card group flex h-full flex-col overflow-hidden transition-[box-shadow,border-color] duration-300 hover:border-brand hover:shadow-raised"
                    >
                      <div className="aspect-video overflow-hidden bg-surface">
                        <img
                          src={post.coverImage || '/placeholder-image.jpg'}
                          alt=""
                          loading="lazy"
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>

                      <div className="flex flex-1 flex-col gap-3 p-5">
                        {post.category && <span className="chip self-start text-deep">{post.category}</span>}
                        <h2 className="t-heading line-clamp-2">{post.title || 'Untitled Article'}</h2>

                        <div className="t-small mt-auto flex flex-wrap items-center gap-2.5 pt-2 text-ink/60">
                          <span aria-hidden="true" className="grid size-7 place-items-center rounded-full bg-deep text-xs font-semibold text-white">
                            {(post.blogAuthor?.name || 'A').charAt(0).toUpperCase()}
                          </span>
                          <span className="text-ink/80">{post.blogAuthor?.name || 'Anonymous'}</span>
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </ul>

              {/* Pagination */}
              {totalItems > 0 && (
                <nav aria-label="Pagination" className="flex flex-col gap-3 border-t border-tint pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="t-small text-ink/70">
                    Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                      className="icon-btn disabled:opacity-40"
                    >
                      <CaretLeft size={18} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                      className="icon-btn disabled:opacity-40"
                    >
                      <CaretRight size={18} aria-hidden="true" />
                    </button>
                  </div>
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      <SharePopup isVisible={isShowing} />
    </PageFrame>
  );
};

export default Blog;
