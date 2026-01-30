package source {
	
	import flash.display.CapsStyle;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	
	public class VannSagBlad extends AbstractObject{
		
		private var radius:Number;
		
		private var dynamisk:Boolean = false;
		private var bane:int;
		private var progress:int = 0;
		private var right:Boolean = false;
		
		public function VannSagBlad(xx:int, yy:int, bane:int) {
			super(xx, yy);
			cacheAsBitmap = false;
			this.x = xx;
			this.y = yy;
			this.radius = this.width / 2;
			this.dynamisk = (bane == 0 ? false : true);
			this.bane = bane;
			if (bane > 0) {
				right = true;
			}
		}
		public override function getCollidiableBounds():Rectangle {
			 throw "SagBlad does not support bounds";
		}
		public override function reset() {
			super.reset();
			this.progress = 0;
			right = false;
			if (bane > 0) {
				right = true;
			}
		}
		public override function hitTest(player:Player, normal:Point):Boolean {
			var rect:Rectangle = player.bounds;
			var closestX:Number = Co.clamp(this.x, rect.left, rect.right);
			var closestY:Number = Co.clamp(this.y, rect.top, rect.bottom);
			var xdist = this.x - closestX;
			var ydist = this.y - closestY;
			var hypdist:Number = Math.sqrt((xdist * xdist) + (ydist * ydist));
			if (hypdist < radius) {
				player.die();
				return false;
			}
			return false;
		}
		public override function loop() {
			this.rotation -= 4;
			if (dynamisk) {
				if (progress >= Math.abs(bane)) {
					right = !right;
					progress = 0;
				}
				progress += 1;
				if (right) {
					x += 1;
					this.rotation += 8;
				}else {
					x -= 1;
				}
			}
		}
		
	}//END
}//END