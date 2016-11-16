import js.jquery.*;

import Assertion.*;
import js.Browser.*;
import js.jquery.Helper.*;

class Main {
	static function parseCommand(lines:Array<String>):Command
	{
		var bpat = ~/robrt: started cmd <(\d+)>: ([a-zA-Z0-9\+\/=]+): (\d+).(\d+)/i;
		var epat = ~/robrt: finished cmd <(\d+)> with status <(\d+)>: (\d+).(\d+)/i;

		var fst = lines.shift();
		assert(bpat.match(fst), fst);

		var no = bpat.matched(1);
		var cmd = haxe.crypto.Base64.decode(bpat.matched(2)).toString();
		var start = (Std.parseFloat(bpat.matched(3)) + Std.parseFloat(bpat.matched(4))/1e9)*1e3;

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
		var finish = (Std.parseFloat(epat.matched(3)) + Std.parseFloat(epat.matched(4))/1e9)*1e3;

		var duration = finish - start;
		show(no, cmd, exit, start, finish, duration, output.length);

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
			StringTools.urlDecode(pat.matched(1));
		}
		show(rawLogUrl);

		var raw = haxe.Http.requestUrl(rawLogUrl);  // FIXME async
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
	}

	static function main()
	{
		JTHIS.ready(render);
	}
}

