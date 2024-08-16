"use client";

import { NextUIProvider } from "@nextui-org/react";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NextUIProvider className="flex h-full grow flex-col">
			{children}
		</NextUIProvider>
	);
}
