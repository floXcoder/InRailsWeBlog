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


function TopicFormInventoriesDisplay({
                                         id,
                                         topic,
                                         onSubmit,
                                         topicErrors,
                                         children
                                     }) {
    return (
        <form id={id}
              encType="multipart/form-data"
              onSubmit={onSubmit}>
            <div className="row">
                <div className="col s12">
                    <h1>
                        {I18n.t('js.topic.edit_inventories.title', {topic: topic.name})}
                    </h1>
                </div>

                {
                    topicErrors &&
                    <div className="col s12">
                        <TopicErrorField errors={topicErrors}/>
                    </div>
                }

                <TopicFormMandatoryFieldDisplay/>

                <TopicInventoryFieldSorter fields={children}/>
            </div>

            <div className="margin-top-50 margin-bottom-20">
                <div className="row">
                    <div className="col s6 center-align">
                        <Button
                            variant="text"
                            size="small"
                            component={Link}
                            to={editTopicPath(topic.user.slug, topic.slug)}>
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

TopicFormInventoriesDisplay.propTypes = {
    id: PropTypes.string.isRequired,
    topic: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    topicErrors: PropTypes.array,
    children: PropTypes.array
};

export default TopicFormInventoriesDisplay;

