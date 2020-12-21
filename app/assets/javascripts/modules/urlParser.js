'use strict';

const tag2attr = {
    a: 'href',
    img: 'src',
    form: 'action',
    base: 'href',
    script: 'src',
    iframe: 'src',
    link: 'href'
};

const key = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'fragment']; // keys available to query

const aliases = {'anchor': 'fragment'}; // aliases for backwards compatibility

const parser = {
    strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,  //less intuitive, more accurate to the specs
    loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // more intuitive, fails on relative paths and deviates from specs
};

const isInt = /^[0-9]+$/;

function parseUri(url, strictMode) {
    let str = decodeURI(url);
    let res = parser[strictMode || false ? 'strict' : 'loose'].exec(str);
    let uri = {attr: {}, param: {}, seg: {}};
    let i = 14;

    while (i--) {
        uri.attr[key[i]] = res[i] || '';
    }

    // build query and fragment parameters
    uri.param['query'] = parseString(uri.attr['query']);
    uri.param['fragment'] = parseString(uri.attr['fragment']);

    // split path and fragment into segments
    uri.seg['path'] = uri.attr.path.replace(/^\/+|\/+$/g, '').split('/');
    uri.seg['fragment'] = uri.attr.fragment.replace(/^\/+|\/+$/g, '').split('/');

    // compile a 'base' domain attribute
    uri.attr['base'] = uri.attr.host ? (uri.attr.protocol ? uri.attr.protocol + '://' + uri.attr.host : uri.attr.host) + (uri.attr.port ? ':' + uri.attr.port : '') : '';

    return uri;
}

function getAttrName(elm) {
    const tn = elm.tagName;
    if (typeof tn !== 'undefined') return tag2attr[tn.toLowerCase()];
    return tn;
}

function promote(parent, key) {
    if (parent[key].length === 0) return parent[key] = {};
    let t = {};
    for (let i in parent[key]) t[i] = parent[key][i];
    parent[key] = t;
    return t;
}

function parse(parts, parent, key, val) {
    let part = parts.shift();
    if (!part) {
        if (isArray(parent[key])) {
            parent[key].push(val);
        } else if ('object' === typeof parent[key]) {
            parent[key] = val;
        } else if ('undefined' === typeof parent[key]) {
            parent[key] = val;
        } else {
            parent[key] = [parent[key], val];
        }
    } else {
        let obj = parent[key] = parent[key] || [];
        if (']' === part) {
            if (isArray(obj)) {
                if ('' !== val) obj.push(val);
            } else if ('object' === typeof obj) {
                obj[keys(obj).length] = val;
            } else {
                obj = parent[key] = [parent[key], val];
            }
        } else if (~part.indexOf(']')) {
            part = part.substr(0, part.length - 1);
            if (!isInt.test(part) && isArray(obj)) obj = promote(parent, key);
            parse(parts, obj, part, val);
            // key
        } else {
            if (!isInt.test(part) && isArray(obj)) obj = promote(parent, key);
            parse(parts, obj, part, val);
        }
    }
}

function merge(parent, key, val) {
    if (~key.indexOf(']')) {
        let parts = key.split('[');
        let len = parts.length;
        let last = len - 1;
        parse(parts, parent, 'base', val);
    } else {
        if (!isInt.test(key) && isArray(parent.base)) {
            let t = {};
            for (let k in parent.base) t[k] = parent.base[k];
            parent.base = t;
        }
        set(parent.base, key, val);
    }
    return parent;
}

function parseString(str) {
    return reduce(String(str).split(/&|;/), function (ret, pair) {
        try {
            pair = decodeURIComponent(pair.replace(/\+/g, ' '));
        } catch (e) {
            // ignore
        }
        let eql = pair.indexOf('='),
            brace = lastBraceInKey(pair),
            key = pair.substr(0, brace || eql),
            value = pair.substr(brace || eql, pair.length),
            val = value.substr(value.indexOf('=') + 1, value.length);

        if ('' === key) key = pair, val = '';

        return merge(ret, key, val);
    }, {base: {}}).base;
}

function set(obj, key, val) {
    let v = obj[key];
    if (undefined === v) {
        obj[key] = val;
    } else if (isArray(v)) {
        v.push(val);
    } else {
        obj[key] = [v, val];
    }
}

function lastBraceInKey(str) {
    let len = str.length;
    let brace;
    let c;
    for (let i = 0; i < len; ++i) {
        c = str[i];
        if (']' === c) brace = false;
        if ('[' === c) brace = true;
        if ('=' === c && !brace) return i;
    }
}

function reduce(obj, accumulator, curr) {
    let i = 0;
    let l = obj.length >> 0;
    while (i < l) {
        if (i in obj) curr = accumulator.call(undefined, curr, obj[i], i, obj);
        ++i;
    }
    return curr;
}

function isArray(vArg) {
    return Object.prototype.toString.call(vArg) === "[object Array]";
}

function keys(obj) {
    let keys = [];
    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) keys.push(prop);
    }
    return keys;
}

const urlParser = (url, strictMode) => {
    strictMode = strictMode || false;
    url = url || window.location.toString();

    return {
        data: parseUri(url, strictMode),

        // get various attributes from the URI
        attr: function (attr) {
            attr = aliases[attr] || attr;
            return typeof attr !== 'undefined' ? this.data.attr[attr] : this.data.attr;
        },

        // return query string parameters
        param: function (param) {
            return typeof param !== 'undefined' ? this.data.param.query[param] : this.data.param.query;
        },

        // return fragment parameters
        fparam: function (param) {
            return typeof param !== 'undefined' ? this.data.param.fragment[param] : this.data.param.fragment;
        },

        // return path segments
        segment: function (seg) {
            if (typeof seg === 'undefined') {
                return this.data.seg.path;
            } else {
                seg = seg < 0 ? this.data.seg.path.length + seg : seg - 1; // negative segments count from the end
                return this.data.seg.path[seg];
            }
        },

        // return fragment segments
        fsegment: function (seg) {
            if (typeof seg === 'undefined') {
                return this.data.seg.fragment;
            } else {
                seg = seg < 0 ? this.data.seg.fragment.length + seg : seg - 1; // negative segments count from the end
                return this.data.seg.fragment[seg];
            }
        }
    };
};

export default urlParser;
