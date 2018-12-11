!function(t){var e={};function n(o){if(e[o])return e[o].exports;var i=e[o]={i:o,l:!1,exports:{}};return t[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(o,i,function(e){return t[e]}.bind(null,i));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";var o=n(1),i=n(2),s={};s.handleLocation=o.handleLocation,s.getQueryString=o.getQueryString,s.startMap=function(t,e,n,o){var s=(0,i.createMap)(t,e,n);(0,i.createApp)(s,o).run()},window.msoa=s},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.handleLocation=function(){var t=document.getElementById("acceptform"),e=document.getElementById("acceptbutton");"geolocation"in navigator&&navigator.geolocation.getCurrentPosition(function(n){t.long.value=n.coords.longitude.toFixed(6),t.lat.value=n.coords.latitude.toFixed(6),e.innerHTML="Go to my location"},function(t){t.code==t.PERMISSION_DENIED&&(e.innerHTML="Continue")},{maximumAge:3e5})},e.getQueryString=function(t){for(var e=window.location.search.substring(1).split("&"),n=0;n<e.length;n++){var o=e[n].split("=");if(o[0]==t)return o[1]}return null}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=function(t){var e=i(t);return function(n){var o=t.map.queryRenderedFeatures(n.point,{layers:["msoa-highlight"]})[0];if(void 0!==o){var i=o.properties.msoa11cd;t.hasSuggestion()&&t.suggestion.getCode()==i?t.removeSuggestion():t.setSuggestion(function(t,e,n,o){return{map:t,createForm:e,properties:n,coordinates:o,timestamp:Date.now(),window:null,animation:null,animating:!1,getId:function(){return""+this.properties.msoa11cd+this.timestamp},getCode:function(){return this.properties.msoa11cd},getName:function(){return this.properties.msoa11hclnm},open:function(){var t=this;this.map.setPaintProperty("msoa-highlight","fill-opacity",["case",["==",["get","msoa11cd"],this.properties.msoa11cd],.2,0]),this.window=new mapboxgl.Popup({closeButton:!1}).setLngLat(this.coordinates).setDOMContent(this.createForm(this.properties)).addTo(this.map),this.window.on("close",function(){return t.clearAnimation()})},close:function(){null!==this.window&&this.window.remove()},deselect:function(){this.map.setPaintProperty("msoa-highlight","fill-opacity",0)},getAnimation:function(){var t="Sending ",e=0;return function(){3==e?(t="Sending ",e=0):(t+=".",e+=1),document.getElementById("statusmsg").innerHTML="",document.getElementById("statusmsg").innerHTML=t}},startAnimation:function(){this.animating||(this.animating=!0,this.animation=setInterval(this.getAnimation(),330))},endAnimation:function(t){this.animating&&(clearInterval(this.animation),this.animating=!1,document.getElementById("statusmsg").innerHTML=t)},clearAnimation:function(){this.animating&&(clearInterval(this.animation),this.animating=!1)}}}(t.map,e,o.properties,n.lngLat))}else t.hasSuggestion()&&t.removeSuggestion()}},i=function(t){var e=function(t){var e=document.getElementById("sendbutton");0==t.srcElement.value?(e.disabled=!0,e.style.background="#c0c0c0",e.style.borderColor="#c0c0c0"):(e.disabled=!1,e.style.background="#d06040",e.style.borderColor="#d06040")},n=function(){var e=t.getSuggestion().getId(),n=document.getElementById("msoa11cd").value,o=document.getElementById("msoa11nm").value,s=document.getElementById("msoa11hclnm").value,a=document.getElementById("suggestion").value,r=document.getElementById("reason").value;if(0!=n.length&&0!=o.length&&0!=s.length&&0!=a.length&&!(n.length>64||o.length>64||s.length>64||a.length>64||r.length>1024)){var u=document.getElementById("contentbox");u.innerHTML="",u.appendChild(i()),t.getSuggestion().startAnimation();var l=new FormData;l.append("msoa11cd",n),l.append("msoa11nm",o),l.append("msoa11hclnm",s),l.append("suggestion",a),l.append("reason",r);var g=new XMLHttpRequest;g.timeout=2e4,g.onload=function(){200==g.status?t.hasSuggestion()&&e==t.getSuggestion().getId()&&t.getSuggestion().endAnimation("All done!"):t.getSuggestion().endAnimation("Sorry, we could not record your suggestion.")},g.ontimeout=function(){t.hasSuggestion()&&e==t.getSuggestion().getId()&&t.getSuggestion().endAnimation("Sorry, we could not record your suggestion.")},g.onerror=function(){t.hasSuggestion()&&e==t.getSuggestion().getId()&&t.getSuggestion().endAnimation("Sorry, we could not record your suggestion.")},g.open("POST","/msoanames/submit"),g.setRequestHeader("X-CSRFToken",t.getCSRF()),g.send(l)}},o=function(){t.closeAndRemoveSuggestion()},i=function(){var t=document.createElement("div");return t.className="statusbox",t.innerHTML='\n            <p>Thank you very much for your suggestion for this area.</p>\n            <p id="statusmsg">Sending </p>\n            <button class="closebutton" type="button">Close</button>',t.getElementsByClassName("closebutton")[0].addEventListener("click",o,!1),t};return function(t){var i='\n            <form method="post" action="/msoanames/submit">\n                <input type="hidden" id="msoa11cd"\n                    value="'+t.msoa11cd+'">\n                <input type="hidden" id="msoa11nm"\n                        value="'+t.msoa11nm+'">\n                <input type="hidden" id="msoa11hclnm"\n                        value="'+t.msoa11hclnm+'">\n                <div id="namebox">\n                    <p>'+t.msoa11hclnm+'</p>\n                </div>\n                <div id="contentbox">\n                    <div>\n                        <input type="text" id="suggestion" class="suggestion"\n                            placeholder="Your suggestion (required)" maxlength="64" required>\n                    </div>\n                    <div>\n                        <textarea id="reason" placeholder="Why you think this would be a better name"\n                            maxlength="1024"></textarea>\n                    </div>\n                    <div class="buttonbox">\n                        <button id="sendbutton" class="sendbutton"\n                            type="button" disabled>Submit</button>\n                        <button class="closebutton"\n                            type="button">Close</button>\n                    </div>\n                    <div id="messagebox">\n                        <p>Please note that we cannot accept suggestions for boundary changes.</p>\n                    </div>\n                </div>\n            </form>',s=document.createElement("div");return s.className="formbox",s.innerHTML=i,s.getElementsByClassName("suggestion")[0].addEventListener("input",e,!1),s.getElementsByClassName("sendbutton")[0].addEventListener("click",n,!1),s.getElementsByClassName("closebutton")[0].addEventListener("click",o,!1),s}};e.createMap=function(t,e,n){var o=function(t,e){return null==t||0==t||isNaN(parseFloat(t))?e:parseFloat(t)},i=o(t,-.116773),s=o(e,51.510357),a=o(n,12.5);return mapboxgl.accessToken="pk.eyJ1IjoiaGF3a2luc29ob2NsIiwiYSI6IjNmMmZkMzY4MTUwZGNiMjE4NTExOWQwNDBjNzg4NjAzIn0.bv8BBlUo7MtQR544YviGZQ",new mapboxgl.Map({container:"map",style:"mapbox://styles/hawkinsohocl/cjp3yceei0zjy2sqx8osa0qtb",center:[i,s],zoom:a})},e.createApp=function(t,e){return{suggestion:null,map:t,csrf:e,run:function(){var e=this;return t.addControl(new mapboxgl.NavigationControl,"top-right"),t.getCanvas().style.cursor="pointer",this.map.on("load",function(){t.addSource("msoa",{type:"vector",url:"mapbox://hawkinsohocl.dufqu7po"}),t.addLayer({id:"msoa-highlight",type:"fill",source:"msoa","source-layer":"msoa-2011-polygons-hcl-9e0rmt",paint:{"fill-color":"#d83808","fill-opacity":0},minzoom:8,maxzoom:22})}),t.on("click",o(this)),t.on("zoom",function(){t.getZoom()<8&&e.hasSuggestion()&&e.closeAndRemoveSuggestion()}),t.on("moveend",function(){var e=t.getCenter(),n=t.getZoom(),o="/msoanames/map?long="+e.lng+"&lat="+e.lat+"&zoom="+n;history.replaceState(null,null,o)}),this},getSuggestion:function(){return this.suggestion},setSuggestion:function(t){return this.suggestion=t,this.suggestion.open(),this},removeSuggestion:function(){return this.suggestion.clearAnimation(),this.suggestion.deselect(),this.suggestion=null,this},closeAndRemoveSuggestion:function(){return this.suggestion.close(),this.removeSuggestion(),this},hasSuggestion:function(){return null!==this.suggestion},getCSRF:function(){return this.csrf}}}}]);