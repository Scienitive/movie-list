import { Button } from "@nextui-org/react";
import Link from "next/link";

export default function NotFoundPage() {
	return (
		<div className="flex grow flex-col items-center justify-center gap-3">
			<h1 className="text-5xl text-ml-red">404 Not Found</h1>
			<p className="mb-2 text-ml-white">This page does not exist!</p>
			<Button as={Link} href={"/"} className="bg-ml-red text-ml-black">
				Return To Home
			</Button>
		</div>
	);
}
