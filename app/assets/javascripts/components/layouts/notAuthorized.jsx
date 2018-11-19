'use strict';

const NotAuthorized = ({}) => (
    <div className="card-panel">
        <h2>
            {I18n.t('js.helpers.not_authorized.title')}
        </h2>
    </div>
);

export default React.memo(NotAuthorized);
