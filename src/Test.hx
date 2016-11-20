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
		// negative exit codes
		A.same([result("cmd", -99, ["bar"], 8800)],
			parseLog([
				started(11, "cmd", "1.100000000"),
				"bar",
				finished(11, -99, "9.900000000")].join("\n")));
		// dealing with carriage returns
		A.same([result("cmd", -99, ["bar", "ar", "r", "bar"], 8800)],
			parseLog([
				started(11, "cmd", "1.100000000"),
				"\rbar",
				"b\rar",
				"ba\rr",
				"bar\r",  // the \r merges with the \n from the neccessary "finished" line
				finished(11, -99, "9.900000000")].join("\n")));
		// more than one command
		A.same([result("cmd", 99, ["bar"], 8800), result("dmc", 77, ["foo"], 6600)],
			parseLog([
				started(11, "cmd", "1.100000000"),
				"bar",
				finished(11, 99, "9.900000000"),
				started(9, "dmc", "10.100000000"),
				"foo",
				finished(9, 77, "16.700000000")].join("\n")));
		// handle some garbage due to out-of-order output after the "echo" (less than ideal behavior!)
		A.same([result("cmd", 99, ["bar"], 8800), result("dmc", 77, ["foo"], 6600)],
			parseLog([
				echo("cmd"),
				started(11, "cmd", "1.100000000"),
				"bar",
				finished(11, 99, "9.900000000"),
				echo("dmc"),
				"ops",
				started(9, "dmc", "10.100000000"),
				"foo",
				finished(9, 77, "16.700000000")].join("\n")));
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

