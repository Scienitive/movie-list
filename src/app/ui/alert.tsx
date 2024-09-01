import { ReactNode } from "react";

interface AlertProps {
	children: ReactNode;
	className?: string;
}

export default function Alert({ children, className }: AlertProps) {
	return (
		<div
			className={`relative flex h-10 w-1/3 items-center gap-2 border border-red-400 bg-red-100 px-4 text-red-700 ${className ?? ""}`}
			role="alert"
		>
			<strong className="font-bold">Oops...</strong>
			<span className="block sm:inline">{children}</span>
		</div>
	);
}
