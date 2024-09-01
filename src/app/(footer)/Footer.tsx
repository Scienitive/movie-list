import { TMDBIcon } from "@/app/ui/icons/tmdb";
import Link from "next/link";
import { FaLinkedin, FaGithub, FaItchIo, FaGlobe } from "react-icons/fa";

export default async function Feader() {
	return (
		<footer className="flex flex-row items-center justify-around border-t-[1px] border-t-ml-white pb-2 pt-3">
			<div className="flex flex-col items-center">
				<Link href={"https://www.themoviedb.org/"} target="_blank">
					<TMDBIcon height={20} width={160} />
				</Link>
				<p className="text-[10px] text-ml-white/50">
					This product uses the TMDB API but is not endorsed or certified by
					TMDB.
				</p>
			</div>
			<div className="flex flex-col-reverse items-center gap-1">
				<p className="text-sm text-ml-white/50">
					Made by Altuğ Alpcan Yaşar:
					<Link href={"https://alyasar.dev"} className="ml-[6px] text-ml-red">
						alyasar.dev
					</Link>
				</p>
				<div className="flex flex-row gap-2">
					<Link
						href={"https://alyasar.dev"}
						target="_blank"
						className="bg-transparent text-3xl text-ml-white"
					>
						<FaGlobe />
					</Link>
					<Link
						href={"https://www.linkedin.com/in/alyasar"}
						target="_blank"
						className="bg-transparent text-3xl text-ml-white"
					>
						<FaLinkedin />
					</Link>
					<Link
						href={"https://github.com/Scienitive"}
						target="_blank"
						className="bg-transparent text-3xl text-ml-white"
					>
						<FaGithub />
					</Link>
					<Link
						href={"https://scienitive.itch.io/"}
						target="_blank"
						className="bg-transparent text-3xl text-ml-white"
					>
						<FaItchIo />
					</Link>
				</div>
			</div>
		</footer>
	);
}
