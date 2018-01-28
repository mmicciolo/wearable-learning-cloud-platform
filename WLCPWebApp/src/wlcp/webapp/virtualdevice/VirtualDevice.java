package wlcp.webapp.virtualdevice;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet implementation class VirtualDevice
 */
@WebServlet("/VirtualDevice")
public class VirtualDevice extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static Map<HttpSession, BackendServer> sessions;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public VirtualDevice() {
        super();
        sessions = new HashMap<HttpSession, BackendServer>(); 
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.getWriter().append("Served at: ").append(request.getContextPath());
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		HttpSession session = request.getSession();
		
		String text = request.getParameter("request");
		
		if(sessions.containsKey(session)) {
			ProcessRequest(text);
		} else {
			BackendServer backendServer = new BackendServer();
			backendServer.start();
			sessions.put(session, backendServer);
		}
		
		response.setContentType("text/plain");
		response.setStatus(HttpServletResponse.SC_OK);
	}
	
	private void ProcessRequest(String text) {
		switch(text) {
		case "GAME_LOBBIES":
			break;
		}
	}
}
