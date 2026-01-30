package source {
	
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.display.SimpleButton;
	import flash.events.MouseEvent;
	import flash.events.TouchEvent;
	import flash.events.KeyboardEvent;
	
	public class GameControls extends MovieClip{
		
		//private var left:MovieClip = new LeftButton();
		//private var right:MovieClip = new RightButton();
		//private var jump:MovieClip = new JumpButton();
		//private var dimension:MovieClip = new DimensionButton();
		//private var respawn:MovieClip = new RespawnButton();
		private var tomenu:MovieClip = new ReturnKnapp();
		
		private var dimensionupdown:Boolean = false;
		
		private var listener:GameControlsListener;
		
		public function GameControls(aListener:GameControlsListener) {
			listener = aListener;
			addEventListener(Event.ADDED_TO_STAGE, onAdd, false, 0, true);
			addEventListener(Event.REMOVED_FROM_STAGE, onRemoved, false, 0, true);
		}
		private function onRemoved(e:Event) {
			stage.removeEventListener(KeyboardEvent.KEY_DOWN, keyClicked, false);
			stage.removeEventListener(KeyboardEvent.KEY_UP, keyReleased, false);
		}
		private function onAdd(e:Event){
			/*/Touch
			left.x = 5;
			left.y = 375;
			left.addEventListener(TouchEvent.TOUCH_BEGIN, leftClicked, false, 0, true);
			left.addEventListener(TouchEvent.TOUCH_OVER, leftClicked, false, 0, true);
			left.addEventListener(TouchEvent.TOUCH_END, leftReleased, false, 0, true);
			left.addEventListener(TouchEvent.TOUCH_OUT, leftReleased, false, 0, true);
			addChild(left);
			
			right.x = 110;
			right.y = 375;
			right.addEventListener(TouchEvent.TOUCH_BEGIN, rightClicked, false, 0, true);
			right.addEventListener(TouchEvent.TOUCH_OVER, rightClicked, false, 0, true);
			right.addEventListener(TouchEvent.TOUCH_END, rightReleased, false, 0, true);
			right.addEventListener(TouchEvent.TOUCH_OUT, rightReleased, false, 0, true);
			addChild(right);
			
			jump.x = 695;
			jump.y = 375;
			jump.addEventListener(TouchEvent.TOUCH_BEGIN, jumpClicked, false, 0, true);
			jump.addEventListener(TouchEvent.TOUCH_OVER, jumpClicked, false, 0, true);
			addChild(jump);
			
			dimension.x = 590;
			dimension.y = 375;
			dimension.addEventListener(TouchEvent.TOUCH_BEGIN, dimensionClicked, false, 0, true);
			dimension.addEventListener(TouchEvent.TOUCH_OVER, dimensionClicked, false, 0, true);
			dimension.addEventListener(TouchEvent.TOUCH_END, dimensionReleased, false, 0, true);
			dimension.addEventListener(TouchEvent.TOUCH_OUT, dimensionReleased, false, 0, true);
			addChild(dimension);
			
			respawn.x = 350;
			respawn.y = -50;
			respawn.addEventListener(TouchEvent.TOUCH_BEGIN, respawnClicked, false, 0, true);
			respawn.addEventListener(TouchEvent.TOUCH_OVER, respawnClicked, false, 0, true);
			addChild(respawn);
			*/
			
			//keyboard & mouse
			stage.addEventListener(KeyboardEvent.KEY_DOWN, keyClicked, false, 0, true);
			stage.addEventListener(KeyboardEvent.KEY_UP, keyReleased, false, 0, true);
			
			tomenu.x = 40;
			tomenu.buttonMode = true;
			tomenu.useHandCursor = true;
			tomenu.addEventListener(MouseEvent.CLICK, tomenuClicked, false, 0, true);
			addChild(tomenu);
			
		}
		private function keyClicked(e:KeyboardEvent){
			if (e.keyCode == 65) {
				listener.leftClicked();
			}
			else if (e.keyCode == 68) {
				listener.rightClicked();
			} 
			else if (e.keyCode == 87) {
				listener.jumpClicked();
			} 
			else if (e.keyCode == 32) {
				listener.dimensionClicked();
			} 
			else if (e.keyCode == 82) {
				listener.respawnClicked();
			} 
		}
		private function keyReleased(e:KeyboardEvent){
			if (e.keyCode == 65) {
				listener.leftReleased();
			}
			else if (e.keyCode == 68) {
				listener.rightReleased();
			} 
		}
		private function rightClicked(e:TouchEvent){
			listener.rightClicked();
		}
		private function rightReleased(e:TouchEvent){
			listener.rightReleased();
		}
		private function leftClicked(e:TouchEvent){
			listener.leftClicked();
		}
		private function leftReleased(e:TouchEvent){
			listener.leftReleased();
		}
		private function jumpClicked(e:TouchEvent){
			listener.jumpClicked();
		}
		private function dimensionClicked(e:TouchEvent) {
			if (!dimensionupdown) {
				listener.dimensionClicked();
				dimensionupdown = true;
			}
		}
		private function dimensionReleased(e:TouchEvent) {
			dimensionupdown = false;
		}
		private function respawnClicked(e:TouchEvent){
			listener.respawnClicked();
		}
		private function tomenuClicked(e:MouseEvent) {
			listener.toMenuClicked();
		}
		

	}//END
}//END
