package ai.Controlers;


import common.*;

import java.util.List;

import static ai.MathMethods.AngleCalculator.angleBetweenObjects;
import static ai.MathMethods.AngleCalculator.angleConverter;
import static ai.MathMethods.AngleCalculator.closeEnough;
import static ai.MathMethods.DistanceCalculator.distanceBetweenObjects;

public class StandardController extends AIController{

    private final static int MINIMAL_DISTANCE = 600;
    private boolean tooClose = false;
    private final static int PREFERED_DISTANCE = 1200;

    private void debugg(ShipProperties blueShip, ShipProperties redShip, List<BulletProperties> bullets){
        double d = 0;
        if(!bullets.isEmpty())
            d = bullets.get(0).getAngle();
        System.out.println("BlueShip: " + angleConverter(blueShip.getAngle()) + " Red ship: " + angleConverter(redShip.getAngle())
                + " Bullet angle: " + angleConverter(d));
    }



    public Decision turnToAttack(ShipProperties myShip, ShipProperties enemyShip) {
//        if(true)
//            return null;
        System.out.println("DISTANCE IS: " + distanceBetweenObjects(myShip,enemyShip));
//        if(!tooClose && distanceBetweenObjects(myShip,enemyShip) < MINIMAL_DISTANCE) {
//            tooClose = true;
//        }
        int xDifference = enemyShip.getX() - myShip.getX();
        if(xDifference==0)
            if(enemyShip.getAngle()==myShip.getAngle())
                return null;
        double myAngle = angleConverter(myShip.getAngle());
        //int yDifference = enemyShip.getY() - myShip.getY();
        //double distance = Math.sqrt(xDifference*xDifference + yDifference*yDifference);
        //System.out.println("xDifference: " + xDifference + "  yDifference: "+ yDifference +"  distance: " + distance);
        double targetAngle = angleBetweenObjects(myShip, enemyShip);

        //korektovanje ugla nakon racunanja
//        if(yDifference>0){
//            if(xDifference>0)
//                targetAngle = 2*Math.PI - targetAngle;
//            else
//                targetAngle = targetAngle + Math.PI;
//            //done
//        }
//        else{
//            if(xDifference>0)
//                targetAngle = targetAngle;
//            //done
//            else
//                targetAngle = Math.PI - targetAngle;
//            //done
//        }
        //targetAngle = targetAngle%(Math.PI*2);
        //System.out.println("Target angle: " + targetAngle + "  My angle: " + myAngle);
        //System.out.println();

        if(Math.abs(targetAngle-myAngle)>Math.PI){
            if(targetAngle-myAngle<0)
                return Decision.LEFT;
            if(targetAngle==myAngle)
                return null;
            return Decision.RIGHT;
        }
        if(targetAngle-myAngle<0)
            return Decision.RIGHT;
        if(targetAngle==myAngle)
            return null;
        return Decision.LEFT;


        //TODO make sure that the ship isn't too close to the enemy ship

//
//        if(xDifference==0)
//            xDifference=1;
//        double myCoeficient = Math.sin(angleConverter(myShip.getAngle()))/Math.cos(angleConverter(myShip.getAngle()));
//        double targetCoeficient = (double)-1*(enemyShip.getY() - myShip.getY())/(xDifference);
//
//        System.out.println("Enemy ship: x: "+enemyShip.getX() + " y: "+enemyShip.getY() + " My ship: x: "+myShip.getX() + " y: " +myShip.getY());
//        System.out.println("My coeficient: " + myCoeficient + " Target coeficient: " + targetCoeficient);
//
//        if(myCoeficient>targetCoeficient) {
//            System.out.println("Decision to go right!");
//            return Decision.RIGHT;
//        }
//        if(myCoeficient<targetCoeficient) {
//            System.out.println("Decision to go left!");
//            return Decision.LEFT;
//        }
//        return null;
    }




    public boolean mustDodge(BulletProperties bullet, ShipProperties myShip, ShipProperties enemyShip) {
//        if(tooClose)
//            return true;
        double bulletAngle = angleConverter(bullet.getAngle());
//        System.out.println(bulletAngle);
        double shipAngle = angleConverter(myShip.getAngle());
//        double distance = Math.sqrt(Math.pow(myShip.getX() - enemyShip.getX(),2) + Math.pow(myShip.getY() - enemyShip.getY(),2));
//        TODO this if should go to attack part of the code...
//        if(distance < MINIMAL_DISTANCE)
//            return true;


        //if the bullet is on the other side, we don't really worry about it
        if(shipAngle <= bulletAngle + Math.PI/4 && shipAngle >= bulletAngle -Math.PI/4)
            return false;

        //Checking if any of the edges of the ship will get hit

        boolean result = false;

        for(int i = 0; i< SHIP_WIDTH;i++)
            if(dodgeFunction(bullet, shipAngle, myShip.getX() - SHIP_WIDTH/2+i, myShip.getY() - SHIP_HEIGHT/2))
                return true;


        for(int i = 0; i< SHIP_WIDTH;i++)
            if(dodgeFunction(bullet, shipAngle, myShip.getX() - SHIP_WIDTH/2, myShip.getY() - SHIP_HEIGHT/2 + i))
                return true;

        for(int i = 0; i< SHIP_HEIGHT;i++)
            if(dodgeFunction(bullet, shipAngle, myShip.getX() + SHIP_WIDTH/2, myShip.getY() + SHIP_HEIGHT/2 -i))
                return true;

        for(int i = 0; i< SHIP_HEIGHT;i++)
            if(dodgeFunction(bullet, shipAngle, myShip.getX() + SHIP_WIDTH/2+i, myShip.getY() + SHIP_HEIGHT/2))
                return true;

//        return dodgeFunction(bullet, shipAngle, myShip.getX(), myShip.getY());
        return dodgeFunction(bullet, shipAngle, myShip.getX()+SHIP_WIDTH/2, myShip.getY()) ||
                dodgeFunction(bullet, shipAngle, myShip.getX()-SHIP_WIDTH/2, myShip.getY()) ||
                dodgeFunction(bullet, shipAngle, myShip.getX(), myShip.getY() + SHIP_HEIGHT/2) ||
                dodgeFunction(bullet, shipAngle, myShip.getX(), myShip.getY() - SHIP_HEIGHT/2);

    }

    private boolean dodgeFunction(BulletProperties bullet, double shipAngle, int shipX, int shipY){

        double bulletAngle = angleConverter(bullet.getAngle());
        int bulletX = bullet.getX();
        int bulletY = bullet.getY();
//      TODO if the bullet and ship angle are going very close into eachother, dodge
        //invertedAngle helps with checking if the bullet and the ship are going almost direct into eachother
        //this is needed because we can calculate precisely just for certain points, and not the whole ship
        //and that can cause some obvious direct bullets to not be dodged
        double invertedAngle = (shipAngle + Math.PI) %(2*Math.PI);
        //this mostly happens only in the beginning

        if(closeEnough(shipX,bulletX,SHIP_WIDTH*2))
            if(closeEnough(invertedAngle, bulletAngle, Math.PI/18)) {
                ShipProperties ship = new ShipProperties();

                ship.setX(shipX);
                ship.setY(shipY);
                double bulletShipAngle = angleBetweenObjects(bullet, ship);
                if(closeEnough(bulletShipAngle, bulletAngle, Math.PI/9)) {
                    System.out.println("dodging due to 1st condidion");
                    System.out.println("invertedAngle:" + invertedAngle + "  bulletAngle: " + bulletAngle);
                    System.out.println("shipAngle: " + shipAngle + "  bulletAngle: " + bulletAngle);
                    System.out.println();
                    return true;
                }
            }
        //when  will the bullets collide
        //shipX + cos(shipAngle)*t*shipSpeed = bulletX + cos(bulletAngle)*t*bulletSpeed
        //t = tCollide
        double xDiff = shipX - bulletX;
        double speedSx =Math.cos(bulletAngle)*BULLET_VELOCITY;
        double speedBx = Math.cos(shipAngle)*SHIP_VELOCITY;
        double speedDiff = speedSx - speedBx;
        double t = xDiff/speedDiff;
        double tCollide = (shipX - bulletX)/(Math.cos(bulletAngle)*BULLET_VELOCITY - Math.cos(shipAngle)*SHIP_VELOCITY);
        if(tCollide < 0) {
//            System.out.println("not dodging due to tCollide < 0");
            return false;
        }
        double bulletXAfterT = bulletX + tCollide*Math.cos(bulletAngle)*BULLET_VELOCITY;
        if(bulletXAfterT > mapWidth || bulletXAfterT<0) {
//            System.out.println("not dodging due to x out of bounds");
            return false;
        }
        if(closeEnough(shipY + Math.sin(shipAngle)*SHIP_VELOCITY*tCollide,
                bulletY + Math.sin(bulletAngle)*BULLET_VELOCITY*tCollide, SHIP_WIDTH))
            return false;
        double bulletYAfterT = bulletY + tCollide*Math.sin(bulletAngle)*BULLET_VELOCITY;
        if(bulletYAfterT > mapHeight || bulletYAfterT<0) {
//            System.out.println("not dodging due to y out of bounds");
            return false;
        }

        if(!closeEnough(shipY + t*SHIP_VELOCITY*Math.sin(shipAngle), bulletYAfterT, SHIP_WIDTH/2))
            return false;
//        System.out.println("Dodging due to xy collision");
//        System.out.println("tCollide: " + tCollide);
//        System.out.println("shipX: " + shipX + "  bulletX: " + bulletX);
//        System.out.println("shipY: " + shipY + "  bulletY: " + bulletY);
//        System.out.println();
        return true;
    }

    int compareAngles(double sourceAngle, double otherAngle)
    {
        // sourceAngle and otherAngle should be in the range -180 to 180
        double difference = otherAngle - sourceAngle;

        if(difference < -180)
            difference += 360;
        if(difference > 180)
            difference -= 360;

        if(difference > 0)
            return 1;
        if(difference < 0)
            return -1;

        return 0;
    }

    public Decision turnToDodge(ShipProperties myShip, ShipProperties enemyShip, BulletProperties nearest, BulletProperties secondNearest) {
//        if(tooClose) {
//            System.out.println("WE ARE TOO CLOSE");
//            if (distanceBetweenObjects(myShip, enemyShip) > PREFERED_DISTANCE){
//                tooClose = false;
//            }
//            else{
//                double targetedAngle = angleBetweenObjects(enemyShip, myShip);
//                if(compareAngles(targetedAngle, myShip.getAngle()) == 1)
//                    return Decision.RIGHT;
//                else
//                    return Decision.LEFT;
//            }
//        }
        double nearestAngle = nearest.getAngle();
        if(secondNearest!=null) {
            double secondNearestAngle = secondNearest.getAngle();
            if (nearestAngle > secondNearestAngle)
                return Decision.LEFT;
        }
        return Decision.RIGHT;
    }

    public boolean shoot(ShipProperties myShip, ShipProperties enemyShip) {
        return closeEnough(angleBetweenObjects(myShip, enemyShip), angleConverter(myShip.getAngle()), Math.PI/4);
    }
}
