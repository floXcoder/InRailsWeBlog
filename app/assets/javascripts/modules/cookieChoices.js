'use strict';

var document = window.document;

// IE8 does not support textContent, so we should fallback to innerText.
var supportsTextContent = 'textContent' in document.body;

const cookieChoices = (function () {
    var cookieConsentName = 'displayCookieConsent';
    var googleTagManagerCookieName = 'disabledGTMCookie';

    var cookieConsentId = 'cookieChoiceInfo';
    var parametersLinkId = 'cookieChoiceParameters';
    var dismissLinkId = 'cookieChoiceDismiss';

    function _createHeaderElement(cookieTitle, cookieText, dismissText, parametersText, linkText, linkHref, color) {
        var cookieConsentElement = document.createElement('div');
        cookieConsentElement.id = cookieConsentId;
        cookieConsentElement.className = 'cookies-message';

        var cookieContent = document.createElement('div');
        cookieContent.className = 'cookies-container';
        cookieConsentElement.appendChild(cookieContent);
        cookieContent.appendChild(_createConsentTitle(cookieTitle));
        cookieContent.appendChild(_createConsentText(cookieText));

        cookieContent.appendChild(_createDismissButton(dismissText, color));

        cookieContent.appendChild(_createParametersButton(parametersText, color));

        // if (!!linkText && !!linkHref) {
        //     cookieContent.appendChild(_createInformationLink(linkText, linkHref));
        // }

        return cookieConsentElement;
    }

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

    function _createDismissButton(dismissText, color) {
        var dismissLink = document.createElement('button');
        _setElementText(dismissLink, dismissText);
        dismissLink.id = dismissLinkId;
        dismissLink.type = 'button';
        dismissLink.className = 'cookies-button';
        if (color) {
            dismissLink.style.backgroundColor = color;
        }
        return dismissLink;
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
        _setElementText(elementDetails, detail);

        if (!disabled) {
            elementLabel.onclick = function () {
                return _changeConsentClick(!elementInput.checked)
            }
        }

        cookiesConsentElement.appendChild(elementInput);
        cookiesConsentElement.appendChild(elementLabel);
        cookiesConsentElement.appendChild(elementDetails);

        return cookiesConsentElement;
    }

    function _parametersLinkClick() {
        var cookieContent = document.querySelector('.cookies-content');
        if (cookieContent.dataset.parameters) {
            return;
        }
        cookieContent.dataset.parameters = 'true';
        var consentDetails = document.createElement('div');
        consentDetails.className = 'cookies-details';
        _setElementText(consentDetails, I18n.t('js.cookies.details'));
        cookieContent.appendChild(consentDetails);

        var cookiesConsentList = document.createElement('ul');
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

    function _showCookieConsent(cookieTitle, cookieText, dismissText, parametersText, linkText, linkHref, warning, force) {
        if (_shouldDisplayConsent() || force) {
            _removeCookieConsent();
            var consentElement = _createHeaderElement(cookieTitle, cookieText, dismissText, parametersText, linkText, linkHref, warning);
            var fragment = document.createDocumentFragment();
            fragment.appendChild(consentElement);
            document.body.appendChild(fragment.cloneNode(true));
            document.getElementById(parametersLinkId).onclick = _parametersLinkClick;
            document.getElementById(dismissLinkId).onclick = _dismissLinkClick;
        }

        if (force) {
            _parametersLinkClick();
        }
    }

    function showCookieConsentBar(cookieTitle, cookieText, dismissText, parametersText, linkText, linkHref, warning, force) {
        _showCookieConsent(cookieTitle, cookieText, dismissText, parametersText, linkText, linkHref, warning, force);
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
        document.cookie = "cookietest=1";
        var ret = document.cookie.indexOf("cookietest=") !== -1;

        // delete cookie
        document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";

        return ret;
    }

    function displayCookies() {
        if (acceptCookies()) {
            showCookieConsentBar(I18n.t('js.cookies.title'), I18n.t('js.cookies.content'), I18n.t('js.cookies.button'), I18n.t('js.cookies.link'), '/politique-des-donnees', '#21ca87');
        } else {
            showCookieConsentBar(I18n.t('js.no_cookies.title'), I18n.t('js.no_cookies.content'), I18n.t('js.no_cookies.button'), I18n.t('js.no_cookies.link'), '/politique-des-donnees', 'red');
        }
    }

    return {
        displayCookies: displayCookies
    };
})();

if (!window.seoMode && js_environment.NODE_ENV === 'production') {
    setTimeout(() => {
        cookieChoices.displayCookies();
    }, 1000);
}
