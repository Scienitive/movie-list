"use client";

import { Tooltip, Card, CardFooter, Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { IMDBIcon } from "../ui/icons/imdb";
import { TMDBIcon } from "../ui/icons/tmdb";
import { TMovieInfo } from "./types";
import { useState } from "react";
import clsx from "clsx";

type props = {
	key: number;
	json: TMovieInfo;
};

export default function MovieCard({ key, json }: props) {
	const imageURL = "https://image.tmdb.org/t/p/w1280";

	const [tooltipOpen, setTooltipOpen] = useState(false);

	return (
		<Tooltip
			key={key}
			content={`${json.title} (${json.releaseYear})`}
			offset={-2}
			delay={0}
			closeDelay={0}
			isOpen={tooltipOpen}
		>
			<Card
				onMouseEnter={() => {
					setTooltipOpen(true);
				}}
				onMouseLeave={() => {
					setTooltipOpen(false);
				}}
				className="group/footer min-w-[92px] max-w-[92px] rounded-3xl p-0 hover:scale-105 sm:min-w-[112px] sm:max-w-[112px]"
			>
				<Image
					className="rounded-3xl border-2 border-ml-white"
					src={`${imageURL}${json.posterPath}`}
					width={1280}
					height={1920}
					alt={`${json.title} (${json.releaseYear})`}
				></Image>
				<CardFooter className="absolute -bottom-2 left-0 w-full opacity-0 transition duration-300 group-hover/footer:-translate-y-2 group-hover/footer:opacity-100">
					<div className="flex w-full justify-around">
						<Button
							href={json.imdbURL}
							target="_blank"
							as={Link}
							isIconOnly
							aria-label="IMDB"
							className={clsx(
								"h-7 w-7 min-w-7 rounded-3xl border-1 border-ml-white sm:h-8 sm:w-8 sm:min-w-8",
								{ "pointer-events-none": !tooltipOpen },
							)}
						>
							<IMDBIcon width={100} height={100} />
						</Button>
						<Button
							href={json.tmdbURL}
							target="_blank"
							as={Link}
							isIconOnly
							aria-label="TMDB"
							className={clsx(
								"h-7 w-7 min-w-7 rounded-3xl border-1 border-ml-white bg-[#0d253f] sm:h-8 sm:w-8 sm:min-w-8",
								{ "pointer-events-none": !tooltipOpen },
							)}
						>
							<TMDBIcon width={100} height={100} />
						</Button>
					</div>
				</CardFooter>
			</Card>
		</Tooltip>
	);
}
