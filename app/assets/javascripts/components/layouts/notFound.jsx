'use strict';

const NotFound = () => (
    <div className="center-align">
        <h1>
            {I18n.t('js.helpers.not_found.title')}
        </h1>
    </div>
);

export default React.memo(NotFound);
