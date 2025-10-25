import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getPillarBySlug,
  getAllPillars,
  getArticleBySlug,
  getArticlesByPillarId,
  getFeaturedArticles,
  getLatestArticles,
  subscribeNewsletter,
} from "./db";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Content management routers
  content: router({
    // Get all pillars
    getPillars: publicProcedure.query(async () => {
      return getAllPillars();
    }),

    // Get pillar by slug with articles
    getPillarBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const pillar = await getPillarBySlug(input.slug);
        if (!pillar) return null;
        const pillarArticles = await getArticlesByPillarId(pillar.id, 50);
        return {
          ...pillar,
          articles: pillarArticles,
        };
      }),

    // Get article by slug
    getArticleBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getArticleBySlug(input.slug);
      }),

    // Get featured articles for homepage
    getFeaturedArticles: publicProcedure.query(async () => {
      return getFeaturedArticles(3);
    }),

    // Get latest articles for homepage
    getLatestArticles: publicProcedure.query(async () => {
      return getLatestArticles(10);
    }),
  }),

  // Newsletter router
  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        try {
          await subscribeNewsletter(input.email);
          return {
            success: true,
            message: "Successfully subscribed to the newsletter!",
          };
        } catch (error) {
          console.error("Newsletter subscription error:", error);
          throw new Error("Failed to subscribe. Please try again.");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;

