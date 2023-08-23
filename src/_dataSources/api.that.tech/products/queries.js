import gFetch from '$utils/gfetch';

import { log } from '../utilities/error';

const productBaseFieldsFragment = `
	fragment productBaseFields on ProductBase {
		id
		name
		description
		productType: type
		price
		isEnabled
		onSaleFrom
		onSaleUntil
	}
`;

export const QUERY_EVENT_PRODUCTS = `
	${productBaseFieldsFragment}
	query QueryEventProducts($eventId: ID!) {
		events {
			event(findBy: {id: $eventId}) {
				get {
					id
					startDate
					endDate
					logo
					name
					products {
						...productBaseFields
					}
				}
			}
		}
	}
`;

export default (fetch) => {
	const client = fetch ? gFetch(fetch) : gFetch();

	function queryProductsByEvent(eventId) {
		const variables = { eventId };

		return client.query({ query: QUERY_EVENT_PRODUCTS, variables }).then(({ data, errors }) => {
			if (errors) log({ errors, tag: 'QUERY_EVENT_PRODUCTS' });

			const { get } = data.events.event;
			return get;
		});
	}

	return { queryProductsByEvent };
};
