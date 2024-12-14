import React from 'react';

import I18n from '@js/modules/translations';
import * as Utils from '@js/modules/utils';


function EnsureValidity() {
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

            <button style={{display: 'none'}}
                    type="submit"/>
        </div>
    );
}

export default React.memo(EnsureValidity);

