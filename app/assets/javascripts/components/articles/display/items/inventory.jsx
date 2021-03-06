'use strict';

import {
    Fragment
} from 'react';

import {
    withStyles
} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';

import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Cancel';

import styles from '../../../../../jss/article/inventory';

export default @withStyles(styles)
class ArticleInventoryDisplay extends React.PureComponent {
    static propTypes = {
        inventories: PropTypes.array.isRequired,
        isList: PropTypes.bool,
        // from styles
        classes: PropTypes.object
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
                                className={this.props.classes.inventoryListString}
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
                                className={this.props.classes.inventoryListString}
                                noWrap={true}>
                        {field.value}
                    </Typography>
                );
            }
        } else if (field.type === 'date_type') {
            return (
                <Typography component="div"
                            className={this.props.classes.inventoryListString}
                            noWrap={true}>
                    {field.value}
                </Typography>
            );
        } else if (field.type === 'number_type') {
            return (
                <Typography component="div"
                            className={this.props.classes.inventoryListString}
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
                    [this.props.classes.inventoryListText]: this.props.isList
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
            <List className={this.props.classes.inventoryList}
                  disablePadding={true}>
                {
                    this.props.inventories.map((field) => (
                        <Fragment key={field.name}>
                            <ListItem alignItems="flex-start"
                                      disableGutters={true}>
                                <ListItemText disableTypography={true}
                                              primary={
                                                  <span className={this.props.classes.inventoryListTitle}>
                                                      {field.name}
                                                  </span>
                                              }
                                              secondary={
                                                  <div className={this.props.classes.inventoryListContent}>
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
