'use strict';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/EditOutlined';


export default class AdminBlogCard extends React.Component {
    static propTypes = {
        blog: PropTypes.object.isRequired,
        onEditClick: PropTypes.func.isRequired,
        isMinimized: PropTypes.bool
    };

    static defaultProps = {
        isMinimized: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        isMinimized: this.props.isMinimized,
        isFolded: this.props.isMinimized
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
                  className="admin-blog-card">
                <CardHeader classes={{
                    root: 'admin-blog-header'
                }}
                            title={
                                <a href="#"
                                   onClick={this._handleFoldClick}>
                                    <h1 className="admin-blog-title">
                                        {this.props.blog.title}
                                    </h1>
                                </a>
                            }
                            action={
                                <IconButton className={classNames('admin-blog-expand', {
                                    'admin-blog-expandOpen': this.state.isFolded
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
                        root: 'admin-blog-content'
                    }}>
                        <div className="normalized-content"
                             dangerouslySetInnerHTML={{__html: this.props.blog.content}}/>
                    </CardContent>

                    <CardActions className="admin-blog-actions"
                                 disableSpacing={true}>
                        <ul className="admin-blog-actionButtons">
                            <li className="admin-blog-actionItem">
                                <a href="#"
                                   onClick={this._handleEditWiki}>
                                    <EditIcon color="action"
                                              fontSize="medium"/>
                                </a>
                            </li>
                        </ul>
                    </CardActions>
                </Collapse>
            </Card>
        );
    }
}
