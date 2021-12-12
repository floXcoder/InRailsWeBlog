'use strict';

import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';

import AddIcon from '@material-ui/icons/Add';

import Dropdown from '../../theme/dropdown';

import HeaderArticleMenu from './menus/article';


export default class HomeArticleHeader extends React.PureComponent {
    static propTypes = {
        routeParams: PropTypes.object.isRequired,
        userSlug: PropTypes.string.isRequired,
        currentTagSlugs: PropTypes.array.isRequired,
        currentTopicMode: PropTypes.string,
        topicSlug: PropTypes.string,
        hasTemporaryArticle: PropTypes.bool
    };

    static defaultProps = {
        hasTemporaryArticle: false
    };

    render() {
        return (
            <Dropdown button={
                <IconButton color="default"
                            itemProp="url">
                    {
                        this.props.hasTemporaryArticle
                            ?
                            <Badge badgeContent="1"
                                   color="secondary">
                                <AddIcon/>
                            </Badge>
                            :
                            <AddIcon/>
                    }
                </IconButton>
            }
                      position="bottom right"
                      buttonClassName="layout-header-headerButton"
                      isFixed={true}
                      hasWavesEffect={false}
                      hasArrow={true}>
                <HeaderArticleMenu routeParams={this.props.routeParams}
                                   userSlug={this.props.userSlug}
                                   currentTopicMode={this.props.currentTopicMode}
                                   currentTagSlugs={this.props.currentTagSlugs}
                                   topicSlug={this.props.topicSlug}
                                   hasTemporaryArticle={this.props.hasTemporaryArticle}/>
            </Dropdown>
        );
    }
}
