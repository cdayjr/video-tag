parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"KGru":[function(require,module,exports) {
"use strict";function t(t,o){return r(t)||e(t,o)||n()}function n(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function e(t,n){var e=[],r=!0,o=!1,i=void 0;try{for(var a,c=t[Symbol.iterator]();!(r=(a=c.next()).done)&&(e.push(a.value),!n||e.length!==n);r=!0);}catch(u){o=!0,i=u}finally{try{r||null==c.return||c.return()}finally{if(o)throw i}}return e}function r(t){if(Array.isArray(t))return t}function o(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}function i(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function a(t,n,e){return n&&i(t.prototype,n),e&&i(t,e),t}Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var c=function(){function n(t){o(this,n),this.options=new Map}return a(n,[{key:"getProviderString",value:function(){return this.constructor.getProviderString()}},{key:"importOptions",value:function(t){this.options=this.constructor.mapFromString(t)}},{key:"exportOptions",value:function(){return this.constructor.stringFromMap(this.options)}}],[{key:"isProvider",value:function(t){return!1}},{key:"getProviderString",value:function(){return"Invalid"}},{key:"mapFromString",value:function(n){var e=("?"===n.substr(0,1)?n.substr(1):n).split("&"),r=new Map;return e.forEach(function(n){if(n.search("=")>-1){var e=t(n.split("="),2),o=e[0],i=e[1];r.set(decodeURIComponent(o),decodeURIComponent(i))}else r.set(decodeURIComponent(n),"")}),r}},{key:"stringFromMap",value:function(t){var n="";return t.forEach(function(t,e){n+="".concat(encodeURIComponent(e),"=").concat(encodeURIComponent(t),"&")}),n.length>0&&(n=n.slice(0,-1)),n}},{key:"getHostName",value:function(t){var n=document.createElement("a");n.setAttribute("href",t);var e=new RegExp("^".concat(window.location.protocol),"i");return t.match(e)||n.protocol!==window.location.protocol||t.search(window.location.hostname)>-1?n.hostname:""}},{key:"timeToSeconds",value:function(n){var e=t(n.match(/(\d+h)?(\d+m)?(\d+s)?/),4),r=e[1],o=e[2],i=e[3],a=0;if(r){var c=parseInt(r,10);c>0&&(a+=60*c*60)}if(o){var u=parseInt(o,10);u>0&&(a+=60*u)}if(i){var s=parseInt(i,10);s>0&&(a+=s)}return a}},{key:"secondsToTime",value:function(t){var n=Math.floor(t/3600),e=Math.floor((t-60*n*60)/60),r=t-(60*n*60+60*e);return"".concat(n,"h").concat(e,"m").concat(r,"s")}}]),n}();exports.default=c;
},{}],"e391":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t=e(require("../VideoProvider"));function e(t){return t&&t.__esModule?t:{default:t}}function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){return c(t)||i(t,e)||r()}function r(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function i(t,e){var n=[],o=!0,r=!1,i=void 0;try{for(var c,a=t[Symbol.iterator]();!(o=(c=a.next()).done)&&(n.push(c.value),!e||n.length!==e);o=!0);}catch(s){r=!0,i=s}finally{try{o||null==a.return||a.return()}finally{if(r)throw i}}return n}function c(t){if(Array.isArray(t))return t}function a(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function s(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function u(t,e,n){return e&&s(t.prototype,e),n&&s(t,n),t}function l(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?f(t):e}function f(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function p(t){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function h(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&y(t,e)}function y(t,e){return(y=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var d=function(e){function n(t){var e;if(a(this,n),(e=l(this,p(n).call(this,t))).constructor.getHostName(t)){var r=document.createElement("a");r.setAttribute("href",t.trim());var i=t.match(/https?:\/\/(?:.+\.)?twitch\.tv\/(?:(?:videos\/(\d+))|embed\/)?(\w+)?/);if(i){var c=o(i,3),s=c[1],u=c[2];if(u?e.options.set("channel",u):s&&e.options.set("id","v".concat(s)),r.search){var f=e.constructor.mapFromString(r.search);e.options.get("channel")||e.options.get("id")||(f.get("channel")?e.options.set("channel",String(f.get("channel"))):f.get("video")&&e.options.set("id",String(f.get("video")))),f.get("t")&&e.options.set("start",String(e.constructor.timeToSeconds(String(f.get("t")))))}}}else t.match(/^\d+$/)?e.options.set("id","v".concat(t)):t.match(/^v\d+$/)?e.options.set("id",t):t.match(/^\w+$/)&&e.options.set("channel",t);return e}return h(n,t.default),u(n,[{key:"getElement",value:function(){var t="";if(this.options.get("channel"))t="https://player.twitch.tv/?autoplay=false&channel=".concat(this.options.get("channel"));else{if(!this.options.get("id"))return null;t="https://player.twitch.tv/?autoplay=false&video=".concat(this.options.get("id")),this.options.get("start")&&(t+="&t=".concat(this.constructor.secondsToTime(parseInt(String(this.options.get("start")),10))))}var e=document.createElement("iframe");return e.setAttribute("allowfullscreen",""),e.setAttribute("scrolling","no"),e.src=t,e}}],[{key:"isProvider",value:function(t){return!!this.getHostName(t).match(/^(?:.+\.)?twitch\.tv$/)}},{key:"getProviderString",value:function(){return"Twitch"}}]),n}();exports.default=d;
},{"../VideoProvider":"KGru"}],"NNte":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t=e(require("../VideoProvider"));function e(t){return t&&t.__esModule?t:{default:t}}function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){return u(t)||i(t,e)||n()}function n(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function i(t,e){var r=[],o=!0,n=!1,i=void 0;try{for(var u,c=t[Symbol.iterator]();!(o=(u=c.next()).done)&&(r.push(u.value),!e||r.length!==e);o=!0);}catch(a){n=!0,i=a}finally{try{o||null==c.return||c.return()}finally{if(n)throw i}}return r}function u(t){if(Array.isArray(t))return t}function c(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function a(t,e){for(var r=0;r<e.length;r++){var o=e[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function s(t,e,r){return e&&a(t.prototype,e),r&&a(t,r),t}function f(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?l(t):e}function l(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function p(t){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function y(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&m(t,e)}function m(t,e){return(m=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var b=function(e){function r(t){var e;if(c(this,r),(e=f(this,p(r).call(this,t))).constructor.getHostName(t)){var n=document.createElement("a");n.setAttribute("href",t.trim());var i=t.match(/^https?:\/\/(?:.+\.)?vimeo\.com\/(?:video\/)?(\d+)\??(?:.*)?$/);if(i){var u=o(i,2)[1];if(e.options.set("id",u),n.hash){var a=e.constructor.mapFromString(n.hash.substr(1));a.get("t")&&e.options.set("start",String(e.constructor.timeToSeconds(String(a.get("t")))))}}}else t.match(/^\d+$/)&&e.options.set("id",t);return e}return y(r,t.default),s(r,[{key:"getElement",value:function(){if(!this.options.get("id"))return null;var t=document.createElement("iframe");t.setAttribute("allowfullscreen",""),t.setAttribute("webkitallowfullscreen",""),t.setAttribute("mozallowfullscreen","");var e="https://player.vimeo.com/video/".concat(this.options.get("id"),"?color=ffffff&title=0&byline=0&portrait=0&autoplay=0");return this.options.get("start")&&(e+="#t=".concat(this.constructor.secondsToTime(parseInt(String(this.options.get("start")),10)))),t.src=e,t}}],[{key:"isProvider",value:function(t){return!!this.getHostName(t).match(/^(?:.+\.)?vimeo\.com$/)}},{key:"getProviderString",value:function(){return"Vimeo"}}]),r}();exports.default=b;
},{"../VideoProvider":"KGru"}],"lSTi":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t=e(require("../VideoProvider"));function e(t){return t&&t.__esModule?t:{default:t}}function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){return u(t)||i(t,e)||n()}function n(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function i(t,e){var r=[],o=!0,n=!1,i=void 0;try{for(var u,a=t[Symbol.iterator]();!(o=(u=a.next()).done)&&(r.push(u.value),!e||r.length!==e);o=!0);}catch(c){n=!0,i=c}finally{try{o||null==a.return||a.return()}finally{if(n)throw i}}return r}function u(t){if(Array.isArray(t))return t}function a(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function c(t,e){for(var r=0;r<e.length;r++){var o=e[r];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function s(t,e,r){return e&&c(t.prototype,e),r&&c(t,r),t}function f(t,e){return!e||"object"!==r(e)&&"function"!=typeof e?l(t):e}function l(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function p(t){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function y(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&m(t,e)}function m(t,e){return(m=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var b=function(e){function r(t){var e;if(a(this,r),(e=f(this,p(r).call(this,t))).constructor.getHostName(t)){var n=document.createElement("a");n.setAttribute("href",t.trim());var i=t.match(/https?:\/\/(?:.+\.)?youtube(?:-nocookie)?\.com\/embed\/(.+?)(?:\?|$)/);if(i){var u=o(i,2)[1];e.options.set("id",u);var c=e.constructor.mapFromString(n.search);if(c.get("start")){var s=parseInt(String(c.get("start")),10);s>0&&e.options.set("start",String(s))}return f(e)}if(t.match(/https?:\/\/(?:.+\.)?youtube\.com\/watch\?/)){var l=e.constructor.mapFromString(n.search);if(l.get("v")&&e.options.set("id",String(l.get("v"))),l.get("start")){var y=parseInt(String(l.get("start")),10);y>0&&e.options.set("start",String(y))}else if(l.get("t")){var m=e.constructor.timeToSeconds(String(l.get("t")));if(0===m){var b=parseInt(String(l.get("t")),10);b>0&&e.options.set("start",String(b))}else e.options.set("start",String(m))}return f(e)}var g=t.match(/https?:\/\/youtu\.be\/(.+$)/);if(g){var v=o(g,2)[1];e.options.set("id",v)}}else t.match(/^[a-zA-Z0-9_-]{11}$/)&&e.options.set("id",t);return e}return y(r,t.default),s(r,[{key:"getElement",value:function(){if(!this.options.get("id"))return null;var t="https://www.youtube-nocookie.com/embed/".concat(this.options.get("id"));this.options.get("start")&&(t+="?start=".concat(this.options.get("start")));var e=document.createElement("iframe");return e.setAttribute("allowfullscreen",""),e.setAttribute("allow","accelerometer; encrypted-media; gyroscope; picture-in-picture"),e.src=t,e}}],[{key:"isProvider",value:function(t){return!!this.getHostName(t).match(/^(?:.+\.)?youtu(?:be(?:-nocookie)?\.com|\.be)$/)}},{key:"getProviderString",value:function(){return"YouTube"}}]),r}();exports.default=b;
},{"../VideoProvider":"KGru"}],"/awl":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=u(require("./classes/providers/Twitch")),r=u(require("./classes/providers/Vimeo")),s=u(require("./classes/providers/YouTube"));function u(e){return e&&e.__esModule?e:{default:e}}var t=[e.default,r.default,s.default];exports.default=t;
},{"./classes/providers/Twitch":"e391","./classes/providers/Vimeo":"NNte","./classes/providers/YouTube":"lSTi"}],"lTuM":[function(require,module,exports) {
module.exports={"video-container":"_video-container_16kny_1","video-embed":"_video-embed_16kny_13","error-message":"_error-message_16kny_22",videoContainer:"_video-container_16kny_1",videoEmbed:"_video-embed_16kny_13",errorMessage:"_error-message_16kny_22"};
},{}],"SVoV":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=i(require("../providers")),r=i(require("./Video.style.scss")),t=i(require("./VideoProvider"));function i(e){return e&&e.__esModule?e:{default:e}}function o(e,r){if(!(e instanceof r))throw new TypeError("Cannot call a class as a function")}function n(e,r){for(var t=0;t<r.length;t++){var i=r[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function a(e,r,t){return r&&n(e.prototype,r),t&&n(e,t),e}var d=function(){function i(e,r){o(this,i),this.provider=void 0,e&&r?this.provider=this.constructor.getProviderFromString(e.trim(),r.trim()):e&&(this.provider=this.constructor.guessProvider(e.trim()))}return a(i,[{key:"importOptions",value:function(e,r){this.provider=this.constructor.getProviderFromString("",e.trim()),this.provider&&this.provider.importOptions(r)}},{key:"getElement",value:function(){var e=document.createElement("div");if(e.classList.add(r.default.videoContainer),this.provider instanceof t.default){var i=this.provider.getElement();if(i)return i.classList.add(r.default.videoEmbed),e.appendChild(i),e}var o=document.createElement("p");return o.classList.add(r.default.errorMessage),o.textContent="Invalid Video",e.appendChild(o),e}},{key:"exportOptions",value:function(){return this.provider instanceof t.default?this.provider.exportOptions():""}},{key:"getProvider",value:function(){return this.provider?this.provider.getProviderString():"Invalid"}}],[{key:"guessProvider",value:function(r){for(var t,i=0;i<e.default.length;++i){var o=e.default[i];if(o.isProvider(r)){t=o;break}}if(t)return new t(r)}},{key:"getProviderFromString",value:function(r,t){for(var i,o=0;o<e.default.length;++o){var n=e.default[o];if(t.toLowerCase()===n.getProviderString().toLowerCase()){i=n;break}}if(i)return new i(r)}}]),i}();exports.default=d;
},{"../providers":"/awl","./Video.style.scss":"lTuM","./VideoProvider":"KGru"}],"ncaV":[function(require,module,exports) {
"use strict";var e=t(require("./classes/Video"));function t(e){return e&&e.__esModule?e:{default:e}}!function(){var t=function(t){if(t.dataset.source){for(var a=new e.default(t.dataset.source,t.dataset.provider);t.lastChild;)t.removeChild(t.lastChild);t.appendChild(a.getElement()),t.dataset.provider=a.getProvider(),t.dataset.options=a.exportOptions()}};document.addEventListener("DOMContentLoaded",function(){for(var e=document.querySelectorAll("div.video-tag[data-source]:not([data-options])"),a=0;a<e.length;++a){var o=e[a];t(o)}})}();
},{"./classes/Video":"SVoV"}]},{},["ncaV"], null)