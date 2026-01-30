package source {
	
	public class PlayerState {
		
		public var falling:Boolean = true;
		
		public var jumping:Boolean = false;
		public var canJump:Boolean = false;
		
		private var _facingright:Boolean = true;
		private var _movingleft:Boolean;
		private var _movingright:Boolean;
		
		public function get facingright():Boolean {
			return _facingright;
		}
		
		public function get movingleft():Boolean {
			return _movingleft;
		}
		public function set movingleft(b:Boolean) {
			_movingleft = b;
			facingright = b ? false : true;
		}
		
		public function get movingright():Boolean {
			return _movingright;
		}
		public function set movingright(b:Boolean) {
			_movingright = b;
			facingright = b ? true : false;
		}
		
		
	}
}//END