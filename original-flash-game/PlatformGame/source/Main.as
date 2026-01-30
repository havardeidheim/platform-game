package source {
	
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.events.MouseEvent;
	
	public class Main extends MovieClip {
		
		private var lydknapp:MovieClip;
		
		private var menu:Menu;
		private var game:Game;
		
		public function Main() {
			//Multitouch.inputMode = MultitouchInputMode.TOUCH_POINT;
			//NativeApplication.nativeApplication.addEventListener(Event.ACTIVATE, onActivate);
			//NativeApplication.nativeApplication.addEventListener(Event.DEACTIVATE, onDeactivate);
			
			Levels.load();
			Archivements.load();
			//Sounds.load();
			//Sounds.playMusic(0);
			
			menu = new Menu(this);
			addChild(menu);
			
			/*lydknapp = new MuteKnapp();
			lydknapp.stop();
			lydknapp.buttonMode = true;
			lydknapp.useHandCursor = true;
			lydknapp.addEventListener(MouseEvent.CLICK, function() {
				if (!Sounds.isPlaying()) {
					return;
				}
				if (Sounds.isMuted()) {
					Sounds.unMute();
					lydknapp.gotoAndStop(0);
					
				}else {
					Sounds.mute();
					lydknapp.gotoAndStop(1);
				}
			});
			addChild(lydknapp);*/
			
		}
		function onActivate(e:Event){
			/*stage.frameRate = 40;
			if (game != null && contains(game)) {
				game.unpauseGame();
			}*/
		}
		function onDeactivate(e:Event){
			/*stage.frameRate = 10;
			if (game != null && contains(game)) {
				game.pauseGame();
			}*/
		}
		public function newGame(levelnr:int) {
			removeChild(menu);
			menu = null;
			game = new Game(this, levelnr)
			addChildAt(game, 0);
			game.focusRect = false;
			stage.focus = game;
		}
		public function showMenu() {
			removeChild(game);
			game = null;
			menu = new Menu(this);
			addChildAt(menu, 0);
			menu.focusRect = false;
			stage.focus = menu;
		}
	}//END
}//END
