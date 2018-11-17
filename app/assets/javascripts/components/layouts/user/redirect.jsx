'use strict';

import {
    Redirect
} from 'react-router-dom';

export default @connect((state) => ({
    currentUserSlug: state.userState.currentSlug,
    currentUserTopicSlug: state.topicState.currentUserTopicSlug
}))

class RedirectLayoutUser extends React.Component {
    static propTypes = {
        redirectPath: PropTypes.func.isRequired,
        // from connect
        currentUserSlug: PropTypes.string,
        currentUserTopicSlug: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {redirectPath, ...params} = this.props;

        return (
            <Redirect to={redirectPath({
                userSlug: this.props.currentUserSlug,
                topicSlug: this.props.currentUserTopicSlug,
                ...params
            })}/>
        );
    }
}
