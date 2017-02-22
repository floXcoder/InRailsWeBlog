'use strict';

require('../../modules/validation');

var Form = React.createClass({
    propTypes: {
        children: React.PropTypes.array.isRequired,
        model: React.PropTypes.string,
        id: React.PropTypes.string,
        modelId: React.PropTypes.number,
        action: React.PropTypes.string,
        type: React.PropTypes.string,
        isValidating: React.PropTypes.bool,
        validationExcluded: React.PropTypes.string,
        isMultipart: React.PropTypes.bool,
        isRemote: React.PropTypes.bool,
        className: React.PropTypes.string,
        onSubmit: React.PropTypes.func
    },

    getDefaultProps () {
        return {
            id: null,
            modelId: null,
            action: null,
            model: null,
            type: 'show',
            isValidating: false,
            validationExcluded: null,
            isMultipart: false,
            isRemote: false,
            onSubmit: null
        };
    },

    componentDidMount () {
        if (this.props.isValidating && this.id) {
            $(`#${this.id}`).parsley({
                excluded: this.props.validationExcluded
            });
        }
    },

    id: null,

    getId () {
      return this.id;
    },

    _handleSubmit (event) {
        if(this.props.onSubmit) {
            return this.props.onSubmit(event);
        }
    },

    render () {
        if(this.props.id) {
            this.id = this.props.id;
        } else if (this.props.model) {
            this.id = `new_${this.props.model}`;
            if (this.props.type === 'edit') {
                this.id = `edit_${this.props.model}_${this.props.modelId}`;
            }
        } else {
            this.id = 'form';
        }

        let action = null;
        if(this.props.action) {
            action = this.props.action;
        } else if (this.props.model) {
            action = `/${this.props.model}s/`;
            if (this.props.type === 'edit') {
                action = `/${this.props.model}s/${this.props.modelId}`;
            }
        } else {
            action = '/';
        }

        const className = this.props.className ? this.props.className : 'blog-form';

        return (
            <form ref="form"
                  id={this.id}
                  action={action}
                  method="post"
                  className={className}
                  data-parsley-validate={this.props.isValidating}
                  encType={this.props.isMultipart ? 'multipart/form-data' : null}
                  data-remote={this.props.isRemote}
                  acceptCharset="UTF-8"
                  noValidate="novalidate"
                  onSubmit={this._handleSubmit}>

                {
                    this.props.type === 'edit' &&
                    <input type="hidden"
                           name="_method"
                           value="patch"/>
                }

                <input type="hidden"
                       name="authenticity_token"
                       value={$('meta[name="csrf-token"]').attr('content')}/>

                {this.props.children}
            </form>
        );
    }
});

module.exports = Form;
