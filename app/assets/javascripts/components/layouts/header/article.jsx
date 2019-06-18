'use strict';

import {
    withStyles
} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';

import AddIcon from '@material-ui/icons/Add';

import Dropdown from '../../theme/dropdown';

import HeaderArticleMenu from './menus/article';

import styles from '../../../../jss/user/header';

export default @withStyles(styles)
class HomeArticleHeader extends React.PureComponent {
    static propTypes = {
        routeParams: PropTypes.object.isRequired,
        userSlug: PropTypes.string.isRequired,
        currentTagSlugs: PropTypes.array.isRequired,
        currentTopicMode: PropTypes.string,
        topicSlug: PropTypes.string,
        hasTemporaryArticle: PropTypes.bool,
        // from styles
        classes: PropTypes.object
    };

    static defaultProps = {
        hasTemporaryArticle: false
    };

    render() {
        return (
            <Dropdown button={
                <IconButton color="primary">
                    {
                        this.props.hasTemporaryArticle
                            ?
                            <Badge badgeContent="!"
                                   color="primary">
                                <AddIcon/>
                            </Badge>
                            :
                            <AddIcon/>
                    }
                </IconButton>
            }
                      position="bottom right"
                      buttonClassName={this.props.classes.headerButton}
                      isFixed={true}
                      hasWavesEffect={false}
                      hasArrow={true}>
                <HeaderArticleMenu classes={this.props.classes}
                                   routeParams={this.props.routeParams}
                                   userSlug={this.props.userSlug}
                                   currentTopicMode={this.props.currentTopicMode}
                                   currentTagSlugs={this.props.currentTagSlugs}
                                   topicSlug={this.props.topicSlug}
                                   hasTemporaryArticle={this.props.hasTemporaryArticle}/>
            </Dropdown>
        );
    }
}
