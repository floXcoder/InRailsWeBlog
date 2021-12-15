'use strict';

import Tooltip from '@material-ui/core/Tooltip';

import {
    spyTrackClick
} from '../../../actions';

import {
    showTagPath
} from '../../../constants/routesHelper';


export default class TooltipTag extends React.PureComponent {
    static propTypes = {
        tag: PropTypes.object.isRequired,
        children: PropTypes.element.isRequired
    };

    render() {
        return (
            <Tooltip placement="bottom"
                     arrow={true}
                     interactive={true}
                     classes={{
                         tooltip: 'tooltip-tag-tooltip',
                         arrow: 'tooltip-tag-arrow'
                     }}
                     title={
                         <div>
                             <div className="tooltip-tag-heading">
                                 {I18n.t('js.tag.common.usage', {count: this.props.tag.taggedArticlesCount})}
                             </div>

                             <div className="tooltip-tag-description">
                                 <div className="normalized-content"
                                      dangerouslySetInnerHTML={{__html: this.props.tag.description}}/>

                                 <p>
                                     {
                                         Utils.isPresent(this.props.tag.synonyms) &&
                                         I18n.t('js.tag.model.synonyms') + ' : ' + this.props.tag.synonyms.join(', ')
                                     }
                                 </p>

                                 <div className="margin-top-10">
                                     <a href={showTagPath(this.props.tag.slug)}
                                        onClick={spyTrackClick.bind(null, 'tag', this.props.tag.id, this.props.tag.slug, this.props.tag.userId, this.props.tag.name, null)}>
                                         {I18n.t('js.tag.common.link')}
                                     </a>
                                 </div>
                             </div>
                         </div>
                     }>
                {this.props.children}
            </Tooltip>
        );
    }
}
