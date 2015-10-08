var Checkbox = React.createClass({

    componentDidMount: function() {
        //$('select').material_select();
    },

    render: function () {
        return (
            <div className="switch">
                <h6>
                    {this.props.children}
                </h6>
                <label>
                    {this.props.values.false}
                    <input type="checkbox" />
                    <span className="lever" />
                    {this.props.values.true}
                </label>
            </div>
        );
    }
});

module.exports = Checkbox;

