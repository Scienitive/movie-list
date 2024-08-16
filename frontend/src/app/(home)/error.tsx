"use client";

import { Button } from "@nextui-org/react";

export default function Error({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	return (
		<div className="flex grow flex-col items-center justify-center gap-4">
			<h1 className="text-2xl text-ml-white">Something went wrong!</h1>
			<Button onClick={reset} className="bg-ml-red text-ml-black">
				Try Again
			</Button>
		</div>
	);
}
