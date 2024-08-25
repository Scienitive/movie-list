"use server";

import { createClient } from "@/utils/supabase/server";

export async function logout() {
	const supabase = createClient();
	return await supabase.auth.signOut();
}
