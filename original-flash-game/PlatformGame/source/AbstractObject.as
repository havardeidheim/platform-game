package  source{
	
	import flash.display.MovieClip;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	
	public class AbstractObject extends MovieClip implements Collidable{
		
		protected var startX:int;
		protected var startY:int;
		public var startXX:int;
		public var startYY:int;
		
		public function AbstractObject(xx:int, yy:int) {
			cacheAsBitmap = true;
			startX = xx;
			startY = yy;
			startXX = xx;
			startYY = yy;
		}
		public function move(dx:Number, dy:Number) {
			this.x += dx;
			this.y += dy;
			this.startX += dx;
			this.startY += dy;
		}
		public function setAlpha(a:Number) {
			if (a > 1 || a < 0) {
				throw new "illegal argument";
			}else {
				this.alpha = a;
			}
		}
		public function reset() {
			this.x = startXX;
			this.y = startYY;
			this.startX = startXX;
			this.startY = startYY;
		}
		public function getCollidiableBounds():Rectangle {
			 throw "thisisinterface";
		}
		public function hitTest(player:Player, normal:Point):Boolean {
			throw "thisisinterface";
		}
		public function loop() {
			throw "thisisinterface";
		}
		
	}//END
}//END