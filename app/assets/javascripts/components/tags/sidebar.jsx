'use strict';

var AssociatedTagBox = require('../../components/tags/associated/box');
var IndexTagBox = require('../../components/tags/index/box');

var TagSidebar = React.createClass({
    getInitialState () {
        return {};
    },

    componentDidMount () {
        window.onpopstate = function(event) {
            if(event.state && event.state.tagNavBar) {
                $('#toggle-tags').sideNav('show');
            } else {
                $('#toggle-tags').sideNav('hide');
            }
        };

        Mousetrap.bind('alt+t', function () {
            $('#toggle-tags').sideNav('show');
            return false;
        }.bind(this), 'keydown');

        $('.navbar-fixed #toggle-tags').click(function () {
            window.history.pushState({tagNavBar: true}, '', '');

            if(window.innerWidth > window.parameters.large_screen) {
                $('.blog-sidebar').find('input').focus();
            }

            return true;
        });

        $('#tag-sidebar ul.tabs').tabs();
    },

    render () {
        return (
            <div id="tag-sidebar"
                 className="side-nav">
                <div className="row">
                    <div className="col s12">
                        <ul className="tabs">
                            <li className="tab col s3">
                                <a href="#tag-list"
                                   className="active">
                                    {I18n.t('js.tag.list')}
                                </a>
                            </li>
                            <li className="tab col s3">
                                <a href="#tag-associated">
                                    {I18n.t('js.tag.associated')}
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div id="tag-list"
                         className="col s12">
                        <IndexTagBox/>
                    </div>
                    <div id="tag-associated"
                         className="col s12">
                        <AssociatedTagBox/>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = TagSidebar;

ReactDOM.render(
    <TagSidebar/>,
    document.getElementById('tag-sidebar-component')
);
