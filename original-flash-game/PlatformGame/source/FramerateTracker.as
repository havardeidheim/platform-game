package source{

import flash.display.Sprite;
import flash.events.Event;
import flash.text.TextField;
import flash.utils.getTimer;

public class FramerateTracker extends Sprite{
	
	private var time:int;
	private var prevTime:int = 0;
	private var fps:int;
	private var tekstfelt:TextField;
	private var frames:int = 0;
	private var totalframes:int = 0;
	
	public function FramerateTracker(){
		tekstfelt = new TextField();
		tekstfelt.selectable = false;
		addChild(tekstfelt);
		//addEventListener(Event.ENTER_FRAME, updatefps);
	}
	private function updatefps(e:Event) {
		time = getTimer();
		fps = 1000 / (time - prevTime);
		tekstfelt.text = "FPS: " + fps + "(" + (fps * 2) + ")";
		prevTime = getTimer();
	}
	
}//END
}//END