type props = {
	username: string;
};

export default function UserDoesntExist({ username }: props) {
	return (
		<div className="flex flex-col items-center justify-center gap-2">
			<h1 className="text-5xl text-ml-red">{"This user doesn't exist"}</h1>
			<p className="text-2xl text-ml-white">{username}</p>
		</div>
	);
}
