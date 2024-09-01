import { createClient } from "@/utils/supabase/server";
import { montserrat } from "@/app/ui/fonts";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	Button,
} from "@nextui-org/react";
import Link from "next/link";
import { MdSettings } from "react-icons/md";
import { getUsername } from "@/app/components/actions";
import LogoutButton from "@/app/(header)/components/LogoutButton";

export default async function Header() {
	const supabase = createClient();
	const { data, error } = await supabase.auth.getUser();
	let username = "";
	if (!error && data.user) {
		username = await getUsername();
	}

	const notAuthenticatedNavbarContent = (
		<NavbarContent justify="end">
			<NavbarItem className="">
				<Button
					as={Link}
					href="/login"
					variant="bordered"
					className="border-ml-white text-ml-white"
				>
					Log in / Sign up
				</Button>
			</NavbarItem>
		</NavbarContent>
	);

	const authenticatedNavbarContent = (
		<NavbarContent justify="end" className="gap-2 sm:gap-4">
			<NavbarItem>
				<Button
					as={Link}
					href={`/p/${username}`}
					variant="bordered"
					className="h-9 min-h-9 w-9 min-w-9 border-ml-white text-lg font-bold text-ml-white sm:h-10 sm:min-h-10 sm:w-auto sm:min-w-max sm:text-sm sm:font-normal"
				>
					<span className="hidden sm:block">{`@${username}`}</span>
					<span className="mb-1 block sm:hidden">{"@"}</span>
				</Button>
			</NavbarItem>
			<NavbarItem>
				<Button
					as={Link}
					href="/settings"
					isIconOnly={true}
					variant="bordered"
					className="h-9 min-h-9 w-9 min-w-9 border-ml-white text-ml-white sm:h-10 sm:min-h-10 sm:w-10 sm:min-w-10"
				>
					<MdSettings className="text-lg sm:text-xl" />
				</Button>
			</NavbarItem>
			<NavbarItem>
				<LogoutButton />
			</NavbarItem>
		</NavbarContent>
	);

	return (
		<Navbar
			position="static"
			className="border-b border-ml-white bg-transparent"
		>
			<NavbarBrand>
				<Link
					href="/"
					className={`${montserrat.className} text-2xl text-ml-white`}
				>
					movie-list
				</Link>
			</NavbarBrand>
			{error || !data?.user
				? notAuthenticatedNavbarContent
				: authenticatedNavbarContent}
		</Navbar>
		// <header
		// 	className={`${montserrat.className} flex min-h-[70px] border-b border-ml-white bg-transparent px-4 py-4 tracking-wide text-ml-white`}
		// >
		// 	{error || !data?.user ? <p>Not Authencticated</p> : <p>Authenticated</p>}
		// </header>
	);
}
