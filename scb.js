let customTheme = (hex)=>{
    let t = /([0-9abcdef#]+)/.exec(hex);
    if (!t){return showPopUp("Error Changing Theme", `Invalid hex code.`, [["Back", "grey", null]])}
    if (typeof t == "object" && t[0].length !== hex.length){return showPopUp("Error Changing Theme", `Invalid hex code.`, [["Back", "grey", null]])}
    const hexToHSL = (hex)=> { let r = 0, g = 0, b = 0; if (hex.length == 4) { r = "0x" + hex[1] + hex[1]; g = "0x" + hex[2] + hex[2]; b = "0x" + hex[3] + hex[3]; } else if (hex.length == 7) { r = "0x" + hex[1] + hex[2]; g = "0x" + hex[3] + hex[4]; b = "0x" + hex[5] + hex[6]; } r /= 255; g /= 255; b /= 255; let max = Math.max(r, g, b), min = Math.min(r, g, b); let h, s, l = (max + min) / 2; if (max == min) { h = s = 0; } else { let d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; case b: h = (r - g) / d + 4; break; } h /= 6; } h = Math.round(h * 360); s = Math.round(s * 100); l = Math.round(l * 100); return [h, s, l]; }
    hex = (hex[0] !== "#") ? (`#${hex.replaceAll("#","")}`) : hex;
    let theme = [hexToHSL(hex),hexToHSL(hex),hexToHSL(hex),hexToHSL(hex),hexToHSL(hex),hexToHSL(hex)]
    theme[0][2] = 8
    theme[1][2] = 11
    theme[2][2] = 14
    theme[3][2] = 19
    theme[4][2] = 69
    theme[5][2] = 15

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
    setCSSVar("--fontColor", "#ffffff");
    setCSSVar("--themeColor", `hsl(${theme[4].join(", ")})`);

    localStorage["themeHex"] = hex;
}

const createButton = (n,i,s,p)=>{
    let nl = n.toLowerCase();
    let ele = document.createElement("button");
    let prem = findI("premium");
    if (s !== null) {
        wireframes[nl] = ``
        pages[nl] = s;
    }
    ele.className = "sidebarButton";
    ele.innerHTML = `<div class="sidebarButtonImg">${i}</div>${n}`
    findI("sidebarButtons").insertBefore(ele,prem)
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
`

createButton("Messages",`<svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="-10" y="10" width="203.976" height="62.755" rx="31.3775" transform="matrix(-1 0 0 1 217.976 21)" stroke="var(--themeColor)" stroke-width="20"/>
              <path d="M238.758 108.748L228.062 77.8583C226.738 74.0347 221.657 73.2854 219.286 76.564L206.321 94.4879C204.558 96.9256 205.331 100.357 207.97 101.803L231.63 114.769C235.642 116.967 240.255 113.071 238.758 108.748Z" fill="var(--themeColor)"/>
              <rect x="27.0237" y="144" width="203.976" height="62.7549" rx="31.3775" stroke="var(--themeColor)" stroke-width="20"/>
              <path d="M16.2421 221.748L26.938 190.858C28.2619 187.035 33.3426 186.285 35.7141 189.564L48.6787 207.488C50.442 209.926 49.6687 213.357 47.0303 214.803L23.3698 227.769C19.3584 229.967 14.7455 226.071 16.2421 221.748Z" fill="var(--themeColor)"/>
            </svg>`,null)

createButton("Client",`<svg viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M126.5 149C138.374 149 148 139.374 148 127.5C148 115.626 138.374 106 126.5 106C114.626 106 105 115.626 105 127.5C105 139.374 114.626 149 126.5 149Z" fill="var(--themeColor)"></path> <path d="M101 64L108.972 12.846C109.048 12.3591 109.467 12 109.96 12H144.04C144.533 12 144.952 12.3591 145.028 12.846L153 64" stroke="var(--themeColor)" stroke-width="20"></path> <path d="M153 192L145.028 243.154C144.952 243.641 144.533 244 144.04 244H109.96C109.467 244 109.048 243.641 108.972 243.154L101 192" stroke="var(--themeColor)" stroke-width="20"></path> <path d="M84.5744 182.517L36.2877 201.19C35.8281 201.367 35.3074 201.184 35.061 200.757L18.0211 171.243C17.7747 170.816 17.876 170.274 18.2598 169.964L58.5744 137.483" stroke="var(--themeColor)" stroke-width="20"></path> <path d="M169.426 73.4833L217.712 54.8103C218.172 54.6326 218.693 54.8162 218.939 55.243L235.979 84.757C236.225 85.1838 236.124 85.7265 235.74 86.0357L195.426 118.517" stroke="var(--themeColor)" stroke-width="20"></path> <path d="M195.426 137.483L235.74 169.964C236.124 170.274 236.225 170.816 235.979 171.243L218.939 200.757C218.693 201.184 218.172 201.367 217.712 201.19L169.426 182.517" stroke="var(--themeColor)" stroke-width="20"></path> <path d="M58.5744 118.517L18.2598 86.0357C17.876 85.7265 17.7747 85.1838 18.0211 84.757L35.061 55.243C35.3074 54.8162 35.8281 54.6326 36.2877 54.8103L84.5744 73.4833" stroke="var(--themeColor)" stroke-width="20"></path> <path d="M194 128C194 165.003 164.003 195 127 195C89.9969 195 60 165.003 60 128C60 90.9969 89.9969 61 127 61C164.003 61 194 90.9969 194 128Z" stroke="var(--themeColor)" stroke-width="20"></path> </svg>`,()=>{alert("hi")})

decideProfilePic({})

pages.client = ()=>{
    const settingSections = []
    let n;
    const mss = ()=>{
        settingSections.push(createElement("settingsSection","div",findC("pageHolder")));
    }
    mss();
    
    createElement("settingsTitle","div",settingSections[0]).innerText = "Theme";
    
    n = createElement("settingsInput","input",settingSections[0]);
    n.placeholder = "#BF00FF";
    n.id = "themeInput";
    
    n = createElement("settingsButton","button",settingSections[0]);
    n.innerText = "Save";
    n.id = "saveTheme";
    n.onclick = ()=>{customTheme(findI('themeInput').value)}
    console.log(n)

    n = createElement("settingsButton","button",settingSections[0]);
    n.innerText = "Reset";
    n.id = "resetTheme";
    n.onclick = ()=>{updateDisplay(account.Settings.Display.Theme);delete localStorage["themeHex"];}
    console.log(n)

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

// REDEFINED FUNCTIONS ZONE

function updateBackdrop(imageID) {
    if (imageID != null && hasPremium()) {
      findI("backdrop").style.backgroundImage = `url("https://photop-content.s3.amazonaws.com/Backdrops/${imageID}")`;
      findI("backdrop").style.opacity = 0.3;
    } else {
      findI("backdrop").style.opacity = 0;
    }
    if (localStorage["themeHex"]) {
      customTheme(localStorage["themeHex"])
    }
}

function addThemeOption(index) {
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
    thisThemeOption.addEventListener("click", async function () {
      let updatedSettings = account.Settings.Display;
      updatedSettings.Theme = themes[index][0];
      if (findC("themeSelected") != null) {
        findC("themeSelected").classList.remove("themeSelected");
      }
      thisThemeOption.classList.add("themeSelected");
      updateDisplay(themes[index][0]);
      let [code, response] = await sendRequest("POST", "me/settings", {
        update: "display",
        value: updatedSettings
      });
      if (code != 200) {
        showPopUp("Error Updating Theme", response, [
          ["Okay", "var(--grayColor)"]
        ]);
        updateDisplay(account.Settings.Display.Theme);
      } else {
          delete localStorage["themeHex"]
      }
    });
}