'use strict';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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
