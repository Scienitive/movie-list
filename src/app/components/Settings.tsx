"use client";

import { saveSettings } from "@/app/components/actions";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import to from "await-to-js";
import toast from "react-hot-toast";

type props = {
	currentUsername: string;
};

export default function Settings({ currentUsername }: props) {
	const [usernameInvalid, setUsernameInvalid] = useState<boolean>(false);
	const [usernameErrorMessage, setUsernameErrorMessage] = useState<string>("");

	const onClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
		const form = e.currentTarget.form;
		if (!form) {
			return;
		}

		const usernameRegex = /^[A-Za-z0-9_]*$/;

		const formData = new FormData(form);
		const data = {
			username: formData.get("username"),
		};

		if (data.username?.toString() === "") {
			data.username = currentUsername;
		} else if (
			(data.username?.toString().length ?? 0) < 3 ||
			(data.username?.toString().length ?? 0) > 16
		) {
			setUsernameInvalid(true);
			setUsernameErrorMessage("Username must be between 3 and 12 characters.");
		} else if (!data.username?.toString().match(usernameRegex)) {
			setUsernameInvalid(true);
			setUsernameErrorMessage(
				"Username consists characters that are not allowed.",
			);
		} else {
			setUsernameInvalid(false);
		}
	};

	const formAction = async (formData: FormData) => {
		if (usernameInvalid) {
			return;
		}

		const data = {
			username: formData.get("username"),
		};

		if (!data.username) {
			return;
		}

		const [error] = await to(saveSettings(data.username.toString()));
		if (error) {
			toast.error(error.message, { id: "SaveSettingsError" });
			return;
		}

		toast.success("Successfully saved!", { id: "SaveSettingsSuccess" });
	};

	return (
		<div className="flex flex-row justify-center">
			<form
				action={formAction}
				className="flex w-7/12 flex-col gap-4 sm:w-[400px]"
			>
				<Input
					type="text"
					name="username"
					label="Username"
					size="lg"
					variant="bordered"
					isInvalid={usernameInvalid}
					errorMessage={usernameErrorMessage}
					placeholder={currentUsername}
					classNames={{
						inputWrapper: "group-data-[focus=true]:border-ml-white/70",
						innerWrapper: "text-ml-white",
					}}
				/>
				<Button onClick={onClickHandler} type="submit">
					Save
				</Button>
			</form>
		</div>
	);
}
