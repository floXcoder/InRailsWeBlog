'use strict';

const EnsureValidity = () => (
    <div className="ensure-validity">
        <input id={`ensure_validity_${Utils.uuid()}`}
               className="validate"
               name="ensure[validity]"
               defaultValue=""
               type="text"/>
        <label htmlFor="ensure_validity">{I18n.t('js.helpers.form.ensure_validity')}</label>
    </div>
);

export default EnsureValidity;

