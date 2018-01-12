'use strict';

import highlight from '../../modules/highlight';

@highlight
export default class ArticleInlineDisplay extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        onEdit: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    state = {
        isHover: false
    };

    _handleHoverEdit = () => {
        this.setState({
            isHover: !this.state.isHover
        })
    };

    render() {
        return (
            <div className={classNames('blog-article-item', {
                'blog-article-item-hover': this.state.isHover
            })}>
                <h4 className="article-title-inline">
                    {this.props.title}
                </h4>

                <span className="blog-article-content"
                      dangerouslySetInnerHTML={{__html: this.props.content}}/>

                <div className="article-inline-edit tooltip-bottom"
                     data-tooltip="Modifier l'article"
                     onMouseEnter={this._handleHoverEdit}
                     onMouseLeave={this._handleHoverEdit}>
                    <a className="btn waves-effect waves-light"
                       href="#"
                       onClick={this.props.onEdit}>
                    <span className="material-icons"
                          data-icon="edit"
                          aria-hidden="true"/>
                    </a>
                </div>
            </div>
        );
    }
}
