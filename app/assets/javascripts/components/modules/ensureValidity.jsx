'use strict';

const EnsureValidity = () => (
    <div className="ensure-validity">
        <input id="ensure_validity"
               className="validate"
               name="ensure[validity]"
               value=""
               type="text"/>
        <label htmlFor="ensure_validity">{I18n.t('js.helpers.form.ensure_validity')}</label>
    </div>
);

export default EnsureValidity;

