var a={};function f(t,e){return e=e.toLowerCase(),a[t].includes(e)||!Object.values(a).flat().includes(e)&&a[t].includes("*")}function l(t){let e=t.dataset.turboReflexFrame;return e=e||t.closest("turbo-frame").id,e||console.error("The reflex element does not specify a frame!","Please set the 'data-turbo-reflex-frame' attribute.",t),e}function d(t){let e=document.getElementById(t);return e||console.error(`The frame '${t}' does not exist!`),e}function m(){return document.getElementById("turbo-reflex-token").getAttribute("content")}function b(t){let e=document.createElement("a");return e.href=t,new URL(e)}function g(t){let e=Array.from(t.attributes).reduce((n,r)=>(r.name.includes("data-turbo-reflex")||(n[r.name]=r.value),n),{});return e.tagName=t.tagName,e.value=t.value,e}function i(t){let e=t.target.closest("[data-turbo-reflex]");if(!e||!f(t.type,t.target.tagName))return;t.preventDefault(),t.stopPropagation();let n=l(e);if(!n)return;let r=d(n);if(!r)return;let s=r.dataset.turboReflexFrameSrc;if(!s)return;let c={token:m(),name:e.dataset.turboReflex,frame:n,element:g(e)},u=b(s);u.searchParams.set("turbo_reflex",JSON.stringify(c)),r.src=u.toString()}function o(t,e){a[t]=e,document.removeEventListener(t,i,!0),document.addEventListener(t,i,!0)}o("change",["input","select","textarea"]);o("submit",["form"]);o("click",["*"]);var h={registerEvent:o,registeredEvents:a};export{h as default};
//# sourceMappingURL=turbo_reflex.js.map
