import { Suspense } from "react";
import { Spinner } from "@nextui-org/react";
import Settings from "@/app/components/Settings";
import { getUsername } from "@/app/components/actions";

export default async function SettingsPage() {
	const username = await getUsername();

	return (
		<Suspense
			fallback={
				<div className="flex grow flex-col justify-center">
					<Spinner
						size="lg"
						classNames={{
							circle1: "border-b-ml-red",
							circle2: "border-b-ml-red",
						}}
					/>
				</div>
			}
		>
			<Settings currentUsername={username} />
		</Suspense>
	);
}
