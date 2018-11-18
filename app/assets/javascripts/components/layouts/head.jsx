'use strict';

import {
    Helmet
} from 'react-helmet';

class HeadLayout extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        title: '',
        description: '',
        author: null,
        og_type: null,
        og_url: null,
        og_image: null
    };

    define = ({title, description, author, og_type, og_url, og_image}) => {
        this.setState({
            title,
            description,
            author,
            og_type,
            og_url,
            og_image
        });
    };

    render() {
        return (
            <Helmet>
                <title>
                    {this.state.title}
                </title>

                <meta name="description"
                      content={this.state.description}/>

                {
                    this.state.author &&
                    <meta property="author"
                          content={this.state.author}/>
                }

                {
                    this.state.og_type &&
                    <meta property="og:type"
                          content={this.state.og_type}/>
                }

                {
                    this.state.og_url &&
                    <meta property="og:url"
                          content={this.state.og_url}/>
                }

                {
                    this.state.og_type &&
                    <meta property="og:image"
                          content={this.state.og_image}/>
                }
            </Helmet>
        );
    }
}

export default ReactDOM.render(
    <HeadLayout/>,
    document.getElementById('head-component')
);
