'use strict';

var Textarea = React.createClass({
    propTypes: {
        children: React.PropTypes.string.isRequired,
        id: React.PropTypes.string.isRequired,
        onChange: React.PropTypes.func,
        characterCount: React.PropTypes.number
    },

    getDefaultProps () {
        return {
            onChange: null,
            characterCount: null
        };
    },

    componentDidMount () {
        if(this.props.characterCount) {
            let $currentElement = $(ReactDOM.findDOMNode(this.refs[this.props.id]));
            $currentElement.attr('length', this.props.characterCount);
            $currentElement.characterCounter();
        }
    },

    value () {
        return this.refs[this.props.id].value;
    },

    setValue (value) {
        this.refs[this.props.id].value = value;
    },

    render () {
        return (
            <div className="input-field">
                <textarea id={this.props.id}
                          ref={this.props.id}
                          className="materialize-textarea"
                          onChange={this.props.onChange}/>
                <label htmlFor={this.props.id}>
                    {this.props.children}
                </label>
            </div>
        );
    }
});

module.exports = Textarea;

