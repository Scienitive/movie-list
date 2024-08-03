"use client";

import { signup } from "../actions";
import { Input, Button } from "@nextui-org/react";
import Alert from "@/app/ui/alert";
import clsx from "clsx";
import { useState } from "react";
import { signupSchema } from "../types";
import { useFormStatus } from "react-dom";

export default function SignupPage() {
	const [error, setError] = useState("");

	const formAction = async (formData: FormData) => {
		const data = {
			username: formData.get("username"),
			email: formData.get("email"),
			password: formData.get("password"),
		};

		const validatedSignupSchema = signupSchema.safeParse(data);
		if (!validatedSignupSchema.success) {
			console.error(validatedSignupSchema.error);
			setError(validatedSignupSchema.error.message);
			return;
		}

		const { error } = await signup(validatedSignupSchema.data);
		if (error ?? false) {
			setError(error);
		}
	};

	const SubmitButton = () => {
		const status = useFormStatus();

		return (
			<Button
				isLoading={status.pending}
				type="submit"
				className="w-1/12 bg-ml-white text-black"
			>
				{!status.pending ? "Log in" : ""}
			</Button>
		);
	};

	return (
		<form
			action={formAction}
			className="flex h-screen flex-col items-center justify-center gap-6"
		>
			<Alert className={clsx({ hidden: error == "" })}>{error}</Alert>
			<Input
				type="text"
				name="username"
				label="Username"
				variant="bordered"
				className="w-1/3 min-w-80 max-w-2xl"
				required
			/>
			<Input
				type="email"
				name="email"
				label="Email"
				variant="bordered"
				className="w-1/3 min-w-80 max-w-2xl"
				required
			/>
			<Input
				type="password"
				name="password"
				label="Password"
				variant="bordered"
				className="w-1/3 min-w-80 max-w-2xl"
				required
			/>
			<SubmitButton />
		</form>
	);
}
