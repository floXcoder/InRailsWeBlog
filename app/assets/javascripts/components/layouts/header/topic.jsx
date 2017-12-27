'use strict';

const HomeTopicHeader = ({currentTopicName, onTopicClick}) => (
    <a className="btn waves-effect waves-light header-button topic-header-button"
       href="#"
       onClick={onTopicClick}>
        <div className="topic-header-text">
            <span className="material-icons left"
                  data-icon="class"
                  aria-hidden="true"/>
            {I18n.t('js.views.header.topic.button', {current: currentTopicName})}
        </div>
    </a>
);

HomeTopicHeader.propTypes = {
    currentTopicName: PropTypes.string.isRequired,
    onTopicClick: PropTypes.func.isRequired
};

export default HomeTopicHeader;
