package source {
	
	import flash.display.CapsStyle;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	
	public class UpRightTrampoline extends AbstractObject{
		
		public function UpRightTrampoline(xx:int, yy:int, aWidth:int, aHeight:int ) {
			super(xx, yy);
			this.x = xx;
			this.y = yy;
			
			
			this.graphics.lineStyle(3, 0xFF00FF, 1, false, "normal", CapsStyle.NONE);
			this.graphics.lineTo(aWidth, aHeight);
			this.graphics.moveTo(aWidth, aHeight);
			this.graphics.lineTo(0, aHeight);
			this.graphics.moveTo(0, aHeight);
			this.graphics.lineTo(0, 0);
		}
		public override function getCollidiableBounds():Rectangle {
			 return new Rectangle(this.x, this.y, this.width, this.height);
		}
		public override function hitTest(player:Player, normal:Point):Boolean {
			var b:Rectangle = this.getCollidiableBounds();
			var graphratioy:Number = -b.height / b.width;	
			//trace(graphratioy);
			//player.lastBounds.right < ((player.lastBounds.right  - b.x) * graphratioy) && 
			
			if (player.bounds.intersects(b) && player.lastBounds.bottom < b.bottom - ((player.lastBounds.left  - b.right) * graphratioy) && player.bounds.bottom > b.bottom - ((player.bounds.left  - b.right) * graphratioy)) {
				player.superBoost(-0.5);
				player.superJump(1);
				trace("true");
				return false;
			}
			if (player.lastBounds.top >= b.bottom && player.bounds.top <= b.bottom && player.bounds.right >= b.left && player.bounds.left <= b.right) {
				normal.x = 0;
				normal.y = b.bottom - player.bounds.top;;
				return true;
			}
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