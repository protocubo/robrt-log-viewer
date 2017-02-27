import js.jquery.*;

import Assertion.*;
import js.Browser.*;
import js.jquery.Helper.*;

using StringTools;

class Main {
	static function parseCommand(lines:Array<String>):Command
	{
		var bpat = ~/robrt: start(ed|ing) cmd <(\d+)>(: ([a-zA-Z0-9\+\/=]+): (\d+).(\d+))?/i;
		var epat = ~/robrt: finished cmd <(\d+)> with status <(-?\d+)>(: (\d+).(\d+))?/i;

		var prefix = null;
		var fst = lines.shift();
		if (fst.startsWith("+ ")) {
			prefix = fst;
			fst = lines.shift();
		}
		while (fst != null && !bpat.match(fst)) {
			weakAssert(false, fst);
			fst = lines.shift();
		}
		assert(fst != null && bpat.match(fst), prefix, fst);

		var inCompatMode = bpat.matched(3) == null;
		assert((inCompatMode && prefix != null) || !inCompatMode, bpat.matched(3), inCompatMode, prefix, "the command must either come from header or from the prefix");

		var no = bpat.matched(2);
		var cmd = inCompatMode ? prefix.substr(2) : haxe.crypto.Base64.decode(bpat.matched(4)).toString();

		var output = [];
		while ({ assert(lines.length > 0, lines.length); !epat.match(lines[0]); }) {
			var cur = lines.shift();
			var cr = cur.lastIndexOf("\r");
			assert(cur.length == 0 || cr + 1 < cur.length, "ending \r should not happen, since there's always a 'finished' line and \r\n is a newline", cur, cr);
			cur = cur.substr(cr + 1);
			output.push(cur);
		}
		assert(lines.length >= 1, lines.length);
		lines.shift();

		assert(epat.matched(1) == no);
		var exit = epat.matched(2);

		var duration = {
			if (inCompatMode) {
				null;
			} else {
				var start = (Std.parseFloat(bpat.matched(5)) + Std.parseFloat(bpat.matched(6))/1e9)*1e3;
				var finish = (Std.parseFloat(epat.matched(4)) + Std.parseFloat(epat.matched(5))/1e9)*1e3;
				finish - start;
			}
		};

		return {
			cmd : cmd,
			exit : exit,
			duration : duration,
			output : output
		}
	}

	public static function parseLog(raw:String)
	{
		var lines = ~/\r?\n/g.split(raw);
		var cmds = [];
		while (lines.length > 0 && lines[0] != "")
			cmds.push(parseCommand(lines));
		return cmds;
	}

	public static function ansiExecute(output:Array<String>):Array<tink.template.Html>
	{
		var pseudo = output.join("\n");
		var segs = AnsiParse.run(pseudo);
		var spans = segs.map(function (i) {
			var classes = [];
			if (i.bold) classes.push("ansi-bold");
			if (i.italic) classes.push("ansi-italic");
			if (i.underline) classes.push("ansi-underline");
			if (i.foreground != null) classes.push("ansi-fg-"+i.foreground);
			if (i.background != null) classes.push("ansi-bg-"+i.background);
			return '<span class="${classes.join(" ")}">${StringTools.htmlEscape(i.text)}</span>';
		});
		if (spans.length == 0)
			return [];
		return spans.join("").split("\n").map(function (i) return new tink.template.Html(i));
	}

	@:template static function renderCommand(cmd:Command, opts:{ lineNumber : Int });
	@:template static function renderMessage(msg:String);

	static function setExpansionActions(container:JQuery)
	{
		container.click(function (e:Event) {
			var target = J(e.target).parents(".cmd-container");
			if (!target.hasClass("allow-expansion"))
				return;
			target.toggleClass("expanded");
			e.preventDefault();
			e.stopPropagation();
		});
	}

	static function setFavicon(exit)
		J("#favicon-link").attr("href", 'robrt_${exit == 0 ? "success" : "fail"}.ico');

	public static function render(url:String, container:JQuery)
	{
		container.append(JQuery.parseHTML(renderMessage('Loading log... ($url)')));
		var req = new haxe.Http(url);
		req.onData = function (raw) {
			show(raw.length);

			var log = parseLog(raw);
			var exit = log.length == 0 ? 0 : Std.parseInt(log[log.length-1].exit);
			var opts = {
				lineNumber : 1
			};
			show(container.length);
			for (cmd in log) {
				var obj = renderCommand(cmd, opts);
				container.children(".message").remove();
				container.append(JQuery.parseHTML(obj));
			}
			setFavicon(exit);
		};
		req.onError = function (err) assert(false, err);
		req.request(false);
		setExpansionActions(container);
	}

	static function main()
	{
		switch window.location.search {
		case "":
			assert(false, "nothing to do");
		case pat if (pat.length > 3 && "?unit-tests".startsWith(pat)):
			JTHIS.ready(function () {
				var runner = new utest.Runner();
				var exit = 0;
				runner.addCase(new Test());
				utest.ui.Report.create(runner);
				runner.onProgress.add(function (o) {
					exit -= o.result.allOk() ? 0 : 1;
					if (o.done == o.totals)
						setFavicon(exit);
				});
				runner.run();
			});
		case _.substr(1) => url:
			JTHIS.ready(function () {
				var container = J("#log-container");
				render(url, container);
			});
		}
	}
}

