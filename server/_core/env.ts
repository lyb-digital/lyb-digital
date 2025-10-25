export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  sanityProjectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  sanityDataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  sanityPreviewToken: process.env.NEXT_PUBLIC_SANITY_PREVIEW_TOKEN ?? "",
};

// Validate required environment variables
if (!ENV.sanityProjectId) {
  console.error("NEXT_PUBLIC_SANITY_PROJECT_ID is not set");
}
if (!ENV.databaseUrl) {
  console.error("DATABASE_URL is not set");
}

