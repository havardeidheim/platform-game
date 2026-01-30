package source {
	
	import flash.display.MovieClip;
	import flash.geom.Point;
	import flash.geom.Rectangle;

	public class RightPlatform extends AbstractObject{
		
		public function RightPlatform(xx:int, yy:int, aHeight:int) {
			super(xx,yy);
			this.x = xx;
			this.y = yy;
			this.height = aHeight;
		}
		public override function getCollidiableBounds():Rectangle {
			 return new Rectangle(this.x, this.y, this.width, this.height);
		}
		public override function hitTest(player:Player, normal:Point):Boolean {
			var b:Rectangle = this.getCollidiableBounds();
			if (player.lastBounds.left >= b.right && player.bounds.left <= b.right && player.bounds.top <= b.bottom && player.bounds.bottom >= b.top) {
				normal.x = b.right - player.bounds.left;
				normal.y = 0;
				return true;
			}
			return false;
		}
		public override function loop() {
			//nothing
		}
		
	}//END
}//END