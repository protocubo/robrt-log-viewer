import js.jquery.*;
import utest.Assert in A;

import Assertion.*;
import Main.*;
import js.Browser.*;
import js.jquery.Helper.*;

@:keep
class Test {
	public function new() {}

	function test_parsing()
	{
		function base64(txt)
			return haxe.crypto.Base64.encode(haxe.io.Bytes.ofString(txt));
		function result(cmd, exit:Int, output, ?duration)
			return {
				cmd:cmd,
				exit:Std.string(exit),
				output:output,
				duration:duration
			}
		function echo(cmd)
			return "+ " + cmd;
		function started(no:Int, ing=false, ?cmd, ?at) {
			assert((cmd != null && at != null) || cmd == at, cmd, at);
			var st = 'robrt: start${ing?"ing":"ed"} cmd <$no>';
			if (cmd != null)
				st += ': ${base64(cmd)}: $at';
			return st;
		}
		function finished(no:Int, exit:Int, ?at)
			return 'robrt: finished cmd <$no> with status <$exit>${at != null ? ": " + at : ""}';

		// modern logs
		A.same([result("cmd", 99, ["bar"], 8800)],
			parseLog([
				started(11, "cmd", "1.100000000"),
				"bar",
				finished(11, 99, "9.900000000")].join("\n")));
		// compat with extra/deprecated echos
		A.same([result("cmd", 99, ["bar"], 8800)],
			parseLog([
				echo("cmd"),
				started(11, "cmd", "1.100000000"),
				"bar",
				finished(11, 99, "9.900000000")].join("\n")));
		// old logs without timing and with "starting"
		A.same([result("cmd", 99, ["bar"])],
			parseLog([
				echo("cmd"),
				started(11, true),
				"bar",
				finished(11, 99)].join("\n")));
		A.warn("TODO tests negative exit codes");
		A.warn("TODO tests with garbage due to out of order output before 'started'");
		A.warn("TODO tests with carriage returns");
	}

	function test_ansi_executing()
	{
		A.warn("TODO");
	}

	function test_render()
	{
		A.warn("TODO");
	}
}

