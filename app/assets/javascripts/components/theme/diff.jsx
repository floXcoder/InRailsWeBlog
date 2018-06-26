import * as jsdiff from 'diff';

const fnMap = {
    'chars': jsdiff.diffChars,
    'words': jsdiff.diffWords,
    'sentences': jsdiff.diffSentences,
    'json': jsdiff.diffJson
};

export default class Diff extends React.Component {
    static propTypes = {
        current: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]),
        previous: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object
        ]),
        type: PropTypes.oneOf([
            'chars',
            'words',
            'sentences',
            'json'
        ])
    };

    static defaultProps = {
        current: '',
        previous: '',
        type: 'chars'
    };

    constructor(props) {
        super(props);
    }

    render() {
        const diff = fnMap[this.props.type](this.props.current, this.props.previous);

        return (
            <div className="diff-result">
                {
                    diff.map((part, index) => (
                        <span key={index}
                              style={{backgroundColor: part.added ? 'lightgreen' : part.removed ? 'salmon' : ''}}
                            dangerouslySetInnerHTML={{__html: part.value}}/>
                    ))
                }
            </div>
        );
    }
};
