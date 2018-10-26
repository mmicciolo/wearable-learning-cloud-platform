package wlcp.frontend.test.helpers;

import java.io.File;
import java.io.IOException;

import javax.servlet.ServletException;

import org.apache.catalina.LifecycleException;
import org.apache.catalina.LifecycleState;
import org.apache.catalina.startup.Tomcat;
import org.apache.tomcat.util.descriptor.web.ContextResource;

import net.lingala.zip4j.core.ZipFile;
import net.lingala.zip4j.exception.ZipException;

public class EmbeddedTomcat {
	
	private Tomcat tomcat;
	private String workingDirectory = System.getProperty("java.io.tmpdir");

	
	public EmbeddedTomcat() {
		
	}
	
	public void Start() throws ServletException, LifecycleException, IOException, ZipException {
		tomcat = new Tomcat();
		tomcat.setPort(0);
		tomcat.setBaseDir(workingDirectory);
		tomcat.getHost().setAppBase(workingDirectory);
		tomcat.getHost().setAutoDeploy(true);
		tomcat.getHost().setDeployOnStartup(true);
		tomcat.enableNaming();
		
		ContextResource resource = new ContextResource();
		resource.setName("wlcp.webapp.defaultDataSource");
		resource.setType("javax.sql.DataSource");
		resource.setProperty("driverClassName", "org.apache.derby.jdbc.EmbeddedDriver");
		resource.setProperty("url", "jdbc:derby:memory:DefaultDB;create=true");
		tomcat.getServer().getGlobalNamingResources().addResource(resource);
		
		ZipFile zipFile = new ZipFile(getWebAppPath());
		zipFile.extractAll(System.getProperty("java.io.tmpdir") + "WLCPWebApp");
		
		File[] files = new File(System.getProperty("java.io.tmpdir") + "WLCPWebApp/WEB-INF/lib/").listFiles();
		for(File f : files) {
			if(f.getPath().contains("WLCPDataModel") && f.getPath().contains(".jar")) {
				f.delete();
			}
		}
		
		tomcat.addWebapp("/WLCPWebApp", System.getProperty("java.io.tmpdir") + "WLCPWebApp");
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
	
	private String getWebAppPath() {
		File file = new File(System.getProperty("user.dir")).getParentFile();
		File frontEnd = new File(file.getPath() + "/WLCPWebApp/target");
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
