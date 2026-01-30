package source {
	import flash.display.MovieClip;
	import flash.events.MouseEvent;
	
	public class MenuKnapp extends MovieClip{
		
		private var ind:int;
		public function MenuKnapp(menu:Menu, i:int) {
			ind = i;
			addEventListener(MouseEvent.MOUSE_DOWN, function() {
				menu.newGame(ind);
			});
		}
		
	}//END
}//END