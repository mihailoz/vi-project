package ai.Controlers;

import ai.Contracts.IAttack;
import ai.Contracts.IDodge;
import common.*;

import java.util.List;

public class KamikaziController extends AIController implements IDodge,IAttack {
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

    public ActionData calculateNextMove(GameData gameData) {
        return null;
    }
}
