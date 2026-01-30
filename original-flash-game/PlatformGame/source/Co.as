package source{
	import flash.geom.Point;
	
	public class Co {

		public static const X_MAX_SPEED:Number = 4;//4
		public static const Y_MAX_SPEED:Number = 10;//10
		
		public static const X_ACCELERATION:Number = 0.6;//0.6
		public static const Y_ACCELERATION:Number = 7;//7
		
		public static const GRAVITY:Number = 0.3;//0.3
		public static const FRICTION:Number = 0.1;//0.1
		
		public static function clamp(value:Number, a:Number, b:Number):Number {
			var vtoa:Number = Math.abs(value - a);
			var vtob:Number = Math.abs(value - b);
			 if (Math.min(vtoa, vtob) == vtoa) {
				return a;
			 }
			 return b;
		}
		
		public static function linesIntersect(x1:Number, y1:Number, x2:Number, y2:Number, x3:Number, y3:Number,x4:Number, y4:Number):Boolean { 
		  var bx:Number = x2 - x1; 
		  var by:Number = y2 - y1; 
		  var dx:Number = x4 - x3; 
		  var dy:Number = y4 - y3;
		  var b_dot_d_perp:Number = bx * dy - by * dx;
		  if(b_dot_d_perp == 0) {
			return false;
		  }
		  var cx:Number = x3 - x1;
		  var cy:Number = y3 - y1;
		  var t:Number = (cx * dy - cy * dx) / b_dot_d_perp;
		  if(t < 0 || t > 1) {
			return false;
		  }
		  var u:Number = (cx * by - cy * bx) / b_dot_d_perp;
		  if(u < 0 || u > 1) { 
			return false;
		  }
		  return true;
		}
		
		/*private static function transformY(yy:Number):Number {
			return 480 - yy;
		}
		
		public static function linesIntersect(p1:Point, p2:Point, p3:Point, p4:Point):Boolean{
			var x1:Number = p1.x;
			var y1:Number = transformY(p1.y);
			var x2:Number = p2.x;
			var y2:Number = transformY(p2.y);
			var x3:Number = p3.x;
			var y3:Number = transformY(p3.y);
			var x4:Number = p4.x;
			var y4:Number = transformY(p4.y);
			
			var inupx:Number = (x1*y2 - y1*x2)*(x3-x4) - (x1-x2)*(x3*y4 - y3*x4);
			var inupy:Number = (x1*y2 - y1*x2)*(y3-y4) - (y1-y2)*(x3*y4 - y3*x4);
			
			var indox:Number = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
			var indoy:Number = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
			
			if(indox == 0 || indoy == 0){
				return false;
			}
			
			var inx:Number = inupx/indox;
			var iny:Number = inupy/indoy;
			
			//If the point of intersection dosen't exist on the lines, they dont intersect
			if(inx < Math.min(x1, x2) || inx > Math.max(x1, x2) || inx < Math.min(x3, x4) || inx > Math.max(x3, x4) || iny < Math.min(y1, y2) || iny > Math.max(y1, y2) || iny < Math.min(y3, y4) || iny > Math.max(y3, y4)){
				return false;
			}
			return true;
		}*/
		
	}//END
}//END
