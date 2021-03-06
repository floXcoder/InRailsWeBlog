'use strict';

const NotFound = () => (
    <div className="card-panel center-align">
        <h2>
            {I18n.t('js.helpers.not_found.title')}
        </h2>
    </div>
);

export default React.memo(NotFound);
