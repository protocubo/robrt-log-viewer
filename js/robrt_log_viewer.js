// The Robrt Log Viewer.  Copyright (c) 2016–2017, Jonas Malaco, Rafael Craice and authors of other contributions.  This generated code and its source code are licensed under the BSD 2-clause license.  More details in the repository: <https://github.com/protocubo/robrt-log-viewer>.  Generated with Haxe.
(function ($global) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var Assertion = function() { };
Assertion.__name__ = ["Assertion"];
var EReg = function(r,opt) {
	this.r = new RegExp(r,opt.split("u").join(""));
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	r: null
	,match: function(s) {
		if(this.r.global) {
			this.r.lastIndex = 0;
		}
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,matched: function(n) {
		if(this.r.m != null && n >= 0 && n < this.r.m.length) {
			return this.r.m[n];
		} else {
			throw new js__$Boot_HaxeError("EReg::matched");
		}
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,__class__: EReg
};
var HxOverrides = function() { };
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d["setTime"](0);
		d["setUTCHours"](k[0]);
		d["setUTCMinutes"](k[1]);
		d["setUTCSeconds"](k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw new js__$Boot_HaxeError("Invalid date format : " + s);
	}
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) {
		return undefined;
	}
	return x;
};
HxOverrides.substr = function(s,pos,len) {
	if(len == null) {
		len = s.length;
	} else if(len < 0) {
		if(pos == 0) {
			len = s.length + len;
		} else {
			return "";
		}
	}
	return s.substr(pos,len);
};
HxOverrides.remove = function(a,obj) {
	var i = a.indexOf(obj);
	if(i == -1) {
		return false;
	}
	a.splice(i,1);
	return true;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Lambda = function() { };
Lambda.__name__ = ["Lambda"];
Lambda.array = function(it) {
	var a = [];
	var i = $iterator(it)();
	while(i.hasNext()) {
		var i1 = i.next();
		a.push(i1);
	}
	return a;
};
Lambda.has = function(it,elt) {
	var x = $iterator(it)();
	while(x.hasNext()) {
		var x1 = x.next();
		if(x1 == elt) {
			return true;
		}
	}
	return false;
};
Lambda.exists = function(it,f) {
	var x = $iterator(it)();
	while(x.hasNext()) {
		var x1 = x.next();
		if(f(x1)) {
			return true;
		}
	}
	return false;
};
var List = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	h: null
	,q: null
	,length: null
	,add: function(item) {
		var x = new _$List_ListNode(item,null);
		if(this.h == null) {
			this.h = x;
		} else {
			this.q.next = x;
		}
		this.q = x;
		this.length++;
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l.item == v) {
				if(prev == null) {
					this.h = l.next;
				} else {
					prev.next = l.next;
				}
				if(this.q == l) {
					this.q = prev;
				}
				this.length--;
				return true;
			}
			prev = l;
			l = l.next;
		}
		return false;
	}
	,iterator: function() {
		return new _$List_ListIterator(this.h);
	}
	,__class__: List
};
var _$List_ListNode = function(item,next) {
	this.item = item;
	this.next = next;
};
_$List_ListNode.__name__ = ["_List","ListNode"];
_$List_ListNode.prototype = {
	item: null
	,next: null
	,__class__: _$List_ListNode
};
var _$List_ListIterator = function(head) {
	this.head = head;
};
_$List_ListIterator.__name__ = ["_List","ListIterator"];
_$List_ListIterator.prototype = {
	head: null
	,hasNext: function() {
		return this.head != null;
	}
	,next: function() {
		var val = this.head.item;
		this.head = this.head.next;
		return val;
	}
	,__class__: _$List_ListIterator
};
var Main = function() { };
Main.__name__ = ["Main"];
Main.parseCommand = function(lines) {
	var bpat = new EReg("robrt: start(ed|ing) cmd <(\\d+)>(: ([a-zA-Z0-9\\+/=]+): (\\d+).(\\d+))?","i");
	var epat = new EReg("robrt: finished cmd <(\\d+)> with status <(-?\\d+)>(: (\\d+).(\\d+))?","i");
	var prefix = null;
	var fst = lines.shift();
	if(StringTools.startsWith(fst,"+ ")) {
		prefix = fst;
		fst = lines.shift();
	}
	while(fst != null && !bpat.match(fst)) {
		if(Assertion.enableAssert && Assertion.enableWeakAssert) {
			haxe_Log.trace("[weak assert] fst=" + fst,{ fileName : "Main.hx", lineNumber : 22, className : "Main", methodName : "parseCommand"});
			haxe_Log.trace("[weak assert] would have FAILED: " + "false",{ fileName : "Main.hx", lineNumber : 22, className : "Main", methodName : "parseCommand"});
		}
		fst = lines.shift();
	}
	if(Assertion.enableAssert && !(fst != null && bpat.match(fst))) {
		haxe_Log.trace("[assert] prefix=" + prefix,{ fileName : "Main.hx", lineNumber : 25, className : "Main", methodName : "parseCommand"});
		haxe_Log.trace("[assert] fst=" + fst,{ fileName : "Main.hx", lineNumber : 25, className : "Main", methodName : "parseCommand"});
		throw new js__$Boot_HaxeError("Assertion failed: " + "fst != null && bpat.match(fst)");
	}
	var inCompatMode = bpat.matched(3) == null;
	if(Assertion.enableAssert && !(inCompatMode && prefix != null || !inCompatMode)) {
		haxe_Log.trace("[assert] bpat.matched(3)=" + bpat.matched(3),{ fileName : "Main.hx", lineNumber : 28, className : "Main", methodName : "parseCommand"});
		haxe_Log.trace("[assert] inCompatMode=" + (inCompatMode == null ? "null" : "" + inCompatMode),{ fileName : "Main.hx", lineNumber : 28, className : "Main", methodName : "parseCommand"});
		haxe_Log.trace("[assert] prefix=" + prefix,{ fileName : "Main.hx", lineNumber : 28, className : "Main", methodName : "parseCommand"});
		haxe_Log.trace("[assert] " + "the command must either come from header or from the prefix",{ fileName : "Main.hx", lineNumber : 28, className : "Main", methodName : "parseCommand"});
		throw new js__$Boot_HaxeError("Assertion failed: " + "(inCompatMode && prefix != null) || !inCompatMode");
	}
	var no = bpat.matched(2);
	var cmd = inCompatMode ? HxOverrides.substr(prefix,2,null) : haxe_crypto_Base64.decode(bpat.matched(4)).toString();
	var output = [];
	while(true) {
		if(Assertion.enableAssert && lines.length <= 0) {
			haxe_Log.trace("[assert] lines.length=" + lines.length,{ fileName : "Main.hx", lineNumber : 34, className : "Main", methodName : "parseCommand"});
			throw new js__$Boot_HaxeError("Assertion failed: " + "lines.length > 0");
		}
		if(!(!epat.match(lines[0]))) {
			break;
		}
		var cur = lines.shift();
		var cr = cur.lastIndexOf("\r");
		if(Assertion.enableAssert && !(cur.length == 0 || cr + 1 < cur.length)) {
			haxe_Log.trace("[assert] " + "ending \r should not happen, since there's always a 'finished' line and \r\n is a newline",{ fileName : "Main.hx", lineNumber : 37, className : "Main", methodName : "parseCommand"});
			haxe_Log.trace("[assert] cur=" + cur,{ fileName : "Main.hx", lineNumber : 37, className : "Main", methodName : "parseCommand"});
			haxe_Log.trace("[assert] cr=" + cr,{ fileName : "Main.hx", lineNumber : 37, className : "Main", methodName : "parseCommand"});
			throw new js__$Boot_HaxeError("Assertion failed: " + "cur.length == 0 || cr + 1 < cur.length");
		}
		cur = HxOverrides.substr(cur,cr + 1,null);
		output.push(cur);
	}
	if(Assertion.enableAssert && lines.length < 1) {
		haxe_Log.trace("[assert] lines.length=" + lines.length,{ fileName : "Main.hx", lineNumber : 41, className : "Main", methodName : "parseCommand"});
		throw new js__$Boot_HaxeError("Assertion failed: " + "lines.length >= 1");
	}
	lines.shift();
	if(Assertion.enableAssert && epat.matched(1) != no) {
		throw new js__$Boot_HaxeError("Assertion failed: " + "epat.matched(1) == no");
	}
	var exit = epat.matched(2);
	var duration;
	if(inCompatMode) {
		duration = null;
	} else {
		var start = (parseFloat(bpat.matched(5)) + parseFloat(bpat.matched(6)) / 1e9) * 1e3;
		var finish = (parseFloat(epat.matched(4)) + parseFloat(epat.matched(5)) / 1e9) * 1e3;
		duration = finish - start;
	}
	return { cmd : cmd, exit : exit, duration : duration, output : output};
};
Main.parseLog = function(raw) {
	var lines = new EReg("\r?\n","g").split(raw);
	var cmds = [];
	while(lines.length > 0 && lines[0] != "") cmds.push(Main.parseCommand(lines));
	return cmds;
};
Main.ansiExecute = function(output) {
	var pseudo = output.join("\n");
	var segs = ansiparse(pseudo);
	var spans = segs.map(function(i) {
		var classes = [];
		if(i.bold) {
			classes.push("ansi-bold");
		}
		if(i.italic) {
			classes.push("ansi-italic");
		}
		if(i.underline) {
			classes.push("ansi-underline");
		}
		if(i.foreground != null) {
			classes.push("ansi-fg-" + i.foreground);
		}
		if(i.background != null) {
			classes.push("ansi-bg-" + i.background);
		}
		return "<span class=\"" + classes.join(" ") + "\">" + StringTools.htmlEscape(i.text) + "</span>";
	});
	if(spans.length == 0) {
		return [];
	}
	return spans.join("").split("\n").map(function(i1) {
		var this1 = i1;
		return this1;
	});
};
Main.renderCommand = function(cmd,opts) {
	var ret = tink_template__$Html_Html_$Impl_$.buffer();
	var this1 = "<article class=\"cmd-container ";
	ret.s += this1;
	if(cmd.output.length > 0) {
		var this2 = " allow-expansion ";
		ret.s += this2;
	}
	if(cmd.exit != "0") {
		var this3 = " expanded ";
		ret.s += this3;
	}
	var this4 = "\">";
	ret.s += this4;
	var this5 = "<section class=\"cmd\">\n\t\t<pre><code><span class=\"line-number\">";
	ret.s += this5;
	var b = tink_template__$Html_Html_$Impl_$.of(opts.lineNumber++);
	ret.s += b;
	var this6 = "</span>$ ";
	ret.s += this6;
	var b1 = tink_template__$Html_Html_$Impl_$.escape(cmd.cmd);
	ret.s += b1;
	var this7 = "<span class=\"exit-code ";
	ret.s += this7;
	if(cmd.exit != "0") {
		var this8 = "alert";
		ret.s += this8;
	}
	var this9 = "\">";
	ret.s += this9;
	var b2 = tink_template__$Html_Html_$Impl_$.escape(cmd.exit);
	ret.s += b2;
	var this10 = "</span>";
	ret.s += this10;
	if(cmd.duration != null) {
		var this11 = "<span class=\"duration\">";
		ret.s += this11;
		var b3 = tink_template__$Html_Html_$Impl_$.escape(thx_format_NumberFormat.fixed(cmd.duration / 1e3,3));
		ret.s += b3;
		var this12 = "s</span>";
		ret.s += this12;
	}
	var this13 = "</code></pre>\n\t</section>\n\t<section class=\"output\">\n\t";
	ret.s += this13;
	var _g = 0;
	var _g1 = Main.ansiExecute(cmd.output);
	while(_g < _g1.length) {
		var li = _g1[_g];
		++_g;
		var this14 = "\n\t\t<pre><code><span class=\"line-number\">";
		ret.s += this14;
		var b4 = tink_template__$Html_Html_$Impl_$.of(opts.lineNumber++);
		ret.s += b4;
		var this15 = "</span>";
		ret.s += this15;
		ret.s += li;
		var this16 = "</code></pre>\n\t";
		ret.s += this16;
	}
	var this17 = "\n\t</section>\n</article>\n";
	ret.s += this17;
	var this18 = ret.s;
	return this18;
};
Main.renderMessage = function(msg) {
	var ret = tink_template__$Html_Html_$Impl_$.buffer();
	var this1 = "<article class=\"message\">\n\t<pre><code><span class=\"pseudo-line-number\"></span># ";
	ret.s += this1;
	var b = tink_template__$Html_Html_$Impl_$.escape(msg);
	ret.s += b;
	var this2 = "<span class=\"exit-code\">?</span></code></pre>\n</article>\n";
	ret.s += this2;
	var this3 = ret.s;
	return this3;
};
Main.setExpansionActions = function(container) {
	container.click(function(e) {
		var target = $(e.target).parents(".cmd-container");
		if(!target.hasClass("allow-expansion")) {
			return;
		}
		target.toggleClass("expanded");
		e.preventDefault();
		e.stopPropagation();
	});
};
Main.setFavicon = function(exit) {
	$("#favicon-link").attr("href","robrt_" + (exit == 0 ? "success" : "fail") + ".ico");
};
Main.render = function(url,container) {
	var tmp = $.parseHTML(Main.renderMessage("Loading log... (" + url + ")"));
	container.append(tmp);
	var req = new haxe_Http(url);
	req.onData = function(raw) {
		if(Assertion.enableShow) {
			haxe_Log.trace("raw.length=" + raw.length,{ fileName : "Main.hx", lineNumber : 115, className : "Main", methodName : "render"});
		}
		var log = Main.parseLog(raw);
		var exit = log.length == 0 ? 0 : Std.parseInt(log[log.length - 1].exit);
		var opts = { lineNumber : 1};
		if(Assertion.enableShow) {
			haxe_Log.trace("container.length=" + container.length,{ fileName : "Main.hx", lineNumber : 122, className : "Main", methodName : "render"});
		}
		var _g = 0;
		while(_g < log.length) {
			var cmd = log[_g];
			++_g;
			var obj = Main.renderCommand(cmd,opts);
			container.children(".message").remove();
			var tmp1 = $.parseHTML(obj);
			container.append(tmp1);
		}
		Main.setFavicon(exit);
	};
	req.onError = function(err) {
		if(Assertion.enableAssert) {
			haxe_Log.trace("[assert] err=" + err,{ fileName : "Main.hx", lineNumber : 130, className : "Main", methodName : "render"});
			throw new js__$Boot_HaxeError("Assertion failed: " + "false");
		}
	};
	req.request(false);
	Main.setExpansionActions(container);
};
Main.main = function() {
	var _g = window.location.search;
	var _hx_tmp;
	if(_g == "") {
		if(Assertion.enableAssert) {
			haxe_Log.trace("[assert] " + "nothing to do",{ fileName : "Main.hx", lineNumber : 139, className : "Main", methodName : "main"});
			throw new js__$Boot_HaxeError("Assertion failed: " + "false");
		}
	} else {
		var pat = _g;
		if(pat.length > 3 && StringTools.startsWith("?unit-tests",pat)) {
			$(this).ready(function() {
				var runner = new utest_Runner();
				var exit = 0;
				runner.addCase(new Test());
				utest_ui_Report.create(runner);
				runner.onProgress.add(function(o) {
					exit -= o.result.allOk() ? 0 : 1;
					if(o.done == o.totals) {
						Main.setFavicon(exit);
					}
				});
				runner.run();
			});
		} else {
			_hx_tmp = HxOverrides.substr(_g,1,null);
			var url = _hx_tmp;
			$(this).ready(function() {
				var container = $("#log-container");
				Main.render(url,container);
			});
		}
	}
};
Math.__name__ = ["Math"];
var Reflect = function() { };
Reflect.__name__ = ["Reflect"];
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		haxe_CallStack.lastException = e;
		return null;
	}
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) {
			a.push(f);
		}
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	if(typeof(f) == "function") {
		return !(f.__name__ || f.__ename__);
	} else {
		return false;
	}
};
Reflect.compare = function(a,b) {
	if(a == b) {
		return 0;
	} else if(a > b) {
		return 1;
	} else {
		return -1;
	}
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) {
		return true;
	}
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) {
		return false;
	}
	if(f1.scope == f2.scope && f1.method == f2.method) {
		return f1.method != null;
	} else {
		return false;
	}
};
Reflect.isObject = function(v) {
	if(v == null) {
		return false;
	}
	var t = typeof(v);
	if(!(t == "string" || t == "object" && v.__enum__ == null)) {
		if(t == "function") {
			return (v.__name__ || v.__ename__) != null;
		} else {
			return false;
		}
	} else {
		return true;
	}
};
var Std = function() { };
Std.__name__ = ["Std"];
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) {
		v = parseInt(x);
	}
	if(isNaN(v)) {
		return null;
	}
	return v;
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	b: null
	,__class__: StringBuf
};
var StringTools = function() { };
StringTools.__name__ = ["StringTools"];
StringTools.htmlEscape = function(s,quotes) {
	s = s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
	if(quotes) {
		return s.split("\"").join("&quot;").split("'").join("&#039;");
	} else {
		return s;
	}
};
StringTools.startsWith = function(s,start) {
	if(s.length >= start.length) {
		return HxOverrides.substr(s,0,start.length) == start;
	} else {
		return false;
	}
};
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	if(!(c > 8 && c < 14)) {
		return c == 32;
	} else {
		return true;
	}
};
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s,r,l - r);
	} else {
		return s;
	}
};
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) ++r;
	if(r > 0) {
		return HxOverrides.substr(s,0,l - r);
	} else {
		return s;
	}
};
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
};
StringTools.rpad = function(s,c,l) {
	if(c.length <= 0) {
		return s;
	}
	while(s.length < l) s += c;
	return s;
};
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
};
var Test = function() {
};
Test.__name__ = ["Test"];
Test.prototype = {
	test_parsing: function() {
		var base64 = function(txt) {
			return haxe_crypto_Base64.encode(haxe_io_Bytes.ofString(txt));
		};
		var result = function(cmd,exit,output,duration) {
			return { cmd : cmd, exit : exit == null ? "null" : "" + exit, output : output, duration : duration};
		};
		var echo = function(cmd1) {
			return "+ " + cmd1;
		};
		var started = function(no,ing,cmd2,at) {
			if(ing == null) {
				ing = false;
			}
			if(Assertion.enableAssert && !(cmd2 != null && at != null || cmd2 == at)) {
				haxe_Log.trace("[assert] cmd=" + cmd2,{ fileName : "Test.hx", lineNumber : 29, className : "Test", methodName : "test_parsing"});
				haxe_Log.trace("[assert] at=" + at,{ fileName : "Test.hx", lineNumber : 29, className : "Test", methodName : "test_parsing"});
				throw new js__$Boot_HaxeError("Assertion failed: " + "(cmd != null && at != null) || cmd == at");
			}
			var st = "robrt: start" + (ing ? "ing" : "ed") + " cmd <" + no + ">";
			if(cmd2 != null) {
				st += ": " + base64(cmd2) + ": " + at;
			}
			return st;
		};
		var finished = function(no1,exit1,at1) {
			return "robrt: finished cmd <" + no1 + "> with status <" + exit1 + ">" + (at1 != null ? ": " + at1 : "");
		};
		utest_Assert.same([result("cmd",99,["bar"],8800)],Main.parseLog([started(11,null,"cmd","1.100000000"),"bar",finished(11,99,"9.900000000")].join("\n")),null,null,null,{ fileName : "Test.hx", lineNumber : 39, className : "Test", methodName : "test_parsing"});
		utest_Assert.same([result("cmd",99,["bar"],8800)],Main.parseLog([echo("cmd"),started(11,null,"cmd","1.100000000"),"bar",finished(11,99,"9.900000000")].join("\n")),null,null,null,{ fileName : "Test.hx", lineNumber : 45, className : "Test", methodName : "test_parsing"});
		utest_Assert.same([result("cmd",99,["bar"])],Main.parseLog([echo("cmd"),started(11,true),"bar",finished(11,99)].join("\n")),null,null,null,{ fileName : "Test.hx", lineNumber : 52, className : "Test", methodName : "test_parsing"});
		utest_Assert.same([result("cmd",-99,["bar"],8800)],Main.parseLog([started(11,null,"cmd","1.100000000"),"bar",finished(11,-99,"9.900000000")].join("\n")),null,null,null,{ fileName : "Test.hx", lineNumber : 59, className : "Test", methodName : "test_parsing"});
		utest_Assert.same([result("cmd",-99,["","bar","ar","r","bar",""],8800)],Main.parseLog([started(11,null,"cmd","1.100000000"),"","\rbar","b\rar","ba\rr","bar\r","\r",finished(11,-99,"9.900000000")].join("\n")),null,null,null,{ fileName : "Test.hx", lineNumber : 65, className : "Test", methodName : "test_parsing"});
		utest_Assert.same([result("cmd",99,["bar"],8800),result("dmc",77,["foo"],6600)],Main.parseLog([started(11,null,"cmd","1.100000000"),"bar",finished(11,99,"9.900000000"),started(9,null,"dmc","10.100000000"),"foo",finished(9,77,"16.700000000")].join("\n")),null,null,null,{ fileName : "Test.hx", lineNumber : 76, className : "Test", methodName : "test_parsing"});
		utest_Assert.same([result("cmd",99,["bar"],8800),result("dmc",77,["foo"],6600)],Main.parseLog([echo("cmd"),started(11,null,"cmd","1.100000000"),"bar",finished(11,99,"9.900000000"),echo("dmc"),"ops",started(9,null,"dmc","10.100000000"),"foo",finished(9,77,"16.700000000")].join("\n")),null,null,null,{ fileName : "Test.hx", lineNumber : 85, className : "Test", methodName : "test_parsing"});
	}
	,test_ansi_executing: function() {
		utest_Assert.warn("TODO");
	}
	,test_render: function() {
		utest_Assert.warn("TODO");
	}
	,__class__: Test
};
var ValueType = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { };
Type.__name__ = ["Type"];
Type.getEnum = function(o) {
	if(o == null) {
		return null;
	}
	return o.__enum__;
};
Type.getClassName = function(c) {
	var a = c.__name__;
	if(a == null) {
		return null;
	}
	return a.join(".");
};
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
};
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
};
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "function":
		if(v.__name__ || v.__ename__) {
			return ValueType.TObject;
		}
		return ValueType.TFunction;
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) {
			return ValueType.TInt;
		}
		return ValueType.TFloat;
	case "object":
		if(v == null) {
			return ValueType.TNull;
		}
		var e = v.__enum__;
		if(e != null) {
			return ValueType.TEnum(e);
		}
		var c = js_Boot.getClass(v);
		if(c != null) {
			return ValueType.TClass(c);
		}
		return ValueType.TObject;
	case "string":
		return ValueType.TClass(String);
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
var haxe_StackItem = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","LocalFunction"] };
haxe_StackItem.CFunction = ["CFunction",0];
haxe_StackItem.CFunction.toString = $estr;
haxe_StackItem.CFunction.__enum__ = haxe_StackItem;
haxe_StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
haxe_StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
haxe_StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
haxe_StackItem.LocalFunction = function(v) { var $x = ["LocalFunction",4,v]; $x.__enum__ = haxe_StackItem; $x.toString = $estr; return $x; };
var haxe_CallStack = function() { };
haxe_CallStack.__name__ = ["haxe","CallStack"];
haxe_CallStack.getStack = function(e) {
	if(e == null) {
		return [];
	}
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			if(haxe_CallStack.wrapCallSite != null) {
				site = haxe_CallStack.wrapCallSite(site);
			}
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe_StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe_StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe_CallStack.makeStack(e.stack);
	Error.prepareStackTrace = oldValue;
	return a;
};
haxe_CallStack.callStack = function() {
	try {
		throw new Error();
	} catch( e ) {
		haxe_CallStack.lastException = e;
		if (e instanceof js__$Boot_HaxeError) e = e.val;
		var a = haxe_CallStack.getStack(e);
		a.shift();
		return a;
	}
};
haxe_CallStack.exceptionStack = function() {
	return haxe_CallStack.getStack(haxe_CallStack.lastException);
};
haxe_CallStack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += "\nCalled from ";
		haxe_CallStack.itemToString(b,s);
	}
	return b.b;
};
haxe_CallStack.itemToString = function(b,s) {
	switch(s[1]) {
	case 0:
		b.b += "a C function";
		break;
	case 1:
		var m = s[2];
		b.b += "module ";
		b.b += m == null ? "null" : "" + m;
		break;
	case 2:
		var line = s[4];
		var file = s[3];
		var s1 = s[2];
		if(s1 != null) {
			haxe_CallStack.itemToString(b,s1);
			b.b += " (";
		}
		b.b += file == null ? "null" : "" + file;
		b.b += " line ";
		b.b += line == null ? "null" : "" + line;
		if(s1 != null) {
			b.b += ")";
		}
		break;
	case 3:
		var meth = s[3];
		var cname = s[2];
		b.b += cname == null ? "null" : "" + cname;
		b.b += ".";
		b.b += meth == null ? "null" : "" + meth;
		break;
	case 4:
		var n = s[2];
		b.b += "local function #";
		b.b += n == null ? "null" : "" + n;
		break;
	}
};
haxe_CallStack.makeStack = function(s) {
	if(s == null) {
		return [];
	} else if(typeof(s) == "string") {
		var stack = s.split("\n");
		if(stack[0] == "Error") {
			stack.shift();
		}
		var m = [];
		var rie10 = new EReg("^   at ([A-Za-z0-9_. ]+) \\(([^)]+):([0-9]+):([0-9]+)\\)$","");
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			if(rie10.match(line)) {
				var path = rie10.matched(1).split(".");
				var meth = path.pop();
				var file = rie10.matched(2);
				var line1 = Std.parseInt(rie10.matched(3));
				m.push(haxe_StackItem.FilePos(meth == "Anonymous function" ? haxe_StackItem.LocalFunction() : meth == "Global code" ? null : haxe_StackItem.Method(path.join("."),meth),file,line1));
			} else {
				m.push(haxe_StackItem.Module(StringTools.trim(line)));
			}
		}
		return m;
	} else {
		return s;
	}
};
var haxe_IMap = function() { };
haxe_IMap.__name__ = ["haxe","IMap"];
haxe_IMap.prototype = {
	get: null
	,keys: null
	,__class__: haxe_IMap
};
var haxe_Http = function(url) {
	this.url = url;
	this.headers = new List();
	this.params = new List();
	this.async = true;
	this.withCredentials = false;
};
haxe_Http.__name__ = ["haxe","Http"];
haxe_Http.prototype = {
	url: null
	,responseData: null
	,async: null
	,withCredentials: null
	,postData: null
	,headers: null
	,params: null
	,req: null
	,request: function(post) {
		var me = this;
		me.responseData = null;
		var r = this.req = js_Browser.createXMLHttpRequest();
		var onreadystatechange = function(_) {
			if(r.readyState != 4) {
				return;
			}
			var s;
			try {
				s = r.status;
			} catch( e ) {
				haxe_CallStack.lastException = e;
				s = null;
			}
			if(s != null && "undefined" !== typeof window) {
				var protocol = window.location.protocol.toLowerCase();
				var rlocalProtocol = new EReg("^(?:about|app|app-storage|.+-extension|file|res|widget):$","");
				var isLocal = rlocalProtocol.match(protocol);
				if(isLocal) {
					if(r.responseText != null) {
						s = 200;
					} else {
						s = 404;
					}
				}
			}
			if(s == undefined) {
				s = null;
			}
			if(s != null) {
				me.onStatus(s);
			}
			if(s != null && s >= 200 && s < 400) {
				me.req = null;
				me.onData(me.responseData = r.responseText);
			} else if(s == null) {
				me.req = null;
				me.onError("Failed to connect or resolve host");
			} else {
				switch(s) {
				case 12007:
					me.req = null;
					me.onError("Unknown host");
					break;
				case 12029:
					me.req = null;
					me.onError("Failed to connect to host");
					break;
				default:
					me.req = null;
					me.responseData = r.responseText;
					me.onError("Http Error #" + r.status);
				}
			}
		};
		if(this.async) {
			r.onreadystatechange = onreadystatechange;
		}
		var uri = this.postData;
		if(uri != null) {
			post = true;
		} else {
			var _g_head = this.params.h;
			while(_g_head != null) {
				var val = _g_head.item;
				_g_head = _g_head.next;
				var p = val;
				if(uri == null) {
					uri = "";
				} else {
					uri += "&";
				}
				var s1 = p.param;
				var uri1 = encodeURIComponent(s1) + "=";
				var s2 = p.value;
				uri += uri1 + encodeURIComponent(s2);
			}
		}
		try {
			if(post) {
				r.open("POST",this.url,this.async);
			} else if(uri != null) {
				var question = this.url.split("?").length <= 1;
				r.open("GET",this.url + (question ? "?" : "&") + uri,this.async);
				uri = null;
			} else {
				r.open("GET",this.url,this.async);
			}
		} catch( e1 ) {
			haxe_CallStack.lastException = e1;
			if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
			me.req = null;
			this.onError(e1.toString());
			return;
		}
		r.withCredentials = this.withCredentials;
		if(!Lambda.exists(this.headers,function(h) {
			return h.header == "Content-Type";
		}) && post && this.postData == null) {
			r.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		}
		var _g_head1 = this.headers.h;
		while(_g_head1 != null) {
			var val1 = _g_head1.item;
			_g_head1 = _g_head1.next;
			var h1 = val1;
			r.setRequestHeader(h1.header,h1.value);
		}
		r.send(uri);
		if(!this.async) {
			onreadystatechange(null);
		}
	}
	,onData: function(data) {
	}
	,onError: function(msg) {
	}
	,onStatus: function(status) {
	}
	,__class__: haxe_Http
};
var haxe_Log = function() { };
haxe_Log.__name__ = ["haxe","Log"];
haxe_Log.trace = function(v,infos) {
	js_Boot.__trace(v,infos);
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe_Timer.__name__ = ["haxe","Timer"];
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.prototype = {
	id: null
	,stop: function() {
		if(this.id == null) {
			return;
		}
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe_Timer
};
var haxe_io_Bytes = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	this.b.bufferValue = data;
	data.hxBytes = this;
	data.bytes = this.b;
};
haxe_io_Bytes.__name__ = ["haxe","io","Bytes"];
haxe_io_Bytes.alloc = function(length) {
	return new haxe_io_Bytes(new ArrayBuffer(length));
};
haxe_io_Bytes.ofString = function(s) {
	var a = [];
	var i = 0;
	while(i < s.length) {
		var c = s.charCodeAt(i++);
		if(55296 <= c && c <= 56319) {
			c = c - 55232 << 10 | s.charCodeAt(i++) & 1023;
		}
		if(c <= 127) {
			a.push(c);
		} else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe_io_Bytes(new Uint8Array(a).buffer);
};
haxe_io_Bytes.ofData = function(b) {
	var hb = b.hxBytes;
	if(hb != null) {
		return hb;
	}
	return new haxe_io_Bytes(b);
};
haxe_io_Bytes.fastGet = function(b,pos) {
	return b.bytes[pos];
};
haxe_io_Bytes.prototype = {
	length: null
	,b: null
	,getString: function(pos,len) {
		if(pos < 0 || len < 0 || pos + len > this.length) {
			throw new js__$Boot_HaxeError(haxe_io_Error.OutsideBounds);
		}
		var s = "";
		var b = this.b;
		var fcc = String.fromCharCode;
		var i = pos;
		var max = pos + len;
		while(i < max) {
			var c = b[i++];
			if(c < 128) {
				if(c == 0) {
					break;
				}
				s += fcc(c);
			} else if(c < 224) {
				s += fcc((c & 63) << 6 | b[i++] & 127);
			} else if(c < 240) {
				var c2 = b[i++];
				s += fcc((c & 31) << 12 | (c2 & 127) << 6 | b[i++] & 127);
			} else {
				var c21 = b[i++];
				var c3 = b[i++];
				var u = (c & 15) << 18 | (c21 & 127) << 12 | (c3 & 127) << 6 | b[i++] & 127;
				s += fcc((u >> 10) + 55232);
				s += fcc(u & 1023 | 56320);
			}
		}
		return s;
	}
	,toString: function() {
		return this.getString(0,this.length);
	}
	,__class__: haxe_io_Bytes
};
var haxe_crypto_Base64 = function() { };
haxe_crypto_Base64.__name__ = ["haxe","crypto","Base64"];
haxe_crypto_Base64.encode = function(bytes,complement) {
	if(complement == null) {
		complement = true;
	}
	var str = new haxe_crypto_BaseCode(haxe_crypto_Base64.BYTES).encodeBytes(bytes).toString();
	if(complement) {
		var _g = bytes.length % 3;
		switch(_g) {
		case 1:
			str += "==";
			break;
		case 2:
			str += "=";
			break;
		default:
		}
	}
	return str;
};
haxe_crypto_Base64.decode = function(str,complement) {
	if(complement == null) {
		complement = true;
	}
	if(complement) {
		while(HxOverrides.cca(str,str.length - 1) == 61) str = HxOverrides.substr(str,0,-1);
	}
	return new haxe_crypto_BaseCode(haxe_crypto_Base64.BYTES).decodeBytes(haxe_io_Bytes.ofString(str));
};
var haxe_crypto_BaseCode = function(base) {
	var len = base.length;
	var nbits = 1;
	while(len > 1 << nbits) ++nbits;
	if(nbits > 8 || len != 1 << nbits) {
		throw new js__$Boot_HaxeError("BaseCode : base length must be a power of two.");
	}
	this.base = base;
	this.nbits = nbits;
};
haxe_crypto_BaseCode.__name__ = ["haxe","crypto","BaseCode"];
haxe_crypto_BaseCode.prototype = {
	base: null
	,nbits: null
	,tbl: null
	,encodeBytes: function(b) {
		var nbits = this.nbits;
		var base = this.base;
		var size = b.length * 8 / nbits | 0;
		var out = new haxe_io_Bytes(new ArrayBuffer(size + (b.length * 8 % nbits == 0 ? 0 : 1)));
		var buf = 0;
		var curbits = 0;
		var mask = (1 << nbits) - 1;
		var pin = 0;
		var pout = 0;
		while(pout < size) {
			while(curbits < nbits) {
				curbits += 8;
				buf <<= 8;
				buf |= b.b[pin++];
			}
			curbits -= nbits;
			out.b[pout++] = base.b[buf >> curbits & mask] & 255;
		}
		if(curbits > 0) {
			out.b[pout++] = base.b[buf << nbits - curbits & mask] & 255;
		}
		return out;
	}
	,initTable: function() {
		var tbl = [];
		var _g = 0;
		while(_g < 256) {
			var i = _g++;
			tbl[i] = -1;
		}
		var _g1 = 0;
		var _g2 = this.base.length;
		while(_g1 < _g2) {
			var i1 = _g1++;
			tbl[this.base.b[i1]] = i1;
		}
		this.tbl = tbl;
	}
	,decodeBytes: function(b) {
		var nbits = this.nbits;
		var base = this.base;
		if(this.tbl == null) {
			this.initTable();
		}
		var tbl = this.tbl;
		var size = b.length * nbits >> 3;
		var out = new haxe_io_Bytes(new ArrayBuffer(size));
		var buf = 0;
		var curbits = 0;
		var pin = 0;
		var pout = 0;
		while(pout < size) {
			while(curbits < 8) {
				curbits += nbits;
				buf <<= nbits;
				var i = tbl[b.b[pin++]];
				if(i == -1) {
					throw new js__$Boot_HaxeError("BaseCode : invalid encoded char");
				}
				buf |= i;
			}
			curbits -= 8;
			out.b[pout++] = buf >> curbits & 255 & 255;
		}
		return out;
	}
	,__class__: haxe_crypto_BaseCode
};
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__name__ = ["haxe","ds","StringMap"];
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	h: null
	,rh: null
	,get: function(key) {
		if(__map_reserved[key] != null) {
			return this.getReserved(key);
		}
		return this.h[key];
	}
	,setReserved: function(key,value) {
		if(this.rh == null) {
			this.rh = { };
		}
		this.rh["$" + key] = value;
	}
	,getReserved: function(key) {
		if(this.rh == null) {
			return null;
		} else {
			return this.rh["$" + key];
		}
	}
	,existsReserved: function(key) {
		if(this.rh == null) {
			return false;
		}
		return this.rh.hasOwnProperty("$" + key);
	}
	,keys: function() {
		return HxOverrides.iter(this.arrayKeys());
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) {
			out.push(key);
		}
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) {
				out.push(key.substr(1));
			}
			}
		}
		return out;
	}
	,__class__: haxe_ds_StringMap
};
var haxe_io_Error = { __ename__ : ["haxe","io","Error"], __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe_io_Error.Blocked = ["Blocked",0];
haxe_io_Error.Blocked.toString = $estr;
haxe_io_Error.Blocked.__enum__ = haxe_io_Error;
haxe_io_Error.Overflow = ["Overflow",1];
haxe_io_Error.Overflow.toString = $estr;
haxe_io_Error.Overflow.__enum__ = haxe_io_Error;
haxe_io_Error.OutsideBounds = ["OutsideBounds",2];
haxe_io_Error.OutsideBounds.toString = $estr;
haxe_io_Error.OutsideBounds.__enum__ = haxe_io_Error;
haxe_io_Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe_io_Error; $x.toString = $estr; return $x; };
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) {
		Error.captureStackTrace(this,js__$Boot_HaxeError);
	}
};
js__$Boot_HaxeError.__name__ = ["js","_Boot","HaxeError"];
js__$Boot_HaxeError.wrap = function(val) {
	if((val instanceof Error)) {
		return val;
	} else {
		return new js__$Boot_HaxeError(val);
	}
};
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	val: null
	,__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
js_Boot.__name__ = ["js","Boot"];
js_Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js_Boot.__trace = function(v,i) {
	var msg = i != null ? i.fileName + ":" + i.lineNumber + ": " : "";
	msg += js_Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js_Boot.__string_rec(v1,"");
		}
	}
	var d;
	var tmp;
	if(typeof(document) != "undefined") {
		d = document.getElementById("haxe:trace");
		tmp = d != null;
	} else {
		tmp = false;
	}
	if(tmp) {
		d.innerHTML += js_Boot.__unhtml(msg) + "<br/>";
	} else if(typeof console != "undefined" && console.log != null) {
		console.log(msg);
	}
};
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) {
		return Array;
	} else {
		var cl = o.__class__;
		if(cl != null) {
			return cl;
		}
		var name = js_Boot.__nativeClassName(o);
		if(name != null) {
			return js_Boot.__resolveNativeClass(name);
		}
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) {
					return o[0];
				}
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) {
						str += "," + js_Boot.__string_rec(o[i],s);
					} else {
						str += js_Boot.__string_rec(o[i],s);
					}
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g11 = 0;
			var _g2 = l;
			while(_g11 < _g2) {
				var i2 = _g11++;
				str1 += (i2 > 0 ? "," : "") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			haxe_CallStack.lastException = e;
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) {
			str2 += ", \n";
		}
		str2 += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) {
		return false;
	}
	if(cc == cl) {
		return true;
	}
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) {
				return true;
			}
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) {
		return false;
	}
	switch(cl) {
	case Array:
		if((o instanceof Array)) {
			return o.__enum__ == null;
		} else {
			return false;
		}
		break;
	case Bool:
		return typeof(o) == "boolean";
	case Dynamic:
		return true;
	case Float:
		return typeof(o) == "number";
	case Int:
		if(typeof(o) == "number") {
			return (o|0) === o;
		} else {
			return false;
		}
		break;
	case String:
		return typeof(o) == "string";
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) {
					return true;
				}
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) {
					return true;
				}
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) {
					return true;
				}
			}
		} else {
			return false;
		}
		if(cl == Class ? o.__name__ != null : false) {
			return true;
		}
		if(cl == Enum ? o.__ename__ != null : false) {
			return true;
		}
		return o.__enum__ == cl;
	}
};
js_Boot.__cast = function(o,t) {
	if(js_Boot.__instanceof(o,t)) {
		return o;
	} else {
		throw new js__$Boot_HaxeError("Cannot cast " + Std.string(o) + " to " + Std.string(t));
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") {
		return null;
	}
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var js_Browser = function() { };
js_Browser.__name__ = ["js","Browser"];
js_Browser.createXMLHttpRequest = function() {
	if(typeof XMLHttpRequest != "undefined") {
		return new XMLHttpRequest();
	}
	if(typeof ActiveXObject != "undefined") {
		return new ActiveXObject("Microsoft.XMLHTTP");
	}
	throw new js__$Boot_HaxeError("Unable to create XMLHttpRequest object.");
};
var js_html_compat_ArrayBuffer = function(a) {
	if((a instanceof Array) && a.__enum__ == null) {
		this.a = a;
		this.byteLength = a.length;
	} else {
		var len = a;
		this.a = [];
		var _g1 = 0;
		var _g = len;
		while(_g1 < _g) {
			var i = _g1++;
			this.a[i] = 0;
		}
		this.byteLength = len;
	}
};
js_html_compat_ArrayBuffer.__name__ = ["js","html","compat","ArrayBuffer"];
js_html_compat_ArrayBuffer.sliceImpl = function(begin,end) {
	var u = new Uint8Array(this,begin,end == null ? null : end - begin);
	var result = new ArrayBuffer(u.byteLength);
	var resultArray = new Uint8Array(result);
	resultArray.set(u);
	return result;
};
js_html_compat_ArrayBuffer.prototype = {
	byteLength: null
	,a: null
	,slice: function(begin,end) {
		return new js_html_compat_ArrayBuffer(this.a.slice(begin,end));
	}
	,__class__: js_html_compat_ArrayBuffer
};
var js_html_compat_Uint8Array = function() { };
js_html_compat_Uint8Array.__name__ = ["js","html","compat","Uint8Array"];
js_html_compat_Uint8Array._new = function(arg1,offset,length) {
	var arr;
	if(typeof(arg1) == "number") {
		arr = [];
		var _g1 = 0;
		var _g = arg1;
		while(_g1 < _g) {
			var i = _g1++;
			arr[i] = 0;
		}
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else if(js_Boot.__instanceof(arg1,js_html_compat_ArrayBuffer)) {
		var buffer = arg1;
		if(offset == null) {
			offset = 0;
		}
		if(length == null) {
			length = buffer.byteLength - offset;
		}
		if(offset == 0) {
			arr = buffer.a;
		} else {
			arr = buffer.a.slice(offset,offset + length);
		}
		arr.byteLength = arr.length;
		arr.byteOffset = offset;
		arr.buffer = buffer;
	} else if((arg1 instanceof Array) && arg1.__enum__ == null) {
		arr = arg1.slice();
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else {
		throw new js__$Boot_HaxeError("TODO " + Std.string(arg1));
	}
	arr.subarray = js_html_compat_Uint8Array._subarray;
	arr.set = js_html_compat_Uint8Array._set;
	return arr;
};
js_html_compat_Uint8Array._set = function(arg,offset) {
	if(js_Boot.__instanceof(arg.buffer,js_html_compat_ArrayBuffer)) {
		var a = arg;
		if(arg.byteLength + offset > this.byteLength) {
			throw new js__$Boot_HaxeError("set() outside of range");
		}
		var _g1 = 0;
		var _g = arg.byteLength;
		while(_g1 < _g) {
			var i = _g1++;
			this[i + offset] = a[i];
		}
	} else if((arg instanceof Array) && arg.__enum__ == null) {
		var a1 = arg;
		if(a1.length + offset > this.byteLength) {
			throw new js__$Boot_HaxeError("set() outside of range");
		}
		var _g11 = 0;
		var _g2 = a1.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			this[i1 + offset] = a1[i1];
		}
	} else {
		throw new js__$Boot_HaxeError("TODO");
	}
};
js_html_compat_Uint8Array._subarray = function(start,end) {
	var a = js_html_compat_Uint8Array._new(this.slice(start,end));
	a.byteOffset = start;
	return a;
};
var thx_Either = { __ename__ : ["thx","Either"], __constructs__ : ["Left","Right"] };
thx_Either.Left = function(value) { var $x = ["Left",0,value]; $x.__enum__ = thx_Either; $x.toString = $estr; return $x; };
thx_Either.Right = function(value) { var $x = ["Right",1,value]; $x.__enum__ = thx_Either; $x.toString = $estr; return $x; };
var thx_Floats = function() { };
thx_Floats.__name__ = ["thx","Floats"];
thx_Floats.roundTo = function(f,decimals) {
	var p = Math.pow(10,decimals);
	return Math.round(f * p) / p;
};
var thx_Ints = function() { };
thx_Ints.__name__ = ["thx","Ints"];
thx_Ints.parse = function(s,base) {
	if(null == base) {
		if(s.substring(0,2) == "0x") {
			base = 16;
		} else {
			base = 10;
		}
	}
	var v = parseInt(s,base);
	if(isNaN(v)) {
		return null;
	} else {
		return v;
	}
};
var thx_culture_DateFormatInfo = function(calendarWeekRuleIndex,calendarWeekRuleName,designatorAm,designatorPm,firstDayOfWeekIndex,firstDayOfWeekName,nameCalendar,nameCalendarNative,nameDays,nameDaysAbbreviated,nameDaysShortest,nameMonths,nameMonthsAbbreviated,nameMonthGenitives,nameMonthGenitivesAbbreviated,patternDateLong,patternDateShort,patternDateTimeFull,patternDateTimeSortable,patternMonthDay,patternRfc1123,patternTimeLong,patternTimeShort,patternUniversalSortable,patternYearMonth,separatorDate,separatorTime) {
	this.calendarWeekRuleIndex = calendarWeekRuleIndex;
	this.calendarWeekRuleName = calendarWeekRuleName;
	this.designatorAm = designatorAm;
	this.designatorPm = designatorPm;
	this.firstDayOfWeekIndex = firstDayOfWeekIndex;
	this.firstDayOfWeekName = firstDayOfWeekName;
	this.nameCalendar = nameCalendar;
	this.nameCalendarNative = nameCalendarNative;
	this.nameDays = nameDays;
	this.nameDaysAbbreviated = nameDaysAbbreviated;
	this.nameDaysShortest = nameDaysShortest;
	this.nameMonths = nameMonths;
	this.nameMonthsAbbreviated = nameMonthsAbbreviated;
	this.nameMonthGenitives = nameMonthGenitives;
	this.nameMonthGenitivesAbbreviated = nameMonthGenitivesAbbreviated;
	this.patternDateLong = patternDateLong;
	this.patternDateShort = patternDateShort;
	this.patternDateTimeFull = patternDateTimeFull;
	this.patternDateTimeSortable = patternDateTimeSortable;
	this.patternMonthDay = patternMonthDay;
	this.patternRfc1123 = patternRfc1123;
	this.patternTimeLong = patternTimeLong;
	this.patternTimeShort = patternTimeShort;
	this.patternUniversalSortable = patternUniversalSortable;
	this.patternYearMonth = patternYearMonth;
	this.separatorDate = separatorDate;
	this.separatorTime = separatorTime;
};
thx_culture_DateFormatInfo.__name__ = ["thx","culture","DateFormatInfo"];
thx_culture_DateFormatInfo.prototype = {
	calendarWeekRuleIndex: null
	,calendarWeekRuleName: null
	,designatorAm: null
	,designatorPm: null
	,firstDayOfWeekIndex: null
	,firstDayOfWeekName: null
	,nameCalendar: null
	,nameCalendarNative: null
	,nameDays: null
	,nameDaysAbbreviated: null
	,nameDaysShortest: null
	,nameMonths: null
	,nameMonthsAbbreviated: null
	,nameMonthGenitives: null
	,nameMonthGenitivesAbbreviated: null
	,patternDateLong: null
	,patternDateShort: null
	,patternDateTimeFull: null
	,patternDateTimeSortable: null
	,patternMonthDay: null
	,patternRfc1123: null
	,patternTimeLong: null
	,patternTimeShort: null
	,patternUniversalSortable: null
	,patternYearMonth: null
	,separatorDate: null
	,separatorTime: null
	,__class__: thx_culture_DateFormatInfo
};
var thx_culture_NumberFormatInfo = function(decimalDigitsCurrency,decimalDigitsNumber,decimalDigitsPercent,groupSizesCurrency,groupSizesNumber,groupSizesPercent,patternNegativeCurrency,patternNegativeNumber,patternNegativePercent,patternPositiveCurrency,patternPositivePercent,separatorDecimalCurrency,separatorDecimalNumber,separatorDecimalPercent,separatorGroupCurrency,separatorGroupNumber,separatorGroupPercent,signNegative,signPositive,symbolCurrency,symbolNaN,symbolNegativeInfinity,symbolPercent,symbolPermille,symbolPositiveInfinity) {
	this.decimalDigitsCurrency = decimalDigitsCurrency;
	this.decimalDigitsNumber = decimalDigitsNumber;
	this.decimalDigitsPercent = decimalDigitsPercent;
	this.groupSizesCurrency = groupSizesCurrency;
	this.groupSizesNumber = groupSizesNumber;
	this.groupSizesPercent = groupSizesPercent;
	this.patternNegativeCurrency = patternNegativeCurrency;
	this.patternNegativeNumber = patternNegativeNumber;
	this.patternNegativePercent = patternNegativePercent;
	this.patternPositiveCurrency = patternPositiveCurrency;
	this.patternPositivePercent = patternPositivePercent;
	this.separatorDecimalCurrency = separatorDecimalCurrency;
	this.separatorDecimalNumber = separatorDecimalNumber;
	this.separatorDecimalPercent = separatorDecimalPercent;
	this.separatorGroupCurrency = separatorGroupCurrency;
	this.separatorGroupNumber = separatorGroupNumber;
	this.separatorGroupPercent = separatorGroupPercent;
	this.signNegative = signNegative;
	this.signPositive = signPositive;
	this.symbolCurrency = symbolCurrency;
	this.symbolNaN = symbolNaN;
	this.symbolNegativeInfinity = symbolNegativeInfinity;
	this.symbolPercent = symbolPercent;
	this.symbolPermille = symbolPermille;
	this.symbolPositiveInfinity = symbolPositiveInfinity;
};
thx_culture_NumberFormatInfo.__name__ = ["thx","culture","NumberFormatInfo"];
thx_culture_NumberFormatInfo.prototype = {
	decimalDigitsCurrency: null
	,decimalDigitsNumber: null
	,decimalDigitsPercent: null
	,groupSizesCurrency: null
	,groupSizesNumber: null
	,groupSizesPercent: null
	,patternNegativeCurrency: null
	,patternNegativeNumber: null
	,patternNegativePercent: null
	,patternPositiveCurrency: null
	,patternPositivePercent: null
	,separatorDecimalCurrency: null
	,separatorDecimalNumber: null
	,separatorDecimalPercent: null
	,separatorGroupCurrency: null
	,separatorGroupNumber: null
	,separatorGroupPercent: null
	,signNegative: null
	,signPositive: null
	,symbolCurrency: null
	,symbolNaN: null
	,symbolNegativeInfinity: null
	,symbolPercent: null
	,symbolPermille: null
	,symbolPositiveInfinity: null
	,__class__: thx_culture_NumberFormatInfo
};
var thx_culture_Culture = function(code,dateTime,ietf,isNeutral,iso2,iso3,isRightToLeft,lcid,nameCalendar,nameEnglish,nameNative,nameRegionEnglish,nameRegionNative,number,separatorList,win3) {
	this.code = code;
	this.dateTime = dateTime;
	this.ietf = ietf;
	this.isNeutral = isNeutral;
	this.iso2 = iso2;
	this.iso3 = iso3;
	this.isRightToLeft = isRightToLeft;
	this.lcid = lcid;
	this.nameCalendar = nameCalendar;
	this.nameEnglish = nameEnglish;
	this.nameNative = nameNative;
	this.nameRegionEnglish = nameRegionEnglish;
	this.nameRegionNative = nameRegionNative;
	this.number = number;
	this.separatorList = separatorList;
	this.win3 = win3;
};
thx_culture_Culture.__name__ = ["thx","culture","Culture"];
thx_culture_Culture.prototype = {
	code: null
	,dateTime: null
	,ietf: null
	,isNeutral: null
	,iso2: null
	,iso3: null
	,isRightToLeft: null
	,lcid: null
	,nameCalendar: null
	,nameEnglish: null
	,nameNative: null
	,nameRegionEnglish: null
	,nameRegionNative: null
	,number: null
	,separatorList: null
	,win3: null
	,__class__: thx_culture_Culture
};
var thx_culture_Pattern = function() { };
thx_culture_Pattern.__name__ = ["thx","culture","Pattern"];
var thx_format_Format = function() { };
thx_format_Format.__name__ = ["thx","format","Format"];
thx_format_Format.get_defaultCulture = function() {
	if(null != thx_format_Format.defaultCulture) {
		return thx_format_Format.defaultCulture;
	} else {
		return thx_culture_Culture.invariant;
	}
};
var thx_format_NumberFormat = function() { };
thx_format_NumberFormat.__name__ = ["thx","format","NumberFormat"];
thx_format_NumberFormat.fixed = function(f,precision,culture) {
	var nf = thx_format_NumberFormat.numberFormat(culture);
	if(isNaN(f)) {
		return nf.symbolNaN;
	}
	if(!isFinite(f)) {
		if(f < 0) {
			return nf.symbolNegativeInfinity;
		} else {
			return nf.symbolPositiveInfinity;
		}
	}
	var pattern = f < 0 ? thx_culture_Pattern.numberNegatives[nf.patternNegativeNumber] : "n";
	var _0 = precision;
	var t = null == _0 ? null : _0;
	var formatted = thx_format_NumberFormat.value(f,t != null ? t : nf.decimalDigitsNumber,[0],"",nf.separatorDecimalNumber);
	return StringTools.replace(pattern,"n",formatted);
};
thx_format_NumberFormat.intPart = function(s,groupSizes,groupSeparator) {
	var buf = [];
	var pos = 0;
	var sizes = groupSizes.slice();
	var size = sizes.shift();
	var seg;
	while(s.length > 0) if(size == 0) {
		buf.unshift(s);
		s = "";
	} else if(s.length > size) {
		buf.unshift(s.substring(s.length - size));
		s = s.substring(0,s.length - size);
		if(sizes.length > 0) {
			size = sizes.shift();
		}
	} else {
		buf.unshift(s);
		s = "";
	}
	return buf.join(groupSeparator);
};
thx_format_NumberFormat.numberFormat = function(culture) {
	if(null != culture && null != culture.number) {
		return culture.number;
	} else {
		return thx_format_Format.get_defaultCulture().number;
	}
};
thx_format_NumberFormat.pad = function(s,len,round) {
	var _0 = s;
	var t = null == _0 ? null : _0;
	if(t != null) {
		s = t;
	} else {
		s = "";
	}
	if(len > 0 && s.length > len) {
		if(round) {
			return s.substring(0,len - 1) + (Std.parseInt(s.substring(len - 1,len)) + (Std.parseInt(s.substring(len,len + 1)) >= 5 ? 1 : 0));
		} else {
			return s.substring(0,len);
		}
	} else {
		return StringTools.rpad(s,"0",len);
	}
};
thx_format_NumberFormat.splitOnDecimalSeparator = function(f) {
	var p = ("" + f).split(".");
	var i = p[0];
	var _0 = p;
	var t;
	if(null == _0) {
		t = null;
	} else {
		var _1 = _0[1];
		if(null == _1) {
			t = null;
		} else {
			t = _1;
		}
	}
	var d = (t != null ? t : "").toLowerCase();
	if(d.indexOf("e") >= 0) {
		p = d.split("e");
		d = p[0];
		var e = thx_Ints.parse(p[1]);
		if(e < 0) {
			d = StringTools.rpad("","0",-e - 1) + i + d;
			i = "0";
		} else {
			var s = i + d;
			d = s.substring(e + 1);
			i = thx_format_NumberFormat.pad(s,e + 1,false);
		}
	}
	if(d.length > 0) {
		return [i,d];
	} else {
		return [i];
	}
};
thx_format_NumberFormat.value = function(f,precision,groupSizes,groupSeparator,decimalSeparator) {
	f = Math.abs(thx_Floats.roundTo(f,precision));
	var p = thx_format_NumberFormat.splitOnDecimalSeparator(f);
	var buf = [];
	buf.push(thx_format_NumberFormat.intPart(p[0],groupSizes,groupSeparator));
	if(precision > 0) {
		buf.push(thx_format_NumberFormat.pad(p[1],precision,true));
	}
	return buf.join(decimalSeparator);
};
var tink_template__$Html_Html_$Impl_$ = {};
tink_template__$Html_Html_$Impl_$.__name__ = ["tink","template","_Html","Html_Impl_"];
tink_template__$Html_Html_$Impl_$.escape = function(s) {
	if(s == null) {
		return null;
	}
	if(s == null) {
		s = "null";
	} else {
		s = "" + s;
	}
	var start = 0;
	var pos = 0;
	var max = s.length;
	var ret = "";
	while(pos < max) {
		var _g = s.charAt(pos++);
		switch(_g) {
		case "\"":
			var start1 = start;
			start = pos;
			ret += s.substring(start1,start - 1) + "&quot;";
			break;
		case "&":
			var start2 = start;
			start = pos;
			ret += s.substring(start2,start - 1) + "&amp;";
			break;
		case "<":
			var start3 = start;
			start = pos;
			ret += s.substring(start3,start - 1) + "&lt;";
			break;
		case ">":
			var start4 = start;
			start = pos;
			ret += s.substring(start4,start - 1) + "&gt;";
			break;
		}
	}
	var this1 = ret += HxOverrides.substr(s,start,null);
	return this1;
};
tink_template__$Html_Html_$Impl_$.of = function(a) {
	return tink_template__$Html_Html_$Impl_$.escape(Std.string(a));
};
tink_template__$Html_Html_$Impl_$.buffer = function() {
	var this1 = { s : ""};
	return this1;
};
var utest_Assert = function() { };
utest_Assert.__name__ = ["utest","Assert"];
utest_Assert.isTrue = function(cond,msg,pos) {
	if(utest_Assert.results == null) {
		throw new js__$Boot_HaxeError("Assert.results is not currently bound to any assert context");
	}
	if(null == msg) {
		msg = "expected true";
	}
	if(cond) {
		utest_Assert.results.add(utest_Assertation.Success(pos));
	} else {
		utest_Assert.results.add(utest_Assertation.Failure(msg,pos));
	}
};
utest_Assert._floatEquals = function(expected,value,approx) {
	if(isNaN(expected)) {
		return isNaN(value);
	} else if(isNaN(value)) {
		return false;
	} else if(!isFinite(expected) && !isFinite(value)) {
		return expected > 0 == value > 0;
	}
	if(null == approx) {
		approx = 1e-5;
	}
	return Math.abs(value - expected) <= approx;
};
utest_Assert.getTypeName = function(v) {
	var _g = Type["typeof"](v);
	switch(_g[1]) {
	case 0:
		return "`null`";
	case 1:
		return "Int";
	case 2:
		return "Float";
	case 3:
		return "Bool";
	case 4:
		return "Object";
	case 5:
		return "function";
	case 6:
		var c = _g[2];
		return Type.getClassName(c);
	case 7:
		var e = _g[2];
		return Type.getEnumName(e);
	case 8:
		return "`Unknown`";
	}
};
utest_Assert.isIterable = function(v,isAnonym) {
	var fields;
	if(isAnonym) {
		fields = Reflect.fields(v);
	} else {
		var o = v;
		fields = Type.getInstanceFields(o == null ? null : js_Boot.getClass(o));
	}
	if(!Lambda.has(fields,"iterator")) {
		return false;
	}
	return Reflect.isFunction(Reflect.field(v,"iterator"));
};
utest_Assert.isIterator = function(v,isAnonym) {
	var fields;
	if(isAnonym) {
		fields = Reflect.fields(v);
	} else {
		var o = v;
		fields = Type.getInstanceFields(o == null ? null : js_Boot.getClass(o));
	}
	if(!Lambda.has(fields,"next") || !Lambda.has(fields,"hasNext")) {
		return false;
	}
	if(Reflect.isFunction(Reflect.field(v,"next"))) {
		return Reflect.isFunction(Reflect.field(v,"hasNext"));
	} else {
		return false;
	}
};
utest_Assert.sameAs = function(expected,value,status,approx) {
	var texpected = utest_Assert.getTypeName(expected);
	var tvalue = utest_Assert.getTypeName(value);
	if(texpected != tvalue && !(texpected == "Int" && tvalue == "Float" || texpected == "Float" && tvalue == "Int")) {
		status.error = "expected type " + texpected + " but it is " + tvalue + (status.path == "" ? "" : " for field " + status.path);
		return false;
	}
	var _g = Type["typeof"](expected);
	switch(_g[1]) {
	case 1:case 2:
		if(!utest_Assert._floatEquals(expected,value,approx)) {
			status.error = "expected " + utest_Assert.q(expected) + " but it is " + utest_Assert.q(value) + (status.path == "" ? "" : " for field " + status.path);
			return false;
		}
		return true;
	case 0:case 3:
		if(expected != value) {
			status.error = "expected " + utest_Assert.q(expected) + " but it is " + utest_Assert.q(value) + (status.path == "" ? "" : " for field " + status.path);
			return false;
		}
		return true;
	case 4:
		if(status.recursive || status.path == "") {
			var tfields = Reflect.fields(value);
			var fields = Reflect.fields(expected);
			var path = status.path;
			var _g1 = 0;
			while(_g1 < fields.length) {
				var field = fields[_g1];
				++_g1;
				HxOverrides.remove(tfields,field);
				status.path = path == "" ? field : path + "." + field;
				if(!Object.prototype.hasOwnProperty.call(value,field)) {
					status.error = "expected field " + status.path + " does not exist in " + utest_Assert.q(value);
					return false;
				}
				var e = Reflect.field(expected,field);
				if(Reflect.isFunction(e)) {
					continue;
				}
				var v = Reflect.field(value,field);
				if(!utest_Assert.sameAs(e,v,status,approx)) {
					return false;
				}
			}
			if(tfields.length > 0) {
				status.error = "the tested object has extra field(s) (" + tfields.join(", ") + ") not included in the expected ones";
				return false;
			}
		}
		if(utest_Assert.isIterator(expected,true)) {
			if(!utest_Assert.isIterator(value,true)) {
				status.error = "expected Iterable but it is not " + (status.path == "" ? "" : " for field " + status.path);
				return false;
			}
			if(status.recursive || status.path == "") {
				var evalues = Lambda.array({ iterator : function() {
					return expected;
				}});
				var vvalues = Lambda.array({ iterator : function() {
					return value;
				}});
				if(evalues.length != vvalues.length) {
					status.error = "expected " + evalues.length + " values in Iterator but they are " + vvalues.length + (status.path == "" ? "" : " for field " + status.path);
					return false;
				}
				var path1 = status.path;
				var _g11 = 0;
				var _g2 = evalues.length;
				while(_g11 < _g2) {
					var i = _g11++;
					status.path = path1 == "" ? "iterator[" + i + "]" : path1 + "[" + i + "]";
					if(!utest_Assert.sameAs(evalues[i],vvalues[i],status,approx)) {
						status.error = "expected " + utest_Assert.q(expected) + " but it is " + utest_Assert.q(value) + (status.path == "" ? "" : " for field " + status.path);
						return false;
					}
				}
			}
			return true;
		}
		if(utest_Assert.isIterable(expected,true)) {
			if(!utest_Assert.isIterable(value,true)) {
				status.error = "expected Iterator but it is not " + (status.path == "" ? "" : " for field " + status.path);
				return false;
			}
			if(status.recursive || status.path == "") {
				var evalues1 = Lambda.array(expected);
				var vvalues1 = Lambda.array(value);
				if(evalues1.length != vvalues1.length) {
					status.error = "expected " + evalues1.length + " values in Iterable but they are " + vvalues1.length + (status.path == "" ? "" : " for field " + status.path);
					return false;
				}
				var path2 = status.path;
				var _g12 = 0;
				var _g3 = evalues1.length;
				while(_g12 < _g3) {
					var i1 = _g12++;
					status.path = path2 == "" ? "iterable[" + i1 + "]" : path2 + "[" + i1 + "]";
					if(!utest_Assert.sameAs(evalues1[i1],vvalues1[i1],status,approx)) {
						return false;
					}
				}
			}
			return true;
		}
		return true;
	case 5:
		if(!Reflect.compareMethods(expected,value)) {
			status.error = "expected same function reference" + (status.path == "" ? "" : " for field " + status.path);
			return false;
		}
		return true;
	case 6:
		var c = _g[2];
		var cexpected = Type.getClassName(c);
		var o = value;
		var cvalue = Type.getClassName(o == null ? null : js_Boot.getClass(o));
		if(cexpected != cvalue) {
			status.error = "expected instance of " + utest_Assert.q(cexpected) + " but it is " + utest_Assert.q(cvalue) + (status.path == "" ? "" : " for field " + status.path);
			return false;
		}
		if(typeof(expected) == "string") {
			if(expected == value) {
				return true;
			} else {
				status.error = "expected string '" + Std.string(expected) + "' but it is '" + Std.string(value) + "'";
				return false;
			}
		}
		if((expected instanceof Array) && expected.__enum__ == null) {
			if(status.recursive || status.path == "") {
				if(expected.length != value.length) {
					status.error = "expected " + Std.string(expected.length) + " elements but they are " + Std.string(value.length) + (status.path == "" ? "" : " for field " + status.path);
					return false;
				}
				var path3 = status.path;
				var _g13 = 0;
				var _g4 = expected.length;
				while(_g13 < _g4) {
					var i2 = _g13++;
					status.path = path3 == "" ? "array[" + i2 + "]" : path3 + "[" + i2 + "]";
					if(!utest_Assert.sameAs(expected[i2],value[i2],status,approx)) {
						status.error = "expected array element at [" + i2 + "] to be " + utest_Assert.q(expected[i2]) + " but it is " + utest_Assert.q(value[i2]) + (status.path == "" ? "" : " for field " + status.path);
						return false;
					}
				}
			}
			return true;
		}
		if(js_Boot.__instanceof(expected,Date)) {
			if(expected.getTime() != value.getTime()) {
				status.error = "expected " + utest_Assert.q(expected) + " but it is " + utest_Assert.q(value) + (status.path == "" ? "" : " for field " + status.path);
				return false;
			}
			return true;
		}
		if(js_Boot.__instanceof(expected,haxe_io_Bytes)) {
			if(status.recursive || status.path == "") {
				var ebytes = expected;
				var vbytes = value;
				if(ebytes.length != vbytes.length) {
					return false;
				}
				var _g14 = 0;
				var _g5 = ebytes.length;
				while(_g14 < _g5) {
					var i3 = _g14++;
					if(ebytes.b[i3] != vbytes.b[i3]) {
						status.error = "expected byte " + ebytes.b[i3] + " but it is " + vbytes.b[i3] + (status.path == "" ? "" : " for field " + status.path);
						return false;
					}
				}
			}
			return true;
		}
		if(js_Boot.__instanceof(expected,haxe_IMap)) {
			if(status.recursive || status.path == "") {
				var map = js_Boot.__cast(expected , haxe_IMap);
				var vmap = js_Boot.__cast(value , haxe_IMap);
				var _g6 = [];
				var k = map.keys();
				while(k.hasNext()) {
					var k1 = k.next();
					_g6.push(k1);
				}
				var keys = _g6;
				var _g15 = [];
				var k2 = vmap.keys();
				while(k2.hasNext()) {
					var k3 = k2.next();
					_g15.push(k3);
				}
				var vkeys = _g15;
				if(keys.length != vkeys.length) {
					status.error = "expected " + keys.length + " keys but they are " + vkeys.length + (status.path == "" ? "" : " for field " + status.path);
					return false;
				}
				var path4 = status.path;
				var _g21 = 0;
				while(_g21 < keys.length) {
					var key = keys[_g21];
					++_g21;
					status.path = path4 == "" ? "hash[" + Std.string(key) + "]" : path4 + "[" + Std.string(key) + "]";
					if(!utest_Assert.sameAs(map.get(key),vmap.get(key),status,approx)) {
						status.error = "expected " + utest_Assert.q(expected) + " but it is " + utest_Assert.q(value) + (status.path == "" ? "" : " for field " + status.path);
						return false;
					}
				}
			}
			return true;
		}
		if(utest_Assert.isIterator(expected,false)) {
			if(status.recursive || status.path == "") {
				var evalues2 = Lambda.array({ iterator : function() {
					return expected;
				}});
				var vvalues2 = Lambda.array({ iterator : function() {
					return value;
				}});
				if(evalues2.length != vvalues2.length) {
					status.error = "expected " + evalues2.length + " values in Iterator but they are " + vvalues2.length + (status.path == "" ? "" : " for field " + status.path);
					return false;
				}
				var path5 = status.path;
				var _g16 = 0;
				var _g7 = evalues2.length;
				while(_g16 < _g7) {
					var i4 = _g16++;
					status.path = path5 == "" ? "iterator[" + i4 + "]" : path5 + "[" + i4 + "]";
					if(!utest_Assert.sameAs(evalues2[i4],vvalues2[i4],status,approx)) {
						status.error = "expected " + utest_Assert.q(expected) + " but it is " + utest_Assert.q(value) + (status.path == "" ? "" : " for field " + status.path);
						return false;
					}
				}
			}
			return true;
		}
		if(utest_Assert.isIterable(expected,false)) {
			if(status.recursive || status.path == "") {
				var evalues3 = Lambda.array(expected);
				var vvalues3 = Lambda.array(value);
				if(evalues3.length != vvalues3.length) {
					status.error = "expected " + evalues3.length + " values in Iterable but they are " + vvalues3.length + (status.path == "" ? "" : " for field " + status.path);
					return false;
				}
				var path6 = status.path;
				var _g17 = 0;
				var _g8 = evalues3.length;
				while(_g17 < _g8) {
					var i5 = _g17++;
					status.path = path6 == "" ? "iterable[" + i5 + "]" : path6 + "[" + i5 + "]";
					if(!utest_Assert.sameAs(evalues3[i5],vvalues3[i5],status,approx)) {
						return false;
					}
				}
			}
			return true;
		}
		if(status.recursive || status.path == "") {
			var o1 = expected;
			var fields1 = Type.getInstanceFields(o1 == null ? null : js_Boot.getClass(o1));
			var path7 = status.path;
			var _g9 = 0;
			while(_g9 < fields1.length) {
				var field1 = fields1[_g9];
				++_g9;
				status.path = path7 == "" ? field1 : path7 + "." + field1;
				var e1 = Reflect.field(expected,field1);
				if(Reflect.isFunction(e1)) {
					continue;
				}
				var v1 = Reflect.field(value,field1);
				if(!utest_Assert.sameAs(e1,v1,status,approx)) {
					return false;
				}
			}
		}
		return true;
	case 7:
		var e2 = _g[2];
		var eexpected = Type.getEnumName(e2);
		var evalue = Type.getEnumName(Type.getEnum(value));
		if(eexpected != evalue) {
			status.error = "expected enumeration of " + utest_Assert.q(eexpected) + " but it is " + utest_Assert.q(evalue) + (status.path == "" ? "" : " for field " + status.path);
			return false;
		}
		if(status.recursive || status.path == "") {
			if(expected[1] != value[1]) {
				status.error = "expected enum constructor " + utest_Assert.q(expected[0]) + " but it is " + utest_Assert.q(value[0]) + (status.path == "" ? "" : " for field " + status.path);
				return false;
			}
			var eparams = expected.slice(2);
			var vparams = value.slice(2);
			var path8 = status.path;
			var _g18 = 0;
			var _g10 = eparams.length;
			while(_g18 < _g10) {
				var i6 = _g18++;
				status.path = path8 == "" ? "enum[" + i6 + "]" : path8 + "[" + i6 + "]";
				if(!utest_Assert.sameAs(eparams[i6],vparams[i6],status,approx)) {
					status.error = "expected enum param " + utest_Assert.q(expected) + " but it is " + utest_Assert.q(value) + (status.path == "" ? "" : " for field " + status.path) + " with " + status.error;
					return false;
				}
			}
		}
		return true;
	case 8:
		throw new js__$Boot_HaxeError("Unable to compare two unknown types");
		break;
	}
};
utest_Assert.q = function(v) {
	if(typeof(v) == "string") {
		return "\"" + StringTools.replace(v,"\"","\\\"") + "\"";
	} else {
		return Std.string(v);
	}
};
utest_Assert.same = function(expected,value,recursive,msg,approx,pos) {
	if(null == approx) {
		approx = 1e-5;
	}
	var status = { recursive : null == recursive ? true : recursive, path : "", error : null};
	if(utest_Assert.sameAs(expected,value,status,approx)) {
		utest_Assert.pass(msg,pos);
	} else {
		utest_Assert.fail(msg == null ? status.error : msg,pos);
	}
};
utest_Assert.pass = function(msg,pos) {
	if(msg == null) {
		msg = "pass expected";
	}
	utest_Assert.isTrue(true,msg,pos);
};
utest_Assert.fail = function(msg,pos) {
	if(msg == null) {
		msg = "failure expected";
	}
	utest_Assert.isTrue(false,msg,pos);
};
utest_Assert.warn = function(msg) {
	utest_Assert.results.add(utest_Assertation.Warning(msg));
};
utest_Assert.createAsync = function(f,timeout) {
	return function() {
	};
};
utest_Assert.createEvent = function(f,timeout) {
	return function(e) {
	};
};
var utest_Assertation = { __ename__ : ["utest","Assertation"], __constructs__ : ["Success","Failure","Error","SetupError","TeardownError","TimeoutError","AsyncError","Warning"] };
utest_Assertation.Success = function(pos) { var $x = ["Success",0,pos]; $x.__enum__ = utest_Assertation; $x.toString = $estr; return $x; };
utest_Assertation.Failure = function(msg,pos) { var $x = ["Failure",1,msg,pos]; $x.__enum__ = utest_Assertation; $x.toString = $estr; return $x; };
utest_Assertation.Error = function(e,stack) { var $x = ["Error",2,e,stack]; $x.__enum__ = utest_Assertation; $x.toString = $estr; return $x; };
utest_Assertation.SetupError = function(e,stack) { var $x = ["SetupError",3,e,stack]; $x.__enum__ = utest_Assertation; $x.toString = $estr; return $x; };
utest_Assertation.TeardownError = function(e,stack) { var $x = ["TeardownError",4,e,stack]; $x.__enum__ = utest_Assertation; $x.toString = $estr; return $x; };
utest_Assertation.TimeoutError = function(missedAsyncs,stack) { var $x = ["TimeoutError",5,missedAsyncs,stack]; $x.__enum__ = utest_Assertation; $x.toString = $estr; return $x; };
utest_Assertation.AsyncError = function(e,stack) { var $x = ["AsyncError",6,e,stack]; $x.__enum__ = utest_Assertation; $x.toString = $estr; return $x; };
utest_Assertation.Warning = function(msg) { var $x = ["Warning",7,msg]; $x.__enum__ = utest_Assertation; $x.toString = $estr; return $x; };
var utest__$Dispatcher_EventException = { __ename__ : ["utest","_Dispatcher","EventException"], __constructs__ : ["StopPropagation"] };
utest__$Dispatcher_EventException.StopPropagation = ["StopPropagation",0];
utest__$Dispatcher_EventException.StopPropagation.toString = $estr;
utest__$Dispatcher_EventException.StopPropagation.__enum__ = utest__$Dispatcher_EventException;
var utest_Dispatcher = function() {
	this.handlers = [];
};
utest_Dispatcher.__name__ = ["utest","Dispatcher"];
utest_Dispatcher.prototype = {
	handlers: null
	,add: function(h) {
		this.handlers.push(h);
		return h;
	}
	,dispatch: function(e) {
		try {
			var list = this.handlers.slice();
			var _g = 0;
			while(_g < list.length) {
				var l = list[_g];
				++_g;
				l(e);
			}
			return true;
		} catch( exc ) {
			haxe_CallStack.lastException = exc;
			if (exc instanceof js__$Boot_HaxeError) exc = exc.val;
			if( js_Boot.__instanceof(exc,utest__$Dispatcher_EventException) ) {
				return false;
			} else throw(exc);
		}
	}
	,__class__: utest_Dispatcher
};
var utest_Notifier = function() {
	this.handlers = [];
};
utest_Notifier.__name__ = ["utest","Notifier"];
utest_Notifier.prototype = {
	handlers: null
	,dispatch: function() {
		try {
			var list = this.handlers.slice();
			var _g = 0;
			while(_g < list.length) {
				var l = list[_g];
				++_g;
				l();
			}
			return true;
		} catch( exc ) {
			haxe_CallStack.lastException = exc;
			if (exc instanceof js__$Boot_HaxeError) exc = exc.val;
			if( js_Boot.__instanceof(exc,utest__$Dispatcher_EventException) ) {
				return false;
			} else throw(exc);
		}
	}
	,__class__: utest_Notifier
};
var utest_Runner = function() {
	this.globalPattern = null;
	this.fixtures = [];
	this.onProgress = new utest_Dispatcher();
	this.onStart = new utest_Dispatcher();
	this.onComplete = new utest_Dispatcher();
	this.onPrecheck = new utest_Dispatcher();
	this.onTestStart = new utest_Dispatcher();
	this.onTestComplete = new utest_Dispatcher();
	this.length = 0;
};
utest_Runner.__name__ = ["utest","Runner"];
utest_Runner.prototype = {
	fixtures: null
	,onProgress: null
	,onStart: null
	,onComplete: null
	,onPrecheck: null
	,onTestStart: null
	,onTestComplete: null
	,length: null
	,globalPattern: null
	,addCase: function(test,setup,teardown,prefix,pattern,setupAsync,teardownAsync) {
		if(teardownAsync == null) {
			teardownAsync = "teardownAsync";
		}
		if(setupAsync == null) {
			setupAsync = "setupAsync";
		}
		if(prefix == null) {
			prefix = "test";
		}
		if(teardown == null) {
			teardown = "teardown";
		}
		if(setup == null) {
			setup = "setup";
		}
		if(!Reflect.isObject(test)) {
			throw new js__$Boot_HaxeError("can't add a null object as a test case");
		}
		if(!this.isMethod(test,setup)) {
			setup = null;
		}
		if(!this.isMethod(test,setupAsync)) {
			setupAsync = null;
		}
		if(!this.isMethod(test,teardown)) {
			teardown = null;
		}
		if(!this.isMethod(test,teardownAsync)) {
			teardownAsync = null;
		}
		var o = test;
		var fields = Type.getInstanceFields(o == null ? null : js_Boot.getClass(o));
		if(this.globalPattern == null && pattern == null) {
			var _g = 0;
			while(_g < fields.length) {
				var field = fields[_g];
				++_g;
				if(!StringTools.startsWith(field,prefix)) {
					continue;
				}
				if(!this.isMethod(test,field)) {
					continue;
				}
				this.addFixture(new utest_TestFixture(test,field,setup,teardown,setupAsync,teardownAsync));
			}
		} else {
			if(this.globalPattern != null) {
				pattern = this.globalPattern;
			} else {
				pattern = pattern;
			}
			var _g1 = 0;
			while(_g1 < fields.length) {
				var field1 = fields[_g1];
				++_g1;
				if(!pattern.match(field1)) {
					continue;
				}
				if(!this.isMethod(test,field1)) {
					continue;
				}
				this.addFixture(new utest_TestFixture(test,field1,setup,teardown,setupAsync,teardownAsync));
			}
		}
	}
	,addFixture: function(fixture) {
		this.fixtures.push(fixture);
		this.length++;
	}
	,isMethod: function(test,name) {
		try {
			return Reflect.isFunction(Reflect.field(test,name));
		} catch( e ) {
			haxe_CallStack.lastException = e;
			return false;
		}
	}
	,pos: null
	,run: function() {
		this.pos = 0;
		this.onStart.dispatch(this);
		this.runNext();
	}
	,runNext: function() {
		if(this.fixtures.length > this.pos) {
			this.runFixture(this.fixtures[this.pos++]);
		} else {
			this.onComplete.dispatch(this);
		}
	}
	,runFixture: function(fixture) {
		var handler = new utest_TestHandler(fixture);
		handler.onComplete.add($bind(this,this.testComplete));
		handler.onPrecheck.add(($_=this.onPrecheck,$bind($_,$_.dispatch)));
		this.onTestStart.dispatch(handler);
		handler.execute();
	}
	,testComplete: function(h) {
		this.onTestComplete.dispatch(h);
		this.onProgress.dispatch({ result : utest_TestResult.ofHandler(h), done : this.pos, totals : this.length});
		this.runNext();
	}
	,__class__: utest_Runner
};
var utest_TestFixture = function(target,method,setup,teardown,setupAsync,teardownAsync) {
	this.target = target;
	this.method = method;
	this.setup = setup;
	this.setupAsync = setupAsync;
	this.teardown = teardown;
	this.teardownAsync = teardownAsync;
};
utest_TestFixture.__name__ = ["utest","TestFixture"];
utest_TestFixture.prototype = {
	target: null
	,method: null
	,setup: null
	,setupAsync: null
	,teardown: null
	,teardownAsync: null
	,__class__: utest_TestFixture
};
var utest_TestHandler = function(fixture) {
	if(fixture == null) {
		throw new js__$Boot_HaxeError("fixture argument is null");
	}
	this.fixture = fixture;
	this.results = new List();
	this.asyncStack = new List();
	this.onTested = new utest_Dispatcher();
	this.onTimeout = new utest_Dispatcher();
	this.onComplete = new utest_Dispatcher();
	this.onPrecheck = new utest_Dispatcher();
};
utest_TestHandler.__name__ = ["utest","TestHandler"];
utest_TestHandler.exceptionStack = function(pops) {
	if(pops == null) {
		pops = 2;
	}
	var stack = haxe_CallStack.exceptionStack();
	while(pops-- > 0) stack.pop();
	return stack;
};
utest_TestHandler.prototype = {
	results: null
	,fixture: null
	,asyncStack: null
	,onTested: null
	,onTimeout: null
	,onComplete: null
	,onPrecheck: null
	,execute: function() {
		try {
			this.executeMethod(this.fixture.setup);
			var f = $bind(this,this.executeAsync);
			var tmp = function() {
				f();
			};
			this.executeAsyncMethod(this.fixture.setupAsync,tmp);
		} catch( e ) {
			haxe_CallStack.lastException = e;
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			this.results.add(utest_Assertation.SetupError(e,utest_TestHandler.exceptionStack()));
			this.executeFinally();
		}
	}
	,executeAsync: function() {
		try {
			this.executeMethod(this.fixture.method);
		} catch( e ) {
			haxe_CallStack.lastException = e;
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			this.results.add(utest_Assertation.Error(e,utest_TestHandler.exceptionStack()));
		}
		this.executeFinally();
	}
	,executeFinally: function() {
		this.onPrecheck.dispatch(this);
		this.checkTested();
	}
	,checkTested: function() {
		if(this.expireson == null || this.asyncStack.length == 0) {
			this.tested();
		} else if(new Date().getTime() / 1000 > this.expireson) {
			this.timeout();
		} else {
			haxe_Timer.delay($bind(this,this.checkTested),10);
		}
	}
	,expireson: null
	,setTimeout: function(timeout) {
		var newexpire = new Date().getTime() / 1000 + timeout / 1000;
		this.expireson = this.expireson == null ? newexpire : newexpire > this.expireson ? newexpire : this.expireson;
	}
	,bindHandler: function() {
		utest_Assert.results = this.results;
		utest_Assert.createAsync = $bind(this,this.addAsync);
		utest_Assert.createEvent = $bind(this,this.addEvent);
	}
	,unbindHandler: function() {
		utest_Assert.results = null;
		utest_Assert.createAsync = function(f,t) {
			return function() {
			};
		};
		utest_Assert.createEvent = function(f1,t1) {
			return function(e) {
			};
		};
	}
	,addAsync: function(f,timeout) {
		if(timeout == null) {
			timeout = 250;
		}
		if(null == f) {
			f = function() {
			};
		}
		this.asyncStack.add(f);
		var handler = this;
		this.setTimeout(timeout);
		return function() {
			if(!handler.asyncStack.remove(f)) {
				handler.results.add(utest_Assertation.AsyncError("async function already executed",[]));
				return;
			}
			try {
				handler.bindHandler();
				f();
			} catch( e ) {
				haxe_CallStack.lastException = e;
				if (e instanceof js__$Boot_HaxeError) e = e.val;
				handler.results.add(utest_Assertation.AsyncError(e,utest_TestHandler.exceptionStack(0)));
			}
		};
	}
	,addEvent: function(f,timeout) {
		if(timeout == null) {
			timeout = 250;
		}
		this.asyncStack.add(f);
		var handler = this;
		this.setTimeout(timeout);
		return function(e) {
			if(!handler.asyncStack.remove(f)) {
				handler.results.add(utest_Assertation.AsyncError("event already executed",[]));
				return;
			}
			try {
				handler.bindHandler();
				f(e);
			} catch( e1 ) {
				haxe_CallStack.lastException = e1;
				if (e1 instanceof js__$Boot_HaxeError) e1 = e1.val;
				handler.results.add(utest_Assertation.AsyncError(e1,utest_TestHandler.exceptionStack(0)));
			}
		};
	}
	,executeMethod: function(name) {
		if(name == null) {
			return;
		}
		this.bindHandler();
		var o = this.fixture.target;
		Reflect.field(this.fixture.target,name).apply(o,[]);
	}
	,executeAsyncMethod: function(name,done) {
		if(name == null) {
			done();
			return;
		}
		this.bindHandler();
		var o = this.fixture.target;
		Reflect.field(this.fixture.target,name).apply(o,[done]);
	}
	,tested: function() {
		if(this.results.length == 0) {
			this.results.add(utest_Assertation.Warning("no assertions"));
		}
		this.onTested.dispatch(this);
		this.completed();
	}
	,timeout: function() {
		this.results.add(utest_Assertation.TimeoutError(this.asyncStack.length,[]));
		this.onTimeout.dispatch(this);
		this.completed();
	}
	,completed: function() {
		try {
			this.executeMethod(this.fixture.teardown);
			var f = $bind(this,this.completedFinally);
			var tmp = function() {
				f();
			};
			this.executeAsyncMethod(this.fixture.teardownAsync,tmp);
		} catch( e ) {
			haxe_CallStack.lastException = e;
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			this.results.add(utest_Assertation.TeardownError(e,utest_TestHandler.exceptionStack(2)));
			this.completedFinally();
		}
	}
	,completedFinally: function() {
		this.unbindHandler();
		this.onComplete.dispatch(this);
	}
	,__class__: utest_TestHandler
};
var utest_TestResult = function() {
};
utest_TestResult.__name__ = ["utest","TestResult"];
utest_TestResult.ofHandler = function(handler) {
	var r = new utest_TestResult();
	var o = handler.fixture.target;
	var path = Type.getClassName(o == null ? null : js_Boot.getClass(o)).split(".");
	r.cls = path.pop();
	r.pack = path.join(".");
	r.method = handler.fixture.method;
	r.setup = handler.fixture.setup;
	r.setupAsync = handler.fixture.setupAsync;
	r.teardown = handler.fixture.teardown;
	r.teardownAsync = handler.fixture.teardownAsync;
	r.assertations = handler.results;
	return r;
};
utest_TestResult.prototype = {
	pack: null
	,cls: null
	,method: null
	,setup: null
	,setupAsync: null
	,teardown: null
	,teardownAsync: null
	,assertations: null
	,allOk: function() {
		var _g_head = this.assertations.h;
		while(_g_head != null) {
			var val = _g_head.item;
			_g_head = _g_head.next;
			var l = val;
			if(l[1] == 0) {
				break;
			} else {
				return false;
			}
		}
		return true;
	}
	,__class__: utest_TestResult
};
var utest_ui_Report = function() { };
utest_ui_Report.__name__ = ["utest","ui","Report"];
utest_ui_Report.create = function(runner,displaySuccessResults,headerDisplayMode) {
	var report;
	if(typeof window != 'undefined') {
		report = new utest_ui_text_HtmlReport(runner,null,true);
	} else {
		report = new utest_ui_text_PrintReport(runner);
	}
	if(null == displaySuccessResults) {
		report.displaySuccessResults = utest_ui_common_SuccessResultsDisplayMode.ShowSuccessResultsWithNoErrors;
	} else {
		report.displaySuccessResults = displaySuccessResults;
	}
	if(null == headerDisplayMode) {
		report.displayHeader = utest_ui_common_HeaderDisplayMode.ShowHeaderWithResults;
	} else {
		report.displayHeader = headerDisplayMode;
	}
	return report;
};
var utest_ui_common_ClassResult = function(className,setupName,teardownName) {
	this.fixtures = new haxe_ds_StringMap();
	this.className = className;
	this.setupName = setupName;
	this.hasSetup = setupName != null;
	this.teardownName = teardownName;
	this.hasTeardown = teardownName != null;
	this.methods = 0;
	this.stats = new utest_ui_common_ResultStats();
};
utest_ui_common_ClassResult.__name__ = ["utest","ui","common","ClassResult"];
utest_ui_common_ClassResult.prototype = {
	fixtures: null
	,className: null
	,setupName: null
	,teardownName: null
	,hasSetup: null
	,hasTeardown: null
	,methods: null
	,stats: null
	,add: function(result) {
		var key = result.methodName;
		var _this = this.fixtures;
		if(__map_reserved[key] != null ? _this.existsReserved(key) : _this.h.hasOwnProperty(key)) {
			throw new js__$Boot_HaxeError("invalid duplicated fixture: " + this.className + "." + result.methodName);
		}
		this.stats.wire(result.stats);
		this.methods++;
		var key1 = result.methodName;
		var _this1 = this.fixtures;
		if(__map_reserved[key1] != null) {
			_this1.setReserved(key1,result);
		} else {
			_this1.h[key1] = result;
		}
	}
	,get: function(method) {
		var _this = this.fixtures;
		if(__map_reserved[method] != null) {
			return _this.getReserved(method);
		} else {
			return _this.h[method];
		}
	}
	,methodNames: function(errorsHavePriority) {
		if(errorsHavePriority == null) {
			errorsHavePriority = true;
		}
		var names = [];
		var name = this.fixtures.keys();
		while(name.hasNext()) {
			var name1 = name.next();
			names.push(name1);
		}
		if(errorsHavePriority) {
			var me = this;
			names.sort(function(a,b) {
				var $as = me.get(a).stats;
				var bs = me.get(b).stats;
				if($as.hasErrors) {
					if(!bs.hasErrors) {
						return -1;
					} else if($as.errors == bs.errors) {
						return Reflect.compare(a,b);
					} else {
						return Reflect.compare($as.errors,bs.errors);
					}
				} else if(bs.hasErrors) {
					return 1;
				} else if($as.hasFailures) {
					if(!bs.hasFailures) {
						return -1;
					} else if($as.failures == bs.failures) {
						return Reflect.compare(a,b);
					} else {
						return Reflect.compare($as.failures,bs.failures);
					}
				} else if(bs.hasFailures) {
					return 1;
				} else if($as.hasWarnings) {
					if(!bs.hasWarnings) {
						return -1;
					} else if($as.warnings == bs.warnings) {
						return Reflect.compare(a,b);
					} else {
						return Reflect.compare($as.warnings,bs.warnings);
					}
				} else if(bs.hasWarnings) {
					return 1;
				} else {
					return Reflect.compare(a,b);
				}
			});
		} else {
			names.sort(function(a1,b1) {
				return Reflect.compare(a1,b1);
			});
		}
		return names;
	}
	,__class__: utest_ui_common_ClassResult
};
var utest_ui_common_FixtureResult = function(methodName) {
	this.methodName = methodName;
	this.list = new List();
	this.hasTestError = false;
	this.hasSetupError = false;
	this.hasTeardownError = false;
	this.hasTimeoutError = false;
	this.hasAsyncError = false;
	this.stats = new utest_ui_common_ResultStats();
};
utest_ui_common_FixtureResult.__name__ = ["utest","ui","common","FixtureResult"];
utest_ui_common_FixtureResult.prototype = {
	methodName: null
	,hasTestError: null
	,hasSetupError: null
	,hasTeardownError: null
	,hasTimeoutError: null
	,hasAsyncError: null
	,stats: null
	,list: null
	,iterator: function() {
		return new _$List_ListIterator(this.list.h);
	}
	,add: function(assertation) {
		this.list.add(assertation);
		switch(assertation[1]) {
		case 0:
			this.stats.addSuccesses(1);
			break;
		case 1:
			this.stats.addFailures(1);
			break;
		case 2:
			this.stats.addErrors(1);
			break;
		case 3:
			this.stats.addErrors(1);
			this.hasSetupError = true;
			break;
		case 4:
			this.stats.addErrors(1);
			this.hasTeardownError = true;
			break;
		case 5:
			this.stats.addErrors(1);
			this.hasTimeoutError = true;
			break;
		case 6:
			this.stats.addErrors(1);
			this.hasAsyncError = true;
			break;
		case 7:
			this.stats.addWarnings(1);
			break;
		}
	}
	,__class__: utest_ui_common_FixtureResult
};
var utest_ui_common_HeaderDisplayMode = { __ename__ : ["utest","ui","common","HeaderDisplayMode"], __constructs__ : ["AlwaysShowHeader","NeverShowHeader","ShowHeaderWithResults"] };
utest_ui_common_HeaderDisplayMode.AlwaysShowHeader = ["AlwaysShowHeader",0];
utest_ui_common_HeaderDisplayMode.AlwaysShowHeader.toString = $estr;
utest_ui_common_HeaderDisplayMode.AlwaysShowHeader.__enum__ = utest_ui_common_HeaderDisplayMode;
utest_ui_common_HeaderDisplayMode.NeverShowHeader = ["NeverShowHeader",1];
utest_ui_common_HeaderDisplayMode.NeverShowHeader.toString = $estr;
utest_ui_common_HeaderDisplayMode.NeverShowHeader.__enum__ = utest_ui_common_HeaderDisplayMode;
utest_ui_common_HeaderDisplayMode.ShowHeaderWithResults = ["ShowHeaderWithResults",2];
utest_ui_common_HeaderDisplayMode.ShowHeaderWithResults.toString = $estr;
utest_ui_common_HeaderDisplayMode.ShowHeaderWithResults.__enum__ = utest_ui_common_HeaderDisplayMode;
var utest_ui_common_SuccessResultsDisplayMode = { __ename__ : ["utest","ui","common","SuccessResultsDisplayMode"], __constructs__ : ["AlwaysShowSuccessResults","NeverShowSuccessResults","ShowSuccessResultsWithNoErrors"] };
utest_ui_common_SuccessResultsDisplayMode.AlwaysShowSuccessResults = ["AlwaysShowSuccessResults",0];
utest_ui_common_SuccessResultsDisplayMode.AlwaysShowSuccessResults.toString = $estr;
utest_ui_common_SuccessResultsDisplayMode.AlwaysShowSuccessResults.__enum__ = utest_ui_common_SuccessResultsDisplayMode;
utest_ui_common_SuccessResultsDisplayMode.NeverShowSuccessResults = ["NeverShowSuccessResults",1];
utest_ui_common_SuccessResultsDisplayMode.NeverShowSuccessResults.toString = $estr;
utest_ui_common_SuccessResultsDisplayMode.NeverShowSuccessResults.__enum__ = utest_ui_common_SuccessResultsDisplayMode;
utest_ui_common_SuccessResultsDisplayMode.ShowSuccessResultsWithNoErrors = ["ShowSuccessResultsWithNoErrors",2];
utest_ui_common_SuccessResultsDisplayMode.ShowSuccessResultsWithNoErrors.toString = $estr;
utest_ui_common_SuccessResultsDisplayMode.ShowSuccessResultsWithNoErrors.__enum__ = utest_ui_common_SuccessResultsDisplayMode;
var utest_ui_common_IReport = function() { };
utest_ui_common_IReport.__name__ = ["utest","ui","common","IReport"];
utest_ui_common_IReport.prototype = {
	displaySuccessResults: null
	,displayHeader: null
	,__class__: utest_ui_common_IReport
};
var utest_ui_common_PackageResult = function(packageName) {
	this.packageName = packageName;
	this.classes = new haxe_ds_StringMap();
	this.packages = new haxe_ds_StringMap();
	this.stats = new utest_ui_common_ResultStats();
};
utest_ui_common_PackageResult.__name__ = ["utest","ui","common","PackageResult"];
utest_ui_common_PackageResult.prototype = {
	packageName: null
	,classes: null
	,packages: null
	,stats: null
	,addResult: function(result,flattenPackage) {
		var pack = this.getOrCreatePackage(result.pack,flattenPackage,this);
		var cls = this.getOrCreateClass(pack,result.cls,result.setup,result.teardown);
		var fix = this.createFixture(result.method,result.assertations);
		cls.add(fix);
	}
	,addClass: function(result) {
		var key = result.className;
		var _this = this.classes;
		if(__map_reserved[key] != null) {
			_this.setReserved(key,result);
		} else {
			_this.h[key] = result;
		}
		this.stats.wire(result.stats);
	}
	,addPackage: function(result) {
		var key = result.packageName;
		var _this = this.packages;
		if(__map_reserved[key] != null) {
			_this.setReserved(key,result);
		} else {
			_this.h[key] = result;
		}
		this.stats.wire(result.stats);
	}
	,existsPackage: function(name) {
		var _this = this.packages;
		if(__map_reserved[name] != null) {
			return _this.existsReserved(name);
		} else {
			return _this.h.hasOwnProperty(name);
		}
	}
	,existsClass: function(name) {
		var _this = this.classes;
		if(__map_reserved[name] != null) {
			return _this.existsReserved(name);
		} else {
			return _this.h.hasOwnProperty(name);
		}
	}
	,getPackage: function(name) {
		if(this.packageName == null && name == "") {
			return this;
		}
		var _this = this.packages;
		if(__map_reserved[name] != null) {
			return _this.getReserved(name);
		} else {
			return _this.h[name];
		}
	}
	,getClass: function(name) {
		var _this = this.classes;
		if(__map_reserved[name] != null) {
			return _this.getReserved(name);
		} else {
			return _this.h[name];
		}
	}
	,classNames: function(errorsHavePriority) {
		if(errorsHavePriority == null) {
			errorsHavePriority = true;
		}
		var names = [];
		var name = this.classes.keys();
		while(name.hasNext()) {
			var name1 = name.next();
			names.push(name1);
		}
		if(errorsHavePriority) {
			var me = this;
			names.sort(function(a,b) {
				var $as = me.getClass(a).stats;
				var bs = me.getClass(b).stats;
				if($as.hasErrors) {
					if(!bs.hasErrors) {
						return -1;
					} else if($as.errors == bs.errors) {
						return Reflect.compare(a,b);
					} else {
						return Reflect.compare($as.errors,bs.errors);
					}
				} else if(bs.hasErrors) {
					return 1;
				} else if($as.hasFailures) {
					if(!bs.hasFailures) {
						return -1;
					} else if($as.failures == bs.failures) {
						return Reflect.compare(a,b);
					} else {
						return Reflect.compare($as.failures,bs.failures);
					}
				} else if(bs.hasFailures) {
					return 1;
				} else if($as.hasWarnings) {
					if(!bs.hasWarnings) {
						return -1;
					} else if($as.warnings == bs.warnings) {
						return Reflect.compare(a,b);
					} else {
						return Reflect.compare($as.warnings,bs.warnings);
					}
				} else if(bs.hasWarnings) {
					return 1;
				} else {
					return Reflect.compare(a,b);
				}
			});
		} else {
			names.sort(function(a1,b1) {
				return Reflect.compare(a1,b1);
			});
		}
		return names;
	}
	,packageNames: function(errorsHavePriority) {
		if(errorsHavePriority == null) {
			errorsHavePriority = true;
		}
		var names = [];
		if(this.packageName == null) {
			names.push("");
		}
		var name = this.packages.keys();
		while(name.hasNext()) {
			var name1 = name.next();
			names.push(name1);
		}
		if(errorsHavePriority) {
			var me = this;
			names.sort(function(a,b) {
				var $as = me.getPackage(a).stats;
				var bs = me.getPackage(b).stats;
				if($as.hasErrors) {
					if(!bs.hasErrors) {
						return -1;
					} else if($as.errors == bs.errors) {
						return Reflect.compare(a,b);
					} else {
						return Reflect.compare($as.errors,bs.errors);
					}
				} else if(bs.hasErrors) {
					return 1;
				} else if($as.hasFailures) {
					if(!bs.hasFailures) {
						return -1;
					} else if($as.failures == bs.failures) {
						return Reflect.compare(a,b);
					} else {
						return Reflect.compare($as.failures,bs.failures);
					}
				} else if(bs.hasFailures) {
					return 1;
				} else if($as.hasWarnings) {
					if(!bs.hasWarnings) {
						return -1;
					} else if($as.warnings == bs.warnings) {
						return Reflect.compare(a,b);
					} else {
						return Reflect.compare($as.warnings,bs.warnings);
					}
				} else if(bs.hasWarnings) {
					return 1;
				} else {
					return Reflect.compare(a,b);
				}
			});
		} else {
			names.sort(function(a1,b1) {
				return Reflect.compare(a1,b1);
			});
		}
		return names;
	}
	,createFixture: function(method,assertations) {
		var f = new utest_ui_common_FixtureResult(method);
		var assertation = $iterator(assertations)();
		while(assertation.hasNext()) {
			var assertation1 = assertation.next();
			f.add(assertation1);
		}
		return f;
	}
	,getOrCreateClass: function(pack,cls,setup,teardown) {
		if(pack.existsClass(cls)) {
			return pack.getClass(cls);
		}
		var c = new utest_ui_common_ClassResult(cls,setup,teardown);
		pack.addClass(c);
		return c;
	}
	,getOrCreatePackage: function(pack,flat,ref) {
		if(pack == null || pack == "") {
			return ref;
		}
		if(flat) {
			if(ref.existsPackage(pack)) {
				return ref.getPackage(pack);
			}
			var p = new utest_ui_common_PackageResult(pack);
			ref.addPackage(p);
			return p;
		} else {
			var parts = pack.split(".");
			var _g = 0;
			while(_g < parts.length) {
				var part = parts[_g];
				++_g;
				ref = this.getOrCreatePackage(part,true,ref);
			}
			return ref;
		}
	}
	,__class__: utest_ui_common_PackageResult
};
var utest_ui_common_ReportTools = function() { };
utest_ui_common_ReportTools.__name__ = ["utest","ui","common","ReportTools"];
utest_ui_common_ReportTools.hasHeader = function(report,stats) {
	var _g = report.displayHeader;
	switch(_g[1]) {
	case 0:
		return true;
	case 1:
		return false;
	case 2:
		if(!stats.isOk) {
			return true;
		}
		var _g1 = report.displaySuccessResults;
		switch(_g1[1]) {
		case 0:case 2:
			return true;
		case 1:
			return false;
		}
		break;
	}
};
utest_ui_common_ReportTools.skipResult = function(report,stats,isOk) {
	if(!stats.isOk) {
		return false;
	}
	var _g = report.displaySuccessResults;
	switch(_g[1]) {
	case 0:
		return false;
	case 1:
		return true;
	case 2:
		return !isOk;
	}
};
utest_ui_common_ReportTools.hasOutput = function(report,stats) {
	if(!stats.isOk) {
		return true;
	}
	return utest_ui_common_ReportTools.hasHeader(report,stats);
};
var utest_ui_common_ResultAggregator = function(runner,flattenPackage) {
	if(flattenPackage == null) {
		flattenPackage = false;
	}
	if(runner == null) {
		throw new js__$Boot_HaxeError("runner argument is null");
	}
	this.flattenPackage = flattenPackage;
	this.runner = runner;
	runner.onStart.add($bind(this,this.start));
	runner.onProgress.add($bind(this,this.progress));
	runner.onComplete.add($bind(this,this.complete));
	this.onStart = new utest_Notifier();
	this.onComplete = new utest_Dispatcher();
	this.onProgress = new utest_Dispatcher();
};
utest_ui_common_ResultAggregator.__name__ = ["utest","ui","common","ResultAggregator"];
utest_ui_common_ResultAggregator.prototype = {
	runner: null
	,flattenPackage: null
	,root: null
	,onStart: null
	,onComplete: null
	,onProgress: null
	,start: function(runner) {
		this.root = new utest_ui_common_PackageResult(null);
		this.onStart.dispatch();
	}
	,progress: function(e) {
		this.root.addResult(e.result,this.flattenPackage);
		this.onProgress.dispatch(e);
	}
	,complete: function(runner) {
		this.onComplete.dispatch(this.root);
	}
	,__class__: utest_ui_common_ResultAggregator
};
var utest_ui_common_ResultStats = function() {
	this.assertations = 0;
	this.successes = 0;
	this.failures = 0;
	this.errors = 0;
	this.warnings = 0;
	this.isOk = true;
	this.hasFailures = false;
	this.hasErrors = false;
	this.hasWarnings = false;
	this.onAddSuccesses = new utest_Dispatcher();
	this.onAddFailures = new utest_Dispatcher();
	this.onAddErrors = new utest_Dispatcher();
	this.onAddWarnings = new utest_Dispatcher();
};
utest_ui_common_ResultStats.__name__ = ["utest","ui","common","ResultStats"];
utest_ui_common_ResultStats.prototype = {
	assertations: null
	,successes: null
	,failures: null
	,errors: null
	,warnings: null
	,onAddSuccesses: null
	,onAddFailures: null
	,onAddErrors: null
	,onAddWarnings: null
	,isOk: null
	,hasFailures: null
	,hasErrors: null
	,hasWarnings: null
	,addSuccesses: function(v) {
		if(v == 0) {
			return;
		}
		this.assertations += v;
		this.successes += v;
		this.onAddSuccesses.dispatch(v);
	}
	,addFailures: function(v) {
		if(v == 0) {
			return;
		}
		this.assertations += v;
		this.failures += v;
		this.hasFailures = this.failures > 0;
		this.isOk = !(this.hasFailures || this.hasErrors || this.hasWarnings);
		this.onAddFailures.dispatch(v);
	}
	,addErrors: function(v) {
		if(v == 0) {
			return;
		}
		this.assertations += v;
		this.errors += v;
		this.hasErrors = this.errors > 0;
		this.isOk = !(this.hasFailures || this.hasErrors || this.hasWarnings);
		this.onAddErrors.dispatch(v);
	}
	,addWarnings: function(v) {
		if(v == 0) {
			return;
		}
		this.assertations += v;
		this.warnings += v;
		this.hasWarnings = this.warnings > 0;
		this.isOk = !(this.hasFailures || this.hasErrors || this.hasWarnings);
		this.onAddWarnings.dispatch(v);
	}
	,sum: function(other) {
		this.addSuccesses(other.successes);
		this.addFailures(other.failures);
		this.addErrors(other.errors);
		this.addWarnings(other.warnings);
	}
	,wire: function(dependant) {
		dependant.onAddSuccesses.add($bind(this,this.addSuccesses));
		dependant.onAddFailures.add($bind(this,this.addFailures));
		dependant.onAddErrors.add($bind(this,this.addErrors));
		dependant.onAddWarnings.add($bind(this,this.addWarnings));
		this.sum(dependant);
	}
	,__class__: utest_ui_common_ResultStats
};
var utest_ui_text_HtmlReport = function(runner,outputHandler,traceRedirected) {
	if(traceRedirected == null) {
		traceRedirected = true;
	}
	this.aggregator = new utest_ui_common_ResultAggregator(runner,true);
	runner.onStart.add($bind(this,this.start));
	this.aggregator.onComplete.add($bind(this,this.complete));
	if(null == outputHandler) {
		this.setHandler($bind(this,this._handler));
	} else {
		this.setHandler(outputHandler);
	}
	if(traceRedirected) {
		this.redirectTrace();
	}
	this.displaySuccessResults = utest_ui_common_SuccessResultsDisplayMode.AlwaysShowSuccessResults;
	this.displayHeader = utest_ui_common_HeaderDisplayMode.AlwaysShowHeader;
};
utest_ui_text_HtmlReport.__name__ = ["utest","ui","text","HtmlReport"];
utest_ui_text_HtmlReport.__interfaces__ = [utest_ui_common_IReport];
utest_ui_text_HtmlReport.prototype = {
	traceRedirected: null
	,displaySuccessResults: null
	,displayHeader: null
	,handler: null
	,aggregator: null
	,oldTrace: null
	,_traces: null
	,setHandler: function(handler) {
		this.handler = handler;
	}
	,redirectTrace: function() {
		if(this.traceRedirected) {
			return;
		}
		this._traces = [];
		this.oldTrace = haxe_Log.trace;
		haxe_Log.trace = $bind(this,this._trace);
	}
	,restoreTrace: function() {
		if(!this.traceRedirected) {
			return;
		}
		haxe_Log.trace = this.oldTrace;
	}
	,_traceTime: null
	,_trace: function(v,infos) {
		var time = new Date().getTime() / 1000;
		var delta = this._traceTime == null ? 0 : time - this._traceTime;
		this._traces.push({ msg : StringTools.htmlEscape(Std.string(v)), infos : infos, time : time - this.startTime, delta : delta, stack : haxe_CallStack.callStack()});
		this._traceTime = new Date().getTime() / 1000;
	}
	,startTime: null
	,start: function(e) {
		this.startTime = new Date().getTime() / 1000;
	}
	,cls: function(stats) {
		if(stats.hasErrors) {
			return "error";
		} else if(stats.hasFailures) {
			return "failure";
		} else if(stats.hasWarnings) {
			return "warn";
		} else {
			return "ok";
		}
	}
	,resultNumbers: function(buf,stats) {
		var numbers = [];
		if(stats.assertations == 1) {
			numbers.push("<strong>1</strong> test");
		} else {
			numbers.push("<strong>" + stats.assertations + "</strong> tests");
		}
		if(stats.successes != stats.assertations) {
			if(stats.successes == 1) {
				numbers.push("<strong>1</strong> pass");
			} else if(stats.successes > 0) {
				numbers.push("<strong>" + stats.successes + "</strong> passes");
			}
		}
		if(stats.errors == 1) {
			numbers.push("<strong>1</strong> error");
		} else if(stats.errors > 0) {
			numbers.push("<strong>" + stats.errors + "</strong> errors");
		}
		if(stats.failures == 1) {
			numbers.push("<strong>1</strong> failure");
		} else if(stats.failures > 0) {
			numbers.push("<strong>" + stats.failures + "</strong> failures");
		}
		if(stats.warnings == 1) {
			numbers.push("<strong>1</strong> warning");
		} else if(stats.warnings > 0) {
			numbers.push("<strong>" + stats.warnings + "</strong> warnings");
		}
		var x = numbers.join(", ");
		buf.b += Std.string(x);
	}
	,blockNumbers: function(buf,stats) {
		var x = "<div class=\"" + this.cls(stats) + "bg statnumbers\">";
		buf.b += Std.string(x);
		this.resultNumbers(buf,stats);
		buf.b += "</div>";
	}
	,formatStack: function(stack,addNL) {
		if(addNL == null) {
			addNL = true;
		}
		var parts = [];
		var nl = addNL ? "\n" : "";
		var last = null;
		var count = 1;
		var _g = 0;
		var _g1 = haxe_CallStack.toString(stack).split("\n");
		while(_g < _g1.length) {
			var part = _g1[_g];
			++_g;
			if(StringTools.trim(part) == "") {
				continue;
			}
			if(-1 < part.indexOf("Called from utest.")) {
				continue;
			}
			if(part == last) {
				parts[parts.length - 1] = part + " (#" + ++count + ")";
			} else {
				count = 1;
				last = part;
				parts.push(last);
			}
		}
		var s = "<ul><li>" + parts.join("</li>" + nl + "<li>") + "</li></ul>" + nl;
		return "<div>" + s + "</div>" + nl;
	}
	,addFixture: function(buf,result,name,isOk) {
		if(utest_ui_common_ReportTools.skipResult(this,result.stats,isOk)) {
			return;
		}
		buf.b += "<li class=\"fixture\"><div class=\"li\">";
		var x = "<span class=\"" + this.cls(result.stats) + "bg fixtureresult\">";
		buf.b += Std.string(x);
		if(result.stats.isOk) {
			buf.b += "OK ";
		} else if(result.stats.hasErrors) {
			buf.b += "ERROR ";
		} else if(result.stats.hasFailures) {
			buf.b += "FAILURE ";
		} else if(result.stats.hasWarnings) {
			buf.b += "WARNING ";
		}
		buf.b += "</span>";
		buf.b += "<div class=\"fixturedetails\">";
		buf.b += Std.string("<strong>" + name + "</strong>");
		buf.b += ": ";
		this.resultNumbers(buf,result.stats);
		var messages = [];
		var _g = result.iterator();
		while(_g.head != null) {
			var val = _g.head.item;
			_g.head = _g.head.next;
			var assertation = val;
			switch(assertation[1]) {
			case 0:
				break;
			case 1:
				var pos = assertation[3];
				var msg = assertation[2];
				messages.push("<strong>line " + pos.lineNumber + "</strong>: <em>" + StringTools.htmlEscape(msg) + "</em>");
				break;
			case 2:
				var s = assertation[3];
				var e = assertation[2];
				messages.push("<strong>error</strong>: <em>" + this.getErrorDescription(e) + "</em>\n<br/><strong>stack</strong>:" + this.getErrorStack(s,e));
				break;
			case 3:
				var s1 = assertation[3];
				var e1 = assertation[2];
				messages.push("<strong>setup error</strong>: " + this.getErrorDescription(e1) + "\n<br/><strong>stack</strong>:" + this.getErrorStack(s1,e1));
				break;
			case 4:
				var s2 = assertation[3];
				var e2 = assertation[2];
				messages.push("<strong>tear-down error</strong>: " + this.getErrorDescription(e2) + "\n<br/><strong>stack</strong>:" + this.getErrorStack(s2,e2));
				break;
			case 5:
				var missedAsyncs = assertation[2];
				messages.push("<strong>missed async call(s)</strong>: " + missedAsyncs);
				break;
			case 6:
				var s3 = assertation[3];
				var e3 = assertation[2];
				messages.push("<strong>async error</strong>: " + this.getErrorDescription(e3) + "\n<br/><strong>stack</strong>:" + this.getErrorStack(s3,e3));
				break;
			case 7:
				var msg1 = assertation[2];
				messages.push(StringTools.htmlEscape(msg1));
				break;
			}
		}
		if(messages.length > 0) {
			buf.b += "<div class=\"testoutput\">";
			var x1 = messages.join("<br/>");
			buf.b += Std.string(x1);
			buf.b += "</div>\n";
		}
		buf.b += "</div>\n";
		buf.b += "</div></li>\n";
	}
	,getErrorDescription: function(e) {
		return Std.string(e);
	}
	,getErrorStack: function(s,e) {
		return this.formatStack(s);
	}
	,addClass: function(buf,result,name,isOk) {
		if(utest_ui_common_ReportTools.skipResult(this,result.stats,isOk)) {
			return;
		}
		buf.b += "<li>";
		buf.b += Std.string("<h2 class=\"classname\">" + name + "</h2>");
		this.blockNumbers(buf,result.stats);
		buf.b += "<ul>\n";
		var _g = 0;
		var _g1 = result.methodNames();
		while(_g < _g1.length) {
			var mname = _g1[_g];
			++_g;
			this.addFixture(buf,result.get(mname),mname,isOk);
		}
		buf.b += "</ul>\n";
		buf.b += "</li>\n";
	}
	,addPackages: function(buf,result,isOk) {
		if(utest_ui_common_ReportTools.skipResult(this,result.stats,isOk)) {
			return;
		}
		buf.b += "<ul id=\"utest-results-packages\">\n";
		var _g = 0;
		var _g1 = result.packageNames(false);
		while(_g < _g1.length) {
			var name = _g1[_g];
			++_g;
			this.addPackage(buf,result.getPackage(name),name,isOk);
		}
		buf.b += "</ul>\n";
	}
	,addPackage: function(buf,result,name,isOk) {
		if(utest_ui_common_ReportTools.skipResult(this,result.stats,isOk)) {
			return;
		}
		if(name == "" && result.classNames().length == 0) {
			return;
		}
		buf.b += "<li>";
		buf.b += Std.string("<h2>" + name + "</h2>");
		this.blockNumbers(buf,result.stats);
		buf.b += "<ul>\n";
		var _g = 0;
		var _g1 = result.classNames();
		while(_g < _g1.length) {
			var cname = _g1[_g];
			++_g;
			this.addClass(buf,result.getClass(cname),cname,isOk);
		}
		buf.b += "</ul>\n";
		buf.b += "</li>\n";
	}
	,getTextResults: function() {
		var newline = "\n";
		var indents = function(count) {
			var _g = [];
			var _g2 = 0;
			var _g1 = count;
			while(_g2 < _g1) {
				var i = _g2++;
				_g.push("  ");
			}
			return _g.join("");
		};
		var dumpStack = function(stack) {
			if(stack.length == 0) {
				return "";
			}
			var parts = haxe_CallStack.toString(stack).split("\n");
			var r = [];
			var _g3 = 0;
			while(_g3 < parts.length) {
				var part = parts[_g3];
				++_g3;
				if(part.indexOf(" utest.") >= 0) {
					continue;
				}
				r.push(part);
			}
			return r.join(newline);
		};
		var buf_b = "";
		var _g4 = 0;
		var _g11 = this.result.packageNames();
		while(_g4 < _g11.length) {
			var pname = _g11[_g4];
			++_g4;
			var pack = this.result.getPackage(pname);
			if(utest_ui_common_ReportTools.skipResult(this,pack.stats,this.result.stats.isOk)) {
				continue;
			}
			var _g21 = 0;
			var _g31 = pack.classNames();
			while(_g21 < _g31.length) {
				var cname = _g31[_g21];
				++_g21;
				var cls = pack.getClass(cname);
				if(utest_ui_common_ReportTools.skipResult(this,cls.stats,this.result.stats.isOk)) {
					continue;
				}
				buf_b += Std.string((pname == "" ? "" : pname + ".") + cname + newline);
				var _g41 = 0;
				var _g5 = cls.methodNames();
				while(_g41 < _g5.length) {
					var mname = _g5[_g41];
					++_g41;
					var fix = cls.get(mname);
					if(utest_ui_common_ReportTools.skipResult(this,fix.stats,this.result.stats.isOk)) {
						continue;
					}
					buf_b += Std.string(indents(1) + mname + ": ");
					if(fix.stats.isOk) {
						buf_b += "OK ";
					} else if(fix.stats.hasErrors) {
						buf_b += "ERROR ";
					} else if(fix.stats.hasFailures) {
						buf_b += "FAILURE ";
					} else if(fix.stats.hasWarnings) {
						buf_b += "WARNING ";
					}
					var messages = "";
					var _g6 = fix.iterator();
					while(_g6.head != null) {
						var val = _g6.head.item;
						_g6.head = _g6.head.next;
						var assertation = val;
						switch(assertation[1]) {
						case 0:
							buf_b += ".";
							break;
						case 1:
							var pos = assertation[3];
							var msg = assertation[2];
							buf_b += "F";
							messages += indents(2) + "line: " + pos.lineNumber + ", " + msg + newline;
							break;
						case 2:
							var s = assertation[3];
							var e = assertation[2];
							buf_b += "E";
							messages += indents(2) + Std.string(e) + dumpStack(s) + newline;
							break;
						case 3:
							var s1 = assertation[3];
							var e1 = assertation[2];
							buf_b += "S";
							messages += indents(2) + Std.string(e1) + dumpStack(s1) + newline;
							break;
						case 4:
							var s2 = assertation[3];
							var e2 = assertation[2];
							buf_b += "T";
							messages += indents(2) + Std.string(e2) + dumpStack(s2) + newline;
							break;
						case 5:
							var s3 = assertation[3];
							var missedAsyncs = assertation[2];
							buf_b += "O";
							messages += indents(2) + "missed async calls: " + missedAsyncs + dumpStack(s3) + newline;
							break;
						case 6:
							var s4 = assertation[3];
							var e3 = assertation[2];
							buf_b += "A";
							messages += indents(2) + Std.string(e3) + dumpStack(s4) + newline;
							break;
						case 7:
							var msg1 = assertation[2];
							buf_b += "W";
							messages += indents(2) + msg1 + newline;
							break;
						}
					}
					buf_b += newline == null ? "null" : "" + newline;
					buf_b += messages == null ? "null" : "" + messages;
				}
			}
		}
		return buf_b;
	}
	,getHeader: function() {
		var buf = new StringBuf();
		if(!utest_ui_common_ReportTools.hasHeader(this,this.result.stats)) {
			return "";
		}
		var end = new Date().getTime() / 1000;
		var time = ((end - this.startTime) * 1000 | 0) / 1000;
		var msg = "TEST OK";
		if(this.result.stats.hasErrors) {
			msg = "TEST ERRORS";
		} else if(this.result.stats.hasFailures) {
			msg = "TEST FAILED";
		} else if(this.result.stats.hasWarnings) {
			msg = "WARNING REPORTED";
		}
		var x = "<h1 class=\"" + this.cls(this.result.stats) + "bg header\">" + msg + "</h1>\n";
		buf.b += Std.string(x);
		buf.b += "<div class=\"headerinfo\">";
		this.resultNumbers(buf,this.result.stats);
		buf.b += Std.string(" performed on <strong>" + utest_ui_text_HtmlReport.platform + "</strong>, executed in <strong> " + time + " sec. </strong></div >\n ");
		return buf.b;
	}
	,getTrace: function() {
		var buf_b = "";
		if(this._traces == null || this._traces.length == 0) {
			return "";
		}
		buf_b += "<div class=\"trace\"><h2>traces</h2><ol>";
		var _g = 0;
		var _g1 = this._traces;
		while(_g < _g1.length) {
			var t = _g1[_g];
			++_g;
			buf_b += "<li><div class=\"li\">";
			var stack = StringTools.replace(this.formatStack(t.stack,false),"'","\\'");
			var method = "<span class=\"tracepackage\">" + t.infos.className + "</span><br/>" + t.infos.methodName + "(" + t.infos.lineNumber + ")";
			buf_b += Std.string("<span class=\"tracepos\" onmouseover=\"utestTooltip(this.parentNode, '" + stack + "')\" onmouseout=\"utestRemoveTooltip()\">");
			buf_b += method == null ? "null" : "" + method;
			buf_b += "</span><span class=\"tracetime\">";
			buf_b += Std.string("@ " + this.formatTime(t.time));
			if(Math.round(t.delta * 1000) > 0) {
				buf_b += Std.string(", ~" + this.formatTime(t.delta));
			}
			buf_b += "</span><span class=\"tracemsg\">";
			buf_b += Std.string(StringTools.replace(StringTools.trim(t.msg),"\n","<br/>\n"));
			buf_b += "</span><div class=\"clr\"></div></div></li>";
		}
		buf_b += "</ol></div>";
		return buf_b;
	}
	,getResults: function() {
		var buf = new StringBuf();
		this.addPackages(buf,this.result,this.result.stats.isOk);
		return buf.b;
	}
	,getAll: function() {
		if(!utest_ui_common_ReportTools.hasOutput(this,this.result.stats)) {
			return "";
		} else {
			return this.getHeader() + this.getTrace() + this.getResults();
		}
	}
	,getHtml: function(title) {
		if(null == title) {
			title = "utest: " + utest_ui_text_HtmlReport.platform;
		}
		var s = this.getAll();
		if("" == s) {
			return "";
		} else {
			return this.wrapHtml(title,s);
		}
	}
	,result: null
	,complete: function(result) {
		this.result = result;
		this.handler(this);
		this.restoreTrace();
		var exposedResult = { isOk : result.stats.isOk, message : this.getTextResults()};
		if('undefined' != typeof window) {
			window.utest_result = exposedResult;
		}
	}
	,formatTime: function(t) {
		return Math.round(t * 1000) + " ms";
	}
	,cssStyle: function() {
		return "body, dd, dt {\n  font-family: Verdana, Arial, Sans-serif;\n  font-size: 12px;\n}\ndl {\n  width: 180px;\n}\ndd, dt {\n  margin : 0;\n  padding : 2px 5px;\n  border-top: 1px solid #f0f0f0;\n  border-left: 1px solid #f0f0f0;\n  border-right: 1px solid #CCCCCC;\n  border-bottom: 1px solid #CCCCCC;\n}\ndd.value {\n  text-align: center;\n  background-color: #eeeeee;\n}\ndt {\n  text-align: left;\n  background-color: #e6e6e6;\n  float: left;\n  width: 100px;\n}\n\nh1, h2, h3, h4, h5, h6 {\n  margin: 0;\n  padding: 0;\n}\n\nh1 {\n  text-align: center;\n  font-weight: bold;\n  padding: 5px 0 4px 0;\n  font-family: Arial, Sans-serif;\n  font-size: 18px;\n  border-top: 1px solid #f0f0f0;\n  border-left: 1px solid #f0f0f0;\n  border-right: 1px solid #CCCCCC;\n  border-bottom: 1px solid #CCCCCC;\n  margin: 0 2px 0px 2px;\n}\n\nh2 {\n  font-weight: bold;\n  padding: 2px 0 2px 8px;\n  font-family: Arial, Sans-serif;\n  font-size: 13px;\n  border-top: 1px solid #f0f0f0;\n  border-left: 1px solid #f0f0f0;\n  border-right: 1px solid #CCCCCC;\n  border-bottom: 1px solid #CCCCCC;\n  margin: 0 0 0px 0;\n  background-color: #FFFFFF;\n  color: #777777;\n}\n\nh2.classname {\n  color: #000000;\n}\n\n.okbg {\n  background-color: #66FF55;\n}\n.errorbg {\n  background-color: #CC1100;\n}\n.failurebg {\n  background-color: #EE3322;\n}\n.warnbg {\n  background-color: #FFCC99;\n}\n.headerinfo {\n  text-align: right;\n  font-size: 11px;\n  font - color: 0xCCCCCC;\n  margin: 0 2px 5px 2px;\n  border-left: 1px solid #f0f0f0;\n  border-right: 1px solid #CCCCCC;\n  border-bottom: 1px solid #CCCCCC;\n  padding: 2px;\n}\n\nli {\n  padding: 4px;\n  margin: 2px;\n  border-top: 1px solid #f0f0f0;\n  border-left: 1px solid #f0f0f0;\n  border-right: 1px solid #CCCCCC;\n  border-bottom: 1px solid #CCCCCC;\n  background-color: #e6e6e6;\n}\n\nli.fixture {\n  background-color: #f6f6f6;\n  padding-bottom: 6px;\n}\n\ndiv.fixturedetails {\n  padding-left: 108px;\n}\n\nul {\n  padding: 0;\n  margin: 6px 0 0 0;\n  list-style-type: none;\n}\n\nol {\n  padding: 0 0 0 28px;\n  margin: 0px 0 0 0;\n}\n\n.statnumbers {\n  padding: 2px 8px;\n}\n\n.fixtureresult {\n  width: 100px;\n  text-align: center;\n  display: block;\n  float: left;\n  font-weight: bold;\n  padding: 1px;\n  margin: 0 0 0 0;\n}\n\n.testoutput {\n  border: 1px dashed #CCCCCC;\n  margin: 4px 0 0 0;\n  padding: 4px 8px;\n  background-color: #eeeeee;\n}\n\nspan.tracepos, span.traceposempty {\n  display: block;\n  float: left;\n  font-weight: bold;\n  font-size: 9px;\n  width: 170px;\n  margin: 2px 0 0 2px;\n}\n\nspan.tracepos:hover {\n  cursor : pointer;\n  background-color: #ffff99;\n}\n\nspan.tracemsg {\n  display: block;\n  margin-left: 180px;\n  background-color: #eeeeee;\n  padding: 7px;\n}\n\nspan.tracetime {\n  display: block;\n  float: right;\n  margin: 2px;\n  font-size: 9px;\n  color: #777777;\n}\n\n\ndiv.trace ol {\n  padding: 0 0 0 40px;\n  color: #777777;\n}\n\ndiv.trace li {\n  padding: 0;\n}\n\ndiv.trace li div.li {\n  color: #000000;\n}\n\ndiv.trace h2 {\n  margin: 0 2px 0px 2px;\n  padding-left: 4px;\n}\n\n.tracepackage {\n  color: #777777;\n  font-weight: normal;\n}\n\n.clr {\n  clear: both;\n}\n\n#utesttip {\n  margin-top: -3px;\n  margin-left: 170px;\n  font-size: 9px;\n}\n\n#utesttip li {\n  margin: 0;\n  background-color: #ffff99;\n  padding: 2px 4px;\n  border: 0;\n  border-bottom: 1px dashed #ffff33;\n}";
	}
	,jsScript: function() {
		return "function utestTooltip(ref, text) {\n  var el = document.getElementById(\"utesttip\");\n  if(!el) {\n    var el = document.createElement(\"div\")\n    el.id = \"utesttip\";\n    el.style.position = \"absolute\";\n    document.body.appendChild(el)\n  }\n  var p = utestFindPos(ref);\n  el.style.left = (4 + p[0]) + \"px\";\n  el.style.top = (p[1] - 1) + \"px\";\n  el.innerHTML =  text;\n}\n\nfunction utestFindPos(el) {\n  var left = 0;\n  var top = 0;\n  do {\n    left += el.offsetLeft;\n    top += el.offsetTop;\n  } while(el = el.offsetParent)\n  return [left, top];\n}\n\nfunction utestRemoveTooltip() {\n  var el = document.getElementById(\"utesttip\")\n  if(el)\n    document.body.removeChild(el)\n}";
	}
	,wrapHtml: function(title,s) {
		return "<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html;charset=utf-8\" />\n<title>" + title + "</title>\n      <style type=\"text/css\">" + this.cssStyle() + "</style>\n      <script type=\"text/javascript\">\n" + this.jsScript() + "\n</" + "script>\n</head>\n      <body>\n" + s + "\n</body>\n</html>";
	}
	,_handler: function(report) {
		var isDef = function(v) {
			return typeof v != 'undefined';
		};
		var hasProcess = typeof process != 'undefined';
		if(hasProcess) {
			process.stdout.write(report.getHtml());
			return;
		}
		var head = window.document.getElementsByTagName("head")[0];
		var script = window.document.createElement("script");
		script.type = "text/javascript";
		var sjs = report.jsScript();
		if(isDef(script.text)) {
			script.text = sjs;
		} else {
			script.innerHTML = sjs;
		}
		head.appendChild(script);
		var style = window.document.createElement("style");
		style.type = "text/css";
		var scss = report.cssStyle();
		if(isDef(style.styleSheet)) {
			style.styleSheet.cssText = scss;
		} else if(isDef(style.cssText)) {
			style.cssText = scss;
		} else if(isDef(style.innerText)) {
			style.innerText = scss;
		} else {
			style.innerHTML = scss;
		}
		head.appendChild(style);
		var el = window.document.getElementById("utest-results");
		if(null == el) {
			el = window.document.createElement("div");
			el.id = "utest-results";
			window.document.body.appendChild(el);
		}
		el.innerHTML = report.getAll();
	}
	,__class__: utest_ui_text_HtmlReport
};
var utest_ui_text_PlainTextReport = function(runner,outputHandler) {
	this.aggregator = new utest_ui_common_ResultAggregator(runner,true);
	runner.onStart.add($bind(this,this.start));
	this.aggregator.onComplete.add($bind(this,this.complete));
	if(null != outputHandler) {
		this.setHandler(outputHandler);
	}
	this.displaySuccessResults = utest_ui_common_SuccessResultsDisplayMode.AlwaysShowSuccessResults;
	this.displayHeader = utest_ui_common_HeaderDisplayMode.AlwaysShowHeader;
};
utest_ui_text_PlainTextReport.__name__ = ["utest","ui","text","PlainTextReport"];
utest_ui_text_PlainTextReport.__interfaces__ = [utest_ui_common_IReport];
utest_ui_text_PlainTextReport.prototype = {
	displaySuccessResults: null
	,displayHeader: null
	,handler: null
	,aggregator: null
	,newline: null
	,indent: null
	,setHandler: function(handler) {
		this.handler = handler;
	}
	,startTime: null
	,start: function(e) {
		this.startTime = this.getTime();
	}
	,getTime: function() {
		return new Date().getTime() / 1000;
	}
	,indents: function(c) {
		var s = "";
		var _g1 = 0;
		var _g = c;
		while(_g1 < _g) {
			var _ = _g1++;
			s += this.indent;
		}
		return s;
	}
	,dumpStack: function(stack) {
		if(stack.length == 0) {
			return "";
		}
		var parts = haxe_CallStack.toString(stack).split("\n");
		var r = [];
		var _g = 0;
		while(_g < parts.length) {
			var part = parts[_g];
			++_g;
			if(part.indexOf(" utest.") >= 0) {
				continue;
			}
			r.push(part);
		}
		return r.join(this.newline);
	}
	,addHeader: function(buf,result) {
		if(!utest_ui_common_ReportTools.hasHeader(this,result.stats)) {
			return;
		}
		var end = this.getTime();
		var time = ((end - this.startTime) * 1000 | 0) / 1000;
		buf.b += Std.string("\nassertations: " + result.stats.assertations + this.newline);
		buf.b += Std.string("successes: " + result.stats.successes + this.newline);
		buf.b += Std.string("errors: " + result.stats.errors + this.newline);
		buf.b += Std.string("failures: " + result.stats.failures + this.newline);
		buf.b += Std.string("warnings: " + result.stats.warnings + this.newline);
		buf.b += Std.string("execution time: " + time + this.newline);
		buf.b += Std.string(this.newline);
		buf.b += Std.string("results: " + (result.stats.isOk ? "ALL TESTS OK (success: true)" : "SOME TESTS FAILURES (success: false)"));
		buf.b += Std.string(this.newline);
	}
	,result: null
	,getResults: function() {
		var buf = new StringBuf();
		this.addHeader(buf,this.result);
		var _g = 0;
		var _g1 = this.result.packageNames();
		while(_g < _g1.length) {
			var pname = _g1[_g];
			++_g;
			var pack = this.result.getPackage(pname);
			if(utest_ui_common_ReportTools.skipResult(this,pack.stats,this.result.stats.isOk)) {
				continue;
			}
			var _g2 = 0;
			var _g3 = pack.classNames();
			while(_g2 < _g3.length) {
				var cname = _g3[_g2];
				++_g2;
				var cls = pack.getClass(cname);
				if(utest_ui_common_ReportTools.skipResult(this,cls.stats,this.result.stats.isOk)) {
					continue;
				}
				buf.b += Std.string((pname == "" ? "" : pname + ".") + cname + this.newline);
				var _g4 = 0;
				var _g5 = cls.methodNames();
				while(_g4 < _g5.length) {
					var mname = _g5[_g4];
					++_g4;
					var fix = cls.get(mname);
					if(utest_ui_common_ReportTools.skipResult(this,fix.stats,this.result.stats.isOk)) {
						continue;
					}
					var x = this.indents(1) + mname + ": ";
					buf.b += Std.string(x);
					if(fix.stats.isOk) {
						buf.b += "OK ";
					} else if(fix.stats.hasErrors) {
						buf.b += "ERROR ";
					} else if(fix.stats.hasFailures) {
						buf.b += "FAILURE ";
					} else if(fix.stats.hasWarnings) {
						buf.b += "WARNING ";
					}
					var messages = "";
					var _g6 = fix.iterator();
					while(_g6.head != null) {
						var val = _g6.head.item;
						_g6.head = _g6.head.next;
						var assertation = val;
						switch(assertation[1]) {
						case 0:
							buf.b += ".";
							break;
						case 1:
							var pos = assertation[3];
							var msg = assertation[2];
							buf.b += "F";
							messages += this.indents(2) + "line: " + pos.lineNumber + ", " + msg + this.newline;
							break;
						case 2:
							var s = assertation[3];
							var e = assertation[2];
							buf.b += "E";
							messages += this.indents(2) + Std.string(e) + this.dumpStack(s) + this.newline;
							break;
						case 3:
							var s1 = assertation[3];
							var e1 = assertation[2];
							buf.b += "S";
							messages += this.indents(2) + Std.string(e1) + this.dumpStack(s1) + this.newline;
							break;
						case 4:
							var s2 = assertation[3];
							var e2 = assertation[2];
							buf.b += "T";
							messages += this.indents(2) + Std.string(e2) + this.dumpStack(s2) + this.newline;
							break;
						case 5:
							var s3 = assertation[3];
							var missedAsyncs = assertation[2];
							buf.b += "O";
							messages += this.indents(2) + "missed async calls: " + missedAsyncs + this.dumpStack(s3) + this.newline;
							break;
						case 6:
							var s4 = assertation[3];
							var e3 = assertation[2];
							buf.b += "A";
							messages += this.indents(2) + Std.string(e3) + this.dumpStack(s4) + this.newline;
							break;
						case 7:
							var msg1 = assertation[2];
							buf.b += "W";
							messages += this.indents(2) + msg1 + this.newline;
							break;
						}
					}
					buf.b += Std.string(this.newline);
					buf.b += messages == null ? "null" : "" + messages;
				}
			}
		}
		return buf.b;
	}
	,complete: function(result) {
		this.result = result;
		this.handler(this);
		if(typeof process != "undefined") {
			process.exit(result.stats.isOk ? 0 : 1);
		}
		if(typeof phantom != "undefined") {
			phantom.exit(result.stats.isOk ? 0 : 1);
		}
	}
	,__class__: utest_ui_text_PlainTextReport
};
var utest_ui_text_PrintReport = function(runner) {
	utest_ui_text_PlainTextReport.call(this,runner,$bind(this,this._handler));
	this.newline = "\n";
	this.indent = "  ";
};
utest_ui_text_PrintReport.__name__ = ["utest","ui","text","PrintReport"];
utest_ui_text_PrintReport.__super__ = utest_ui_text_PlainTextReport;
utest_ui_text_PrintReport.prototype = $extend(utest_ui_text_PlainTextReport.prototype,{
	_handler: function(report) {
		this._trace(report.getResults());
	}
	,_trace: function(s) {
		s = StringTools.replace(s,"  ",this.indent);
		s = StringTools.replace(s,"\n",this.newline);
		haxe_Log.trace(s,{ fileName : "PrintReport.hx", lineNumber : 57, className : "utest.ui.text.PrintReport", methodName : "_trace"});
	}
	,__class__: utest_ui_text_PrintReport
});
function $iterator(o) { if( o instanceof Array ) return function() { return HxOverrides.iter(o); }; return typeof(o.iterator) == 'function' ? $bind(o,o.iterator) : o.iterator; }
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
String.prototype.__class__ = String;
String.__name__ = ["String"];
Array.__name__ = ["Array"];
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
var __map_reserved = {}
var ArrayBuffer = $global.ArrayBuffer || js_html_compat_ArrayBuffer;
if(ArrayBuffer.prototype.slice == null) {
	ArrayBuffer.prototype.slice = js_html_compat_ArrayBuffer.sliceImpl;
}
var Uint8Array = $global.Uint8Array || js_html_compat_Uint8Array._new;
thx_culture_Culture.cultures = new haxe_ds_StringMap();
thx_culture_Culture.list = [];
Assertion.enableAssert = true;
Assertion.enableWeakAssert = true;
Assertion.enableShow = true;
haxe_crypto_Base64.CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
haxe_crypto_Base64.BYTES = haxe_io_Bytes.ofString(haxe_crypto_Base64.CHARS);
js_Boot.__toStr = ({ }).toString;
js_html_compat_Uint8Array.BYTES_PER_ELEMENT = 1;
thx_culture_DateFormatInfo.invariant = new thx_culture_DateFormatInfo(0,"FirstDay","AM","PM",0,"Sunday","Gregorian",null,["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],["Su","Mo","Tu","We","Th","Fr","Sa"],["January","February","March","April","May","June","July","August","September","October","November","December",""],["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],["January","February","March","April","May","June","July","August","September","October","November","December",""],["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""],"dddd, dd MMMM yyyy","MM/dd/yyyy","dddd, dd MMMM yyyy HH:mm:ss","yyyy'-'MM'-'dd'T'HH':'mm':'ss","MMMM dd","ddd, dd MMM yyyy HH':'mm':'ss 'GMT'","HH:mm:ss","HH:mm","yyyy'-'MM'-'dd HH':'mm':'ss'Z'","yyyy MMMM","/",":");
thx_culture_NumberFormatInfo.invariant = new thx_culture_NumberFormatInfo(2,2,2,[3],[3],[3],0,1,0,0,0,".",".",".",",",",",",","-","+","¤","NaN","-Infinity","%","‰","Infinity");
thx_culture_Culture.invariant = new thx_culture_Culture("",thx_culture_DateFormatInfo.invariant,"",false,"iv","IVL",false,127,"Gregorian","Invariant Language","Invariant Language","Invariant Country","Invariant Country",thx_culture_NumberFormatInfo.invariant,",","IVL");
thx_culture_Pattern.numberNegatives = ["(n)","-n","- n","n-","n -"];
utest_ui_text_HtmlReport.platform = "javascript";
Main.main();
})(typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);
