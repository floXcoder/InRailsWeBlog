'use strict';

import {
    Suspense
} from 'react';

import * as RouteAdminComponents from '../../loaders/adminComponents';


export default class AdminMainLayout extends React.Component {
    static propTypes = {
        componentId: PropTypes.string,
        children: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    _extractComponentData = (elementId) => {
        const element = document.getElementById(elementId);

        const data = {};
        [].forEach.call(element.attributes, function (attr) {
            if (/^data-/.test(attr.name)) {
                const camelCaseName = attr.name.substr(5).replace(/-(.)/g, function ($0, $1) {
                    return $1.toUpperCase();
                });
                data[camelCaseName] = attr.value.startsWith('{') || attr.value.startsWith('[') ? JSON.parse(attr.value) : attr.value;
            }
        });

        return data;
    };

    _renderComponent = () => {
        const {component, ...componentData} = this._extractComponentData(this.props.componentId);

        const Component = RouteAdminComponents[component];

        return (
            <Suspense fallback={<div/>}>
                <Component {...componentData}/>
            </Suspense>
        );
    };

    render() {
        return (
            <main className="main-content">
                <Suspense fallback={<div/>}>
                    <div className="main-layout">
                        {
                            this.props.children
                                ?
                                this.props.children
                                :
                                this._renderComponent()
                        }
                    </div>
                </Suspense>
            </main>
        );
    }
}
