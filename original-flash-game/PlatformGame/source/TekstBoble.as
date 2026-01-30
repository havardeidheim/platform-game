package source {
	
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.text.TextField;
	import flash.text.TextFormat;
	import flash.text.TextFieldAutoSize;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	
	public class TekstBoble extends AbstractObject {
		
		private var tekst:String = "";
		private var tekstStartX:int;
		private var tekstStartY:int;
		public function TekstBoble(xx:int, yy:int, aTextField:TextField) {
			super(xx, yy);
			this.x = xx;
			this.y = yy;
			this.graphics.lineStyle(4, 0x000000);
			this.graphics.beginFill(0x999966, 1);
			this.graphics.drawRoundRect(0, 0, aTextField.width + 10, aTextField.height + 10, 5, 5);
			var tekstwrapper:TekstWarapper = new TekstWarapper();
			tekstwrapper.tekstfelt.width = aTextField.width;
			tekstwrapper.tekstfelt.height = aTextField.height;
			tekstwrapper.x = 5;
			tekstwrapper.y = 5;
			tekstwrapper.tekstfelt.text = aTextField.text;
			addChild(tekstwrapper);
		}
		public override function getCollidiableBounds():Rectangle {
			throw "does not support bounds";
			return null;
		}
		public override function hitTest(player:Player, normal:Point):Boolean {
			return false;
		}
		public override function loop() {
			return;
		}
	}//END
}//END
