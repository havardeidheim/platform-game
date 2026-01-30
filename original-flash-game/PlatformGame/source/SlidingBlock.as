package source {
	
	import flash.geom.Rectangle;
	import flash.geom.Point;
	import flash.display.CapsStyle;
	
	public class SlidingBlock extends AbstractObject{
		
		public function SlidingBlock(xx:int, yy:int, aWidth:int, aHeight:int) {
			super(xx, yy);
			this.x = xx;
			this.y = yy;
			this.width = aWidth;
			this.height = aHeight;
		}
		public override function getCollidiableBounds():Rectangle {
			  return new Rectangle(this.x, this.y, this.width, this.height);
		}
		public override function hitTest(player:Player, normal:Point):Boolean {
			var b:Rectangle = this.getCollidiableBounds();
			if (player.lastBounds.left >= b.right && player.bounds.left -2 <= b.right && player.bounds.top <= b.bottom && player.bounds.bottom >= b.top) {
				normal.x = b.right - player.bounds.left;
				normal.y = 0;
				player.slideRight = true;
				return true;
			}
			if (player.lastBounds.right <= b.left && player.bounds.right +2 >= b.left && player.bounds.top <= b.bottom && player.bounds.bottom >= b.top) {
				normal.x = b.left - player.bounds.right;
				normal.y = 0;
				player.slideLeft = true;
				return true;
			}
			if (player.lastBounds.bottom <= b.top && player.bounds.bottom >= b.top && player.bounds.right >= b.left && player.bounds.left <= b.right) {
				normal.x = 0;
				normal.y = b.top - player.bounds.bottom;
				return true;
			}
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