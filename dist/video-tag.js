parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r},p.cache={};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({"91zb":[function(require,module,exports) {
module.exports={container:"_container_1mc3z_1",videoContent:"_videoContent_1mc3z_11"};
},{}],"IuSA":[function(require,module,exports) {
"use strict";var t=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};exports.__esModule=!0;var e,o=t(require("./style.scss"));!function(t){t[t.Twitch=0]="Twitch",t[t.Vimeo=1]="Vimeo",t[t.YouTube=2]="YouTube",t[t.Invalid=3]="Invalid"}(e||(e={}));var i=function(){function t(t,o){switch(this.options=new Map,this.source=e.Invalid,this.source=o?this.parseSourceString(o):this.guessSource(t),t=t.trim(),this.source){case e.Twitch:if(n=t.match(/https?:\/\/(?:.+\.)?twitch\.tv\/(?:(?:videos\/(\d+))|embed\/)?(\w+)?/)){if(void 0!==n[2]?this.options.set("channel",n[2]):void 0!==n[1]&&this.options.set("id","v"+n[1]),void 0!==(r=t.split("?"))[1]){var i=r[1],s=this.parseQuery(i);this.options.get("channel")||this.options.get("id")||(s.get("channel")?this.options.set("channel",s.get("channel")):s.get("video")&&this.options.set("id",s.get("video"))),s.get("t")&&this.options.set("start",this.timeToSeconds(s.get("t")))}if(!this.options.get("id")&&!this.options.get("channel"))return void(this.source=e.Invalid)}if(!this.options.get("id")&&!this.options.get("channel"))return t.match(/^\d+$/)?void this.options.set("id","v"+t):t.match(/^v\d+$/)?void this.options.set("id",t):void this.options.set("channel",t);break;case e.Vimeo:if((n=t.match(/^https?:\/\/(?:.+\.)?vimeo\.com\/(?:video\/)?(\d+)\??(.*)?$/))&&void 0!==n[1]){var r;if(this.options.set("id",n[1]),void 0!==(r=t.split("#"))[1]){i=r[1];(s=this.parseQuery(i)).get("t")&&this.options.set("start",this.timeToSeconds(s.get("t")))}return}if(t.match(/^\d+$/))return void this.options.set("id",t);if(!this.options.get("id"))return void(this.source=e.Invalid);break;case e.YouTube:var n;if((n=t.match(/https?:\/\/(?:.+\.)?youtube(?:-nocookie)?\.com\/embed\/(.*)(?:&|\?|$)/))&&void 0!==n[1])return void this.options.set("id",n[1]);if(n=t.match(/https?:\/\/(?:.+\.)?youtube\.com\/watch\?/)){i=t.split("?")[1];if((s=this.parseQuery(i)).get("v")&&this.options.set("id",s.get("v")),s.get("start"))(c=parseInt(s.get("start"),10))>0&&this.options.set("start",c);else if(s.get("t")){var c;if(0>=(c=this.timeToSeconds(s.get("t")))){c=0;var a=parseInt(s.get("t"),10);a>0&&(c+=a)}c>0&&this.options.set("start",""+c)}return}if((n=t.match(/https?:\/\/youtu\.be\/(.+$)/))&&void 0!==n[1])return void this.options.set("id",n[1]);if(t.match(/^[a-zA-Z0-9_-]{11}$/))return void this.options.set("id",t);if(!this.options.get("id"))return void(this.source=e.Invalid);break;case e.Invalid:default:return}}return t.prototype.importOptions=function(t,e){this.source=parseSourceString(t),this.options=this.parseQuery(e)},t.prototype.getElement=function(){var t=document.createElement("div");switch(t.classList.add(o.default.container),this.source){case e.Twitch:var i="";this.options.get("channel")?i="https://player.twitch.tv/?autoplay=false&channel="+this.options.get("channel"):this.options.get("id")&&(i="https://player.twitch.tv/?autoplay=false&video="+this.options.get("id"),this.options.get("start")&&(i+="&t="+this.secondsToTime(this.options.get("start")))),i&&t.appendChild(this.createIFrame(i));break;case e.Vimeo:i="https://player.vimeo.com/video/"+this.options.get("id")+"?color=ffffff&title=0&byline=0&portrait=0&autoplay=0";this.options.get("start")&&(i+="#t="+this.secondsToTime(this.options.get("start"))),t.appendChild(this.createIFrame(i));var s=document.createElement("script");s.setAttribute("src","https://player.vimeo.com/api/player.js"),t.appendChild(s);break;case e.YouTube:i="https://www.youtube-nocookie.com/embed/"+this.options.get("id");this.options.get("start")&&(i+="?start="+this.options.get("start")),t.appendChild(this.createIFrame(i))}if(0>=t.children.length){var r=document.createElement("p");r.textContent="Invalid Video",t.appendChild(r)}return t},t.prototype.exportOptions=function(){return this.createQueryString(this.options)},t.prototype.getSource=function(){return this.sourceToString(this.source)},t.prototype.sourceToString=function(t){switch(t){case e.Invalid:return"Invalid";case e.Twitch:return"Twitch";case e.Vimeo:return"Vimeo";case e.YouTube:return"YouTube";default:return""}},t.prototype.guessSource=function(t){var o=this.getHost(t);if(0<o.length){if(o.match(/^(?:.+\.)?twitch\.tv$/))return e.Twitch;if(o.match(/^(?:.+\.)?vimeo\.com$/))return e.Vimeo;if(o.match(/^(?:.+\.)?youtu(?:be(?:-nocookie)?\.com|\.be)$/))return e.YouTube}return e.Invalid},t.prototype.parseSourceString=function(t){switch(t=t.trim().toLowerCase()){case"twitch":return e.Twitch;case"vimeo":return e.Vimeo;case"youtube":return e.YouTube;default:return e.Invalid}return source},t.prototype.parseQuery=function(t,e,o){e||(e="&"),o||(o="=");var i=new Map;return t.split(e).forEach(function(t){if(t)if(t.search(o)>-1){var e=t.split(o),s=e[0],r=e[1];i.set(decodeURIComponent(s),decodeURIComponent(r))}else i.set(decodeURIComponent(t),"")}),i},t.prototype.createQueryString=function(t){var e="";return t.forEach(function(t,o){e+=encodeURIComponent(o)+"="+encodeURIComponent(t)+"&"}),0<e.length&&(e=e.slice(0,-1)),e},t.prototype.getHost=function(t){var e=document.createElement("a");return e.setAttribute("href",t),t.startsWith(window.location.protocol)||e.protocol!==window.location.protocol||t.search(window.location.host)>-1?e.host:""},t.prototype.timeToSeconds=function(t){var e=t.match(/(\d+h)?(\d+m)?(\d+s)?/),o=0;if(e[0]){if(e[1]){var i=parseInt(e[1],10);i>0&&(o+=60*i*60)}if(e[2]){var s=parseInt(e[2],10);s>0&&(o+=60*s)}if(e[3]){var r=parseInt(e[3],10);r>0&&(o+=r)}}return o},t.prototype.secondsToTime=function(t){var e=Math.floor(t/3600),o=Math.floor((t-60*e*60)/60);return e+"h"+o+"m"+Math.floor(t-(60*e*60+60*o))+"s"},t.prototype.createIFrame=function(t){var e=document.createElement("iframe");return e.setAttribute("allowfullscreen",""),e.setAttribute("scrolling","no"),e.setAttribute("webkitallowfullscreen",""),e.setAttribute("mozallowfullscreen",""),e.setAttribute("allow","accelerometer; encrypted-media; gyroscope; picture-in-picture"),e.classList.add(o.default.videoContent),e.src=t,e},t}();exports.Video=i,exports.default=i;
},{"./style.scss":"91zb"}],"ncaV":[function(require,module,exports) {
"use strict";var n=this&&this.__importDefault||function(n){return n&&n.__esModule?n:{default:n}};exports.__esModule=!0;var e=n(require("./video.ts")),r=function(){return document.querySelectorAll("div.video-tag:not([data-options])")},u=function(n){if(void 0!==n.dataset.content){if(void 0!==n.dataset.source)var r=new e.default(n.dataset.content,n.dataset.source);else r=new e.default(n.dataset.content);for(;n.lastChild;)n.removeChild(n.lastChild);n.appendChild(r.getElement()),n.dataset.source=r.getSource(),n.dataset.options=r.exportOptions()}else n.dataset.source="Invalid",n.dataset.options=""},s=function(){r().forEach(u)};document.addEventListener("DOMContentLoaded",s);
},{"./video.ts":"IuSA"}]},{},["ncaV"], null)