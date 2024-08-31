"use client";

import { logout } from "@/app/(header)/actions";
import toast from "react-hot-toast";
import { Button } from "@nextui-org/react";
import { MdLogout } from "react-icons/md";

export default function LogoutButton() {
	const onLogout = async () => {
		const { error } = await logout();
		if (error) {
			toast.error("Error while signing out.", { id: "SignOutError" });
		}
	};

	return (
		<Button
			onClick={onLogout}
			isIconOnly={true}
			variant="bordered"
			className="h-9 min-h-9 w-9 min-w-9 border-ml-white text-ml-white sm:h-10 sm:min-h-10 sm:w-10 sm:min-w-10"
		>
			<MdLogout className="text-lg sm:text-xl" />
		</Button>
	);
}
