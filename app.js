const tools=[
{id:"compress",icon:"🖼️",name:"ضغط الصور",desc:"قلل حجم الصور بسهولة",make:compressUI},
{id:"qr",icon:"▦",name:"إنشاء QR Code",desc:"أنشئ رمز QR لأي رابط أو نص",make:qrUI},
{id:"words",icon:"📝",name:"عداد الكلمات",desc:"احسب الكلمات والأحرف",make:wordsUI},
{id:"units",icon:"↔",name:"تحويل الوحدات",desc:"تحويل الأطوال والأوزان",make:unitsUI},
{id:"calc",icon:"🧮",name:"الحاسبة",desc:"حسابات سريعة وبسيطة",make:calcUI},
{id:"images",icon:"✦",name:"أدوات الصور",desc:"أدوات صور إضافية",make:imagesUI},
{id:"ai",icon:"AI",name:"أدوات الذكاء الاصطناعي",desc:"أدوات AI مفيدة وسريعة",make:aiUI},
{id:"more",icon:"⊞",name:"المزيد من الأدوات",desc:"أدوات جديدة قريبًا",make:moreUI}
];

const grid=document.getElementById("grid"), search=document.getElementById("search"), empty=document.getElementById("empty"), panel=document.getElementById("tool-panel"), content=document.getElementById("tool-content");
function render(list=tools){grid.innerHTML=list.map(t=>`<article class="tool" data-id="${t.id}"><div class="icon">${t.icon}</div><h3>${t.name}</h3><p>${t.desc}</p><div class="arrow">←</div></article>`).join("");empty.hidden=!!list.length;document.querySelectorAll(".tool").forEach(x=>x.onclick=()=>openTool(x.dataset.id))}
render();
search.oninput=()=>{const q=search.value.trim().toLowerCase();render(tools.filter(t=>(t.name+" "+t.desc).toLowerCase().includes(q)))};
function openTool(id){const t=tools.find(x=>x.id===id);panel.hidden=false;content.innerHTML=`<div class="tool-box"><p class="eyebrow">MODEGLI TOOLS</p>${t.make()}</div>`;window.scrollTo(0,0);if(id==="qr")loadQR();if(id==="compress")setupCompress();if(id==="words")setupWords();if(id==="units")setupUnits();if(id==="calc")setupCalc()}
document.getElementById("close-tool").onclick=()=>panel.hidden=true;
const menu=document.querySelector(".menu");
menu.onclick=()=>document.querySelector("nav").classList.toggle("open");
document.querySelectorAll("nav a").forEach(a=>a.onclick=()=>document.querySelector("nav").classList.remove("open"));
function compressUI(){return `<h2>ضغط الصور</h2><p>اختر صورة من جهازك ثم اضغط لتصغير حجمها.</p><input id="imgFile" type="file" accept="image/*"><button class="btn" id="compressBtn">ضغط الصورة</button><div id="compressResult" class="result"></div>`}
function setupCompress(){document.getElementById("compressBtn").onclick=()=>{const f=document.getElementById("imgFile").files[0],r=document.getElementById("compressResult");if(!f){r.textContent="اختر صورة أولًا.";return}const reader=new FileReader();reader.onload=e=>{const img=new Image();img.onload=()=>{const c=document.createElement("canvas"),max=1800,s=Math.min(1,max/Math.max(img.width,img.height));c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);c.getContext("2d").drawImage(img,0,0,c.width,c.height);c.toBlob(b=>{const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="modegli-compressed.jpg";a.textContent="تحميل الصورة المضغوطة";a.className="btn";r.innerHTML=`تم الضغط: ${(f.size/1024).toFixed(1)} KB → ${(b.size/1024).toFixed(1)} KB<br>`;r.appendChild(a)}, "image/jpeg", .75)};img.src=e.target.result};reader.readAsDataURL(f)}}
function qrUI(){return `<h2>إنشاء QR Code</h2><input id="qrText" placeholder="اكتب رابطًا أو نصًا"><button class="btn" id="qrBtn">إنشاء QR</button><div id="qrResult" class="result"></div>`}
function loadQR(){if(window.QRCode)return;const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";document.head.appendChild(s)}
document.addEventListener("click",e=>{if(e.target.id==="qrBtn"){const r=document.getElementById("qrResult");r.innerHTML="";if(!document.getElementById("qrText").value){r.textContent="اكتب نصًا أو رابطًا أولًا.";return}if(window.QRCode)new QRCode(r,{text:document.getElementById("qrText").value,width:220,height:220});else r.textContent="جارٍ تجهيز مولد QR، حاول مرة أخرى."}});
function wordsUI(){return `<h2>عداد الكلمات</h2><textarea id="wordsText" rows="10" placeholder="اكتب النص هنا..."></textarea><div id="wordResult" class="result">الكلمات: 0 | الأحرف: 0</div>`}
function setupWords(){const x=document.getElementById("wordsText"),r=document.getElementById("wordResult");x.oninput=()=>{const text=x.value.trim();r.textContent=`الكلمات: ${text?text.split(/\\s+/).length:0} | الأحرف: ${x.value.length}`}}
function unitsUI(){return `<h2>تحويل الوحدات</h2><input id="unitVal" type="number" placeholder="القيمة"><select id="unitFrom"><option value="m">متر</option><option value="km">كيلومتر</option><option value="cm">سنتيمتر</option></select><select id="unitTo"><option value="m">متر</option><option value="km">كيلومتر</option><option value="cm">سنتيمتر</option></select><button class="btn" id="unitBtn">تحويل</button><div id="unitResult" class="result"></div>`}
function setupUnits(){document.getElementById("unitBtn").onclick=()=>{let v=Number(document.getElementById("unitVal").value);let f=document.getElementById("unitFrom").value,t=document.getElementById("unitTo").value;if(!Number.isFinite(v)){document.getElementById("unitResult").textContent="أدخل قيمة صحيحة.";return}const m={m:1,km:1000,cm:.01};document.getElementById("unitResult").textContent=v*m[f]/m[t]}}
function calcUI(){return `<h2>الحاسبة</h2><input id="calcInput" placeholder="مثال: (25+5)*2"><button class="btn" id="calcBtn">احسب</button><div id="calcResult" class="result"></div>`}
function setupCalc(){document.getElementById("calcBtn").onclick=()=>{const x=document.getElementById("calcInput").value.trim(),r=document.getElementById("calcResult");if(!/^[0-9+*/().%\s-]+$/.test(x)){r.textContent="استخدم أرقامًا وعلامات العمليات فقط.";return}try{r.textContent=Function('"use strict";return ('+x+')')()}catch{r.textContent="صيغة غير صحيحة."}}}
function imagesUI(){return `<h2>أدوات الصور</h2><p>سنضيف هنا لاحقًا تغيير الحجم، تحويل الصيغ، قص الصور وغيرها.</p>`}
function aiUI(){return `<h2>أدوات الذكاء الاصطناعي</h2><p>قسم مهيأ لإضافة أدوات AI عند ربط API آمن في مرحلة لاحقة.</p>`}
function moreUI(){return `<h2>المزيد قريبًا</h2><p>سيتم إضافة أدوات جديدة حسب احتياجات المستخدمين.</p>`}
if("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(()=>{});
