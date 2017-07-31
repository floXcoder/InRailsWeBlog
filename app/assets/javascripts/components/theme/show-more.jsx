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
        className: null,
        maxHeight: 220
    };

    constructor(props) {
        super(props);

        this._showMoreText = null;
    }

    componentDidMount() {
        let $textContent = $(ReactDOM.findDOMNode(this._showMoreText));
        let currentHeight = $textContent.height();

        if (currentHeight > this.props.maxHeight) {
            $textContent.addClass('read-more-target');
            $(`#read-more-${this.props.id}`).find('label').show();
        } else {
            $(`#read-more-${this.props.id}`).find('label').hide();
        }
    }

    render() {
        let content = this.props.children;
        if (!/^<p>/.test(content) || !/^<div>/.test(content)) {
            content = '<p>' + content + '</p>';
        }

        return (
            <div id={`read-more-${this.props.id}`}
                 className={this.props.className}>
                <input id={this.props.id}
                       type="checkbox"
                       className="read-more-state"/>

                <div className="read-more-wrap">
                    <div ref={(showMoreText) => this._showMoreText = showMoreText}
                         className="read-more-content"
                         itemProp="description"
                         dangerouslySetInnerHTML={{__html: content}}/>
                </div>

                <label htmlFor={this.props.id}
                       className="read-more-trigger"/>
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
