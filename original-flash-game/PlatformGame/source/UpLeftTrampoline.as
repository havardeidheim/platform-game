package source {
	
	import flash.display.CapsStyle;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	
	public class UpLeftTrampoline extends AbstractObject{
		
		public function UpLeftTrampoline(xx:int, yy:int, aWidth:int, aHeight:int ) {
			super(xx, yy);
			this.x = xx;
			this.y = yy;
			
			this.graphics.lineStyle(3, 0xFF00FF, 1, false, "normal", CapsStyle.NONE);
			this.graphics.moveTo(0, aHeight);
			this.graphics.lineTo(aWidth, 0);
			this.graphics.moveTo(aWidth, 0);
			this.graphics.lineTo(aWidth, aHeight);
			this.graphics.moveTo(aWidth, aHeight);
			this.graphics.lineTo(0, aHeight);
		}
		public override function getCollidiableBounds():Rectangle {
			 return new Rectangle(this.x, this.y, this.width, this.height);
		}
		public override function hitTest(player:Player, normal:Point):Boolean {
			var b:Rectangle = this.getCollidiableBounds();
			var graphratioy:Number = b.height / b.width;	
			//trace(graphratioy);
			//player.lastBounds.right < ((player.lastBounds.right  - b.x) * graphratioy) && 
			if (player.bounds.intersects(b) && player.lastBounds.bottom < b.bottom - ((player.lastBounds.right  - b.left) * graphratioy) && player.bounds.bottom > b.bottom - ((player.bounds.right  - b.left) * graphratioy)) {
				player.superBoost(0.5);
				player.superJump(1);
				trace("true");
				//return false;
			}
			
			return false;
		}
		public override function loop() {
			//nothing
		}
		
	}//END
}//END