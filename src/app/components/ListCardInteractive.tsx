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
import { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa";
import Image from "next/image";
import { useDisclosure } from "@nextui-org/react";
import MyAutocomplete from "@/app/components/MyAutocomplete";
import toast from "react-hot-toast";
import to from "await-to-js";
import { createList } from "@/app/components/actions";
import { MdClose } from "react-icons/md";

type props = {
	username: string;
	setCreateList: Function;
};

type MovieData = {
	id: number;
	posterPath: string;
};

export default function ListCardInteractive({
	username,
	setCreateList,
}: props) {
	const imageURL = "https://image.tmdb.org/t/p/w1280";
	const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
	const [movies, setMovies] = useState<MovieData[]>([]);

	const [shareButtonLoad, setShareButtonLoad] = useState<boolean>(false);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const shareOnClick = async () => {
		// Client-Side validation
		setShareButtonLoad(true);

		if (!textareaRef.current) {
			toast.error("Internal Error.", { id: "NoTextArea" });
			setShareButtonLoad(false);
			return;
		} else if (!textareaRef.current.value) {
			toast.error("Title can't be empty.", { id: "NoTitle" });
			setShareButtonLoad(false);
			return;
		}

		if (movies.length === 0) {
			toast.error("You need to add at least one movie to create a list.", {
				id: "NoMovie",
			});
			setShareButtonLoad(false);
			return;
		} else if (movies.length > 15) {
			toast.error("You can't add more than 15 movies to one list.", {
				id: "TooMuchMovie",
			});
			setShareButtonLoad(false);
			return;
		}

		const movieIDs: number[] = movies.map((movie) => movie.id);
		const [error] = await to(createList(textareaRef.current.value, movieIDs));
		if (error) {
			toast.error(error.message, { id: "ActionError" });
			setShareButtonLoad(false);
			return;
		}

		toast.success("List has been created successfully!", { id: "ListSuccess" });
		setShareButtonLoad(false);
		setCreateList(false);
	};

	const removeMovie = (movieID: number) => {
		setMovies((prevMovies: MovieData[]) =>
			prevMovies.filter((movie) => movie.id !== movieID),
		);
	};

	return (
		<>
			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				hideCloseButton={true}
				placement="auto"
				className="bg-transparent"
			>
				<ModalContent>
					{() => (
						<MyAutocomplete
							movies={movies}
							setMovies={setMovies}
							modalOnClose={onClose}
						/>
					)}
				</ModalContent>
			</Modal>
			<Card className="flex w-11/12 flex-col border-1 bg-ml-white/10 md:w-4/5 lg:w-3/5">
				<CardHeader className="flex items-center justify-between px-6 py-2 text-ml-white sm:px-8 sm:py-3">
					<textarea
						ref={textareaRef}
						placeholder="Enter a title"
						className="h-auto flex-grow resize-none overflow-hidden bg-transparent text-lg text-ml-white focus:outline-none sm:text-2xl"
						rows={1}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
							}
						}}
						onInput={(e) => {
							const textarea = e.target as HTMLTextAreaElement;
							textarea.style.height = "auto";
							textarea.style.height = `${textarea.scrollHeight}px`;
						}}
						autoFocus
					/>
					<p className="text-base text-ml-red sm:text-xl">{`@${username}`}</p>
				</CardHeader>
				<CardBody className="flex flex-row flex-wrap items-center justify-center gap-4 border-y-1 bg-ml-white/10 px-4 py-4 sm:gap-8 sm:px-8">
					{movies.map((movie) => (
						<Card
							key={movie.id}
							className="group/footer min-w-[92px] max-w-[92px] rounded-3xl p-0 sm:min-w-[112px] sm:max-w-[112px]"
						>
							<Image
								unoptimized
								className="rounded-3xl border-2 border-ml-white"
								src={`${imageURL}${movie.posterPath}`}
								width={649}
								height={960}
								alt="Movie Poster"
							></Image>
							<CardFooter className="absolute -bottom-2 left-0 w-full opacity-0 transition duration-300 group-hover/footer:-translate-y-2 group-hover/footer:opacity-100">
								<div className="flex w-full justify-center">
									<Button
										isIconOnly
										className="h-8 w-8 min-w-8 rounded-3xl border-1 border-ml-black bg-ml-white sm:h-10 sm:w-10 sm:min-w-10"
										onClick={() => {
											removeMovie(movie.id);
										}}
									>
										<MdClose className="text-2xl text-ml-black sm:text-3xl" />
									</Button>
								</div>
							</CardFooter>
						</Card>
					))}
					{movies.length < 15 && (
						<Button
							isIconOnly={true}
							disableRipple={true}
							className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-ml-white bg-transparent p-0 sm:h-14 sm:w-14"
							onPress={onOpen}
						>
							<FaPlus className="text-3xl text-ml-white" />
						</Button>
					)}
				</CardBody>
				<CardFooter className="flex flex-col px-6 py-2 sm:px-8 sm:py-3">
					<div className="flex w-full justify-center gap-4">
						<Button
							onClick={shareOnClick}
							isLoading={shareButtonLoad}
							className="bg-ml-red font-semibold"
						>
							Share
						</Button>
						<Button
							className="font-semibold"
							onClick={() => {
								setCreateList(false);
							}}
						>
							Cancel
						</Button>
					</div>
				</CardFooter>
			</Card>
		</>
	);
}
