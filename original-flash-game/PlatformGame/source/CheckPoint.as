package source {
	
	import flash.display.CapsStyle;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	
	public class CheckPoint extends AbstractObject{
		
		public function CheckPoint(xx:int, yy:int) {
			super(xx, yy);
			this.x = xx;
			this.y = yy;
		}
		public override function getCollidiableBounds():Rectangle {
			 return new Rectangle(this.x, this.y, this.width, this.height);
		}
		public override function hitTest(player:Player, normal:Point):Boolean {
			var b:Rectangle = this.getCollidiableBounds();
			if (player.bounds.intersects(b)) {
				player.reachedCheckpoint(this);
				gotoAndStop("active");
				return false;
			}
			return false;
		}
		public override function loop() {
			//nothing
		}
		
	}//END
}//END