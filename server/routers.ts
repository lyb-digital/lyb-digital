import {COOKIE_NAME} from "@shared/const";
import {getSessionCookieOptions} from "./_core/cookies";
import {systemRouter} from "./_core/systemRouter";
import {publicProcedure, router} from "./_core/trpc";
import {z} from "zod";
import {
  getPillars,
  getPillarBySlug,
  getArticles,
  getFeaturedArticles,
  getLatestArticles,
  getArticleBySlug,
  getArticlesByPillarSlug,
  getAuthors,
  getAuthorBySlug,
} from "./sanity-queries";
import {previewRouter} from "./preview-routes";

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

  // Content management routers - powered by Sanity CMS
  content: router({
    getPillars: publicProcedure.query(() => getPillars()),

    getPillarBySlug: publicProcedure
      .input(z.object({slug: z.string()}))
      .query(({input}) => getPillarBySlug(input.slug)),

    getArticles: publicProcedure.query(() => getArticles()),

    getFeaturedArticles: publicProcedure.query(() => getFeaturedArticles()),

    getLatestArticles: publicProcedure
      .input(z.object({limit: z.number().optional()}))
      .query(({input}) => getLatestArticles(input.limit)),

    getArticleBySlug: publicProcedure
      .input(z.object({slug: z.string()}))
      .query(({input}) => getArticleBySlug(input.slug)),

    getArticlesByPillarSlug: publicProcedure
      .input(z.object({pillarSlug: z.string()}))
      .query(({input}) => getArticlesByPillarSlug(input.pillarSlug)),
  }),

  authors: router({
    getAuthors: publicProcedure.query(() => getAuthors()),

    getAuthorBySlug: publicProcedure
      .input(z.object({slug: z.string()}))
      .query(({input}) => getAuthorBySlug(input.slug)),
  }),

  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({email: z.string().email()}))
      .mutation(async ({input}) => {
        // TODO: Implement newsletter subscription
        // Options:
        // 1. Store in database
        // 2. Send to external service (Mailchimp, ConvertKit, etc.)
        // 3. Trigger webhook to automation platform
        
        console.log(`Newsletter subscription: ${input.email}`);
        return {
          success: true,
          message: "Thank you for subscribing!",
        };
      }),
  }),

  preview: previewRouter,
});

export type AppRouter = typeof appRouter;

