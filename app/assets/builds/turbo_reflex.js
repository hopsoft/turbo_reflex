var g=class{get element(){return document.querySelector('meta[name="turbo-reflex"]')}get token(){return this.element.getAttribute("content")}get busy(){return this.element.dataset.busy==="true"}set busy(e){return this.element.dataset.busy=!!e}},i=new g;var R=class{get base64(){return i.element.dataset.uiState}get base64Chunks(){return this.base64.match(/.{1,2000}/g)}get json(){return atob(this.base64)}get data(){return JSON.parse(this.json)}set data(e={}){return i.element.dataset.uiState=btoa(JSON.stringify(e)),e}update(e={}){this.data={...this.data,...e}}},d=new R;function H(t){let e="<html",r="</html",n=t.indexOf(e),s=t.lastIndexOf(r);if(n>=0&&s>=0){let q=t.slice(t.indexOf(">",n)+1,s);document.documentElement.innerHTML=q}}function N(t){document.body.insertAdjacentHTML("beforeend",t)}var l={append:N,replaceDocument:H};var p={};function X(t){p[t.id]=t}function I(t){delete p[t]}var x={add:X,remove:I,get reflexes(){return[...Object.values(p)]},get length(){return Object.keys(p).length}};var f={start:"turbo-reflex:start",success:"turbo-reflex:success",finish:"turbo-reflex:finish",abort:"turbo-reflex:abort",clientError:"turbo-reflex:client-error",serverError:"turbo-reflex:server-error"};function h(t,e=document,r={},n=!1){try{e=e||document;let s=new CustomEvent(t,{detail:r,cancelable:!1,bubbles:!0});e.dispatchEvent(s)}catch(s){if(n)throw s;h(f.clientError,e,{error:s,...r},!0)}}function _(t={}){h(f.clientError,window,t,!0)}function w(t){t.detail.endedAt=new Date().getTime(),t.detail.milliseconds=t.detail.endedAt-t.detail.startedAt,setTimeout(()=>h(f.finish,t.target,t.detail),20)}addEventListener(f.serverError,w);addEventListener(f.success,w);addEventListener(f.finish,t=>x.remove(t.detail.id),!0);var o={dispatch:h,dispatchClientError:_,events:f};var E={};addEventListener("turbo:before-fetch-request",t=>{let e=t.target.closest("turbo-frame"),{fetchOptions:r}=t.detail;if(i.busy){let n=["text/vnd.turbo-reflex.html",r.headers.Accept];n=n.filter(s=>s&&s.trim().length>0).join(", "),r.headers.Accept=n}r.headers["TurboReflex-Token"]=i.token,d.base64Chunks.forEach((n,s)=>r.headers[`TurboReflex-UiState-${s.toString().padStart(6,"0")}`]=n)});addEventListener("turbo:before-fetch-response",t=>{let e=t.target.closest("turbo-frame"),{fetchResponse:r}=t.detail;if(e&&(E[e.id]=e.src),r.header("TurboReflex")){if(r.statusCode<200||r.statusCode>399){let n=`Server returned a ${r.statusCode} status code! TurboReflex requires 2XX-3XX status codes.`;o.dispatchClientError({...t.detail,error:n})}r.header("TurboReflex")==="Append"&&(t.preventDefault(),r.responseText.then(n=>l.append(n)))}});addEventListener("turbo:frame-load",t=>{let e=t.target.closest("turbo-frame");e.dataset.turboReflexSrc=E[e.id]||e.src||e.dataset.turboReflexSrc,delete E[e.id]});var F={frameAttribute:"data-turbo-frame",methodAttribute:"data-turbo-method",reflexAttribute:"data-turbo-reflex"},a={...F};var v={},y;function P(t,e){v[t]=e,document.addEventListener(t,y,!0)}function J(t){return Object.keys(v).find(e=>!!v[e].find(r=>Array.from(document.querySelectorAll(r)).find(n=>n===t)))}function U(t,e){return t===J(e)}var u={events:v,register:P,isRegisteredForElement:U,set handler(t){y=t}};function M(t){return t.closest(`[${a.reflexAttribute}]`)}function V(t){return t.closest("turbo-frame")}function B(t,e={}){if(t.tagName.toLowerCase()!=="select")return e.value=t.value||null;if(!t.multiple)return e.value=t.options[t.selectedIndex].value;e.values=Array.from(t.options).reduce((r,n)=>(n.selected&&r.push(n.value),r),[])}function G(t){let e=Array.from(t.attributes).reduce((r,n)=>{let s=n.value;return r[n.name]=s,r},{});return e.tag=t.tagName,e.checked=!!t.checked,e.disabled=!!t.disabled,B(t,e),delete e.class,delete e.action,delete e.href,delete e[a.reflexAttribute],delete e[a.frameAttribute],e}var m={buildAttributePayload:G,findClosestReflex:M,findClosestFrame:V};function z(t,e={}){e.token=i.token;let r=document.createElement("input");r.type="hidden",r.name="turbo_reflex",r.value=JSON.stringify(e),t.appendChild(r)}var S={invokeReflex:z};function K(t,e={}){let r=document.createElement("a");r.href=t;let n=new URL(r);return n.searchParams.set("turbo_reflex",JSON.stringify(e)),n}var c={build:K};function Q(t,e){let r=e.src;e={...e},delete e.src,t.src=c.build(r,e)}var k={invokeReflex:Q};function W(t,e={}){let r=e.src;e={...e},delete e.src,delete e.href,t.setAttribute("href",c.build(r,e))}var L={invokeReflex:W};function Y(t){let e=t.target;o.dispatch(o.events.abort,window,{xhr:e,...t.detail})}function A(t){let e=t.target;e.getResponseHeader("TurboReflex")==="Append"?l.append(e.responseText):l.replaceDocument(e.responseText);let r=`Server returned a ${e.status} status code! TurboReflex requires 2XX-3XX status codes.`;o.dispatchClientError({xhr:e,...t.detail,error:r})}function Z(t){let e=t.target;if(e.status<200||e.status>399)return A(t);let r=e.responseText;e.getResponseHeader("TurboReflex")==="Append"?l.append(e.responseText):l.replaceDocument(e.responseText)}function ee(t){let e=t.src;t={...t},delete t.src;try{let r=new XMLHttpRequest;r.open("GET",c.build(e,t),!0),r.setRequestHeader("Accept","text/vnd.turbo-reflex.html, text/html, application/xhtml+xml"),r.setRequestHeader("TurboReflex-Token",i.token),d.base64Chunks.forEach((n,s)=>r.setRequestHeader(`TurboReflex-UiState-${s.toString().padStart(6,"0")}`,n)),r.addEventListener("abort",Y),r.addEventListener("error",A),r.addEventListener("load",Z),r.send()}catch(r){let n=`Unexpected error sending HTTP request! ${r.message}`;A(r,{detail:{message:n}})}}var O={invokeReflex:ee};function T(t,e){return e=e||{dataset:{}},t.href||e.src||e.dataset.turboReflexSrc||location.href}function te(t){let e=m.findClosestFrame(t),{turboFrame:r,turboMethod:n}=t.dataset;return t.tagName.toLowerCase()==="form"?{name:"form",reason:"Element is a form.",frame:e,src:t.action,invokeReflex:S.invokeReflex}:n&&n.length>0?{name:"method",reason:"Element defines data-turbo-method.",frame:e,src:t.href,invokeReflex:L.invokeReflex}:r&&r!=="_self"?(e=document.getElementById(r),{name:"frame",reason:"element targets a frame that is not _self",frame:e,src:T(t,e),invokeReflex:k.invokeReflex}):(!r||r==="_self")&&e?{name:"frame",reason:"element does NOT target a frame or targets _self and is contained by a frame",frame:e,src:T(t,e),invokeReflex:k.invokeReflex}:{name:"window",reason:"element matches one or more of the following conditions (targets _top, does NOT target a frame, is NOT contained by a frame)",frame:null,src:T(t),invokeReflex:O.invokeReflex}}var C={find:te};var b="unknown",D={debug:Object.values(o.events),info:Object.values(o.events),warn:[o.events.abort,o.events.clientError,o.events.serverError],error:[o.events.clientError,o.events.serverError],unknown:[]};Object.values(o.events).forEach(t=>{addEventListener(t,e=>{D[b].includes(e.type)&&console[b==="debug"?"log":b](e.type,e.detail)})});var j={get level(){return b},set level(t){return Object.keys(D).includes(t)||(t="unknown"),b=t}};function re(){return([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,t=>(t^crypto.getRandomValues(new Uint8Array(1))[0]&15>>t/4).toString(16))}var $={v4:re};function ne(t){let e,r={};try{if(e=m.findClosestReflex(t.target),!e||!u.isRegisteredForElement(t.type,e))return;let n=C.find(e);switch(r={id:`reflex-${$.v4()}`,name:e.dataset.turboReflex,driver:n.name,src:n.src,frameId:n.frame?n.frame.id:null,elementId:e.id.length>0?e.id:null,elementAttributes:m.buildAttributePayload(e),startedAt:new Date().getTime()},x.add(r),o.dispatch(o.events.start,e,r),["frame","window"].includes(n.name)&&t.preventDefault(),i.busy=!0,setTimeout(()=>i.busy=!1,10),n.name){case"method":return n.invokeReflex(e,r);case"form":return n.invokeReflex(e,r);case"frame":return n.invokeReflex(n.frame,r);case"window":return n.invokeReflex(r)}}catch(n){o.dispatch(o.events.clientError,e,{error:n,...r})}}u.handler=ne;u.register("change",[`input[${a.reflexAttribute}]`,`select[${a.reflexAttribute}]`,`textarea[${a.reflexAttribute}]`]);u.register("submit",[`form[${a.reflexAttribute}]`]);u.register("click",[`[${a.reflexAttribute}]`]);var rt={uiState:d,schema:a,logger:j,registerEventDelegate:u.register,get eventDelegates(){return{...u.events}},get lifecycleEvents(){return[...Object.values(o.events)]}};export{rt as default,d as uiState};
//# sourceMappingURL=turbo_reflex.js.map
