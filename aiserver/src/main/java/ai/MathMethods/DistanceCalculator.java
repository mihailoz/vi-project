package ai.MathMethods;

import ai.Contracts.Calculable;

public class DistanceCalculator {
    public static double distanceBetweenObjects(Calculable c1, Calculable c2) {
        double xDiff = c1.getX() - c2.getX();
        double yDiff = c1.getY() - c2.getY();
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    }
}
