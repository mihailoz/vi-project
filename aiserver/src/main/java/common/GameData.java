package common;

import java.util.List;

/**
 * Created by mihailozdravkovic on 1/27/18.
 */
public class GameData {
    private GameProperties gameProperties;
    private ShipProperties redShip, blueShip;
    private List<BulletProperties> blueBullets, redBullets;


    public GameProperties getGameProperties() {
        return gameProperties;
    }

    public void setGameProperties(GameProperties gameProperties) {
        this.gameProperties = gameProperties;
    }

    public ShipProperties getRedShip() {
        return redShip;
    }

    public void setRedShip(ShipProperties redShip) {
        this.redShip = redShip;
    }

    public ShipProperties getBlueShip() {
        return blueShip;
    }

    public void setBlueShip(ShipProperties blueShip) {
        this.blueShip = blueShip;
    }

    public List<BulletProperties> getBlueBullets() {
        return blueBullets;
    }

    public void setBlueBullets(List<BulletProperties> blueBullets) {
        this.blueBullets = blueBullets;
    }

    public List<BulletProperties> getRedBullets() {
        return redBullets;
    }

    public void setRedBullets(List<BulletProperties> redBullets) {
        this.redBullets = redBullets;
    }
}
