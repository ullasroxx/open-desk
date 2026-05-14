import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Handles the OAuth/email confirmation callback from Supabase.
 * Exchanges the code for a session and redirects.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/student";

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Determine correct dashboard based on role
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single() as { data: { role: string } | null };

        const redirect =
          profile?.role === "faculty" ? "/faculty" :
          profile?.role === "admin" ? "/admin" :
          "/student";

        return NextResponse.redirect(`${origin}${redirect}`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If something went wrong, redirect to signup with error
  return NextResponse.redirect(`${origin}/auth/signup?error=Could+not+authenticate`);
}
