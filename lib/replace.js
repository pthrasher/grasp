// Generated by LiveScript 1.2.0
(function(){
  var ref$, lines, unlines, filter, getRaw, argsRegex, filterRegex, replacer, processReplacement, replace, slice$ = [].slice;
  ref$ = require('prelude-ls'), lines = ref$.lines, unlines = ref$.unlines, filter = ref$.filter;
  getRaw = function(input, node){
    var raw, that;
    raw = (that = node.raw)
      ? that
      : node.start != null
        ? input.slice(node.start, node.end)
        : node.key != null && node.value != null ? input.slice(node.key.start, node.value.end) : '';
    node.raw = raw;
    return (node.rawPrepend || '') + "" + raw + (node.rawAppend || '');
  };
  argsRegex = /'((?:\\'|[^'])*)'|"((?:\\"|[^"])*)"|(\\.)|(\S+)/g;
  filterRegex = /\s+\|\s+([-a-zA-Z]+)((?:\s+(?:'(?:\\'|[^'])*'|"(?:\\"|[^"])*"|[^\|\s]+))*)/;
  replacer = function(input, node, queryEngine){
    return function(arg$, replacementArg){
      var ref$, selector, filters, that, origResults, e, results, rawPrepend, rawAppend, join, filterName, argsStr, args, pre, post, i$, len$, arg, result, n, len, rawResults, res$;
      ref$ = replacementArg.trim().split(filterRegex), selector = ref$[0], filters = slice$.call(ref$, 1);
      if (that = (ref$ = node._named) != null ? ref$[selector] : void 8) {
        origResults = [].concat(that);
      } else {
        try {
          origResults = queryEngine.query(selector, node);
        } catch (e$) {
          e = e$;
          origResults = queryEngine.query(replacementArg, node);
          filters = [];
        }
      }
      if (origResults.length) {
        results = origResults;
        rawPrepend = '';
        rawAppend = '';
        join = null;
        while (filters.length) {
          filterName = filters.shift();
          argsStr = filters.shift().trim();
          argsStr += filters.shift();
          args = [];
          if (argsStr) {
            while (that = argsRegex.exec(argsStr)) {
              args.push(filter(fn$, that)[1].replace(/\\(.)/g, '$1'));
            }
            argsRegex.lastIndex = 0;
          }
          if ((filterName === 'prepend' || filterName === 'before' || filterName === 'after' || filterName === 'prepend' || filterName === 'append' || filterName === 'wrap' || filterName === 'nth' || filterName === 'nth-last' || filterName === 'slice' || filterName === 'each') && !args.length) {
            throw new Error("No arguments supplied for '" + filterName + "' filter");
          }
          switch (filterName) {
          case 'join':
            join = args.length ? args[0] : '';
            break;
          case 'before':
            rawPrepend = args[0] + "" + rawPrepend;
            break;
          case 'after':
            rawAppend += args[0];
            break;
          case 'wrap':
            ref$ = args.length === 1 ? [args[0], args[0]] : args, pre = ref$[0], post = ref$[1];
            rawPrepend = pre + "" + rawPrepend;
            rawAppend += post;
            break;
          case 'prepend':
            for (i$ = 0, len$ = args.length; i$ < len$; ++i$) {
              arg = args[i$];
              results.unshift({
                type: 'Raw',
                raw: arg
              });
            }
            break;
          case 'append':
            for (i$ = 0, len$ = args.length; i$ < len$; ++i$) {
              arg = args[i$];
              results.push({
                type: 'Raw',
                raw: arg
              });
            }
            break;
          case 'each':
            if (args.length < 2) {
              throw new Error("No arguments supplied for 'each " + args[0] + "'");
            }
            switch (args[0]) {
            case 'before':
              for (i$ = 0, len$ = results.length; i$ < len$; ++i$) {
                result = results[i$];
                result.rawPrepend = args[1] + "" + (result.rawPrepend || '');
              }
              break;
            case 'after':
              for (i$ = 0, len$ = results.length; i$ < len$; ++i$) {
                result = results[i$];
                result.rawAppend = (result.rawAppend || '') + "" + args[1];
              }
              break;
            case 'wrap':
              ref$ = args.length === 2
                ? [args[1], args[1]]
                : [args[1], args[2]], pre = ref$[0], post = ref$[1];
              for (i$ = 0, len$ = results.length; i$ < len$; ++i$) {
                result = results[i$];
                result.rawPrepend = pre + "" + (result.rawPrepend || '');
                result.rawAppend = (result.rawAppend || '') + "" + post;
              }
              break;
            default:
              throw new Error("'" + args[0] + "' is not supported by 'each'");
            }
            break;
          case 'nth':
            n = +args[0];
            results = results.slice(n, n + 1);
            break;
          case 'nth-last':
            n = results.length - +args[0] - 1;
            results = results.slice(n, n + 1);
            break;
          case 'first':
          case 'head':
            results = results.slice(0, 1);
            break;
          case 'tail':
            results = results.slice(1);
            break;
          case 'last':
            len = results.length;
            results = results.slice(len - 1, len);
            break;
          case 'initial':
            results = results.slice(0, results.length - 1);
            break;
          case 'slice':
            results = [].slice.apply(results, args);
            break;
          case 'reverse':
            results.reverse();
            break;
          default:
            throw new Error("Invalid filter: " + filterName + (argsStr ? " " + argsStr : ''));
          }
        }
        res$ = [];
        for (i$ = 0, len$ = results.length; i$ < len$; ++i$) {
          result = results[i$];
          res$.push(getRaw(input, result));
        }
        rawResults = res$;
        return rawPrepend + "" + (join != null
          ? rawResults.join(join)
          : rawResults[0]) + rawAppend;
      } else {
        return '';
      }
      function fn$(it){
        return it != null;
      }
    };
  };
  processReplacement = function(replacement, input, node, queryEngine){
    return replacement.replace(/\\n/g, '\n').replace(/{{}}/g, function(){
      return getRaw(input, node);
    }).replace(/{{((?:[^}]|}[^}])+)}}/g, replacer(input, node, queryEngine));
  };
  replace = function(replacement, input, nodes, queryEngine){
    var inputLines, colOffset, lineOffset, lastLine, prevNode, i$, len$, node, ref$, start, end, startLineNum, endLineNum, numberOfLines, startCol, endCol, replaceLines, startLine, endLine, startContext, endContext, replaceLast, endLen;
    inputLines = lines(input);
    colOffset = 0;
    lineOffset = 0;
    lastLine = null;
    prevNode = {
      end: 0
    };
    for (i$ = 0, len$ = nodes.length; i$ < len$; ++i$) {
      node = nodes[i$];
      if (node.start < prevNode.end) {
        continue;
      }
      ref$ = node.loc, start = ref$.start, end = ref$.end;
      startLineNum = start.line - 1 + lineOffset;
      endLineNum = end.line - 1 + lineOffset;
      numberOfLines = endLineNum - startLineNum + 1;
      colOffset = lastLine === startLineNum ? colOffset : 0;
      startCol = start.column + colOffset;
      endCol = end.column + (startLineNum === endLineNum ? colOffset : 0);
      replaceLines = lines(processReplacement(replacement, input, node, queryEngine));
      startLine = inputLines[startLineNum];
      endLine = inputLines[endLineNum];
      startContext = startLine.slice(0, startCol);
      endContext = endLine.slice(endCol);
      replaceLines[0] = startContext + "" + replaceLines[0];
      replaceLast = replaceLines[replaceLines.length - 1];
      endLen = replaceLast.length;
      replaceLines[replaceLines.length - 1] = replaceLast + "" + endContext;
      inputLines.splice.apply(inputLines, [startLineNum, numberOfLines].concat(slice$.call(replaceLines)));
      lineOffset += replaceLines.length - numberOfLines;
      colOffset += endLen - endCol;
      lastLine = endLineNum + lineOffset;
      prevNode = node;
    }
    return unlines(inputLines);
  };
  module.exports = {
    replace: replace
  };
}).call(this);