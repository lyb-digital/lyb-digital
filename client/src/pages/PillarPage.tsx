import { useLocation } from "wouter";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import NewsletterForm from "@/components/NewsletterForm";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const PILLAR_INFO: Record<string, { name: string; description: string }> = {
  mind: {
    name: "Mind",
    description: "Explore topics related to mental health, productivity, and personal growth.",
  },
  body: {
    name: "Body",
    description: "Discover insights about physical health, fitness, and wellness.",
  },
  soul: {
    name: "Soul",
    description: "Connect with content about spirituality, purpose, and inner peace.",
  },
};

export default function PillarPage() {
  const [location] = useLocation();
  const pillarSlug = location.split("/")[1];
  const pillarData = PILLAR_INFO[pillarSlug as keyof typeof PILLAR_INFO];

  const { data: pillar, isLoading } = trpc.content.getPillarBySlug.useQuery(
    { slug: pillarSlug },
    { enabled: !!pillarSlug }
  );

  if (!pillarData) {
    return <div>Pillar not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-50 to-pink-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {pillarData.name}
          </h1>
          <p className="text-lg text-muted-foreground">
            {pillarData.description}
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        {/* Articles List */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Articles</h2>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : pillar && pillar.articles && pillar.articles.length > 0 ? (
            <div className="space-y-6">
              {pillar.articles.map((article) => (
                <Link key={article.id} href={`/article/${article.slug}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex gap-6">
                        {article.featuredImageUrl && (
                          <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded bg-muted">
                            <img
                              src={article.featuredImageUrl}
                              alt={article.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <CardTitle className="line-clamp-2 text-xl">
                            {article.title}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            By {article.author} • {formatDate(article.publishedAt)}
                          </CardDescription>
                          {article.subtitle && (
                            <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
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
            <p className="text-muted-foreground text-center py-12">
              No articles in this pillar yet.
            </p>
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

