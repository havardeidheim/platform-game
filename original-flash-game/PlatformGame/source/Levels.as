package source{
	import fl.controls.TextArea;
	import flash.display.DisplayObjectContainer;
	import flash.display.MovieClip;
	import flash.text.TextField;
	
	public class Levels {
		
		private static var rawLevels:Vector.<MovieClip> = new Vector.<MovieClip>();
		
		public static function load() {
			rawLevels.push(new RawLevel0());
			rawLevels.push(new RawLevel1());
			rawLevels.push(new RawLevel2());
			rawLevels.push(new RawLevel3());
			rawLevels.push(new RawLevel4());
			rawLevels.push(new RawLevel5());
			rawLevels.push(new RawLevel6());
			rawLevels.push(new RawLevel7());
			rawLevels.push(new RawLevel8());
			rawLevels.push(new RawLevel9());
		}
		
		public static function getLevel(levelnr:int):Array {
			var thisRawLevel:MovieClip = (rawLevels[levelnr] as MovieClip);
			var level = new Array();
			level[true] = new Vector.<AbstractObject>();
			level[false] = new Vector.<AbstractObject>();
			for (var j:int = thisRawLevel.numChildren - 1; j >= 0; j--) {
				
				var levelObject:* = thisRawLevel.getChildAt(j);
				
				var addDimension:Boolean = ((levelObject.alpha == 1) ? true : false);
				var addAlpha:Number = ((levelObject.alpha == 1) ? 1 : 0.2);
				var addX:Number = levelObject.x;
				var addY:Number = levelObject.y;
				var addWidth:Number = levelObject.width;
				var addHeight:Number = levelObject.height;
				
				if(levelObject is BuildingBlock){
					level[addDimension].push(new Block(addX, addY, addWidth, addHeight));
				}
				else if(levelObject is BuildingFallingBlock){
					level[addDimension].push(new FallingBlock(addX, addY, addWidth, addHeight));
				}
				else if(levelObject is VannTrampolineBlock){
					level[addDimension].push(new BouncingBlock(addX, addY, addWidth, addHeight));
				}
				else if(levelObject is LoddTrampolineBlock){
					level[addDimension].push(new BouncingBlock(addX, addY, addWidth, addHeight));
				}
				else if(levelObject is CheckPointBlock){
					level[addDimension].push(new CheckPoint(addX, addY));
				}
				else if (levelObject is SagBladBlockR) {
					level[addDimension].push(new VannSagBlad(addX + 20, addY, addWidth - 40));
				}
				else if (levelObject is SagBladBlockL) {
					level[addDimension].push(new VannSagBlad(addX - 20, addY, -addWidth + 40));
				}
				else if (levelObject is SagBladBlockD) {
					level[addDimension].push(new LoddSagBlad(addX, addY + 20, addHeight - 40));
				}
				else if (levelObject is SagBladBlockU) {
					level[addDimension].push(new LoddSagBlad(addX, addY - 20, -addHeight + 40));
				}
				else if(levelObject is GoalBlock){
					level[addDimension].push(new Goal(addX, addY));
				}
				else if (levelObject is TextField) {
					level[addDimension].push(new TekstBoble(addX, addY, levelObject as TextField));
					level[!addDimension].push(new TekstBoble(addX, addY, levelObject as TextField));
				}
				else if (levelObject is DangerousBlock) {
					level[addDimension].push(new DangerousArea(addX, addY, addWidth, addHeight));
				}
				else if (levelObject is UpLeftTrampolineBlock) {
					level[addDimension].push(new BouncingBlockRot(addX, addY));
				}
				else if (levelObject is UpRightTrampolineBlock) {
					level[addDimension].push(new BouncingBlockRot(addX, addY));
				}
				else if (levelObject is BuildingSlideBlock) {
					level[addDimension].push(new SlidingBlock(addX, addY, addWidth, addHeight));
				}
				else if (levelObject is BuildingSneakyBlock) {
					level[!addDimension].push(new SneakyBlock(addX, addY, addWidth, addHeight));
				}
				else if (levelObject is BuildingInterBlock) {
					level[addDimension].push(new InterBlock(addX, addY, addWidth, addHeight));
					level[!addDimension].push(new InterBlock(addX, addY, addWidth, addHeight));
				}
			}
			return level;
		}
		
		public static function getLevelCount():int{
			return rawLevels.length;
		}
	}//END
}//END
