export function waitForSelector(selector: string): Promise<Element> {
    return new Promise(resolve => {
        const found = document.querySelector(selector)
        if (found) return resolve(found);


        const observer = new MutationObserver(() => {
            const found = document.querySelector(selector)
            if (found) {
                observer.disconnect();
                resolve(found);
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}