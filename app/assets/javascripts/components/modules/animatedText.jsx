
var AnimatedText = React.createClass({
    propTypes: {
        title: React.PropTypes.string.isRequired,
        subtitle: React.PropTypes.string.isRequired
    },

    render () {
        return (
            <section className="card-title cd-intro">
                <div className="cd-intro-content mask">
                    <h1 data-content={this.props.title}>
                        <span>
                            {this.props.title}
                        </span>
                    </h1>
                    <div className="action-wrapper hide-on-small-and-down">
                        <h2>
                            {this.props.subtitle}
                        </h2>
                    </div>
                </div>
            </section>
        );
    }
});

module.exports = AnimatedText;
