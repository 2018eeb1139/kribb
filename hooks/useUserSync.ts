import { useUserStore } from "@/store/userStore";
import { useAuth, useUser } from "@clerk/expo";
import { useEffect } from "react";
import { createSupabaseClient, serviceRoleKey } from "../lib/supabase";

export const useUserSync = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const setIsAdmin = useUserStore((state) => state.setIsAdmin);

  useEffect(() => {
    if (!user) return;
    void syncUser();
  }, [user?.id]);

  const syncUser = async () => {
    const token = await getToken();
    if (!token) return;

    const client = createSupabaseClient({
      accessToken: token,
      useServiceRole: Boolean(serviceRoleKey),
    });

    const { data, error } = await client
      .from("users")
      .select("clerk_id, is_admin")
      .eq("clerk_id", user!.id)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("Failed to sync user:", error);
      return;
    }

    if (data) {
      setIsAdmin(data.is_admin ?? false);
      return;
    }

    const { data: newUser, error: insertError } = await client
      .from("users")
      .insert({
        clerk_id: user!.id,
        email: user!.emailAddresses[0]?.emailAddress ?? null,
        first_name: user!.firstName ?? null,
        last_name: user!.lastName ?? null,
        avatar_url: user!.imageUrl ?? null,
      })
      .select("is_admin")
      .single();

    if (insertError) {
      console.error("Failed to insert user:", insertError);

      const errorCode = insertError?.code;
      if (errorCode === "42501" && !serviceRoleKey) {
        console.error(
          "Supabase RLS is blocking the insert. Add EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY or configure an insert policy for the users table.",
        );
      }
      return;
    }

    setIsAdmin(newUser?.is_admin ?? false);
  };
};