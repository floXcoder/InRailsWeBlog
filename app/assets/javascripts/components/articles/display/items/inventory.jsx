import React, {
    Fragment
} from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';

import * as Utils from '@js/modules/utils';


export default class ArticleInventoryDisplay extends React.PureComponent {
    static propTypes = {
        inventories: PropTypes.array.isRequired,
        isList: PropTypes.bool
    };

    constructor(props) {
        super(props);
    }

    _renderFieldByType = (field) => {
        if (typeof field.value === 'undefined' || field.value === null) {
            return (
                <div>
                    -
                </div>
            );
        } else if (field.type === 'string_type') {
            if (Utils.isURL(field.value)) {
                return (
                    <Typography component="div"
                                className="article-inline-inventory-list-string"
                                noWrap={true}>
                        <a href={field.value}
                           target="_blank"
                           rel="nofollow">
                            {field.value}
                        </a>
                    </Typography>
                );
            } else {
                return (
                    <Typography component="div"
                                className="article-inline-inventory-list-string"
                                noWrap={true}>
                        {field.value}
                    </Typography>
                );
            }
        } else if (field.type === 'date_type') {
            return (
                <Typography component="div"
                            className="article-inline-inventory-list-string"
                            noWrap={true}>
                    {field.value}
                </Typography>
            );
        } else if (field.type === 'number_type') {
            return (
                <Typography component="div"
                            className="article-inline-inventory-list-string"
                            noWrap={true}>
                    {field.value}
                </Typography>
            );
        } else if (field.type === 'boolean_type') {
            if (field.value) {
                return (
                    <div>
                        <Chip label={field.name}
                              variant="outlined"
                              color="default"
                              size="small"
                              icon={<DoneIcon/>}/>
                    </div>
                );
            } else {
                return (
                    <div>
                        <Chip label={field.name}
                              variant="outlined"
                              size="small"
                              icon={<CancelIcon/>}/>
                    </div>
                );
            }
        } else if (field.type === 'text_type') {
            return (
                <div className={classNames({
                    'article-inline-inventory-list-text': this.props.isList
                })}>
                    <div className="normalized-content normalized-content-extract"
                         dangerouslySetInnerHTML={{__html: field.value}}/>
                </div>
            );
        } else {
            throw new Error(`Unknown field type to render: ${field.type}`);
        }
    };

    render() {
        return (
            <List className="article-inline-inventory-list"
                  disablePadding={true}>
                {
                    this.props.inventories.map((field) => (
                        <Fragment key={field.name}>
                            <ListItem alignItems="flex-start"
                                      disableGutters={true}>
                                <ListItemText disableTypography={true}
                                              primary={
                                                  <span className="article-inline-inventory-list-title">
                                                      {field.name}
                                                  </span>
                                              }
                                              secondary={
                                                  <div className="article-inline-inventory-list-content">
                                                      {this._renderFieldByType(field)}
                                                  </div>
                                              }/>
                            </ListItem>

                            <Divider component="li"
                                     variant="fullWidth"/>
                        </Fragment>
                    ))
                }
            </List>
        );
    }
}
