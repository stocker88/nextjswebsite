exports.id=866,exports.ids=[866],exports.modules={757:(e,t,i)=>{"use strict";i.d(t,{Z:()=>r});var s=i(997);let r=({children:e})=>s.jsx("div",{className:"container mx-auto px-5",children:e})},5002:(e,t,i)=>{"use strict";i.d(t,{Z:()=>c});var s=i(997),r=i(9003),a=i.n(r),o=i(3379),l=i.n(o),n=i(9951),d=i.n(n);let c=({title:e,src:t,slug:i})=>{let r=s.jsx("center",{children:s.jsx(d(),{src:t,alt:`Cover Image for ${e}`,className:a()("shadow-sm w-full",{"hover:shadow-lg transition-shadow duration-200":i}),width:1300,height:630,style:{maxWidth:"1000px",borderRadius:"10px 10px 10px 10px"},unoptimized:!0})});return s.jsx("div",{className:"sm:mx-0",children:i?s.jsx(l(),{as:`/posts/${i}`,href:"/posts/[slug]","aria-label":e,children:r}):r})}},8465:(e,t,i)=>{"use strict";var s=i(997);i(6689);var r=i(580),a=i.n(r),o=i(9003),l=i.n(o);let n={tag:a().elementType,color:a().string,size:a().string,loading:a().bool,wide:a().bool,wideMobile:a().bool,disabled:a().bool},d=({className:e,tag:t,color:i,size:r,loading:a,wide:o,wideMobile:n,disabled:d,...c})=>{let p=l()("button",i&&`button-${i}`,r&&`button-${r}`,a&&"is-loading",o&&"button-block",n&&"button-wide-mobile",e);return s.jsx(t,{...c,className:p,disabled:d})};d.propTypes=n,d.defaultProps={tag:"button",color:"",size:"",loading:!1,wide:!1,wideMobile:!1,disabled:!1}},268:(e,t,i)=>{"use strict";i(997),i(6689),i(9003)},2275:(e,t,i)=>{"use strict";i.d(t,{Z:()=>d});var s=i(997),r=i(6689),a=i(580),o=i.n(a);let l={src:o().oneOfType([o().object,o().string]).isRequired,width:o().number,height:o().number,alt:o().string},n=({className:e,src:t,width:i,height:a,alt:o,...l})=>{let[n,d]=(0,r.useState)(!1),c=(0,r.useRef)(null);(0,r.useEffect)(()=>{h(c.current)},[]);let p=(e,t)=>`data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${e} ${t}"%3E%3C/svg%3E`,h=e=>{let t=document.createElement("img");n||(e.style.display="none",e.before(t),t.src=p(e.getAttribute("width")||0,e.getAttribute("height")||0),t.width=e.getAttribute("width"),t.height=e.getAttribute("height"),t.style.opacity="0",e.className&&t.classList.add(e.className),t.remove(),e.style.display="")};return s.jsx("img",{...l,ref:c,className:e,src:t,width:i,height:a,alt:o,onLoad:function(){d(!0)}})};n.propTypes=l,n.defaultProps={src:void 0,width:void 0,height:void 0,alt:void 0};let d=n},2887:(e,t,i)=>{"use strict";i.d(t,{Z:()=>m});var s=i(997);i(6689);var r=i(9003),a=i.n(r),o=i(2275),l=i(3599),n=i(1125),d=i.n(n);i(6455);var c=i(5131),p=i.n(c);a()("hero-inner section-inner");let h=e=>{p().event({category:"StoreRedirect",action:"storeClick",label:"AAPL"})},x=e=>{p().event({category:"StoreRedirect",action:"storeClick",label:"Android"})},m=({...e})=>l.isMobile?(0,s.jsxs)("section",{...e,children:[s.jsx("br",{}),s.jsx("a",{href:"https://apps.apple.com/app/stocker/id1565527320?platform=iphone",target:"_blank",onClick:h,children:s.jsx(o.Z,{src:"/assets/images/appledownloadlogo.webp",alt:"hellostocker ai financial advisor virtual trading app hot stocks to buy now apple store logo",style:{width:151,height:44.7966}})}),s.jsx("div",{style:{paddingTop:10}}),s.jsx("a",{href:"https://play.google.com/store/apps/details?id=com.newcompany.stocker",target:"_blank",onClick:x,children:s.jsx(o.Z,{src:"/assets/images/googledownloadlogo.webp",alt:"hellostocker ai financial advisor virtual trading app hot stocks to buy now play store logo",style:{width:150,height:44.5}})}),s.jsx("br",{}),s.jsx("br",{})]}):(0,s.jsxs)("section",{...e,children:[s.jsx(d(),{children:s.jsx(o.Z,{src:"/assets/images/qrcode.webp",style:{width:140},alt:"hellostocker ai financial advisor virtual trading app hot qr code install logo stocks to buy now"})}),s.jsx("div",{style:{paddingTop:10}}),s.jsx(o.Z,{src:"/assets/images/appledownloadlogo.webp",alt:"hellostocker ai financial advisor virtual trading app hot stocks to buy now apple store logo",style:{width:131}}),s.jsx("div",{style:{paddingTop:10}}),s.jsx(o.Z,{src:"/assets/images/googledownloadlogo.webp",alt:"hellostocker ai financial advisor virtual trading app hot stocks to buy now play store logo",style:{width:130}}),s.jsx("br",{}),s.jsx("br",{})]})},3708:(e,t,i)=>{"use strict";i.a(e,async(e,s)=>{try{i.d(t,{Z:()=>h});var r=i(997),a=i(6689),o=i(1492),l=i(3745),n=i(9500),d=i(2887),c=e([o,l,n]);[o,l,n]=c.then?(await c)():c;let p={apiKey:"AIzaSyCa9vdoGvXZqMLKg9jZlK0TDsFi23V2qzU",authDomain:"stocker-fcda2.firebaseapp.com",projectId:"stocker-fcda2",storageBucket:"stocker-fcda2.appspot.com",messagingSenderId:"269261832880",appId:"1:269261832880:web:4b6affd899a01f5f0cf175",measurementId:"G-WXHHGB6FSV"};if((0,l.initializeApp)(p),p?.projectId){let e=(0,l.initializeApp)(p);e.name,(0,o.getFirestore)()}let h=function(){let[e,t]=(0,a.useState)(""),[i,s]=(0,a.useState)(""),[l,n]=(0,a.useState)(!1),c=(0,o.getFirestore)();return r.jsx("center",{children:(0,r.jsxs)("div",{style:{background:"Linear-gradient(to right, #414345. #232526)",display:"fixed"},children:[(0,r.jsxs)("form",{onSubmit:i=>{i.preventDefault(),e&&(console.log(e),(0,o.setDoc)((0,o.doc)(c,"contactList",e),{email:e,time:(0,o.serverTimestamp)()}),n(!0),t(""))},style:{padding:"10px"},children:[r.jsx("br",{}),r.jsx("input",{type:"email",required:!0,placeholder:"Enter your email here...",onChange:e=>{t(e.target.value)},value:e,style:{padding:"19px",textAlign:"center",borderRadius:"30px 0 0 30px",width:"47vw",fontSize:"min(18px,max(14px,2vw))",maxWidth:"315px"}}),(0,r.jsxs)("button",{type:"submit",style:{paddingTop:"3px",paddingBottom:"3px",paddingRight:"3px",color:"white",width:"32vw",textAlign:"right",fontSize:"min(19px,max(15px,2vw))",borderRadius:"0 30px 30px 0",background:"white",maxWidth:"225px"},children:["  ",r.jsx("div",{style:{paddingTop:"16px",paddingBottom:"16px",color:"black",width:"31vw",textAlign:"center",fontSize:"min(18px,max(14px,2vw))",borderRadius:"30px 30px 30px 30px",background:"#00f75f",maxWidth:"220px"},children:"Show me how→"})," "]})]}),l&&(0,r.jsxs)("center",{children:[" ",(0,r.jsxs)("h1",{className:"text-3xl md:text-4xl font-bold tracking-tighter leading-tight",style:{color:"white",fontFamily:"arial",lineHeight:1.3,textShadow:"4px 4px 4px rgba(0, 0, 0, 0)",padding:"2rem"},children:["Thank you! ",r.jsx("br",{}),"Test it Now We Give You Virtual Money"]}),"    "]}),l&&r.jsx(d.Z,{})]})})};s()}catch(e){s(e)}})},5241:(e,t,i)=>{"use strict";i.d(t,{Z:()=>a});var s=i(997),r=i(6689);let a=()=>{let[e,t]=(0,r.useState)(["Opportunities in the stock market are like sunrises; if you wait too long, you'll miss them. - Warren Buffett","If you don't find a way to make money while you sleep, you will work until you die. - Warren Buffett","Use your money to make more money. - Robert Kiyosaki","Risk comes from not knowing what you're doing, always double check with an advisor. - Warren Buffett","The stock market is a device for making the money work. - Warren Buffett","Price is what you pay. Value is what you get. - Warren Buffett","Your net worth is determined by your network – the people you learn from and grow with. - Warren Buffett","A well-diversified portfolio is the shield that guards your financial future. - Benjamin Graham","The stock market doesn't discriminate; it's open to anyone willing to learn and take action. - Warren Buffett","Success in investing is built on a foundation of sound research and thoughtful decisions. - Warren Buffett","The market is a giant discount machine. When everything goes on sale, people run out of the store. – Mark Cuban"]),[i,a]=(0,r.useState)(0);return s.jsx("div",{children:(0,s.jsxs)("center",{children:[s.jsx("h2",{className:"text-4xl md:text-6xl font-bold tracking-tighter leading-tight md:pr-8",style:{maxWidth:"900px",color:"white",textShadow:"2px 2px 2px rgba(0, 0, 0, 0)"},children:e[i]}),s.jsx("br",{}),(0,s.jsxs)("button",{onClick:()=>{let t=Math.floor(Math.random()*e.length);a(t%e.length)},style:{},children:["  ",s.jsx("div",{style:{padding:"0.8rem",color:"black",width:"31vw",textAlign:"center",fontSize:"min(19px,max(15px,2vw))",borderRadius:"30px 30px 30px 30px",background:"#00f75f",maxWidth:"280px"},children:"Show me another quote"})]})]})})}},6129:(e,t,i)=>{"use strict";i.d(t,{Z:()=>r});var s=i(997);let r=()=>s.jsx("section",{className:"flex-col md:flex-row flex items-center md:justify-between mt-16 mb-16 md:mb-12",children:s.jsx("h2",{className:"text-4xl md:text-7xl font-bold tracking-tighter leading-tight md:pr-8",style:{color:"white",textShadow:"2px 2px 2px rgba(0, 0, 0, 0)"},children:"Install HelloStocker AI Now"})})},8920:(e,t,i)=>{"use strict";i.a(e,async(e,s)=>{try{i.d(t,{Z:()=>d});var r=i(997),a=i(2874),o=i(8250),l=i(781),n=e([o]);o=(n.then?(await n)():n)[0];let d=({preview:e,children:t})=>(0,r.jsxs)(r.Fragment,{children:[r.jsx(a.Z,{}),r.jsx("div",{className:"min-h-screen",children:r.jsx("main",{children:t})}),r.jsx(o.Z,{style:{background:"linear-gradient( #1387FF, #3700B3)"}}),r.jsx(l.Z,{style:{background:"linear-gradient(#3700B3, #1387FF)"}})]});s()}catch(e){s(e)}})},781:(e,t,i)=>{"use strict";i.d(t,{Z:()=>x});var s=i(997);i(6689);var r=i(580),a=i.n(r),o=i(9003),l=i.n(o);i(2275);var n=i(3379),d=i.n(n),c=i(757);let p={topOuterDivider:a().bool,topDivider:a().bool},h=({...e})=>{let t=l()();return s.jsx("footer",{...e,className:t,children:s.jsx(c.Z,{children:s.jsx("div",{className:"container",children:s.jsx("div",{className:l()("site-footer-inner","has-top-divider"),children:(0,s.jsxs)("div",{className:"footer-bottom space-between text-xxs invert-order-desktop",children:[s.jsx("nav",{...e,className:t}),(0,s.jsxs)("div",{className:"footer-copyright",style:{color:"white",fontFamily:"arial"},children:[s.jsx(d(),{href:"/posts/privacypolicy",style:{color:"white",fontFamily:"arial"},children:" Privacy Policy "}),s.jsx("br",{}),s.jsx("br",{}),s.jsx("a",{href:"mailto:support@hellostocker.com",style:{color:"white",fontFamily:"arial"},children:" Contact Support Team "}),s.jsx("br",{}),s.jsx("br",{}),"Made by HelloStocker, for you"]}),s.jsx("br",{}),s.jsx("br",{}),s.jsx("br",{})]})})})})})};h.propTypes=p,h.defaultProps={topOuterDivider:!1,topDivider:!1};let x=h},2874:(e,t,i)=>{"use strict";i.d(t,{Z:()=>o});var s=i(997),r=i(3620),a=i.n(r);let o=()=>(0,s.jsxs)(a(),{children:[s.jsx("link",{rel:"apple-touch-icon",sizes:"180x180",href:"/favicon/apple-touch-icon.png"}),s.jsx("link",{rel:"icon",type:"image/png",sizes:"32x32",href:"/favicon/favicon-32x32.png"}),s.jsx("link",{rel:"icon",type:"image/png",sizes:"16x16",href:"/favicon/favicon-16x16.png"}),s.jsx("link",{rel:"manifest",href:"/favicon/site.webmanifest"}),s.jsx("link",{rel:"mask-icon",href:"/favicon/safari-pinned-tab.svg",color:"#000000"}),s.jsx("link",{rel:"shortcut icon",href:"/favicon/favicon.ico"}),s.jsx("meta",{name:"msapplication-TileColor",content:"#000000"}),s.jsx("meta",{name:"msapplication-config",content:"/favicon/browserconfig.xml"}),s.jsx("meta",{name:"theme-color",content:"#000"}),s.jsx("link",{rel:"alternate",type:"application/rss+xml",href:"/feed.xml"}),s.jsx("meta",{name:"description",content:"Stocker AI App is an Investing Advisory App to design strategies and practice with virtual trading! Learn how to make money and earn passive income with Stocker Ai App"})]})},9632:(e,t,i)=>{"use strict";i.d(t,{Z:()=>n});var s=i(997),r=i(5002),a=i(3379),o=i.n(a);let l=({title:e,coverImage:t,date:i,excerpt:a,author:l,slug:n})=>(0,s.jsxs)("div",{children:[s.jsx("div",{className:"mb-5",children:s.jsx(r.Z,{slug:n,title:e,src:t})}),s.jsx("h3",{className:"text-3xl mb-3 leading-snug excerpt_snug",style:{color:"white",textShadow:"2px 2px 2px rgba(0, 0, 0, 0)"},children:s.jsx(o(),{as:`/posts/${n}`,href:"/posts/[slug]",className:"hover:underline",children:e})}),s.jsx("div",{className:"text-lg mb-4",style:{color:"grey"}}),s.jsx("p",{className:"text-lg leading-relaxed mb-4",style:{color:"lightgrey"},children:a})]}),n=({posts:e})=>(0,s.jsxs)("section",{children:[s.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 md:gap-x-16 lg:gap-x-32 gap-y-20 md:gap-y-32 mb-32",children:e.map(e=>s.jsx(l,{title:e.title,coverImage:e.coverImage,date:e.date,author:e.author,slug:e.slug,excerpt:e.excerpt},e.slug))}),s.jsx("br",{}),s.jsx("br",{})]})},9011:(e,t,i)=>{"use strict";var s=i(997);i(6689);var r=i(9003),a=i.n(r),o=i(5483);i(5964);var l=i(2275);i(8465),i(268),i(8872),i(1125),i(6455);var n=i(3379),d=i.n(n);let c={...o.nm.types},p={...o.nm.defaults};a()("hero-inner section-inner");let h=({className:e,topOuterDivider:t,bottomOuterDivider:i,topDivider:r,bottomDivider:o,hasBgColor:n,invertColor:c,invertMobile:p,invertDesktop:h,alignTop:x,imageFill:m,...g})=>{let u=a()("features-split section",t&&"has-top-divider",i&&"has-bottom-divider",n&&"has-bg-color",c&&"invert-color",e);return a()("features-split-inner section-inner",r&&"has-top-divider",o&&"has-bottom-divider"),a()("split-wrap",p&&"invert-mobile",h&&"invert-desktop",x&&"align-top"),s.jsx("section",{...g,className:u,id:"blog",children:s.jsx("div",{className:"container",children:s.jsx("center",{children:s.jsx("div",{className:"split-item",children:s.jsx(d(),{href:"attribution",style:{cursor:"pointer"},children:s.jsx(l.Z,{src:"assets/images/attribution.png",alt:"hellostocker app stocks to buy ai stocks to watch market financial advisor economic tools investing virtual trading",style:{width:250,borderRadius:5},resizeMode:"cover"})})})})})})};h.propTypes=c,h.defaultProps=p},8250:(e,t,i)=>{"use strict";i.a(e,async(e,s)=>{try{i.d(t,{Z:()=>u});var r=i(997);i(6689);var a=i(9003),o=i.n(a),l=i(5483);i(5964);var n=i(2275);i(8465),i(268);var d=i(757);i(8872),i(1125),i(6455);var c=i(2887);i(3599);var p=i(3708);i(9011),i(6129);var h=e([p]);p=(h.then?(await h)():h)[0];let x={...l.nm.types},m={...l.nm.defaults};o()("hero-inner section-inner");let g=({...e})=>(o()("features-split section","has-top-divider","has-bottom-divider","has-bg-color","invert-color"),o()("features-split-inner section-inner","has-top-divider","has-bottom-divider"),o()("split-wrap","invert-mobile","invert-desktop"),r.jsx("section",{...e,className:"flex-col md:flex-row flex items-center md:justify-between ",id:"MeetingButton",children:r.jsx("div",{style:{width:"100%"},children:r.jsx("center",{children:r.jsx("div",{className:"container-sm has-animations",style:{zIndex:10},children:(0,r.jsxs)("div",{className:"hero-content",children:[r.jsx(d.Z,{children:(0,r.jsxs)("center",{children:[(0,r.jsxs)("div",{className:"container-sm reveal-from-bottom",children:[r.jsx("br",{}),r.jsx("br",{}),r.jsx("br",{}),r.jsx("br",{}),r.jsx("h2",{className:"text-5xl md:text-7xl font-bold tracking-tighter leading-tight md:pr-8",style:{color:"white",textShadow:"2px 2px 2px rgba(1, 74, 173, 0.6)"},children:"Unlock the Power of Big Data: Start Now"})]}),r.jsx("br",{}),r.jsx("br",{}),r.jsx("br",{}),r.jsx("br",{}),r.jsx("h2",{style:{color:"white",fontWeight:600,fontFamily:"arial",fontSize:"min(18px,max(16px,3vw))",lineHeight:1.3,textShadow:"4px 4px 4px rgba(1, 74, 173, 0.6)",maxWidth:"700px"},children:"HelloStocker helps you find stocks before they blow up. Save time, save money and receive AI recommendations adapted to your preferences."}),r.jsx("br",{})]})}),r.jsx(p.Z,{}),r.jsx("br",{}),r.jsx("br",{}),r.jsx("center",{children:r.jsx(c.Z,{})}),r.jsx(d.Z,{children:(0,r.jsxs)("center",{children:[r.jsx(n.Z,{src:"/assets/images/usersRating.webp",alt:"AI Financial Advisor & Virtual Investing App sends you hot stocks to watch and buy now: find the next Nvidia, Tesla, Roblox before they skyrocket",style:{width:240,height:60}}),r.jsx("div",{style:{color:"lightGrey",fontSize:"min(16px,max(15px,1.5vw))",fontFamily:"arial",lineHeight:1,maxWidth:"600px",textShadow:"5px 5px 5px rgba(0, 0, 0, 0)"},className:"reveal-from-bottom","data-reveal-delay":"150",children:"Join +12,800 investors using HelloStocker to receive trading ideas they like"}),r.jsx("div",{style:{paddingTop:20}}),r.jsx("br",{}),r.jsx(n.Z,{src:"/assets/images/chatgptgooglecloud.webp",alt:"Google Cloud Platform Security and ChatGPT Open AI partners logos",style:{width:195.9375,height:83.98}}),r.jsx("br",{}),r.jsx("br",{})]})})]})})})})}));g.propTypes=x,g.defaultProps=m;let u=g;s()}catch(e){s(e)}})},8872:(e,t,i)=>{"use strict";var s=i(997);i(6689);var r=i(580),a=i.n(r),o=i(9003),l=i.n(o);let n={data:a().shape({title:a().string,paragraph:a().string}).isRequired,children:a().node,tag:a().oneOf(["h1","h2","h3"])},d=({className:e,data:t,children:i,tag:r,...a})=>{let o=l()(e);return s.jsx(s.Fragment,{children:(t.title||t.paragraph)&&s.jsx("div",{...a,className:o,children:(0,s.jsxs)("div",{className:"container",children:[i,t.title&&s.jsx(r,{className:l()("mt-0",t.paragraph?"mb-16":"mb-0","text-color-dark"),style:{fontSize:"min(32px,max(25px,2.5vw))",fontWeight:"normal"},children:t.title}),t.paragraph&&s.jsx("p",{className:"m-0",children:t.paragraph})]})})})};d.propTypes=n,d.defaultProps={children:null,tag:"h2"}},5964:(e,t,i)=>{"use strict";var s=i(997);i(6689);var r=i(580),a=i.n(r),o=i(9003),l=i.n(o);let n={data:a().shape({title:a().string,paragraph:a().string}).isRequired,children:a().node,tag:a().oneOf(["h1"])},d=({className:e,data:t,children:i,tag:r,...a})=>{let o=l()(e);return s.jsx(s.Fragment,{children:(t.title||t.paragraph)&&s.jsx("div",{...a,className:o,children:s.jsx("div",{className:"container",children:s.jsx("div",{className:"reveal-from-bottom","data-reveal-delay":"200",children:s.jsx("p",{style:{color:"white",fontSize:"min(32px,max(25px,2.5vw))",fontFamily:"arial",fontWeight:600,lineHeight:1.3,textShadow:"2px 2px 2px rgba(1, 74, 173, 0.6)"},children:t.title})})})})})};d.propTypes=n,d.defaultProps={children:null,tag:"h2"}},2163:(e,t,i)=>{"use strict";i.d(t,{Bd:()=>c,zQ:()=>d});var s=i(7147),r=i.n(s),a=i(1017),o=i(8076),l=i.n(o);let n=(0,a.join)(process.cwd(),"_posts");function d(e,t=[]){let i=e.replace(/\.md$/,""),s=(0,a.join)(n,`${i}.md`),o=r().readFileSync(s,"utf8"),{data:d,content:c}=l()(o),p={};return t.forEach(e=>{"slug"===e&&(p[e]=i),"content"===e&&(p[e]=c),void 0!==d[e]&&(p[e]=d[e])}),p}function c(e=[]){let t=r().readdirSync(n),i=t.map(t=>d(t,e)).sort((e,t)=>e.date>t.date?-1:1);return i}},2685:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>r});var s=i(997);function r({Component:e,pageProps:t}){return s.jsx(e,{...t})}i(196)},5635:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>a});var s=i(997),r=i(439);function a(){return(0,s.jsxs)(r.Html,{lang:"en",className:"dark",children:[s.jsx(r.Head,{}),(0,s.jsxs)("body",{className:"dark:bg-gray-800",children:[s.jsx(r.Main,{}),s.jsx(r.NextScript,{})]})]})}},5483:(e,t,i)=>{"use strict";i.d(t,{js:()=>o,ls:()=>n,nm:()=>l});var s=i(580),r=i.n(s);let a={types:{topOuterDivider:r().bool,bottomOuterDivider:r().bool,topDivider:r().bool,bottomDivider:r().bool,hasBgColor:r().bool,invertColor:r().bool},defaults:{topOuterDivider:!1,bottomOuterDivider:!1,topDivider:!1,bottomDivider:!1,hasBgColor:!1,invertColor:!1}},o={types:{...a.types},defaults:{...a.defaults}},l={types:{...a.types,invertMobile:r().bool,invertDesktop:r().bool,alignTop:r().bool,imageFill:r().bool},defaults:{...a.defaults,invertMobile:!1,invertDesktop:!1,alignTop:!1,imageFill:!1}},n={types:{...a.types,pushLeft:r().bool},defaults:{...a.defaults,pushLeft:!1}}},196:()=>{}};