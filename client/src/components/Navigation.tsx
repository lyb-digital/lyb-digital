import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { APP_LOGO, APP_TITLE } from "@/const";

export default function Navigation() {
  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            {APP_LOGO && (
              <img src={APP_LOGO} alt={APP_TITLE} className="h-8 w-8" />
            )}
            <span className="font-bold text-lg text-foreground">{APP_TITLE}</span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/mind">
            <Button variant="ghost" className="text-base">
              Mind
            </Button>
          </Link>
          <Link href="/body">
            <Button variant="ghost" className="text-base">
              Body
            </Button>
          </Link>
          <Link href="/soul">
            <Button variant="ghost" className="text-base">
              Soul
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

