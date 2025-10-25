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
      <section className="brand-gradient py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Live Your Best Life
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-2">
            Evidence for your mind. Action for your life.
          </p>
          <p className="text-base md:text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            We're your friendly, knowledgeable guide to mental wellness, physical health, and meaningful living. 
            Explore evidence-based wisdom across Mind, Body, and Soul.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/mind">
              <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2 h-auto">
                Explore Mind
              </Button>
            </Link>
            <Link href="/body">
              <Button className="bg-secondary hover:bg-secondary/90 text-white font-semibold px-6 py-2 h-auto">
                Explore Body
              </Button>
            </Link>
            <Link href="/soul">
              <Button className="bg-accent hover:bg-accent/90 text-white font-semibold px-6 py-2 h-auto">
                Explore Soul
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        {/* Featured Articles */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              Featured Insights
            </h2>
            <p className="text-foreground/70">
              Curated articles to help you unlock your potential
            </p>
          </div>
          
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
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-border/50 hover:border-accent/30">
                    {article.featuredImageUrl && (
                      <div className="h-48 overflow-hidden bg-muted">
                        <img
                          src={article.featuredImageUrl}
                          alt={article.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2 font-serif text-lg text-foreground">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {article.author}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(article.publishedAt)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Featured articles coming soon.
            </p>
          )}
        </section>

        {/* Latest Articles */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
              Latest Articles
            </h2>
            <p className="text-foreground/70">
              Fresh perspectives on living your best life
            </p>
          </div>
          
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
                  <Card className="hover:shadow-md transition-shadow cursor-pointer border-border/50 hover:border-accent/30">
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
                        <div className="flex-1 min-w-0">
                          <CardTitle className="line-clamp-2 font-serif text-base text-foreground">
                            {article.title}
                          </CardTitle>
                          <CardDescription className="text-sm mt-1">
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
            <p className="text-muted-foreground text-center py-8">
              Articles coming soon.
            </p>
          )}
        </section>

        {/* Newsletter Section */}
        <section className="bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-xl p-8 md:p-12 mb-12 border border-border/50">
          <div className="max-w-2xl">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
              Stay Connected
            </h2>
            <p className="text-foreground/70 mb-6">
              Get weekly insights delivered to your inbox. Evidence-based wisdom, actionable steps, and encouragement to help you live your best life.
            </p>
            <NewsletterForm />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border/50 py-8 px-4 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-serif font-semibold text-foreground mb-3">Explore</h3>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li><Link href="/mind"><span className="hover:text-accent transition-colors">Mind</span></Link></li>
                <li><Link href="/body"><span className="hover:text-accent transition-colors">Body</span></Link></li>
                <li><Link href="/soul"><span className="hover:text-accent transition-colors">Soul</span></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-serif font-semibold text-foreground mb-3">About</h3>
              <p className="text-sm text-foreground/70">
                Live Your Best Digital is your guide to unlocking your full potential through evidence-based wisdom.
              </p>
            </div>
            <div>
              <h3 className="font-serif font-semibold text-foreground mb-3">Our Promise</h3>
              <p className="text-sm text-foreground/70">
                Evidence for your mind. Action for your life.
              </p>
            </div>
          </div>
          <div className="border-t border-border/50 pt-6 text-center text-sm text-foreground/60">
            <p>&copy; 2024 Live Your Best Digital. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

