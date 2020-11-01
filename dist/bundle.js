(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const { createDurationSeconds } = require("./song");
const getRandomOccurance = require("./random-occurances");
const randomOccurance = getRandomOccurance();

function getGopherImage() {
  if (randomOccurance === "rosco") {
    return "rosco.png";
  }

  return "gopher-original.png";
}

function getGopherSize() {
  if (randomOccurance === "rosco") {
    return [287, 450];
  }

  return [403, 419];
}

const GOPHER_IMAGE = `images/${getGopherImage()}`;
const [GOPHER_IMAGE_WIDTH, GOPHER_IMAGE_HEIGHT] = getGopherSize();

const GOPHER_POSITIONS = ["top", "right", "bottom", "left"];

function randomlyPositionGopher(gopherImage) {
  const randomPosition =
    GOPHER_POSITIONS[Math.floor(Math.random() * GOPHER_POSITIONS.length)];
  gopherImage.className = `gopher gopher--${randomPosition}`;

  const randomPercentage = Math.round(Math.floor(Math.random() * 5)) * 20;
  if (randomPosition === "top" || randomPosition === "bottom") {
    gopherImage.style.left = `${randomPercentage}%`;
  } else if (randomPosition === "right" || randomPosition === "left") {
    gopherImage.style.top = `${randomPercentage}%`;
  }
}

function addGopherToPage(gopherImage, timeout) {
  gopherImage.addEventListener("load", () => {
    document.body.appendChild(gopherImage);
    setTimeout(() => gopherImage.remove(), timeout);
  });
}

function generateEndingGopher() {
  const gopherImage = new Image(GOPHER_IMAGE_WIDTH, GOPHER_IMAGE_HEIGHT);
  gopherImage.src = GOPHER_IMAGE;

  const durationMilliseconds = createDurationSeconds(3.5);

  gopherImage.style.animationDuration = `${durationMilliseconds}ms`;
  gopherImage.className = `gopher gopher--bottom gopher--big`;
  gopherImage.style.right = "15px";

  addGopherToPage(gopherImage, durationMilliseconds);
}

function generateGopher() {
  const gopherImage = new Image(
    GOPHER_IMAGE_WIDTH / 2,
    GOPHER_IMAGE_HEIGHT / 2
  );
  gopherImage.src = GOPHER_IMAGE;

  const durationMilliseconds = createDurationSeconds(1.5);

  gopherImage.style.animationDuration = `${durationMilliseconds}ms`;

  randomlyPositionGopher(gopherImage);
  addGopherToPage(gopherImage, durationMilliseconds);
}

module.exports = {
  generateGopher,
  generateEndingGopher,
};

},{"./random-occurances":4,"./song":5}],2:[function(require,module,exports){
(function (global){(function (){
!function(){function e(t,s,n){function i(r,a){if(!s[r]){if(!t[r]){var c="function"==typeof require&&require;if(!a&&c)return c(r,!0);if(o)return o(r,!0);var l=new Error("Cannot find module '"+r+"'");throw l.code="MODULE_NOT_FOUND",l}var u=s[r]={exports:{}};t[r][0].call(u.exports,function(e){var s=t[r][1][e];return i(s||e)},u,u.exports,e,t,s,n)}return s[r].exports}for(var o="function"==typeof require&&require,r=0;r<n.length;r++)i(n[r]);return i}return e}()({1:[function(e,t,s){"use strict";t.exports={client:e("./lib/client"),Client:e("./lib/client")}},{"./lib/client":3}],2:[function(e,t,s){"use strict";var n=e("request"),i=e("./utils"),o=function(e,t){var s=null===i.get(e.url,null)?i.get(e.uri,null):i.get(e.url,null);if(i.isURL(s)||(s="https://api.twitch.tv/kraken"+("/"===s[0]?s:"/"+s)),i.isNode())n(i.merge({method:"GET",json:!0},e,{url:s}),t);else if(i.isExtension()||i.isReactNative()){e=i.merge({url:s,method:"GET",headers:{}},e);var o=new XMLHttpRequest;o.open(e.method,e.url,!0);for(var r in e.headers)o.setRequestHeader(r,e.headers[r]);o.responseType="json",o.addEventListener("load",function(e){4==o.readyState&&(200!=o.status?t(o.status,null,null):t(null,null,o.response))}),o.send()}else{var a="jsonp_callback_"+Math.round(1e5*Math.random());window[a]=function(e){delete window[a],document.body.removeChild(c),t(null,null,e)};var c=document.createElement("script");c.src=""+s+(s.includes("?")?"&":"?")+"callback="+a,document.body.appendChild(c)}};t.exports=o},{"./utils":9,request:10}],3:[function(e,t,s){(function(s){"use strict";var n=e("./api"),i=e("./commands"),o=e("./events").EventEmitter,r=e("./logger"),a=e("./parser"),c=e("./timer"),l=s.WebSocket||s.MozWebSocket||e("ws"),u=e("./utils"),h=function f(e){if(this instanceof f==!1)return new f(e);this.setMaxListeners(0),this.opts=u.get(e,{}),this.opts.channels=this.opts.channels||[],this.opts.connection=this.opts.connection||{},this.opts.identity=this.opts.identity||{},this.opts.options=this.opts.options||{},this.clientId=u.get(this.opts.options.clientId,null),this.maxReconnectAttempts=u.get(this.opts.connection.maxReconnectAttempts,1/0),this.maxReconnectInterval=u.get(this.opts.connection.maxReconnectInterval,3e4),this.reconnect=u.get(this.opts.connection.reconnect,!1),this.reconnectDecay=u.get(this.opts.connection.reconnectDecay,1.5),this.reconnectInterval=u.get(this.opts.connection.reconnectInterval,1e3),this.reconnecting=!1,this.reconnections=0,this.reconnectTimer=this.reconnectInterval,this.secure=u.get(this.opts.connection.secure,!1),this.emotes="",this.emotesets={},this.channels=[],this.currentLatency=0,this.globaluserstate={},this.lastJoined="",this.latency=new Date,this.moderators={},this.pingLoop=null,this.pingTimeout=null,this.reason="",this.username="",this.userstate={},this.wasCloseCalled=!1,this.ws=null;var t="error";this.opts.options.debug&&(t="info"),this.log=this.opts.logger||r;try{r.setLevel(t)}catch(s){}this.opts.channels.forEach(function(e,t,s){s[t]=u.channel(e)}),o.call(this)};u.inherits(h,o),h.prototype.api=n;for(var m in i)h.prototype[m]=i[m];h.prototype.handleMessage=function(e){var t=this;if(!u.isNull(e)){this.emit("raw_message",JSON.parse(JSON.stringify(e)),e);var s=u.channel(u.get(e.params[0],null)),n=u.get(e.params[1],null),i=u.get(e.tags["msg-id"],null);if(e.tags=a.badges(a.badgeInfo(a.emotes(e.tags))),e.tags){var o=e.tags;for(var r in o)if("emote-sets"!==r&&"ban-duration"!==r&&"bits"!==r){var l=o[r];u.isBoolean(l)?l=null:"1"===l?l=!0:"0"===l?l=!1:u.isString(l)&&(l=u.unescapeIRC(l)),o[r]=l}}if(u.isNull(e.prefix))switch(e.command){case"PING":this.emit("ping"),u.isNull(this.ws)||1!==this.ws.readyState||this.ws.send("PONG");break;case"PONG":var h=new Date;this.currentLatency=(h.getTime()-this.latency.getTime())/1e3,this.emits(["pong","_promisePing"],[[this.currentLatency]]),clearTimeout(this.pingTimeout);break;default:this.log.warn("Could not parse message with no prefix:\n"+JSON.stringify(e,null,4))}else if("tmi.twitch.tv"===e.prefix)switch(e.command){case"002":case"003":case"004":case"375":case"376":case"CAP":break;case"001":this.username=e.params[0];break;case"372":this.log.info("Connected to server."),this.userstate["#tmijs"]={},this.emits(["connected","_promiseConnect"],[[this.server,this.port],[null]]),this.reconnections=0,this.reconnectTimer=this.reconnectInterval,this.pingLoop=setInterval(function(){u.isNull(t.ws)||1!==t.ws.readyState||t.ws.send("PING"),t.latency=new Date,t.pingTimeout=setTimeout(function(){u.isNull(t.ws)||(t.wasCloseCalled=!1,t.log.error("Ping timeout."),t.ws.close(),clearInterval(t.pingLoop),clearTimeout(t.pingTimeout))},u.get(t.opts.connection.timeout,9999))},6e4);var m=new c.queue(2e3),f=u.union(this.opts.channels,this.channels);this.channels=[];for(var p=function(){var e=f[d];m.add(function(){u.isNull(t.ws)||1!==t.ws.readyState||t.join(e)["catch"](function(e){t.log.error(e)})})},d=0;d<f.length;d++)p();m.run();break;case"NOTICE":var g=[null],_=[s,i,n],v=[i],b=[s,!0],y=[s,!1],w=[_,g],C=[_,v],k="["+s+"] "+n;switch(i){case"subs_on":this.log.info("["+s+"] This room is now in subscribers-only mode."),this.emits(["subscriber","subscribers","_promiseSubscribers"],[b,b,g]);break;case"subs_off":this.log.info("["+s+"] This room is no longer in subscribers-only mode."),this.emits(["subscriber","subscribers","_promiseSubscribersoff"],[y,y,g]);break;case"emote_only_on":this.log.info("["+s+"] This room is now in emote-only mode."),this.emits(["emoteonly","_promiseEmoteonly"],[b,g]);break;case"emote_only_off":this.log.info("["+s+"] This room is no longer in emote-only mode."),this.emits(["emoteonly","_promiseEmoteonlyoff"],[y,g]);break;case"slow_on":case"slow_off":break;case"followers_on_zero":case"followers_on":case"followers_off":break;case"r9k_on":this.log.info("["+s+"] This room is now in r9k mode."),this.emits(["r9kmode","r9kbeta","_promiseR9kbeta"],[b,b,g]);break;case"r9k_off":this.log.info("["+s+"] This room is no longer in r9k mode."),this.emits(["r9kmode","r9kbeta","_promiseR9kbetaoff"],[y,y,g]);break;case"room_mods":var T=n.split(": ")[1].toLowerCase().split(", ").filter(function(e){return e});this.emits(["_promiseMods","mods"],[[null,T],[s,T]]);break;case"no_mods":this.emits(["_promiseMods","mods"],[[null,[]],[s,[]]]);break;case"vips_success":n.endsWith(".")&&(n=n.slice(0,-1));var x=n.split(": ")[1].toLowerCase().split(", ").filter(function(e){return e});this.emits(["_promiseVips","vips"],[[null,x],[s,x]]);break;case"no_vips":this.emits(["_promiseVips","vips"],[[null,[]],[s,[]]]);break;case"already_banned":case"bad_ban_admin":case"bad_ban_broadcaster":case"bad_ban_global_mod":case"bad_ban_self":case"bad_ban_staff":case"usage_ban":this.log.info(k),this.emits(["notice","_promiseBan"],C);break;case"ban_success":this.log.info(k),this.emits(["notice","_promiseBan"],w);break;case"usage_clear":this.log.info(k),this.emits(["notice","_promiseClear"],C);break;case"usage_mods":this.log.info(k),this.emits(["notice","_promiseMods"],[_,[i,[]]]);break;case"mod_success":this.log.info(k),this.emits(["notice","_promiseMod"],w);break;case"usage_vips":this.log.info(k),this.emits(["notice","_promiseVips"],[_,[i,[]]]);break;case"usage_vip":case"bad_vip_grantee_banned":case"bad_vip_grantee_already_vip":this.log.info(k),this.emits(["notice","_promiseVip"],[_,[i,[]]]);break;case"vip_success":this.log.info(k),this.emits(["notice","_promiseVip"],w);break;case"usage_mod":case"bad_mod_banned":case"bad_mod_mod":this.log.info(k),this.emits(["notice","_promiseMod"],C);break;case"unmod_success":this.log.info(k),this.emits(["notice","_promiseUnmod"],w);break;case"unvip_success":this.log.info(k),this.emits(["notice","_promiseUnvip"],w);break;case"usage_unmod":case"bad_unmod_mod":this.log.info(k),this.emits(["notice","_promiseUnmod"],C);break;case"usage_unvip":case"bad_unvip_grantee_not_vip":this.log.info(k),this.emits(["notice","_promiseUnvip"],C);break;case"color_changed":this.log.info(k),this.emits(["notice","_promiseColor"],w);break;case"usage_color":case"turbo_only_color":this.log.info(k),this.emits(["notice","_promiseColor"],C);break;case"commercial_success":this.log.info(k),this.emits(["notice","_promiseCommercial"],w);break;case"usage_commercial":case"bad_commercial_error":this.log.info(k),this.emits(["notice","_promiseCommercial"],C);break;case"hosts_remaining":this.log.info(k);var E=isNaN(n[0])?0:parseInt(n[0]);this.emits(["notice","_promiseHost"],[_,[null,~~E]]);break;case"bad_host_hosting":case"bad_host_rate_exceeded":case"bad_host_error":case"usage_host":this.log.info(k),this.emits(["notice","_promiseHost"],[_,[i,null]]);break;case"already_r9k_on":case"usage_r9k_on":this.log.info(k),this.emits(["notice","_promiseR9kbeta"],C);break;case"already_r9k_off":case"usage_r9k_off":this.log.info(k),this.emits(["notice","_promiseR9kbetaoff"],C);break;case"timeout_success":this.log.info(k),this.emits(["notice","_promiseTimeout"],w);break;case"delete_message_success":this.log.info("["+s+" "+n+"]"),this.emits(["notice","_promiseDeletemessage"],w);case"already_subs_off":case"usage_subs_off":this.log.info(k),this.emits(["notice","_promiseSubscribersoff"],C);break;case"already_subs_on":case"usage_subs_on":this.log.info(k),this.emits(["notice","_promiseSubscribers"],C);break;case"already_emote_only_off":case"usage_emote_only_off":this.log.info(k),this.emits(["notice","_promiseEmoteonlyoff"],C);break;case"already_emote_only_on":case"usage_emote_only_on":this.log.info(k),this.emits(["notice","_promiseEmoteonly"],C);break;case"usage_slow_on":this.log.info(k),this.emits(["notice","_promiseSlow"],C);break;case"usage_slow_off":this.log.info(k),this.emits(["notice","_promiseSlowoff"],C);break;case"usage_timeout":case"bad_timeout_admin":case"bad_timeout_broadcaster":case"bad_timeout_duration":case"bad_timeout_global_mod":case"bad_timeout_self":case"bad_timeout_staff":this.log.info(k),this.emits(["notice","_promiseTimeout"],C);break;case"untimeout_success":case"unban_success":this.log.info(k),this.emits(["notice","_promiseUnban"],w);break;case"usage_unban":case"bad_unban_no_ban":this.log.info(k),this.emits(["notice","_promiseUnban"],C);break;case"usage_delete":case"bad_delete_message_error":case"bad_delete_message_broadcaster":case"bad_delete_message_mod":this.log.info(k),this.emits(["notice","_promiseDeletemessage"],C);break;case"usage_unhost":case"not_hosting":this.log.info(k),this.emits(["notice","_promiseUnhost"],C);break;case"whisper_invalid_login":case"whisper_invalid_self":case"whisper_limit_per_min":case"whisper_limit_per_sec":case"whisper_restricted_recipient":this.log.info(k),this.emits(["notice","_promiseWhisper"],C);break;case"no_permission":case"msg_banned":case"msg_room_not_found":case"msg_channel_suspended":case"tos_ban":this.log.info(k),this.emits(["notice","_promiseBan","_promiseClear","_promiseUnban","_promiseTimeout","_promiseDeletemessage","_promiseMods","_promiseMod","_promiseUnmod","_promiseVips","_promiseVip","_promiseUnvip","_promiseCommercial","_promiseHost","_promiseUnhost","_promiseJoin","_promisePart","_promiseR9kbeta","_promiseR9kbetaoff","_promiseSlow","_promiseSlowoff","_promiseFollowers","_promiseFollowersoff","_promiseSubscribers","_promiseSubscribersoff","_promiseEmoteonly","_promiseEmoteonlyoff"],[_,[i,s]]);break;case"msg_rejected":case"msg_rejected_mandatory":this.log.info(k),this.emit("automod",s,i,n);break;case"unrecognized_cmd":this.log.info(k),this.emit("notice",s,i,n);break;case"cmds_available":case"host_target_went_offline":case"msg_censored_broadcaster":case"msg_duplicate":case"msg_emoteonly":case"msg_verified_email":case"msg_ratelimit":case"msg_subsonly":case"msg_timedout":case"msg_bad_characters":case"msg_channel_blocked":case"msg_facebook":case"msg_followersonly":case"msg_followersonly_followed":case"msg_followersonly_zero":case"msg_slowmode":case"msg_suspended":case"no_help":case"usage_disconnect":case"usage_help":case"usage_me":this.log.info(k),this.emit("notice",s,i,n);break;case"host_on":case"host_off":break;default:n.includes("Login unsuccessful")||n.includes("Login authentication failed")?(this.wasCloseCalled=!1,this.reconnect=!1,this.reason=n,this.log.error(this.reason),this.ws.close()):n.includes("Error logging in")||n.includes("Improperly formatted auth")?(this.wasCloseCalled=!1,this.reconnect=!1,this.reason=n,this.log.error(this.reason),this.ws.close()):n.includes("Invalid NICK")?(this.wasCloseCalled=!1,this.reconnect=!1,this.reason="Invalid NICK.",this.log.error(this.reason),this.ws.close()):this.log.warn("Could not parse NOTICE from tmi.twitch.tv:\n"+JSON.stringify(e,null,4))}break;case"USERNOTICE":var S=e.tags["display-name"]||e.tags.login,N=e.tags["msg-param-sub-plan"]||"",P=u.unescapeIRC(u.get(e.tags["msg-param-sub-plan-name"],""))||null,L=N.includes("Prime"),O={prime:L,plan:N,planName:P},I=e.tags,D=~~(e.tags["msg-param-streak-months"]||0),R=e.tags["msg-param-recipient-display-name"]||e.tags["msg-param-recipient-user-name"],M=~~e.tags["msg-param-mass-gift-count"];switch(I["message-type"]=i,i){case"resub":this.emits(["resub","subanniversary"],[[s,S,D,n,I,O]]);break;case"sub":this.emit("subscription",s,S,O,n,I);break;case"subgift":this.emit("subgift",s,S,D,R,O,I);break;case"anonsubgift":this.emit("anonsubgift",s,D,R,O,I);break;case"submysterygift":this.emit("submysterygift",s,S,M,O,I);break;case"anonsubmysterygift":this.emit("anonsubmysterygift",s,M,O,I);break;case"primepaidupgrade":this.emit("primepaidupgrade",s,S,O,I);break;case"giftpaidupgrade":var A=e.tags["msg-param-sender-name"]||e.tags["msg-param-sender-login"];this.emit("giftpaidupgrade",s,S,A,I);break;case"anongiftpaidupgrade":this.emit("anongiftpaidupgrade",s,S,I);break;case"raid":var S=e.tags["msg-param-displayName"]||e.tags["msg-param-login"],U=e.tags["msg-param-viewerCount"];this.emit("raided",s,S,U)}break;case"HOSTTARGET":var j=n.split(" "),U=~~j[1]||0;"-"===j[0]?(this.log.info("["+s+"] Exited host mode."),this.emits(["unhost","_promiseUnhost"],[[s,U],[null]])):(this.log.info("["+s+"] Now hosting "+j[0]+" for "+U+" viewer(s)."),this.emit("hosting",s,j[0],U));break;case"CLEARCHAT":if(e.params.length>1){var J=u.get(e.tags["ban-duration"],null);u.isNull(J)?(this.log.info("["+s+"] "+n+" has been banned."),this.emit("ban",s,n,null,e.tags)):(this.log.info("["+s+"] "+n+" has been timed out for "+J+" seconds."),this.emit("timeout",s,n,null,~~J,e.tags))}else this.log.info("["+s+"] Chat was cleared by a moderator."),this.emits(["clearchat","_promiseClear"],[[s],[null]]);break;case"CLEARMSG":if(e.params.length>1){var S=e.tags.login,H=n,I=e.tags;I["message-type"]="messagedeleted",this.log.info("["+s+"] "+S+"'s message has been deleted."),this.emit("messagedeleted",s,S,H,I)}break;case"RECONNECT":this.log.info("Received RECONNECT request from Twitch.."),this.log.info("Disconnecting and reconnecting in "+Math.round(this.reconnectTimer/1e3)+" seconds.."),this.disconnect(),setTimeout(function(){t.connect()},this.reconnectTimer);break;case"USERSTATE":e.tags.username=this.username,"mod"===e.tags["user-type"]&&(this.moderators[this.lastJoined]||(this.moderators[this.lastJoined]=[]),this.moderators[this.lastJoined].includes(this.username)||this.moderators[this.lastJoined].push(this.username)),u.isJustinfan(this.getUsername())||this.userstate[s]||(this.userstate[s]=e.tags,this.lastJoined=s,this.channels.push(s),this.log.info("Joined "+s),this.emit("join",s,u.username(this.getUsername()),!0)),e.tags["emote-sets"]!==this.emotes&&this._updateEmoteset(e.tags["emote-sets"]),this.userstate[s]=e.tags;break;case"GLOBALUSERSTATE":this.globaluserstate=e.tags,"undefined"!=typeof e.tags["emote-sets"]&&this._updateEmoteset(e.tags["emote-sets"]);break;case"ROOMSTATE":if(u.channel(this.lastJoined)===s&&this.emit("_promiseJoin",null,s),e.tags.channel=s,this.emit("roomstate",s,e.tags),!e.tags.hasOwnProperty("subs-only")){if(e.tags.hasOwnProperty("slow"))if("boolean"!=typeof e.tags.slow||e.tags.slow){var q=~~e.tags.slow,G=[s,!0,q];this.log.info("["+s+"] This room is now in slow mode."),this.emits(["slow","slowmode","_promiseSlow"],[G,G,[null]])}else{var W=[s,!1,0];this.log.info("["+s+"] This room is no longer in slow mode."),this.emits(["slow","slowmode","_promiseSlowoff"],[W,W,[null]])}if(e.tags.hasOwnProperty("followers-only"))if("-1"===e.tags["followers-only"]){var W=[s,!1,0];this.log.info("["+s+"] This room is no longer in followers-only mode."),this.emits(["followersonly","followersmode","_promiseFollowersoff"],[W,W,[null]])}else{var q=~~e.tags["followers-only"],G=[s,!0,q];this.log.info("["+s+"] This room is now in follower-only mode."),this.emits(["followersonly","followersmode","_promiseFollowers"],[G,G,[null]])}}break;case"SERVERCHANGE":break;default:this.log.warn("Could not parse message from tmi.twitch.tv:\n"+JSON.stringify(e,null,4))}else if("jtv"===e.prefix)switch(e.command){case"MODE":"+o"===n?(this.moderators[s]||(this.moderators[s]=[]),this.moderators[s].includes(e.params[2])||this.moderators[s].push(e.params[2]),this.emit("mod",s,e.params[2])):"-o"===n&&(this.moderators[s]||(this.moderators[s]=[]),this.moderators[s].filter(function(t){return t!=e.params[2]}),this.emit("unmod",s,e.params[2]));break;default:this.log.warn("Could not parse message from jtv:\n"+JSON.stringify(e,null,4))}else switch(e.command){case"353":this.emit("names",e.params[2],e.params[3].split(" "));break;case"366":break;case"JOIN":var V=e.prefix.split("!")[0];u.isJustinfan(this.getUsername())&&this.username===V&&(this.lastJoined=s,this.channels.push(s),this.log.info("Joined "+s),this.emit("join",s,V,!0)),this.username!==V&&this.emit("join",s,V,!1);break;case"PART":var F=!1,V=e.prefix.split("!")[0];if(this.username===V){F=!0,this.userstate[s]&&delete this.userstate[s];var z=this.channels.indexOf(s);-1!==z&&this.channels.splice(z,1);var z=this.opts.channels.indexOf(s);-1!==z&&this.opts.channels.splice(z,1),this.log.info("Left "+s),this.emit("_promisePart",null)}this.emit("part",s,V,F);break;case"WHISPER":var V=e.prefix.split("!")[0];this.log.info("[WHISPER] <"+V+">: "+n),e.tags.hasOwnProperty("username")||(e.tags.username=V),e.tags["message-type"]="whisper";var B=u.channel(e.tags.username);this.emits(["whisper","message"],[[B,e.tags,n,!1]]);break;case"PRIVMSG":if(e.tags.username=e.prefix.split("!")[0],"jtv"===e.tags.username){var $=u.username(n.split(" ")[0]),K=n.includes("auto");if(n.includes("hosting you for")){var Q=u.extractNumber(n);this.emit("hosted",s,$,Q,K)}else n.includes("hosting you")&&this.emit("hosted",s,$,0,K)}else{var X=u.actionMessage(n);X?(e.tags["message-type"]="action",this.log.info("["+s+"] *<"+e.tags.username+">: "+X[1]),this.emits(["action","message"],[[s,e.tags,X[1],!1]])):e.tags.hasOwnProperty("bits")?this.emit("cheer",s,e.tags,n):(e.tags["message-type"]="chat",this.log.info("["+s+"] <"+e.tags.username+">: "+n),this.emits(["chat","message"],[[s,e.tags,n,!1]]))}break;default:this.log.warn("Could not parse message:\n"+JSON.stringify(e,null,4))}}},h.prototype.connect=function(){var e=this;return new Promise(function(t,s){e.server=u.get(e.opts.connection.server,"irc-ws.chat.twitch.tv"),e.port=u.get(e.opts.connection.port,80),e.secure&&(e.port=443),443===e.port&&(e.secure=!0),e.reconnectTimer=e.reconnectTimer*e.reconnectDecay,e.reconnectTimer>=e.maxReconnectInterval&&(e.reconnectTimer=e.maxReconnectInterval),e._openConnection(),e.once("_promiseConnect",function(n){n?s(n):t([e.server,~~e.port])})})},h.prototype._openConnection=function(){this.ws=new l((this.secure?"wss":"ws")+"://"+this.server+":"+this.port+"/","irc"),this.ws.onmessage=this._onMessage.bind(this),this.ws.onerror=this._onError.bind(this),this.ws.onclose=this._onClose.bind(this),this.ws.onopen=this._onOpen.bind(this)},h.prototype._onOpen=function(){u.isNull(this.ws)||1!==this.ws.readyState||(this.log.info("Connecting to "+this.server+" on port "+this.port+".."),this.emit("connecting",this.server,~~this.port),this.username=u.get(this.opts.identity.username,u.justinfan()),this.password=u.password(u.get(this.opts.identity.password,"SCHMOOPIIE")),this.log.info("Sending authentication to server.."),this.emit("logon"),this.ws.send("CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership"),this.ws.send("PASS "+this.password),this.ws.send("NICK "+this.username))},h.prototype._onMessage=function(e){var t=this,s=e.data.split("\r\n");s.forEach(function(e){u.isNull(e)||t.handleMessage(a.msg(e))})},h.prototype._onError=function(){var e=this;this.moderators={},this.userstate={},this.globaluserstate={},clearInterval(this.pingLoop),clearTimeout(this.pingTimeout),this.reason=u.isNull(this.ws)?"Connection closed.":"Unable to connect.",this.emits(["_promiseConnect","disconnected"],[[this.reason]]),this.reconnect&&this.reconnections===this.maxReconnectAttempts&&(this.emit("maxreconnect"),this.log.error("Maximum reconnection attempts reached.")),this.reconnect&&!this.reconnecting&&this.reconnections<=this.maxReconnectAttempts-1&&(this.reconnecting=!0,this.reconnections=this.reconnections+1,this.log.error("Reconnecting in "+Math.round(this.reconnectTimer/1e3)+" seconds.."),this.emit("reconnect"),setTimeout(function(){e.reconnecting=!1,e.connect()},this.reconnectTimer)),this.ws=null},h.prototype._onClose=function(){var e=this;this.moderators={},this.userstate={},this.globaluserstate={},clearInterval(this.pingLoop),clearTimeout(this.pingTimeout),this.wasCloseCalled?(this.wasCloseCalled=!1,this.reason="Connection closed.",this.log.info(this.reason),this.emits(["_promiseConnect","_promiseDisconnect","disconnected"],[[this.reason],[null],[this.reason]])):(this.emits(["_promiseConnect","disconnected"],[[this.reason]]),this.reconnect&&this.reconnections===this.maxReconnectAttempts&&(this.emit("maxreconnect"),this.log.error("Maximum reconnection attempts reached.")),this.reconnect&&!this.reconnecting&&this.reconnections<=this.maxReconnectAttempts-1&&(this.reconnecting=!0,this.reconnections=this.reconnections+1,this.log.error("Could not connect to server. Reconnecting in "+Math.round(this.reconnectTimer/1e3)+" seconds.."),this.emit("reconnect"),setTimeout(function(){e.reconnecting=!1,e.connect()},this.reconnectTimer))),this.ws=null},h.prototype._getPromiseDelay=function(){return this.currentLatency<=600?600:this.currentLatency+100},h.prototype._sendCommand=function(e,t,s,n){var i=this;return new Promise(function(o,r){if(u.isNull(i.ws)||1!==i.ws.readyState)return r("Not connected to server.");if("number"==typeof e&&u.promiseDelay(e).then(function(){r("No response from Twitch.")}),u.isNull(t))i.log.info("Executing command: "+s),i.ws.send(s);else{var a=u.channel(t);i.log.info("["+a+"] Executing command: "+s),i.ws.send("PRIVMSG "+a+" :"+s)}n(o,r)})},h.prototype._sendMessage=function(e,t,s,n){var i=this;return new Promise(function(o,r){if(u.isNull(i.ws)||1!==i.ws.readyState)return r("Not connected to server.");if(u.isJustinfan(i.getUsername()))return r("Cannot send anonymous messages.");var c=u.channel(t);if(i.userstate[c]||(i.userstate[c]={}),s.length>=500){var l=u.splitLine(s,500);s=l[0],setTimeout(function(){i._sendMessage(e,t,l[1],function(){})},350)}i.ws.send("PRIVMSG "+c+" :"+s);var h={};Object.keys(i.emotesets).forEach(function(e){i.emotesets[e].forEach(function(e){return u.isRegex(e.code)?a.emoteRegex(s,e.code,e.id,h):void a.emoteString(s,e.code,e.id,h)})});var m=u.merge(i.userstate[c],a.emotes({emotes:a.transformEmotes(h)||null})),f=u.actionMessage(s);f?(m["message-type"]="action",i.log.info("["+c+"] *<"+i.getUsername()+">: "+f[1]),i.emits(["action","message"],[[c,m,f[1],!0]])):(m["message-type"]="chat",i.log.info("["+c+"] <"+i.getUsername()+">: "+s),i.emits(["chat","message"],[[c,m,s,!0]])),n(o,r)})},h.prototype._updateEmoteset=function(e){var t=this;this.emotes=e,this.api({url:"/chat/emoticon_images?emotesets="+e,headers:{Authorization:"OAuth "+u.password(u.get(this.opts.identity.password,"")).replace("oauth:",""),"Client-ID":this.clientId}},function(s,n,i){return s?void setTimeout(function(){t._updateEmoteset(e)},6e4):(t.emotesets=i.emoticon_sets||{},t.emit("emotesets",e,t.emotesets))})},h.prototype.getUsername=function(){return this.username},h.prototype.getOptions=function(){return this.opts},h.prototype.getChannels=function(){return this.channels},h.prototype.isMod=function(e,t){var s=u.channel(e);return this.moderators[s]||(this.moderators[s]=[]),this.moderators[s].includes(u.username(t))},h.prototype.readyState=function(){return u.isNull(this.ws)?"CLOSED":["CONNECTING","OPEN","CLOSING","CLOSED"][this.ws.readyState]},h.prototype.disconnect=function(){var e=this;return new Promise(function(t,s){u.isNull(e.ws)||3===e.ws.readyState?(e.log.error("Cannot disconnect from server. Socket is not opened or connection is already closing."),s("Cannot disconnect from server. Socket is not opened or connection is already closing.")):(e.wasCloseCalled=!0,e.log.info("Disconnecting from server.."),e.ws.close(),e.once("_promiseDisconnect",function(){t([e.server,~~e.port])}))})},"undefined"!=typeof t&&t.exports&&(t.exports=h),"undefined"!=typeof window&&(window.tmi={},window.tmi.client=h,window.tmi.Client=h)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./api":2,"./commands":4,"./events":5,"./logger":6,"./parser":7,"./timer":8,"./utils":9,ws:10}],4:[function(e,t,s){"use strict";function n(e,t){var s=this;return e=u.channel(e),t=u.get(t,30),this._sendCommand(this._getPromiseDelay(),e,"/followers "+t,function(n,i){s.once("_promiseFollowers",function(s){s?i(s):n([e,~~t])})})}function i(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),e,"/followersoff",function(s,n){t.once("_promiseFollowersoff",function(t){t?n(t):s([e])})})}function o(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),null,"PART "+e,function(s,n){t.once("_promisePart",function(t){t?n(t):s([e])})})}function r(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),e,"/r9kbeta",function(s,n){t.once("_promiseR9kbeta",function(t){t?n(t):s([e])})})}function a(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),e,"/r9kbetaoff",function(s,n){t.once("_promiseR9kbetaoff",function(t){t?n(t):s([e])})})}function c(e,t){var s=this;return e=u.channel(e),t=u.get(t,300),this._sendCommand(this._getPromiseDelay(),e,"/slow "+t,function(n,i){s.once("_promiseSlow",function(s){s?i(s):n([e,~~t])})})}function l(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),e,"/slowoff",function(s,n){t.once("_promiseSlowoff",function(t){t?n(t):s([e])})})}var u=e("./utils");t.exports={action:function(e,t){return e=u.channel(e),t="ACTION "+t+"",this._sendMessage(this._getPromiseDelay(),e,t,function(s,n){s([e,t])})},ban:function(e,t,s){var n=this;return e=u.channel(e),t=u.username(t),s=u.get(s,""),this._sendCommand(this._getPromiseDelay(),e,"/ban "+t+" "+s,function(i,o){n.once("_promiseBan",function(n){n?o(n):i([e,t,s])})})},clear:function(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),e,"/clear",function(s,n){t.once("_promiseClear",function(t){t?n(t):s([e])})})},color:function(e,t){var s=this;return t=u.get(t,e),this._sendCommand(this._getPromiseDelay(),"#tmijs","/color "+t,function(e,n){s.once("_promiseColor",function(s){s?n(s):e([t])})})},commercial:function(e,t){var s=this;return e=u.channel(e),t=u.get(t,30),this._sendCommand(this._getPromiseDelay(),e,"/commercial "+t,function(n,i){s.once("_promiseCommercial",function(s){s?i(s):n([e,~~t])})})},deletemessage:function(e,t){var s=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),e,"/delete "+t,function(t,n){s.once("_promiseDeletemessage",function(s){s?n(s):t([e])})})},emoteonly:function(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),e,"/emoteonly",function(s,n){t.once("_promiseEmoteonly",function(t){t?n(t):s([e])})})},emoteonlyoff:function(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),e,"/emoteonlyoff",function(s,n){t.once("_promiseEmoteonlyoff",function(t){t?n(t):s([e])})})},followersonly:n,followersmode:n,followersonlyoff:i,followersmodeoff:i,host:function(e,t){var s=this;return e=u.channel(e),t=u.username(t),this._sendCommand(2e3,e,"/host "+t,function(n,i){s.once("_promiseHost",function(s,o){s?i(s):n([e,t,~~o])})})},join:function(e){var t=this;return e=u.channel(e),this._sendCommand(null,null,"JOIN "+e,function(s,n){var i="_promiseJoin",o=!1,r=function c(r,a){e===u.channel(a)&&(t.removeListener(i,c),o=!0,r?n(r):s([e]))};t.on(i,r);var a=t._getPromiseDelay();u.promiseDelay(a).then(function(){o||t.emit(i,"No response from Twitch.",e)})})},mod:function(e,t){var s=this;return e=u.channel(e),t=u.username(t),this._sendCommand(this._getPromiseDelay(),e,"/mod "+t,function(n,i){s.once("_promiseMod",function(s){s?i(s):n([e,t])})})},mods:function(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),e,"/mods",function(s,n){t.once("_promiseMods",function(i,o){i?n(i):(o.forEach(function(s){t.moderators[e]||(t.moderators[e]=[]),t.moderators[e].includes(s)||t.moderators[e].push(s)}),s(o))})})},part:o,leave:o,ping:function(){var e=this;return this._sendCommand(this._getPromiseDelay(),null,"PING",function(t,s){e.latency=new Date,e.pingTimeout=setTimeout(function(){null!==e.ws&&(e.wasCloseCalled=!1,e.log.error("Ping timeout."),e.ws.close(),clearInterval(e.pingLoop),clearTimeout(e.pingTimeout))},u.get(e.opts.connection.timeout,9999)),e.once("_promisePing",function(e){t([parseFloat(e)])})})},r9kbeta:r,r9kmode:r,r9kbetaoff:a,r9kmodeoff:a,raw:function(e){return this._sendCommand(this._getPromiseDelay(),null,e,function(t,s){t([e])})},say:function(e,t){return e=u.channel(e),t.startsWith(".")&&!t.startsWith("..")||t.startsWith("/")||t.startsWith("\\")?"me "===t.substr(1,3)?this.action(e,t.substr(4)):this._sendCommand(this._getPromiseDelay(),e,t,function(s,n){s([e,t])}):this._sendMessage(this._getPromiseDelay(),e,t,function(s,n){s([e,t])})},slow:c,slowmode:c,slowoff:l,slowmodeoff:l,subscribers:function(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),e,"/subscribers",function(s,n){t.once("_promiseSubscribers",function(t){t?n(t):s([e])})})},subscribersoff:function(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),e,"/subscribersoff",function(s,n){t.once("_promiseSubscribersoff",function(t){t?n(t):s([e])})})},timeout:function(e,t,s,n){var i=this;return e=u.channel(e),t=u.username(t),u.isNull(s)||u.isInteger(s)||(n=s,s=300),s=u.get(s,300),n=u.get(n,""),this._sendCommand(this._getPromiseDelay(),e,"/timeout "+t+" "+s+" "+n,function(o,r){i.once("_promiseTimeout",function(i){i?r(i):o([e,t,~~s,n])})})},unban:function(e,t){var s=this;return e=u.channel(e),t=u.username(t),this._sendCommand(this._getPromiseDelay(),e,"/unban "+t,function(n,i){s.once("_promiseUnban",function(s){s?i(s):n([e,t])})})},unhost:function(e){var t=this;return e=u.channel(e),this._sendCommand(2e3,e,"/unhost",function(s,n){t.once("_promiseUnhost",function(t){t?n(t):s([e])})})},unmod:function(e,t){var s=this;return e=u.channel(e),t=u.username(t),this._sendCommand(this._getPromiseDelay(),e,"/unmod "+t,function(n,i){s.once("_promiseUnmod",function(s){s?i(s):n([e,t])})})},unvip:function(e,t){var s=this;return e=u.channel(e),t=u.username(t),this._sendCommand(this._getPromiseDelay(),e,"/unvip "+t,function(n,i){s.once("_promiseUnvip",function(s){s?i(s):n([e,t])})})},vip:function(e,t){var s=this;return e=u.channel(e),t=u.username(t),this._sendCommand(this._getPromiseDelay(),e,"/vip "+t,function(n,i){s.once("_promiseVip",function(s){s?i(s):n([e,t])})})},vips:function(e){var t=this;return e=u.channel(e),this._sendCommand(this._getPromiseDelay(),e,"/vips",function(e,s){t.once("_promiseVips",function(t,n){t?s(t):e(n)})})},whisper:function(e,t){var s=this;return e=u.username(e),e===this.getUsername()?Promise.reject("Cannot send a whisper to the same account."):this._sendCommand(this._getPromiseDelay(),"#tmijs","/w "+e+" "+t,function(n,i){var o=u.channel(e),r=u.merge({"message-type":"whisper","message-id":null,"thread-id":null,username:s.getUsername()
},s.globaluserstate);s.emits(["whisper","message"],[[o,r,t,!0],[o,r,t,!0]]),n([e,t])})}}},{"./utils":9}],5:[function(e,t,s){"use strict";function n(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function i(e){return"function"==typeof e}function o(e){return"number"==typeof e}function r(e){return"object"===("undefined"==typeof e?"undefined":c(e))&&null!==e}function a(e){return void 0===e}var c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};String.prototype.startsWith||(String.prototype.startsWith=function(e,t){return t=t||0,this.indexOf(e,t)===t}),t.exports=n,n.EventEmitter=n,n.prototype._events=void 0,n.prototype._maxListeners=void 0,n.defaultMaxListeners=10,n.prototype.setMaxListeners=function(e){if(!o(e)||0>e||isNaN(e))throw TypeError("n must be a positive number");return this._maxListeners=e,this},n.prototype.emits=function(e,t){for(var s=0;s<e.length;s++){var n=s<t.length?t[s]:t[t.length-1];this.emit.apply(this,[e[s]].concat(n))}},n.prototype.emit=function(e){var t,s,n,o,c,l;if(this._events||(this._events={}),"error"===e&&(!this._events.error||r(this._events.error)&&!this._events.error.length)){if(t=arguments[1],t instanceof Error)throw t;throw TypeError('Uncaught, unspecified "error" event.')}if(s=this._events[e],a(s))return!1;if(i(s))switch(arguments.length){case 1:s.call(this);break;case 2:s.call(this,arguments[1]);break;case 3:s.call(this,arguments[1],arguments[2]);break;default:o=Array.prototype.slice.call(arguments,1),s.apply(this,o)}else if(r(s))for(o=Array.prototype.slice.call(arguments,1),l=s.slice(),n=l.length,c=0;n>c;c++)l[c].apply(this,o);return!0},n.prototype.addListener=function(e,t){var s;if(!i(t))throw TypeError("listener must be a function");return this._events||(this._events={}),this._events.newListener&&this.emit("newListener",e,i(t.listener)?t.listener:t),this._events[e]?r(this._events[e])?this._events[e].push(t):this._events[e]=[this._events[e],t]:this._events[e]=t,r(this._events[e])&&!this._events[e].warned&&(s=a(this._maxListeners)?n.defaultMaxListeners:this._maxListeners,s&&s>0&&this._events[e].length>s&&(this._events[e].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[e].length),"function"==typeof console.trace&&console.trace())),this},n.prototype.on=n.prototype.addListener,n.prototype.once=function(e,t){function s(){"_"!==e.charAt(0)||isNaN(e.substr(e.length-1))||(e=e.substring(0,e.length-1)),this.removeListener(e,s),n||(n=!0,t.apply(this,arguments))}if(!i(t))throw TypeError("listener must be a function");var n=!1;if(this._events.hasOwnProperty(e)&&"_"===e.charAt(0)){var o=1,r=e;for(var a in this._events)this._events.hasOwnProperty(a)&&a.startsWith(r)&&o++;e+=o}return s.listener=t,this.on(e,s),this},n.prototype.removeListener=function(e,t){var s,n,o,a;if(!i(t))throw TypeError("listener must be a function");if(!this._events||!this._events[e])return this;if(s=this._events[e],o=s.length,n=-1,s===t||i(s.listener)&&s.listener===t){if(delete this._events[e],this._events.hasOwnProperty(e+"2")&&"_"===e.charAt(0)){var c=e;for(var l in this._events)this._events.hasOwnProperty(l)&&l.startsWith(c)&&(isNaN(parseInt(l.substr(l.length-1)))||(this._events[e+parseInt(l.substr(l.length-1)-1)]=this._events[l],delete this._events[l]));this._events[e]=this._events[e+"1"],delete this._events[e+"1"]}this._events.removeListener&&this.emit("removeListener",e,t)}else if(r(s)){for(a=o;a-- >0;)if(s[a]===t||s[a].listener&&s[a].listener===t){n=a;break}if(0>n)return this;1===s.length?(s.length=0,delete this._events[e]):s.splice(n,1),this._events.removeListener&&this.emit("removeListener",e,t)}return this},n.prototype.removeAllListeners=function(e){var t,s;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[e]&&delete this._events[e],this;if(0===arguments.length){for(t in this._events)"removeListener"!==t&&this.removeAllListeners(t);return this.removeAllListeners("removeListener"),this._events={},this}if(s=this._events[e],i(s))this.removeListener(e,s);else if(s)for(;s.length;)this.removeListener(e,s[s.length-1]);return delete this._events[e],this},n.prototype.listeners=function(e){var t;return t=this._events&&this._events[e]?i(this._events[e])?[this._events[e]]:this._events[e].slice():[]},n.prototype.listenerCount=function(e){if(this._events){var t=this._events[e];if(i(t))return 1;if(t)return t.length}return 0},n.listenerCount=function(e,t){return e.listenerCount(t)}},{}],6:[function(e,t,s){"use strict";function n(e){return function(t){r[e]>=r[o]&&console.log("["+i.formatDate(new Date)+"] "+e+": "+t)}}var i=e("./utils"),o="info",r={trace:0,debug:1,info:2,warn:3,error:4,fatal:5};t.exports={setLevel:function(e){o=e},trace:n("trace"),debug:n("debug"),info:n("info"),warn:n("warn"),error:n("error"),fatal:n("fatal")}},{"./utils":9}],7:[function(e,t,s){"use strict";function n(e,t){var s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:",",n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"/",o=arguments[4],r=e[t];if(void 0===r)return e;var a=i.isString(r);if(e[t+"-raw"]=a?r:null,r===!0)return e[t]=null,e;if(e[t]={},a)for(var c=r.split(s),l=0;l<c.length;l++){var u=c[l].split(n),h=u[1];void 0!==o&&h&&(h=h.split(o)),e[t][u[0]]=h||null}return e}var i=e("./utils"),o=/\S+/g;t.exports={badges:function(e){return n(e,"badges")},badgeInfo:function(e){return n(e,"badge-info")},emotes:function(e){return n(e,"emotes","/",":",",")},emoteRegex:function(e,t,s,n){o.lastIndex=0;for(var r,a=new RegExp("(\\b|^|s)"+i.unescapeHtml(t)+"(\\b|$|s)");null!==(r=o.exec(e));)a.test(r[0])&&(n[s]=n[s]||[],n[s].push([r.index,o.lastIndex-1]))},emoteString:function(e,t,s,n){o.lastIndex=0;for(var r;null!==(r=o.exec(e));)r[0]===i.unescapeHtml(t)&&(n[s]=n[s]||[],n[s].push([r.index,o.lastIndex-1]))},transformEmotes:function(e){var t="";return Object.keys(e).forEach(function(s){t=t+s+":",e[s].forEach(function(e){t=t+e.join("-")+","}),t=t.slice(0,-1)+"/"}),t.slice(0,-1)},msg:function(e){var t={raw:e,tags:{},prefix:null,command:null,params:[]},s=0,n=0;if(64===e.charCodeAt(0)){var n=e.indexOf(" ");if(-1===n)return null;for(var i=e.slice(1,n).split(";"),o=0;o<i.length;o++){var r=i[o],a=r.split("=");t.tags[a[0]]=r.substring(r.indexOf("=")+1)||!0}s=n+1}for(;32===e.charCodeAt(s);)s++;if(58===e.charCodeAt(s)){if(n=e.indexOf(" ",s),-1===n)return null;for(t.prefix=e.slice(s+1,n),s=n+1;32===e.charCodeAt(s);)s++}if(n=e.indexOf(" ",s),-1===n)return e.length>s?(t.command=e.slice(s),t):null;for(t.command=e.slice(s,n),s=n+1;32===e.charCodeAt(s);)s++;for(;s<e.length;){if(n=e.indexOf(" ",s),58===e.charCodeAt(s)){t.params.push(e.slice(s+1));break}if(-1===n){if(-1===n){t.params.push(e.slice(s));break}}else for(t.params.push(e.slice(s,n)),s=n+1;32===e.charCodeAt(s);)s++}return t}}},{"./utils":9}],8:[function(e,t,s){"use strict";function n(e){this.queue=[],this.index=0,this.defaultDelay=e||3e3}n.prototype.add=function(e,t){this.queue.push({fn:e,delay:t})},n.prototype.run=function(e){(e||0===e)&&(this.index=e),this.next()},n.prototype.next=function i(){var e=this,t=this.index++,s=this.queue[t],i=this.queue[this.index];s&&(s.fn(),i&&setTimeout(function(){e.next()},i.delay||this.defaultDelay))},n.prototype.reset=function(){this.index=0},n.prototype.clear=function(){this.index=0,this.queue=[]},s.queue=n},{}],9:[function(e,t,s){(function(e){"use strict";var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n=/^\u0001ACTION ([^\u0001]+)\u0001$/,i=/^(justinfan)(\d+$)/,o=/\\([sn:r\\])/g,r={s:" ",n:"",":":";",r:""},a=t.exports={get:function(e,t){return"undefined"==typeof e?t:e},isBoolean:function(e){return"boolean"==typeof e},isFinite:function(e){function t(t){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(e){return isFinite(e)&&!isNaN(parseFloat(e))}),isInteger:function(e){return!isNaN(a.toNumber(e,0))},isJustinfan:function(e){return i.test(e)},isNull:function(e){return null===e},isRegex:function(e){return/[\|\\\^\$\*\+\?\:\#]/.test(e)},isString:function(e){return"string"==typeof e},isURL:function(e){return RegExp("^(?:(?:https?|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))\\.?)(?::\\d{2,5})?(?:[/?#]\\S*)?$","i").test(e)},justinfan:function(){return"justinfan"+Math.floor(8e4*Math.random()+1e3)},password:function(e){return["SCHMOOPIIE","",null].includes(e)?"SCHMOOPIIE":"oauth:"+e.toLowerCase().replace("oauth:","")},promiseDelay:function(e){return new Promise(function(t){setTimeout(t,e)})},replaceAll:function(e,t){if(null===e||"undefined"==typeof e)return null;for(var s in t)e=e.replace(new RegExp(s,"g"),t[s]);return e},unescapeHtml:function(e){return e.replace(/\\&amp\\;/g,"&").replace(/\\&lt\\;/g,"<").replace(/\\&gt\\;/g,">").replace(/\\&quot\\;/g,'"').replace(/\\&#039\\;/g,"'")},unescapeIRC:function(e){return e&&e.includes("\\")?e.replace(o,function(e,t){return t in r?r[t]:t}):e},actionMessage:function(e){return e.match(n)},addWord:function(e,t){return e.length?e+" "+t:e+t},channel:function c(e){var c=(e?e:"").toLowerCase();return"#"===c[0]?c:"#"+c},extractNumber:function(e){for(var t=e.split(" "),s=0;s<t.length;s++)if(a.isInteger(t[s]))return~~t[s];return 0},formatDate:function(e){var t=e.getHours(),s=e.getMinutes();return t=(10>t?"0":"")+t,s=(10>s?"0":"")+s,t+":"+s},inherits:function(e,t){e.super_=t;var s=function(){};s.prototype=t.prototype,e.prototype=new s,e.prototype.constructor=e},isNode:function(){try{return"object"===("undefined"==typeof e?"undefined":s(e))&&"[object process]"===Object.prototype.toString.call(e)}catch(t){}return!1},isExtension:function(){try{return window.chrome&&chrome.runtime&&chrome.runtime.id}catch(e){}return!1},isReactNative:function(){try{return navigator&&"ReactNative"==navigator.product}catch(e){}return!1},merge:Object.assign,splitLine:function(e,t){var s=e.substring(0,t).lastIndexOf(" ");return-1===s&&(s=t-1),[e.substring(0,s),e.substring(s+1)]},toNumber:function(e,t){if(null===e)return 0;var s=Math.pow(10,a.isFinite(t)?t:0);return Math.round(e*s)/s},union:function(e,t){for(var s={},n=[],i=0;i<e.length;i++){var o=e[i];s[o]||(s[o]=!0,n.push(o))}for(var i=0;i<t.length;i++){var o=t[i];s[o]||(s[o]=!0,n.push(o))}return n},username:function l(e){var l=(e?e:"").toLowerCase();return"#"===l[0]?l.slice(1):l}}}).call(this,e("_process"))},{_process:11}],10:[function(e,t,s){"use strict"},{}],11:[function(e,t,s){function n(){throw new Error("setTimeout has not been defined")}function i(){throw new Error("clearTimeout has not been defined")}function o(e){if(h===setTimeout)return setTimeout(e,0);if((h===n||!h)&&setTimeout)return h=setTimeout,setTimeout(e,0);try{return h(e,0)}catch(t){try{return h.call(null,e,0)}catch(t){return h.call(this,e,0)}}}function r(e){if(m===clearTimeout)return clearTimeout(e);if((m===i||!m)&&clearTimeout)return m=clearTimeout,clearTimeout(e);try{return m(e)}catch(t){try{return m.call(null,e)}catch(t){return m.call(this,e)}}}function a(){g&&p&&(g=!1,p.length?d=p.concat(d):_=-1,d.length&&c())}function c(){if(!g){var e=o(a);g=!0;for(var t=d.length;t;){for(p=d,d=[];++_<t;)p&&p[_].run();_=-1,t=d.length}p=null,g=!1,r(e)}}function l(e,t){this.fun=e,this.array=t}function u(){}var h,m,f=t.exports={};!function(){try{h="function"==typeof setTimeout?setTimeout:n}catch(e){h=n}try{m="function"==typeof clearTimeout?clearTimeout:i}catch(e){m=i}}();var p,d=[],g=!1,_=-1;f.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var s=1;s<arguments.length;s++)t[s-1]=arguments[s];d.push(new l(e,t)),1!==d.length||g||o(c)},l.prototype.run=function(){this.fun.apply(null,this.array)},f.title="browser",f.browser=!0,f.env={},f.argv=[],f.version="",f.versions={},f.on=u,f.addListener=u,f.once=u,f.off=u,f.removeListener=u,f.removeAllListeners=u,f.emit=u,f.prependListener=u,f.prependOnceListener=u,f.listeners=function(e){return[]},f.binding=function(e){throw new Error("process.binding is not supported")},f.cwd=function(){return"/"},f.chdir=function(e){throw new Error("process.chdir is not supported")},f.umask=function(){return 0}},{}]},{},[1]);
}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
const { hasSearchParam } = require("./utils");
const { generateGopher, generateEndingGopher } = require("./gophers");
const {
  songReady,
  playSong,
  getSongDuration,
  createDurationSeconds,
  resetSongPlaybackRate,
  setSongPlaybackRate,
} = require("./song");
const getRandomOccurance = require("./random-occurances");
const initTwitchChat = require("./twitch-chat");

const twitchChat = initTwitchChat();

async function launchGophers() {
  const randomOccurance = getRandomOccurance();

  await songReady();

  if (randomOccurance === "fast") {
    setSongPlaybackRate(2);
  }

  let gopherEndingRoscoAudio;
  if (randomOccurance === "rosco") {
    gopherEndingRoscoAudio = new Audio("songs/end-rosco.mp3");
    gopherEndingRoscoAudio.preload = true;
  }

  await playSong();

  function afterCountdown() {
    const gophersIntervals = [
      setInterval(generateGopher, createDurationSeconds(1)),
      setInterval(generateGopher, createDurationSeconds(1.5)),
    ];

    if (randomOccurance === "fast") {
      // more gophers
      gophersIntervals.push(
        setInterval(generateGopher, createDurationSeconds(1.25))
      );
      gophersIntervals.push(
        setInterval(generateGopher, createDurationSeconds(1.75))
      );
    }

    function justBeforeTheEndOfTheSong() {
      resetSongPlaybackRate();
      gophersIntervals.forEach(clearInterval);
      generateEndingGopher();

      if (gopherEndingRoscoAudio) {
        gopherEndingRoscoAudio.play();
      }

      if (twitchChat) {
        if (randomOccurance === "rosco") {
          twitchChat.sendMessage(
            "Image illustration by peiyun: https://twitter.com/_peiyen/status/1322384780239888384"
          );
        }
      }
    }

    const songDuration = createDurationSeconds(getSongDuration());
    const hahaDidYouGetMeDuration = createDurationSeconds(2);
    const endingTimeout =
      songDuration - countdownDuration - hahaDidYouGetMeDuration;
    setTimeout(justBeforeTheEndOfTheSong, endingTimeout);
  }

  const countdownDuration = createDurationSeconds(9.6);
  setTimeout(afterCountdown, countdownDuration);
}

function debugPlayButton(callback) {
  /*
  in browsers it often complains at autoplay, so for debug we add a
  ?showPlayButton to the end of the URL to allow us to start it with
  a button
*/
  if (hasSearchParam("showPlayButton")) {
    const buttonElem = document.createElement("button");
    buttonElem.innerText = "Play Gophers";
    buttonElem.addEventListener("click", () => {
      callback();
      buttonElem.remove();
    });
    document.body.append(buttonElem);
  } else {
    callback();
  }
}

debugPlayButton(launchGophers);

},{"./gophers":1,"./random-occurances":4,"./song":5,"./twitch-chat":6,"./utils":7}],4:[function(require,module,exports){
const { hasSearchParam, shuffleArray } = require("./utils");

const RANDOM_OCCURANCES = [
  { type: "fast", chancePercentage: 5 },
  { type: "rosco", chancePercentage: 5 },
];

function generateRandomOccurance() {
  // if we want the random occurances to stop add ?disableOccurances=true
  if (hasSearchParam("disableOccurances")) {
    return;
  }

  const shuffledRandomOccurances = shuffleArray(RANDOM_OCCURANCES);

  const occurance = shuffledRandomOccurances.find((occurance) => {
    const randomNumberBetween0And100 = Math.floor(Math.random() * 100);
    return randomNumberBetween0And100 <= occurance.chancePercentage;
  });

  if (!occurance) {
    return;
  }

  return occurance.type;
}

const randomOccurance = generateRandomOccurance();
console.log("Random occurance:", randomOccurance || "none");

function getRandomOccurance() {
  return randomOccurance;
}

module.exports = getRandomOccurance;

},{"./utils":7}],5:[function(require,module,exports){
const getRandomOccurance = require("./random-occurances");
const randomOccurance = getRandomOccurance();

const PLAYBACK_RATE_DEFAULT = 1;

let gopherSongAudio;

function getGopherSong() {
  if (randomOccurance === "rosco") {
    return "gophers-rosco.mp3";
  }

  return "gophers-original.mp3";
}

function setSongPlaybackRate(value) {
  gopherSongAudio.playbackRate = value;
}

function resetSongPlaybackRate() {
  setSongPlaybackRate(PLAYBACK_RATE_DEFAULT);
}

function songReady() {
  gopherSongAudio = new Audio(`songs/${getGopherSong()}`);
  gopherSongAudio.preload = true;
  gopherSongAudio.playbackRate = PLAYBACK_RATE_DEFAULT; // min is 0.5, max 4 really
  gopherSongAudio.preservesPitch = true;
  gopherSongAudio.webkitPreservesPitch = true;
  gopherSongAudio.mozPreservesPitch = true;

  return new Promise((resolve) => {
    gopherSongAudio.addEventListener("canplaythrough", resolve);
  });
}

function playSong() {
  return new Promise((resolve) => {
    gopherSongAudio.play();
    gopherSongAudio.addEventListener("play", resolve);
  });
}

function getSongDuration() {
  return gopherSongAudio.duration;
}

function createDurationSeconds(seconds) {
  return (seconds * 1000) / gopherSongAudio.playbackRate;
}

module.exports = {
  resetSongPlaybackRate,
  setSongPlaybackRate,
  songReady,
  playSong,
  getSongDuration,
  createDurationSeconds,
};

},{"./random-occurances":4}],6:[function(require,module,exports){
require("./lib/tmi-1.5.0.min.js"); // creates tmi global
const { getSearchParam } = require("./utils");

function initTwitchChat() {
  const oAuthSearchParam = getSearchParam("oAuth");
  const channelSearchParam = getSearchParam("channel");

  if (!oAuthSearchParam || !channelSearchParam) {
    return null;
  }

  console.log("oAuthSearchParam", oAuthSearchParam);
  console.log("channelSearchParam", channelSearchParam);

  const client = new tmi.Client({
    options: { debug: true },
    connection: {
      secure: true,
      reconnect: true,
    },
    identity: {
      username: "TheMostBeautifulDog",
      password: `oauth:${oAuthSearchParam}`,
    },
    channels: [channelSearchParam],
  });

  client.connect();

  client.sendMessage = (message) => {
    client.say(channelSearchParam, message);
  };

  return client;
}

module.exports = initTwitchChat;

},{"./lib/tmi-1.5.0.min.js":2,"./utils":7}],7:[function(require,module,exports){
function hasSearchParam(param) {
  const searchParams = new URLSearchParams(window.location.search);
  if (!searchParams) {
    return false;
  }
  return searchParams.has(param);
}

function getSearchParam(param) {
  const searchParams = new URLSearchParams(window.location.search);
  if (!searchParams) {
    return "";
  }
  return searchParams.get(param);
}

function shuffleArray(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

module.exports = {
  hasSearchParam,
  getSearchParam,
  shuffleArray,
};

},{}]},{},[3]);
