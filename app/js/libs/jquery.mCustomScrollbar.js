/*
== malihu jquery custom scrollbar plugin == 
Version: 3.1.5 
Plugin URI: http://manos.malihu.gr/jquery-custom-content-scroller 
Author: malihu
Author URI: http://manos.malihu.gr
License: MIT License (MIT)
*/

/*
Copyright Manos Malihutsakis (email: manos@malihu.gr)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
The code below is fairly long, fully commented and should be normally used in development. 
For production, use either the minified jquery.mCustomScrollbar.min.js script or 
the production-ready jquery.mCustomScrollbar.concat.min.js which contains the plugin 
and dependencies (minified). 
*/

(function(factory){
	if(typeof define==="function" && define.amd){
		define(["jquery"],factory);
	}else if(typeof module!=="undefined" && module.exports){
		module.exports=factory;
	}else{
		factory(jQuery,window,document);
	}
}(function($){
(function(init){
	var _rjs=typeof define==="function" && define.amd, /* RequireJS */
		_njs=typeof module !== "undefined" && module.exports, /* NodeJS */
		_dlp=("https:"==document.location.protocol) ? "https:" : "http:", /* location protocol */
		_url="cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js";
	if(!_rjs){
		if(_njs){
			require("jquery-mousewheel")($);
		}else{
			/* load jquery-mousewheel plugin (via CDN) if it's not present or not loaded via RequireJS 
			(works when mCustomScrollbar fn is called on window load) */
			$.event.special.mousewheel || $("head").append(decodeURI("%3Cscript src="+_dlp+"//"+_url+"%3E%3C/script%3E"));
		}
	}
	init();
}(function(){
	
	/* 
	----------------------------------------
	PLUGIN NAMESPACE, PREFIX, DEFAULT SELECTOR(S) 
	----------------------------------------
	*/
	
	var pluginNS="mCustomScrollbar",
		pluginPfx="mCS",
		defaultSelector=".mCustomScrollbar",
	
	
		
	
	
	/* 
	----------------------------------------
	DEFAULT OPTIONS 
	----------------------------------------
	*/
	
		defaults={
			/*
			set element/content width/height programmatically 
			values: boolean, pixels, percentage 
				option						default
				-------------------------------------
				setWidth					false
				setHeight					false
			*/
			/*
			set the initial css top property of content  
			values: string (e.g. "-100px", "10%" etc.)
			*/
			setTop:0,
			/*
			set the initial css left property of content  
			values: string (e.g. "-100px", "10%" etc.)
			*/
			setLeft:0,
			/* 
			scrollbar axis (vertical and/or horizontal scrollbars) 
			values (string): "y", "x", "yx"
			*/
			axis:"y",
			/*
			position of scrollbar relative to content  
			values (string): "inside", "outside" ("outside" requires elements with position:relative)
			*/
			scrollbarPosition:"inside",
			/*
			scrolling inertia
			values: integer (milliseconds)
			*/
			scrollInertia:950,
			/* 
			auto-adjust scrollbar dragger length
			values: boolean
			*/
			autoDraggerLength:true,
			/*
			auto-hide scrollbar when idle 
			values: boolean
				option						default
				-------------------------------------
				autoHideScrollbar			false
			*/
			/*
			auto-expands scrollbar on mouse-over and dragging
			values: boolean
				option						default
				-------------------------------------
				autoExpandScrollbar			false
			*/
			/*
			always show scrollbar, even when there's nothing to scroll 
			values: integer (0=disable, 1=always show dragger rail and buttons, 2=always show dragger rail, dragger and buttons), boolean
			*/
			alwaysShowScrollbar:0,
			/*
			scrolling always snaps to a multiple of this number in pixels
			values: integer, array ([y,x])
				option						default
				-------------------------------------
				snapAmount					null
			*/
			/*
			when snapping, snap with this number in pixels as an offset 
			values: integer
			*/
			snapOffset:0,
			/* 
			mouse-wheel scrolling
			*/
			mouseWheel:{
				/* 
				enable mouse-wheel scrolling
				values: boolean
				*/
				enable:true,
				/* 
				scrolling amount in pixels
				values: "auto", integer 
				*/
				scrollAmount:"auto",
				/* 
				mouse-wheel scrolling axis 
				the default scrolling direction when both vertical and horizontal scrollbars are present 
				values (string): "y", "x" 
				*/
				axis:"y",
				/* 
				prevent the default behaviour which automatically scrolls the parent element(s) when end of scrolling is reached 
				values: boolean
					option						default
					-------------------------------------
					preventDefault				null
				*/
				/*
				the reported mouse-wheel delta value. The number of lines (translated to pixels) one wheel notch scrolls.  
				values: "auto", integer 
				"auto" uses the default OS/browser value 
				*/
				deltaFactor:"auto",
				/*
				normalize mouse-wheel delta to -1 or 1 (disables mouse-wheel acceleration) 
				values: boolean
					option						default
					-------------------------------------
					normalizeDelta				null
				*/
				/*
				invert mouse-wheel scrolling direction 
				values: boolean
					option						default
					-------------------------------------
					invert						null
				*/
				/*
				the tags that disable mouse-wheel when cursor is over them
				*/
				disableOver:["select","option","keygen","datalist","textarea"]
			},
			/* 
			scrollbar buttons
			*/
			scrollButtons:{ 
				/*
				enable scrollbar buttons
				values: boolean
					option						default
					-------------------------------------
					enable						null
				*/
				/*
				scrollbar buttons scrolling type 
				values (string): "stepless", "stepped"
				*/
				scrollType:"stepless",
				/*
				scrolling amount in pixels
				values: "auto", integer 
				*/
				scrollAmount:"auto"
				/*
				tabindex of the scrollbar buttons
				values: false, integer
					option						default
					-------------------------------------
					tabindex					null
				*/
			},
			/* 
			keyboard scrolling
			*/
			keyboard:{ 
				/*
				enable scrolling via keyboard
				values: boolean
				*/
				enable:true,
				/*
				keyboard scrolling type 
				values (string): "stepless", "stepped"
				*/
				scrollType:"stepless",
				/*
				scrolling amount in pixels
				values: "auto", integer 
				*/
				scrollAmount:"auto"
			},
			/*
			enable content touch-swipe scrolling 
			values: boolean, integer, string (number)
			integer values define the axis-specific minimum amount required for scrolling momentum
			*/
			contentTouchScroll:25,
			/*
			enable/disable document (default) touch-swipe scrolling 
			*/
			documentTouchScroll:true,
			/*
			advanced option parameters
			*/
			advanced:{
				/*
				auto-expand content horizontally (for "x" or "yx" axis) 
				values: boolean, integer (the value 2 forces the non scrollHeight/scrollWidth method, the value 3 forces the scrollHeight/scrollWidth method)
					option						default
					-------------------------------------
					autoExpandHorizontalScroll	null
				*/
				/*
				auto-scroll to elements with focus
				*/
				autoScrollOnFocus:"input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']",
				/*
				auto-update scrollbars on content, element or viewport resize 
				should be true for fluid layouts/elements, adding/removing content dynamically, hiding/showing elements, content with images etc. 
				values: boolean
				*/
				updateOnContentResize:true,
				/*
				auto-update scrollbars each time each image inside the element is fully loaded 
				values: "auto", boolean
				*/
				updateOnImageLoad:"auto",
				/*
				auto-update scrollbars based on the amount and size changes of specific selectors 
				useful when you need to update the scrollbar(s) automatically, each time a type of element is added, removed or changes its size 
				values: boolean, string (e.g. "ul li" will auto-update scrollbars each time list-items inside the element are changed) 
				a value of true (boolean) will auto-update scrollbars each time any element is changed
					option						default
					-------------------------------------
					updateOnSelectorChange		null
				*/
				/*
				extra selectors that'll allow scrollbar dragging upon mousemove/up, pointermove/up, touchend etc. (e.g. "selector-1, selector-2")
					option						default
					-------------------------------------
					extraDraggableSelectors		null
				*/
				/*
				extra selectors that'll release scrollbar dragging upon mouseup, pointerup, touchend etc. (e.g. "selector-1, selector-2")
					option						default
					-------------------------------------
					releaseDraggableSelectors	null
				*/
				/*
				auto-update timeout 
				values: integer (milliseconds)
				*/
				autoUpdateTimeout:60
			},
			/* 
			scrollbar theme 
			values: string (see CSS/plugin URI for a list of ready-to-use themes)
			*/
			theme:"light",
			/*
			user defined callback functions
			*/
			callbacks:{
				/*
				Available callbacks: 
					callback					default
					-------------------------------------
					onCreate					null
					onInit						null
					onScrollStart				null
					onScroll					null
					onTotalScroll				null
					onTotalScrollBack			null
					whileScrolling				null
					onOverflowY					null
					onOverflowX					null
					onOverflowYNone				null
					onOverflowXNone				null
					onImageLoad					null
					onSelectorChange			null
					onBeforeUpdate				null
					onUpdate					null
				*/
				onTotalScrollOffset:0,
				onTotalScrollBackOffset:0,
				alwaysTriggerOffsets:true
			}
			/*
			add scrollbar(s) on all elements matching the current selector, now and in the future 
			values: boolean, string 
			string values: "on" (enable), "once" (disable after first invocation), "off" (disable)
			liveSelector values: string (selector)
				option						default
				-------------------------------------
				live						false
				liveSelector				null
			*/
		},
	
	
	
	
	
	/* 
	----------------------------------------
	VARS, CONSTANTS 
	----------------------------------------
	*/
	
		totalInstances=0, /* plugin instances amount */
		liveTimers={}, /* live option timers */
		oldIE=(window.attachEvent && !window.addEventListener) ? 1 : 0, /* detect IE < 9 */
		touchActive=false,touchable, /* global touch vars (for touch and pointer events) */
		/* general plugin classes */
		classes=[
			"mCSB_dragger_onDrag","mCSB_scrollTools_onDrag","mCS_img_loaded","mCS_disabled","mCS_destroyed","mCS_no_scrollbar",
			"mCS-autoHide","mCS-dir-rtl","mCS_no_scrollbar_y","mCS_no_scrollbar_x","mCS_y_hidden","mCS_x_hidden","mCSB_draggerContainer",
			"mCSB_buttonUp","mCSB_buttonDown","mCSB_buttonLeft","mCSB_buttonRight"
		],
		
	
	
	
	
	/* 
	----------------------------------------
	METHODS 
	----------------------------------------
	*/
	
		methods={
			
			/* 
			plugin initialization method 
			creates the scrollbar(s), plugin data object and options
			----------------------------------------
			*/
			
			init:function(options){
				
				var options=$.extend(true,{},defaults,options),
					selector=_selector.call(this); /* validate selector */
				
				/* 
				if live option is enabled, monitor for elements matching the current selector and 
				apply scrollbar(s) when found (now and in the future) 
				*/
				if(options.live){
					var liveSelector=options.liveSelector || this.selector || defaultSelector, /* live selector(s) */
						$liveSelector=$(liveSelector); /* live selector(s) as jquery object */
					if(options.live==="off"){
						/* 
						disable live if requested 
						usage: $(selector).mCustomScrollbar({live:"off"}); 
						*/
						removeLiveTimers(liveSelector);
						return;
					}
					liveTimers[liveSelector]=setTimeout(function(){
						/* call mCustomScrollbar fn on live selector(s) every half-second */
						$liveSelector.mCustomScrollbar(options);
						if(options.live==="once" && $liveSelector.length){
							/* disable live after first invocation */
							removeLiveTimers(liveSelector);
						}
					},500);
				}else{
					removeLiveTimers(liveSelector);
				}
				
				/* options backward compatibility (for versions < 3.0.0) and normalization */
				options.setWidth=(options.set_width) ? options.set_width : options.setWidth;
				options.setHeight=(options.set_height) ? options.set_height : options.setHeight;
				options.axis=(options.horizontalScroll) ? "x" : _findAxis(options.axis);
				options.scrollInertia=options.scrollInertia>0 && options.scrollInertia<17 ? 17 : options.scrollInertia;
				if(typeof options.mouseWheel!=="object" &&  options.mouseWheel==true){ /* old school mouseWheel option (non-object) */
					options.mouseWheel={enable:true,scrollAmount:"auto",axis:"y",preventDefault:false,deltaFactor:"auto",normalizeDelta:false,invert:false}
				}
				options.mouseWheel.scrollAmount=!options.mouseWheelPixels ? options.mouseWheel.scrollAmount : options.mouseWheelPixels;
				options.mouseWheel.normalizeDelta=!options.advanced.normalizeMouseWheelDelta ? options.mouseWheel.normalizeDelta : options.advanced.normalizeMouseWheelDelta;
				options.scrollButtons.scrollType=_findScrollButtonsType(options.scrollButtons.scrollType); 
				
				_theme(options); /* theme-specific options */
				
				/* plugin constructor */
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if(!$this.data(pluginPfx)){ /* prevent multiple instantiations */
					
						/* store options and create objects in jquery data */
						$this.data(pluginPfx,{
							idx:++totalInstances, /* instance index */
							opt:options, /* options */
							scrollRatio:{y:null,x:null}, /* scrollbar to content ratio */
							overflowed:null, /* overflowed axis */
							contentReset:{y:null,x:null}, /* object to check when content resets */
							bindEvents:false, /* object to check if events are bound */
							tweenRunning:false, /* object to check if tween is running */
							sequential:{}, /* sequential scrolling object */
							langDir:$this.css("direction"), /* detect/store direction (ltr or rtl) */
							cbOffsets:null, /* object to check whether callback offsets always trigger */
							/* 
							object to check how scrolling events where last triggered 
							"internal" (default - triggered by this script), "external" (triggered by other scripts, e.g. via scrollTo method) 
							usage: object.data("mCS").trigger
							*/
							trigger:null,
							/* 
							object to check for changes in elements in order to call the update method automatically 
							*/
							poll:{size:{o:0,n:0},img:{o:0,n:0},change:{o:0,n:0}}
						});
						
						var d=$this.data(pluginPfx),o=d.opt,
							/* HTML data attributes */
							htmlDataAxis=$this.data("mcs-axis"),htmlDataSbPos=$this.data("mcs-scrollbar-position"),htmlDataTheme=$this.data("mcs-theme");
						 
						if(htmlDataAxis){o.axis=htmlDataAxis;} /* usage example: data-mcs-axis="y" */
						if(htmlDataSbPos){o.scrollbarPosition=htmlDataSbPos;} /* usage example: data-mcs-scrollbar-position="outside" */
						if(htmlDataTheme){ /* usage example: data-mcs-theme="minimal" */
							o.theme=htmlDataTheme;
							_theme(o); /* theme-specific options */
						}
						
						_pluginMarkup.call(this); /* add plugin markup */
						
						if(d && o.callbacks.onCreate && typeof o.callbacks.onCreate==="function"){o.callbacks.onCreate.call(this);} /* callbacks: onCreate */
						
						$("#mCSB_"+d.idx+"_container img:not(."+classes[2]+")").addClass(classes[2]); /* flag loaded images */
						
						methods.update.call(null,$this); /* call the update method */
					
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/* 
			plugin update method 
			updates content and scrollbar(s) values, events and status 
			----------------------------------------
			usage: $(selector).mCustomScrollbar("update");
			*/
			
			update:function(el,cb){
				
				var selector=el || _selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
						
						var d=$this.data(pluginPfx),o=d.opt,
							mCSB_container=$("#mCSB_"+d.idx+"_container"),
							mCustomScrollBox=$("#mCSB_"+d.idx),
							mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];
						
						if(!mCSB_container.length){return;}
						
						if(d.tweenRunning){_stop($this);} /* stop any running tweens while updating */
						
						if(cb && d && o.callbacks.onBeforeUpdate && typeof o.callbacks.onBeforeUpdate==="function"){o.callbacks.onBeforeUpdate.call(this);} /* callbacks: onBeforeUpdate */
						
						/* if element was disabled or destroyed, remove class(es) */
						if($this.hasClass(classes[3])){$this.removeClass(classes[3]);}
						if($this.hasClass(classes[4])){$this.removeClass(classes[4]);}
						
						/* css flexbox fix, detect/set max-height */
						mCustomScrollBox.css("max-height","none");
						if(mCustomScrollBox.height()!==$this.height()){mCustomScrollBox.css("max-height",$this.height());}
						
						_expandContentHorizontally.call(this); /* expand content horizontally */
						
						if(o.axis!=="y" && !o.advanced.autoExpandHorizontalScroll){
							mCSB_container.css("width",_contentWidth(mCSB_container));
						}
						
						d.overflowed=_overflowed.call(this); /* determine if scrolling is required */
						
						_scrollbarVisibility.call(this); /* show/hide scrollbar(s) */
						
						/* auto-adjust scrollbar dragger length analogous to content */
						if(o.autoDraggerLength){_setDraggerLength.call(this);}
						
						_scrollRatio.call(this); /* calculate and store scrollbar to content ratio */
						
						_bindEvents.call(this); /* bind scrollbar events */
						
						/* reset scrolling position and/or events */
						var to=[Math.abs(mCSB_container[0].offsetTop),Math.abs(mCSB_container[0].offsetLeft)];
						if(o.axis!=="x"){ /* y/yx axis */
							if(!d.overflowed[0]){ /* y scrolling is not required */
								_resetContentPosition.call(this); /* reset content position */
								if(o.axis==="y"){
									_unbindEvents.call(this);
								}else if(o.axis==="yx" && d.overflowed[1]){
									_scrollTo($this,to[1].toString(),{dir:"x",dur:0,overwrite:"none"});
								}
							}else if(mCSB_dragger[0].height()>mCSB_dragger[0].parent().height()){
								_resetContentPosition.call(this); /* reset content position */
							}else{ /* y scrolling is required */
								_scrollTo($this,to[0].toString(),{dir:"y",dur:0,overwrite:"none"});
								d.contentReset.y=null;
							}
						}
						if(o.axis!=="y"){ /* x/yx axis */
							if(!d.overflowed[1]){ /* x scrolling is not required */
								_resetContentPosition.call(this); /* reset content position */
								if(o.axis==="x"){
									_unbindEvents.call(this);
								}else if(o.axis==="yx" && d.overflowed[0]){
									_scrollTo($this,to[0].toString(),{dir:"y",dur:0,overwrite:"none"});
								}
							}else if(mCSB_dragger[1].width()>mCSB_dragger[1].parent().width()){
								_resetContentPosition.call(this); /* reset content position */
							}else{ /* x scrolling is required */
								_scrollTo($this,to[1].toString(),{dir:"x",dur:0,overwrite:"none"});
								d.contentReset.x=null;
							}
						}
						
						/* callbacks: onImageLoad, onSelectorChange, onUpdate */
						if(cb && d){
							if(cb===2 && o.callbacks.onImageLoad && typeof o.callbacks.onImageLoad==="function"){
								o.callbacks.onImageLoad.call(this);
							}else if(cb===3 && o.callbacks.onSelectorChange && typeof o.callbacks.onSelectorChange==="function"){
								o.callbacks.onSelectorChange.call(this);
							}else if(o.callbacks.onUpdate && typeof o.callbacks.onUpdate==="function"){
								o.callbacks.onUpdate.call(this);
							}
						}
						
						_autoUpdate.call(this); /* initialize automatic updating (for dynamic content, fluid layouts etc.) */
						
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/* 
			plugin scrollTo method 
			triggers a scrolling event to a specific value
			----------------------------------------
			usage: $(selector).mCustomScrollbar("scrollTo",value,options);
			*/
		
			scrollTo:function(val,options){
				
				/* prevent silly things like $(selector).mCustomScrollbar("scrollTo",undefined); */
				if(typeof val=="undefined" || val==null){return;}
				
				var selector=_selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
					
						var d=$this.data(pluginPfx),o=d.opt,
							/* method default options */
							methodDefaults={
								trigger:"external", /* method is by default triggered externally (e.g. from other scripts) */
								scrollInertia:o.scrollInertia, /* scrolling inertia (animation duration) */
								scrollEasing:"mcsEaseInOut", /* animation easing */
								moveDragger:false, /* move dragger instead of content */
								timeout:60, /* scroll-to delay */
								callbacks:true, /* enable/disable callbacks */
								onStart:true,
								onUpdate:true,
								onComplete:true
							},
							methodOptions=$.extend(true,{},methodDefaults,options),
							to=_arr.call(this,val),dur=methodOptions.scrollInertia>0 && methodOptions.scrollInertia<17 ? 17 : methodOptions.scrollInertia;
						
						/* translate yx values to actual scroll-to positions */
						to[0]=_to.call(this,to[0],"y");
						to[1]=_to.call(this,to[1],"x");
						
						/* 
						check if scroll-to value moves the dragger instead of content. 
						Only pixel values apply on dragger (e.g. 100, "100px", "-=100" etc.) 
						*/
						if(methodOptions.moveDragger){
							to[0]*=d.scrollRatio.y;
							to[1]*=d.scrollRatio.x;
						}
						
						methodOptions.dur=_isTabHidden() ? 0 : dur; //skip animations if browser tab is hidden
						
						setTimeout(function(){ 
							/* do the scrolling */
							if(to[0]!==null && typeof to[0]!=="undefined" && o.axis!=="x" && d.overflowed[0]){ /* scroll y */
								methodOptions.dir="y";
								methodOptions.overwrite="all";
								_scrollTo($this,to[0].toString(),methodOptions);
							}
							if(to[1]!==null && typeof to[1]!=="undefined" && o.axis!=="y" && d.overflowed[1]){ /* scroll x */
								methodOptions.dir="x";
								methodOptions.overwrite="none";
								_scrollTo($this,to[1].toString(),methodOptions);
							}
						},methodOptions.timeout);
						
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/*
			plugin stop method 
			stops scrolling animation
			----------------------------------------
			usage: $(selector).mCustomScrollbar("stop");
			*/
			stop:function(){
				
				var selector=_selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
										
						_stop($this);
					
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/*
			plugin disable method 
			temporarily disables the scrollbar(s) 
			----------------------------------------
			usage: $(selector).mCustomScrollbar("disable",reset); 
			reset (boolean): resets content position to 0 
			*/
			disable:function(r){
				
				var selector=_selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
						
						var d=$this.data(pluginPfx);
						
						_autoUpdate.call(this,"remove"); /* remove automatic updating */
						
						_unbindEvents.call(this); /* unbind events */
						
						if(r){_resetContentPosition.call(this);} /* reset content position */
						
						_scrollbarVisibility.call(this,true); /* show/hide scrollbar(s) */
						
						$this.addClass(classes[3]); /* add disable class */
					
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/*
			plugin destroy method 
			completely removes the scrollbar(s) and returns the element to its original state
			----------------------------------------
			usage: $(selector).mCustomScrollbar("destroy"); 
			*/
			destroy:function(){
				
				var selector=_selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
					
						var d=$this.data(pluginPfx),o=d.opt,
							mCustomScrollBox=$("#mCSB_"+d.idx),
							mCSB_container=$("#mCSB_"+d.idx+"_container"),
							scrollbar=$(".mCSB_"+d.idx+"_scrollbar");
					
						if(o.live){removeLiveTimers(o.liveSelector || $(selector).selector);} /* remove live timers */
						
						_autoUpdate.call(this,"remove"); /* remove automatic updating */
						
						_unbindEvents.call(this); /* unbind events */
						
						_resetContentPosition.call(this); /* reset content position */
						
						$this.removeData(pluginPfx); /* remove plugin data object */
						
						_delete(this,"mcs"); /* delete callbacks object */
						
						/* remove plugin markup */
						scrollbar.remove(); /* remove scrollbar(s) first (those can be either inside or outside plugin's inner wrapper) */
						mCSB_container.find("img."+classes[2]).removeClass(classes[2]); /* remove loaded images flag */
						mCustomScrollBox.replaceWith(mCSB_container.contents()); /* replace plugin's inner wrapper with the original content */
						/* remove plugin classes from the element and add destroy class */
						$this.removeClass(pluginNS+" _"+pluginPfx+"_"+d.idx+" "+classes[6]+" "+classes[7]+" "+classes[5]+" "+classes[3]).addClass(classes[4]);
					
					}
					
				});
				
			}
			/* ---------------------------------------- */
			
		},
	
	
	
	
		
	/* 
	----------------------------------------
	FUNCTIONS
	----------------------------------------
	*/
	
		/* validates selector (if selector is invalid or undefined uses the default one) */
		_selector=function(){
			return (typeof $(this)!=="object" || $(this).length<1) ? defaultSelector : this;
		},
		/* -------------------- */
		
		
		/* changes options according to theme */
		_theme=function(obj){
			var fixedSizeScrollbarThemes=["rounded","rounded-dark","rounded-dots","rounded-dots-dark"],
				nonExpandedScrollbarThemes=["rounded-dots","rounded-dots-dark","3d","3d-dark","3d-thick","3d-thick-dark","inset","inset-dark","inset-2","inset-2-dark","inset-3","inset-3-dark"],
				disabledScrollButtonsThemes=["minimal","minimal-dark"],
				enabledAutoHideScrollbarThemes=["minimal","minimal-dark"],
				scrollbarPositionOutsideThemes=["minimal","minimal-dark"];
			obj.autoDraggerLength=$.inArray(obj.theme,fixedSizeScrollbarThemes) > -1 ? false : obj.autoDraggerLength;
			obj.autoExpandScrollbar=$.inArray(obj.theme,nonExpandedScrollbarThemes) > -1 ? false : obj.autoExpandScrollbar;
			obj.scrollButtons.enable=$.inArray(obj.theme,disabledScrollButtonsThemes) > -1 ? false : obj.scrollButtons.enable;
			obj.autoHideScrollbar=$.inArray(obj.theme,enabledAutoHideScrollbarThemes) > -1 ? true : obj.autoHideScrollbar;
			obj.scrollbarPosition=$.inArray(obj.theme,scrollbarPositionOutsideThemes) > -1 ? "outside" : obj.scrollbarPosition;
		},
		/* -------------------- */
		
		
		/* live option timers removal */
		removeLiveTimers=function(selector){
			if(liveTimers[selector]){
				clearTimeout(liveTimers[selector]);
				_delete(liveTimers,selector);
			}
		},
		/* -------------------- */
		
		
		/* normalizes axis option to valid values: "y", "x", "yx" */
		_findAxis=function(val){
			return (val==="yx" || val==="xy" || val==="auto") ? "yx" : (val==="x" || val==="horizontal") ? "x" : "y";
		},
		/* -------------------- */
		
		
		/* normalizes scrollButtons.scrollType option to valid values: "stepless", "stepped" */
		_findScrollButtonsType=function(val){
			return (val==="stepped" || val==="pixels" || val==="step" || val==="click") ? "stepped" : "stepless";
		},
		/* -------------------- */
		
		
		/* generates plugin markup */
		_pluginMarkup=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				expandClass=o.autoExpandScrollbar ? " "+classes[1]+"_expand" : "",
				scrollbar=["<div id='mCSB_"+d.idx+"_scrollbar_vertical' class='mCSB_scrollTools mCSB_"+d.idx+"_scrollbar mCS-"+o.theme+" mCSB_scrollTools_vertical"+expandClass+"'><div class='"+classes[12]+"'><div id='mCSB_"+d.idx+"_dragger_vertical' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>","<div id='mCSB_"+d.idx+"_scrollbar_horizontal' class='mCSB_scrollTools mCSB_"+d.idx+"_scrollbar mCS-"+o.theme+" mCSB_scrollTools_horizontal"+expandClass+"'><div class='"+classes[12]+"'><div id='mCSB_"+d.idx+"_dragger_horizontal' class='mCSB_dragger' style='position:absolute;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>"],
				wrapperClass=o.axis==="yx" ? "mCSB_vertical_horizontal" : o.axis==="x" ? "mCSB_horizontal" : "mCSB_vertical",
				scrollbars=o.axis==="yx" ? scrollbar[0]+scrollbar[1] : o.axis==="x" ? scrollbar[1] : scrollbar[0],
				contentWrapper=o.axis==="yx" ? "<div id='mCSB_"+d.idx+"_container_wrapper' class='mCSB_container_wrapper' />" : "",
				autoHideClass=o.autoHideScrollbar ? " "+classes[6] : "",
				scrollbarDirClass=(o.axis!=="x" && d.langDir==="rtl") ? " "+classes[7] : "";
			if(o.setWidth){$this.css("width",o.setWidth);} /* set element width */
			if(o.setHeight){$this.css("height",o.setHeight);} /* set element height */
			o.setLeft=(o.axis!=="y" && d.langDir==="rtl") ? "989999px" : o.setLeft; /* adjust left position for rtl direction */
			$this.addClass(pluginNS+" _"+pluginPfx+"_"+d.idx+autoHideClass+scrollbarDirClass).wrapInner("<div id='mCSB_"+d.idx+"' class='mCustomScrollBox mCS-"+o.theme+" "+wrapperClass+"'><div id='mCSB_"+d.idx+"_container' class='mCSB_container' style='position:relative; top:"+o.setTop+"; left:"+o.setLeft+";' dir='"+d.langDir+"' /></div>");
			var mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container");
			if(o.axis!=="y" && !o.advanced.autoExpandHorizontalScroll){
				mCSB_container.css("width",_contentWidth(mCSB_container));
			}
			if(o.scrollbarPosition==="outside"){
				if($this.css("position")==="static"){ /* requires elements with non-static position */
					$this.css("position","relative");
				}
				$this.css("overflow","visible");
				mCustomScrollBox.addClass("mCSB_outside").after(scrollbars);
			}else{
				mCustomScrollBox.addClass("mCSB_inside").append(scrollbars);
				mCSB_container.wrap(contentWrapper);
			}
			_scrollButtons.call(this); /* add scrollbar buttons */
			/* minimum dragger length */
			var mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];
			mCSB_dragger[0].css("min-height",mCSB_dragger[0].height());
			mCSB_dragger[1].css("min-width",mCSB_dragger[1].width());
		},
		/* -------------------- */
		
		
		/* calculates content width */
		_contentWidth=function(el){
			var val=[el[0].scrollWidth,Math.max.apply(Math,el.children().map(function(){return $(this).outerWidth(true);}).get())],w=el.parent().width();
			return val[0]>w ? val[0] : val[1]>w ? val[1] : "100%";
		},
		/* -------------------- */
		
		
		/* expands content horizontally */
		_expandContentHorizontally=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCSB_container=$("#mCSB_"+d.idx+"_container");
			if(o.advanced.autoExpandHorizontalScroll && o.axis!=="y"){
				/* calculate scrollWidth */
				mCSB_container.css({"width":"auto","min-width":0,"overflow-x":"scroll"});
				var w=Math.ceil(mCSB_container[0].scrollWidth);
				if(o.advanced.autoExpandHorizontalScroll===3 || (o.advanced.autoExpandHorizontalScroll!==2 && w>mCSB_container.parent().width())){
					mCSB_container.css({"width":w,"min-width":"100%","overflow-x":"inherit"});
				}else{
					/* 
					wrap content with an infinite width div and set its position to absolute and width to auto. 
					Setting width to auto before calculating the actual width is important! 
					We must let the browser set the width as browser zoom values are impossible to calculate.
					*/
					mCSB_container.css({"overflow-x":"inherit","position":"absolute"})
						.wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />")
						.css({ /* set actual width, original position and un-wrap */
							/* 
							get the exact width (with decimals) and then round-up. 
							Using jquery outerWidth() will round the width value which will mess up with inner elements that have non-integer width
							*/
							"width":(Math.ceil(mCSB_container[0].getBoundingClientRect().right+0.4)-Math.floor(mCSB_container[0].getBoundingClientRect().left)),
							"min-width":"100%",
							"position":"relative"
						}).unwrap();
				}
			}
		},
		/* -------------------- */
		
		
		/* adds scrollbar buttons */
		_scrollButtons=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCSB_scrollTools=$(".mCSB_"+d.idx+"_scrollbar:first"),
				tabindex=!_isNumeric(o.scrollButtons.tabindex) ? "" : "tabindex='"+o.scrollButtons.tabindex+"'",
				btnHTML=[
					"<a href='#' class='"+classes[13]+"' "+tabindex+" />",
					"<a href='#' class='"+classes[14]+"' "+tabindex+" />",
					"<a href='#' class='"+classes[15]+"' "+tabindex+" />",
					"<a href='#' class='"+classes[16]+"' "+tabindex+" />"
				],
				btn=[(o.axis==="x" ? btnHTML[2] : btnHTML[0]),(o.axis==="x" ? btnHTML[3] : btnHTML[1]),btnHTML[2],btnHTML[3]];
			if(o.scrollButtons.enable){
				mCSB_scrollTools.prepend(btn[0]).append(btn[1]).next(".mCSB_scrollTools").prepend(btn[2]).append(btn[3]);
			}
		},
		/* -------------------- */
		
		
		/* auto-adjusts scrollbar dragger length */
		_setDraggerLength=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
				ratio=[mCustomScrollBox.height()/mCSB_container.outerHeight(false),mCustomScrollBox.width()/mCSB_container.outerWidth(false)],
				l=[
					parseInt(mCSB_dragger[0].css("min-height")),Math.round(ratio[0]*mCSB_dragger[0].parent().height()),
					parseInt(mCSB_dragger[1].css("min-width")),Math.round(ratio[1]*mCSB_dragger[1].parent().width())
				],
				h=oldIE && (l[1]<l[0]) ? l[0] : l[1],w=oldIE && (l[3]<l[2]) ? l[2] : l[3];
			mCSB_dragger[0].css({
				"height":h,"max-height":(mCSB_dragger[0].parent().height()-10)
			}).find(".mCSB_dragger_bar").css({"line-height":l[0]+"px"});
			mCSB_dragger[1].css({
				"width":w,"max-width":(mCSB_dragger[1].parent().width()-10)
			});
		},
		/* -------------------- */
		
		
		/* calculates scrollbar to content ratio */
		_scrollRatio=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
				scrollAmount=[mCSB_container.outerHeight(false)-mCustomScrollBox.height(),mCSB_container.outerWidth(false)-mCustomScrollBox.width()],
				ratio=[
					scrollAmount[0]/(mCSB_dragger[0].parent().height()-mCSB_dragger[0].height()),
					scrollAmount[1]/(mCSB_dragger[1].parent().width()-mCSB_dragger[1].width())
				];
			d.scrollRatio={y:ratio[0],x:ratio[1]};
		},
		/* -------------------- */
		
		
		/* toggles scrolling classes */
		_onDragClasses=function(el,action,xpnd){
			var expandClass=xpnd ? classes[0]+"_expanded" : "",
				scrollbar=el.closest(".mCSB_scrollTools");
			if(action==="active"){
				el.toggleClass(classes[0]+" "+expandClass); scrollbar.toggleClass(classes[1]); 
				el[0]._draggable=el[0]._draggable ? 0 : 1;
			}else{
				if(!el[0]._draggable){
					if(action==="hide"){
						el.removeClass(classes[0]); scrollbar.removeClass(classes[1]);
					}else{
						el.addClass(classes[0]); scrollbar.addClass(classes[1]);
					}
				}
			}
		},
		/* -------------------- */
		
		
		/* checks if content overflows its container to determine if scrolling is required */
		_overflowed=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				contentHeight=d.overflowed==null ? mCSB_container.height() : mCSB_container.outerHeight(false),
				contentWidth=d.overflowed==null ? mCSB_container.width() : mCSB_container.outerWidth(false),
				h=mCSB_container[0].scrollHeight,w=mCSB_container[0].scrollWidth;
			if(h>contentHeight){contentHeight=h;}
			if(w>contentWidth){contentWidth=w;}
			return [contentHeight>mCustomScrollBox.height(),contentWidth>mCustomScrollBox.width()];
		},
		/* -------------------- */
		
		
		/* resets content position to 0 */
		_resetContentPosition=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];
			_stop($this); /* stop any current scrolling before resetting */
			if((o.axis!=="x" && !d.overflowed[0]) || (o.axis==="y" && d.overflowed[0])){ /* reset y */
				mCSB_dragger[0].add(mCSB_container).css("top",0);
				_scrollTo($this,"_resetY");
			}
			if((o.axis!=="y" && !d.overflowed[1]) || (o.axis==="x" && d.overflowed[1])){ /* reset x */
				var cx=dx=0;
				if(d.langDir==="rtl"){ /* adjust left position for rtl direction */
					cx=mCustomScrollBox.width()-mCSB_container.outerWidth(false);
					dx=Math.abs(cx/d.scrollRatio.x);
				}
				mCSB_container.css("left",cx);
				mCSB_dragger[1].css("left",dx);
				_scrollTo($this,"_resetX");
			}
		},
		/* -------------------- */
		
		
		/* binds scrollbar events */
		_bindEvents=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt;
			if(!d.bindEvents){ /* check if events are already bound */
				_draggable.call(this);
				if(o.contentTouchScroll){_contentDraggable.call(this);}
				_selectable.call(this);
				if(o.mouseWheel.enable){ /* bind mousewheel fn when plugin is available */
					function _mwt(){
						mousewheelTimeout=setTimeout(function(){
							if(!$.event.special.mousewheel){
								_mwt();
							}else{
								clearTimeout(mousewheelTimeout);
								_mousewheel.call($this[0]);
							}
						},100);
					}
					var mousewheelTimeout;
					_mwt();
				}
				_draggerRail.call(this);
				_wrapperScroll.call(this);
				if(o.advanced.autoScrollOnFocus){_focus.call(this);}
				if(o.scrollButtons.enable){_buttons.call(this);}
				if(o.keyboard.enable){_keyboard.call(this);}
				d.bindEvents=true;
			}
		},
		/* -------------------- */
		
		
		/* unbinds scrollbar events */
		_unbindEvents=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				sb=".mCSB_"+d.idx+"_scrollbar",
				sel=$("#mCSB_"+d.idx+",#mCSB_"+d.idx+"_container,#mCSB_"+d.idx+"_container_wrapper,"+sb+" ."+classes[12]+",#mCSB_"+d.idx+"_dragger_vertical,#mCSB_"+d.idx+"_dragger_horizontal,"+sb+">a"),
				mCSB_container=$("#mCSB_"+d.idx+"_container");
			if(o.advanced.releaseDraggableSelectors){sel.add($(o.advanced.releaseDraggableSelectors));}
			if(o.advanced.extraDraggableSelectors){sel.add($(o.advanced.extraDraggableSelectors));}
			if(d.bindEvents){ /* check if events are bound */
				/* unbind namespaced events from document/selectors */
				$(document).add($(!_canAccessIFrame() || top.document)).unbind("."+namespace);
				sel.each(function(){
					$(this).unbind("."+namespace);
				});
				/* clear and delete timeouts/objects */
				clearTimeout($this[0]._focusTimeout); _delete($this[0],"_focusTimeout");
				clearTimeout(d.sequential.step); _delete(d.sequential,"step");
				clearTimeout(mCSB_container[0].onCompleteTimeout); _delete(mCSB_container[0],"onCompleteTimeout");
				d.bindEvents=false;
			}
		},
		/* -------------------- */
		
		
		/* toggles scrollbar visibility */
		_scrollbarVisibility=function(disabled){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				contentWrapper=$("#mCSB_"+d.idx+"_container_wrapper"),
				content=contentWrapper.length ? contentWrapper : $("#mCSB_"+d.idx+"_container"),
				scrollbar=[$("#mCSB_"+d.idx+"_scrollbar_vertical"),$("#mCSB_"+d.idx+"_scrollbar_horizontal")],
				mCSB_dragger=[scrollbar[0].find(".mCSB_dragger"),scrollbar[1].find(".mCSB_dragger")];
			if(o.axis!=="x"){
				if(d.overflowed[0] && !disabled){
					scrollbar[0].add(mCSB_dragger[0]).add(scrollbar[0].children("a")).css("display","block");
					content.removeClass(classes[8]+" "+classes[10]);
				}else{
					if(o.alwaysShowScrollbar){
						if(o.alwaysShowScrollbar!==2){mCSB_dragger[0].css("display","none");}
						content.removeClass(classes[10]);
					}else{
						scrollbar[0].css("display","none");
						content.addClass(classes[10]);
					}
					content.addClass(classes[8]);
				}
			}
			if(o.axis!=="y"){
				if(d.overflowed[1] && !disabled){
					scrollbar[1].add(mCSB_dragger[1]).add(scrollbar[1].children("a")).css("display","block");
					content.removeClass(classes[9]+" "+classes[11]);
				}else{
					if(o.alwaysShowScrollbar){
						if(o.alwaysShowScrollbar!==2){mCSB_dragger[1].css("display","none");}
						content.removeClass(classes[11]);
					}else{
						scrollbar[1].css("display","none");
						content.addClass(classes[11]);
					}
					content.addClass(classes[9]);
				}
			}
			if(!d.overflowed[0] && !d.overflowed[1]){
				$this.addClass(classes[5]);
			}else{
				$this.removeClass(classes[5]);
			}
		},
		/* -------------------- */
		
		
		/* returns input coordinates of pointer, touch and mouse events (relative to document) */
		_coordinates=function(e){
			var t=e.type,o=e.target.ownerDocument!==document && frameElement!==null ? [$(frameElement).offset().top,$(frameElement).offset().left] : null,
				io=_canAccessIFrame() && e.target.ownerDocument!==top.document && frameElement!==null ? [$(e.view.frameElement).offset().top,$(e.view.frameElement).offset().left] : [0,0];
			switch(t){
				case "pointerdown": case "MSPointerDown": case "pointermove": case "MSPointerMove": case "pointerup": case "MSPointerUp":
					return o ? [e.originalEvent.pageY-o[0]+io[0],e.originalEvent.pageX-o[1]+io[1],false] : [e.originalEvent.pageY,e.originalEvent.pageX,false];
					break;
				case "touchstart": case "touchmove": case "touchend":
					var touch=e.originalEvent.touches[0] || e.originalEvent.changedTouches[0],
						touches=e.originalEvent.touches.length || e.originalEvent.changedTouches.length;
					return e.target.ownerDocument!==document ? [touch.screenY,touch.screenX,touches>1] : [touch.pageY,touch.pageX,touches>1];
					break;
				default:
					return o ? [e.pageY-o[0]+io[0],e.pageX-o[1]+io[1],false] : [e.pageY,e.pageX,false];
			}
		},
		/* -------------------- */
		
		
		/* 
		SCROLLBAR DRAG EVENTS
		scrolls content via scrollbar dragging 
		*/
		_draggable=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				draggerId=["mCSB_"+d.idx+"_dragger_vertical","mCSB_"+d.idx+"_dragger_horizontal"],
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=$("#"+draggerId[0]+",#"+draggerId[1]),
				draggable,dragY,dragX,
				rds=o.advanced.releaseDraggableSelectors ? mCSB_dragger.add($(o.advanced.releaseDraggableSelectors)) : mCSB_dragger,
				eds=o.advanced.extraDraggableSelectors ? $(!_canAccessIFrame() || top.document).add($(o.advanced.extraDraggableSelectors)) : $(!_canAccessIFrame() || top.document);
			mCSB_dragger.bind("contextmenu."+namespace,function(e){
				e.preventDefault(); //prevent right click
			}).bind("mousedown."+namespace+" touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace,function(e){
				e.stopImmediatePropagation();
				e.preventDefault();
				if(!_mouseBtnLeft(e)){return;} /* left mouse button only */
				touchActive=true;
				if(oldIE){document.onselectstart=function(){return false;}} /* disable text selection for IE < 9 */
				_iframe.call(mCSB_container,false); /* enable scrollbar dragging over iframes by disabling their events */
				_stop($this);
				draggable=$(this);
				var offset=draggable.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left,
					h=draggable.height()+offset.top,w=draggable.width()+offset.left;
				if(y<h && y>0 && x<w && x>0){
					dragY=y; 
					dragX=x;
				}
				_onDragClasses(draggable,"active",o.autoExpandScrollbar); 
			}).bind("touchmove."+namespace,function(e){
				e.stopImmediatePropagation();
				e.preventDefault();
				var offset=draggable.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left;
				_drag(dragY,dragX,y,x);
			});
			$(document).add(eds).bind("mousemove."+namespace+" pointermove."+namespace+" MSPointerMove."+namespace,function(e){
				if(draggable){
					var offset=draggable.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left;
					if(dragY===y && dragX===x){return;} /* has it really moved? */
					_drag(dragY,dragX,y,x);
				}
			}).add(rds).bind("mouseup."+namespace+" touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace,function(e){
				if(draggable){
					_onDragClasses(draggable,"active",o.autoExpandScrollbar); 
					draggable=null;
				}
				touchActive=false;
				if(oldIE){document.onselectstart=null;} /* enable text selection for IE < 9 */
				_iframe.call(mCSB_container,true); /* enable iframes events */
			});
			function _drag(dragY,dragX,y,x){
				mCSB_container[0].idleTimer=o.scrollInertia<233 ? 250 : 0;
				if(draggable.attr("id")===draggerId[1]){
					var dir="x",to=((draggable[0].offsetLeft-dragX)+x)*d.scrollRatio.x;
				}else{
					var dir="y",to=((draggable[0].offsetTop-dragY)+y)*d.scrollRatio.y;
				}
				_scrollTo($this,to.toString(),{dir:dir,drag:true});
			}
		},
		/* -------------------- */
		
		
		/* 
		TOUCH SWIPE EVENTS
		scrolls content via touch swipe 
		Emulates the native touch-swipe scrolling with momentum found in iOS, Android and WP devices 
		*/
		_contentDraggable=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
				draggable,dragY,dragX,touchStartY,touchStartX,touchMoveY=[],touchMoveX=[],startTime,runningTime,endTime,distance,speed,amount,
				durA=0,durB,overwrite=o.axis==="yx" ? "none" : "all",touchIntent=[],touchDrag,docDrag,
				iframe=mCSB_container.find("iframe"),
				events=[
					"touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace, //start
					"touchmove."+namespace+" pointermove."+namespace+" MSPointerMove."+namespace, //move
					"touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace //end
				],
				touchAction=document.body.style.touchAction!==undefined && document.body.style.touchAction!=="";
			mCSB_container.bind(events[0],function(e){
				_onTouchstart(e);
			}).bind(events[1],function(e){
				_onTouchmove(e);
			});
			mCustomScrollBox.bind(events[0],function(e){
				_onTouchstart2(e);
			}).bind(events[2],function(e){
				_onTouchend(e);
			});
			if(iframe.length){
				iframe.each(function(){
					$(this).bind("load",function(){
						/* bind events on accessible iframes */
						if(_canAccessIFrame(this)){
							$(this.contentDocument || this.contentWindow.document).bind(events[0],function(e){
								_onTouchstart(e);
								_onTouchstart2(e);
							}).bind(events[1],function(e){
								_onTouchmove(e);
							}).bind(events[2],function(e){
								_onTouchend(e);
							});
						}
					});
				});
			}
			function _onTouchstart(e){
				if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){touchable=0; return;}
				touchable=1; touchDrag=0; docDrag=0; draggable=1;
				$this.removeClass("mCS_touch_action");
				var offset=mCSB_container.offset();
				dragY=_coordinates(e)[0]-offset.top;
				dragX=_coordinates(e)[1]-offset.left;
				touchIntent=[_coordinates(e)[0],_coordinates(e)[1]];
			}
			function _onTouchmove(e){
				if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){return;}
				if(!o.documentTouchScroll){e.preventDefault();} 
				e.stopImmediatePropagation();
				if(docDrag && !touchDrag){return;}
				if(draggable){
					runningTime=_getTime();
					var offset=mCustomScrollBox.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left,
						easing="mcsLinearOut";
					touchMoveY.push(y);
					touchMoveX.push(x);
					touchIntent[2]=Math.abs(_coordinates(e)[0]-touchIntent[0]); touchIntent[3]=Math.abs(_coordinates(e)[1]-touchIntent[1]);
					if(d.overflowed[0]){
						var limit=mCSB_dragger[0].parent().height()-mCSB_dragger[0].height(),
							prevent=((dragY-y)>0 && (y-dragY)>-(limit*d.scrollRatio.y) && (touchIntent[3]*2<touchIntent[2] || o.axis==="yx"));
					}
					if(d.overflowed[1]){
						var limitX=mCSB_dragger[1].parent().width()-mCSB_dragger[1].width(),
							preventX=((dragX-x)>0 && (x-dragX)>-(limitX*d.scrollRatio.x) && (touchIntent[2]*2<touchIntent[3] || o.axis==="yx"));
					}
					if(prevent || preventX){ /* prevent native document scrolling */
						if(!touchAction){e.preventDefault();} 
						touchDrag=1;
					}else{
						docDrag=1;
						$this.addClass("mCS_touch_action");
					}
					if(touchAction){e.preventDefault();} 
					amount=o.axis==="yx" ? [(dragY-y),(dragX-x)] : o.axis==="x" ? [null,(dragX-x)] : [(dragY-y),null];
					mCSB_container[0].idleTimer=250;
					if(d.overflowed[0]){_drag(amount[0],durA,easing,"y","all",true);}
					if(d.overflowed[1]){_drag(amount[1],durA,easing,"x",overwrite,true);}
				}
			}
			function _onTouchstart2(e){
				if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){touchable=0; return;}
				touchable=1;
				e.stopImmediatePropagation();
				_stop($this);
				startTime=_getTime();
				var offset=mCustomScrollBox.offset();
				touchStartY=_coordinates(e)[0]-offset.top;
				touchStartX=_coordinates(e)[1]-offset.left;
				touchMoveY=[]; touchMoveX=[];
			}
			function _onTouchend(e){
				if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){return;}
				draggable=0;
				e.stopImmediatePropagation();
				touchDrag=0; docDrag=0;
				endTime=_getTime();
				var offset=mCustomScrollBox.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left;
				if((endTime-runningTime)>30){return;}
				speed=1000/(endTime-startTime);
				var easing="mcsEaseOut",slow=speed<2.5,
					diff=slow ? [touchMoveY[touchMoveY.length-2],touchMoveX[touchMoveX.length-2]] : [0,0];
				distance=slow ? [(y-diff[0]),(x-diff[1])] : [y-touchStartY,x-touchStartX];
				var absDistance=[Math.abs(distance[0]),Math.abs(distance[1])];
				speed=slow ? [Math.abs(distance[0]/4),Math.abs(distance[1]/4)] : [speed,speed];
				var a=[
					Math.abs(mCSB_container[0].offsetTop)-(distance[0]*_m((absDistance[0]/speed[0]),speed[0])),
					Math.abs(mCSB_container[0].offsetLeft)-(distance[1]*_m((absDistance[1]/speed[1]),speed[1]))
				];
				amount=o.axis==="yx" ? [a[0],a[1]] : o.axis==="x" ? [null,a[1]] : [a[0],null];
				durB=[(absDistance[0]*4)+o.scrollInertia,(absDistance[1]*4)+o.scrollInertia];
				var md=parseInt(o.contentTouchScroll) || 0; /* absolute minimum distance required */
				amount[0]=absDistance[0]>md ? amount[0] : 0;
				amount[1]=absDistance[1]>md ? amount[1] : 0;
				if(d.overflowed[0]){_drag(amount[0],durB[0],easing,"y",overwrite,false);}
				if(d.overflowed[1]){_drag(amount[1],durB[1],easing,"x",overwrite,false);}
			}
			function _m(ds,s){
				var r=[s*1.5,s*2,s/1.5,s/2];
				if(ds>90){
					return s>4 ? r[0] : r[3];
				}else if(ds>60){
					return s>3 ? r[3] : r[2];
				}else if(ds>30){
					return s>8 ? r[1] : s>6 ? r[0] : s>4 ? s : r[2];
				}else{
					return s>8 ? s : r[3];
				}
			}
			function _drag(amount,dur,easing,dir,overwrite,drag){
				if(!amount){return;}
				_scrollTo($this,amount.toString(),{dur:dur,scrollEasing:easing,dir:dir,overwrite:overwrite,drag:drag});
			}
		},
		/* -------------------- */
		
		
		/* 
		SELECT TEXT EVENTS 
		scrolls content when text is selected 
		*/
		_selectable=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,seq=d.sequential,
				namespace=pluginPfx+"_"+d.idx,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				action;
			mCSB_container.bind("mousedown."+namespace,function(e){
				if(touchable){return;}
				if(!action){action=1; touchActive=true;}
			}).add(document).bind("mousemove."+namespace,function(e){
				if(!touchable && action && _sel()){
					var offset=mCSB_container.offset(),
						y=_coordinates(e)[0]-offset.top+mCSB_container[0].offsetTop,x=_coordinates(e)[1]-offset.left+mCSB_container[0].offsetLeft;
					if(y>0 && y<wrapper.height() && x>0 && x<wrapper.width()){
						if(seq.step){_seq("off",null,"stepped");}
					}else{
						if(o.axis!=="x" && d.overflowed[0]){
							if(y<0){
								_seq("on",38);
							}else if(y>wrapper.height()){
								_seq("on",40);
							}
						}
						if(o.axis!=="y" && d.overflowed[1]){
							if(x<0){
								_seq("on",37);
							}else if(x>wrapper.width()){
								_seq("on",39);
							}
						}
					}
				}
			}).bind("mouseup."+namespace+" dragend."+namespace,function(e){
				if(touchable){return;}
				if(action){action=0; _seq("off",null);}
				touchActive=false;
			});
			function _sel(){
				return 	window.getSelection ? window.getSelection().toString() : 
						document.selection && document.selection.type!="Control" ? document.selection.createRange().text : 0;
			}
			function _seq(a,c,s){
				seq.type=s && action ? "stepped" : "stepless";
				seq.scrollAmount=10;
				_sequentialScroll($this,a,c,"mcsLinearOut",s ? 60 : null);
			}
		},
		/* -------------------- */
		
		
		/* 
		MOUSE WHEEL EVENT
		scrolls content via mouse-wheel 
		via mouse-wheel plugin (https://github.com/brandonaaron/jquery-mousewheel)
		*/
		_mousewheel=function(){
			if(!$(this).data(pluginPfx)){return;} /* Check if the scrollbar is ready to use mousewheel events (issue: #185) */
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
				iframe=$("#mCSB_"+d.idx+"_container").find("iframe");
			if(iframe.length){
				iframe.each(function(){
					$(this).bind("load",function(){
						/* bind events on accessible iframes */
						if(_canAccessIFrame(this)){
							$(this.contentDocument || this.contentWindow.document).bind("mousewheel."+namespace,function(e,delta){
								_onMousewheel(e,delta);
							});
						}
					});
				});
			}
			mCustomScrollBox.bind("mousewheel."+namespace,function(e,delta){
				_onMousewheel(e,delta);
			});
			function _onMousewheel(e,delta){
				_stop($this);
				if(_disableMousewheel($this,e.target)){return;} /* disables mouse-wheel when hovering specific elements */
				var deltaFactor=o.mouseWheel.deltaFactor!=="auto" ? parseInt(o.mouseWheel.deltaFactor) : (oldIE && e.deltaFactor<100) ? 100 : e.deltaFactor || 100,
					dur=o.scrollInertia;
				if(o.axis==="x" || o.mouseWheel.axis==="x"){
					var dir="x",
						px=[Math.round(deltaFactor*d.scrollRatio.x),parseInt(o.mouseWheel.scrollAmount)],
						amount=o.mouseWheel.scrollAmount!=="auto" ? px[1] : px[0]>=mCustomScrollBox.width() ? mCustomScrollBox.width()*0.9 : px[0],
						contentPos=Math.abs($("#mCSB_"+d.idx+"_container")[0].offsetLeft),
						draggerPos=mCSB_dragger[1][0].offsetLeft,
						limit=mCSB_dragger[1].parent().width()-mCSB_dragger[1].width(),
						dlt=o.mouseWheel.axis==="y" ? (e.deltaY || delta) : e.deltaX;
				}else{
					var dir="y",
						px=[Math.round(deltaFactor*d.scrollRatio.y),parseInt(o.mouseWheel.scrollAmount)],
						amount=o.mouseWheel.scrollAmount!=="auto" ? px[1] : px[0]>=mCustomScrollBox.height() ? mCustomScrollBox.height()*0.9 : px[0],
						contentPos=Math.abs($("#mCSB_"+d.idx+"_container")[0].offsetTop),
						draggerPos=mCSB_dragger[0][0].offsetTop,
						limit=mCSB_dragger[0].parent().height()-mCSB_dragger[0].height(),
						dlt=e.deltaY || delta;
				}
				if((dir==="y" && !d.overflowed[0]) || (dir==="x" && !d.overflowed[1])){return;}
				if(o.mouseWheel.invert || e.webkitDirectionInvertedFromDevice){dlt=-dlt;}
				if(o.mouseWheel.normalizeDelta){dlt=dlt<0 ? -1 : 1;}
				if((dlt>0 && draggerPos!==0) || (dlt<0 && draggerPos!==limit) || o.mouseWheel.preventDefault){
					e.stopImmediatePropagation();
					e.preventDefault();
				}
				if(e.deltaFactor<5 && !o.mouseWheel.normalizeDelta){
					//very low deltaFactor values mean some kind of delta acceleration (e.g. osx trackpad), so adjusting scrolling accordingly
					amount=e.deltaFactor; dur=17;
				}
				_scrollTo($this,(contentPos-(dlt*amount)).toString(),{dir:dir,dur:dur});
			}
		},
		/* -------------------- */
		
		
		/* checks if iframe can be accessed */
		_canAccessIFrameCache=new Object(),
		_canAccessIFrame=function(iframe){
		    var result=false,cacheKey=false,html=null;
		    if(iframe===undefined){
				cacheKey="#empty";
		    }else if($(iframe).attr("id")!==undefined){
				cacheKey=$(iframe).attr("id");
		    }
			if(cacheKey!==false && _canAccessIFrameCache[cacheKey]!==undefined){
				return _canAccessIFrameCache[cacheKey];
			}
			if(!iframe){
				try{
					var doc=top.document;
					html=doc.body.innerHTML;
				}catch(err){/* do nothing */}
				result=(html!==null);
			}else{
				try{
					var doc=iframe.contentDocument || iframe.contentWindow.document;
					html=doc.body.innerHTML;
				}catch(err){/* do nothing */}
				result=(html!==null);
			}
			if(cacheKey!==false){_canAccessIFrameCache[cacheKey]=result;}
			return result;
		},
		/* -------------------- */
		
		
		/* switches iframe's pointer-events property (drag, mousewheel etc. over cross-domain iframes) */
		_iframe=function(evt){
			var el=this.find("iframe");
			if(!el.length){return;} /* check if content contains iframes */
			var val=!evt ? "none" : "auto";
			el.css("pointer-events",val); /* for IE11, iframe's display property should not be "block" */
		},
		/* -------------------- */
		
		
		/* disables mouse-wheel when hovering specific elements like select, datalist etc. */
		_disableMousewheel=function(el,target){
			var tag=target.nodeName.toLowerCase(),
				tags=el.data(pluginPfx).opt.mouseWheel.disableOver,
				/* elements that require focus */
				focusTags=["select","textarea"];
			return $.inArray(tag,tags) > -1 && !($.inArray(tag,focusTags) > -1 && !$(target).is(":focus"));
		},
		/* -------------------- */
		
		
		/* 
		DRAGGER RAIL CLICK EVENT
		scrolls content via dragger rail 
		*/
		_draggerRail=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				namespace=pluginPfx+"_"+d.idx,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				mCSB_draggerContainer=$(".mCSB_"+d.idx+"_scrollbar ."+classes[12]),
				clickable;
			mCSB_draggerContainer.bind("mousedown."+namespace+" touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace,function(e){
				touchActive=true;
				if(!$(e.target).hasClass("mCSB_dragger")){clickable=1;}
			}).bind("touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace,function(e){
				touchActive=false;
			}).bind("click."+namespace,function(e){
				if(!clickable){return;}
				clickable=0;
				if($(e.target).hasClass(classes[12]) || $(e.target).hasClass("mCSB_draggerRail")){
					_stop($this);
					var el=$(this),mCSB_dragger=el.find(".mCSB_dragger");
					if(el.parent(".mCSB_scrollTools_horizontal").length>0){
						if(!d.overflowed[1]){return;}
						var dir="x",
							clickDir=e.pageX>mCSB_dragger.offset().left ? -1 : 1,
							to=Math.abs(mCSB_container[0].offsetLeft)-(clickDir*(wrapper.width()*0.9));
					}else{
						if(!d.overflowed[0]){return;}
						var dir="y",
							clickDir=e.pageY>mCSB_dragger.offset().top ? -1 : 1,
							to=Math.abs(mCSB_container[0].offsetTop)-(clickDir*(wrapper.height()*0.9));
					}
					_scrollTo($this,to.toString(),{dir:dir,scrollEasing:"mcsEaseInOut"});
				}
			});
		},
		/* -------------------- */
		
		
		/* 
		FOCUS EVENT
		scrolls content via element focus (e.g. clicking an input, pressing TAB key etc.)
		*/
		_focus=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent();
			mCSB_container.bind("focusin."+namespace,function(e){
				var el=$(document.activeElement),
					nested=mCSB_container.find(".mCustomScrollBox").length,
					dur=0;
				if(!el.is(o.advanced.autoScrollOnFocus)){return;}
				_stop($this);
				clearTimeout($this[0]._focusTimeout);
				$this[0]._focusTimer=nested ? (dur+17)*nested : 0;
				$this[0]._focusTimeout=setTimeout(function(){
					var	to=[_childPos(el)[0],_childPos(el)[1]],
						contentPos=[mCSB_container[0].offsetTop,mCSB_container[0].offsetLeft],
						isVisible=[
							(contentPos[0]+to[0]>=0 && contentPos[0]+to[0]<wrapper.height()-el.outerHeight(false)),
							(contentPos[1]+to[1]>=0 && contentPos[0]+to[1]<wrapper.width()-el.outerWidth(false))
						],
						overwrite=(o.axis==="yx" && !isVisible[0] && !isVisible[1]) ? "none" : "all";
					if(o.axis!=="x" && !isVisible[0]){
						_scrollTo($this,to[0].toString(),{dir:"y",scrollEasing:"mcsEaseInOut",overwrite:overwrite,dur:dur});
					}
					if(o.axis!=="y" && !isVisible[1]){
						_scrollTo($this,to[1].toString(),{dir:"x",scrollEasing:"mcsEaseInOut",overwrite:overwrite,dur:dur});
					}
				},$this[0]._focusTimer);
			});
		},
		/* -------------------- */
		
		
		/* sets content wrapper scrollTop/scrollLeft always to 0 */
		_wrapperScroll=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				namespace=pluginPfx+"_"+d.idx,
				wrapper=$("#mCSB_"+d.idx+"_container").parent();
			wrapper.bind("scroll."+namespace,function(e){
				if(wrapper.scrollTop()!==0 || wrapper.scrollLeft()!==0){
					$(".mCSB_"+d.idx+"_scrollbar").css("visibility","hidden"); /* hide scrollbar(s) */
				}
			});
		},
		/* -------------------- */
		
		
		/* 
		BUTTONS EVENTS
		scrolls content via up, down, left and right buttons 
		*/
		_buttons=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,seq=d.sequential,
				namespace=pluginPfx+"_"+d.idx,
				sel=".mCSB_"+d.idx+"_scrollbar",
				btn=$(sel+">a");
			btn.bind("contextmenu."+namespace,function(e){
				e.preventDefault(); //prevent right click
			}).bind("mousedown."+namespace+" touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace+" mouseup."+namespace+" touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace+" mouseout."+namespace+" pointerout."+namespace+" MSPointerOut."+namespace+" click."+namespace,function(e){
				e.preventDefault();
				if(!_mouseBtnLeft(e)){return;} /* left mouse button only */
				var btnClass=$(this).attr("class");
				seq.type=o.scrollButtons.scrollType;
				switch(e.type){
					case "mousedown": case "touchstart": case "pointerdown": case "MSPointerDown":
						if(seq.type==="stepped"){return;}
						touchActive=true;
						d.tweenRunning=false;
						_seq("on",btnClass);
						break;
					case "mouseup": case "touchend": case "pointerup": case "MSPointerUp":
					case "mouseout": case "pointerout": case "MSPointerOut":
						if(seq.type==="stepped"){return;}
						touchActive=false;
						if(seq.dir){_seq("off",btnClass);}
						break;
					case "click":
						if(seq.type!=="stepped" || d.tweenRunning){return;}
						_seq("on",btnClass);
						break;
				}
				function _seq(a,c){
					seq.scrollAmount=o.scrollButtons.scrollAmount;
					_sequentialScroll($this,a,c);
				}
			});
		},
		/* -------------------- */
		
		
		/* 
		KEYBOARD EVENTS
		scrolls content via keyboard 
		Keys: up arrow, down arrow, left arrow, right arrow, PgUp, PgDn, Home, End
		*/
		_keyboard=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,seq=d.sequential,
				namespace=pluginPfx+"_"+d.idx,
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				editables="input,textarea,select,datalist,keygen,[contenteditable='true']",
				iframe=mCSB_container.find("iframe"),
				events=["blur."+namespace+" keydown."+namespace+" keyup."+namespace];
			if(iframe.length){
				iframe.each(function(){
					$(this).bind("load",function(){
						/* bind events on accessible iframes */
						if(_canAccessIFrame(this)){
							$(this.contentDocument || this.contentWindow.document).bind(events[0],function(e){
								_onKeyboard(e);
							});
						}
					});
				});
			}
			mCustomScrollBox.attr("tabindex","0").bind(events[0],function(e){
				_onKeyboard(e);
			});
			function _onKeyboard(e){
				switch(e.type){
					case "blur":
						if(d.tweenRunning && seq.dir){_seq("off",null);}
						break;
					case "keydown": case "keyup":
						var code=e.keyCode ? e.keyCode : e.which,action="on";
						if((o.axis!=="x" && (code===38 || code===40)) || (o.axis!=="y" && (code===37 || code===39))){
							/* up (38), down (40), left (37), right (39) arrows */
							if(((code===38 || code===40) && !d.overflowed[0]) || ((code===37 || code===39) && !d.overflowed[1])){return;}
							if(e.type==="keyup"){action="off";}
							if(!$(document.activeElement).is(editables)){
								e.preventDefault();
								e.stopImmediatePropagation();
								_seq(action,code);
							}
						}else if(code===33 || code===34){
							/* PgUp (33), PgDn (34) */
							if(d.overflowed[0] || d.overflowed[1]){
								e.preventDefault();
								e.stopImmediatePropagation();
							}
							if(e.type==="keyup"){
								_stop($this);
								var keyboardDir=code===34 ? -1 : 1;
								if(o.axis==="x" || (o.axis==="yx" && d.overflowed[1] && !d.overflowed[0])){
									var dir="x",to=Math.abs(mCSB_container[0].offsetLeft)-(keyboardDir*(wrapper.width()*0.9));
								}else{
									var dir="y",to=Math.abs(mCSB_container[0].offsetTop)-(keyboardDir*(wrapper.height()*0.9));
								}
								_scrollTo($this,to.toString(),{dir:dir,scrollEasing:"mcsEaseInOut"});
							}
						}else if(code===35 || code===36){
							/* End (35), Home (36) */
							if(!$(document.activeElement).is(editables)){
								if(d.overflowed[0] || d.overflowed[1]){
									e.preventDefault();
									e.stopImmediatePropagation();
								}
								if(e.type==="keyup"){
									if(o.axis==="x" || (o.axis==="yx" && d.overflowed[1] && !d.overflowed[0])){
										var dir="x",to=code===35 ? Math.abs(wrapper.width()-mCSB_container.outerWidth(false)) : 0;
									}else{
										var dir="y",to=code===35 ? Math.abs(wrapper.height()-mCSB_container.outerHeight(false)) : 0;
									}
									_scrollTo($this,to.toString(),{dir:dir,scrollEasing:"mcsEaseInOut"});
								}
							}
						}
						break;
				}
				function _seq(a,c){
					seq.type=o.keyboard.scrollType;
					seq.scrollAmount=o.keyboard.scrollAmount;
					if(seq.type==="stepped" && d.tweenRunning){return;}
					_sequentialScroll($this,a,c);
				}
			}
		},
		/* -------------------- */
		
		
		/* scrolls content sequentially (used when scrolling via buttons, keyboard arrows etc.) */
		_sequentialScroll=function(el,action,trigger,e,s){
			var d=el.data(pluginPfx),o=d.opt,seq=d.sequential,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				once=seq.type==="stepped" ? true : false,
				steplessSpeed=o.scrollInertia < 26 ? 26 : o.scrollInertia, /* 26/1.5=17 */
				steppedSpeed=o.scrollInertia < 1 ? 17 : o.scrollInertia;
			switch(action){
				case "on":
					seq.dir=[
						(trigger===classes[16] || trigger===classes[15] || trigger===39 || trigger===37 ? "x" : "y"),
						(trigger===classes[13] || trigger===classes[15] || trigger===38 || trigger===37 ? -1 : 1)
					];
					_stop(el);
					if(_isNumeric(trigger) && seq.type==="stepped"){return;}
					_on(once);
					break;
				case "off":
					_off();
					if(once || (d.tweenRunning && seq.dir)){
						_on(true);
					}
					break;
			}
			
			/* starts sequence */
			function _on(once){
				if(o.snapAmount){seq.scrollAmount=!(o.snapAmount instanceof Array) ? o.snapAmount : seq.dir[0]==="x" ? o.snapAmount[1] : o.snapAmount[0];} /* scrolling snapping */
				var c=seq.type!=="stepped", /* continuous scrolling */
					t=s ? s : !once ? 1000/60 : c ? steplessSpeed/1.5 : steppedSpeed, /* timer */
					m=!once ? 2.5 : c ? 7.5 : 40, /* multiplier */
					contentPos=[Math.abs(mCSB_container[0].offsetTop),Math.abs(mCSB_container[0].offsetLeft)],
					ratio=[d.scrollRatio.y>10 ? 10 : d.scrollRatio.y,d.scrollRatio.x>10 ? 10 : d.scrollRatio.x],
					amount=seq.dir[0]==="x" ? contentPos[1]+(seq.dir[1]*(ratio[1]*m)) : contentPos[0]+(seq.dir[1]*(ratio[0]*m)),
					px=seq.dir[0]==="x" ? contentPos[1]+(seq.dir[1]*parseInt(seq.scrollAmount)) : contentPos[0]+(seq.dir[1]*parseInt(seq.scrollAmount)),
					to=seq.scrollAmount!=="auto" ? px : amount,
					easing=e ? e : !once ? "mcsLinear" : c ? "mcsLinearOut" : "mcsEaseInOut",
					onComplete=!once ? false : true;
				if(once && t<17){
					to=seq.dir[0]==="x" ? contentPos[1] : contentPos[0];
				}
				_scrollTo(el,to.toString(),{dir:seq.dir[0],scrollEasing:easing,dur:t,onComplete:onComplete});
				if(once){
					seq.dir=false;
					return;
				}
				clearTimeout(seq.step);
				seq.step=setTimeout(function(){
					_on();
				},t);
			}
			/* stops sequence */
			function _off(){
				clearTimeout(seq.step);
				_delete(seq,"step");
				_stop(el);
			}
		},
		/* -------------------- */
		
		
		/* returns a yx array from value */
		_arr=function(val){
			var o=$(this).data(pluginPfx).opt,vals=[];
			if(typeof val==="function"){val=val();} /* check if the value is a single anonymous function */
			/* check if value is object or array, its length and create an array with yx values */
			if(!(val instanceof Array)){ /* object value (e.g. {y:"100",x:"100"}, 100 etc.) */
				vals[0]=val.y ? val.y : val.x || o.axis==="x" ? null : val;
				vals[1]=val.x ? val.x : val.y || o.axis==="y" ? null : val;
			}else{ /* array value (e.g. [100,100]) */
				vals=val.length>1 ? [val[0],val[1]] : o.axis==="x" ? [null,val[0]] : [val[0],null];
			}
			/* check if array values are anonymous functions */
			if(typeof vals[0]==="function"){vals[0]=vals[0]();}
			if(typeof vals[1]==="function"){vals[1]=vals[1]();}
			return vals;
		},
		/* -------------------- */
		
		
		/* translates values (e.g. "top", 100, "100px", "#id") to actual scroll-to positions */
		_to=function(val,dir){
			if(val==null || typeof val=="undefined"){return;}
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				t=typeof val;
			if(!dir){dir=o.axis==="x" ? "x" : "y";}
			var contentLength=dir==="x" ? mCSB_container.outerWidth(false)-wrapper.width() : mCSB_container.outerHeight(false)-wrapper.height(),
				contentPos=dir==="x" ? mCSB_container[0].offsetLeft : mCSB_container[0].offsetTop,
				cssProp=dir==="x" ? "left" : "top";
			switch(t){
				case "function": /* this currently is not used. Consider removing it */
					return val();
					break;
				case "object": /* js/jquery object */
					var obj=val.jquery ? val : $(val);
					if(!obj.length){return;}
					return dir==="x" ? _childPos(obj)[1] : _childPos(obj)[0];
					break;
				case "string": case "number":
					if(_isNumeric(val)){ /* numeric value */
						return Math.abs(val);
					}else if(val.indexOf("%")!==-1){ /* percentage value */
						return Math.abs(contentLength*parseInt(val)/100);
					}else if(val.indexOf("-=")!==-1){ /* decrease value */
						return Math.abs(contentPos-parseInt(val.split("-=")[1]));
					}else if(val.indexOf("+=")!==-1){ /* inrease value */
						var p=(contentPos+parseInt(val.split("+=")[1]));
						return p>=0 ? 0 : Math.abs(p);
					}else if(val.indexOf("px")!==-1 && _isNumeric(val.split("px")[0])){ /* pixels string value (e.g. "100px") */
						return Math.abs(val.split("px")[0]);
					}else{
						if(val==="top" || val==="left"){ /* special strings */
							return 0;
						}else if(val==="bottom"){
							return Math.abs(wrapper.height()-mCSB_container.outerHeight(false));
						}else if(val==="right"){
							return Math.abs(wrapper.width()-mCSB_container.outerWidth(false));
						}else if(val==="first" || val==="last"){
							var obj=mCSB_container.find(":"+val);
							return dir==="x" ? _childPos(obj)[1] : _childPos(obj)[0];
						}else{
							if($(val).length){ /* jquery selector */
								return dir==="x" ? _childPos($(val))[1] : _childPos($(val))[0];
							}else{ /* other values (e.g. "100em") */
								mCSB_container.css(cssProp,val);
								methods.update.call(null,$this[0]);
								return;
							}
						}
					}
					break;
			}
		},
		/* -------------------- */
		
		
		/* calls the update method automatically */
		_autoUpdate=function(rem){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCSB_container=$("#mCSB_"+d.idx+"_container");
			if(rem){
				/* 
				removes autoUpdate timer 
				usage: _autoUpdate.call(this,"remove");
				*/
				clearTimeout(mCSB_container[0].autoUpdate);
				_delete(mCSB_container[0],"autoUpdate");
				return;
			}
			upd();
			function upd(){
				clearTimeout(mCSB_container[0].autoUpdate);
				if($this.parents("html").length===0){
					/* check element in dom tree */
					$this=null;
					return;
				}
				mCSB_container[0].autoUpdate=setTimeout(function(){
					/* update on specific selector(s) length and size change */
					if(o.advanced.updateOnSelectorChange){
						d.poll.change.n=sizesSum();
						if(d.poll.change.n!==d.poll.change.o){
							d.poll.change.o=d.poll.change.n;
							doUpd(3);
							return;
						}
					}
					/* update on main element and scrollbar size changes */
					if(o.advanced.updateOnContentResize){
						d.poll.size.n=$this[0].scrollHeight+$this[0].scrollWidth+mCSB_container[0].offsetHeight+$this[0].offsetHeight+$this[0].offsetWidth;
						if(d.poll.size.n!==d.poll.size.o){
							d.poll.size.o=d.poll.size.n;
							doUpd(1);
							return;
						}
					}
					/* update on image load */
					if(o.advanced.updateOnImageLoad){
						if(!(o.advanced.updateOnImageLoad==="auto" && o.axis==="y")){ //by default, it doesn't run on vertical content
							d.poll.img.n=mCSB_container.find("img").length;
							if(d.poll.img.n!==d.poll.img.o){
								d.poll.img.o=d.poll.img.n;
								mCSB_container.find("img").each(function(){
									imgLoader(this);
								});
								return;
							}
						}
					}
					if(o.advanced.updateOnSelectorChange || o.advanced.updateOnContentResize || o.advanced.updateOnImageLoad){upd();}
				},o.advanced.autoUpdateTimeout);
			}
			/* a tiny image loader */
			function imgLoader(el){
				if($(el).hasClass(classes[2])){doUpd(); return;}
				var img=new Image();
				function createDelegate(contextObject,delegateMethod){
					return function(){return delegateMethod.apply(contextObject,arguments);}
				}
				function imgOnLoad(){
					this.onload=null;
					$(el).addClass(classes[2]);
					doUpd(2);
				}
				img.onload=createDelegate(img,imgOnLoad);
				img.src=el.src;
			}
			/* returns the total height and width sum of all elements matching the selector */
			function sizesSum(){
				if(o.advanced.updateOnSelectorChange===true){o.advanced.updateOnSelectorChange="*";}
				var total=0,sel=mCSB_container.find(o.advanced.updateOnSelectorChange);
				if(o.advanced.updateOnSelectorChange && sel.length>0){sel.each(function(){total+=this.offsetHeight+this.offsetWidth;});}
				return total;
			}
			/* calls the update method */
			function doUpd(cb){
				clearTimeout(mCSB_container[0].autoUpdate);
				methods.update.call(null,$this[0],cb);
			}
		},
		/* -------------------- */
		
		
		/* snaps scrolling to a multiple of a pixels number */
		_snapAmount=function(to,amount,offset){
			return (Math.round(to/amount)*amount-offset); 
		},
		/* -------------------- */
		
		
		/* stops content and scrollbar animations */
		_stop=function(el){
			var d=el.data(pluginPfx),
				sel=$("#mCSB_"+d.idx+"_container,#mCSB_"+d.idx+"_container_wrapper,#mCSB_"+d.idx+"_dragger_vertical,#mCSB_"+d.idx+"_dragger_horizontal");
			sel.each(function(){
				_stopTween.call(this);
			});
		},
		/* -------------------- */
		
		
		/* 
		ANIMATES CONTENT 
		This is where the actual scrolling happens
		*/
		_scrollTo=function(el,to,options){
			var d=el.data(pluginPfx),o=d.opt,
				defaults={
					trigger:"internal",
					dir:"y",
					scrollEasing:"mcsEaseOut",
					drag:false,
					dur:o.scrollInertia,
					overwrite:"all",
					callbacks:true,
					onStart:true,
					onUpdate:true,
					onComplete:true
				},
				options=$.extend(defaults,options),
				dur=[options.dur,(options.drag ? 0 : options.dur)],
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				totalScrollOffsets=o.callbacks.onTotalScrollOffset ? _arr.call(el,o.callbacks.onTotalScrollOffset) : [0,0],
				totalScrollBackOffsets=o.callbacks.onTotalScrollBackOffset ? _arr.call(el,o.callbacks.onTotalScrollBackOffset) : [0,0];
			d.trigger=options.trigger;
			if(wrapper.scrollTop()!==0 || wrapper.scrollLeft()!==0){ /* always reset scrollTop/Left */
				$(".mCSB_"+d.idx+"_scrollbar").css("visibility","visible");
				wrapper.scrollTop(0).scrollLeft(0);
			}
			if(to==="_resetY" && !d.contentReset.y){
				/* callbacks: onOverflowYNone */
				if(_cb("onOverflowYNone")){o.callbacks.onOverflowYNone.call(el[0]);}
				d.contentReset.y=1;
			}
			if(to==="_resetX" && !d.contentReset.x){
				/* callbacks: onOverflowXNone */
				if(_cb("onOverflowXNone")){o.callbacks.onOverflowXNone.call(el[0]);}
				d.contentReset.x=1;
			}
			if(to==="_resetY" || to==="_resetX"){return;}
			if((d.contentReset.y || !el[0].mcs) && d.overflowed[0]){
				/* callbacks: onOverflowY */
				if(_cb("onOverflowY")){o.callbacks.onOverflowY.call(el[0]);}
				d.contentReset.x=null;
			}
			if((d.contentReset.x || !el[0].mcs) && d.overflowed[1]){
				/* callbacks: onOverflowX */
				if(_cb("onOverflowX")){o.callbacks.onOverflowX.call(el[0]);}
				d.contentReset.x=null;
			}
			if(o.snapAmount){ /* scrolling snapping */
				var snapAmount=!(o.snapAmount instanceof Array) ? o.snapAmount : options.dir==="x" ? o.snapAmount[1] : o.snapAmount[0];
				to=_snapAmount(to,snapAmount,o.snapOffset);
			}
			switch(options.dir){
				case "x":
					var mCSB_dragger=$("#mCSB_"+d.idx+"_dragger_horizontal"),
						property="left",
						contentPos=mCSB_container[0].offsetLeft,
						limit=[
							mCustomScrollBox.width()-mCSB_container.outerWidth(false),
							mCSB_dragger.parent().width()-mCSB_dragger.width()
						],
						scrollTo=[to,to===0 ? 0 : (to/d.scrollRatio.x)],
						tso=totalScrollOffsets[1],
						tsbo=totalScrollBackOffsets[1],
						totalScrollOffset=tso>0 ? tso/d.scrollRatio.x : 0,
						totalScrollBackOffset=tsbo>0 ? tsbo/d.scrollRatio.x : 0;
					break;
				case "y":
					var mCSB_dragger=$("#mCSB_"+d.idx+"_dragger_vertical"),
						property="top",
						contentPos=mCSB_container[0].offsetTop,
						limit=[
							mCustomScrollBox.height()-mCSB_container.outerHeight(false),
							mCSB_dragger.parent().height()-mCSB_dragger.height()
						],
						scrollTo=[to,to===0 ? 0 : (to/d.scrollRatio.y)],
						tso=totalScrollOffsets[0],
						tsbo=totalScrollBackOffsets[0],
						totalScrollOffset=tso>0 ? tso/d.scrollRatio.y : 0,
						totalScrollBackOffset=tsbo>0 ? tsbo/d.scrollRatio.y : 0;
					break;
			}
			if(scrollTo[1]<0 || (scrollTo[0]===0 && scrollTo[1]===0)){
				scrollTo=[0,0];
			}else if(scrollTo[1]>=limit[1]){
				scrollTo=[limit[0],limit[1]];
			}else{
				scrollTo[0]=-scrollTo[0];
			}
			if(!el[0].mcs){
				_mcs();  /* init mcs object (once) to make it available before callbacks */
				if(_cb("onInit")){o.callbacks.onInit.call(el[0]);} /* callbacks: onInit */
			}
			clearTimeout(mCSB_container[0].onCompleteTimeout);
			_tweenTo(mCSB_dragger[0],property,Math.round(scrollTo[1]),dur[1],options.scrollEasing);
			if(!d.tweenRunning && ((contentPos===0 && scrollTo[0]>=0) || (contentPos===limit[0] && scrollTo[0]<=limit[0]))){return;}
			_tweenTo(mCSB_container[0],property,Math.round(scrollTo[0]),dur[0],options.scrollEasing,options.overwrite,{
				onStart:function(){
					if(options.callbacks && options.onStart && !d.tweenRunning){
						/* callbacks: onScrollStart */
						if(_cb("onScrollStart")){_mcs(); o.callbacks.onScrollStart.call(el[0]);}
						d.tweenRunning=true;
						_onDragClasses(mCSB_dragger);
						d.cbOffsets=_cbOffsets();
					}
				},onUpdate:function(){
					if(options.callbacks && options.onUpdate){
						/* callbacks: whileScrolling */
						if(_cb("whileScrolling")){_mcs(); o.callbacks.whileScrolling.call(el[0]);}
					}
				},onComplete:function(){
					if(options.callbacks && options.onComplete){
						if(o.axis==="yx"){clearTimeout(mCSB_container[0].onCompleteTimeout);}
						var t=mCSB_container[0].idleTimer || 0;
						mCSB_container[0].onCompleteTimeout=setTimeout(function(){
							/* callbacks: onScroll, onTotalScroll, onTotalScrollBack */
							if(_cb("onScroll")){_mcs(); o.callbacks.onScroll.call(el[0]);}
							if(_cb("onTotalScroll") && scrollTo[1]>=limit[1]-totalScrollOffset && d.cbOffsets[0]){_mcs(); o.callbacks.onTotalScroll.call(el[0]);}
							if(_cb("onTotalScrollBack") && scrollTo[1]<=totalScrollBackOffset && d.cbOffsets[1]){_mcs(); o.callbacks.onTotalScrollBack.call(el[0]);}
							d.tweenRunning=false;
							mCSB_container[0].idleTimer=0;
							_onDragClasses(mCSB_dragger,"hide");
						},t);
					}
				}
			});
			/* checks if callback function exists */
			function _cb(cb){
				return d && o.callbacks[cb] && typeof o.callbacks[cb]==="function";
			}
			/* checks whether callback offsets always trigger */
			function _cbOffsets(){
				return [o.callbacks.alwaysTriggerOffsets || contentPos>=limit[0]+tso,o.callbacks.alwaysTriggerOffsets || contentPos<=-tsbo];
			}
			/* 
			populates object with useful values for the user 
			values: 
				content: this.mcs.content
				content top position: this.mcs.top 
				content left position: this.mcs.left 
				dragger top position: this.mcs.draggerTop 
				dragger left position: this.mcs.draggerLeft 
				scrolling y percentage: this.mcs.topPct 
				scrolling x percentage: this.mcs.leftPct 
				scrolling direction: this.mcs.direction
			*/
			function _mcs(){
				var cp=[mCSB_container[0].offsetTop,mCSB_container[0].offsetLeft], /* content position */
					dp=[mCSB_dragger[0].offsetTop,mCSB_dragger[0].offsetLeft], /* dragger position */
					cl=[mCSB_container.outerHeight(false),mCSB_container.outerWidth(false)], /* content length */
					pl=[mCustomScrollBox.height(),mCustomScrollBox.width()]; /* content parent length */
				el[0].mcs={
					content:mCSB_container, /* original content wrapper as jquery object */
					top:cp[0],left:cp[1],draggerTop:dp[0],draggerLeft:dp[1],
					topPct:Math.round((100*Math.abs(cp[0]))/(Math.abs(cl[0])-pl[0])),leftPct:Math.round((100*Math.abs(cp[1]))/(Math.abs(cl[1])-pl[1])),
					direction:options.dir
				};
				/* 
				this refers to the original element containing the scrollbar(s)
				usage: this.mcs.top, this.mcs.leftPct etc. 
				*/
			}
		},
		/* -------------------- */
		
		
		/* 
		CUSTOM JAVASCRIPT ANIMATION TWEEN 
		Lighter and faster than jquery animate() and css transitions 
		Animates top/left properties and includes easings 
		*/
		_tweenTo=function(el,prop,to,duration,easing,overwrite,callbacks){
			if(!el._mTween){el._mTween={top:{},left:{}};}
			var callbacks=callbacks || {},
				onStart=callbacks.onStart || function(){},onUpdate=callbacks.onUpdate || function(){},onComplete=callbacks.onComplete || function(){},
				startTime=_getTime(),_delay,progress=0,from=el.offsetTop,elStyle=el.style,_request,tobj=el._mTween[prop];
			if(prop==="left"){from=el.offsetLeft;}
			var diff=to-from;
			tobj.stop=0;
			if(overwrite!=="none"){_cancelTween();}
			_startTween();
			function _step(){
				if(tobj.stop){return;}
				if(!progress){onStart.call();}
				progress=_getTime()-startTime;
				_tween();
				if(progress>=tobj.time){
					tobj.time=(progress>tobj.time) ? progress+_delay-(progress-tobj.time) : progress+_delay-1;
					if(tobj.time<progress+1){tobj.time=progress+1;}
				}
				if(tobj.time<duration){tobj.id=_request(_step);}else{onComplete.call();}
			}
			function _tween(){
				if(duration>0){
					tobj.currVal=_ease(tobj.time,from,diff,duration,easing);
					elStyle[prop]=Math.round(tobj.currVal)+"px";
				}else{
					elStyle[prop]=to+"px";
				}
				onUpdate.call();
			}
			function _startTween(){
				_delay=1000/60;
				tobj.time=progress+_delay;
				_request=(!window.requestAnimationFrame) ? function(f){_tween(); return setTimeout(f,0.01);} : window.requestAnimationFrame;
				tobj.id=_request(_step);
			}
			function _cancelTween(){
				if(tobj.id==null){return;}
				if(!window.requestAnimationFrame){clearTimeout(tobj.id);
				}else{window.cancelAnimationFrame(tobj.id);}
				tobj.id=null;
			}
			function _ease(t,b,c,d,type){
				switch(type){
					case "linear": case "mcsLinear":
						return c*t/d + b;
						break;
					case "mcsLinearOut":
						t/=d; t--; return c * Math.sqrt(1 - t*t) + b;
						break;
					case "easeInOutSmooth":
						t/=d/2;
						if(t<1) return c/2*t*t + b;
						t--;
						return -c/2 * (t*(t-2) - 1) + b;
						break;
					case "easeInOutStrong":
						t/=d/2;
						if(t<1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
						t--;
						return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
						break;
					case "easeInOut": case "mcsEaseInOut":
						t/=d/2;
						if(t<1) return c/2*t*t*t + b;
						t-=2;
						return c/2*(t*t*t + 2) + b;
						break;
					case "easeOutSmooth":
						t/=d; t--;
						return -c * (t*t*t*t - 1) + b;
						break;
					case "easeOutStrong":
						return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
						break;
					case "easeOut": case "mcsEaseOut": default:
						var ts=(t/=d)*t,tc=ts*t;
						return b+c*(0.499999999999997*tc*ts + -2.5*ts*ts + 5.5*tc + -6.5*ts + 4*t);
				}
			}
		},
		/* -------------------- */
		
		
		/* returns current time */
		_getTime=function(){
			if(window.performance && window.performance.now){
				return window.performance.now();
			}else{
				if(window.performance && window.performance.webkitNow){
					return window.performance.webkitNow();
				}else{
					if(Date.now){return Date.now();}else{return new Date().getTime();}
				}
			}
		},
		/* -------------------- */
		
		
		/* stops a tween */
		_stopTween=function(){
			var el=this;
			if(!el._mTween){el._mTween={top:{},left:{}};}
			var props=["top","left"];
			for(var i=0; i<props.length; i++){
				var prop=props[i];
				if(el._mTween[prop].id){
					if(!window.requestAnimationFrame){clearTimeout(el._mTween[prop].id);
					}else{window.cancelAnimationFrame(el._mTween[prop].id);}
					el._mTween[prop].id=null;
					el._mTween[prop].stop=1;
				}
			}
		},
		/* -------------------- */
		
		
		/* deletes a property (avoiding the exception thrown by IE) */
		_delete=function(c,m){
			try{delete c[m];}catch(e){c[m]=null;}
		},
		/* -------------------- */
		
		
		/* detects left mouse button */
		_mouseBtnLeft=function(e){
			return !(e.which && e.which!==1);
		},
		/* -------------------- */
		
		
		/* detects if pointer type event is touch */
		_pointerTouch=function(e){
			var t=e.originalEvent.pointerType;
			return !(t && t!=="touch" && t!==2);
		},
		/* -------------------- */
		
		
		/* checks if value is numeric */
		_isNumeric=function(val){
			return !isNaN(parseFloat(val)) && isFinite(val);
		},
		/* -------------------- */
		
		
		/* returns element position according to content */
		_childPos=function(el){
			var p=el.parents(".mCSB_container");
			return [el.offset().top-p.offset().top,el.offset().left-p.offset().left];
		},
		/* -------------------- */
		
		
		/* checks if browser tab is hidden/inactive via Page Visibility API */
		_isTabHidden=function(){
			var prop=_getHiddenProp();
			if(!prop) return false;
			return document[prop];
			function _getHiddenProp(){
				var pfx=["webkit","moz","ms","o"];
				if("hidden" in document) return "hidden"; //natively supported
				for(var i=0; i<pfx.length; i++){ //prefixed
				    if((pfx[i]+"Hidden") in document) 
				        return pfx[i]+"Hidden";
				}
				return null; //not supported
			}
		};
		/* -------------------- */
		
	
	
	
	
	/* 
	----------------------------------------
	PLUGIN SETUP 
	----------------------------------------
	*/
	
	/* plugin constructor functions */
	$.fn[pluginNS]=function(method){ /* usage: $(selector).mCustomScrollbar(); */
		if(methods[method]){
			return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
		}else if(typeof method==="object" || !method){
			return methods.init.apply(this,arguments);
		}else{
			$.error("Method "+method+" does not exist");
		}
	};
	$[pluginNS]=function(method){ /* usage: $.mCustomScrollbar(); */
		if(methods[method]){
			return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
		}else if(typeof method==="object" || !method){
			return methods.init.apply(this,arguments);
		}else{
			$.error("Method "+method+" does not exist");
		}
	};
	
	/* 
	allow setting plugin default options. 
	usage: $.mCustomScrollbar.defaults.scrollInertia=500; 
	to apply any changed default options on default selectors (below), use inside document ready fn 
	e.g.: $(document).ready(function(){ $.mCustomScrollbar.defaults.scrollInertia=500; });
	*/
	$[pluginNS].defaults=defaults;
	
	/* 
	add window object (window.mCustomScrollbar) 
	usage: if(window.mCustomScrollbar){console.log("custom scrollbar plugin loaded");}
	*/
	window[pluginNS]=true;
	
	$(window).bind("load",function(){
		
		$(defaultSelector)[pluginNS](); /* add scrollbars automatically on default selector */
		
		/* extend jQuery expressions */
		$.extend($.expr[":"],{
			/* checks if element is within scrollable viewport */
			mcsInView:$.expr[":"].mcsInView || function(el){
				var $el=$(el),content=$el.parents(".mCSB_container"),wrapper,cPos;
				if(!content.length){return;}
				wrapper=content.parent();
				cPos=[content[0].offsetTop,content[0].offsetLeft];
				return 	cPos[0]+_childPos($el)[0]>=0 && cPos[0]+_childPos($el)[0]<wrapper.height()-$el.outerHeight(false) && 
						cPos[1]+_childPos($el)[1]>=0 && cPos[1]+_childPos($el)[1]<wrapper.width()-$el.outerWidth(false);
			},
			/* checks if element or part of element is in view of scrollable viewport */
			mcsInSight:$.expr[":"].mcsInSight || function(el,i,m){
				var $el=$(el),elD,content=$el.parents(".mCSB_container"),wrapperView,pos,wrapperViewPct,
					pctVals=m[3]==="exact" ? [[1,0],[1,0]] : [[0.9,0.1],[0.6,0.4]];
				if(!content.length){return;}
				elD=[$el.outerHeight(false),$el.outerWidth(false)];
				pos=[content[0].offsetTop+_childPos($el)[0],content[0].offsetLeft+_childPos($el)[1]];
				wrapperView=[content.parent()[0].offsetHeight,content.parent()[0].offsetWidth];
				wrapperViewPct=[elD[0]<wrapperView[0] ? pctVals[0] : pctVals[1],elD[1]<wrapperView[1] ? pctVals[0] : pctVals[1]];
				return 	pos[0]-(wrapperView[0]*wrapperViewPct[0][0])<0 && pos[0]+elD[0]-(wrapperView[0]*wrapperViewPct[0][1])>=0 && 
						pos[1]-(wrapperView[1]*wrapperViewPct[1][0])<0 && pos[1]+elD[1]-(wrapperView[1]*wrapperViewPct[1][1])>=0;
			},
			/* checks if element is overflowed having visible scrollbar(s) */
			mcsOverflow:$.expr[":"].mcsOverflow || function(el){
				var d=$(el).data(pluginPfx);
				if(!d){return;}
				return d.overflowed[0] || d.overflowed[1];
			}
		});
	
	});

}))}));
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJsaWJzL2pxdWVyeS5tQ3VzdG9tU2Nyb2xsYmFyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbj09IG1hbGlodSBqcXVlcnkgY3VzdG9tIHNjcm9sbGJhciBwbHVnaW4gPT0gXHJcblZlcnNpb246IDMuMS41IFxyXG5QbHVnaW4gVVJJOiBodHRwOi8vbWFub3MubWFsaWh1LmdyL2pxdWVyeS1jdXN0b20tY29udGVudC1zY3JvbGxlciBcclxuQXV0aG9yOiBtYWxpaHVcclxuQXV0aG9yIFVSSTogaHR0cDovL21hbm9zLm1hbGlodS5nclxyXG5MaWNlbnNlOiBNSVQgTGljZW5zZSAoTUlUKVxyXG4qL1xyXG5cclxuLypcclxuQ29weXJpZ2h0IE1hbm9zIE1hbGlodXRzYWtpcyAoZW1haWw6IG1hbm9zQG1hbGlodS5ncilcclxuXHJcblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxyXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXHJcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcclxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXHJcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XHJcblxyXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxyXG5hbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuXHJcblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLypcclxuVGhlIGNvZGUgYmVsb3cgaXMgZmFpcmx5IGxvbmcsIGZ1bGx5IGNvbW1lbnRlZCBhbmQgc2hvdWxkIGJlIG5vcm1hbGx5IHVzZWQgaW4gZGV2ZWxvcG1lbnQuIFxyXG5Gb3IgcHJvZHVjdGlvbiwgdXNlIGVpdGhlciB0aGUgbWluaWZpZWQganF1ZXJ5Lm1DdXN0b21TY3JvbGxiYXIubWluLmpzIHNjcmlwdCBvciBcclxudGhlIHByb2R1Y3Rpb24tcmVhZHkganF1ZXJ5Lm1DdXN0b21TY3JvbGxiYXIuY29uY2F0Lm1pbi5qcyB3aGljaCBjb250YWlucyB0aGUgcGx1Z2luIFxyXG5hbmQgZGVwZW5kZW5jaWVzIChtaW5pZmllZCkuIFxyXG4qL1xyXG5cclxuKGZ1bmN0aW9uKGZhY3Rvcnkpe1xyXG5cdGlmKHR5cGVvZiBkZWZpbmU9PT1cImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCl7XHJcblx0XHRkZWZpbmUoW1wianF1ZXJ5XCJdLGZhY3RvcnkpO1xyXG5cdH1lbHNlIGlmKHR5cGVvZiBtb2R1bGUhPT1cInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzKXtcclxuXHRcdG1vZHVsZS5leHBvcnRzPWZhY3Rvcnk7XHJcblx0fWVsc2V7XHJcblx0XHRmYWN0b3J5KGpRdWVyeSx3aW5kb3csZG9jdW1lbnQpO1xyXG5cdH1cclxufShmdW5jdGlvbigkKXtcclxuKGZ1bmN0aW9uKGluaXQpe1xyXG5cdHZhciBfcmpzPXR5cGVvZiBkZWZpbmU9PT1cImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCwgLyogUmVxdWlyZUpTICovXHJcblx0XHRfbmpzPXR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMsIC8qIE5vZGVKUyAqL1xyXG5cdFx0X2RscD0oXCJodHRwczpcIj09ZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2wpID8gXCJodHRwczpcIiA6IFwiaHR0cDpcIiwgLyogbG9jYXRpb24gcHJvdG9jb2wgKi9cclxuXHRcdF91cmw9XCJjZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvanF1ZXJ5LW1vdXNld2hlZWwvMy4xLjEzL2pxdWVyeS5tb3VzZXdoZWVsLm1pbi5qc1wiO1xyXG5cdGlmKCFfcmpzKXtcclxuXHRcdGlmKF9uanMpe1xyXG5cdFx0XHRyZXF1aXJlKFwianF1ZXJ5LW1vdXNld2hlZWxcIikoJCk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0LyogbG9hZCBqcXVlcnktbW91c2V3aGVlbCBwbHVnaW4gKHZpYSBDRE4pIGlmIGl0J3Mgbm90IHByZXNlbnQgb3Igbm90IGxvYWRlZCB2aWEgUmVxdWlyZUpTIFxyXG5cdFx0XHQod29ya3Mgd2hlbiBtQ3VzdG9tU2Nyb2xsYmFyIGZuIGlzIGNhbGxlZCBvbiB3aW5kb3cgbG9hZCkgKi9cclxuXHRcdFx0JC5ldmVudC5zcGVjaWFsLm1vdXNld2hlZWwgfHwgJChcImhlYWRcIikuYXBwZW5kKGRlY29kZVVSSShcIiUzQ3NjcmlwdCBzcmM9XCIrX2RscCtcIi8vXCIrX3VybCtcIiUzRSUzQy9zY3JpcHQlM0VcIikpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRpbml0KCk7XHJcbn0oZnVuY3Rpb24oKXtcclxuXHRcclxuXHQvKiBcclxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0UExVR0lOIE5BTUVTUEFDRSwgUFJFRklYLCBERUZBVUxUIFNFTEVDVE9SKFMpIFxyXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQqL1xyXG5cdFxyXG5cdHZhciBwbHVnaW5OUz1cIm1DdXN0b21TY3JvbGxiYXJcIixcclxuXHRcdHBsdWdpblBmeD1cIm1DU1wiLFxyXG5cdFx0ZGVmYXVsdFNlbGVjdG9yPVwiLm1DdXN0b21TY3JvbGxiYXJcIixcclxuXHRcclxuXHRcclxuXHRcdFxyXG5cdFxyXG5cdFxyXG5cdC8qIFxyXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRERUZBVUxUIE9QVElPTlMgXHJcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdCovXHJcblx0XHJcblx0XHRkZWZhdWx0cz17XHJcblx0XHRcdC8qXHJcblx0XHRcdHNldCBlbGVtZW50L2NvbnRlbnQgd2lkdGgvaGVpZ2h0IHByb2dyYW1tYXRpY2FsbHkgXHJcblx0XHRcdHZhbHVlczogYm9vbGVhbiwgcGl4ZWxzLCBwZXJjZW50YWdlIFxyXG5cdFx0XHRcdG9wdGlvblx0XHRcdFx0XHRcdGRlZmF1bHRcclxuXHRcdFx0XHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdFx0c2V0V2lkdGhcdFx0XHRcdFx0ZmFsc2VcclxuXHRcdFx0XHRzZXRIZWlnaHRcdFx0XHRcdFx0ZmFsc2VcclxuXHRcdFx0Ki9cclxuXHRcdFx0LypcclxuXHRcdFx0c2V0IHRoZSBpbml0aWFsIGNzcyB0b3AgcHJvcGVydHkgb2YgY29udGVudCAgXHJcblx0XHRcdHZhbHVlczogc3RyaW5nIChlLmcuIFwiLTEwMHB4XCIsIFwiMTAlXCIgZXRjLilcclxuXHRcdFx0Ki9cclxuXHRcdFx0c2V0VG9wOjAsXHJcblx0XHRcdC8qXHJcblx0XHRcdHNldCB0aGUgaW5pdGlhbCBjc3MgbGVmdCBwcm9wZXJ0eSBvZiBjb250ZW50ICBcclxuXHRcdFx0dmFsdWVzOiBzdHJpbmcgKGUuZy4gXCItMTAwcHhcIiwgXCIxMCVcIiBldGMuKVxyXG5cdFx0XHQqL1xyXG5cdFx0XHRzZXRMZWZ0OjAsXHJcblx0XHRcdC8qIFxyXG5cdFx0XHRzY3JvbGxiYXIgYXhpcyAodmVydGljYWwgYW5kL29yIGhvcml6b250YWwgc2Nyb2xsYmFycykgXHJcblx0XHRcdHZhbHVlcyAoc3RyaW5nKTogXCJ5XCIsIFwieFwiLCBcInl4XCJcclxuXHRcdFx0Ki9cclxuXHRcdFx0YXhpczpcInlcIixcclxuXHRcdFx0LypcclxuXHRcdFx0cG9zaXRpb24gb2Ygc2Nyb2xsYmFyIHJlbGF0aXZlIHRvIGNvbnRlbnQgIFxyXG5cdFx0XHR2YWx1ZXMgKHN0cmluZyk6IFwiaW5zaWRlXCIsIFwib3V0c2lkZVwiIChcIm91dHNpZGVcIiByZXF1aXJlcyBlbGVtZW50cyB3aXRoIHBvc2l0aW9uOnJlbGF0aXZlKVxyXG5cdFx0XHQqL1xyXG5cdFx0XHRzY3JvbGxiYXJQb3NpdGlvbjpcImluc2lkZVwiLFxyXG5cdFx0XHQvKlxyXG5cdFx0XHRzY3JvbGxpbmcgaW5lcnRpYVxyXG5cdFx0XHR2YWx1ZXM6IGludGVnZXIgKG1pbGxpc2Vjb25kcylcclxuXHRcdFx0Ki9cclxuXHRcdFx0c2Nyb2xsSW5lcnRpYTo5NTAsXHJcblx0XHRcdC8qIFxyXG5cdFx0XHRhdXRvLWFkanVzdCBzY3JvbGxiYXIgZHJhZ2dlciBsZW5ndGhcclxuXHRcdFx0dmFsdWVzOiBib29sZWFuXHJcblx0XHRcdCovXHJcblx0XHRcdGF1dG9EcmFnZ2VyTGVuZ3RoOnRydWUsXHJcblx0XHRcdC8qXHJcblx0XHRcdGF1dG8taGlkZSBzY3JvbGxiYXIgd2hlbiBpZGxlIFxyXG5cdFx0XHR2YWx1ZXM6IGJvb2xlYW5cclxuXHRcdFx0XHRvcHRpb25cdFx0XHRcdFx0XHRkZWZhdWx0XHJcblx0XHRcdFx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRcdGF1dG9IaWRlU2Nyb2xsYmFyXHRcdFx0ZmFsc2VcclxuXHRcdFx0Ki9cclxuXHRcdFx0LypcclxuXHRcdFx0YXV0by1leHBhbmRzIHNjcm9sbGJhciBvbiBtb3VzZS1vdmVyIGFuZCBkcmFnZ2luZ1xyXG5cdFx0XHR2YWx1ZXM6IGJvb2xlYW5cclxuXHRcdFx0XHRvcHRpb25cdFx0XHRcdFx0XHRkZWZhdWx0XHJcblx0XHRcdFx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRcdGF1dG9FeHBhbmRTY3JvbGxiYXJcdFx0XHRmYWxzZVxyXG5cdFx0XHQqL1xyXG5cdFx0XHQvKlxyXG5cdFx0XHRhbHdheXMgc2hvdyBzY3JvbGxiYXIsIGV2ZW4gd2hlbiB0aGVyZSdzIG5vdGhpbmcgdG8gc2Nyb2xsIFxyXG5cdFx0XHR2YWx1ZXM6IGludGVnZXIgKDA9ZGlzYWJsZSwgMT1hbHdheXMgc2hvdyBkcmFnZ2VyIHJhaWwgYW5kIGJ1dHRvbnMsIDI9YWx3YXlzIHNob3cgZHJhZ2dlciByYWlsLCBkcmFnZ2VyIGFuZCBidXR0b25zKSwgYm9vbGVhblxyXG5cdFx0XHQqL1xyXG5cdFx0XHRhbHdheXNTaG93U2Nyb2xsYmFyOjAsXHJcblx0XHRcdC8qXHJcblx0XHRcdHNjcm9sbGluZyBhbHdheXMgc25hcHMgdG8gYSBtdWx0aXBsZSBvZiB0aGlzIG51bWJlciBpbiBwaXhlbHNcclxuXHRcdFx0dmFsdWVzOiBpbnRlZ2VyLCBhcnJheSAoW3kseF0pXHJcblx0XHRcdFx0b3B0aW9uXHRcdFx0XHRcdFx0ZGVmYXVsdFxyXG5cdFx0XHRcdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0XHRzbmFwQW1vdW50XHRcdFx0XHRcdG51bGxcclxuXHRcdFx0Ki9cclxuXHRcdFx0LypcclxuXHRcdFx0d2hlbiBzbmFwcGluZywgc25hcCB3aXRoIHRoaXMgbnVtYmVyIGluIHBpeGVscyBhcyBhbiBvZmZzZXQgXHJcblx0XHRcdHZhbHVlczogaW50ZWdlclxyXG5cdFx0XHQqL1xyXG5cdFx0XHRzbmFwT2Zmc2V0OjAsXHJcblx0XHRcdC8qIFxyXG5cdFx0XHRtb3VzZS13aGVlbCBzY3JvbGxpbmdcclxuXHRcdFx0Ki9cclxuXHRcdFx0bW91c2VXaGVlbDp7XHJcblx0XHRcdFx0LyogXHJcblx0XHRcdFx0ZW5hYmxlIG1vdXNlLXdoZWVsIHNjcm9sbGluZ1xyXG5cdFx0XHRcdHZhbHVlczogYm9vbGVhblxyXG5cdFx0XHRcdCovXHJcblx0XHRcdFx0ZW5hYmxlOnRydWUsXHJcblx0XHRcdFx0LyogXHJcblx0XHRcdFx0c2Nyb2xsaW5nIGFtb3VudCBpbiBwaXhlbHNcclxuXHRcdFx0XHR2YWx1ZXM6IFwiYXV0b1wiLCBpbnRlZ2VyIFxyXG5cdFx0XHRcdCovXHJcblx0XHRcdFx0c2Nyb2xsQW1vdW50OlwiYXV0b1wiLFxyXG5cdFx0XHRcdC8qIFxyXG5cdFx0XHRcdG1vdXNlLXdoZWVsIHNjcm9sbGluZyBheGlzIFxyXG5cdFx0XHRcdHRoZSBkZWZhdWx0IHNjcm9sbGluZyBkaXJlY3Rpb24gd2hlbiBib3RoIHZlcnRpY2FsIGFuZCBob3Jpem9udGFsIHNjcm9sbGJhcnMgYXJlIHByZXNlbnQgXHJcblx0XHRcdFx0dmFsdWVzIChzdHJpbmcpOiBcInlcIiwgXCJ4XCIgXHJcblx0XHRcdFx0Ki9cclxuXHRcdFx0XHRheGlzOlwieVwiLFxyXG5cdFx0XHRcdC8qIFxyXG5cdFx0XHRcdHByZXZlbnQgdGhlIGRlZmF1bHQgYmVoYXZpb3VyIHdoaWNoIGF1dG9tYXRpY2FsbHkgc2Nyb2xscyB0aGUgcGFyZW50IGVsZW1lbnQocykgd2hlbiBlbmQgb2Ygc2Nyb2xsaW5nIGlzIHJlYWNoZWQgXHJcblx0XHRcdFx0dmFsdWVzOiBib29sZWFuXHJcblx0XHRcdFx0XHRvcHRpb25cdFx0XHRcdFx0XHRkZWZhdWx0XHJcblx0XHRcdFx0XHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdFx0XHRwcmV2ZW50RGVmYXVsdFx0XHRcdFx0bnVsbFxyXG5cdFx0XHRcdCovXHJcblx0XHRcdFx0LypcclxuXHRcdFx0XHR0aGUgcmVwb3J0ZWQgbW91c2Utd2hlZWwgZGVsdGEgdmFsdWUuIFRoZSBudW1iZXIgb2YgbGluZXMgKHRyYW5zbGF0ZWQgdG8gcGl4ZWxzKSBvbmUgd2hlZWwgbm90Y2ggc2Nyb2xscy4gIFxyXG5cdFx0XHRcdHZhbHVlczogXCJhdXRvXCIsIGludGVnZXIgXHJcblx0XHRcdFx0XCJhdXRvXCIgdXNlcyB0aGUgZGVmYXVsdCBPUy9icm93c2VyIHZhbHVlIFxyXG5cdFx0XHRcdCovXHJcblx0XHRcdFx0ZGVsdGFGYWN0b3I6XCJhdXRvXCIsXHJcblx0XHRcdFx0LypcclxuXHRcdFx0XHRub3JtYWxpemUgbW91c2Utd2hlZWwgZGVsdGEgdG8gLTEgb3IgMSAoZGlzYWJsZXMgbW91c2Utd2hlZWwgYWNjZWxlcmF0aW9uKSBcclxuXHRcdFx0XHR2YWx1ZXM6IGJvb2xlYW5cclxuXHRcdFx0XHRcdG9wdGlvblx0XHRcdFx0XHRcdGRlZmF1bHRcclxuXHRcdFx0XHRcdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0XHRcdG5vcm1hbGl6ZURlbHRhXHRcdFx0XHRudWxsXHJcblx0XHRcdFx0Ki9cclxuXHRcdFx0XHQvKlxyXG5cdFx0XHRcdGludmVydCBtb3VzZS13aGVlbCBzY3JvbGxpbmcgZGlyZWN0aW9uIFxyXG5cdFx0XHRcdHZhbHVlczogYm9vbGVhblxyXG5cdFx0XHRcdFx0b3B0aW9uXHRcdFx0XHRcdFx0ZGVmYXVsdFxyXG5cdFx0XHRcdFx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRcdFx0aW52ZXJ0XHRcdFx0XHRcdFx0bnVsbFxyXG5cdFx0XHRcdCovXHJcblx0XHRcdFx0LypcclxuXHRcdFx0XHR0aGUgdGFncyB0aGF0IGRpc2FibGUgbW91c2Utd2hlZWwgd2hlbiBjdXJzb3IgaXMgb3ZlciB0aGVtXHJcblx0XHRcdFx0Ki9cclxuXHRcdFx0XHRkaXNhYmxlT3ZlcjpbXCJzZWxlY3RcIixcIm9wdGlvblwiLFwia2V5Z2VuXCIsXCJkYXRhbGlzdFwiLFwidGV4dGFyZWFcIl1cclxuXHRcdFx0fSxcclxuXHRcdFx0LyogXHJcblx0XHRcdHNjcm9sbGJhciBidXR0b25zXHJcblx0XHRcdCovXHJcblx0XHRcdHNjcm9sbEJ1dHRvbnM6eyBcclxuXHRcdFx0XHQvKlxyXG5cdFx0XHRcdGVuYWJsZSBzY3JvbGxiYXIgYnV0dG9uc1xyXG5cdFx0XHRcdHZhbHVlczogYm9vbGVhblxyXG5cdFx0XHRcdFx0b3B0aW9uXHRcdFx0XHRcdFx0ZGVmYXVsdFxyXG5cdFx0XHRcdFx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRcdFx0ZW5hYmxlXHRcdFx0XHRcdFx0bnVsbFxyXG5cdFx0XHRcdCovXHJcblx0XHRcdFx0LypcclxuXHRcdFx0XHRzY3JvbGxiYXIgYnV0dG9ucyBzY3JvbGxpbmcgdHlwZSBcclxuXHRcdFx0XHR2YWx1ZXMgKHN0cmluZyk6IFwic3RlcGxlc3NcIiwgXCJzdGVwcGVkXCJcclxuXHRcdFx0XHQqL1xyXG5cdFx0XHRcdHNjcm9sbFR5cGU6XCJzdGVwbGVzc1wiLFxyXG5cdFx0XHRcdC8qXHJcblx0XHRcdFx0c2Nyb2xsaW5nIGFtb3VudCBpbiBwaXhlbHNcclxuXHRcdFx0XHR2YWx1ZXM6IFwiYXV0b1wiLCBpbnRlZ2VyIFxyXG5cdFx0XHRcdCovXHJcblx0XHRcdFx0c2Nyb2xsQW1vdW50OlwiYXV0b1wiXHJcblx0XHRcdFx0LypcclxuXHRcdFx0XHR0YWJpbmRleCBvZiB0aGUgc2Nyb2xsYmFyIGJ1dHRvbnNcclxuXHRcdFx0XHR2YWx1ZXM6IGZhbHNlLCBpbnRlZ2VyXHJcblx0XHRcdFx0XHRvcHRpb25cdFx0XHRcdFx0XHRkZWZhdWx0XHJcblx0XHRcdFx0XHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdFx0XHR0YWJpbmRleFx0XHRcdFx0XHRudWxsXHJcblx0XHRcdFx0Ki9cclxuXHRcdFx0fSxcclxuXHRcdFx0LyogXHJcblx0XHRcdGtleWJvYXJkIHNjcm9sbGluZ1xyXG5cdFx0XHQqL1xyXG5cdFx0XHRrZXlib2FyZDp7IFxyXG5cdFx0XHRcdC8qXHJcblx0XHRcdFx0ZW5hYmxlIHNjcm9sbGluZyB2aWEga2V5Ym9hcmRcclxuXHRcdFx0XHR2YWx1ZXM6IGJvb2xlYW5cclxuXHRcdFx0XHQqL1xyXG5cdFx0XHRcdGVuYWJsZTp0cnVlLFxyXG5cdFx0XHRcdC8qXHJcblx0XHRcdFx0a2V5Ym9hcmQgc2Nyb2xsaW5nIHR5cGUgXHJcblx0XHRcdFx0dmFsdWVzIChzdHJpbmcpOiBcInN0ZXBsZXNzXCIsIFwic3RlcHBlZFwiXHJcblx0XHRcdFx0Ki9cclxuXHRcdFx0XHRzY3JvbGxUeXBlOlwic3RlcGxlc3NcIixcclxuXHRcdFx0XHQvKlxyXG5cdFx0XHRcdHNjcm9sbGluZyBhbW91bnQgaW4gcGl4ZWxzXHJcblx0XHRcdFx0dmFsdWVzOiBcImF1dG9cIiwgaW50ZWdlciBcclxuXHRcdFx0XHQqL1xyXG5cdFx0XHRcdHNjcm9sbEFtb3VudDpcImF1dG9cIlxyXG5cdFx0XHR9LFxyXG5cdFx0XHQvKlxyXG5cdFx0XHRlbmFibGUgY29udGVudCB0b3VjaC1zd2lwZSBzY3JvbGxpbmcgXHJcblx0XHRcdHZhbHVlczogYm9vbGVhbiwgaW50ZWdlciwgc3RyaW5nIChudW1iZXIpXHJcblx0XHRcdGludGVnZXIgdmFsdWVzIGRlZmluZSB0aGUgYXhpcy1zcGVjaWZpYyBtaW5pbXVtIGFtb3VudCByZXF1aXJlZCBmb3Igc2Nyb2xsaW5nIG1vbWVudHVtXHJcblx0XHRcdCovXHJcblx0XHRcdGNvbnRlbnRUb3VjaFNjcm9sbDoyNSxcclxuXHRcdFx0LypcclxuXHRcdFx0ZW5hYmxlL2Rpc2FibGUgZG9jdW1lbnQgKGRlZmF1bHQpIHRvdWNoLXN3aXBlIHNjcm9sbGluZyBcclxuXHRcdFx0Ki9cclxuXHRcdFx0ZG9jdW1lbnRUb3VjaFNjcm9sbDp0cnVlLFxyXG5cdFx0XHQvKlxyXG5cdFx0XHRhZHZhbmNlZCBvcHRpb24gcGFyYW1ldGVyc1xyXG5cdFx0XHQqL1xyXG5cdFx0XHRhZHZhbmNlZDp7XHJcblx0XHRcdFx0LypcclxuXHRcdFx0XHRhdXRvLWV4cGFuZCBjb250ZW50IGhvcml6b250YWxseSAoZm9yIFwieFwiIG9yIFwieXhcIiBheGlzKSBcclxuXHRcdFx0XHR2YWx1ZXM6IGJvb2xlYW4sIGludGVnZXIgKHRoZSB2YWx1ZSAyIGZvcmNlcyB0aGUgbm9uIHNjcm9sbEhlaWdodC9zY3JvbGxXaWR0aCBtZXRob2QsIHRoZSB2YWx1ZSAzIGZvcmNlcyB0aGUgc2Nyb2xsSGVpZ2h0L3Njcm9sbFdpZHRoIG1ldGhvZClcclxuXHRcdFx0XHRcdG9wdGlvblx0XHRcdFx0XHRcdGRlZmF1bHRcclxuXHRcdFx0XHRcdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0XHRcdGF1dG9FeHBhbmRIb3Jpem9udGFsU2Nyb2xsXHRudWxsXHJcblx0XHRcdFx0Ki9cclxuXHRcdFx0XHQvKlxyXG5cdFx0XHRcdGF1dG8tc2Nyb2xsIHRvIGVsZW1lbnRzIHdpdGggZm9jdXNcclxuXHRcdFx0XHQqL1xyXG5cdFx0XHRcdGF1dG9TY3JvbGxPbkZvY3VzOlwiaW5wdXQsdGV4dGFyZWEsc2VsZWN0LGJ1dHRvbixkYXRhbGlzdCxrZXlnZW4sYVt0YWJpbmRleF0sYXJlYSxvYmplY3QsW2NvbnRlbnRlZGl0YWJsZT0ndHJ1ZSddXCIsXHJcblx0XHRcdFx0LypcclxuXHRcdFx0XHRhdXRvLXVwZGF0ZSBzY3JvbGxiYXJzIG9uIGNvbnRlbnQsIGVsZW1lbnQgb3Igdmlld3BvcnQgcmVzaXplIFxyXG5cdFx0XHRcdHNob3VsZCBiZSB0cnVlIGZvciBmbHVpZCBsYXlvdXRzL2VsZW1lbnRzLCBhZGRpbmcvcmVtb3ZpbmcgY29udGVudCBkeW5hbWljYWxseSwgaGlkaW5nL3Nob3dpbmcgZWxlbWVudHMsIGNvbnRlbnQgd2l0aCBpbWFnZXMgZXRjLiBcclxuXHRcdFx0XHR2YWx1ZXM6IGJvb2xlYW5cclxuXHRcdFx0XHQqL1xyXG5cdFx0XHRcdHVwZGF0ZU9uQ29udGVudFJlc2l6ZTp0cnVlLFxyXG5cdFx0XHRcdC8qXHJcblx0XHRcdFx0YXV0by11cGRhdGUgc2Nyb2xsYmFycyBlYWNoIHRpbWUgZWFjaCBpbWFnZSBpbnNpZGUgdGhlIGVsZW1lbnQgaXMgZnVsbHkgbG9hZGVkIFxyXG5cdFx0XHRcdHZhbHVlczogXCJhdXRvXCIsIGJvb2xlYW5cclxuXHRcdFx0XHQqL1xyXG5cdFx0XHRcdHVwZGF0ZU9uSW1hZ2VMb2FkOlwiYXV0b1wiLFxyXG5cdFx0XHRcdC8qXHJcblx0XHRcdFx0YXV0by11cGRhdGUgc2Nyb2xsYmFycyBiYXNlZCBvbiB0aGUgYW1vdW50IGFuZCBzaXplIGNoYW5nZXMgb2Ygc3BlY2lmaWMgc2VsZWN0b3JzIFxyXG5cdFx0XHRcdHVzZWZ1bCB3aGVuIHlvdSBuZWVkIHRvIHVwZGF0ZSB0aGUgc2Nyb2xsYmFyKHMpIGF1dG9tYXRpY2FsbHksIGVhY2ggdGltZSBhIHR5cGUgb2YgZWxlbWVudCBpcyBhZGRlZCwgcmVtb3ZlZCBvciBjaGFuZ2VzIGl0cyBzaXplIFxyXG5cdFx0XHRcdHZhbHVlczogYm9vbGVhbiwgc3RyaW5nIChlLmcuIFwidWwgbGlcIiB3aWxsIGF1dG8tdXBkYXRlIHNjcm9sbGJhcnMgZWFjaCB0aW1lIGxpc3QtaXRlbXMgaW5zaWRlIHRoZSBlbGVtZW50IGFyZSBjaGFuZ2VkKSBcclxuXHRcdFx0XHRhIHZhbHVlIG9mIHRydWUgKGJvb2xlYW4pIHdpbGwgYXV0by11cGRhdGUgc2Nyb2xsYmFycyBlYWNoIHRpbWUgYW55IGVsZW1lbnQgaXMgY2hhbmdlZFxyXG5cdFx0XHRcdFx0b3B0aW9uXHRcdFx0XHRcdFx0ZGVmYXVsdFxyXG5cdFx0XHRcdFx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRcdFx0dXBkYXRlT25TZWxlY3RvckNoYW5nZVx0XHRudWxsXHJcblx0XHRcdFx0Ki9cclxuXHRcdFx0XHQvKlxyXG5cdFx0XHRcdGV4dHJhIHNlbGVjdG9ycyB0aGF0J2xsIGFsbG93IHNjcm9sbGJhciBkcmFnZ2luZyB1cG9uIG1vdXNlbW92ZS91cCwgcG9pbnRlcm1vdmUvdXAsIHRvdWNoZW5kIGV0Yy4gKGUuZy4gXCJzZWxlY3Rvci0xLCBzZWxlY3Rvci0yXCIpXHJcblx0XHRcdFx0XHRvcHRpb25cdFx0XHRcdFx0XHRkZWZhdWx0XHJcblx0XHRcdFx0XHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdFx0XHRleHRyYURyYWdnYWJsZVNlbGVjdG9yc1x0XHRudWxsXHJcblx0XHRcdFx0Ki9cclxuXHRcdFx0XHQvKlxyXG5cdFx0XHRcdGV4dHJhIHNlbGVjdG9ycyB0aGF0J2xsIHJlbGVhc2Ugc2Nyb2xsYmFyIGRyYWdnaW5nIHVwb24gbW91c2V1cCwgcG9pbnRlcnVwLCB0b3VjaGVuZCBldGMuIChlLmcuIFwic2VsZWN0b3ItMSwgc2VsZWN0b3ItMlwiKVxyXG5cdFx0XHRcdFx0b3B0aW9uXHRcdFx0XHRcdFx0ZGVmYXVsdFxyXG5cdFx0XHRcdFx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRcdFx0cmVsZWFzZURyYWdnYWJsZVNlbGVjdG9yc1x0bnVsbFxyXG5cdFx0XHRcdCovXHJcblx0XHRcdFx0LypcclxuXHRcdFx0XHRhdXRvLXVwZGF0ZSB0aW1lb3V0IFxyXG5cdFx0XHRcdHZhbHVlczogaW50ZWdlciAobWlsbGlzZWNvbmRzKVxyXG5cdFx0XHRcdCovXHJcblx0XHRcdFx0YXV0b1VwZGF0ZVRpbWVvdXQ6NjBcclxuXHRcdFx0fSxcclxuXHRcdFx0LyogXHJcblx0XHRcdHNjcm9sbGJhciB0aGVtZSBcclxuXHRcdFx0dmFsdWVzOiBzdHJpbmcgKHNlZSBDU1MvcGx1Z2luIFVSSSBmb3IgYSBsaXN0IG9mIHJlYWR5LXRvLXVzZSB0aGVtZXMpXHJcblx0XHRcdCovXHJcblx0XHRcdHRoZW1lOlwibGlnaHRcIixcclxuXHRcdFx0LypcclxuXHRcdFx0dXNlciBkZWZpbmVkIGNhbGxiYWNrIGZ1bmN0aW9uc1xyXG5cdFx0XHQqL1xyXG5cdFx0XHRjYWxsYmFja3M6e1xyXG5cdFx0XHRcdC8qXHJcblx0XHRcdFx0QXZhaWxhYmxlIGNhbGxiYWNrczogXHJcblx0XHRcdFx0XHRjYWxsYmFja1x0XHRcdFx0XHRkZWZhdWx0XHJcblx0XHRcdFx0XHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdFx0XHRvbkNyZWF0ZVx0XHRcdFx0XHRudWxsXHJcblx0XHRcdFx0XHRvbkluaXRcdFx0XHRcdFx0XHRudWxsXHJcblx0XHRcdFx0XHRvblNjcm9sbFN0YXJ0XHRcdFx0XHRudWxsXHJcblx0XHRcdFx0XHRvblNjcm9sbFx0XHRcdFx0XHRudWxsXHJcblx0XHRcdFx0XHRvblRvdGFsU2Nyb2xsXHRcdFx0XHRudWxsXHJcblx0XHRcdFx0XHRvblRvdGFsU2Nyb2xsQmFja1x0XHRcdG51bGxcclxuXHRcdFx0XHRcdHdoaWxlU2Nyb2xsaW5nXHRcdFx0XHRudWxsXHJcblx0XHRcdFx0XHRvbk92ZXJmbG93WVx0XHRcdFx0XHRudWxsXHJcblx0XHRcdFx0XHRvbk92ZXJmbG93WFx0XHRcdFx0XHRudWxsXHJcblx0XHRcdFx0XHRvbk92ZXJmbG93WU5vbmVcdFx0XHRcdG51bGxcclxuXHRcdFx0XHRcdG9uT3ZlcmZsb3dYTm9uZVx0XHRcdFx0bnVsbFxyXG5cdFx0XHRcdFx0b25JbWFnZUxvYWRcdFx0XHRcdFx0bnVsbFxyXG5cdFx0XHRcdFx0b25TZWxlY3RvckNoYW5nZVx0XHRcdG51bGxcclxuXHRcdFx0XHRcdG9uQmVmb3JlVXBkYXRlXHRcdFx0XHRudWxsXHJcblx0XHRcdFx0XHRvblVwZGF0ZVx0XHRcdFx0XHRudWxsXHJcblx0XHRcdFx0Ki9cclxuXHRcdFx0XHRvblRvdGFsU2Nyb2xsT2Zmc2V0OjAsXHJcblx0XHRcdFx0b25Ub3RhbFNjcm9sbEJhY2tPZmZzZXQ6MCxcclxuXHRcdFx0XHRhbHdheXNUcmlnZ2VyT2Zmc2V0czp0cnVlXHJcblx0XHRcdH1cclxuXHRcdFx0LypcclxuXHRcdFx0YWRkIHNjcm9sbGJhcihzKSBvbiBhbGwgZWxlbWVudHMgbWF0Y2hpbmcgdGhlIGN1cnJlbnQgc2VsZWN0b3IsIG5vdyBhbmQgaW4gdGhlIGZ1dHVyZSBcclxuXHRcdFx0dmFsdWVzOiBib29sZWFuLCBzdHJpbmcgXHJcblx0XHRcdHN0cmluZyB2YWx1ZXM6IFwib25cIiAoZW5hYmxlKSwgXCJvbmNlXCIgKGRpc2FibGUgYWZ0ZXIgZmlyc3QgaW52b2NhdGlvbiksIFwib2ZmXCIgKGRpc2FibGUpXHJcblx0XHRcdGxpdmVTZWxlY3RvciB2YWx1ZXM6IHN0cmluZyAoc2VsZWN0b3IpXHJcblx0XHRcdFx0b3B0aW9uXHRcdFx0XHRcdFx0ZGVmYXVsdFxyXG5cdFx0XHRcdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0XHRsaXZlXHRcdFx0XHRcdFx0ZmFsc2VcclxuXHRcdFx0XHRsaXZlU2VsZWN0b3JcdFx0XHRcdG51bGxcclxuXHRcdFx0Ki9cclxuXHRcdH0sXHJcblx0XHJcblx0XHJcblx0XHJcblx0XHJcblx0XHJcblx0LyogXHJcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFZBUlMsIENPTlNUQU5UUyBcclxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0Ki9cclxuXHRcclxuXHRcdHRvdGFsSW5zdGFuY2VzPTAsIC8qIHBsdWdpbiBpbnN0YW5jZXMgYW1vdW50ICovXHJcblx0XHRsaXZlVGltZXJzPXt9LCAvKiBsaXZlIG9wdGlvbiB0aW1lcnMgKi9cclxuXHRcdG9sZElFPSh3aW5kb3cuYXR0YWNoRXZlbnQgJiYgIXdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSA/IDEgOiAwLCAvKiBkZXRlY3QgSUUgPCA5ICovXHJcblx0XHR0b3VjaEFjdGl2ZT1mYWxzZSx0b3VjaGFibGUsIC8qIGdsb2JhbCB0b3VjaCB2YXJzIChmb3IgdG91Y2ggYW5kIHBvaW50ZXIgZXZlbnRzKSAqL1xyXG5cdFx0LyogZ2VuZXJhbCBwbHVnaW4gY2xhc3NlcyAqL1xyXG5cdFx0Y2xhc3Nlcz1bXHJcblx0XHRcdFwibUNTQl9kcmFnZ2VyX29uRHJhZ1wiLFwibUNTQl9zY3JvbGxUb29sc19vbkRyYWdcIixcIm1DU19pbWdfbG9hZGVkXCIsXCJtQ1NfZGlzYWJsZWRcIixcIm1DU19kZXN0cm95ZWRcIixcIm1DU19ub19zY3JvbGxiYXJcIixcclxuXHRcdFx0XCJtQ1MtYXV0b0hpZGVcIixcIm1DUy1kaXItcnRsXCIsXCJtQ1Nfbm9fc2Nyb2xsYmFyX3lcIixcIm1DU19ub19zY3JvbGxiYXJfeFwiLFwibUNTX3lfaGlkZGVuXCIsXCJtQ1NfeF9oaWRkZW5cIixcIm1DU0JfZHJhZ2dlckNvbnRhaW5lclwiLFxyXG5cdFx0XHRcIm1DU0JfYnV0dG9uVXBcIixcIm1DU0JfYnV0dG9uRG93blwiLFwibUNTQl9idXR0b25MZWZ0XCIsXCJtQ1NCX2J1dHRvblJpZ2h0XCJcclxuXHRcdF0sXHJcblx0XHRcclxuXHRcclxuXHRcclxuXHRcclxuXHRcclxuXHQvKiBcclxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0TUVUSE9EUyBcclxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0Ki9cclxuXHRcclxuXHRcdG1ldGhvZHM9e1xyXG5cdFx0XHRcclxuXHRcdFx0LyogXHJcblx0XHRcdHBsdWdpbiBpbml0aWFsaXphdGlvbiBtZXRob2QgXHJcblx0XHRcdGNyZWF0ZXMgdGhlIHNjcm9sbGJhcihzKSwgcGx1Z2luIGRhdGEgb2JqZWN0IGFuZCBvcHRpb25zXHJcblx0XHRcdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0Ki9cclxuXHRcdFx0XHJcblx0XHRcdGluaXQ6ZnVuY3Rpb24ob3B0aW9ucyl7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dmFyIG9wdGlvbnM9JC5leHRlbmQodHJ1ZSx7fSxkZWZhdWx0cyxvcHRpb25zKSxcclxuXHRcdFx0XHRcdHNlbGVjdG9yPV9zZWxlY3Rvci5jYWxsKHRoaXMpOyAvKiB2YWxpZGF0ZSBzZWxlY3RvciAqL1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8qIFxyXG5cdFx0XHRcdGlmIGxpdmUgb3B0aW9uIGlzIGVuYWJsZWQsIG1vbml0b3IgZm9yIGVsZW1lbnRzIG1hdGNoaW5nIHRoZSBjdXJyZW50IHNlbGVjdG9yIGFuZCBcclxuXHRcdFx0XHRhcHBseSBzY3JvbGxiYXIocykgd2hlbiBmb3VuZCAobm93IGFuZCBpbiB0aGUgZnV0dXJlKSBcclxuXHRcdFx0XHQqL1xyXG5cdFx0XHRcdGlmKG9wdGlvbnMubGl2ZSl7XHJcblx0XHRcdFx0XHR2YXIgbGl2ZVNlbGVjdG9yPW9wdGlvbnMubGl2ZVNlbGVjdG9yIHx8IHRoaXMuc2VsZWN0b3IgfHwgZGVmYXVsdFNlbGVjdG9yLCAvKiBsaXZlIHNlbGVjdG9yKHMpICovXHJcblx0XHRcdFx0XHRcdCRsaXZlU2VsZWN0b3I9JChsaXZlU2VsZWN0b3IpOyAvKiBsaXZlIHNlbGVjdG9yKHMpIGFzIGpxdWVyeSBvYmplY3QgKi9cclxuXHRcdFx0XHRcdGlmKG9wdGlvbnMubGl2ZT09PVwib2ZmXCIpe1xyXG5cdFx0XHRcdFx0XHQvKiBcclxuXHRcdFx0XHRcdFx0ZGlzYWJsZSBsaXZlIGlmIHJlcXVlc3RlZCBcclxuXHRcdFx0XHRcdFx0dXNhZ2U6ICQoc2VsZWN0b3IpLm1DdXN0b21TY3JvbGxiYXIoe2xpdmU6XCJvZmZcIn0pOyBcclxuXHRcdFx0XHRcdFx0Ki9cclxuXHRcdFx0XHRcdFx0cmVtb3ZlTGl2ZVRpbWVycyhsaXZlU2VsZWN0b3IpO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRsaXZlVGltZXJzW2xpdmVTZWxlY3Rvcl09c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHQvKiBjYWxsIG1DdXN0b21TY3JvbGxiYXIgZm4gb24gbGl2ZSBzZWxlY3RvcihzKSBldmVyeSBoYWxmLXNlY29uZCAqL1xyXG5cdFx0XHRcdFx0XHQkbGl2ZVNlbGVjdG9yLm1DdXN0b21TY3JvbGxiYXIob3B0aW9ucyk7XHJcblx0XHRcdFx0XHRcdGlmKG9wdGlvbnMubGl2ZT09PVwib25jZVwiICYmICRsaXZlU2VsZWN0b3IubGVuZ3RoKXtcclxuXHRcdFx0XHRcdFx0XHQvKiBkaXNhYmxlIGxpdmUgYWZ0ZXIgZmlyc3QgaW52b2NhdGlvbiAqL1xyXG5cdFx0XHRcdFx0XHRcdHJlbW92ZUxpdmVUaW1lcnMobGl2ZVNlbGVjdG9yKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSw1MDApO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0cmVtb3ZlTGl2ZVRpbWVycyhsaXZlU2VsZWN0b3IpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvKiBvcHRpb25zIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgKGZvciB2ZXJzaW9ucyA8IDMuMC4wKSBhbmQgbm9ybWFsaXphdGlvbiAqL1xyXG5cdFx0XHRcdG9wdGlvbnMuc2V0V2lkdGg9KG9wdGlvbnMuc2V0X3dpZHRoKSA/IG9wdGlvbnMuc2V0X3dpZHRoIDogb3B0aW9ucy5zZXRXaWR0aDtcclxuXHRcdFx0XHRvcHRpb25zLnNldEhlaWdodD0ob3B0aW9ucy5zZXRfaGVpZ2h0KSA/IG9wdGlvbnMuc2V0X2hlaWdodCA6IG9wdGlvbnMuc2V0SGVpZ2h0O1xyXG5cdFx0XHRcdG9wdGlvbnMuYXhpcz0ob3B0aW9ucy5ob3Jpem9udGFsU2Nyb2xsKSA/IFwieFwiIDogX2ZpbmRBeGlzKG9wdGlvbnMuYXhpcyk7XHJcblx0XHRcdFx0b3B0aW9ucy5zY3JvbGxJbmVydGlhPW9wdGlvbnMuc2Nyb2xsSW5lcnRpYT4wICYmIG9wdGlvbnMuc2Nyb2xsSW5lcnRpYTwxNyA/IDE3IDogb3B0aW9ucy5zY3JvbGxJbmVydGlhO1xyXG5cdFx0XHRcdGlmKHR5cGVvZiBvcHRpb25zLm1vdXNlV2hlZWwhPT1cIm9iamVjdFwiICYmICBvcHRpb25zLm1vdXNlV2hlZWw9PXRydWUpeyAvKiBvbGQgc2Nob29sIG1vdXNlV2hlZWwgb3B0aW9uIChub24tb2JqZWN0KSAqL1xyXG5cdFx0XHRcdFx0b3B0aW9ucy5tb3VzZVdoZWVsPXtlbmFibGU6dHJ1ZSxzY3JvbGxBbW91bnQ6XCJhdXRvXCIsYXhpczpcInlcIixwcmV2ZW50RGVmYXVsdDpmYWxzZSxkZWx0YUZhY3RvcjpcImF1dG9cIixub3JtYWxpemVEZWx0YTpmYWxzZSxpbnZlcnQ6ZmFsc2V9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG9wdGlvbnMubW91c2VXaGVlbC5zY3JvbGxBbW91bnQ9IW9wdGlvbnMubW91c2VXaGVlbFBpeGVscyA/IG9wdGlvbnMubW91c2VXaGVlbC5zY3JvbGxBbW91bnQgOiBvcHRpb25zLm1vdXNlV2hlZWxQaXhlbHM7XHJcblx0XHRcdFx0b3B0aW9ucy5tb3VzZVdoZWVsLm5vcm1hbGl6ZURlbHRhPSFvcHRpb25zLmFkdmFuY2VkLm5vcm1hbGl6ZU1vdXNlV2hlZWxEZWx0YSA/IG9wdGlvbnMubW91c2VXaGVlbC5ub3JtYWxpemVEZWx0YSA6IG9wdGlvbnMuYWR2YW5jZWQubm9ybWFsaXplTW91c2VXaGVlbERlbHRhO1xyXG5cdFx0XHRcdG9wdGlvbnMuc2Nyb2xsQnV0dG9ucy5zY3JvbGxUeXBlPV9maW5kU2Nyb2xsQnV0dG9uc1R5cGUob3B0aW9ucy5zY3JvbGxCdXR0b25zLnNjcm9sbFR5cGUpOyBcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRfdGhlbWUob3B0aW9ucyk7IC8qIHRoZW1lLXNwZWNpZmljIG9wdGlvbnMgKi9cclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvKiBwbHVnaW4gY29uc3RydWN0b3IgKi9cclxuXHRcdFx0XHRyZXR1cm4gJChzZWxlY3RvcikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHR2YXIgJHRoaXM9JCh0aGlzKTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0aWYoISR0aGlzLmRhdGEocGx1Z2luUGZ4KSl7IC8qIHByZXZlbnQgbXVsdGlwbGUgaW5zdGFudGlhdGlvbnMgKi9cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHQvKiBzdG9yZSBvcHRpb25zIGFuZCBjcmVhdGUgb2JqZWN0cyBpbiBqcXVlcnkgZGF0YSAqL1xyXG5cdFx0XHRcdFx0XHQkdGhpcy5kYXRhKHBsdWdpblBmeCx7XHJcblx0XHRcdFx0XHRcdFx0aWR4OisrdG90YWxJbnN0YW5jZXMsIC8qIGluc3RhbmNlIGluZGV4ICovXHJcblx0XHRcdFx0XHRcdFx0b3B0Om9wdGlvbnMsIC8qIG9wdGlvbnMgKi9cclxuXHRcdFx0XHRcdFx0XHRzY3JvbGxSYXRpbzp7eTpudWxsLHg6bnVsbH0sIC8qIHNjcm9sbGJhciB0byBjb250ZW50IHJhdGlvICovXHJcblx0XHRcdFx0XHRcdFx0b3ZlcmZsb3dlZDpudWxsLCAvKiBvdmVyZmxvd2VkIGF4aXMgKi9cclxuXHRcdFx0XHRcdFx0XHRjb250ZW50UmVzZXQ6e3k6bnVsbCx4Om51bGx9LCAvKiBvYmplY3QgdG8gY2hlY2sgd2hlbiBjb250ZW50IHJlc2V0cyAqL1xyXG5cdFx0XHRcdFx0XHRcdGJpbmRFdmVudHM6ZmFsc2UsIC8qIG9iamVjdCB0byBjaGVjayBpZiBldmVudHMgYXJlIGJvdW5kICovXHJcblx0XHRcdFx0XHRcdFx0dHdlZW5SdW5uaW5nOmZhbHNlLCAvKiBvYmplY3QgdG8gY2hlY2sgaWYgdHdlZW4gaXMgcnVubmluZyAqL1xyXG5cdFx0XHRcdFx0XHRcdHNlcXVlbnRpYWw6e30sIC8qIHNlcXVlbnRpYWwgc2Nyb2xsaW5nIG9iamVjdCAqL1xyXG5cdFx0XHRcdFx0XHRcdGxhbmdEaXI6JHRoaXMuY3NzKFwiZGlyZWN0aW9uXCIpLCAvKiBkZXRlY3Qvc3RvcmUgZGlyZWN0aW9uIChsdHIgb3IgcnRsKSAqL1xyXG5cdFx0XHRcdFx0XHRcdGNiT2Zmc2V0czpudWxsLCAvKiBvYmplY3QgdG8gY2hlY2sgd2hldGhlciBjYWxsYmFjayBvZmZzZXRzIGFsd2F5cyB0cmlnZ2VyICovXHJcblx0XHRcdFx0XHRcdFx0LyogXHJcblx0XHRcdFx0XHRcdFx0b2JqZWN0IHRvIGNoZWNrIGhvdyBzY3JvbGxpbmcgZXZlbnRzIHdoZXJlIGxhc3QgdHJpZ2dlcmVkIFxyXG5cdFx0XHRcdFx0XHRcdFwiaW50ZXJuYWxcIiAoZGVmYXVsdCAtIHRyaWdnZXJlZCBieSB0aGlzIHNjcmlwdCksIFwiZXh0ZXJuYWxcIiAodHJpZ2dlcmVkIGJ5IG90aGVyIHNjcmlwdHMsIGUuZy4gdmlhIHNjcm9sbFRvIG1ldGhvZCkgXHJcblx0XHRcdFx0XHRcdFx0dXNhZ2U6IG9iamVjdC5kYXRhKFwibUNTXCIpLnRyaWdnZXJcclxuXHRcdFx0XHRcdFx0XHQqL1xyXG5cdFx0XHRcdFx0XHRcdHRyaWdnZXI6bnVsbCxcclxuXHRcdFx0XHRcdFx0XHQvKiBcclxuXHRcdFx0XHRcdFx0XHRvYmplY3QgdG8gY2hlY2sgZm9yIGNoYW5nZXMgaW4gZWxlbWVudHMgaW4gb3JkZXIgdG8gY2FsbCB0aGUgdXBkYXRlIG1ldGhvZCBhdXRvbWF0aWNhbGx5IFxyXG5cdFx0XHRcdFx0XHRcdCovXHJcblx0XHRcdFx0XHRcdFx0cG9sbDp7c2l6ZTp7bzowLG46MH0saW1nOntvOjAsbjowfSxjaGFuZ2U6e286MCxuOjB9fVxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdHZhciBkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KSxvPWQub3B0LFxyXG5cdFx0XHRcdFx0XHRcdC8qIEhUTUwgZGF0YSBhdHRyaWJ1dGVzICovXHJcblx0XHRcdFx0XHRcdFx0aHRtbERhdGFBeGlzPSR0aGlzLmRhdGEoXCJtY3MtYXhpc1wiKSxodG1sRGF0YVNiUG9zPSR0aGlzLmRhdGEoXCJtY3Mtc2Nyb2xsYmFyLXBvc2l0aW9uXCIpLGh0bWxEYXRhVGhlbWU9JHRoaXMuZGF0YShcIm1jcy10aGVtZVwiKTtcclxuXHRcdFx0XHRcdFx0IFxyXG5cdFx0XHRcdFx0XHRpZihodG1sRGF0YUF4aXMpe28uYXhpcz1odG1sRGF0YUF4aXM7fSAvKiB1c2FnZSBleGFtcGxlOiBkYXRhLW1jcy1heGlzPVwieVwiICovXHJcblx0XHRcdFx0XHRcdGlmKGh0bWxEYXRhU2JQb3Mpe28uc2Nyb2xsYmFyUG9zaXRpb249aHRtbERhdGFTYlBvczt9IC8qIHVzYWdlIGV4YW1wbGU6IGRhdGEtbWNzLXNjcm9sbGJhci1wb3NpdGlvbj1cIm91dHNpZGVcIiAqL1xyXG5cdFx0XHRcdFx0XHRpZihodG1sRGF0YVRoZW1lKXsgLyogdXNhZ2UgZXhhbXBsZTogZGF0YS1tY3MtdGhlbWU9XCJtaW5pbWFsXCIgKi9cclxuXHRcdFx0XHRcdFx0XHRvLnRoZW1lPWh0bWxEYXRhVGhlbWU7XHJcblx0XHRcdFx0XHRcdFx0X3RoZW1lKG8pOyAvKiB0aGVtZS1zcGVjaWZpYyBvcHRpb25zICovXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdF9wbHVnaW5NYXJrdXAuY2FsbCh0aGlzKTsgLyogYWRkIHBsdWdpbiBtYXJrdXAgKi9cclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdGlmKGQgJiYgby5jYWxsYmFja3Mub25DcmVhdGUgJiYgdHlwZW9mIG8uY2FsbGJhY2tzLm9uQ3JlYXRlPT09XCJmdW5jdGlvblwiKXtvLmNhbGxiYWNrcy5vbkNyZWF0ZS5jYWxsKHRoaXMpO30gLyogY2FsbGJhY2tzOiBvbkNyZWF0ZSAqL1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lciBpbWc6bm90KC5cIitjbGFzc2VzWzJdK1wiKVwiKS5hZGRDbGFzcyhjbGFzc2VzWzJdKTsgLyogZmxhZyBsb2FkZWQgaW1hZ2VzICovXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRtZXRob2RzLnVwZGF0ZS5jYWxsKG51bGwsJHRoaXMpOyAvKiBjYWxsIHRoZSB1cGRhdGUgbWV0aG9kICovXHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR9LFxyXG5cdFx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblx0XHRcdFxyXG5cdFx0XHRcclxuXHRcdFx0XHJcblx0XHRcdC8qIFxyXG5cdFx0XHRwbHVnaW4gdXBkYXRlIG1ldGhvZCBcclxuXHRcdFx0dXBkYXRlcyBjb250ZW50IGFuZCBzY3JvbGxiYXIocykgdmFsdWVzLCBldmVudHMgYW5kIHN0YXR1cyBcclxuXHRcdFx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHR1c2FnZTogJChzZWxlY3RvcikubUN1c3RvbVNjcm9sbGJhcihcInVwZGF0ZVwiKTtcclxuXHRcdFx0Ki9cclxuXHRcdFx0XHJcblx0XHRcdHVwZGF0ZTpmdW5jdGlvbihlbCxjYil7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dmFyIHNlbGVjdG9yPWVsIHx8IF9zZWxlY3Rvci5jYWxsKHRoaXMpOyAvKiB2YWxpZGF0ZSBzZWxlY3RvciAqL1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHJldHVybiAkKHNlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdHZhciAkdGhpcz0kKHRoaXMpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRpZigkdGhpcy5kYXRhKHBsdWdpblBmeCkpeyAvKiBjaGVjayBpZiBwbHVnaW4gaGFzIGluaXRpYWxpemVkICovXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHR2YXIgZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksbz1kLm9wdCxcclxuXHRcdFx0XHRcdFx0XHRtQ1NCX2NvbnRhaW5lcj0kKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpLFxyXG5cdFx0XHRcdFx0XHRcdG1DdXN0b21TY3JvbGxCb3g9JChcIiNtQ1NCX1wiK2QuaWR4KSxcclxuXHRcdFx0XHRcdFx0XHRtQ1NCX2RyYWdnZXI9WyQoXCIjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX3ZlcnRpY2FsXCIpLCQoXCIjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX2hvcml6b250YWxcIildO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0aWYoIW1DU0JfY29udGFpbmVyLmxlbmd0aCl7cmV0dXJuO31cclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdGlmKGQudHdlZW5SdW5uaW5nKXtfc3RvcCgkdGhpcyk7fSAvKiBzdG9wIGFueSBydW5uaW5nIHR3ZWVucyB3aGlsZSB1cGRhdGluZyAqL1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0aWYoY2IgJiYgZCAmJiBvLmNhbGxiYWNrcy5vbkJlZm9yZVVwZGF0ZSAmJiB0eXBlb2Ygby5jYWxsYmFja3Mub25CZWZvcmVVcGRhdGU9PT1cImZ1bmN0aW9uXCIpe28uY2FsbGJhY2tzLm9uQmVmb3JlVXBkYXRlLmNhbGwodGhpcyk7fSAvKiBjYWxsYmFja3M6IG9uQmVmb3JlVXBkYXRlICovXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHQvKiBpZiBlbGVtZW50IHdhcyBkaXNhYmxlZCBvciBkZXN0cm95ZWQsIHJlbW92ZSBjbGFzcyhlcykgKi9cclxuXHRcdFx0XHRcdFx0aWYoJHRoaXMuaGFzQ2xhc3MoY2xhc3Nlc1szXSkpeyR0aGlzLnJlbW92ZUNsYXNzKGNsYXNzZXNbM10pO31cclxuXHRcdFx0XHRcdFx0aWYoJHRoaXMuaGFzQ2xhc3MoY2xhc3Nlc1s0XSkpeyR0aGlzLnJlbW92ZUNsYXNzKGNsYXNzZXNbNF0pO31cclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdC8qIGNzcyBmbGV4Ym94IGZpeCwgZGV0ZWN0L3NldCBtYXgtaGVpZ2h0ICovXHJcblx0XHRcdFx0XHRcdG1DdXN0b21TY3JvbGxCb3guY3NzKFwibWF4LWhlaWdodFwiLFwibm9uZVwiKTtcclxuXHRcdFx0XHRcdFx0aWYobUN1c3RvbVNjcm9sbEJveC5oZWlnaHQoKSE9PSR0aGlzLmhlaWdodCgpKXttQ3VzdG9tU2Nyb2xsQm94LmNzcyhcIm1heC1oZWlnaHRcIiwkdGhpcy5oZWlnaHQoKSk7fVxyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0X2V4cGFuZENvbnRlbnRIb3Jpem9udGFsbHkuY2FsbCh0aGlzKTsgLyogZXhwYW5kIGNvbnRlbnQgaG9yaXpvbnRhbGx5ICovXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRpZihvLmF4aXMhPT1cInlcIiAmJiAhby5hZHZhbmNlZC5hdXRvRXhwYW5kSG9yaXpvbnRhbFNjcm9sbCl7XHJcblx0XHRcdFx0XHRcdFx0bUNTQl9jb250YWluZXIuY3NzKFwid2lkdGhcIixfY29udGVudFdpZHRoKG1DU0JfY29udGFpbmVyKSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdGQub3ZlcmZsb3dlZD1fb3ZlcmZsb3dlZC5jYWxsKHRoaXMpOyAvKiBkZXRlcm1pbmUgaWYgc2Nyb2xsaW5nIGlzIHJlcXVpcmVkICovXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRfc2Nyb2xsYmFyVmlzaWJpbGl0eS5jYWxsKHRoaXMpOyAvKiBzaG93L2hpZGUgc2Nyb2xsYmFyKHMpICovXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHQvKiBhdXRvLWFkanVzdCBzY3JvbGxiYXIgZHJhZ2dlciBsZW5ndGggYW5hbG9nb3VzIHRvIGNvbnRlbnQgKi9cclxuXHRcdFx0XHRcdFx0aWYoby5hdXRvRHJhZ2dlckxlbmd0aCl7X3NldERyYWdnZXJMZW5ndGguY2FsbCh0aGlzKTt9XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRfc2Nyb2xsUmF0aW8uY2FsbCh0aGlzKTsgLyogY2FsY3VsYXRlIGFuZCBzdG9yZSBzY3JvbGxiYXIgdG8gY29udGVudCByYXRpbyAqL1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0X2JpbmRFdmVudHMuY2FsbCh0aGlzKTsgLyogYmluZCBzY3JvbGxiYXIgZXZlbnRzICovXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHQvKiByZXNldCBzY3JvbGxpbmcgcG9zaXRpb24gYW5kL29yIGV2ZW50cyAqL1xyXG5cdFx0XHRcdFx0XHR2YXIgdG89W01hdGguYWJzKG1DU0JfY29udGFpbmVyWzBdLm9mZnNldFRvcCksTWF0aC5hYnMobUNTQl9jb250YWluZXJbMF0ub2Zmc2V0TGVmdCldO1xyXG5cdFx0XHRcdFx0XHRpZihvLmF4aXMhPT1cInhcIil7IC8qIHkveXggYXhpcyAqL1xyXG5cdFx0XHRcdFx0XHRcdGlmKCFkLm92ZXJmbG93ZWRbMF0peyAvKiB5IHNjcm9sbGluZyBpcyBub3QgcmVxdWlyZWQgKi9cclxuXHRcdFx0XHRcdFx0XHRcdF9yZXNldENvbnRlbnRQb3NpdGlvbi5jYWxsKHRoaXMpOyAvKiByZXNldCBjb250ZW50IHBvc2l0aW9uICovXHJcblx0XHRcdFx0XHRcdFx0XHRpZihvLmF4aXM9PT1cInlcIil7XHJcblx0XHRcdFx0XHRcdFx0XHRcdF91bmJpbmRFdmVudHMuY2FsbCh0aGlzKTtcclxuXHRcdFx0XHRcdFx0XHRcdH1lbHNlIGlmKG8uYXhpcz09PVwieXhcIiAmJiBkLm92ZXJmbG93ZWRbMV0pe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRfc2Nyb2xsVG8oJHRoaXMsdG9bMV0udG9TdHJpbmcoKSx7ZGlyOlwieFwiLGR1cjowLG92ZXJ3cml0ZTpcIm5vbmVcIn0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1lbHNlIGlmKG1DU0JfZHJhZ2dlclswXS5oZWlnaHQoKT5tQ1NCX2RyYWdnZXJbMF0ucGFyZW50KCkuaGVpZ2h0KCkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0X3Jlc2V0Q29udGVudFBvc2l0aW9uLmNhbGwodGhpcyk7IC8qIHJlc2V0IGNvbnRlbnQgcG9zaXRpb24gKi9cclxuXHRcdFx0XHRcdFx0XHR9ZWxzZXsgLyogeSBzY3JvbGxpbmcgaXMgcmVxdWlyZWQgKi9cclxuXHRcdFx0XHRcdFx0XHRcdF9zY3JvbGxUbygkdGhpcyx0b1swXS50b1N0cmluZygpLHtkaXI6XCJ5XCIsZHVyOjAsb3ZlcndyaXRlOlwibm9uZVwifSk7XHJcblx0XHRcdFx0XHRcdFx0XHRkLmNvbnRlbnRSZXNldC55PW51bGw7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmKG8uYXhpcyE9PVwieVwiKXsgLyogeC95eCBheGlzICovXHJcblx0XHRcdFx0XHRcdFx0aWYoIWQub3ZlcmZsb3dlZFsxXSl7IC8qIHggc2Nyb2xsaW5nIGlzIG5vdCByZXF1aXJlZCAqL1xyXG5cdFx0XHRcdFx0XHRcdFx0X3Jlc2V0Q29udGVudFBvc2l0aW9uLmNhbGwodGhpcyk7IC8qIHJlc2V0IGNvbnRlbnQgcG9zaXRpb24gKi9cclxuXHRcdFx0XHRcdFx0XHRcdGlmKG8uYXhpcz09PVwieFwiKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0X3VuYmluZEV2ZW50cy5jYWxsKHRoaXMpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fWVsc2UgaWYoby5heGlzPT09XCJ5eFwiICYmIGQub3ZlcmZsb3dlZFswXSl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdF9zY3JvbGxUbygkdGhpcyx0b1swXS50b1N0cmluZygpLHtkaXI6XCJ5XCIsZHVyOjAsb3ZlcndyaXRlOlwibm9uZVwifSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fWVsc2UgaWYobUNTQl9kcmFnZ2VyWzFdLndpZHRoKCk+bUNTQl9kcmFnZ2VyWzFdLnBhcmVudCgpLndpZHRoKCkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0X3Jlc2V0Q29udGVudFBvc2l0aW9uLmNhbGwodGhpcyk7IC8qIHJlc2V0IGNvbnRlbnQgcG9zaXRpb24gKi9cclxuXHRcdFx0XHRcdFx0XHR9ZWxzZXsgLyogeCBzY3JvbGxpbmcgaXMgcmVxdWlyZWQgKi9cclxuXHRcdFx0XHRcdFx0XHRcdF9zY3JvbGxUbygkdGhpcyx0b1sxXS50b1N0cmluZygpLHtkaXI6XCJ4XCIsZHVyOjAsb3ZlcndyaXRlOlwibm9uZVwifSk7XHJcblx0XHRcdFx0XHRcdFx0XHRkLmNvbnRlbnRSZXNldC54PW51bGw7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHQvKiBjYWxsYmFja3M6IG9uSW1hZ2VMb2FkLCBvblNlbGVjdG9yQ2hhbmdlLCBvblVwZGF0ZSAqL1xyXG5cdFx0XHRcdFx0XHRpZihjYiAmJiBkKXtcclxuXHRcdFx0XHRcdFx0XHRpZihjYj09PTIgJiYgby5jYWxsYmFja3Mub25JbWFnZUxvYWQgJiYgdHlwZW9mIG8uY2FsbGJhY2tzLm9uSW1hZ2VMb2FkPT09XCJmdW5jdGlvblwiKXtcclxuXHRcdFx0XHRcdFx0XHRcdG8uY2FsbGJhY2tzLm9uSW1hZ2VMb2FkLmNhbGwodGhpcyk7XHJcblx0XHRcdFx0XHRcdFx0fWVsc2UgaWYoY2I9PT0zICYmIG8uY2FsbGJhY2tzLm9uU2VsZWN0b3JDaGFuZ2UgJiYgdHlwZW9mIG8uY2FsbGJhY2tzLm9uU2VsZWN0b3JDaGFuZ2U9PT1cImZ1bmN0aW9uXCIpe1xyXG5cdFx0XHRcdFx0XHRcdFx0by5jYWxsYmFja3Mub25TZWxlY3RvckNoYW5nZS5jYWxsKHRoaXMpO1xyXG5cdFx0XHRcdFx0XHRcdH1lbHNlIGlmKG8uY2FsbGJhY2tzLm9uVXBkYXRlICYmIHR5cGVvZiBvLmNhbGxiYWNrcy5vblVwZGF0ZT09PVwiZnVuY3Rpb25cIil7XHJcblx0XHRcdFx0XHRcdFx0XHRvLmNhbGxiYWNrcy5vblVwZGF0ZS5jYWxsKHRoaXMpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0X2F1dG9VcGRhdGUuY2FsbCh0aGlzKTsgLyogaW5pdGlhbGl6ZSBhdXRvbWF0aWMgdXBkYXRpbmcgKGZvciBkeW5hbWljIGNvbnRlbnQsIGZsdWlkIGxheW91dHMgZXRjLikgKi9cclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcclxuXHRcdFx0fSxcclxuXHRcdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cdFx0XHRcclxuXHRcdFx0XHJcblx0XHRcdFxyXG5cdFx0XHQvKiBcclxuXHRcdFx0cGx1Z2luIHNjcm9sbFRvIG1ldGhvZCBcclxuXHRcdFx0dHJpZ2dlcnMgYSBzY3JvbGxpbmcgZXZlbnQgdG8gYSBzcGVjaWZpYyB2YWx1ZVxyXG5cdFx0XHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdHVzYWdlOiAkKHNlbGVjdG9yKS5tQ3VzdG9tU2Nyb2xsYmFyKFwic2Nyb2xsVG9cIix2YWx1ZSxvcHRpb25zKTtcclxuXHRcdFx0Ki9cclxuXHRcdFxyXG5cdFx0XHRzY3JvbGxUbzpmdW5jdGlvbih2YWwsb3B0aW9ucyl7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0LyogcHJldmVudCBzaWxseSB0aGluZ3MgbGlrZSAkKHNlbGVjdG9yKS5tQ3VzdG9tU2Nyb2xsYmFyKFwic2Nyb2xsVG9cIix1bmRlZmluZWQpOyAqL1xyXG5cdFx0XHRcdGlmKHR5cGVvZiB2YWw9PVwidW5kZWZpbmVkXCIgfHwgdmFsPT1udWxsKXtyZXR1cm47fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciBzZWxlY3Rvcj1fc2VsZWN0b3IuY2FsbCh0aGlzKTsgLyogdmFsaWRhdGUgc2VsZWN0b3IgKi9cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRyZXR1cm4gJChzZWxlY3RvcikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHR2YXIgJHRoaXM9JCh0aGlzKTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0aWYoJHRoaXMuZGF0YShwbHVnaW5QZngpKXsgLyogY2hlY2sgaWYgcGx1Z2luIGhhcyBpbml0aWFsaXplZCAqL1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdHZhciBkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KSxvPWQub3B0LFxyXG5cdFx0XHRcdFx0XHRcdC8qIG1ldGhvZCBkZWZhdWx0IG9wdGlvbnMgKi9cclxuXHRcdFx0XHRcdFx0XHRtZXRob2REZWZhdWx0cz17XHJcblx0XHRcdFx0XHRcdFx0XHR0cmlnZ2VyOlwiZXh0ZXJuYWxcIiwgLyogbWV0aG9kIGlzIGJ5IGRlZmF1bHQgdHJpZ2dlcmVkIGV4dGVybmFsbHkgKGUuZy4gZnJvbSBvdGhlciBzY3JpcHRzKSAqL1xyXG5cdFx0XHRcdFx0XHRcdFx0c2Nyb2xsSW5lcnRpYTpvLnNjcm9sbEluZXJ0aWEsIC8qIHNjcm9sbGluZyBpbmVydGlhIChhbmltYXRpb24gZHVyYXRpb24pICovXHJcblx0XHRcdFx0XHRcdFx0XHRzY3JvbGxFYXNpbmc6XCJtY3NFYXNlSW5PdXRcIiwgLyogYW5pbWF0aW9uIGVhc2luZyAqL1xyXG5cdFx0XHRcdFx0XHRcdFx0bW92ZURyYWdnZXI6ZmFsc2UsIC8qIG1vdmUgZHJhZ2dlciBpbnN0ZWFkIG9mIGNvbnRlbnQgKi9cclxuXHRcdFx0XHRcdFx0XHRcdHRpbWVvdXQ6NjAsIC8qIHNjcm9sbC10byBkZWxheSAqL1xyXG5cdFx0XHRcdFx0XHRcdFx0Y2FsbGJhY2tzOnRydWUsIC8qIGVuYWJsZS9kaXNhYmxlIGNhbGxiYWNrcyAqL1xyXG5cdFx0XHRcdFx0XHRcdFx0b25TdGFydDp0cnVlLFxyXG5cdFx0XHRcdFx0XHRcdFx0b25VcGRhdGU6dHJ1ZSxcclxuXHRcdFx0XHRcdFx0XHRcdG9uQ29tcGxldGU6dHJ1ZVxyXG5cdFx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdFx0bWV0aG9kT3B0aW9ucz0kLmV4dGVuZCh0cnVlLHt9LG1ldGhvZERlZmF1bHRzLG9wdGlvbnMpLFxyXG5cdFx0XHRcdFx0XHRcdHRvPV9hcnIuY2FsbCh0aGlzLHZhbCksZHVyPW1ldGhvZE9wdGlvbnMuc2Nyb2xsSW5lcnRpYT4wICYmIG1ldGhvZE9wdGlvbnMuc2Nyb2xsSW5lcnRpYTwxNyA/IDE3IDogbWV0aG9kT3B0aW9ucy5zY3JvbGxJbmVydGlhO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0LyogdHJhbnNsYXRlIHl4IHZhbHVlcyB0byBhY3R1YWwgc2Nyb2xsLXRvIHBvc2l0aW9ucyAqL1xyXG5cdFx0XHRcdFx0XHR0b1swXT1fdG8uY2FsbCh0aGlzLHRvWzBdLFwieVwiKTtcclxuXHRcdFx0XHRcdFx0dG9bMV09X3RvLmNhbGwodGhpcyx0b1sxXSxcInhcIik7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHQvKiBcclxuXHRcdFx0XHRcdFx0Y2hlY2sgaWYgc2Nyb2xsLXRvIHZhbHVlIG1vdmVzIHRoZSBkcmFnZ2VyIGluc3RlYWQgb2YgY29udGVudC4gXHJcblx0XHRcdFx0XHRcdE9ubHkgcGl4ZWwgdmFsdWVzIGFwcGx5IG9uIGRyYWdnZXIgKGUuZy4gMTAwLCBcIjEwMHB4XCIsIFwiLT0xMDBcIiBldGMuKSBcclxuXHRcdFx0XHRcdFx0Ki9cclxuXHRcdFx0XHRcdFx0aWYobWV0aG9kT3B0aW9ucy5tb3ZlRHJhZ2dlcil7XHJcblx0XHRcdFx0XHRcdFx0dG9bMF0qPWQuc2Nyb2xsUmF0aW8ueTtcclxuXHRcdFx0XHRcdFx0XHR0b1sxXSo9ZC5zY3JvbGxSYXRpby54O1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRtZXRob2RPcHRpb25zLmR1cj1faXNUYWJIaWRkZW4oKSA/IDAgOiBkdXI7IC8vc2tpcCBhbmltYXRpb25zIGlmIGJyb3dzZXIgdGFiIGlzIGhpZGRlblxyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpeyBcclxuXHRcdFx0XHRcdFx0XHQvKiBkbyB0aGUgc2Nyb2xsaW5nICovXHJcblx0XHRcdFx0XHRcdFx0aWYodG9bMF0hPT1udWxsICYmIHR5cGVvZiB0b1swXSE9PVwidW5kZWZpbmVkXCIgJiYgby5heGlzIT09XCJ4XCIgJiYgZC5vdmVyZmxvd2VkWzBdKXsgLyogc2Nyb2xsIHkgKi9cclxuXHRcdFx0XHRcdFx0XHRcdG1ldGhvZE9wdGlvbnMuZGlyPVwieVwiO1xyXG5cdFx0XHRcdFx0XHRcdFx0bWV0aG9kT3B0aW9ucy5vdmVyd3JpdGU9XCJhbGxcIjtcclxuXHRcdFx0XHRcdFx0XHRcdF9zY3JvbGxUbygkdGhpcyx0b1swXS50b1N0cmluZygpLG1ldGhvZE9wdGlvbnMpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRpZih0b1sxXSE9PW51bGwgJiYgdHlwZW9mIHRvWzFdIT09XCJ1bmRlZmluZWRcIiAmJiBvLmF4aXMhPT1cInlcIiAmJiBkLm92ZXJmbG93ZWRbMV0peyAvKiBzY3JvbGwgeCAqL1xyXG5cdFx0XHRcdFx0XHRcdFx0bWV0aG9kT3B0aW9ucy5kaXI9XCJ4XCI7XHJcblx0XHRcdFx0XHRcdFx0XHRtZXRob2RPcHRpb25zLm92ZXJ3cml0ZT1cIm5vbmVcIjtcclxuXHRcdFx0XHRcdFx0XHRcdF9zY3JvbGxUbygkdGhpcyx0b1sxXS50b1N0cmluZygpLG1ldGhvZE9wdGlvbnMpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSxtZXRob2RPcHRpb25zLnRpbWVvdXQpO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR9LFxyXG5cdFx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblx0XHRcdFxyXG5cdFx0XHRcclxuXHRcdFx0XHJcblx0XHRcdC8qXHJcblx0XHRcdHBsdWdpbiBzdG9wIG1ldGhvZCBcclxuXHRcdFx0c3RvcHMgc2Nyb2xsaW5nIGFuaW1hdGlvblxyXG5cdFx0XHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdHVzYWdlOiAkKHNlbGVjdG9yKS5tQ3VzdG9tU2Nyb2xsYmFyKFwic3RvcFwiKTtcclxuXHRcdFx0Ki9cclxuXHRcdFx0c3RvcDpmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciBzZWxlY3Rvcj1fc2VsZWN0b3IuY2FsbCh0aGlzKTsgLyogdmFsaWRhdGUgc2VsZWN0b3IgKi9cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRyZXR1cm4gJChzZWxlY3RvcikuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHR2YXIgJHRoaXM9JCh0aGlzKTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0aWYoJHRoaXMuZGF0YShwbHVnaW5QZngpKXsgLyogY2hlY2sgaWYgcGx1Z2luIGhhcyBpbml0aWFsaXplZCAqL1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRfc3RvcCgkdGhpcyk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR9LFxyXG5cdFx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblx0XHRcdFxyXG5cdFx0XHRcclxuXHRcdFx0XHJcblx0XHRcdC8qXHJcblx0XHRcdHBsdWdpbiBkaXNhYmxlIG1ldGhvZCBcclxuXHRcdFx0dGVtcG9yYXJpbHkgZGlzYWJsZXMgdGhlIHNjcm9sbGJhcihzKSBcclxuXHRcdFx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHR1c2FnZTogJChzZWxlY3RvcikubUN1c3RvbVNjcm9sbGJhcihcImRpc2FibGVcIixyZXNldCk7IFxyXG5cdFx0XHRyZXNldCAoYm9vbGVhbik6IHJlc2V0cyBjb250ZW50IHBvc2l0aW9uIHRvIDAgXHJcblx0XHRcdCovXHJcblx0XHRcdGRpc2FibGU6ZnVuY3Rpb24ocil7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dmFyIHNlbGVjdG9yPV9zZWxlY3Rvci5jYWxsKHRoaXMpOyAvKiB2YWxpZGF0ZSBzZWxlY3RvciAqL1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHJldHVybiAkKHNlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdHZhciAkdGhpcz0kKHRoaXMpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRpZigkdGhpcy5kYXRhKHBsdWdpblBmeCkpeyAvKiBjaGVjayBpZiBwbHVnaW4gaGFzIGluaXRpYWxpemVkICovXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHR2YXIgZD0kdGhpcy5kYXRhKHBsdWdpblBmeCk7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRfYXV0b1VwZGF0ZS5jYWxsKHRoaXMsXCJyZW1vdmVcIik7IC8qIHJlbW92ZSBhdXRvbWF0aWMgdXBkYXRpbmcgKi9cclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdF91bmJpbmRFdmVudHMuY2FsbCh0aGlzKTsgLyogdW5iaW5kIGV2ZW50cyAqL1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0aWYocil7X3Jlc2V0Q29udGVudFBvc2l0aW9uLmNhbGwodGhpcyk7fSAvKiByZXNldCBjb250ZW50IHBvc2l0aW9uICovXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRfc2Nyb2xsYmFyVmlzaWJpbGl0eS5jYWxsKHRoaXMsdHJ1ZSk7IC8qIHNob3cvaGlkZSBzY3JvbGxiYXIocykgKi9cclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdCR0aGlzLmFkZENsYXNzKGNsYXNzZXNbM10pOyAvKiBhZGQgZGlzYWJsZSBjbGFzcyAqL1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcclxuXHRcdFx0fSxcclxuXHRcdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cdFx0XHRcclxuXHRcdFx0XHJcblx0XHRcdFxyXG5cdFx0XHQvKlxyXG5cdFx0XHRwbHVnaW4gZGVzdHJveSBtZXRob2QgXHJcblx0XHRcdGNvbXBsZXRlbHkgcmVtb3ZlcyB0aGUgc2Nyb2xsYmFyKHMpIGFuZCByZXR1cm5zIHRoZSBlbGVtZW50IHRvIGl0cyBvcmlnaW5hbCBzdGF0ZVxyXG5cdFx0XHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdHVzYWdlOiAkKHNlbGVjdG9yKS5tQ3VzdG9tU2Nyb2xsYmFyKFwiZGVzdHJveVwiKTsgXHJcblx0XHRcdCovXHJcblx0XHRcdGRlc3Ryb3k6ZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHR2YXIgc2VsZWN0b3I9X3NlbGVjdG9yLmNhbGwodGhpcyk7IC8qIHZhbGlkYXRlIHNlbGVjdG9yICovXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0cmV0dXJuICQoc2VsZWN0b3IpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0dmFyICR0aGlzPSQodGhpcyk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdGlmKCR0aGlzLmRhdGEocGx1Z2luUGZ4KSl7IC8qIGNoZWNrIGlmIHBsdWdpbiBoYXMgaW5pdGlhbGl6ZWQgKi9cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHR2YXIgZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksbz1kLm9wdCxcclxuXHRcdFx0XHRcdFx0XHRtQ3VzdG9tU2Nyb2xsQm94PSQoXCIjbUNTQl9cIitkLmlkeCksXHJcblx0XHRcdFx0XHRcdFx0bUNTQl9jb250YWluZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKSxcclxuXHRcdFx0XHRcdFx0XHRzY3JvbGxiYXI9JChcIi5tQ1NCX1wiK2QuaWR4K1wiX3Njcm9sbGJhclwiKTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRpZihvLmxpdmUpe3JlbW92ZUxpdmVUaW1lcnMoby5saXZlU2VsZWN0b3IgfHwgJChzZWxlY3Rvcikuc2VsZWN0b3IpO30gLyogcmVtb3ZlIGxpdmUgdGltZXJzICovXHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRfYXV0b1VwZGF0ZS5jYWxsKHRoaXMsXCJyZW1vdmVcIik7IC8qIHJlbW92ZSBhdXRvbWF0aWMgdXBkYXRpbmcgKi9cclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdF91bmJpbmRFdmVudHMuY2FsbCh0aGlzKTsgLyogdW5iaW5kIGV2ZW50cyAqL1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0X3Jlc2V0Q29udGVudFBvc2l0aW9uLmNhbGwodGhpcyk7IC8qIHJlc2V0IGNvbnRlbnQgcG9zaXRpb24gKi9cclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdCR0aGlzLnJlbW92ZURhdGEocGx1Z2luUGZ4KTsgLyogcmVtb3ZlIHBsdWdpbiBkYXRhIG9iamVjdCAqL1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0X2RlbGV0ZSh0aGlzLFwibWNzXCIpOyAvKiBkZWxldGUgY2FsbGJhY2tzIG9iamVjdCAqL1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0LyogcmVtb3ZlIHBsdWdpbiBtYXJrdXAgKi9cclxuXHRcdFx0XHRcdFx0c2Nyb2xsYmFyLnJlbW92ZSgpOyAvKiByZW1vdmUgc2Nyb2xsYmFyKHMpIGZpcnN0ICh0aG9zZSBjYW4gYmUgZWl0aGVyIGluc2lkZSBvciBvdXRzaWRlIHBsdWdpbidzIGlubmVyIHdyYXBwZXIpICovXHJcblx0XHRcdFx0XHRcdG1DU0JfY29udGFpbmVyLmZpbmQoXCJpbWcuXCIrY2xhc3Nlc1syXSkucmVtb3ZlQ2xhc3MoY2xhc3Nlc1syXSk7IC8qIHJlbW92ZSBsb2FkZWQgaW1hZ2VzIGZsYWcgKi9cclxuXHRcdFx0XHRcdFx0bUN1c3RvbVNjcm9sbEJveC5yZXBsYWNlV2l0aChtQ1NCX2NvbnRhaW5lci5jb250ZW50cygpKTsgLyogcmVwbGFjZSBwbHVnaW4ncyBpbm5lciB3cmFwcGVyIHdpdGggdGhlIG9yaWdpbmFsIGNvbnRlbnQgKi9cclxuXHRcdFx0XHRcdFx0LyogcmVtb3ZlIHBsdWdpbiBjbGFzc2VzIGZyb20gdGhlIGVsZW1lbnQgYW5kIGFkZCBkZXN0cm95IGNsYXNzICovXHJcblx0XHRcdFx0XHRcdCR0aGlzLnJlbW92ZUNsYXNzKHBsdWdpbk5TK1wiIF9cIitwbHVnaW5QZngrXCJfXCIrZC5pZHgrXCIgXCIrY2xhc3Nlc1s2XStcIiBcIitjbGFzc2VzWzddK1wiIFwiK2NsYXNzZXNbNV0rXCIgXCIrY2xhc3Nlc1szXSkuYWRkQ2xhc3MoY2xhc3Nlc1s0XSk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHRcdFx0XHJcblx0XHR9LFxyXG5cdFxyXG5cdFxyXG5cdFxyXG5cdFxyXG5cdFx0XHJcblx0LyogXHJcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdEZVTkNUSU9OU1xyXG5cdC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHQqL1xyXG5cdFxyXG5cdFx0LyogdmFsaWRhdGVzIHNlbGVjdG9yIChpZiBzZWxlY3RvciBpcyBpbnZhbGlkIG9yIHVuZGVmaW5lZCB1c2VzIHRoZSBkZWZhdWx0IG9uZSkgKi9cclxuXHRcdF9zZWxlY3Rvcj1mdW5jdGlvbigpe1xyXG5cdFx0XHRyZXR1cm4gKHR5cGVvZiAkKHRoaXMpIT09XCJvYmplY3RcIiB8fCAkKHRoaXMpLmxlbmd0aDwxKSA/IGRlZmF1bHRTZWxlY3RvciA6IHRoaXM7XHJcblx0XHR9LFxyXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHRcdFxyXG5cdFx0XHJcblx0XHQvKiBjaGFuZ2VzIG9wdGlvbnMgYWNjb3JkaW5nIHRvIHRoZW1lICovXHJcblx0XHRfdGhlbWU9ZnVuY3Rpb24ob2JqKXtcclxuXHRcdFx0dmFyIGZpeGVkU2l6ZVNjcm9sbGJhclRoZW1lcz1bXCJyb3VuZGVkXCIsXCJyb3VuZGVkLWRhcmtcIixcInJvdW5kZWQtZG90c1wiLFwicm91bmRlZC1kb3RzLWRhcmtcIl0sXHJcblx0XHRcdFx0bm9uRXhwYW5kZWRTY3JvbGxiYXJUaGVtZXM9W1wicm91bmRlZC1kb3RzXCIsXCJyb3VuZGVkLWRvdHMtZGFya1wiLFwiM2RcIixcIjNkLWRhcmtcIixcIjNkLXRoaWNrXCIsXCIzZC10aGljay1kYXJrXCIsXCJpbnNldFwiLFwiaW5zZXQtZGFya1wiLFwiaW5zZXQtMlwiLFwiaW5zZXQtMi1kYXJrXCIsXCJpbnNldC0zXCIsXCJpbnNldC0zLWRhcmtcIl0sXHJcblx0XHRcdFx0ZGlzYWJsZWRTY3JvbGxCdXR0b25zVGhlbWVzPVtcIm1pbmltYWxcIixcIm1pbmltYWwtZGFya1wiXSxcclxuXHRcdFx0XHRlbmFibGVkQXV0b0hpZGVTY3JvbGxiYXJUaGVtZXM9W1wibWluaW1hbFwiLFwibWluaW1hbC1kYXJrXCJdLFxyXG5cdFx0XHRcdHNjcm9sbGJhclBvc2l0aW9uT3V0c2lkZVRoZW1lcz1bXCJtaW5pbWFsXCIsXCJtaW5pbWFsLWRhcmtcIl07XHJcblx0XHRcdG9iai5hdXRvRHJhZ2dlckxlbmd0aD0kLmluQXJyYXkob2JqLnRoZW1lLGZpeGVkU2l6ZVNjcm9sbGJhclRoZW1lcykgPiAtMSA/IGZhbHNlIDogb2JqLmF1dG9EcmFnZ2VyTGVuZ3RoO1xyXG5cdFx0XHRvYmouYXV0b0V4cGFuZFNjcm9sbGJhcj0kLmluQXJyYXkob2JqLnRoZW1lLG5vbkV4cGFuZGVkU2Nyb2xsYmFyVGhlbWVzKSA+IC0xID8gZmFsc2UgOiBvYmouYXV0b0V4cGFuZFNjcm9sbGJhcjtcclxuXHRcdFx0b2JqLnNjcm9sbEJ1dHRvbnMuZW5hYmxlPSQuaW5BcnJheShvYmoudGhlbWUsZGlzYWJsZWRTY3JvbGxCdXR0b25zVGhlbWVzKSA+IC0xID8gZmFsc2UgOiBvYmouc2Nyb2xsQnV0dG9ucy5lbmFibGU7XHJcblx0XHRcdG9iai5hdXRvSGlkZVNjcm9sbGJhcj0kLmluQXJyYXkob2JqLnRoZW1lLGVuYWJsZWRBdXRvSGlkZVNjcm9sbGJhclRoZW1lcykgPiAtMSA/IHRydWUgOiBvYmouYXV0b0hpZGVTY3JvbGxiYXI7XHJcblx0XHRcdG9iai5zY3JvbGxiYXJQb3NpdGlvbj0kLmluQXJyYXkob2JqLnRoZW1lLHNjcm9sbGJhclBvc2l0aW9uT3V0c2lkZVRoZW1lcykgPiAtMSA/IFwib3V0c2lkZVwiIDogb2JqLnNjcm9sbGJhclBvc2l0aW9uO1xyXG5cdFx0fSxcclxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblx0XHRcclxuXHRcdFxyXG5cdFx0LyogbGl2ZSBvcHRpb24gdGltZXJzIHJlbW92YWwgKi9cclxuXHRcdHJlbW92ZUxpdmVUaW1lcnM9ZnVuY3Rpb24oc2VsZWN0b3Ipe1xyXG5cdFx0XHRpZihsaXZlVGltZXJzW3NlbGVjdG9yXSl7XHJcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KGxpdmVUaW1lcnNbc2VsZWN0b3JdKTtcclxuXHRcdFx0XHRfZGVsZXRlKGxpdmVUaW1lcnMsc2VsZWN0b3IpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHRcdFxyXG5cdFx0XHJcblx0XHQvKiBub3JtYWxpemVzIGF4aXMgb3B0aW9uIHRvIHZhbGlkIHZhbHVlczogXCJ5XCIsIFwieFwiLCBcInl4XCIgKi9cclxuXHRcdF9maW5kQXhpcz1mdW5jdGlvbih2YWwpe1xyXG5cdFx0XHRyZXR1cm4gKHZhbD09PVwieXhcIiB8fCB2YWw9PT1cInh5XCIgfHwgdmFsPT09XCJhdXRvXCIpID8gXCJ5eFwiIDogKHZhbD09PVwieFwiIHx8IHZhbD09PVwiaG9yaXpvbnRhbFwiKSA/IFwieFwiIDogXCJ5XCI7XHJcblx0XHR9LFxyXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHRcdFxyXG5cdFx0XHJcblx0XHQvKiBub3JtYWxpemVzIHNjcm9sbEJ1dHRvbnMuc2Nyb2xsVHlwZSBvcHRpb24gdG8gdmFsaWQgdmFsdWVzOiBcInN0ZXBsZXNzXCIsIFwic3RlcHBlZFwiICovXHJcblx0XHRfZmluZFNjcm9sbEJ1dHRvbnNUeXBlPWZ1bmN0aW9uKHZhbCl7XHJcblx0XHRcdHJldHVybiAodmFsPT09XCJzdGVwcGVkXCIgfHwgdmFsPT09XCJwaXhlbHNcIiB8fCB2YWw9PT1cInN0ZXBcIiB8fCB2YWw9PT1cImNsaWNrXCIpID8gXCJzdGVwcGVkXCIgOiBcInN0ZXBsZXNzXCI7XHJcblx0XHR9LFxyXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHRcdFxyXG5cdFx0XHJcblx0XHQvKiBnZW5lcmF0ZXMgcGx1Z2luIG1hcmt1cCAqL1xyXG5cdFx0X3BsdWdpbk1hcmt1cD1mdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgJHRoaXM9JCh0aGlzKSxkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KSxvPWQub3B0LFxyXG5cdFx0XHRcdGV4cGFuZENsYXNzPW8uYXV0b0V4cGFuZFNjcm9sbGJhciA/IFwiIFwiK2NsYXNzZXNbMV0rXCJfZXhwYW5kXCIgOiBcIlwiLFxyXG5cdFx0XHRcdHNjcm9sbGJhcj1bXCI8ZGl2IGlkPSdtQ1NCX1wiK2QuaWR4K1wiX3Njcm9sbGJhcl92ZXJ0aWNhbCcgY2xhc3M9J21DU0Jfc2Nyb2xsVG9vbHMgbUNTQl9cIitkLmlkeCtcIl9zY3JvbGxiYXIgbUNTLVwiK28udGhlbWUrXCIgbUNTQl9zY3JvbGxUb29sc192ZXJ0aWNhbFwiK2V4cGFuZENsYXNzK1wiJz48ZGl2IGNsYXNzPSdcIitjbGFzc2VzWzEyXStcIic+PGRpdiBpZD0nbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX3ZlcnRpY2FsJyBjbGFzcz0nbUNTQl9kcmFnZ2VyJyBzdHlsZT0ncG9zaXRpb246YWJzb2x1dGU7Jz48ZGl2IGNsYXNzPSdtQ1NCX2RyYWdnZXJfYmFyJyAvPjwvZGl2PjxkaXYgY2xhc3M9J21DU0JfZHJhZ2dlclJhaWwnIC8+PC9kaXY+PC9kaXY+XCIsXCI8ZGl2IGlkPSdtQ1NCX1wiK2QuaWR4K1wiX3Njcm9sbGJhcl9ob3Jpem9udGFsJyBjbGFzcz0nbUNTQl9zY3JvbGxUb29scyBtQ1NCX1wiK2QuaWR4K1wiX3Njcm9sbGJhciBtQ1MtXCIrby50aGVtZStcIiBtQ1NCX3Njcm9sbFRvb2xzX2hvcml6b250YWxcIitleHBhbmRDbGFzcytcIic+PGRpdiBjbGFzcz0nXCIrY2xhc3Nlc1sxMl0rXCInPjxkaXYgaWQ9J21DU0JfXCIrZC5pZHgrXCJfZHJhZ2dlcl9ob3Jpem9udGFsJyBjbGFzcz0nbUNTQl9kcmFnZ2VyJyBzdHlsZT0ncG9zaXRpb246YWJzb2x1dGU7Jz48ZGl2IGNsYXNzPSdtQ1NCX2RyYWdnZXJfYmFyJyAvPjwvZGl2PjxkaXYgY2xhc3M9J21DU0JfZHJhZ2dlclJhaWwnIC8+PC9kaXY+PC9kaXY+XCJdLFxyXG5cdFx0XHRcdHdyYXBwZXJDbGFzcz1vLmF4aXM9PT1cInl4XCIgPyBcIm1DU0JfdmVydGljYWxfaG9yaXpvbnRhbFwiIDogby5heGlzPT09XCJ4XCIgPyBcIm1DU0JfaG9yaXpvbnRhbFwiIDogXCJtQ1NCX3ZlcnRpY2FsXCIsXHJcblx0XHRcdFx0c2Nyb2xsYmFycz1vLmF4aXM9PT1cInl4XCIgPyBzY3JvbGxiYXJbMF0rc2Nyb2xsYmFyWzFdIDogby5heGlzPT09XCJ4XCIgPyBzY3JvbGxiYXJbMV0gOiBzY3JvbGxiYXJbMF0sXHJcblx0XHRcdFx0Y29udGVudFdyYXBwZXI9by5heGlzPT09XCJ5eFwiID8gXCI8ZGl2IGlkPSdtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lcl93cmFwcGVyJyBjbGFzcz0nbUNTQl9jb250YWluZXJfd3JhcHBlcicgLz5cIiA6IFwiXCIsXHJcblx0XHRcdFx0YXV0b0hpZGVDbGFzcz1vLmF1dG9IaWRlU2Nyb2xsYmFyID8gXCIgXCIrY2xhc3Nlc1s2XSA6IFwiXCIsXHJcblx0XHRcdFx0c2Nyb2xsYmFyRGlyQ2xhc3M9KG8uYXhpcyE9PVwieFwiICYmIGQubGFuZ0Rpcj09PVwicnRsXCIpID8gXCIgXCIrY2xhc3Nlc1s3XSA6IFwiXCI7XHJcblx0XHRcdGlmKG8uc2V0V2lkdGgpeyR0aGlzLmNzcyhcIndpZHRoXCIsby5zZXRXaWR0aCk7fSAvKiBzZXQgZWxlbWVudCB3aWR0aCAqL1xyXG5cdFx0XHRpZihvLnNldEhlaWdodCl7JHRoaXMuY3NzKFwiaGVpZ2h0XCIsby5zZXRIZWlnaHQpO30gLyogc2V0IGVsZW1lbnQgaGVpZ2h0ICovXHJcblx0XHRcdG8uc2V0TGVmdD0oby5heGlzIT09XCJ5XCIgJiYgZC5sYW5nRGlyPT09XCJydGxcIikgPyBcIjk4OTk5OXB4XCIgOiBvLnNldExlZnQ7IC8qIGFkanVzdCBsZWZ0IHBvc2l0aW9uIGZvciBydGwgZGlyZWN0aW9uICovXHJcblx0XHRcdCR0aGlzLmFkZENsYXNzKHBsdWdpbk5TK1wiIF9cIitwbHVnaW5QZngrXCJfXCIrZC5pZHgrYXV0b0hpZGVDbGFzcytzY3JvbGxiYXJEaXJDbGFzcykud3JhcElubmVyKFwiPGRpdiBpZD0nbUNTQl9cIitkLmlkeCtcIicgY2xhc3M9J21DdXN0b21TY3JvbGxCb3ggbUNTLVwiK28udGhlbWUrXCIgXCIrd3JhcHBlckNsYXNzK1wiJz48ZGl2IGlkPSdtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lcicgY2xhc3M9J21DU0JfY29udGFpbmVyJyBzdHlsZT0ncG9zaXRpb246cmVsYXRpdmU7IHRvcDpcIitvLnNldFRvcCtcIjsgbGVmdDpcIitvLnNldExlZnQrXCI7JyBkaXI9J1wiK2QubGFuZ0RpcitcIicgLz48L2Rpdj5cIik7XHJcblx0XHRcdHZhciBtQ3VzdG9tU2Nyb2xsQm94PSQoXCIjbUNTQl9cIitkLmlkeCksXHJcblx0XHRcdFx0bUNTQl9jb250YWluZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKTtcclxuXHRcdFx0aWYoby5heGlzIT09XCJ5XCIgJiYgIW8uYWR2YW5jZWQuYXV0b0V4cGFuZEhvcml6b250YWxTY3JvbGwpe1xyXG5cdFx0XHRcdG1DU0JfY29udGFpbmVyLmNzcyhcIndpZHRoXCIsX2NvbnRlbnRXaWR0aChtQ1NCX2NvbnRhaW5lcikpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKG8uc2Nyb2xsYmFyUG9zaXRpb249PT1cIm91dHNpZGVcIil7XHJcblx0XHRcdFx0aWYoJHRoaXMuY3NzKFwicG9zaXRpb25cIik9PT1cInN0YXRpY1wiKXsgLyogcmVxdWlyZXMgZWxlbWVudHMgd2l0aCBub24tc3RhdGljIHBvc2l0aW9uICovXHJcblx0XHRcdFx0XHQkdGhpcy5jc3MoXCJwb3NpdGlvblwiLFwicmVsYXRpdmVcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdCR0aGlzLmNzcyhcIm92ZXJmbG93XCIsXCJ2aXNpYmxlXCIpO1xyXG5cdFx0XHRcdG1DdXN0b21TY3JvbGxCb3guYWRkQ2xhc3MoXCJtQ1NCX291dHNpZGVcIikuYWZ0ZXIoc2Nyb2xsYmFycyk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdG1DdXN0b21TY3JvbGxCb3guYWRkQ2xhc3MoXCJtQ1NCX2luc2lkZVwiKS5hcHBlbmQoc2Nyb2xsYmFycyk7XHJcblx0XHRcdFx0bUNTQl9jb250YWluZXIud3JhcChjb250ZW50V3JhcHBlcik7XHJcblx0XHRcdH1cclxuXHRcdFx0X3Njcm9sbEJ1dHRvbnMuY2FsbCh0aGlzKTsgLyogYWRkIHNjcm9sbGJhciBidXR0b25zICovXHJcblx0XHRcdC8qIG1pbmltdW0gZHJhZ2dlciBsZW5ndGggKi9cclxuXHRcdFx0dmFyIG1DU0JfZHJhZ2dlcj1bJChcIiNtQ1NCX1wiK2QuaWR4K1wiX2RyYWdnZXJfdmVydGljYWxcIiksJChcIiNtQ1NCX1wiK2QuaWR4K1wiX2RyYWdnZXJfaG9yaXpvbnRhbFwiKV07XHJcblx0XHRcdG1DU0JfZHJhZ2dlclswXS5jc3MoXCJtaW4taGVpZ2h0XCIsbUNTQl9kcmFnZ2VyWzBdLmhlaWdodCgpKTtcclxuXHRcdFx0bUNTQl9kcmFnZ2VyWzFdLmNzcyhcIm1pbi13aWR0aFwiLG1DU0JfZHJhZ2dlclsxXS53aWR0aCgpKTtcclxuXHRcdH0sXHJcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cdFx0XHJcblx0XHRcclxuXHRcdC8qIGNhbGN1bGF0ZXMgY29udGVudCB3aWR0aCAqL1xyXG5cdFx0X2NvbnRlbnRXaWR0aD1mdW5jdGlvbihlbCl7XHJcblx0XHRcdHZhciB2YWw9W2VsWzBdLnNjcm9sbFdpZHRoLE1hdGgubWF4LmFwcGx5KE1hdGgsZWwuY2hpbGRyZW4oKS5tYXAoZnVuY3Rpb24oKXtyZXR1cm4gJCh0aGlzKS5vdXRlcldpZHRoKHRydWUpO30pLmdldCgpKV0sdz1lbC5wYXJlbnQoKS53aWR0aCgpO1xyXG5cdFx0XHRyZXR1cm4gdmFsWzBdPncgPyB2YWxbMF0gOiB2YWxbMV0+dyA/IHZhbFsxXSA6IFwiMTAwJVwiO1xyXG5cdFx0fSxcclxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblx0XHRcclxuXHRcdFxyXG5cdFx0LyogZXhwYW5kcyBjb250ZW50IGhvcml6b250YWxseSAqL1xyXG5cdFx0X2V4cGFuZENvbnRlbnRIb3Jpem9udGFsbHk9ZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyICR0aGlzPSQodGhpcyksZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksbz1kLm9wdCxcclxuXHRcdFx0XHRtQ1NCX2NvbnRhaW5lcj0kKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpO1xyXG5cdFx0XHRpZihvLmFkdmFuY2VkLmF1dG9FeHBhbmRIb3Jpem9udGFsU2Nyb2xsICYmIG8uYXhpcyE9PVwieVwiKXtcclxuXHRcdFx0XHQvKiBjYWxjdWxhdGUgc2Nyb2xsV2lkdGggKi9cclxuXHRcdFx0XHRtQ1NCX2NvbnRhaW5lci5jc3Moe1wid2lkdGhcIjpcImF1dG9cIixcIm1pbi13aWR0aFwiOjAsXCJvdmVyZmxvdy14XCI6XCJzY3JvbGxcIn0pO1xyXG5cdFx0XHRcdHZhciB3PU1hdGguY2VpbChtQ1NCX2NvbnRhaW5lclswXS5zY3JvbGxXaWR0aCk7XHJcblx0XHRcdFx0aWYoby5hZHZhbmNlZC5hdXRvRXhwYW5kSG9yaXpvbnRhbFNjcm9sbD09PTMgfHwgKG8uYWR2YW5jZWQuYXV0b0V4cGFuZEhvcml6b250YWxTY3JvbGwhPT0yICYmIHc+bUNTQl9jb250YWluZXIucGFyZW50KCkud2lkdGgoKSkpe1xyXG5cdFx0XHRcdFx0bUNTQl9jb250YWluZXIuY3NzKHtcIndpZHRoXCI6dyxcIm1pbi13aWR0aFwiOlwiMTAwJVwiLFwib3ZlcmZsb3cteFwiOlwiaW5oZXJpdFwifSk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHQvKiBcclxuXHRcdFx0XHRcdHdyYXAgY29udGVudCB3aXRoIGFuIGluZmluaXRlIHdpZHRoIGRpdiBhbmQgc2V0IGl0cyBwb3NpdGlvbiB0byBhYnNvbHV0ZSBhbmQgd2lkdGggdG8gYXV0by4gXHJcblx0XHRcdFx0XHRTZXR0aW5nIHdpZHRoIHRvIGF1dG8gYmVmb3JlIGNhbGN1bGF0aW5nIHRoZSBhY3R1YWwgd2lkdGggaXMgaW1wb3J0YW50ISBcclxuXHRcdFx0XHRcdFdlIG11c3QgbGV0IHRoZSBicm93c2VyIHNldCB0aGUgd2lkdGggYXMgYnJvd3NlciB6b29tIHZhbHVlcyBhcmUgaW1wb3NzaWJsZSB0byBjYWxjdWxhdGUuXHJcblx0XHRcdFx0XHQqL1xyXG5cdFx0XHRcdFx0bUNTQl9jb250YWluZXIuY3NzKHtcIm92ZXJmbG93LXhcIjpcImluaGVyaXRcIixcInBvc2l0aW9uXCI6XCJhYnNvbHV0ZVwifSlcclxuXHRcdFx0XHRcdFx0LndyYXAoXCI8ZGl2IGNsYXNzPSdtQ1NCX2hfd3JhcHBlcicgc3R5bGU9J3Bvc2l0aW9uOnJlbGF0aXZlOyBsZWZ0OjA7IHdpZHRoOjk5OTk5OXB4OycgLz5cIilcclxuXHRcdFx0XHRcdFx0LmNzcyh7IC8qIHNldCBhY3R1YWwgd2lkdGgsIG9yaWdpbmFsIHBvc2l0aW9uIGFuZCB1bi13cmFwICovXHJcblx0XHRcdFx0XHRcdFx0LyogXHJcblx0XHRcdFx0XHRcdFx0Z2V0IHRoZSBleGFjdCB3aWR0aCAod2l0aCBkZWNpbWFscykgYW5kIHRoZW4gcm91bmQtdXAuIFxyXG5cdFx0XHRcdFx0XHRcdFVzaW5nIGpxdWVyeSBvdXRlcldpZHRoKCkgd2lsbCByb3VuZCB0aGUgd2lkdGggdmFsdWUgd2hpY2ggd2lsbCBtZXNzIHVwIHdpdGggaW5uZXIgZWxlbWVudHMgdGhhdCBoYXZlIG5vbi1pbnRlZ2VyIHdpZHRoXHJcblx0XHRcdFx0XHRcdFx0Ki9cclxuXHRcdFx0XHRcdFx0XHRcIndpZHRoXCI6KE1hdGguY2VpbChtQ1NCX2NvbnRhaW5lclswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5yaWdodCswLjQpLU1hdGguZmxvb3IobUNTQl9jb250YWluZXJbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCkpLFxyXG5cdFx0XHRcdFx0XHRcdFwibWluLXdpZHRoXCI6XCIxMDAlXCIsXHJcblx0XHRcdFx0XHRcdFx0XCJwb3NpdGlvblwiOlwicmVsYXRpdmVcIlxyXG5cdFx0XHRcdFx0XHR9KS51bndyYXAoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cdFx0XHJcblx0XHRcclxuXHRcdC8qIGFkZHMgc2Nyb2xsYmFyIGJ1dHRvbnMgKi9cclxuXHRcdF9zY3JvbGxCdXR0b25zPWZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciAkdGhpcz0kKHRoaXMpLGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsXHJcblx0XHRcdFx0bUNTQl9zY3JvbGxUb29scz0kKFwiLm1DU0JfXCIrZC5pZHgrXCJfc2Nyb2xsYmFyOmZpcnN0XCIpLFxyXG5cdFx0XHRcdHRhYmluZGV4PSFfaXNOdW1lcmljKG8uc2Nyb2xsQnV0dG9ucy50YWJpbmRleCkgPyBcIlwiIDogXCJ0YWJpbmRleD0nXCIrby5zY3JvbGxCdXR0b25zLnRhYmluZGV4K1wiJ1wiLFxyXG5cdFx0XHRcdGJ0bkhUTUw9W1xyXG5cdFx0XHRcdFx0XCI8YSBocmVmPScjJyBjbGFzcz0nXCIrY2xhc3Nlc1sxM10rXCInIFwiK3RhYmluZGV4K1wiIC8+XCIsXHJcblx0XHRcdFx0XHRcIjxhIGhyZWY9JyMnIGNsYXNzPSdcIitjbGFzc2VzWzE0XStcIicgXCIrdGFiaW5kZXgrXCIgLz5cIixcclxuXHRcdFx0XHRcdFwiPGEgaHJlZj0nIycgY2xhc3M9J1wiK2NsYXNzZXNbMTVdK1wiJyBcIit0YWJpbmRleCtcIiAvPlwiLFxyXG5cdFx0XHRcdFx0XCI8YSBocmVmPScjJyBjbGFzcz0nXCIrY2xhc3Nlc1sxNl0rXCInIFwiK3RhYmluZGV4K1wiIC8+XCJcclxuXHRcdFx0XHRdLFxyXG5cdFx0XHRcdGJ0bj1bKG8uYXhpcz09PVwieFwiID8gYnRuSFRNTFsyXSA6IGJ0bkhUTUxbMF0pLChvLmF4aXM9PT1cInhcIiA/IGJ0bkhUTUxbM10gOiBidG5IVE1MWzFdKSxidG5IVE1MWzJdLGJ0bkhUTUxbM11dO1xyXG5cdFx0XHRpZihvLnNjcm9sbEJ1dHRvbnMuZW5hYmxlKXtcclxuXHRcdFx0XHRtQ1NCX3Njcm9sbFRvb2xzLnByZXBlbmQoYnRuWzBdKS5hcHBlbmQoYnRuWzFdKS5uZXh0KFwiLm1DU0Jfc2Nyb2xsVG9vbHNcIikucHJlcGVuZChidG5bMl0pLmFwcGVuZChidG5bM10pO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHRcdFxyXG5cdFx0XHJcblx0XHQvKiBhdXRvLWFkanVzdHMgc2Nyb2xsYmFyIGRyYWdnZXIgbGVuZ3RoICovXHJcblx0XHRfc2V0RHJhZ2dlckxlbmd0aD1mdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgJHRoaXM9JCh0aGlzKSxkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KSxcclxuXHRcdFx0XHRtQ3VzdG9tU2Nyb2xsQm94PSQoXCIjbUNTQl9cIitkLmlkeCksXHJcblx0XHRcdFx0bUNTQl9jb250YWluZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKSxcclxuXHRcdFx0XHRtQ1NCX2RyYWdnZXI9WyQoXCIjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX3ZlcnRpY2FsXCIpLCQoXCIjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX2hvcml6b250YWxcIildLFxyXG5cdFx0XHRcdHJhdGlvPVttQ3VzdG9tU2Nyb2xsQm94LmhlaWdodCgpL21DU0JfY29udGFpbmVyLm91dGVySGVpZ2h0KGZhbHNlKSxtQ3VzdG9tU2Nyb2xsQm94LndpZHRoKCkvbUNTQl9jb250YWluZXIub3V0ZXJXaWR0aChmYWxzZSldLFxyXG5cdFx0XHRcdGw9W1xyXG5cdFx0XHRcdFx0cGFyc2VJbnQobUNTQl9kcmFnZ2VyWzBdLmNzcyhcIm1pbi1oZWlnaHRcIikpLE1hdGgucm91bmQocmF0aW9bMF0qbUNTQl9kcmFnZ2VyWzBdLnBhcmVudCgpLmhlaWdodCgpKSxcclxuXHRcdFx0XHRcdHBhcnNlSW50KG1DU0JfZHJhZ2dlclsxXS5jc3MoXCJtaW4td2lkdGhcIikpLE1hdGgucm91bmQocmF0aW9bMV0qbUNTQl9kcmFnZ2VyWzFdLnBhcmVudCgpLndpZHRoKCkpXHJcblx0XHRcdFx0XSxcclxuXHRcdFx0XHRoPW9sZElFICYmIChsWzFdPGxbMF0pID8gbFswXSA6IGxbMV0sdz1vbGRJRSAmJiAobFszXTxsWzJdKSA/IGxbMl0gOiBsWzNdO1xyXG5cdFx0XHRtQ1NCX2RyYWdnZXJbMF0uY3NzKHtcclxuXHRcdFx0XHRcImhlaWdodFwiOmgsXCJtYXgtaGVpZ2h0XCI6KG1DU0JfZHJhZ2dlclswXS5wYXJlbnQoKS5oZWlnaHQoKS0xMClcclxuXHRcdFx0fSkuZmluZChcIi5tQ1NCX2RyYWdnZXJfYmFyXCIpLmNzcyh7XCJsaW5lLWhlaWdodFwiOmxbMF0rXCJweFwifSk7XHJcblx0XHRcdG1DU0JfZHJhZ2dlclsxXS5jc3Moe1xyXG5cdFx0XHRcdFwid2lkdGhcIjp3LFwibWF4LXdpZHRoXCI6KG1DU0JfZHJhZ2dlclsxXS5wYXJlbnQoKS53aWR0aCgpLTEwKVxyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cdFx0XHJcblx0XHRcclxuXHRcdC8qIGNhbGN1bGF0ZXMgc2Nyb2xsYmFyIHRvIGNvbnRlbnQgcmF0aW8gKi9cclxuXHRcdF9zY3JvbGxSYXRpbz1mdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgJHRoaXM9JCh0aGlzKSxkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KSxcclxuXHRcdFx0XHRtQ3VzdG9tU2Nyb2xsQm94PSQoXCIjbUNTQl9cIitkLmlkeCksXHJcblx0XHRcdFx0bUNTQl9jb250YWluZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKSxcclxuXHRcdFx0XHRtQ1NCX2RyYWdnZXI9WyQoXCIjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX3ZlcnRpY2FsXCIpLCQoXCIjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX2hvcml6b250YWxcIildLFxyXG5cdFx0XHRcdHNjcm9sbEFtb3VudD1bbUNTQl9jb250YWluZXIub3V0ZXJIZWlnaHQoZmFsc2UpLW1DdXN0b21TY3JvbGxCb3guaGVpZ2h0KCksbUNTQl9jb250YWluZXIub3V0ZXJXaWR0aChmYWxzZSktbUN1c3RvbVNjcm9sbEJveC53aWR0aCgpXSxcclxuXHRcdFx0XHRyYXRpbz1bXHJcblx0XHRcdFx0XHRzY3JvbGxBbW91bnRbMF0vKG1DU0JfZHJhZ2dlclswXS5wYXJlbnQoKS5oZWlnaHQoKS1tQ1NCX2RyYWdnZXJbMF0uaGVpZ2h0KCkpLFxyXG5cdFx0XHRcdFx0c2Nyb2xsQW1vdW50WzFdLyhtQ1NCX2RyYWdnZXJbMV0ucGFyZW50KCkud2lkdGgoKS1tQ1NCX2RyYWdnZXJbMV0ud2lkdGgoKSlcclxuXHRcdFx0XHRdO1xyXG5cdFx0XHRkLnNjcm9sbFJhdGlvPXt5OnJhdGlvWzBdLHg6cmF0aW9bMV19O1xyXG5cdFx0fSxcclxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblx0XHRcclxuXHRcdFxyXG5cdFx0LyogdG9nZ2xlcyBzY3JvbGxpbmcgY2xhc3NlcyAqL1xyXG5cdFx0X29uRHJhZ0NsYXNzZXM9ZnVuY3Rpb24oZWwsYWN0aW9uLHhwbmQpe1xyXG5cdFx0XHR2YXIgZXhwYW5kQ2xhc3M9eHBuZCA/IGNsYXNzZXNbMF0rXCJfZXhwYW5kZWRcIiA6IFwiXCIsXHJcblx0XHRcdFx0c2Nyb2xsYmFyPWVsLmNsb3Nlc3QoXCIubUNTQl9zY3JvbGxUb29sc1wiKTtcclxuXHRcdFx0aWYoYWN0aW9uPT09XCJhY3RpdmVcIil7XHJcblx0XHRcdFx0ZWwudG9nZ2xlQ2xhc3MoY2xhc3Nlc1swXStcIiBcIitleHBhbmRDbGFzcyk7IHNjcm9sbGJhci50b2dnbGVDbGFzcyhjbGFzc2VzWzFdKTsgXHJcblx0XHRcdFx0ZWxbMF0uX2RyYWdnYWJsZT1lbFswXS5fZHJhZ2dhYmxlID8gMCA6IDE7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdGlmKCFlbFswXS5fZHJhZ2dhYmxlKXtcclxuXHRcdFx0XHRcdGlmKGFjdGlvbj09PVwiaGlkZVwiKXtcclxuXHRcdFx0XHRcdFx0ZWwucmVtb3ZlQ2xhc3MoY2xhc3Nlc1swXSk7IHNjcm9sbGJhci5yZW1vdmVDbGFzcyhjbGFzc2VzWzFdKTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRlbC5hZGRDbGFzcyhjbGFzc2VzWzBdKTsgc2Nyb2xsYmFyLmFkZENsYXNzKGNsYXNzZXNbMV0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblx0XHRcclxuXHRcdFxyXG5cdFx0LyogY2hlY2tzIGlmIGNvbnRlbnQgb3ZlcmZsb3dzIGl0cyBjb250YWluZXIgdG8gZGV0ZXJtaW5lIGlmIHNjcm9sbGluZyBpcyByZXF1aXJlZCAqL1xyXG5cdFx0X292ZXJmbG93ZWQ9ZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyICR0aGlzPSQodGhpcyksZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksXHJcblx0XHRcdFx0bUN1c3RvbVNjcm9sbEJveD0kKFwiI21DU0JfXCIrZC5pZHgpLFxyXG5cdFx0XHRcdG1DU0JfY29udGFpbmVyPSQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXJcIiksXHJcblx0XHRcdFx0Y29udGVudEhlaWdodD1kLm92ZXJmbG93ZWQ9PW51bGwgPyBtQ1NCX2NvbnRhaW5lci5oZWlnaHQoKSA6IG1DU0JfY29udGFpbmVyLm91dGVySGVpZ2h0KGZhbHNlKSxcclxuXHRcdFx0XHRjb250ZW50V2lkdGg9ZC5vdmVyZmxvd2VkPT1udWxsID8gbUNTQl9jb250YWluZXIud2lkdGgoKSA6IG1DU0JfY29udGFpbmVyLm91dGVyV2lkdGgoZmFsc2UpLFxyXG5cdFx0XHRcdGg9bUNTQl9jb250YWluZXJbMF0uc2Nyb2xsSGVpZ2h0LHc9bUNTQl9jb250YWluZXJbMF0uc2Nyb2xsV2lkdGg7XHJcblx0XHRcdGlmKGg+Y29udGVudEhlaWdodCl7Y29udGVudEhlaWdodD1oO31cclxuXHRcdFx0aWYodz5jb250ZW50V2lkdGgpe2NvbnRlbnRXaWR0aD13O31cclxuXHRcdFx0cmV0dXJuIFtjb250ZW50SGVpZ2h0Pm1DdXN0b21TY3JvbGxCb3guaGVpZ2h0KCksY29udGVudFdpZHRoPm1DdXN0b21TY3JvbGxCb3gud2lkdGgoKV07XHJcblx0XHR9LFxyXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHRcdFxyXG5cdFx0XHJcblx0XHQvKiByZXNldHMgY29udGVudCBwb3NpdGlvbiB0byAwICovXHJcblx0XHRfcmVzZXRDb250ZW50UG9zaXRpb249ZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyICR0aGlzPSQodGhpcyksZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksbz1kLm9wdCxcclxuXHRcdFx0XHRtQ3VzdG9tU2Nyb2xsQm94PSQoXCIjbUNTQl9cIitkLmlkeCksXHJcblx0XHRcdFx0bUNTQl9jb250YWluZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKSxcclxuXHRcdFx0XHRtQ1NCX2RyYWdnZXI9WyQoXCIjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX3ZlcnRpY2FsXCIpLCQoXCIjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX2hvcml6b250YWxcIildO1xyXG5cdFx0XHRfc3RvcCgkdGhpcyk7IC8qIHN0b3AgYW55IGN1cnJlbnQgc2Nyb2xsaW5nIGJlZm9yZSByZXNldHRpbmcgKi9cclxuXHRcdFx0aWYoKG8uYXhpcyE9PVwieFwiICYmICFkLm92ZXJmbG93ZWRbMF0pIHx8IChvLmF4aXM9PT1cInlcIiAmJiBkLm92ZXJmbG93ZWRbMF0pKXsgLyogcmVzZXQgeSAqL1xyXG5cdFx0XHRcdG1DU0JfZHJhZ2dlclswXS5hZGQobUNTQl9jb250YWluZXIpLmNzcyhcInRvcFwiLDApO1xyXG5cdFx0XHRcdF9zY3JvbGxUbygkdGhpcyxcIl9yZXNldFlcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoKG8uYXhpcyE9PVwieVwiICYmICFkLm92ZXJmbG93ZWRbMV0pIHx8IChvLmF4aXM9PT1cInhcIiAmJiBkLm92ZXJmbG93ZWRbMV0pKXsgLyogcmVzZXQgeCAqL1xyXG5cdFx0XHRcdHZhciBjeD1keD0wO1xyXG5cdFx0XHRcdGlmKGQubGFuZ0Rpcj09PVwicnRsXCIpeyAvKiBhZGp1c3QgbGVmdCBwb3NpdGlvbiBmb3IgcnRsIGRpcmVjdGlvbiAqL1xyXG5cdFx0XHRcdFx0Y3g9bUN1c3RvbVNjcm9sbEJveC53aWR0aCgpLW1DU0JfY29udGFpbmVyLm91dGVyV2lkdGgoZmFsc2UpO1xyXG5cdFx0XHRcdFx0ZHg9TWF0aC5hYnMoY3gvZC5zY3JvbGxSYXRpby54KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bUNTQl9jb250YWluZXIuY3NzKFwibGVmdFwiLGN4KTtcclxuXHRcdFx0XHRtQ1NCX2RyYWdnZXJbMV0uY3NzKFwibGVmdFwiLGR4KTtcclxuXHRcdFx0XHRfc2Nyb2xsVG8oJHRoaXMsXCJfcmVzZXRYXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHRcdFxyXG5cdFx0XHJcblx0XHQvKiBiaW5kcyBzY3JvbGxiYXIgZXZlbnRzICovXHJcblx0XHRfYmluZEV2ZW50cz1mdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgJHRoaXM9JCh0aGlzKSxkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KSxvPWQub3B0O1xyXG5cdFx0XHRpZighZC5iaW5kRXZlbnRzKXsgLyogY2hlY2sgaWYgZXZlbnRzIGFyZSBhbHJlYWR5IGJvdW5kICovXHJcblx0XHRcdFx0X2RyYWdnYWJsZS5jYWxsKHRoaXMpO1xyXG5cdFx0XHRcdGlmKG8uY29udGVudFRvdWNoU2Nyb2xsKXtfY29udGVudERyYWdnYWJsZS5jYWxsKHRoaXMpO31cclxuXHRcdFx0XHRfc2VsZWN0YWJsZS5jYWxsKHRoaXMpO1xyXG5cdFx0XHRcdGlmKG8ubW91c2VXaGVlbC5lbmFibGUpeyAvKiBiaW5kIG1vdXNld2hlZWwgZm4gd2hlbiBwbHVnaW4gaXMgYXZhaWxhYmxlICovXHJcblx0XHRcdFx0XHRmdW5jdGlvbiBfbXd0KCl7XHJcblx0XHRcdFx0XHRcdG1vdXNld2hlZWxUaW1lb3V0PXNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdFx0XHRpZighJC5ldmVudC5zcGVjaWFsLm1vdXNld2hlZWwpe1xyXG5cdFx0XHRcdFx0XHRcdFx0X213dCgpO1xyXG5cdFx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KG1vdXNld2hlZWxUaW1lb3V0KTtcclxuXHRcdFx0XHRcdFx0XHRcdF9tb3VzZXdoZWVsLmNhbGwoJHRoaXNbMF0pO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSwxMDApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0dmFyIG1vdXNld2hlZWxUaW1lb3V0O1xyXG5cdFx0XHRcdFx0X213dCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRfZHJhZ2dlclJhaWwuY2FsbCh0aGlzKTtcclxuXHRcdFx0XHRfd3JhcHBlclNjcm9sbC5jYWxsKHRoaXMpO1xyXG5cdFx0XHRcdGlmKG8uYWR2YW5jZWQuYXV0b1Njcm9sbE9uRm9jdXMpe19mb2N1cy5jYWxsKHRoaXMpO31cclxuXHRcdFx0XHRpZihvLnNjcm9sbEJ1dHRvbnMuZW5hYmxlKXtfYnV0dG9ucy5jYWxsKHRoaXMpO31cclxuXHRcdFx0XHRpZihvLmtleWJvYXJkLmVuYWJsZSl7X2tleWJvYXJkLmNhbGwodGhpcyk7fVxyXG5cdFx0XHRcdGQuYmluZEV2ZW50cz10cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHRcdFxyXG5cdFx0XHJcblx0XHQvKiB1bmJpbmRzIHNjcm9sbGJhciBldmVudHMgKi9cclxuXHRcdF91bmJpbmRFdmVudHM9ZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyICR0aGlzPSQodGhpcyksZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksbz1kLm9wdCxcclxuXHRcdFx0XHRuYW1lc3BhY2U9cGx1Z2luUGZ4K1wiX1wiK2QuaWR4LFxyXG5cdFx0XHRcdHNiPVwiLm1DU0JfXCIrZC5pZHgrXCJfc2Nyb2xsYmFyXCIsXHJcblx0XHRcdFx0c2VsPSQoXCIjbUNTQl9cIitkLmlkeCtcIiwjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXIsI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyX3dyYXBwZXIsXCIrc2IrXCIgLlwiK2NsYXNzZXNbMTJdK1wiLCNtQ1NCX1wiK2QuaWR4K1wiX2RyYWdnZXJfdmVydGljYWwsI21DU0JfXCIrZC5pZHgrXCJfZHJhZ2dlcl9ob3Jpem9udGFsLFwiK3NiK1wiPmFcIiksXHJcblx0XHRcdFx0bUNTQl9jb250YWluZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKTtcclxuXHRcdFx0aWYoby5hZHZhbmNlZC5yZWxlYXNlRHJhZ2dhYmxlU2VsZWN0b3JzKXtzZWwuYWRkKCQoby5hZHZhbmNlZC5yZWxlYXNlRHJhZ2dhYmxlU2VsZWN0b3JzKSk7fVxyXG5cdFx0XHRpZihvLmFkdmFuY2VkLmV4dHJhRHJhZ2dhYmxlU2VsZWN0b3JzKXtzZWwuYWRkKCQoby5hZHZhbmNlZC5leHRyYURyYWdnYWJsZVNlbGVjdG9ycykpO31cclxuXHRcdFx0aWYoZC5iaW5kRXZlbnRzKXsgLyogY2hlY2sgaWYgZXZlbnRzIGFyZSBib3VuZCAqL1xyXG5cdFx0XHRcdC8qIHVuYmluZCBuYW1lc3BhY2VkIGV2ZW50cyBmcm9tIGRvY3VtZW50L3NlbGVjdG9ycyAqL1xyXG5cdFx0XHRcdCQoZG9jdW1lbnQpLmFkZCgkKCFfY2FuQWNjZXNzSUZyYW1lKCkgfHwgdG9wLmRvY3VtZW50KSkudW5iaW5kKFwiLlwiK25hbWVzcGFjZSk7XHJcblx0XHRcdFx0c2VsLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdCQodGhpcykudW5iaW5kKFwiLlwiK25hbWVzcGFjZSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0LyogY2xlYXIgYW5kIGRlbGV0ZSB0aW1lb3V0cy9vYmplY3RzICovXHJcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KCR0aGlzWzBdLl9mb2N1c1RpbWVvdXQpOyBfZGVsZXRlKCR0aGlzWzBdLFwiX2ZvY3VzVGltZW91dFwiKTtcclxuXHRcdFx0XHRjbGVhclRpbWVvdXQoZC5zZXF1ZW50aWFsLnN0ZXApOyBfZGVsZXRlKGQuc2VxdWVudGlhbCxcInN0ZXBcIik7XHJcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KG1DU0JfY29udGFpbmVyWzBdLm9uQ29tcGxldGVUaW1lb3V0KTsgX2RlbGV0ZShtQ1NCX2NvbnRhaW5lclswXSxcIm9uQ29tcGxldGVUaW1lb3V0XCIpO1xyXG5cdFx0XHRcdGQuYmluZEV2ZW50cz1mYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblx0XHRcclxuXHRcdFxyXG5cdFx0LyogdG9nZ2xlcyBzY3JvbGxiYXIgdmlzaWJpbGl0eSAqL1xyXG5cdFx0X3Njcm9sbGJhclZpc2liaWxpdHk9ZnVuY3Rpb24oZGlzYWJsZWQpe1xyXG5cdFx0XHR2YXIgJHRoaXM9JCh0aGlzKSxkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KSxvPWQub3B0LFxyXG5cdFx0XHRcdGNvbnRlbnRXcmFwcGVyPSQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXJfd3JhcHBlclwiKSxcclxuXHRcdFx0XHRjb250ZW50PWNvbnRlbnRXcmFwcGVyLmxlbmd0aCA/IGNvbnRlbnRXcmFwcGVyIDogJChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKSxcclxuXHRcdFx0XHRzY3JvbGxiYXI9WyQoXCIjbUNTQl9cIitkLmlkeCtcIl9zY3JvbGxiYXJfdmVydGljYWxcIiksJChcIiNtQ1NCX1wiK2QuaWR4K1wiX3Njcm9sbGJhcl9ob3Jpem9udGFsXCIpXSxcclxuXHRcdFx0XHRtQ1NCX2RyYWdnZXI9W3Njcm9sbGJhclswXS5maW5kKFwiLm1DU0JfZHJhZ2dlclwiKSxzY3JvbGxiYXJbMV0uZmluZChcIi5tQ1NCX2RyYWdnZXJcIildO1xyXG5cdFx0XHRpZihvLmF4aXMhPT1cInhcIil7XHJcblx0XHRcdFx0aWYoZC5vdmVyZmxvd2VkWzBdICYmICFkaXNhYmxlZCl7XHJcblx0XHRcdFx0XHRzY3JvbGxiYXJbMF0uYWRkKG1DU0JfZHJhZ2dlclswXSkuYWRkKHNjcm9sbGJhclswXS5jaGlsZHJlbihcImFcIikpLmNzcyhcImRpc3BsYXlcIixcImJsb2NrXCIpO1xyXG5cdFx0XHRcdFx0Y29udGVudC5yZW1vdmVDbGFzcyhjbGFzc2VzWzhdK1wiIFwiK2NsYXNzZXNbMTBdKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGlmKG8uYWx3YXlzU2hvd1Njcm9sbGJhcil7XHJcblx0XHRcdFx0XHRcdGlmKG8uYWx3YXlzU2hvd1Njcm9sbGJhciE9PTIpe21DU0JfZHJhZ2dlclswXS5jc3MoXCJkaXNwbGF5XCIsXCJub25lXCIpO31cclxuXHRcdFx0XHRcdFx0Y29udGVudC5yZW1vdmVDbGFzcyhjbGFzc2VzWzEwXSk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0c2Nyb2xsYmFyWzBdLmNzcyhcImRpc3BsYXlcIixcIm5vbmVcIik7XHJcblx0XHRcdFx0XHRcdGNvbnRlbnQuYWRkQ2xhc3MoY2xhc3Nlc1sxMF0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y29udGVudC5hZGRDbGFzcyhjbGFzc2VzWzhdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoby5heGlzIT09XCJ5XCIpe1xyXG5cdFx0XHRcdGlmKGQub3ZlcmZsb3dlZFsxXSAmJiAhZGlzYWJsZWQpe1xyXG5cdFx0XHRcdFx0c2Nyb2xsYmFyWzFdLmFkZChtQ1NCX2RyYWdnZXJbMV0pLmFkZChzY3JvbGxiYXJbMV0uY2hpbGRyZW4oXCJhXCIpKS5jc3MoXCJkaXNwbGF5XCIsXCJibG9ja1wiKTtcclxuXHRcdFx0XHRcdGNvbnRlbnQucmVtb3ZlQ2xhc3MoY2xhc3Nlc1s5XStcIiBcIitjbGFzc2VzWzExXSk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRpZihvLmFsd2F5c1Nob3dTY3JvbGxiYXIpe1xyXG5cdFx0XHRcdFx0XHRpZihvLmFsd2F5c1Nob3dTY3JvbGxiYXIhPT0yKXttQ1NCX2RyYWdnZXJbMV0uY3NzKFwiZGlzcGxheVwiLFwibm9uZVwiKTt9XHJcblx0XHRcdFx0XHRcdGNvbnRlbnQucmVtb3ZlQ2xhc3MoY2xhc3Nlc1sxMV0pO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdHNjcm9sbGJhclsxXS5jc3MoXCJkaXNwbGF5XCIsXCJub25lXCIpO1xyXG5cdFx0XHRcdFx0XHRjb250ZW50LmFkZENsYXNzKGNsYXNzZXNbMTFdKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGNvbnRlbnQuYWRkQ2xhc3MoY2xhc3Nlc1s5XSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKCFkLm92ZXJmbG93ZWRbMF0gJiYgIWQub3ZlcmZsb3dlZFsxXSl7XHJcblx0XHRcdFx0JHRoaXMuYWRkQ2xhc3MoY2xhc3Nlc1s1XSk7XHJcblx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdCR0aGlzLnJlbW92ZUNsYXNzKGNsYXNzZXNbNV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHRcdFxyXG5cdFx0XHJcblx0XHQvKiByZXR1cm5zIGlucHV0IGNvb3JkaW5hdGVzIG9mIHBvaW50ZXIsIHRvdWNoIGFuZCBtb3VzZSBldmVudHMgKHJlbGF0aXZlIHRvIGRvY3VtZW50KSAqL1xyXG5cdFx0X2Nvb3JkaW5hdGVzPWZ1bmN0aW9uKGUpe1xyXG5cdFx0XHR2YXIgdD1lLnR5cGUsbz1lLnRhcmdldC5vd25lckRvY3VtZW50IT09ZG9jdW1lbnQgJiYgZnJhbWVFbGVtZW50IT09bnVsbCA/IFskKGZyYW1lRWxlbWVudCkub2Zmc2V0KCkudG9wLCQoZnJhbWVFbGVtZW50KS5vZmZzZXQoKS5sZWZ0XSA6IG51bGwsXHJcblx0XHRcdFx0aW89X2NhbkFjY2Vzc0lGcmFtZSgpICYmIGUudGFyZ2V0Lm93bmVyRG9jdW1lbnQhPT10b3AuZG9jdW1lbnQgJiYgZnJhbWVFbGVtZW50IT09bnVsbCA/IFskKGUudmlldy5mcmFtZUVsZW1lbnQpLm9mZnNldCgpLnRvcCwkKGUudmlldy5mcmFtZUVsZW1lbnQpLm9mZnNldCgpLmxlZnRdIDogWzAsMF07XHJcblx0XHRcdHN3aXRjaCh0KXtcclxuXHRcdFx0XHRjYXNlIFwicG9pbnRlcmRvd25cIjogY2FzZSBcIk1TUG9pbnRlckRvd25cIjogY2FzZSBcInBvaW50ZXJtb3ZlXCI6IGNhc2UgXCJNU1BvaW50ZXJNb3ZlXCI6IGNhc2UgXCJwb2ludGVydXBcIjogY2FzZSBcIk1TUG9pbnRlclVwXCI6XHJcblx0XHRcdFx0XHRyZXR1cm4gbyA/IFtlLm9yaWdpbmFsRXZlbnQucGFnZVktb1swXStpb1swXSxlLm9yaWdpbmFsRXZlbnQucGFnZVgtb1sxXStpb1sxXSxmYWxzZV0gOiBbZS5vcmlnaW5hbEV2ZW50LnBhZ2VZLGUub3JpZ2luYWxFdmVudC5wYWdlWCxmYWxzZV07XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIFwidG91Y2hzdGFydFwiOiBjYXNlIFwidG91Y2htb3ZlXCI6IGNhc2UgXCJ0b3VjaGVuZFwiOlxyXG5cdFx0XHRcdFx0dmFyIHRvdWNoPWUub3JpZ2luYWxFdmVudC50b3VjaGVzWzBdIHx8IGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlc1swXSxcclxuXHRcdFx0XHRcdFx0dG91Y2hlcz1lLm9yaWdpbmFsRXZlbnQudG91Y2hlcy5sZW5ndGggfHwgZS5vcmlnaW5hbEV2ZW50LmNoYW5nZWRUb3VjaGVzLmxlbmd0aDtcclxuXHRcdFx0XHRcdHJldHVybiBlLnRhcmdldC5vd25lckRvY3VtZW50IT09ZG9jdW1lbnQgPyBbdG91Y2guc2NyZWVuWSx0b3VjaC5zY3JlZW5YLHRvdWNoZXM+MV0gOiBbdG91Y2gucGFnZVksdG91Y2gucGFnZVgsdG91Y2hlcz4xXTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRyZXR1cm4gbyA/IFtlLnBhZ2VZLW9bMF0raW9bMF0sZS5wYWdlWC1vWzFdK2lvWzFdLGZhbHNlXSA6IFtlLnBhZ2VZLGUucGFnZVgsZmFsc2VdO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHRcdFxyXG5cdFx0XHJcblx0XHQvKiBcclxuXHRcdFNDUk9MTEJBUiBEUkFHIEVWRU5UU1xyXG5cdFx0c2Nyb2xscyBjb250ZW50IHZpYSBzY3JvbGxiYXIgZHJhZ2dpbmcgXHJcblx0XHQqL1xyXG5cdFx0X2RyYWdnYWJsZT1mdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgJHRoaXM9JCh0aGlzKSxkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KSxvPWQub3B0LFxyXG5cdFx0XHRcdG5hbWVzcGFjZT1wbHVnaW5QZngrXCJfXCIrZC5pZHgsXHJcblx0XHRcdFx0ZHJhZ2dlcklkPVtcIm1DU0JfXCIrZC5pZHgrXCJfZHJhZ2dlcl92ZXJ0aWNhbFwiLFwibUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX2hvcml6b250YWxcIl0sXHJcblx0XHRcdFx0bUNTQl9jb250YWluZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKSxcclxuXHRcdFx0XHRtQ1NCX2RyYWdnZXI9JChcIiNcIitkcmFnZ2VySWRbMF0rXCIsI1wiK2RyYWdnZXJJZFsxXSksXHJcblx0XHRcdFx0ZHJhZ2dhYmxlLGRyYWdZLGRyYWdYLFxyXG5cdFx0XHRcdHJkcz1vLmFkdmFuY2VkLnJlbGVhc2VEcmFnZ2FibGVTZWxlY3RvcnMgPyBtQ1NCX2RyYWdnZXIuYWRkKCQoby5hZHZhbmNlZC5yZWxlYXNlRHJhZ2dhYmxlU2VsZWN0b3JzKSkgOiBtQ1NCX2RyYWdnZXIsXHJcblx0XHRcdFx0ZWRzPW8uYWR2YW5jZWQuZXh0cmFEcmFnZ2FibGVTZWxlY3RvcnMgPyAkKCFfY2FuQWNjZXNzSUZyYW1lKCkgfHwgdG9wLmRvY3VtZW50KS5hZGQoJChvLmFkdmFuY2VkLmV4dHJhRHJhZ2dhYmxlU2VsZWN0b3JzKSkgOiAkKCFfY2FuQWNjZXNzSUZyYW1lKCkgfHwgdG9wLmRvY3VtZW50KTtcclxuXHRcdFx0bUNTQl9kcmFnZ2VyLmJpbmQoXCJjb250ZXh0bWVudS5cIituYW1lc3BhY2UsZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpOyAvL3ByZXZlbnQgcmlnaHQgY2xpY2tcclxuXHRcdFx0fSkuYmluZChcIm1vdXNlZG93bi5cIituYW1lc3BhY2UrXCIgdG91Y2hzdGFydC5cIituYW1lc3BhY2UrXCIgcG9pbnRlcmRvd24uXCIrbmFtZXNwYWNlK1wiIE1TUG9pbnRlckRvd24uXCIrbmFtZXNwYWNlLGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdGlmKCFfbW91c2VCdG5MZWZ0KGUpKXtyZXR1cm47fSAvKiBsZWZ0IG1vdXNlIGJ1dHRvbiBvbmx5ICovXHJcblx0XHRcdFx0dG91Y2hBY3RpdmU9dHJ1ZTtcclxuXHRcdFx0XHRpZihvbGRJRSl7ZG9jdW1lbnQub25zZWxlY3RzdGFydD1mdW5jdGlvbigpe3JldHVybiBmYWxzZTt9fSAvKiBkaXNhYmxlIHRleHQgc2VsZWN0aW9uIGZvciBJRSA8IDkgKi9cclxuXHRcdFx0XHRfaWZyYW1lLmNhbGwobUNTQl9jb250YWluZXIsZmFsc2UpOyAvKiBlbmFibGUgc2Nyb2xsYmFyIGRyYWdnaW5nIG92ZXIgaWZyYW1lcyBieSBkaXNhYmxpbmcgdGhlaXIgZXZlbnRzICovXHJcblx0XHRcdFx0X3N0b3AoJHRoaXMpO1xyXG5cdFx0XHRcdGRyYWdnYWJsZT0kKHRoaXMpO1xyXG5cdFx0XHRcdHZhciBvZmZzZXQ9ZHJhZ2dhYmxlLm9mZnNldCgpLHk9X2Nvb3JkaW5hdGVzKGUpWzBdLW9mZnNldC50b3AseD1fY29vcmRpbmF0ZXMoZSlbMV0tb2Zmc2V0LmxlZnQsXHJcblx0XHRcdFx0XHRoPWRyYWdnYWJsZS5oZWlnaHQoKStvZmZzZXQudG9wLHc9ZHJhZ2dhYmxlLndpZHRoKCkrb2Zmc2V0LmxlZnQ7XHJcblx0XHRcdFx0aWYoeTxoICYmIHk+MCAmJiB4PHcgJiYgeD4wKXtcclxuXHRcdFx0XHRcdGRyYWdZPXk7IFxyXG5cdFx0XHRcdFx0ZHJhZ1g9eDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0X29uRHJhZ0NsYXNzZXMoZHJhZ2dhYmxlLFwiYWN0aXZlXCIsby5hdXRvRXhwYW5kU2Nyb2xsYmFyKTsgXHJcblx0XHRcdH0pLmJpbmQoXCJ0b3VjaG1vdmUuXCIrbmFtZXNwYWNlLGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdHZhciBvZmZzZXQ9ZHJhZ2dhYmxlLm9mZnNldCgpLHk9X2Nvb3JkaW5hdGVzKGUpWzBdLW9mZnNldC50b3AseD1fY29vcmRpbmF0ZXMoZSlbMV0tb2Zmc2V0LmxlZnQ7XHJcblx0XHRcdFx0X2RyYWcoZHJhZ1ksZHJhZ1gseSx4KTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdCQoZG9jdW1lbnQpLmFkZChlZHMpLmJpbmQoXCJtb3VzZW1vdmUuXCIrbmFtZXNwYWNlK1wiIHBvaW50ZXJtb3ZlLlwiK25hbWVzcGFjZStcIiBNU1BvaW50ZXJNb3ZlLlwiK25hbWVzcGFjZSxmdW5jdGlvbihlKXtcclxuXHRcdFx0XHRpZihkcmFnZ2FibGUpe1xyXG5cdFx0XHRcdFx0dmFyIG9mZnNldD1kcmFnZ2FibGUub2Zmc2V0KCkseT1fY29vcmRpbmF0ZXMoZSlbMF0tb2Zmc2V0LnRvcCx4PV9jb29yZGluYXRlcyhlKVsxXS1vZmZzZXQubGVmdDtcclxuXHRcdFx0XHRcdGlmKGRyYWdZPT09eSAmJiBkcmFnWD09PXgpe3JldHVybjt9IC8qIGhhcyBpdCByZWFsbHkgbW92ZWQ/ICovXHJcblx0XHRcdFx0XHRfZHJhZyhkcmFnWSxkcmFnWCx5LHgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSkuYWRkKHJkcykuYmluZChcIm1vdXNldXAuXCIrbmFtZXNwYWNlK1wiIHRvdWNoZW5kLlwiK25hbWVzcGFjZStcIiBwb2ludGVydXAuXCIrbmFtZXNwYWNlK1wiIE1TUG9pbnRlclVwLlwiK25hbWVzcGFjZSxmdW5jdGlvbihlKXtcclxuXHRcdFx0XHRpZihkcmFnZ2FibGUpe1xyXG5cdFx0XHRcdFx0X29uRHJhZ0NsYXNzZXMoZHJhZ2dhYmxlLFwiYWN0aXZlXCIsby5hdXRvRXhwYW5kU2Nyb2xsYmFyKTsgXHJcblx0XHRcdFx0XHRkcmFnZ2FibGU9bnVsbDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dG91Y2hBY3RpdmU9ZmFsc2U7XHJcblx0XHRcdFx0aWYob2xkSUUpe2RvY3VtZW50Lm9uc2VsZWN0c3RhcnQ9bnVsbDt9IC8qIGVuYWJsZSB0ZXh0IHNlbGVjdGlvbiBmb3IgSUUgPCA5ICovXHJcblx0XHRcdFx0X2lmcmFtZS5jYWxsKG1DU0JfY29udGFpbmVyLHRydWUpOyAvKiBlbmFibGUgaWZyYW1lcyBldmVudHMgKi9cclxuXHRcdFx0fSk7XHJcblx0XHRcdGZ1bmN0aW9uIF9kcmFnKGRyYWdZLGRyYWdYLHkseCl7XHJcblx0XHRcdFx0bUNTQl9jb250YWluZXJbMF0uaWRsZVRpbWVyPW8uc2Nyb2xsSW5lcnRpYTwyMzMgPyAyNTAgOiAwO1xyXG5cdFx0XHRcdGlmKGRyYWdnYWJsZS5hdHRyKFwiaWRcIik9PT1kcmFnZ2VySWRbMV0pe1xyXG5cdFx0XHRcdFx0dmFyIGRpcj1cInhcIix0bz0oKGRyYWdnYWJsZVswXS5vZmZzZXRMZWZ0LWRyYWdYKSt4KSpkLnNjcm9sbFJhdGlvLng7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHR2YXIgZGlyPVwieVwiLHRvPSgoZHJhZ2dhYmxlWzBdLm9mZnNldFRvcC1kcmFnWSkreSkqZC5zY3JvbGxSYXRpby55O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRfc2Nyb2xsVG8oJHRoaXMsdG8udG9TdHJpbmcoKSx7ZGlyOmRpcixkcmFnOnRydWV9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblx0XHRcclxuXHRcdFxyXG5cdFx0LyogXHJcblx0XHRUT1VDSCBTV0lQRSBFVkVOVFNcclxuXHRcdHNjcm9sbHMgY29udGVudCB2aWEgdG91Y2ggc3dpcGUgXHJcblx0XHRFbXVsYXRlcyB0aGUgbmF0aXZlIHRvdWNoLXN3aXBlIHNjcm9sbGluZyB3aXRoIG1vbWVudHVtIGZvdW5kIGluIGlPUywgQW5kcm9pZCBhbmQgV1AgZGV2aWNlcyBcclxuXHRcdCovXHJcblx0XHRfY29udGVudERyYWdnYWJsZT1mdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgJHRoaXM9JCh0aGlzKSxkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KSxvPWQub3B0LFxyXG5cdFx0XHRcdG5hbWVzcGFjZT1wbHVnaW5QZngrXCJfXCIrZC5pZHgsXHJcblx0XHRcdFx0bUN1c3RvbVNjcm9sbEJveD0kKFwiI21DU0JfXCIrZC5pZHgpLFxyXG5cdFx0XHRcdG1DU0JfY29udGFpbmVyPSQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXJcIiksXHJcblx0XHRcdFx0bUNTQl9kcmFnZ2VyPVskKFwiI21DU0JfXCIrZC5pZHgrXCJfZHJhZ2dlcl92ZXJ0aWNhbFwiKSwkKFwiI21DU0JfXCIrZC5pZHgrXCJfZHJhZ2dlcl9ob3Jpem9udGFsXCIpXSxcclxuXHRcdFx0XHRkcmFnZ2FibGUsZHJhZ1ksZHJhZ1gsdG91Y2hTdGFydFksdG91Y2hTdGFydFgsdG91Y2hNb3ZlWT1bXSx0b3VjaE1vdmVYPVtdLHN0YXJ0VGltZSxydW5uaW5nVGltZSxlbmRUaW1lLGRpc3RhbmNlLHNwZWVkLGFtb3VudCxcclxuXHRcdFx0XHRkdXJBPTAsZHVyQixvdmVyd3JpdGU9by5heGlzPT09XCJ5eFwiID8gXCJub25lXCIgOiBcImFsbFwiLHRvdWNoSW50ZW50PVtdLHRvdWNoRHJhZyxkb2NEcmFnLFxyXG5cdFx0XHRcdGlmcmFtZT1tQ1NCX2NvbnRhaW5lci5maW5kKFwiaWZyYW1lXCIpLFxyXG5cdFx0XHRcdGV2ZW50cz1bXHJcblx0XHRcdFx0XHRcInRvdWNoc3RhcnQuXCIrbmFtZXNwYWNlK1wiIHBvaW50ZXJkb3duLlwiK25hbWVzcGFjZStcIiBNU1BvaW50ZXJEb3duLlwiK25hbWVzcGFjZSwgLy9zdGFydFxyXG5cdFx0XHRcdFx0XCJ0b3VjaG1vdmUuXCIrbmFtZXNwYWNlK1wiIHBvaW50ZXJtb3ZlLlwiK25hbWVzcGFjZStcIiBNU1BvaW50ZXJNb3ZlLlwiK25hbWVzcGFjZSwgLy9tb3ZlXHJcblx0XHRcdFx0XHRcInRvdWNoZW5kLlwiK25hbWVzcGFjZStcIiBwb2ludGVydXAuXCIrbmFtZXNwYWNlK1wiIE1TUG9pbnRlclVwLlwiK25hbWVzcGFjZSAvL2VuZFxyXG5cdFx0XHRcdF0sXHJcblx0XHRcdFx0dG91Y2hBY3Rpb249ZG9jdW1lbnQuYm9keS5zdHlsZS50b3VjaEFjdGlvbiE9PXVuZGVmaW5lZCAmJiBkb2N1bWVudC5ib2R5LnN0eWxlLnRvdWNoQWN0aW9uIT09XCJcIjtcclxuXHRcdFx0bUNTQl9jb250YWluZXIuYmluZChldmVudHNbMF0sZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0X29uVG91Y2hzdGFydChlKTtcclxuXHRcdFx0fSkuYmluZChldmVudHNbMV0sZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0X29uVG91Y2htb3ZlKGUpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0bUN1c3RvbVNjcm9sbEJveC5iaW5kKGV2ZW50c1swXSxmdW5jdGlvbihlKXtcclxuXHRcdFx0XHRfb25Ub3VjaHN0YXJ0MihlKTtcclxuXHRcdFx0fSkuYmluZChldmVudHNbMl0sZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0X29uVG91Y2hlbmQoZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRpZihpZnJhbWUubGVuZ3RoKXtcclxuXHRcdFx0XHRpZnJhbWUuZWFjaChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0JCh0aGlzKS5iaW5kKFwibG9hZFwiLGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcdC8qIGJpbmQgZXZlbnRzIG9uIGFjY2Vzc2libGUgaWZyYW1lcyAqL1xyXG5cdFx0XHRcdFx0XHRpZihfY2FuQWNjZXNzSUZyYW1lKHRoaXMpKXtcclxuXHRcdFx0XHRcdFx0XHQkKHRoaXMuY29udGVudERvY3VtZW50IHx8IHRoaXMuY29udGVudFdpbmRvdy5kb2N1bWVudCkuYmluZChldmVudHNbMF0sZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0XHRcdFx0XHRfb25Ub3VjaHN0YXJ0KGUpO1xyXG5cdFx0XHRcdFx0XHRcdFx0X29uVG91Y2hzdGFydDIoZSk7XHJcblx0XHRcdFx0XHRcdFx0fSkuYmluZChldmVudHNbMV0sZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0XHRcdFx0XHRfb25Ub3VjaG1vdmUoZSk7XHJcblx0XHRcdFx0XHRcdFx0fSkuYmluZChldmVudHNbMl0sZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0XHRcdFx0XHRfb25Ub3VjaGVuZChlKTtcclxuXHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gX29uVG91Y2hzdGFydChlKXtcclxuXHRcdFx0XHRpZighX3BvaW50ZXJUb3VjaChlKSB8fCB0b3VjaEFjdGl2ZSB8fCBfY29vcmRpbmF0ZXMoZSlbMl0pe3RvdWNoYWJsZT0wOyByZXR1cm47fVxyXG5cdFx0XHRcdHRvdWNoYWJsZT0xOyB0b3VjaERyYWc9MDsgZG9jRHJhZz0wOyBkcmFnZ2FibGU9MTtcclxuXHRcdFx0XHQkdGhpcy5yZW1vdmVDbGFzcyhcIm1DU190b3VjaF9hY3Rpb25cIik7XHJcblx0XHRcdFx0dmFyIG9mZnNldD1tQ1NCX2NvbnRhaW5lci5vZmZzZXQoKTtcclxuXHRcdFx0XHRkcmFnWT1fY29vcmRpbmF0ZXMoZSlbMF0tb2Zmc2V0LnRvcDtcclxuXHRcdFx0XHRkcmFnWD1fY29vcmRpbmF0ZXMoZSlbMV0tb2Zmc2V0LmxlZnQ7XHJcblx0XHRcdFx0dG91Y2hJbnRlbnQ9W19jb29yZGluYXRlcyhlKVswXSxfY29vcmRpbmF0ZXMoZSlbMV1dO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIF9vblRvdWNobW92ZShlKXtcclxuXHRcdFx0XHRpZighX3BvaW50ZXJUb3VjaChlKSB8fCB0b3VjaEFjdGl2ZSB8fCBfY29vcmRpbmF0ZXMoZSlbMl0pe3JldHVybjt9XHJcblx0XHRcdFx0aWYoIW8uZG9jdW1lbnRUb3VjaFNjcm9sbCl7ZS5wcmV2ZW50RGVmYXVsdCgpO30gXHJcblx0XHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0XHRpZihkb2NEcmFnICYmICF0b3VjaERyYWcpe3JldHVybjt9XHJcblx0XHRcdFx0aWYoZHJhZ2dhYmxlKXtcclxuXHRcdFx0XHRcdHJ1bm5pbmdUaW1lPV9nZXRUaW1lKCk7XHJcblx0XHRcdFx0XHR2YXIgb2Zmc2V0PW1DdXN0b21TY3JvbGxCb3gub2Zmc2V0KCkseT1fY29vcmRpbmF0ZXMoZSlbMF0tb2Zmc2V0LnRvcCx4PV9jb29yZGluYXRlcyhlKVsxXS1vZmZzZXQubGVmdCxcclxuXHRcdFx0XHRcdFx0ZWFzaW5nPVwibWNzTGluZWFyT3V0XCI7XHJcblx0XHRcdFx0XHR0b3VjaE1vdmVZLnB1c2goeSk7XHJcblx0XHRcdFx0XHR0b3VjaE1vdmVYLnB1c2goeCk7XHJcblx0XHRcdFx0XHR0b3VjaEludGVudFsyXT1NYXRoLmFicyhfY29vcmRpbmF0ZXMoZSlbMF0tdG91Y2hJbnRlbnRbMF0pOyB0b3VjaEludGVudFszXT1NYXRoLmFicyhfY29vcmRpbmF0ZXMoZSlbMV0tdG91Y2hJbnRlbnRbMV0pO1xyXG5cdFx0XHRcdFx0aWYoZC5vdmVyZmxvd2VkWzBdKXtcclxuXHRcdFx0XHRcdFx0dmFyIGxpbWl0PW1DU0JfZHJhZ2dlclswXS5wYXJlbnQoKS5oZWlnaHQoKS1tQ1NCX2RyYWdnZXJbMF0uaGVpZ2h0KCksXHJcblx0XHRcdFx0XHRcdFx0cHJldmVudD0oKGRyYWdZLXkpPjAgJiYgKHktZHJhZ1kpPi0obGltaXQqZC5zY3JvbGxSYXRpby55KSAmJiAodG91Y2hJbnRlbnRbM10qMjx0b3VjaEludGVudFsyXSB8fCBvLmF4aXM9PT1cInl4XCIpKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmKGQub3ZlcmZsb3dlZFsxXSl7XHJcblx0XHRcdFx0XHRcdHZhciBsaW1pdFg9bUNTQl9kcmFnZ2VyWzFdLnBhcmVudCgpLndpZHRoKCktbUNTQl9kcmFnZ2VyWzFdLndpZHRoKCksXHJcblx0XHRcdFx0XHRcdFx0cHJldmVudFg9KChkcmFnWC14KT4wICYmICh4LWRyYWdYKT4tKGxpbWl0WCpkLnNjcm9sbFJhdGlvLngpICYmICh0b3VjaEludGVudFsyXSoyPHRvdWNoSW50ZW50WzNdIHx8IG8uYXhpcz09PVwieXhcIikpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYocHJldmVudCB8fCBwcmV2ZW50WCl7IC8qIHByZXZlbnQgbmF0aXZlIGRvY3VtZW50IHNjcm9sbGluZyAqL1xyXG5cdFx0XHRcdFx0XHRpZighdG91Y2hBY3Rpb24pe2UucHJldmVudERlZmF1bHQoKTt9IFxyXG5cdFx0XHRcdFx0XHR0b3VjaERyYWc9MTtcclxuXHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRkb2NEcmFnPTE7XHJcblx0XHRcdFx0XHRcdCR0aGlzLmFkZENsYXNzKFwibUNTX3RvdWNoX2FjdGlvblwiKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmKHRvdWNoQWN0aW9uKXtlLnByZXZlbnREZWZhdWx0KCk7fSBcclxuXHRcdFx0XHRcdGFtb3VudD1vLmF4aXM9PT1cInl4XCIgPyBbKGRyYWdZLXkpLChkcmFnWC14KV0gOiBvLmF4aXM9PT1cInhcIiA/IFtudWxsLChkcmFnWC14KV0gOiBbKGRyYWdZLXkpLG51bGxdO1xyXG5cdFx0XHRcdFx0bUNTQl9jb250YWluZXJbMF0uaWRsZVRpbWVyPTI1MDtcclxuXHRcdFx0XHRcdGlmKGQub3ZlcmZsb3dlZFswXSl7X2RyYWcoYW1vdW50WzBdLGR1ckEsZWFzaW5nLFwieVwiLFwiYWxsXCIsdHJ1ZSk7fVxyXG5cdFx0XHRcdFx0aWYoZC5vdmVyZmxvd2VkWzFdKXtfZHJhZyhhbW91bnRbMV0sZHVyQSxlYXNpbmcsXCJ4XCIsb3ZlcndyaXRlLHRydWUpO31cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gX29uVG91Y2hzdGFydDIoZSl7XHJcblx0XHRcdFx0aWYoIV9wb2ludGVyVG91Y2goZSkgfHwgdG91Y2hBY3RpdmUgfHwgX2Nvb3JkaW5hdGVzKGUpWzJdKXt0b3VjaGFibGU9MDsgcmV0dXJuO31cclxuXHRcdFx0XHR0b3VjaGFibGU9MTtcclxuXHRcdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHRcdF9zdG9wKCR0aGlzKTtcclxuXHRcdFx0XHRzdGFydFRpbWU9X2dldFRpbWUoKTtcclxuXHRcdFx0XHR2YXIgb2Zmc2V0PW1DdXN0b21TY3JvbGxCb3gub2Zmc2V0KCk7XHJcblx0XHRcdFx0dG91Y2hTdGFydFk9X2Nvb3JkaW5hdGVzKGUpWzBdLW9mZnNldC50b3A7XHJcblx0XHRcdFx0dG91Y2hTdGFydFg9X2Nvb3JkaW5hdGVzKGUpWzFdLW9mZnNldC5sZWZ0O1xyXG5cdFx0XHRcdHRvdWNoTW92ZVk9W107IHRvdWNoTW92ZVg9W107XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gX29uVG91Y2hlbmQoZSl7XHJcblx0XHRcdFx0aWYoIV9wb2ludGVyVG91Y2goZSkgfHwgdG91Y2hBY3RpdmUgfHwgX2Nvb3JkaW5hdGVzKGUpWzJdKXtyZXR1cm47fVxyXG5cdFx0XHRcdGRyYWdnYWJsZT0wO1xyXG5cdFx0XHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdFx0dG91Y2hEcmFnPTA7IGRvY0RyYWc9MDtcclxuXHRcdFx0XHRlbmRUaW1lPV9nZXRUaW1lKCk7XHJcblx0XHRcdFx0dmFyIG9mZnNldD1tQ3VzdG9tU2Nyb2xsQm94Lm9mZnNldCgpLHk9X2Nvb3JkaW5hdGVzKGUpWzBdLW9mZnNldC50b3AseD1fY29vcmRpbmF0ZXMoZSlbMV0tb2Zmc2V0LmxlZnQ7XHJcblx0XHRcdFx0aWYoKGVuZFRpbWUtcnVubmluZ1RpbWUpPjMwKXtyZXR1cm47fVxyXG5cdFx0XHRcdHNwZWVkPTEwMDAvKGVuZFRpbWUtc3RhcnRUaW1lKTtcclxuXHRcdFx0XHR2YXIgZWFzaW5nPVwibWNzRWFzZU91dFwiLHNsb3c9c3BlZWQ8Mi41LFxyXG5cdFx0XHRcdFx0ZGlmZj1zbG93ID8gW3RvdWNoTW92ZVlbdG91Y2hNb3ZlWS5sZW5ndGgtMl0sdG91Y2hNb3ZlWFt0b3VjaE1vdmVYLmxlbmd0aC0yXV0gOiBbMCwwXTtcclxuXHRcdFx0XHRkaXN0YW5jZT1zbG93ID8gWyh5LWRpZmZbMF0pLCh4LWRpZmZbMV0pXSA6IFt5LXRvdWNoU3RhcnRZLHgtdG91Y2hTdGFydFhdO1xyXG5cdFx0XHRcdHZhciBhYnNEaXN0YW5jZT1bTWF0aC5hYnMoZGlzdGFuY2VbMF0pLE1hdGguYWJzKGRpc3RhbmNlWzFdKV07XHJcblx0XHRcdFx0c3BlZWQ9c2xvdyA/IFtNYXRoLmFicyhkaXN0YW5jZVswXS80KSxNYXRoLmFicyhkaXN0YW5jZVsxXS80KV0gOiBbc3BlZWQsc3BlZWRdO1xyXG5cdFx0XHRcdHZhciBhPVtcclxuXHRcdFx0XHRcdE1hdGguYWJzKG1DU0JfY29udGFpbmVyWzBdLm9mZnNldFRvcCktKGRpc3RhbmNlWzBdKl9tKChhYnNEaXN0YW5jZVswXS9zcGVlZFswXSksc3BlZWRbMF0pKSxcclxuXHRcdFx0XHRcdE1hdGguYWJzKG1DU0JfY29udGFpbmVyWzBdLm9mZnNldExlZnQpLShkaXN0YW5jZVsxXSpfbSgoYWJzRGlzdGFuY2VbMV0vc3BlZWRbMV0pLHNwZWVkWzFdKSlcclxuXHRcdFx0XHRdO1xyXG5cdFx0XHRcdGFtb3VudD1vLmF4aXM9PT1cInl4XCIgPyBbYVswXSxhWzFdXSA6IG8uYXhpcz09PVwieFwiID8gW251bGwsYVsxXV0gOiBbYVswXSxudWxsXTtcclxuXHRcdFx0XHRkdXJCPVsoYWJzRGlzdGFuY2VbMF0qNCkrby5zY3JvbGxJbmVydGlhLChhYnNEaXN0YW5jZVsxXSo0KStvLnNjcm9sbEluZXJ0aWFdO1xyXG5cdFx0XHRcdHZhciBtZD1wYXJzZUludChvLmNvbnRlbnRUb3VjaFNjcm9sbCkgfHwgMDsgLyogYWJzb2x1dGUgbWluaW11bSBkaXN0YW5jZSByZXF1aXJlZCAqL1xyXG5cdFx0XHRcdGFtb3VudFswXT1hYnNEaXN0YW5jZVswXT5tZCA/IGFtb3VudFswXSA6IDA7XHJcblx0XHRcdFx0YW1vdW50WzFdPWFic0Rpc3RhbmNlWzFdPm1kID8gYW1vdW50WzFdIDogMDtcclxuXHRcdFx0XHRpZihkLm92ZXJmbG93ZWRbMF0pe19kcmFnKGFtb3VudFswXSxkdXJCWzBdLGVhc2luZyxcInlcIixvdmVyd3JpdGUsZmFsc2UpO31cclxuXHRcdFx0XHRpZihkLm92ZXJmbG93ZWRbMV0pe19kcmFnKGFtb3VudFsxXSxkdXJCWzFdLGVhc2luZyxcInhcIixvdmVyd3JpdGUsZmFsc2UpO31cclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBfbShkcyxzKXtcclxuXHRcdFx0XHR2YXIgcj1bcyoxLjUscyoyLHMvMS41LHMvMl07XHJcblx0XHRcdFx0aWYoZHM+OTApe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHM+NCA/IHJbMF0gOiByWzNdO1xyXG5cdFx0XHRcdH1lbHNlIGlmKGRzPjYwKXtcclxuXHRcdFx0XHRcdHJldHVybiBzPjMgPyByWzNdIDogclsyXTtcclxuXHRcdFx0XHR9ZWxzZSBpZihkcz4zMCl7XHJcblx0XHRcdFx0XHRyZXR1cm4gcz44ID8gclsxXSA6IHM+NiA/IHJbMF0gOiBzPjQgPyBzIDogclsyXTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdHJldHVybiBzPjggPyBzIDogclszXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gX2RyYWcoYW1vdW50LGR1cixlYXNpbmcsZGlyLG92ZXJ3cml0ZSxkcmFnKXtcclxuXHRcdFx0XHRpZighYW1vdW50KXtyZXR1cm47fVxyXG5cdFx0XHRcdF9zY3JvbGxUbygkdGhpcyxhbW91bnQudG9TdHJpbmcoKSx7ZHVyOmR1cixzY3JvbGxFYXNpbmc6ZWFzaW5nLGRpcjpkaXIsb3ZlcndyaXRlOm92ZXJ3cml0ZSxkcmFnOmRyYWd9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblx0XHRcclxuXHRcdFxyXG5cdFx0LyogXHJcblx0XHRTRUxFQ1QgVEVYVCBFVkVOVFMgXHJcblx0XHRzY3JvbGxzIGNvbnRlbnQgd2hlbiB0ZXh0IGlzIHNlbGVjdGVkIFxyXG5cdFx0Ki9cclxuXHRcdF9zZWxlY3RhYmxlPWZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciAkdGhpcz0kKHRoaXMpLGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsc2VxPWQuc2VxdWVudGlhbCxcclxuXHRcdFx0XHRuYW1lc3BhY2U9cGx1Z2luUGZ4K1wiX1wiK2QuaWR4LFxyXG5cdFx0XHRcdG1DU0JfY29udGFpbmVyPSQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXJcIiksXHJcblx0XHRcdFx0d3JhcHBlcj1tQ1NCX2NvbnRhaW5lci5wYXJlbnQoKSxcclxuXHRcdFx0XHRhY3Rpb247XHJcblx0XHRcdG1DU0JfY29udGFpbmVyLmJpbmQoXCJtb3VzZWRvd24uXCIrbmFtZXNwYWNlLGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRcdGlmKHRvdWNoYWJsZSl7cmV0dXJuO31cclxuXHRcdFx0XHRpZighYWN0aW9uKXthY3Rpb249MTsgdG91Y2hBY3RpdmU9dHJ1ZTt9XHJcblx0XHRcdH0pLmFkZChkb2N1bWVudCkuYmluZChcIm1vdXNlbW92ZS5cIituYW1lc3BhY2UsZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0aWYoIXRvdWNoYWJsZSAmJiBhY3Rpb24gJiYgX3NlbCgpKXtcclxuXHRcdFx0XHRcdHZhciBvZmZzZXQ9bUNTQl9jb250YWluZXIub2Zmc2V0KCksXHJcblx0XHRcdFx0XHRcdHk9X2Nvb3JkaW5hdGVzKGUpWzBdLW9mZnNldC50b3ArbUNTQl9jb250YWluZXJbMF0ub2Zmc2V0VG9wLHg9X2Nvb3JkaW5hdGVzKGUpWzFdLW9mZnNldC5sZWZ0K21DU0JfY29udGFpbmVyWzBdLm9mZnNldExlZnQ7XHJcblx0XHRcdFx0XHRpZih5PjAgJiYgeTx3cmFwcGVyLmhlaWdodCgpICYmIHg+MCAmJiB4PHdyYXBwZXIud2lkdGgoKSl7XHJcblx0XHRcdFx0XHRcdGlmKHNlcS5zdGVwKXtfc2VxKFwib2ZmXCIsbnVsbCxcInN0ZXBwZWRcIik7fVxyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGlmKG8uYXhpcyE9PVwieFwiICYmIGQub3ZlcmZsb3dlZFswXSl7XHJcblx0XHRcdFx0XHRcdFx0aWYoeTwwKXtcclxuXHRcdFx0XHRcdFx0XHRcdF9zZXEoXCJvblwiLDM4KTtcclxuXHRcdFx0XHRcdFx0XHR9ZWxzZSBpZih5PndyYXBwZXIuaGVpZ2h0KCkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0X3NlcShcIm9uXCIsNDApO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRpZihvLmF4aXMhPT1cInlcIiAmJiBkLm92ZXJmbG93ZWRbMV0pe1xyXG5cdFx0XHRcdFx0XHRcdGlmKHg8MCl7XHJcblx0XHRcdFx0XHRcdFx0XHRfc2VxKFwib25cIiwzNyk7XHJcblx0XHRcdFx0XHRcdFx0fWVsc2UgaWYoeD53cmFwcGVyLndpZHRoKCkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0X3NlcShcIm9uXCIsMzkpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSkuYmluZChcIm1vdXNldXAuXCIrbmFtZXNwYWNlK1wiIGRyYWdlbmQuXCIrbmFtZXNwYWNlLGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRcdGlmKHRvdWNoYWJsZSl7cmV0dXJuO31cclxuXHRcdFx0XHRpZihhY3Rpb24pe2FjdGlvbj0wOyBfc2VxKFwib2ZmXCIsbnVsbCk7fVxyXG5cdFx0XHRcdHRvdWNoQWN0aXZlPWZhbHNlO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0ZnVuY3Rpb24gX3NlbCgpe1xyXG5cdFx0XHRcdHJldHVybiBcdHdpbmRvdy5nZXRTZWxlY3Rpb24gPyB3aW5kb3cuZ2V0U2VsZWN0aW9uKCkudG9TdHJpbmcoKSA6IFxyXG5cdFx0XHRcdFx0XHRkb2N1bWVudC5zZWxlY3Rpb24gJiYgZG9jdW1lbnQuc2VsZWN0aW9uLnR5cGUhPVwiQ29udHJvbFwiID8gZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCkudGV4dCA6IDA7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gX3NlcShhLGMscyl7XHJcblx0XHRcdFx0c2VxLnR5cGU9cyAmJiBhY3Rpb24gPyBcInN0ZXBwZWRcIiA6IFwic3RlcGxlc3NcIjtcclxuXHRcdFx0XHRzZXEuc2Nyb2xsQW1vdW50PTEwO1xyXG5cdFx0XHRcdF9zZXF1ZW50aWFsU2Nyb2xsKCR0aGlzLGEsYyxcIm1jc0xpbmVhck91dFwiLHMgPyA2MCA6IG51bGwpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHRcdFxyXG5cdFx0XHJcblx0XHQvKiBcclxuXHRcdE1PVVNFIFdIRUVMIEVWRU5UXHJcblx0XHRzY3JvbGxzIGNvbnRlbnQgdmlhIG1vdXNlLXdoZWVsIFxyXG5cdFx0dmlhIG1vdXNlLXdoZWVsIHBsdWdpbiAoaHR0cHM6Ly9naXRodWIuY29tL2JyYW5kb25hYXJvbi9qcXVlcnktbW91c2V3aGVlbClcclxuXHRcdCovXHJcblx0XHRfbW91c2V3aGVlbD1mdW5jdGlvbigpe1xyXG5cdFx0XHRpZighJCh0aGlzKS5kYXRhKHBsdWdpblBmeCkpe3JldHVybjt9IC8qIENoZWNrIGlmIHRoZSBzY3JvbGxiYXIgaXMgcmVhZHkgdG8gdXNlIG1vdXNld2hlZWwgZXZlbnRzIChpc3N1ZTogIzE4NSkgKi9cclxuXHRcdFx0dmFyICR0aGlzPSQodGhpcyksZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksbz1kLm9wdCxcclxuXHRcdFx0XHRuYW1lc3BhY2U9cGx1Z2luUGZ4K1wiX1wiK2QuaWR4LFxyXG5cdFx0XHRcdG1DdXN0b21TY3JvbGxCb3g9JChcIiNtQ1NCX1wiK2QuaWR4KSxcclxuXHRcdFx0XHRtQ1NCX2RyYWdnZXI9WyQoXCIjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX3ZlcnRpY2FsXCIpLCQoXCIjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX2hvcml6b250YWxcIildLFxyXG5cdFx0XHRcdGlmcmFtZT0kKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpLmZpbmQoXCJpZnJhbWVcIik7XHJcblx0XHRcdGlmKGlmcmFtZS5sZW5ndGgpe1xyXG5cdFx0XHRcdGlmcmFtZS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHQkKHRoaXMpLmJpbmQoXCJsb2FkXCIsZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdFx0LyogYmluZCBldmVudHMgb24gYWNjZXNzaWJsZSBpZnJhbWVzICovXHJcblx0XHRcdFx0XHRcdGlmKF9jYW5BY2Nlc3NJRnJhbWUodGhpcykpe1xyXG5cdFx0XHRcdFx0XHRcdCQodGhpcy5jb250ZW50RG9jdW1lbnQgfHwgdGhpcy5jb250ZW50V2luZG93LmRvY3VtZW50KS5iaW5kKFwibW91c2V3aGVlbC5cIituYW1lc3BhY2UsZnVuY3Rpb24oZSxkZWx0YSl7XHJcblx0XHRcdFx0XHRcdFx0XHRfb25Nb3VzZXdoZWVsKGUsZGVsdGEpO1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRtQ3VzdG9tU2Nyb2xsQm94LmJpbmQoXCJtb3VzZXdoZWVsLlwiK25hbWVzcGFjZSxmdW5jdGlvbihlLGRlbHRhKXtcclxuXHRcdFx0XHRfb25Nb3VzZXdoZWVsKGUsZGVsdGEpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0ZnVuY3Rpb24gX29uTW91c2V3aGVlbChlLGRlbHRhKXtcclxuXHRcdFx0XHRfc3RvcCgkdGhpcyk7XHJcblx0XHRcdFx0aWYoX2Rpc2FibGVNb3VzZXdoZWVsKCR0aGlzLGUudGFyZ2V0KSl7cmV0dXJuO30gLyogZGlzYWJsZXMgbW91c2Utd2hlZWwgd2hlbiBob3ZlcmluZyBzcGVjaWZpYyBlbGVtZW50cyAqL1xyXG5cdFx0XHRcdHZhciBkZWx0YUZhY3Rvcj1vLm1vdXNlV2hlZWwuZGVsdGFGYWN0b3IhPT1cImF1dG9cIiA/IHBhcnNlSW50KG8ubW91c2VXaGVlbC5kZWx0YUZhY3RvcikgOiAob2xkSUUgJiYgZS5kZWx0YUZhY3RvcjwxMDApID8gMTAwIDogZS5kZWx0YUZhY3RvciB8fCAxMDAsXHJcblx0XHRcdFx0XHRkdXI9by5zY3JvbGxJbmVydGlhO1xyXG5cdFx0XHRcdGlmKG8uYXhpcz09PVwieFwiIHx8IG8ubW91c2VXaGVlbC5heGlzPT09XCJ4XCIpe1xyXG5cdFx0XHRcdFx0dmFyIGRpcj1cInhcIixcclxuXHRcdFx0XHRcdFx0cHg9W01hdGgucm91bmQoZGVsdGFGYWN0b3IqZC5zY3JvbGxSYXRpby54KSxwYXJzZUludChvLm1vdXNlV2hlZWwuc2Nyb2xsQW1vdW50KV0sXHJcblx0XHRcdFx0XHRcdGFtb3VudD1vLm1vdXNlV2hlZWwuc2Nyb2xsQW1vdW50IT09XCJhdXRvXCIgPyBweFsxXSA6IHB4WzBdPj1tQ3VzdG9tU2Nyb2xsQm94LndpZHRoKCkgPyBtQ3VzdG9tU2Nyb2xsQm94LndpZHRoKCkqMC45IDogcHhbMF0sXHJcblx0XHRcdFx0XHRcdGNvbnRlbnRQb3M9TWF0aC5hYnMoJChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKVswXS5vZmZzZXRMZWZ0KSxcclxuXHRcdFx0XHRcdFx0ZHJhZ2dlclBvcz1tQ1NCX2RyYWdnZXJbMV1bMF0ub2Zmc2V0TGVmdCxcclxuXHRcdFx0XHRcdFx0bGltaXQ9bUNTQl9kcmFnZ2VyWzFdLnBhcmVudCgpLndpZHRoKCktbUNTQl9kcmFnZ2VyWzFdLndpZHRoKCksXHJcblx0XHRcdFx0XHRcdGRsdD1vLm1vdXNlV2hlZWwuYXhpcz09PVwieVwiID8gKGUuZGVsdGFZIHx8IGRlbHRhKSA6IGUuZGVsdGFYO1xyXG5cdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0dmFyIGRpcj1cInlcIixcclxuXHRcdFx0XHRcdFx0cHg9W01hdGgucm91bmQoZGVsdGFGYWN0b3IqZC5zY3JvbGxSYXRpby55KSxwYXJzZUludChvLm1vdXNlV2hlZWwuc2Nyb2xsQW1vdW50KV0sXHJcblx0XHRcdFx0XHRcdGFtb3VudD1vLm1vdXNlV2hlZWwuc2Nyb2xsQW1vdW50IT09XCJhdXRvXCIgPyBweFsxXSA6IHB4WzBdPj1tQ3VzdG9tU2Nyb2xsQm94LmhlaWdodCgpID8gbUN1c3RvbVNjcm9sbEJveC5oZWlnaHQoKSowLjkgOiBweFswXSxcclxuXHRcdFx0XHRcdFx0Y29udGVudFBvcz1NYXRoLmFicygkKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpWzBdLm9mZnNldFRvcCksXHJcblx0XHRcdFx0XHRcdGRyYWdnZXJQb3M9bUNTQl9kcmFnZ2VyWzBdWzBdLm9mZnNldFRvcCxcclxuXHRcdFx0XHRcdFx0bGltaXQ9bUNTQl9kcmFnZ2VyWzBdLnBhcmVudCgpLmhlaWdodCgpLW1DU0JfZHJhZ2dlclswXS5oZWlnaHQoKSxcclxuXHRcdFx0XHRcdFx0ZGx0PWUuZGVsdGFZIHx8IGRlbHRhO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZigoZGlyPT09XCJ5XCIgJiYgIWQub3ZlcmZsb3dlZFswXSkgfHwgKGRpcj09PVwieFwiICYmICFkLm92ZXJmbG93ZWRbMV0pKXtyZXR1cm47fVxyXG5cdFx0XHRcdGlmKG8ubW91c2VXaGVlbC5pbnZlcnQgfHwgZS53ZWJraXREaXJlY3Rpb25JbnZlcnRlZEZyb21EZXZpY2Upe2RsdD0tZGx0O31cclxuXHRcdFx0XHRpZihvLm1vdXNlV2hlZWwubm9ybWFsaXplRGVsdGEpe2RsdD1kbHQ8MCA/IC0xIDogMTt9XHJcblx0XHRcdFx0aWYoKGRsdD4wICYmIGRyYWdnZXJQb3MhPT0wKSB8fCAoZGx0PDAgJiYgZHJhZ2dlclBvcyE9PWxpbWl0KSB8fCBvLm1vdXNlV2hlZWwucHJldmVudERlZmF1bHQpe1xyXG5cdFx0XHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoZS5kZWx0YUZhY3Rvcjw1ICYmICFvLm1vdXNlV2hlZWwubm9ybWFsaXplRGVsdGEpe1xyXG5cdFx0XHRcdFx0Ly92ZXJ5IGxvdyBkZWx0YUZhY3RvciB2YWx1ZXMgbWVhbiBzb21lIGtpbmQgb2YgZGVsdGEgYWNjZWxlcmF0aW9uIChlLmcuIG9zeCB0cmFja3BhZCksIHNvIGFkanVzdGluZyBzY3JvbGxpbmcgYWNjb3JkaW5nbHlcclxuXHRcdFx0XHRcdGFtb3VudD1lLmRlbHRhRmFjdG9yOyBkdXI9MTc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdF9zY3JvbGxUbygkdGhpcywoY29udGVudFBvcy0oZGx0KmFtb3VudCkpLnRvU3RyaW5nKCkse2RpcjpkaXIsZHVyOmR1cn0pO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHRcdFxyXG5cdFx0XHJcblx0XHQvKiBjaGVja3MgaWYgaWZyYW1lIGNhbiBiZSBhY2Nlc3NlZCAqL1xyXG5cdFx0X2NhbkFjY2Vzc0lGcmFtZUNhY2hlPW5ldyBPYmplY3QoKSxcclxuXHRcdF9jYW5BY2Nlc3NJRnJhbWU9ZnVuY3Rpb24oaWZyYW1lKXtcclxuXHRcdCAgICB2YXIgcmVzdWx0PWZhbHNlLGNhY2hlS2V5PWZhbHNlLGh0bWw9bnVsbDtcclxuXHRcdCAgICBpZihpZnJhbWU9PT11bmRlZmluZWQpe1xyXG5cdFx0XHRcdGNhY2hlS2V5PVwiI2VtcHR5XCI7XHJcblx0XHQgICAgfWVsc2UgaWYoJChpZnJhbWUpLmF0dHIoXCJpZFwiKSE9PXVuZGVmaW5lZCl7XHJcblx0XHRcdFx0Y2FjaGVLZXk9JChpZnJhbWUpLmF0dHIoXCJpZFwiKTtcclxuXHRcdCAgICB9XHJcblx0XHRcdGlmKGNhY2hlS2V5IT09ZmFsc2UgJiYgX2NhbkFjY2Vzc0lGcmFtZUNhY2hlW2NhY2hlS2V5XSE9PXVuZGVmaW5lZCl7XHJcblx0XHRcdFx0cmV0dXJuIF9jYW5BY2Nlc3NJRnJhbWVDYWNoZVtjYWNoZUtleV07XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoIWlmcmFtZSl7XHJcblx0XHRcdFx0dHJ5e1xyXG5cdFx0XHRcdFx0dmFyIGRvYz10b3AuZG9jdW1lbnQ7XHJcblx0XHRcdFx0XHRodG1sPWRvYy5ib2R5LmlubmVySFRNTDtcclxuXHRcdFx0XHR9Y2F0Y2goZXJyKXsvKiBkbyBub3RoaW5nICovfVxyXG5cdFx0XHRcdHJlc3VsdD0oaHRtbCE9PW51bGwpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHR0cnl7XHJcblx0XHRcdFx0XHR2YXIgZG9jPWlmcmFtZS5jb250ZW50RG9jdW1lbnQgfHwgaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XHJcblx0XHRcdFx0XHRodG1sPWRvYy5ib2R5LmlubmVySFRNTDtcclxuXHRcdFx0XHR9Y2F0Y2goZXJyKXsvKiBkbyBub3RoaW5nICovfVxyXG5cdFx0XHRcdHJlc3VsdD0oaHRtbCE9PW51bGwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKGNhY2hlS2V5IT09ZmFsc2Upe19jYW5BY2Nlc3NJRnJhbWVDYWNoZVtjYWNoZUtleV09cmVzdWx0O31cclxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdH0sXHJcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cdFx0XHJcblx0XHRcclxuXHRcdC8qIHN3aXRjaGVzIGlmcmFtZSdzIHBvaW50ZXItZXZlbnRzIHByb3BlcnR5IChkcmFnLCBtb3VzZXdoZWVsIGV0Yy4gb3ZlciBjcm9zcy1kb21haW4gaWZyYW1lcykgKi9cclxuXHRcdF9pZnJhbWU9ZnVuY3Rpb24oZXZ0KXtcclxuXHRcdFx0dmFyIGVsPXRoaXMuZmluZChcImlmcmFtZVwiKTtcclxuXHRcdFx0aWYoIWVsLmxlbmd0aCl7cmV0dXJuO30gLyogY2hlY2sgaWYgY29udGVudCBjb250YWlucyBpZnJhbWVzICovXHJcblx0XHRcdHZhciB2YWw9IWV2dCA/IFwibm9uZVwiIDogXCJhdXRvXCI7XHJcblx0XHRcdGVsLmNzcyhcInBvaW50ZXItZXZlbnRzXCIsdmFsKTsgLyogZm9yIElFMTEsIGlmcmFtZSdzIGRpc3BsYXkgcHJvcGVydHkgc2hvdWxkIG5vdCBiZSBcImJsb2NrXCIgKi9cclxuXHRcdH0sXHJcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cdFx0XHJcblx0XHRcclxuXHRcdC8qIGRpc2FibGVzIG1vdXNlLXdoZWVsIHdoZW4gaG92ZXJpbmcgc3BlY2lmaWMgZWxlbWVudHMgbGlrZSBzZWxlY3QsIGRhdGFsaXN0IGV0Yy4gKi9cclxuXHRcdF9kaXNhYmxlTW91c2V3aGVlbD1mdW5jdGlvbihlbCx0YXJnZXQpe1xyXG5cdFx0XHR2YXIgdGFnPXRhcmdldC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpLFxyXG5cdFx0XHRcdHRhZ3M9ZWwuZGF0YShwbHVnaW5QZngpLm9wdC5tb3VzZVdoZWVsLmRpc2FibGVPdmVyLFxyXG5cdFx0XHRcdC8qIGVsZW1lbnRzIHRoYXQgcmVxdWlyZSBmb2N1cyAqL1xyXG5cdFx0XHRcdGZvY3VzVGFncz1bXCJzZWxlY3RcIixcInRleHRhcmVhXCJdO1xyXG5cdFx0XHRyZXR1cm4gJC5pbkFycmF5KHRhZyx0YWdzKSA+IC0xICYmICEoJC5pbkFycmF5KHRhZyxmb2N1c1RhZ3MpID4gLTEgJiYgISQodGFyZ2V0KS5pcyhcIjpmb2N1c1wiKSk7XHJcblx0XHR9LFxyXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHRcdFxyXG5cdFx0XHJcblx0XHQvKiBcclxuXHRcdERSQUdHRVIgUkFJTCBDTElDSyBFVkVOVFxyXG5cdFx0c2Nyb2xscyBjb250ZW50IHZpYSBkcmFnZ2VyIHJhaWwgXHJcblx0XHQqL1xyXG5cdFx0X2RyYWdnZXJSYWlsPWZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciAkdGhpcz0kKHRoaXMpLGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLFxyXG5cdFx0XHRcdG5hbWVzcGFjZT1wbHVnaW5QZngrXCJfXCIrZC5pZHgsXHJcblx0XHRcdFx0bUNTQl9jb250YWluZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKSxcclxuXHRcdFx0XHR3cmFwcGVyPW1DU0JfY29udGFpbmVyLnBhcmVudCgpLFxyXG5cdFx0XHRcdG1DU0JfZHJhZ2dlckNvbnRhaW5lcj0kKFwiLm1DU0JfXCIrZC5pZHgrXCJfc2Nyb2xsYmFyIC5cIitjbGFzc2VzWzEyXSksXHJcblx0XHRcdFx0Y2xpY2thYmxlO1xyXG5cdFx0XHRtQ1NCX2RyYWdnZXJDb250YWluZXIuYmluZChcIm1vdXNlZG93bi5cIituYW1lc3BhY2UrXCIgdG91Y2hzdGFydC5cIituYW1lc3BhY2UrXCIgcG9pbnRlcmRvd24uXCIrbmFtZXNwYWNlK1wiIE1TUG9pbnRlckRvd24uXCIrbmFtZXNwYWNlLGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRcdHRvdWNoQWN0aXZlPXRydWU7XHJcblx0XHRcdFx0aWYoISQoZS50YXJnZXQpLmhhc0NsYXNzKFwibUNTQl9kcmFnZ2VyXCIpKXtjbGlja2FibGU9MTt9XHJcblx0XHRcdH0pLmJpbmQoXCJ0b3VjaGVuZC5cIituYW1lc3BhY2UrXCIgcG9pbnRlcnVwLlwiK25hbWVzcGFjZStcIiBNU1BvaW50ZXJVcC5cIituYW1lc3BhY2UsZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0dG91Y2hBY3RpdmU9ZmFsc2U7XHJcblx0XHRcdH0pLmJpbmQoXCJjbGljay5cIituYW1lc3BhY2UsZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0aWYoIWNsaWNrYWJsZSl7cmV0dXJuO31cclxuXHRcdFx0XHRjbGlja2FibGU9MDtcclxuXHRcdFx0XHRpZigkKGUudGFyZ2V0KS5oYXNDbGFzcyhjbGFzc2VzWzEyXSkgfHwgJChlLnRhcmdldCkuaGFzQ2xhc3MoXCJtQ1NCX2RyYWdnZXJSYWlsXCIpKXtcclxuXHRcdFx0XHRcdF9zdG9wKCR0aGlzKTtcclxuXHRcdFx0XHRcdHZhciBlbD0kKHRoaXMpLG1DU0JfZHJhZ2dlcj1lbC5maW5kKFwiLm1DU0JfZHJhZ2dlclwiKTtcclxuXHRcdFx0XHRcdGlmKGVsLnBhcmVudChcIi5tQ1NCX3Njcm9sbFRvb2xzX2hvcml6b250YWxcIikubGVuZ3RoPjApe1xyXG5cdFx0XHRcdFx0XHRpZighZC5vdmVyZmxvd2VkWzFdKXtyZXR1cm47fVxyXG5cdFx0XHRcdFx0XHR2YXIgZGlyPVwieFwiLFxyXG5cdFx0XHRcdFx0XHRcdGNsaWNrRGlyPWUucGFnZVg+bUNTQl9kcmFnZ2VyLm9mZnNldCgpLmxlZnQgPyAtMSA6IDEsXHJcblx0XHRcdFx0XHRcdFx0dG89TWF0aC5hYnMobUNTQl9jb250YWluZXJbMF0ub2Zmc2V0TGVmdCktKGNsaWNrRGlyKih3cmFwcGVyLndpZHRoKCkqMC45KSk7XHJcblx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0aWYoIWQub3ZlcmZsb3dlZFswXSl7cmV0dXJuO31cclxuXHRcdFx0XHRcdFx0dmFyIGRpcj1cInlcIixcclxuXHRcdFx0XHRcdFx0XHRjbGlja0Rpcj1lLnBhZ2VZPm1DU0JfZHJhZ2dlci5vZmZzZXQoKS50b3AgPyAtMSA6IDEsXHJcblx0XHRcdFx0XHRcdFx0dG89TWF0aC5hYnMobUNTQl9jb250YWluZXJbMF0ub2Zmc2V0VG9wKS0oY2xpY2tEaXIqKHdyYXBwZXIuaGVpZ2h0KCkqMC45KSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRfc2Nyb2xsVG8oJHRoaXMsdG8udG9TdHJpbmcoKSx7ZGlyOmRpcixzY3JvbGxFYXNpbmc6XCJtY3NFYXNlSW5PdXRcIn0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHRcdFxyXG5cdFx0XHJcblx0XHQvKiBcclxuXHRcdEZPQ1VTIEVWRU5UXHJcblx0XHRzY3JvbGxzIGNvbnRlbnQgdmlhIGVsZW1lbnQgZm9jdXMgKGUuZy4gY2xpY2tpbmcgYW4gaW5wdXQsIHByZXNzaW5nIFRBQiBrZXkgZXRjLilcclxuXHRcdCovXHJcblx0XHRfZm9jdXM9ZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyICR0aGlzPSQodGhpcyksZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksbz1kLm9wdCxcclxuXHRcdFx0XHRuYW1lc3BhY2U9cGx1Z2luUGZ4K1wiX1wiK2QuaWR4LFxyXG5cdFx0XHRcdG1DU0JfY29udGFpbmVyPSQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXJcIiksXHJcblx0XHRcdFx0d3JhcHBlcj1tQ1NCX2NvbnRhaW5lci5wYXJlbnQoKTtcclxuXHRcdFx0bUNTQl9jb250YWluZXIuYmluZChcImZvY3VzaW4uXCIrbmFtZXNwYWNlLGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRcdHZhciBlbD0kKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpLFxyXG5cdFx0XHRcdFx0bmVzdGVkPW1DU0JfY29udGFpbmVyLmZpbmQoXCIubUN1c3RvbVNjcm9sbEJveFwiKS5sZW5ndGgsXHJcblx0XHRcdFx0XHRkdXI9MDtcclxuXHRcdFx0XHRpZighZWwuaXMoby5hZHZhbmNlZC5hdXRvU2Nyb2xsT25Gb2N1cykpe3JldHVybjt9XHJcblx0XHRcdFx0X3N0b3AoJHRoaXMpO1xyXG5cdFx0XHRcdGNsZWFyVGltZW91dCgkdGhpc1swXS5fZm9jdXNUaW1lb3V0KTtcclxuXHRcdFx0XHQkdGhpc1swXS5fZm9jdXNUaW1lcj1uZXN0ZWQgPyAoZHVyKzE3KSpuZXN0ZWQgOiAwO1xyXG5cdFx0XHRcdCR0aGlzWzBdLl9mb2N1c1RpbWVvdXQ9c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0dmFyXHR0bz1bX2NoaWxkUG9zKGVsKVswXSxfY2hpbGRQb3MoZWwpWzFdXSxcclxuXHRcdFx0XHRcdFx0Y29udGVudFBvcz1bbUNTQl9jb250YWluZXJbMF0ub2Zmc2V0VG9wLG1DU0JfY29udGFpbmVyWzBdLm9mZnNldExlZnRdLFxyXG5cdFx0XHRcdFx0XHRpc1Zpc2libGU9W1xyXG5cdFx0XHRcdFx0XHRcdChjb250ZW50UG9zWzBdK3RvWzBdPj0wICYmIGNvbnRlbnRQb3NbMF0rdG9bMF08d3JhcHBlci5oZWlnaHQoKS1lbC5vdXRlckhlaWdodChmYWxzZSkpLFxyXG5cdFx0XHRcdFx0XHRcdChjb250ZW50UG9zWzFdK3RvWzFdPj0wICYmIGNvbnRlbnRQb3NbMF0rdG9bMV08d3JhcHBlci53aWR0aCgpLWVsLm91dGVyV2lkdGgoZmFsc2UpKVxyXG5cdFx0XHRcdFx0XHRdLFxyXG5cdFx0XHRcdFx0XHRvdmVyd3JpdGU9KG8uYXhpcz09PVwieXhcIiAmJiAhaXNWaXNpYmxlWzBdICYmICFpc1Zpc2libGVbMV0pID8gXCJub25lXCIgOiBcImFsbFwiO1xyXG5cdFx0XHRcdFx0aWYoby5heGlzIT09XCJ4XCIgJiYgIWlzVmlzaWJsZVswXSl7XHJcblx0XHRcdFx0XHRcdF9zY3JvbGxUbygkdGhpcyx0b1swXS50b1N0cmluZygpLHtkaXI6XCJ5XCIsc2Nyb2xsRWFzaW5nOlwibWNzRWFzZUluT3V0XCIsb3ZlcndyaXRlOm92ZXJ3cml0ZSxkdXI6ZHVyfSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRpZihvLmF4aXMhPT1cInlcIiAmJiAhaXNWaXNpYmxlWzFdKXtcclxuXHRcdFx0XHRcdFx0X3Njcm9sbFRvKCR0aGlzLHRvWzFdLnRvU3RyaW5nKCkse2RpcjpcInhcIixzY3JvbGxFYXNpbmc6XCJtY3NFYXNlSW5PdXRcIixvdmVyd3JpdGU6b3ZlcndyaXRlLGR1cjpkdXJ9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LCR0aGlzWzBdLl9mb2N1c1RpbWVyKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHRcdFxyXG5cdFx0XHJcblx0XHQvKiBzZXRzIGNvbnRlbnQgd3JhcHBlciBzY3JvbGxUb3Avc2Nyb2xsTGVmdCBhbHdheXMgdG8gMCAqL1xyXG5cdFx0X3dyYXBwZXJTY3JvbGw9ZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyICR0aGlzPSQodGhpcyksZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksXHJcblx0XHRcdFx0bmFtZXNwYWNlPXBsdWdpblBmeCtcIl9cIitkLmlkeCxcclxuXHRcdFx0XHR3cmFwcGVyPSQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXJcIikucGFyZW50KCk7XHJcblx0XHRcdHdyYXBwZXIuYmluZChcInNjcm9sbC5cIituYW1lc3BhY2UsZnVuY3Rpb24oZSl7XHJcblx0XHRcdFx0aWYod3JhcHBlci5zY3JvbGxUb3AoKSE9PTAgfHwgd3JhcHBlci5zY3JvbGxMZWZ0KCkhPT0wKXtcclxuXHRcdFx0XHRcdCQoXCIubUNTQl9cIitkLmlkeCtcIl9zY3JvbGxiYXJcIikuY3NzKFwidmlzaWJpbGl0eVwiLFwiaGlkZGVuXCIpOyAvKiBoaWRlIHNjcm9sbGJhcihzKSAqL1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHRcdFxyXG5cdFx0XHJcblx0XHQvKiBcclxuXHRcdEJVVFRPTlMgRVZFTlRTXHJcblx0XHRzY3JvbGxzIGNvbnRlbnQgdmlhIHVwLCBkb3duLCBsZWZ0IGFuZCByaWdodCBidXR0b25zIFxyXG5cdFx0Ki9cclxuXHRcdF9idXR0b25zPWZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciAkdGhpcz0kKHRoaXMpLGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsc2VxPWQuc2VxdWVudGlhbCxcclxuXHRcdFx0XHRuYW1lc3BhY2U9cGx1Z2luUGZ4K1wiX1wiK2QuaWR4LFxyXG5cdFx0XHRcdHNlbD1cIi5tQ1NCX1wiK2QuaWR4K1wiX3Njcm9sbGJhclwiLFxyXG5cdFx0XHRcdGJ0bj0kKHNlbCtcIj5hXCIpO1xyXG5cdFx0XHRidG4uYmluZChcImNvbnRleHRtZW51LlwiK25hbWVzcGFjZSxmdW5jdGlvbihlKXtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7IC8vcHJldmVudCByaWdodCBjbGlja1xyXG5cdFx0XHR9KS5iaW5kKFwibW91c2Vkb3duLlwiK25hbWVzcGFjZStcIiB0b3VjaHN0YXJ0LlwiK25hbWVzcGFjZStcIiBwb2ludGVyZG93bi5cIituYW1lc3BhY2UrXCIgTVNQb2ludGVyRG93bi5cIituYW1lc3BhY2UrXCIgbW91c2V1cC5cIituYW1lc3BhY2UrXCIgdG91Y2hlbmQuXCIrbmFtZXNwYWNlK1wiIHBvaW50ZXJ1cC5cIituYW1lc3BhY2UrXCIgTVNQb2ludGVyVXAuXCIrbmFtZXNwYWNlK1wiIG1vdXNlb3V0LlwiK25hbWVzcGFjZStcIiBwb2ludGVyb3V0LlwiK25hbWVzcGFjZStcIiBNU1BvaW50ZXJPdXQuXCIrbmFtZXNwYWNlK1wiIGNsaWNrLlwiK25hbWVzcGFjZSxmdW5jdGlvbihlKXtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0aWYoIV9tb3VzZUJ0bkxlZnQoZSkpe3JldHVybjt9IC8qIGxlZnQgbW91c2UgYnV0dG9uIG9ubHkgKi9cclxuXHRcdFx0XHR2YXIgYnRuQ2xhc3M9JCh0aGlzKS5hdHRyKFwiY2xhc3NcIik7XHJcblx0XHRcdFx0c2VxLnR5cGU9by5zY3JvbGxCdXR0b25zLnNjcm9sbFR5cGU7XHJcblx0XHRcdFx0c3dpdGNoKGUudHlwZSl7XHJcblx0XHRcdFx0XHRjYXNlIFwibW91c2Vkb3duXCI6IGNhc2UgXCJ0b3VjaHN0YXJ0XCI6IGNhc2UgXCJwb2ludGVyZG93blwiOiBjYXNlIFwiTVNQb2ludGVyRG93blwiOlxyXG5cdFx0XHRcdFx0XHRpZihzZXEudHlwZT09PVwic3RlcHBlZFwiKXtyZXR1cm47fVxyXG5cdFx0XHRcdFx0XHR0b3VjaEFjdGl2ZT10cnVlO1xyXG5cdFx0XHRcdFx0XHRkLnR3ZWVuUnVubmluZz1mYWxzZTtcclxuXHRcdFx0XHRcdFx0X3NlcShcIm9uXCIsYnRuQ2xhc3MpO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgXCJtb3VzZXVwXCI6IGNhc2UgXCJ0b3VjaGVuZFwiOiBjYXNlIFwicG9pbnRlcnVwXCI6IGNhc2UgXCJNU1BvaW50ZXJVcFwiOlxyXG5cdFx0XHRcdFx0Y2FzZSBcIm1vdXNlb3V0XCI6IGNhc2UgXCJwb2ludGVyb3V0XCI6IGNhc2UgXCJNU1BvaW50ZXJPdXRcIjpcclxuXHRcdFx0XHRcdFx0aWYoc2VxLnR5cGU9PT1cInN0ZXBwZWRcIil7cmV0dXJuO31cclxuXHRcdFx0XHRcdFx0dG91Y2hBY3RpdmU9ZmFsc2U7XHJcblx0XHRcdFx0XHRcdGlmKHNlcS5kaXIpe19zZXEoXCJvZmZcIixidG5DbGFzcyk7fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgXCJjbGlja1wiOlxyXG5cdFx0XHRcdFx0XHRpZihzZXEudHlwZSE9PVwic3RlcHBlZFwiIHx8IGQudHdlZW5SdW5uaW5nKXtyZXR1cm47fVxyXG5cdFx0XHRcdFx0XHRfc2VxKFwib25cIixidG5DbGFzcyk7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmdW5jdGlvbiBfc2VxKGEsYyl7XHJcblx0XHRcdFx0XHRzZXEuc2Nyb2xsQW1vdW50PW8uc2Nyb2xsQnV0dG9ucy5zY3JvbGxBbW91bnQ7XHJcblx0XHRcdFx0XHRfc2VxdWVudGlhbFNjcm9sbCgkdGhpcyxhLGMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHRcdFxyXG5cdFx0XHJcblx0XHQvKiBcclxuXHRcdEtFWUJPQVJEIEVWRU5UU1xyXG5cdFx0c2Nyb2xscyBjb250ZW50IHZpYSBrZXlib2FyZCBcclxuXHRcdEtleXM6IHVwIGFycm93LCBkb3duIGFycm93LCBsZWZ0IGFycm93LCByaWdodCBhcnJvdywgUGdVcCwgUGdEbiwgSG9tZSwgRW5kXHJcblx0XHQqL1xyXG5cdFx0X2tleWJvYXJkPWZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciAkdGhpcz0kKHRoaXMpLGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsc2VxPWQuc2VxdWVudGlhbCxcclxuXHRcdFx0XHRuYW1lc3BhY2U9cGx1Z2luUGZ4K1wiX1wiK2QuaWR4LFxyXG5cdFx0XHRcdG1DdXN0b21TY3JvbGxCb3g9JChcIiNtQ1NCX1wiK2QuaWR4KSxcclxuXHRcdFx0XHRtQ1NCX2NvbnRhaW5lcj0kKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpLFxyXG5cdFx0XHRcdHdyYXBwZXI9bUNTQl9jb250YWluZXIucGFyZW50KCksXHJcblx0XHRcdFx0ZWRpdGFibGVzPVwiaW5wdXQsdGV4dGFyZWEsc2VsZWN0LGRhdGFsaXN0LGtleWdlbixbY29udGVudGVkaXRhYmxlPSd0cnVlJ11cIixcclxuXHRcdFx0XHRpZnJhbWU9bUNTQl9jb250YWluZXIuZmluZChcImlmcmFtZVwiKSxcclxuXHRcdFx0XHRldmVudHM9W1wiYmx1ci5cIituYW1lc3BhY2UrXCIga2V5ZG93bi5cIituYW1lc3BhY2UrXCIga2V5dXAuXCIrbmFtZXNwYWNlXTtcclxuXHRcdFx0aWYoaWZyYW1lLmxlbmd0aCl7XHJcblx0XHRcdFx0aWZyYW1lLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdCQodGhpcykuYmluZChcImxvYWRcIixmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHQvKiBiaW5kIGV2ZW50cyBvbiBhY2Nlc3NpYmxlIGlmcmFtZXMgKi9cclxuXHRcdFx0XHRcdFx0aWYoX2NhbkFjY2Vzc0lGcmFtZSh0aGlzKSl7XHJcblx0XHRcdFx0XHRcdFx0JCh0aGlzLmNvbnRlbnREb2N1bWVudCB8fCB0aGlzLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQpLmJpbmQoZXZlbnRzWzBdLGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRcdFx0XHRcdFx0X29uS2V5Ym9hcmQoZSk7XHJcblx0XHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdG1DdXN0b21TY3JvbGxCb3guYXR0cihcInRhYmluZGV4XCIsXCIwXCIpLmJpbmQoZXZlbnRzWzBdLGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRcdF9vbktleWJvYXJkKGUpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0ZnVuY3Rpb24gX29uS2V5Ym9hcmQoZSl7XHJcblx0XHRcdFx0c3dpdGNoKGUudHlwZSl7XHJcblx0XHRcdFx0XHRjYXNlIFwiYmx1clwiOlxyXG5cdFx0XHRcdFx0XHRpZihkLnR3ZWVuUnVubmluZyAmJiBzZXEuZGlyKXtfc2VxKFwib2ZmXCIsbnVsbCk7fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgXCJrZXlkb3duXCI6IGNhc2UgXCJrZXl1cFwiOlxyXG5cdFx0XHRcdFx0XHR2YXIgY29kZT1lLmtleUNvZGUgPyBlLmtleUNvZGUgOiBlLndoaWNoLGFjdGlvbj1cIm9uXCI7XHJcblx0XHRcdFx0XHRcdGlmKChvLmF4aXMhPT1cInhcIiAmJiAoY29kZT09PTM4IHx8IGNvZGU9PT00MCkpIHx8IChvLmF4aXMhPT1cInlcIiAmJiAoY29kZT09PTM3IHx8IGNvZGU9PT0zOSkpKXtcclxuXHRcdFx0XHRcdFx0XHQvKiB1cCAoMzgpLCBkb3duICg0MCksIGxlZnQgKDM3KSwgcmlnaHQgKDM5KSBhcnJvd3MgKi9cclxuXHRcdFx0XHRcdFx0XHRpZigoKGNvZGU9PT0zOCB8fCBjb2RlPT09NDApICYmICFkLm92ZXJmbG93ZWRbMF0pIHx8ICgoY29kZT09PTM3IHx8IGNvZGU9PT0zOSkgJiYgIWQub3ZlcmZsb3dlZFsxXSkpe3JldHVybjt9XHJcblx0XHRcdFx0XHRcdFx0aWYoZS50eXBlPT09XCJrZXl1cFwiKXthY3Rpb249XCJvZmZcIjt9XHJcblx0XHRcdFx0XHRcdFx0aWYoISQoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkuaXMoZWRpdGFibGVzKSl7XHJcblx0XHRcdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRcdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHRcdFx0XHRcdFx0X3NlcShhY3Rpb24sY29kZSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9ZWxzZSBpZihjb2RlPT09MzMgfHwgY29kZT09PTM0KXtcclxuXHRcdFx0XHRcdFx0XHQvKiBQZ1VwICgzMyksIFBnRG4gKDM0KSAqL1xyXG5cdFx0XHRcdFx0XHRcdGlmKGQub3ZlcmZsb3dlZFswXSB8fCBkLm92ZXJmbG93ZWRbMV0pe1xyXG5cdFx0XHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0aWYoZS50eXBlPT09XCJrZXl1cFwiKXtcclxuXHRcdFx0XHRcdFx0XHRcdF9zdG9wKCR0aGlzKTtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBrZXlib2FyZERpcj1jb2RlPT09MzQgPyAtMSA6IDE7XHJcblx0XHRcdFx0XHRcdFx0XHRpZihvLmF4aXM9PT1cInhcIiB8fCAoby5heGlzPT09XCJ5eFwiICYmIGQub3ZlcmZsb3dlZFsxXSAmJiAhZC5vdmVyZmxvd2VkWzBdKSl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHZhciBkaXI9XCJ4XCIsdG89TWF0aC5hYnMobUNTQl9jb250YWluZXJbMF0ub2Zmc2V0TGVmdCktKGtleWJvYXJkRGlyKih3cmFwcGVyLndpZHRoKCkqMC45KSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGRpcj1cInlcIix0bz1NYXRoLmFicyhtQ1NCX2NvbnRhaW5lclswXS5vZmZzZXRUb3ApLShrZXlib2FyZERpciood3JhcHBlci5oZWlnaHQoKSowLjkpKTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdF9zY3JvbGxUbygkdGhpcyx0by50b1N0cmluZygpLHtkaXI6ZGlyLHNjcm9sbEVhc2luZzpcIm1jc0Vhc2VJbk91dFwifSk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9ZWxzZSBpZihjb2RlPT09MzUgfHwgY29kZT09PTM2KXtcclxuXHRcdFx0XHRcdFx0XHQvKiBFbmQgKDM1KSwgSG9tZSAoMzYpICovXHJcblx0XHRcdFx0XHRcdFx0aWYoISQoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkuaXMoZWRpdGFibGVzKSl7XHJcblx0XHRcdFx0XHRcdFx0XHRpZihkLm92ZXJmbG93ZWRbMF0gfHwgZC5vdmVyZmxvd2VkWzFdKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0aWYoZS50eXBlPT09XCJrZXl1cFwiKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYoby5heGlzPT09XCJ4XCIgfHwgKG8uYXhpcz09PVwieXhcIiAmJiBkLm92ZXJmbG93ZWRbMV0gJiYgIWQub3ZlcmZsb3dlZFswXSkpe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBkaXI9XCJ4XCIsdG89Y29kZT09PTM1ID8gTWF0aC5hYnMod3JhcHBlci53aWR0aCgpLW1DU0JfY29udGFpbmVyLm91dGVyV2lkdGgoZmFsc2UpKSA6IDA7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1lbHNle1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHZhciBkaXI9XCJ5XCIsdG89Y29kZT09PTM1ID8gTWF0aC5hYnMod3JhcHBlci5oZWlnaHQoKS1tQ1NCX2NvbnRhaW5lci5vdXRlckhlaWdodChmYWxzZSkpIDogMDtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRfc2Nyb2xsVG8oJHRoaXMsdG8udG9TdHJpbmcoKSx7ZGlyOmRpcixzY3JvbGxFYXNpbmc6XCJtY3NFYXNlSW5PdXRcIn0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZnVuY3Rpb24gX3NlcShhLGMpe1xyXG5cdFx0XHRcdFx0c2VxLnR5cGU9by5rZXlib2FyZC5zY3JvbGxUeXBlO1xyXG5cdFx0XHRcdFx0c2VxLnNjcm9sbEFtb3VudD1vLmtleWJvYXJkLnNjcm9sbEFtb3VudDtcclxuXHRcdFx0XHRcdGlmKHNlcS50eXBlPT09XCJzdGVwcGVkXCIgJiYgZC50d2VlblJ1bm5pbmcpe3JldHVybjt9XHJcblx0XHRcdFx0XHRfc2VxdWVudGlhbFNjcm9sbCgkdGhpcyxhLGMpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblx0XHRcclxuXHRcdFxyXG5cdFx0Lyogc2Nyb2xscyBjb250ZW50IHNlcXVlbnRpYWxseSAodXNlZCB3aGVuIHNjcm9sbGluZyB2aWEgYnV0dG9ucywga2V5Ym9hcmQgYXJyb3dzIGV0Yy4pICovXHJcblx0XHRfc2VxdWVudGlhbFNjcm9sbD1mdW5jdGlvbihlbCxhY3Rpb24sdHJpZ2dlcixlLHMpe1xyXG5cdFx0XHR2YXIgZD1lbC5kYXRhKHBsdWdpblBmeCksbz1kLm9wdCxzZXE9ZC5zZXF1ZW50aWFsLFxyXG5cdFx0XHRcdG1DU0JfY29udGFpbmVyPSQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXJcIiksXHJcblx0XHRcdFx0b25jZT1zZXEudHlwZT09PVwic3RlcHBlZFwiID8gdHJ1ZSA6IGZhbHNlLFxyXG5cdFx0XHRcdHN0ZXBsZXNzU3BlZWQ9by5zY3JvbGxJbmVydGlhIDwgMjYgPyAyNiA6IG8uc2Nyb2xsSW5lcnRpYSwgLyogMjYvMS41PTE3ICovXHJcblx0XHRcdFx0c3RlcHBlZFNwZWVkPW8uc2Nyb2xsSW5lcnRpYSA8IDEgPyAxNyA6IG8uc2Nyb2xsSW5lcnRpYTtcclxuXHRcdFx0c3dpdGNoKGFjdGlvbil7XHJcblx0XHRcdFx0Y2FzZSBcIm9uXCI6XHJcblx0XHRcdFx0XHRzZXEuZGlyPVtcclxuXHRcdFx0XHRcdFx0KHRyaWdnZXI9PT1jbGFzc2VzWzE2XSB8fCB0cmlnZ2VyPT09Y2xhc3Nlc1sxNV0gfHwgdHJpZ2dlcj09PTM5IHx8IHRyaWdnZXI9PT0zNyA/IFwieFwiIDogXCJ5XCIpLFxyXG5cdFx0XHRcdFx0XHQodHJpZ2dlcj09PWNsYXNzZXNbMTNdIHx8IHRyaWdnZXI9PT1jbGFzc2VzWzE1XSB8fCB0cmlnZ2VyPT09MzggfHwgdHJpZ2dlcj09PTM3ID8gLTEgOiAxKVxyXG5cdFx0XHRcdFx0XTtcclxuXHRcdFx0XHRcdF9zdG9wKGVsKTtcclxuXHRcdFx0XHRcdGlmKF9pc051bWVyaWModHJpZ2dlcikgJiYgc2VxLnR5cGU9PT1cInN0ZXBwZWRcIil7cmV0dXJuO31cclxuXHRcdFx0XHRcdF9vbihvbmNlKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgXCJvZmZcIjpcclxuXHRcdFx0XHRcdF9vZmYoKTtcclxuXHRcdFx0XHRcdGlmKG9uY2UgfHwgKGQudHdlZW5SdW5uaW5nICYmIHNlcS5kaXIpKXtcclxuXHRcdFx0XHRcdFx0X29uKHRydWUpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdC8qIHN0YXJ0cyBzZXF1ZW5jZSAqL1xyXG5cdFx0XHRmdW5jdGlvbiBfb24ob25jZSl7XHJcblx0XHRcdFx0aWYoby5zbmFwQW1vdW50KXtzZXEuc2Nyb2xsQW1vdW50PSEoby5zbmFwQW1vdW50IGluc3RhbmNlb2YgQXJyYXkpID8gby5zbmFwQW1vdW50IDogc2VxLmRpclswXT09PVwieFwiID8gby5zbmFwQW1vdW50WzFdIDogby5zbmFwQW1vdW50WzBdO30gLyogc2Nyb2xsaW5nIHNuYXBwaW5nICovXHJcblx0XHRcdFx0dmFyIGM9c2VxLnR5cGUhPT1cInN0ZXBwZWRcIiwgLyogY29udGludW91cyBzY3JvbGxpbmcgKi9cclxuXHRcdFx0XHRcdHQ9cyA/IHMgOiAhb25jZSA/IDEwMDAvNjAgOiBjID8gc3RlcGxlc3NTcGVlZC8xLjUgOiBzdGVwcGVkU3BlZWQsIC8qIHRpbWVyICovXHJcblx0XHRcdFx0XHRtPSFvbmNlID8gMi41IDogYyA/IDcuNSA6IDQwLCAvKiBtdWx0aXBsaWVyICovXHJcblx0XHRcdFx0XHRjb250ZW50UG9zPVtNYXRoLmFicyhtQ1NCX2NvbnRhaW5lclswXS5vZmZzZXRUb3ApLE1hdGguYWJzKG1DU0JfY29udGFpbmVyWzBdLm9mZnNldExlZnQpXSxcclxuXHRcdFx0XHRcdHJhdGlvPVtkLnNjcm9sbFJhdGlvLnk+MTAgPyAxMCA6IGQuc2Nyb2xsUmF0aW8ueSxkLnNjcm9sbFJhdGlvLng+MTAgPyAxMCA6IGQuc2Nyb2xsUmF0aW8ueF0sXHJcblx0XHRcdFx0XHRhbW91bnQ9c2VxLmRpclswXT09PVwieFwiID8gY29udGVudFBvc1sxXSsoc2VxLmRpclsxXSoocmF0aW9bMV0qbSkpIDogY29udGVudFBvc1swXSsoc2VxLmRpclsxXSoocmF0aW9bMF0qbSkpLFxyXG5cdFx0XHRcdFx0cHg9c2VxLmRpclswXT09PVwieFwiID8gY29udGVudFBvc1sxXSsoc2VxLmRpclsxXSpwYXJzZUludChzZXEuc2Nyb2xsQW1vdW50KSkgOiBjb250ZW50UG9zWzBdKyhzZXEuZGlyWzFdKnBhcnNlSW50KHNlcS5zY3JvbGxBbW91bnQpKSxcclxuXHRcdFx0XHRcdHRvPXNlcS5zY3JvbGxBbW91bnQhPT1cImF1dG9cIiA/IHB4IDogYW1vdW50LFxyXG5cdFx0XHRcdFx0ZWFzaW5nPWUgPyBlIDogIW9uY2UgPyBcIm1jc0xpbmVhclwiIDogYyA/IFwibWNzTGluZWFyT3V0XCIgOiBcIm1jc0Vhc2VJbk91dFwiLFxyXG5cdFx0XHRcdFx0b25Db21wbGV0ZT0hb25jZSA/IGZhbHNlIDogdHJ1ZTtcclxuXHRcdFx0XHRpZihvbmNlICYmIHQ8MTcpe1xyXG5cdFx0XHRcdFx0dG89c2VxLmRpclswXT09PVwieFwiID8gY29udGVudFBvc1sxXSA6IGNvbnRlbnRQb3NbMF07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdF9zY3JvbGxUbyhlbCx0by50b1N0cmluZygpLHtkaXI6c2VxLmRpclswXSxzY3JvbGxFYXNpbmc6ZWFzaW5nLGR1cjp0LG9uQ29tcGxldGU6b25Db21wbGV0ZX0pO1xyXG5cdFx0XHRcdGlmKG9uY2Upe1xyXG5cdFx0XHRcdFx0c2VxLmRpcj1mYWxzZTtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KHNlcS5zdGVwKTtcclxuXHRcdFx0XHRzZXEuc3RlcD1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRfb24oKTtcclxuXHRcdFx0XHR9LHQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8qIHN0b3BzIHNlcXVlbmNlICovXHJcblx0XHRcdGZ1bmN0aW9uIF9vZmYoKXtcclxuXHRcdFx0XHRjbGVhclRpbWVvdXQoc2VxLnN0ZXApO1xyXG5cdFx0XHRcdF9kZWxldGUoc2VxLFwic3RlcFwiKTtcclxuXHRcdFx0XHRfc3RvcChlbCk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cdFx0XHJcblx0XHRcclxuXHRcdC8qIHJldHVybnMgYSB5eCBhcnJheSBmcm9tIHZhbHVlICovXHJcblx0XHRfYXJyPWZ1bmN0aW9uKHZhbCl7XHJcblx0XHRcdHZhciBvPSQodGhpcykuZGF0YShwbHVnaW5QZngpLm9wdCx2YWxzPVtdO1xyXG5cdFx0XHRpZih0eXBlb2YgdmFsPT09XCJmdW5jdGlvblwiKXt2YWw9dmFsKCk7fSAvKiBjaGVjayBpZiB0aGUgdmFsdWUgaXMgYSBzaW5nbGUgYW5vbnltb3VzIGZ1bmN0aW9uICovXHJcblx0XHRcdC8qIGNoZWNrIGlmIHZhbHVlIGlzIG9iamVjdCBvciBhcnJheSwgaXRzIGxlbmd0aCBhbmQgY3JlYXRlIGFuIGFycmF5IHdpdGggeXggdmFsdWVzICovXHJcblx0XHRcdGlmKCEodmFsIGluc3RhbmNlb2YgQXJyYXkpKXsgLyogb2JqZWN0IHZhbHVlIChlLmcuIHt5OlwiMTAwXCIseDpcIjEwMFwifSwgMTAwIGV0Yy4pICovXHJcblx0XHRcdFx0dmFsc1swXT12YWwueSA/IHZhbC55IDogdmFsLnggfHwgby5heGlzPT09XCJ4XCIgPyBudWxsIDogdmFsO1xyXG5cdFx0XHRcdHZhbHNbMV09dmFsLnggPyB2YWwueCA6IHZhbC55IHx8IG8uYXhpcz09PVwieVwiID8gbnVsbCA6IHZhbDtcclxuXHRcdFx0fWVsc2V7IC8qIGFycmF5IHZhbHVlIChlLmcuIFsxMDAsMTAwXSkgKi9cclxuXHRcdFx0XHR2YWxzPXZhbC5sZW5ndGg+MSA/IFt2YWxbMF0sdmFsWzFdXSA6IG8uYXhpcz09PVwieFwiID8gW251bGwsdmFsWzBdXSA6IFt2YWxbMF0sbnVsbF07XHJcblx0XHRcdH1cclxuXHRcdFx0LyogY2hlY2sgaWYgYXJyYXkgdmFsdWVzIGFyZSBhbm9ueW1vdXMgZnVuY3Rpb25zICovXHJcblx0XHRcdGlmKHR5cGVvZiB2YWxzWzBdPT09XCJmdW5jdGlvblwiKXt2YWxzWzBdPXZhbHNbMF0oKTt9XHJcblx0XHRcdGlmKHR5cGVvZiB2YWxzWzFdPT09XCJmdW5jdGlvblwiKXt2YWxzWzFdPXZhbHNbMV0oKTt9XHJcblx0XHRcdHJldHVybiB2YWxzO1xyXG5cdFx0fSxcclxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblx0XHRcclxuXHRcdFxyXG5cdFx0LyogdHJhbnNsYXRlcyB2YWx1ZXMgKGUuZy4gXCJ0b3BcIiwgMTAwLCBcIjEwMHB4XCIsIFwiI2lkXCIpIHRvIGFjdHVhbCBzY3JvbGwtdG8gcG9zaXRpb25zICovXHJcblx0XHRfdG89ZnVuY3Rpb24odmFsLGRpcil7XHJcblx0XHRcdGlmKHZhbD09bnVsbCB8fCB0eXBlb2YgdmFsPT1cInVuZGVmaW5lZFwiKXtyZXR1cm47fVxyXG5cdFx0XHR2YXIgJHRoaXM9JCh0aGlzKSxkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KSxvPWQub3B0LFxyXG5cdFx0XHRcdG1DU0JfY29udGFpbmVyPSQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXJcIiksXHJcblx0XHRcdFx0d3JhcHBlcj1tQ1NCX2NvbnRhaW5lci5wYXJlbnQoKSxcclxuXHRcdFx0XHR0PXR5cGVvZiB2YWw7XHJcblx0XHRcdGlmKCFkaXIpe2Rpcj1vLmF4aXM9PT1cInhcIiA/IFwieFwiIDogXCJ5XCI7fVxyXG5cdFx0XHR2YXIgY29udGVudExlbmd0aD1kaXI9PT1cInhcIiA/IG1DU0JfY29udGFpbmVyLm91dGVyV2lkdGgoZmFsc2UpLXdyYXBwZXIud2lkdGgoKSA6IG1DU0JfY29udGFpbmVyLm91dGVySGVpZ2h0KGZhbHNlKS13cmFwcGVyLmhlaWdodCgpLFxyXG5cdFx0XHRcdGNvbnRlbnRQb3M9ZGlyPT09XCJ4XCIgPyBtQ1NCX2NvbnRhaW5lclswXS5vZmZzZXRMZWZ0IDogbUNTQl9jb250YWluZXJbMF0ub2Zmc2V0VG9wLFxyXG5cdFx0XHRcdGNzc1Byb3A9ZGlyPT09XCJ4XCIgPyBcImxlZnRcIiA6IFwidG9wXCI7XHJcblx0XHRcdHN3aXRjaCh0KXtcclxuXHRcdFx0XHRjYXNlIFwiZnVuY3Rpb25cIjogLyogdGhpcyBjdXJyZW50bHkgaXMgbm90IHVzZWQuIENvbnNpZGVyIHJlbW92aW5nIGl0ICovXHJcblx0XHRcdFx0XHRyZXR1cm4gdmFsKCk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRjYXNlIFwib2JqZWN0XCI6IC8qIGpzL2pxdWVyeSBvYmplY3QgKi9cclxuXHRcdFx0XHRcdHZhciBvYmo9dmFsLmpxdWVyeSA/IHZhbCA6ICQodmFsKTtcclxuXHRcdFx0XHRcdGlmKCFvYmoubGVuZ3RoKXtyZXR1cm47fVxyXG5cdFx0XHRcdFx0cmV0dXJuIGRpcj09PVwieFwiID8gX2NoaWxkUG9zKG9iailbMV0gOiBfY2hpbGRQb3Mob2JqKVswXTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgXCJzdHJpbmdcIjogY2FzZSBcIm51bWJlclwiOlxyXG5cdFx0XHRcdFx0aWYoX2lzTnVtZXJpYyh2YWwpKXsgLyogbnVtZXJpYyB2YWx1ZSAqL1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5hYnModmFsKTtcclxuXHRcdFx0XHRcdH1lbHNlIGlmKHZhbC5pbmRleE9mKFwiJVwiKSE9PS0xKXsgLyogcGVyY2VudGFnZSB2YWx1ZSAqL1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5hYnMoY29udGVudExlbmd0aCpwYXJzZUludCh2YWwpLzEwMCk7XHJcblx0XHRcdFx0XHR9ZWxzZSBpZih2YWwuaW5kZXhPZihcIi09XCIpIT09LTEpeyAvKiBkZWNyZWFzZSB2YWx1ZSAqL1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5hYnMoY29udGVudFBvcy1wYXJzZUludCh2YWwuc3BsaXQoXCItPVwiKVsxXSkpO1xyXG5cdFx0XHRcdFx0fWVsc2UgaWYodmFsLmluZGV4T2YoXCIrPVwiKSE9PS0xKXsgLyogaW5yZWFzZSB2YWx1ZSAqL1xyXG5cdFx0XHRcdFx0XHR2YXIgcD0oY29udGVudFBvcytwYXJzZUludCh2YWwuc3BsaXQoXCIrPVwiKVsxXSkpO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gcD49MCA/IDAgOiBNYXRoLmFicyhwKTtcclxuXHRcdFx0XHRcdH1lbHNlIGlmKHZhbC5pbmRleE9mKFwicHhcIikhPT0tMSAmJiBfaXNOdW1lcmljKHZhbC5zcGxpdChcInB4XCIpWzBdKSl7IC8qIHBpeGVscyBzdHJpbmcgdmFsdWUgKGUuZy4gXCIxMDBweFwiKSAqL1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5hYnModmFsLnNwbGl0KFwicHhcIilbMF0pO1xyXG5cdFx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRcdGlmKHZhbD09PVwidG9wXCIgfHwgdmFsPT09XCJsZWZ0XCIpeyAvKiBzcGVjaWFsIHN0cmluZ3MgKi9cclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gMDtcclxuXHRcdFx0XHRcdFx0fWVsc2UgaWYodmFsPT09XCJib3R0b21cIil7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIE1hdGguYWJzKHdyYXBwZXIuaGVpZ2h0KCktbUNTQl9jb250YWluZXIub3V0ZXJIZWlnaHQoZmFsc2UpKTtcclxuXHRcdFx0XHRcdFx0fWVsc2UgaWYodmFsPT09XCJyaWdodFwiKXtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gTWF0aC5hYnMod3JhcHBlci53aWR0aCgpLW1DU0JfY29udGFpbmVyLm91dGVyV2lkdGgoZmFsc2UpKTtcclxuXHRcdFx0XHRcdFx0fWVsc2UgaWYodmFsPT09XCJmaXJzdFwiIHx8IHZhbD09PVwibGFzdFwiKXtcclxuXHRcdFx0XHRcdFx0XHR2YXIgb2JqPW1DU0JfY29udGFpbmVyLmZpbmQoXCI6XCIrdmFsKTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZGlyPT09XCJ4XCIgPyBfY2hpbGRQb3Mob2JqKVsxXSA6IF9jaGlsZFBvcyhvYmopWzBdO1xyXG5cdFx0XHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdFx0XHRpZigkKHZhbCkubGVuZ3RoKXsgLyoganF1ZXJ5IHNlbGVjdG9yICovXHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZGlyPT09XCJ4XCIgPyBfY2hpbGRQb3MoJCh2YWwpKVsxXSA6IF9jaGlsZFBvcygkKHZhbCkpWzBdO1xyXG5cdFx0XHRcdFx0XHRcdH1lbHNleyAvKiBvdGhlciB2YWx1ZXMgKGUuZy4gXCIxMDBlbVwiKSAqL1xyXG5cdFx0XHRcdFx0XHRcdFx0bUNTQl9jb250YWluZXIuY3NzKGNzc1Byb3AsdmFsKTtcclxuXHRcdFx0XHRcdFx0XHRcdG1ldGhvZHMudXBkYXRlLmNhbGwobnVsbCwkdGhpc1swXSk7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblx0XHRcclxuXHRcdFxyXG5cdFx0LyogY2FsbHMgdGhlIHVwZGF0ZSBtZXRob2QgYXV0b21hdGljYWxseSAqL1xyXG5cdFx0X2F1dG9VcGRhdGU9ZnVuY3Rpb24ocmVtKXtcclxuXHRcdFx0dmFyICR0aGlzPSQodGhpcyksZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksbz1kLm9wdCxcclxuXHRcdFx0XHRtQ1NCX2NvbnRhaW5lcj0kKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpO1xyXG5cdFx0XHRpZihyZW0pe1xyXG5cdFx0XHRcdC8qIFxyXG5cdFx0XHRcdHJlbW92ZXMgYXV0b1VwZGF0ZSB0aW1lciBcclxuXHRcdFx0XHR1c2FnZTogX2F1dG9VcGRhdGUuY2FsbCh0aGlzLFwicmVtb3ZlXCIpO1xyXG5cdFx0XHRcdCovXHJcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KG1DU0JfY29udGFpbmVyWzBdLmF1dG9VcGRhdGUpO1xyXG5cdFx0XHRcdF9kZWxldGUobUNTQl9jb250YWluZXJbMF0sXCJhdXRvVXBkYXRlXCIpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHR1cGQoKTtcclxuXHRcdFx0ZnVuY3Rpb24gdXBkKCl7XHJcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KG1DU0JfY29udGFpbmVyWzBdLmF1dG9VcGRhdGUpO1xyXG5cdFx0XHRcdGlmKCR0aGlzLnBhcmVudHMoXCJodG1sXCIpLmxlbmd0aD09PTApe1xyXG5cdFx0XHRcdFx0LyogY2hlY2sgZWxlbWVudCBpbiBkb20gdHJlZSAqL1xyXG5cdFx0XHRcdFx0JHRoaXM9bnVsbDtcclxuXHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bUNTQl9jb250YWluZXJbMF0uYXV0b1VwZGF0ZT1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHQvKiB1cGRhdGUgb24gc3BlY2lmaWMgc2VsZWN0b3IocykgbGVuZ3RoIGFuZCBzaXplIGNoYW5nZSAqL1xyXG5cdFx0XHRcdFx0aWYoby5hZHZhbmNlZC51cGRhdGVPblNlbGVjdG9yQ2hhbmdlKXtcclxuXHRcdFx0XHRcdFx0ZC5wb2xsLmNoYW5nZS5uPXNpemVzU3VtKCk7XHJcblx0XHRcdFx0XHRcdGlmKGQucG9sbC5jaGFuZ2UubiE9PWQucG9sbC5jaGFuZ2Uubyl7XHJcblx0XHRcdFx0XHRcdFx0ZC5wb2xsLmNoYW5nZS5vPWQucG9sbC5jaGFuZ2UubjtcclxuXHRcdFx0XHRcdFx0XHRkb1VwZCgzKTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8qIHVwZGF0ZSBvbiBtYWluIGVsZW1lbnQgYW5kIHNjcm9sbGJhciBzaXplIGNoYW5nZXMgKi9cclxuXHRcdFx0XHRcdGlmKG8uYWR2YW5jZWQudXBkYXRlT25Db250ZW50UmVzaXplKXtcclxuXHRcdFx0XHRcdFx0ZC5wb2xsLnNpemUubj0kdGhpc1swXS5zY3JvbGxIZWlnaHQrJHRoaXNbMF0uc2Nyb2xsV2lkdGgrbUNTQl9jb250YWluZXJbMF0ub2Zmc2V0SGVpZ2h0KyR0aGlzWzBdLm9mZnNldEhlaWdodCskdGhpc1swXS5vZmZzZXRXaWR0aDtcclxuXHRcdFx0XHRcdFx0aWYoZC5wb2xsLnNpemUubiE9PWQucG9sbC5zaXplLm8pe1xyXG5cdFx0XHRcdFx0XHRcdGQucG9sbC5zaXplLm89ZC5wb2xsLnNpemUubjtcclxuXHRcdFx0XHRcdFx0XHRkb1VwZCgxKTtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8qIHVwZGF0ZSBvbiBpbWFnZSBsb2FkICovXHJcblx0XHRcdFx0XHRpZihvLmFkdmFuY2VkLnVwZGF0ZU9uSW1hZ2VMb2FkKXtcclxuXHRcdFx0XHRcdFx0aWYoIShvLmFkdmFuY2VkLnVwZGF0ZU9uSW1hZ2VMb2FkPT09XCJhdXRvXCIgJiYgby5heGlzPT09XCJ5XCIpKXsgLy9ieSBkZWZhdWx0LCBpdCBkb2Vzbid0IHJ1biBvbiB2ZXJ0aWNhbCBjb250ZW50XHJcblx0XHRcdFx0XHRcdFx0ZC5wb2xsLmltZy5uPW1DU0JfY29udGFpbmVyLmZpbmQoXCJpbWdcIikubGVuZ3RoO1xyXG5cdFx0XHRcdFx0XHRcdGlmKGQucG9sbC5pbWcubiE9PWQucG9sbC5pbWcubyl7XHJcblx0XHRcdFx0XHRcdFx0XHRkLnBvbGwuaW1nLm89ZC5wb2xsLmltZy5uO1xyXG5cdFx0XHRcdFx0XHRcdFx0bUNTQl9jb250YWluZXIuZmluZChcImltZ1wiKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGltZ0xvYWRlcih0aGlzKTtcclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYoby5hZHZhbmNlZC51cGRhdGVPblNlbGVjdG9yQ2hhbmdlIHx8IG8uYWR2YW5jZWQudXBkYXRlT25Db250ZW50UmVzaXplIHx8IG8uYWR2YW5jZWQudXBkYXRlT25JbWFnZUxvYWQpe3VwZCgpO31cclxuXHRcdFx0XHR9LG8uYWR2YW5jZWQuYXV0b1VwZGF0ZVRpbWVvdXQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8qIGEgdGlueSBpbWFnZSBsb2FkZXIgKi9cclxuXHRcdFx0ZnVuY3Rpb24gaW1nTG9hZGVyKGVsKXtcclxuXHRcdFx0XHRpZigkKGVsKS5oYXNDbGFzcyhjbGFzc2VzWzJdKSl7ZG9VcGQoKTsgcmV0dXJuO31cclxuXHRcdFx0XHR2YXIgaW1nPW5ldyBJbWFnZSgpO1xyXG5cdFx0XHRcdGZ1bmN0aW9uIGNyZWF0ZURlbGVnYXRlKGNvbnRleHRPYmplY3QsZGVsZWdhdGVNZXRob2Qpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGRlbGVnYXRlTWV0aG9kLmFwcGx5KGNvbnRleHRPYmplY3QsYXJndW1lbnRzKTt9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZ1bmN0aW9uIGltZ09uTG9hZCgpe1xyXG5cdFx0XHRcdFx0dGhpcy5vbmxvYWQ9bnVsbDtcclxuXHRcdFx0XHRcdCQoZWwpLmFkZENsYXNzKGNsYXNzZXNbMl0pO1xyXG5cdFx0XHRcdFx0ZG9VcGQoMik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGltZy5vbmxvYWQ9Y3JlYXRlRGVsZWdhdGUoaW1nLGltZ09uTG9hZCk7XHJcblx0XHRcdFx0aW1nLnNyYz1lbC5zcmM7XHJcblx0XHRcdH1cclxuXHRcdFx0LyogcmV0dXJucyB0aGUgdG90YWwgaGVpZ2h0IGFuZCB3aWR0aCBzdW0gb2YgYWxsIGVsZW1lbnRzIG1hdGNoaW5nIHRoZSBzZWxlY3RvciAqL1xyXG5cdFx0XHRmdW5jdGlvbiBzaXplc1N1bSgpe1xyXG5cdFx0XHRcdGlmKG8uYWR2YW5jZWQudXBkYXRlT25TZWxlY3RvckNoYW5nZT09PXRydWUpe28uYWR2YW5jZWQudXBkYXRlT25TZWxlY3RvckNoYW5nZT1cIipcIjt9XHJcblx0XHRcdFx0dmFyIHRvdGFsPTAsc2VsPW1DU0JfY29udGFpbmVyLmZpbmQoby5hZHZhbmNlZC51cGRhdGVPblNlbGVjdG9yQ2hhbmdlKTtcclxuXHRcdFx0XHRpZihvLmFkdmFuY2VkLnVwZGF0ZU9uU2VsZWN0b3JDaGFuZ2UgJiYgc2VsLmxlbmd0aD4wKXtzZWwuZWFjaChmdW5jdGlvbigpe3RvdGFsKz10aGlzLm9mZnNldEhlaWdodCt0aGlzLm9mZnNldFdpZHRoO30pO31cclxuXHRcdFx0XHRyZXR1cm4gdG90YWw7XHJcblx0XHRcdH1cclxuXHRcdFx0LyogY2FsbHMgdGhlIHVwZGF0ZSBtZXRob2QgKi9cclxuXHRcdFx0ZnVuY3Rpb24gZG9VcGQoY2Ipe1xyXG5cdFx0XHRcdGNsZWFyVGltZW91dChtQ1NCX2NvbnRhaW5lclswXS5hdXRvVXBkYXRlKTtcclxuXHRcdFx0XHRtZXRob2RzLnVwZGF0ZS5jYWxsKG51bGwsJHRoaXNbMF0sY2IpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHRcdFxyXG5cdFx0XHJcblx0XHQvKiBzbmFwcyBzY3JvbGxpbmcgdG8gYSBtdWx0aXBsZSBvZiBhIHBpeGVscyBudW1iZXIgKi9cclxuXHRcdF9zbmFwQW1vdW50PWZ1bmN0aW9uKHRvLGFtb3VudCxvZmZzZXQpe1xyXG5cdFx0XHRyZXR1cm4gKE1hdGgucm91bmQodG8vYW1vdW50KSphbW91bnQtb2Zmc2V0KTsgXHJcblx0XHR9LFxyXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHRcdFxyXG5cdFx0XHJcblx0XHQvKiBzdG9wcyBjb250ZW50IGFuZCBzY3JvbGxiYXIgYW5pbWF0aW9ucyAqL1xyXG5cdFx0X3N0b3A9ZnVuY3Rpb24oZWwpe1xyXG5cdFx0XHR2YXIgZD1lbC5kYXRhKHBsdWdpblBmeCksXHJcblx0XHRcdFx0c2VsPSQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXIsI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyX3dyYXBwZXIsI21DU0JfXCIrZC5pZHgrXCJfZHJhZ2dlcl92ZXJ0aWNhbCwjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX2hvcml6b250YWxcIik7XHJcblx0XHRcdHNlbC5lYWNoKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0X3N0b3BUd2Vlbi5jYWxsKHRoaXMpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0sXHJcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cdFx0XHJcblx0XHRcclxuXHRcdC8qIFxyXG5cdFx0QU5JTUFURVMgQ09OVEVOVCBcclxuXHRcdFRoaXMgaXMgd2hlcmUgdGhlIGFjdHVhbCBzY3JvbGxpbmcgaGFwcGVuc1xyXG5cdFx0Ki9cclxuXHRcdF9zY3JvbGxUbz1mdW5jdGlvbihlbCx0byxvcHRpb25zKXtcclxuXHRcdFx0dmFyIGQ9ZWwuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsXHJcblx0XHRcdFx0ZGVmYXVsdHM9e1xyXG5cdFx0XHRcdFx0dHJpZ2dlcjpcImludGVybmFsXCIsXHJcblx0XHRcdFx0XHRkaXI6XCJ5XCIsXHJcblx0XHRcdFx0XHRzY3JvbGxFYXNpbmc6XCJtY3NFYXNlT3V0XCIsXHJcblx0XHRcdFx0XHRkcmFnOmZhbHNlLFxyXG5cdFx0XHRcdFx0ZHVyOm8uc2Nyb2xsSW5lcnRpYSxcclxuXHRcdFx0XHRcdG92ZXJ3cml0ZTpcImFsbFwiLFxyXG5cdFx0XHRcdFx0Y2FsbGJhY2tzOnRydWUsXHJcblx0XHRcdFx0XHRvblN0YXJ0OnRydWUsXHJcblx0XHRcdFx0XHRvblVwZGF0ZTp0cnVlLFxyXG5cdFx0XHRcdFx0b25Db21wbGV0ZTp0cnVlXHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRvcHRpb25zPSQuZXh0ZW5kKGRlZmF1bHRzLG9wdGlvbnMpLFxyXG5cdFx0XHRcdGR1cj1bb3B0aW9ucy5kdXIsKG9wdGlvbnMuZHJhZyA/IDAgOiBvcHRpb25zLmR1cildLFxyXG5cdFx0XHRcdG1DdXN0b21TY3JvbGxCb3g9JChcIiNtQ1NCX1wiK2QuaWR4KSxcclxuXHRcdFx0XHRtQ1NCX2NvbnRhaW5lcj0kKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpLFxyXG5cdFx0XHRcdHdyYXBwZXI9bUNTQl9jb250YWluZXIucGFyZW50KCksXHJcblx0XHRcdFx0dG90YWxTY3JvbGxPZmZzZXRzPW8uY2FsbGJhY2tzLm9uVG90YWxTY3JvbGxPZmZzZXQgPyBfYXJyLmNhbGwoZWwsby5jYWxsYmFja3Mub25Ub3RhbFNjcm9sbE9mZnNldCkgOiBbMCwwXSxcclxuXHRcdFx0XHR0b3RhbFNjcm9sbEJhY2tPZmZzZXRzPW8uY2FsbGJhY2tzLm9uVG90YWxTY3JvbGxCYWNrT2Zmc2V0ID8gX2Fyci5jYWxsKGVsLG8uY2FsbGJhY2tzLm9uVG90YWxTY3JvbGxCYWNrT2Zmc2V0KSA6IFswLDBdO1xyXG5cdFx0XHRkLnRyaWdnZXI9b3B0aW9ucy50cmlnZ2VyO1xyXG5cdFx0XHRpZih3cmFwcGVyLnNjcm9sbFRvcCgpIT09MCB8fCB3cmFwcGVyLnNjcm9sbExlZnQoKSE9PTApeyAvKiBhbHdheXMgcmVzZXQgc2Nyb2xsVG9wL0xlZnQgKi9cclxuXHRcdFx0XHQkKFwiLm1DU0JfXCIrZC5pZHgrXCJfc2Nyb2xsYmFyXCIpLmNzcyhcInZpc2liaWxpdHlcIixcInZpc2libGVcIik7XHJcblx0XHRcdFx0d3JhcHBlci5zY3JvbGxUb3AoMCkuc2Nyb2xsTGVmdCgwKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZih0bz09PVwiX3Jlc2V0WVwiICYmICFkLmNvbnRlbnRSZXNldC55KXtcclxuXHRcdFx0XHQvKiBjYWxsYmFja3M6IG9uT3ZlcmZsb3dZTm9uZSAqL1xyXG5cdFx0XHRcdGlmKF9jYihcIm9uT3ZlcmZsb3dZTm9uZVwiKSl7by5jYWxsYmFja3Mub25PdmVyZmxvd1lOb25lLmNhbGwoZWxbMF0pO31cclxuXHRcdFx0XHRkLmNvbnRlbnRSZXNldC55PTE7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYodG89PT1cIl9yZXNldFhcIiAmJiAhZC5jb250ZW50UmVzZXQueCl7XHJcblx0XHRcdFx0LyogY2FsbGJhY2tzOiBvbk92ZXJmbG93WE5vbmUgKi9cclxuXHRcdFx0XHRpZihfY2IoXCJvbk92ZXJmbG93WE5vbmVcIikpe28uY2FsbGJhY2tzLm9uT3ZlcmZsb3dYTm9uZS5jYWxsKGVsWzBdKTt9XHJcblx0XHRcdFx0ZC5jb250ZW50UmVzZXQueD0xO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHRvPT09XCJfcmVzZXRZXCIgfHwgdG89PT1cIl9yZXNldFhcIil7cmV0dXJuO31cclxuXHRcdFx0aWYoKGQuY29udGVudFJlc2V0LnkgfHwgIWVsWzBdLm1jcykgJiYgZC5vdmVyZmxvd2VkWzBdKXtcclxuXHRcdFx0XHQvKiBjYWxsYmFja3M6IG9uT3ZlcmZsb3dZICovXHJcblx0XHRcdFx0aWYoX2NiKFwib25PdmVyZmxvd1lcIikpe28uY2FsbGJhY2tzLm9uT3ZlcmZsb3dZLmNhbGwoZWxbMF0pO31cclxuXHRcdFx0XHRkLmNvbnRlbnRSZXNldC54PW51bGw7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoKGQuY29udGVudFJlc2V0LnggfHwgIWVsWzBdLm1jcykgJiYgZC5vdmVyZmxvd2VkWzFdKXtcclxuXHRcdFx0XHQvKiBjYWxsYmFja3M6IG9uT3ZlcmZsb3dYICovXHJcblx0XHRcdFx0aWYoX2NiKFwib25PdmVyZmxvd1hcIikpe28uY2FsbGJhY2tzLm9uT3ZlcmZsb3dYLmNhbGwoZWxbMF0pO31cclxuXHRcdFx0XHRkLmNvbnRlbnRSZXNldC54PW51bGw7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoby5zbmFwQW1vdW50KXsgLyogc2Nyb2xsaW5nIHNuYXBwaW5nICovXHJcblx0XHRcdFx0dmFyIHNuYXBBbW91bnQ9IShvLnNuYXBBbW91bnQgaW5zdGFuY2VvZiBBcnJheSkgPyBvLnNuYXBBbW91bnQgOiBvcHRpb25zLmRpcj09PVwieFwiID8gby5zbmFwQW1vdW50WzFdIDogby5zbmFwQW1vdW50WzBdO1xyXG5cdFx0XHRcdHRvPV9zbmFwQW1vdW50KHRvLHNuYXBBbW91bnQsby5zbmFwT2Zmc2V0KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRzd2l0Y2gob3B0aW9ucy5kaXIpe1xyXG5cdFx0XHRcdGNhc2UgXCJ4XCI6XHJcblx0XHRcdFx0XHR2YXIgbUNTQl9kcmFnZ2VyPSQoXCIjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX2hvcml6b250YWxcIiksXHJcblx0XHRcdFx0XHRcdHByb3BlcnR5PVwibGVmdFwiLFxyXG5cdFx0XHRcdFx0XHRjb250ZW50UG9zPW1DU0JfY29udGFpbmVyWzBdLm9mZnNldExlZnQsXHJcblx0XHRcdFx0XHRcdGxpbWl0PVtcclxuXHRcdFx0XHRcdFx0XHRtQ3VzdG9tU2Nyb2xsQm94LndpZHRoKCktbUNTQl9jb250YWluZXIub3V0ZXJXaWR0aChmYWxzZSksXHJcblx0XHRcdFx0XHRcdFx0bUNTQl9kcmFnZ2VyLnBhcmVudCgpLndpZHRoKCktbUNTQl9kcmFnZ2VyLndpZHRoKClcclxuXHRcdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdFx0c2Nyb2xsVG89W3RvLHRvPT09MCA/IDAgOiAodG8vZC5zY3JvbGxSYXRpby54KV0sXHJcblx0XHRcdFx0XHRcdHRzbz10b3RhbFNjcm9sbE9mZnNldHNbMV0sXHJcblx0XHRcdFx0XHRcdHRzYm89dG90YWxTY3JvbGxCYWNrT2Zmc2V0c1sxXSxcclxuXHRcdFx0XHRcdFx0dG90YWxTY3JvbGxPZmZzZXQ9dHNvPjAgPyB0c28vZC5zY3JvbGxSYXRpby54IDogMCxcclxuXHRcdFx0XHRcdFx0dG90YWxTY3JvbGxCYWNrT2Zmc2V0PXRzYm8+MCA/IHRzYm8vZC5zY3JvbGxSYXRpby54IDogMDtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdGNhc2UgXCJ5XCI6XHJcblx0XHRcdFx0XHR2YXIgbUNTQl9kcmFnZ2VyPSQoXCIjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX3ZlcnRpY2FsXCIpLFxyXG5cdFx0XHRcdFx0XHRwcm9wZXJ0eT1cInRvcFwiLFxyXG5cdFx0XHRcdFx0XHRjb250ZW50UG9zPW1DU0JfY29udGFpbmVyWzBdLm9mZnNldFRvcCxcclxuXHRcdFx0XHRcdFx0bGltaXQ9W1xyXG5cdFx0XHRcdFx0XHRcdG1DdXN0b21TY3JvbGxCb3guaGVpZ2h0KCktbUNTQl9jb250YWluZXIub3V0ZXJIZWlnaHQoZmFsc2UpLFxyXG5cdFx0XHRcdFx0XHRcdG1DU0JfZHJhZ2dlci5wYXJlbnQoKS5oZWlnaHQoKS1tQ1NCX2RyYWdnZXIuaGVpZ2h0KClcclxuXHRcdFx0XHRcdFx0XSxcclxuXHRcdFx0XHRcdFx0c2Nyb2xsVG89W3RvLHRvPT09MCA/IDAgOiAodG8vZC5zY3JvbGxSYXRpby55KV0sXHJcblx0XHRcdFx0XHRcdHRzbz10b3RhbFNjcm9sbE9mZnNldHNbMF0sXHJcblx0XHRcdFx0XHRcdHRzYm89dG90YWxTY3JvbGxCYWNrT2Zmc2V0c1swXSxcclxuXHRcdFx0XHRcdFx0dG90YWxTY3JvbGxPZmZzZXQ9dHNvPjAgPyB0c28vZC5zY3JvbGxSYXRpby55IDogMCxcclxuXHRcdFx0XHRcdFx0dG90YWxTY3JvbGxCYWNrT2Zmc2V0PXRzYm8+MCA/IHRzYm8vZC5zY3JvbGxSYXRpby55IDogMDtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmKHNjcm9sbFRvWzFdPDAgfHwgKHNjcm9sbFRvWzBdPT09MCAmJiBzY3JvbGxUb1sxXT09PTApKXtcclxuXHRcdFx0XHRzY3JvbGxUbz1bMCwwXTtcclxuXHRcdFx0fWVsc2UgaWYoc2Nyb2xsVG9bMV0+PWxpbWl0WzFdKXtcclxuXHRcdFx0XHRzY3JvbGxUbz1bbGltaXRbMF0sbGltaXRbMV1dO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRzY3JvbGxUb1swXT0tc2Nyb2xsVG9bMF07XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoIWVsWzBdLm1jcyl7XHJcblx0XHRcdFx0X21jcygpOyAgLyogaW5pdCBtY3Mgb2JqZWN0IChvbmNlKSB0byBtYWtlIGl0IGF2YWlsYWJsZSBiZWZvcmUgY2FsbGJhY2tzICovXHJcblx0XHRcdFx0aWYoX2NiKFwib25Jbml0XCIpKXtvLmNhbGxiYWNrcy5vbkluaXQuY2FsbChlbFswXSk7fSAvKiBjYWxsYmFja3M6IG9uSW5pdCAqL1xyXG5cdFx0XHR9XHJcblx0XHRcdGNsZWFyVGltZW91dChtQ1NCX2NvbnRhaW5lclswXS5vbkNvbXBsZXRlVGltZW91dCk7XHJcblx0XHRcdF90d2VlblRvKG1DU0JfZHJhZ2dlclswXSxwcm9wZXJ0eSxNYXRoLnJvdW5kKHNjcm9sbFRvWzFdKSxkdXJbMV0sb3B0aW9ucy5zY3JvbGxFYXNpbmcpO1xyXG5cdFx0XHRpZighZC50d2VlblJ1bm5pbmcgJiYgKChjb250ZW50UG9zPT09MCAmJiBzY3JvbGxUb1swXT49MCkgfHwgKGNvbnRlbnRQb3M9PT1saW1pdFswXSAmJiBzY3JvbGxUb1swXTw9bGltaXRbMF0pKSl7cmV0dXJuO31cclxuXHRcdFx0X3R3ZWVuVG8obUNTQl9jb250YWluZXJbMF0scHJvcGVydHksTWF0aC5yb3VuZChzY3JvbGxUb1swXSksZHVyWzBdLG9wdGlvbnMuc2Nyb2xsRWFzaW5nLG9wdGlvbnMub3ZlcndyaXRlLHtcclxuXHRcdFx0XHRvblN0YXJ0OmZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRpZihvcHRpb25zLmNhbGxiYWNrcyAmJiBvcHRpb25zLm9uU3RhcnQgJiYgIWQudHdlZW5SdW5uaW5nKXtcclxuXHRcdFx0XHRcdFx0LyogY2FsbGJhY2tzOiBvblNjcm9sbFN0YXJ0ICovXHJcblx0XHRcdFx0XHRcdGlmKF9jYihcIm9uU2Nyb2xsU3RhcnRcIikpe19tY3MoKTsgby5jYWxsYmFja3Mub25TY3JvbGxTdGFydC5jYWxsKGVsWzBdKTt9XHJcblx0XHRcdFx0XHRcdGQudHdlZW5SdW5uaW5nPXRydWU7XHJcblx0XHRcdFx0XHRcdF9vbkRyYWdDbGFzc2VzKG1DU0JfZHJhZ2dlcik7XHJcblx0XHRcdFx0XHRcdGQuY2JPZmZzZXRzPV9jYk9mZnNldHMoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LG9uVXBkYXRlOmZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRpZihvcHRpb25zLmNhbGxiYWNrcyAmJiBvcHRpb25zLm9uVXBkYXRlKXtcclxuXHRcdFx0XHRcdFx0LyogY2FsbGJhY2tzOiB3aGlsZVNjcm9sbGluZyAqL1xyXG5cdFx0XHRcdFx0XHRpZihfY2IoXCJ3aGlsZVNjcm9sbGluZ1wiKSl7X21jcygpOyBvLmNhbGxiYWNrcy53aGlsZVNjcm9sbGluZy5jYWxsKGVsWzBdKTt9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSxvbkNvbXBsZXRlOmZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRpZihvcHRpb25zLmNhbGxiYWNrcyAmJiBvcHRpb25zLm9uQ29tcGxldGUpe1xyXG5cdFx0XHRcdFx0XHRpZihvLmF4aXM9PT1cInl4XCIpe2NsZWFyVGltZW91dChtQ1NCX2NvbnRhaW5lclswXS5vbkNvbXBsZXRlVGltZW91dCk7fVxyXG5cdFx0XHRcdFx0XHR2YXIgdD1tQ1NCX2NvbnRhaW5lclswXS5pZGxlVGltZXIgfHwgMDtcclxuXHRcdFx0XHRcdFx0bUNTQl9jb250YWluZXJbMF0ub25Db21wbGV0ZVRpbWVvdXQ9c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0XHRcdC8qIGNhbGxiYWNrczogb25TY3JvbGwsIG9uVG90YWxTY3JvbGwsIG9uVG90YWxTY3JvbGxCYWNrICovXHJcblx0XHRcdFx0XHRcdFx0aWYoX2NiKFwib25TY3JvbGxcIikpe19tY3MoKTsgby5jYWxsYmFja3Mub25TY3JvbGwuY2FsbChlbFswXSk7fVxyXG5cdFx0XHRcdFx0XHRcdGlmKF9jYihcIm9uVG90YWxTY3JvbGxcIikgJiYgc2Nyb2xsVG9bMV0+PWxpbWl0WzFdLXRvdGFsU2Nyb2xsT2Zmc2V0ICYmIGQuY2JPZmZzZXRzWzBdKXtfbWNzKCk7IG8uY2FsbGJhY2tzLm9uVG90YWxTY3JvbGwuY2FsbChlbFswXSk7fVxyXG5cdFx0XHRcdFx0XHRcdGlmKF9jYihcIm9uVG90YWxTY3JvbGxCYWNrXCIpICYmIHNjcm9sbFRvWzFdPD10b3RhbFNjcm9sbEJhY2tPZmZzZXQgJiYgZC5jYk9mZnNldHNbMV0pe19tY3MoKTsgby5jYWxsYmFja3Mub25Ub3RhbFNjcm9sbEJhY2suY2FsbChlbFswXSk7fVxyXG5cdFx0XHRcdFx0XHRcdGQudHdlZW5SdW5uaW5nPWZhbHNlO1xyXG5cdFx0XHRcdFx0XHRcdG1DU0JfY29udGFpbmVyWzBdLmlkbGVUaW1lcj0wO1xyXG5cdFx0XHRcdFx0XHRcdF9vbkRyYWdDbGFzc2VzKG1DU0JfZHJhZ2dlcixcImhpZGVcIik7XHJcblx0XHRcdFx0XHRcdH0sdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdFx0LyogY2hlY2tzIGlmIGNhbGxiYWNrIGZ1bmN0aW9uIGV4aXN0cyAqL1xyXG5cdFx0XHRmdW5jdGlvbiBfY2IoY2Ipe1xyXG5cdFx0XHRcdHJldHVybiBkICYmIG8uY2FsbGJhY2tzW2NiXSAmJiB0eXBlb2Ygby5jYWxsYmFja3NbY2JdPT09XCJmdW5jdGlvblwiO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8qIGNoZWNrcyB3aGV0aGVyIGNhbGxiYWNrIG9mZnNldHMgYWx3YXlzIHRyaWdnZXIgKi9cclxuXHRcdFx0ZnVuY3Rpb24gX2NiT2Zmc2V0cygpe1xyXG5cdFx0XHRcdHJldHVybiBbby5jYWxsYmFja3MuYWx3YXlzVHJpZ2dlck9mZnNldHMgfHwgY29udGVudFBvcz49bGltaXRbMF0rdHNvLG8uY2FsbGJhY2tzLmFsd2F5c1RyaWdnZXJPZmZzZXRzIHx8IGNvbnRlbnRQb3M8PS10c2JvXTtcclxuXHRcdFx0fVxyXG5cdFx0XHQvKiBcclxuXHRcdFx0cG9wdWxhdGVzIG9iamVjdCB3aXRoIHVzZWZ1bCB2YWx1ZXMgZm9yIHRoZSB1c2VyIFxyXG5cdFx0XHR2YWx1ZXM6IFxyXG5cdFx0XHRcdGNvbnRlbnQ6IHRoaXMubWNzLmNvbnRlbnRcclxuXHRcdFx0XHRjb250ZW50IHRvcCBwb3NpdGlvbjogdGhpcy5tY3MudG9wIFxyXG5cdFx0XHRcdGNvbnRlbnQgbGVmdCBwb3NpdGlvbjogdGhpcy5tY3MubGVmdCBcclxuXHRcdFx0XHRkcmFnZ2VyIHRvcCBwb3NpdGlvbjogdGhpcy5tY3MuZHJhZ2dlclRvcCBcclxuXHRcdFx0XHRkcmFnZ2VyIGxlZnQgcG9zaXRpb246IHRoaXMubWNzLmRyYWdnZXJMZWZ0IFxyXG5cdFx0XHRcdHNjcm9sbGluZyB5IHBlcmNlbnRhZ2U6IHRoaXMubWNzLnRvcFBjdCBcclxuXHRcdFx0XHRzY3JvbGxpbmcgeCBwZXJjZW50YWdlOiB0aGlzLm1jcy5sZWZ0UGN0IFxyXG5cdFx0XHRcdHNjcm9sbGluZyBkaXJlY3Rpb246IHRoaXMubWNzLmRpcmVjdGlvblxyXG5cdFx0XHQqL1xyXG5cdFx0XHRmdW5jdGlvbiBfbWNzKCl7XHJcblx0XHRcdFx0dmFyIGNwPVttQ1NCX2NvbnRhaW5lclswXS5vZmZzZXRUb3AsbUNTQl9jb250YWluZXJbMF0ub2Zmc2V0TGVmdF0sIC8qIGNvbnRlbnQgcG9zaXRpb24gKi9cclxuXHRcdFx0XHRcdGRwPVttQ1NCX2RyYWdnZXJbMF0ub2Zmc2V0VG9wLG1DU0JfZHJhZ2dlclswXS5vZmZzZXRMZWZ0XSwgLyogZHJhZ2dlciBwb3NpdGlvbiAqL1xyXG5cdFx0XHRcdFx0Y2w9W21DU0JfY29udGFpbmVyLm91dGVySGVpZ2h0KGZhbHNlKSxtQ1NCX2NvbnRhaW5lci5vdXRlcldpZHRoKGZhbHNlKV0sIC8qIGNvbnRlbnQgbGVuZ3RoICovXHJcblx0XHRcdFx0XHRwbD1bbUN1c3RvbVNjcm9sbEJveC5oZWlnaHQoKSxtQ3VzdG9tU2Nyb2xsQm94LndpZHRoKCldOyAvKiBjb250ZW50IHBhcmVudCBsZW5ndGggKi9cclxuXHRcdFx0XHRlbFswXS5tY3M9e1xyXG5cdFx0XHRcdFx0Y29udGVudDptQ1NCX2NvbnRhaW5lciwgLyogb3JpZ2luYWwgY29udGVudCB3cmFwcGVyIGFzIGpxdWVyeSBvYmplY3QgKi9cclxuXHRcdFx0XHRcdHRvcDpjcFswXSxsZWZ0OmNwWzFdLGRyYWdnZXJUb3A6ZHBbMF0sZHJhZ2dlckxlZnQ6ZHBbMV0sXHJcblx0XHRcdFx0XHR0b3BQY3Q6TWF0aC5yb3VuZCgoMTAwKk1hdGguYWJzKGNwWzBdKSkvKE1hdGguYWJzKGNsWzBdKS1wbFswXSkpLGxlZnRQY3Q6TWF0aC5yb3VuZCgoMTAwKk1hdGguYWJzKGNwWzFdKSkvKE1hdGguYWJzKGNsWzFdKS1wbFsxXSkpLFxyXG5cdFx0XHRcdFx0ZGlyZWN0aW9uOm9wdGlvbnMuZGlyXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHQvKiBcclxuXHRcdFx0XHR0aGlzIHJlZmVycyB0byB0aGUgb3JpZ2luYWwgZWxlbWVudCBjb250YWluaW5nIHRoZSBzY3JvbGxiYXIocylcclxuXHRcdFx0XHR1c2FnZTogdGhpcy5tY3MudG9wLCB0aGlzLm1jcy5sZWZ0UGN0IGV0Yy4gXHJcblx0XHRcdFx0Ki9cclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblx0XHRcclxuXHRcdFxyXG5cdFx0LyogXHJcblx0XHRDVVNUT00gSkFWQVNDUklQVCBBTklNQVRJT04gVFdFRU4gXHJcblx0XHRMaWdodGVyIGFuZCBmYXN0ZXIgdGhhbiBqcXVlcnkgYW5pbWF0ZSgpIGFuZCBjc3MgdHJhbnNpdGlvbnMgXHJcblx0XHRBbmltYXRlcyB0b3AvbGVmdCBwcm9wZXJ0aWVzIGFuZCBpbmNsdWRlcyBlYXNpbmdzIFxyXG5cdFx0Ki9cclxuXHRcdF90d2VlblRvPWZ1bmN0aW9uKGVsLHByb3AsdG8sZHVyYXRpb24sZWFzaW5nLG92ZXJ3cml0ZSxjYWxsYmFja3Mpe1xyXG5cdFx0XHRpZighZWwuX21Ud2Vlbil7ZWwuX21Ud2Vlbj17dG9wOnt9LGxlZnQ6e319O31cclxuXHRcdFx0dmFyIGNhbGxiYWNrcz1jYWxsYmFja3MgfHwge30sXHJcblx0XHRcdFx0b25TdGFydD1jYWxsYmFja3Mub25TdGFydCB8fCBmdW5jdGlvbigpe30sb25VcGRhdGU9Y2FsbGJhY2tzLm9uVXBkYXRlIHx8IGZ1bmN0aW9uKCl7fSxvbkNvbXBsZXRlPWNhbGxiYWNrcy5vbkNvbXBsZXRlIHx8IGZ1bmN0aW9uKCl7fSxcclxuXHRcdFx0XHRzdGFydFRpbWU9X2dldFRpbWUoKSxfZGVsYXkscHJvZ3Jlc3M9MCxmcm9tPWVsLm9mZnNldFRvcCxlbFN0eWxlPWVsLnN0eWxlLF9yZXF1ZXN0LHRvYmo9ZWwuX21Ud2Vlbltwcm9wXTtcclxuXHRcdFx0aWYocHJvcD09PVwibGVmdFwiKXtmcm9tPWVsLm9mZnNldExlZnQ7fVxyXG5cdFx0XHR2YXIgZGlmZj10by1mcm9tO1xyXG5cdFx0XHR0b2JqLnN0b3A9MDtcclxuXHRcdFx0aWYob3ZlcndyaXRlIT09XCJub25lXCIpe19jYW5jZWxUd2VlbigpO31cclxuXHRcdFx0X3N0YXJ0VHdlZW4oKTtcclxuXHRcdFx0ZnVuY3Rpb24gX3N0ZXAoKXtcclxuXHRcdFx0XHRpZih0b2JqLnN0b3Ape3JldHVybjt9XHJcblx0XHRcdFx0aWYoIXByb2dyZXNzKXtvblN0YXJ0LmNhbGwoKTt9XHJcblx0XHRcdFx0cHJvZ3Jlc3M9X2dldFRpbWUoKS1zdGFydFRpbWU7XHJcblx0XHRcdFx0X3R3ZWVuKCk7XHJcblx0XHRcdFx0aWYocHJvZ3Jlc3M+PXRvYmoudGltZSl7XHJcblx0XHRcdFx0XHR0b2JqLnRpbWU9KHByb2dyZXNzPnRvYmoudGltZSkgPyBwcm9ncmVzcytfZGVsYXktKHByb2dyZXNzLXRvYmoudGltZSkgOiBwcm9ncmVzcytfZGVsYXktMTtcclxuXHRcdFx0XHRcdGlmKHRvYmoudGltZTxwcm9ncmVzcysxKXt0b2JqLnRpbWU9cHJvZ3Jlc3MrMTt9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHRvYmoudGltZTxkdXJhdGlvbil7dG9iai5pZD1fcmVxdWVzdChfc3RlcCk7fWVsc2V7b25Db21wbGV0ZS5jYWxsKCk7fVxyXG5cdFx0XHR9XHJcblx0XHRcdGZ1bmN0aW9uIF90d2Vlbigpe1xyXG5cdFx0XHRcdGlmKGR1cmF0aW9uPjApe1xyXG5cdFx0XHRcdFx0dG9iai5jdXJyVmFsPV9lYXNlKHRvYmoudGltZSxmcm9tLGRpZmYsZHVyYXRpb24sZWFzaW5nKTtcclxuXHRcdFx0XHRcdGVsU3R5bGVbcHJvcF09TWF0aC5yb3VuZCh0b2JqLmN1cnJWYWwpK1wicHhcIjtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGVsU3R5bGVbcHJvcF09dG8rXCJweFwiO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRvblVwZGF0ZS5jYWxsKCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gX3N0YXJ0VHdlZW4oKXtcclxuXHRcdFx0XHRfZGVsYXk9MTAwMC82MDtcclxuXHRcdFx0XHR0b2JqLnRpbWU9cHJvZ3Jlc3MrX2RlbGF5O1xyXG5cdFx0XHRcdF9yZXF1ZXN0PSghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkgPyBmdW5jdGlvbihmKXtfdHdlZW4oKTsgcmV0dXJuIHNldFRpbWVvdXQoZiwwLjAxKTt9IDogd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTtcclxuXHRcdFx0XHR0b2JqLmlkPV9yZXF1ZXN0KF9zdGVwKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRmdW5jdGlvbiBfY2FuY2VsVHdlZW4oKXtcclxuXHRcdFx0XHRpZih0b2JqLmlkPT1udWxsKXtyZXR1cm47fVxyXG5cdFx0XHRcdGlmKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKXtjbGVhclRpbWVvdXQodG9iai5pZCk7XHJcblx0XHRcdFx0fWVsc2V7d2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRvYmouaWQpO31cclxuXHRcdFx0XHR0b2JqLmlkPW51bGw7XHJcblx0XHRcdH1cclxuXHRcdFx0ZnVuY3Rpb24gX2Vhc2UodCxiLGMsZCx0eXBlKXtcclxuXHRcdFx0XHRzd2l0Y2godHlwZSl7XHJcblx0XHRcdFx0XHRjYXNlIFwibGluZWFyXCI6IGNhc2UgXCJtY3NMaW5lYXJcIjpcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGMqdC9kICsgYjtcclxuXHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRjYXNlIFwibWNzTGluZWFyT3V0XCI6XHJcblx0XHRcdFx0XHRcdHQvPWQ7IHQtLTsgcmV0dXJuIGMgKiBNYXRoLnNxcnQoMSAtIHQqdCkgKyBiO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgXCJlYXNlSW5PdXRTbW9vdGhcIjpcclxuXHRcdFx0XHRcdFx0dC89ZC8yO1xyXG5cdFx0XHRcdFx0XHRpZih0PDEpIHJldHVybiBjLzIqdCp0ICsgYjtcclxuXHRcdFx0XHRcdFx0dC0tO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gLWMvMiAqICh0Kih0LTIpIC0gMSkgKyBiO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgXCJlYXNlSW5PdXRTdHJvbmdcIjpcclxuXHRcdFx0XHRcdFx0dC89ZC8yO1xyXG5cdFx0XHRcdFx0XHRpZih0PDEpIHJldHVybiBjLzIgKiBNYXRoLnBvdyggMiwgMTAgKiAodCAtIDEpICkgKyBiO1xyXG5cdFx0XHRcdFx0XHR0LS07XHJcblx0XHRcdFx0XHRcdHJldHVybiBjLzIgKiAoIC1NYXRoLnBvdyggMiwgLTEwICogdCkgKyAyICkgKyBiO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgXCJlYXNlSW5PdXRcIjogY2FzZSBcIm1jc0Vhc2VJbk91dFwiOlxyXG5cdFx0XHRcdFx0XHR0Lz1kLzI7XHJcblx0XHRcdFx0XHRcdGlmKHQ8MSkgcmV0dXJuIGMvMip0KnQqdCArIGI7XHJcblx0XHRcdFx0XHRcdHQtPTI7XHJcblx0XHRcdFx0XHRcdHJldHVybiBjLzIqKHQqdCp0ICsgMikgKyBiO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgXCJlYXNlT3V0U21vb3RoXCI6XHJcblx0XHRcdFx0XHRcdHQvPWQ7IHQtLTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIC1jICogKHQqdCp0KnQgLSAxKSArIGI7XHJcblx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0Y2FzZSBcImVhc2VPdXRTdHJvbmdcIjpcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGMgKiAoIC1NYXRoLnBvdyggMiwgLTEwICogdC9kICkgKyAxICkgKyBiO1xyXG5cdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdGNhc2UgXCJlYXNlT3V0XCI6IGNhc2UgXCJtY3NFYXNlT3V0XCI6IGRlZmF1bHQ6XHJcblx0XHRcdFx0XHRcdHZhciB0cz0odC89ZCkqdCx0Yz10cyp0O1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gYitjKigwLjQ5OTk5OTk5OTk5OTk5Nyp0Yyp0cyArIC0yLjUqdHMqdHMgKyA1LjUqdGMgKyAtNi41KnRzICsgNCp0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cdFx0XHJcblx0XHRcclxuXHRcdC8qIHJldHVybnMgY3VycmVudCB0aW1lICovXHJcblx0XHRfZ2V0VGltZT1mdW5jdGlvbigpe1xyXG5cdFx0XHRpZih3aW5kb3cucGVyZm9ybWFuY2UgJiYgd2luZG93LnBlcmZvcm1hbmNlLm5vdyl7XHJcblx0XHRcdFx0cmV0dXJuIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0aWYod2luZG93LnBlcmZvcm1hbmNlICYmIHdpbmRvdy5wZXJmb3JtYW5jZS53ZWJraXROb3cpe1xyXG5cdFx0XHRcdFx0cmV0dXJuIHdpbmRvdy5wZXJmb3JtYW5jZS53ZWJraXROb3coKTtcclxuXHRcdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRcdGlmKERhdGUubm93KXtyZXR1cm4gRGF0ZS5ub3coKTt9ZWxzZXtyZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblx0XHRcclxuXHRcdFxyXG5cdFx0Lyogc3RvcHMgYSB0d2VlbiAqL1xyXG5cdFx0X3N0b3BUd2Vlbj1mdW5jdGlvbigpe1xyXG5cdFx0XHR2YXIgZWw9dGhpcztcclxuXHRcdFx0aWYoIWVsLl9tVHdlZW4pe2VsLl9tVHdlZW49e3RvcDp7fSxsZWZ0Ont9fTt9XHJcblx0XHRcdHZhciBwcm9wcz1bXCJ0b3BcIixcImxlZnRcIl07XHJcblx0XHRcdGZvcih2YXIgaT0wOyBpPHByb3BzLmxlbmd0aDsgaSsrKXtcclxuXHRcdFx0XHR2YXIgcHJvcD1wcm9wc1tpXTtcclxuXHRcdFx0XHRpZihlbC5fbVR3ZWVuW3Byb3BdLmlkKXtcclxuXHRcdFx0XHRcdGlmKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKXtjbGVhclRpbWVvdXQoZWwuX21Ud2Vlbltwcm9wXS5pZCk7XHJcblx0XHRcdFx0XHR9ZWxzZXt3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUoZWwuX21Ud2Vlbltwcm9wXS5pZCk7fVxyXG5cdFx0XHRcdFx0ZWwuX21Ud2Vlbltwcm9wXS5pZD1udWxsO1xyXG5cdFx0XHRcdFx0ZWwuX21Ud2Vlbltwcm9wXS5zdG9wPTE7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHRcdFxyXG5cdFx0XHJcblx0XHQvKiBkZWxldGVzIGEgcHJvcGVydHkgKGF2b2lkaW5nIHRoZSBleGNlcHRpb24gdGhyb3duIGJ5IElFKSAqL1xyXG5cdFx0X2RlbGV0ZT1mdW5jdGlvbihjLG0pe1xyXG5cdFx0XHR0cnl7ZGVsZXRlIGNbbV07fWNhdGNoKGUpe2NbbV09bnVsbDt9XHJcblx0XHR9LFxyXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHRcdFxyXG5cdFx0XHJcblx0XHQvKiBkZXRlY3RzIGxlZnQgbW91c2UgYnV0dG9uICovXHJcblx0XHRfbW91c2VCdG5MZWZ0PWZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRyZXR1cm4gIShlLndoaWNoICYmIGUud2hpY2ghPT0xKTtcclxuXHRcdH0sXHJcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cdFx0XHJcblx0XHRcclxuXHRcdC8qIGRldGVjdHMgaWYgcG9pbnRlciB0eXBlIGV2ZW50IGlzIHRvdWNoICovXHJcblx0XHRfcG9pbnRlclRvdWNoPWZ1bmN0aW9uKGUpe1xyXG5cdFx0XHR2YXIgdD1lLm9yaWdpbmFsRXZlbnQucG9pbnRlclR5cGU7XHJcblx0XHRcdHJldHVybiAhKHQgJiYgdCE9PVwidG91Y2hcIiAmJiB0IT09Mik7XHJcblx0XHR9LFxyXG5cdFx0LyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHRcdFxyXG5cdFx0XHJcblx0XHQvKiBjaGVja3MgaWYgdmFsdWUgaXMgbnVtZXJpYyAqL1xyXG5cdFx0X2lzTnVtZXJpYz1mdW5jdGlvbih2YWwpe1xyXG5cdFx0XHRyZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQodmFsKSkgJiYgaXNGaW5pdGUodmFsKTtcclxuXHRcdH0sXHJcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cdFx0XHJcblx0XHRcclxuXHRcdC8qIHJldHVybnMgZWxlbWVudCBwb3NpdGlvbiBhY2NvcmRpbmcgdG8gY29udGVudCAqL1xyXG5cdFx0X2NoaWxkUG9zPWZ1bmN0aW9uKGVsKXtcclxuXHRcdFx0dmFyIHA9ZWwucGFyZW50cyhcIi5tQ1NCX2NvbnRhaW5lclwiKTtcclxuXHRcdFx0cmV0dXJuIFtlbC5vZmZzZXQoKS50b3AtcC5vZmZzZXQoKS50b3AsZWwub2Zmc2V0KCkubGVmdC1wLm9mZnNldCgpLmxlZnRdO1xyXG5cdFx0fSxcclxuXHRcdC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblx0XHRcclxuXHRcdFxyXG5cdFx0LyogY2hlY2tzIGlmIGJyb3dzZXIgdGFiIGlzIGhpZGRlbi9pbmFjdGl2ZSB2aWEgUGFnZSBWaXNpYmlsaXR5IEFQSSAqL1xyXG5cdFx0X2lzVGFiSGlkZGVuPWZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBwcm9wPV9nZXRIaWRkZW5Qcm9wKCk7XHJcblx0XHRcdGlmKCFwcm9wKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdHJldHVybiBkb2N1bWVudFtwcm9wXTtcclxuXHRcdFx0ZnVuY3Rpb24gX2dldEhpZGRlblByb3AoKXtcclxuXHRcdFx0XHR2YXIgcGZ4PVtcIndlYmtpdFwiLFwibW96XCIsXCJtc1wiLFwib1wiXTtcclxuXHRcdFx0XHRpZihcImhpZGRlblwiIGluIGRvY3VtZW50KSByZXR1cm4gXCJoaWRkZW5cIjsgLy9uYXRpdmVseSBzdXBwb3J0ZWRcclxuXHRcdFx0XHRmb3IodmFyIGk9MDsgaTxwZngubGVuZ3RoOyBpKyspeyAvL3ByZWZpeGVkXHJcblx0XHRcdFx0ICAgIGlmKChwZnhbaV0rXCJIaWRkZW5cIikgaW4gZG9jdW1lbnQpIFxyXG5cdFx0XHRcdCAgICAgICAgcmV0dXJuIHBmeFtpXStcIkhpZGRlblwiO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gbnVsbDsgLy9ub3Qgc3VwcG9ydGVkXHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHQvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cdFx0XHJcblx0XHJcblx0XHJcblx0XHJcblx0XHJcblx0LyogXHJcblx0LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cdFBMVUdJTiBTRVRVUCBcclxuXHQtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0Ki9cclxuXHRcclxuXHQvKiBwbHVnaW4gY29uc3RydWN0b3IgZnVuY3Rpb25zICovXHJcblx0JC5mbltwbHVnaW5OU109ZnVuY3Rpb24obWV0aG9kKXsgLyogdXNhZ2U6ICQoc2VsZWN0b3IpLm1DdXN0b21TY3JvbGxiYXIoKTsgKi9cclxuXHRcdGlmKG1ldGhvZHNbbWV0aG9kXSl7XHJcblx0XHRcdHJldHVybiBtZXRob2RzW21ldGhvZF0uYXBwbHkodGhpcyxBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMSkpO1xyXG5cdFx0fWVsc2UgaWYodHlwZW9mIG1ldGhvZD09PVwib2JqZWN0XCIgfHwgIW1ldGhvZCl7XHJcblx0XHRcdHJldHVybiBtZXRob2RzLmluaXQuYXBwbHkodGhpcyxhcmd1bWVudHMpO1xyXG5cdFx0fWVsc2V7XHJcblx0XHRcdCQuZXJyb3IoXCJNZXRob2QgXCIrbWV0aG9kK1wiIGRvZXMgbm90IGV4aXN0XCIpO1xyXG5cdFx0fVxyXG5cdH07XHJcblx0JFtwbHVnaW5OU109ZnVuY3Rpb24obWV0aG9kKXsgLyogdXNhZ2U6ICQubUN1c3RvbVNjcm9sbGJhcigpOyAqL1xyXG5cdFx0aWYobWV0aG9kc1ttZXRob2RdKXtcclxuXHRcdFx0cmV0dXJuIG1ldGhvZHNbbWV0aG9kXS5hcHBseSh0aGlzLEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywxKSk7XHJcblx0XHR9ZWxzZSBpZih0eXBlb2YgbWV0aG9kPT09XCJvYmplY3RcIiB8fCAhbWV0aG9kKXtcclxuXHRcdFx0cmV0dXJuIG1ldGhvZHMuaW5pdC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7XHJcblx0XHR9ZWxzZXtcclxuXHRcdFx0JC5lcnJvcihcIk1ldGhvZCBcIittZXRob2QrXCIgZG9lcyBub3QgZXhpc3RcIik7XHJcblx0XHR9XHJcblx0fTtcclxuXHRcclxuXHQvKiBcclxuXHRhbGxvdyBzZXR0aW5nIHBsdWdpbiBkZWZhdWx0IG9wdGlvbnMuIFxyXG5cdHVzYWdlOiAkLm1DdXN0b21TY3JvbGxiYXIuZGVmYXVsdHMuc2Nyb2xsSW5lcnRpYT01MDA7IFxyXG5cdHRvIGFwcGx5IGFueSBjaGFuZ2VkIGRlZmF1bHQgb3B0aW9ucyBvbiBkZWZhdWx0IHNlbGVjdG9ycyAoYmVsb3cpLCB1c2UgaW5zaWRlIGRvY3VtZW50IHJlYWR5IGZuIFxyXG5cdGUuZy46ICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7ICQubUN1c3RvbVNjcm9sbGJhci5kZWZhdWx0cy5zY3JvbGxJbmVydGlhPTUwMDsgfSk7XHJcblx0Ki9cclxuXHQkW3BsdWdpbk5TXS5kZWZhdWx0cz1kZWZhdWx0cztcclxuXHRcclxuXHQvKiBcclxuXHRhZGQgd2luZG93IG9iamVjdCAod2luZG93Lm1DdXN0b21TY3JvbGxiYXIpIFxyXG5cdHVzYWdlOiBpZih3aW5kb3cubUN1c3RvbVNjcm9sbGJhcil7Y29uc29sZS5sb2coXCJjdXN0b20gc2Nyb2xsYmFyIHBsdWdpbiBsb2FkZWRcIik7fVxyXG5cdCovXHJcblx0d2luZG93W3BsdWdpbk5TXT10cnVlO1xyXG5cdFxyXG5cdCQod2luZG93KS5iaW5kKFwibG9hZFwiLGZ1bmN0aW9uKCl7XHJcblx0XHRcclxuXHRcdCQoZGVmYXVsdFNlbGVjdG9yKVtwbHVnaW5OU10oKTsgLyogYWRkIHNjcm9sbGJhcnMgYXV0b21hdGljYWxseSBvbiBkZWZhdWx0IHNlbGVjdG9yICovXHJcblx0XHRcclxuXHRcdC8qIGV4dGVuZCBqUXVlcnkgZXhwcmVzc2lvbnMgKi9cclxuXHRcdCQuZXh0ZW5kKCQuZXhwcltcIjpcIl0se1xyXG5cdFx0XHQvKiBjaGVja3MgaWYgZWxlbWVudCBpcyB3aXRoaW4gc2Nyb2xsYWJsZSB2aWV3cG9ydCAqL1xyXG5cdFx0XHRtY3NJblZpZXc6JC5leHByW1wiOlwiXS5tY3NJblZpZXcgfHwgZnVuY3Rpb24oZWwpe1xyXG5cdFx0XHRcdHZhciAkZWw9JChlbCksY29udGVudD0kZWwucGFyZW50cyhcIi5tQ1NCX2NvbnRhaW5lclwiKSx3cmFwcGVyLGNQb3M7XHJcblx0XHRcdFx0aWYoIWNvbnRlbnQubGVuZ3RoKXtyZXR1cm47fVxyXG5cdFx0XHRcdHdyYXBwZXI9Y29udGVudC5wYXJlbnQoKTtcclxuXHRcdFx0XHRjUG9zPVtjb250ZW50WzBdLm9mZnNldFRvcCxjb250ZW50WzBdLm9mZnNldExlZnRdO1xyXG5cdFx0XHRcdHJldHVybiBcdGNQb3NbMF0rX2NoaWxkUG9zKCRlbClbMF0+PTAgJiYgY1Bvc1swXStfY2hpbGRQb3MoJGVsKVswXTx3cmFwcGVyLmhlaWdodCgpLSRlbC5vdXRlckhlaWdodChmYWxzZSkgJiYgXHJcblx0XHRcdFx0XHRcdGNQb3NbMV0rX2NoaWxkUG9zKCRlbClbMV0+PTAgJiYgY1Bvc1sxXStfY2hpbGRQb3MoJGVsKVsxXTx3cmFwcGVyLndpZHRoKCktJGVsLm91dGVyV2lkdGgoZmFsc2UpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHQvKiBjaGVja3MgaWYgZWxlbWVudCBvciBwYXJ0IG9mIGVsZW1lbnQgaXMgaW4gdmlldyBvZiBzY3JvbGxhYmxlIHZpZXdwb3J0ICovXHJcblx0XHRcdG1jc0luU2lnaHQ6JC5leHByW1wiOlwiXS5tY3NJblNpZ2h0IHx8IGZ1bmN0aW9uKGVsLGksbSl7XHJcblx0XHRcdFx0dmFyICRlbD0kKGVsKSxlbEQsY29udGVudD0kZWwucGFyZW50cyhcIi5tQ1NCX2NvbnRhaW5lclwiKSx3cmFwcGVyVmlldyxwb3Msd3JhcHBlclZpZXdQY3QsXHJcblx0XHRcdFx0XHRwY3RWYWxzPW1bM109PT1cImV4YWN0XCIgPyBbWzEsMF0sWzEsMF1dIDogW1swLjksMC4xXSxbMC42LDAuNF1dO1xyXG5cdFx0XHRcdGlmKCFjb250ZW50Lmxlbmd0aCl7cmV0dXJuO31cclxuXHRcdFx0XHRlbEQ9WyRlbC5vdXRlckhlaWdodChmYWxzZSksJGVsLm91dGVyV2lkdGgoZmFsc2UpXTtcclxuXHRcdFx0XHRwb3M9W2NvbnRlbnRbMF0ub2Zmc2V0VG9wK19jaGlsZFBvcygkZWwpWzBdLGNvbnRlbnRbMF0ub2Zmc2V0TGVmdCtfY2hpbGRQb3MoJGVsKVsxXV07XHJcblx0XHRcdFx0d3JhcHBlclZpZXc9W2NvbnRlbnQucGFyZW50KClbMF0ub2Zmc2V0SGVpZ2h0LGNvbnRlbnQucGFyZW50KClbMF0ub2Zmc2V0V2lkdGhdO1xyXG5cdFx0XHRcdHdyYXBwZXJWaWV3UGN0PVtlbERbMF08d3JhcHBlclZpZXdbMF0gPyBwY3RWYWxzWzBdIDogcGN0VmFsc1sxXSxlbERbMV08d3JhcHBlclZpZXdbMV0gPyBwY3RWYWxzWzBdIDogcGN0VmFsc1sxXV07XHJcblx0XHRcdFx0cmV0dXJuIFx0cG9zWzBdLSh3cmFwcGVyVmlld1swXSp3cmFwcGVyVmlld1BjdFswXVswXSk8MCAmJiBwb3NbMF0rZWxEWzBdLSh3cmFwcGVyVmlld1swXSp3cmFwcGVyVmlld1BjdFswXVsxXSk+PTAgJiYgXHJcblx0XHRcdFx0XHRcdHBvc1sxXS0od3JhcHBlclZpZXdbMV0qd3JhcHBlclZpZXdQY3RbMV1bMF0pPDAgJiYgcG9zWzFdK2VsRFsxXS0od3JhcHBlclZpZXdbMV0qd3JhcHBlclZpZXdQY3RbMV1bMV0pPj0wO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHQvKiBjaGVja3MgaWYgZWxlbWVudCBpcyBvdmVyZmxvd2VkIGhhdmluZyB2aXNpYmxlIHNjcm9sbGJhcihzKSAqL1xyXG5cdFx0XHRtY3NPdmVyZmxvdzokLmV4cHJbXCI6XCJdLm1jc092ZXJmbG93IHx8IGZ1bmN0aW9uKGVsKXtcclxuXHRcdFx0XHR2YXIgZD0kKGVsKS5kYXRhKHBsdWdpblBmeCk7XHJcblx0XHRcdFx0aWYoIWQpe3JldHVybjt9XHJcblx0XHRcdFx0cmV0dXJuIGQub3ZlcmZsb3dlZFswXSB8fCBkLm92ZXJmbG93ZWRbMV07XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFxyXG5cdH0pO1xyXG5cclxufSkpfSkpOyJdLCJmaWxlIjoibGlicy9qcXVlcnkubUN1c3RvbVNjcm9sbGJhci5qcyJ9
