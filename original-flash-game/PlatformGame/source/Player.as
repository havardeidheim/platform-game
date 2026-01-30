package  source {
	
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.events.KeyboardEvent;
	import flash.events.TimerEvent;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.utils.Timer;
	
	public class Player extends MovieClip{

		private var moveRight:Boolean = false;
		private var moveLeft:Boolean = false;
		
		private var xfart:Number = 0;
		private var yfart:Number = 0;
		
		private var falling:Boolean = true;
		private var canjump:Boolean = false;
		private var jumping:Boolean = false;
		
		private var privlastpos:Point;
		private var game:Game;
		
		public var slideLeft:Boolean = false;
		public var slideRight:Boolean = false;
		
		public var startXX:int;
		public var startYY:int;
		
		public function Player(xx:int, yy:int, ga:Game) {
			this.game = ga;
			this.x = xx;
			this.y = yy;
			startXX = xx;
			startYY = yy;
			this.privlastpos = new Point(xx, yy);
		}
		public function movePlayerLeft(){
			moveLeft = true;
		}
		public function stopMovePlayerLeft(){
			moveLeft = false;
		}
		public function movePlayerRight(){
			moveRight = true;
		}
		public function stopMovePlayerRight(){
			moveRight = false;
		}
		public function jump(){
			if (canjump) {
				yfart = - Co.Y_ACCELERATION;
				canjump = false;
				jumping = true;
				falling = true;
			}
			if (slideLeft && moveLeft) {
				superBoost(0.4);
			}else if (slideRight && moveRight) {
				superBoost(-0.4);
			}else if (slideRight) {
				x += 1;
				superBoost(-0.2);
			}else if (slideLeft) {
				x -= 1;
				superBoost(0.2);
			}
		}
		public function superJump(dir:Number){
			yfart = - Co.Y_ACCELERATION * 1.5 * dir;
			canjump = false;
			jumping = true;
			falling = true;
		}
		public function superBoost(dir:Number){
			xfart = - Co.Y_ACCELERATION * 2 * dir;
			canjump = false;
			jumping = true;
			falling = true;
		}
		public function collide(change:Point) {
			x += change.x;
			y += change.y;
			if (change.x > 0) {
				xfart = 0;
			}else if (change.x < 0) {
				xfart = 0;
			}
			if (change. y > 0) {
				falling = true;
				yfart = 0;
			}else if (change.y < 0) {
				yfart = 0;
				canjump = true;
				falling = false;
				jumping = false;
			}
			
			if (slideLeft || slideRight) {
				canjump = true;
				falling = true;
				jumping = false;
			}
		}
		public function noCollision() {
			falling = true;
			canjump = false;
			slideLeft = false;
			slideRight = false;
		}
		public function reachedCheckpoint(che:CheckPoint) {
			game.setCheckpoint(che);
		}
		public function die() {
			game.reset();
		}
		public function win() {
			game.win();
		}
		public function get bounds():Rectangle{
			return new Rectangle(this.x, this.y, this.width, this.height);
		}
		public function get lastBounds():Rectangle {
			return new Rectangle(privlastpos.x, privlastpos.y, this.width, this.height);
		}
		public function set lastPosition(p:Point){
			privlastpos = p;
		}
		public function loop() {
			//gravitasjon
			if (falling && yfart < Co.Y_MAX_SPEED) {
				yfart += Co.GRAVITY;
				if (yfart > Co.Y_MAX_SPEED) {
					yfart = Co.Y_MAX_SPEED;
				}
			}
			//bevegelse
			if (moveLeft){
				if (!falling && xfart > - Co.X_MAX_SPEED){
					xfart -= Co.X_ACCELERATION;
				}else if (xfart > - Co.X_MAX_SPEED) {
					xfart -= Co.X_ACCELERATION / 4;
				}
			}
			if (moveRight){
				if (!falling && xfart < Co.X_MAX_SPEED){
					xfart += Co.X_ACCELERATION;
				}else if (xfart < Co.X_MAX_SPEED) {
					xfart += Co.X_ACCELERATION / 4;
				}
			}
			//Friksjon
			if (!moveRight && xfart > 0){
				xfart -= Co.FRICTION;
			}
			else if (!moveLeft && xfart < 0){
				xfart += Co.FRICTION;
			}
			
			if (Math.abs(xfart) <= Co.FRICTION) {
				xfart = 0;
			}			
			privlastpos.x = this.x;
			privlastpos.y = this.y;
			x += xfart;
			if (falling) {
				y += yfart;
			}
		}

	}//END
}//END
