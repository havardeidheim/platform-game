package source {
	import flash.media.Sound;
	import flash.media.SoundChannel;
	import flash.media.SoundTransform;
	
	public class Sounds {
		
		private static var sounds:Vector.<Sound> = new Vector.<Sound>();
		private static var channel:SoundChannel;
		private static var transform:SoundTransform;
		
		public static function load() {
			//sounds.push(new Musikk1());
		}
		public static function playMusic(levelnr:int) {
			//channel = sounds[0].play(0, 120);
			//transform = new SoundTransform(0.5);
			//channel.soundTransform = transform;
		}
		public static function stopAllSounds() {
			//channel.stop();
		}
		public static function mute() {
			/*if (channel == null) {
				return;
			}
			transform = new SoundTransform(0);
			channel.soundTransform = transform;*/
		}
		public static function unMute(){
			/*transform = new SoundTransform(0.5);
			channel.soundTransform = transform;*/
		}
		public static function isMuted():Boolean {
			/*if (transform.volume == 0) {
				return true;
			}*/
			return false;
		}
		public static function isPlaying():Boolean {
			/*if (channel == null) {
				return false;
			}*/
			return false;
		}
	}//END
}//END