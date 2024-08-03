"use client";

import { useState } from "react";
import { login } from "../actions";
import { Input, Button } from "@nextui-org/react";
import Alert from "@/app/ui/alert";
import clsx from "clsx";
import { useFormStatus } from "react-dom";
import { loginSchema } from "../types";

export default function LoginPage() {
	const [error, setError] = useState("");

	const formAction = async (formData: FormData) => {
		const data = {
			email: formData.get("email"),
			password: formData.get("password"),
		};

		const validatedLoginSchema = loginSchema.safeParse(data);
		if (!validatedLoginSchema.success) {
			console.error(validatedLoginSchema.error);
			setError(validatedLoginSchema.error.message);
			return;
		}

		const { error } = await login(validatedLoginSchema.data);
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
