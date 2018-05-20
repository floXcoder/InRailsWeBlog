'use strict';

import {
    Children
} from 'react';

class LazyLoader extends React.Component {
    static propTypes = {
        modules: PropTypes.object,
        module: PropTypes.object,
        children: PropTypes.func.isRequired
    };

    constructor() {
        super(...arguments);

        this.isLoaded = false;
    }

    state = {
        module: undefined,
        modules: undefined
    };

    componentDidMount() {
        this._isMounted = true;
        this.load();
    }

    componentDidUpdate(prevProps) {
        if (this.props.modules === prevProps.modules) {
            return null;
        }
        this.load();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    load() {
        this.isLoaded = false;

        let modules;
        if (this.props.modules) {
            modules = this.props.modules;
        } else {
            modules = {component: () => this.props.module}
        }

        const keys = Object.keys(modules);

        Promise.all(keys.map((key) => modules[key]()))
            .then((values) => (keys.reduce((agg, key, index) => {
                agg[key] = values[index].default;
                return agg;
            }, {})))
            .then((result) => {
                if (!this._isMounted) {
                    return null;
                }

                this.isLoaded = true;
                if (this.props.modules) {
                    this.setState({modules: result});
                } else {
                    this.setState({module: result.component});
                }
            })
            .catch(error => log.error('Failed to load dynamic component: ', keys, error.message));
    }

    render() {
        if (!this.isLoaded) {
            return null;
        }

        if (this.props.modules) {
            return Children.only(this.props.children(this.state.modules));
        } else {
            return Children.only(this.props.children(this.state.module));
        }
    }
}

export const importPrefetch = (promise) => (
    promise.then((result) => result.default)
);

const LazyLoaderFactories = (Component, modules) => (props = {}) => (
    <LazyLoader modules={modules}>
        {
            (mods) => (
                <Component {...mods}
                           {...props} />
            )
        }
    </LazyLoader>
);

const LazyLoaderFactory = ({module, props = {}}) => (
    <LazyLoader module={module}>
        {
            (Component) => (
                <Component {...props} />
            )
        }
    </LazyLoader>
);
LazyLoaderFactory.propTypes = {
    module: PropTypes.object,
    props: PropTypes.object
};

export default LazyLoaderFactory;
