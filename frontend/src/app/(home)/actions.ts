"use server";

import { createClient } from "@/utils/supabase/server";
import { DatabaseError } from "@/app/customerrors";

type TListData = {
	id: number;
	author_id: string;
	title: string;
	movies: number[];
	author_username: string;
	like_count: number;
};

export async function getListData(
	sortParam: string,
	timeParam: string,
	username: string | null,
	lastListID: number | undefined,
): Promise<TListData[]> {
	const supabase = createClient();

	if (sortParam === "new") {
		timeParam = "all";
	}
	if (!username) {
		username = null;
	}

	const { data, error } = await supabase.rpc("get_listdata", {
		sort_param: sortParam,
		time_param: timeParam,
		author: username,
		last_list_id: lastListID,
	});
	if (error) {
		throw new DatabaseError(error.message);
	}

	return data;
}
