package source {
	
	import flash.display.CapsStyle;
	import flash.display.DisplayObject;
	import flash.display.MovieClip;
	import flash.events.TimerEvent;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.utils.Timer;

	public class UpPlatform extends AbstractObject{
		
		private var canfall:Boolean = false;
		private var falling:Boolean = false;
		private var yfart:Number = 0;
		private var started:Boolean = false;
		
		private var didcollide:Boolean = false;
		private var pl:Player;
		
		private var startfalltimer:Timer;
		private var spawntimer:Timer;
		
		public function UpPlatform(canfall:Boolean, xx:int, yy:int, aWidth:int) {
			super(xx,yy);
			this.canfall = canfall;
			//this.downarrow1.visible = canfall ? true : false;
			//this.downarrow2.visible = canfall ? true : false;
			this.x = xx;
			this.y = yy;
			//this.width = aWidth;
			this.graphics.beginFill(0x333333, 1);
			this.graphics.drawRect(0, 0, aWidth, 20); 
			if (canfall) {
				this.graphics.lineStyle(3, 0xFFFF00, 1, false, "normal", CapsStyle.NONE);
			}else {
				this.graphics.lineStyle(3, 0x0099CC, 1, false, "normal", CapsStyle.NONE);
			}
			this.graphics.lineTo(aWidth, 0);
		}
		public override function getCollidiableBounds():Rectangle {
			 return new Rectangle(this.x, this.y, this.width, this.height);
		}
		public override function reset() {
			super.reset();
			this.yfart = 0;
			if (startfalltimer != null) {
				startfalltimer.stop();
				startfalltimer.removeEventListener(TimerEvent.TIMER, startfalling, false);
			}
			if (spawntimer != null) {
				spawntimer.stop();
				spawntimer.removeEventListener(TimerEvent.TIMER, finishfalling, false);
			}
			falling = false;
			started = false;
			didcollide = false;
		}
		public override function hitTest(player:Player, normal:Point):Boolean {
			var b:Rectangle = this.getCollidiableBounds();
			pl = player;
			didcollide = false;
			if (player.lastBounds.bottom <= b.top && player.bounds.bottom >= b.top && player.bounds.right >= b.left && player.bounds.left <= b.right) {
				normal.x = 0;
				normal.y = b.top - player.bounds.bottom;
				if (canfall && !started) {
					startfalltimer = new Timer(500, 1);
					startfalltimer.addEventListener(TimerEvent.TIMER, startfalling, false, 0, true);
					startfalltimer.start();
					started = true;
				}
				didcollide = true;
				return true;
			}
			return false;
		}
		public override function loop() {
			if (!canfall) {
				return;
			}
			if (falling) {
				fall();
			}
			if (didcollide) {
				pl.y += (yfart + 1);
			}
		}
		private function startfalling(e:TimerEvent) {
			falling = true;
			spawntimer = new Timer(3000, 1);
			spawntimer.addEventListener(TimerEvent.TIMER, finishfalling, false, 0, true);	
			spawntimer.start();
		}
		private function finishfalling(e:TimerEvent) {
			falling = false;
			started = false;
			this.x = startX;
			this.y = startY; 
			yfart = 0;
		}
		private function fall() {
			if (falling && yfart < Co.Y_MAX_SPEED) {
				yfart += Co.GRAVITY;
				if (yfart > Co.Y_MAX_SPEED) {
					yfart = Co.Y_MAX_SPEED;
				}
			}
			y += yfart;
		}
		
	}//END
}//END