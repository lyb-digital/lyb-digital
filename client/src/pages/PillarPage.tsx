import { useLocation } from "wouter";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import NewsletterForm from "@/components/NewsletterForm";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const PILLAR_INFO: Record<string, { name: string; description: string; color: string }> = {
  mind: {
    name: "Mind",
    description: "Mental wellness, mindfulness, productivity, and emotional intelligence. Unlock the power of your thoughts and build habits that stick.",
    color: "from-blue-50 to-blue-100",
  },
  body: {
    name: "Body",
    description: "Nutrition, fitness, sleep science, and preventative health. Discover practical strategies for physical well-being.",
    color: "from-green-50 to-green-100",
  },
  soul: {
    name: "Soul",
    description: "Purpose, meaning, relationships, and creativity. Explore what it means to live a life of significance.",
    color: "from-orange-50 to-orange-100",
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
      <section className={`bg-gradient-to-r ${pillarData.color} py-12 md:py-16 px-4`}>
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-3">
            {pillarData.name}
          </h1>
          <p className="text-lg text-foreground/80">
            {pillarData.description}
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
        {/* Articles List */}
        <section className="mb-16">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
            Articles
          </h2>
          
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
                  <Card className="hover:shadow-md transition-shadow cursor-pointer border-border/50 hover:border-accent/30">
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
                        <div className="flex-1 min-w-0">
                          <CardTitle className="line-clamp-2 font-serif text-xl text-foreground mb-2">
                            {article.title}
                          </CardTitle>
                          <CardDescription className="text-sm mb-2">
                            By {article.author} • {formatDate(article.publishedAt)}
                          </CardDescription>
                          {article.subtitle && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
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
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                No articles in this pillar yet.
              </p>
              <p className="text-foreground/70">
                Check back soon for new insights on {pillarData.name.toLowerCase()}.
              </p>
            </div>
          )}
        </section>

        {/* Newsletter Section */}
        <section className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-xl p-8 md:p-12 mb-12 border border-border/50">
          <div className="max-w-2xl">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
              Stay Updated
            </h2>
            <p className="text-foreground/70 mb-6">
              Get the latest {pillarData.name.toLowerCase()} insights delivered to your inbox. Evidence-based, actionable, and encouraging.
            </p>
            <NewsletterForm />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border/50 py-8 px-4 mt-auto">
        <div className="max-w-6xl mx-auto text-center text-sm text-foreground/60">
          <p>&copy; 2024 Live Your Best Digital. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

