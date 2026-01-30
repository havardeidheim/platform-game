package source {
	
	public class DangerousArea extends AbstractObject{
		
		import flash.geom.Point;
		import flash.geom.Rectangle;
		
		public function DangerousArea(xx:int, yy:int, aWidth:int, aHeight:int) {
			super(xx, yy);
			this.x = xx;
			this.y = yy;
			
			graphics.lineStyle(2, 0xFF0000);
			for (var i:int = 10; i < aWidth; i += 10) {
				graphics.moveTo(i, 0);
				graphics.lineTo(i, aHeight);
			}
			for (var j:int = 10; j < aHeight; j += 10) {
				graphics.moveTo(0, j);
				graphics.lineTo(aWidth, j);
			}
			this.cacheAsBitmap = true;
		}
		public override function getCollidiableBounds():Rectangle {
			 return new Rectangle(this.x, this.y, this.width, this.height);
		}
		public override function hitTest(player:Player, normal:Point):Boolean {
			var b:Rectangle = this.getCollidiableBounds();
			if (player.bounds.intersects(b)) {
				player.die();
				return false;
			}
			return false;
		}
		public override function loop() {
			//Nothing
		}
	}//END
}//END
