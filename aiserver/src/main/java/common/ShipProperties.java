package common;

import ai.Contracts.Calculable;

/**
 * Created by mihailozdravkovic on 1/27/18.
 */
public class ShipProperties implements Calculable {
    private Double angle;
    private int x, y, hp;

    public Double getAngle() {
        return angle;
    }

    public void setAngle(Double angle) {
        this.angle = angle;
    }

    public int getX() {
        return x;
    }

    public void setX(int x) {
        this.x = x;
    }

    public int getY() {
        return y;
    }

    public void setY(int y) {
        this.y = y;
    }

    public int getHp() {
        return hp;
    }

    public void setHp(int hp) {
        this.hp = hp;
    }
}
