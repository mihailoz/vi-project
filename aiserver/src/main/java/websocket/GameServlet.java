package websocket;

import org.eclipse.jetty.websocket.servlet.WebSocketServlet;
import org.eclipse.jetty.websocket.servlet.WebSocketServletFactory;

/**
 * Created by mihailozdravkovic on 1/27/18.
 */

@SuppressWarnings("serial")
public class GameServlet extends WebSocketServlet {
    @Override
    public void configure(WebSocketServletFactory factory) {
        factory.register(GameSocket.class);
    }
}
