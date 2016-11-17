import js.jquery.*;

import Assertion.*;
import js.Browser.*;
import js.jquery.Helper.*;

class Main {
	static function parseCommand(lines:Array<String>):Command
	{
		var bpat = ~/robrt: start(ed|ing) cmd <(\d+)>(: ([a-zA-Z0-9\+\/=]+): (\d+).(\d+))?/i;
		var epat = ~/robrt: finished cmd <(\d+)> with status <(\d+)>(: (\d+).(\d+))?/i;

		var prefix = null;
		var fst = lines.shift();
		if (StringTools.startsWith(fst, "+ ")) {
			prefix = fst;
			fst = lines.shift();
		}
		assert(bpat.match(fst), fst);

		var inCompatMode = bpat.matched(3) == null;
		assert((inCompatMode && prefix != null) || !inCompatMode, bpat.matched(3), inCompatMode, prefix, "the command must either come from header or from the prefix");

		var no = bpat.matched(2);
		var cmd = inCompatMode ? prefix.substr(2) : haxe.crypto.Base64.decode(bpat.matched(4)).toString();

		var output = [];
		while ({ assert(lines.length > 0, lines.length); !epat.match(lines[0]); }) {
			var cur = lines.shift();
			var cr = cur.lastIndexOf("\r");
			if (cr > 0)
				cur = cur.substr(cr);
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

		show(no, cmd, exit, duration, output.length);

		return {
			cmd : cmd,
			exit : exit,
			duration : duration,
			output : output
		}
	}

	static function parseLog(raw:String)
	{
		var lines = ~/\r?\n/g.split(raw);
		var cmds = [];
		while (lines.length > 0 && lines[0] != "")
			cmds.push(parseCommand(lines));
		show(cmds.length);
		return cmds;
	}

	@:template static function renderCommand(cmd:Command, opts:{ lineNumber : Int });

	static function render()
	{
		var rawLogUrl = {
			var arg = window.location.search;
			var pat = ~/^\?(.+)$/;
			assert(pat.match(arg), arg);
			pat.matched(1);
		}
		show(rawLogUrl);

		var req = new haxe.Http(rawLogUrl);
		req.onData = function (raw) {
			show(raw.length);

			var log = parseLog(raw);
			var container = J("#log-container");
			var opts = {
				lineNumber : 1
			};
			for (cmd in log) {
				var obj = renderCommand(cmd, opts);
				container.append(JQuery.parseHTML(obj));
			}
		};
		req.onError = function (err) assert(false, err);
		req.request(false);
	}

	static function main()
	{
		JTHIS.ready(render);
	}
}

