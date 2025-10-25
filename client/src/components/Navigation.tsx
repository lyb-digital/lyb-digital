import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE } from "@/const";

export default function Navigation() {
  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            {APP_LOGO && (
              <img src={APP_LOGO} alt={APP_TITLE} className="h-9 w-9" />
            )}
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg text-foreground leading-tight">
                {APP_TITLE}
              </span>
              <span className="text-xs text-accent font-semibold tracking-wide">
                Evidence for your mind
              </span>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          <Link href="/mind">
            <Button 
              variant="ghost" 
              className="text-sm md:text-base font-medium text-foreground hover:text-accent hover:bg-accent/5 transition-colors"
            >
              Mind
            </Button>
          </Link>
          <Link href="/body">
            <Button 
              variant="ghost" 
              className="text-sm md:text-base font-medium text-foreground hover:text-accent hover:bg-accent/5 transition-colors"
            >
              Body
            </Button>
          </Link>
          <Link href="/soul">
            <Button 
              variant="ghost" 
              className="text-sm md:text-base font-medium text-foreground hover:text-accent hover:bg-accent/5 transition-colors"
            >
              Soul
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

