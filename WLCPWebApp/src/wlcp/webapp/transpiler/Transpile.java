package wlcp.webapp.transpiler;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Semaphore;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.eclipse.persistence.config.PersistenceUnitProperties;

import com.google.gson.Gson;

import wlcp.transpiler.JavaScriptTranspiler;

/**
 * Servlet implementation class Transpile
 */
@WebServlet("/Transpile")
public class Transpile extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private final Semaphore available = new Semaphore(1, true);
	private EntityManagerFactory entityManagerFactory = null;
	private EntityManager entityManager = null;
	private JavaScriptTranspiler transpiler = null;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Transpile() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		try {
			available.acquire();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		initJPA();
        transpiler = new JavaScriptTranspiler(entityManager);
		
		String gameId = request.getParameter("gameId");
		
		File programLocation = new File(this.getServletContext().getRealPath(this.getServletContext().getContextPath()));
		String finalProgramLocation = programLocation.getParentFile().getParent() + "/WLCPGameServer/programs/";
	
		String transpiledCode = transpiler.Transpile(gameId);
		
		//PrintWriter pw = new PrintWriter(new FileOutputStream("C:/Users/Matt/git/wearable-learning-cloud-platform/WLCPGameServer/programs/" + gameId + ".js", false));
		PrintWriter pw = new PrintWriter(new FileOutputStream(finalProgramLocation + gameId + ".js", false));
		pw.println(transpiledCode);
		pw.close();

		entityManager.close();
		entityManagerFactory.close();
		
		response.setContentType("text/plain");
		response.setStatus(HttpServletResponse.SC_OK);
		
		available.release();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}
	
	private void initJPA() {
		Map<Object, Object> properties = new HashMap<Object, Object>();
		properties.put(PersistenceUnitProperties.JDBC_URL, "jdbc:mysql://localhost/wlcp");
		properties.put(PersistenceUnitProperties.JDBC_DRIVER, "com.mysql.jdbc.Driver");
		properties.put(PersistenceUnitProperties.JDBC_USER, "wlcp");
		properties.put(PersistenceUnitProperties.JDBC_PASSWORD, "wlcp");
		properties.put("eclipselink.ddl-generation", "none");
		properties.put("eclipselink.target-database", "MySQL");
        
        //Create our factory
        entityManagerFactory = Persistence.createEntityManagerFactory("WLCPDataModel", properties);
        
        //Setup our entity manager
        entityManager = entityManagerFactory.createEntityManager();
	}

}
