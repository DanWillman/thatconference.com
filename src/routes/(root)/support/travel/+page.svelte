<script>
	import seoMetaTags from '$lib/seo/metaTags';
	import Seo from '$components/Seo.svelte';

	import Header from '../_components/_Header.svelte';

	const metaTags = ((title = 'Travel Information - THAT') => ({
		title,
		tags: seoMetaTags({
			title,
			description: '',
			openGraph: {
				type: 'website',
				url: `https://thatconference.com/support/travel`
			}
		})
	}))();
</script>

<Seo title={metaTags.title} tags={metaTags.tags} />

<Header pretext="THAT Campsite">Travel and Lodging Information</Header>

<div class="flex flex-col place-content-center gap-4 md:grid md:grid-cols-2">
	<div class="transform p-12 transition duration-500 ease-in-out hover:scale-105">
		<a href="/support/travel/wi">
			<img src="/images/that-wi-logo.svg" alt="wi logo" />
		</a>
	</div>
	<div class="transform p-12 transition duration-500 ease-in-out hover:scale-105">
		<a href="/support/travel/tx">
			<img src="/images/that-tx-logo.svg" alt="tx logo" />
		</a>
	</div>
</div>
