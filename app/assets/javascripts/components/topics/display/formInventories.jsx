'use strict';

import {
    Link
} from 'react-router-dom';

import Button from '@mui/material/Button';

import {
    editTopicPath
} from '../../../constants/routesHelper';

import TopicFormMandatoryFieldDisplay from './inventories/mandatoryField';
import TopicInventoryFieldSorter from './inventories/sorter';
import TopicErrorField from './fields/error';


export default class TopicFormInventoriesDisplay extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        topic: PropTypes.object.isRequired,
        onSubmit: PropTypes.func.isRequired,
        topicErrors: PropTypes.array,
        children: PropTypes.array
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

                    <TopicFormMandatoryFieldDisplay/>

                    <TopicInventoryFieldSorter fields={this.props.children}/>
                </div>

                <div className="margin-top-50 margin-bottom-20">
                    <div className="row">
                        <div className="col s6 center-align">
                            <Button
                                variant="text"
                                size="small"
                                component={Link}
                                to={editTopicPath(this.props.topic.user.slug, this.props.topic.slug)}>
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
