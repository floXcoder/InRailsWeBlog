'use strict';

export default class Form extends React.Component {
    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.element
        ]).isRequired,
        model: PropTypes.string,
        id: PropTypes.string,
        modelId: PropTypes.number,
        action: PropTypes.string,
        isEdition: PropTypes.bool,
        dataType: PropTypes.oneOf(['json', 'js']),
        validationExcluded: PropTypes.string,
        isMultipart: PropTypes.bool,
        isRemote: PropTypes.bool,
        className: PropTypes.string,
        onSubmit: PropTypes.func
    };

    static defaultProps = {
        isEdition: false,
        dataType: 'json',
        isMultipart: false,
        isRemote: false
    };

    constructor(props) {
        super(props);

        this.id = null;
    }

    render() {
        if (this.props.id) {
            this.id = this.props.id;
        } else if (this.props.model) {
            this.id = `new_${this.props.model}`;
            if (this.props.isEdition) {
                this.id = `edit_${this.props.model}_${this.props.modelId}`;
            }
        } else {
            this.id = 'form';
        }

        let action = null;
        if (this.props.action) {
            action = this.props.action;
        } else if (this.props.model) {
            action = `/${this.props.model}s/`;
            if (this.props.isEdition) {
                action = `/${this.props.model}s/${this.props.modelId}`;
            }
        } else {
            action = '/';
        }

        return (
            <form id={this.id}
                  action={action}
                  method="post"
                  className={classNames('blog-form', this.props.className)}
                  encType={this.props.isMultipart ? 'multipart/form-data' : undefined}
                  data-remote={this.props.isRemote}
                  data-type={this.props.dataType}
                  acceptCharset="UTF-8"
                  noValidate="novalidate"
                  onSubmit={this.props.onSubmit}>

                {
                    this.props.isEdition &&
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
}

