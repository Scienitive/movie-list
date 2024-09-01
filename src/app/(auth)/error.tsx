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
		<div className="flex grow flex-col items-center justify-center gap-3">
			<h1 className="text-5xl text-ml-red">Something went wrong!</h1>
			<p className="mb-2 text-ml-white">{error.message}</p>
			<Button onClick={reset} className="bg-ml-red text-ml-black">
				Try Again
			</Button>
		</div>
	);
}
