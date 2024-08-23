"use client";

import {
	Card,
	CardBody,
	CardHeader,
	CardFooter,
	Button,
	Modal,
	ModalContent,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import Image from "next/image";
import { useDisclosure } from "@nextui-org/react";
import MyAutocomplete from "@/app/components/MyAutocomplete";

type props = {
	apiToken: string;
	username: string;
};

type MovieData = {
	id: number;
	posterPath: string;
};

export default function ListCardInteractive({ apiToken, username }: props) {
	const imageURL = "https://image.tmdb.org/t/p/w1280";
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const [movies, setMovies] = useState<MovieData[]>([]);

	return (
		<>
			<Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton={true}>
				<ModalContent>
					{() => (
						<MyAutocomplete
							apiToken={apiToken}
							setMovies={setMovies}
							modalOnClose={onClose}
						/>
					)}
				</ModalContent>
			</Modal>
			<Card className="flex w-11/12 flex-col border-1 bg-ml-white/10 md:w-4/5 lg:w-3/5">
				<CardHeader className="flex items-center justify-between px-6 py-2 text-ml-white sm:px-8 sm:py-3">
					<textarea
						placeholder="Enter a title"
						className="h-auto flex-grow resize-none overflow-hidden bg-transparent text-lg text-ml-white focus:outline-none sm:text-2xl"
						rows={1}
						onInput={(e) => {
							const textarea = e.target as HTMLTextAreaElement;
							textarea.style.height = "auto";
							textarea.style.height = `${textarea.scrollHeight}px`;
						}}
						autoFocus
					/>
					<p className="text-base text-ml-red sm:text-xl">{`@${username}`}</p>
				</CardHeader>
				<CardBody className="flex flex-row flex-wrap justify-center gap-6 border-y-1 bg-ml-white/10 px-4 py-4 sm:gap-8 sm:px-8">
					{movies.map((movie) => (
						<Card
							key={movie.id}
							className="min-w-[92px] max-w-[92px] rounded-3xl p-0 sm:min-w-[112px] sm:max-w-[112px]"
						>
							<Image
								className="rounded-3xl border-2 border-ml-white"
								src={`${imageURL}${movie.posterPath}`}
								width={1280}
								height={1920}
								alt="Movie Poster"
							></Image>
						</Card>
					))}
					<Button
						isIconOnly={true}
						disableRipple={true}
						className="sm:max-h[166px] flex max-h-[136px] min-h-[136px] min-w-[92px] max-w-[92px] items-center justify-center rounded-3xl border-2 border-ml-white bg-transparent p-0 sm:min-h-[166px] sm:min-w-[112px] sm:max-w-[112px]"
						onPress={onOpen}
					>
						<FaPlus className="text-4xl text-ml-white" />
					</Button>
				</CardBody>
				<CardFooter className="flex flex-col px-6 py-2 sm:px-8 sm:py-3">
					<div className="flex w-full justify-center gap-4">
						<Button>Share</Button>
						<Button>Cancel</Button>
					</div>
				</CardFooter>
			</Card>
		</>
	);
}
