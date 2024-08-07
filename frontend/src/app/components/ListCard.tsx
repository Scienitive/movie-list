import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Button,
} from "@nextui-org/react";
import { getMovieData } from "./actions";
import Image from "next/image";
import { TMovieInfo } from "./types";
import { IMDBIcon } from "../ui/icons/imdb";
import { TMDBIcon } from "../ui/icons/tmdb";

type props = {
	postId: number;
	username: string;
	title: string;
	movies: number[];
};

export default async function ListCard({
	postId,
	username,
	title,
	movies,
}: props) {
	const imageURL = "https://image.tmdb.org/t/p/w1280";
	const { data, error } = await getMovieData(movies);
	if (error) {
		console.error(error);
		return;
	}

	return (
		<Card className="flex w-2/3 flex-col bg-ml-white/10">
			<CardHeader className="flex items-center justify-center text-ml-red">
				{title}
			</CardHeader>
			<CardBody className="flex flex-row justify-center gap-8">
				{data.map((json: TMovieInfo, index: number) => (
					// WARNING key could be a problem here
					<Card key={index} className="group min-w-[120px]">
						<Image
							className="rounded-2xl border-2 border-ml-white"
							src={`${imageURL}${json.posterPath}`}
							width={120}
							height={120}
							alt={`${json.title} (${json.releaseYear})`}
						></Image>
						<CardFooter className="absolute bottom-0 left-0 w-full opacity-0 group-hover:opacity-100">
							<div className="flex w-full justify-around">
								<Button
									isIconOnly
									aria-label="IMDB"
									className="h-8 w-8 min-w-8 rounded-3xl border-1 border-ml-white"
								>
									<IMDBIcon width={100} height={100} />
								</Button>
								<Button
									isIconOnly
									aria-label="TMDB"
									className="h-8 w-8 min-w-8 rounded-3xl border-1 border-ml-white bg-[#0d253f]"
								>
									<TMDBIcon width={100} height={100} />
								</Button>
							</div>
						</CardFooter>
					</Card>
				))}
			</CardBody>
		</Card>
	);
}
