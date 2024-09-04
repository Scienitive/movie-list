import PrivacyPolicy from "@/app/(footer)/PrivacyPolicy";
import { TMDBIcon } from "@/app/ui/icons/tmdb";
import Link from "next/link";
import { FaLinkedin, FaGithub, FaItchIo, FaGlobe } from "react-icons/fa";

export default async function Feader() {
	return (
		<footer className="flex flex-row items-center justify-around border-t-[1px] border-t-ml-white pb-2 pt-3">
			<div className="flex flex-col items-center gap-1">
				<Link
					href={"https://www.themoviedb.org/"}
					target="_blank"
					className="w-[80px] sm:w-[160px]"
				>
					<TMDBIcon />
				</Link>
				<p className="w-[140px] text-center text-[9px] text-ml-white/50 sm:w-auto sm:text-[10px]">
					This product uses the TMDB API but is not endorsed or certified by
					TMDB.
				</p>
			</div>
			<div className="flex flex-col-reverse items-center gap-1">
				<PrivacyPolicy />
				<p className="text-[9px] text-ml-white/50 sm:text-sm">
					Made by Altuğ Alpcan Yaşar:
					<Link href={"https://alyasar.dev"} className="ml-[6px] text-ml-red">
						alyasar.dev
					</Link>
				</p>
				<div className="flex flex-row gap-2">
					<Link
						href={"https://alyasar.dev"}
						target="_blank"
						className="bg-transparent text-xl text-ml-white sm:text-3xl"
					>
						<FaGlobe />
					</Link>
					<Link
						href={"https://www.linkedin.com/in/alyasar"}
						target="_blank"
						className="bg-transparent text-xl text-ml-white sm:text-3xl"
					>
						<FaLinkedin />
					</Link>
					<Link
						href={"https://github.com/Scienitive"}
						target="_blank"
						className="bg-transparent text-xl text-ml-white sm:text-3xl"
					>
						<FaGithub />
					</Link>
					<Link
						href={"https://scienitive.itch.io/"}
						target="_blank"
						className="bg-transparent text-xl text-ml-white sm:text-3xl"
					>
						<FaItchIo />
					</Link>
				</div>
			</div>
		</footer>
	);
}
