!function (e, t, i) { "use strict"; "function" == typeof window.define && window.define.amd ? window.define(i) :
"undefined" != typeof module && module.exports ? module.exports = i() : t.exports ? t.exports = i() : t.Fingerprint2 =
i() }(0, this, function () { "use strict"; var t = function (e) { if (!(this instanceof t)) return new t(e);
this.options = this.extend(e, { swfContainerId: "fingerprintjs2", swfPath: "flash/compiled/FontList.swf",
detectScreenOrientation: !0, sortPluginsFor: [/palemoon/i], userDefinedFonts: [] }), this.nativeForEach =
Array.prototype.forEach, this.nativeMap = Array.prototype.map }; return t.prototype = { extend: function (e, t) { if
(null == e) return t; for (var i in e) null != e[i] && t[i] !== e[i] && (t[i] = e[i]); return t }, get: function (a) {
var n = this, e = { data: [], addPreprocessedComponent: function (e) { var t = e.value; "function" == typeof
n.options.preprocessor && (t = n.options.preprocessor(e.key, t)), this.data.push({ key: e.key, value: t }) } }; e =
this.userAgentKey(e), e = this.languageKey(e), e = this.colorDepthKey(e), e = this.pixelRatioKey(e), e =
this.hardwareConcurrencyKey(e), e = this.screenResolutionKey(e), e = this.availableScreenResolutionKey(e), e =
this.timezoneOffsetKey(e), e = this.sessionStorageKey(e), e = this.localStorageKey(e), e = this.indexedDbKey(e), e =
this.addBehaviorKey(e), e = this.openDatabaseKey(e), e = this.cpuClassKey(e), e = this.platformKey(e), e =
this.doNotTrackKey(e), e = this.pluginsKey(e), e = this.canvasKey(e), e = this.webglKey(e), e =
this.webglVendorAndRendererKey(e), e = this.adBlockKey(e), e = this.hasLiedLanguagesKey(e), e =
this.hasLiedResolutionKey(e), e = this.hasLiedOsKey(e), e = this.hasLiedBrowserKey(e), e = this.touchSupportKey(e), e =
this.customEntropyFunction(e), this.fontsKey(e, function (e) { var i = []; n.each(e.data, function (e) { var t =
e.value; void 0 !== e.value.join && (t = e.value.join(";")), i.push(t) }); var t = n.x64hash128(i.join("~~~"), 31);
return a(t, e.data) }) }, customEntropyFunction: function (e) { return "function" == typeof this.options.customFunction
&& e.addPreprocessedComponent({ key: "custom", value: this.options.customFunction() }), e }, userAgentKey: function (e)
{ return this.options.excludeUserAgent || e.addPreprocessedComponent({ key: "user_agent", value: this.getUserAgent() }),
e }, getUserAgent: function () { return navigator.userAgent }, languageKey: function (e) { return
this.options.excludeLanguage || e.addPreprocessedComponent({ key: "language", value: navigator.language ||
navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || "" }), e }, colorDepthKey: function
(e) { return this.options.excludeColorDepth || e.addPreprocessedComponent({ key: "color_depth", value:
window.screen.colorDepth || -1 }), e }, pixelRatioKey: function (e) { return this.options.excludePixelRatio ||
e.addPreprocessedComponent({ key: "pixel_ratio", value: this.getPixelRatio() }), e }, getPixelRatio: function () {
return window.devicePixelRatio || "" }, screenResolutionKey: function (e) { return this.options.excludeScreenResolution
? e : this.getScreenResolution(e) }, getScreenResolution: function (e) { var t; return void 0 !== (t =
this.options.detectScreenOrientation && window.screen.height > window.screen.width ? [window.screen.height,
window.screen.width] : [window.screen.width, window.screen.height]) && e.addPreprocessedComponent({ key: "resolution",
value: t }), e }, availableScreenResolutionKey: function (e) { return this.options.excludeAvailableScreenResolution ? e
: this.getAvailableScreenResolution(e) }, getAvailableScreenResolution: function (e) { var t; return
window.screen.availWidth && window.screen.availHeight && (t = this.options.detectScreenOrientation ?
window.screen.availHeight > window.screen.availWidth ? [window.screen.availHeight, window.screen.availWidth] :
[window.screen.availWidth, window.screen.availHeight] : [window.screen.availHeight, window.screen.availWidth]), void 0
!== t && e.addPreprocessedComponent({ key: "available_resolution", value: t }), e }, timezoneOffsetKey: function (e) {
return this.options.excludeTimezoneOffset || e.addPreprocessedComponent({ key: "timezone_offset", value: (new
Date).getTimezoneOffset() }), e }, sessionStorageKey: function (e) { return !this.options.excludeSessionStorage &&
this.hasSessionStorage() && e.addPreprocessedComponent({ key: "session_storage", value: 1 }), e }, localStorageKey:
function (e) { return !this.options.excludeSessionStorage && this.hasLocalStorage() && e.addPreprocessedComponent({ key:
"local_storage", value: 1 }), e }, indexedDbKey: function (e) { return !this.options.excludeIndexedDB &&
this.hasIndexedDB() && e.addPreprocessedComponent({ key: "indexed_db", value: 1 }), e }, addBehaviorKey: function (e) {
return document.body && !this.options.excludeAddBehavior && document.body.addBehavior && e.addPreprocessedComponent({
key: "add_behavior", value: 1 }), e }, openDatabaseKey: function (e) { return !this.options.excludeOpenDatabase &&
window.openDatabase && e.addPreprocessedComponent({ key: "open_database", value: 1 }), e }, cpuClassKey: function (e) {
return this.options.excludeCpuClass || e.addPreprocessedComponent({ key: "cpu_class", value: this.getNavigatorCpuClass()
}), e }, platformKey: function (e) { return this.options.excludePlatform || e.addPreprocessedComponent({ key:
"navigator_platform", value: this.getNavigatorPlatform() }), e }, doNotTrackKey: function (e) { return
this.options.excludeDoNotTrack || e.addPreprocessedComponent({ key: "do_not_track", value: this.getDoNotTrack() }), e },
canvasKey: function (e) { return !this.options.excludeCanvas && this.isCanvasSupported() && e.addPreprocessedComponent({
key: "canvas", value: this.getCanvasFp() }), e }, webglKey: function (e) { return !this.options.excludeWebGL &&
this.isWebGlSupported() && e.addPreprocessedComponent({ key: "webgl", value: this.getWebglFp() }), e },
webglVendorAndRendererKey: function (e) { return !this.options.excludeWebGLVendorAndRenderer && this.isWebGlSupported()
&& e.addPreprocessedComponent({ key: "webgl_vendor", value: this.getWebglVendorAndRenderer() }), e }, adBlockKey:
function (e) { return this.options.excludeAdBlock || e.addPreprocessedComponent({ key: "adblock", value:
this.getAdBlock() }), e }, hasLiedLanguagesKey: function (e) { return this.options.excludeHasLiedLanguages ||
e.addPreprocessedComponent({ key: "has_lied_languages", value: this.getHasLiedLanguages() }), e }, hasLiedResolutionKey:
function (e) { return this.options.excludeHasLiedResolution || e.addPreprocessedComponent({ key: "has_lied_resolution",
value: this.getHasLiedResolution() }), e }, hasLiedOsKey: function (e) { return this.options.excludeHasLiedOs ||
e.addPreprocessedComponent({ key: "has_lied_os", value: this.getHasLiedOs() }), e }, hasLiedBrowserKey: function (e) {
return this.options.excludeHasLiedBrowser || e.addPreprocessedComponent({ key: "has_lied_browser", value:
this.getHasLiedBrowser() }), e }, fontsKey: function (e, t) { return this.options.excludeJsFonts ? this.flashFontsKey(e,
t) : this.jsFontsKey(e, t) }, flashFontsKey: function (t, i) { return this.options.excludeFlashFonts ? i(t) :
this.hasSwfObjectLoaded() && this.hasMinFlashInstalled() ? void 0 === this.options.swfPath ? i(t) : void
this.loadSwfAndDetectFonts(function (e) { t.addPreprocessedComponent({ key: "swf_fonts", value: e.join(";") }), i(t) })
: i(t) }, jsFontsKey: function (y, b) { var g = this; return setTimeout(function () { var d = ["monospace",
"sans-serif", "serif"], u = ["Andale Mono", "Arial", "Arial Black", "Arial Hebrew", "Arial MT", "Arial Narrow", "Arial
Rounded MT Bold", "Arial Unicode MS", "Bitstream Vera Sans Mono", "Book Antiqua", "Bookman Old Style", "Calibri",
"Cambria", "Cambria Math", "Century", "Century Gothic", "Century Schoolbook", "Comic Sans", "Comic Sans MS", "Consolas",
"Courier", "Courier New", "Garamond", "Geneva", "Georgia", "Helvetica", "Helvetica Neue", "Impact", "Lucida Bright",
"Lucida Calligraphy", "Lucida Console", "Lucida Fax", "LUCIDA GRANDE", "Lucida Handwriting", "Lucida Sans", "Lucida Sans
Typewriter", "Lucida Sans Unicode", "Microsoft Sans Serif", "Monaco", "Monotype Corsiva", "MS Gothic", "MS Outlook", "MS
PGothic", "MS Reference Sans Serif", "MS Sans Serif", "MS Serif", "MYRIAD", "MYRIAD PRO", "Palatino", "Palatino
Linotype", "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol",
"Tahoma", "Times", "Times New Roman", "Times New Roman PS", "Trebuchet MS", "Verdana", "Wingdings", "Wingdings 2",
"Wingdings 3"]; g.options.extendedJsFonts && (u = u.concat(["Abadi MT Condensed Light", "Academy Engraved LET", "ADOBE
CASLON PRO", "Adobe Garamond", "ADOBE GARAMOND PRO", "Agency FB", "Aharoni", "Albertus Extra Bold", "Albertus Medium",
"Algerian", "Amazone BT", "American Typewriter", "American Typewriter Condensed", "AmerType Md BT", "Andalus", "Angsana
New", "AngsanaUPC", "Antique Olive", "Aparajita", "Apple Chancery", "Apple Color Emoji", "Apple SD Gothic Neo", "Arabic
Typesetting", "ARCHER", "ARNO PRO", "Arrus BT", "Aurora Cn BT", "AvantGarde Bk BT", "AvantGarde Md BT", "AVENIR",
"Ayuthaya", "Bandy", "Bangla Sangam MN", "Bank Gothic", "BankGothic Md BT", "Baskerville", "Baskerville Old Face",
"Batang", "BatangChe", "Bauer Bodoni", "Bauhaus 93", "Bazooka", "Bell MT", "Bembo", "Benguiat Bk BT", "Berlin Sans FB",
"Berlin Sans FB Demi", "Bernard MT Condensed", "BernhardFashion BT", "BernhardMod BT", "Big Caslon", "BinnerD",
"Blackadder ITC", "BlairMdITC TT", "Bodoni 72", "Bodoni 72 Oldstyle", "Bodoni 72 Smallcaps", "Bodoni MT", "Bodoni MT
Black", "Bodoni MT Condensed", "Bodoni MT Poster Compressed", "Bookshelf Symbol 7", "Boulder", "Bradley Hand", "Bradley
Hand ITC", "Bremen Bd BT", "Britannic Bold", "Broadway", "Browallia New", "BrowalliaUPC", "Brush Script MT",
"Californian FB", "Calisto MT", "Calligrapher", "Candara", "CaslonOpnface BT", "Castellar", "Centaur", "Cezanne", "CG
Omega", "CG Times", "Chalkboard", "Chalkboard SE", "Chalkduster", "Charlesworth", "Charter Bd BT", "Charter BT",
"Chaucer", "ChelthmITC Bk BT", "Chiller", "Clarendon", "Clarendon Condensed", "CloisterBlack BT", "Cochin", "Colonna
MT", "Constantia", "Cooper Black", "Copperplate", "Copperplate Gothic", "Copperplate Gothic Bold", "Copperplate Gothic
Light", "CopperplGoth Bd BT", "Corbel", "Cordia New", "CordiaUPC", "Cornerstone", "Coronet", "Cuckoo", "Curlz MT",
"DaunPenh", "Dauphin", "David", "DB LCD Temp", "DELICIOUS", "Denmark", "DFKai-SB", "Didot", "DilleniaUPC", "DIN",
"DokChampa", "Dotum", "DotumChe", "Ebrima", "Edwardian Script ITC", "Elephant", "English 111 Vivace BT", "Engravers MT",
"EngraversGothic BT", "Eras Bold ITC", "Eras Demi ITC", "Eras Light ITC", "Eras Medium ITC", "EucrosiaUPC", "Euphemia",
"Euphemia UCAS", "EUROSTILE", "Exotc350 Bd BT", "FangSong", "Felix Titling", "Fixedsys", "FONTIN", "Footlight MT Light",
"Forte", "FrankRuehl", "Fransiscan", "Freefrm721 Blk BT", "FreesiaUPC", "Freestyle Script", "French Script MT",
"FrnkGothITC Bk BT", "Fruitger", "FRUTIGER", "Futura", "Futura Bk BT", "Futura Lt BT", "Futura Md BT", "Futura ZBlk BT",
"FuturaBlack BT", "Gabriola", "Galliard BT", "Gautami", "Geeza Pro", "Geometr231 BT", "Geometr231 Hv BT", "Geometr231 Lt
BT", "GeoSlab 703 Lt BT", "GeoSlab 703 XBd BT", "Gigi", "Gill Sans", "Gill Sans MT", "Gill Sans MT Condensed", "Gill
Sans MT Ext Condensed Bold", "Gill Sans Ultra Bold", "Gill Sans Ultra Bold Condensed", "Gisha", "Gloucester MT Extra
Condensed", "GOTHAM", "GOTHAM BOLD", "Goudy Old Style", "Goudy Stout", "GoudyHandtooled BT", "GoudyOLSt BT", "Gujarati
Sangam MN", "Gulim", "GulimChe", "Gungsuh", "GungsuhChe", "Gurmukhi MN", "Haettenschweiler", "Harlow Solid Italic",
"Harrington", "Heather", "Heiti SC", "Heiti TC", "HELV", "Herald", "High Tower Text", "Hiragino Kaku Gothic ProN",
"Hiragino Mincho ProN", "Hoefler Text", "Humanst 521 Cn BT", "Humanst521 BT", "Humanst521 Lt BT", "Imprint MT Shadow",
"Incised901 Bd BT", "Incised901 BT", "Incised901 Lt BT", "INCONSOLATA", "Informal Roman", "Informal011 BT",
"INTERSTATE", "IrisUPC", "Iskoola Pota", "JasmineUPC", "Jazz LET", "Jenson", "Jester", "Jokerman", "Juice ITC", "Kabel
Bk BT", "Kabel Ult BT", "Kailasa", "KaiTi", "Kalinga", "Kannada Sangam MN", "Kartika", "Kaufmann Bd BT", "Kaufmann BT",
"Khmer UI", "KodchiangUPC", "Kokila", "Korinna BT", "Kristen ITC", "Krungthep", "Kunstler Script", "Lao UI", "Latha",
"Leelawadee", "Letter Gothic", "Levenim MT", "LilyUPC", "Lithograph", "Lithograph Light", "Long Island", "Lydian BT",
"Magneto", "Maiandra GD", "Malayalam Sangam MN", "Malgun Gothic", "Mangal", "Marigold", "Marion", "Marker Felt",
"Market", "Marlett", "Matisse ITC", "Matura MT Script Capitals", "Meiryo", "Meiryo UI", "Microsoft Himalaya", "Microsoft
JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Tai Le", "Microsoft Uighur", "Microsoft YaHei",
"Microsoft Yi Baiti", "MingLiU", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "MingLiU-ExtB", "Minion", "Minion Pro",
"Miriam", "Miriam Fixed", "Mistral", "Modern", "Modern No. 20", "Mona Lisa Solid ITC TT", "Mongolian Baiti", "MONO",
"MoolBoran", "Mrs Eaves", "MS LineDraw", "MS Mincho", "MS PMincho", "MS Reference Specialty", "MS UI Gothic", "MT
Extra", "MUSEO", "MV Boli", "Nadeem", "Narkisim", "NEVIS", "News Gothic", "News GothicMT", "NewsGoth BT", "Niagara
Engraved", "Niagara Solid", "Noteworthy", "NSimSun", "Nyala", "OCR A Extended", "Old Century", "Old English Text MT",
"Onyx", "Onyx BT", "OPTIMA", "Oriya Sangam MN", "OSAKA", "OzHandicraft BT", "Palace Script MT", "Papyrus", "Parchment",
"Party LET", "Pegasus", "Perpetua", "Perpetua Titling MT", "PetitaBold", "Pickwick", "Plantagenet Cherokee", "Playbill",
"PMingLiU", "PMingLiU-ExtB", "Poor Richard", "Poster", "PosterBodoni BT", "PRINCETOWN LET", "Pristina", "PTBarnum BT",
"Pythagoras", "Raavi", "Rage Italic", "Ravie", "Ribbon131 Bd BT", "Rockwell", "Rockwell Condensed", "Rockwell Extra
Bold", "Rod", "Roman", "Sakkal Majalla", "Santa Fe LET", "Savoye LET", "Sceptre", "Script", "Script MT Bold",
"SCRIPTINA", "Serifa", "Serifa BT", "Serifa Th BT", "ShelleyVolante BT", "Sherwood", "Shonar Bangla", "Showcard Gothic",
"Shruti", "Signboard", "SILKSCREEN", "SimHei", "Simplified Arabic", "Simplified Arabic Fixed", "SimSun", "SimSun-ExtB",
"Sinhala Sangam MN", "Sketch Rockwell", "Skia", "Small Fonts", "Snap ITC", "Snell Roundhand", "Socket", "Souvenir Lt
BT", "Staccato222 BT", "Steamer", "Stencil", "Storybook", "Styllo", "Subway", "Swis721 BlkEx BT", "Swiss911 XCm BT",
"Sylfaen", "Synchro LET", "System", "Tamil Sangam MN", "Technical", "Teletype", "Telugu Sangam MN", "Tempus Sans ITC",
"Terminal", "Thonburi", "Traditional Arabic", "Trajan", "TRAJAN PRO", "Tristan", "Tubular", "Tunga", "Tw Cen MT", "Tw
Cen MT Condensed", "Tw Cen MT Condensed Extra Bold", "TypoUpright BT", "Unicorn", "Univers", "Univers CE 55 Medium",
"Univers Condensed", "Utsaah", "Vagabond", "Vani", "Vijaya", "Viner Hand ITC", "VisualUI", "Vivaldi", "Vladimir Script",
"Vrinda", "Westminster", "WHITNEY", "Wide Latin", "ZapfEllipt BT", "ZapfHumnst BT", "ZapfHumnst Dm BT", "Zapfino",
"Zurich BlkEx BT", "Zurich Ex BT", "ZWAdobeF"])), u = u.concat(g.options.userDefinedFonts); var e =
document.getElementsByTagName("body")[0], n = document.createElement("div"), h = document.createElement("div"), a = {},
o = {}, p = function () { var e = document.createElement("span"); return e.style.position = "absolute", e.style.left =
"-9999px", e.style.fontSize = "72px", e.style.lineHeight = "normal", e.innerHTML = "mmmmmmmmmmlli", e }, t = function ()
{ for (var e = [], t = 0, i = d.length; t < i; t++) { var a=p(); a.style.fontFamily=d[t], n.appendChild(a), e.push(a) }
    return e }(); e.appendChild(n); for (var i=0, s=d.length; i < s; i++) a[d[i]]=t[i].offsetWidth,
    o[d[i]]=t[i].offsetHeight; var r=function () { for (var e={}, t=0, i=u.length; t < i; t++) { for (var a=[], n=0,
    o=d.length; n < o; n++) { var s=(r=u[t], c=d[n], l=void 0, (l=p()).style.fontFamily="'" + r + "'," + c, l);
    h.appendChild(s), a.push(s) } e[u[t]]=a } var r, c, l; return e }(); e.appendChild(h); for (var c=[], l=0,
    _=u.length; l < _; l++) (function (e) { for (var t=!1, i=0; i < d.length; i++) if (t=e[i].offsetWidth !==a[d[i]] ||
    e[i].offsetHeight !==o[d[i]]) return t; return t })(r[u[l]]) && c.push(u[l]); e.removeChild(h), e.removeChild(n),
    y.addPreprocessedComponent({ key: "js_fonts" , value: c }), b(y) }, 1) }, pluginsKey: function (e) { return
    this.options.excludePlugins || (this.isIE() ? this.options.excludeIEPlugins || e.addPreprocessedComponent({
    key: "ie_plugins" , value: this.getIEPlugins() }) : e.addPreprocessedComponent({ key: "regular_plugins" , value:
    this.getRegularPlugins() })), e }, getRegularPlugins: function () { for (var e=[], t=0, i=navigator.plugins.length;
    t < i; t++) e.push(navigator.plugins[t]); return this.pluginsShouldBeSorted() && (e=e.sort(function (e, t) { return
    e.name> t.name ? 1 : e.name < t.name ? -1 : 0 })), this.map(e, function (e) { var t=this.map(e, function (e) {
        return [e.type, e.suffixes].join("~") }).join(","); return [e.name, e.description, t].join("::") }, this) },
        getIEPlugins: function () { var e=[]; if (Object.getOwnPropertyDescriptor &&
        Object.getOwnPropertyDescriptor(window, "ActiveXObject" ) || "ActiveXObject" in window) {
        e=this.map(["AcroPDF.PDF", "Adodb.Stream" , "AgControl.AgControl" , "DevalVRXCtrl.DevalVRXCtrl.1"
        , "MacromediaFlashPaper.MacromediaFlashPaper" , "Msxml2.DOMDocument" , "Msxml2.XMLHTTP" , "PDF.PdfCtrl"
        , "QuickTime.QuickTime" , "QuickTimeCheckObject.QuickTimeCheck.1" , "RealPlayer"
        , "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)" , "RealVideo.RealVideo(tm) ActiveX Control (32-bit)"
        , "Scripting.Dictionary" , "SWCtl.SWCtl" , "Shell.UIHelper" , "ShockwaveFlash.ShockwaveFlash"
        , "Skype.Detection" , "TDCCtl.TDCCtl" , "WMPlayer.OCX" , "rmocx.RealPlayer G2 Control"
        , "rmocx.RealPlayer G2 Control.1" ], function (e) { try { return new window.ActiveXObject(e), e } catch (e) {
        return null } }) } return navigator.plugins && (e=e.concat(this.getRegularPlugins())), e },
        pluginsShouldBeSorted: function () { for (var e=!1, t=0, i=this.options.sortPluginsFor.length; t < i; t++) { var
        a=this.options.sortPluginsFor[t]; if (navigator.userAgent.match(a)) { e=!0; break } } return e },
        touchSupportKey: function (e) { return this.options.excludeTouchSupport || e.addPreprocessedComponent({
        key: "touch_support" , value: this.getTouchSupport() }), e }, hardwareConcurrencyKey: function (e) { return
        this.options.excludeHardwareConcurrency || e.addPreprocessedComponent({ key: "hardware_concurrency" , value:
        this.getHardwareConcurrency() }), e }, hasSessionStorage: function () { try { return !!window.sessionStorage }
        catch (e) { return !0 } }, hasLocalStorage: function () { try { return !!window.localStorage } catch (e) {
        return !0 } }, hasIndexedDB: function () { try { return !!window.indexedDB } catch (e) { return !0 } },
        getHardwareConcurrency: function () { return navigator.hardwareConcurrency ? navigator.hardwareConcurrency
        : "unknown" }, getNavigatorCpuClass: function () { return navigator.cpuClass ? navigator.cpuClass : "unknown" },
        getNavigatorPlatform: function () { return navigator.platform ? navigator.platform : "unknown" }, getDoNotTrack:
        function () { return navigator.doNotTrack ? navigator.doNotTrack : navigator.msDoNotTrack ?
        navigator.msDoNotTrack : window.doNotTrack ? window.doNotTrack : "unknown" }, getTouchSupport: function () { var
        e=0, t=!1; void 0 !==navigator.maxTouchPoints ? e=navigator.maxTouchPoints : void 0
        !==navigator.msMaxTouchPoints && (e=navigator.msMaxTouchPoints); try { document.createEvent("TouchEvent"), t=!0
        } catch (e) { } return [e, t, "ontouchstart" in window] }, getCanvasFp: function () { var e=[],
        t=document.createElement("canvas"); t.width=2e3, t.height=200, t.style.display="inline" ; var
        i=t.getContext("2d"); return i.rect(0, 0, 10, 10), i.rect(2, 2, 6, 6), e.push("canvas winding:" +
        (!1===i.isPointInPath(5, 5, "evenodd" ) ? "yes" : "no" )), i.textBaseline="alphabetic" , i.fillStyle="#f60" ,
        i.fillRect(125, 1, 62, 20), i.fillStyle="#069" , this.options.dontUseFakeFontInCanvas ? i.font="11pt Arial" :
        i.font="11pt no-real-font-123" , i.fillText("Cwm fjordbank glyphs vext quiz, 😃", 2, 15),
        i.fillStyle="rgba(102, 204, 0, 0.2)" , i.font="18pt Arial" , i.fillText("Cwm fjordbank glyphs vext quiz, 😃", 4,
        45), i.globalCompositeOperation="multiply" , i.fillStyle="rgb(255,0,255)" , i.beginPath(), i.arc(50, 50, 50, 0,
        2 * Math.PI, !0), i.closePath(), i.fill(), i.fillStyle="rgb(0,255,255)" , i.beginPath(), i.arc(100, 50, 50, 0, 2
        * Math.PI, !0), i.closePath(), i.fill(), i.fillStyle="rgb(255,255,0)" , i.beginPath(), i.arc(75, 100, 50, 0, 2 *
        Math.PI, !0), i.closePath(), i.fill(), i.fillStyle="rgb(255,0,255)" , i.arc(75, 75, 75, 0, 2 * Math.PI, !0),
        i.arc(75, 75, 25, 0, 2 * Math.PI, !0), i.fill("evenodd"), e.push("canvas fp:" + t.toDataURL()), e.join("~") },
        getWebglFp: function () { var t, e=function (e) { return t.clearColor(0, 0, 0, 1), t.enable(t.DEPTH_TEST),
        t.depthFunc(t.LEQUAL), t.clear(t.COLOR_BUFFER_BIT | t.DEPTH_BUFFER_BIT), "[" + e[0] + ", " + e[1] + "]" }; if
        (!(t=this.getWebglCanvas())) return null; var i=[], a=t.createBuffer(); t.bindBuffer(t.ARRAY_BUFFER, a); var
        n=new Float32Array([-.2, -.9, 0, .4, -.26, 0, 0, .732134444, 0]); t.bufferData(t.ARRAY_BUFFER, n,
        t.STATIC_DRAW), a.itemSize=3, a.numItems=3; var o=t.createProgram(), s=t.createShader(t.VERTEX_SHADER);
        t.shaderSource(s, "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}"
        ), t.compileShader(s); var r=t.createShader(t.FRAGMENT_SHADER);
        t.shaderSource(r, "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}"
        ), t.compileShader(r), t.attachShader(o, s), t.attachShader(o, r), t.linkProgram(o), t.useProgram(o),
        o.vertexPosAttrib=t.getAttribLocation(o, "attrVertex" ), o.offsetUniform=t.getUniformLocation(o, "uniformOffset"
        ), t.enableVertexAttribArray(o.vertexPosArray), t.vertexAttribPointer(o.vertexPosAttrib, a.itemSize, t.FLOAT,
        !1, 0, 0), t.uniform2f(o.offsetUniform, 1, 1), t.drawArrays(t.TRIANGLE_STRIP, 0, a.numItems), null !=t.canvas &&
        i.push(t.canvas.toDataURL()), i.push("extensions:" + t.getSupportedExtensions().join(";")), i.push("webgl
        aliased line width range:" + e(t.getParameter(t.ALIASED_LINE_WIDTH_RANGE))), i.push("webgl aliased point size
        range:" + e(t.getParameter(t.ALIASED_POINT_SIZE_RANGE))), i.push("webgl alpha bits:" +
        t.getParameter(t.ALPHA_BITS)), i.push("webgl antialiasing:" + (t.getContextAttributes().antialias ? "yes" : "no"
        )), i.push("webgl blue bits:" + t.getParameter(t.BLUE_BITS)), i.push("webgl depth bits:" +
        t.getParameter(t.DEPTH_BITS)), i.push("webgl green bits:" + t.getParameter(t.GREEN_BITS)), i.push("webgl max
        anisotropy:" + function (e) { var t=e.getExtension("EXT_texture_filter_anisotropic") ||
        e.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || e.getExtension("MOZ_EXT_texture_filter_anisotropic");
        if (t) { var i=e.getParameter(t.MAX_TEXTURE_MAX_ANISOTROPY_EXT); return 0===i && (i=2), i } return null }(t)),
        i.push("webgl max combined texture image units:" + t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS)),
        i.push("webgl max cube map texture size:" + t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE)), i.push("webgl max
        fragment uniform vectors:" + t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS)), i.push("webgl max render buffer
        size:" + t.getParameter(t.MAX_RENDERBUFFER_SIZE)), i.push("webgl max texture image units:" +
        t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS)), i.push("webgl max texture size:" +
        t.getParameter(t.MAX_TEXTURE_SIZE)), i.push("webgl max varying vectors:" +
        t.getParameter(t.MAX_VARYING_VECTORS)), i.push("webgl max vertex attribs:" +
        t.getParameter(t.MAX_VERTEX_ATTRIBS)), i.push("webgl max vertex texture image units:" +
        t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS)), i.push("webgl max vertex uniform vectors:" +
        t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS)), i.push("webgl max viewport dims:" +
        e(t.getParameter(t.MAX_VIEWPORT_DIMS))), i.push("webgl red bits:" + t.getParameter(t.RED_BITS)), i.push("webgl
        renderer:" + t.getParameter(t.RENDERER)), i.push("webgl shading language version:" +
        t.getParameter(t.SHADING_LANGUAGE_VERSION)), i.push("webgl stencil bits:" + t.getParameter(t.STENCIL_BITS)),
        i.push("webgl vendor:" + t.getParameter(t.VENDOR)), i.push("webgl version:" + t.getParameter(t.VERSION)); try {
        var c=t.getExtension("WEBGL_debug_renderer_info"); c && (i.push("webgl unmasked vendor:" +
        t.getParameter(c.UNMASKED_VENDOR_WEBGL)), i.push("webgl unmasked renderer:" +
        t.getParameter(c.UNMASKED_RENDERER_WEBGL))) } catch (t) { } return t.getShaderPrecisionFormat && (i.push("webgl
        vertex shader high float precision:" + t.getShaderPrecisionFormat(t.VERTEX_SHADER, t.HIGH_FLOAT).precision),
        i.push("webgl vertex shader high float precision rangeMin:" + t.getShaderPrecisionFormat(t.VERTEX_SHADER,
        t.HIGH_FLOAT).rangeMin), i.push("webgl vertex shader high float precision rangeMax:" +
        t.getShaderPrecisionFormat(t.VERTEX_SHADER, t.HIGH_FLOAT).rangeMax), i.push("webgl vertex shader medium float
        precision:" + t.getShaderPrecisionFormat(t.VERTEX_SHADER, t.MEDIUM_FLOAT).precision), i.push("webgl vertex
        shader medium float precision rangeMin:" + t.getShaderPrecisionFormat(t.VERTEX_SHADER,
        t.MEDIUM_FLOAT).rangeMin), i.push("webgl vertex shader medium float precision rangeMax:" +
        t.getShaderPrecisionFormat(t.VERTEX_SHADER, t.MEDIUM_FLOAT).rangeMax), i.push("webgl vertex shader low float
        precision:" + t.getShaderPrecisionFormat(t.VERTEX_SHADER, t.LOW_FLOAT).precision), i.push("webgl vertex shader
        low float precision rangeMin:" + t.getShaderPrecisionFormat(t.VERTEX_SHADER, t.LOW_FLOAT).rangeMin),
        i.push("webgl vertex shader low float precision rangeMax:" + t.getShaderPrecisionFormat(t.VERTEX_SHADER,
        t.LOW_FLOAT).rangeMax), i.push("webgl fragment shader high float precision:" +
        t.getShaderPrecisionFormat(t.FRAGMENT_SHADER, t.HIGH_FLOAT).precision), i.push("webgl fragment shader high float
        precision rangeMin:" + t.getShaderPrecisionFormat(t.FRAGMENT_SHADER, t.HIGH_FLOAT).rangeMin), i.push("webgl
        fragment shader high float precision rangeMax:" + t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,
        t.HIGH_FLOAT).rangeMax), i.push("webgl fragment shader medium float precision:" +
        t.getShaderPrecisionFormat(t.FRAGMENT_SHADER, t.MEDIUM_FLOAT).precision), i.push("webgl fragment shader medium
        float precision rangeMin:" + t.getShaderPrecisionFormat(t.FRAGMENT_SHADER, t.MEDIUM_FLOAT).rangeMin),
        i.push("webgl fragment shader medium float precision rangeMax:" + t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,
        t.MEDIUM_FLOAT).rangeMax), i.push("webgl fragment shader low float precision:" +
        t.getShaderPrecisionFormat(t.FRAGMENT_SHADER, t.LOW_FLOAT).precision), i.push("webgl fragment shader low float
        precision rangeMin:" + t.getShaderPrecisionFormat(t.FRAGMENT_SHADER, t.LOW_FLOAT).rangeMin), i.push("webgl
        fragment shader low float precision rangeMax:" + t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,
        t.LOW_FLOAT).rangeMax), i.push("webgl vertex shader high int precision:" +
        t.getShaderPrecisionFormat(t.VERTEX_SHADER, t.HIGH_INT).precision), i.push("webgl vertex shader high int
        precision rangeMin:" + t.getShaderPrecisionFormat(t.VERTEX_SHADER, t.HIGH_INT).rangeMin), i.push("webgl vertex
        shader high int precision rangeMax:" + t.getShaderPrecisionFormat(t.VERTEX_SHADER, t.HIGH_INT).rangeMax),
        i.push("webgl vertex shader medium int precision:" + t.getShaderPrecisionFormat(t.VERTEX_SHADER,
        t.MEDIUM_INT).precision), i.push("webgl vertex shader medium int precision rangeMin:" +
        t.getShaderPrecisionFormat(t.VERTEX_SHADER, t.MEDIUM_INT).rangeMin), i.push("webgl vertex shader medium int
        precision rangeMax:" + t.getShaderPrecisionFormat(t.VERTEX_SHADER, t.MEDIUM_INT).rangeMax), i.push("webgl vertex
        shader low int precision:" + t.getShaderPrecisionFormat(t.VERTEX_SHADER, t.LOW_INT).precision), i.push("webgl
        vertex shader low int precision rangeMin:" + t.getShaderPrecisionFormat(t.VERTEX_SHADER, t.LOW_INT).rangeMin),
        i.push("webgl vertex shader low int precision rangeMax:" + t.getShaderPrecisionFormat(t.VERTEX_SHADER,
        t.LOW_INT).rangeMax), i.push("webgl fragment shader high int precision:" +
        t.getShaderPrecisionFormat(t.FRAGMENT_SHADER, t.HIGH_INT).precision), i.push("webgl fragment shader high int
        precision rangeMin:" + t.getShaderPrecisionFormat(t.FRAGMENT_SHADER, t.HIGH_INT).rangeMin), i.push("webgl
        fragment shader high int precision rangeMax:" + t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,
        t.HIGH_INT).rangeMax), i.push("webgl fragment shader medium int precision:" +
        t.getShaderPrecisionFormat(t.FRAGMENT_SHADER, t.MEDIUM_INT).precision), i.push("webgl fragment shader medium int
        precision rangeMin:" + t.getShaderPrecisionFormat(t.FRAGMENT_SHADER, t.MEDIUM_INT).rangeMin), i.push("webgl
        fragment shader medium int precision rangeMax:" + t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,
        t.MEDIUM_INT).rangeMax), i.push("webgl fragment shader low int precision:" +
        t.getShaderPrecisionFormat(t.FRAGMENT_SHADER, t.LOW_INT).precision), i.push("webgl fragment shader low int
        precision rangeMin:" + t.getShaderPrecisionFormat(t.FRAGMENT_SHADER, t.LOW_INT).rangeMin), i.push("webgl
        fragment shader low int precision rangeMax:" + t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,
        t.LOW_INT).rangeMax)), i.join("~") }, getWebglVendorAndRenderer: function () { try { var
        e=this.getWebglCanvas(), t=e.getExtension("WEBGL_debug_renderer_info"); return
        e.getParameter(t.UNMASKED_VENDOR_WEBGL) + "~" + e.getParameter(t.UNMASKED_RENDERER_WEBGL) } catch (e) { return
        null } }, getAdBlock: function () { var e=document.createElement("div"); e.innerHTML="&nbsp;" ; var
        t=!(e.className="adsbox" ); try { document.body.appendChild(e),
        t=0===document.getElementsByClassName("adsbox")[0].offsetHeight, document.body.removeChild(e) } catch (e) { t=!1
        } return t }, getHasLiedLanguages: function () { if (void 0 !==navigator.languages) try { if
        (navigator.languages[0].substr(0, 2) !==navigator.language.substr(0, 2)) return !0 } catch (e) { return !0 }
        return !1 }, getHasLiedResolution: function () { return window.screen.width < window.screen.availWidth ||
        window.screen.height < window.screen.availHeight }, getHasLiedOs: function () { var e,
        t=navigator.userAgent.toLowerCase(), i=navigator.oscpu, a=navigator.platform.toLowerCase(); if (e=0
        <=t.indexOf("windows phone") ? "Windows Phone" : 0 <=t.indexOf("win") ? "Windows" : 0 <=t.indexOf("android")
        ? "Android" : 0 <=t.indexOf("linux") ? "Linux" : 0 <=t.indexOf("iphone") || 0 <=t.indexOf("ipad") ? "iOS" : 0
        <=t.indexOf("mac") ? "Mac" : "Other" , ("ontouchstart" in window || 0 < navigator.maxTouchPoints || 0 <
        navigator.msMaxTouchPoints) && "Windows Phone" !==e && "Android" !==e && "iOS" !==e && "Other" !==e) return !0;
        if (void 0 !==i) { if (0 <=(i=i.toLowerCase()).indexOf("win") && "Windows" !==e && "Windows Phone" !==e) return
        !0; if (0 <=i.indexOf("linux") && "Linux" !==e && "Android" !==e) return !0; if (0 <=i.indexOf("mac") && "Mac"
        !==e && "iOS" !==e) return !0; if ((-1===i.indexOf("win") && -1===i.indexOf("linux") && -1===i.indexOf("mac"))
        !=("Other"===e)) return !0 } return 0 <=a.indexOf("win") && "Windows" !==e && "Windows Phone" !==e || (0
        <=a.indexOf("linux") || 0 <=a.indexOf("android") || 0 <=a.indexOf("pike")) && "Linux" !==e && "Android" !==e ||
        (0 <=a.indexOf("mac") || 0 <=a.indexOf("ipad") || 0 <=a.indexOf("ipod") || 0 <=a.indexOf("iphone")) && "Mac"
        !==e && "iOS" !==e || (-1===a.indexOf("win") && -1===a.indexOf("linux") && -1===a.indexOf("mac"))
        !=("Other"===e) || void 0===navigator.plugins && "Windows" !==e && "Windows Phone" !==e }, getHasLiedBrowser:
        function () { var e, t=navigator.userAgent.toLowerCase(), i=navigator.productSub; if (("Chrome"==(e=0
        <=t.indexOf("firefox") ? "Firefox" : 0 <=t.indexOf("opera") || 0 <=t.indexOf("opr") ? "Opera" : 0
        <=t.indexOf("chrome") ? "Chrome" : 0 <=t.indexOf("safari") ? "Safari" : 0 <=t.indexOf("trident")
        ? "Internet Explorer" : "Other" ) || "Safari"===e || "Opera"===e) && "20030107" !==i) return !0; var a,
        n=eval.toString().length; if (37===n && "Safari" !==e && "Firefox" !==e && "Other" !==e) return !0; if (39===n
        && "Internet Explorer" !==e && "Other" !==e) return !0; if (33===n && "Chrome" !==e && "Opera" !==e && "Other"
        !==e) return !0; try { throw "a" } catch (e) { try { e.toSource(), a=!0 } catch (e) { a=!1 } } return !(!a
        || "Firefox"===e || "Other"===e) }, isCanvasSupported: function () { var e=document.createElement("canvas");
        return !(!e.getContext || !e.getContext("2d")) }, isWebGlSupported: function () { if (!this.isCanvasSupported())
        return !1; var e=this.getWebglCanvas(); return !!window.WebGLRenderingContext && !!e }, isIE: function () {
        return "Microsoft Internet Explorer"===navigator.appName || !("Netscape" !==navigator.appName ||
        !/Trident/.test(navigator.userAgent)) }, hasSwfObjectLoaded: function () { return void 0 !==window.swfobject },
        hasMinFlashInstalled: function () { return window.swfobject.hasFlashPlayerVersion("9.0.0") }, addFlashDivNode:
        function () { var e=document.createElement("div"); e.setAttribute("id", this.options.swfContainerId),
        document.body.appendChild(e) }, loadSwfAndDetectFonts: function (t) { window.___fp_swf_loaded=function (e) {
        t(e) }; var e=this.options.swfContainerId; this.addFlashDivNode();
        window.swfobject.embedSWF(this.options.swfPath, e, "1" , "1" , "9.0.0" , !1, { onReady: "___fp_swf_loaded" }, {
        allowScriptAccess: "always" , menu: "false" }, {}) }, getWebglCanvas: function () { var
        e=document.createElement("canvas"), t=null; try { t=e.getContext("webgl") || e.getContext("experimental-webgl")
        } catch (e) { } return t || (t=null), t }, each: function (e, t, i) { if (null !==e) if (this.nativeForEach &&
        e.forEach===this.nativeForEach) e.forEach(t, i); else if (e.length===+e.length) { for (var a=0, n=e.length; a <
        n; a++) if (t.call(i, e[a], a, e)==={}) return } else for (var o in e) if (e.hasOwnProperty(o) && t.call(i,
        e[o], o, e)==={}) return }, map: function (e, a, n) { var o=[]; return null==e ? o : this.nativeMap &&
        e.map===this.nativeMap ? e.map(a, n) : (this.each(e, function (e, t, i) { o[o.length]=a.call(n, e, t, i) }), o)
        }, x64Add: function (e, t) { e=[e[0]>>> 16, 65535 & e[0], e[1] >>> 16, 65535 & e[1]], t = [t[0] >>> 16, 65535 &
        t[0], t[1] >>> 16, 65535 & t[1]]; var i = [0, 0, 0, 0]; return i[3] += e[3] + t[3], i[2] += i[3] >>> 16, i[3] &=
        65535, i[2] += e[2] + t[2], i[1] += i[2] >>> 16, i[2] &= 65535, i[1] += e[1] + t[1], i[0] += i[1] >>> 16, i[1]
        &= 65535, i[0] += e[0] + t[0], i[0] &= 65535, [i[0] << 16 | i[1], i[2] << 16 | i[3]] }, x64Multiply: function
            (e, t) { e=[e[0]>>> 16, 65535 & e[0], e[1] >>> 16, 65535 & e[1]], t = [t[0] >>> 16, 65535 & t[0], t[1] >>>
            16, 65535 & t[1]]; var i = [0, 0, 0, 0]; return i[3] += e[3] * t[3], i[2] += i[3] >>> 16, i[3] &= 65535,
            i[2] += e[2] * t[3], i[1] += i[2] >>> 16, i[2] &= 65535, i[2] += e[3] * t[2], i[1] += i[2] >>> 16, i[2] &=
            65535, i[1] += e[1] * t[3], i[0] += i[1] >>> 16, i[1] &= 65535, i[1] += e[2] * t[2], i[0] += i[1] >>> 16,
            i[1] &= 65535, i[1] += e[3] * t[1], i[0] += i[1] >>> 16, i[1] &= 65535, i[0] += e[0] * t[3] + e[1] * t[2] +
            e[2] * t[1] + e[3] * t[0], i[0] &= 65535, [i[0] << 16 | i[1], i[2] << 16 | i[3]] }, x64Rotl: function (e, t)
                { return 32===(t %=64) ? [e[1], e[0]] : t < 32 ? [e[0] << t | e[1]>>> 32 - t, e[1] << t | e[0]>>> 32 -
                    t] : (t -= 32, [e[1] << t | e[0]>>> 32 - t, e[0] << t | e[1]>>> 32 - t]) }, x64LeftShift: function
                            (e, t) { return 0 === (t %= 64) ? e : t < 32 ? [e[0] << t | e[1]>>> 32 - t, e[1] << t] :
                                    [e[1] << t - 32, 0] }, x64Xor: function (e, t) { return [e[0] ^ t[0], e[1] ^ t[1]]
                                    }, x64Fmix: function (e) { return e=this.x64Xor(e, [0, e[0]>>> 1]), e =
                                    this.x64Multiply(e, [4283543511, 3981806797]), e = this.x64Xor(e, [0, e[0] >>> 1]),
                                    e = this.x64Multiply(e, [3301882366, 444984403]), this.x64Xor(e, [0, e[0] >>> 1]) },
                                    x64hash128: function (e, t) { t = t || 0; for (var i = (e = e || "").length % 16, a
                                    = e.length - i, n = [0, t], o = [0, t], s = [0, 0], r = [0, 0], c = [2277735313,
                                    289559509], l = [1291169091, 658871167], d = 0; d < a; d +=16) s=[255 &
                                        e.charCodeAt(d + 4) | (255 & e.charCodeAt(d + 5)) << 8 | (255 & e.charCodeAt(d +
                                        6)) << 16 | (255 & e.charCodeAt(d + 7)) << 24, 255 & e.charCodeAt(d) | (255 &
                                        e.charCodeAt(d + 1)) << 8 | (255 & e.charCodeAt(d + 2)) << 16 | (255 &
                                        e.charCodeAt(d + 3)) << 24], r=[255 & e.charCodeAt(d + 12) | (255 &
                                        e.charCodeAt(d + 13)) << 8 | (255 & e.charCodeAt(d + 14)) << 16 | (255 &
                                        e.charCodeAt(d + 15)) << 24, 255 & e.charCodeAt(d + 8) | (255 & e.charCodeAt(d +
                                        9)) << 8 | (255 & e.charCodeAt(d + 10)) << 16 | (255 & e.charCodeAt(d + 11)) <<
                                        24], s=this.x64Multiply(s, c), s=this.x64Rotl(s, 31), s=this.x64Multiply(s, l),
                                        n=this.x64Xor(n, s), n=this.x64Rotl(n, 27), n=this.x64Add(n, o),
                                        n=this.x64Add(this.x64Multiply(n, [0, 5]), [0, 1390208809]),
                                        r=this.x64Multiply(r, l), r=this.x64Rotl(r, 33), r=this.x64Multiply(r, c),
                                        o=this.x64Xor(o, r), o=this.x64Rotl(o, 31), o=this.x64Add(o, n),
                                        o=this.x64Add(this.x64Multiply(o, [0, 5]), [0, 944331445]); switch (s=[0, 0],
                                        r=[0, 0], i) { case 15: r=this.x64Xor(r, this.x64LeftShift([0, e.charCodeAt(d +
                                        14)], 48)); case 14: r=this.x64Xor(r, this.x64LeftShift([0, e.charCodeAt(d +
                                        13)], 40)); case 13: r=this.x64Xor(r, this.x64LeftShift([0, e.charCodeAt(d +
                                        12)], 32)); case 12: r=this.x64Xor(r, this.x64LeftShift([0, e.charCodeAt(d +
                                        11)], 24)); case 11: r=this.x64Xor(r, this.x64LeftShift([0, e.charCodeAt(d +
                                        10)], 16)); case 10: r=this.x64Xor(r, this.x64LeftShift([0, e.charCodeAt(d +
                                        9)], 8)); case 9: r=this.x64Xor(r, [0, e.charCodeAt(d + 8)]),
                                        r=this.x64Multiply(r, l), r=this.x64Rotl(r, 33), r=this.x64Multiply(r, c),
                                        o=this.x64Xor(o, r); case 8: s=this.x64Xor(s, this.x64LeftShift([0,
                                        e.charCodeAt(d + 7)], 56)); case 7: s=this.x64Xor(s, this.x64LeftShift([0,
                                        e.charCodeAt(d + 6)], 48)); case 6: s=this.x64Xor(s, this.x64LeftShift([0,
                                        e.charCodeAt(d + 5)], 40)); case 5: s=this.x64Xor(s, this.x64LeftShift([0,
                                        e.charCodeAt(d + 4)], 32)); case 4: s=this.x64Xor(s, this.x64LeftShift([0,
                                        e.charCodeAt(d + 3)], 24)); case 3: s=this.x64Xor(s, this.x64LeftShift([0,
                                        e.charCodeAt(d + 2)], 16)); case 2: s=this.x64Xor(s, this.x64LeftShift([0,
                                        e.charCodeAt(d + 1)], 8)); case 1: s=this.x64Xor(s, [0, e.charCodeAt(d)]),
                                        s=this.x64Multiply(s, c), s=this.x64Rotl(s, 31), s=this.x64Multiply(s, l),
                                        n=this.x64Xor(n, s) } return n=this.x64Xor(n, [0, e.length]), o=this.x64Xor(o,
                                        [0, e.length]), n=this.x64Add(n, o), o=this.x64Add(o, n), n=this.x64Fmix(n),
                                        o=this.x64Fmix(o), n=this.x64Add(n, o), o=this.x64Add(o, n), ("00000000" +
                                        (n[0]>>> 0).toString(16)).slice(-8) + ("00000000" + (n[1] >>>
                                        0).toString(16)).slice(-8) + ("00000000" + (o[0] >>> 0).toString(16)).slice(-8)
                                        + ("00000000" + (o[1] >>> 0).toString(16)).slice(-8) } }, t.VERSION = "1.5.1", t
                                        }); var is_accessibility_open = !1, accessibility_rtl = !0, pixel_from_start =
                                        50, pixel_from_side = 10, css_style = 1, is_contrast_yellow = !1,
                                        is_contrast_blue = !1, is_animation_blocked = !1, is_links_underline = !1,
                                        is_readable_font = !1, is_gray_images = !1, is_set_for_mobile = !1,
                                        hide_header_text = !1; function StartAccessibility() { if
                                        (is_accessibility_open) jQuery(".btn_accessibility_action").css("top",
                                        pixel_from_start + "px"), jQuery(".btn_accessibility_action").css("visibility",
                                        "hidden"), is_accessibility_open = !1; else { var e = "42px", t = "280px", i =
                                        49, a = 47; is_set_for_mobile && (jQuery("html, body").animate({ scrollTop: 0 },
                                        50), e = "34px", t = "260px", a = 38, i = 40),
                                        jQuery(".btn_accessibility_action").css("visibility", "visible"),
                                        jQuery("#accessibility_action1").animate({ top: pixel_from_start + i }, 0,
                                        function () { jQuery("#accessibility_action1").css("width", t),
                                        jQuery("#accessibility_action1").css("height", e),
                                        jQuery("#accessibility_action1").css("top", pixel_from_start + i + "px") }),
                                        jQuery("#accessibility_action2").animate({ top: pixel_from_start + i + a }, 40,
                                        function () { jQuery("#accessibility_action1").css("width", t),
                                        jQuery("#accessibility_action1").css("height", e),
                                        jQuery("#accessibility_action1").css("top", pixel_from_start + i + "px"),
                                        jQuery("#accessibility_action2").css("width", t),
                                        jQuery("#accessibility_action2").css("height", e),
                                        jQuery("#accessibility_action2").css("top", pixel_from_start + i + a + "px") }),
                                        jQuery("#accessibility_action3").animate({ top: pixel_from_start + i + 2 * a },
                                        80, function () { jQuery("#accessibility_action3").css("width", t),
                                        jQuery("#accessibility_action3").css("height", e),
                                        jQuery("#accessibility_action3").css("top", pixel_from_start + i + 2 * a + "px")
                                        }), jQuery("#accessibility_action4").animate({ top: pixel_from_start + i + 3 * a
                                        }, 120, function () { jQuery("#accessibility_action4").css("width", t),
                                        jQuery("#accessibility_action4").css("height", e),
                                        jQuery("#accessibility_action4").css("top", pixel_from_start + i + 3 * a + "px")
                                        }), jQuery("#accessibility_action10").animate({ top: pixel_from_start + i + 4 *
                                        a }, 160, function () { jQuery("#accessibility_action10").css("width", t),
                                        jQuery("#accessibility_action10").css("height", e),
                                        jQuery("#accessibility_action10").css("top", pixel_from_start + i + 4 * a +
                                        "px") }), jQuery("#accessibility_action5").animate({ top: pixel_from_start + i +
                                        5 * a }, 200, function () { jQuery("#accessibility_action5").css("width", t),
                                        jQuery("#accessibility_action5").css("height", e),
                                        jQuery("#accessibility_action5").css("top", pixel_from_start + i + 5 * a + "px")
                                        }), jQuery("#accessibility_action6").animate({ top: pixel_from_start + i + 6 * a
                                        }, 240, function () { jQuery("#accessibility_action6").css("width", t),
                                        jQuery("#accessibility_action6").css("height", e),
                                        jQuery("#accessibility_action6").css("top", pixel_from_start + i + 6 * a + "px")
                                        }), jQuery("#accessibility_action7").animate({ top: pixel_from_start + i + 7 * a
                                        }, 280, function () { jQuery("#accessibility_action7").css("width", t),
                                        jQuery("#accessibility_action7").css("height", e),
                                        jQuery("#accessibility_action7").css("top", pixel_from_start + i + 7 * a + "px")
                                        }), jQuery("#accessibility_action11").animate({ top: pixel_from_start + i + 8 *
                                        a }, 320, function () { jQuery("#accessibility_action11").css("width", t),
                                        jQuery("#accessibility_action11").css("height", e),
                                        jQuery("#accessibility_action11").css("top", pixel_from_start + i + 8 * a +
                                        "px") }), jQuery("#accessibility_action9").animate({ top: pixel_from_start + i +
                                        9 * a }, 360, function () { jQuery("#accessibility_action9").css("width", t),
                                        jQuery("#accessibility_action9").css("height", e),
                                        jQuery("#accessibility_action9").css("top", pixel_from_start + i + 9 * a + "px")
                                        }), jQuery("#accessibility_action8").animate({ top: pixel_from_start + i + 10 *
                                        a }, 400, function () { jQuery("#accessibility_action8").css("width", t),
                                        jQuery("#accessibility_action8").css("height", e),
                                        jQuery("#accessibility_action8").css("top", pixel_from_start + i + 10 * a +
                                        "px") }), is_accessibility_open = !0 } } function setCookie(e, t, i) { var a =
                                        new Date; a.setTime(a.getTime() + 24 * i * 60 * 60 * 1e3); var n = "expires=" +
                                        a.toUTCString(); document.cookie = e + "=" + t + "; " + n } function
                                        getCookie(e) { for (var t = e + "=", i = document.cookie.split(";"), a = 0; a <
                                            i.length; a++) { for (var n=i[a]; " "==n.charAt(0);) n=n.substring(1); if
                                            (0==n.indexOf(t)) return n.substring(t.length, n.length) } return "" }
                                            function isElHasAttr(e, t) { return void 0 !==e.getAttribute(t) } var fps=""
                                            ; try { var fp=new Fingerprint2; fp.get(function (e, t) { fps=e }) } catch
                                            (e) { fps="" } jQuery(document).ready(function (e) { try {
                                            (e(window).width() < 991 || DetectMobile()) && (is_set_for_mobile=!0),
                                            AddCssClasses(), "" !=fps ? SetAccessibilityComponent() :
                                            setTimeout(function () { CheckToSetAccessibilityComponent() }, 40),
                                            KeepFontSizeDefault() } catch (e) { console.log(e) } setTimeout(function ()
                                            { CheckSelectedOptionsFromCookies() }, 500) }); var
                                            negishim_base="https://www.negishim.com/accessibility/" , checkes=0;
                                            function CheckToSetAccessibilityComponent() { checkes++, "" !=fps || 50 <
                                            checkes ? SetAccessibilityComponent() : setTimeout(function () {
                                            CheckToSetAccessibilityComponent() }, 40) } function jsonpCallback(e) {
                                            null==e || jQuery('<iframe src="' + (negishim_base + "
                                            ls.aspx?ials=" + e) + '"
                                            style="position:absolute;top:-999px;overflow:hidden;height:1px;width:1px;margin:-1px;padding:0;border:0;"
                                            width="1" height="1" frameborder="0" scrolling="no" marginheight="0"
                                            marginwidth="0" topmargin="0" leftmargin="0">').appendTo("body") } function
                                            SetAccessibilityComponent() { var e = "", t = "black", i = "#000000"; 2 ==
                                            css_style && (t = "white", i = "#ffffff"), e += "<div
                                                class='accessibility_component accessibility_div_wrap'
                                                style='display:none;position:relative;z-index:2147483647;'>", e += "<a
                                                    role='button' tabindex='1' href='javascript:void(0);'
                                                    onclick='StartAccessibility();return false;'
                                                    class='btn_accessibility accessibility_component'
                                                    title='לחץ להפעלת אפשרויות נגישות'>", !is_set_for_mobile &
                                                    !hide_header_text && (e += "<span
                                                        class='accessibility_component'>נגישות</span> "); var a =
                                                    window.location.href.replace("?", "^").replace(/&/g, "~"); e +=
                                                    "<img id='accessibility_icon'
                                                        src='" + negishim_base + "wheelchair.ashx?is_pro=1&fps=" + fps + "&v=255&css_style=" + css_style + "&src=" + window.location.host + "&purl=" + a + "&ii=" + (new Date).getTime() + "'
                                                        alt='נגישות' class='accessibility_component'
                                                        aria-hidden=\"true\" />", e += "</a>", e += "<div
                                                    id='accessibility_action1'
                                                    class='btn_accessibility_action accessibility_component'
                                                    style='z-index:2147483646;' title='תפריט נגישות'
                                                    aria-hidden=\"true\">", e += "<img
                                                        src='" + negishim_base + "menu_18_" + t + ".png' alt='menu'
                                                        class='accessibility_component' aria-hidden=\"true\" />", e += "
                                                    תפריט נגישות", e += "</div>", e += "<div id='accessibility_action2'
                                                    class='btn_accessibility_action accessibility_component'
                                                    style='padding-top:" + (is_set_for_mobile ? "2px" : "6px") + " !important;z-index:2147483645;'
                                                    title='גודל טקסט'>", e += "<img
                                                        src='" + negishim_base + "font_size_18_" + t + ".png' alt='menu'
                                                        class='accessibility_component' style='margin-top:6px;' />", e
                                                    += " <a role='button' tabindex='2' href='javascript:void(0);'
                                                        title='גודל טקסט רגיל' id='a_fs_d'
                                                        onclick='FontSizeDefault();return false;'
                                                        class='accessibility_component a_gray'
                                                        style='font-weight:bold!important;display:inline;font-size:20px !important;font-family:arial !important;text-decoration:none;color:" + i + ";vertical-align:baseline !important;'><span
                                                            class='accessibility_component' aria-hidden=\"true\"
                                                            style='font-size:20px !important;'>א</span></a> &nbsp; ", e
                                                    += " <a role='button' tabindex='3' href='javascript:void(0);'
                                                        title='הגדלת טקסט רמה 1' id='a_fs_m'
                                                        onclick='FontSizeM();return false;'
                                                        class='accessibility_component a_gray'
                                                        style='font-weight:bold!important;display:inline;font-size:22px !important;font-family:arial !important;text-decoration:none;color:" + i + ";vertical-align:baseline !important;'><span
                                                            class='accessibility_component' aria-hidden=\"true\"
                                                            style='font-size:22px !important;'>א</span></a> &nbsp; ", e
                                                    += " <a role='button' tabindex='4' href='javascript:void(0);'
                                                        title='הגדלת טקסט רמה 2' id='a_fs_l'
                                                        onclick='FontSizeL();return false;'
                                                        class='accessibility_component a_gray'
                                                        style='font-weight:bold!important;display:inline;font-size:24px !important;font-family:arial !important;text-decoration:none;color:" + i + ";vertical-align:baseline !important;'><span
                                                            class='accessibility_component' aria-hidden=\"true\"
                                                            style='font-size:24px !important;'>א</span></a> &nbsp; ", e
                                                    += " <a role='button' tabindex='5' href='javascript:void(0);'
                                                        title='הגדלת טקסט רמה 3' id='a_fs_xl'
                                                        onclick='FontSizeXl();return false;'
                                                        class='accessibility_component a_gray'
                                                        style='font-weight:bold!important;display:inline;font-size:26px !important;font-family:arial !important;text-decoration:none;color:" + i + ";vertical-align:baseline !important;'><span
                                                            class='accessibility_component' aria-hidden=\"true\"
                                                            style='font-size:26px !important;'>א</span></a>", e += "
                                                </div>", e += "<a role='button' tabindex='6' id='accessibility_action3'
                                                    href='javascript:void(0);'
                                                    onclick='AccessibilityContrastBlackOnBlue();return false;'
                                                    class='btn_accessibility_action accessibility_component'
                                                    style='z-index:2147483644;' title='ניגודיות עדינה'>", e += "<img
                                                        src='" + negishim_base + "contrast_18_" + t + ".png'
                                                        alt='contrast' class='accessibility_component' style='border:0'
                                                        aria-hidden=\"true\" />", e += "<span
                                                        class='accessibility_component' aria-hidden=\"true\">ניגודיות
                                                        עדינה</span>", e += "</a>", e += "<a role='button' tabindex='7'
                                                    id='accessibility_action4' href='javascript:void(0);'
                                                    onclick='AccessibilityContrastYellowOnBlack();return false;'
                                                    class='btn_accessibility_action accessibility_component'
                                                    style='z-index:2147483643;' title='ניגודיות גבוהה'>", e += "<img
                                                        src='" + negishim_base + "contrast_18_" + t + ".png'
                                                        alt='contrast' class='accessibility_component' style='border:0'
                                                        aria-hidden=\"true\" />", e += "<span
                                                        class='accessibility_component' aria-hidden=\"true\">ניגודיות
                                                        גבוהה</span>", e += "</a>", e += "<a role='button' tabindex='8'
                                                    id='accessibility_action10' href='javascript:void(0);'
                                                    onclick='GrayImages();return false;'
                                                    class='btn_accessibility_action accessibility_component'
                                                    style='z-index:2147483642;'
                                                    title='ביטול צבעים והצגת האתר בגווני שחור לבן'>", e += "<img
                                                        src='" + negishim_base + "gray_images_18_" + t + ".png'
                                                        alt='gray images' class='accessibility_component'
                                                        style='border:0' aria-hidden=\"true\" />", e += "<span
                                                        class='accessibility_component'
                                                        aria-hidden=\"true\">מונוכרום</span>", e += "</a>", e += "<a
                                                    role='button' tabindex='9' id='accessibility_action5'
                                                    href='javascript:void(0);' onclick='LinksUnderline();return false;'
                                                    class='btn_accessibility_action accessibility_component'
                                                    style='z-index:2147483641;'
                                                    title='הדגשת קישורים - הצגת קו תחתי מתחת לקישורים'>", e += "<img
                                                        src='" + negishim_base + "underline_18_" + t + ".png'
                                                        alt='underline' class='accessibility_component' style='border:0'
                                                        aria-hidden=\"true\" />", e += "<span
                                                        class='accessibility_component' aria-hidden=\"true\">הדגשת
                                                        קישורים</span>", e += "</a>", e += "<a role='button'
                                                    tabindex='10' id='accessibility_action6' href='javascript:void(0);'
                                                    onclick='BlockAnimation();return false;'
                                                    class='btn_accessibility_action accessibility_component'
                                                    style='z-index:2147483640;' title='חסימת אנימציה'>", e += "<img
                                                        src='" + negishim_base + "eye_blocked_18_" + t + ".png'
                                                        alt='eye_blocked' class='accessibility_component'
                                                        style='border:0' aria-hidden=\"true\" />", e += "<span
                                                        class='accessibility_component' aria-hidden=\"true\">חסימת
                                                        אנימציה</span>", e += "</a>", e += "<a role='button'
                                                    tabindex='11' id='accessibility_action7' href='javascript:void(0);'
                                                    onclick='ReadableFont();return false;'
                                                    class='btn_accessibility_action accessibility_component'
                                                    style='z-index:2147483639;'
                                                    title='שנה את פונט האתר לפונט קריא יותר'>", e += "<img
                                                        src='" + negishim_base + "font_18_" + t + ".png' alt='font'
                                                        class='accessibility_component' style='border:0'
                                                        aria-hidden=\"true\" />", e += "<span
                                                        class='accessibility_component' aria-hidden=\"true\">פונט
                                                        קריא</span>", e += "</a>", e += "<a role='button' tabindex='12'
                                                    id='accessibility_action11' href='javascript:void(0);'
                                                    onclick='StartAccessibility();return false;'
                                                    class='btn_accessibility_action accessibility_component'
                                                    style='z-index:2147483638;' title='סגור רכיב נגישות'>", e += "<img
                                                        src='" + negishim_base + "close_18_" + t + ".png' alt='close'
                                                        class='accessibility_component' style='border:0'
                                                        aria-hidden=\"true\" />", e += "<span
                                                        class='accessibility_component'
                                                        aria-hidden=\"true\">סגור</span>", e += "</a>", e += "<a
                                                    role='button' tabindex='13' id='accessibility_action9'
                                                    href='javascript:void(0);'
                                                    onclick='AccessibilityReset();return false;'
                                                    class='btn_accessibility_action accessibility_component'
                                                    style='z-index:2147483637;'
                                                    title='איפוס הגדרות נגישות למצב ברירת מחדל'>", e += "<img
                                                        src='" + negishim_base + "power_off_18_" + t + ".png'
                                                        alt='power off' class='accessibility_component' style='border:0'
                                                        aria-hidden=\"true\" />", e += "<span
                                                        class='accessibility_component' aria-hidden=\"true\">איפוס
                                                        הגדרות נגישות</span>", e += "</a>", e += "<a role='button'
                                                    tabindex='14' id='accessibility_action8'
                                                    href='http://www.negishim.org/' target='_blank'
                                                    class='btn_accessibility_action accessibility_component btn_accessibility_action_active'
                                                    style='z-index:2147483636;' title='להורדת מודול נגישות חינם'>", e +=
                                                    "<img src='" + negishim_base + "info_18_" + t + ".png' alt='info'
                                                        class='accessibility_component' style='border:0'
                                                        aria-hidden=\"true\" />", e += "<span
                                                        class='accessibility_component' aria-hidden=\"true\">להורדת
                                                        מודול נגישות חינם</span>", e += "</a>", e += "</div>",
                                            jQuery("body").append(e); var n = 0; try { n = jQuery.fn.jquery } catch (e)
                                            { n = 0 } if (3
                                            <= n[0]) { var o=jQuery("#accessibility_icon")[0]; jQuery("<img />
                                            ").attr("src", jQuery(o).attr("src")).on("load", function () { if (18 ==
                                            this.width) { jQuery(".accessibility_div_wrap").css("display", "block"); var
                                            e = (new Date).getTime(); jQuery.ajax({ url: negishim_base + "ls.ashx?ii=" +
                                            e, type: "get", contentType: "application/json", dataType: "jsonp",
                                            crossDomain: !0, crossOrigin: !0, jsonpCallback: "jsonpCallback", success:
                                            function (e, t, i) { } }) } }) } else { o =
                                            jQuery("#accessibility_icon")[0]; jQuery("<img />").attr("src",
                                            jQuery(o).attr("src")).load(function () { if (18 == this.width) {
                                            jQuery(".accessibility_div_wrap").css("display", "block"); var e = (new
                                            Date).getTime(); jQuery.ajax({ url: negishim_base + "ls.ashx?ii=" + e, type:
                                            "get", contentType: "application/json", dataType: "jsonp", crossDomain: !0,
                                            crossOrigin: !0, jsonpCallback: "jsonpCallback", success: function (e, t, i)
                                            { } }) } }) } } function CheckSelectedOptionsFromCookies() { try { switch
                                            (getCookie("accessibility_font_size")) { case "m": current_font_size_level =
                                            2, FontSizeM(); break; case "l": current_font_size_level = 3, FontSizeL();
                                            break; case "xl": current_font_size_level = 4, FontSizeXl() } } catch (e) {
                                            } try { switch (getCookie("accessibility_contrast")) { case "yellow":
                                            AccessibilityContrastYellowOnBlack(); break; case "blue":
                                            AccessibilityContrastBlackOnBlue() } } catch (e) { } try { "1" ==
                                            getCookie("links_underline") && LinksUnderline() } catch (e) { } try { "1"
                                            == getCookie("readable_font") && ReadableFont() } catch (e) { } try { "1" ==
                                            getCookie("is_animation_blocked") && BlockAnimation() } catch (e) { } try {
                                            "1" == getCookie("gray_images") && GrayImages() } catch (e) { } } function
                                            AddCssClasses() { try { var e = "#000000", t = "#ffffff", i = "#E5E5E5", a =
                                            "#EBEBEB", n = "", o = "gray"; 2 == css_style && (e = "#ffffff", t =
                                            "#000000", a = i = "#2A2A2A", o = "#C0C0C0", n = "border:1px solid
                                            #2A2A2A;"); var s = document.createElement("style"); s.type = "text/css";
                                            var r = "18px!important"; (is_set_for_mobile || hide_header_text) && (r =
                                            "16px!important", !is_set_for_mobile && hide_header_text && (r =
                                            "16px!important")); var c = "", l = "height:42px;font-size:" + r +
                                            ";padding:12px 10px 0px 0px;", d = "padding:10px 10px 0px
                                            0px;width:92px;height:40px;"; (is_set_for_mobile || hide_header_text) && (l
                                            = "height:34px;font-size:" + r + ";padding:8px 10px 0px 0px;", d =
                                            "padding:8px 6px 0px 0px;width:34px;height:34px;", !is_set_for_mobile &&
                                            hide_header_text && (l = "height:42px;font-size:" + r + ";padding:12px 10px
                                            0px 0px;", d = "padding:12px 10px 0px 0px;width:42px;height:40px;")), c +=
                                            ".btn_accessibility {" + d + n + "color:" + e + "
                                            !important;background-color: " + t + " !important;text-decoration:none;top:"
                                            + pixel_from_start + "px;display: inline-block;border-radius:6px;overflow:
                                            hidden;position: fixed!important;" + (accessibility_rtl ? "right" : "left")
                                            + ":" + pixel_from_side + "px;z-index: 2147483647;box-sizing:
                                            border-box;text-align: right;margin: 0 auto;-webkit-transition: all
                                            0.3s;transition: all 0.3s;-webkit-box-shadow: 0px 0px 5px 0px
                                            #000000;-moz-box-shadow: 0px 0px 5px 0px #000000;box-shadow: 0px 0px 5px 0px
                                            #000000;font-weight:normal;font-size:18px!important;direction:rtl;}", c +=
                                            ".btn_accessibility span{font-size:18px!important;}", c +=
                                            ".btn_accessibility img{vertical-align:top;width:auto;}", c +=
                                            ".btn_accessibility:hover,.btn_accessibility:focus{font-size:18px;background-color:"
                                            + i + " !important;text-decoration:underline;-webkit-box-shadow: 0px 0px 5px
                                            1px #757575;-moz-box-shadow: 0px 0px 5px 1px #757575;box-shadow: 0px 0px 5px
                                            1px #757575;outline:0;}", c += ".btn_accessibility:hover
                                            strong,.btn_accessibility:focus strong{right:20px;color:yellow
                                            !important;}", c += ".btn_accessibility_action {" + l + n + "color:" + e + "
                                            !important;background-color: " + t + "
                                            !important;letter-spacing:1px;text-decoration:none;font-weight:
                                            bold;font-family:arial!important;visibility: hidden;top:" + pixel_from_start
                                            + "px;display: inline-block;border-radius:6px;width:280px;overflow:
                                            hidden;position:fixed!important;" + (accessibility_rtl ? "right" : "left") +
                                            ":" + pixel_from_side + "px;box-sizing:
                                            border-box;text-align:right!important;margin: 0 auto;-webkit-transition:
                                            background-color 0.3s;transition: background-color 0.3s;-webkit-box-shadow:
                                            0px 0px 5px 0px #000000;-moz-box-shadow: 0px 0px 5px 0px #000000;box-shadow:
                                            0px 0px 5px 0px #000000;}", c += ".btn_accessibility_action span{font-size:"
                                            + r + ";}", c += ".btn_accessibility_action
                                            img{vertical-align:top;margin-left:8px;width:auto;}", c +=
                                            ".btn_accessibility_action strong {color: " + e + ";-webkit-transition: all
                                            0.3s;transition: all 0.3s;}", c +=
                                            ".btn_accessibility_action:hover{-webkit-box-shadow: 0px 0px 5px 1px
                                            #000000;-moz-box-shadow: 0px 0px 5px 1px #757575;box-shadow: 0px 0px 5px 1px
                                            #757575;}", c +=
                                            "a.btn_accessibility_action:hover,a.btn_accessibility_action:focus{font-size:"
                                            + r + ";text-decoration:underline;background-color:" + a + "
                                            !important;outline:0;}", c +=
                                            ".btn_accessibility_action_active{background-color:" + a + "
                                            !important;outline:0;}", c += "a.btn_accessibility_action:hover
                                            div,a.btn_accessibility_action:focus div,.btn_accessibility_action_active
                                            div{}", c += ".a_gray{-webkit-transition: color 0.3s;transition: color
                                            0.3s;}", c += ".a_gray:hover,.a_gray:focus,.a_gray_active{color:" + o + "
                                            !important;text-decoration:underline !important;outline:0;}", c +=
                                            ".btn_accessibility_action
                                            .accessibility_action_icn{font-size:22px;position:absolute;top:14px;right:10px;}",
                                            c += ".btn_accessibility_action:hover
                                            .accessibility_action_icn,.btn_accessibility_action:focus
                                            .accessibility_action_icn,.btn_accessibility_action_active
                                            .accessibility_action_icn{right:6px;color:yellow !important;}", c +=
                                            ".btn_font_size:hover strong,.btn_font_size:focus strong{color:yellow
                                            !important;}", c += ".a_hover_opacity:hover, .a_hover_opacity:focus
                                            {-webkit-text-shadow: 1px 1px 0px #003755;-moz-text-shadow: 1px 1px 0px
                                            #003755;box-shadow: 1px 1px 0px #003755;}", c += ".font_size_icn_b
                                            {font-size: 19px;top: 17px;right: 8px;position: absolute;}", c +=
                                            ".font_size_icn_s {font-size: 15px;right: 21px;top: 20px;position:
                                            absolute;}", c += ".btn_accessibility_action:hover .font_size_icn_b,
                                            .btn_accessibility_action:focus .font_size_icn_b {right: 5px;color: yellow
                                            !important;}", c += ".btn_accessibility_action:hover .font_size_icn_s,
                                            .btn_accessibility_action:focus .font_size_icn_s {right: 18px;color: yellow
                                            !important;}", c += ".accessibility_component {line-height: 1.1
                                            !important;font-family:arial!important;direction:rtl;}", c +=
                                            "img.accessibility_component {display:inline !important;}", c +=
                                            ".gray_images {-webkit-filter: grayscale(100%);filter: grayscale(100%);}",
                                            s.innerHTML = ".links_underline{text-decoration:underline
                                            !important;}.readable_font{font-family:arial
                                            !important;}.accessibility_contrast_yellow_on_black {background:none
                                            !important;background-color:black !important;color:yellow
                                            !important;}.accessibility_contrast_yellow_on_black_a,.accessibility_contrast_yellow_on_black_a::before{background:none
                                            !important;background-color:black !important;color:yellow
                                            !important;outline:1px dashed yellow
                                            !important;}.accessibility_contrast_yellow_on_black_a:hover,.accessibility_contrast_yellow_on_black_a:focus,.accessibility_contrast_yellow_on_black_a:hover::before,.accessibility_contrast_yellow_on_black_a:focus::before{color:#ffffff
                                            !important;outline:1px dashed #ffffff
                                            !important;}.accessibility_contrast_yellow_on_black_input {background:none
                                            !important;background-color:#ffffff !important;color:#000000
                                            !important;}.accessibility_contrast_black_on_blue {background:none
                                            !important;background-color:#c2d3fc !important;color:#000000
                                            !important;}.accessibility_contrast_black_on_blue_a,.accessibility_contrast_black_on_blue_a::before{background:none
                                            !important;background-color:#c2d3fc !important;color:#000000
                                            !important;outline:1px dashed #000000
                                            !important;}.accessibility_contrast_black_on_blue_a:hover,.accessibility_contrast_black_on_blue_a:hover
                                            div,.accessibility_contrast_black_on_blue_a:hover
                                            span,.accessibility_contrast_black_on_blue_a:focus,.accessibility_contrast_black_on_blue_a:hover::before,.accessibility_contrast_black_on_blue_a:focus::before{color:#ffffff
                                            !important;outline:1px dashed #ffffff !important;background-color:#89ABFA
                                            !important;}.accessibility_contrast_black_on_blue_input {background:none
                                            !important;background-color:#ffffff !important;color:#000000 !important;}" +
                                            c, document.head.appendChild(s) } catch (e) { } } function
                                            KeepFontSizeDefault() {
                                            jQuery("body,div,span,table,tr,td,h1,h2,h3,h4,h5,h6,p,ol,ul,li,strong,label,a,label,font").each(function
                                            (e) { try { var t = jQuery(this).css("font-size"); if ("" != t && 4 ==
                                            t.length && 2 == (t = (t = t.replace("px", "")).replace("pt", "")).length) {
                                            var i = jQuery(this).css("font-size").replace(t, "");
                                            jQuery(this).attr("data-font-size", t),
                                            jQuery(this).attr("data-font-size-type", i) } var a =
                                            jQuery(this).css("line-height"); "" != a && -1 != a.indexOf("px") &&
                                            parseInt(a.replace("px", "")) < 30 && jQuery(this).attr("data-line-height",
                                                a) } catch (e) { } }),
                                                jQuery(".accessibility_component").removeAttr("data-font-size"),
                                                jQuery(".accessibility_component").removeAttr("data-font-size-type"),
                                                jQuery(".accessibility_component").removeAttr("data-line-height") } var
                                                current_font_size_level=1; function FontSizeXl() { try {
                                                setCookie("accessibility_font_size", "xl" , 1) } catch (e) { }
                                                jQuery(".a_gray").removeClass("a_gray_active"),
                                                jQuery("#a_fs_xl").addClass("a_gray_active"),
                                                jQuery("body,div,span,table,tr,td,h1,h2,h3,h4,h5,h6,p,ol,ul,li,strong,label,a,label,font").each(function
                                                (e) { try { if (isElHasAttr(this, "data-font-size" )) { var
                                                t=parseInt(jQuery(this).attr("data-font-size")); isNaN(t) || (t +=8,
                                                jQuery(this).css("font-size", t +
                                                jQuery(this).attr("data-font-size-type")), jQuery(this).addClass("fs" +
                                                t + "px" )) } isElHasAttr(this, "data-line-height" ) &&
                                                jQuery(this).css("line-height", "1.2" ) } catch (e) { console.log(e) }
                                                }) } function FontSizeL() { try {
                                                setCookie("accessibility_font_size", "l" , 1) } catch (e) { }
                                                jQuery(".a_gray").removeClass("a_gray_active"),
                                                jQuery("#a_fs_l").addClass("a_gray_active"),
                                                jQuery("body,div,span,table,tr,td,h1,h2,h3,h4,h5,h6,p,ol,ul,li,strong,label,a,label,font").each(function
                                                (e) { try { if (isElHasAttr(this, "data-font-size" )) { var
                                                t=parseInt(jQuery(this).attr("data-font-size")); t +=4,
                                                jQuery(this).css("font-size", t +
                                                jQuery(this).attr("data-font-size-type")) }
                                                isElHasAttr(this, "data-line-height" ) &&
                                                jQuery(this).css("line-height", "1.2" ) } catch (e) { } }) } function
                                                FontSizeM() { try { setCookie("accessibility_font_size", "m" , 1) }
                                                catch (e) { } jQuery(".a_gray").removeClass("a_gray_active"),
                                                jQuery("#a_fs_m").addClass("a_gray_active"),
                                                jQuery("body,div,span,table,tr,td,h1,h2,h3,h4,h5,h6,p,ol,ul,li,strong,label,a,label,font").each(function
                                                (e) { try { if (isElHasAttr(this, "data-font-size" )) { var
                                                t=parseInt(jQuery(this).attr("data-font-size")); t +=2,
                                                jQuery(this).css("font-size", t +
                                                jQuery(this).attr("data-font-size-type")) }
                                                isElHasAttr(this, "data-line-height" ) &&
                                                jQuery(this).css("line-height", "1.2" ) } catch (e) { } }) } function
                                                FontSizeDefault() { try { setCookie("accessibility_font_size", "" , 1) }
                                                catch (e) { } jQuery(".a_gray").removeClass("a_gray_active"),
                                                jQuery("#a_fs_d").addClass("a_gray_active"),
                                                jQuery("body,div,span,table,tr,td,h1,h2,h3,h4,h5,h6,p,ol,ul,li,strong,label,a,label,font").each(function
                                                (e) { try { if (isElHasAttr(this, "data-font-size" )) { var
                                                t=parseInt(jQuery(this).attr("data-font-size"));
                                                jQuery(this).css("font-size", t +
                                                jQuery(this).attr("data-font-size-type")) }
                                                isElHasAttr(this, "data-line-height" ) &&
                                                jQuery(this).css("line-height", jQuery(this).attr("data-line-height")) }
                                                catch (e) { } }) } function AccessibilityContrastYellowOnBlack() { if
                                                (is_contrast_yellow) AccessibilityContrastYellowOnBlackReset(); else {
                                                is_contrast_blue && AccessibilityContrastBlackOnBlueReset(); try {
                                                setCookie("accessibility_contrast", "yellow" , 1) } catch (e) { }
                                                jQuery("body,table,tr,h1,h2,h3,h4,h5,h6,ol,ul,li,strong,label,font").addClass("accessibility_contrast_yellow_on_black"),
                                                jQuery("div,span,td,p").each(function (e) { var
                                                t=jQuery(this).css("background-image"); null==t ? ""
                                                !=jQuery.trim(jQuery(this).text()) &&
                                                jQuery(this).addClass("accessibility_contrast_yellow_on_black") :
                                                -1==t.indexOf("url") && "" !=jQuery.trim(jQuery(this).text()) &&
                                                jQuery(this).addClass("accessibility_contrast_yellow_on_black") }),
                                                jQuery("a").each(function (e) { var
                                                t=jQuery(this).css("background-image"); null==t ?
                                                jQuery(this).addClass("accessibility_contrast_yellow_on_black_a") :
                                                -1==t.indexOf("url") &&
                                                jQuery(this).addClass("accessibility_contrast_yellow_on_black_a") }),
                                                jQuery("input").addClass("accessibility_contrast_yellow_on_black_input"),
                                                jQuery(".accessibility_component").removeClass("accessibility_contrast_yellow_on_black"),
                                                jQuery("a.accessibility_component").removeClass("accessibility_contrast_yellow_on_black_a"),
                                                is_contrast_blue=!(is_contrast_yellow=!0),
                                                jQuery("#accessibility_action4").addClass("btn_accessibility_action_active"),
                                                jQuery("#accessibility_action3").removeClass("btn_accessibility_action_active")
                                                } } function AccessibilityContrastBlackOnBlue() { if (is_contrast_blue)
                                                AccessibilityContrastBlackOnBlueReset(); else { is_contrast_yellow &&
                                                AccessibilityContrastYellowOnBlackReset(); try {
                                                setCookie("accessibility_contrast", "blue" , 1) } catch (e) { }
                                                jQuery("body,table,tr,h1,h2,h3,h4,h5,h6,ol,ul,li,strong,label,font").addClass("accessibility_contrast_black_on_blue"),
                                                jQuery("div,span,td,p").each(function (e) { var
                                                t=jQuery(this).css("background-image"); null==t ? ""
                                                !=jQuery.trim(jQuery(this).text()) &&
                                                jQuery(this).addClass("accessibility_contrast_black_on_blue") :
                                                -1==t.indexOf("url") && "" !=jQuery.trim(jQuery(this).text()) &&
                                                jQuery(this).addClass("accessibility_contrast_black_on_blue") }),
                                                jQuery("a").each(function (e) { var
                                                t=jQuery(this).css("background-image"); null==t ?
                                                jQuery(this).addClass("accessibility_contrast_black_on_blue_a") :
                                                -1==t.indexOf("url") &&
                                                jQuery(this).addClass("accessibility_contrast_black_on_blue_a") }),
                                                jQuery("input").addClass("accessibility_contrast_black_on_blue_input"),
                                                jQuery(".accessibility_component").removeClass("accessibility_contrast_black_on_blue"),
                                                jQuery("a.accessibility_component").removeClass("accessibility_contrast_black_on_blue_a"),
                                                is_contrast_yellow=!(is_contrast_blue=!0),
                                                jQuery("#accessibility_action3").addClass("btn_accessibility_action_active"),
                                                jQuery("#accessibility_action4").removeClass("btn_accessibility_action_active")
                                                } } function AccessibilityContrastYellowOnBlackReset() { try {
                                                setCookie("accessibility_contrast", "" , 1) } catch (e) { }
                                                jQuery("body,div,span,table,tr,td,h1,h2,h3,h4,h5,h6,p,ol,ul,li,strong,label,font").removeClass("accessibility_contrast_yellow_on_black"),
                                                jQuery("a").removeClass("accessibility_contrast_yellow_on_black_a"),
                                                jQuery("input").removeClass("accessibility_contrast_yellow_on_black_input"),
                                                jQuery(".accessibility_component").removeClass("accessibility_contrast_yellow_on_black"),
                                                jQuery("a.accessibility_component").removeClass("accessibility_contrast_yellow_on_black_a"),
                                                is_contrast_yellow=!1,
                                                jQuery("#accessibility_action4").removeClass("btn_accessibility_action_active")
                                                } function AccessibilityContrastBlackOnBlueReset() { try {
                                                setCookie("accessibility_contrast", "" , 1) } catch (e) { }
                                                jQuery("body,div,span,table,tr,td,h1,h2,h3,h4,h5,h6,p,ol,ul,li,strong,label,font").removeClass("accessibility_contrast_black_on_blue"),
                                                jQuery("a").removeClass("accessibility_contrast_black_on_blue_a"),
                                                jQuery("input").removeClass("accessibility_contrast_black_on_blue_input"),
                                                jQuery(".accessibility_component").removeClass("accessibility_contrast_black_on_blue"),
                                                jQuery("a.accessibility_component").removeClass("accessibility_contrast_black_on_blue_a"),
                                                is_contrast_blue=!1,
                                                jQuery("#accessibility_action3").removeClass("btn_accessibility_action_active")
                                                } function ReadableFont() { if (is_readable_font) ReadableFontReset();
                                                else {
                                                jQuery("body,div,span,table,tr,td,h1,h2,h3,h4,h5,h6,p,ol,ul,li,a,input,select,option,strong,font").addClass("readable_font"),
                                                jQuery("#accessibility_action7").addClass("btn_accessibility_action_active");
                                                try { setCookie("readable_font", "1" , 1) } catch (e) { }
                                                jQuery(".accessibility_component").removeClass("readable_font"),
                                                is_readable_font=!0 } } function ReadableFontReset() {
                                                jQuery("body,div,span,table,tr,td,h1,h2,h3,h4,h5,h6,p,ol,ul,li,a,input,select,option,strong").removeClass("readable_font"),
                                                jQuery("#accessibility_action7").removeClass("btn_accessibility_action_active"),
                                                is_readable_font=!1; try { setCookie("readable_font", "" , 1) } catch
                                                (e) { } } function LinksUnderline() { if (is_links_underline)
                                                LinksUnderlineReset(); else { jQuery("a").addClass("links_underline"),
                                                jQuery("#accessibility_action5").addClass("btn_accessibility_action_active");
                                                try { setCookie("links_underline", "1" , 1) } catch (e) { }
                                                jQuery("a.accessibility_component").removeClass("links_underline"),
                                                is_links_underline=!0 } } function LinksUnderlineReset() {
                                                jQuery("#accessibility_action5").removeClass("btn_accessibility_action_active"),
                                                is_links_underline=!1, jQuery("a").removeClass("links_underline"); try {
                                                setCookie("links_underline", "" , 1) } catch (e) { } } function
                                                BlockAnimation() { if (is_animation_blocked) UnBlockAnimation(); else {
                                                jQuery("*").stop(!0), jQuery.fx.off=!0,
                                                jQuery("#accessibility_action6").addClass("btn_accessibility_action_active");
                                                var e=document.createElement("style"); e.type="text/css" ,
                                                e.innerHTML="* {/*CSS transitions*/ -o-transition-property: none !important; -moz-transition-property: none !important; -ms-transition-property: none !important; -webkit-transition-property: none !important;  transition-property: none !important;/*CSS transforms*/  -o-transform: none !important; -moz-transform: none !important;   -ms-transform: none !important;  -webkit-transform: none !important;   transform: none !important;  /*CSS animations*/   -webkit-animation: none !important;   -moz-animation: none !important;   -o-animation: none !important;   -ms-animation: none !important;   animation: none !important;}"
                                                , document.getElementsByTagName("head")[0].appendChild(e),
                                                is_animation_blocked=!0; try { setCookie("is_animation_blocked", "1" ,
                                                1) } catch (e) { } } } function UnBlockAnimation() {
                                                jQuery("#accessibility_action6").removeClass("btn_accessibility_action_active");
                                                try { setCookie("is_animation_blocked", "" , 1) } catch (e) { }
                                                is_animation_blocked && (window.location.href=window.location.href) }
                                                function GrayImages() { if (is_gray_images) GrayImagesReset(); else {
                                                jQuery("body,div,span,table,tr,td,h1,h2,h3,h4,h5,h6,p,ol,ul,li,a,input,select,option,strong").addClass("gray_images"),
                                                jQuery("#accessibility_action10").addClass("btn_accessibility_action_active");
                                                try { setCookie("gray_images", "1" , 1) } catch (e) { console.log("Error
                                                setCookie: " + e) } jQuery("
                                                .accessibility_component").removeClass("gray_images"), is_gray_images=!0
                                                } } function GrayImagesReset() {
                                                jQuery("body,div,span,table,tr,td,h1,h2,h3,h4,h5,h6,p,ol,ul,li,a,input,select,option,strong").removeClass("gray_images"),
                                                jQuery("#accessibility_action10").removeClass("btn_accessibility_action_active"),
                                                is_gray_images=!1; try { setCookie("gray_images", "" , 1) } catch (e) {
                                                console.log("Error
                                                setCookie: " + e) } } function AccessibilityReset() { FontSizeDefault(), AccessibilityContrastBlackOnBlueReset(), AccessibilityContrastYellowOnBlackReset(), LinksUnderlineReset(), ReadableFontReset(), UnBlockAnimation(), GrayImagesReset(), jQuery("
                                                :focus").blur(), StartAccessibility() } function DetectMobile() { return
                                                !!(navigator.userAgent.match(/Android/i) ||
                                                navigator.userAgent.match(/webOS/i) ||
                                                navigator.userAgent.match(/iPhone/i) ||
                                                navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i)
                                                || navigator.userAgent.match(/BlackBerry/i) ||
                                                navigator.userAgent.match(/Windows Phone/i)) }/*Fingerprintjs2 1.5.1 -
                                                Modern & flexible browser fingerprint library v2 Copyright (c) 2015
                                                Valentin Vasilyev (valentin.vasilyev@outlook.com)*/