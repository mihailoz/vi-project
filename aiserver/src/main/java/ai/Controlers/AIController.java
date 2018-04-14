package ai.Controlers;

import ai.Contracts.IDodge;
import com.fasterxml.jackson.databind.ObjectMapper;
import common.*;
import websocket.GameSocket;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by mihailozdravkovic on 1/27/18.
 */
public abstract class AIController {

    protected static ObjectMapper mapper = new ObjectMapper();

    //TODO this is a hotfix for the first bullet angle bug, where the first bullet angle always shows up as 0
    private boolean firstBullet = true;
    protected final static int SHIP_VELOCITY = 200;
    protected final static int BULLET_VELOCITY = 500;
    protected static int mapHeight;
    protected static int mapWidth;
    protected final static int SHIP_HEIGHT = 64;
    protected final static int SHIP_WIDTH = 96;
    protected final static int BULLET_SIZE = 16;


//    public void calculateNextMove(GameData gameData) {
//        GameProperties gameProperties = gameData.getGameProperties();
//        ShipProperties blueShip = gameData.getBlueShip();
//        ShipProperties redShip = gameData.getRedShip();
//        List<BulletProperties> blueBullets = gameData.getBlueBullets();
//
//
//
//
//
//        // Ovde imate objekat gameData i treba da ga procesirate odlucite sta cete da radite
//        // kad odlucite napravite ActionData objekat u kome cete setovati tri boolean-a (moveRight, moveLeft, fire)
//        // i to posaljete nazad igri da zna sta ste uradili, npr ovako ce brod skretati u levo i pucati:
//
//        ActionData ad = new ActionData();
//        ad.setFire(true);
//        ad.setTurnLeft(true);
//        ad.setTurnRight(false);
//
//        // Kad napravite taj objekat, saljete ga igri na sledeci nacin:
//        try {
//            if (GameSocket.connectedSession.isOpen())
//                GameSocket.connectedSession.getRemote().sendString(mapper.writeValueAsString(ad));
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
//    }

    abstract protected Decision turnToDodge(ShipProperties myShip, ShipProperties enemyShip,BulletProperties nearest, BulletProperties secondNearest);

    abstract protected Decision turnToAttack(ShipProperties myShip, ShipProperties enemyShip);

    abstract protected boolean mustDodge(BulletProperties bullet, ShipProperties myShip, ShipProperties enemyShip);

    abstract protected boolean shoot(ShipProperties myShip, ShipProperties enemyShip);


    private List<BulletProperties> nearestBullets(List<BulletProperties> bullets, ShipProperties ship) {
        int x = ship.getX();
        int y = ship.getY();
        BulletProperties nearest = null, secondNearest = null;
        double biggestDistance = Double.MAX_VALUE;
        for (BulletProperties bullet : bullets) {
            double distance = Math.sqrt(Math.pow(x - bullet.getX(), 2) + Math.pow(y - bullet.getY(), 2));
            if (distance < biggestDistance) {
                biggestDistance = distance;
                secondNearest = nearest;
                nearest = bullet;
            }
        }
        List<BulletProperties> list = new ArrayList<BulletProperties>();
        list.add(0, nearest);
        list.add(1, secondNearest);
        return list;
    }

    private ActionData calculateNextMove(GameData gameData) {
        mapHeight = gameData.getGameProperties().getHeight();
        mapWidth = gameData.getGameProperties().getWidth();

        List<BulletProperties> enemyBullets = new ArrayList<BulletProperties>();
        if (!gameData.getBlueBullets().isEmpty()) {
            enemyBullets = nearestBullets(gameData.getBlueBullets(), gameData.getRedShip());
        }

        ActionData actionData = new ActionData();
        Decision d;
        //debugg(gameData.getBlueShip(), gameData.getRedShip(), gameData.getBlueBullets());

        if (!enemyBullets.isEmpty() && mustDodge(enemyBullets.get(0), gameData.getRedShip(), gameData.getBlueShip())) {
            d = turnToDodge(gameData.getRedShip(), gameData.getBlueShip(), enemyBullets.get(0), enemyBullets.get(1));
            if (d == null) {
                actionData.setTurnLeft(false);
                actionData.setTurnRight(false);
            } else if (d.equals(Decision.RIGHT)) {
                actionData.setTurnLeft(false);
                actionData.setTurnRight(true);
            } else {
                actionData.setTurnLeft(true);
                actionData.setTurnRight(false);
            }
        } else {
            if (turnToAttack(gameData.getRedShip(), gameData.getBlueShip()) == null) {
                actionData.setTurnLeft(false);
                actionData.setTurnRight(false);
            } else if (turnToAttack(gameData.getRedShip(), gameData.getBlueShip()).equals(Decision.RIGHT)) {
                actionData.setTurnLeft(false);
                actionData.setTurnRight(true);
            } else {
                actionData.setTurnRight(false);
                actionData.setTurnLeft(true);
            }
        }


        actionData.setFire(shoot(gameData.getRedShip(), gameData.getBlueShip()));

        return actionData;
    }

    public void sendInformation(GameData gameData) {
        try {
            if (GameSocket.connectedSession.isOpen())
                GameSocket.connectedSession.getRemote().sendString(mapper.writeValueAsString(calculateNextMove(gameData)));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


//    public BulletProperties nearestBullet(List<BulletProperties> bullets, ShipProperties ship){
//        int x = ship.getX();
//        int y = ship.getY();
//        BulletProperties nearest = null;
//        double biggestDistance = Double.MAX_VALUE;
//        for (BulletProperties bullet : bullets) {
//            double distance = Math.sqrt(Math.pow(x-bullet.getX(),2)+Math.pow(y-bullet.getY(),2));
//            if(distance<biggestDistance){
//                biggestDistance = distance;
//                nearest = bullet;
//            }
//        }
//        return nearest;
//    }


}
