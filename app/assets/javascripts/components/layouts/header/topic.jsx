'use strict';

const HomeTopicHeader = ({onTopicClick}) => (
    <a className="btn waves-effect waves-light header-button topic-header-button"
       href="#"
       onClick={onTopicClick}>
        <div className="topic-header-text">
            <i className="material-icons left">class</i>
            {I18n.t('js.views.header.topic.button', {current: $app.getCurrentTopic().name})}
        </div>
    </a>
);

HomeTopicHeader.propTypes = {
    onTopicClick: PropTypes.func.isRequired
};

export default HomeTopicHeader;
