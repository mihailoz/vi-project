package ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import common.ActionData;
import common.GameData;
import websocket.GameSocket;

import java.io.IOException;

/**
 * Created by mihailozdravkovic on 1/27/18.
 */
public class AIController {

    private static ObjectMapper mapper = new ObjectMapper();

    public static void calculateNextMove(GameData gameData) {
        // Ovde imate objekat gameData i treba da ga procesirate odlucite sta cete da radite
        // kad odlucite napravite ActionData objekat u kome cete setovati tri boolean-a (moveRight, moveLeft, fire)
        // i to posaljete nazad igri da zna sta ste uradili, npr ovako ce brod skretati u levo i pucati:

        ActionData ad = new ActionData();
        ad.setFire(true);
        ad.setTurnLeft(true);
        ad.setTurnRight(false);

        // Kad napravite taj objekat, saljete ga igri na sledeci nacin:
        try {
            if (GameSocket.connectedSession.isOpen())
                GameSocket.connectedSession.getRemote().sendString(mapper.writeValueAsString(ad));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
