import React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import I18n from '@js/modules/translations';


const HelpDialog = function ({
                                 isOpen,
                                 onHelpClose
                             }) {
    return (
        <Dialog open={isOpen}
                onClose={onHelpClose}
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
                        onClick={onHelpClose}>
                    {I18n.t('js.admin.search.help.button')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

HelpDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onHelpClose: PropTypes.func.isRequired
};

export default React.memo(HelpDialog);
