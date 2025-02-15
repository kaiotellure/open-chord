import { log } from "./tools";

export function waitForSelector<T = HTMLDivElement>(
	selector: string,
): Promise<T> {
	return new Promise((resolve) => {
		const found = document.querySelector(selector);
		if (found) return resolve(found as T);

		const observer = new MutationObserver(() => {
			const found = document.querySelector(selector);
			if (found) {
				observer.disconnect();
				resolve(found as T);
			}
		});

		// If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
		observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	});
}

export function watchForTitleChanges() {
	const title = document.querySelector("title");

	if (!title) {
		log("error", "somehow the document head title element was not found");
		return watchForTitleChanges();
	}

	const observer = new MutationObserver(() => {
		window.dispatchEvent(new Event("onTitleChanged"));
	});

	observer.observe(title, { childList: true });
	log("info", "watching for navigations");
}
