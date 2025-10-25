import { useRoute } from "wouter";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import NewsletterForm from "@/components/NewsletterForm";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Share2 } from "lucide-react";

export default function ArticlePage() {
  const [match, params] = useRoute("/article/:slug");
  const slug = params?.slug as string;

  const { data: article, isLoading } = trpc.content.getArticleBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  const handleShare = () => {
    if (navigator.share && article) {
      navigator.share({
        title: article.title,
        text: article.subtitle || article.title,
        url: window.location.href,
      });
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (!match) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ) : article ? (
          <article>
            {/* Featured Image */}
            {article.featuredImageUrl && (
              <div className="mb-8 -mx-4 md:mx-0 md:rounded-lg overflow-hidden bg-muted">
                <img
                  src={article.featuredImageUrl}
                  alt={article.title}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            {/* Header */}
            <header className="mb-8 border-b border-border pb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {article.title}
              </h1>
              {article.subtitle && (
                <p className="text-xl text-muted-foreground mb-6">
                  {article.subtitle}
                </p>
              )}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="text-sm text-muted-foreground">
                  <p>By <span className="font-semibold">{article.author}</span></p>
                  <p>{formatDate(article.publishedAt)}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </header>

            {/* Content */}
            <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert">
              <div
                dangerouslySetInnerHTML={{ __html: article.richTextBody }}
                className="text-foreground leading-relaxed"
              />
            </div>

            {/* Newsletter Section */}
            <section className="bg-blue-50 rounded-lg p-8 mt-16 mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Don't Miss Future Articles
              </h2>
              <p className="text-muted-foreground mb-6">
                Subscribe to our newsletter for the latest insights and wisdom.
              </p>
              <NewsletterForm />
            </section>

            {/* Back Button */}
            <div className="flex gap-4 pt-8 border-t border-border">
              <Link href="/">
                <Button variant="outline">← Back to Home</Button>
              </Link>
            </div>
          </article>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">Article not found</p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 px-4 mt-auto">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2024 Live Your Best Digital. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

