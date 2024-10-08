import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Header from "@/app/(header)/Header";
import Footer from "@/app/(footer)/Footer";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "movie-list",
	description: "A website for creating and sharing movie lists.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-full bg-ml-black">
			<body
				className={`${inter.className} flex min-h-full flex-col bg-ml-black`}
			>
				<Header></Header>
				<Toaster
					position="top-right"
					toastOptions={{
						className: "bg-ml-red",
						error: {
							style: {
								background: "#dae1e6",
							},
						},
					}}
				/>
				<Providers>{children}</Providers>
				<Footer />
			</body>
		</html>
	);
}
