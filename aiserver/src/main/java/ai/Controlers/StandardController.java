package ai.Controlers;

import ai.Contracts.IAttack;
import ai.Contracts.IDodge;
import ai.Contracts.IShoot;
import common.*;

import java.util.List;

public class StandardController extends AIController implements IDodge,IAttack,IShoot{
    public ActionData calculateNextMove(GameData gameData) {
        return null;
    }

    public Decision turnToAttack(ShipProperties myShip, ShipProperties enemyShip) {
        return null;
    }

    public List<BulletProperties> nearestBullets(List<BulletProperties> bullets, ShipProperties ship) {
        return null;
    }

    public boolean mustDodge(BulletProperties bullet, ShipProperties ship) {
        return false;
    }

    public Decision turnToDodge(ShipProperties ship, BulletProperties bullet) {
        return null;
    }

    public boolean shoot() {
        return false;
    }
}
