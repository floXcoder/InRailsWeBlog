'use strict';

class LazilyLoad extends React.Component {
    static propTypes = {
        modules: PropTypes.object.isRequired,
        children: PropTypes.func.isRequired
    };

    constructor() {
        super(...arguments);
        this.isLoaded = false;
    }

    componentDidMount() {
        this._isMounted = true;
        this.load();
    }

    componentDidUpdate(previous) {
        if (this.props.modules === previous.modules) {
            return null;
        }
        this.load();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    load() {
        this.isLoaded = false;

        const {modules} = this.props;
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
                this.setState({modules: result});
            });
    }

    render() {
        if (!this.isLoaded) {
            return null;
        }

        return React.Children.only(this.props.children(this.state.modules));
    }
}

export const LazilyLoadFactory = (Component, modules) => {
    return (props) => (
        <LazilyLoad modules={modules}>
            {
                (mods) => <Component {...mods}
                                     {...props} />
            }
        </LazilyLoad>
    );
};

export const importLazy = (promise) => (
    promise.then((result) => result.default)
);

export default LazilyLoad;
