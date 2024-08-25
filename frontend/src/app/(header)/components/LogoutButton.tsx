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
			className="border-ml-white text-ml-white"
		>
			<MdLogout className="text-xl" />
		</Button>
	);
}
