import { createClient } from "@/utils/supabase/server";
import { montserrat } from "./ui/fonts";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	Button,
} from "@nextui-org/react";
import Link from "next/link";

export default async function Header() {
	const supabase = createClient();
	const { data, error } = await supabase.auth.getUser();

	const notAuthenticatedNavbarContent = (
		<NavbarContent justify="end">
			<NavbarItem className="">
				<Button
					as={Link}
					href="/login"
					variant="bordered"
					className="border-ml-white text-ml-white"
				>
					Log in
				</Button>
			</NavbarItem>
			<NavbarItem className="">
				<Button
					as={Link}
					href="/signup"
					variant="bordered"
					className="border-ml-white text-ml-white"
				>
					Sign Up
				</Button>
			</NavbarItem>
		</NavbarContent>
	);

	return (
		<Navbar
			position="static"
			className="border-b border-ml-white bg-transparent"
		>
			<NavbarBrand>
				<Link href="/" className={`${montserrat.className} text-2xl`}>
					movie-list
				</Link>
			</NavbarBrand>
			{error || !data?.user ? (
				notAuthenticatedNavbarContent
			) : (
				<p>Authenticated</p>
			)}
		</Navbar>
		// <header
		// 	className={`${montserrat.className} flex min-h-[70px] border-b border-ml-white bg-transparent px-4 py-4 tracking-wide text-ml-white`}
		// >
		// 	{error || !data?.user ? <p>Not Authencticated</p> : <p>Authenticated</p>}
		// </header>
	);
}
