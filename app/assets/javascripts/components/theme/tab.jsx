'use strict';

import '../../../stylesheets/components/tab.scss';

export class Tabs extends React.Component {
    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.element
        ]).isRequired,
        defaultActiveTabIndex: PropTypes.number
    };

    static defaultProps = {
        defaultActiveTabIndex: 0
    };

    constructor(props) {
        super(props);
    }

    state = {
        activeTabIndex: this.props.defaultActiveTabIndex
    };

    _handleTabClick = (tabIndex) => {
        this.setState({
            activeTabIndex: tabIndex === this.state.activeTabIndex ? this.props.defaultActiveTabIndex : tabIndex
        });
    };

    // Encapsulate <Tabs/> component API as props for <Tab/> children
    _renderChildrenWithTabsApiAsProps = () => {
        return React.Children.map(this.props.children, (child, index) => {
            return React.cloneElement(child, {
                onClick: this._handleTabClick,
                tabIndex: index,
                isActive: index === this.state.activeTabIndex
            });
        });
    };

    // Render current active tab content
    _renderActiveTabContent = () => {
        const {children} = this.props;
        const {activeTabIndex} = this.state;
        if (children[activeTabIndex]) {
            return children[activeTabIndex].props.children;
        }
    };

    render() {
        return (
            <div className="responsive-tabs">
                <ul className="responsive-tabs-navbar">
                    {this._renderChildrenWithTabsApiAsProps()}
                </ul>

                <div className="responsive-tabs-content">
                    {this._renderActiveTabContent()}
                </div>
            </div>
        );
    }
}

export const Tab = ({header, isActive, tabIndex, onClick}) => {
    return (
        <li className={classNames('responsive-tab', {'active': isActive})}>
            <a className="responsive-tab-link"
               href="#"
               onClick={(event) => {
                   event.preventDefault();
                   onClick(tabIndex);
               }}>
                {header}
            </a>
        </li>
    )
};

Tab.propTypes = {
    header: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ]).isRequired,
    isActive: PropTypes.bool,
    tabIndex: PropTypes.number,
    onClick: PropTypes.func
};
