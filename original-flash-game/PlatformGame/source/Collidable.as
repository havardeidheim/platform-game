package  source{
	
	import flash.geom.Point;
	import flash.geom.Rectangle;
	
	public interface Collidable {
		
		function getCollidiableBounds():Rectangle;
		function hitTest(player:Player, normal:Point):Boolean;
		
	}//END
}//END