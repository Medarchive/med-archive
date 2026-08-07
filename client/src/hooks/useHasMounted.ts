/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";

// Guards top-level "loading ? A : B" branches that depend on client-fetched
// query state. The server always renders the loading branch (no cached
// data), but if the query resolves before hydration finishes, the client's
// first render can diverge from the server HTML and trigger a hydration
// mismatch. Gating on this ensures the first client render always matches
// the server's, and the real branch only takes over post-mount.
export function useHasMounted() {
	const [hasMounted, setHasMounted] = useState(false);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	return hasMounted;
}
