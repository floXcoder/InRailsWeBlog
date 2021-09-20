'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    withStyles
} from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';

import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SubdirectoryArrowRightIcon from '@material-ui/icons/SubdirectoryArrowRight';

import {
    fetchVisits
} from '../../actions/admin';

import Loader from '../theme/loader';

import styles from '../../../jss/admin/trackingVisit';

export default @connect((state) => ({
    visitsDetails: state.adminState.visitsDetails
}), {
    fetchVisits
})
@hot
@withStyles(styles)
class TrackingVisitModal extends React.Component {
    static propTypes = {
        date: PropTypes.string,
        onClose: PropTypes.func,
        // from connect
        visitsDetails: PropTypes.array,
        fetchVisits: PropTypes.func,
        // from styles
        classes: PropTypes.object
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
                            <ListItem className={this.props.classes.listItemVisit}
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
                                                      className={this.props.classes.listItemEvent}
                                                      button={false}>
                                                <ListItemIcon>
                                                    <SubdirectoryArrowRightIcon/>
                                                </ListItemIcon>

                                                <ListItemText classes={{
                                                    primary: this.props.classes.listItemEventPrimary,
                                                    secondary: this.props.classes.listItemEventSecondary
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
    }

    render() {
        if (!this.props.date) {
            return null;
        }

        return (
            <Modal open={this.state.isModalOpen}
                   onClose={this._handleClose}>
                <div className={this.props.classes.modal}>
                    <Typography className={this.props.classes.title}
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
                        <Button color="default"
                                variant="outlined"
                                size="small"
                                href="#"
                                onClick={this._handleClose}>
                            {I18n.t('js.admin.visits.tracking.cancel')}
                        </Button>
                    </div>
                </div>
            </Modal>
        );
    }
}
