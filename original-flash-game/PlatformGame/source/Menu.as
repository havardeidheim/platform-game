package source {
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.media.Sound;
	import flash.media.SoundChannel;
	
	public class Menu extends MovieClip{
		
		private var main:Main;
		
		public function Menu(main:Main) {
			this.main = main;
			addEventListener(Event.ADDED_TO_STAGE, onAdd);
		}
		private function onAdd(e:Event) {
			for (var i:int = 0; i < Levels.getLevelCount(); i++) {
				var menuButton:MenuKnapp = new MenuKnapp(this, i);
				menuButton.x = 15 + 70 * i;
				menuButton.y = 300;
				menuButton.buttonMode = true;
				menuButton.useHandCursor = true;
				menuButton.tekstfelt.text = "" + (i + 1);
				addChild(menuButton);
				
				for (var j:int = 0; j < Archivements.getstars(i); j++ ) {
					var star:MovieClip = new MenuStar();
					star.x = 1 + menuButton.x + 12 * j;
					star.y = menuButton.y + menuButton.height + 5;
					addChild(star);
				}
			}
		}
		public function newGame(lvlnr:int) {
			main.newGame(lvlnr);
		}
		
	}//END
}//END