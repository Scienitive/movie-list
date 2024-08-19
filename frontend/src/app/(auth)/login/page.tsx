"use client";

import { useState } from "react";
import { login } from "../actions";
import { Input, Button } from "@nextui-org/react";
import Alert from "@/app/ui/alert";
import clsx from "clsx";
import { useFormStatus } from "react-dom";
import { loginSchema } from "../types";

export default function LoginPage() {
	const [alertError, setAlertError] = useState("");

	const [emailInvalid, setEmailInvalid] = useState<boolean>(false);
	const [passInvalid, setPassInvalid] = useState<boolean>(false);
	const [emailErrorMessage, setEmailErrorMessage] = useState<string>("");
	const [passErrorMessage, setPassErrorMessage] = useState<string>("");

	const onClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
		const form = e.currentTarget.form;
		if (!form) {
			return;
		}

		const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i;
		const formData = new FormData(form);
		const data = {
			email: formData.get("email"),
			password: formData.get("password"),
		};

		if (!data.email?.toString().match(emailRegex)) {
			setEmailInvalid(true);
			setEmailErrorMessage("Please enter a valid email.");
		} else {
			setEmailInvalid(false);
		}

		if (data.password?.toString() === "") {
			setPassInvalid(true);
			setPassErrorMessage("Please enter a password.");
		} else {
			setPassInvalid(false);
		}
	};

	const formAction = async (formData: FormData) => {
		const data = {
			email: formData.get("email"),
			password: formData.get("password"),
		};

		const validatedLoginSchema = loginSchema.safeParse(data);
		if (!validatedLoginSchema.success) {
			console.error(validatedLoginSchema.error);
			setAlertError(validatedLoginSchema.error.message);
			return;
		}

		const error = await login(validatedLoginSchema.data);
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
				{!status.pending ? "Log in" : ""}
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
				type="email"
				name="email"
				label="Email"
				variant="bordered"
				isInvalid={emailInvalid}
				errorMessage={emailErrorMessage}
				className="w-1/3 min-w-80 max-w-2xl border-red-800"
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
