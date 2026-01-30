package source {
	
	import flash.display.MovieClip;
	import flash.geom.Rectangle;
	import flash.geom.Point;
	
	public class BouncingBlockRot extends AbstractObject{
		
		private const UPLEFT:int = 1;
		private const UPRIGHT:int = 2;
		private const BOTLEFT:int = 3;
		private const BOTRIGHT:int = 4;
		
		private const LEFT:int = 3;
		private const RIGHT:int = 4;
		private const UP:int = 2;
		private const DOWN:int = 1;
		
		private var collisionDirection:int = 0;
		
		private var lastpoints:Array = new Array();
		private var thispoints:Array = new Array();
		
		public function BouncingBlockRot(xx:int, yy:int) {
			super(xx, yy);
			this.x = xx;
			this.y = yy;
		}
		public override function getCollidiableBounds():Rectangle {
			return new Rectangle(this.x, this.y, 40, 40);
		}
		public override function hitTest(player:Player, normal:Point):Boolean {
			var b:Rectangle = getCollidiableBounds();
			if (!b.intersects(player.bounds)) {
				return false;
			}
			
			lastpoints[DOWN] = (new Point(player.lastBounds.x + player.lastBounds.width / 2, player.lastBounds.bottom));
			lastpoints[UP] = (new Point(player.lastBounds.x + player.lastBounds.width / 2, player.lastBounds.y));
			lastpoints[LEFT] = (new Point(player.lastBounds.x, player.lastBounds.y + player.lastBounds.height / 2));
			lastpoints[RIGHT] = (new Point(player.lastBounds.right, player.lastBounds.y + player.lastBounds.height / 2));
			
			thispoints[DOWN] = (new Point(player.bounds.x + player.bounds.width / 2, player.bounds.bottom));
			thispoints[UP] = (new Point(player.bounds.x + player.bounds.width / 2, player.bounds.y));
			thispoints[LEFT] = (new Point(player.bounds.x, player.bounds.y + player.bounds.height / 2));
			thispoints[RIGHT] = (new Point(player.bounds.right, player.bounds.y + player.bounds.height / 2));
			
			//UPLEFT
			if (Co.linesIntersect(b.x, b.y + 20, b.x + 21, b.y, lastpoints[DOWN].x, lastpoints[DOWN].y, thispoints[DOWN].x, thispoints[DOWN].y)) {
				player.superBoost(0.5);
				player.superJump(1);
				return false;
			}
			if (Co.linesIntersect(b.x, b.y + 20, b.x + 21, b.y, lastpoints[RIGHT].x, lastpoints[RIGHT].y, thispoints[RIGHT].x, thispoints[RIGHT].y)) {
				player.superBoost(0.5);
				player.superJump(1);
				return false;
			}
			//UPRIGHT
			if (Co.linesIntersect(b.x + 20, b.y, b.x + 40, b.y + 20+1, lastpoints[DOWN].x, lastpoints[DOWN].y, thispoints[DOWN].x, thispoints[DOWN].y)) {
				player.superBoost(-0.5);
				player.superJump(1);
				return false;
			}
			if (Co.linesIntersect(b.x + 20, b.y, b.x + 40, b.y + 20, lastpoints[LEFT].x, lastpoints[LEFT].y, thispoints[LEFT].x, thispoints[LEFT].y)) {
				player.superBoost(-0.5);
				player.superJump(1);
				return false;
			}
			//BOTLEFT
			if (Co.linesIntersect(b.x, b.y + 20, b.x + 21, b.y + 40, lastpoints[UP].x, lastpoints[UP].y, thispoints[UP].x, thispoints[UP].y)) {
				player.superBoost(0.5);
				player.superJump(-1);
				return false;
			}
			if (Co.linesIntersect(b.x, b.y + 20, b.x + 21, b.y + 40, lastpoints[RIGHT].x, lastpoints[RIGHT].y, thispoints[RIGHT].x, thispoints[RIGHT].y)) {
				player.superBoost(0.5);
				player.superJump(-1);
				return false;
			}
			//BOTRIGHT
			if (Co.linesIntersect(b.x + 20, b.y + 40, b.x + 40, b.y + 20+1, lastpoints[UP].x, lastpoints[UP].y, thispoints[UP].x, thispoints[UP].y)) {
				player.superBoost(-0.5);
				player.superJump(-1);
				return false;
			}
			if (Co.linesIntersect(b.x + 20, b.y + 40, b.x + 40, b.y + 20, lastpoints[LEFT].x, lastpoints[LEFT].y, thispoints[LEFT].x, thispoints[LEFT].y)) {
				player.superBoost(-0.5);
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