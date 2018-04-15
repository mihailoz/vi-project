package websocket;

import ai.Controlers.AIController;
import ai.Controlers.AggressiveController;
import ai.Controlers.KamikaziController;
import ai.Controlers.StandardController;
import com.fasterxml.jackson.databind.ObjectMapper;
import common.GameData;
import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.WebSocketAdapter;

import java.io.IOException;
import java.util.Random;

/**
 * Created by mihailozdravkovic on 1/27/18.
 */
public class GameSocket extends WebSocketAdapter {

    public static Session connectedSession;
    private ObjectMapper mapper = new ObjectMapper();
    private AIController controller;

    @Override
    public void onWebSocketConnect(Session sess) {
        super.onWebSocketConnect(sess);
        Random random = new Random();
        int i = random.nextInt(3);
        if (i == 0) {
            controller = new StandardController();
        } else if (i == 1) {
            controller = new KamikaziController();
        } else {
            controller = new AggressiveController();
        }
        connectedSession = sess;
    }

    @Override
    public void onWebSocketText(String message) {
        super.onWebSocketText(message);
        try {
            GameData data = mapper.readValue(message, GameData.class);
            controller.sendInformation(data);
        } catch (IOException e) {
            e.printStackTrace();
            System.out.print("ERROR: Could not deserialize GameData object.");
        }
    }

    @Override
    public void onWebSocketClose(int statusCode, String reason) {
        super.onWebSocketClose(statusCode, reason);
        System.out.println("Socket Closed: [" + statusCode + "] " + reason);

        connectedSession = null;
    }

    @Override
    public void onWebSocketError(Throwable cause) {
        super.onWebSocketError(cause);
        cause.printStackTrace(System.err);
    }
}