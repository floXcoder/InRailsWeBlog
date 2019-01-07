'use strict';

import {
    Helmet
} from 'react-helmet';

export default class HeadLayout extends React.Component {
    static propTypes = {
        // from connect
        metaTags: PropTypes.object
    };

    static defaultProps = {
        metaTags: {
            og: {}
        }
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Helmet>
                <title>
                    {this.props.metaTags.title}
                </title>

                <meta name="description"
                      content={this.props.metaTags.description}/>

                {
                    this.props.metaTags.author &&
                    <meta property="author"
                          content={this.props.metaTags.author}/>
                }

                {
                    this.props.metaTags.og_type &&
                    <meta property="og:type"
                          content={this.props.metaTags.og.type}/>
                }

                {
                    this.props.metaTags.og_url &&
                    <meta property="og:url"
                          content={this.props.metaTags.og.url}/>
                }

                {
                    this.props.metaTags.og_type &&
                    <meta property="og:image"
                          content={this.props.metaTags.og.image}/>
                }
            </Helmet>
        );
    }
}
