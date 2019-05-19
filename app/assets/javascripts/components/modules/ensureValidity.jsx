'use strict';

const EnsureValidity = () => {
    const id = `ensure_validity_${Utils.uuid()}`;

    return (
        <div className="ensure-validity">
            <label htmlFor={id}>
                {I18n.t('js.helpers.form.ensure_validity')}
            </label>

            <input id={id}
                   className="validate"
                   name="ensure[validity]"
                   defaultValue=""
                   type="text"/>
        </div>
    );
};

export default React.memo(EnsureValidity);

