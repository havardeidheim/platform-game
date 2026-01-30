package source {
	
	import flash.geom.Point;
	import flash.geom.Rectangle;

	public class LeftPlatform extends AbstractObject{
		
		public function LeftPlatform(xx:int, yy:int, aHeight:int) {
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
			if (player.lastBounds.right <= b.left && player.bounds.right >= b.left && player.bounds.top <= b.bottom && player.bounds.bottom >= b.top) {
				normal.x = b.left - player.bounds.right;
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