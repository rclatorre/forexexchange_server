function _toConsumableArray(t){return _arrayWithoutHoles(t)||_iterableToArray(t)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function _iterableToArray(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}function _arrayWithoutHoles(t){if(Array.isArray(t)){for(var n=0,r=new Array(t.length);n<t.length;n++)r[n]=t[n];return r}}(window.webpackJsonp=window.webpackJsonp||[]).push([[116],{"94vs":function(t,n,r){"use strict";r.r(n),r.d(n,"scopeCss",(function(){return y}));var e=")(?:\\(((?:\\([^)(]*\\)|[^)(]*)+?)\\))?([^,{]*)",o=new RegExp("(-shadowcsshost"+e,"gim"),c=new RegExp("(-shadowcsscontext"+e,"gim"),s=new RegExp("(-shadowcssslotted"+e,"gim"),a=/-shadowcsshost-no-combinator([^\s]*)/,i=[/::shadow/g,/::content/g],u=/-shadowcsshost/gim,l=/:host/gim,h=/::slotted/gim,p=/:host-context/gim,f=/\/\*\s*[\s\S]*?\*\//g,d=/\/\*\s*#\s*source(Mapping)?URL=[\s\S]+?\*\//g,g=/(\s*)([^;\{\}]+?)(\s*)((?:{%BLOCK%}?\s*;?)|(?:\s*;))/g,m=/([{}])/g,v=function(t,n){var r=w(t),e=0;return r.escapedString.replace(g,(function(){var t=arguments.length<=2?void 0:arguments[2],o="",c=arguments.length<=4?void 0:arguments[4],s="";c&&c.startsWith("{%BLOCK%")&&(o=r.blocks[e++],c=c.substring("%BLOCK%".length+1),s="{");var a=n({selector:t,content:o});return"".concat(arguments.length<=1?void 0:arguments[1]).concat(a.selector).concat(arguments.length<=3?void 0:arguments[3]).concat(s).concat(a.content).concat(c)}))},w=function(t){for(var n=t.split(m),r=[],e=[],o=0,c=[],s=0;s<n.length;s++){var a=n[s];"}"===a&&o--,o>0?c.push(a):(c.length>0&&(e.push(c.join("")),r.push("%BLOCK%"),c=[]),r.push(a)),"{"===a&&o++}return c.length>0&&(e.push(c.join("")),r.push("%BLOCK%")),{escapedString:r.join(""),blocks:e}},b=function(t,n,r){return t.replace(n,(function(){for(var t=arguments.length,n=new Array(t),e=0;e<t;e++)n[e]=arguments[e];if(n[2]){for(var o=n[2].split(","),c=[],s=0;s<o.length;s++){var a=o[s].trim();if(!a)break;c.push(r("-shadowcsshost-no-combinator",a,n[3]))}return c.join(",")}return"-shadowcsshost-no-combinator"+n[3]}))},_=function(t,n,r){return t+n.replace("-shadowcsshost","")+r},x=function(t,n,r){return n.indexOf("-shadowcsshost")>-1?_(t,n,r):t+n+r+", "+n+" "+t+r},y=function(t,n,r){var e=n+"-h",g=n+"-s",m=t.match(d)||[];t=t.replace(f,"");var w=[];if(r){var y=function(t){var n="/*!@___".concat(w.length,"___*/");return w.push({placeholder:n,comment:"/*!@".concat(t.selector,"*/")}),t.selector=n+t.selector,t};t=v(t,(function(t){return"@"!==t.selector[0]?y(t):t.selector.startsWith("@media")||t.selector.startsWith("@supports")||t.selector.startsWith("@page")||t.selector.startsWith("@document")?(t.content=v(t.content,y),t):t}))}var O=function(t,n,r,e,f){return t=function(t){return i.reduce((function(t,n){return t.replace(n," ")}),t)}(t=function(t,n){return t.replace(s,(function(){for(var t=arguments.length,r=new Array(t),e=0;e<t;e++)r[e]=arguments[e];if(r[2]){var o=r[2].trim();return"."+n+" > "+o+r[3]}return"-shadowcsshost-no-combinator"+r[3]}))}(t=function(t){return b(t,c,x)}(t=function(t){return b(t,o,_)}(t=t.replace(p,"-shadowcsscontext").replace(l,"-shadowcsshost").replace(h,"-shadowcssslotted"))),e)),n&&(t=function t(n,r,e,o,c){return v(n,(function(n){var c=n.selector,s=n.content;return"@"!==n.selector[0]?c=function(t,n,r,e){return t.split(",").map((function(t){return e&&t.indexOf("."+e)>-1?t.trim():function(t,n){return!function(t){return t=t.replace(/\[/g,"\\[").replace(/\]/g,"\\]"),new RegExp("^("+t+")([>\\s~+[.,{:][\\s\\S]*)?$","m")}(n).test(t)}(t,n)?function(t,n,r){for(var e,o="."+(n=n.replace(/\[is=([^\]]*)\]/g,(function(t){return arguments.length<=1?void 0:arguments[1]}))),c=function(t){var e=t.trim();if(!e)return"";if(t.indexOf("-shadowcsshost-no-combinator")>-1)e=function(t,n,r){if(u.lastIndex=0,u.test(t)){var e=".".concat(r);return t.replace(a,(function(t,n){return n.replace(/([^:]*)(:*)(.*)/,(function(t,n,r,o){return n+e+r+o}))})).replace(u,e+" ")}return n+" "+t}(t,n,r);else{var c=t.replace(u,"");if(c.length>0){var s=c.match(/([^:]*)(:*)(.*)/);s&&(e=s[1]+o+s[2]+s[3])}}return e},s=function(t){var n=[],r=0;return{content:(t=t.replace(/(\[[^\]]*\])/g,(function(t,e){var o="__ph-".concat(r,"__");return n.push(e),r++,o}))).replace(/(:nth-[-\w]+)(\([^)]+\))/g,(function(t,e,o){var c="__ph-".concat(r,"__");return n.push(o),r++,e+c})),placeholders:n}}(t),i="",l=0,h=/( |>|\+|~(?!=))\s*/g,p=!((t=s.content).indexOf("-shadowcsshost-no-combinator")>-1);null!==(e=h.exec(t));){var f=e[1],d=t.slice(l,e.index).trim();p=p||d.indexOf("-shadowcsshost-no-combinator")>-1,i+="".concat(p?c(d):d," ").concat(f," "),l=h.lastIndex}var g,m=t.substring(l);return i+=(p=p||m.indexOf("-shadowcsshost-no-combinator")>-1)?c(m):m,g=s.placeholders,i.replace(/__ph-(\d+)__/g,(function(t,n){return g[+n]}))}(t,n,r).trim():t.trim()})).join(", ")}(n.selector,r,e,o):(n.selector.startsWith("@media")||n.selector.startsWith("@supports")||n.selector.startsWith("@page")||n.selector.startsWith("@document"))&&(s=t(n.content,r,e,o)),{selector:c.replace(/\s{2,}/g," ").trim(),content:s}}))}(t,n,r,e)),(t=(t=t.replace(/-shadowcsshost-no-combinator/g,".".concat(r))).replace(/>\s*\*\s+([^{, ]+)/gm," $1 ")).trim()}(t,n,e,g);return t=[O].concat(_toConsumableArray(m)).join("\n"),r&&w.forEach((function(n){var r=n.placeholder,e=n.comment;t=t.replace(r,e)})),t}}}]);