<script>
	export let event;
	export let days = [];
	export let isOnline = false;

	import dayjs from 'dayjs';
	import advancedFormat from 'dayjs/plugin/advancedFormat';
	import { scrollto } from 'svelte-scrollto';

	import Hero from '$elements/layouts/Hero.svelte';

	dayjs.extend(advancedFormat);

	const venue = event.venues[0];
</script>

<Hero imagePath="/images/heros/speaker.jpg">
	<div>
		<div class="flex max-w-3xl flex-col space-y-8 px-4">
			<h2 class="text-2xl font-bold uppercase tracking-wider text-white antialiased">
				{#if isOnline}
					<span class="text-green-500">ONLINE</span> / {dayjs(event.startDate).format('MMMM Do')} - {dayjs(
						event.endDate
					).format('Do, YYYY')}
				{:else}
					<span class="text-green-500">{`${venue.city}, ${venue.state}`}</span> / {dayjs(
						event.startDate
					).format('MMMM Do')} - {dayjs(event.endDate).format('Do, YYYY')}
				{/if}
			</h2>
			<h1
				class="text-4xl font-extrabold uppercase text-white sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
				THAT Conference <br />
				Schedule
			</h1>
		</div>

		<div
			class="mt-24 flex flex-col justify-center space-y-4 p-8 lg:flex-row lg:space-x-4 lg:space-y-0">
			{#each days as day}
				<div class="flex-1 cursor-pointer">
					<!-- svelte-ignore a11y-missing-attribute -->
					<a class="w-full text-center" use:scrollto={`#${day.toLowerCase()}`}>
						<div
							class="transform rounded-lg border-2 border-thatBlue-400 px-12 py-6 transition duration-500 ease-in-out hover:scale-105">
							<p class="text-2xl font-extrabold uppercase tracking-wider text-white antialiased">
								{day}
							</p>
						</div>
					</a>
				</div>
			{/each}
		</div>

		<div class="pt-10 text-center text-2xl font-bold tracking-wider text-green-500">
			<p>Times are represented in your browser's timezone.</p>
			<p>THAT Conference is in Central Time.</p>
		</div>
	</div>
</Hero>
