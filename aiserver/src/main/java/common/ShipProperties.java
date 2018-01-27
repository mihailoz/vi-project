package common;

/**
 * Created by mihailozdravkovic on 1/27/18.
 */
public class ShipProperties {
    private Double angle;
    private int x, y, hp;

    public Double getAngle() {
        return angle;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }

    public int getHp() {
        return hp;
    }

    public void setAngle(Double angle) {
        this.angle = angle;
    }

    public void setX(int x) {
        this.x = x;
    }

    public void setY(int y) {
        this.y = y;
    }

    public void setHp(int hp) {
        this.hp = hp;
    }
}
