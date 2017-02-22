'use strict';

const classNames = require('classnames');

const Progress = require('../materialize/progress');

var FormWizard = React.createClass({
    propTypes: {
        titles: React.PropTypes.array.isRequired,
        children: React.PropTypes.array.isRequired,
        isPrevValid: React.PropTypes.bool,
        isNextValid: React.PropTypes.bool,
        onPrevClick: React.PropTypes.func,
        onNextClick: React.PropTypes.func
    },

    getDefaultProps () {
        return {
            isPrevValid: true,
            isNextValid: true,
            onPrevClick: null,
            onNextClick: null
        };
    },

    getInitialState () {
        return {
            currentStep: 0,
            totalSteps: this.props.titles.length
        };
    },

    _handleStepClick (i) {
        if (this.state.currentStep < i) {
            this._handleNextClick();
        } else {
            this._handlePreviousClick();
        }

        // this.setState({
        //     currentStep: i
        // });
    },

    _handlePreviousClick () {
        if (this.state.currentStep > 0 && this.props.isPrevValid) {
            let prevStep = this.state.currentStep - 1;

            if (this.props.onPrevClick) {
                let prevStepValidation = this.props.onPrevClick(this.state.currentStep);
                if (prevStepValidation !== true) {
                    if ($.isEmpty(prevStepValidation)) {
                        return;
                    } else {
                        prevStep = prevStepValidation;
                    }
                }
            }

            this.setState({
                currentStep: prevStep
            });
        }
    },

    _handleNextClick () {
        if (this.state.currentStep < this.state.totalSteps && this.props.isNextValid) {
            let nextStep = this.state.currentStep + 1;

            if (this.props.onNextClick) {
                let nextStepValidation = this.props.onNextClick(this.state.currentStep);
                if (nextStepValidation !== true) {
                    if ($.isEmpty(nextStepValidation)) {
                        return;
                    } else {
                        nextStep = nextStepValidation;
                    }
                }
            }

            this.setState({
                currentStep: nextStep
            });
        }
    },

    render () {
        const prevClasses = classNames(
            'waves-effect waves-light btn',
            {
                disabled: !this.props.isPrevValid || this.state.currentStep === 0
            }
        );

        const nextClasses = classNames(
            'waves-effect waves-light btn',
            {
                disabled: !this.props.isNextValid || this.state.currentStep === this.state.totalSteps - 1
            }
        );

        return (
            <div className="form-wizard form-wizard-horizontal">
                <div className="form-wizard-nav">
                    <Progress totalValues={100 - 100 / this.state.totalSteps}
                              value={this.state.currentStep / (this.state.totalSteps - 1) * 100}/>

                    <ul className="nav nav-justified nav-pills">
                        {
                            this.props.titles.map((title, i) =>
                                <li key={i}
                                    className={classNames({
                                            active: this.state.currentStep === i,
                                            done: this.state.currentStep > i
                                        })}>
                                    <a href={`#tab${i}`}
                                       onClick={this._handleStepClick.bind(this, i)}>
                                            <span className="step">
                                                {i}
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
                                 id={`tab${i}`}
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
                           onClick={this._handlePreviousClick}>
                            <i className="material-icons left">chevron_left</i>
                            {I18n.t('js.form.wizard.previous')}
                        </a>
                    </li>
                    <li className="next">
                        <a className={nextClasses}
                           onClick={this._handleNextClick}>
                            <i className="material-icons right">chevron_right</i>
                            {I18n.t('js.form.wizard.next')}
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
});

module.exports = FormWizard;
