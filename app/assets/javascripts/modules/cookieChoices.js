import I18n from '@js/modules/translations';

var document = window.document;

// IE8 does not support textContent, so we should fallback to innerText.
var supportsTextContent = 'textContent' in document.body;

const cookieChoices = (function () {
    var cookieConsentName = 'displayCookieConsent';
    var googleTagManagerCookieName = 'disabledGTMCookie';

    var cookieConsentId = 'cookieChoiceInfo';
    var parametersLinkId = 'cookieChoiceParameters';
    var acceptLinkId = 'cookieChoiceAccept';
    var rejectLinkId = 'cookieChoiceReject';

    function _setElementText(element, text) {
        if (supportsTextContent) {
            element.textContent = text;
        } else {
            element.innerText = text;
        }
    }

    function _createConsentTitle(cookieText) {
        var consentTitle = document.createElement('div');
        consentTitle.className = 'cookies-title';
        _setElementText(consentTitle, cookieText);
        return consentTitle;
    }

    function _createConsentText(cookieText) {
        var consentText = document.createElement('div');
        consentText.className = 'cookies-content';
        _setElementText(consentText, cookieText);
        return consentText;
    }

    function _createParametersButton(parametersText, linkHref) {
        var parametersLink = document.createElement('button');
        _setElementText(parametersLink, parametersText);
        parametersLink.id = parametersLinkId;
        parametersLink.type = 'button';
        parametersLink.className = 'cookies-more';
        return parametersLink;
    }

    function _createAcceptButton(dismissText, color) {
        var dismissLink = document.createElement('button');
        _setElementText(dismissLink, dismissText);
        dismissLink.id = acceptLinkId;
        dismissLink.type = 'button';
        dismissLink.className = 'cookies-button';
        if (color) {
            dismissLink.style.backgroundColor = color;
        }
        return dismissLink;
    }

    function _createRejectButton(dismissText, color) {
        var dismissLink = document.createElement('button');
        _setElementText(dismissLink, dismissText);
        dismissLink.id = rejectLinkId;
        dismissLink.type = 'button';
        dismissLink.className = 'cookies-button';
        if (color) {
            dismissLink.style.backgroundColor = color;
        }
        return dismissLink;
    }

    function _createHeaderElement(cookieTitle, cookieText, acceptText, rejectText, parametersText, linkText, linkHref, color) {
        var cookieConsentElement = document.createElement('div');
        cookieConsentElement.id = cookieConsentId;
        cookieConsentElement.className = 'cookies-message';

        var cookieContent = document.createElement('div');
        cookieContent.className = 'cookies-container';
        cookieConsentElement.appendChild(cookieContent);
        cookieContent.appendChild(_createConsentTitle(cookieTitle));
        cookieContent.appendChild(_createConsentText(cookieText));

        cookieContent.appendChild(_createAcceptButton(acceptText, color));
        cookieContent.appendChild(_createRejectButton(rejectText, color));

        cookieContent.appendChild(_createParametersButton(parametersText, color));

        // if (!!linkText && !!linkHref) {
        //     cookieContent.appendChild(_createParametersButton(linkText, linkHref));
        // }

        return cookieConsentElement;
    }

    function _createConsentCheckbox(id, title, detail, checked, disabled) {
        var cookiesConsentElement = document.createElement('li');
        cookiesConsentElement.className = 'cookies-element';

        var elementInput = document.createElement('input');
        elementInput.id = id;
        elementInput.className = 'cookies-element-input';
        elementInput.type = 'checkbox';
        elementInput.disabled = disabled;
        elementInput.checked = checked;

        var elementLabel = document.createElement('label');
        elementLabel.className = 'cookies-element-label';
        elementLabel.htmlFor = id;
        _setElementText(elementLabel, title);

        var elementDetails = document.createElement('div');
        elementDetails.className = 'cookies-element-content';
        _setElementText(elementDetails, detail);

        if (!disabled) {
            elementLabel.onclick = function () {
                return _changeConsentClick(!elementInput.checked);
            };
        }

        cookiesConsentElement.appendChild(elementInput);
        cookiesConsentElement.appendChild(elementLabel);
        cookiesConsentElement.appendChild(elementDetails);

        return cookiesConsentElement;
    }

    function _parametersLinkClick() {
        var cookieContent = document.querySelector('.cookies-content');
        if (cookieContent.dataset.parameters) {
            delete cookieContent.dataset.parameters;
            document.getElementById('cookies-details').remove();
            document.getElementById('cookies-list').remove();

            return;
        }

        cookieContent.dataset.parameters = 'true';
        var consentDetails = document.createElement('div');
        consentDetails.id = 'cookies-details';
        consentDetails.className = 'cookies-details';
        _setElementText(consentDetails, I18n.t('js.cookies.details'));
        cookieContent.appendChild(consentDetails);

        var cookiesConsentList = document.createElement('ul');
        cookiesConsentList.id = 'cookies-list';
        cookiesConsentList.className = 'cookies-list';
        cookiesConsentList.appendChild(_createConsentCheckbox('website', I18n.t('js.cookies.website.title'), I18n.t('js.cookies.website.details'), true, true));
        cookiesConsentList.appendChild(_createConsentCheckbox('analytics', I18n.t('js.cookies.analytics.title'), I18n.t('js.cookies.analytics.details'), _shouldDisabledGTM(), false));
        cookiesConsentList.appendChild(_createConsentCheckbox('social', I18n.t('js.cookies.social.title'), I18n.t('js.cookies.social.details'), _shouldDisabledGTM(), false));
        cookiesConsentList.appendChild(_createConsentCheckbox('advertisement', I18n.t('js.cookies.advertisement.title'), I18n.t('js.cookies.advertisement.details'), _shouldDisabledGTM(), false));
        cookieContent.appendChild(cookiesConsentList);

        return false;
    }

    function _changeConsentClick(enabled) {
        if (!enabled) {
            _setGTMCookie();
        } else {
            _removeGTMCookie();
        }

        return true;
    }

    function _dismissLinkClick() {
        _saveUserPreference();
        _removeCookieConsent();
        return false;
    }

    function _showCookieConsent(cookieTitle, cookieText, acceptText, rejectText, parametersText, linkText, linkHref, warning, force) {
        if (_shouldDisplayConsent() || force) {
            _removeCookieConsent();
            var consentElement = _createHeaderElement(cookieTitle, cookieText, acceptText, rejectText, parametersText, linkText, linkHref, warning);
            var fragment = document.createDocumentFragment();
            fragment.appendChild(consentElement);
            document.body.appendChild(fragment.cloneNode(true));
            document.getElementById(parametersLinkId).onclick = _parametersLinkClick;
            document.getElementById(acceptLinkId).onclick = _dismissLinkClick;
            document.getElementById(rejectLinkId).onclick = _dismissLinkClick;
        }

        if (force) {
            _parametersLinkClick();
        }
    }

    function showCookieConsentBar(cookieTitle, cookieText, acceptText, rejectText, parametersText, linkText, linkHref, warning, force) {
        _showCookieConsent(cookieTitle, cookieText, acceptText, rejectText, parametersText, linkText, linkHref, warning, force);
    }

    function _removeCookieConsent() {
        var cookieChoiceElement = document.getElementById(cookieConsentId);
        if (cookieChoiceElement) {
            cookieChoiceElement.parentNode.removeChild(cookieChoiceElement);
        }
    }

    function _saveUserPreference() {
        // Set the cookie expiry to one year after today.
        var expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        document.cookie = cookieConsentName + '=y; path=/; expires=' + expiryDate.toGMTString();
    }

    function _setGTMCookie() {
        // Set the cookie expiry to one year after today.
        var expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        document.cookie = googleTagManagerCookieName + '=y; path=/; expires=' + expiryDate.toGMTString();
    }

    function _removeGTMCookie() {
        document.cookie = googleTagManagerCookieName + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    function _shouldDisplayConsent() {
        // Display the header only if the cookie has not been set.
        return !document.cookie.match(new RegExp(cookieConsentName + '=([^;]+)'));
    }

    function _shouldDisabledGTM() {
        // Display the header only if the cookie has not been set.
        return !document.cookie.match(new RegExp(googleTagManagerCookieName + '=([^;]+)'));
    }

    function acceptCookies() {
        if (navigator.cookieEnabled) return true;

        // set and read cookie
        document.cookie = 'cookietest=1';
        var ret = document.cookie.indexOf('cookietest=') !== -1;

        // delete cookie
        document.cookie = 'cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT';

        return ret;
    }

    function displayCookies(termsUrl) {
        if (acceptCookies()) {
            showCookieConsentBar(I18n.t('js.cookies.title'), I18n.t('js.cookies.content'), I18n.t('js.cookies.accept_button'), I18n.t('js.cookies.reject_button'), I18n.t('js.cookies.link'), termsUrl, '#21ca87');
        } else {
            showCookieConsentBar(I18n.t('js.no_cookies.title'), I18n.t('js.no_cookies.content'), I18n.t('js.no_cookies.button'), I18n.t('js.no_cookies.link'), termsUrl, 'red');
        }
    }

    return {
        displayCookies: displayCookies
    };
})();

// Cookies are disabled for now (collecting no user data for Ads)
// if (!window.seoMode && process.env.NODE_ENV === 'production') {
//     document.addEventListener('DOMContentLoaded', function () {
//         setTimeout(function () {
//             cookieChoices.displayCookies(window.termsUrl);
//         }, 10);
//     });
// }
