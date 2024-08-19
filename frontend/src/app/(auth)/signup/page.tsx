"use client";

import { signup } from "../actions";
import { Input, Button } from "@nextui-org/react";
import Alert from "@/app/ui/alert";
import clsx from "clsx";
import { useState } from "react";
import { signupSchema } from "../types";
import { useFormStatus } from "react-dom";

export default function SignupPage() {
	const [alertError, setAlertError] = useState("");

	const [usernameInvalid, setUsernameInvalid] = useState<boolean>(false);
	const [emailInvalid, setEmailInvalid] = useState<boolean>(false);
	const [passInvalid, setPassInvalid] = useState<boolean>(false);
	const [usernameErrorMessage, setUsernameErrorMessage] = useState<string>("");
	const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
	const [passErrorMessage, setPassErrorMessage] = useState<string>("");

	const onClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
		const form = e.currentTarget.form;
		if (!form) {
			return;
		}

		const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i;
		const usernameRegex = /^[a-zA-Z0-9_]+$/;

		const formData = new FormData(form);
		const data = {
			username: formData.get("username"),
			email: formData.get("email"),
			password: formData.get("password"),
		};

		if (!data.email?.toString().match(emailRegex)) {
			setEmailInvalid(true);
			setEmailErrorMessage("Please enter a valid email.");
		} else {
			setEmailInvalid(false);
		}

		if (data.username?.toString() === "") {
			setUsernameInvalid(true);
			setUsernameErrorMessage("Please enter a username.");
		} else if (!data.username?.toString().match(usernameRegex)) {
			setUsernameInvalid(true);
			setUsernameErrorMessage(
				"Username consists characters that are not allowed.",
			);
		} else if (
			(data.username?.toString().length ?? 0) < 3 ||
			(data.username?.toString().length ?? 0) > 12
		) {
			setUsernameInvalid(true);
			setUsernameErrorMessage("Username must be between 3 and 12 characters.");
		} else {
			setUsernameInvalid(false);
		}

		if (data.password?.toString() === "") {
			setPassInvalid(true);
			setPassErrorMessage("Please enter a password.");
		} else if ((data.password?.toString().length ?? 0) < 6) {
			setPassInvalid(true);
			setPassErrorMessage("Password must be at least 6 characters long.");
		} else {
			setPassInvalid(false);
		}
	};

	const formAction = async (formData: FormData) => {
		if (usernameInvalid || emailInvalid || passInvalid) {
			return;
		}

		const data = {
			username: formData.get("username"),
			email: formData.get("email"),
			password: formData.get("password"),
		};

		const validatedSignupSchema = signupSchema.safeParse(data);
		if (!validatedSignupSchema.success) {
			console.error(validatedSignupSchema.error);
			setAlertError(validatedSignupSchema.error.message);
			return;
		}

		const error = await signup(validatedSignupSchema.data);
		if (error) {
			setAlertError(error.message);
			return;
		}
	};

	const SubmitButton = () => {
		const status = useFormStatus();

		return (
			<Button
				isLoading={status.pending}
				type="submit"
				className="w-1/12 bg-ml-white text-black"
				onClick={onClickHandler}
			>
				{!status.pending ? "Sign up" : ""}
			</Button>
		);
	};

	return (
		<form
			action={formAction}
			className="flex flex-col items-center justify-center gap-6"
		>
			<Alert className={clsx({ hidden: alertError == "" })}>{alertError}</Alert>
			<Input
				type="text"
				name="username"
				label="Username"
				variant="bordered"
				isInvalid={usernameInvalid}
				errorMessage={usernameErrorMessage}
				className="w-1/3 min-w-80 max-w-2xl"
				classNames={{
					inputWrapper: "group-data-[focus=true]:border-ml-white/70",
					innerWrapper: "text-ml-white",
				}}
				required
			/>
			<Input
				type="email"
				name="email"
				label="Email"
				variant="bordered"
				isInvalid={emailInvalid}
				errorMessage={emailErrorMessage}
				className="w-1/3 min-w-80 max-w-2xl"
				classNames={{
					inputWrapper: "group-data-[focus=true]:border-ml-white/70",
					innerWrapper: "text-ml-white",
				}}
				required
			/>
			<Input
				type="password"
				name="password"
				label="Password"
				variant="bordered"
				isInvalid={passInvalid}
				errorMessage={passErrorMessage}
				className="w-1/3 min-w-80 max-w-2xl"
				classNames={{
					inputWrapper: "group-data-[focus=true]:border-ml-white/70",
					innerWrapper: "text-ml-white",
				}}
				required
			/>
			<SubmitButton />
		</form>
	);
}
