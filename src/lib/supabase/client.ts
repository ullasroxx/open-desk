import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client.
 * 
 * Note: We intentionally omit the Database generic here so that
 * queries work before the schema is deployed to Supabase.
 * Once the schema is live, you can generate types with:
 *   npx supabase gen types typescript --project-id <id> > src/lib/database.types.ts
 * and then add the generic back: createBrowserClient<Database>(...)
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
