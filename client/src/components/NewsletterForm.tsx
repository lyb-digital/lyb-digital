import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const subscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Welcome! Check your inbox for our latest insights.");
      setEmail("");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter an email address.");
      return;
    }
    subscribe.mutate({ email });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
      <Input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={subscribe.isPending}
        className="flex-1 bg-white border-border/50 text-foreground placeholder:text-foreground/50"
      />
      <Button
        type="submit"
        disabled={subscribe.isPending}
        className="bg-accent hover:bg-accent/90 text-white font-semibold px-6 h-auto"
      >
        {subscribe.isPending ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>
  );
}

