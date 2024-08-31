"use client";

import { OAuthLogin } from "../actions";
import { Button } from "@nextui-org/react";
import {
	FaGoogle,
	FaTwitter,
	FaGithub,
	FaDiscord,
	FaSpotify,
} from "react-icons/fa";

export default function LoginPage() {
	const oAuthButtonHandler = async (
		provider: "google" | "twitter" | "github" | "discord" | "spotify",
	) => {
		await OAuthLogin(provider);
	};

	return (
		<div className="flex w-full justify-center">
			<div className="flex w-7/12 flex-col justify-center gap-4 sm:w-[400px]">
				<Button
					startContent={<FaGoogle />}
					size="lg"
					onClick={() => {
						oAuthButtonHandler("google");
					}}
					className="bg-ml-white"
				>
					Login with Google
				</Button>
				<Button
					startContent={<FaTwitter />}
					size="lg"
					onClick={() => {
						oAuthButtonHandler("twitter");
					}}
					className="bg-ml-white"
				>
					Login with Twitter
				</Button>
				<Button
					startContent={<FaGithub />}
					size="lg"
					onClick={() => {
						oAuthButtonHandler("github");
					}}
					className="bg-ml-white"
				>
					Login with Github
				</Button>
				<Button
					startContent={<FaDiscord />}
					size="lg"
					onClick={() => {
						oAuthButtonHandler("discord");
					}}
					className="bg-ml-white"
				>
					Login with Discord
				</Button>
				<Button
					startContent={<FaSpotify />}
					size="lg"
					onClick={() => {
						oAuthButtonHandler("spotify");
					}}
					className="bg-ml-white"
				>
					Login with Spotify
				</Button>
			</div>
		</div>
	);
}
