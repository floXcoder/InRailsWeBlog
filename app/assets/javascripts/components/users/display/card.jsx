'use strict';

var ArticleCardDisplay = React.createClass({
    propTypes: {
        user: React.PropTypes.object.isRequired
    },

    getDefaultProps () {
        return {};
    },

    componentDidMount () {
    },

    componentDidUpdate () {
    },

    render () {
        return (
            <div className="card small hoverable user-card">
                <div className="user-image center-align">
                    {this.props.user.avatar ?
                        <img className="circle responsive-img"
                             src={this.props.user.avatar}
                             alt="User avatar"/> :
                        <div className="user-no-image valign-wrapper center-align">
                            <i className="material-icons valign">account_circle</i>
                        </div>

                    }
                    <span className="card-title">
                        {this.props.user.pseudo}
                    </span>
                </div>
                <div className="card-action user-action">
                    <a href={`/admin/users_manager/${this.props.user.id}`}>
                        {I18n.t('js.user.index.link_to_user')}
                    </a>
                </div>
            </div>
        );
    }
});

module.exports = ArticleCardDisplay;
