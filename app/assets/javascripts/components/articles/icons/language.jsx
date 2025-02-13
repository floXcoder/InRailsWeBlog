import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import LanguageIcon from '@mui/icons-material/Language';

import I18n from '@js/modules/translations';


function ArticleLanguageIcon({
                                 currentLocale,
                                 languages,
                                 onLanguageChange,
                                 size = 'medium',
                                 color = 'primary'
                             }) {
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
                      onClick={handleClick}
                      size="large">
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
}

ArticleLanguageIcon.propTypes = {
    currentLocale: PropTypes.string.isRequired,
    languages: PropTypes.array.isRequired,
    onLanguageChange: PropTypes.func.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['primary', 'secondary', 'action', 'disabled'])
};

export default React.memo(ArticleLanguageIcon);
