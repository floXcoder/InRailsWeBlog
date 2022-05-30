'use strict';

import Menu from '@mui/material/Menu';


export default class Dropdown extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        children: PropTypes.element.isRequired,
        button: PropTypes.element.isRequired,
        hasArrow: PropTypes.bool
    };

    static defaultProps = {
        hasArrow: true
    };

    constructor(props) {
        super(props);
    }

    state = {
        anchorEl: null,
    };

    _handleOpen = (event) => {
        this.setState({
            anchorEl: event.currentTarget
        });
    };

    _handleClose = () => {
        this.setState({
            anchorEl: null
        });
    };

    _paperProps = () => {
        if (this.props.hasArrow) {
            return {
                overflow: 'visible',
                boxShadow: '0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12)',
                mt: 1,
                '& ul': {
                    padding: 0
                },
                '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: '#fff',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0
                }
            };
        } else {
            return {
                overflow: 'visible',
                boxShadow: '0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12)',
                mt: 1,
                '& ul': {
                    padding: 0
                }
            };
        }
    };

    render() {
        const open = Boolean(this.state.anchorEl);

        return (
            <>
                {
                    React.cloneElement(this.props.button, {
                        onClick: this._handleOpen,
                        'aria-controls': open ? 'account-menu' : undefined,
                        'aria-haspopup': 'true',
                        'aria-expanded': open ? 'true' : undefined
                    })
                }

                <Menu id={this.props.id}
                      anchorEl={this.state.anchorEl}
                      open={open}
                      onClose={this._handleClose}
                      onClick={this._handleClose}
                      PaperProps={{
                          elevation: 0,
                          sx: this._paperProps()
                      }}
                      anchorOrigin={{
                          horizontal: 'right',
                          vertical: 'bottom'
                      }}
                      transformOrigin={{
                          horizontal: 'right',
                          vertical: 'top'
                      }}>
                    {this.props.children}
                </Menu>
            </>
        );
    }
}
