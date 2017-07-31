'use strict';

import Progress from '../materialize/progress';
import ProcessingButton from '../theme/processing-button';

export default class FormWizard extends React.Component {
    static propTypes = {
        titles: PropTypes.array.isRequired,
        children: PropTypes.array.isRequired,
        id: PropTypes.string,
        lastButton: PropTypes.string,
        isButtonsDisabled: PropTypes.bool,
        isProcessing: PropTypes.bool,
        isProcessingButton: PropTypes.string,
        isPrevValid: PropTypes.bool,
        isNextValid: PropTypes.bool,
        onPrevClick: PropTypes.func,
        onNextClick: PropTypes.func,
        onLastClick: PropTypes.func
    };

    static defaultProps = {
        id: 'tab',
        lastButton: null,
        isButtonsDisabled: false,
        isProcessing: false,
        isProcessingButton: null,
        isPrevValid: true,
        isNextValid: true,
        onPrevClick: null,
        onNextClick: null
    };

    constructor(props) {
        super(props);
    }

    state = {
        totalSteps: this.props.children.length - 1,
        currentStep: (() => ($.getUrlAnchor() && $.getUrlAnchor().includes(this.props.id)) ? parseInt($.getUrlAnchor().replace(this.props.id, ''), 10) : 0)(),
    };

    _handleStepClick = (i) => {
        if (this.state.currentStep < i) {
            this._handleNextClick(Math.abs(this.state.currentStep - i));
        } else {
            this._handlePreviousClick(Math.abs(this.state.currentStep - i));
        }
    };

    _handlePreviousClick = (count = 1) => {
        if (this.state.currentStep > 0 && this.props.isPrevValid) {
            let newStep = this.state.currentStep;
            for (let i = 0; i < count; i++) {
                newStep -= 1;

                if (this.props.onPrevClick) {
                    let prevStepValidation = this.props.onPrevClick(this.state.currentStep - i);
                    if (prevStepValidation === false) {
                        if (i === 0) {
                            return;
                        } else {
                            newStep += 1;
                        }
                    } else if (prevStepValidation === true) {
                    } else {
                        if ($.isEmpty(prevStepValidation)) {
                            return;
                        } else {
                            newStep = prevStepValidation;
                        }
                    }
                }
            }

            this.setState({
                currentStep: newStep
            });

            setTimeout(() => {
                $('html, body').animate({scrollTop: $(ReactDOM.findDOMNode(this)).first('.tab-content.active').offset().top + 84}, 350);
            }, 100);
        }
    };

    _handleNextClick = (count = 1) => {
        if (this.state.currentStep < this.state.totalSteps && this.props.isNextValid) {
            let newStep = this.state.currentStep;
            for (let i = 0; i < count; i++) {
                newStep += 1;

                if (this.props.onNextClick) {
                    let nextStepValidation = this.props.onNextClick(this.state.currentStep + i);
                    if (nextStepValidation === false) {
                        if (i === 0) {
                            return;
                        } else {
                            newStep -= 1;
                        }
                    } else if (nextStepValidation === true) {
                    } else {
                        if ($.isEmpty(nextStepValidation)) {
                            return;
                        } else {
                            newStep = nextStepValidation;
                        }
                    }
                }
            }

            this.setState({
                currentStep: newStep
            });

            setTimeout(() => {
                $('html, body').animate({scrollTop: $(ReactDOM.findDOMNode(this)).first('.tab-content.active').offset().top + 84}, 350);
            }, 100);
        }

        const lastStep = this.state.totalSteps;
        if (lastStep === this.state.currentStep && this.props.onLastClick) {
            this.props.onLastClick();
        }
    };

    showStep = (i) => {
        if (Number.isInteger(i)) {
            this._handleStepClick(i);
        }
    };

    render() {
        const prevClasses = classNames(
            'waves-effect waves-light btn',
            {
                disabled: !this.props.isPrevValid || this.state.currentStep === 0 || this.props.isButtonsDisabled
            }
        );

        const nextClasses = classNames(
            'waves-effect waves-light btn',
            {
                disabled: (!this.props.lastButton && (!this.props.isNextValid || this.state.currentStep === this.state.totalSteps)) || this.props.isProcessing || this.props.isButtonsDisabled
            }
        );

        const isLastStep = ((this.state.totalSteps) === this.state.currentStep);

        return (
            <div className="form-wizard form-wizard-horizontal">
                <div className="form-wizard-nav">
                    <Progress totalValues={100 - 100 / (this.state.totalSteps + 1)}
                              value={this.state.currentStep / (this.state.totalSteps) * 100}/>

                    <ul className="nav nav-justified nav-pills">
                        {
                            this.props.titles.map((title, i) =>
                                <li key={i}
                                    className={classNames({
                                        active: this.state.currentStep === i,
                                        done: this.state.currentStep > i
                                    })}>
                                    <a href={`#${this.props.id}${i}`}
                                       onClick={this._handleStepClick.bind(this, i)}>
                                            <span className="step">
                                                {i + 1}
                                            </span>

                                        <span className="title">
                                                {title}
                                            </span>
                                    </a>
                                </li>
                            )
                        }
                    </ul>
                </div>

                <div className="tab-content clearfix">
                    {
                        this.props.children.map((content, i) =>
                            <div key={i}
                                 id={`${this.props.id}${i}`}
                                 className={classNames('tab-pane', {
                                     active: this.state.currentStep === i,
                                     hidden: this.state.currentStep > i
                                 })}>
                                {content}
                            </div>
                        )
                    }
                </div>

                <ul className="pager wizard">
                    <li className="previous">
                        <a className={prevClasses}
                           onClick={this._handlePreviousClick.bind(this, 1)}>
                            <i className="material-icons left">chevron_left</i>
                            {I18n.t('js.form.wizard.previous')}
                        </a>
                    </li>

                    <li className="next">
                        {
                            this.props.isProcessing && this.props.isProcessingButton
                                ?
                                <ProcessingButton title={this.props.isProcessingButton}/>
                                :
                                <a className={nextClasses}
                                   onClick={this._handleNextClick.bind(this, 1)}>
                                    {
                                        !isLastStep &&
                                        <i className="material-icons right">chevron_right</i>
                                    }
                                    {
                                        (isLastStep && this.props.lastButton)
                                            ?
                                            this.props.lastButton
                                            :
                                            I18n.t('js.form.wizard.next')
                                    }
                                </a>
                        }
                    </li>
                </ul>
            </div>
        );
    }
}


