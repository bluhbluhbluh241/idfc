const devMode = true;

try {for (i in customBtns) { customBtns[i].remove() }}catch(e){}
if (typeof localStorage["customTheme"] == 'undefined') {localStorage["customTheme"] = JSON.stringify({})}

const conif = {}
const metaData = {
    version: "v1.1",
}

let customBtns = []

let pageLoad = (c) =>{ if (typeof c !== 'function') return; let a = new MutationObserver((mutationsList) => { let b = 0; for (const mutation of mutationsList) { if (mutation.type === 'childList' && b == 0) { mutation.addedNodes.forEach((node) => { if (node.nodeType === Node.ELEMENT_NODE) { b = 1; a.disconnect(); c(); } }); } } }); a.observe(findC("main"),{childList: true,subtree: true}) }
const hexToHSL = (hex)=> { let r = 0, g = 0, b = 0; if (hex.length == 4) { r = "0x" + hex[1] + hex[1]; g = "0x" + hex[2] + hex[2]; b = "0x" + hex[3] + hex[3]; } else if (hex.length == 7) { r = "0x" + hex[1] + hex[2]; g = "0x" + hex[3] + hex[4]; b = "0x" + hex[5] + hex[6]; } r /= 255; g /= 255; b /= 255; let max = Math.max(r, g, b), min = Math.min(r, g, b); let h, s, l = (max + min) / 2; if (max == min) { h = s = 0; } else { let d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; case b: h = (r - g) / d + 4; break; } h /= 6; } h = Math.round(h * 360); s = Math.round(s * 100); l = Math.round(l * 100); return [h, s, l]; }
const getPage = ()=>{return(window.location.hash).replace("#","")}
const loggedIn = ()=>{return getLocalStore("token")?true:false}

String.prototype.isHex = function(){
    let a = /([0-9a-f#]+)/.exec(this);
    return a[0].length == this.length;
}

const ArrayRemove = function(a=[],v){
  const i = a.indexOf(v);
  if (i > -1) { // only splice array when item is found
      a.splice(i, 1); // 2nd parameter means remove one item only
  }
  return a;
}

const Twitchstore = {
    get: async function(v){
        let b = await sendRequest("GET","me");
        b = JSON.parse(b[1]);
        let r = b.user.Settings.Display["Embed Twitch Streams"] || {};
        if (typeof v !== undefined && r[v]) {
            r = r[v]
        }
        if (devMode) console.log(r,b)
        return r;
    },
    set: async function(data={}){
        let u = await this.get();
        let s = account.Settings.Display;
        let t = Object.keys(data)
        for (i of t) {
            u[i] = data[i]
        }
        s["Embed Twitch Streams"] = u;
        let [c, r] = await sendRequest("POST", "me/settings", {
           update: "display",
           value: s
        });
        if (devMode) console.log(r)
        return r;
    },
    remove: async function(v){
        let s = account.Settings.Display;
        let u = await this.get();
        if (!u[v]) {return}
        delete u[v]
        s["Embed Twitch Streams"] = u;
        let [c, r] = await sendRequest("POST", "me/settings", {
           update: "display",
           value: s
        });
        if (devMode) console.log(r)
        return r;
    }
}

function findQ(name) {
    return document.querySelector(name);
}

let changeTheme = (s={})=>{
    let a = getTheme();
    let b = Object.keys(s);
    for (i in b) {
        let n = b[i];
        a[n] = s[n];
    }
    localStorage["customTheme"] = JSON.stringify(a);
}

let getTheme = (t)=>{
    let r = JSON.parse(localStorage["customTheme"])
    if (t) {r=account.Settings.Display["Embed Twitch Streams"].CustomThemeData}
    return r;
}

let updateTheme = async()=>{
    let v = await Twitchstore.get("CustomThemeData");
    localStorage["customTheme"] = JSON.stringify(v);
    account.Settings.Display["Embed Twitch Streams"] = {CustomThemeData:v};
    changeTheme(v.hex,v.mode)
}

if (localStorage["themeHex"]) {
    let c = (getTheme().mode ? getTheme().mode : false);
    changeTheme({hex:localStorage["themeHex"],mode:(c ? getTheme().mode : false)})
    delete localStorage["themeHex"]
}

let customTheme = (hex,light)=>{
    let t = hex.isHex();
    if (!t){return showPopUp("Error Changing Theme", `Invalid hex code.`, [["Back", "grey", null]])}
    if (typeof t == "object" && t[0].length !== hex.length){return showPopUp("Error Changing Theme", `Invalid hex code.`, [["Back", "grey", null]])}
    hex = `#${hex.replaceAll("#","")}`
    let theme = [hexToHSL(hex),hexToHSL(hex),hexToHSL(hex),hexToHSL(hex),hexToHSL(hex),hexToHSL(hex)]
    if (light) {
        theme[0][2] = 90
        theme[1][2] = 88
        theme[2][2] = 86
        theme[3][2] = 82
        theme[4][2] = 69
        theme[5][2] = 87
    } else {
        theme[0][2] = 8
        theme[1][2] = 11
        theme[2][2] = 14
        theme[3][2] = 19
        theme[4][2] = 69
        theme[5][2] = 15
    }

    for (i in theme) {
        theme[i][1] = `${theme[i][1]}%`
        theme[i][2] = `${theme[i][2]}%`
    }

    setCSSVar("--leftSidebarColor", `hsl(${theme[5].join(", ")})`);
    setCSSVar("--pageColor", `hsl(${theme[0].join(", ")})`);
    setCSSVar("--pageColor2", "var(--pageColor)");
    setCSSVar("--contentColor", `hsl(${theme[1].join(", ")})`);
    setCSSVar("--contentColor2", `hsl(${theme[2].join(", ")})`);
    setCSSVar("--contentColor3", `hsl(${theme[3].join(", ")})`);
    setCSSVar("--fontColor", (light ? "#000000" : "#ffffff"));
    setCSSVar("--themeColor", `hsl(${theme[4].join(", ")})`);
    changeTheme({hex:hex})
}

const createButton = (n,i,s,p)=>{
    let prem = findI("premium");
    if (!prem) return;
    let nl = n.toLowerCase();
    let ele = document.createElement("button");
    if (s !== null) {
        wireframes[nl] = ``
        pages[nl] = s;
    }
    ele.className = "sidebarButton";
    ele.innerHTML = `<div class="sidebarButtonImg">${i}</div>${n}`
    findI("sidebarButtons").insertBefore(ele,prem)
    customBtns.push(ele)
}

function createNotification({title,body,func,time}) {
    const ele = createElement("totallyNotStolenNotificationBox","span",findC("sidebarNotifHolder"))
    ele.id = Math.floor(Math.random()*999);
    const txt = `<span style="font-weight: 700">${title}</span><br><span>${body}</span>`
    const goAway = ()=>{ele.style.opacity = 0;ele.style.transform = "scale(1.1)";ele.style.cursor = "default";setTimeout(()=>{ele.remove()},400)}
    ele.innerHTML = txt
    setTimeout(()=>{ele.style.opacity = 1;ele.style.transform = "scale(1)";},16)
    tempListen(ele,"click",function(e){goAway();if (typeof func == 'function' && !e.ctrlKey) func(ele)})
    setTimeout(()=>{goAway()},time || 3500)
    return ele;
}

let formatOptions = [
    ['(!{TEXT})', '<b>{TEXT}</b>','Bold'],
    ['(*{TEXT})', '<i>{TEXT}</i>','Italic'],
    ['(_{TEXT})', '<u>{TEXT}</u>','Underline'],
    ['(-{TEXT})', '<strike>{TEXT}</strike>','Strikethrough'],
    ['(`{TEXT})', '<span style="font-family:monospace;border-radius:5px;padding:0 5px;background-color:var(--pageColor);">{TEXT}</span>','Code'],
    ['(^{TEXT})', '<sup>{TEXT}</sup>','Superscript'],
    ['(|{TEXT})', '<div id="spoiler" onclick="this.style.backgroundColor = `rgba(255, 0, 0, 0)`; this.style.textShadow = `none`;if (!this.children[0]) {this.style.color = `var(--fontColor)`} else {this.children[0].style.visibility = `visible`};">{TEXT}</div>','Spoiler'],
    ['({HEX}?{TEXT})','<span style="color:#{HEX}">{TEXT}</span>','Color'],
    ['(={TEXT})','<span style="font-family: var(--secondFont);font-weight:800;">{TEXT}</span>','BOLDER'],
    ['(s{NUM}?{TEXT})','<p style="font-size: calc({NUM}0px / 5)">{TEXT}</p>','Size']
  ]
  bb = function(isPost) {
        let o7 = this;
        let token_match = /{[A-Z_]+[0-9]*}/ig;
        let tokens = {
            'URL': '(((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*))',
            'TEXT': '(.*?)',
            'SIMPLETEXT': '[a-zA-Z0-9-_ ]\b',
            'HEX': '([0-9abcdef]+)',
            'PREM': '([a-z0-9]+)',
            'NUM': '([0-9]+)'
        };
        let hddmatches = [];
        let hdtpls = [];
        let hdmatches = [];
        let hddtpls = [];
        let odRegEx = function(str) {
            let matches = str.match(token_match);
            let nrmatches = matches.length;
            let i = 0;
            let replacement = '';
            if (nrmatches <= 0) {
                return new RegExp(preg_quote(str),'g');
            }
            for (; i < nrmatches; i += 1) {
                let token = matches[i].replace(/[{}0-9]/g, '');
                if (tokens[token]) {
                    replacement += preg_quote(str.substr(0, str.indexOf(matches[i]))) + tokens[token];
                    str = str.substr(str.indexOf(matches[i]) + matches[i].length);
                }
            }
            replacement += preg_quote(str);
            return new RegExp(replacement,'gi');
        };
        let odTpls = function(str) {
            let matches = str.match(token_match);
            let nrmatches = matches.length;
            let i = 0;
            let replacement = '';
            let positions = {};
            let next_position = 0;
            if (nrmatches <= 0) {
                return str;
            }
            for (; i < nrmatches; i += 1) {
                let token = matches[i].replace(/[{}0-9]/g, '');
                let position;
                if (positions[matches[i]]) {
                    position = positions[matches[i]];
                } else {
                    next_position += 1;
                    position = next_position;
                    positions[matches[i]] = position;
                }
                if (tokens[token]) {
                    replacement += str.substr(0, str.indexOf(matches[i])) + '$' + position;
                    str = str.substr(str.indexOf(matches[i]) + matches[i].length);
                }
            }
            replacement += str;
            return replacement;
        };
        o7.ad = function(hddmatch, hddtpl, special) {
            hddmatches.push(odRegEx(hddmatch));
            hdtpls.push(odTpls(hddtpl));
            hdmatches.push(odRegEx(hddtpl));
            hddtpls.push(odTpls(hddmatch));
            if (special) {
                special()
            }
        }
        ;
        o7.bbh = function(str) {
            let nrbbcmatches = hddmatches.length;
            let i = 0;
            for (; i < nrbbcmatches; i += 1) {
                str = str.replace(hddmatches[i], hdtpls[i]);
            }
            return str;
        }
        ;
        function preg_quote(str, delimiter) {
            return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]','g'), '\\$&');
        }
        o7.ad('https://app.photop.live/?gift={PREM}', '<span type="giftlink" giftid="{PREM}" class="gift-link" tabindex="0">Claim Gift!</span>');
        o7.ad('{URL}', '<a href="{URL}" target="_blank" class="link" title="{URL}">{URL}</a>');
        o7.ad('@{HEX}"{TEXT}" ', '<span type="user" userid="{HEX}" class="mention" tabindex="0">@{TEXT}</span> ');
        o7.ad('@{HEX}"{TEXT}"\n', '<span type="user" userid="{HEX}" class="mention" tabindex="0">@{TEXT}</span>\n');
        o7.ad('/Post_{HEX} ', '<span type="postlink" postid="{HEX}" class="post-embed" tabindex="0">/Post_{HEX}</span> ');
        o7.ad('/Post_{HEX}\n', '<span type="postlink" postid="{HEX}" class="post-embed" tabindex="0">/Post_{HEX}</span>\n');
        o7.ad('/Chat_{HEX} ', '<span type="chatlink" chatid="{HEX}" class="chat-embed" tabindex="0">/Chat_{HEX}</span> ');
        o7.ad('/Chat_{HEX}\n', '<span type="chatlink" chatid="{HEX}" class="chat-embed" tabindex="0">/Chat_{HEX}</span>\n');
        o7.ad('/Gift_{PREM} ', '<span type="giftlink" giftid="{PREM}" class="gift-link" tabindex="0">Claim Gift!</span> ');
        o7.ad('/Gift_{PREM}\n', '<span type="giftlink" giftid="{PREM}" class="gift-link" tabindex="0">Claim Gift!</span>\n');
        for (i in formatOptions) {
          o7.ad(formatOptions[i][0],formatOptions[i][1])
        }
    };
  fe = new bb(false);
  newPostRender = new bb(true);

let pc = {}
function addCodeToPage(page,c) {
    if (pages[page] == undefined) return;
    let p = (pc[page] ? pc[page].code : `${pages[page]}`)
    v = (`${pages.settings}`.slice(0,p.length-1) + c+"}").replace("function","function settingsPage")
    pc[page] = {code:v}
    pages.settings = ()=>{eval(pc[page]);settingsPage()}
}

async function addonsCheck() {
  let a = await Twitchstore.get("Addons");
  if (a.CustomThemeData !== undefined) {
    Twitchstore.set({Addons:[]})
  }
}

const loadedAddons = [];

class Addon {
    constructor(id) {
        loadedAddons.push({id:id,self:this})
    }
    createPopup({title,body,buttons}) {
        showPopUp(title,body,(buttons || [["Okay", "grey", null]]))
    }
    createElement({name,type,parent,attribute}){
        createElement(name,type,parent,attribute)
    }
    createNotification({title,body,func,time}){
      createNotification({title,body,func,time})
    }
}

class Format {
    constructor({name, format, html}) {
        formatOptions.push([format,html,name])
        fe.ad(format,html)
    }
}

async function getAddon(n) {
    let r = await fetch(`https://siriclientstuff.glitch.me/addon?name=${n}`);
    return await r.json()
}

const userCache = {"634d9def73acb4401e1b86ea":"Siri"}

async function getUser(id) {
  let r;
  if (!Object.keys(userCache).includes(id)) {
    r = await sendRequest("GET",`user?id=${d.author}`);
    r = JSON.parse(r[1])
  } else {
    r = userCache[id]
  }
  return r;
}

async function initAddons() {
    let a = await Twitchstore.get("Addons");

    for (i in a) {
        try {
            let d = await getAddon(a[i]);
            await loadScript(`https://siriclientstuff.glitch.me/plugins/${d._id}.js`)
            let u = await getUser(d.author)
            console.log(loadedAddons[i].self.init())
            createNotification({title:`${d.name} Loaded!`,body:"Enjoy!",func:()=>{
                showPopUp(
                  `${d.name} <span style='font-size: 14px'>v${d.version}</span>`,
                  `<div class="postTimestamp" style="margin: 2px 0 2px 0; font-size: 18px;">By ${JSON.parse(u[1]).User}</div>${d.description}`,
                  [["Close", "grey", null]]
                )
            },time:5000})
        } catch(e) {
            console.log(e)
        }
    }
}

async function getAllAddons(){
  let r = await fetch("https://siriclientstuff.glitch.me/addons");
  return await r.json()
}

async function initCli(){
  let n = createNotification({title:"Loading SiriClient...",body:"BetterBetterPhotop",time:Date.now()})
  let i = setInterval(async()=>{
      if (JSON.stringify(account) !== "{}") {
          clearInterval(i)
          const ArrayRandom = function (a=[]) { if (typeof a == 'object') return a[Math.floor((Math.random()*a.length))]; }
          n.remove()
          setTimeout(async()=>{
              const loadMessages = [
                "Life.. is Photop",
                `You've logged in ${account.Logins} times.. Loser..`,
                "We are NOT playing this again...",
                "something funny",
                "FEEDING MAG!",
                "My name is richard and I'm sittin in a corner",
                "Join dis <a href='https://discord.gg/S67wzquA'>https://discord.gg/S67wzquA</a>",
                "Now with gambling!",
                "Pwee Pudee!"
              ]
              let m = ArrayRandom(loadMessages);
              createNotification({title:m,body:`Welcome to SiriClient ${metaData.version}!`,func:function(){
                  showPopUp("Thanks Abooby","We love you Abooby! Muah 😘😍",[["Okay", "grey", null]])
              }})
              await addonsCheck();
              await initAddons()
          },100)
          let t = getTheme(true)
          customTheme(t.hex,t.mode)
      }
  })
}

initCli()


createElement("","style",document.head).innerHTML = 
`#spoiler {
    background-color: var(--themeColor);
    border: none;
    border-radius: 6px;
    color: transparent;
    padding: 4px 4px;
    margin: 0px 2px;
    transition: 0.3s;
    display: inline-block;
    text-shadow: 0 0 0 var(--themeColor);
}
  
#spoiler > span {
    visibility: hidden;
}

.settingsButton {
    margin: 9px 3px 0px 3px;
}

select {
  background: var(--contentColor2);
  width: 100%;
  border: none;
  border-radius: 8px;
  box-sizing: border-box;
  color: var(--fontColor);
  font-family: var(--mainFont);
  font-weight: bold;
  font-size: 16px;
  height: 32px;
  padding: 4px;
  margin-top: 6px;
}

option {
    background: var(--contentColor1);
}

.totallyNotStolenNotificationBox {
	text-align:left;
	display:block;
	padding:4px 8px;
	background:var(--contentColor2);
	border-radius:10px;
	font-size:16px;;
	font-family:Roboto;
	font-weight:300;
	transition:opacity 0.2s, transform 0.2s;
	user-select:none;
	cursor:pointer;
	width:100%;
	max-width:182px;
	max-height:200px;
	margin-bottom:2px;
	color:white;
	transform:scale(0.9);
	opacity:0;
	overflow-wrap:anywhere;
}

`

createButton("Messages",`<svg viewBox="0 0 256 256" fill="none" xmlns="http:www.w3.org/2000/svg">
              <rect x="-10" y="10" width="203.976" height="62.755" rx="31.3775" transform="matrix(-1 0 0 1 217.976 21)" stroke="var(--themeColor)" stroke-width="20"/>
              <path d="M238.758 108.748L228.062 77.8583C226.738 74.0347 221.657 73.2854 219.286 76.564L206.321 94.4879C204.558 96.9256 205.331 100.357 207.97 101.803L231.63 114.769C235.642 116.967 240.255 113.071 238.758 108.748Z" fill="var(--themeColor)"/>
              <rect x="27.0237" y="144" width="203.976" height="62.7549" rx="31.3775" stroke="var(--themeColor)" stroke-width="20"/>
              <path d="M16.2421 221.748L26.938 190.858C28.2619 187.035 33.3426 186.285 35.7141 189.564L48.6787 207.488C50.442 209.926 49.6687 213.357 47.0303 214.803L23.3698 227.769C19.3584 229.967 14.7455 226.071 16.2421 221.748Z" fill="var(--themeColor)"/>
            </svg>`,null)

createButton("Addons",`<svg xmlns="http://www.w3.org/2000/svg" style="margin:-2px 0px 0px -1px" width="35px" height="35px" viewBox="0 -960 960 960" fill="var(--themeColor)"><path d="M344.15-122H188q-27.57 0-46.79-19.21Q122-160.43 122-188v-144.15q39.15-10 62.58-43.81Q208-409.77 208-452q0-42.23-23.42-76.04-23.43-33.81-62.58-43.81V-718q0-27.57 19.21-46.79Q160.43-784 188-784h150q10.77-40.31 42.35-65.85 31.57-25.54 71.65-25.54 40.08 0 71.65 25.54Q555.23-824.31 566-784h152q27.57 0 46.79 19.21Q784-745.57 784-718v152q40.31 10.77 65.85 42.35 25.54 31.57 25.54 71.65 0 40.08-25.54 71.65Q824.31-348.77 784-338v150q0 27.57-19.21 46.79Q745.57-122 718-122H559.85q-4.77-45.15-35.81-75.58Q493-228 452-228q-41 0-72.04 30.42-31.04 30.43-35.81 75.58ZM188-188h102.92q17.08-39.85 57.77-72.92Q389.38-294 452-294q62.62 0 104.31 33.08Q598-227.85 615.08-188H718v-199.38h34.46q28.77-4.62 42.85-23.7 14.07-19.07 14.07-40.92t-14.07-40.92q-14.08-19.08-42.85-23.7H718V-718H516.62v-34.46q-4.62-28.77-23.7-42.85-19.07-14.07-40.92-14.07t-40.92 14.07q-19.08 14.08-23.7 42.85V-718H188v101.08q39.08 31.69 62.54 74.27Q274-500.08 274-452q0 49.15-23.46 91.08Q227.08-319 188-289.08V-188Zm264-264Z"/></svg>`,)

let addonsLogic = async function(e){
  let a = await Twitchstore.get("Addons")
  let state = e.innerText == "Enable";
  let addon = e.id;

  if (state) {
    a.push(addon)
  } else {
    ArrayRemove(a,addon)
  }

  console.log(state,addon,a)

  Twitchstore.set({Addons:a})

  e.innerText = (state ? "Disable" : "Enable")
}

pages.addons = async ()=>{
    let ph = findC("pageHolder")
    let header = createElement("","h1",ph)
    header.innerText = `Addons`
    header.style.fontSize = "65px"
    header.style.textAlign = "center"

    let p = createElement("","p",ph)
    p.innerText = "(Refresh the page for changes to take affect)"
    p.style.textAlign = "center"
    
    let addons = await getAllAddons()

    // let n = createElement("","p",ph)
    // n.innerText = JSON.stringify(addons)
    // n.style.textAlign = "center"
    //`<div class="settingsSection"><h3 style="margin: 0;">Abooby's Emojis <span style="font-size: 14px">v1.0</span></h3><div class="postTimestamp" style="margin: 2px 0 2px 0;">By Siri</div>A port of Aboobys Emoji plugin for SiriClient. <br><button class="settingsButton">Enable</button></div>`
    let aData = await Twitchstore.get("Addons")
    for (i in addons) {
      let ia = addons[i];
      let u = await getUser(ia.author)
      let div = createElement("settingsSection","div",ph)
      div.style.textAlign = "center"
      div.style.margin = "auto"
      div.style.marginTop = "5px"
      div.innerHTML = `<h3 style="margin: 0;">${ia.name} <span style="font-size: 14px">v${ia.version}</span></h3><div class="postTimestamp" style="margin: 2px 0 2px 0;">By ${u}</div>${ia.description}<br><button id="${ia.nid}" onclick="addonsLogic(this)" class="settingsButton">${aData.includes(ia.nid) ? "Disable" : "Enable"}</button></div>`
    }
    
    //<h1 style="font-size: 100px;text-align: center;">hi</h1>
    // const settingSections = []
    // let n;
    // const mss = ()=>{
    //     settingSections.push(createElement("settingsSection","div",findC("pageHolder")));
    // }
    // mss();
    
    // createElement("settingsTitle","div",settingSections[0]).innerText = "Theme";
    
    // n = createElement("settingsInput","input",settingSections[0]);
    // n.placeholder = "#BF00FF";
    // n.id = "themeInput";
    
    // n = createElement("settingsButton","button",settingSections[0]);
    // n.innerText = "Save";
    // n.id = "saveTheme";
    // n.onclick = ()=>{customTheme(findI('themeInput').value)}
    
    // console.log(n)

    //updateDisplay(account.Settings.Display.Theme)
}

let extraButton = setInterval(()=>{
    if (findI("extra") == null){return}
    if ((findI("extra").className).includes("hidden")){
        findI("extra").className = "postActionButton"

        findI("extra").addEventListener("click",async function(a){
            let array = [];
            showDropdown(findI("extra"),"right",[["Formats","var(--chatColor)",function(){showDropdown(findI("extra"),"right",array)}],["Portal","var(--postColor)",function(){setPage("portal")}],])
            for (i in formatOptions) {
                array.push([formatOptions[i][2],"var(--themeColor)",function(){
                    for (j in array) {
                        if (array[j][0] == document.activeElement.textContent) {
                            let rep = (v)=>{
                                let formatRep = {"{TEXT}":"'text'","{HEX}":"'hex code'","{NUM}":"'number'"}
                                let keys = Object.keys(formatRep)
                                let x = v;
                                for (i in keys) {
                                    x = x.replaceAll(keys[i],formatRep[keys[i]])
                                }
                                return x;
                            }
                            let postArea = findI("newPostArea").innerHTML;
                            findI("newPostArea").innerHTML = `${postArea}${postArea == '' ? '' : ' '}${rep(formatOptions[j][0])}`
                            closeDropdown()
                        }
                    }
                }])
            }
        })
    }
},100)

function addCodeToPage(page,c) {
    const flios = (m, s)=>{return m.lastIndexOf(s);}
    if (pages[page] == undefined) return;
    let p = (pc[page] ? pc[page].code : `${pages[page]}`)
    let n = (pc[page] ? flios(p,page)-3 : p.length-1)
    //.replace("function",`function ${fn}`)
    let fn = `${page}Page`
    let v = (p.slice(0,n) + c+`}; ${fn}()`)
    if (pc[page] == undefined) {
        v = v.replace("function",`function ${fn}`)
    }
    pc[page] = {code:v}
    pages[page] = ()=>{eval(pc[page].code)}
}

// REDEFINED FUNCTIONS ZONE

async function setPage(name) {
  let loadedPage = currentPage;
  currentPage = name;
  app.style.width = "850px";
  if (loadedPage != name) {
    pageHolder.innerHTML = "";
  }
  removeTempListeners();
  for (let i = 0; i < subscribes.length; i++) {
    subscribes[i].close();
  }
  subscribes = [];
  if (window.closeMobileChat != null) {
    closeMobileChat();
  }
  if (wireframes[name] == null) {
    if (currentlyLoadingPages[name] != null) {
      return;
    }
    currentlyLoadingPages[name] = "";
    await loadScript("./pages/" + name + ".js");
    delete currentlyLoadingPages[name];
  }
  if (name != "home" || loadedPage != name) {
    pageHolder.innerHTML = wireframes[name];
  }
  if (pages[name] != null) {
    window.location.hash = "#" + name;
    switch (name){
      case "settings":
        if (typeof pc.settings !== 'undefined') break;
        let c = `
        if(!(themes.join().includes("Client") && themes.join().includes("Custom"))){
            themes.push(["/section","Client"]);
            themes.push(["Custom","var(--contentColor2)"]);
        }

        let repeat = false;
        let f = ()=>{pageLoad(()=>{
            if (findI("EmbedTwitchStreams")) {
                findI("EmbedTwitchStreams").remove()
                document.querySelector("label[for='EmbedTwitchStreams']").remove()

                let t = createElement("","i",findI("dispSelector"))
                t.innerText = 'The option "Embed Twitch Streams" was removed due to potential Data Corruption. This option is still enabled, though.'
                t.style.fontSize = "12px"
                findI("EmbedGIFs").parentElement.style.marginBottom = "5px"
            }
    
            f()
        })}

        f()
        
        function addThemeOption(index) {
            const cto = ()=>{
              div = createElement("tempDiv","div",findI("themeSelector"))
                      
              n = createElement("settingsInput","input",findC("tempDiv"));
              n.placeholder = "#BF00FF";
              n.id = "themeInput";
              n.value = getTheme().hex;
              n.style.width = "80%"
              
              let d_id = "customThemeDropdown"
              n = createElement("","select",findC("tempDiv"));
              n.id = d_id
              n.style.width = "80%"
              p = createElement("","option",findI(d_id)).innerText = "Dark"
              q = createElement("","option",findI(d_id)).innerText = "Light"
              n.value = (getTheme().mode ? "Light" : "Dark");
        
              n = createElement("settingsButton","button",findC("tempDiv"));
              n.innerText = "Save";
              n.id = "saveTheme";
              n.onclick = ()=>{
                let tInputVal = findI('themeInput').value;
                let h = hexToHSL(tInputVal)
                let c = (findI(d_id).value == "Light" ? true : false);
                customTheme(tInputVal,c)
                changeTheme({hex:tInputVal,mode:c})
                Twitchstore.set({CustomThemeData:{hex:tInputVal,mode:c}})
              }
            }
            
            if (themes[index][0] == "/section") {
              let thisSection = createElement("settingsTitle", "div", findI("themeSelector"));
              thisSection.innerText = themes[index][1];
              return;
            }
            let thisThemeOption = createElement("themeOption", "div", findI("themeSelector"));
            if (themes[index][1] == "Snowtop") {
              thisThemeOption.style.backgroundImage = "url(https://app.photop.live/Images/Holidays/FunSnowPile.png)";
              thisThemeOption.style.backgroundSize = "cover";
              thisThemeOption.style.backgroundColor = "#151617";
            } else if (themes[index][1] == "NewYear") {
              thisThemeOption.style.backgroundImage = "url(https://app.photop.live/Images/Holidays/fireworkParticle2.png)";
              thisThemeOption.style.backgroundSize = "cover";
              thisThemeOption.style.backgroundColor = "#151617";
            } else {
              thisThemeOption.style.background = themes[index][1];
            }
            thisThemeOption.title = themes[index][0];
            if (account.Settings.Display.Theme == themes[index][0]) {
              thisThemeOption.classList.add("themeSelected");
            }
            
            //CLICK EVENT
            
            thisThemeOption.addEventListener("click", async function (e) {
              let updatedSettings = account.Settings.Display;
              updatedSettings.Theme = themes[index][0];
              if (findC("themeSelected") != null) {
                findC("themeSelected").classList.remove("themeSelected");
              }
              thisThemeOption.classList.add("themeSelected");
              updateDisplay(updatedSettings.Theme)
              let [code, response] = await sendRequest("POST", "me/settings", {
                update: "display",
                value: updatedSettings
              });
              if (code != 200) {
                showPopUp("Error Updating Theme", response, [
                  ["Okay", "var(--grayColor)"]
                ]);
                updateDisplay(account.Settings.Display.Theme)
              }
              try {findC("tempDiv").remove()}catch(e){}
              switch (thisThemeOption.getAttribute("title")){
                  case "Custom":
                      cto()
                      break;
              }
            });
            
            if (themes[index][0] == "Custom") {
                  cto()
            }
    }
`
        addCodeToPage("settings",c)
        break;
    }
    await pages[name]();
    let title = name;
    title = name.charAt(0).toUpperCase() + name.slice(1);
    document.title = title + " | Photop";
  }
}
//updateDisplay(account.Settings.Display.Theme)
function updateDisplay(type) {
  if (skyInt != null) {
    clearInterval(skyInt);
    skyInt = null;
  }
  setCSSVar("--sidebarBG", isMobile ? "var(--pageColor)" : "transparent");
  switch (type) {
    case "Custom":
        if (!(getTheme() && account.Settings.Display["Embed Twitch Streams"].CustomThemeData)) return;
        if (account.Settings.Display["Embed Twitch Streams"].CustomThemeData !== getTheme()){
            updateTheme()
            let t = getTheme(true)
            customTheme(t.hex,t.mode)
        } else {
            customTheme(getTheme().hex,getTheme().mode)
        }
      break;
    case "Light":
      setCSSVar("--leftSidebarColor", "#E8E8E8");
      setCSSVar("--pageColor", "#E6E9EB");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#DFDFE6");
      setCSSVar("--contentColor2", "#D9D9E4");
      setCSSVar("--contentColor3", "#D2D2E0");
      setCSSVar("--fontColor", "#000000");
      setCSSVar("--themeColor", "#5AB7FA");
      particles = null;
      break;
    /*
    case "Pride":
      setCSSVar("--leftSidebarColor", "#262630");
      setCSSVar("--pageColor", "linear-gradient(to bottom, red, orange, yellow, green, blue, purple)");
      setCSSVar("--contentColor", "#EBEBEB");
      setCSSVar("--contentColor2", "#E3E3E3");
      setCSSVar("--contentColor3", "#D9D9D9");
      setCSSVar("--borderColor", "#323242");
      setCSSVar("--fontColor", "black");
      setCSSVar("--themeColor", "tomato");
      break;
      */
    case "Hacker":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "black");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "black");
      setCSSVar("--contentColor2", "black");
      setCSSVar("--contentColor3", "black");
      setCSSVar("--fontColor", "white");
      setCSSVar("--themeColor", "lime");
      particles = null;
      break;
    case "Blood Moon":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "linear-gradient(to bottom, #5c0701, black)");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#831100");
      setCSSVar("--contentColor2", "#942200");
      setCSSVar("--contentColor3", "#a52300");
      setCSSVar("--fontColor", "white");
      setCSSVar("--themeColor", "tomato");
      particles = null;
      break;
    case "Under The Sea":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "linear-gradient(to bottom, #4ecbef, #0062fe)");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#0056d6");
      setCSSVar("--contentColor2", "#0061fe");
      setCSSVar("--contentColor3", "#3a87fe");
      setCSSVar("--fontColor", "white");
      setCSSVar("--themeColor", "#52d6fc");
      particles = null;
      break;
    case "Bootop":
      setCSSVar("--leftSidebarColor", "#262630");
      setCSSVar("--pageColor", "#151617");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#1f1f28");
      setCSSVar("--contentColor2", "#24242e");
      setCSSVar("--contentColor3", "#2a2a37");
      setCSSVar("--fontColor", "#ffffff");
      setCSSVar("--themeColor", "#eb6123");
      particles = null;
      break;
    case "Snowtop":
      setCSSVar("--leftSidebarColor", "#262630");
      setCSSVar("--pageColor", "url('/Images/Holidays/FunSnowPile.png')");
      setCSSVar("--pageColor2", "#151617");
      if (isMobile) {
        setCSSVar("--sidebarBG", "var(--pageColor2)");
      } else {
        setCSSVar("--sidebarBG", "transparent");
      }
      setCSSVar("--contentColor", "#1f1f28");
      setCSSVar("--contentColor2", "#24242e");
      setCSSVar("--contentColor3", "#2a2a37");
      setCSSVar("--fontColor", "#ffffff");
      setCSSVar("--themeColor", "#f13333");
      particles = "snow";
      document.body.classList.add('snowtop');
      break;
    case "Midnight Haze":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "linear-gradient(135deg, #0c1762, #650f9b, #780f31)");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#1F1F59");
      setCSSVar("--contentColor2", "#421f59");
      setCSSVar("--contentColor3", "#611f59");
      setCSSVar("--fontColor", "white");
      setCSSVar("--themeColor", "#78ddd4");
      particles = null;
      break;
    case "Moss Green":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "radial-gradient(ellipse at bottom, #658d65, #0d2c0a)");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#334e33");
      setCSSVar("--contentColor2", "#395839");
      setCSSVar("--contentColor3", "#426042");
      setCSSVar("--fontColor", "white");
      setCSSVar("--themeColor", "#78dd8a");
      particles = null;
      break;
    case "Ourple 😂":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "#4638a1");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#5a4cb1");
      setCSSVar("--contentColor2", "#6459ab");
      setCSSVar("--contentColor3", "#6c62af");
      setCSSVar("--fontColor", "white");
      setCSSVar("--themeColor", "#bab3e9");
      particles = null;
      break;
    case "Peachy Mist":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "linear-gradient(315deg, #f0b980, pink)");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#f9e5e8");
      setCSSVar("--contentColor2", "#f9dad7");
      setCSSVar("--contentColor3", "#f3c2d4");
      setCSSVar("--fontColor", "#46261b");
      setCSSVar("--themeColor", "#ed3950");
      particles = null;
      break;
    case "Faded":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "linear-gradient(295deg, #336264, #3a4048)");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#497287");
      setCSSVar("--contentColor2", "#5a8399");
      setCSSVar("--contentColor3", "#6a91a5");
      setCSSVar("--fontColor", "white");
      setCSSVar("--themeColor", "#a9cfe9");
      particles = null;
      break;
    case "Into the Light":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "radial-gradient(circle at 30% 70%, #fbe286, #4caed3)");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#e9e8c2");
      setCSSVar("--contentColor2", "#e3ddca");
      setCSSVar("--contentColor3", "#d9d4c4");
      setCSSVar("--fontColor", "#152c46");
      setCSSVar("--themeColor", "#1199dd");
      particles = null;
      break;
    case "Canyon":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "radial-gradient(ellipse at bottom, #d5610f, #581703)");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#783715");
      setCSSVar("--contentColor2", "#7c3d1c");
      setCSSVar("--contentColor3", "#85401b");
      setCSSVar("--fontColor", "white");
      setCSSVar("--themeColor", "#e5986a");
      particles = null;
      break;
    case "Spocco":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "linear-gradient(180deg, #ededed 20%, #bbb8b8 80%)");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#f1f1f1");
      setCSSVar("--contentColor2", "#ebedef");
      setCSSVar("--contentColor3", "#dce3e9");
      setCSSVar("--fontColor", "#242c32");
      setCSSVar("--themeColor", "#0db7c1");
      particles = null;
      break;
    case "Into the Night":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "radial-gradient(circle at 50% 20%, #3e5a72, #000)");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#0b1218");
      setCSSVar("--contentColor2", "#0d151c");
      setCSSVar("--contentColor3", "#141f28");
      setCSSVar("--fontColor", "white");
      setCSSVar("--themeColor", "#758691");
      particles = null;
      break;
    case "Sunset":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "radial-gradient(circle at 70% 100%, #ffeec8 -5%, #ed9437 5%, #ed9437 10%, #554cd3, #15055d)");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#151547");
      setCSSVar("--contentColor2", "#1c1c5b");
      setCSSVar("--contentColor3", "#22225d");
      setCSSVar("--fontColor", "white");
      setCSSVar("--themeColor", "#37afed");
      particles = null;
      break;
    case "Sky":
      updateSky();
      skyInt = setInterval(updateSky, 1000);
      setCSSVar("--themeColor", "#3f51b5");
      particles = null;
      break;
    case "New Year":
      setCSSVar("--leftSidebarColor", "black");
      setCSSVar("--pageColor", "radial-gradient(circle at 50% 20%, #3e5a72, #000)");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#1f1f28");
      setCSSVar("--contentColor2", "#24242e");
      setCSSVar("--contentColor3", "#2a2a37");
      setCSSVar("--fontColor", "#ffffff");
      setCSSVar("--themeColor", "#5AB7FA");
      particles = "fireworks";
      break;
    default:
      setCSSVar("--leftSidebarColor", "#262630");
      setCSSVar("--pageColor", "#151617");
      setCSSVar("--pageColor2", "var(--pageColor)");
      setCSSVar("--contentColor", "#1f1f28");
      setCSSVar("--contentColor2", "#24242e");
      setCSSVar("--contentColor3", "#2a2a37");
      setCSSVar("--fontColor", "#ffffff");
      setCSSVar("--themeColor", "#5AB7FA");
      particles = null;
      break;
  }
  clearInterval(particleInt);
  switch (particles) {
    case "snow":
      function createParticle() {
        if (!viewingTab) {
          return;
        }
        let thisParticle = createElement("particle-snow", "div", findC("body"));
        thisParticle.style.left = (Math.random()*100) + "%";
        setTimeout(function () {
          thisParticle.remove();
        }, 15000);
      }
      particleInt = setInterval(createParticle, (isMobile ? 1500 : 500));
      break;
    case "fireworks":
      function createParticle() {
        if (!viewingTab) {
          return;
        }
        let thisParticle = createElement("particle-fireworks1", "img", findC("body"));
        thisParticle.src = "/Images/Holidays/fireworkParticle1.png";
        thisParticle.style.left = (Math.random()*100) + "%";
        if (Math.random() >= 0.1) {
          thisParticle.style.zIndex = -999;
        }
        thisParticle.style.filter = "hue-rotate(" + (Math.floor(Math.random() * 360)) + "deg)";
        setTimeout(function () {
          thisParticle.classList.add("particle-fireworks2");
          thisParticle.classList.remove("particle-fireworks1");
          thisParticle.src = "/Images/Holidays/fireworkParticle2.png";
          setTimeout(function () {
            thisParticle.remove();
          }, 750);
        }, 3000);
      }
      createParticle();
      particleInt = setInterval(createParticle, 1000);
      break;
  }
}

async function auth() {
    let [code, response] = await sendRequest("GET", "me?ss=" + socket.secureID);
    if (code != 200) {
      return;
    }
    updateToSignedIn(response);
}
