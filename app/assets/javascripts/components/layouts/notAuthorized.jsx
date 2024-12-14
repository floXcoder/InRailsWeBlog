import I18n from '@js/modules/translations';


function NotAuthorized() {
    return (
        <div>
            <h2>
                {I18n.t('js.helpers.not_authorized.title')}
            </h2>
        </div>
    );
}

export default NotAuthorized;
