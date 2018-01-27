package ai;

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
public class AIController implements IDodge{

    private static ObjectMapper mapper = new ObjectMapper();

    private final static int shipVelocity = 200;
    private final static int bulletVelocity = 500;


    public void calculateNextMove(GameData gameData) {
        GameProperties gameProperties = gameData.getGameProperties();
        ShipProperties blueShip = gameData.getBlueShip();
        ShipProperties redShip = gameData.getRedShip();
        List<BulletProperties> blueBullets = gameData.getBlueBullets();





        // Ovde imate objekat gameData i treba da ga procesirate odlucite sta cete da radite
        // kad odlucite napravite ActionData objekat u kome cete setovati tri boolean-a (moveRight, moveLeft, fire)
        // i to posaljete nazad igri da zna sta ste uradili, npr ovako ce brod skretati u levo i pucati:

        ActionData ad = new ActionData();
        ad.setFire(true);
        ad.setTurnLeft(true);
        ad.setTurnRight(false);

        // Kad napravite taj objekat, saljete ga igri na sledeci nacin:
        try {
            if (GameSocket.connectedSession.isOpen())
                GameSocket.connectedSession.getRemote().sendString(mapper.writeValueAsString(ad));
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

    public List<BulletProperties> nearestBullets(List<BulletProperties> bullets, ShipProperties ship) {
        return null;
    }

    public boolean mustDodge(BulletProperties bullet, ShipProperties ship){
        //TODO proverava da li mora dodgovati metak
        return true;
    }

    public Decision turnToDodge(ShipProperties ship, BulletProperties bullet) {
        return null;
    }

}
