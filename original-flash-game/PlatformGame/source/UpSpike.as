package source {
	
	import flash.geom.Point;
	import flash.geom.Rectangle;
	
	public class UpSpike extends AbstractObject {
		
		public function UpSpike(xx:Number, yy:Number, aWidth:Number) {
			super(xx, yy);
			this.x = xx;
			this.y = yy;
			this.width = aWidth;
		}
		public override function getCollidiableBounds():Rectangle {
			 return new Rectangle(this.x + 2, this.y + 5, this.width - 4, this.height - 10);
		}
		public override function hitTest(player:Player, normal:Point):Boolean {
			var b:Rectangle = this.getCollidiableBounds();
			if (player.lastBounds.bottom <= b.top && player.bounds.bottom >= b.top && player.bounds.right >= b.left && player.bounds.left <= b.right) {
				normal.x = 0;
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
