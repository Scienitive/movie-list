import { createClient } from "@/utils/supabase/server";
import ListCard from "./components/ListCard";

export default async function Home() {
	const supabase = createClient();

	const { data, error } = await supabase
		.from("lists")
		.select("id, title, movies, profiles(username)")
		.range(0, 4);
	if (error) {
		console.error(error);
		return;
	}

	console.log(data);
	return (
		<main className="flex flex-col items-center gap-8">
			{data?.map((json) => (
				<ListCard
					key={json.id}
					postId={json.id}
					username={json.profiles.username}
					title={json.title}
					movies={json.movies}
				/>
			))}
		</main>
	);
}
