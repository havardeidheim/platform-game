package source {
	
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.geom.Point;
	import flash.geom.Rectangle;
	import flash.utils.getTimer;
	import flash.events.MouseEvent;
	
	public class Game extends MovieClip implements GameControlsListener{
		
		private var levelnr:int;
		private var player:Player;
		
		private const STARTDIMENSION:Boolean = true;
		private var dimension:Boolean = STARTDIMENSION;
		
		private var objekter:Array = new Array();
		private var startpos:Point = new Point(0, 0);
		
		private var checkpoint:CheckPoint;
		
		private var frames:int = 0;
		private var checkpointframes:int = 0;
		private var timeField:TimeField = new TimeField();
		
		private var firstspawn:Boolean = true;
		private var respawn:Boolean = true;
		
		private var returnknapp:MovieClip;
		
		private var main:Main;
		private var controls:GameControls;
		
		public function Game(main:Main, levelnr:int) {
			this.main = main;
			this.levelnr = levelnr;
			
			addEventListener(Event.ADDED_TO_STAGE, onAdd, false, 0, true);
			addEventListener(Event.REMOVED_FROM_STAGE, onRemoved, false, 0, true);
			addEventListener(Event.ENTER_FRAME, loop);
		}
		private function onAdd(e:Event) {
			init();
			controls = new GameControls(this);
			controls.focusRect = false;
			stage.focus = controls;
			addChild(controls);
		}
		private function onRemoved(e:Event) {
			removeEventListener(Event.ENTER_FRAME, loop);
		}
		
		public function pauseGame(){
			removeEventListener(Event.ENTER_FRAME, loop);
		}
		public function unpauseGame(){
			addEventListener(Event.ENTER_FRAME, loop);
		}
		
		public function setCheckpoint(che:CheckPoint) {
			if (checkpoint != che && checkpoint != null) {
				checkpoint.gotoAndStop("still");
			}
			if(checkpoint == null || checkpoint != che){
				checkpoint = che;
				checkpointframes = frames;
			}
		}
		private function init() {
			timeField.x = 2;
			timeField.y = 35;
			addChild(timeField);
			
			objekter = Levels.getLevel(levelnr);
			
			for each (var at:AbstractObject in objekter[STARTDIMENSION]) {
				at.setAlpha(1);
				addChildAt(at, 0);
			}
			for each (var af:AbstractObject in objekter[!STARTDIMENSION]) {
				af.setAlpha(0.2);
				addChildAt(af, 0);
			}
			
			for each (var att:AbstractObject in objekter[STARTDIMENSION]) {
				if(att is DangerousArea){
					setChildIndex(att, 0);
				}
			}
			for each (var aff:AbstractObject in objekter[!STARTDIMENSION]) {
				if(aff is DangerousArea){
					setChildIndex(aff, 0);
				}
			}
			
			if (firstspawn) {
				player = new Player(0, 0, this);
			}else {
				player = new Player(checkpoint.x + 10, checkpoint.y + 10, this);
			}
			addChild(player);
			centerStage();
		}
		public function reset() {
			frames = checkpointframes;
			respawn = true;
			for each (var at:AbstractObject in objekter[STARTDIMENSION]) {
				at.setAlpha(1);
				at.reset();
			}
			for each (var af:AbstractObject in objekter[!STARTDIMENSION]) {
				af.setAlpha(0.2);
				af.reset();
			}
			
			removeChild(player)
			player = new Player(checkpoint.x + 10, checkpoint.y + 10, this);
			addChild(player);
			centerStage();
			
			player.x = checkpoint.x + 10;
			player.y = checkpoint.y + 10;
			player.lastPosition = new Point(checkpoint.x + 10, checkpoint.y + 10);
			
			dimension = STARTDIMENSION;
		}
		private function toMenu(scoreinframes:int) {
			if (scoreinframes < 10000*4) {
				Archivements.setscore(levelnr, scoreinframes);
			}
			main.showMenu();
		}
		public function win() {
			toMenu(frames);
		}
		
		private function loop(e:Event) {
			timeField.textfield.text = Archivements.framesToDisplayframes(frames) + "/" + Archivements.getDisplayFrames(levelnr);
			
			player.loop();
			//loops objects
			for each (var obf:AbstractObject in objekter[dimension]) {
				if (obf is FallingBlock) {
					obf.loop();
				}
			}
			
			var collided:Boolean = false;
			var changepos:Point = new Point(0, 0);
			//collides objects
			for each (var obc:AbstractObject in objekter[dimension]) {
				if (obc.hitTest(player, changepos)) {
					player.collide(changepos);
					collided = true;
				}
			}
			if (!collided) {
				player.noCollision();
			}
			for each (var obd:AbstractObject in objekter[dimension]) {
				if (!(obd is FallingBlock)) {
					obd.loop();
				}
			}
			for each (var obi:AbstractObject in objekter[!dimension]) {
				obi.loop();
			}
			//sikring for tilbaketilmeny
			if (stage != null) {
				centerStage();
			}
			frames++;
		}
		private function centerStage() {
			var changex:int = 0;
			var changey:int = 0;
			
			changex = (stage.stageWidth / 2) - player.x;;
			player.x = stage.stageWidth / 2;
			if (firstspawn || respawn) {
				changey = (stage.stageHeight / 2) - player.y;;
				player.y = stage.stageHeight / 2;
			}else if (player.y > (stage.stageHeight / 3) * 2) {
				changey = ((stage.stageHeight / 3) * 2) - player.y;
				player.y = ((stage.stageHeight / 3) * 2);
			}else if (player.y < (stage.stageHeight / 3) * 1 + 50) {
				changey = ((stage.stageHeight / 3) * 1) + 50 - player.y;
				player.y = ((stage.stageHeight / 3) * 1) + 50;
			}
			for each (var objt:AbstractObject in objekter[true]) {
				objt.move(changex, changey);
			}
			for each (var objf:AbstractObject in objekter[false]) {
				objf.move(changex, changey);
			}
			firstspawn = false;
			respawn = false;
		}
		//Controls Listeners
		public function leftClicked(){
			player.movePlayerLeft();
		}
		public function rightClicked(){
			player.movePlayerRight();
		}
		public function leftReleased(){
			player.stopMovePlayerLeft()
		}
		public function rightReleased(){
			player.stopMovePlayerRight();
		}
		public function jumpClicked(){
			player.jump();
		}
		public function dimensionClicked(){
			for each (var obd:AbstractObject in objekter[dimension]) {
				obd.setAlpha(0.2);
			}
			for each (var obi:AbstractObject in objekter[!dimension]) {
				obi.setAlpha(1);
			}
			dimension = !dimension;
		}
		public function respawnClicked(){
			reset();
		}
		public function toMenuClicked() {
			toMenu(10000*4);
		}

	}//END
}//END
