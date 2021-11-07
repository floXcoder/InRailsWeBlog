'use strict';

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import LanguageIcon from '@material-ui/icons/Language';

const ArticleLanguageIcon = ({currentLocale, languages, onLanguageChange, size, color}) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const _handleLanguageSelected = (language) => {
        setAnchorEl(null);

        if (language) {
            onLanguageChange(language);
        }
    };

    return (
        <span className="flow-tooltip-bottom"
              data-tooltip={I18n.t('js.article.tooltip.languages')}>
          <IconButton aria-label="more"
                      aria-controls="article-language-select"
                      aria-haspopup="true"
                      onClick={handleClick}>
            <LanguageIcon color={color}
                          fontSize={size}/>
          </IconButton>

          <Menu id="article-language-select"
                anchorEl={anchorEl}
                keepMounted={true}
                open={open}
                onClose={_handleLanguageSelected.bind(this, null)}>
            {languages.map((language) => (
                <MenuItem key={language}
                          selected={language === currentLocale}
                          onClick={_handleLanguageSelected.bind(this, language)}>
                    {language}
                </MenuItem>
            ))}
          </Menu>
        </span>
    );
};

ArticleLanguageIcon.propTypes = {
    currentLocale: PropTypes.string.isRequired,
    languages: PropTypes.array.isRequired,
    onLanguageChange: PropTypes.func.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action', 'disabled'])
};

ArticleLanguageIcon.defaultProps = {
    size: 'medium',
    color: 'primary'
};

export default React.memo(ArticleLanguageIcon);
