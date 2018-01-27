package ai.Contracts;

import common.BulletProperties;
import common.Decision;
import common.ShipProperties;

import java.util.List;

public interface IDodge {
    List<BulletProperties> nearestBullets(List<BulletProperties> bullets, ShipProperties ship);
    boolean mustDodge(BulletProperties bullet, ShipProperties ship);
    Decision turnToDodge(ShipProperties ship, BulletProperties bullet);
}
