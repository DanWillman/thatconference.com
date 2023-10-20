import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { page } from '$app/stores';

import favoritesQueryApi from '$dataSources/api.that.tech/me/favorites/queries';
import favoritesMutationsApi from '$dataSources/api.that.tech/me/favorites/mutations';

const { get } = favoritesQueryApi();
const { toggle: toggleMutation } = favoritesMutationsApi();

const favoritesStore = writable([]);

export async function toggle(sessionId, eventId) {
	let results = false;

	const favorite = await toggleMutation(sessionId, eventId);

	if (favorite) {
		// is toggled
		favoritesStore.update((i) => [...i, favorite]);
		results = true;
	} else {
		// not toggled
		favoritesStore.update((f) => f.filter((i) => i.id !== sessionId));
		results = false;
	}

	return results;
}

if (browser) {
	page.subscribe(async (values) => {
		if (values?.data?.user?.isAuthenticated) {
			const initalValues = await get();
			favoritesStore.set(initalValues);
		}
	});
}

export default favoritesStore;
