package source {
	
	import flash.geom.Point;
	import flash.geom.Rectangle;
	
	public class DownPlatform extends AbstractObject{
		
		public function DownPlatform(xx:int, yy:int, aWidth:int) {
			super(xx,yy);
			this.x = xx;
			this.y = yy;
			this.width = aWidth;
		}
		public override function getCollidiableBounds():Rectangle {
			 return new Rectangle(this.x, this.y, this.width, this.height);
		}
		public override function hitTest(player:Player, normal:Point):Boolean {
			var b:Rectangle = this.getCollidiableBounds();
			if (player.lastBounds.top >= b.bottom && player.bounds.top <= b.bottom && player.bounds.right >= b.left && player.bounds.left <= b.right) {
				normal.x = 0;
				normal.y = b.bottom - player.bounds.top;;
				return true;
			}
			return false;
		}
		public override function loop() {
			//nothing
		}
		
	}//END
}//END