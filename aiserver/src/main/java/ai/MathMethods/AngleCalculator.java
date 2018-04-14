package ai.MathMethods;

import ai.Contracts.Calculable;
import common.ShipProperties;


public class AngleCalculator {


    //converts the angles to a standard 2PI circle form, the game has a different base for whatever reason
    public static double angleConverter(double angle){
        if(angle<0)
            return angle*-1;
        else if(angle>0)
            return Math.PI*2 -angle;
        return 0;
    }

    public static boolean closeEnough(double angle1, double angle2, double amount){
        return (angle1 >= angle2 - amount) && (angle1 <= angle2 + amount);
    }

    public static double angleBetweenObjects(Calculable c1, Calculable c2){
        double xDiff = c2.getX() - c1.getX();
        double yDiff = c2.getY() - c1.getY();
        double distance = Math.sqrt(xDiff*xDiff + yDiff*yDiff);
        //calculating this angle in the xDiff yDiff dist triangle
        double angle = Math.acos(Math.abs(xDiff/distance));

        //now we apply the changes so that the angle points into the right way(quadrant)
        if(yDiff > 0) {
            if (xDiff > 0)
                //the xDiff yDiff > 0 would usually stay the same, but the engine is starting from the top left corner...
                angle = 2 * Math.PI - angle;
            else
                angle = angle + Math.PI;
        }else{
            if(xDiff > 0)
                //its obvious that this line is pointless, but its there for easier understanding of the conversion for
                //me, as well as for whoever might come across
                angle = angle;
            else
                angle = Math.PI - angle;
        }

        //make sure the angle still fits the format
        angle = angle % (2*Math.PI);

        return angle;
    }
}
