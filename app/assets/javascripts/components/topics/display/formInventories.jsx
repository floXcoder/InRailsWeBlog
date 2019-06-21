'use strict';

import {
    Link
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import TopicFormMandatoryFieldDisplay from './inventories/mandatoryField';
import TopicInventoryFieldSorter from './inventories/sorter';
import TopicErrorField from './fields/error';

import styles from '../../../../jss/topic/formInventories';

export default @withStyles(styles)
class TopicFormInventoriesDisplay extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        topic: PropTypes.object.isRequired,
        onSubmit: PropTypes.func.isRequired,
        topicErrors: PropTypes.array,
        children: PropTypes.array,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <form id={this.props.id}
                  encType="multipart/form-data"
                  onSubmit={this.props.onSubmit}>
                <div className="row">
                    <div className="col s12">
                        <h1>
                            {I18n.t('js.topic.edit_inventories.title', {topic: this.props.topic.name})}
                        </h1>
                    </div>

                    {
                        this.props.topicErrors &&
                        <div className="col s12">
                            <TopicErrorField errors={this.props.topicErrors}/>
                        </div>
                    }

                    <TopicFormMandatoryFieldDisplay classes={this.props.classes}/>

                    <TopicInventoryFieldSorter classes={this.props.classes}
                                               fields={this.props.children}/>
                </div>

                <div className="margin-top-50 margin-bottom-20">
                    <div className="row">
                        <div className="col s6 center-align">
                            <Button color="default"
                                    variant="text"
                                    size="small"
                                    component={Link}
                                    to={`/users/${this.props.topic.user.slug}/topics/${this.props.topic.slug}/edit`}>
                                {I18n.t('js.topic.edit.back_button')}
                            </Button>
                        </div>

                        <div className="col s6 center-align">
                            <Button color="primary"
                                    variant="contained"
                                    size="small"
                                    type="submit">
                                {I18n.t('js.topic.edit.submit')}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}
