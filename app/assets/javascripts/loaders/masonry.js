
import {
    manageImportError
} from '@js/actions/errorActions';

export default function Masonry(callback) {
    import(/* webpackChunkName: "masonry" */ 'react-masonry-component')
        .then((masonry) => {
            if (typeof callback === 'function') {
                callback({Masonry: masonry.default});
            }
        })
        .catch(manageImportError);
}
