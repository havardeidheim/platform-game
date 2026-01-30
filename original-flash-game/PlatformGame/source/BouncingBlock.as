package source {
	
	import flash.display.CapsStyle;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	
	public class BouncingBlock extends AbstractObject{
		
		public function BouncingBlock(xx:int, yy:int, aWidth:int, aHeight) {
			super(xx, yy);
			this.x = xx;
			this.y = yy;
			this.width = aWidth;
			this.height = aHeight;
			/*this.graphics.beginFill(0x333333, 1);
			this.graphics.lineStyle(3, 0xFF00FF, 1, false, "normal", CapsStyle.NONE);
			this.graphics.drawRect(0, 0, aWidth, aHeight);*/
		}
		public override function getCollidiableBounds():Rectangle {
			  return new Rectangle(this.x, this.y, this.width, this.height);
		}
		public override function hitTest(player:Player, normal:Point):Boolean {
			var b:Rectangle = this.getCollidiableBounds();
			if (player.lastBounds.right <= b.left && player.bounds.right >= b.left && player.bounds.top <= b.bottom && player.bounds.bottom >= b.top) {
				player.superBoost(1);
				return false;
			}
			if (player.lastBounds.left >= b.right && player.bounds.left <= b.right && player.bounds.top <= b.bottom && player.bounds.bottom >= b.top) {
				player.superBoost(-1);
				return false;
			}
			if (player.lastBounds.bottom <= b.top && player.bounds.bottom >= b.top && player.bounds.right >= b.left && player.bounds.left <= b.right) {
				player.superJump(1);
				return false;
			}
			if (player.lastBounds.top >= b.bottom && player.bounds.top <= b.bottom && player.bounds.right >= b.left && player.bounds.left <= b.right) {
				player.superJump(-1);
				return false;
			}
			return false;
		}
		public override function loop() {
			//nothing
		}
		
	}//END
}//END
