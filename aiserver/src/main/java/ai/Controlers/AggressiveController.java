package ai.Controlers;

import common.BulletProperties;
import common.ShipProperties;


public class AggressiveController extends StandardController {

    @Override
    public boolean mustDodge(BulletProperties bullet, ShipProperties myShip, ShipProperties enemyShip) {
        return false;
    }
}
