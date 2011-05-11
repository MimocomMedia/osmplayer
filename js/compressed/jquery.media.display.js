/**
 *  Copyright (c) 2010 Alethia Inc,
 *  http://www.alethia-inc.com
 *  Developed by Travis Tidwell | travist at alethia-inc.com 
 *
 *  License:  GPL version 3.
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *  
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.

 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
(function(a){jQuery.media=jQuery.media?jQuery.media:{};jQuery.media.defaults=jQuery.extend(jQuery.media.defaults,{volume:80,autostart:false,streamer:"",embedWidth:450,embedHeight:337,wmode:"transparent",forceOverflow:false,quality:"default",repeat:false});jQuery.fn.mediadisplay=function(b){if(this.length===0){return null;}return new (function(d,c){this.settings=jQuery.media.utils.getSettings(c);this.display=d;var e=this;this.volume=0;this.player=null;this.preview="";this.updateInterval=null;this.progressInterval=null;this.playQueue=[];this.playIndex=0;this.playerReady=false;this.loaded=false;this.mediaFile=null;this.hasPlaylist=false;if(this.settings.forceOverflow){this.display.parents().css("overflow","visible");}this.reset=function(){this.loaded=false;this.stopMedia();clearInterval(this.progressInterval);clearInterval(this.updateInterval);this.playQueue.length=0;this.playQueue=[];this.playIndex=0;this.playerReady=false;this.mediaFile=null;this.display.empty().trigger("mediaupdate",{type:"reset"});};this.getPlayableMedia=function(j){var h=null;var f=j.length;while(f--){var g=new jQuery.media.file(j[f],this.settings);if(!h||(g.weight<h.weight)){h=g;}}return h;};this.getMediaFile=function(f){if(f){var g=typeof f;if(((g==="object")||(g==="array"))&&f[0]){f=this.getPlayableMedia(f);}}return f;};this.addToQueue=function(f){if(f){this.playQueue.push(this.getMediaFile(f));}};this.loadFiles=function(g){if(g){this.playQueue.length=0;this.playQueue=[];this.playIndex=0;this.addToQueue(g.intro);this.addToQueue(g.commercial);this.addToQueue(g.prereel);this.addToQueue(g.media);this.addToQueue(g.postreel);}var f=(this.playQueue.length>0);if(!f){this.display.trigger("mediaupdate",{type:"nomedia"});}return f;};this.playNext=function(){if(this.playQueue.length>this.playIndex){this.loadMedia(this.playQueue[this.playIndex]);this.playIndex++;}else{if(this.settings.repeat){this.playIndex=0;this.playNext();}else{if(this.hasPlaylist){this.reset();}else{this.loaded=false;this.settings.autostart=false;this.playIndex=0;this.playNext();}}}};this.loadMedia=function(f){if(f){f=new jQuery.media.file(this.getMediaFile(f),this.settings);this.stopMedia();if(!this.mediaFile||(this.mediaFile.player!=f.player)){this.player=null;this.playerReady=false;if(f.player){this.player=this.display["media"+f.player](this.settings,function(g){e.onMediaUpdate(g);});}if(this.player){this.player.createMedia(f,this.preview);}}else{if(this.player){this.player.loadMedia(f);}}this.mediaFile=f;this.onMediaUpdate({type:"initialize"});}};this.onMediaUpdate=function(g){switch(g.type){case"playerready":this.playerReady=true;this.player.setVolume(0);this.player.setQuality(this.settings.quality);this.startProgress();break;case"buffering":this.startProgress();break;case"stopped":clearInterval(this.progressInterval);clearInterval(this.updateInterval);break;case"paused":clearInterval(this.updateInterval);break;case"playing":this.startUpdate();break;case"progress":var f=this.getPercentLoaded();jQuery.extend(g,{percentLoaded:f});if(f>=1){clearInterval(this.progressInterval);}break;case"meta":jQuery.extend(g,{currentTime:this.player.getCurrentTime(),totalTime:this.getDuration(),volume:this.player.getVolume(),quality:this.getQuality()});break;case"durationupdate":this.mediaFile.duration=g.duration;break;case"complete":this.playNext();break;default:break;}if(g.type=="playing"&&!this.loaded){if(this.settings.autoLoad&&!this.settings.autostart){setTimeout(function(){e.player.setVolume((e.settings.volume/100));e.player.pauseMedia();e.settings.autostart=true;e.loaded=true;},100);}else{this.loaded=true;this.player.setVolume((this.settings.volume/100));this.display.trigger("mediaupdate",g);}}else{this.display.trigger("mediaupdate",g);}};this.startProgress=function(){if(this.playerReady){clearInterval(this.progressInterval);this.progressInterval=setInterval(function(){e.onMediaUpdate({type:"progress"});},500);}};this.startUpdate=function(){if(this.playerReady){clearInterval(this.updateInterval);this.updateInterval=setInterval(function(){if(e.playerReady){e.onMediaUpdate({type:"update",currentTime:e.player.getCurrentTime(),totalTime:e.getDuration(),volume:e.player.getVolume(),quality:e.getQuality()});}},1000);}};this.stopMedia=function(){this.loaded=false;clearInterval(this.progressInterval);clearInterval(this.updateInterval);if(this.playerReady){this.player.stopMedia();}};this.mute=function(f){if(f){this.volume=this.player.getVolume();this.player.setVolume(0);}else{this.player.setVolume(this.volume);}};this.onResize=function(){if(this.player&&this.player.onResize){this.player.onResize();}};this.getPercentLoaded=function(){if(this.player.getPercentLoaded){return this.player.getPercentLoaded();}else{var g=this.player.getBytesLoaded();var f=this.mediaFile.bytesTotal?this.mediaFile.bytesTotal:this.player.getBytesTotal();return f?(g/f):0;}};this.showControls=function(f){if(this.playerReady){this.player.showControls(f);}};this.hasControls=function(){if(this.player){return this.player.hasControls();}return false;};this.getDuration=function(){if(this.mediaFile){if(!this.mediaFile.duration){this.mediaFile.duration=this.player.getDuration();}return this.mediaFile.duration;}else{return 0;}};this.getQuality=function(){if(!this.mediaFile.quality){this.mediaFile.quality=this.player.getQuality();}return this.mediaFile.quality;};})(this,b);};})(jQuery);