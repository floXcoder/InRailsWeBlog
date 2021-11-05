'use strict';

const LOG_REGEX = /(\w+),\s*\[(.*?) (#\w+)\]\s*(\w+)\s*--\s*:\s*\[(\S+?)\]\s*\[(\S+?)\]\s*\[(\S+)\]\s*method=(\w+) \s*path=(.*?) \s*format=(.*?) \s*(.*?)status=(\d+) \s*(.*?)referer=(.*?) \s*(.*)/;
const BOT_LOG_REGEX = /(\w+),\s*\[(.*?) (#\w+)\]\s*(\w+)\s*--\s*:\s*\[(\S+?)\]\s*\[(\S+?)\]\s*\[(\S+)\]\s*\[bot:(\w+)\]\s*method=(\w+)\s*path=(.*?)\s*format=(.*?) \s*(.*?)status=(\d+) \s*(.*)/;

const monthNames = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatTime = (string) => {
    return string.toString().length === 1 ? `0${string}` : string;
};

const formatDate = (stringDate, onLineElementClick) => {
    const date = new Date(Date.parse(stringDate));

    const formattedTime = `${formatTime(date.getHours())}:${formatTime(date.getMinutes())}:${formatTime(date.getSeconds())}`;

    return (
        <span>
            {`${date.getDate()} ${monthNames[date.getMonth()]} - `}
            <a onClick={onLineElementClick.bind(null, 'date', formattedTime)}>
                {formattedTime}
            </a>
        </span>
    );
};

const logClass = (level) => {
    let logClass;
    if (level === 'W') {
        logClass = 'file-line-warn';
    } else if (level === 'E' || level === 'F') {
        logClass = 'file-line-error';
    }

    return logClass;
};

const LogLine = ({children, onLineElementClick}) => {
    const logRegex = LOG_REGEX.exec(children);
    const botLogRegex = BOT_LOG_REGEX.exec(children);

    if (botLogRegex) {
        const [, l, date, eventId, level, host, ip, sessionId, bot, method, path, format, other1, status, other2] = botLogRegex;

        return (
            <li>
                <p className={`file-line-bot ${logClass(level)}`}>
                    <a onClick={onLineElementClick.bind(null, 'level', level)}>{level}</a> -
                    [{formatDate(date, onLineElementClick)}] : [<a
                    onClick={onLineElementClick.bind(null, 'host', host)}>{host}</a>] [<a
                    onClick={onLineElementClick.bind(null, 'ip', ip)}>{ip}</a>] [<a
                    onClick={onLineElementClick.bind(null, 'bot', bot)}>bot:{bot}</a>] status=<a
                    onClick={onLineElementClick.bind(null, 'status', status)}>{status}</a> method=<a
                    onClick={onLineElementClick.bind(null, 'method', method)}>{method}</a> format=<a
                    onClick={onLineElementClick.bind(null, 'format', format)}>{format}</a> path=<a
                    href={path} target="_blank">{path}</a> {other1} {other2}
                </p>
            </li>
        );
    } else if (logRegex) {
        const [, l, date, eventId, level, host, ip, sessionId, method, path, format, other1, status, other2, referer, other3] = logRegex;

        return (
            <li>
                <p className={`file-line ${logClass(level)}`}>
                    <a onClick={onLineElementClick.bind(null, 'level', level)}>{level}</a> -
                    [{formatDate(date, onLineElementClick)}] : [<a
                    onClick={onLineElementClick.bind(null, 'host', host)}>{host}</a>] [<a
                    onClick={onLineElementClick.bind(null, 'ip', ip)}>{ip}</a>] status=<a
                    onClick={onLineElementClick.bind(null, 'status', status)}>{status}</a> method=<a
                    onClick={onLineElementClick.bind(null, 'method', method)}>{method}</a> format=<a
                    onClick={onLineElementClick.bind(null, 'format', format)}>{format}</a> path=<a
                    href={path} target="_blank">{path}</a> referer=<a
                    href={referer} target="_blank">{referer}</a> {other1} {other2} {other3}
                </p>
            </li>
        );
    } else {
        return (
            <li>
                <p dangerouslySetInnerHTML={{__html: children}}/>
            </li>
        );
    }
};

LogLine.propTypes = {
    children: PropTypes.string.isRequired,
    onLineElementClick: PropTypes.func.isRequired
};

export default LogLine;
