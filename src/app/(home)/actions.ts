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
	user_like: boolean;
};

export async function getListData(
	userID: string | null,
	sortParam: string,
	timeParam: string,
	username: string | null,
	lastListID: number | undefined,
	lastListLikeCount: number | undefined,
): Promise<TListData[]> {
	const supabase = createClient();

	if (sortParam === "new") {
		timeParam = "all";
	}
	if (!username) {
		username = null;
	}

	const { data, error } = await supabase.rpc("get_listdata", {
		arg_user_id: userID,
		sort_param: sortParam,
		time_param: timeParam,
		author: username,
		last_list_id: lastListID,
		last_list_like_count: lastListLikeCount,
	});
	if (error) {
		throw new DatabaseError(error.message);
	}

	return data;
}
