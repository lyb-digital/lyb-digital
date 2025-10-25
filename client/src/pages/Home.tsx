import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import NewsletterForm from "@/components/NewsletterForm";
import Navigation from "@/components/Navigation";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: featured, isLoading: featuredLoading } = trpc.content.getFeaturedArticles.useQuery();
  const { data: latest, isLoading: latestLoading } = trpc.content.getLatestArticles.useQuery();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Live Your Best Digital
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Unlock your full potential with evidence-based wisdom across Mind, Body, and Soul
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/mind">
              <Button variant="default">Explore Mind</Button>
            </Link>
            <Link href="/body">
              <Button variant="outline">Explore Body</Button>
            </Link>
            <Link href="/soul">
              <Button variant="outline">Explore Soul</Button>
            </Link>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        {/* Featured Articles */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Featured</h2>
          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-80" />
              ))}
            </div>
          ) : featured && featured.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((article) => (
                <Link key={article.id} href={`/article/${article.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    {article.featuredImageUrl && (
                      <div className="h-48 overflow-hidden bg-muted">
                        <img
                          src={article.featuredImageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                      <CardDescription>{article.author}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(article.publishedAt)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No featured articles yet.</p>
          )}
        </section>

        {/* Latest Articles */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Latest</h2>
          {latestLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          ) : latest && latest.length > 0 ? (
            <div className="space-y-4">
              {latest.map((article) => (
                <Link key={article.id} href={`/article/${article.slug}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex gap-4">
                        {article.featuredImageUrl && (
                          <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded bg-muted">
                            <img
                              src={article.featuredImageUrl}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                          <CardDescription className="mt-2">
                            {article.author} • {formatDate(article.publishedAt)}
                          </CardDescription>
                          {article.subtitle && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {article.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No articles yet.</p>
          )}
        </section>

        {/* Newsletter Section */}
        <section className="bg-blue-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-6">
            Subscribe to our newsletter for the latest articles and insights.
          </p>
          <NewsletterForm />
        </section>
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

