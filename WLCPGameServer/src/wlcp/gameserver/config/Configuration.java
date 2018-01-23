package wlcp.gameserver.config;

import java.io.File;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;

public class Configuration implements IConfiguration {
	
	protected File file;
	protected DocumentBuilderFactory documentBuilderFactory;
	protected DocumentBuilder documentBuilder;
	protected Document document;

	public Configuration(File file) {
		this.file = file;
		SetupXMLParser();
	}
	
	private void SetupXMLParser() {
		try {
			documentBuilderFactory = DocumentBuilderFactory.newInstance();
			documentBuilder = documentBuilderFactory.newDocumentBuilder();
			document = documentBuilder.parse(file);
			document.getDocumentElement().normalize();
		} catch (Exception e) {
			
		}
	}

	@Override
	public Configuration Parse() {
		// TODO Auto-generated method stub
		return this;
	}

}
