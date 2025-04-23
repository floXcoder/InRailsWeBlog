import $ from 'jquery';
const jQuery = $;

/*!
Super simple WYSIWYG editor v0.9.1
https://summernote.org

Copyright 2013- Hackerwins and contributors
Summernote may be freely distributed under the MIT license.

Date: 2024-11-18T10:27Z
 */
(function() {
  "use strict";
  $.summernote = $.summernote || {
    lang: {}
  };
  $.extend(true, $.summernote.lang, {
    "en-US": {
      font: {
        bold: "Bold",
        italic: "Italic",
        underline: "Underline",
        clear: "Remove Font Style",
        height: "Line Height",
        name: "Font Family",
        strikethrough: "Strikethrough",
        subscript: "Subscript",
        superscript: "Superscript",
        size: "Font Size",
        sizeunit: "Font Size Unit"
      },
      image: {
        image: "Picture",
        insert: "Insert Image",
        resizeFull: "Resize full",
        resizeHalf: "Resize half",
        resizeQuarter: "Resize quarter",
        resizeNone: "Original size",
        floatLeft: "Float Left",
        floatRight: "Float Right",
        floatNone: "Remove float",
        shapeRounded: "Shape: Rounded",
        shapeCircle: "Shape: Circle",
        shapeThumbnail: "Shape: Thumbnail",
        shapeNone: "Shape: None",
        dragImageHere: "Drag image or text here",
        dropImage: "Drop image or Text",
        selectFromFiles: "Select from files",
        maximumFileSize: "Maximum file size",
        maximumFileSizeError: "Maximum file size exceeded.",
        url: "Image URL",
        remove: "Remove Image",
        original: "Original"
      },
      video: {
        video: "Video",
        videoLink: "Video Link",
        insert: "Insert Video",
        url: "Video URL",
        providers: "(YouTube, Google Drive, Vimeo, Vine, Instagram, DailyMotion, Youku, Peertube)"
      },
      link: {
        link: "Link",
        insert: "Insert Link",
        unlink: "Unlink",
        edit: "Edit",
        textToDisplay: "Text to display",
        url: "To what URL should this link go?",
        openInNewWindow: "Open in new window"
      },
      table: {
        table: "Table",
        addRowAbove: "Add row above",
        addRowBelow: "Add row below",
        addColLeft: "Add column left",
        addColRight: "Add column right",
        delRow: "Delete row",
        delCol: "Delete column",
        delTable: "Delete table"
      },
      hr: {
        insert: "Insert Horizontal Rule"
      },
      style: {
        style: "Style",
        p: "Normal",
        blockquote: "Quote",
        pre: "Code",
        h1: "Header 1",
        h2: "Header 2",
        h3: "Header 3",
        h4: "Header 4",
        h5: "Header 5",
        h6: "Header 6"
      },
      lists: {
        unordered: "Unordered list",
        ordered: "Ordered list"
      },
      options: {
        help: "Help",
        fullscreen: "Full Screen",
        codeview: "Code View"
      },
      paragraph: {
        paragraph: "Paragraph",
        outdent: "Outdent",
        indent: "Indent",
        left: "Align left",
        center: "Align center",
        right: "Align right",
        justify: "Justify full"
      },
      color: {
        recent: "Recent Color",
        more: "More Color",
        background: "Background Color",
        foreground: "Text Color",
        transparent: "Transparent",
        setTransparent: "Set transparent",
        reset: "Reset",
        resetToDefault: "Reset to default",
        cpSelect: "Select"
      },
      shortcut: {
        shortcuts: "Keyboard shortcuts",
        close: "Close",
        textFormatting: "Text formatting",
        action: "Action",
        paragraphFormatting: "Paragraph formatting",
        documentStyle: "Document Style",
        extraKeys: "Extra keys"
      },
      help: {
        "escape": "Escape",
        "insertParagraph": "Insert Paragraph",
        "undo": "Undo the last command",
        "redo": "Redo the last command",
        "tab": "Tab",
        "untab": "Untab",
        "bold": "Set a bold style",
        "italic": "Set a italic style",
        "underline": "Set a underline style",
        "strikethrough": "Set a strikethrough style",
        "removeFormat": "Clean a style",
        "justifyLeft": "Set left align",
        "justifyCenter": "Set center align",
        "justifyRight": "Set right align",
        "justifyFull": "Set full align",
        "insertUnorderedList": "Toggle unordered list",
        "insertOrderedList": "Toggle ordered list",
        "outdent": "Outdent on current paragraph",
        "indent": "Indent on current paragraph",
        "formatPara": "Change current block's format as a paragraph(P tag)",
        "formatH1": "Change current block's format as H1",
        "formatH2": "Change current block's format as H2",
        "formatH3": "Change current block's format as H3",
        "formatH4": "Change current block's format as H4",
        "formatH5": "Change current block's format as H5",
        "formatH6": "Change current block's format as H6",
        "insertHorizontalRule": "Insert horizontal rule",
        "linkDialog.show": "Show Link Dialog"
      },
      history: {
        undo: "Undo",
        redo: "Redo"
      },
      specialChar: {
        specialChar: "SPECIAL CHARACTERS",
        select: "Select Special characters"
      },
      output: {
        noSelection: "No Selection Made!"
      }
    }
  });
  const genericFontFamilies = ["sans-serif", "serif", "monospace", "cursive", "fantasy"];
  function validFontName(fontName) {
    return $.inArray(fontName.toLowerCase(), genericFontFamilies) === -1 ? `'${fontName}'` : fontName;
  }
  function createIsFontInstalledFunc() {
    const testText = "mw";
    const fontSize = "20px";
    const canvasWidth = 40;
    const canvasHeight = 20;
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d", { willReadFrequently: true });
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    context.textAlign = "center";
    context.fillStyle = "black";
    context.textBaseline = "middle";
    function getPxInfo(font, testFontName) {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.font = fontSize + " " + validFontName(font) + ', "' + testFontName + '"';
      context.fillText(testText, canvasWidth / 2, canvasHeight / 2);
      var pxInfo = context.getImageData(0, 0, canvasWidth, canvasHeight).data;
      return pxInfo.join("");
    }
    return (fontName) => {
      const testFontName = fontName === "Comic Sans MS" ? "Courier New" : "Comic Sans MS";
      let testInfo = getPxInfo(testFontName, testFontName);
      let fontInfo = getPxInfo(fontName, testFontName);
      return testInfo !== fontInfo;
    };
  }
  const userAgent = navigator.userAgent;
  const isMSIE = /MSIE|Trident/i.test(userAgent);
  let browserVersion;
  if (isMSIE) {
    let matches = /MSIE (\d+[.]\d+)/.exec(userAgent);
    if (matches) {
      browserVersion = parseFloat(matches[1]);
    }
    matches = /Trident\/.*rv:([0-9]{1,}[.0-9]{0,})/.exec(userAgent);
    if (matches) {
      browserVersion = parseFloat(matches[1]);
    }
  }
  const isEdge = /Edge\/\d+/.test(userAgent);
  const isSupportTouch = "ontouchstart" in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  const inputEventName = isMSIE ? "DOMCharacterDataModified DOMSubtreeModified DOMNodeInserted" : "input";
  const env = {
    isMac: navigator.appVersion.indexOf("Mac") > -1,
    isMSIE,
    isEdge,
    isFF: !isEdge && /firefox/i.test(userAgent),
    isPhantom: /PhantomJS/i.test(userAgent),
    isWebkit: !isEdge && /webkit/i.test(userAgent),
    isChrome: !isEdge && /chrome/i.test(userAgent),
    isSafari: !isEdge && /safari/i.test(userAgent) && !/chrome/i.test(userAgent),
    browserVersion,
    isSupportTouch,
    isFontInstalled: createIsFontInstalledFunc(),
    isW3CRangeSupport: !!document.createRange,
    inputEventName,
    genericFontFamilies,
    validFontName
  };
  function eq(itemA) {
    return function(itemB) {
      return itemA === itemB;
    };
  }
  function eq2(itemA, itemB) {
    return itemA === itemB;
  }
  function peq2(propName) {
    return function(itemA, itemB) {
      return itemA[propName] === itemB[propName];
    };
  }
  function ok() {
    return true;
  }
  function fail() {
    return false;
  }
  function not(f) {
    return function() {
      return !f.apply(f, arguments);
    };
  }
  function and(fA, fB) {
    return function(item) {
      return fA(item) && fB(item);
    };
  }
  function self(a) {
    return a;
  }
  function invoke(obj, method) {
    return function() {
      return obj[method].apply(obj, arguments);
    };
  }
  let idCounter = 0;
  function resetUniqueId() {
    idCounter = 0;
  }
  function uniqueId(prefix) {
    const id = ++idCounter + "";
    return prefix ? prefix + id : id;
  }
  function rect2bnd(rect) {
    const $document = $(document);
    return {
      top: rect.top + $document.scrollTop(),
      left: rect.left + $document.scrollLeft(),
      width: rect.right - rect.left,
      height: rect.bottom - rect.top
    };
  }
  function invertObject(obj) {
    const inverted = {};
    for (const key2 in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key2)) {
        inverted[obj[key2]] = key2;
      }
    }
    return inverted;
  }
  function namespaceToCamel(namespace, prefix) {
    prefix = prefix || "";
    return prefix + namespace.split(".").map(function(name) {
      return name.substring(0, 1).toUpperCase() + name.substring(1);
    }).join("");
  }
  function debounce(func2, wait, immediate) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      const later = () => {
        timeout = null;
        if (!immediate) {
          func2.apply(context, args);
        }
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) {
        func2.apply(context, args);
      }
    };
  }
  function isValidUrl(url) {
    const expression = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
    return expression.test(url);
  }
  const func = {
    eq,
    eq2,
    peq2,
    ok,
    fail,
    self,
    not,
    and,
    invoke,
    resetUniqueId,
    uniqueId,
    rect2bnd,
    invertObject,
    namespaceToCamel,
    debounce,
    isValidUrl
  };
  function head(array) {
    return array[0];
  }
  function last(array) {
    return array[array.length - 1];
  }
  function initial(array) {
    return array.slice(0, array.length - 1);
  }
  function tail(array) {
    return array.slice(1);
  }
  function find(array, pred) {
    for (let idx = 0, len = array.length; idx < len; idx++) {
      const item = array[idx];
      if (pred(item)) {
        return item;
      }
    }
  }
  function all(array, pred) {
    for (let idx = 0, len = array.length; idx < len; idx++) {
      if (!pred(array[idx])) {
        return false;
      }
    }
    return true;
  }
  function contains(array, item) {
    if (array && array.length && item) {
      if (array.indexOf) {
        return array.indexOf(item) !== -1;
      } else if (array.contains) {
        return array.contains(item);
      }
    }
    return false;
  }
  function sum(array, fn) {
    fn = fn || func.self;
    return array.reduce(function(memo, v) {
      return memo + fn(v);
    }, 0);
  }
  function from(collection) {
    const result = [];
    const length = collection.length;
    let idx = -1;
    while (++idx < length) {
      result[idx] = collection[idx];
    }
    return result;
  }
  function isEmpty$1(array) {
    return !array || !array.length;
  }
  function clusterBy(array, fn) {
    if (!array.length) {
      return [];
    }
    const aTail = tail(array);
    return aTail.reduce(function(memo, v) {
      const aLast = last(memo);
      if (fn(last(aLast), v)) {
        aLast[aLast.length] = v;
      } else {
        memo[memo.length] = [v];
      }
      return memo;
    }, [[head(array)]]);
  }
  function compact(array) {
    const aResult = [];
    for (let idx = 0, len = array.length; idx < len; idx++) {
      if (array[idx]) {
        aResult.push(array[idx]);
      }
    }
    return aResult;
  }
  function unique(array) {
    const results = [];
    for (let idx = 0, len = array.length; idx < len; idx++) {
      if (!contains(results, array[idx])) {
        results.push(array[idx]);
      }
    }
    return results;
  }
  function next(array, item) {
    if (array && array.length && item) {
      const idx = array.indexOf(item);
      return idx === -1 ? null : array[idx + 1];
    }
    return null;
  }
  function prev(array, item) {
    if (array && array.length && item) {
      const idx = array.indexOf(item);
      return idx === -1 ? null : array[idx - 1];
    }
    return null;
  }
  const lists = {
    head,
    last,
    initial,
    tail,
    prev,
    next,
    find,
    contains,
    all,
    sum,
    from,
    isEmpty: isEmpty$1,
    clusterBy,
    compact,
    unique
  };
  const NBSP_CHAR = String.fromCharCode(160);
  const ZERO_WIDTH_NBSP_CHAR = "\uFEFF";
  function isEditable(node) {
    return node && $(node).hasClass("note-editable");
  }
  function isControlSizing(node) {
    return node && $(node).hasClass("note-control-sizing");
  }
  function makePredByNodeName(nodeName) {
    nodeName = nodeName.toUpperCase();
    return function(node) {
      return node && node.nodeName.toUpperCase() === nodeName;
    };
  }
  function isText(node) {
    return node && node.nodeType === 3;
  }
  function isElement(node) {
    return node && node.nodeType === 1;
  }
  function isVoid(node) {
    return node && /^BR|^IMG|^HR|^IFRAME|^BUTTON|^INPUT|^AUDIO|^VIDEO|^EMBED/.test(node.nodeName.toUpperCase());
  }
  function isPara(node) {
    if (isEditable(node)) {
      return false;
    }
    return node && /^DIV|^P|^LI|^H[1-7]/.test(node.nodeName.toUpperCase());
  }
  function isHeading(node) {
    return node && /^H[1-7]/.test(node.nodeName.toUpperCase());
  }
  const isPre = makePredByNodeName("PRE");
  const isLi = makePredByNodeName("LI");
  function isPurePara(node) {
    return isPara(node) && !isLi(node);
  }
  const isTable = makePredByNodeName("TABLE");
  const isData = makePredByNodeName("DATA");
  function isInline(node) {
    return !isBodyContainer(node) && !isList(node) && !isHr(node) && !isPara(node) && !isTable(node) && !isBlockquote(node) && !isData(node);
  }
  function isList(node) {
    return node && /^UL|^OL/.test(node.nodeName.toUpperCase());
  }
  const isHr = makePredByNodeName("HR");
  function isCell(node) {
    return node && /^TD|^TH/.test(node.nodeName.toUpperCase());
  }
  const isBlockquote = makePredByNodeName("BLOCKQUOTE");
  function isBodyContainer(node) {
    return isCell(node) || isBlockquote(node) || isEditable(node);
  }
  const isAnchor = makePredByNodeName("A");
  function isParaInline(node) {
    return isInline(node) && !!ancestor(node, isPara);
  }
  function isBodyInline(node) {
    return isInline(node) && !ancestor(node, isPara);
  }
  const isBody = makePredByNodeName("BODY");
  function isClosestSibling(nodeA, nodeB) {
    return nodeA.nextSibling === nodeB || nodeA.previousSibling === nodeB;
  }
  function withClosestSiblings(node, pred) {
    pred = pred || func.ok;
    const siblings = [];
    if (node.previousSibling && pred(node.previousSibling)) {
      siblings.push(node.previousSibling);
    }
    siblings.push(node);
    if (node.nextSibling && pred(node.nextSibling)) {
      siblings.push(node.nextSibling);
    }
    return siblings;
  }
  const blankHTML = env.isMSIE && env.browserVersion < 11 ? "&nbsp;" : "<br>";
  function nodeLength(node) {
    if (isText(node)) {
      return node.nodeValue.length;
    }
    if (node) {
      return node.childNodes.length;
    }
    return 0;
  }
  function deepestChildIsEmpty(node) {
    do {
      if (node.firstElementChild === null || node.firstElementChild.innerHTML === "") break;
    } while (node = node.firstElementChild);
    return isEmpty(node);
  }
  function isEmpty(node) {
    const len = nodeLength(node);
    if (len === 0) {
      return true;
    } else if (!isText(node) && len === 1 && node.innerHTML === blankHTML) {
      return true;
    } else if (lists.all(node.childNodes, isText) && node.innerHTML === "") {
      return true;
    }
    return false;
  }
  function paddingBlankHTML(node) {
    if (!isVoid(node) && !nodeLength(node)) {
      node.innerHTML = blankHTML;
    }
  }
  function ancestor(node, pred) {
    while (node) {
      if (pred(node)) {
        return node;
      }
      if (isEditable(node)) {
        break;
      }
      node = node.parentNode;
    }
    return null;
  }
  function singleChildAncestor(node, pred) {
    node = node.parentNode;
    while (node) {
      if (nodeLength(node) !== 1) {
        break;
      }
      if (pred(node)) {
        return node;
      }
      if (isEditable(node)) {
        break;
      }
      node = node.parentNode;
    }
    return null;
  }
  function listAncestor(node, pred) {
    pred = pred || func.fail;
    const ancestors = [];
    ancestor(node, function(el) {
      if (!isEditable(el)) {
        ancestors.push(el);
      }
      return pred(el);
    });
    return ancestors;
  }
  function lastAncestor(node, pred) {
    const ancestors = listAncestor(node);
    return lists.last(ancestors.filter(pred));
  }
  function commonAncestor(nodeA, nodeB) {
    const ancestors = listAncestor(nodeA);
    for (let n = nodeB; n; n = n.parentNode) {
      if (ancestors.indexOf(n) > -1) return n;
    }
    return null;
  }
  function listPrev(node, pred) {
    pred = pred || func.fail;
    const nodes = [];
    while (node) {
      if (pred(node)) {
        break;
      }
      nodes.push(node);
      node = node.previousSibling;
    }
    return nodes;
  }
  function listNext(node, pred) {
    pred = pred || func.fail;
    const nodes = [];
    while (node) {
      if (pred(node)) {
        break;
      }
      nodes.push(node);
      node = node.nextSibling;
    }
    return nodes;
  }
  function listDescendant(node, pred) {
    const descendants = [];
    pred = pred || func.ok;
    (function fnWalk(current) {
      if (!current) {
        return;
      }
      if (node !== current && pred(current)) {
        descendants.push(current);
      }
      for (let idx = 0, len = current.childNodes.length; idx < len; idx++) {
        fnWalk(current.childNodes[idx]);
      }
    })(node);
    return descendants;
  }
  function wrap(node, wrapperName) {
    const parent = node.parentNode;
    const wrapper = $("<" + wrapperName + ">")[0];
    if (parent) {
      parent.insertBefore(wrapper, node);
    }
    wrapper.appendChild(node);
    return wrapper;
  }
  function insertAfter(node, preceding) {
    const next2 = preceding.nextSibling;
    let parent = preceding.parentNode;
    if (next2) {
      parent.insertBefore(node, next2);
    } else {
      parent.appendChild(node);
    }
    return node;
  }
  function appendChildNodes(node, aChild, isSkipPaddingBlankHTML) {
    $.each(aChild, function(idx, child) {
      if (!isSkipPaddingBlankHTML && isLi(node) && node.firstChild === null && isList(child)) {
        node.appendChild(create("br"));
      }
      node.appendChild(child);
    });
    return node;
  }
  function isLeftEdgePoint(point) {
    return point.offset === 0;
  }
  function isRightEdgePoint(point) {
    return point.offset === nodeLength(point.node);
  }
  function isEdgePoint(point) {
    return isLeftEdgePoint(point) || isRightEdgePoint(point);
  }
  function isLeftEdgeOf(node, ancestor2) {
    while (node && node !== ancestor2) {
      if (position(node) !== 0) {
        return false;
      }
      node = node.parentNode;
    }
    return true;
  }
  function isRightEdgeOf(node, ancestor2) {
    if (!ancestor2) {
      return false;
    }
    while (node && node !== ancestor2) {
      if (position(node) !== nodeLength(node.parentNode) - 1) {
        return false;
      }
      node = node.parentNode;
    }
    return true;
  }
  function isLeftEdgePointOf(point, ancestor2) {
    return isLeftEdgePoint(point) && isLeftEdgeOf(point.node, ancestor2);
  }
  function isRightEdgePointOf(point, ancestor2) {
    return isRightEdgePoint(point) && isRightEdgeOf(point.node, ancestor2);
  }
  function position(node) {
    let offset = 0;
    while (node = node.previousSibling) {
      offset += 1;
    }
    return offset;
  }
  function hasChildren(node) {
    return !!(node && node.childNodes && node.childNodes.length);
  }
  function prevPoint(point, isSkipInnerOffset) {
    let node;
    let offset;
    if (point.offset === 0) {
      if (isEditable(point.node)) {
        return null;
      }
      node = point.node.parentNode;
      offset = position(point.node);
    } else if (hasChildren(point.node)) {
      node = point.node.childNodes[point.offset - 1];
      offset = nodeLength(node);
    } else {
      node = point.node;
      offset = isSkipInnerOffset ? 0 : point.offset - 1;
    }
    return {
      node,
      offset
    };
  }
  function nextPoint(point, isSkipInnerOffset) {
    let node, offset;
    if (nodeLength(point.node) === point.offset) {
      if (isEditable(point.node)) {
        return null;
      }
      let nextTextNode = getNextTextNode(point.node);
      if (nextTextNode) {
        node = nextTextNode;
        offset = 0;
      } else {
        node = point.node.parentNode;
        offset = position(point.node) + 1;
      }
    } else if (hasChildren(point.node)) {
      node = point.node.childNodes[point.offset];
      offset = 0;
    } else {
      node = point.node;
      offset = isSkipInnerOffset ? nodeLength(point.node) : point.offset + 1;
    }
    return {
      node,
      offset
    };
  }
  function nextPointWithEmptyNode(point, isSkipInnerOffset) {
    let node, offset = 0;
    if (nodeLength(point.node) === point.offset) {
      if (isEditable(point.node)) {
        return null;
      }
      node = point.node.parentNode;
      offset = position(point.node) + 1;
      if (isEditable(node)) {
        node = point.node.nextSibling;
        offset = 0;
      }
    } else if (hasChildren(point.node)) {
      node = point.node.childNodes[point.offset];
      offset = 0;
    } else {
      node = point.node;
      offset = isSkipInnerOffset ? nodeLength(point.node) : point.offset + 1;
    }
    return {
      node,
      offset
    };
  }
  function getNextTextNode(actual) {
    if (!actual.nextSibling) return void 0;
    if (actual.parent !== actual.nextSibling.parent) return void 0;
    if (isText(actual.nextSibling)) return actual.nextSibling;
    else return getNextTextNode(actual.nextSibling);
  }
  function isSamePoint(pointA, pointB) {
    return pointA.node === pointB.node && pointA.offset === pointB.offset;
  }
  function isVisiblePoint(point) {
    if (isText(point.node) || !hasChildren(point.node) || isEmpty(point.node)) {
      return true;
    }
    const leftNode = point.node.childNodes[point.offset - 1];
    const rightNode = point.node.childNodes[point.offset];
    if ((!leftNode || isVoid(leftNode)) && (!rightNode || isVoid(rightNode)) || isTable(rightNode)) {
      return true;
    }
    return false;
  }
  function prevPointUntil(point, pred) {
    while (point) {
      if (pred(point)) {
        return point;
      }
      point = prevPoint(point);
    }
    return null;
  }
  function nextPointUntil(point, pred) {
    while (point) {
      if (pred(point)) {
        return point;
      }
      point = nextPoint(point);
    }
    return null;
  }
  function isCharPoint(point) {
    if (!isText(point.node)) {
      return false;
    }
    const ch = point.node.nodeValue.charAt(point.offset - 1);
    return ch && (ch !== " " && ch !== NBSP_CHAR);
  }
  function isSpacePoint(point) {
    if (!isText(point.node)) {
      return false;
    }
    const ch = point.node.nodeValue.charAt(point.offset - 1);
    return ch === " " || ch === NBSP_CHAR;
  }
  function walkPoint(startPoint, endPoint, handler, isSkipInnerOffset) {
    let point = startPoint;
    while (point && point.node) {
      handler(point);
      if (isSamePoint(point, endPoint)) {
        break;
      }
      const isSkipOffset = isSkipInnerOffset && startPoint.node !== point.node && endPoint.node !== point.node;
      point = nextPointWithEmptyNode(point, isSkipOffset);
    }
  }
  function makeOffsetPath(ancestor2, node) {
    const ancestors = listAncestor(node, func.eq(ancestor2));
    return ancestors.map(position).reverse();
  }
  function fromOffsetPath(ancestor2, offsets) {
    let current = ancestor2;
    for (let i = 0, len = offsets.length; i < len; i++) {
      if (current.childNodes.length <= offsets[i]) {
        if (current.childNodes[current.childNodes.length - 1]) {
          current = current.childNodes[current.childNodes.length - 1];
        }
      } else {
        if (current.childNodes[offsets[i]]) {
          current = current.childNodes[offsets[i]];
        }
      }
    }
    return current;
  }
  function splitNode(point, options) {
    let isSkipPaddingBlankHTML = options && options.isSkipPaddingBlankHTML;
    const isNotSplitEdgePoint = options && options.isNotSplitEdgePoint;
    const isDiscardEmptySplits = options && options.isDiscardEmptySplits;
    if (isDiscardEmptySplits) {
      isSkipPaddingBlankHTML = true;
    }
    if (isEdgePoint(point) && (isText(point.node) || isNotSplitEdgePoint)) {
      if (isLeftEdgePoint(point)) {
        return point.node;
      } else if (isRightEdgePoint(point)) {
        return point.node.nextSibling;
      }
    }
    if (isText(point.node)) {
      return point.node.splitText(point.offset);
    } else {
      const childNode = point.node.childNodes[point.offset];
      let childNodes = listNext(childNode);
      const clone = insertAfter(point.node.cloneNode(false), point.node);
      appendChildNodes(clone, childNodes);
      if (!isSkipPaddingBlankHTML) {
        paddingBlankHTML(point.node);
        paddingBlankHTML(clone);
      }
      if (isDiscardEmptySplits) {
        if (isEmpty(point.node)) {
          remove(point.node);
        }
        if (isEmpty(clone)) {
          remove(clone);
          return point.node.nextSibling;
        }
      }
      return clone;
    }
  }
  function splitTree(root, point, options) {
    let ancestors = listAncestor(point.node, func.eq(root));
    let newPoint;
    if (!ancestors.length) {
      return null;
    } else if (ancestors.length === 1) {
      return splitNode(point, options);
    }
    if (ancestors.length > 2) {
      let domList = ancestors.slice(0, ancestors.length - 1);
      let ifHasNextSibling = domList.find((item) => item.nextSibling);
      if (ifHasNextSibling && point.offset != 0 && isRightEdgePoint(point)) {
        let nestSibling = ifHasNextSibling.nextSibling;
        let textNode;
        if (nestSibling.nodeType == 1) {
          textNode = nestSibling.childNodes[0];
          ancestors = listAncestor(textNode, func.eq(root));
          newPoint = {
            node: textNode,
            offset: 0
          };
        } else if (nestSibling.nodeType == 3 && !nestSibling.data.match(/[\n\r]/g)) {
          textNode = nestSibling;
          ancestors = listAncestor(textNode, func.eq(root));
          newPoint = {
            node: textNode,
            offset: 0
          };
        }
      }
    }
    if (!ancestors.length) {
      return splitNode(point, options);
    } else {
      newPoint = point;
    }
    return ancestors.reduce(function(node, parent) {
      if (node === newPoint.node) {
        node = splitNode(newPoint, options);
      }
      return splitNode({
        node: parent,
        offset: node ? position(node) : nodeLength(parent)
      }, options);
    });
  }
  function splitPoint(point, isInline2) {
    const pred = isInline2 ? isPara : isBodyContainer;
    const ancestors = listAncestor(point.node, pred);
    const topAncestor = lists.last(ancestors) || point.node;
    let splitRoot, container;
    if (pred(topAncestor)) {
      splitRoot = ancestors[ancestors.length - 2];
      container = topAncestor;
    } else {
      splitRoot = topAncestor;
      container = splitRoot.parentNode;
    }
    let pivot = splitRoot && splitTree(splitRoot, point, {
      isSkipPaddingBlankHTML: isInline2,
      isNotSplitEdgePoint: isInline2
    });
    if (!pivot && container === point.node) {
      pivot = point.node.childNodes[point.offset];
    }
    return {
      rightNode: pivot,
      container
    };
  }
  function create(nodeName) {
    return document.createElement(nodeName);
  }
  function createText(text) {
    return document.createTextNode(text);
  }
  function remove(node, isRemoveChild) {
    if (!node || !node.parentNode) {
      return;
    }
    if (node.removeNode) {
      return node.removeNode(isRemoveChild);
    }
    const parent = node.parentNode;
    if (!isRemoveChild) {
      const nodes = [];
      for (let i = 0, len = node.childNodes.length; i < len; i++) {
        nodes.push(node.childNodes[i]);
      }
      for (let i = 0, len = nodes.length; i < len; i++) {
        parent.insertBefore(nodes[i], node);
      }
    }
    parent.removeChild(node);
  }
  function removeWhile(node, pred) {
    while (node) {
      if (isEditable(node) || !pred(node)) {
        break;
      }
      const parent = node.parentNode;
      remove(node);
      node = parent;
    }
  }
  function replace(node, nodeName) {
    if (node.nodeName.toUpperCase() === nodeName.toUpperCase()) {
      return node;
    }
    const newNode = create(nodeName);
    if (node.style.cssText) {
      newNode.style.cssText = node.style.cssText;
    }
    appendChildNodes(newNode, lists.from(node.childNodes));
    insertAfter(newNode, node);
    remove(node);
    return newNode;
  }
  const isTextarea = makePredByNodeName("TEXTAREA");
  function value($node, stripLinebreaks) {
    const val = isTextarea($node[0]) ? $node.val() : $node.html();
    if (stripLinebreaks) {
      return val.replace(/[\n\r]/g, "");
    }
    return val;
  }
  function html($node, isNewlineOnBlock) {
    let markup = value($node);
    if (isNewlineOnBlock) {
      const regexTag = /<(\/?)(\b(?!!)[^>\s]*)(.*?)(\s*\/?>)/g;
      markup = markup.replace(regexTag, function(match, endSlash, name) {
        name = name.toUpperCase();
        const isEndOfInlineContainer = /^DIV|^TD|^TH|^P|^LI|^H[1-7]/.test(name) && !!endSlash;
        const isBlockNode = /^BLOCKQUOTE|^TABLE|^TBODY|^TR|^HR|^UL|^OL/.test(name);
        return match + (isEndOfInlineContainer || isBlockNode ? "\n" : "");
      });
      markup = markup.trim();
    }
    return markup;
  }
  function posFromPlaceholder(placeholder) {
    const $placeholder = $(placeholder);
    const pos = $placeholder.offset();
    const height = $placeholder.outerHeight(true);
    if (!pos) {
      return {
        left: 0,
        top: 0
      };
    } else {
      return {
        left: pos.left,
        top: pos.top + height
      };
    }
  }
  function attachEvents($node, events) {
    Object.keys(events).forEach(function(key2) {
      $node.on(key2, events[key2]);
    });
  }
  function detachEvents($node, events) {
    Object.keys(events).forEach(function(key2) {
      $node.off(key2, events[key2]);
    });
  }
  function isCustomStyleTag(node) {
    return node && !isText(node) && lists.contains(node.classList, "note-styletag");
  }
  const dom = {
    /** @property {String} NBSP_CHAR */
    NBSP_CHAR,
    /** @property {String} ZERO_WIDTH_NBSP_CHAR */
    ZERO_WIDTH_NBSP_CHAR,
    /** @property {String} blank */
    blank: blankHTML,
    /** @property {String} emptyPara */
    emptyPara: `<p>${blankHTML}</p>`,
    makePredByNodeName,
    isEditable,
    isControlSizing,
    isText,
    isElement,
    isVoid,
    isPara,
    isPurePara,
    isHeading,
    isInline,
    isBlock: func.not(isInline),
    isBodyInline,
    isBody,
    isParaInline,
    isPre,
    isList,
    isTable,
    isData,
    isCell,
    isBlockquote,
    isBodyContainer,
    isAnchor,
    isDiv: makePredByNodeName("DIV"),
    isLi,
    isBR: makePredByNodeName("BR"),
    isSpan: makePredByNodeName("SPAN"),
    isB: makePredByNodeName("B"),
    isU: makePredByNodeName("U"),
    isS: makePredByNodeName("S"),
    isI: makePredByNodeName("I"),
    isImg: makePredByNodeName("IMG"),
    isTextarea,
    deepestChildIsEmpty,
    isEmpty,
    isEmptyAnchor: func.and(isAnchor, isEmpty),
    isClosestSibling,
    withClosestSiblings,
    nodeLength,
    isLeftEdgePoint,
    isRightEdgePoint,
    isEdgePoint,
    isLeftEdgeOf,
    isRightEdgeOf,
    isLeftEdgePointOf,
    isRightEdgePointOf,
    prevPoint,
    nextPoint,
    nextPointWithEmptyNode,
    isSamePoint,
    isVisiblePoint,
    prevPointUntil,
    nextPointUntil,
    isCharPoint,
    isSpacePoint,
    walkPoint,
    ancestor,
    singleChildAncestor,
    listAncestor,
    lastAncestor,
    listNext,
    listPrev,
    listDescendant,
    commonAncestor,
    wrap,
    insertAfter,
    appendChildNodes,
    position,
    hasChildren,
    makeOffsetPath,
    fromOffsetPath,
    splitTree,
    splitPoint,
    create,
    createText,
    remove,
    removeWhile,
    replace,
    html,
    value,
    posFromPlaceholder,
    attachEvents,
    detachEvents,
    isCustomStyleTag
  };
  class Context {
    /**
     * @param {jQuery} $note
     * @param {Object} options
     */
    constructor($note, options) {
      this.$note = $note;
      this.memos = {};
      this.modules = {};
      this.layoutInfo = {};
      this.options = $.extend(true, {}, options);
      $.summernote.ui = $.summernote.ui_template(this.options);
      this.ui = $.summernote.ui;
      this.initialize();
    }
    /**
     * create layout and initialize modules and other resources
     */
    initialize() {
      this.layoutInfo = this.ui.createLayout(this.$note);
      this._initialize();
      this.$note.hide();
      return this;
    }
    /**
     * destroy modules and other resources and remove layout
     */
    destroy() {
      this._destroy();
      this.$note.removeData("summernote");
      this.ui.removeLayout(this.$note, this.layoutInfo);
    }
    /**
     * destory modules and other resources and initialize it again
     */
    reset() {
      const disabled = this.isDisabled();
      this.code(dom.emptyPara);
      this._destroy();
      this._initialize();
      if (disabled) {
        this.disable();
      }
    }
    _initialize() {
      this.options.id = func.uniqueId($.now());
      this.options.container = this.options.container || this.layoutInfo.editor;
      const buttons = $.extend({}, this.options.buttons);
      Object.keys(buttons).forEach((key2) => {
        this.memo("button." + key2, buttons[key2]);
      });
      const modules = $.extend({}, this.options.modules, $.summernote.plugins || {});
      Object.keys(modules).forEach((key2) => {
        this.module(key2, modules[key2], true);
      });
      Object.keys(this.modules).forEach((key2) => {
        this.initializeModule(key2);
      });
    }
    _destroy() {
      Object.keys(this.modules).reverse().forEach((key2) => {
        this.removeModule(key2);
      });
      Object.keys(this.memos).forEach((key2) => {
        this.removeMemo(key2);
      });
      this.triggerEvent("destroy", this);
    }
    code(html2) {
      const isActivated = this.invoke("codeview.isActivated");
      if (html2 === void 0) {
        this.invoke("codeview.sync");
        return isActivated ? this.layoutInfo.codable.val() : this.layoutInfo.editable.html();
      } else {
        if (isActivated) {
          this.invoke("codeview.sync", html2);
        } else {
          this.layoutInfo.editable.html(html2);
        }
        this.$note.val(html2);
        this.triggerEvent("change", html2, this.layoutInfo.editable);
      }
    }
    isDisabled() {
      return this.layoutInfo.editable.attr("contenteditable") === "false";
    }
    enable() {
      this.layoutInfo.editable.attr("contenteditable", true);
      this.invoke("toolbar.activate", true);
      this.triggerEvent("disable", false);
      this.options.editing = true;
    }
    disable() {
      if (this.invoke("codeview.isActivated")) {
        this.invoke("codeview.deactivate");
      }
      this.layoutInfo.editable.attr("contenteditable", false);
      this.options.editing = false;
      this.invoke("toolbar.deactivate", true);
      this.triggerEvent("disable", true);
    }
    triggerEvent() {
      const namespace = lists.head(arguments);
      const args = lists.tail(lists.from(arguments));
      const callback = this.options.callbacks[func.namespaceToCamel(namespace, "on")];
      if (callback) {
        callback.apply(this.$note[0], args);
      }
      this.$note.trigger("summernote." + namespace, args);
    }
    initializeModule(key2) {
      const module = this.modules[key2];
      module.shouldInitialize = module.shouldInitialize || func.ok;
      if (!module.shouldInitialize()) {
        return;
      }
      if (module.initialize) {
        module.initialize();
      }
      if (module.events) {
        dom.attachEvents(this.$note, module.events);
      }
    }
    module(key2, ModuleClass, withoutIntialize) {
      if (arguments.length === 1) {
        return this.modules[key2];
      }
      this.modules[key2] = new ModuleClass(this);
      if (!withoutIntialize) {
        this.initializeModule(key2);
      }
    }
    removeModule(key2) {
      const module = this.modules[key2];
      if (module.shouldInitialize()) {
        if (module.events) {
          dom.detachEvents(this.$note, module.events);
        }
        if (module.destroy) {
          module.destroy();
        }
      }
      delete this.modules[key2];
    }
    memo(key2, obj) {
      if (arguments.length === 1) {
        return this.memos[key2];
      }
      this.memos[key2] = obj;
    }
    removeMemo(key2) {
      if (this.memos[key2] && this.memos[key2].destroy) {
        this.memos[key2].destroy();
      }
      delete this.memos[key2];
    }
    /**
     * Some buttons need to change their visual style immediately once they get pressed
     */
    createInvokeHandlerAndUpdateState(namespace, value2) {
      return (event2) => {
        this.createInvokeHandler(namespace, value2)(event2);
        this.invoke("buttons.updateCurrentStyle");
      };
    }
    createInvokeHandler(namespace, value2) {
      return (event2) => {
        event2.preventDefault();
        const $target = $(event2.target);
        this.invoke(namespace, value2 || $target.closest("[data-value]").data("value"), $target);
      };
    }
    invoke() {
      const namespace = lists.head(arguments);
      const args = lists.tail(lists.from(arguments));
      const splits = namespace.split(".");
      const hasSeparator = splits.length > 1;
      const moduleName = hasSeparator && lists.head(splits);
      const methodName = hasSeparator ? lists.last(splits) : lists.head(splits);
      const module = this.modules[moduleName || "editor"];
      if (!moduleName && this[methodName]) {
        return this[methodName].apply(this, args);
      } else if (module && module[methodName] && module.shouldInitialize()) {
        return module[methodName].apply(module, args);
      }
    }
  }
  $.fn.extend({
    /**
     * Summernote API
     *
     * @param {Object|String}
     * @return {this}
     */
    summernote: function() {
      const type = typeof lists.head(arguments);
      const isExternalAPICalled = type === "string";
      const hasInitOptions = type === "object";
      const options = $.extend({}, $.summernote.options, hasInitOptions ? lists.head(arguments) : {});
      options.langInfo = $.extend(true, {}, $.summernote.lang["en-US"], $.summernote.lang[options.lang]);
      options.icons = $.extend(true, {}, $.summernote.options.icons, options.icons);
      options.tooltip = options.tooltip === "auto" ? !env.isSupportTouch : options.tooltip;
      this.each((idx, note) => {
        const $note2 = $(note);
        if (!$note2.data("summernote")) {
          const context = new Context($note2, options);
          $note2.data("summernote", context);
          $note2.data("summernote").triggerEvent("init", context.layoutInfo);
        }
      });
      const $note = this.first();
      if ($note.length) {
        const context = $note.data("summernote");
        if (isExternalAPICalled) {
          return context.invoke.apply(context, lists.from(arguments));
        } else if (options.focus) {
          context.invoke("editor.focus");
        }
      }
      return this;
    }
  });
  function textRangeToPoint(textRange, isStart) {
    let container = textRange.parentElement();
    let offset;
    const tester = document.body.createTextRange();
    let prevContainer;
    const childNodes = lists.from(container.childNodes);
    for (offset = 0; offset < childNodes.length; offset++) {
      if (dom.isText(childNodes[offset])) {
        continue;
      }
      tester.moveToElementText(childNodes[offset]);
      if (tester.compareEndPoints("StartToStart", textRange) >= 0) {
        break;
      }
      prevContainer = childNodes[offset];
    }
    if (offset !== 0 && dom.isText(childNodes[offset - 1])) {
      const textRangeStart = document.body.createTextRange();
      let curTextNode = null;
      textRangeStart.moveToElementText(prevContainer || container);
      textRangeStart.collapse(!prevContainer);
      curTextNode = prevContainer ? prevContainer.nextSibling : container.firstChild;
      const pointTester = textRange.duplicate();
      pointTester.setEndPoint("StartToStart", textRangeStart);
      let textCount = pointTester.text.replace(/[\r\n]/g, "").length;
      while (textCount > curTextNode.nodeValue.length && curTextNode.nextSibling) {
        textCount -= curTextNode.nodeValue.length;
        curTextNode = curTextNode.nextSibling;
      }
      curTextNode.nodeValue;
      if (isStart && curTextNode.nextSibling && dom.isText(curTextNode.nextSibling) && textCount === curTextNode.nodeValue.length) {
        textCount -= curTextNode.nodeValue.length;
        curTextNode = curTextNode.nextSibling;
      }
      container = curTextNode;
      offset = textCount;
    }
    return {
      cont: container,
      offset
    };
  }
  function pointToTextRange(point) {
    const textRangeInfo = function(container, offset) {
      let node, isCollapseToStart;
      if (dom.isText(container)) {
        const prevTextNodes = dom.listPrev(container, func.not(dom.isText));
        const prevContainer = lists.last(prevTextNodes).previousSibling;
        node = prevContainer || container.parentNode;
        offset += lists.sum(lists.tail(prevTextNodes), dom.nodeLength);
        isCollapseToStart = !prevContainer;
      } else {
        node = container.childNodes[offset] || container;
        if (dom.isText(node)) {
          return textRangeInfo(node, 0);
        }
        offset = 0;
        isCollapseToStart = false;
      }
      return {
        node,
        collapseToStart: isCollapseToStart,
        offset
      };
    };
    const textRange = document.body.createTextRange();
    const info = textRangeInfo(point.node, point.offset);
    textRange.moveToElementText(info.node);
    textRange.collapse(info.collapseToStart);
    textRange.moveStart("character", info.offset);
    return textRange;
  }
  class WrappedRange {
    constructor(sc, so, ec, eo) {
      this.sc = sc;
      this.so = so;
      this.ec = ec;
      this.eo = eo;
      this.isOnEditable = this.makeIsOn(dom.isEditable);
      this.isOnList = this.makeIsOn(dom.isList);
      this.isOnAnchor = this.makeIsOn(dom.isAnchor);
      this.isOnCell = this.makeIsOn(dom.isCell);
      this.isOnData = this.makeIsOn(dom.isData);
    }
    // nativeRange: get nativeRange from sc, so, ec, eo
    nativeRange() {
      if (env.isW3CRangeSupport) {
        const w3cRange = document.createRange();
        if (this.sc && this.so > -1 && this.ec && this.eo > -1) {
          try {
            w3cRange.setStart(this.sc, this.so);
            w3cRange.setEnd(this.ec, this.eo);
          } catch (error) {
            // Do nothing
          }
        }
        return w3cRange;
      } else {
        const textRange = pointToTextRange({
          node: this.sc,
          offset: this.so
        });
        textRange.setEndPoint("EndToEnd", pointToTextRange({
          node: this.ec,
          offset: this.eo
        }));
        return textRange;
      }
    }
    getPoints() {
      return {
        sc: this.sc,
        so: this.so,
        ec: this.ec,
        eo: this.eo
      };
    }
    getStartPoint() {
      return {
        node: this.sc,
        offset: this.so
      };
    }
    getEndPoint() {
      return {
        node: this.ec,
        offset: this.eo
      };
    }
    /**
     * select update visible range
     */
    select() {
      const nativeRng = this.nativeRange();
      if (env.isW3CRangeSupport) {
        const selection = document.getSelection();
        if (selection.rangeCount > 0) {
          selection.removeAllRanges();
        }
        selection.addRange(nativeRng);
      } else {
        nativeRng.select();
      }
      return this;
    }
    /**
     * Moves the scrollbar to start container(sc) of current range
     *
     * @return {WrappedRange}
     */
    scrollIntoView(container) {
      const height = $(container).height();
      if (this.sc && container.scrollTop + height < this.sc.offsetTop) {
        container.scrollTop += Math.abs(container.scrollTop + height - this.sc.offsetTop);
      }
      return this;
    }
    /**
     * @return {WrappedRange}
     */
    normalize() {
      const getVisiblePoint = function(point, isLeftToRight) {
        if (!point) {
          return point;
        }
        if (dom.isVisiblePoint(point)) {
          if (!dom.isEdgePoint(point) || dom.isRightEdgePoint(point) && !isLeftToRight || dom.isLeftEdgePoint(point) && isLeftToRight || dom.isRightEdgePoint(point) && isLeftToRight && dom.isVoid(point.node.nextSibling) || dom.isLeftEdgePoint(point) && !isLeftToRight && dom.isVoid(point.node.previousSibling) || dom.isBlock(point.node) && dom.isEmpty(point.node)) {
            return point;
          }
        }
        const block = dom.ancestor(point.node, dom.isBlock);
        let hasRightNode = false;
        if (!hasRightNode) {
          const prevPoint2 = dom.prevPoint(point) || { node: null };
          hasRightNode = (dom.isLeftEdgePointOf(point, block) || dom.isVoid(prevPoint2.node)) && !isLeftToRight;
        }
        let hasLeftNode = false;
        if (!hasLeftNode) {
          const nextPoint3 = dom.nextPoint(point) || { node: null };
          hasLeftNode = (dom.isRightEdgePointOf(point, block) || dom.isVoid(nextPoint3.node)) && isLeftToRight;
        }
        if (hasRightNode || hasLeftNode) {
          if (dom.isVisiblePoint(point)) {
            return point;
          }
          isLeftToRight = !isLeftToRight;
        }
        const nextPoint2 = isLeftToRight ? dom.nextPointUntil(dom.nextPoint(point), dom.isVisiblePoint) : dom.prevPointUntil(dom.prevPoint(point), dom.isVisiblePoint);
        return nextPoint2 || point;
      };
      const endPoint = getVisiblePoint(this.getEndPoint(), false);
      const startPoint = this.isCollapsed() ? endPoint : getVisiblePoint(this.getStartPoint(), true);
      return new WrappedRange(
          startPoint.node,
          startPoint.offset,
          endPoint.node,
          endPoint.offset
      );
    }
    /**
     * returns matched nodes on range
     *
     * @param {Function} [pred] - predicate function
     * @param {Object} [options]
     * @param {Boolean} [options.includeAncestor]
     * @param {Boolean} [options.fullyContains]
     * @return {Node[]}
     */
    nodes(pred, options) {
      pred = pred || func.ok;
      const includeAncestor = options && options.includeAncestor;
      const fullyContains = options && options.fullyContains;
      const startPoint = this.getStartPoint();
      const endPoint = this.getEndPoint();
      const nodes = [];
      const leftEdgeNodes = [];
      dom.walkPoint(startPoint, endPoint, function(point) {
        if (dom.isEditable(point.node)) {
          return;
        }
        let node;
        if (fullyContains) {
          if (dom.isLeftEdgePoint(point)) {
            leftEdgeNodes.push(point.node);
          }
          if (dom.isRightEdgePoint(point) && lists.contains(leftEdgeNodes, point.node)) {
            node = point.node;
          }
        } else if (includeAncestor) {
          node = dom.ancestor(point.node, pred);
        } else {
          node = point.node;
        }
        if (node && pred(node)) {
          nodes.push(node);
        }
      }, true);
      return lists.unique(nodes);
    }
    /**
     * returns commonAncestor of range
     * @return {Element} - commonAncestor
     */
    commonAncestor() {
      return dom.commonAncestor(this.sc, this.ec);
    }
    /**
     * returns expanded range by pred
     *
     * @param {Function} pred - predicate function
     * @return {WrappedRange}
     */
    expand(pred) {
      const startAncestor = dom.ancestor(this.sc, pred);
      const endAncestor = dom.ancestor(this.ec, pred);
      if (!startAncestor && !endAncestor) {
        return new WrappedRange(this.sc, this.so, this.ec, this.eo);
      }
      const boundaryPoints = this.getPoints();
      if (startAncestor) {
        boundaryPoints.sc = startAncestor;
        boundaryPoints.so = 0;
      }
      if (endAncestor) {
        boundaryPoints.ec = endAncestor;
        boundaryPoints.eo = dom.nodeLength(endAncestor);
      }
      return new WrappedRange(
          boundaryPoints.sc,
          boundaryPoints.so,
          boundaryPoints.ec,
          boundaryPoints.eo
      );
    }
    /**
     * @param {Boolean} isCollapseToStart
     * @return {WrappedRange}
     */
    collapse(isCollapseToStart) {
      if (isCollapseToStart) {
        return new WrappedRange(this.sc, this.so, this.sc, this.so);
      } else {
        return new WrappedRange(this.ec, this.eo, this.ec, this.eo);
      }
    }
    /**
     * splitText on range
     */
    splitText() {
      const isSameContainer = this.sc === this.ec;
      const boundaryPoints = this.getPoints();
      if (dom.isText(this.ec) && !dom.isEdgePoint(this.getEndPoint())) {
        this.ec.splitText(this.eo);
      }
      if (dom.isText(this.sc) && !dom.isEdgePoint(this.getStartPoint())) {
        boundaryPoints.sc = this.sc.splitText(this.so);
        boundaryPoints.so = 0;
        if (isSameContainer) {
          boundaryPoints.ec = boundaryPoints.sc;
          boundaryPoints.eo = this.eo - this.so;
        }
      }
      return new WrappedRange(
          boundaryPoints.sc,
          boundaryPoints.so,
          boundaryPoints.ec,
          boundaryPoints.eo
      );
    }
    /**
     * delete contents on range
     * @return {WrappedRange}
     */
    deleteContents() {
      if (this.isCollapsed()) {
        return this;
      }
      const rng = this.splitText();
      const nodes = rng.nodes(null, {
        fullyContains: true
      });
      const point = dom.prevPointUntil(rng.getStartPoint(), function(point2) {
        return !lists.contains(nodes, point2.node);
      });
      const emptyParents = [];
      $.each(nodes, function(idx, node) {
        const parent = node.parentNode;
        if (point.node !== parent && dom.nodeLength(parent) === 1) {
          emptyParents.push(parent);
        }
        dom.remove(node, false);
      });
      $.each(emptyParents, function(idx, node) {
        dom.remove(node, false);
      });
      return new WrappedRange(
          point.node,
          point.offset,
          point.node,
          point.offset
      ).normalize();
    }
    /**
     * makeIsOn: return isOn(pred) function
     */
    makeIsOn(pred) {
      return function() {
        const ancestor2 = dom.ancestor(this.sc, pred);
        return !!ancestor2 && ancestor2 === dom.ancestor(this.ec, pred);
      };
    }
    /**
     * @param {Function} pred
     * @return {Boolean}
     */
    isLeftEdgeOf(pred) {
      if (!dom.isLeftEdgePoint(this.getStartPoint())) {
        return false;
      }
      const node = dom.ancestor(this.sc, pred);
      return node && dom.isLeftEdgeOf(this.sc, node);
    }
    /**
     * returns whether range was collapsed or not
     */
    isCollapsed() {
      return this.sc === this.ec && this.so === this.eo;
    }
    /**
     * wrap inline nodes which children of body with paragraph
     *
     * @return {WrappedRange}
     */
    wrapBodyInlineWithPara() {
      if (dom.isBodyContainer(this.sc) && dom.isEmpty(this.sc)) {
        this.sc.innerHTML = dom.emptyPara;
        return new WrappedRange(this.sc.firstChild, 0, this.sc.firstChild, 0);
      }
      const rng = this.normalize();
      if (dom.isParaInline(this.sc) || dom.isPara(this.sc)) {
        return rng;
      }
      let topAncestor;
      if (dom.isInline(rng.sc)) {
        const ancestors = dom.listAncestor(rng.sc, func.not(dom.isInline));
        topAncestor = lists.last(ancestors);
        if (!dom.isInline(topAncestor)) {
          topAncestor = ancestors[ancestors.length - 2] || rng.sc.childNodes[rng.so];
        }
      } else {
        topAncestor = rng.sc.childNodes[rng.so > 0 ? rng.so - 1 : 0];
      }
      if (topAncestor) {
        let inlineSiblings = dom.listPrev(topAncestor, dom.isParaInline).reverse();
        inlineSiblings = inlineSiblings.concat(dom.listNext(topAncestor.nextSibling, dom.isParaInline));
        if (inlineSiblings.length) {
          const para = dom.wrap(lists.head(inlineSiblings), "p");
          dom.appendChildNodes(para, lists.tail(inlineSiblings));
        }
      }
      return this.normalize();
    }
    /**
     * insert node at current cursor
     *
     * @param {Node} node
     * @param {Boolean} doNotInsertPara - default is false, removes added <p> that's added if true
     * @return {Node}
     */
    insertNode(node, doNotInsertPara = false) {
      let rng = this;
      if (dom.isText(node) || dom.isInline(node)) {
        rng = this.wrapBodyInlineWithPara().deleteContents();
      }
      const info = dom.splitPoint(rng.getStartPoint(), dom.isInline(node));
      if (info.rightNode) {
        info.rightNode.parentNode.insertBefore(node, info.rightNode);
        if (dom.isEmpty(info.rightNode) && (doNotInsertPara || dom.isPara(node))) {
          info.rightNode.parentNode.removeChild(info.rightNode);
        }
      } else {
        info.container.appendChild(node);
      }
      return node;
    }
    /**
     * insert html at current cursor
     */
    pasteHTML(markup) {
      markup = ((markup || "") + "").trim(markup);
      const contentsContainer = $("<div></div>").html(markup)[0];
      let childNodes = lists.from(contentsContainer.childNodes);
      const rng = this;
      let reversed = false;
      if (rng.so >= 0) {
        childNodes = childNodes.reverse();
        reversed = true;
      }
      childNodes = childNodes.map(function(childNode) {
        return rng.insertNode(childNode, !dom.isInline(childNode));
      });
      if (reversed) {
        childNodes = childNodes.reverse();
      }
      return childNodes;
    }
    /**
     * returns text in range
     *
     * @return {String}
     */
    toString() {
      const nativeRng = this.nativeRange();
      return env.isW3CRangeSupport ? nativeRng.toString() : nativeRng.text;
    }
    /**
     * returns range for word before cursor
     *
     * @param {Boolean} [findAfter] - find after cursor, default: false
     * @return {WrappedRange}
     */
    getWordRange(findAfter) {
      let endPoint = this.getEndPoint();
      if (!dom.isCharPoint(endPoint)) {
        return this;
      }
      const startPoint = dom.prevPointUntil(endPoint, function(point) {
        return !dom.isCharPoint(point);
      });
      if (findAfter) {
        endPoint = dom.nextPointUntil(endPoint, function(point) {
          return !dom.isCharPoint(point);
        });
      }
      return new WrappedRange(
          startPoint.node,
          startPoint.offset,
          endPoint.node,
          endPoint.offset
      );
    }
    /**
     * returns range for words before cursor
     *
     * @param {Boolean} [findAfter] - find after cursor, default: false
     * @return {WrappedRange}
     */
    getWordsRange(findAfter) {
      var endPoint = this.getEndPoint();
      var isNotTextPoint = function(point) {
        return !dom.isCharPoint(point) && !dom.isSpacePoint(point);
      };
      if (isNotTextPoint(endPoint)) {
        return this;
      }
      var startPoint = dom.prevPointUntil(endPoint, isNotTextPoint);
      if (findAfter) {
        endPoint = dom.nextPointUntil(endPoint, isNotTextPoint);
      }
      return new WrappedRange(
          startPoint.node,
          startPoint.offset,
          endPoint.node,
          endPoint.offset
      );
    }
    /**
     * returns range for words before cursor that match with a Regex
     *
     * example:
     *  range: 'hi @Peter Pan'
     *  regex: '/@[a-z ]+/i'
     *  return range: '@Peter Pan'
     *
     * @param {RegExp} [regex]
     * @return {WrappedRange|null}
     */
    getWordsMatchRange(regex) {
      var endPoint = this.getEndPoint();
      var startPoint = dom.prevPointUntil(endPoint, function(point) {
        if (!dom.isCharPoint(point) && !dom.isSpacePoint(point)) {
          return true;
        }
        var rng2 = new WrappedRange(
            point.node,
            point.offset,
            endPoint.node,
            endPoint.offset
        );
        var result2 = regex.exec(rng2.toString());
        return result2 && result2.index === 0;
      });
      var rng = new WrappedRange(
          startPoint.node,
          startPoint.offset,
          endPoint.node,
          endPoint.offset
      );
      var text = rng.toString();
      var result = regex.exec(text);
      if (result && result[0].length === text.length) {
        return rng;
      } else {
        return null;
      }
    }
    /**
     * create offsetPath bookmark
     *
     * @param {Node} editable
     */
    bookmark(editable2) {
      return {
        s: {
          path: dom.makeOffsetPath(editable2, this.sc),
          offset: this.so
        },
        e: {
          path: dom.makeOffsetPath(editable2, this.ec),
          offset: this.eo
        }
      };
    }
    /**
     * create offsetPath bookmark base on paragraph
     *
     * @param {Node[]} paras
     */
    paraBookmark(paras) {
      return {
        s: {
          path: lists.tail(dom.makeOffsetPath(lists.head(paras), this.sc)),
          offset: this.so
        },
        e: {
          path: lists.tail(dom.makeOffsetPath(lists.last(paras), this.ec)),
          offset: this.eo
        }
      };
    }
    /**
     * getClientRects
     * @return {Rect[]}
     */
    getClientRects() {
      const nativeRng = this.nativeRange();
      return nativeRng.getClientRects();
    }
  }
  const range = {
    /**
     * create Range Object From arguments or Browser Selection
     *
     * @param {Node} sc - start container
     * @param {Number} so - start offset
     * @param {Node} ec - end container
     * @param {Number} eo - end offset
     * @return {WrappedRange}
     */
    create: function(sc, so, ec, eo) {
      if (arguments.length === 4) {
        return new WrappedRange(sc, so, ec, eo);
      } else if (arguments.length === 2) {
        ec = sc;
        eo = so;
        return new WrappedRange(sc, so, ec, eo);
      } else {
        let wrappedRange = this.createFromSelection();
        if (!wrappedRange && arguments.length === 1) {
          let bodyElement = arguments[0];
          if (dom.isEditable(bodyElement)) {
            bodyElement = bodyElement.lastChild;
          }
          return this.createFromBodyElement(bodyElement, dom.emptyPara === arguments[0].innerHTML);
        }
        return wrappedRange;
      }
    },
    createFromBodyElement: function(bodyElement, isCollapseToStart = false) {
      var wrappedRange = this.createFromNode(bodyElement);
      return wrappedRange.collapse(isCollapseToStart);
    },
    createFromSelection: function() {
      let sc, so, ec, eo;
      if (env.isW3CRangeSupport) {
        const selection = document.getSelection();
        if (!selection || selection.rangeCount === 0) {
          return null;
        } else if (dom.isBody(selection.anchorNode)) {
          return null;
        }
        const nativeRng = selection.getRangeAt(0);
        sc = nativeRng.startContainer;
        so = nativeRng.startOffset;
        ec = nativeRng.endContainer;
        eo = nativeRng.endOffset;
      } else {
        const textRange = document.selection.createRange();
        const textRangeEnd = textRange.duplicate();
        textRangeEnd.collapse(false);
        const textRangeStart = textRange;
        textRangeStart.collapse(true);
        let startPoint = textRangeToPoint(textRangeStart, true);
        let endPoint = textRangeToPoint(textRangeEnd, false);
        if (dom.isText(startPoint.node) && dom.isLeftEdgePoint(startPoint) && dom.isTextNode(endPoint.node) && dom.isRightEdgePoint(endPoint) && endPoint.node.nextSibling === startPoint.node) {
          startPoint = endPoint;
        }
        sc = startPoint.cont;
        so = startPoint.offset;
        ec = endPoint.cont;
        eo = endPoint.offset;
      }
      return new WrappedRange(sc, so, ec, eo);
    },
    /**
     * @method
     *
     * create WrappedRange from node
     *
     * @param {Node} node
     * @return {WrappedRange}
     */
    createFromNode: function(node) {
      let sc = node;
      let so = 0;
      let ec = node;
      let eo = dom.nodeLength(ec);
      if (dom.isVoid(sc)) {
        so = dom.listPrev(sc).length - 1;
        sc = sc.parentNode;
      }
      if (dom.isBR(ec)) {
        eo = dom.listPrev(ec).length - 1;
        ec = ec.parentNode;
      } else if (dom.isVoid(ec)) {
        eo = dom.listPrev(ec).length;
        ec = ec.parentNode;
      }
      return this.create(sc, so, ec, eo);
    },
    /**
     * create WrappedRange from node after position
     *
     * @param {Node} node
     * @return {WrappedRange}
     */
    createFromNodeBefore: function(node) {
      return this.createFromNode(node).collapse(true);
    },
    /**
     * create WrappedRange from node after position
     *
     * @param {Node} node
     * @return {WrappedRange}
     */
    createFromNodeAfter: function(node) {
      return this.createFromNode(node).collapse();
    },
    /**
     * @method
     *
     * create WrappedRange from bookmark
     *
     * @param {Node} editable
     * @param {Object} bookmark
     * @return {WrappedRange}
     */
    createFromBookmark: function(editable2, bookmark) {
      const sc = dom.fromOffsetPath(editable2, bookmark.s.path);
      const so = bookmark.s.offset;
      const ec = dom.fromOffsetPath(editable2, bookmark.e.path);
      const eo = bookmark.e.offset;
      return new WrappedRange(sc, so, ec, eo);
    },
    /**
     * @method
     *
     * create WrappedRange from paraBookmark
     *
     * @param {Object} bookmark
     * @param {Node[]} paras
     * @return {WrappedRange}
     */
    createFromParaBookmark: function(bookmark, paras) {
      const so = bookmark.s.offset;
      const eo = bookmark.e.offset;
      const sc = dom.fromOffsetPath(lists.head(paras), bookmark.s.path);
      const ec = dom.fromOffsetPath(lists.last(paras), bookmark.e.path);
      return new WrappedRange(sc, so, ec, eo);
    }
  };
  const KEY_MAP = {
    "BACKSPACE": 8,
    "TAB": 9,
    "ENTER": 13,
    "ESCAPE": 27,
    "SPACE": 32,
    "DELETE": 46,
    // Arrow
    "LEFT": 37,
    "UP": 38,
    "RIGHT": 39,
    "DOWN": 40,
    // Number: 0-9
    "NUM0": 48,
    "NUM1": 49,
    "NUM2": 50,
    "NUM3": 51,
    "NUM4": 52,
    "NUM5": 53,
    "NUM6": 54,
    "NUM7": 55,
    "NUM8": 56,
    // Alphabet: a-z
    "B": 66,
    "E": 69,
    "I": 73,
    "J": 74,
    "K": 75,
    "L": 76,
    "R": 82,
    "S": 83,
    "U": 85,
    "V": 86,
    "Y": 89,
    "Z": 90,
    "SLASH": 191,
    "LEFTBRACKET": 219,
    "BACKSLASH": 220,
    "RIGHTBRACKET": 221,
    // Navigation
    "HOME": 36,
    "END": 35,
    "PAGEUP": 33,
    "PAGEDOWN": 34
  };
  const key = {
    /**
     * @method isEdit
     *
     * @param {Number} keyCode
     * @return {Boolean}
     */
    isEdit: (keyCode) => {
      return lists.contains([
        KEY_MAP.BACKSPACE,
        KEY_MAP.TAB,
        KEY_MAP.ENTER,
        KEY_MAP.SPACE,
        KEY_MAP.DELETE
      ], keyCode);
    },
    /**
     * @method isRemove
     *
     * @param {Number} keyCode
     * @return {Boolean}
     */
    isRemove: (keyCode) => {
      return lists.contains([
        KEY_MAP.BACKSPACE,
        KEY_MAP.DELETE
      ], keyCode);
    },
    /**
     * @method isMove
     *
     * @param {Number} keyCode
     * @return {Boolean}
     */
    isMove: (keyCode) => {
      return lists.contains([
        KEY_MAP.LEFT,
        KEY_MAP.UP,
        KEY_MAP.RIGHT,
        KEY_MAP.DOWN
      ], keyCode);
    },
    /**
     * @method isNavigation
     *
     * @param {Number} keyCode
     * @return {Boolean}
     */
    isNavigation: (keyCode) => {
      return lists.contains([
        KEY_MAP.HOME,
        KEY_MAP.END,
        KEY_MAP.PAGEUP,
        KEY_MAP.PAGEDOWN
      ], keyCode);
    },
    /**
     * @property {Object} nameFromCode
     * @property {String} nameFromCode.8 "BACKSPACE"
     */
    nameFromCode: func.invertObject(KEY_MAP),
    code: KEY_MAP
  };
  function readFileAsDataURL(file) {
    return $.Deferred((deferred) => {
      $.extend(new FileReader(), {
        onload: (event2) => {
          const dataURL = event2.target.result;
          deferred.resolve(dataURL);
        },
        onerror: (err) => {
          deferred.reject(err);
        }
      }).readAsDataURL(file);
    }).promise();
  }
  function createImage(url, param, imageId) {
    return $.Deferred((deferred) => {
      const $img = $("<img>");
      $img.one("load", () => {
        $img.off("error abort");
        deferred.resolve($img);
      }).one("error abort", () => {
        $img.off("load").detach();
        deferred.reject($img);
      }).css({
        display: "none"
      }).appendTo(document.body).attr("src", url).attr("data-id", imageId);
    }).promise();
  }
  function createPicture(url, param, imageId, srcsets) {
    return $.Deferred(function(deferred) {
      const $picture = $("<picture>");
      $picture.attr("data-id", imageId);
      for (let srcsetIndex = 0; srcsetIndex < srcsets.length; srcsetIndex++) {
        if (srcsets[srcsetIndex].maxWidth) {
          $picture.append($("<source>").attr("media", "(max-width: " + srcsets[srcsetIndex].maxWidth + "px)").attr("srcset", srcsets[srcsetIndex].url));
        } else {
          $picture.append($("<source>").attr("srcset", srcsets[srcsetIndex].url));
        }
        if (srcsets[srcsetIndex].webp) {
          if (srcsets[srcsetIndex].maxWidth) {
            $picture.append($("<source>").attr("type", "image/webp").attr("media", "(max-width: " + srcsets[srcsetIndex].maxWidth + "px)").attr("srcset", srcsets[srcsetIndex].webp));
          } else {
            $picture.append($("<source>").attr("type", "image/webp").attr("srcset", srcsets[srcsetIndex].webp));
          }
        } else {
          $picture.append($("<source>").attr("type", "image/webp").attr("srcset", srcsets[srcsetIndex].webp));
        }
      }
      const $img = $("<img>").attr("loading", "lazy").attr("src", url).attr("data-id", imageId);
      $picture.append($img);
      deferred.resolve($picture);
    }).promise();
  }
  class History {
    constructor(context) {
      this.stack = [];
      this.stackOffset = -1;
      this.context = context;
      this.$editable = context.layoutInfo.editable;
      this.editable = this.$editable[0];
    }
    makeSnapshot() {
      const rng = range.create(this.editable);
      const emptyBookmark = { s: { path: [], offset: 0 }, e: { path: [], offset: 0 } };
      return {
        contents: this.$editable.html(),
        bookmark: rng && rng.isOnEditable() ? rng.bookmark(this.editable) : emptyBookmark
      };
    }
    applySnapshot(snapshot) {
      if (snapshot.contents !== null) {
        this.$editable.html(snapshot.contents);
      }
      if (snapshot.bookmark !== null) {
        range.createFromBookmark(this.editable, snapshot.bookmark).select();
      }
    }
    /**
     * @method rewind
     * Rewinds the history stack back to the first snapshot taken.
     * Leaves the stack intact, so that "Redo" can still be used.
     */
    rewind() {
      if (this.$editable.html() !== this.stack[this.stackOffset].contents) {
        this.recordUndo();
      }
      this.stackOffset = 0;
      this.applySnapshot(this.stack[this.stackOffset]);
    }
    /**
     *  @method commit
     *  Resets history stack, but keeps current editor's content.
     */
    commit() {
      this.stack = [];
      this.stackOffset = -1;
      this.recordUndo();
    }
    /**
     * @method reset
     * Resets the history stack completely; reverting to an empty editor.
     */
    reset() {
      this.stack = [];
      this.stackOffset = -1;
      this.$editable.html("");
      this.recordUndo();
    }
    /**
     * undo
     */
    undo() {
      if (this.$editable.html() !== this.stack[this.stackOffset].contents) {
        this.recordUndo();
      }
      if (this.stackOffset > 0) {
        this.stackOffset--;
        this.applySnapshot(this.stack[this.stackOffset]);
      }
    }
    /**
     * redo
     */
    redo() {
      if (this.stack.length - 1 > this.stackOffset) {
        this.stackOffset++;
        this.applySnapshot(this.stack[this.stackOffset]);
      }
    }
    /**
     * recorded undo
     */
    recordUndo() {
      this.stackOffset++;
      if (this.stack.length > this.stackOffset) {
        this.stack = this.stack.slice(0, this.stackOffset);
      }
      this.stack.push(this.makeSnapshot());
      if (this.stack.length > this.context.options.historyLimit) {
        this.stack.shift();
        this.stackOffset -= 1;
      }
    }
  }
  class Style {
    /**
     * @method jQueryCSS
     *
     * [workaround] for old jQuery
     * passing an array of style properties to .css()
     * will result in an object of property-value pairs.
     * (compability with version < 1.9)
     *
     * @private
     * @param  {jQuery} $obj
     * @param  {Array} propertyNames - An array of one or more CSS properties.
     * @return {Object}
     */
    jQueryCSS($obj, propertyNames) {
      const result = {};
      $.each(propertyNames, (idx, propertyName) => {
        result[propertyName] = $obj.css(propertyName);
      });
      return result;
    }
    /**
     * returns style object from node
     *
     * @param {jQuery} $node
     * @return {Object}
     */
    fromNode($node) {
      const properties = ["font-family", "font-size", "text-align", "list-style-type", "line-height"];
      const styleInfo = this.jQueryCSS($node, properties) || {};
      const fontSize = $node[0].style.fontSize || styleInfo["font-size"];
      styleInfo["font-size"] = parseInt(fontSize, 10);
      styleInfo["font-size-unit"] = fontSize.match(/[a-z%]+$/);
      return styleInfo;
    }
    /**
     * paragraph level style
     *
     * @param {WrappedRange} rng
     * @param {Object} styleInfo
     */
    stylePara(rng, styleInfo) {
      $.each(rng.nodes(dom.isPara, {
        includeAncestor: true
      }), (idx, para) => {
        $(para).css(styleInfo);
      });
    }
    /**
     * insert and returns styleNodes on range.
     *
     * @param {WrappedRange} rng
     * @param {Object} [options] - options for styleNodes
     * @param {String} [options.nodeName] - default: `SPAN`
     * @param {Boolean} [options.expandClosestSibling] - default: `false`
     * @param {Boolean} [options.onlyPartialContains] - default: `false`
     * @return {Node[]}
     */
    styleNodes(rng, options) {
      rng = rng.splitText();
      const nodeName = options && options.nodeName || "SPAN";
      const expandClosestSibling = !!(options && options.expandClosestSibling);
      const onlyPartialContains = !!(options && options.onlyPartialContains);
      if (rng.isCollapsed()) {
        return [rng.insertNode(dom.create(nodeName))];
      }
      let pred = dom.makePredByNodeName(nodeName);
      const nodes = rng.nodes(dom.isText, {
        fullyContains: true
      }).map((text) => {
        return dom.singleChildAncestor(text, pred) || dom.wrap(text, nodeName);
      });
      if (expandClosestSibling) {
        if (onlyPartialContains) {
          const nodesInRange = rng.nodes();
          pred = func.and(pred, (node) => {
            return lists.contains(nodesInRange, node);
          });
        }
        return nodes.map((node) => {
          const siblings = dom.withClosestSiblings(node, pred);
          const head2 = lists.head(siblings);
          const tails = lists.tail(siblings);
          $.each(tails, (idx, elem) => {
            dom.appendChildNodes(head2, elem.childNodes);
            dom.remove(elem);
          });
          return lists.head(siblings);
        });
      } else {
        return nodes;
      }
    }
    /**
     * get current style on cursor
     *
     * @param {WrappedRange} rng
     * @return {Object} - object contains style properties.
     */
    current(rng) {
      const $cont = $(!dom.isElement(rng.sc) ? rng.sc.parentNode : rng.sc);
      let styleInfo = this.fromNode($cont);
      try {
        styleInfo = $.extend(styleInfo, {
          "font-bold": document.queryCommandState("bold") ? "bold" : "normal",
          "font-italic": document.queryCommandState("italic") ? "italic" : "normal",
          "font-underline": document.queryCommandState("underline") ? "underline" : "normal",
          "font-subscript": document.queryCommandState("subscript") ? "subscript" : "normal",
          "font-superscript": document.queryCommandState("superscript") ? "superscript" : "normal",
          "font-strikethrough": document.queryCommandState("strikethrough") ? "strikethrough" : "normal",
          "font-family": document.queryCommandValue("fontname") || styleInfo["font-family"]
        });
      } catch (e) {
      }
      if (!rng.isOnList()) {
        styleInfo["list-style"] = "none";
      } else {
        const orderedTypes = ["circle", "disc", "disc-leading-zero", "square"];
        const isUnordered = orderedTypes.indexOf(styleInfo["list-style-type"]) > -1;
        styleInfo["list-style"] = isUnordered ? "unordered" : "ordered";
      }
      const para = dom.ancestor(rng.sc, dom.isPara);
      if (para && para.style["line-height"]) {
        styleInfo["line-height"] = para.style.lineHeight;
      } else {
        const lineHeight = parseInt(styleInfo["line-height"], 10) / parseInt(styleInfo["font-size"], 10);
        styleInfo["line-height"] = lineHeight.toFixed(1);
      }
      styleInfo.anchor = rng.isOnAnchor() && dom.ancestor(rng.sc, dom.isAnchor);
      styleInfo.ancestors = dom.listAncestor(rng.sc, dom.isEditable);
      styleInfo.range = rng;
      return styleInfo;
    }
  }
  class Bullet {
    /**
     * toggle ordered list
     */
    insertOrderedList(editable2) {
      this.toggleList("OL", editable2);
    }
    /**
     * toggle unordered list
     */
    insertUnorderedList(editable2) {
      this.toggleList("UL", editable2);
    }
    /**
     * indent
     */
    indent(editable2) {
      const rng = range.create(editable2).wrapBodyInlineWithPara();
      const paras = rng.nodes(dom.isPara, { includeAncestor: true });
      const clustereds = lists.clusterBy(paras, func.peq2("parentNode"));
      $.each(clustereds, (idx, paras2) => {
        const head2 = lists.head(paras2);
        if (dom.isLi(head2)) {
          const previousList = this.findList(head2.previousSibling);
          if (previousList) {
            paras2.map((para) => previousList.appendChild(para));
          } else {
            this.wrapList(paras2, head2.parentNode.nodeName);
            paras2.map((para) => para.parentNode).map((para) => this.appendToPrevious(para));
          }
        } else {
          $.each(paras2, (idx2, para) => {
            $(para).css("marginLeft", (idx3, val) => {
              return (parseInt(val, 10) || 0) + 25;
            });
          });
        }
      });
      rng.select();
    }
    /**
     * outdent
     */
    outdent(editable2) {
      const rng = range.create(editable2).wrapBodyInlineWithPara();
      const paras = rng.nodes(dom.isPara, { includeAncestor: true });
      const clustereds = lists.clusterBy(paras, func.peq2("parentNode"));
      $.each(clustereds, (idx, paras2) => {
        const head2 = lists.head(paras2);
        if (dom.isLi(head2)) {
          this.releaseList([paras2]);
        } else {
          $.each(paras2, (idx2, para) => {
            $(para).css("marginLeft", (idx3, val) => {
              val = parseInt(val, 10) || 0;
              return val > 25 ? val - 25 : "";
            });
          });
        }
      });
      rng.select();
    }
    /**
     * toggle list
     *
     * @param {String} listName - OL or UL
     */
    toggleList(listName, editable2) {
      const rng = range.create(editable2).wrapBodyInlineWithPara();
      let paras = rng.nodes(dom.isPara, { includeAncestor: true });
      const bookmark = rng.paraBookmark(paras);
      const clustereds = lists.clusterBy(paras, func.peq2("parentNode"));
      if (lists.find(paras, dom.isPurePara)) {
        let wrappedParas = [];
        $.each(clustereds, (idx, paras2) => {
          wrappedParas = wrappedParas.concat(this.wrapList(paras2, listName));
        });
        paras = wrappedParas;
      } else {
        const diffLists = rng.nodes(dom.isList, {
          includeAncestor: true
        }).filter((listNode) => {
          return !$.nodeName(listNode, listName);
        });
        if (diffLists.length) {
          $.each(diffLists, (idx, listNode) => {
            dom.replace(listNode, listName);
          });
        } else {
          paras = this.releaseList(clustereds, true);
        }
      }
      range.createFromParaBookmark(bookmark, paras).select();
    }
    /**
     * @param {Node[]} paras
     * @param {String} listName
     * @return {Node[]}
     */
    wrapList(paras, listName) {
      const head2 = lists.head(paras);
      const last2 = lists.last(paras);
      const prevList = dom.isList(head2.previousSibling) && head2.previousSibling;
      const nextList = dom.isList(last2.nextSibling) && last2.nextSibling;
      const listNode = prevList || dom.insertAfter(dom.create(listName || "UL"), last2);
      paras = paras.map((para) => {
        return dom.isPurePara(para) ? dom.replace(para, "LI") : para;
      });
      dom.appendChildNodes(listNode, paras, true);
      if (nextList) {
        dom.appendChildNodes(listNode, lists.from(nextList.childNodes), true);
        dom.remove(nextList);
      }
      return paras;
    }
    /**
     * @method releaseList
     *
     * @param {Array[]} clustereds
     * @param {Boolean} isEscapseToBody
     * @return {Node[]}
     */
    releaseList(clustereds, isEscapseToBody) {
      let releasedParas = [];
      $.each(clustereds, (idx, paras) => {
        const head2 = lists.head(paras);
        const last2 = lists.last(paras);
        const headList = isEscapseToBody ? dom.lastAncestor(head2, dom.isList) : head2.parentNode;
        const parentItem = headList.parentNode;
        if (headList.parentNode.nodeName === "LI") {
          paras.map((para) => {
            const newList = this.findNextSiblings(para);
            if (parentItem.nextSibling) {
              parentItem.parentNode.insertBefore(para, parentItem.nextSibling);
            } else {
              parentItem.parentNode.appendChild(para);
            }
            if (newList.length) {
              this.wrapList(newList, headList.nodeName);
              para.appendChild(newList[0].parentNode);
            }
          });
          if (headList.children.length === 0) {
            parentItem.removeChild(headList);
          }
          if (parentItem.childNodes.length === 0) {
            parentItem.parentNode.removeChild(parentItem);
          }
        } else {
          const lastList = headList.childNodes.length > 1 ? dom.splitTree(
              headList,
              {
                node: last2.parentNode,
                offset: dom.position(last2) + 1
              },
              {
                isSkipPaddingBlankHTML: true
              }
          ) : null;
          const middleList = dom.splitTree(
              headList,
              {
                node: head2.parentNode,
                offset: dom.position(head2)
              },
              {
                isSkipPaddingBlankHTML: true
              }
          );
          paras = isEscapseToBody ? dom.listDescendant(middleList, dom.isLi) : lists.from(middleList.childNodes).filter(dom.isLi);
          if (isEscapseToBody || !dom.isList(headList.parentNode)) {
            paras = paras.map((para) => {
              return dom.replace(para, "P");
            });
          }
          $.each(lists.from(paras).reverse(), (idx2, para) => {
            dom.insertAfter(para, headList);
          });
          const rootLists = lists.compact([headList, middleList, lastList]);
          $.each(rootLists, (idx2, rootList) => {
            const listNodes = [rootList].concat(dom.listDescendant(rootList, dom.isList));
            $.each(listNodes.reverse(), (idx3, listNode) => {
              if (!dom.nodeLength(listNode)) {
                dom.remove(listNode, true);
              }
            });
          });
        }
        releasedParas = releasedParas.concat(paras);
      });
      return releasedParas;
    }
    /**
     * @method appendToPrevious
     *
     * Appends list to previous list item, if
     * none exist it wraps the list in a new list item.
     *
     * @param {HTMLNode} ListItem
     * @return {HTMLNode}
     */
    appendToPrevious(node) {
      return node.previousSibling ? dom.appendChildNodes(node.previousSibling, [node]) : this.wrapList([node], "LI");
    }
    /**
     * @method findList
     *
     * Finds an existing list in list item
     *
     * @param {HTMLNode} ListItem
     * @return {Array[]}
     */
    findList(node) {
      return node ? lists.find(node.children, (child) => ["OL", "UL"].indexOf(child.nodeName) > -1) : null;
    }
    /**
     * @method findNextSiblings
     *
     * Finds all list item siblings that follow it
     *
     * @param {HTMLNode} ListItem
     * @return {HTMLNode}
     */
    findNextSiblings(node) {
      const siblings = [];
      while (node.nextSibling) {
        siblings.push(node.nextSibling);
        node = node.nextSibling;
      }
      return siblings;
    }
  }
  class Typing {
    constructor(context) {
      this.bullet = new Bullet();
      this.options = context.options;
    }
    /**
     * insert tab
     *
     * @param {WrappedRange} rng
     * @param {Number} tabsize
     */
    insertTab(rng, tabsize) {
      const tab = dom.createText(new Array(tabsize + 1).join(dom.NBSP_CHAR));
      rng = rng.deleteContents();
      rng.insertNode(tab, true);
      rng = range.create(tab, tabsize);
      rng.select();
    }
    /**
     * insert paragraph
     *
     * @param {jQuery} $editable
     * @param {WrappedRange} rng Can be used in unit tests to "mock" the range
     *
     * blockquoteBreakingLevel
     *   0 - No break, the new paragraph remains inside the quote
     *   1 - Break the first blockquote in the ancestors list
     *   2 - Break all blockquotes, so that the new paragraph is not quoted (this is the default)
     */
    insertParagraph(editable2, rng) {
      rng = rng || range.create(editable2);
      rng = rng.deleteContents();
      rng = rng.wrapBodyInlineWithPara();
      const splitRoot = dom.ancestor(rng.sc, dom.isPara);
      let nextPara;
      if (splitRoot) {
        if (dom.isLi(splitRoot) && (dom.isEmpty(splitRoot) || dom.deepestChildIsEmpty(splitRoot))) {
          this.bullet.toggleList(splitRoot.parentNode.nodeName);
          return;
        } else {
          let blockquote = null;
          if (this.options.blockquoteBreakingLevel === 1) {
            blockquote = dom.ancestor(splitRoot, dom.isBlockquote) || dom.ancestor(splitRoot, dom.isPre);
          } else if (this.options.blockquoteBreakingLevel === 2) {
            blockquote = dom.lastAncestor(splitRoot, dom.isBlockquote) || dom.lastAncestor(splitRoot, dom.isPre);
          }
          if (blockquote) {
            nextPara = $(dom.emptyPara)[0];
            if (dom.isRightEdgePoint(rng.getStartPoint()) && dom.isBR(rng.sc.nextSibling)) {
              $(rng.sc.nextSibling).remove();
            }
            const split = dom.splitTree(blockquote, rng.getStartPoint(), { isDiscardEmptySplits: true });
            if (split) {
              split.parentNode.insertBefore(nextPara, split);
            } else {
              dom.insertAfter(nextPara, blockquote);
            }
          } else {
            nextPara = dom.splitTree(splitRoot, rng.getStartPoint());
            let emptyAnchors = dom.listDescendant(splitRoot, dom.isEmptyAnchor);
            emptyAnchors = emptyAnchors.concat(dom.listDescendant(nextPara, dom.isEmptyAnchor));
            $.each(emptyAnchors, (idx, anchor) => {
              dom.remove(anchor);
            });
            if ((dom.isHeading(nextPara) || dom.isPre(nextPara) || dom.isCustomStyleTag(nextPara)) && dom.isEmpty(nextPara)) {
              nextPara = dom.replace(nextPara, "p");
            }
          }
        }
      } else {
        const next2 = rng.sc.childNodes[rng.so];
        nextPara = $(dom.emptyPara)[0];
        if (next2) {
          rng.sc.insertBefore(nextPara, next2);
        } else {
          rng.sc.appendChild(nextPara);
        }
      }
      if (!nextPara) {
        nextPara = $(dom.emptyPara)[0];
        dom.ancestor(rng.sc, dom.isPara).appendChild(nextPara);
      }
      range.create(nextPara, 0).normalize().select().scrollIntoView(editable2);
    }
  }
  const TableResultAction = function(startPoint, where, action, domTable) {
    const _startPoint = { "colPos": 0, "rowPos": 0 };
    const _virtualTable = [];
    const _actionCellList = [];
    function setStartPoint() {
      if (!startPoint || !startPoint.tagName || startPoint.tagName.toLowerCase() !== "td" && startPoint.tagName.toLowerCase() !== "th") {
        return;
      }
      _startPoint.colPos = startPoint.cellIndex;
      if (!startPoint.parentElement || !startPoint.parentElement.tagName || startPoint.parentElement.tagName.toLowerCase() !== "tr") {
        return;
      }
      _startPoint.rowPos = startPoint.parentElement.rowIndex;
    }
    function setVirtualTablePosition(rowIndex, cellIndex, baseRow, baseCell, isRowSpan, isColSpan, isVirtualCell) {
      const objPosition = {
        "baseRow": baseRow,
        "baseCell": baseCell,
        "isRowSpan": isRowSpan,
        "isColSpan": isColSpan,
        "isVirtual": isVirtualCell
      };
      if (!_virtualTable[rowIndex]) {
        _virtualTable[rowIndex] = [];
      }
      _virtualTable[rowIndex][cellIndex] = objPosition;
    }
    function getActionCell(virtualTableCellObj, resultAction, virtualRowPosition, virtualColPosition) {
      return {
        "baseCell": virtualTableCellObj.baseCell,
        "action": resultAction,
        "virtualTable": {
          "rowIndex": virtualRowPosition,
          "cellIndex": virtualColPosition
        }
      };
    }
    function recoverCellIndex(rowIndex, cellIndex) {
      if (!_virtualTable[rowIndex]) {
        return cellIndex;
      }
      if (!_virtualTable[rowIndex][cellIndex]) {
        return cellIndex;
      }
      let newCellIndex = cellIndex;
      while (_virtualTable[rowIndex][newCellIndex]) {
        newCellIndex++;
        if (!_virtualTable[rowIndex][newCellIndex]) {
          return newCellIndex;
        }
      }
    }
    function addCellInfoToVirtual(row, cell) {
      const cellIndex = recoverCellIndex(row.rowIndex, cell.cellIndex);
      const cellHasColspan = cell.colSpan > 1;
      const cellHasRowspan = cell.rowSpan > 1;
      const isThisSelectedCell = row.rowIndex === _startPoint.rowPos && cell.cellIndex === _startPoint.colPos;
      setVirtualTablePosition(row.rowIndex, cellIndex, row, cell, cellHasRowspan, cellHasColspan, false);
      const rowspanNumber = cell.attributes.rowSpan ? parseInt(cell.attributes.rowSpan.value, 10) : 0;
      if (rowspanNumber > 1) {
        for (let rp = 1; rp < rowspanNumber; rp++) {
          const rowspanIndex = row.rowIndex + rp;
          adjustStartPoint(rowspanIndex, cellIndex, cell, isThisSelectedCell);
          setVirtualTablePosition(rowspanIndex, cellIndex, row, cell, true, cellHasColspan, true);
        }
      }
      const colspanNumber = cell.attributes.colSpan ? parseInt(cell.attributes.colSpan.value, 10) : 0;
      if (colspanNumber > 1) {
        for (let cp = 1; cp < colspanNumber; cp++) {
          const cellspanIndex = recoverCellIndex(row.rowIndex, cellIndex + cp);
          adjustStartPoint(row.rowIndex, cellspanIndex, cell, isThisSelectedCell);
          setVirtualTablePosition(row.rowIndex, cellspanIndex, row, cell, cellHasRowspan, true, true);
        }
      }
    }
    function adjustStartPoint(rowIndex, cellIndex, cell, isSelectedCell) {
      if (rowIndex === _startPoint.rowPos && _startPoint.colPos >= cell.cellIndex && cell.cellIndex <= cellIndex && !isSelectedCell) {
        _startPoint.colPos++;
      }
    }
    function createVirtualTable() {
      const rows = domTable.rows;
      for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const cells = rows[rowIndex].cells;
        for (let cellIndex = 0; cellIndex < cells.length; cellIndex++) {
          addCellInfoToVirtual(rows[rowIndex], cells[cellIndex]);
        }
      }
    }
    function getDeleteResultActionToCell(cell) {
      switch (where) {
        case TableResultAction.where.Column:
          if (cell.isColSpan) {
            return TableResultAction.resultAction.SubtractSpanCount;
          }
          break;
        case TableResultAction.where.Row:
          if (!cell.isVirtual && cell.isRowSpan) {
            return TableResultAction.resultAction.AddCell;
          } else if (cell.isRowSpan) {
            return TableResultAction.resultAction.SubtractSpanCount;
          }
          break;
      }
      return TableResultAction.resultAction.RemoveCell;
    }
    function getAddResultActionToCell(cell) {
      switch (where) {
        case TableResultAction.where.Column:
          if (cell.isColSpan) {
            return TableResultAction.resultAction.SumSpanCount;
          } else if (cell.isRowSpan && cell.isVirtual) {
            return TableResultAction.resultAction.Ignore;
          }
          break;
        case TableResultAction.where.Row:
          if (cell.isRowSpan) {
            return TableResultAction.resultAction.SumSpanCount;
          } else if (cell.isColSpan && cell.isVirtual) {
            return TableResultAction.resultAction.Ignore;
          }
          break;
      }
      return TableResultAction.resultAction.AddCell;
    }
    function init() {
      setStartPoint();
      createVirtualTable();
    }
    this.getActionList = function() {
      const fixedRow = where === TableResultAction.where.Row ? _startPoint.rowPos : -1;
      const fixedCol = where === TableResultAction.where.Column ? _startPoint.colPos : -1;
      let actualPosition = 0;
      let canContinue = true;
      while (canContinue) {
        const rowPosition = fixedRow >= 0 ? fixedRow : actualPosition;
        const colPosition = fixedCol >= 0 ? fixedCol : actualPosition;
        const row = _virtualTable[rowPosition];
        if (!row) {
          canContinue = false;
          return _actionCellList;
        }
        const cell = row[colPosition];
        if (!cell) {
          canContinue = false;
          return _actionCellList;
        }
        let resultAction = TableResultAction.resultAction.Ignore;
        switch (action) {
          case TableResultAction.requestAction.Add:
            resultAction = getAddResultActionToCell(cell);
            break;
          case TableResultAction.requestAction.Delete:
            resultAction = getDeleteResultActionToCell(cell);
            break;
        }
        _actionCellList.push(getActionCell(cell, resultAction, rowPosition, colPosition));
        actualPosition++;
      }
      return _actionCellList;
    };
    init();
  };
  TableResultAction.where = { "Row": 0, "Column": 1 };
  TableResultAction.requestAction = { "Add": 0, "Delete": 1 };
  TableResultAction.resultAction = { "Ignore": 0, "SubtractSpanCount": 1, "RemoveCell": 2, "AddCell": 3, "SumSpanCount": 4 };
  class Table {
    /**
     * handle tab key
     *
     * @param {WrappedRange} rng
     * @param {Boolean} isShift
     */
    tab(rng, isShift) {
      const cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
      const table = dom.ancestor(cell, dom.isTable);
      const cells = dom.listDescendant(table, dom.isCell);
      const nextCell = lists[isShift ? "prev" : "next"](cells, cell);
      if (nextCell) {
        range.create(nextCell, 0).select();
      }
    }
    /**
     * Add a new row
     *
     * @param {WrappedRange} rng
     * @param {String} position (top/bottom)
     * @return {Node}
     */
    addRow(rng, position2) {
      const cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
      const currentTr = $(cell).closest("tr");
      const trAttributes = this.recoverAttributes(currentTr);
      const html2 = $("<tr" + trAttributes + "></tr>");
      const vTable = new TableResultAction(
          cell,
          TableResultAction.where.Row,
          TableResultAction.requestAction.Add,
          $(currentTr).closest("table")[0]
      );
      const actions = vTable.getActionList();
      for (let idCell = 0; idCell < actions.length; idCell++) {
        const currentCell = actions[idCell];
        const tdAttributes = this.recoverAttributes(currentCell.baseCell);
        switch (currentCell.action) {
          case TableResultAction.resultAction.AddCell:
            html2.append("<td" + tdAttributes + ">" + dom.blank + "</td>");
            break;
          case TableResultAction.resultAction.SumSpanCount:
          {
            if (position2 === "top") {
              const baseCellTr = currentCell.baseCell.parent;
              const isTopFromRowSpan = (!baseCellTr ? 0 : currentCell.baseCell.closest("tr").rowIndex) <= currentTr[0].rowIndex;
              if (isTopFromRowSpan) {
                const newTd = $("<div></div>").append($("<td" + tdAttributes + ">" + dom.blank + "</td>").removeAttr("rowspan")).html();
                html2.append(newTd);
                break;
              }
            }
            let rowspanNumber = parseInt(currentCell.baseCell.rowSpan, 10);
            rowspanNumber++;
            currentCell.baseCell.setAttribute("rowSpan", rowspanNumber);
          }
            break;
        }
      }
      if (position2 === "top") {
        currentTr.before(html2);
      } else {
        const cellHasRowspan = cell.rowSpan > 1;
        if (cellHasRowspan) {
          const lastTrIndex = currentTr[0].rowIndex + (cell.rowSpan - 2);
          $($(currentTr).parent().find("tr")[lastTrIndex]).after($(html2));
          return;
        }
        currentTr.after(html2);
      }
    }
    /**
     * Add a new col
     *
     * @param {WrappedRange} rng
     * @param {String} position (left/right)
     * @return {Node}
     */
    addCol(rng, position2) {
      const cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
      const row = $(cell).closest("tr");
      const rowsGroup = $(row).siblings();
      rowsGroup.push(row);
      const vTable = new TableResultAction(
          cell,
          TableResultAction.where.Column,
          TableResultAction.requestAction.Add,
          $(row).closest("table")[0]
      );
      const actions = vTable.getActionList();
      for (let actionIndex = 0; actionIndex < actions.length; actionIndex++) {
        const currentCell = actions[actionIndex];
        const tdAttributes = this.recoverAttributes(currentCell.baseCell);
        switch (currentCell.action) {
          case TableResultAction.resultAction.AddCell:
            if (position2 === "right") {
              $(currentCell.baseCell).after("<td" + tdAttributes + ">" + dom.blank + "</td>");
            } else {
              $(currentCell.baseCell).before("<td" + tdAttributes + ">" + dom.blank + "</td>");
            }
            break;
          case TableResultAction.resultAction.SumSpanCount:
            if (position2 === "right") {
              let colspanNumber = parseInt(currentCell.baseCell.colSpan, 10);
              colspanNumber++;
              currentCell.baseCell.setAttribute("colSpan", colspanNumber);
            } else {
              $(currentCell.baseCell).before("<td" + tdAttributes + ">" + dom.blank + "</td>");
            }
            break;
        }
      }
    }
    /*
    * Copy attributes from element.
    *
    * @param {object} Element to recover attributes.
    * @return {string} Copied string elements.
    */
    recoverAttributes(el) {
      let resultStr = "";
      if (!el) {
        return resultStr;
      }
      const attrList = el.attributes || [];
      for (let i = 0; i < attrList.length; i++) {
        if (attrList[i].name.toLowerCase() === "id") {
          continue;
        }
        if (attrList[i].specified) {
          resultStr += " " + attrList[i].name + "='" + attrList[i].value + "'";
        }
      }
      return resultStr;
    }
    /**
     * Delete current row
     *
     * @param {WrappedRange} rng
     * @return {Node}
     */
    deleteRow(rng) {
      const cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
      const row = $(cell).closest("tr");
      const cellPos = row.children("td, th").index($(cell));
      const rowPos = row[0].rowIndex;
      const vTable = new TableResultAction(
          cell,
          TableResultAction.where.Row,
          TableResultAction.requestAction.Delete,
          $(row).closest("table")[0]
      );
      const actions = vTable.getActionList();
      for (let actionIndex = 0; actionIndex < actions.length; actionIndex++) {
        if (!actions[actionIndex]) {
          continue;
        }
        const baseCell = actions[actionIndex].baseCell;
        const virtualPosition = actions[actionIndex].virtualTable;
        const hasRowspan = baseCell.rowSpan && baseCell.rowSpan > 1;
        let rowspanNumber = hasRowspan ? parseInt(baseCell.rowSpan, 10) : 0;
        switch (actions[actionIndex].action) {
          case TableResultAction.resultAction.Ignore:
            continue;
          case TableResultAction.resultAction.AddCell:
          {
            const nextRow = row.next("tr")[0];
            if (!nextRow) {
              continue;
            }
            const cloneRow = row[0].cells[cellPos];
            if (hasRowspan) {
              if (rowspanNumber > 2) {
                rowspanNumber--;
                nextRow.insertBefore(cloneRow, nextRow.cells[cellPos]);
                nextRow.cells[cellPos].setAttribute("rowSpan", rowspanNumber);
                nextRow.cells[cellPos].innerHTML = "";
              } else if (rowspanNumber === 2) {
                nextRow.insertBefore(cloneRow, nextRow.cells[cellPos]);
                nextRow.cells[cellPos].removeAttribute("rowSpan");
                nextRow.cells[cellPos].innerHTML = "";
              }
            }
          }
            continue;
          case TableResultAction.resultAction.SubtractSpanCount:
            if (hasRowspan) {
              if (rowspanNumber > 2) {
                rowspanNumber--;
                baseCell.setAttribute("rowSpan", rowspanNumber);
                if (virtualPosition.rowIndex !== rowPos && baseCell.cellIndex === cellPos) {
                  baseCell.innerHTML = "";
                }
              } else if (rowspanNumber === 2) {
                baseCell.removeAttribute("rowSpan");
                if (virtualPosition.rowIndex !== rowPos && baseCell.cellIndex === cellPos) {
                  baseCell.innerHTML = "";
                }
              }
            }
            continue;
          case TableResultAction.resultAction.RemoveCell:
            continue;
        }
      }
      row.remove();
    }
    /**
     * Delete current col
     *
     * @param {WrappedRange} rng
     * @return {Node}
     */
    deleteCol(rng) {
      const cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
      const row = $(cell).closest("tr");
      const cellPos = row.children("td, th").index($(cell));
      const vTable = new TableResultAction(
          cell,
          TableResultAction.where.Column,
          TableResultAction.requestAction.Delete,
          $(row).closest("table")[0]
      );
      const actions = vTable.getActionList();
      for (let actionIndex = 0; actionIndex < actions.length; actionIndex++) {
        if (!actions[actionIndex]) {
          continue;
        }
        switch (actions[actionIndex].action) {
          case TableResultAction.resultAction.Ignore:
            continue;
          case TableResultAction.resultAction.SubtractSpanCount:
          {
            const baseCell = actions[actionIndex].baseCell;
            const hasColspan = baseCell.colSpan && baseCell.colSpan > 1;
            if (hasColspan) {
              let colspanNumber = baseCell.colSpan ? parseInt(baseCell.colSpan, 10) : 0;
              if (colspanNumber > 2) {
                colspanNumber--;
                baseCell.setAttribute("colSpan", colspanNumber);
                if (baseCell.cellIndex === cellPos) {
                  baseCell.innerHTML = "";
                }
              } else if (colspanNumber === 2) {
                baseCell.removeAttribute("colSpan");
                if (baseCell.cellIndex === cellPos) {
                  baseCell.innerHTML = "";
                }
              }
            }
          }
            continue;
          case TableResultAction.resultAction.RemoveCell:
            dom.remove(actions[actionIndex].baseCell, true);
            continue;
        }
      }
    }
    /**
     * create empty table element
     *
     * @param {Number} rowCount
     * @param {Number} colCount
     * @return {Node}
     */
    createTable(colCount, rowCount, options) {
      const tds = [];
      let tdHTML;
      for (let idxCol = 0; idxCol < colCount; idxCol++) {
        tds.push("<td>" + dom.blank + "</td>");
      }
      tdHTML = tds.join("");
      const trs = [];
      let trHTML;
      for (let idxRow = 0; idxRow < rowCount; idxRow++) {
        trs.push("<tr>" + tdHTML + "</tr>");
      }
      trHTML = trs.join("");
      const $table = $("<table>" + trHTML + "</table>");
      if (options && options.tableClassName) {
        $table.addClass(options.tableClassName);
      }
      return $table[0];
    }
    /**
     * Delete current table
     *
     * @param {WrappedRange} rng
     * @return {Node}
     */
    deleteTable(rng) {
      const cell = dom.ancestor(rng.commonAncestor(), dom.isCell);
      $(cell).closest("table").remove();
    }
  }
  const KEY_BOGUS = "bogus";
  const MAILTO_PATTERN$1 = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const TEL_PATTERN$1 = /^(\+?\d{1,3}[\s-]?)?(\d{1,4})[\s-]?(\d{1,4})[\s-]?(\d{1,4})$/;
  const URL_SCHEME_PATTERN$1 = /^([A-Za-z][A-Za-z0-9+-.]*\:|#|\/)/;
  class Editor {
    constructor(context) {
      this.context = context;
      this.$note = context.layoutInfo.note;
      this.$editor = context.layoutInfo.editor;
      this.$editable = context.layoutInfo.editable;
      this.options = context.options;
      this.lang = this.options.langInfo;
      this.editable = this.$editable[0];
      this.lastRange = null;
      this.snapshot = null;
      this.style = new Style();
      this.table = new Table();
      this.typing = new Typing(context);
      this.bullet = new Bullet();
      this.history = new History(context);
      this.context.memo("help.escape", this.lang.help.escape);
      this.context.memo("help.undo", this.lang.help.undo);
      this.context.memo("help.redo", this.lang.help.redo);
      this.context.memo("help.tab", this.lang.help.tab);
      this.context.memo("help.untab", this.lang.help.untab);
      this.context.memo("help.insertParagraph", this.lang.help.insertParagraph);
      this.context.memo("help.insertOrderedList", this.lang.help.insertOrderedList);
      this.context.memo("help.insertUnorderedList", this.lang.help.insertUnorderedList);
      this.context.memo("help.indent", this.lang.help.indent);
      this.context.memo("help.outdent", this.lang.help.outdent);
      this.context.memo("help.formatPara", this.lang.help.formatPara);
      this.context.memo("help.insertHorizontalRule", this.lang.help.insertHorizontalRule);
      this.context.memo("help.fontName", this.lang.help.fontName);
      const commands = [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "superscript",
        "subscript",
        "justifyLeft",
        "justifyCenter",
        "justifyRight",
        "justifyFull",
        "formatBlock",
        "removeFormat",
        "backColor"
      ];
      for (let idx = 0, len = commands.length; idx < len; idx++) {
        this[commands[idx]] = /* @__PURE__ */ ((sCmd) => {
          return (value2) => {
            this.beforeCommand();
            document.execCommand(sCmd, false, value2);
            this.afterCommand(true);
          };
        })(commands[idx]);
        this.context.memo("help." + commands[idx], this.lang.help[commands[idx]]);
      }
      this.fontName = this.wrapCommand((value2) => {
        return this.fontStyling("font-family", env.validFontName(value2));
      });
      this.fontSize = this.wrapCommand((value2) => {
        const unit = this.currentStyle()["font-size-unit"];
        return this.fontStyling("font-size", value2 + unit);
      });
      this.fontSizeUnit = this.wrapCommand((value2) => {
        const size = this.currentStyle()["font-size"];
        return this.fontStyling("font-size", size + value2);
      });
      for (let idx = 1; idx <= 6; idx++) {
        this["formatH" + idx] = /* @__PURE__ */ ((idx2) => {
          return () => {
            this.formatBlock("H" + idx2);
          };
        })(idx);
        this.context.memo("help.formatH" + idx, this.lang.help["formatH" + idx]);
      }
      this.insertParagraph = this.wrapCommand(() => {
        this.typing.insertParagraph(this.editable);
      });
      this.insertOrderedList = this.wrapCommand(() => {
        this.bullet.insertOrderedList(this.editable);
      });
      this.insertUnorderedList = this.wrapCommand(() => {
        this.bullet.insertUnorderedList(this.editable);
      });
      this.indent = this.wrapCommand(() => {
        this.bullet.indent(this.editable);
      });
      this.outdent = this.wrapCommand(() => {
        this.bullet.outdent(this.editable);
      });
      this.insertNode = this.wrapCommand((node) => {
        if (this.isLimited($(node).text().length)) {
          return;
        }
        const rng = this.getLastRange();
        rng.insertNode(node);
        this.setLastRange(range.createFromNodeAfter(node).select());
      });
      this.insertText = this.wrapCommand((text) => {
        if (this.isLimited(text.length)) {
          return;
        }
        const rng = this.getLastRange();
        const textNode = rng.insertNode(dom.createText(text));
        this.setLastRange(range.create(textNode, dom.nodeLength(textNode)).select());
      });
      this.pasteHTML = this.wrapCommand((markup) => {
        if (this.isLimited(markup.length)) {
          return;
        }
        markup = this.context.invoke("codeview.purify", markup);
        const contents = this.getLastRange().pasteHTML(markup);
        this.setLastRange(range.createFromNodeAfter(lists.last(contents)).select());
      });
      this.formatBlock = this.wrapCommand((tagName, $target) => {
        const onApplyCustomStyle = this.options.callbacks.onApplyCustomStyle;
        if (onApplyCustomStyle) {
          onApplyCustomStyle.call(this, $target, this.context, this.onFormatBlock);
        } else {
          this.onFormatBlock(tagName, $target);
        }
      });
      this.insertHorizontalRule = this.wrapCommand(() => {
        const hrNode = this.getLastRange().insertNode(dom.create("HR"));
        if (hrNode.nextSibling) {
          this.setLastRange(range.create(hrNode.nextSibling, 0).normalize().select());
        }
      });
      this.lineHeight = this.wrapCommand((value2) => {
        this.style.stylePara(this.getLastRange(), {
          lineHeight: value2
        });
      });
      this.createLink = this.wrapCommand((linkInfo) => {
        let rel = [];
        let linkUrl = linkInfo.url;
        const linkText = linkInfo.text;
        const isNewWindow = linkInfo.isNewWindow;
        const addNoReferrer = this.options.linkAddNoReferrer;
        const addNoOpener = this.options.linkAddNoOpener;
        let rng = linkInfo.range || this.getLastRange();
        const additionalTextLength = linkText.length - rng.toString().length;
        if (additionalTextLength > 0 && this.isLimited(additionalTextLength)) {
          return;
        }
        const isTextChanged = rng.toString() !== linkText;
        if (typeof linkUrl === "string") {
          linkUrl = linkUrl.trim();
        }
        if (this.options.onCreateLink) {
          linkUrl = this.options.onCreateLink(linkUrl);
        } else {
          linkUrl = this.checkLinkUrl(linkUrl);
        }
        let anchors = [];
        if (isTextChanged) {
          rng = rng.deleteContents();
          const anchor = rng.insertNode($("<A></A>").text(linkText)[0]);
          anchors.push(anchor);
        } else {
          anchors = this.style.styleNodes(rng, {
            nodeName: "A",
            expandClosestSibling: true,
            onlyPartialContains: true
          });
        }
        $.each(anchors, (idx, anchor) => {
          $(anchor).attr("href", linkUrl);
          if (isNewWindow) {
            $(anchor).attr("target", "_blank");
            if (addNoReferrer) {
              rel.push("noreferrer");
            }
            if (addNoOpener) {
              rel.push("noopener");
            }
            if (rel.length) {
              $(anchor).attr("rel", rel.join(" "));
            }
          } else {
            $(anchor).removeAttr("target");
          }
        });
        this.setLastRange(
            this.createRangeFromList(anchors).select()
        );
      });
      this.color = this.wrapCommand((colorInfo) => {
        const foreColor = colorInfo.foreColor;
        const backColor = colorInfo.backColor;
        if (foreColor) {
          document.execCommand("foreColor", false, foreColor);
        }
        if (backColor) {
          document.execCommand("backColor", false, backColor);
        }
      });
      this.foreColor = this.wrapCommand((colorInfo) => {
        document.execCommand("foreColor", false, colorInfo);
      });
      this.insertTable = this.wrapCommand((dim) => {
        const dimension = dim.split("x");
        const rng = this.getLastRange().deleteContents();
        rng.insertNode(this.table.createTable(dimension[0], dimension[1], this.options));
      });
      this.removeMedia = this.wrapCommand(() => {
        let $target = $(this.restoreTarget()).parent();
        if ($target.closest("figure").length) {
          $target.closest("figure").remove();
        } else if ($target.is("picture")) {
          $target.remove();
        } else {
          $target = $(this.restoreTarget()).detach();
        }
        this.setLastRange(range.createFromSelection($target).select());
        this.context.triggerEvent("media.delete", $target, this.$editable);
      });
      this.floatMe = this.wrapCommand((value2) => {
        const $target = $(this.restoreTarget());
        $target.toggleClass("note-float-left", value2 === "left");
        $target.toggleClass("note-float-right", value2 === "right");
        $target.css("float", value2 === "none" ? "" : value2);
      });
      this.resize = this.wrapCommand((value2) => {
        const $target = $(this.restoreTarget());
        value2 = parseFloat(value2);
        if (value2 === 0) {
          $target.css("width", "");
        } else {
          $target.css({
            width: value2 * 100 + "%",
            height: ""
          });
        }
      });
    }
    initialize() {
      this.$editable.on("keydown", (event2) => {
        if (event2.keyCode === key.code.ENTER) {
          this.context.triggerEvent("enter", event2);
        }
        this.context.triggerEvent("keydown", event2);
        this.snapshot = this.history.makeSnapshot();
        this.hasKeyShortCut = false;
        if (!event2.isDefaultPrevented()) {
          if (this.options.shortcuts) {
            this.hasKeyShortCut = this.handleKeyMap(event2);
          } else {
            this.preventDefaultEditableShortCuts(event2);
          }
        }
        if (this.isLimited(1, event2)) {
          const lastRange = this.getLastRange();
          if (lastRange.eo - lastRange.so === 0) {
            return false;
          }
        }
        this.setLastRange();
        if (this.options.recordEveryKeystroke) {
          if (this.hasKeyShortCut === false) {
            this.history.recordUndo();
          }
        }
      }).on("keyup", (event2) => {
        this.setLastRange();
        this.context.triggerEvent("keyup", event2);
      }).on("focus", (event2) => {
        this.setLastRange();
        this.context.triggerEvent("focus", event2);
      }).on("blur", (event2) => {
        this.context.triggerEvent("blur", event2);
      }).on("mousedown", (event2) => {
        this.context.triggerEvent("mousedown", event2);
      }).on("mouseup", (event2) => {
        this.setLastRange();
        this.history.recordUndo();
        this.context.triggerEvent("mouseup", event2);
      }).on("scroll", (event2) => {
        this.context.triggerEvent("scroll", event2);
      }).on("paste", (event2) => {
        this.setLastRange();
        this.context.triggerEvent("paste", event2);
      }).on("copy", (event2) => {
        this.context.triggerEvent("copy", event2);
      }).on("input", () => {
        if (this.isLimited(0) && this.snapshot) {
          this.history.applySnapshot(this.snapshot);
        }
      });
      this.$editable.attr("spellcheck", this.options.spellCheck);
      this.$editable.attr("autocorrect", this.options.spellCheck);
      if (this.options.disableGrammar) {
        this.$editable.attr("data-gramm", false);
      }
      this.$editable.html(dom.html(this.$note) || dom.emptyPara);
      this.$editable.on(env.inputEventName, func.debounce(() => {
        this.context.triggerEvent("change", this.$editable.html(), this.$editable);
      }, 10));
      this.$editable.on("focusin", (event2) => {
        this.context.triggerEvent("focusin", event2);
      }).on("focusout", (event2) => {
        this.context.triggerEvent("focusout", event2);
      });
      if (this.options.airMode) {
        if (this.options.overrideContextMenu) {
          this.$editor.on("contextmenu", (event2) => {
            this.context.triggerEvent("contextmenu", event2);
            return false;
          });
        }
      } else {
        if (this.options.width) {
          this.$editor.outerWidth(this.options.width);
        }
        if (this.options.height) {
          this.$editable.outerHeight(this.options.height);
        }
        if (this.options.maxHeight) {
          this.$editable.css("max-height", this.options.maxHeight);
        }
        if (this.options.minHeight) {
          this.$editable.css("min-height", this.options.minHeight);
        }
      }
      this.history.recordUndo();
      this.setLastRange();
    }
    destroy() {
      this.$editable.off();
    }
    handleKeyMap(event2) {
      const keyMap = this.options.keyMap[env.isMac ? "mac" : "pc"];
      const keys = [];
      if (event2.metaKey) {
        keys.push("CMD");
      }
      if (event2.ctrlKey && !event2.altKey) {
        keys.push("CTRL");
      }
      if (event2.shiftKey) {
        keys.push("SHIFT");
      }
      const keyName = key.nameFromCode[event2.keyCode];
      if (keyName) {
        keys.push(keyName);
      }
      const eventName = keyMap[keys.join("+")];
      if (keyName === "TAB" && !this.options.tabDisable) {
        this.afterCommand();
      } else if (eventName) {
        if (this.context.invoke(eventName) !== false) {
          event2.preventDefault();
          return true;
        }
      } else if (key.isEdit(event2.keyCode)) {
        if (key.isRemove(event2.keyCode)) {
          this.context.invoke("removed");
        }
        this.afterCommand();
      }
      return false;
    }
    preventDefaultEditableShortCuts(event2) {
      if ((event2.ctrlKey || event2.metaKey) && lists.contains([66, 73, 85], event2.keyCode)) {
        event2.preventDefault();
      }
    }
    isLimited(pad, event2) {
      pad = pad || 0;
      if (typeof event2 !== "undefined") {
        if (key.isMove(event2.keyCode) || key.isNavigation(event2.keyCode) || (event2.ctrlKey || event2.metaKey) || lists.contains([key.code.BACKSPACE, key.code.DELETE], event2.keyCode)) {
          return false;
        }
      }
      if (this.options.maxTextLength > 0) {
        if (this.$editable.text().length + pad > this.options.maxTextLength) {
          return true;
        }
      }
      return false;
    }
    checkLinkUrl(linkUrl) {
      if (MAILTO_PATTERN$1.test(linkUrl)) {
        return "mailto://" + linkUrl;
      } else if (TEL_PATTERN$1.test(linkUrl)) {
        return "tel://" + linkUrl;
      } else if (!URL_SCHEME_PATTERN$1.test(linkUrl)) {
        return "http://" + linkUrl;
      }
      return linkUrl;
    }
    /**
     * create range
     * @return {WrappedRange}
     */
    createRange() {
      this.focus();
      this.setLastRange();
      return this.getLastRange();
    }
    /**
     * create a new range from the list of elements
     *
     * @param {list} dom element list
     * @return {WrappedRange}
     */
    createRangeFromList(lst) {
      const startRange = range.createFromNodeBefore(lists.head(lst));
      const startPoint = startRange.getStartPoint();
      const endRange = range.createFromNodeAfter(lists.last(lst));
      const endPoint = endRange.getEndPoint();
      return range.create(
          startPoint.node,
          startPoint.offset,
          endPoint.node,
          endPoint.offset
      );
    }
    /**
     * set the last range
     *
     * if given rng is exist, set rng as the last range
     * or create a new range at the end of the document
     *
     * @param {WrappedRange} rng
     */
    setLastRange(rng) {
      if (rng) {
        this.lastRange = rng;
      } else {
        this.lastRange = range.create(this.editable);
        if ($(this.lastRange.sc).closest(".note-editable").length === 0) {
          this.lastRange = range.createFromBodyElement(this.editable);
        }
      }
    }
    /**
     * get the last range
     *
     * if there is a saved last range, return it
     * or create a new range and return it
     *
     * @return {WrappedRange}
     */
    getLastRange() {
      if (!this.lastRange) {
        this.setLastRange();
      }
      return this.lastRange;
    }
    /**
     * saveRange
     *
     * save current range
     *
     * @param {Boolean} [thenCollapse=false]
     */
    saveRange(thenCollapse) {
      if (thenCollapse) {
        this.getLastRange().collapse().select();
      }
    }
    /**
     * restoreRange
     *
     * restore lately range
     */
    restoreRange() {
      if (this.lastRange) {
        this.lastRange.select();
        this.focus();
      }
    }
    saveTarget(node) {
      this.$editable.data("target", node);
    }
    clearTarget() {
      this.$editable.removeData("target");
    }
    restoreTarget() {
      return this.$editable.data("target");
    }
    /**
     * currentStyle
     *
     * current style
     * @return {Object|Boolean} unfocus
     */
    currentStyle() {
      let rng = range.create();
      if (rng) {
        rng = rng.normalize();
      }
      return rng ? this.style.current(rng) : this.style.fromNode(this.$editable);
    }
    /**
     * style from node
     *
     * @param {jQuery} $node
     * @return {Object}
     */
    styleFromNode($node) {
      return this.style.fromNode($node);
    }
    /**
     * undo
     */
    undo() {
      this.context.triggerEvent("before.command", this.$editable.html());
      this.history.undo();
      this.context.triggerEvent("change", this.$editable.html(), this.$editable);
    }
    /*
    * commit
    */
    commit() {
      this.context.triggerEvent("before.command", this.$editable.html());
      this.history.commit();
      this.context.triggerEvent("change", this.$editable.html(), this.$editable);
    }
    /**
     * redo
     */
    redo() {
      this.context.triggerEvent("before.command", this.$editable.html());
      this.history.redo();
      this.context.triggerEvent("change", this.$editable.html(), this.$editable);
    }
    /**
     * before command
     */
    beforeCommand() {
      this.context.triggerEvent("before.command", this.$editable.html());
      document.execCommand("styleWithCSS", false, this.options.styleWithCSS);
      this.focus();
    }
    /**
     * after command
     * @param {Boolean} isPreventTrigger
     */
    afterCommand(isPreventTrigger) {
      this.normalizeContent();
      this.history.recordUndo();
      if (!isPreventTrigger) {
        this.context.triggerEvent("change", this.$editable.html(), this.$editable);
      }
    }
    /**
     * handle tab key
     */
    tab() {
      const rng = this.getLastRange();
      if (rng.isCollapsed() && rng.isOnCell()) {
        this.table.tab(rng);
      } else {
        if (this.options.tabSize === 0) {
          return false;
        }
        if (!this.isLimited(this.options.tabSize)) {
          this.beforeCommand();
          this.typing.insertTab(rng, this.options.tabSize);
          this.afterCommand();
        }
      }
    }
    /**
     * handle shift+tab key
     */
    untab() {
      const rng = this.getLastRange();
      if (rng.isCollapsed() && rng.isOnCell()) {
        this.table.tab(rng, true);
      } else {
        if (this.options.tabSize === 0) {
          return false;
        }
      }
    }
    /**
     * run given function between beforeCommand and afterCommand
     */
    wrapCommand(fn) {
      return function() {
        this.beforeCommand();
        fn.apply(this, arguments);
        this.afterCommand();
      };
    }
    /**
     * removed (function added by 1der1)
     */
    removed(rng, node, tagName) {
      rng = range.create();
      if (rng.isCollapsed() && rng.isOnCell()) {
        node = rng.ec;
        if ((tagName = node.tagName) && node.childElementCount === 1 && node.childNodes[0].tagName === "BR") {
          if (tagName === "P") {
            node.remove();
          } else if (["TH", "TD"].indexOf(tagName) >= 0) {
            node.firstChild.remove();
          }
        }
      }
    }
    /**
     * insert image
     *
     * @param {String} src
     * @param {String|Function} param
     * @return {Promise}
     */
    insertImage(src, param, imageId, srcsets) {
      var imagePromise = srcsets ? createPicture(src, param, imageId, srcsets) : createImage(src, param, imageId);
      return imagePromise.then(($image) => {
        this.beforeCommand();
        if (typeof param === "function") {
          param($image);
        } else {
          if (typeof param === "string") {
            $image.attr("data-filename", param);
          }
          if (!srcsets) {
            $image.css("width", Math.min(this.$editable.width(), $image.width()));
          }
        }
        $image.show();
        this.getLastRange().insertNode($image[0]);
        this.setLastRange(range.createFromNodeAfter($image[0]).select());
        this.afterCommand();
      }).fail((e) => {
        this.context.triggerEvent("image.upload.error", e);
      });
    }
    /**
     * insertImages
     * @param {File[]} files
     */
    insertImagesAsDataURL(files) {
      $.each(files, (idx, file) => {
        const filename = file.name;
        if (this.options.maximumImageFileSize && this.options.maximumImageFileSize < file.size) {
          this.context.triggerEvent("image.upload.error", this.lang.image.maximumFileSizeError);
        } else {
          readFileAsDataURL(file).then((dataURL) => {
            return this.insertImage(dataURL, filename);
          }).fail(() => {
            this.context.triggerEvent("image.upload.error");
          });
        }
      });
    }
    /**
     * insertImagesOrCallback
     * @param {File[]} files
     */
    insertImagesOrCallback(files) {
      const callbacks = this.options.callbacks;
      if (callbacks.onImageUpload) {
        this.context.triggerEvent("image.upload", files);
      } else {
        this.insertImagesAsDataURL(files);
      }
    }
    /**
     * return selected plain text
     * @return {String} text
     */
    getSelectedText() {
      let rng = this.getLastRange();
      if (rng.isOnAnchor()) {
        rng = range.createFromNode(dom.ancestor(rng.sc, dom.isAnchor));
      }
      return rng.toString();
    }
    onFormatBlock(tagName, $target) {
      document.execCommand("FormatBlock", false, env.isMSIE ? "<" + tagName + ">" : tagName);
      if ($target && $target.length) {
        if ($target[0].tagName.toUpperCase() !== tagName.toUpperCase()) {
          $target = $target.find(tagName);
        }
        if ($target && $target.length) {
          const currentRange = this.createRange();
          const $parent = $([currentRange.sc, currentRange.ec]).closest(tagName);
          $parent.removeClass();
          const className = $target[0].className || "";
          if (className) {
            $parent.addClass(className);
          }
        }
      }
    }
    formatPara() {
      this.formatBlock("P");
    }
    fontStyling(target, value2) {
      const rng = this.getLastRange();
      if (rng !== "") {
        const spans = this.style.styleNodes(rng);
        this.$editor.find(".note-status-output").html("");
        $(spans).css(target, value2);
        if (rng.isCollapsed()) {
          const firstSpan = lists.head(spans);
          if (firstSpan && !dom.nodeLength(firstSpan)) {
            firstSpan.innerHTML = dom.ZERO_WIDTH_NBSP_CHAR;
            range.createFromNode(firstSpan.firstChild).select();
            this.setLastRange();
            this.$editable.data(KEY_BOGUS, firstSpan);
          }
        } else {
          rng.select();
        }
      } else {
        const noteStatusOutput = $.now();
        this.$editor.find(".note-status-output").html('<div id="note-status-output-' + noteStatusOutput + '" class="alert alert-info">' + this.lang.output.noSelection + "</div>");
        setTimeout(function() {
          $("#note-status-output-" + noteStatusOutput).remove();
        }, 5e3);
      }
    }
    /**
     * unlink
     *
     * @type command
     */
    unlink() {
      let rng = this.getLastRange();
      if (rng.isOnAnchor()) {
        const anchor = dom.ancestor(rng.sc, dom.isAnchor);
        rng = range.createFromNode(anchor);
        rng.select();
        this.setLastRange();
        this.beforeCommand();
        document.execCommand("unlink");
        this.afterCommand();
      }
    }
    /**
     * returns link info
     *
     * @return {Object}
     * @return {WrappedRange} return.range
     * @return {String} return.text
     * @return {Boolean} [return.isNewWindow=true]
     * @return {String} [return.url=""]
     */
    getLinkInfo() {
      if (!this.hasFocus()) {
        this.focus();
      }
      const rng = this.getLastRange().expand(dom.isAnchor);
      const $anchor = $(lists.head(rng.nodes(dom.isAnchor)));
      const linkInfo = {
        range: rng,
        text: rng.toString(),
        url: $anchor.length ? $anchor.attr("href") : ""
      };
      if ($anchor.length) {
        linkInfo.isNewWindow = $anchor.attr("target") === "_blank";
      }
      return linkInfo;
    }
    addRow(position2) {
      const rng = this.getLastRange(this.$editable);
      if (rng.isCollapsed() && rng.isOnCell()) {
        this.beforeCommand();
        this.table.addRow(rng, position2);
        this.afterCommand();
      }
    }
    addCol(position2) {
      const rng = this.getLastRange(this.$editable);
      if (rng.isCollapsed() && rng.isOnCell()) {
        this.beforeCommand();
        this.table.addCol(rng, position2);
        this.afterCommand();
      }
    }
    deleteRow() {
      const rng = this.getLastRange(this.$editable);
      if (rng.isCollapsed() && rng.isOnCell()) {
        this.beforeCommand();
        this.table.deleteRow(rng);
        this.afterCommand();
      }
    }
    deleteCol() {
      const rng = this.getLastRange(this.$editable);
      if (rng.isCollapsed() && rng.isOnCell()) {
        this.beforeCommand();
        this.table.deleteCol(rng);
        this.afterCommand();
      }
    }
    deleteTable() {
      const rng = this.getLastRange(this.$editable);
      if (rng.isCollapsed() && rng.isOnCell()) {
        this.beforeCommand();
        this.table.deleteTable(rng);
        this.afterCommand();
      }
    }
    /**
     * @param {Position} pos
     * @param {jQuery} $target - target element
     * @param {Boolean} [bKeepRatio] - keep ratio
     */
    resizeTo(pos, $target, bKeepRatio) {
      let imageSize;
      if (bKeepRatio) {
        const newRatio = pos.y / pos.x;
        const ratio = $target.data("ratio");
        imageSize = {
          width: ratio > newRatio ? pos.x : pos.y / ratio,
          height: ratio > newRatio ? pos.x * ratio : pos.y
        };
      } else {
        imageSize = {
          width: pos.x,
          height: pos.y
        };
      }
      $target.css(imageSize);
    }
    /**
     * returns whether editable area has focus or not.
     */
    hasFocus() {
      return this.$editable.is(":focus");
    }
    /**
     * set focus
     */
    focus() {
      if (!this.hasFocus()) {
        this.$editable.trigger("focus");
      }
    }
    /**
     * returns whether contents is empty or not.
     * @return {Boolean}
     */
    isEmpty() {
      return dom.isEmpty(this.$editable[0]) || dom.emptyPara === this.$editable.html();
    }
    /**
     * Removes all contents and restores the editable instance to an _emptyPara_.
     */
    empty() {
      this.context.invoke("code", dom.emptyPara);
    }
    /**
     * normalize content
     */
    normalizeContent() {
      this.$editable[0].normalize();
    }
  }
  class Clipboard {
    constructor(context) {
      this.context = context;
      this.options = context.options;
      this.$editable = context.layoutInfo.editable;
    }
    initialize() {
      this.$editable.on("paste", this.pasteByEvent.bind(this));
    }
    /**
     * paste by clipboard event
     *
     * @param {Event} event
     */
    pasteByEvent(event2) {
      if (this.context.isDisabled()) {
        return;
      }
      const clipboardData = event2.originalEvent.clipboardData;
      if (clipboardData && clipboardData.items && clipboardData.items.length) {
        const clipboardFiles = clipboardData.files;
        const clipboardText = clipboardData.getData("Text");
        if (clipboardFiles.length > 0 && this.options.allowClipboardImagePasting) {
          this.context.invoke("editor.insertImagesOrCallback", clipboardFiles);
          event2.preventDefault();
        }
        if (clipboardText.length > 0 && this.context.invoke("editor.isLimited", clipboardText.length)) {
          event2.preventDefault();
        }
      } else if (window.clipboardData) {
        let text = window.clipboardData.getData("text");
        if (this.context.invoke("editor.isLimited", text.length)) {
          event2.preventDefault();
        }
      }
      setTimeout(() => {
        this.context.invoke("editor.afterCommand");
      }, 10);
    }
  }
  class Dropzone {
    constructor(context) {
      this.context = context;
      this.$eventListener = $(document);
      this.$editor = context.layoutInfo.editor;
      this.$editable = context.layoutInfo.editable;
      this.options = context.options;
      this.lang = this.options.langInfo;
      this.documentEventHandlers = {};
      this.$dropzone = $([
        '<div class="note-dropzone">',
        '<div class="note-dropzone-message"></div>',
        "</div>"
      ].join("")).prependTo(this.$editor);
    }
    /**
     * attach Drag and Drop Events
     */
    initialize() {
      if (this.options.disableDragAndDrop) {
        this.documentEventHandlers.onDrop = (e) => {
          e.preventDefault();
        };
        this.$eventListener = this.$dropzone;
        this.$eventListener.on("drop", this.documentEventHandlers.onDrop);
      } else {
        this.attachDragAndDropEvent();
      }
    }
    isTextContent(event2) {
      return event2.originalEvent.dataTransfer.types.some((type) => type === "text/html" || type === "text/plain");
    }
    /**
     * attach Drag and Drop Events
     */
    attachDragAndDropEvent() {
      let collection = $();
      const $dropzoneMessage = this.$dropzone.find(".note-dropzone-message");
      this.documentEventHandlers.onDragenter = (e) => {
        if (this.isTextContent(e)) {
          return;
        }
        const isCodeview = this.context.invoke("codeview.isActivated");
        const hasEditorSize = this.$editor.width() > 0 && this.$editor.height() > 0;
        if (!isCodeview && !collection.length && hasEditorSize) {
          this.$editor.addClass("dragover");
          this.$dropzone.width(this.$editor.width());
          this.$dropzone.height(this.$editor.height());
          $dropzoneMessage.text(this.lang.image.dragImageHere);
        }
        collection = collection.add(e.target);
      };
      this.documentEventHandlers.onDragleave = (e) => {
        collection = collection.not(e.target);
        if (!collection.length || e.target.nodeName === "BODY") {
          collection = $();
          this.$editor.removeClass("dragover");
        }
      };
      this.documentEventHandlers.onDrop = () => {
        collection = $();
        this.$editor.removeClass("dragover");
      };
      this.$eventListener.on("dragenter", this.documentEventHandlers.onDragenter).on("dragleave", this.documentEventHandlers.onDragleave).on("drop", this.documentEventHandlers.onDrop);
      this.$dropzone.on("dragenter", (event2) => {
        if (this.isTextContent(event2)) {
          return;
        }
        this.$dropzone.addClass("hover");
        $dropzoneMessage.text(this.lang.image.dropImage);
      }).on("dragleave", () => {
        if (this.isTextContent(event)) {
          return;
        }
        this.$dropzone.removeClass("hover");
        $dropzoneMessage.text(this.lang.image.dragImageHere);
      });
      this.$dropzone.on("drop", (event2) => {
        if (this.isTextContent(event2)) {
          return;
        }
        const dataTransfer = event2.originalEvent.dataTransfer;
        event2.preventDefault();
        if (dataTransfer && dataTransfer.files && dataTransfer.files.length) {
          this.$editable.trigger("focus");
          this.context.invoke("editor.insertImagesOrCallback", dataTransfer.files);
        } else {
          $.each(dataTransfer.types, (idx, type) => {
            if (type.toLowerCase().indexOf("_moz_") > -1) {
              return;
            }
            const content = dataTransfer.getData(type);
            if (type.toLowerCase().indexOf("text") > -1) {
              this.context.invoke("editor.pasteHTML", content);
            } else {
              $(content).each((idx2, item) => {
                this.context.invoke("editor.insertNode", item);
              });
            }
          });
        }
      }).on("dragover", false);
    }
    destroy() {
      Object.keys(this.documentEventHandlers).forEach((key2) => {
        this.$eventListener.off(key2.slice(2).toLowerCase(), this.documentEventHandlers[key2]);
      });
      this.documentEventHandlers = {};
    }
  }
  class CodeView {
    constructor(context) {
      this.context = context;
      this.$editor = context.layoutInfo.editor;
      this.$editable = context.layoutInfo.editable;
      this.$codable = context.layoutInfo.codable;
      this.options = context.options;
      this.CodeMirrorConstructor = window.CodeMirror;
      if (this.options.codemirror.CodeMirrorConstructor) {
        this.CodeMirrorConstructor = this.options.codemirror.CodeMirrorConstructor;
      }
    }
    sync(html2) {
      const isCodeview = this.isActivated();
      const CodeMirror = this.CodeMirrorConstructor;
      if (isCodeview) {
        if (html2) {
          if (CodeMirror) {
            this.$codable.data("cmEditor").getDoc().setValue(html2);
          } else {
            this.$codable.val(html2);
          }
        } else {
          if (CodeMirror) {
            this.$codable.data("cmEditor").save();
          }
        }
      }
    }
    initialize() {
      this.$codable.on("keyup", (event2) => {
        if (event2.keyCode === key.code.ESCAPE) {
          this.deactivate();
        }
      });
    }
    /**
     * @return {Boolean}
     */
    isActivated() {
      return this.$editor.hasClass("codeview");
    }
    /**
     * toggle codeview
     */
    toggle() {
      if (this.isActivated()) {
        this.deactivate();
      } else {
        this.activate();
      }
      this.context.triggerEvent("codeview.toggled");
    }
    /**
     * purify input value
     * @param value
     * @returns {*}
     */
    purify(value2) {
      if (this.options.codeviewFilter) {
        value2 = value2.replace(this.options.codeviewFilterRegex, "");
        if (this.options.codeviewIframeFilter) {
          const whitelist = this.options.codeviewIframeWhitelistSrc.concat(this.options.codeviewIframeWhitelistSrcBase);
          value2 = value2.replace(/(<iframe.*?>.*?(?:<\/iframe>)?)/gi, function(tag) {
            if (/<.+src(?==?('|"|\s)?)[\s\S]+src(?=('|"|\s)?)[^>]*?>/i.test(tag)) {
              return "";
            }
            for (const src of whitelist) {
              if (new RegExp('src="(https?:)?//' + src.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + '/(.+)"').test(tag)) {
                return tag;
              }
            }
            return "";
          });
        }
      }
      return value2;
    }
    /**
     * activate code view
     */
    activate() {
      const CodeMirror = this.CodeMirrorConstructor;
      this.$codable.val(dom.html(this.$editable, this.options.prettifyHtml));
      this.$codable.height(this.$editable.height());
      this.context.invoke("toolbar.updateCodeview", true);
      this.context.invoke("airPopover.updateCodeview", true);
      this.$editor.addClass("codeview");
      this.$codable.trigger("focus");
      if (CodeMirror) {
        const cmEditor = CodeMirror.fromTextArea(this.$codable[0], this.options.codemirror);
        if (this.options.codemirror.tern) {
          const server = new CodeMirror.TernServer(this.options.codemirror.tern);
          cmEditor.ternServer = server;
          cmEditor.on("cursorActivity", (cm) => {
            server.updateArgHints(cm);
          });
        }
        cmEditor.on("blur", (event2) => {
          this.context.triggerEvent("blur.codeview", cmEditor.getValue(), event2);
        });
        cmEditor.on("change", () => {
          this.context.triggerEvent("change.codeview", cmEditor.getValue(), cmEditor);
        });
        cmEditor.setSize(null, this.$editable.outerHeight());
        this.$codable.data("cmEditor", cmEditor);
      } else {
        this.$codable.on("blur", (event2) => {
          this.context.triggerEvent("blur.codeview", this.$codable.val(), event2);
        });
        this.$codable.on("input", () => {
          this.context.triggerEvent("change.codeview", this.$codable.val(), this.$codable);
        });
      }
    }
    /**
     * deactivate code view
     */
    deactivate() {
      const CodeMirror = this.CodeMirrorConstructor;
      if (CodeMirror) {
        const cmEditor = this.$codable.data("cmEditor");
        this.$codable.val(cmEditor.getValue());
        cmEditor.toTextArea();
      }
      const value2 = this.purify(dom.value(this.$codable, this.options.prettifyHtml) || dom.emptyPara);
      const isChange = this.$editable.html() !== value2;
      this.$editable.html(value2);
      this.$editable.height(this.options.height ? this.$codable.height() : "auto");
      this.$editor.removeClass("codeview");
      if (isChange) {
        this.context.triggerEvent("change", this.$editable.html(), this.$editable);
      }
      this.$editable.trigger("focus");
      this.context.invoke("toolbar.updateCodeview", false);
      this.context.invoke("airPopover.updateCodeview", false);
    }
    destroy() {
      if (this.isActivated()) {
        this.deactivate();
      }
    }
  }
  const EDITABLE_PADDING = 24;
  class Statusbar {
    constructor(context) {
      this.$document = $(document);
      this.$statusbar = context.layoutInfo.statusbar;
      this.$editable = context.layoutInfo.editable;
      this.$codable = context.layoutInfo.codable;
      this.options = context.options;
    }
    initialize() {
      if (this.options.airMode || this.options.disableResizeEditor) {
        this.destroy();
        return;
      }
      this.$statusbar.on("mousedown touchstart", (event2) => {
        event2.preventDefault();
        event2.stopPropagation();
        const editableTop = this.$editable.offset().top - this.$document.scrollTop();
        const editableCodeTop = this.$codable.offset().top - this.$document.scrollTop();
        const onStatusbarMove = (event3) => {
          let originalEvent = event3.type == "mousemove" ? event3 : event3.originalEvent.touches[0];
          let height = originalEvent.clientY - (editableTop + EDITABLE_PADDING);
          let heightCode = originalEvent.clientY - (editableCodeTop + EDITABLE_PADDING);
          height = this.options.minheight > 0 ? Math.max(height, this.options.minheight) : height;
          height = this.options.maxHeight > 0 ? Math.min(height, this.options.maxHeight) : height;
          heightCode = this.options.minheight > 0 ? Math.max(heightCode, this.options.minheight) : heightCode;
          heightCode = this.options.maxHeight > 0 ? Math.min(heightCode, this.options.maxHeight) : heightCode;
          this.$editable.height(height);
          this.$codable.height(heightCode);
        };
        this.$document.on("mousemove touchmove", onStatusbarMove).one("mouseup touchend", () => {
          this.$document.off("mousemove touchmove", onStatusbarMove);
        });
      });
    }
    destroy() {
      this.$statusbar.off();
      this.$statusbar.addClass("locked");
    }
  }
  class Fullscreen {
    constructor(context) {
      this.context = context;
      this.$editor = context.layoutInfo.editor;
      this.$toolbar = context.layoutInfo.toolbar;
      this.$editable = context.layoutInfo.editable;
      this.$codable = context.layoutInfo.codable;
      this.$window = $(window);
      this.$scrollbar = $("html, body");
      this.scrollbarClassName = "note-fullscreen-body";
      this.onResize = () => {
        this.resizeTo({
          h: this.$window.height() - this.$toolbar.outerHeight()
        });
      };
    }
    resizeTo(size) {
      this.$editable.css("height", size.h);
      this.$codable.css("height", size.h);
      if (this.$codable.data("cmeditor")) {
        this.$codable.data("cmeditor").setsize(null, size.h);
      }
    }
    /**
     * toggle fullscreen
     */
    toggle() {
      this.$editor.toggleClass("fullscreen");
      const isFullscreen = this.isFullscreen();
      this.$scrollbar.toggleClass(this.scrollbarClassName, isFullscreen);
      if (isFullscreen) {
        this.$editable.data("orgHeight", this.$editable.css("height"));
        this.$editable.data("orgMaxHeight", this.$editable.css("maxHeight"));
        this.$editable.css("maxHeight", "");
        this.$window.on("resize", this.onResize).trigger("resize");
      } else {
        this.$window.off("resize", this.onResize);
        this.resizeTo({ h: this.$editable.data("orgHeight") });
        this.$editable.css("maxHeight", this.$editable.css("orgMaxHeight"));
      }
      this.context.invoke("toolbar.updateFullscreen", isFullscreen);
    }
    isFullscreen() {
      return this.$editor.hasClass("fullscreen");
    }
    destroy() {
      this.$scrollbar.removeClass(this.scrollbarClassName);
    }
  }
  class Handle {
    constructor(context) {
      this.context = context;
      this.$document = $(document);
      this.$editingArea = context.layoutInfo.editingArea;
      this.options = context.options;
      this.lang = this.options.langInfo;
      this.events = {
        "summernote.mousedown": (we, e) => {
          if (this.update(e.target, e)) {
            e.preventDefault();
          }
        },
        "summernote.keyup summernote.scroll summernote.change summernote.dialog.shown": () => {
          this.update();
        },
        "summernote.disable summernote.blur": () => {
          this.hide();
        },
        "summernote.codeview.toggled": () => {
          this.update();
        }
      };
    }
    initialize() {
      this.$handle = $([
        '<div class="note-handle">',
        '<div class="note-control-selection">',
        '<div class="note-control-selection-bg"></div>',
        '<div class="note-control-holder note-control-nw"></div>',
        '<div class="note-control-holder note-control-ne"></div>',
        '<div class="note-control-holder note-control-sw"></div>',
        '<div class="',
        this.options.disableResizeImage ? "note-control-holder" : "note-control-sizing",
        ' note-control-se"></div>',
        this.options.disableResizeImage ? "" : '<div class="note-control-selection-info"></div>',
        "</div>",
        "</div>"
      ].join("")).prependTo(this.$editingArea);
      this.$handle.on("mousedown", (event2) => {
        if (dom.isControlSizing(event2.target)) {
          event2.preventDefault();
          event2.stopPropagation();
          const $target = this.$handle.find(".note-control-selection").data("target");
          const posStart = $target.offset();
          const scrollTop = this.$document.scrollTop();
          const onMouseMove = (event3) => {
            this.context.invoke("editor.resizeTo", {
              x: event3.clientX - posStart.left,
              y: event3.clientY - (posStart.top - scrollTop)
            }, $target, !event3.shiftKey);
            this.update($target[0], event3);
          };
          this.$document.on("mousemove", onMouseMove).one("mouseup", (e) => {
            e.preventDefault();
            this.$document.off("mousemove", onMouseMove);
            this.context.invoke("editor.afterCommand");
          });
          if (!$target.data("ratio")) {
            $target.data("ratio", $target.height() / $target.width());
          }
        }
      });
      this.$handle.on("wheel", (event2) => {
        event2.preventDefault();
        this.update();
      });
    }
    destroy() {
      this.$handle.remove();
    }
    update(target, event2) {
      if (this.context.isDisabled()) {
        return false;
      }
      const isImage = dom.isImg(target);
      const $selection = this.$handle.find(".note-control-selection");
      this.context.invoke("imagePopover.update", target, event2);
      if (isImage) {
        const $image = $(target);
        const areaRect = this.$editingArea[0].getBoundingClientRect();
        const imageRect = target.getBoundingClientRect();
        $selection.css({
          display: "block",
          left: imageRect.left - areaRect.left,
          top: imageRect.top - areaRect.top,
          width: imageRect.width,
          height: imageRect.height
        }).data("target", $image);
        const origImageObj = new Image();
        origImageObj.src = $image.attr("src");
        const sizingText = imageRect.width + "x" + imageRect.height + " (" + this.lang.image.original + ": " + origImageObj.width + "x" + origImageObj.height + ")";
        $selection.find(".note-control-selection-info").text(sizingText);
        this.context.invoke("editor.saveTarget", target);
      } else {
        this.hide();
      }
      return isImage;
    }
    /**
     * hide
     *
     * @param {jQuery} $handle
     */
    hide() {
      this.context.invoke("editor.clearTarget");
      this.$handle.children().hide();
    }
  }
  const defaultScheme = "http://";
  const linkPattern = /^([A-Za-z][A-Za-z0-9+-.]*\:[\/]{2}|tel:|mailto:[A-Z0-9._%+-]+@|xmpp:[A-Z0-9._%+-]+@)?(www\.)?(.+)$/i;
  class AutoLink {
    constructor(context) {
      this.context = context;
      this.options = context.options;
      this.$editable = context.layoutInfo.editable;
      this.events = {
        "summernote.keyup": (we, event2) => {
          if (!event2.isDefaultPrevented()) {
            this.handleKeyup(event2);
          }
        },
        "summernote.keydown": (we, event2) => {
          this.handleKeydown(event2);
        }
      };
    }
    initialize() {
      this.lastWordRange = null;
    }
    destroy() {
      this.lastWordRange = null;
    }
    replace() {
      if (!this.lastWordRange) {
        return;
      }
      const keyword = this.lastWordRange.toString();
      const match = keyword.match(linkPattern);
      if (match && (match[1] || match[2])) {
        const link = match[1] ? keyword : defaultScheme + keyword;
        const urlText = this.options.showDomainOnlyForAutolink ? keyword.replace(/^(?:https?:\/\/)?(?:tel?:?)?(?:mailto?:?)?(?:xmpp?:?)?(?:www\.)?/i, "").split("/")[0] : keyword;
        const node = $("<a></a>").html(urlText).attr("href", link)[0];
        if (this.context.options.linkTargetBlank) {
          $(node).attr("target", "_blank");
        }
        this.lastWordRange.insertNode(node);
        this.lastWordRange = null;
        this.context.invoke("editor.focus");
        this.context.triggerEvent("change", this.$editable.html(), this.$editable);
      }
    }
    handleKeydown(event2) {
      if (lists.contains([key.code.ENTER, key.code.SPACE], event2.keyCode)) {
        const wordRange = this.context.invoke("editor.createRange").getWordRange();
        this.lastWordRange = wordRange;
      }
    }
    handleKeyup(event2) {
      if (key.code.SPACE === event2.keyCode || key.code.ENTER === event2.keyCode && !event2.shiftKey) {
        this.replace();
      }
    }
  }
  class AutoSync {
    constructor(context) {
      this.$note = context.layoutInfo.note;
      this.events = {
        "summernote.change": () => {
          this.$note.val(context.invoke("code"));
        }
      };
    }
    shouldInitialize() {
      return dom.isTextarea(this.$note[0]);
    }
  }
  class AutoReplace {
    constructor(context) {
      this.context = context;
      this.options = context.options.replace || {};
      this.keys = [key.code.ENTER, key.code.SPACE, key.code.PERIOD, key.code.COMMA, key.code.SEMICOLON, key.code.SLASH];
      this.previousKeydownCode = null;
      this.events = {
        "summernote.keyup": (we, event2) => {
          if (!event2.isDefaultPrevented()) {
            this.handleKeyup(event2);
          }
        },
        "summernote.keydown": (we, event2) => {
          this.handleKeydown(event2);
        }
      };
    }
    shouldInitialize() {
      return !!this.options.match;
    }
    initialize() {
      this.lastWord = null;
    }
    destroy() {
      this.lastWord = null;
    }
    replace() {
      if (!this.lastWord) {
        return;
      }
      const self2 = this;
      const keyword = this.lastWord.toString();
      this.options.match(keyword, function(match) {
        if (match) {
          let node = "";
          if (typeof match === "string") {
            node = dom.createText(match);
          } else if (match instanceof jQuery) {
            node = match[0];
          } else if (match instanceof Node) {
            node = match;
          }
          if (!node) return;
          self2.lastWord.insertNode(node);
          self2.lastWord = null;
          self2.context.invoke("editor.focus");
        }
      });
    }
    handleKeydown(event2) {
      if (this.previousKeydownCode && lists.contains(this.keys, this.previousKeydownCode)) {
        this.previousKeydownCode = event2.keyCode;
        return;
      }
      if (lists.contains(this.keys, event2.keyCode)) {
        const wordRange = this.context.invoke("editor.createRange").getWordRange();
        this.lastWord = wordRange;
      }
      this.previousKeydownCode = event2.keyCode;
    }
    handleKeyup(event2) {
      if (lists.contains(this.keys, event2.keyCode)) {
        this.replace();
      }
    }
  }
  class Placeholder {
    constructor(context) {
      this.context = context;
      this.$editingArea = context.layoutInfo.editingArea;
      this.options = context.options;
      if (this.options.inheritPlaceholder === true) {
        this.options.placeholder = this.context.$note.attr("placeholder") || this.options.placeholder;
      }
      this.events = {
        "summernote.init summernote.change": () => {
          this.update();
        },
        "summernote.codeview.toggled": () => {
          this.update();
        }
      };
    }
    shouldInitialize() {
      return !!this.options.placeholder;
    }
    initialize() {
      this.$placeholder = $('<div class="note-placeholder"></div>');
      this.$placeholder.on("click", () => {
        this.context.invoke("focus");
      }).html(this.options.placeholder).prependTo(this.$editingArea);
      this.update();
    }
    destroy() {
      this.$placeholder.remove();
    }
    update() {
      const isShow = !this.context.invoke("codeview.isActivated") && this.context.invoke("editor.isEmpty");
      this.$placeholder.toggle(isShow);
    }
  }
  class Buttons {
    constructor(context) {
      this.ui = $.summernote.ui;
      this.context = context;
      this.$toolbar = context.layoutInfo.toolbar;
      this.options = context.options;
      this.lang = this.options.langInfo;
      this.invertedKeyMap = func.invertObject(
          this.options.keyMap[env.isMac ? "mac" : "pc"]
      );
    }
    representShortcut(editorMethod) {
      let shortcut = this.invertedKeyMap[editorMethod];
      if (!this.options.shortcuts || !shortcut) {
        return "";
      }
      if (env.isMac) {
        shortcut = shortcut.replace("CMD", "⌘").replace("SHIFT", "⇧");
      }
      shortcut = shortcut.replace("BACKSLASH", "\\").replace("SLASH", "/").replace("LEFTBRACKET", "[").replace("RIGHTBRACKET", "]");
      return " (" + shortcut + ")";
    }
    button(o) {
      if (!this.options.tooltip && o.tooltip) {
        delete o.tooltip;
      }
      o.container = this.options.container;
      return this.ui.button(o);
    }
    initialize() {
      this.addToolbarButtons();
      this.addImagePopoverButtons();
      this.addLinkPopoverButtons();
      this.addTablePopoverButtons();
      this.fontInstalledMap = {};
    }
    destroy() {
      delete this.fontInstalledMap;
    }
    isFontInstalled(name) {
      if (!Object.prototype.hasOwnProperty.call(this.fontInstalledMap, name)) {
        this.fontInstalledMap[name] = env.isFontInstalled(name) || lists.contains(this.options.fontNamesIgnoreCheck, name);
      }
      return this.fontInstalledMap[name];
    }
    isFontDeservedToAdd(name) {
      name = name.toLowerCase();
      return name !== "" && this.isFontInstalled(name) && env.genericFontFamilies.indexOf(name) === -1;
    }
    colorPalette(className, tooltip, backColor, foreColor) {
      return this.ui.buttonGroup({
        className: "note-color " + className,
        children: [
          this.button({
            className: "note-current-color-button",
            contents: this.ui.icon(this.options.icons.font + " note-recent-color"),
            tooltip,
            click: (event2) => {
              const $button = $(event2.currentTarget);
              if (backColor && foreColor) {
                this.context.invoke("editor.color", {
                  backColor: $button.attr("data-backColor"),
                  foreColor: $button.attr("data-foreColor")
                });
              } else if (backColor) {
                this.context.invoke("editor.color", {
                  backColor: $button.attr("data-backColor")
                });
              } else if (foreColor) {
                this.context.invoke("editor.color", {
                  foreColor: $button.attr("data-foreColor")
                });
              }
            },
            callback: ($button) => {
              const $recentColor = $button.find(".note-recent-color");
              if (backColor) {
                $recentColor.css("background-color", this.options.colorButton.backColor);
                $button.attr("data-backColor", this.options.colorButton.backColor);
              }
              if (foreColor) {
                $recentColor.css("color", this.options.colorButton.foreColor);
                $button.attr("data-foreColor", this.options.colorButton.foreColor);
              } else {
                $recentColor.css("color", "transparent");
              }
            }
          }),
          this.button({
            className: "dropdown-toggle",
            contents: this.ui.dropdownButtonContents("", this.options),
            tooltip: this.lang.color.more,
            data: {
              toggle: "dropdown"
            }
          }),
          this.ui.dropdown({
            items: (backColor ? [
              '<div class="note-palette">',
              '<div class="note-palette-title">' + this.lang.color.background + "</div>",
              "<div>",
              '<button type="button" class="note-color-reset btn btn-light btn-default" data-event="backColor" data-value="transparent">',
              this.lang.color.transparent,
              "</button>",
              "</div>",
              '<div class="note-holder" data-event="backColor"><!-- back colors --></div>',
              "<div>",
              '<button type="button" class="note-color-select btn btn-light btn-default" data-event="openPalette" data-value="backColorPicker-' + this.options.id + '">',
              this.lang.color.cpSelect,
              "</button>",
              '<input type="color" id="backColorPicker-' + this.options.id + '" class="note-btn note-color-select-btn" value="' + this.options.colorButton.backColor + '" data-event="backColorPalette-' + this.options.id + '">',
              "</div>",
              '<div class="note-holder-custom" id="backColorPalette-' + this.options.id + '" data-event="backColor"></div>',
              "</div>"
            ].join("") : "") + (foreColor ? [
              '<div class="note-palette">',
              '<div class="note-palette-title">' + this.lang.color.foreground + "</div>",
              "<div>",
              '<button type="button" class="note-color-reset btn btn-light btn-default" data-event="removeFormat" data-value="foreColor">',
              this.lang.color.resetToDefault,
              "</button>",
              "</div>",
              '<div class="note-holder" data-event="foreColor"><!-- fore colors --></div>',
              "<div>",
              '<button type="button" class="note-color-select btn btn-light btn-default" data-event="openPalette" data-value="foreColorPicker-' + this.options.id + '">',
              this.lang.color.cpSelect,
              "</button>",
              '<input type="color" id="foreColorPicker-' + this.options.id + '" class="note-btn note-color-select-btn" value="' + this.options.colorButton.foreColor + '" data-event="foreColorPalette-' + this.options.id + '">',
              "</div>",
              // Fix missing Div, Commented to find easily if it's wrong
              '<div class="note-holder-custom" id="foreColorPalette-' + this.options.id + '" data-event="foreColor"></div>',
              "</div>"
            ].join("") : ""),
            callback: ($dropdown) => {
              $dropdown.find(".note-holder").each((idx, item) => {
                const $holder = $(item);
                $holder.append(this.ui.palette({
                  colors: this.options.colors,
                  colorsName: this.options.colorsName,
                  eventName: $holder.data("event"),
                  container: this.options.container,
                  tooltip: this.options.tooltip
                }).render());
              });
              var customColors = [
                ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"]
              ];
              $dropdown.find(".note-holder-custom").each((idx, item) => {
                const $holder = $(item);
                $holder.append(this.ui.palette({
                  colors: customColors,
                  colorsName: customColors,
                  eventName: $holder.data("event"),
                  container: this.options.container,
                  tooltip: this.options.tooltip
                }).render());
              });
              $dropdown.find("input[type=color]").each((idx, item) => {
                $(item).on("change", function() {
                  const $chip = $dropdown.find("#" + $(this).data("event")).find(".note-color-btn").first();
                  const color = this.value.toUpperCase();
                  $chip.css("background-color", color).attr("aria-label", color).attr("data-value", color).attr("data-original-title", color);
                  $chip.trigger("click");
                });
              });
            },
            click: (event2) => {
              event2.stopPropagation();
              const $parent = $("." + className).find(".note-dropdown-menu");
              const $button = $(event2.target);
              const eventName = $button.data("event");
              const value2 = $button.attr("data-value");
              if (eventName === "openPalette") {
                const $picker = $parent.find("#" + value2);
                const $palette = $($parent.find("#" + $picker.data("event")).find(".note-color-row")[0]);
                const $chip = $palette.find(".note-color-btn").last().detach();
                const color = $picker.val();
                $chip.css("background-color", color).attr("aria-label", color).attr("data-value", color).attr("data-original-title", color);
                $palette.prepend($chip);
                $picker.trigger("click");
              } else {
                if (lists.contains(["backColor", "foreColor"], eventName)) {
                  const key2 = eventName === "backColor" ? "background-color" : "color";
                  const $color = $button.closest(".note-color").find(".note-recent-color");
                  const $currentButton = $button.closest(".note-color").find(".note-current-color-button");
                  $color.css(key2, value2);
                  $currentButton.attr("data-" + eventName, value2);
                }
                this.context.invoke("editor." + eventName, value2);
              }
            }
          })
        ]
      }).render();
    }
    addToolbarButtons() {
      this.context.memo("button.style", () => {
        return this.ui.buttonGroup([
          this.button({
            className: "dropdown-toggle",
            contents: this.ui.dropdownButtonContents(
                this.ui.icon(this.options.icons.magic),
                this.options
            ),
            tooltip: this.lang.style.style,
            data: {
              toggle: "dropdown"
            }
          }),
          this.ui.dropdown({
            className: "dropdown-style",
            items: this.options.styleTags,
            title: this.lang.style.style,
            template: (item) => {
              if (typeof item === "string") {
                item = {
                  tag: item,
                  title: Object.prototype.hasOwnProperty.call(this.lang.style, item) ? this.lang.style[item] : item
                };
              }
              const tag = item.tag;
              const title = item.title;
              const style = item.style ? ' style="' + item.style + '" ' : "";
              const className = item.className ? ' class="' + item.className + '"' : "";
              return "<" + tag + style + className + ">" + title + "</" + tag + ">";
            },
            click: this.context.createInvokeHandler("editor.formatBlock")
          })
        ]).render();
      });
      for (let styleIdx = 0, styleLen = this.options.styleTags.length; styleIdx < styleLen; styleIdx++) {
        const item = this.options.styleTags[styleIdx];
        this.context.memo("button.style." + item, () => {
          return this.button({
            className: "note-btn-style-" + item,
            contents: '<div data-value="' + item + '">' + item.toUpperCase() + "</div>",
            tooltip: this.lang.style[item],
            click: this.context.createInvokeHandler("editor.formatBlock")
          }).render();
        });
      }
      this.context.memo("button.bold", () => {
        return this.button({
          className: "note-btn-bold",
          contents: this.ui.icon(this.options.icons.bold),
          tooltip: this.lang.font.bold + this.representShortcut("bold"),
          click: this.context.createInvokeHandlerAndUpdateState("editor.bold")
        }).render();
      });
      this.context.memo("button.italic", () => {
        return this.button({
          className: "note-btn-italic",
          contents: this.ui.icon(this.options.icons.italic),
          tooltip: this.lang.font.italic + this.representShortcut("italic"),
          click: this.context.createInvokeHandlerAndUpdateState("editor.italic")
        }).render();
      });
      this.context.memo("button.underline", () => {
        return this.button({
          className: "note-btn-underline",
          contents: this.ui.icon(this.options.icons.underline),
          tooltip: this.lang.font.underline + this.representShortcut("underline"),
          click: this.context.createInvokeHandlerAndUpdateState("editor.underline")
        }).render();
      });
      this.context.memo("button.clear", () => {
        return this.button({
          contents: this.ui.icon(this.options.icons.eraser),
          tooltip: this.lang.font.clear + this.representShortcut("removeFormat"),
          click: this.context.createInvokeHandler("editor.removeFormat")
        }).render();
      });
      this.context.memo("button.strikethrough", () => {
        return this.button({
          className: "note-btn-strikethrough",
          contents: this.ui.icon(this.options.icons.strikethrough),
          tooltip: this.lang.font.strikethrough + this.representShortcut("strikethrough"),
          click: this.context.createInvokeHandlerAndUpdateState("editor.strikethrough")
        }).render();
      });
      this.context.memo("button.superscript", () => {
        return this.button({
          className: "note-btn-superscript",
          contents: this.ui.icon(this.options.icons.superscript),
          tooltip: this.lang.font.superscript,
          click: this.context.createInvokeHandlerAndUpdateState("editor.superscript")
        }).render();
      });
      this.context.memo("button.subscript", () => {
        return this.button({
          className: "note-btn-subscript",
          contents: this.ui.icon(this.options.icons.subscript),
          tooltip: this.lang.font.subscript,
          click: this.context.createInvokeHandlerAndUpdateState("editor.subscript")
        }).render();
      });
      this.context.memo("button.fontname", () => {
        const styleInfo = this.context.invoke("editor.currentStyle");
        if (this.options.addDefaultFonts) {
          $.each(styleInfo["font-family"].split(","), (idx, fontname) => {
            fontname = fontname.trim().replace(/['"]+/g, "");
            if (this.isFontDeservedToAdd(fontname)) {
              if (this.options.fontNames.indexOf(fontname) === -1) {
                this.options.fontNames.push(fontname);
              }
            }
          });
        }
        return this.ui.buttonGroup([
          this.button({
            className: "dropdown-toggle",
            contents: this.ui.dropdownButtonContents(
                '<span class="note-current-fontname"></span>',
                this.options
            ),
            tooltip: this.lang.font.name,
            data: {
              toggle: "dropdown"
            }
          }),
          this.ui.dropdownCheck({
            className: "dropdown-fontname",
            checkClassName: this.options.icons.menuCheck,
            items: this.options.fontNames.filter(this.isFontInstalled.bind(this)),
            title: this.lang.font.name,
            template: (item) => {
              return '<span style="font-family: ' + env.validFontName(item) + '">' + item + "</span>";
            },
            click: this.context.createInvokeHandlerAndUpdateState("editor.fontName")
          })
        ]).render();
      });
      this.context.memo("button.fontsize", () => {
        return this.ui.buttonGroup([
          this.button({
            className: "dropdown-toggle",
            contents: this.ui.dropdownButtonContents('<span class="note-current-fontsize"></span>', this.options),
            tooltip: this.lang.font.size,
            data: {
              toggle: "dropdown"
            }
          }),
          this.ui.dropdownCheck({
            className: "dropdown-fontsize",
            checkClassName: this.options.icons.menuCheck,
            items: this.options.fontSizes,
            title: this.lang.font.size,
            click: this.context.createInvokeHandlerAndUpdateState("editor.fontSize")
          })
        ]).render();
      });
      this.context.memo("button.fontsizeunit", () => {
        return this.ui.buttonGroup([
          this.button({
            className: "dropdown-toggle",
            contents: this.ui.dropdownButtonContents('<span class="note-current-fontsizeunit"></span>', this.options),
            tooltip: this.lang.font.sizeunit,
            data: {
              toggle: "dropdown"
            }
          }),
          this.ui.dropdownCheck({
            className: "dropdown-fontsizeunit",
            checkClassName: this.options.icons.menuCheck,
            items: this.options.fontSizeUnits,
            title: this.lang.font.sizeunit,
            click: this.context.createInvokeHandlerAndUpdateState("editor.fontSizeUnit")
          })
        ]).render();
      });
      this.context.memo("button.color", () => {
        return this.colorPalette("note-color-all", this.lang.color.recent, true, true);
      });
      this.context.memo("button.forecolor", () => {
        return this.colorPalette("note-color-fore", this.lang.color.foreground, false, true);
      });
      this.context.memo("button.backcolor", () => {
        return this.colorPalette("note-color-back", this.lang.color.background, true, false);
      });
      this.context.memo("button.ul", () => {
        return this.button({
          contents: this.ui.icon(this.options.icons.unorderedlist),
          tooltip: this.lang.lists.unordered + this.representShortcut("insertUnorderedList"),
          click: this.context.createInvokeHandler("editor.insertUnorderedList")
        }).render();
      });
      this.context.memo("button.ol", () => {
        return this.button({
          contents: this.ui.icon(this.options.icons.orderedlist),
          tooltip: this.lang.lists.ordered + this.representShortcut("insertOrderedList"),
          click: this.context.createInvokeHandler("editor.insertOrderedList")
        }).render();
      });
      const justifyLeft = this.button({
        contents: this.ui.icon(this.options.icons.alignLeft),
        tooltip: this.lang.paragraph.left + this.representShortcut("justifyLeft"),
        click: this.context.createInvokeHandler("editor.justifyLeft")
      });
      const justifyCenter = this.button({
        contents: this.ui.icon(this.options.icons.alignCenter),
        tooltip: this.lang.paragraph.center + this.representShortcut("justifyCenter"),
        click: this.context.createInvokeHandler("editor.justifyCenter")
      });
      const justifyRight = this.button({
        contents: this.ui.icon(this.options.icons.alignRight),
        tooltip: this.lang.paragraph.right + this.representShortcut("justifyRight"),
        click: this.context.createInvokeHandler("editor.justifyRight")
      });
      const justifyFull = this.button({
        contents: this.ui.icon(this.options.icons.alignJustify),
        tooltip: this.lang.paragraph.justify + this.representShortcut("justifyFull"),
        click: this.context.createInvokeHandler("editor.justifyFull")
      });
      const outdent = this.button({
        contents: this.ui.icon(this.options.icons.outdent),
        tooltip: this.lang.paragraph.outdent + this.representShortcut("outdent"),
        click: this.context.createInvokeHandler("editor.outdent")
      });
      const indent = this.button({
        contents: this.ui.icon(this.options.icons.indent),
        tooltip: this.lang.paragraph.indent + this.representShortcut("indent"),
        click: this.context.createInvokeHandler("editor.indent")
      });
      this.context.memo("button.justifyLeft", func.invoke(justifyLeft, "render"));
      this.context.memo("button.justifyCenter", func.invoke(justifyCenter, "render"));
      this.context.memo("button.justifyRight", func.invoke(justifyRight, "render"));
      this.context.memo("button.justifyFull", func.invoke(justifyFull, "render"));
      this.context.memo("button.outdent", func.invoke(outdent, "render"));
      this.context.memo("button.indent", func.invoke(indent, "render"));
      this.context.memo("button.paragraph", () => {
        return this.ui.buttonGroup([
          this.button({
            className: "dropdown-toggle",
            contents: this.ui.dropdownButtonContents(this.ui.icon(this.options.icons.alignLeft), this.options),
            tooltip: this.lang.paragraph.paragraph,
            data: {
              toggle: "dropdown"
            }
          }),
          this.ui.dropdown([
            this.ui.buttonGroup({
              className: "note-align",
              children: [justifyLeft, justifyCenter, justifyRight, justifyFull]
            }),
            this.ui.buttonGroup({
              className: "note-list",
              children: [outdent, indent]
            })
          ])
        ]).render();
      });
      this.context.memo("button.height", () => {
        return this.ui.buttonGroup([
          this.button({
            className: "dropdown-toggle",
            contents: this.ui.dropdownButtonContents(this.ui.icon(this.options.icons.textHeight), this.options),
            tooltip: this.lang.font.height,
            data: {
              toggle: "dropdown"
            }
          }),
          this.ui.dropdownCheck({
            items: this.options.lineHeights,
            checkClassName: this.options.icons.menuCheck,
            className: "dropdown-line-height",
            title: this.lang.font.height,
            click: this.context.createInvokeHandler("editor.lineHeight")
          })
        ]).render();
      });
      this.context.memo("button.table", () => {
        return this.ui.buttonGroup([
          this.button({
            className: "dropdown-toggle",
            contents: this.ui.dropdownButtonContents(this.ui.icon(this.options.icons.table), this.options),
            tooltip: this.lang.table.table,
            data: {
              toggle: "dropdown"
            }
          }),
          this.ui.dropdown({
            title: this.lang.table.table,
            className: "note-table",
            items: [
              '<div class="note-dimension-picker">',
              '<div class="note-dimension-picker-mousecatcher" data-event="insertTable" data-value="1x1"></div>',
              '<div class="note-dimension-picker-highlighted"></div>',
              '<div class="note-dimension-picker-unhighlighted"></div>',
              "</div>",
              '<div class="note-dimension-display">1 x 1</div>'
            ].join("")
          })
        ], {
          callback: ($node) => {
            const $catcher = $node.find(".note-dimension-picker-mousecatcher");
            $catcher.css({
              width: this.options.insertTableMaxSize.col + "em",
              height: this.options.insertTableMaxSize.row + "em"
            }).on("mousedown", this.context.createInvokeHandler("editor.insertTable")).on("mousemove", this.tableMoveHandler.bind(this));
          }
        }).render();
      });
      this.context.memo("button.link", () => {
        return this.button({
          contents: this.ui.icon(this.options.icons.link),
          tooltip: this.lang.link.link + this.representShortcut("linkDialog.show"),
          click: this.context.createInvokeHandler("linkDialog.show")
        }).render();
      });
      this.context.memo("button.picture", () => {
        return this.button({
          contents: this.ui.icon(this.options.icons.picture),
          tooltip: this.lang.image.image,
          click: this.context.createInvokeHandler("imageDialog.show")
        }).render();
      });
      this.context.memo("button.video", () => {
        return this.button({
          contents: this.ui.icon(this.options.icons.video),
          tooltip: this.lang.video.video,
          click: this.context.createInvokeHandler("videoDialog.show")
        }).render();
      });
      this.context.memo("button.hr", () => {
        return this.button({
          contents: this.ui.icon(this.options.icons.minus),
          tooltip: this.lang.hr.insert + this.representShortcut("insertHorizontalRule"),
          click: this.context.createInvokeHandler("editor.insertHorizontalRule")
        }).render();
      });
      this.context.memo("button.fullscreen", () => {
        return this.button({
          className: "btn-fullscreen note-codeview-keep",
          contents: this.ui.icon(this.options.icons.arrowsAlt),
          tooltip: this.lang.options.fullscreen,
          click: this.context.createInvokeHandler("fullscreen.toggle")
        }).render();
      });
      this.context.memo("button.codeview", () => {
        return this.button({
          className: "btn-codeview note-codeview-keep",
          contents: this.ui.icon(this.options.icons.code),
          tooltip: this.lang.options.codeview,
          click: this.context.createInvokeHandler("codeview.toggle")
        }).render();
      });
      this.context.memo("button.redo", () => {
        return this.button({
          contents: this.ui.icon(this.options.icons.redo),
          tooltip: this.lang.history.redo + this.representShortcut("redo"),
          click: this.context.createInvokeHandler("editor.redo")
        }).render();
      });
      this.context.memo("button.undo", () => {
        return this.button({
          contents: this.ui.icon(this.options.icons.undo),
          tooltip: this.lang.history.undo + this.representShortcut("undo"),
          click: this.context.createInvokeHandler("editor.undo")
        }).render();
      });
      this.context.memo("button.help", () => {
        return this.button({
          contents: this.ui.icon(this.options.icons.question),
          tooltip: this.lang.options.help,
          click: this.context.createInvokeHandler("helpDialog.show")
        }).render();
      });
    }
    /**
     * image: [
     *   ['imageResize', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
     *   ['float', ['floatLeft', 'floatRight', 'floatNone']],
     *   ['remove', ['removeMedia']],
     * ],
     */
    addImagePopoverButtons() {
      this.context.memo("button.resizeFull", () => {
        return this.button({
          contents: '<span class="note-fontsize-10">100%</span>',
          tooltip: this.lang.image.resizeFull,
          click: this.context.createInvokeHandler("editor.resize", "1")
        }).render();
      });
      this.context.memo("button.resizeHalf", () => {
        return this.button({
          contents: '<span class="note-fontsize-10">50%</span>',
          tooltip: this.lang.image.resizeHalf,
          click: this.context.createInvokeHandler("editor.resize", "0.5")
        }).render();
      });
      this.context.memo("button.resizeQuarter", () => {
        return this.button({
          contents: '<span class="note-fontsize-10">25%</span>',
          tooltip: this.lang.image.resizeQuarter,
          click: this.context.createInvokeHandler("editor.resize", "0.25")
        }).render();
      });
      this.context.memo("button.resizeNone", () => {
        return this.button({
          contents: this.ui.icon(this.options.icons.rollback),
          tooltip: this.lang.image.resizeNone,
          click: this.context.createInvokeHandler("editor.resize", "0")
        }).render();
      });
      this.context.memo("button.floatLeft", () => {
        return this.button({
          contents: this.ui.icon(this.options.icons.floatLeft),
          tooltip: this.lang.image.floatLeft,
          click: this.context.createInvokeHandler("editor.floatMe", "left")
        }).render();
      });
      this.context.memo("button.floatRight", () => {
        return this.button({
          contents: this.ui.icon(this.options.icons.floatRight),
          tooltip: this.lang.image.floatRight,
          click: this.context.createInvokeHandler("editor.floatMe", "right")
        }).render();
      });
      this.context.memo("button.floatNone", () => {
        return this.button({
          contents: this.ui.icon(this.options.icons.rollback),
          tooltip: this.lang.image.floatNone,
          click: this.context.createInvokeHandler("editor.floatMe", "none")
        }).render();
      });
      this.context.memo("button.removeMedia", () => {
        return this.button({
          contents: this.ui.icon(this.options.icons.trash),
          tooltip: this.lang.image.remove,
          click: this.context.createInvokeHandler("editor.removeMedia")
        }).render();
      });
    }
    addLinkPopoverButtons() {
      this.context.memo("button.linkDialogShow", () => {
        return this.button({
          contents: this.ui.icon(this.options.icons.link),
          tooltip: this.lang.link.edit,
          click: this.context.createInvokeHandler("linkDialog.show")
        }).render();
      });
      this.context.memo("button.unlink", () => {
        return this.button({
          contents: this.ui.icon(this.options.icons.unlink),
          tooltip: this.lang.link.unlink,
          click: this.context.createInvokeHandler("editor.unlink")
        }).render();
      });
    }
    /**
     * table : [
     *  ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
     *  ['delete', ['deleteRow', 'deleteCol', 'deleteTable']]
     * ],
     */
    addTablePopoverButtons() {
      this.context.memo("button.addRowUp", () => {
        return this.button({
          className: "btn-md",
          contents: this.ui.icon(this.options.icons.rowAbove),
          tooltip: this.lang.table.addRowAbove,
          click: this.context.createInvokeHandler("editor.addRow", "top")
        }).render();
      });
      this.context.memo("button.addRowDown", () => {
        return this.button({
          className: "btn-md",
          contents: this.ui.icon(this.options.icons.rowBelow),
          tooltip: this.lang.table.addRowBelow,
          click: this.context.createInvokeHandler("editor.addRow", "bottom")
        }).render();
      });
      this.context.memo("button.addColLeft", () => {
        return this.button({
          className: "btn-md",
          contents: this.ui.icon(this.options.icons.colBefore),
          tooltip: this.lang.table.addColLeft,
          click: this.context.createInvokeHandler("editor.addCol", "left")
        }).render();
      });
      this.context.memo("button.addColRight", () => {
        return this.button({
          className: "btn-md",
          contents: this.ui.icon(this.options.icons.colAfter),
          tooltip: this.lang.table.addColRight,
          click: this.context.createInvokeHandler("editor.addCol", "right")
        }).render();
      });
      this.context.memo("button.deleteRow", () => {
        return this.button({
          className: "btn-md",
          contents: this.ui.icon(this.options.icons.rowRemove),
          tooltip: this.lang.table.delRow,
          click: this.context.createInvokeHandler("editor.deleteRow")
        }).render();
      });
      this.context.memo("button.deleteCol", () => {
        return this.button({
          className: "btn-md",
          contents: this.ui.icon(this.options.icons.colRemove),
          tooltip: this.lang.table.delCol,
          click: this.context.createInvokeHandler("editor.deleteCol")
        }).render();
      });
      this.context.memo("button.deleteTable", () => {
        return this.button({
          className: "btn-md",
          contents: this.ui.icon(this.options.icons.trash),
          tooltip: this.lang.table.delTable,
          click: this.context.createInvokeHandler("editor.deleteTable")
        }).render();
      });
    }
    build($container, groups) {
      for (let groupIdx = 0, groupLen = groups.length; groupIdx < groupLen; groupIdx++) {
        const group = groups[groupIdx];
        const groupName = Array.isArray(group) ? group[0] : group;
        const buttons = Array.isArray(group) ? group.length === 1 ? [group[0]] : group[1] : [group];
        const $group = this.ui.buttonGroup({
          className: "note-" + groupName
        }).render();
        for (let idx = 0, len = buttons.length; idx < len; idx++) {
          const btn = this.context.memo("button." + buttons[idx]);
          if (btn) {
            $group.append(typeof btn === "function" ? btn(this.context) : btn);
          }
        }
        $group.appendTo($container);
      }
    }
    /**
     * @param {jQuery} [$container]
     */
    updateCurrentStyle($container) {
      const $cont = $container || this.$toolbar;
      const styleInfo = this.context.invoke("editor.currentStyle");
      this.updateBtnStates($cont, {
        ".note-btn-bold": () => {
          return styleInfo["font-bold"] === "bold";
        },
        ".note-btn-italic": () => {
          return styleInfo["font-italic"] === "italic";
        },
        ".note-btn-underline": () => {
          return styleInfo["font-underline"] === "underline";
        },
        ".note-btn-subscript": () => {
          return styleInfo["font-subscript"] === "subscript";
        },
        ".note-btn-superscript": () => {
          return styleInfo["font-superscript"] === "superscript";
        },
        ".note-btn-strikethrough": () => {
          return styleInfo["font-strikethrough"] === "strikethrough";
        }
      });
      if (styleInfo["font-family"]) {
        const fontNames = styleInfo["font-family"].split(",").map((name) => {
          return name.replace(/[\'\"]/g, "").replace(/\s+$/, "").replace(/^\s+/, "");
        });
        const fontName = lists.find(fontNames, this.isFontInstalled.bind(this));
        $cont.find(".dropdown-fontname a").each((idx, item) => {
          const $item = $(item);
          const isChecked = $item.data("value") + "" === fontName + "";
          $item.toggleClass("checked", isChecked);
        });
        $cont.find(".note-current-fontname").text(fontName).css("font-family", fontName);
      }
      if (styleInfo["font-size"]) {
        const fontSize = styleInfo["font-size"];
        $cont.find(".dropdown-fontsize a").each((idx, item) => {
          const $item = $(item);
          const isChecked = $item.data("value") + "" === fontSize + "";
          $item.toggleClass("checked", isChecked);
        });
        $cont.find(".note-current-fontsize").text(fontSize);
        const fontSizeUnit = styleInfo["font-size-unit"];
        $cont.find(".dropdown-fontsizeunit a").each((idx, item) => {
          const $item = $(item);
          const isChecked = $item.data("value") + "" === fontSizeUnit + "";
          $item.toggleClass("checked", isChecked);
        });
        $cont.find(".note-current-fontsizeunit").text(fontSizeUnit);
      }
      if (styleInfo["line-height"]) {
        const lineHeight = styleInfo["line-height"];
        $cont.find(".dropdown-line-height a").each((idx, item) => {
          const $item = $(item);
          const isChecked = $(item).data("value") + "" === lineHeight + "";
          $item.toggleClass("checked", isChecked);
        });
        $cont.find(".note-current-line-height").text(lineHeight);
      }
    }
    updateBtnStates($container, infos) {
      $.each(infos, (selector, pred) => {
        this.ui.toggleBtnActive($container.find(selector), pred());
      });
    }
    tableMoveHandler(event2) {
      const PX_PER_EM = 18;
      const $picker = $(event2.target.parentNode);
      const $dimensionDisplay = $picker.next();
      const $catcher = $picker.find(".note-dimension-picker-mousecatcher");
      const $highlighted = $picker.find(".note-dimension-picker-highlighted");
      const $unhighlighted = $picker.find(".note-dimension-picker-unhighlighted");
      let posOffset;
      if (event2.offsetX === void 0) {
        const posCatcher = $(event2.target).offset();
        posOffset = {
          x: event2.pageX - posCatcher.left,
          y: event2.pageY - posCatcher.top
        };
      } else {
        posOffset = {
          x: event2.offsetX,
          y: event2.offsetY
        };
      }
      const dim = {
        c: Math.ceil(posOffset.x / PX_PER_EM) || 1,
        r: Math.ceil(posOffset.y / PX_PER_EM) || 1
      };
      $highlighted.css({ width: dim.c + "em", height: dim.r + "em" });
      $catcher.data("value", dim.c + "x" + dim.r);
      if (dim.c > 3 && dim.c < this.options.insertTableMaxSize.col) {
        $unhighlighted.css({ width: dim.c + 1 + "em" });
      }
      if (dim.r > 3 && dim.r < this.options.insertTableMaxSize.row) {
        $unhighlighted.css({ height: dim.r + 1 + "em" });
      }
      $dimensionDisplay.html(dim.c + " x " + dim.r);
    }
  }
  class Toolbar {
    constructor(context) {
      this.context = context;
      this.$window = $(window);
      this.$document = $(document);
      this.ui = $.summernote.ui;
      this.$note = context.layoutInfo.note;
      this.$editor = context.layoutInfo.editor;
      this.$toolbar = context.layoutInfo.toolbar;
      this.$editable = context.layoutInfo.editable;
      this.$statusbar = context.layoutInfo.statusbar;
      this.options = context.options;
      this.isFollowing = false;
      this.followScroll = this.followScroll.bind(this);
    }
    shouldInitialize() {
      return !this.options.airMode;
    }
    initialize() {
      this.options.toolbar = this.options.toolbar || [];
      if (!this.options.toolbar.length) {
        this.$toolbar.hide();
      } else {
        this.context.invoke("buttons.build", this.$toolbar, this.options.toolbar);
      }
      if (this.options.toolbarContainer) {
        this.$toolbar.appendTo(this.options.toolbarContainer);
      }
      this.changeContainer(false);
      this.$note.on("summernote.keyup summernote.mouseup summernote.change", () => {
        this.context.invoke("buttons.updateCurrentStyle");
      });
      this.context.invoke("buttons.updateCurrentStyle");
      if (this.options.followingToolbar) {
        this.$window.on("scroll resize", this.followScroll);
      }
    }
    destroy() {
      this.$toolbar.children().remove();
      if (this.options.followingToolbar) {
        this.$window.off("scroll resize", this.followScroll);
      }
    }
    followScroll() {
      if (this.$editor.hasClass("fullscreen")) {
        return false;
      }
      const editorHeight = this.$editor.outerHeight();
      const editorWidth = this.$editor.width();
      const toolbarHeight = this.$toolbar.height();
      const statusbarHeight = this.$statusbar.height();
      var otherBarHeight = 0;
      if (this.options.otherStaticBarHeight) {
        otherBarHeight = this.options.otherStaticBarHeight;
      } else if (this.options.otherStaticBar) {
        otherBarHeight = $(this.options.otherStaticBar).outerHeight();
      }
      if (!otherBarHeight) {
        otherBarHeight = 0;
      }
      const currentOffset = this.$document.scrollTop();
      const editorOffsetTop = this.$editor.offset().top;
      const editorOffsetBottom = editorOffsetTop + editorHeight;
      const activateOffset = editorOffsetTop - otherBarHeight;
      const deactivateOffsetBottom = editorOffsetBottom - otherBarHeight - toolbarHeight - statusbarHeight;
      if (!this.isFollowing && currentOffset > activateOffset && currentOffset < deactivateOffsetBottom - toolbarHeight) {
        this.isFollowing = true;
        this.$editable.css({
          marginTop: this.$toolbar.outerHeight()
        });
        this.$toolbar.css({
          position: "fixed",
          top: otherBarHeight,
          width: editorWidth,
          zIndex: 1e3
        });
      } else if (this.isFollowing && (currentOffset < activateOffset || currentOffset > deactivateOffsetBottom)) {
        this.isFollowing = false;
        this.$toolbar.css({
          position: "relative",
          top: 0,
          width: "100%",
          zIndex: "auto"
        });
        this.$editable.css({
          marginTop: ""
        });
      }
    }
    changeContainer(isFullscreen) {
      if (isFullscreen) {
        this.$toolbar.prependTo(this.$editor);
      } else {
        if (this.options.toolbarContainer) {
          this.$toolbar.appendTo(this.options.toolbarContainer);
        }
      }
      if (this.options.followingToolbar) {
        this.followScroll();
      }
    }
    updateFullscreen(isFullscreen) {
      this.ui.toggleBtnActive(this.$toolbar.find(".btn-fullscreen"), isFullscreen);
      this.changeContainer(isFullscreen);
    }
    updateCodeview(isCodeview) {
      this.ui.toggleBtnActive(this.$toolbar.find(".btn-codeview"), isCodeview);
      if (isCodeview) {
        this.deactivate();
      } else {
        this.activate();
      }
    }
    activate(isIncludeCodeview) {
      let $btn = this.$toolbar.find("button");
      if (!isIncludeCodeview) {
        $btn = $btn.not(".note-codeview-keep");
      }
      this.ui.toggleBtn($btn, true);
    }
    deactivate(isIncludeCodeview) {
      let $btn = this.$toolbar.find("button");
      if (!isIncludeCodeview) {
        $btn = $btn.not(".note-codeview-keep");
      }
      this.ui.toggleBtn($btn, false);
    }
  }
  const MAILTO_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const TEL_PATTERN = /^(\+?\d{1,3}[\s-]?)?(\d{1,4})[\s-]?(\d{1,4})[\s-]?(\d{1,4})$/;
  const URL_SCHEME_PATTERN = /^([A-Za-z][A-Za-z0-9+-.]*\:|#|\/)/;
  class LinkDialog {
    constructor(context) {
      this.context = context;
      this.ui = $.summernote.ui;
      this.$body = $(document.body);
      this.$editor = context.layoutInfo.editor;
      this.options = context.options;
      this.lang = this.options.langInfo;
      context.memo("help.linkDialog.show", this.options.langInfo.help["linkDialog.show"]);
    }
    initialize() {
      const $container = this.options.dialogsInBody ? this.$body : this.options.container;
      const body = [
        '<div class="form-group note-form-group">',
        `<label for="note-dialog-link-txt-${this.options.id}" class="note-form-label">${this.lang.link.textToDisplay}</label>`,
        `<input id="note-dialog-link-txt-${this.options.id}" class="note-link-text form-control note-form-control note-input" type="text"/>`,
        "</div>",
        '<div class="form-group note-form-group">',
        `<label for="note-dialog-link-url-${this.options.id}" class="note-form-label">${this.lang.link.url}</label>`,
        `<input id="note-dialog-link-url-${this.options.id}" class="note-link-url form-control note-form-control note-input" type="text" value="http://"/>`,
        "</div>",
        !this.options.disableLinkTarget ? $("<div></div>").append(this.ui.checkbox({
          className: "sn-checkbox-open-in-new-window",
          text: this.lang.link.openInNewWindow,
          checked: true
        }).render()).html() : ""
      ].join("");
      const buttonClass = "btn btn-primary note-btn note-btn-primary note-link-btn";
      const footer = `<input type="button" href="#" class="${buttonClass}" value="${this.lang.link.insert}" disabled>`;
      this.$dialog = this.ui.dialog({
        className: "link-dialog",
        title: this.lang.link.insert,
        fade: this.options.dialogsFade,
        body,
        footer
      }).render().appendTo($container);
    }
    destroy() {
      this.ui.hideDialog(this.$dialog);
      this.$dialog.remove();
    }
    bindEnterKey($input, $btn) {
      $input.on("keypress", (event2) => {
        if (event2.keyCode === key.code.ENTER) {
          event2.preventDefault();
          $btn.trigger("click");
        }
      });
    }
    checkLinkUrl(linkUrl) {
      if (MAILTO_PATTERN.test(linkUrl)) {
        return "mailto://" + linkUrl;
      } else if (TEL_PATTERN.test(linkUrl)) {
        return "tel://" + linkUrl;
      } else if (!URL_SCHEME_PATTERN.test(linkUrl)) {
        return "http://" + linkUrl;
      }
      return linkUrl;
    }
    onCheckLinkUrl($input) {
      $input.on("blur", (event2) => {
        event2.target.value = event2.target.value == "" ? "" : this.checkLinkUrl(event2.target.value);
      });
    }
    /**
     * toggle update button
     */
    toggleLinkBtn($linkBtn, $linkText, $linkUrl) {
      this.ui.toggleBtn($linkBtn, $linkText.val() && $linkUrl.val());
    }
    /**
     * Show link dialog and set event handlers on dialog controls.
     *
     * @param {Object} linkInfo
     * @return {Promise}
     */
    showLinkDialog(linkInfo) {
      return $.Deferred((deferred) => {
        const $linkText = this.$dialog.find(".note-link-text");
        const $linkUrl = this.$dialog.find(".note-link-url");
        const $linkBtn = this.$dialog.find(".note-link-btn");
        const $openInNewWindow = this.$dialog.find(".sn-checkbox-open-in-new-window input[type=checkbox]");
        this.ui.onDialogShown(this.$dialog, () => {
          this.context.triggerEvent("dialog.shown");
          if (!linkInfo.url && func.isValidUrl(linkInfo.text)) {
            linkInfo.url = this.checkLinkUrl(linkInfo.text);
          }
          $linkText.on("input paste propertychange", () => {
            let text = $linkText.val();
            let div = document.createElement("div");
            div.innerText = text;
            text = div.innerHTML;
            linkInfo.text = text;
            this.toggleLinkBtn($linkBtn, $linkText, $linkUrl);
          }).val(linkInfo.text);
          $linkUrl.on("input paste propertychange", () => {
            if (!linkInfo.text) {
              $linkText.val($linkUrl.val());
            }
            this.toggleLinkBtn($linkBtn, $linkText, $linkUrl);
          }).val(linkInfo.url);
          if (!env.isSupportTouch) {
            $linkUrl.trigger("focus");
          }
          this.toggleLinkBtn($linkBtn, $linkText, $linkUrl);
          this.bindEnterKey($linkUrl, $linkBtn);
          this.bindEnterKey($linkText, $linkBtn);
          this.onCheckLinkUrl($linkUrl);
          const isNewWindowChecked = linkInfo.isNewWindow !== void 0 ? linkInfo.isNewWindow : this.context.options.linkTargetBlank;
          $openInNewWindow.prop("checked", isNewWindowChecked);
          $linkBtn.one("click", (event2) => {
            event2.preventDefault();
            deferred.resolve({
              range: linkInfo.range,
              url: $linkUrl.val(),
              text: $linkText.val(),
              isNewWindow: $openInNewWindow.is(":checked")
            });
            this.ui.hideDialog(this.$dialog);
          });
        });
        this.ui.onDialogHidden(this.$dialog, () => {
          $linkText.off();
          $linkUrl.off();
          $linkBtn.off();
          if (deferred.state() === "pending") {
            deferred.reject();
          }
        });
        this.ui.showDialog(this.$dialog);
      }).promise();
    }
    /**
     * @param {Object} layoutInfo
     */
    show() {
      const linkInfo = this.context.invoke("editor.getLinkInfo");
      this.context.invoke("editor.saveRange");
      this.showLinkDialog(linkInfo).then((linkInfo2) => {
        this.context.invoke("editor.restoreRange");
        this.context.invoke("editor.createLink", linkInfo2);
      }).fail(() => {
        this.context.invoke("editor.restoreRange");
      });
    }
  }
  class LinkPopover {
    constructor(context) {
      this.context = context;
      this.ui = $.summernote.ui;
      this.$editor = context.layoutInfo.editor;
      this.options = context.options;
      this.events = {
        "summernote.keyup summernote.mouseup summernote.change summernote.scroll": () => {
          this.update();
        },
        "summernote.disable summernote.dialog.shown": () => {
          this.hide();
        },
        "summernote.blur": (we, event2) => {
          if (event2.originalEvent && event2.originalEvent.relatedTarget) {
            if (!this.$popover[0].contains(event2.originalEvent.relatedTarget)) {
              this.hide();
            }
          } else {
            this.hide();
          }
        }
      };
    }
    shouldInitialize() {
      return !lists.isEmpty(this.options.popover.link);
    }
    initialize() {
      this.$popover = this.ui.popover({
        className: "note-link-popover",
        callback: ($node) => {
          const $content2 = $node.find(".popover-content,.note-popover-content");
          $content2.prepend('<span><a target="_blank"></a>&nbsp;</span>');
        }
      }).render().appendTo(this.options.container);
      const $content = this.$popover.find(".popover-content,.note-popover-content");
      this.context.invoke("buttons.build", $content, this.options.popover.link);
      this.$popover.on("mousedown", (event2) => {
        event2.preventDefault();
      });
      this.$editor.on("keyup", (event2) => {
        if (event2.keyCode === key.code.ESCAPE) {
          this.$popover.hide();
        }
      });
    }
    destroy() {
      this.$popover.remove();
    }
    update() {
      if (!this.context.invoke("editor.hasFocus")) {
        this.hide();
        return;
      }
      const rng = this.context.invoke("editor.getLastRange");
      if (rng.isCollapsed() && rng.isOnAnchor()) {
        const anchor = dom.ancestor(rng.sc, dom.isAnchor);
        const href = $(anchor).attr("href");
        this.$popover.find("a").attr("href", href).text(href);
        const pos = dom.posFromPlaceholder(anchor);
        const containerOffset = $(this.options.container).offset();
        pos.top -= containerOffset.top;
        pos.left -= containerOffset.left;
        this.$popover.css({
          display: "block",
          left: pos.left,
          top: pos.top
        });
      } else {
        this.hide();
      }
    }
    hide() {
      this.$popover.hide();
    }
  }
  class ImageDialog {
    constructor(context) {
      this.context = context;
      this.ui = $.summernote.ui;
      this.$body = $(document.body);
      this.$editor = context.layoutInfo.editor;
      this.options = context.options;
      this.lang = this.options.langInfo;
    }
    initialize() {
      let imageLimitation = "";
      if (this.options.maximumImageFileSize) {
        const unit = Math.floor(Math.log(this.options.maximumImageFileSize) / Math.log(1024));
        const readableSize = (this.options.maximumImageFileSize / Math.pow(1024, unit)).toFixed(2) * 1 + " " + " KMGTP"[unit] + "B";
        imageLimitation = `<small>${this.lang.image.maximumFileSize + " : " + readableSize}</small>`;
      }
      const $container = this.options.dialogsInBody ? this.$body : this.options.container;
      const body = [
        '<div class="form-group note-form-group note-group-select-from-files">',
        '<label for="note-dialog-image-file-' + this.options.id + '" class="note-form-label">' + this.lang.image.selectFromFiles + "</label>",
        '<input id="note-dialog-image-file-' + this.options.id + '" class="note-image-input form-control-file note-form-control note-input" ',
        ' type="file" name="files" accept="' + this.options.acceptImageFileTypes + '" multiple="multiple"/>',
        imageLimitation,
        "</div>",
        '<div class="form-group note-group-image-url">',
        '<label for="note-dialog-image-url-' + this.options.id + '" class="note-form-label">' + this.lang.image.url + "</label>",
        '<input id="note-dialog-image-url-' + this.options.id + '" class="note-image-url form-control note-form-control note-input" type="text"/>',
        "</div>"
      ].join("");
      const buttonClass = "btn btn-primary note-btn note-btn-primary note-image-btn";
      const footer = `<input type="button" href="#" class="${buttonClass}" value="${this.lang.image.insert}" disabled>`;
      this.$dialog = this.ui.dialog({
        title: this.lang.image.insert,
        fade: this.options.dialogsFade,
        body,
        footer
      }).render().appendTo($container);
    }
    destroy() {
      this.ui.hideDialog(this.$dialog);
      this.$dialog.remove();
    }
    bindEnterKey($input, $btn) {
      $input.on("keypress", (event2) => {
        if (event2.keyCode === key.code.ENTER) {
          event2.preventDefault();
          $btn.trigger("click");
        }
      });
    }
    show() {
      this.context.invoke("editor.saveRange");
      this.showImageDialog().then((data) => {
        this.ui.hideDialog(this.$dialog);
        this.context.invoke("editor.restoreRange");
        if (typeof data === "string") {
          if (this.options.callbacks.onImageLinkInsert) {
            this.context.triggerEvent("image.link.insert", data);
          } else {
            this.context.invoke("editor.insertImage", data);
          }
        } else {
          this.context.invoke("editor.insertImagesOrCallback", data);
        }
      }).fail(() => {
        this.context.invoke("editor.restoreRange");
      });
    }
    /**
     * show image dialog
     *
     * @param {jQuery} $dialog
     * @return {Promise}
     */
    showImageDialog() {
      return $.Deferred((deferred) => {
        const $imageInput = this.$dialog.find(".note-image-input");
        const $imageUrl = this.$dialog.find(".note-image-url");
        const $imageBtn = this.$dialog.find(".note-image-btn");
        this.ui.onDialogShown(this.$dialog, () => {
          this.context.triggerEvent("dialog.shown");
          $imageInput.replaceWith($imageInput.clone().on("change", (event2) => {
            deferred.resolve(event2.target.files || event2.target.value);
          }).val(""));
          $imageUrl.on("input paste propertychange", () => {
            this.ui.toggleBtn($imageBtn, $imageUrl.val());
          }).val("");
          if (!env.isSupportTouch) {
            $imageUrl.trigger("focus");
          }
          $imageBtn.on("click", (event2) => {
            event2.preventDefault();
            deferred.resolve($imageUrl.val());
          });
          this.bindEnterKey($imageUrl, $imageBtn);
        });
        this.ui.onDialogHidden(this.$dialog, () => {
          $imageInput.off();
          $imageUrl.off();
          $imageBtn.off();
          if (deferred.state() === "pending") {
            deferred.reject();
          }
        });
        this.ui.showDialog(this.$dialog);
      });
    }
  }
  class ImagePopover {
    constructor(context) {
      this.context = context;
      this.ui = $.summernote.ui;
      this.editable = context.layoutInfo.editable[0];
      this.options = context.options;
      this.events = {
        "summernote.disable summernote.dialog.shown": () => {
          this.hide();
        },
        "summernote.blur": (we, event2) => {
          if (event2.originalEvent && event2.originalEvent.relatedTarget) {
            if (!this.$popover[0].contains(event2.originalEvent.relatedTarget)) {
              this.hide();
            }
          } else {
            this.hide();
          }
        }
      };
    }
    shouldInitialize() {
      return !lists.isEmpty(this.options.popover.image);
    }
    initialize() {
      this.$popover = this.ui.popover({
        className: "note-image-popover"
      }).render().appendTo(this.options.container);
      const $content = this.$popover.find(".popover-content,.note-popover-content");
      this.context.invoke("buttons.build", $content, this.options.popover.image);
      this.$popover.on("mousedown", (event2) => {
        event2.preventDefault();
      });
    }
    destroy() {
      this.$popover.remove();
    }
    update(target, event2) {
      if (dom.isImg(target)) {
        const position2 = $(target).offset();
        const containerOffset = $(this.options.container).offset();
        let pos = {};
        if (this.options.popatmouse) {
          pos.left = event2.pageX - 20;
          pos.top = event2.pageY;
        } else {
          pos = position2;
        }
        pos.top -= containerOffset.top;
        pos.left -= containerOffset.left;
        this.$popover.css({
          display: "block",
          left: pos.left,
          top: pos.top
        });
      } else {
        this.hide();
      }
    }
    hide() {
      this.$popover.hide();
    }
  }
  class TablePopover {
    constructor(context) {
      this.context = context;
      this.ui = $.summernote.ui;
      this.options = context.options;
      this.events = {
        "summernote.mousedown": (we, event2) => {
          this.update(event2.target);
        },
        "summernote.keyup summernote.scroll summernote.change": () => {
          this.update();
        },
        "summernote.disable summernote.dialog.shown": () => {
          this.hide();
        },
        "summernote.blur": (we, event2) => {
          if (event2.originalEvent && event2.originalEvent.relatedTarget) {
            if (!this.$popover[0].contains(event2.originalEvent.relatedTarget)) {
              this.hide();
            }
          } else {
            this.hide();
          }
        }
      };
    }
    shouldInitialize() {
      return !lists.isEmpty(this.options.popover.table);
    }
    initialize() {
      this.$popover = this.ui.popover({
        className: "note-table-popover"
      }).render().appendTo(this.options.container);
      const $content = this.$popover.find(".popover-content,.note-popover-content");
      this.context.invoke("buttons.build", $content, this.options.popover.table);
      if (env.isFF) {
        document.execCommand("enableInlineTableEditing", false, false);
      }
      this.$popover.on("mousedown", (event2) => {
        event2.preventDefault();
      });
    }
    destroy() {
      this.$popover.remove();
    }
    update(target) {
      if (this.context.isDisabled()) {
        return false;
      }
      const isCell2 = dom.isCell(target) || dom.isCell(target == null ? void 0 : target.parentElement);
      if (isCell2) {
        const pos = dom.posFromPlaceholder(target);
        const containerOffset = $(this.options.container).offset();
        pos.top -= containerOffset.top;
        pos.left -= containerOffset.left;
        this.$popover.css({
          display: "block",
          left: pos.left,
          top: pos.top
        });
      } else {
        this.hide();
      }
      return isCell2;
    }
    hide() {
      this.$popover.hide();
    }
  }
  class VideoDialog {
    constructor(context) {
      this.context = context;
      this.ui = $.summernote.ui;
      this.$body = $(document.body);
      this.$editor = context.layoutInfo.editor;
      this.options = context.options;
      this.lang = this.options.langInfo;
    }
    initialize() {
      const $container = this.options.dialogsInBody ? this.$body : this.options.container;
      const body = [
        '<div class="form-group note-form-group row-fluid">',
        `<label for="note-dialog-video-url-${this.options.id}" class="note-form-label">${this.lang.video.url} <small class="text-muted">${this.lang.video.providers}</small></label>`,
        `<input id="note-dialog-video-url-${this.options.id}" class="note-video-url form-control note-form-control note-input" type="text"/>`,
        "</div>"
      ].join("");
      const buttonClass = "btn btn-primary note-btn note-btn-primary note-video-btn";
      const footer = `<input type="button" href="#" class="${buttonClass}" value="${this.lang.video.insert}" disabled>`;
      this.$dialog = this.ui.dialog({
        title: this.lang.video.insert,
        fade: this.options.dialogsFade,
        body,
        footer
      }).render().appendTo($container);
    }
    destroy() {
      this.ui.hideDialog(this.$dialog);
      this.$dialog.remove();
    }
    bindEnterKey($input, $btn) {
      $input.on("keypress", (event2) => {
        if (event2.keyCode === key.code.ENTER) {
          event2.preventDefault();
          $btn.trigger("click");
        }
      });
    }
    createVideoNode(url) {
      const ytRegExp = /(?:youtu\.be\/|youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|shorts\/|live\/))([^&\n?]+)(?:.*[?&]t=([^&\n]+))?.*/;
      const ytRegExpForStart = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/;
      const ytMatch = url.match(ytRegExp);
      const gdRegExp = /(?:\.|\/\/)drive\.google\.com\/file\/d\/(.[a-zA-Z0-9_-]*)\/view/;
      const gdMatch = url.match(gdRegExp);
      const igRegExp = /(?:www\.|\/\/)instagram\.com\/(reel|p)\/(.[a-zA-Z0-9_-]*)/;
      const igMatch = url.match(igRegExp);
      const vRegExp = /\/\/vine\.co\/v\/([a-zA-Z0-9]+)/;
      const vMatch = url.match(vRegExp);
      const vimRegExp = /\/\/(player\.)?vimeo\.com\/([a-z]*\/)*(\d+)[?]?.*/;
      const vimMatch = url.match(vimRegExp);
      const dmRegExp = /.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/;
      const dmMatch = url.match(dmRegExp);
      const youkuRegExp = /\/\/v\.youku\.com\/v_show\/id_(\w+)=*\.html/;
      const youkuMatch = url.match(youkuRegExp);
      const peerTubeRegExp = /\/\/(.*)\/videos\/watch\/([^?]*)(?:\?(?:start=(\w*))?(?:&stop=(\w*))?(?:&loop=([10]))?(?:&autoplay=([10]))?(?:&muted=([10]))?)?/;
      const peerTubeMatch = url.match(peerTubeRegExp);
      const qqRegExp = /\/\/v\.qq\.com.*?vid=(.+)/;
      const qqMatch = url.match(qqRegExp);
      const qqRegExp2 = /\/\/v\.qq\.com\/x?\/?(page|cover).*?\/([^\/]+)\.html\??.*/;
      const qqMatch2 = url.match(qqRegExp2);
      const mp4RegExp = /^.+.(mp4|m4v)$/;
      const mp4Match = url.match(mp4RegExp);
      const oggRegExp = /^.+.(ogg|ogv)$/;
      const oggMatch = url.match(oggRegExp);
      const webmRegExp = /^.+.(webm)$/;
      const webmMatch = url.match(webmRegExp);
      const fbRegExp = /(?:www\.|\/\/)facebook\.com\/([^\/]+)\/videos\/([0-9]+)/;
      const fbMatch = url.match(fbRegExp);
      let $video;
      if (ytMatch && ytMatch[1].length === 11) {
        const youtubeId = ytMatch[1];
        var start = 0;
        if (typeof ytMatch[2] !== "undefined") {
          const ytMatchForStart = ytMatch[2].match(ytRegExpForStart);
          if (ytMatchForStart) {
            for (var n = [3600, 60, 1], i = 0, r = n.length; i < r; i++) {
              start += typeof ytMatchForStart[i + 1] !== "undefined" ? n[i] * parseInt(ytMatchForStart[i + 1], 10) : 0;
            }
          } else {
            start = parseInt(ytMatch[2], 10);
          }
        }
        $video = $("<iframe>").attr("frameborder", 0).attr("src", "//www.youtube.com/embed/" + youtubeId + (start > 0 ? "?start=" + start : "")).attr("width", "640").attr("height", "360");
      } else if (gdMatch && gdMatch[0].length) {
        $video = $("<iframe>").attr("frameborder", 0).attr("src", "https://drive.google.com/file/d/" + gdMatch[1] + "/preview").attr("width", "640").attr("height", "480");
      } else if (igMatch && igMatch[0].length) {
        $video = $("<iframe>").attr("frameborder", 0).attr("src", "https://instagram.com/p/" + igMatch[2] + "/embed/").attr("width", "612").attr("height", "710").attr("scrolling", "no").attr("allowtransparency", "true");
      } else if (vMatch && vMatch[0].length) {
        $video = $("<iframe>").attr("frameborder", 0).attr("src", vMatch[0] + "/embed/simple").attr("width", "600").attr("height", "600").attr("class", "vine-embed");
      } else if (vimMatch && vimMatch[3].length) {
        $video = $("<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>").attr("frameborder", 0).attr("src", "//player.vimeo.com/video/" + vimMatch[3]).attr("width", "640").attr("height", "360");
      } else if (dmMatch && dmMatch[2].length) {
        $video = $("<iframe>").attr("frameborder", 0).attr("src", "//www.dailymotion.com/embed/video/" + dmMatch[2]).attr("width", "640").attr("height", "360");
      } else if (youkuMatch && youkuMatch[1].length) {
        $video = $("<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>").attr("frameborder", 0).attr("height", "498").attr("width", "510").attr("src", "//player.youku.com/embed/" + youkuMatch[1]);
      } else if (peerTubeMatch && peerTubeMatch[0].length) {
        var begin = 0;
        if (peerTubeMatch[2] !== "undefined") begin = peerTubeMatch[2];
        var end = 0;
        if (peerTubeMatch[3] !== "undefined") end = peerTubeMatch[3];
        var loop = 0;
        if (peerTubeMatch[4] !== "undefined") loop = peerTubeMatch[4];
        var autoplay = 0;
        if (peerTubeMatch[5] !== "undefined") autoplay = peerTubeMatch[5];
        var muted = 0;
        if (peerTubeMatch[6] !== "undefined") muted = peerTubeMatch[6];
        $video = $('<iframe allowfullscreen sandbox="allow-same-origin allow-scripts allow-popups">').attr("frameborder", 0).attr("src", "//" + peerTubeMatch[1] + "/videos/embed/" + peerTubeMatch[2] + "?loop=" + loop + "&autoplay=" + autoplay + "&muted=" + muted + (begin > 0 ? "&start=" + begin : "") + (end > 0 ? "&end=" + start : "")).attr("width", "560").attr("height", "315");
      } else if (qqMatch && qqMatch[1].length || qqMatch2 && qqMatch2[2].length) {
        const vid = qqMatch && qqMatch[1].length ? qqMatch[1] : qqMatch2[2];
        $video = $("<iframe webkitallowfullscreen mozallowfullscreen allowfullscreen>").attr("frameborder", 0).attr("height", "310").attr("width", "500").attr("src", "https://v.qq.com/txp/iframe/player.html?vid=" + vid + "&amp;auto=0");
      } else if (mp4Match || oggMatch || webmMatch) {
        $video = $("<video controls>").attr("src", url).attr("width", "640").attr("height", "360");
      } else if (fbMatch && fbMatch[0].length) {
        $video = $("<iframe>").attr("frameborder", 0).attr("src", "https://www.facebook.com/plugins/video.php?href=" + encodeURIComponent(fbMatch[0]) + "&show_text=0&width=560").attr("width", "560").attr("height", "301").attr("scrolling", "no").attr("allowtransparency", "true");
      } else {
        return false;
      }
      $video.addClass("note-video-clip");
      return $video[0];
    }
    show() {
      const text = this.context.invoke("editor.getSelectedText");
      this.context.invoke("editor.saveRange");
      this.showVideoDialog(text).then((url) => {
        this.ui.hideDialog(this.$dialog);
        this.context.invoke("editor.restoreRange");
        const $node = this.createVideoNode(url);
        if ($node) {
          this.context.invoke("editor.insertNode", $node);
        }
      }).fail(() => {
        this.context.invoke("editor.restoreRange");
      });
    }
    /**
     * show video dialog
     *
     * @param {jQuery} $dialog
     * @return {Promise}
     */
    showVideoDialog() {
      return $.Deferred((deferred) => {
        const $videoUrl = this.$dialog.find(".note-video-url");
        const $videoBtn = this.$dialog.find(".note-video-btn");
        this.ui.onDialogShown(this.$dialog, () => {
          this.context.triggerEvent("dialog.shown");
          $videoUrl.on("input paste propertychange", () => {
            this.ui.toggleBtn($videoBtn, $videoUrl.val());
          });
          if (!env.isSupportTouch) {
            $videoUrl.trigger("focus");
          }
          $videoBtn.on("click", (event2) => {
            event2.preventDefault();
            deferred.resolve($videoUrl.val());
          });
          this.bindEnterKey($videoUrl, $videoBtn);
        });
        this.ui.onDialogHidden(this.$dialog, () => {
          $videoUrl.off();
          $videoBtn.off();
          if (deferred.state() === "pending") {
            deferred.reject();
          }
        });
        this.ui.showDialog(this.$dialog);
      });
    }
  }
  class HelpDialog {
    constructor(context) {
      this.context = context;
      this.ui = $.summernote.ui;
      this.$body = $(document.body);
      this.$editor = context.layoutInfo.editor;
      this.options = context.options;
      this.lang = this.options.langInfo;
    }
    initialize() {
      const $container = this.options.dialogsInBody ? this.$body : this.options.container;
      const body = [
        '<p class="text-center">',
        '<a href="http://summernote.org/" target="_blank" rel="noopener noreferrer">Summernote @@VERSION@@</a> · ',
        '<a href="https://github.com/summernote/summernote" target="_blank" rel="noopener noreferrer">Project</a> · ',
        '<a href="https://github.com/summernote/summernote/issues" target="_blank" rel="noopener noreferrer">Issues</a>',
        "</p>"
      ].join("");
      this.$dialog = this.ui.dialog({
        title: this.lang.options.help,
        fade: this.options.dialogsFade,
        body: this.createShortcutList(),
        footer: body,
        callback: ($node) => {
          $node.find(".modal-body,.note-modal-body").css({
            "max-height": 300,
            "overflow": "scroll"
          });
        }
      }).render().appendTo($container);
    }
    destroy() {
      this.ui.hideDialog(this.$dialog);
      this.$dialog.remove();
    }
    createShortcutList() {
      const keyMap = this.options.keyMap[env.isMac ? "mac" : "pc"];
      return Object.keys(keyMap).map((key2) => {
        const command = keyMap[key2];
        const $row = $('<div><div class="help-list-item"></div></div>');
        $row.append($("<label><kbd>" + key2 + "</kdb></label>").css({
          "width": 180,
          "margin-right": 10
        })).append($("<span></span>").html(this.context.memo("help." + command) || command));
        return $row.html();
      }).join("");
    }
    /**
     * show help dialog
     *
     * @return {Promise}
     */
    showHelpDialog() {
      return $.Deferred((deferred) => {
        this.ui.onDialogShown(this.$dialog, () => {
          this.context.triggerEvent("dialog.shown");
          deferred.resolve();
        });
        this.ui.showDialog(this.$dialog);
      }).promise();
    }
    show() {
      this.context.invoke("editor.saveRange");
      this.showHelpDialog().then(() => {
        this.context.invoke("editor.restoreRange");
      });
    }
  }
  const AIRMODE_POPOVER_X_OFFSET = -5;
  const AIRMODE_POPOVER_Y_OFFSET = 10;
  class AirPopover {
    constructor(context) {
      this.context = context;
      this.ui = $.summernote.ui;
      this.options = context.options;
      this.hidable = true;
      this.onContextmenu = false;
      this.pageX = null;
      this.pageY = null;
      this.events = {
        "summernote.contextmenu": (event2) => {
          if (this.options.editing) {
            event2.preventDefault();
            event2.stopPropagation();
            this.onContextmenu = true;
            this.update(true);
          }
        },
        "summernote.mousedown": (we, event2) => {
          this.pageX = event2.pageX;
          this.pageY = event2.pageY;
        },
        "summernote.keyup summernote.mouseup summernote.scroll": (we, event2) => {
          if (this.options.editing && !this.onContextmenu) {
            if (event2.type == "keyup") {
              let range2 = this.context.invoke("editor.getLastRange");
              let wordRange = range2.getWordRange();
              const lastWordRect = lists.last(wordRange.getClientRects());
              if (lastWordRect) {
                const bnd = func.rect2bnd(lastWordRect);
                this.pageX = bnd.left;
                this.pageY = bnd.top;
              }
            } else {
              this.pageX = event2.pageX;
              this.pageY = event2.pageY;
            }
            this.update();
          }
          this.onContextmenu = false;
        },
        "summernote.disable summernote.change summernote.dialog.shown summernote.blur": () => {
          this.hide();
        },
        "summernote.focusout": () => {
          if (!this.$popover.is(":active,:focus")) {
            this.hide();
          }
        }
      };
    }
    shouldInitialize() {
      return this.options.airMode && !lists.isEmpty(this.options.popover.air);
    }
    initialize() {
      this.$popover = this.ui.popover({
        className: "note-air-popover"
      }).render().appendTo(this.options.container);
      const $content = this.$popover.find(".note-popover-content");
      this.context.invoke("buttons.build", $content, this.options.popover.air);
      this.$popover.on("mousedown", () => {
        this.hidable = false;
      });
      this.$popover.on("mouseup", () => {
        this.hidable = true;
      });
    }
    destroy() {
      this.$popover.remove();
    }
    update(forcelyOpen) {
      const styleInfo = this.context.invoke("editor.currentStyle");
      if (styleInfo.range && (!styleInfo.range.isCollapsed() || forcelyOpen)) {
        let rect = {
          left: this.pageX,
          top: this.pageY
        };
        const containerOffset = $(this.options.container).offset();
        rect.top -= containerOffset.top;
        rect.left -= containerOffset.left;
        this.$popover.css({
          display: "block",
          left: Math.abs(AIRMODE_POPOVER_X_OFFSET),
          top: rect.top + AIRMODE_POPOVER_Y_OFFSET
        });
        this.$popover.find(".note-popover-arrow").css({
          left: Math.max(rect.left, 0) + AIRMODE_POPOVER_X_OFFSET
        });
        this.context.invoke("buttons.updateCurrentStyle", this.$popover);
      } else {
        this.hide();
      }
    }
    updateCodeview(isCodeview) {
      this.ui.toggleBtnActive(this.$popover.find(".btn-codeview"), isCodeview);
      if (isCodeview) {
        this.hide();
      }
    }
    hide() {
      if (this.hidable) {
        this.$popover.hide();
      }
    }
  }
  const POPOVER_DIST = 5;
  class HintPopover {
    constructor(context) {
      this.context = context;
      this.ui = $.summernote.ui;
      this.$editable = context.layoutInfo.editable;
      this.options = context.options;
      this.hint = this.options.hint || [];
      this.direction = this.options.hintDirection || "bottom";
      this.hints = Array.isArray(this.hint) ? this.hint : [this.hint];
      this.events = {
        "summernote.keyup": (we, event2) => {
          if (!event2.isDefaultPrevented()) {
            this.handleKeyup(event2);
          }
        },
        "summernote.keydown": (we, event2) => {
          this.handleKeydown(event2);
        },
        "summernote.disable summernote.dialog.shown summernote.blur": () => {
          this.hide();
        }
      };
    }
    shouldInitialize() {
      return this.hints.length > 0;
    }
    initialize() {
      this.lastWordRange = null;
      this.matchingWord = null;
      this.$popover = this.ui.popover({
        className: "note-hint-popover",
        hideArrow: true,
        direction: ""
      }).render().appendTo(this.options.container);
      this.$popover.hide();
      this.$content = this.$popover.find(".popover-content,.note-popover-content");
      this.$content.on("click", ".note-hint-item", (event2) => {
        this.$content.find(".active").removeClass("active");
        $(event2.currentTarget).addClass("active");
        this.replace();
      });
      this.$popover.on("mousedown", (event2) => {
        event2.preventDefault();
      });
    }
    destroy() {
      this.$popover.remove();
    }
    selectItem($item) {
      this.$content.find(".active").removeClass("active");
      $item.addClass("active");
      this.$content[0].scrollTop = $item[0].offsetTop - this.$content.innerHeight() / 2;
    }
    moveDown() {
      const $current = this.$content.find(".note-hint-item.active");
      const $next = $current.next();
      if ($next.length) {
        this.selectItem($next);
      } else {
        let $nextGroup = $current.parent().next();
        if (!$nextGroup.length) {
          $nextGroup = this.$content.find(".note-hint-group").first();
        }
        this.selectItem($nextGroup.find(".note-hint-item").first());
      }
    }
    moveUp() {
      const $current = this.$content.find(".note-hint-item.active");
      const $prev = $current.prev();
      if ($prev.length) {
        this.selectItem($prev);
      } else {
        let $prevGroup = $current.parent().prev();
        if (!$prevGroup.length) {
          $prevGroup = this.$content.find(".note-hint-group").last();
        }
        this.selectItem($prevGroup.find(".note-hint-item").last());
      }
    }
    replace() {
      const $item = this.$content.find(".note-hint-item.active");
      if ($item.length) {
        var node = this.nodeFromItem($item);
        if (this.matchingWord !== null && this.matchingWord.length === 0) {
          this.lastWordRange.so = this.lastWordRange.eo;
        } else if (this.matchingWord !== null && this.matchingWord.length > 0 && !this.lastWordRange.isCollapsed()) {
          let rangeCompute = this.lastWordRange.eo - this.lastWordRange.so - this.matchingWord.length;
          if (rangeCompute > 0) {
            this.lastWordRange.so += rangeCompute;
          }
        }
        this.lastWordRange.insertNode(node);
        if (this.options.hintSelect === "next") {
          var blank = document.createTextNode("");
          $(node).after(blank);
          range.createFromNodeBefore(blank).select();
        } else {
          range.createFromNodeAfter(node).select();
        }
        this.lastWordRange = null;
        this.hide();
        this.context.invoke("editor.focus");
        this.context.triggerEvent("change", this.$editable.html(), this.$editable);
      }
    }
    nodeFromItem($item) {
      const hint = this.hints[$item.data("index")];
      const item = $item.data("item");
      let node = hint.content ? hint.content(item) : item;
      if (typeof node === "string") {
        node = dom.createText(node);
      }
      return node;
    }
    createItemTemplates(hintIdx, items) {
      const hint = this.hints[hintIdx];
      return items.map((item, idx) => {
        const $item = $('<div class="note-hint-item"></div>');
        $item.append(hint.template ? hint.template(item) : item + "");
        $item.data({
          "index": hintIdx,
          "item": item
        });
        if (hintIdx === 0 && idx === 0) {
          $item.addClass("active");
        }
        return $item;
      });
    }
    handleKeydown(event2) {
      if (!this.$popover.is(":visible")) {
        return;
      }
      if (event2.keyCode === key.code.ENTER) {
        event2.preventDefault();
        this.replace();
      } else if (event2.keyCode === key.code.UP) {
        event2.preventDefault();
        this.moveUp();
      } else if (event2.keyCode === key.code.DOWN) {
        event2.preventDefault();
        this.moveDown();
      }
    }
    searchKeyword(index, keyword, callback) {
      const hint = this.hints[index];
      if (hint && hint.match.test(keyword) && hint.search) {
        const matches = hint.match.exec(keyword);
        this.matchingWord = matches[0];
        hint.search(matches[1], callback);
      } else {
        callback();
      }
    }
    createGroup(idx, keyword) {
      const $group = $('<div class="note-hint-group note-hint-group-' + idx + '"></div>');
      this.searchKeyword(idx, keyword, (items) => {
        items = items || [];
        if (items.length) {
          $group.html(this.createItemTemplates(idx, items));
          this.show();
        }
      });
      return $group;
    }
    handleKeyup(event2) {
      if (!lists.contains([key.code.ENTER, key.code.UP, key.code.DOWN], event2.keyCode)) {
        let range2 = this.context.invoke("editor.getLastRange");
        let wordRange, keyword;
        if (this.options.hintMode === "words") {
          wordRange = range2.getWordsRange(range2);
          keyword = wordRange.toString();
          this.hints.forEach((hint) => {
            if (hint.match.test(keyword)) {
              wordRange = range2.getWordsMatchRange(hint.match);
              return false;
            }
          });
          if (!wordRange) {
            this.hide();
            return;
          }
          keyword = wordRange.toString();
        } else {
          wordRange = range2.getWordRange();
          keyword = wordRange.toString();
        }
        if (this.hints.length && keyword) {
          this.$content.empty();
          const bnd = func.rect2bnd(lists.last(wordRange.getClientRects()));
          const containerOffset = $(this.options.container).offset();
          if (bnd) {
            bnd.top -= containerOffset.top;
            bnd.left -= containerOffset.left;
            this.$popover.hide();
            this.lastWordRange = wordRange;
            this.hints.forEach((hint, idx) => {
              if (hint.match.test(keyword)) {
                this.createGroup(idx, keyword).appendTo(this.$content);
              }
            });
            this.$content.find(".note-hint-item").first().addClass("active");
            if (this.direction === "top") {
              this.$popover.css({
                left: bnd.left,
                top: bnd.top - this.$popover.outerHeight() - POPOVER_DIST
              });
            } else {
              this.$popover.css({
                left: bnd.left,
                top: bnd.top + bnd.height + POPOVER_DIST
              });
            }
          }
        } else {
          this.hide();
        }
      }
    }
    show() {
      this.$popover.show();
    }
    hide() {
      this.$popover.hide();
    }
  }
  class CodePopover {
    constructor(context) {
      this.context = context;
      this.ui = $.summernote.ui;
      this.$editable = context.layoutInfo.editable;
      this.options = context.options;
      this.codeLanguages = this.options.codeLanguages || [];
      this.codeLanguagePrefix = this.options.codeLanguagePrefix || "";
      this.events = {
        "summernote.keyup summernote.mouseup summernote.change summernote.scroll": () => {
          this.update();
        },
        "summernote.disable summernote.dialog.shown": () => {
          this.hide();
        },
        "summernote.blur": (we, e) => {
          if (e.originalEvent && e.originalEvent.relatedTarget) {
            if (!this.$popover[0].contains(e.originalEvent.relatedTarget)) {
              this.hide();
            }
          } else {
            this.hide();
          }
        }
      };
    }
    shouldInitialize() {
      return this.codeLanguages.length > 0;
    }
    initialize() {
      this.$popover = this.ui.popover({
        className: "note-code-popover"
      }).render().appendTo(this.options.container);
      this.$popover.hide();
      this.$content = this.$popover.find(".popover-content,.note-popover-content");
      this.$codeBlock = null;
      this.currentLanguage = null;
      this.$popover.on("mousedown", (e) => {
        e.preventDefault();
      });
    }
    destroy() {
      this.$popover.remove();
    }
    toggleLanguageDropdown($button) {
      var isOpened = $button.parent().hasClass("open");
      if (isOpened) {
        $button.removeClass("active");
        $button.parent().removeClass("open");
      } else {
        $button.addClass("active");
        $button.parent().addClass("open");
      }
    }
    onCodeLanguageSelected($codeStyle) {
      const newLanguage = $codeStyle.data("value");
      if (newLanguage) {
        this.$codeBlock.attr("class", this.codeLanguagePrefix ? this.codeLanguagePrefix + newLanguage : newLanguage);
      } else {
        this.$codeBlock.attr("class", null);
      }
    }
    buildItemTemplate(item, isRow) {
      const $codeItem = $('<a class="note-dropdown-item ' + (isRow ? "note-dropdown-item-row" : "") + (item.value === this.currentLanguage ? " note-dropdown-item-selected" : "") + '" href="#" data-value="' + item.value + '" role="listitem" aria-label="' + item.value + '">' + item.text + "</a>");
      $codeItem.on("click", (event2) => {
        this.onCodeLanguageSelected($(event2.currentTarget));
        this.context.triggerEvent("change", this.$editable.html(), this.$editable);
        event2.stopImmediatePropagation();
        event2.preventDefault();
      });
      return $codeItem;
    }
    update() {
      if (!this.context.invoke("editor.hasFocus")) {
        this.hide();
        return;
      }
      const rng = this.context.invoke("editor.getLastRange");
      const codeBlock = dom.ancestor(rng.sc, dom.isPre);
      if (codeBlock) {
        this.$content.empty();
        this.$popover.hide();
        this.$codeBlock = $(codeBlock);
        this.currentLanguage = this.$codeBlock.attr("class") || "";
        if (this.codeLanguagePrefix) {
          this.currentLanguage = this.currentLanguage.replace(this.codeLanguagePrefix, "");
        }
        const $group = $('<div class="note-code-select"></div>');
        const $button = $('<button type="button" class="note-btn dropdown-toggle" tabindex="-1" data-toggle="dropdown" aria-label="Code Style"><div class="note-btn-group"><span class="material-icons">code</span>&nbsp;&nbsp;<span class="material-icons">arrow_drop_down</span></div></button>');
        $button.on("click", (e) => {
          this.toggleLanguageDropdown($(e.currentTarget));
          e.stopImmediatePropagation();
        });
        const $selectGroup = $('<div class="note-code-dropdown dropdown-style" role="list" aria-label="Code Style"></div>');
        $.each(this.codeLanguages, (i, item) => {
          let $codeItem;
          if (Array.isArray(item)) {
            $codeItem = $('<div class="note-code-list"></div>');
            var $itemList = item.map((i2) => this.buildItemTemplate(i2, true));
            $codeItem.append($itemList);
          } else {
            $codeItem = this.buildItemTemplate(item);
          }
          $selectGroup.append($codeItem);
        });
        $group.append($button);
        $group.append($selectGroup);
        $group.appendTo(this.$content);
        const pos = dom.posFromPlaceholder(codeBlock);
        const containerOffset = $(this.options.container).offset();
        pos.top -= containerOffset.top + 24;
        pos.left -= containerOffset.left;
        this.$popover.css({
          display: "block",
          left: pos.left,
          top: pos.top
        });
      } else {
        this.hide();
      }
    }
    hide() {
      this.$popover.hide();
    }
  }
  class PastePopover {
    constructor(context) {
      this.context = context;
      this.ui = $.summernote.ui;
      this.$editable = context.layoutInfo.editable;
      this.options = context.options;
      this.pasteSanitizer = this.options.pasteSanitizer;
      this.pasteContent = void 0;
      this.events = {
        "summernote.paste": (summernoteEvent, event2) => {
          this.update(summernoteEvent, event2);
        },
        "summernote.disable summernote.dialog.shown": () => {
          this.hide();
        },
        "summernote.blur": (we, e) => {
          if (e.originalEvent && e.originalEvent.relatedTarget) {
            if (!this.$popover[0].contains(e.originalEvent.relatedTarget)) {
              this.hide();
            }
          } else {
            this.hide();
          }
        }
      };
    }
    shouldInitialize() {
      return !this.options.noPasteFormat;
    }
    initialize() {
      this.$popover = this.ui.popover({
        className: "note-code-popover"
      }).render().appendTo(this.options.container);
      this.$popover.hide();
      this.$content = this.$popover.find(".popover-content,.note-popover-content");
      this.$popover.on("mousedown", (event2) => {
        event2.preventDefault();
      });
    }
    destroy() {
      this.$popover.remove();
    }
    insertContent(insertType, content) {
      const userAgent2 = window.navigator.userAgent;
      let msIE = userAgent2.indexOf("MSIE ");
      msIE = msIE > 0 || !!navigator.userAgent.match(/Trident.*rv:11\./);
      const firefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      if (content) {
        if (msIE || firefox) {
          setTimeout(() => {
            document.execCommand(insertType, false, content);
          }, 10);
        } else {
          document.execCommand(insertType, false, content);
        }
      }
    }
    formatPaste(event2) {
      event2.stopImmediatePropagation();
      this.context.invoke("editor.undo");
      const plainContent = $(this.pasteContent.replaceAll("</p>", "</p>\n").replaceAll("<br/>", "<br/>\n").replaceAll("</div>", "</div>\n").replaceAll("</li>", "</li>\n").replaceAll("</ol>", "</ol>\n").replaceAll("</h1>", "</h1>\n").replaceAll("</h2>", "</h2>\n").replaceAll("</h3>", "</h3>\n").replaceAll("</h4>", "</h4>\n").replaceAll("</h5>", "</h5>\n")).text();
      this.insertContent("insertText", plainContent);
      this.$popover.hide();
    }
    showPastePopup() {
      const rng = this.context.invoke("editor.getLastRange");
      const pasteBlock = dom.ancestor(rng.sc, dom.isPara);
      this.$content.empty();
      this.$popover.hide();
      const $group = $('<div class="note-paste-mode"></div>');
      const $button = $('<button type="button" class="note-btn dropdown-toggle" tabindex="-1" data-toggle="dropdown" aria-label="Paste mode"><div class="note-btn-group"><span class="material-icons">format_clear</span</div></button>');
      $button.on("click", (event2) => this.formatPaste(event2));
      $group.append($button);
      $group.appendTo(this.$content);
      const pos = dom.posFromPlaceholder(pasteBlock);
      const containerOffset = $(this.options.container).offset();
      pos.top -= containerOffset.top;
      pos.left -= containerOffset.left;
      this.$popover.css({
        display: "block",
        left: pos.left,
        top: pos.top
      });
      setTimeout((function() {
        this.$popover.hide();
      }).bind(this), 4e3);
    }
    update(summernoteEvent, event2) {
      if (!this.context.invoke("editor.hasFocus")) {
        this.hide();
        return;
      }
      event2.preventDefault();
      event2.stopImmediatePropagation();
      const userAgent2 = window.navigator.userAgent;
      let msIE = userAgent2.indexOf("MSIE ");
      msIE = msIE > 0 || !!navigator.userAgent.match(/Trident.*rv:11\./);
      let text;
      let type = "plain";
      if (msIE) {
        text = window.clipboardData.getData("Text");
      } else if (event2.originalEvent.clipboardData.types.includes("text/html")) {
        text = event2.originalEvent.clipboardData.getData("text/html");
        if (text) {
          type = "html";
        } else {
          text = event2.originalEvent.clipboardData.getData("text/plain");
        }
      } else {
        text = event2.originalEvent.clipboardData.getData("text/plain");
      }
      let parsedContent;
      if (this.pasteSanitizer) {
        parsedContent = this.pasteSanitizer(text, type, $(event2.target).parent());
      } else {
        parsedContent = text;
      }
      const insertType = type === "html" ? "insertHTML" : "insertText";
      this.pasteContent = parsedContent;
      this.insertContent(insertType, parsedContent);
      if (type === "html" && text.includes("<")) {
        this.showPastePopup();
      }
    }
    hide() {
      this.$popover.hide();
    }
  }
  $.summernote = $.extend($.summernote, {
    version: "@@VERSION@@",
    plugins: {},
    dom,
    range,
    lists,
    options: {
      langInfo: $.summernote.lang["en-US"],
      editing: true,
      modules: {
        "editor": Editor,
        "clipboard": Clipboard,
        "dropzone": Dropzone,
        "codeview": CodeView,
        "statusbar": Statusbar,
        "fullscreen": Fullscreen,
        "handle": Handle,
        // FIXME: HintPopover must be front of autolink
        //  - Script error about range when Enter key is pressed on hint popover
        "hintPopover": HintPopover,
        "codePopover": CodePopover,
        "pastePopover": PastePopover,
        "autoLink": AutoLink,
        "autoSync": AutoSync,
        "autoReplace": AutoReplace,
        "placeholder": Placeholder,
        "buttons": Buttons,
        "toolbar": Toolbar,
        "linkDialog": LinkDialog,
        "linkPopover": LinkPopover,
        "imageDialog": ImageDialog,
        "imagePopover": ImagePopover,
        "tablePopover": TablePopover,
        "videoDialog": VideoDialog,
        "helpDialog": HelpDialog,
        "airPopover": AirPopover
      },
      buttons: {},
      lang: "en-US",
      followingToolbar: false,
      toolbarPosition: "top",
      otherStaticBar: "",
      // ### : Add otherStaticBarHeight option
      otherStaticBarHeight: null,
      // toolbar
      codeviewKeepButton: false,
      toolbar: [
        ["style", ["style"]],
        ["font", ["bold", "underline", "clear"]],
        ["fontname", ["fontname"]],
        ["color", ["color"]],
        ["para", ["ul", "ol", "paragraph"]],
        ["table", ["table"]],
        ["insert", ["link", "picture", "video"]],
        ["view", ["fullscreen", "codeview", "help"]]
      ],
      // popover
      popatmouse: true,
      popover: {
        image: [
          ["resize", ["resizeFull", "resizeHalf", "resizeQuarter", "resizeNone"]],
          ["float", ["floatLeft", "floatRight", "floatNone"]],
          ["remove", ["removeMedia"]]
        ],
        link: [
          ["link", ["linkDialogShow", "unlink"]]
        ],
        table: [
          ["add", ["addRowDown", "addRowUp", "addColLeft", "addColRight"]],
          ["delete", ["deleteRow", "deleteCol", "deleteTable"]]
        ],
        air: [
          ["color", ["color"]],
          ["font", ["bold", "underline", "clear"]],
          ["para", ["ul", "paragraph"]],
          ["table", ["table"]],
          ["insert", ["link", "picture"]],
          ["view", ["fullscreen", "codeview"]]
        ],
        code: [
          ["code"]
        ]
      },
      // link options
      linkAddNoReferrer: false,
      addLinkNoOpener: false,
      // air mode: inline editor
      airMode: false,
      overrideContextMenu: false,
      // TBD
      width: null,
      height: null,
      linkTargetBlank: true,
      focus: false,
      tabDisable: false,
      tabSize: 4,
      styleWithCSS: false,
      shortcuts: true,
      textareaAutoSync: true,
      tooltip: "auto",
      container: null,
      maxTextLength: 0,
      blockquoteBreakingLevel: 2,
      spellCheck: true,
      disableGrammar: false,
      placeholder: null,
      inheritPlaceholder: false,
      // TODO: need to be documented
      recordEveryKeystroke: false,
      historyLimit: 200,
      // TODO: need to be documented
      showDomainOnlyForAutolink: false,
      // TODO: need to be documented
      hintMode: "word",
      hintSelect: "after",
      hintDirection: "bottom",
      codeLanguages: [],
      codeLanguagePrefix: null,
      // Disable paste format popover
      noPasteFormat: false,
      styleTags: ["p", "blockquote", "pre", "h1", "h2", "h3", "h4", "h5", "h6"],
      fontNames: [
        "Arial",
        "Arial Black",
        "Comic Sans MS",
        "Courier New",
        "Helvetica Neue",
        "Helvetica",
        "Impact",
        "Lucida Grande",
        "Tahoma",
        "Times New Roman",
        "Verdana"
      ],
      fontNamesIgnoreCheck: [],
      addDefaultFonts: true,
      fontSizes: ["8", "9", "10", "11", "12", "14", "18", "24", "36"],
      fontSizeUnits: ["px", "pt"],
      // pallete colors(n x n)
      colors: [
        ["#000000", "#424242", "#636363", "#9C9C94", "#CEC6CE", "#EFEFEF", "#F7F7F7", "#FFFFFF"],
        ["#FF0000", "#FF9C00", "#FFFF00", "#00FF00", "#00FFFF", "#0000FF", "#9C00FF", "#FF00FF"],
        ["#F7C6CE", "#FFE7CE", "#FFEFC6", "#D6EFD6", "#CEDEE7", "#CEE7F7", "#D6D6E7", "#E7D6DE"],
        ["#E79C9C", "#FFC69C", "#FFE79C", "#B5D6A5", "#A5C6CE", "#9CC6EF", "#B5A5D6", "#D6A5BD"],
        ["#E76363", "#F7AD6B", "#FFD663", "#94BD7B", "#73A5AD", "#6BADDE", "#8C7BC6", "#C67BA5"],
        ["#CE0000", "#E79439", "#EFC631", "#6BA54A", "#4A7B8C", "#3984C6", "#634AA5", "#A54A7B"],
        ["#9C0000", "#B56308", "#BD9400", "#397B21", "#104A5A", "#085294", "#311873", "#731842"],
        ["#630000", "#7B3900", "#846300", "#295218", "#083139", "#003163", "#21104A", "#4A1031"]
      ],
      // http://chir.ag/projects/name-that-color/
      colorsName: [
        ["Black", "Tundora", "Dove Gray", "Star Dust", "Pale Slate", "Gallery", "Alabaster", "White"],
        ["Red", "Orange Peel", "Yellow", "Green", "Cyan", "Blue", "Electric Violet", "Magenta"],
        ["Azalea", "Karry", "Egg White", "Zanah", "Botticelli", "Tropical Blue", "Mischka", "Twilight"],
        ["Tonys Pink", "Peach Orange", "Cream Brulee", "Sprout", "Casper", "Perano", "Cold Purple", "Careys Pink"],
        ["Mandy", "Rajah", "Dandelion", "Olivine", "Gulf Stream", "Viking", "Blue Marguerite", "Puce"],
        ["Guardsman Red", "Fire Bush", "Golden Dream", "Chelsea Cucumber", "Smalt Blue", "Boston Blue", "Butterfly Bush", "Cadillac"],
        ["Sangria", "Mai Tai", "Buddha Gold", "Forest Green", "Eden", "Venice Blue", "Meteorite", "Claret"],
        ["Rosewood", "Cinnamon", "Olive", "Parsley", "Tiber", "Midnight Blue", "Valentino", "Loulou"]
      ],
      colorButton: {
        foreColor: "#000000",
        backColor: "#FFFF00"
      },
      lineHeights: ["1.0", "1.2", "1.4", "1.5", "1.6", "1.8", "2.0", "3.0"],
      tableClassName: "table table-bordered",
      insertTableMaxSize: {
        col: 10,
        row: 10
      },
      // By default, dialogs are attached in container.
      dialogsInBody: false,
      dialogsFade: false,
      maximumImageFileSize: null,
      acceptImageFileTypes: "image/*",
      // Sanitize paste content
      pasteSanitizer: void 0,
      allowClipboardImagePasting: true,
      callbacks: {
        onBeforeCommand: null,
        onBlur: null,
        onBlurCodeview: null,
        onChange: null,
        onChangeCodeview: null,
        onDialogShown: null,
        onEnter: null,
        onFocus: null,
        onImageLinkInsert: null,
        onImageUpload: null,
        onImageUploadError: null,
        onInit: null,
        onKeydown: null,
        onKeyup: null,
        onMousedown: null,
        onMouseup: null,
        onPaste: null,
        onScroll: null
      },
      codemirror: {
        mode: "text/html",
        htmlMode: true,
        lineNumbers: true
      },
      codeviewFilter: true,
      codeviewFilterRegex: /<\/*(?:applet|b(?:ase|gsound|link)|embed|frame(?:set)?|ilayer|l(?:ayer|ink)|meta|object|s(?:cript|tyle)|t(?:itle|extarea)|xml)[^>]*?>/gi,
      codeviewIframeFilter: true,
      codeviewIframeWhitelistSrc: [],
      codeviewIframeWhitelistSrcBase: [
        "www.youtube.com",
        "www.youtube-nocookie.com",
        "www.facebook.com",
        "vine.co",
        "instagram.com",
        "player.vimeo.com",
        "www.dailymotion.com",
        "player.youku.com",
        "jumpingbean.tv",
        "v.qq.com"
      ],
      keyMap: {
        pc: {
          "ESC": "escape",
          "ENTER": "insertParagraph",
          "CTRL+Z": "undo",
          "CTRL+Y": "redo",
          "TAB": "tab",
          "SHIFT+TAB": "untab",
          "CTRL+B": "bold",
          "CTRL+I": "italic",
          "CTRL+U": "underline",
          "CTRL+SHIFT+S": "strikethrough",
          "CTRL+BACKSLASH": "removeFormat",
          "CTRL+SHIFT+L": "justifyLeft",
          "CTRL+SHIFT+E": "justifyCenter",
          "CTRL+SHIFT+R": "justifyRight",
          "CTRL+SHIFT+J": "justifyFull",
          "CTRL+SHIFT+NUM7": "insertUnorderedList",
          "CTRL+SHIFT+NUM8": "insertOrderedList",
          "CTRL+LEFTBRACKET": "outdent",
          "CTRL+RIGHTBRACKET": "indent",
          "CTRL+NUM0": "formatPara",
          "CTRL+NUM1": "formatH1",
          "CTRL+NUM2": "formatH2",
          "CTRL+NUM3": "formatH3",
          "CTRL+NUM4": "formatH4",
          "CTRL+NUM5": "formatH5",
          "CTRL+NUM6": "formatH6",
          "CTRL+ENTER": "insertHorizontalRule",
          "CTRL+K": "linkDialog.show"
        },
        mac: {
          "ESC": "escape",
          "ENTER": "insertParagraph",
          "CMD+Z": "undo",
          "CMD+SHIFT+Z": "redo",
          "TAB": "tab",
          "SHIFT+TAB": "untab",
          "CMD+B": "bold",
          "CMD+I": "italic",
          "CMD+U": "underline",
          "CMD+SHIFT+S": "strikethrough",
          "CMD+BACKSLASH": "removeFormat",
          "CMD+SHIFT+L": "justifyLeft",
          "CMD+SHIFT+E": "justifyCenter",
          "CMD+SHIFT+R": "justifyRight",
          "CMD+SHIFT+J": "justifyFull",
          "CMD+SHIFT+NUM7": "insertUnorderedList",
          "CMD+SHIFT+NUM8": "insertOrderedList",
          "CMD+LEFTBRACKET": "outdent",
          "CMD+RIGHTBRACKET": "indent",
          "CMD+NUM0": "formatPara",
          "CMD+NUM1": "formatH1",
          "CMD+NUM2": "formatH2",
          "CMD+NUM3": "formatH3",
          "CMD+NUM4": "formatH4",
          "CMD+NUM5": "formatH5",
          "CMD+NUM6": "formatH6",
          "CMD+ENTER": "insertHorizontalRule",
          "CMD+K": "linkDialog.show"
        }
      },
      icons: {
        "align": "note-icon-align",
        "alignCenter": "note-icon-align-center",
        "alignJustify": "note-icon-align-justify",
        "alignLeft": "note-icon-align-left",
        "alignRight": "note-icon-align-right",
        "rowBelow": "note-icon-row-below",
        "colBefore": "note-icon-col-before",
        "colAfter": "note-icon-col-after",
        "rowAbove": "note-icon-row-above",
        "rowRemove": "note-icon-row-remove",
        "colRemove": "note-icon-col-remove",
        "indent": "note-icon-align-indent",
        "outdent": "note-icon-align-outdent",
        "arrowsAlt": "note-icon-arrows-alt",
        "bold": "note-icon-bold",
        "caret": "note-icon-caret",
        "circle": "note-icon-circle",
        "close": "note-icon-close",
        "code": "note-icon-code",
        "eraser": "note-icon-eraser",
        "floatLeft": "note-icon-float-left",
        "floatRight": "note-icon-float-right",
        "font": "note-icon-font",
        "frame": "note-icon-frame",
        "italic": "note-icon-italic",
        "link": "note-icon-link",
        "unlink": "note-icon-chain-broken",
        "magic": "note-icon-magic",
        "menuCheck": "note-icon-menu-check",
        "minus": "note-icon-minus",
        "orderedlist": "note-icon-orderedlist",
        "pencil": "note-icon-pencil",
        "picture": "note-icon-picture",
        "question": "note-icon-question",
        "redo": "note-icon-redo",
        "rollback": "note-icon-rollback",
        "square": "note-icon-square",
        "strikethrough": "note-icon-strikethrough",
        "subscript": "note-icon-subscript",
        "superscript": "note-icon-superscript",
        "table": "note-icon-table",
        "textHeight": "note-icon-text-height",
        "trash": "note-icon-trash",
        "underline": "note-icon-underline",
        "undo": "note-icon-undo",
        "unorderedlist": "note-icon-unorderedlist",
        "video": "note-icon-video"
      }
    }
  });
  class Renderer {
    constructor(markup, children, options, callback) {
      this.markup = markup;
      this.children = children;
      this.options = options;
      this.callback = callback;
    }
    render($parent) {
      const $node = $(this.markup);
      if (this.options && this.options.contents) {
        $node.html(this.options.contents);
      }
      if (this.options && this.options.className) {
        $node.addClass(this.options.className);
      }
      if (this.options && this.options.data) {
        $.each(this.options.data, (k, v) => {
          $node.attr("data-" + k, v);
        });
      }
      if (this.options && this.options.click) {
        $node.on("click", this.options.click);
      }
      if (this.children) {
        const $container = $node.find(".note-children-container");
        this.children.forEach((child) => {
          child.render($container.length ? $container : $node);
        });
      }
      if (this.callback) {
        this.callback($node, this.options);
      }
      if (this.options && this.options.callback) {
        this.options.callback($node);
      }
      if ($parent) {
        $parent.append($node);
      }
      return $node;
    }
  }
  const renderer = {
    create: (markup, callback) => {
      return function() {
        const options = typeof arguments[1] === "object" ? arguments[1] : arguments[0];
        let children = Array.isArray(arguments[0]) ? arguments[0] : [];
        if (options && options.children) {
          children = options.children;
        }
        return new Renderer(markup, children, options, callback);
      };
    }
  };
  class TooltipUI {
    constructor($node, options) {
      this.$node = $node;
      this.options = $.extend({}, {
        title: "",
        target: options.container,
        trigger: "hover focus",
        placement: "bottom"
      }, options);
      this.$tooltip = $([
        '<div class="note-tooltip">',
        '<div class="note-tooltip-arrow"></div>',
        '<div class="note-tooltip-content"></div>',
        "</div>"
      ].join(""));
      if (this.options.trigger !== "manual") {
        const showCallback = this.show.bind(this);
        const hideCallback = this.hide.bind(this);
        const toggleCallback = this.toggle.bind(this);
        this.options.trigger.split(" ").forEach(function(eventName) {
          if (eventName === "hover") {
            $node.off("mouseenter mouseleave");
            $node.on("mouseenter", showCallback).on("mouseleave", hideCallback);
          } else if (eventName === "click") {
            $node.on("click", toggleCallback);
          } else if (eventName === "focus") {
            $node.on("focus", showCallback).on("blur", hideCallback);
          }
        });
      }
    }
    show() {
      const $node = this.$node;
      const offset = $node.offset();
      const targetOffset = $(this.options.target).offset();
      offset.top -= targetOffset.top;
      offset.left -= targetOffset.left;
      const $tooltip = this.$tooltip;
      const title = this.options.title || $node.attr("title") || $node.data("title");
      const placement = this.options.placement || $node.data("placement");
      $tooltip.addClass(placement);
      $tooltip.find(".note-tooltip-content").text(title);
      $tooltip.appendTo(this.options.target);
      const nodeWidth = $node.outerWidth();
      const nodeHeight = $node.outerHeight();
      const tooltipWidth = $tooltip.outerWidth();
      const tooltipHeight = $tooltip.outerHeight();
      if (placement === "bottom") {
        $tooltip.css({
          top: offset.top + nodeHeight,
          left: offset.left + (nodeWidth / 2 - tooltipWidth / 2)
        });
      } else if (placement === "top") {
        $tooltip.css({
          top: offset.top - tooltipHeight,
          left: offset.left + (nodeWidth / 2 - tooltipWidth / 2)
        });
      } else if (placement === "left") {
        $tooltip.css({
          top: offset.top + (nodeHeight / 2 - tooltipHeight / 2),
          left: offset.left - tooltipWidth
        });
      } else if (placement === "right") {
        $tooltip.css({
          top: offset.top + (nodeHeight / 2 - tooltipHeight / 2),
          left: offset.left + nodeWidth
        });
      }
      $tooltip.addClass("in");
    }
    hide() {
      this.$tooltip.removeClass("in");
      setTimeout(() => {
        this.$tooltip.remove();
      }, 200);
    }
    toggle() {
      if (this.$tooltip.hasClass("in")) {
        this.hide();
      } else {
        this.show();
      }
    }
  }
  class DropdownUI {
    constructor($node, options) {
      this.$button = $node;
      this.options = $.extend({}, {
        target: options.container
      }, options);
      this.setEvent();
    }
    setEvent() {
      this.$button.on("click", (e) => {
        this.toggle();
        e.stopImmediatePropagation();
      });
    }
    clear() {
      var $parent = $(".note-btn-group.open");
      $parent.find(".note-btn.active").removeClass("active");
      $parent.removeClass("open");
    }
    show() {
      this.$button.addClass("active");
      this.$button.parent().addClass("open");
      var $dropdown = this.$button.next();
      var offset = $dropdown.offset();
      var width = $dropdown.outerWidth();
      var windowWidth = $(window).width();
      var targetMarginRight = parseFloat($(this.options.target).css("margin-right"));
      if (offset.left + width > windowWidth - targetMarginRight) {
        $dropdown.css("margin-left", windowWidth - targetMarginRight - (offset.left + width));
      } else {
        $dropdown.css("margin-left", "");
      }
    }
    hide() {
      this.$button.removeClass("active");
      this.$button.parent().removeClass("open");
    }
    toggle() {
      var isOpened = this.$button.parent().hasClass("open");
      this.clear();
      if (isOpened) {
        this.hide();
      } else {
        this.show();
      }
    }
  }
  $(document).on("click.note-dropdown-menu", function(e) {
    if (!$(e.target).closest(".note-btn-group").length) {
      $(".note-btn-group.open .note-btn.active").removeClass("active");
      $(".note-btn-group.open").removeClass("open");
    }
  });
  $(document).on("click.note-dropdown-menu", function(e) {
    $(e.target).closest(".note-dropdown-menu").parent().removeClass("open");
    $(e.target).closest(".note-dropdown-menu").parent().find(".note-btn.active").removeClass("active");
  });
  class ModalUI {
    constructor($node) {
      this.$modal = $node;
      this.$backdrop = $('<div class="note-modal-backdrop"></div>');
    }
    show() {
      this.$backdrop.appendTo(document.body).show();
      this.$modal.addClass("open").show();
      this.$modal.trigger("note.modal.show");
      this.$modal.off("click", ".close").on("click", ".close", this.hide.bind(this));
      this.$modal.on("keydown", (event2) => {
        if (event2.which === 27) {
          event2.preventDefault();
          this.hide();
        }
      });
    }
    hide() {
      this.$modal.removeClass("open").hide();
      this.$backdrop.hide();
      this.$modal.trigger("note.modal.hide");
      this.$modal.off("keydown");
    }
  }
  const editor = renderer.create('<div class="note-editor note-frame"></div>');
  const toolbar = renderer.create('<div class="note-toolbar" role="toolbar"></div>');
  const editingArea = renderer.create('<div class="note-editing-area"></div>');
  const codable = renderer.create('<textarea class="note-codable" aria-multiline="true"></textarea>');
  const editable = renderer.create(
      '<div class="note-editable" contentEditable="true" role="textbox" aria-multiline="true"></div>'
  );
  const statusbar = renderer.create(
      [
        '<output class="note-status-output" role="status" aria-live="polite"></output>',
        '<div class="note-statusbar" role="status">',
        '<div class="note-resizebar" aria-label="resize">',
        '<div class="note-icon-bar"></div>',
        '<div class="note-icon-bar"></div>',
        '<div class="note-icon-bar"></div>',
        "</div>",
        "</div>"
      ].join("")
  );
  const airEditor = renderer.create('<div class="note-editor note-airframe"></div>');
  const airEditable = renderer.create(
      [
        '<div class="note-editable" contentEditable="true" role="textbox" aria-multiline="true"></div>',
        '<output class="note-status-output" role="status" aria-live="polite"></output>'
      ].join("")
  );
  const buttonGroup = renderer.create('<div class="note-btn-group"></div>');
  const button = renderer.create(
      '<button type="button" class="note-btn" tabindex="-1"></button>',
      function($node, options) {
        if (options && options.tooltip) {
          $node.attr({
            "aria-label": options.tooltip
          });
          $node.data(
              "_lite_tooltip",
              new TooltipUI($node, {
                title: options.tooltip,
                container: options.container
              })
          ).on("click", (e) => {
            $(e.currentTarget).data("_lite_tooltip").hide();
          });
        }
        if (options.contents) {
          $node.html(options.contents);
        }
        if (options && options.data && options.data.toggle === "dropdown") {
          $node.data(
              "_lite_dropdown",
              new DropdownUI($node, {
                container: options.container
              })
          );
        }
        if (options && options.codeviewKeepButton) {
          $node.addClass("note-codeview-keep");
        }
      }
  );
  const dropdown = renderer.create('<div class="note-dropdown-menu" role="list"></div>', function($node, options) {
    const markup = Array.isArray(options.items) ? options.items.map(function(item) {
      const value2 = typeof item === "string" ? item : item.value || "";
      const content = options.template ? options.template(item) : item;
      const $temp = $(
          '<a class="note-dropdown-item" href="#" data-value="' + value2 + '" role="listitem" aria-label="' + value2 + '"></a>'
      );
      $temp.html(content).data("item", item);
      return $temp;
    }) : options.items;
    $node.html(markup).attr({ "aria-label": options.title });
    $node.on("click", "> .note-dropdown-item", function(e) {
      const $a = $(this);
      const item = $a.data("item");
      const value2 = $a.data("value");
      if (item.click) {
        item.click($a);
      } else if (options.itemClick) {
        options.itemClick(e, item, value2);
      }
    });
    if (options && options.codeviewKeepButton) {
      $node.addClass("note-codeview-keep");
    }
  });
  const dropdownCheck = renderer.create(
      '<div class="note-dropdown-menu note-check" role="list"></div>',
      function($node, options) {
        const markup = Array.isArray(options.items) ? options.items.map(function(item) {
          const value2 = typeof item === "string" ? item : item.value || "";
          const content = options.template ? options.template(item) : item;
          const $temp = $(
              '<a class="note-dropdown-item" href="#" data-value="' + value2 + '" role="listitem" aria-label="' + item + '"></a>'
          );
          $temp.html([icon(options.checkClassName), " ", content]).data("item", item);
          return $temp;
        }) : options.items;
        $node.html(markup).attr({ "aria-label": options.title });
        $node.on("click", "> .note-dropdown-item", function(e) {
          const $a = $(this);
          const item = $a.data("item");
          const value2 = $a.data("value");
          if (item.click) {
            item.click($a);
          } else if (options.itemClick) {
            options.itemClick(e, item, value2);
          }
        });
        if (options && options.codeviewKeepButton) {
          $node.addClass("note-codeview-keep");
        }
      }
  );
  const dropdownButtonContents = function(contents, options) {
    return contents + " " + icon(options.icons.caret);
  };
  const dropdownButton = function(opt, callback) {
    return buttonGroup(
        [
          button({
            className: "dropdown-toggle",
            contents: opt.title + " " + icon("note-icon-caret"),
            tooltip: opt.tooltip,
            data: {
              toggle: "dropdown"
            }
          }),
          dropdown({
            className: opt.className,
            items: opt.items,
            template: opt.template,
            itemClick: opt.itemClick
          })
        ],
        { callback }
    ).render();
  };
  const dropdownCheckButton = function(opt, callback) {
    return buttonGroup(
        [
          button({
            className: "dropdown-toggle",
            contents: opt.title + " " + icon("note-icon-caret"),
            tooltip: opt.tooltip,
            data: {
              toggle: "dropdown"
            }
          }),
          dropdownCheck({
            className: opt.className,
            checkClassName: opt.checkClassName,
            items: opt.items,
            template: opt.template,
            itemClick: opt.itemClick
          })
        ],
        { callback }
    ).render();
  };
  const paragraphDropdownButton = function(opt) {
    return buttonGroup([
      button({
        className: "dropdown-toggle",
        contents: opt.title + " " + icon("note-icon-caret"),
        tooltip: opt.tooltip,
        data: {
          toggle: "dropdown"
        }
      }),
      dropdown([
        buttonGroup({
          className: "note-align",
          children: opt.items[0]
        }),
        buttonGroup({
          className: "note-list",
          children: opt.items[1]
        })
      ])
    ]).render();
  };
  const tableMoveHandler = function(event2, col, row) {
    const PX_PER_EM = 18;
    const $picker = $(event2.target.parentNode);
    const $dimensionDisplay = $picker.next();
    const $catcher = $picker.find(".note-dimension-picker-mousecatcher");
    const $highlighted = $picker.find(".note-dimension-picker-highlighted");
    const $unhighlighted = $picker.find(".note-dimension-picker-unhighlighted");
    let posOffset;
    if (event2.offsetX === void 0) {
      const posCatcher = $(event2.target).offset();
      posOffset = {
        x: event2.pageX - posCatcher.left,
        y: event2.pageY - posCatcher.top
      };
    } else {
      posOffset = {
        x: event2.offsetX,
        y: event2.offsetY
      };
    }
    const dim = {
      c: Math.ceil(posOffset.x / PX_PER_EM) || 1,
      r: Math.ceil(posOffset.y / PX_PER_EM) || 1
    };
    $highlighted.css({ width: dim.c + "em", height: dim.r + "em" });
    $catcher.data("value", dim.c + "x" + dim.r);
    if (dim.c > 3 && dim.c < col) {
      $unhighlighted.css({ width: dim.c + 1 + "em" });
    }
    if (dim.r > 3 && dim.r < row) {
      $unhighlighted.css({ height: dim.r + 1 + "em" });
    }
    $dimensionDisplay.html(dim.c + " x " + dim.r);
  };
  const tableDropdownButton = function(opt) {
    return buttonGroup(
        [
          button({
            className: "dropdown-toggle",
            contents: opt.title + " " + icon("note-icon-caret"),
            tooltip: opt.tooltip,
            data: {
              toggle: "dropdown"
            }
          }),
          dropdown({
            className: "note-table",
            items: [
              '<div class="note-dimension-picker">',
              '<div class="note-dimension-picker-mousecatcher" data-event="insertTable" data-value="1x1"></div>',
              '<div class="note-dimension-picker-highlighted"></div>',
              '<div class="note-dimension-picker-unhighlighted"></div>',
              "</div>",
              '<div class="note-dimension-display">1 x 1</div>'
            ].join("")
          })
        ],
        {
          callback: function($node) {
            const $catcher = $node.find(".note-dimension-picker-mousecatcher");
            $catcher.css({
              width: opt.col + "em",
              height: opt.row + "em"
            }).on("mouseup", opt.itemClick).on("mousemove", function(e) {
              tableMoveHandler(e, opt.col, opt.row);
            });
          }
        }
    ).render();
  };
  const palette = renderer.create('<div class="note-color-palette"></div>', function($node, options) {
    const contents = [];
    for (let row = 0, rowSize = options.colors.length; row < rowSize; row++) {
      const eventName = options.eventName;
      const colors = options.colors[row];
      const colorsName = options.colorsName[row];
      const buttons = [];
      for (let col = 0, colSize = colors.length; col < colSize; col++) {
        const color = colors[col];
        const colorName = colorsName[col];
        buttons.push(
            [
              '<button type="button" class="note-btn note-color-btn"',
              'style="background-color:',
              color,
              '" ',
              'data-event="',
              eventName,
              '" ',
              'data-value="',
              color,
              '" ',
              'data-title="',
              colorName,
              '" ',
              'aria-label="',
              colorName,
              '" ',
              'data-toggle="button" tabindex="-1"></button>'
            ].join("")
        );
      }
      contents.push('<div class="note-color-row">' + buttons.join("") + "</div>");
    }
    $node.html(contents.join(""));
    $node.find(".note-color-btn").each(function() {
      $(this).data(
          "_lite_tooltip",
          new TooltipUI($(this), {
            container: options.container
          })
      );
    });
  });
  const colorDropdownButton = function(opt, type) {
    return buttonGroup({
      className: "note-color",
      children: [
        button({
          className: "note-current-color-button",
          contents: opt.title,
          tooltip: opt.lang.color.recent,
          click: opt.currentClick,
          callback: function($button) {
            const $recentColor = $button.find(".note-recent-color");
            if (type !== "foreColor") {
              $recentColor.css("background-color", "#FFFF00");
              $button.attr("data-backColor", "#FFFF00");
            }
          }
        }),
        button({
          className: "dropdown-toggle",
          contents: icon("note-icon-caret"),
          tooltip: opt.lang.color.more,
          data: {
            toggle: "dropdown"
          }
        }),
        dropdown({
          items: [
            "<div>",
            '<div class="note-btn-group btn-background-color">',
            '<div class="note-palette-title">' + opt.lang.color.background + "</div>",
            "<div>",
            '<button type="button" class="note-color-reset note-btn note-btn-block" data-event="backColor" data-value="transparent">',
            opt.lang.color.transparent,
            "</button>",
            "</div>",
            '<div class="note-holder" data-event="backColor"></div>',
            '<div class="btn-sm">',
            '<input type="color" id="html5bcp" class="note-btn btn-default" value="#21104A" style="width:100%;" data-value="cp">',
            '<button type="button" class="note-color-reset btn" data-event="backColor" data-value="cpbackColor">',
            opt.lang.color.cpSelect,
            "</button>",
            "</div>",
            "</div>",
            '<div class="note-btn-group btn-foreground-color">',
            '<div class="note-palette-title">' + opt.lang.color.foreground + "</div>",
            "<div>",
            '<button type="button" class="note-color-reset note-btn note-btn-block" data-event="removeFormat" data-value="foreColor">',
            opt.lang.color.resetToDefault,
            "</button>",
            "</div>",
            '<div class="note-holder" data-event="foreColor"></div>',
            '<div class="btn-sm">',
            '<input type="color" id="html5fcp" class="note-btn btn-default" value="#21104A" style="width:100%;" data-value="cp">',
            '<button type="button" class="note-color-reset btn" data-event="foreColor" data-value="cpforeColor">',
            opt.lang.color.cpSelect,
            "</button>",
            "</div>",
            "</div>",
            "</div>"
          ].join(""),
          callback: function($dropdown) {
            $dropdown.find(".note-holder").each(function() {
              const $holder = $(this);
              $holder.append(
                  palette({
                    colors: opt.colors,
                    eventName: $holder.data("event")
                  }).render()
              );
            });
            if (type === "fore") {
              $dropdown.find(".btn-background-color").hide();
              $dropdown.css({ "min-width": "210px" });
            } else if (type === "back") {
              $dropdown.find(".btn-foreground-color").hide();
              $dropdown.css({ "min-width": "210px" });
            }
          },
          click: function(event2) {
            const $button = $(event2.target);
            const eventName = $button.data("event");
            let value2 = $button.data("value");
            const foreinput = document.getElementById("html5fcp").value;
            const backinput = document.getElementById("html5bcp").value;
            if (value2 === "cp") {
              event2.stopPropagation();
            } else if (value2 === "cpbackColor") {
              value2 = backinput;
            } else if (value2 === "cpforeColor") {
              value2 = foreinput;
            }
            if (eventName && value2) {
              const key2 = eventName === "backColor" ? "background-color" : "color";
              const $color = $button.closest(".note-color").find(".note-recent-color");
              const $currentButton = $button.closest(".note-color").find(".note-current-color-button");
              $color.css(key2, value2);
              $currentButton.attr("data-" + eventName, value2);
              if (type === "fore") {
                opt.itemClick("foreColor", value2);
              } else if (type === "back") {
                opt.itemClick("backColor", value2);
              } else {
                opt.itemClick(eventName, value2);
              }
            }
          }
        })
      ]
    }).render();
  };
  const dialog = renderer.create(
      '<div class="note-modal" aria-hidden="false" tabindex="-1" role="dialog"></div>',
      function($node, options) {
        if (options.fade) {
          $node.addClass("fade");
        }
        $node.attr({
          "aria-label": options.title
        });
        $node.html(
            [
              '<div class="note-modal-content">',
              options.title ? '<div class="note-modal-header"><button type="button" class="close" aria-label="Close" aria-hidden="true"><i class="note-icon-close"></i></button><h4 class="note-modal-title">' + options.title + "</h4></div>" : "",
              '<div class="note-modal-body">' + options.body + "</div>",
              options.footer ? '<div class="note-modal-footer">' + options.footer + "</div>" : "",
              "</div>"
            ].join("")
        );
        $node.data("modal", new ModalUI($node, options));
      }
  );
  const videoDialog = function(opt) {
    const body = '<div class="note-form-group"><label for="note-dialog-video-url-' + opt.id + '" class="note-form-label">' + opt.lang.video.url + ' <small class="text-muted">' + opt.lang.video.providers + '</small></label><input id="note-dialog-video-url-' + opt.id + '" class="note-video-url note-input" type="text"/></div>';
    const footer = [
      '<button type="button" href="#" class="note-btn note-btn-primary note-video-btn disabled" disabled>',
      opt.lang.video.insert,
      "</button>"
    ].join("");
    return dialog({
      title: opt.lang.video.insert,
      fade: opt.fade,
      body,
      footer
    }).render();
  };
  const imageDialog = function(opt) {
    const body = '<div class="note-form-group note-group-select-from-files"><label for="note-dialog-image-file-' + opt.id + '" class="note-form-label">' + opt.lang.image.selectFromFiles + '</label><input id="note-dialog-image-file-' + opt.id + '" class="note-note-image-input note-input" type="file" name="files" accept="image/*" multiple="multiple"/>' + opt.imageLimitation + '</div><div class="note-form-group"><label for="note-dialog-image-url-' + opt.id + '" class="note-form-label">' + opt.lang.image.url + '</label><input id="note-dialog-image-url-' + opt.id + '" class="note-image-url note-input" type="text"/></div>';
    const footer = [
      '<button href="#" type="button" class="note-btn note-btn-primary note-btn-large note-image-btn disabled" disabled>',
      opt.lang.image.insert,
      "</button>"
    ].join("");
    return dialog({
      title: opt.lang.image.insert,
      fade: opt.fade,
      body,
      footer
    }).render();
  };
  const linkDialog = function(opt) {
    const body = '<div class="note-form-group"><label for="note-dialog-link-txt-' + opt.id + '" class="note-form-label">' + opt.lang.link.textToDisplay + '</label><input id="note-dialog-link-txt-' + opt.id + '" class="note-link-text note-input" type="text"/></div><div class="note-form-group"><label for="note-dialog-link-url-' + opt.id + '" class="note-form-label">' + opt.lang.link.url + '</label><input id="note-dialog-link-url-' + opt.id + '" class="note-link-url note-input" type="text" value="http://"/></div>' + (!opt.disableLinkTarget ? '<div class="checkbox"><label for="note-dialog-link-nw-' + opt.id + '"><input id="note-dialog-link-nw-' + opt.id + '" type="checkbox" checked> ' + opt.lang.link.openInNewWindow + "</label></div>" : "");
    const footer = [
      '<button href="#" type="button" class="note-btn note-btn-primary note-link-btn disabled" disabled>',
      opt.lang.link.insert,
      "</button>"
    ].join("");
    return dialog({
      className: "link-dialog",
      title: opt.lang.link.insert,
      fade: opt.fade,
      body,
      footer
    }).render();
  };
  const popover = renderer.create(
      [
        '<div class="note-popover bottom">',
        '<div class="note-popover-arrow"></div>',
        '<div class="note-popover-content note-children-container"></div>',
        "</div>"
      ].join(""),
      function($node, options) {
        const direction = typeof options.direction !== "undefined" ? options.direction : "bottom";
        $node.addClass(direction).hide();
        if (options.hideArrow) {
          $node.find(".note-popover-arrow").hide();
        }
      }
  );
  const checkbox = renderer.create('<div class="checkbox"></div>', function($node, options) {
    $node.html(
        [
          "<label" + (options.id ? ' for="note-' + options.id + '"' : "") + ">",
          '<input role="checkbox" type="checkbox"' + (options.id ? ' id="note-' + options.id + '"' : ""),
          options.checked ? " checked" : "",
          ' aria-checked="' + (options.checked ? "true" : "false") + '"/>',
          options.text ? options.text : "",
          "</label>"
        ].join("")
    );
  });
  const icon = function(iconClassName) {
    return '<span class="material-icons">' + iconClassName + "</span>";
  };
  const ui = function(editorOptions) {
    return {
      editor,
      toolbar,
      editingArea,
      codable,
      editable,
      statusbar,
      airEditor,
      airEditable,
      buttonGroup,
      button: (options) => {
        return button({
          ...options,
          container: options.container || editorOptions.container
        });
      },
      dropdown,
      dropdownCheck,
      dropdownButton,
      dropdownButtonContents,
      dropdownCheckButton,
      paragraphDropdownButton,
      tableDropdownButton,
      colorDropdownButton,
      palette,
      dialog,
      videoDialog,
      imageDialog,
      linkDialog,
      popover,
      checkbox,
      icon,
      options: editorOptions,
      toggleBtn: function($btn, isEnable) {
        $btn.toggleClass("disabled", !isEnable);
        $btn.attr("disabled", !isEnable);
      },
      toggleBtnActive: function($btn, isActive) {
        $btn.toggleClass("active", isActive);
      },
      check: function($dom, value2) {
        $dom.find(".checked").removeClass("checked");
        $dom.find('[data-value="' + value2 + '"]').addClass("checked");
      },
      onDialogShown: function($dialog, handler) {
        $dialog.one("note.modal.show", handler);
      },
      onDialogHidden: function($dialog, handler) {
        $dialog.one("note.modal.hide", handler);
      },
      showDialog: function($dialog) {
        $dialog.data("modal").show();
      },
      hideDialog: function($dialog) {
        $dialog.data("modal").hide();
      },
      /**
       * get popover content area
       *
       * @param $popover
       * @returns {*}
       */
      getPopoverContent: function($popover) {
        return $popover.find(".note-popover-content");
      },
      /**
       * get dialog's body area
       *
       * @param $dialog
       * @returns {*}
       */
      getDialogBody: function($dialog) {
        return $dialog.find(".note-modal-body");
      },
      createLayout: function($note) {
        const $editor = (editorOptions.airMode ? airEditor([editingArea([codable(), airEditable()])]) : editorOptions.toolbarPosition === "bottom" ? editor([editingArea([codable(), editable()]), toolbar(), statusbar()]) : editor([toolbar(), editingArea([codable(), editable()]), statusbar()])).render();
        $editor.insertAfter($note);
        return {
          note: $note,
          editor: $editor,
          toolbar: $editor.find(".note-toolbar"),
          editingArea: $editor.find(".note-editing-area"),
          editable: $editor.find(".note-editable"),
          codable: $editor.find(".note-codable"),
          statusbar: $editor.find(".note-statusbar")
        };
      },
      removeLayout: function($note, layoutInfo) {
        $note.html(layoutInfo.editable.html());
        layoutInfo.editor.remove();
        $note.off("summernote");
        $note.show();
      }
    };
  };
  $.summernote = $.extend($.summernote, {
    ui_template: ui,
    interface: "lite"
  });
})();
