(function(c,r){var l=function(s){return r.getElementById(s)};var i=function(y){y=y||document;var v=y.defaultView||y.parentWindow,t=y.compatMode,x=y.documentElement,s=v.innerHeight||0,A=v.innerWidth||0,B=v.pageXOffset||0,z=v.pageYOffset||0,C=x.scrollWidth,u=x.scrollHeight;if(t!=="CSS1Compat"){x=y.body;C=x.scrollWidth;u=x.scrollHeight}if(t){A=x.clientWidth;s=x.clientHeight}C=Math.max(C,A);u=Math.max(u,s);B=Math.max(B,y.documentElement.scrollLeft,y.body.scrollLeft);z=Math.max(z,y.documentElement.scrollTop,y.body.scrollTop);return{width:A,height:s,scrollWidth:C,scrollHeight:u,scrollX:B,scrollY:z}};var m=function(u){var x=u.ownerDocument,s=i(x),y=s.scrollX,w=s.scrollY,t=u.getBoundingClientRect(),v=[t.left,t.top];if(w||y){v[0]+=y;v[1]+=w}return v};var g=function(v){var z=m(v);var s=z[0];var A=z[1];var t=v.offsetWidth;var u=v.offsetHeight;return{width:t,height:u,left:s,top:A,bottom:A+u,right:s+t}};var d=function(){var t=l("comments");if(!t){return}var s=function(){var v=t.getAttribute("data-type");if(v==="disqus"){h()}else{if(v==="hypercomments"){p()}else{if(v==="changyan"){b()}else{if(v==="gitalk"){e()}else{if(v==="waline"){k()}else{if(v==="valine"){f()}}}}}}};if(location.hash.indexOf("#comments")>-1){s()}else{var u=setInterval(function(){var w=i();var x=w.scrollY+w.height;var v=g(t).top;if(Math.abs(v-x)<1000){s();clearInterval(u)}},300)}};var h=function(){var u=l("disqus_thread");if(!u){return}c.disqus_config=function(){this.page.url=u.getAttribute("data-url");this.page.identifier=u.getAttribute("data-identifier")};var t=r.createElement("script");t.src="//"+u.getAttribute("data-name")+".disqus.com/embed.js";t.setAttribute("data-timestamp",+new Date());(r.head||r.body).appendChild(t)};var p=function(){var s=l("hypercomments_widget");var t=s.getAttribute("data-name");c._hcwp=c._hcwp||[];c._hcwp.push({widget:"Stream",widget_id:t});(function(){if("HC_LOAD_INIT" in c){return}var w=(navigator.language||navigator.systemLanguage||navigator.userLanguage||"en").substr(0,2).toLowerCase();var u=document.createElement("script");u.type="text/javascript";u.async=true;u.src=("https:"===document.location.protocol?"https":"http")+"://w.hypercomments.com/widget/hc/"+t+"/"+w+"/widget.js";var v=document.getElementsByTagName("script")[0];v.parentNode.insertBefore(u,v.nextSibling)})()};var b=function(){var x=l("SOHUCS");if(!x){return}var w=x.getAttribute("data-name");var t=x.getAttribute("sid");var v=c.innerWidth||r.documentElement.clientWidth;var u=r.createElement("script");if(v<960){u.id="changyan_mobile_js";u.src="//changyan.sohu.com/upload/mobile/wap-js/changyan_mobile.js?client_id="+w+"&conf="+t}else{u.src="//changyan.sohu.com/upload/changyan.js";u.onload=function(){c.changyan.api.config({appid:w,conf:t})}}(r.head||r.body).appendChild(u)};var e=function(){var x=l("gitalk-container");if(!x){return}var w=x.getAttribute("data-name");var v=x.getAttribute("data-identifier");if(w){w=JSON.parse(w)}w.id=v;var u=r.createElement("link");u.setAttribute("rel","stylesheet");u.setAttribute("type","text/css");u.setAttribute("href","//cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.css");(r.head||r.body).appendChild(u);var t=r.createElement("script");t.src="//cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js";t.onload=function(){var s=new Gitalk(w);s.render("gitalk-container")};(r.head||r.body).appendChild(t)};var k=function(){var v=l("waline-container");var u=v.getAttribute("data-name");if(u){u=JSON.parse(u)}u.el="#waline-container";u.path=location.pathname;var t=document.createElement("script");t.src="//cdn.jsdelivr.net/npm/@waline/client/dist/Waline.min.js";t.onload=function(){new Waline(u)};(r.head||r.body).appendChild(t)};var f=function(){var t=l("valine-container");var u=t.getAttribute("data-name");if(u){u=JSON.parse(u)}u.el="#valine-container";u.path=location.pathname;var v=document.createElement("script");v.src="//cdn.jsdelivr.net/npm/valine/dist/Valine.min.js";v.onload=function(){new Valine(u)};(r.head||r.body).appendChild(v)};c.addEventListener("load",function(){d()});var o={isMob:(function(){var u=navigator.userAgent.toLowerCase();var v=["Android","iPhone","SymbianOS","Windows Phone","iPad","iPod"];var s=false;for(var t=0;t<v.length;t++){if(u.indexOf(v[t].toLowerCase())>-1){s=true}}return s})()};if(o.isMob){r.documentElement.className+=" mob"}else{r.documentElement.className+=" pc"}var a={$sidebar:r.querySelector("#sidebar"),$main:r.querySelector("#main"),$sidebar_mask:r.querySelector("#sidebar-mask"),$body:r.body,$btn_side:r.querySelector("#header .btn-bar"),$article:r.querySelectorAll(".mob #page-index article")};a.bindEvent=function(){var v=this,t="side",s="click",u="click";if(o.isMob){s="touchstart";u="touchend"}this.$btn_side.addEventListener(u,function(){if(v.$body.className.indexOf(t)>-1){v.$body.className=v.$body.className.replace(t,"");v.$sidebar_mask.style.display="none"}else{v.$body.className+=(" "+t);v.$sidebar_mask.style.display="block"}},false);this.$sidebar_mask.addEventListener(s,function(w){v.$body.className=v.$body.className.replace(t,"");v.$sidebar_mask.style.display="none";w.preventDefault()},false);c.addEventListener("resize",function(){v.$body.className=v.$body.className.replace(t,"");v.$sidebar_mask.style.display="none"},false)};a.bindEvent();c.addEventListener("load",q);c.addEventListener("scroll",q);c.addEventListener("resize",q);function q(){var s=r.getElementsByClassName("lazy-load");if(s.length===0){c.removeEventListener("load",q);c.removeEventListener("scroll",q);c.removeEventListener("resize",q)}else{for(var u=s.length-1;u>-1;u--){var t=s[u];if(j(t,300)){t.src=t.getAttribute("data-src");t.removeAttribute("data-src");t.classList.remove("lazy-load")}}}}function j(t,s){return t.offsetTop-((r.scrollingElement||r.documentElement).scrollTop+(c.innerHeight||r.documentElement.clientHeight))<s}var n={$code:r.querySelectorAll("pre code"),hasClass:function(t,s){return t.className.match(new RegExp("(\\s|^)"+s+"(\\s|$)"))},addClass:function(t,s){if(!n.hasClass(t,s)){t.className+=" "+s}},removeClass:function(t,s){if(n.hasClass(t,s)){t.className=t.className.replace(new RegExp("(\\s|^)"+s+"(\\s|$)")," ")}}};n.stringHash=function(s){var t="";if(s.index>1){t+=s.index+"-"}t+="L"+s.start;if(s.end&&s.end>s.start){t+="-L"+s.end}return t};n.parseHash=function(){var s=location.hash.substr(1).match(/((\d+)-)?L(\d+)(-L(\d+))?/);if(!s){return null}return{index:parseInt(s[2],10)||1,start:parseInt(s[3],10)||1,end:parseInt(s[5],10)||parseInt(s[3],10)||1}};n.mark=function(t){var u=n.parseHash();if(!u||!n.$code||!n.$code[u.index-1]){return}var v=n.$code[u.index-1].querySelectorAll("li");for(var s=u.start-1;s<u.end;s++){if(v[s]){n.addClass(v[s],"mark")}}if(t&&v&&v[0]){setTimeout(function(){window.scrollTo(0,g(v[0]).top-50)})}};n.removeMark=function(){[].slice.call(r.querySelectorAll("pre code li.mark")).forEach(function(s){n.removeClass(s,"mark")})};n.init=function(){[].slice.call(n.$code).forEach(function(v,u){var s=v.innerHTML.trim().split(/[\r\n]+/);var t=s.map(function(x,w){return'<li><span class="line-num" data-line="'+(w+1)+'"></span>'+x+"</li>"}).join("");t="<ul>"+t+"</ul>";if(s.length>3&&v.className.match(/lang-(\w+)/)&&RegExp.$1!=="undefined"){t+='<b class="name">'+RegExp.$1+"</b>"}v.innerHTML=t;n.addClass(v,"firekylin-code");v.addEventListener("click",function(w){if(!w.target||!n.hasClass(w.target,"line-num")){return}if(w.shiftKey){var x=n.parseHash();x.newIndex=u+1;x.current=w.target.getAttribute("data-line");if(x.index!==x.newIndex-0){x.index=x.newIndex;x.start=x.current;x.end=0}else{if(x.current>x.start){x.end=x.current}else{x.end=x.start;x.start=x.current}}location.hash=n.stringHash(x)}else{location.hash=n.stringHash({index:u+1,start:w.target.getAttribute("data-line")})}})})};n.init();c.addEventListener("load",function(){n.mark(true)});c.addEventListener("hashchange",function(){n.removeMark();n.mark()})})(window,document);