var j={frameAttribute:"data-turbo-frame",reflexAttribute:"data-turbo-reflex"},f={...j};var x={};function I(e){x[e.id]=e}function S(e){delete x[e]}var p={add:I,remove:S,get reflexes(){return[...Object.values(x)]},get length(){return Object.keys(x).length}};var l={start:"turbo-reflex:start",success:"turbo-reflex:success",finish:"turbo-reflex:finish",abort:"turbo-reflex:abort",clientError:"turbo-reflex:client-error",serverError:"turbo-reflex:server-error"};function b(e,t=document,r={},n=!1){try{t=t||document;let s=new CustomEvent(e,{detail:r,cancelable:!1,bubbles:!0});t.dispatchEvent(s)}catch(s){if(n)throw s;b(l.clientError,t,{error:s,...r},!0)}}function H(e={}){b(l.clientError,window,e,!0)}function k(e){e.detail.endedAt=new Date().getTime(),e.detail.milliseconds=e.detail.endedAt-e.detail.startedAt,setTimeout(()=>b(l.finish,e.target,e.detail),20)}addEventListener(l.serverError,k);addEventListener(l.success,k);addEventListener(l.finish,e=>p.remove(e.detail.id),!0);var o={dispatch:b,dispatchClientError:H,events:l};function q(e){return e.closest(`[${f.reflexAttribute}]`)}function N(e){return e.closest("turbo-frame")}function X(e,t={}){if(e.tagName.toLowerCase()!=="select")return t.value=e.value;if(!e.multiple)return t.value=e.options[e.selectedIndex].value;t.values=Array.from(e.options).reduce((r,n)=>(n.selected&&r.push(n.value),r),[])}function _(e){let n=Array.from(e.attributes).reduce((s,m)=>{let c=m.value;return typeof c=="string"&&c.length>100&&(c=c.slice(0,100)+"..."),s[m.name]=c,s},{});return n.tag=e.tagName,n.checked=e.checked,n.disabled=e.disabled,X(e,n),typeof n.value=="string"&&n.value.length>500&&(n.value=n.value.slice(0,500)+"..."),delete n.class,delete n[f.reflexAttribute],delete n[f.frameAttribute],n}var i={buildAttributePayload:_,findClosestReflex:q,findClosestFrame:N,get metaElement(){return document.getElementById("turbo-reflex")},get metaElementToken(){return document.getElementById("turbo-reflex").getAttribute("content")}};function F(e){let t="<html",r="</html",n=e.indexOf(t),s=e.lastIndexOf(r);if(n>=0&&s>=0){let m=e.slice(e.indexOf(">",n)+1,s);document.documentElement.innerHTML=m}}function P(e){document.body.insertAdjacentHTML("beforeend",e)}var u={append:P,replaceDocument:F};var h={};addEventListener("turbo:before-fetch-request",e=>{let t=e.target.closest("turbo-frame"),{fetchOptions:r}=e.detail;if(window.turboReflexActive){let n=["text/vnd.turbo-reflex.html",r.headers.Accept];n=n.filter(s=>s&&s.trim().length>0).join(", "),r.headers.Accept=n,r.headers["TurboReflex-Token"]=i.metaElementToken}});addEventListener("turbo:before-fetch-response",e=>{let t=e.target.closest("turbo-frame"),{fetchResponse:r}=e.detail;if(t&&(h[t.id]=t.src),r.header("TurboReflex")){if(r.statusCode<200||r.statusCode>399){let n=`Server returned a ${r.statusCode} status code! TurboReflex requires 2XX-3XX status codes.`;o.dispatchClientError({...e.detail,error:n})}r.header("TurboReflex")==="Append"&&(e.preventDefault(),r.responseText.then(n=>u.append(n)))}});addEventListener("turbo:frame-load",e=>{let t=e.target.closest("turbo-frame");t.dataset.turboReflexSrc=h[t.id]||t.src||t.dataset.turboReflexSrc,delete h[t.id]});var v={},w;function V(e,t){v[e]=t,document.addEventListener(e,w,!0)}function $(e){return Object.keys(v).find(t=>!!v[t].find(r=>Array.from(document.querySelectorAll(r)).find(n=>n===e)))}function B(e,t){return e===$(t)}var a={events:v,register:V,isRegisteredForElement:B,set handler(e){w=e}};function M(e,t={}){t.token=i.metaElementToken;let r=document.createElement("input");r.type="hidden",r.name="turbo_reflex",r.value=JSON.stringify(t),e.appendChild(r)}var A={invokeReflex:M};function U(e,t={}){let r=document.createElement("a");r.href=e;let n=new URL(r);return n.searchParams.set("turbo_reflex",JSON.stringify(t)),n}var g={build:U};function J(e,t){let r=t.src;t={...t},delete t.src,e.src=g.build(r,t)}var E={invokeReflex:J};function G(e){let t=e.target;o.dispatch(o.events.abort,window,{xhr:t,...e.detail})}function R(e){let t=e.target;t.getResponseHeader("TurboReflex")==="Append"?u.append(t.responseText):u.replaceDocument(t.responseText);let r=`Server returned a ${t.status} status code! TurboReflex requires 2XX status codes.`;o.dispatchClientError({xhr:t,...e.detail,error:r})}function z(e){let t=e.target;if(t.status<200||t.status>299)return R(e);let r=t.responseText;t.getResponseHeader("TurboReflex")==="Append"?u.append(t.responseText):u.replaceDocument(t.responseText)}function K(e){let t=e.src;e={...e},delete e.src;try{let r=new XMLHttpRequest;r.open("GET",g.build(t,e),!0),r.setRequestHeader("Accept","text/vnd.turbo-reflex.html, text/html, application/xhtml+xml"),r.setRequestHeader("TurboReflex-Token",i.metaElementToken),r.addEventListener("abort",G),r.addEventListener("error",R),r.addEventListener("load",z),r.send()}catch(r){let n=`Unexpected error sending HTTP request! ${r.message}`;R(r,{detail:{message:n}})}}var y={invokeReflex:K};function T(e,t){return t=t||{dataset:{}},e.href||t.src||t.dataset.turboReflexSrc||location.href}function Q(e){let t=i.findClosestFrame(e),r=e.dataset.turboFrame;return e.tagName.toLowerCase()==="form"?{name:"form",reason:"Element is a form.",frame:t,src:e.action,invokeReflex:A.invokeReflex}:r&&r!=="_self"?(t=document.getElementById(r),{name:"frame",reason:"element targets a frame that is not _self",frame:t,src:T(e,t),invokeReflex:E.invokeReflex}):(!r||r==="_self")&&t?{name:"frame",reason:"element does NOT target a frame or targets _self and is contained by a frame",frame:t,src:T(e,t),invokeReflex:E.invokeReflex}:{name:"window",reason:"element matches one or more of the following conditions (targets _top, does NOT target a frame, is NOT contained by a frame)",frame:null,src:T(e),invokeReflex:y.invokeReflex}}var L={find:Q};var d="unknown",O={debug:Object.values(o.events),info:Object.values(o.events),warn:[o.events.abort,o.events.clientError,o.events.serverError],error:[o.events.clientError,o.events.serverError],unknown:[]};Object.values(o.events).forEach(e=>{addEventListener(e,t=>{O[d].includes(t.type)&&console[d==="debug"?"log":d](t.type,t.detail)})});var C={get level(){return d},set level(e){return Object.keys(O).includes(e)||(e="unknown"),d=e}};function W(){return([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,e=>(e^crypto.getRandomValues(new Uint8Array(1))[0]&15>>e/4).toString(16))}var D={v4:W};function Y(e){let t,r={};try{if(t=i.findClosestReflex(e.target),!t||!a.isRegisteredForElement(e.type,t))return;let n=L.find(t);switch(r={id:`reflex-${D.v4()}`,name:t.dataset.turboReflex,driver:n.name,src:n.src,frameId:n.frame?n.frame.id:null,elementId:t.id.length>0?t.id:null,elementAttributes:i.buildAttributePayload(t),startedAt:new Date().getTime()},p.add(r),o.dispatch(o.events.start,t,r),n.name!=="form"&&e.preventDefault(),window.turboReflexActive=!0,setTimeout(()=>window.turboReflexActive=!1,10),n.name){case"form":return n.invokeReflex(t,r);case"frame":return n.invokeReflex(n.frame,r);case"window":return n.invokeReflex(r)}}catch(n){o.dispatch(o.events.clientError,t,{error:n,...r})}}a.handler=Y;a.register("change",["input[data-turbo-reflex]","select[data-turbo-reflex]","textarea[data-turbo-reflex]"]);a.register("submit",["form[data-turbo-reflex]"]);a.register("click",["[data-turbo-reflex]"]);var Be={schema:f,logger:C,registerEventDelegate:a.register,get eventDelegates(){return{...a.events}},get lifecycleEvents(){return[...Object.values(o.events)]}};export{Be as default};
//# sourceMappingURL=turbo_reflex.js.map
