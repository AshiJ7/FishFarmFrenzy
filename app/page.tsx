import Image from "next/image";

export default function Home() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			<main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-24 px-8 bg-white dark:bg-black">
				<h1 className="text-4xl font-bold text-black dark:text-zinc-50">Home</h1>
				<p className="mt-4 max-w-2xl text-center text-lg text-zinc-600 dark:text-zinc-400">
					Welcome to Fish Farm Frenzy — choose a mini-game from the navigation to begin.
				</p>
			</main>
		</div>
	);
}
