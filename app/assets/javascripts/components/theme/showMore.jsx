'use strict';

export default class ShowMore extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        children: PropTypes.string,
        className: PropTypes.string,
        maxHeight: PropTypes.number
    };

    static defaultProps = {
        children: '',
        maxHeight: 220
    };

    constructor(props) {
        super(props);

        this._showMoreText = React.createRef();
    }

    state = {
        className: undefined,
        isShowingLabel: false
    };

    componentDidMount() {
        const boundingElement = this._showMoreText.current.getBoundingClientRect();
        const currentHeight = boundingElement.height;

        if (currentHeight > this.props.maxHeight) {
            this.setState({
                className: 'read-more-target',
                isShowingLabel: true
            });
        }
    }

    render() {
        let content = this.props.children;
        if (content && (!/^<p>/.test(content) || !/^<div>/.test(content))) {
            content = '<p>' + content + '</p>';
        }

        return (
            <div id={`read-more-${this.props.id}`}
                 className={this.props.className}>
                <input id={this.props.id}
                       type="checkbox"
                       className="read-more-state"/>

                <div className="read-more-wrap">
                    <div ref={this._showMoreText}
                         className={classNames('read-more-content', this.state.className)}
                         itemProp="description"
                         dangerouslySetInnerHTML={{__html: content}}/>
                </div>

                {
                    this.state.isShowingLabel &&
                    <label className="read-more-trigger"
                           htmlFor={this.props.id}/>
                }
            </div>
        );
    }
}


// <div>
//     <input id={`show-more-${this.props.ride.id}`}
//            type="checkbox"
//            className="read-more-state"/>
//
//     <ul className="read-more-wrap">
//         <li>lorem</li>
//         <li>lorem 2</li>
//         <li className="read-more-target">lorem 3</li>
//         <li className="read-more-target">lorem 4</li>
//     </ul>
//
//     <label htmlFor={`show-more-${this.props.ride.id}`}
//            className="read-more-trigger"/>
// </div>
