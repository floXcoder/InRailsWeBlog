var AssociatedTagBox = require('../../components/tags/associatedBox');
var IndexTagBox = require('../../components/tags/indexBox');

var TagSidebar = React.createClass({
    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {
        $('.navbar-fixed .button-collapse').sideNav({
                menuWidth: 350, // Default is 240
                edge: 'left' // Choose the horizontal origin
            }
        );

        $('.navbar-fixed .button-collapse').click(function () {
            $('.blog-sidebar').find('input').focus();
            return true;
        });

        $('.blog-sidebar ul.tabs').tabs();
    },

    render: function () {
        return (
            <div id="slide-out" className="side-nav">
                <div className="row">
                    <div className="col s12">
                        <ul className="tabs">
                            <li className="tab col s3">
                                <a href="#tag-list" className="active">
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
                    <div className="col s12" id="tag-list">
                        <IndexTagBox/>
                    </div>
                    <div className="col s12" id="tag-associated">
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
