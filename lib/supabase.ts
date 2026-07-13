import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;
const serviceRoleKey = process.env.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export { supabaseUrl, supabaseKey, serviceRoleKey };
export const supabase = createClient(supabaseUrl, supabaseKey);

export function createClerkSupabaseClient(getToken: () => Promise<string | null>) {
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  });
}

export function createSupabaseClient(options?: { accessToken?: string | null; useServiceRole?: boolean }) {
  const key = options?.useServiceRole ? serviceRoleKey ?? supabaseKey : supabaseKey;

  return createClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    ...(options?.accessToken
      ? {
          global: {
            headers: {
              Authorization: `Bearer ${options.accessToken}`,
            },
          },
        }
      : {}),
  });
}