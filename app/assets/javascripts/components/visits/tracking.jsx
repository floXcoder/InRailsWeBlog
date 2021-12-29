'use strict';

import {
    hot
} from 'react-hot-loader/root';

import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';

import {
    fetchVisits
} from '../../actions/admin';

import Loader from '../theme/loader';


export default @connect((state) => ({
    visitsDetails: state.adminState.visitsDetails
}), {
    fetchVisits
})
@hot
class TrackingVisitModal extends React.Component {
    static propTypes = {
        date: PropTypes.string,
        onClose: PropTypes.func,
        // from connect
        visitsDetails: PropTypes.array,
        fetchVisits: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    state = {
        isModalOpen: true,
        areVisitOpen: {}
    };

    componentDidMount() {
        this.props.fetchVisits({date: this.props.date});
    }

    _handleClose = () => {
        this.setState({
            isModalOpen: false
        });

        if (this.props.onClose) {
            this.props.onClose();
        }
    };

    _handleVisitClick = (visitId, event) => {
        event.preventDefault();

        this.setState({
            areVisitOpen: {...this.state.areVisitOpen, [visitId]: !this.state.areVisitOpen[visitId]},
        });
    };

    _renderVisits = (visits) => {
        return (
            <List dense={true}>
                {
                    visits.map((visit) => (
                        <React.Fragment key={visit.id}>
                            <ListItem className="admin-tracking-modal-listItemVisit"
                                      button={true}
                                      onClick={this._handleVisitClick.bind(this, visit.id)}>
                                <ListItemText primary={
                                    <span>
                                        {visit.startedAt} -> {visit.endedAt} : {[visit.country, visit.referrer].compact().join(' - ')}
                                    </span>
                                }
                                              secondary={
                                                  <span>
                                                      {visit.deviceType} - {visit.browser} - {visit.os} ({visit.ip})
                                                  </span>
                                              }
                                />
                                {
                                    this.state.areVisitOpen[visit.id]
                                        ?
                                        <ExpandLessIcon/>
                                        :
                                        <ExpandMoreIcon/>
                                }
                            </ListItem>

                            <Collapse in={this.state.areVisitOpen[visit.id]}
                                      timeout="auto"
                                      unmountOnExit={true}>
                                <List component="div"
                                      dense={true}
                                      disablePadding={true}>
                                    {
                                        visit.events.map((event) => (
                                            <ListItem key={event.id}
                                                      className="admin-tracking-modal-listItemEvent"
                                                      button={false}>
                                                <ListItemIcon>
                                                    <SubdirectoryArrowRightIcon/>
                                                </ListItemIcon>

                                                <ListItemText classes={{
                                                    primary: 'admin-tracking-modal-listItemEventPrimary',
                                                    secondary: 'admin-tracking-modal-listItemEventSecondary'
                                                }}
                                                              primary={
                                                                  <span>
                                                                    {event.time} : {I18n.t(`js.admin.visits.events.${event.name}`, {defaultValue: event.name})}
                                                                  </span>
                                                              }
                                                              secondary={
                                                                  <span>
                                                                      {event.properties.title}
                                                                      <br/>
                                                                      <a href={event.properties.url}
                                                                         target="_blank">
                                                                        {event.properties.url}
                                                                      </a>
                                                                  </span>
                                                              }
                                                />
                                            </ListItem>
                                        ))
                                    }
                                </List>
                            </Collapse>
                        </React.Fragment>
                    ))
                }
            </List>
        );
    };

    render() {
        if (!this.props.date) {
            return null;
        }

        return (
            <Modal open={this.state.isModalOpen}
                   onClose={this._handleClose}>
                <div className="admin-tracking-modal-modal">
                    <Typography className="admin-tracking-modal-title"
                                variant="h6">
                        {I18n.t('js.admin.visits.tracking.title', {date: this.props.date})}
                    </Typography>

                    {
                        this.props.visitsDetails?.length
                            ?
                            this._renderVisits(this.props.visitsDetails)
                            :
                            <div className="center">
                                <Loader size="big"/>
                            </div>
                    }

                    <div className="center-align margin-top-45">
                        <Button variant="outlined" size="small" href="#" onClick={this._handleClose}>
                            {I18n.t('js.admin.visits.tracking.cancel')}
                        </Button>
                    </div>
                </div>
            </Modal>
        );
    }
}
