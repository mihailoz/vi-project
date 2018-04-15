package ai.Controlers;


import common.BulletProperties;
import common.Decision;
import common.ShipProperties;

import static ai.MathMethods.AngleCalculator.*;

public class StandardController extends AIController {


    public Decision turnToAttack(ShipProperties myShip, ShipProperties enemyShip) {

        int xDifference = enemyShip.getX() - myShip.getX();
        if (xDifference == 0)
            if (enemyShip.getAngle() == myShip.getAngle())
                return null;
        double myAngle = angleConverter(myShip.getAngle());
        double targetAngle = angleBetweenObjects(myShip, enemyShip);


        if (Math.abs(targetAngle - myAngle) > Math.PI) {
            if (targetAngle - myAngle < 0)
                return Decision.LEFT;
            if (targetAngle == myAngle)
                return null;
            return Decision.RIGHT;
        }
        if (targetAngle - myAngle < 0)
            return Decision.RIGHT;
        if (targetAngle == myAngle)
            return null;
        return Decision.LEFT;

    }


    public boolean mustDodge(BulletProperties bullet, ShipProperties myShip, ShipProperties enemyShip) {

        double bulletAngle = angleConverter(bullet.getAngle());

        double shipAngle = angleConverter(myShip.getAngle());


        //if the bullet is on the other side, we don't really worry about it
        if (shipAngle <= bulletAngle + Math.PI / 4 && shipAngle >= bulletAngle - Math.PI / 4)
            return false;


        //Checking if any of the edges of the ship will get hit
        boolean result = false;

        for (int i = 0; i < SHIP_WIDTH; i++)
            if (dodgeFunction(bullet, shipAngle, myShip.getX() - SHIP_WIDTH / 2 + i, myShip.getY() - SHIP_HEIGHT / 2))
                return true;


        for (int i = 0; i < SHIP_WIDTH; i++)
            if (dodgeFunction(bullet, shipAngle, myShip.getX() - SHIP_WIDTH / 2, myShip.getY() - SHIP_HEIGHT / 2 + i))
                return true;

        for (int i = 0; i < SHIP_HEIGHT; i++)
            if (dodgeFunction(bullet, shipAngle, myShip.getX() + SHIP_WIDTH / 2, myShip.getY() + SHIP_HEIGHT / 2 - i))
                return true;

        for (int i = 0; i < SHIP_HEIGHT; i++)
            if (dodgeFunction(bullet, shipAngle, myShip.getX() + SHIP_WIDTH / 2 + i, myShip.getY() + SHIP_HEIGHT / 2))
                return true;

        return dodgeFunction(bullet, shipAngle, myShip.getX() + SHIP_WIDTH / 2, myShip.getY()) ||
                dodgeFunction(bullet, shipAngle, myShip.getX() - SHIP_WIDTH / 2, myShip.getY()) ||
                dodgeFunction(bullet, shipAngle, myShip.getX(), myShip.getY() + SHIP_HEIGHT / 2) ||
                dodgeFunction(bullet, shipAngle, myShip.getX(), myShip.getY() - SHIP_HEIGHT / 2);

    }

    private boolean dodgeFunction(BulletProperties bullet, double shipAngle, int shipX, int shipY) {

        double bulletAngle = angleConverter(bullet.getAngle());
        int bulletX = bullet.getX();
        int bulletY = bullet.getY();
//      TODO if the bullet and ship angle are going very close into eachother, dodge
        //invertedAngle helps with checking if the bullet and the ship are going almost direct into eachother
        //this is needed because we can calculate precisely just for certain points, and not the whole ship
        //and that can cause some obvious direct bullets to not be dodged
        double invertedAngle = (shipAngle + Math.PI) % (2 * Math.PI);
        //this mostly happens only in the beginning

        if (closeEnough(shipX, bulletX, SHIP_WIDTH * 2))
            if (closeEnough(invertedAngle, bulletAngle, Math.PI / 18)) {
                ShipProperties ship = new ShipProperties();

                ship.setX(shipX);
                ship.setY(shipY);
                double bulletShipAngle = angleBetweenObjects(bullet, ship);
                if (closeEnough(bulletShipAngle, bulletAngle, Math.PI / 9)) {
                    return true;
                }
            }
        //when  will the bullets collide
        //shipX + cos(shipAngle)*t*shipSpeed = bulletX + cos(bulletAngle)*t*bulletSpeed
        //t = tCollide
        double tCollide = (shipX - bulletX) / (Math.cos(bulletAngle) * BULLET_VELOCITY - Math.cos(shipAngle) * SHIP_VELOCITY);
        if (tCollide < 0) {
            return false;
        }
        double bulletXAfterT = bulletX + tCollide * Math.cos(bulletAngle) * BULLET_VELOCITY;
        if (bulletXAfterT > mapWidth || bulletXAfterT < 0) {
            return false;
        }
        if (closeEnough(shipY + Math.sin(shipAngle) * SHIP_VELOCITY * tCollide,
                bulletY + Math.sin(bulletAngle) * BULLET_VELOCITY * tCollide, SHIP_WIDTH))
            return false;
        double bulletYAfterT = bulletY + tCollide * Math.sin(bulletAngle) * BULLET_VELOCITY;
        if (bulletYAfterT > mapHeight || bulletYAfterT < 0) {
            return false;
        }

        return true;
    }


    public Decision turnToDodge(ShipProperties myShip, ShipProperties enemyShip, BulletProperties nearest, BulletProperties secondNearest) {
        double nearestAngle = nearest.getAngle();
        if (secondNearest != null) {
            double secondNearestAngle = secondNearest.getAngle();
            if (nearestAngle > secondNearestAngle)
                return Decision.LEFT;
        }
        return Decision.RIGHT;
    }

    public boolean shoot(ShipProperties myShip, ShipProperties enemyShip) {
        return closeEnough(angleBetweenObjects(myShip, enemyShip), angleConverter(myShip.getAngle()), Math.PI / 4);
    }
}
