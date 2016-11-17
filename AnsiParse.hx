typedef ForegroundColor = String;
typedef BackgroundColor = String;

typedef AnsiSegment = {
	text : String,
	?foreground : ForegroundColor,
	?background : BackgroundColor,
	?bold : Bool,
	?italic : Bool,
	?underline : Bool
}

@:native("ansiparse")
extern class AnsiParse {
	@:selfCall public static function run(txt:String):Array<AnsiSegment>;
}

