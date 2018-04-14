package ai.Controlers;

import ai.Contracts.IAttack;
import ai.Contracts.IDodge;
import common.*;

import java.util.List;

abstract public class KamikaziController extends AIController {
    public Decision turnToAttack(ShipProperties myShip, ShipProperties enemyShip) {
        return null;
    }

    public List<BulletProperties> nearestBullets(List<BulletProperties> bullets, ShipProperties ship) {
        return null;
    }

    public boolean mustDodge(BulletProperties bullet, ShipProperties ship) {
        return false;
    }

    public Decision turnToDodge(ShipProperties myShip, BulletProperties nearest, BulletProperties secondNearest) {
        return null;
    }


    public ActionData calculateNextMove(GameData gameData) {
        return null;
    }
}
