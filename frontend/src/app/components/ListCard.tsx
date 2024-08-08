import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Button,
	Link,
    Popover,
	PopoverTrigger,
	PopoverContent
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
			<CardBody className="flex flex-wrap flex-row justify-center gap-8 max-h-64 hover:max-h-[1000px] transition-all">
				{data.map((json: TMovieInfo, index: number) => (
					// WARNING key could be a problem here
					<Popover key={index} placement="top" offset={-20}>
						<PopoverTrigger>
					<Card as={Button} className="group/footer min-w-[120px] p-0 hover:scale-105">
						<Image
							className="rounded-2xl border-2 border-ml-white"
							src={`${imageURL}${json.posterPath}`}
							width={120}
							height={120}
							alt={`${json.title} (${json.releaseYear})`}
						></Image>
						<CardFooter className="absolute -bottom-2 left-0 w-full opacity-0 group-hover/footer:opacity-100 group-hover/footer:-translate-y-2 transition duration-300">
							<div className="flex w-full justify-around">
								<Button
									href={json.imdbURL}
									as={Link}
									isIconOnly
									aria-label="IMDB"
									className="h-8 w-8 min-w-8 rounded-3xl border-1 border-ml-white"
								>
									<IMDBIcon width={100} height={100} />
								</Button>
								<Button
									href={json.tmdbURL}
									as={Link}
									isIconOnly
									aria-label="TMDB"
									className="h-8 w-8 min-w-8 rounded-3xl border-1 border-ml-white bg-[#0d253f]"
								>
									<TMDBIcon width={100} height={100} />
								</Button>
							</div>
						</CardFooter>
					</Card>
					</PopoverTrigger>
						<PopoverContent><p>{`${json.title} (${json.releaseYear})`}</p></PopoverContent>
					</Popover>
				))}
			</CardBody>
			<CardFooter className="flex justify-between">
				<p className="text-ml-red">{`from ${username}`}</p>
			</CardFooter>
		</Card>
	);
}
