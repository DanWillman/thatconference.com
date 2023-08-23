import gFetch from '$utils/gfetch';

import { log } from '../utilities/error';

const userFragment = `
	fragment memberFields on PublicProfile {
		id
		firstName
		lastName
		company
		jobTitle
		profileImage
		profileSlug
		lifeHack
		interests
		profileLinks {
			isPublic
			linkType
			url
		}
		earnedMeritBadges {
			id
			name
			image
			description
		}    
	}
`;

export const QUERY_MEMBERS_INITAL = `
		${userFragment}
		query QUERY_MEMBERS_INITAL_PAGED($pageSize: Int) {
			members {
				members (pageSize: $pageSize, orderBy:CREATEDAT) {
					cursor
					members {
						...memberFields
					}
				}
			}
		}
`;

export const QUERY_MEMBERS_NEXT = `
		${userFragment}
		query QUERY_MEMBERS_NEXT_PAGED($pageSize: Int, $after: String) {
			members {
				members (pageSize: $pageSize, after: $after, orderBy:CREATEDAT) {
					cursor
					members {
						...memberFields
					}
				}
			}
		}
`;

export const QUERY_IS_SLUG_TAKEN = `
	query slugCheck($slug: Slug!) {
		members {
		 isProfileSlugTaken(slug: $slug)
		}
	}
`;

export const QUERY_MEMBER_BY_SLUG = `
	query getMemberBySlug ($slug: Slug!, $sessionStartDate: Date, $filter: AcceptedSessionFilter) {
		members {
			member(slug: $slug) {
				id
				firstName
				lastName
				bio
				company
				jobTitle
				profileSlug
				profileImage
				interests
				lifeHack
				createdAt
				profileLinks {
					linkType
					url
				}
				earnedMeritBadges {
					id
					name
					image
				}
				sessions(filter: $filter, asOfDate: $sessionStartDate) {
					id
					title
					startTime
					shortDescription
				}
			}
		}
	}
`;

export const QUERY_BLOG_AUTHOR_BY_SLUG = `
	query getMemberBySlug ($slug: Slug!) {
		members {
			member(slug: $slug) {
				id
				firstName
				lastName
				profileSlug
				profileImage
			}
		}
	}
`;

export const QUERY_MEMBER_ACTIVITIES = `
	query getMemberActivities ($slug: Slug!, $sessionStartDate: Date, $filter: AcceptedSessionFilter) {
		members {
			member(slug: $slug) {
				sessions(filter: $filter, asOfDate: $sessionStartDate) {
					id
					title
					startTime
					shortDescription
				}
			}
		}
	}
`;

export const QUERY_FOLLOWERS = `
	query queryMemberFollowers($slug: Slug!) {
		members {
			member(slug: $slug) {
				id
				followCount
				followers {
					cursor
					profiles {
						id
						profileSlug
						profileImage
						firstName
						lastName
					}
				}
			}
		}
	}
`;

export const QUERY_NEXT_FOLLOWERS = `
	query queryNextMemberFollowers($slug: Slug!, $cursor: String) {
		members {
			member(slug: $slug) {
				id
				followers(cursor: $cursor) {
					cursor
					profiles {
						id
						profileSlug
						profileImage
						firstName
						lastName
					}
				}
			}
		}
	}
`;

export default (fetch) => {
	const client = fetch ? gFetch(fetch) : gFetch();

	const isSlugTaken = (slug) => {
		const variables = { slug };
		return client
			.secureQuery({ query: QUERY_IS_SLUG_TAKEN, variables })
			.then(({ data, errors }) => {
				if (errors) log({ errors, tag: 'QUERY_IS_SLUG_TAKEN' });

				let isTaken = true;
				if (data) isTaken = data.members.isProfileSlugTaken;
				return isTaken;
			});
	};

	const queryMembers = (pageSize = 50) => {
		const variables = { pageSize };

		return client.query({ query: QUERY_MEMBERS_INITAL, variables }).then(({ data, errors }) => {
			if (errors) log({ errors, tag: 'QUERY_MEMBERS_INITAL' });

			return data?.members?.members || null;
		});
	};

	const queryMembersNext = (after, pageSize = 50) => {
		const variables = { pageSize, after };
		return client.query({ query: QUERY_MEMBERS_NEXT, variables }).then(({ data, errors }) => {
			if (errors) log({ errors, tag: 'QUERY_MEMBERS_NEXT' });

			return data?.members?.members || null;
		});
	};

	const queryMemberBySlug = (
		slug,
		sessionStartDate = new Date(new Date().setHours(0, 0, 0, 0)),
		filter = 'UPCOMING'
	) => {
		const variables = {
			slug,
			sessionStartDate,
			filter
		};
		return client.query({ query: QUERY_MEMBER_BY_SLUG, variables }).then(({ data, errors }) => {
			if (errors) log({ errors, tag: 'QUERY_MEMBER_BY_SLUG' });

			return data?.members?.member || null;
		});
	};

	const queryBlogAuthorBySlug = (slug) => {
		const variables = {
			slug
		};
		return client
			.query({ query: QUERY_BLOG_AUTHOR_BY_SLUG, variables })
			.then(({ data, errors }) => {
				if (errors) log({ errors, tag: 'QUERY_BLOG_AUTHOR_BY_SLUG' });

				return data?.members?.member || null;
			});
	};

	const queryMemberActivities = (
		slug,
		sessionStartDate = new Date(new Date().setHours(0, 0, 0, 0)),
		filter = 'UPCOMING'
	) => {
		const variables = {
			slug,
			sessionStartDate,
			filter
		};
		return client.query({ query: QUERY_MEMBER_ACTIVITIES, variables }).then(({ data, errors }) => {
			if (errors) log({ errors, tag: 'QUERY_MEMBER_ACTIVITIES' });

			return data?.members?.member?.sessions || null;
		});
	};

	const queryNextMemberActivities = (
		slug,
		sessionStartDate = new Date(new Date().setHours(0, 0, 0, 0)),
		filter = 'UPCOMING'
	) => {
		const variables = {
			slug,
			sessionStartDate,
			filter
		};
		return client.query({ query: QUERY_MEMBER_ACTIVITIES, variables }).then(({ data, errors }) => {
			if (errors) log({ errors, tag: 'QUERY_MEMBER_ACTIVITIES' });

			return data?.members?.member?.sessions || [];
		});
	};

	const queryFollowers = (slug) => {
		const variables = { slug };

		return client.query({ query: QUERY_FOLLOWERS, variables }).then(({ data, errors }) => {
			if (errors) log({ errors, tag: 'QUERY_FOLLOWERS' });

			return data?.members?.member || []; // followerCount and followers are in partner
		});
	};

	const queryNextFollowers = (id, cursor) => {
		const variables = { id, cursor };
		return client.query({ query: QUERY_NEXT_FOLLOWERS, variables }).then(({ data, errors }) => {
			if (errors) log({ errors, tag: 'QUERY_NEXT_FOLLOWERS' });

			return data?.members?.member || null;
		});
	};

	return {
		queryMembers,
		queryMembersNext,
		queryMemberBySlug,
		queryMemberActivities,
		queryNextMemberActivities,
		queryFollowers,
		queryNextFollowers,
		isSlugTaken,
		queryBlogAuthorBySlug
	};
};
