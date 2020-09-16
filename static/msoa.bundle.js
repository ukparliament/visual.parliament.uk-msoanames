!function(e){var t={};function n(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(o,i,function(t){return e[t]}.bind(null,i));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";var o=n(1),i=n(2),r={};r.handleLocation=o.handleLocation,r.getQueryString=o.getQueryString,r.startMap=function(e,t,n,o){var r=(0,i.createMap)(e,t,n);(0,i.createApp)(r,o).run()},window.msoa=r},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.handleLocation=function(){var e=document.getElementById("acceptform"),t=document.getElementById("acceptbutton");"geolocation"in navigator&&navigator.geolocation.getCurrentPosition((function(n){e.long.value=n.coords.longitude.toFixed(6),e.lat.value=n.coords.latitude.toFixed(6),t.innerHTML="See MSOAs near me"}),(function(e){e.code==e.PERMISSION_DENIED&&(t.innerHTML="See a map of MSOAs")}),{maximumAge:3e5})},t.getQueryString=function(e){for(var t=window.location.search.substring(1).split("&"),n=0;n<t.length;n++){var o=t[n].split("=");if(o[0]==e)return o[1]}return null}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(e){var t=i(e);return function(n){var o=e.map.queryRenderedFeatures(n.point,{layers:["msoa-highlight"]})[0];if(void 0!==o){var i=o.properties.msoa11cd;e.hasSelection()&&e.selection.getCode()==i?e.removeSelection():e.setSelection(function(e,t,n,o){return{map:e,createMessage:t,properties:n,coordinates:o,window:null,getCode:function(){return this.properties.msoa11cd},getName:function(){return this.properties.msoa11hclnm},open:function(){this.map.setPaintProperty("msoa-highlight","fill-opacity",["case",["==",["get","msoa11cd"],this.properties.msoa11cd],.2,0]),this.window=new mapboxgl.Popup({closeButton:!1}).setLngLat(this.coordinates).setDOMContent(this.createMessage(this.properties)).addTo(this.map),this.window.on("close",(function(){}))},close:function(){null!==this.window&&this.window.remove()},deselect:function(){this.map.setPaintProperty("msoa-highlight","fill-opacity",0)}}}(e.map,t,o.properties,n.lngLat))}else e.hasSelection()&&e.removeSelection()}},i=function(e){var t=function(){e.closeAndRemoveSelection()};return function(e){var n='\n            <div id="namebox">\n                <p>'+e.msoa11hclnm+'</p>\n            </div>\n            <div id="contentbox">\n                <p>'+e.msoa11nm+"</p>\n                <p>"+e.msoa11cd+'</p>\n                <p>\n                    <a href="/msoanames/static/MSOA-Names-1.5.0.xlsx">Excel</a> /\n                    <a href="/msoanames/static/MSOA-Names-1.5.0.csv">CSV</a>\n                </p>\n            </div>\n            <div id="buttonbox">\n                <button class="closebutton" type="button">Close</button>\n            </div>',o=document.createElement("div");return o.className="messagebox",o.innerHTML=n,o.getElementsByClassName("closebutton")[0].addEventListener("click",t,!1),o}};t.createMap=function(e,t,n){var o=function(e,t){return null==e||0==e||isNaN(parseFloat(e))?t:parseFloat(e)},i=o(e,-.116773),r=o(t,51.510357),a=o(n,12.5);return mapboxgl.accessToken="pk.eyJ1IjoiaGF3a2luc29ob2NsIiwiYSI6IjNmMmZkMzY4MTUwZGNiMjE4NTExOWQwNDBjNzg4NjAzIn0.bv8BBlUo7MtQR544YviGZQ",new mapboxgl.Map({container:"map",style:"mapbox://styles/hawkinsohocl/ckf5ee22r1zh319qoglw8l8xd",center:[i,r],zoom:a})},t.createApp=function(e,t){return{selection:null,map:e,csrf:t,run:function(){var t=this;return e.addControl(new mapboxgl.NavigationControl,"top-right"),e.getCanvas().style.cursor="pointer",this.map.on("load",(function(){e.addSource("msoa",{type:"vector",url:"mapbox://hawkinsohocl.5djqm891"}),e.addLayer({id:"msoa-highlight",type:"fill",source:"msoa","source-layer":"msoa-2011-polygons-hcl-d7me3w",paint:{"fill-color":"#682f7f","fill-opacity":0},minzoom:8.5,maxzoom:22})})),e.on("click",o(this)),e.on("zoom",(function(){e.getZoom()<8.5&&t.hasSelection()&&t.closeAndRemoveSelection()})),e.on("moveend",(function(){var t=e.getCenter(),n=e.getZoom(),o="/msoanames/map?long="+t.lng+"&lat="+t.lat+"&zoom="+n;history.replaceState(null,null,o)})),this},getSelection:function(){return this.selection},setSelection:function(e){return this.selection=e,this.selection.open(),this},removeSelection:function(){return this.selection.deselect(),this.selection=null,this},closeAndRemoveSelection:function(){return this.selection.close(),this.removeSelection(),this},hasSelection:function(){return null!==this.selection},getCSRF:function(){return this.csrf}}}}]);
//# sourceMappingURL=msoa.bundle.js.map