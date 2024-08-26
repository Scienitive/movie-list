"use server";

import { createClient } from "@/utils/supabase/server";

export async function getListData(
	sortParam: string,
	timeParam: string,
	rangeNumber: number,
	username: string | undefined = "",
) {
	const supabase = createClient();

	let orderId, orderOptions;
	if (sortParam === "top") {
		orderId = "like_count";
		orderOptions = { ascending: false };
	} else {
		orderId = "created_at";
		orderOptions = { ascending: false };
	}

	const query = supabase
		.from("lists")
		.select(
			"id, user_id, title, movies, profiles!lists_user_id_fkey(username), likes(count)",
		)
		.order(orderId, orderOptions);

	if (username) {
		query.eq("profiles.username", username);
	}

	if (sortParam === "top") {
		if (timeParam === "week") {
			const now = new Date();
			const oneWeekAgo = new Date(
				now.getFullYear(),
				now.getMonth(),
				now.getDate() - 7,
				now.getHours(),
				now.getMinutes(),
			);
			query.gt("created_at", oneWeekAgo.toISOString());
		} else if (timeParam == "month") {
			const now = new Date();
			const oneMonthAgo = new Date(
				now.getFullYear(),
				now.getMonth() - 1,
				now.getDate(),
				now.getHours(),
				now.getMinutes(),
			);
			query.gt("created_at", oneMonthAgo.toISOString());
		}
	}

	const { data, error } = await query.range(rangeNumber, rangeNumber + 3);
	if (error) {
		console.error(error);
		throw new Error("Can't connect to database right now :(");
	}
	const filteredData = data.filter((item) => item.profiles !== null);
	return filteredData;
}
