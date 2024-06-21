import{l as jt,a as zt,s as Tt,b as _t}from"../chunks/i18n-svelte.efc0be1d.js";import{_ as kt}from"../chunks/preload-helper.a4192956.js";import{g as Et,s as Nt,c as Pt,u as qt,d as $t,e as Ft}from"../chunks/scheduler.4f32addc.js";import{S as Wt,i as Dt,d as Ht,t as It}from"../chunks/index.414132d4.js";const Bt=E=>({}),Rt={en:()=>kt(()=>import("../chunks/index.1884f94c.js"),[],import.meta.url),fr:()=>kt(()=>import("../chunks/index.fb6cb296.js"),[],import.meta.url)},Vt=(E,M)=>zt[E]={...zt[E],...M},Ut=async E=>(await Rt[E]()).default,Yt=async E=>{Vt(E,await Ut(E)),Gt(E)},Gt=E=>void(jt[E]=Bt());var Kt=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Jt(E){return E&&E.__esModule&&Object.prototype.hasOwnProperty.call(E,"default")?E.default:E}var xt={exports:{}};(function(E,M){(function(y,n){E.exports=n()})(Kt,function(){return function(y){function n(o){if(r[o])return r[o].exports;var t=r[o]={exports:{},id:o,loaded:!1};return y[o].call(t.exports,t,t.exports,n),t.loaded=!0,t.exports}var r={};return n.m=y,n.c=r,n.p="dist/",n(0)}([function(y,n,r){function o(f){return f&&f.__esModule?f:{default:f}}var t=Object.assign||function(f){for(var F=1;F<arguments.length;F++){var V=arguments[F];for(var G in V)Object.prototype.hasOwnProperty.call(V,G)&&(f[G]=V[G])}return f},C=r(1),$=(o(C),r(6)),l=o($),b=r(7),c=o(b),d=r(8),h=o(d),A=r(9),D=o(A),R=r(10),X=o(R),ct=r(11),Z=o(ct),tt=r(14),at=o(tt),H=[],J=!1,L={offset:120,delay:0,easing:"ease",duration:400,disable:!1,once:!1,startEvent:"DOMContentLoaded",throttleDelay:99,debounceDelay:50,disableMutationObserver:!1},I=function(){var f=arguments.length>0&&arguments[0]!==void 0&&arguments[0];if(f&&(J=!0),J)return H=(0,Z.default)(H,L),(0,X.default)(H,L.once),H},et=function(){H=(0,at.default)(),I()},u=function(){H.forEach(function(f,F){f.node.removeAttribute("data-aos"),f.node.removeAttribute("data-aos-easing"),f.node.removeAttribute("data-aos-duration"),f.node.removeAttribute("data-aos-delay")})},a=function(f){return f===!0||f==="mobile"&&D.default.mobile()||f==="phone"&&D.default.phone()||f==="tablet"&&D.default.tablet()||typeof f=="function"&&f()===!0},_=function(f){L=t(L,f),H=(0,at.default)();var F=document.all&&!window.atob;return a(L.disable)||F?u():(L.disableMutationObserver||h.default.isSupported()||(console.info(`
      aos: MutationObserver is not supported on this browser,
      code mutations observing has been disabled.
      You may have to call "refreshHard()" by yourself.
    `),L.disableMutationObserver=!0),document.querySelector("body").setAttribute("data-aos-easing",L.easing),document.querySelector("body").setAttribute("data-aos-duration",L.duration),document.querySelector("body").setAttribute("data-aos-delay",L.delay),L.startEvent==="DOMContentLoaded"&&["complete","interactive"].indexOf(document.readyState)>-1?I(!0):L.startEvent==="load"?window.addEventListener(L.startEvent,function(){I(!0)}):document.addEventListener(L.startEvent,function(){I(!0)}),window.addEventListener("resize",(0,c.default)(I,L.debounceDelay,!0)),window.addEventListener("orientationchange",(0,c.default)(I,L.debounceDelay,!0)),window.addEventListener("scroll",(0,l.default)(function(){(0,X.default)(H,L.once)},L.throttleDelay)),L.disableMutationObserver||h.default.ready("[data-aos]",et),H)};y.exports={init:_,refresh:I,refreshHard:et}},function(y,n){},,,,,function(y,n){(function(r){function o(a,_,f){function F(z){var j=k,U=g;return k=g=void 0,rt=z,x=a.apply(U,j)}function V(z){return rt=z,S=setTimeout(i,_),ot?F(z):x}function G(z){var j=z-q,U=z-rt,vt=_-j;return nt?et(vt,w-U):vt}function s(z){var j=z-q,U=z-rt;return q===void 0||j>=_||j<0||nt&&U>=w}function i(){var z=u();return s(z)?v(z):void(S=setTimeout(i,G(z)))}function v(z){return S=void 0,P&&k?F(z):(k=g=void 0,x)}function N(){S!==void 0&&clearTimeout(S),rt=0,k=q=g=S=void 0}function O(){return S===void 0?x:v(u())}function p(){var z=u(),j=s(z);if(k=arguments,g=this,q=z,j){if(S===void 0)return V(q);if(nt)return S=setTimeout(i,_),F(q)}return S===void 0&&(S=setTimeout(i,_)),x}var k,g,w,x,S,q,rt=0,ot=!1,nt=!1,P=!0;if(typeof a!="function")throw new TypeError(d);return _=b(_)||0,C(f)&&(ot=!!f.leading,nt="maxWait"in f,w=nt?I(b(f.maxWait)||0,_):w,P="trailing"in f?!!f.trailing:P),p.cancel=N,p.flush=O,p}function t(a,_,f){var F=!0,V=!0;if(typeof a!="function")throw new TypeError(d);return C(f)&&(F="leading"in f?!!f.leading:F,V="trailing"in f?!!f.trailing:V),o(a,_,{leading:F,maxWait:_,trailing:V})}function C(a){var _=typeof a>"u"?"undefined":c(a);return!!a&&(_=="object"||_=="function")}function $(a){return!!a&&(typeof a>"u"?"undefined":c(a))=="object"}function l(a){return(typeof a>"u"?"undefined":c(a))=="symbol"||$(a)&&L.call(a)==A}function b(a){if(typeof a=="number")return a;if(l(a))return h;if(C(a)){var _=typeof a.valueOf=="function"?a.valueOf():a;a=C(_)?_+"":_}if(typeof a!="string")return a===0?a:+a;a=a.replace(D,"");var f=X.test(a);return f||ct.test(a)?Z(a.slice(2),f?2:8):R.test(a)?h:+a}var c=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(a){return typeof a}:function(a){return a&&typeof Symbol=="function"&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},d="Expected a function",h=NaN,A="[object Symbol]",D=/^\s+|\s+$/g,R=/^[-+]0x[0-9a-f]+$/i,X=/^0b[01]+$/i,ct=/^0o[0-7]+$/i,Z=parseInt,tt=(typeof r>"u"?"undefined":c(r))=="object"&&r&&r.Object===Object&&r,at=(typeof self>"u"?"undefined":c(self))=="object"&&self&&self.Object===Object&&self,H=tt||at||Function("return this")(),J=Object.prototype,L=J.toString,I=Math.max,et=Math.min,u=function(){return H.Date.now()};y.exports=t}).call(n,function(){return this}())},function(y,n){(function(r){function o(u,a,_){function f(P){var z=p,j=k;return p=k=void 0,q=P,w=u.apply(j,z)}function F(P){return q=P,x=setTimeout(s,a),rt?f(P):w}function V(P){var z=P-S,j=P-q,U=a-z;return ot?I(U,g-j):U}function G(P){var z=P-S,j=P-q;return S===void 0||z>=a||z<0||ot&&j>=g}function s(){var P=et();return G(P)?i(P):void(x=setTimeout(s,V(P)))}function i(P){return x=void 0,nt&&p?f(P):(p=k=void 0,w)}function v(){x!==void 0&&clearTimeout(x),q=0,p=S=k=x=void 0}function N(){return x===void 0?w:i(et())}function O(){var P=et(),z=G(P);if(p=arguments,k=this,S=P,z){if(x===void 0)return F(S);if(ot)return x=setTimeout(s,a),f(S)}return x===void 0&&(x=setTimeout(s,a)),w}var p,k,g,w,x,S,q=0,rt=!1,ot=!1,nt=!0;if(typeof u!="function")throw new TypeError(c);return a=l(a)||0,t(_)&&(rt=!!_.leading,ot="maxWait"in _,g=ot?L(l(_.maxWait)||0,a):g,nt="trailing"in _?!!_.trailing:nt),O.cancel=v,O.flush=N,O}function t(u){var a=typeof u>"u"?"undefined":b(u);return!!u&&(a=="object"||a=="function")}function C(u){return!!u&&(typeof u>"u"?"undefined":b(u))=="object"}function $(u){return(typeof u>"u"?"undefined":b(u))=="symbol"||C(u)&&J.call(u)==h}function l(u){if(typeof u=="number")return u;if($(u))return d;if(t(u)){var a=typeof u.valueOf=="function"?u.valueOf():u;u=t(a)?a+"":a}if(typeof u!="string")return u===0?u:+u;u=u.replace(A,"");var _=R.test(u);return _||X.test(u)?ct(u.slice(2),_?2:8):D.test(u)?d:+u}var b=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(u){return typeof u}:function(u){return u&&typeof Symbol=="function"&&u.constructor===Symbol&&u!==Symbol.prototype?"symbol":typeof u},c="Expected a function",d=NaN,h="[object Symbol]",A=/^\s+|\s+$/g,D=/^[-+]0x[0-9a-f]+$/i,R=/^0b[01]+$/i,X=/^0o[0-7]+$/i,ct=parseInt,Z=(typeof r>"u"?"undefined":b(r))=="object"&&r&&r.Object===Object&&r,tt=(typeof self>"u"?"undefined":b(self))=="object"&&self&&self.Object===Object&&self,at=Z||tt||Function("return this")(),H=Object.prototype,J=H.toString,L=Math.max,I=Math.min,et=function(){return at.Date.now()};y.exports=o}).call(n,function(){return this}())},function(y,n){function r(b){var c=void 0,d=void 0;for(c=0;c<b.length;c+=1)if(d=b[c],d.dataset&&d.dataset.aos||d.children&&r(d.children))return!0;return!1}function o(){return window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver}function t(){return!!o()}function C(b,c){var d=window.document,h=o(),A=new h($);l=c,A.observe(d.documentElement,{childList:!0,subtree:!0,removedNodes:!0})}function $(b){b&&b.forEach(function(c){var d=Array.prototype.slice.call(c.addedNodes),h=Array.prototype.slice.call(c.removedNodes),A=d.concat(h);if(r(A))return l()})}Object.defineProperty(n,"__esModule",{value:!0});var l=function(){};n.default={isSupported:t,ready:C}},function(y,n){function r(d,h){if(!(d instanceof h))throw new TypeError("Cannot call a class as a function")}function o(){return navigator.userAgent||navigator.vendor||window.opera||""}Object.defineProperty(n,"__esModule",{value:!0});var t=function(){function d(h,A){for(var D=0;D<A.length;D++){var R=A[D];R.enumerable=R.enumerable||!1,R.configurable=!0,"value"in R&&(R.writable=!0),Object.defineProperty(h,R.key,R)}}return function(h,A,D){return A&&d(h.prototype,A),D&&d(h,D),h}}(),C=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,$=/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,l=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i,b=/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,c=function(){function d(){r(this,d)}return t(d,[{key:"phone",value:function(){var h=o();return!(!C.test(h)&&!$.test(h.substr(0,4)))}},{key:"mobile",value:function(){var h=o();return!(!l.test(h)&&!b.test(h.substr(0,4)))}},{key:"tablet",value:function(){return this.mobile()&&!this.phone()}}]),d}();n.default=new c},function(y,n){Object.defineProperty(n,"__esModule",{value:!0});var r=function(t,C,$){var l=t.node.getAttribute("data-aos-once");C>t.position?t.node.classList.add("aos-animate"):typeof l<"u"&&(l==="false"||!$&&l!=="true")&&t.node.classList.remove("aos-animate")},o=function(t,C){var $=window.pageYOffset,l=window.innerHeight;t.forEach(function(b,c){r(b,l+$,C)})};n.default=o},function(y,n,r){function o(l){return l&&l.__esModule?l:{default:l}}Object.defineProperty(n,"__esModule",{value:!0});var t=r(12),C=o(t),$=function(l,b){return l.forEach(function(c,d){c.node.classList.add("aos-init"),c.position=(0,C.default)(c.node,b.offset)}),l};n.default=$},function(y,n,r){function o(l){return l&&l.__esModule?l:{default:l}}Object.defineProperty(n,"__esModule",{value:!0});var t=r(13),C=o(t),$=function(l,b){var c=0,d=0,h=window.innerHeight,A={offset:l.getAttribute("data-aos-offset"),anchor:l.getAttribute("data-aos-anchor"),anchorPlacement:l.getAttribute("data-aos-anchor-placement")};switch(A.offset&&!isNaN(A.offset)&&(d=parseInt(A.offset)),A.anchor&&document.querySelectorAll(A.anchor)&&(l=document.querySelectorAll(A.anchor)[0]),c=(0,C.default)(l).top,A.anchorPlacement){case"top-bottom":break;case"center-bottom":c+=l.offsetHeight/2;break;case"bottom-bottom":c+=l.offsetHeight;break;case"top-center":c+=h/2;break;case"bottom-center":c+=h/2+l.offsetHeight;break;case"center-center":c+=h/2+l.offsetHeight/2;break;case"top-top":c+=h;break;case"bottom-top":c+=l.offsetHeight+h;break;case"center-top":c+=l.offsetHeight/2+h}return A.anchorPlacement||A.offset||isNaN(b)||(d=b),c+d};n.default=$},function(y,n){Object.defineProperty(n,"__esModule",{value:!0});var r=function(o){for(var t=0,C=0;o&&!isNaN(o.offsetLeft)&&!isNaN(o.offsetTop);)t+=o.offsetLeft-(o.tagName!="BODY"?o.scrollLeft:0),C+=o.offsetTop-(o.tagName!="BODY"?o.scrollTop:0),o=o.offsetParent;return{top:C,left:t}};n.default=r},function(y,n){Object.defineProperty(n,"__esModule",{value:!0});var r=function(o){return o=o||document.querySelectorAll("[data-aos]"),Array.prototype.map.call(o,function(t){return{node:t}})};n.default=r}])})})(xt);var Qt=xt.exports;const Xt=Jt(Qt);var Zt={exports:{}};(function(E){(function(M,y){var n=y(M,M.document,Date);M.lazySizes=n,E.exports&&(E.exports=n)})(typeof window<"u"?window:{},function(y,n,r){var o,t;if(function(){var s,i={lazyClass:"lazyload",loadedClass:"lazyloaded",loadingClass:"lazyloading",preloadClass:"lazypreload",errorClass:"lazyerror",autosizesClass:"lazyautosizes",fastLoadedClass:"ls-is-cached",iframeLoadMode:0,srcAttr:"data-src",srcsetAttr:"data-srcset",sizesAttr:"data-sizes",minSize:40,customMedia:{},init:!0,expFactor:1.5,hFac:.8,loadMode:2,loadHidden:!0,ricTimeout:0,throttleDelay:125};t=y.lazySizesConfig||y.lazysizesConfig||{};for(s in i)s in t||(t[s]=i[s])}(),!n||!n.getElementsByClassName)return{init:function(){},cfg:t,noSupport:!0};var C=n.documentElement,$=y.HTMLPictureElement,l="addEventListener",b="getAttribute",c=y[l].bind(y),d=y.setTimeout,h=y.requestAnimationFrame||d,A=y.requestIdleCallback,D=/^picture$/i,R=["load","error","lazyincluded","_lazyloaded"],X={},ct=Array.prototype.forEach,Z=function(s,i){return X[i]||(X[i]=new RegExp("(\\s|^)"+i+"(\\s|$)")),X[i].test(s[b]("class")||"")&&X[i]},tt=function(s,i){Z(s,i)||s.setAttribute("class",(s[b]("class")||"").trim()+" "+i)},at=function(s,i){var v;(v=Z(s,i))&&s.setAttribute("class",(s[b]("class")||"").replace(v," "))},H=function(s,i,v){var N=v?l:"removeEventListener";v&&H(s,i),R.forEach(function(O){s[N](O,i)})},J=function(s,i,v,N,O){var p=n.createEvent("Event");return v||(v={}),v.instance=o,p.initEvent(i,!N,!O),p.detail=v,s.dispatchEvent(p),p},L=function(s,i){var v;!$&&(v=y.picturefill||t.pf)?(i&&i.src&&!s[b]("srcset")&&s.setAttribute("srcset",i.src),v({reevaluate:!0,elements:[s]})):i&&i.src&&(s.src=i.src)},I=function(s,i){return(getComputedStyle(s,null)||{})[i]},et=function(s,i,v){for(v=v||s.offsetWidth;v<t.minSize&&i&&!s._lazysizesWidth;)v=i.offsetWidth,i=i.parentNode;return v},u=function(){var s,i,v=[],N=[],O=v,p=function(){var g=O;for(O=v.length?N:v,s=!0,i=!1;g.length;)g.shift()();s=!1},k=function(g,w){s&&!w?g.apply(this,arguments):(O.push(g),i||(i=!0,(n.hidden?d:h)(p)))};return k._lsFlush=p,k}(),a=function(s,i){return i?function(){u(s)}:function(){var v=this,N=arguments;u(function(){s.apply(v,N)})}},_=function(s){var i,v=0,N=t.throttleDelay,O=t.ricTimeout,p=function(){i=!1,v=r.now(),s()},k=A&&O>49?function(){A(p,{timeout:O}),O!==t.ricTimeout&&(O=t.ricTimeout)}:a(function(){d(p)},!0);return function(g){var w;(g=g===!0)&&(O=33),!i&&(i=!0,w=N-(r.now()-v),w<0&&(w=0),g||w<9?k():d(k,w))}},f=function(s){var i,v,N=99,O=function(){i=null,s()},p=function(){var k=r.now()-v;k<N?d(p,N-k):(A||O)(O)};return function(){v=r.now(),i||(i=d(p,N))}},F=function(){var s,i,v,N,O,p,k,g,w,x,S,q,rt=/^img$/i,ot=/^iframe$/i,nt="onscroll"in y&&!/(gle|ing)bot/.test(navigator.userAgent),P=0,z=0,j=0,U=-1,vt=function(e){j--,(!e||j<0||!e.target)&&(j=0)},bt=function(e){return q==null&&(q=I(n.body,"visibility")=="hidden"),q||!(I(e.parentNode,"visibility")=="hidden"&&I(e,"visibility")=="hidden")},Ct=function(e,m){var T,W=e,B=bt(e);for(g-=m,S+=m,w-=m,x+=m;B&&(W=W.offsetParent)&&W!=n.body&&W!=C;)B=(I(W,"opacity")||1)>0,B&&I(W,"overflow")!="visible"&&(T=W.getBoundingClientRect(),B=x>T.left&&w<T.right&&S>T.top-1&&g<T.bottom+1);return B},yt=function(){var e,m,T,W,B,Y,it,st,lt,ut,ft,dt,Q=o.elements;if((N=t.loadMode)&&j<8&&(e=Q.length)){for(m=0,U++;m<e;m++)if(!(!Q[m]||Q[m]._lazyRace)){if(!nt||o.prematureUnveil&&o.prematureUnveil(Q[m])){pt(Q[m]);continue}if((!(st=Q[m][b]("data-expand"))||!(Y=st*1))&&(Y=z),ut||(ut=!t.expand||t.expand<1?C.clientHeight>500&&C.clientWidth>500?500:370:t.expand,o._defEx=ut,ft=ut*t.expFactor,dt=t.hFac,q=null,z<ft&&j<1&&U>2&&N>2&&!n.hidden?(z=ft,U=0):N>1&&U>1&&j<6?z=ut:z=P),lt!==Y&&(p=innerWidth+Y*dt,k=innerHeight+Y,it=Y*-1,lt=Y),T=Q[m].getBoundingClientRect(),(S=T.bottom)>=it&&(g=T.top)<=k&&(x=T.right)>=it*dt&&(w=T.left)<=p&&(S||x||w||g)&&(t.loadHidden||bt(Q[m]))&&(i&&j<3&&!st&&(N<3||U<4)||Ct(Q[m],Y))){if(pt(Q[m]),B=!0,j>9)break}else!B&&i&&!W&&j<4&&U<4&&N>2&&(s[0]||t.preloadAfterLoad)&&(s[0]||!st&&(S||x||w||g||Q[m][b](t.sizesAttr)!="auto"))&&(W=s[0]||Q[m])}W&&!B&&pt(W)}},K=_(yt),gt=function(e){var m=e.target;if(m._lazyCache){delete m._lazyCache;return}vt(e),tt(m,t.loadedClass),at(m,t.loadingClass),H(m,ht),J(m,"lazyloaded")},St=a(gt),ht=function(e){St({target:e.target})},At=function(e,m){var T=e.getAttribute("data-load-mode")||t.iframeLoadMode;T==0?e.contentWindow.location.replace(m):T==1&&(e.src=m)},Ot=function(e){var m,T=e[b](t.srcsetAttr);(m=t.customMedia[e[b]("data-media")||e[b]("media")])&&e.setAttribute("media",m),T&&e.setAttribute("srcset",T)},Lt=a(function(e,m,T,W,B){var Y,it,st,lt,ut,ft;(ut=J(e,"lazybeforeunveil",m)).defaultPrevented||(W&&(T?tt(e,t.autosizesClass):e.setAttribute("sizes",W)),it=e[b](t.srcsetAttr),Y=e[b](t.srcAttr),B&&(st=e.parentNode,lt=st&&D.test(st.nodeName||"")),ft=m.firesLoad||"src"in e&&(it||Y||lt),ut={target:e},tt(e,t.loadingClass),ft&&(clearTimeout(v),v=d(vt,2500),H(e,ht,!0)),lt&&ct.call(st.getElementsByTagName("source"),Ot),it?e.setAttribute("srcset",it):Y&&!lt&&(ot.test(e.nodeName)?At(e,Y):e.src=Y),B&&(it||lt)&&L(e,{src:Y})),e._lazyRace&&delete e._lazyRace,at(e,t.lazyClass),u(function(){var dt=e.complete&&e.naturalWidth>1;(!ft||dt)&&(dt&&tt(e,t.fastLoadedClass),gt(ut),e._lazyCache=!0,d(function(){"_lazyCache"in e&&delete e._lazyCache},9)),e.loading=="lazy"&&j--},!0)}),pt=function(e){if(!e._lazyRace){var m,T=rt.test(e.nodeName),W=T&&(e[b](t.sizesAttr)||e[b]("sizes")),B=W=="auto";(B||!i)&&T&&(e[b]("src")||e.srcset)&&!e.complete&&!Z(e,t.errorClass)&&Z(e,t.lazyClass)||(m=J(e,"lazyunveilread").detail,B&&V.updateElem(e,!0,e.offsetWidth),e._lazyRace=!0,j++,Lt(e,m,B,W,T))}},Mt=f(function(){t.loadMode=3,K()}),wt=function(){t.loadMode==3&&(t.loadMode=2),Mt()},mt=function(){if(!i){if(r.now()-O<999){d(mt,999);return}i=!0,t.loadMode=3,K(),c("scroll",wt,!0)}};return{_:function(){O=r.now(),o.elements=n.getElementsByClassName(t.lazyClass),s=n.getElementsByClassName(t.lazyClass+" "+t.preloadClass),c("scroll",K,!0),c("resize",K,!0),c("pageshow",function(e){if(e.persisted){var m=n.querySelectorAll("."+t.loadingClass);m.length&&m.forEach&&h(function(){m.forEach(function(T){T.complete&&pt(T)})})}}),y.MutationObserver?new MutationObserver(K).observe(C,{childList:!0,subtree:!0,attributes:!0}):(C[l]("DOMNodeInserted",K,!0),C[l]("DOMAttrModified",K,!0),setInterval(K,999)),c("hashchange",K,!0),["focus","mouseover","click","load","transitionend","animationend"].forEach(function(e){n[l](e,K,!0)}),/d$|^c/.test(n.readyState)?mt():(c("load",mt),n[l]("DOMContentLoaded",K),d(mt,2e4)),o.elements.length?(yt(),u._lsFlush()):K()},checkElems:K,unveil:pt,_aLSL:wt}}(),V=function(){var s,i=a(function(p,k,g,w){var x,S,q;if(p._lazysizesWidth=w,w+="px",p.setAttribute("sizes",w),D.test(k.nodeName||""))for(x=k.getElementsByTagName("source"),S=0,q=x.length;S<q;S++)x[S].setAttribute("sizes",w);g.detail.dataAttr||L(p,g.detail)}),v=function(p,k,g){var w,x=p.parentNode;x&&(g=et(p,x,g),w=J(p,"lazybeforesizes",{width:g,dataAttr:!!k}),w.defaultPrevented||(g=w.detail.width,g&&g!==p._lazysizesWidth&&i(p,x,w,g)))},N=function(){var p,k=s.length;if(k)for(p=0;p<k;p++)v(s[p])},O=f(N);return{_:function(){s=n.getElementsByClassName(t.autosizesClass),c("resize",O)},checkElems:O,updateElem:v}}(),G=function(){!G.i&&n.getElementsByClassName&&(G.i=!0,V._(),F._())};return d(function(){t.init&&G()}),o={cfg:t,autoSizer:V,loader:F,init:G,uP:L,aC:tt,rC:at,hC:Z,fire:J,gW:et,rAF:u},o})})(Zt);const te=!1,ee=!0;async function ne(){await Yt(Et(_t)||"en"),Tt(Et(_t)||"en"),Xt.init();const E=await fetch("https://api.github.com/users/Olyno/repos?sort=created&direction=desc").then(M=>M.json()).then(M=>M.filter(y=>!y.name.includes("repro")));if(window.location.hash){const M=document.querySelector(window.location.hash);M&&M.scrollIntoView()}return{repositories:E}}const le=Object.freeze(Object.defineProperty({__proto__:null,load:ne,prerender:ee,ssr:te},Symbol.toStringTag,{value:"Module"}));function ae(E){let M;const y=E[1].default,n=Pt(y,E,E[0],null);return{c(){n&&n.c()},l(r){n&&n.l(r)},m(r,o){n&&n.m(r,o),M=!0},p(r,[o]){n&&n.p&&(!M||o&1)&&qt(n,y,r,r[0],M?Ft(y,r[0],o,null):$t(r[0]),null)},i(r){M||(Ht(n,r),M=!0)},o(r){It(n,r),M=!1},d(r){n&&n.d(r)}}}function re(E,M,y){let{$$slots:n={},$$scope:r}=M;return E.$$set=o=>{"$$scope"in o&&y(0,r=o.$$scope)},[r,n]}class ce extends Wt{constructor(M){super(),Dt(this,M,re,ae,Nt,{})}}export{ce as component,le as universal};
