package source {
	
	import flash.geom.Point;
	import flash.geom.Rectangle;
	
	public class LeftSpike extends AbstractObject {
		
		public function LeftSpike(xx:Number, yy:Number, aHeight:Number) {
			super(xx, yy);
			this.x = xx;
			this.y = yy;
			this.height = aHeight;
		}
		public override function getCollidiableBounds():Rectangle {
			 return new Rectangle(this.x + 5, this.y + 2, this.width - 5, this.height - 4);
		}
		public override function hitTest(player:Player, normal:Point):Boolean {
			var b:Rectangle = this.getCollidiableBounds();
			if (player.lastBounds.right <= b.left && player.bounds.right >= b.left && player.bounds.top <= b.bottom && player.bounds.bottom >= b.top) {
				normal.x = 0
				normal.y = 0;
				player.die();
				return false;
			}
			return false;
		}
		public override function loop() {
			//nothing
		}
		
	}//END
}//END
