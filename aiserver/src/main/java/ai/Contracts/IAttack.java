package ai.Contracts;

import common.Decision;
import common.ShipProperties;

public interface IAttack {
    Decision turnToAttack(ShipProperties myShip, ShipProperties enemyShip);
}
