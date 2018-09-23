'use strict';

import '../../../stylesheets/components/animated.scss';

const AnimatedText = ({title, subtitle}) => (
    <section className="card-title cd-intro">
        <div className="cd-intro-content mask">
            <h1 data-content={title}>
                <span>
                    {title}
                </span>
            </h1>

            {
                subtitle &&
                <div className="action-wrapper hide-on-small-and-down">
                    <h2>
                        {subtitle}
                    </h2>
                </div>
            }
        </div>
    </section>
);

AnimatedText.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string
};

export default AnimatedText;
