'use strict';

// import LazyLoaderFactory, {
//     importPrefetch
// } from './lazyLoader';
//
// export const loadHighlight = () => (
//     importPrefetch(import(/* webpackChunkName: "highlight" */ '../theme/highlight'))
// );
//
// export default loadHighlight;

export default function HighlightLoader(callback) {
    import(/* webpackChunkName: "highlight" */ '../theme/highlight')
        .then((highlight) => {
            if (typeof callback === 'function') {
                callback({HighlightCode: highlight.default})
            }
        })
        .catch(error => console.error('Failed to load highlight', error));
}
