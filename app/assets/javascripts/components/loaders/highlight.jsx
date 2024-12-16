// import LazyLoaderFactory, {
//     importPrefetch
// } from '@js/components/loaders/lazyLoader';
//
// export const loadHighlight = () => (
//     importPrefetch(import(/* webpackChunkName: "highlight" */ '@js/components/theme/highlight'))
// );
//
// export default loadHighlight;

import {
    manageImportError
} from '@js/actions/errorActions';

export default function HighlightLoader(callback) {
    import(/* webpackChunkName: "highlight" */ '@js/components/theme/highlight')
        .then((highlight) => {
            if (typeof callback === 'function') {
                callback({HighlightCode: highlight.default});
            }
        })
        .catch(manageImportError);
}
