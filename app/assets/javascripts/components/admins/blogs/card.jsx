'use strict';

import {
    withStyles
} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/EditOutlined';

import styles from '../../../../jss/admin/blogs';

export default @withStyles(styles)
class AdminBlogCard extends React.Component {
    static propTypes = {
        blog: PropTypes.object.isRequired,
        onEditClick: PropTypes.func.isRequired,
        isMinimized: PropTypes.bool,
        // from withStyles
        classes: PropTypes.object
    };

    static defaultProps = {
        isMinimized: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        isMinimized: this.props.isMinimized,
        isFolded: true
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.isMinimized !== nextProps.isMinimized) {
            return {
                ...prevState,
                isMinimized: nextProps.isMinimized,
                isFolded: nextProps.isMinimized
            };
        }

        return null;
    }

    _handleFoldClick = (event) => {
        event.preventDefault();

        this.setState({
            isFolded: !this.state.isFolded
        });
    };

    _handleEditWiki = (event) => {
        event.preventDefault();

        this.props.onEditClick(this.props.blog);
    };

    render() {
        return (
            <Card component="article"
                  id={this.props.blog.id}
                  className={this.props.classes.card}>
                <CardHeader classes={{
                    root: this.props.classes.header
                }}
                            title={
                                <a href="#"
                                   onClick={this._handleFoldClick}>
                                    <h1 className={this.props.classes.title}>
                                        {this.props.blog.title}
                                    </h1>
                                </a>
                            }
                            action={
                                <IconButton className={classNames(this.props.classes.expand, {
                                    [this.props.classes.expandOpen]: this.state.isFolded
                                })}
                                            aria-expanded={this.state.isFolded}
                                            aria-label="Show more"
                                            onClick={this._handleFoldClick}>
                                    <ExpandMoreIcon/>
                                </IconButton>
                            }/>

                <Collapse in={!this.state.isFolded}
                          timeout="auto"
                          unmountOnExit={true}>
                    <CardContent classes={{
                        root: this.props.classes.content
                    }}>
                        <div className="normalized-content"
                             dangerouslySetInnerHTML={{__html: this.props.blog.content}}/>
                    </CardContent>

                    <CardActions className={this.props.classes.actions}
                                 disableSpacing={true}>
                        <ul className={this.props.classes.actionButtons}>
                            <li className={this.props.classes.actionItem}>
                                <a href="#"
                                   onClick={this._handleEditWiki}>
                                    <EditIcon color="action"
                                              fontSize="default"/>
                                </a>
                            </li>
                        </ul>
                    </CardActions>
                </Collapse>
            </Card>
        );
    }
}
