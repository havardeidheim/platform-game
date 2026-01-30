package source{
	
	import adobe.utils.CustomActions;
	import flash.net.SharedObject;
	
	public class Archivements {
		
		private static var scorearray:Vector.<int> = new Vector.<int>();
		private static var framesarray:Vector.<int> = new Vector.<int>();
		private static var lager:SharedObject;
		
		private static var scoreLimits:Vector.<Vector.<int>> = new Vector.<Vector.<int>>();
		
		public static function load() {
			scoreLimits[0] = Vector.<int>([36, 38, 40, 42]);
			scoreLimits[1] = Vector.<int>([105, 108, 112, 120]);
			scoreLimits[2] = Vector.<int>([188, 191, 196, 210]);
			scoreLimits[3] = Vector.<int>([170, 175, 180, 200]);
			scoreLimits[4] = Vector.<int>([153, 156, 165, 175]);
			scoreLimits[5] = Vector.<int>([0, 0, 0, 0]);
			scoreLimits[6] = Vector.<int>([0, 0, 0, 0]);
			scoreLimits[7] = Vector.<int>([0, 0, 0, 0]);
			scoreLimits[8] = Vector.<int>([0, 0, 0, 0]);
			scoreLimits[9] = Vector.<int>([0, 0, 0, 0]);
			
			lager = SharedObject.getLocal("no.platform");
			lager.clear();
			if (lager.data.score == null || lager.data.frames == null) {
				lager.data.score = new Vector.<int>();;
				lager.data.frames = new Vector.<int>();;
				for (var i:int = 0; i < Levels.getLevelCount(); i++ ) {
					scorearray[i] = 0;
					framesarray[i] = 10000*4;
					lager.data.score[i] = 0;
					lager.data.frames[i] = 10000*4;
				}
			}else {
				for (var j:int = 0; j < Levels.getLevelCount(); j++ ) {
					scorearray[j] = lager.data.score[j];
					framesarray[j] = lager.data.frames[j];
				}
			}
		}
		
		public static function setscore(levelnr:int, frames:int) {
			var displayframes = framesToDisplayframes(frames);
			var nystars = starsforframes(levelnr, frames);
			if (nystars > scorearray[levelnr]) {
				scorearray[levelnr] = nystars;
				lager.data.score[levelnr] = nystars;
			}
			
			if (frames < framesarray[levelnr]) {
				framesarray[levelnr] = frames;
				lager.data.frames[levelnr] = frames;
			}
		}
		
		public static function getstars(levelnr:int):int {
			return scorearray[levelnr];
		}
		public static function getDisplayFrames(levelnr:int):int {
			return framesarray[levelnr] / 4;
		}
		public static function framesToDisplayframes(frames:int):int {
			return frames / 4;
		}
		private static function starsforframes(levelnr:int, frames:int):int {
			frames = framesToDisplayframes(frames);
			for (var i:int = 0; i < 4; i++ ) {
				if (frames <= scoreLimits[levelnr][i]) {
					return 5 - i;
				}
			}
			return 1;
		}
		
	}//END
}//END