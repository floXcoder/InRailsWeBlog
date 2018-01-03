'use strict';

import highlight from '../../modules/highlight';

@highlight
export default class ArticleInlineDisplay extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="blog-article-item">
                <h4 className="article-title-inline">
                    {this.props.title}
                </h4>

                <span className="blog-article-content"
                      dangerouslySetInnerHTML={{__html: this.props.content}}/>
            </div>
        );
    }
}
