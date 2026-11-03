// Keep bookmarked/shared links working after plans moved off the homepage.
export function legacyMembershipDestination(hash: string, search: string): string | null {
 return hash === '#memberships' || hash === '#membership' ? '/membership/' + search : null;
}
