package ai.Controlers;

import ai.Contracts.IAttack;
import ai.Contracts.IDodge;
import ai.Contracts.IShoot;
import common.ActionData;
import common.Decision;
import common.GameData;
import common.ShipProperties;

public class AggressiveController extends AIController implements IAttack, IShoot {
    public Decision turnToAttack(ShipProperties myShip, ShipProperties enemyShip) {
        return null;
    }

    public boolean shoot() {
        return false;
    }

    public ActionData calculateNextMove(GameData gameData) {
        return null;
    }
}
