'use strict';

import ToolTip from 'react-portal-tooltip';

import {
    withStyles,
    withTheme
} from '@material-ui/core/styles';

import {
    spyTrackClick
} from '../../../actions';

import {
    showTagPath
} from '../../../constants/routesHelper';

import styles from '../../../../jss/article/tooltip';

export default @withTheme
@withStyles(styles)
class TooltipTag extends React.PureComponent {
    static propTypes = {
        articleId: PropTypes.number.isRequired,
        tag: PropTypes.object.isRequired,
        tagTooltipActive: PropTypes.number,
        // from styles
        theme: PropTypes.object,
        classes: PropTypes.object,
    };

    render() {
        let {articleId, tag, tagTooltipActive, theme, classes} = this.props;

        return (
            <ToolTip active={tagTooltipActive === tag.id}
                     position="bottom"
                     arrow="center"
                     parent={`#article-${articleId}-tags-${tag.id}`}
                     style={styles(theme)}>
                <div>
                    <div className={classes.heading}>
                        {I18n.t('js.tag.common.usage', {count: tag.taggedArticlesCount})}
                    </div>

                    <div className={classes.description}>
                        <p>
                            {tag.description}
                        </p>

                        <p>
                            {
                                !Utils.isEmpty(tag.synonyms) &&
                                I18n.t('js.tag.model.synonyms') + ' : ' + tag.synonyms.join(', ')
                            }
                        </p>

                        <div className="margin-top-10">
                            <a href={showTagPath(tag.slug)}
                               onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.name)}>
                                {I18n.t('js.tag.common.link')}
                            </a>
                        </div>
                    </div>
                </div>
            </ToolTip>
        );
    }
}
