'use strict';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class HelpDialog extends React.PureComponent {
    static propTypes = {
        isOpen: PropTypes.bool.isRequired,
        onHelpClose: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Dialog open={this.props.isOpen}
                    onClose={this.props.onHelpClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {I18n.t('js.admin.search.help.title')}
                </DialogTitle>

                <DialogContent>
                    <DialogContentText id="alert-dialog-description"
                                       component="div">
                        <ul>
                            <li>
                                {I18n.t('js.admin.search.help.articles')}
                            </li>
                            <li>
                                {I18n.t('js.admin.search.help.tags')}
                            </li>
                            <li>
                                {I18n.t('js.admin.search.help.topics')}
                            </li>
                            <li>
                                {I18n.t('js.admin.search.help.users')}
                            </li>
                        </ul>
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button color="primary"
                            autoFocus={true}
                            onClick={this.props.onHelpClose}>
                        {I18n.t('js.admin.search.help.button')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}
