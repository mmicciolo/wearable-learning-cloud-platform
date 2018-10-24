package wlcp.frontend.test.helpers;

import java.io.File;

import javax.servlet.ServletException;

import org.apache.catalina.LifecycleException;
import org.apache.catalina.LifecycleState;
import org.apache.catalina.startup.Tomcat;

public class EmbeddedTomcat {
	
	private Tomcat tomcat;
	private String workingDirectory = System.getProperty("java.io.tmpdir");

	
	public EmbeddedTomcat() {
		
	}
	
	public void Start() throws ServletException, LifecycleException {
		getFrontEndPath();
		tomcat = new Tomcat();
		tomcat.setPort(0);
		tomcat.setBaseDir(workingDirectory);
		tomcat.getHost().setAppBase(workingDirectory);
		tomcat.getHost().setAutoDeploy(true);
		tomcat.getHost().setDeployOnStartup(true);
		//tomcat.addWebapp("WLCPTestData", getTestDataPath());
		tomcat.addWebapp("/WLCPFrontEnd", getFrontEndPath());
		tomcat.start();
	}
	
	public void Stop() throws LifecycleException {
		if (tomcat.getServer() != null
	            && tomcat.getServer().getState() != LifecycleState.DESTROYED) {
	        if (tomcat.getServer().getState() != LifecycleState.STOPPED) {
	        	tomcat.stop();
	        }
	        tomcat.destroy();
	    }
	}
	
	public int getPort() {
		  return tomcat.getConnector().getLocalPort();
	}
	
	private String getTestDataPath() {
		File file = new File(System.getProperty("user.dir")).getParentFile();
		File frontEnd = new File(file.getPath() + "/WLCPTestData/target");
		File[] files = frontEnd.listFiles();
		for(File f : files) {
			if(f.getPath().contains(".war")) {
				return f.getPath();
			}
		}
		return "";
	}
	
	private String getFrontEndPath() {
		File file = new File(System.getProperty("user.dir")).getParentFile();
//		File file = new File(System.getProperty("user.dir"));
//		File frontEnd = null;
//		if(file.getName().equals("wearable-learning-cloud-platform")) {
//			frontEnd = new File(file.getPath() + "/WLCPFrontEnd/target");
//		} else  {
//			frontEnd = new File(file.getPath() + "/target");
//		}
		File frontEnd = new File(file.getPath() + "/WLCPFrontEnd/target");
		File[] files = frontEnd.listFiles();
		for(File f : files) {
			if(f.getPath().contains(".war")) {
				return f.getPath();
			}
		}
		return "";
	}

}
