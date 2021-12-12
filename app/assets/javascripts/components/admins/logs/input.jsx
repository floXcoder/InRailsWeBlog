'use strict';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Chip from '@material-ui/core/Chip';

import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';
import HelpIcon from '@material-ui/icons/Help';
import AutorenewIcon from '@material-ui/icons/Autorenew';


export default class LogInput extends React.Component {
    static propTypes = {
        isAutoRefresh: PropTypes.bool.isRequired,
        onTagSearchAdd: PropTypes.func.isRequired,
        onTagSearchRemove: PropTypes.func.isRequired,
        onHelpClick: PropTypes.func.isRequired,
        onAutoRefreshClick: PropTypes.func.isRequired,
        searchTags: PropTypes.array
    };

    static defaultProps = {
        searchTags: []
    };

    constructor(props) {
        super(props);
    }

    state = {
        query: ''
    };

    _handleChange = (event) => {
        const query = event.target.value;

        this.setState({
            query
        });
    };

    _handleKeyDown = (event) => {
        if (event.key && Utils.NAVIGATION_KEYMAP[event.which]) {
            if (this.state.query.length > 0) {
                if (Utils.NAVIGATION_KEYMAP[event.which] === 'tab'
                    || Utils.NAVIGATION_KEYMAP[event.which] === 'enter') {
                    event.preventDefault();

                    if (this.props.onTagSearchAdd(this.state.query)) {
                        this.setState({
                            query: ''
                        });
                    }
                } else if (Utils.NAVIGATION_KEYMAP[event.which] === 'escape') {
                    event.preventDefault();

                    this.setState({
                        query: ''
                    });

                    this.props.onTagSearchRemove();
                }
            } else if (this.state.query.length === 0) {
                if (this.props.searchTags.length > 0 &&
                    Utils.NAVIGATION_KEYMAP[event.which] === 'backspace') {
                    event.preventDefault();

                    this.props.onTagSearchRemove(this.props.searchTags[this.props.searchTags.length - 1].element);
                }
            }
        }
    };

    _handleTagSearchClick = (tagElement) => {
        this.props.onTagSearchRemove(tagElement);
    };

    render() {
        return (
            <form className="log-search"
                  autoComplete="off"
                  acceptCharset="UTF-8">
                <div className="search">
                    <div className="search-icon">
                        <SearchIcon/>
                    </div>

                    <InputLabel className="input-label"
                                htmlFor="search-log">
                        {I18n.t('js.admin.logs.input.title')}
                    </InputLabel>

                    <Input id="search-log"
                           name="search"
                           type="search"
                           classes={{
                               root: 'input-root',
                               input: 'input-input'
                           }}
                           placeholder={I18n.t('js.admin.logs.input.title')}
                           disableUnderline={true}
                           value={this.state.query}
                           startAdornment={
                               <InputAdornment position="start">
                                   {
                                       this.props.searchTags.map((tag, i) => (
                                           <Chip key={i}
                                                 className="search-tags-chip"
                                                 tabIndex={-1}
                                                 label={`${tag.element} : ${tag.value}`}
                                                 color="primary"
                                                 variant="outlined"
                                                 deleteIcon={<CancelIcon
                                                     className="search-tags-chip-icon"/>}
                                                 onClick={this._handleTagSearchClick.bind(this, tag.element)}
                                                 onDelete={this._handleTagSearchClick.bind(this, tag.element)}/>
                                       ))
                                   }
                               </InputAdornment>
                           }
                           onKeyDown={this._handleKeyDown}
                           onChange={this._handleChange}/>

                    <a className={classNames('refresh-icon', {
                        'refresh-icon-active': this.props.isAutoRefresh
                    })}
                       href="#"
                       onClick={this.props.onAutoRefreshClick}>
                        <AutorenewIcon/>
                    </a>

                    <a className="help-icon"
                       href="#"
                       onClick={this.props.onHelpClick}>
                        <HelpIcon/>
                    </a>
                </div>
            </form>
        );
    }
}
