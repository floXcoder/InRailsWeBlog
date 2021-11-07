'use strict';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function LogHelp({isOpen, onHelpClose}) {
    return (
        <Dialog open={isOpen}
                onClose={onHelpClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">
                {I18n.t('js.admin.logs.help.title')}
            </DialogTitle>

            <DialogContent>
                <DialogContentText id="alert-dialog-description"
                                   component="div">
                    <ul>
                        <li>
                            {I18n.t('js.admin.logs.help.all')}
                        </li>
                        <li>
                            {I18n.t('js.admin.logs.help.date')}
                        </li>
                        <li>
                            {I18n.t('js.admin.logs.help.status')}
                        </li>
                        <li>
                            {I18n.t('js.admin.logs.help.ip')}
                        </li>
                        <li>
                            {I18n.t('js.admin.logs.help.host')}
                        </li>
                        <li>
                            {I18n.t('js.admin.logs.help.session')}
                        </li>
                        <li>
                            {I18n.t('js.admin.logs.help.level')}
                        </li>
                        <li>
                            {I18n.t('js.admin.logs.help.bot')}
                        </li>
                    </ul>
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button color="primary"
                        autoFocus={true}
                        onClick={onHelpClose}>
                    {I18n.t('js.admin.logs.help.button')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

LogHelp.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onHelpClose: PropTypes.func.isRequired
};

export default LogHelp;
