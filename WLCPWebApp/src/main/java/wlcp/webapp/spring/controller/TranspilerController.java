package wlcp.webapp.spring.controller;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.PrintWriter;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.servlet.ServletContext;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import wlcp.transpiler.JavaScriptTranspiler;

@Controller
@RequestMapping("/Controllers")
public class TranspilerController {
	
	@Inject
	EntityManager entityManager;
	
	@Inject
	ServletContext context;
	
	@GetMapping(value="/transpileGame")
    @ResponseBody()
	public String transpileGame(@RequestParam("gameId") String gameId, @RequestParam("write") boolean write) throws FileNotFoundException {
		JavaScriptTranspiler transpiler = new JavaScriptTranspiler(entityManager);
		File programLocation = new File(context.getRealPath(context.getContextPath()));
		String finalProgramLocation = programLocation.getParentFile().getParent() + "/WLCPGameServer/programs/";
		String transpiledCode = transpiler.Transpile(gameId);
		if(write) {
			//PrintWriter pw = new PrintWriter(new FileOutputStream("C:/Users/Matt/git/wearable-learning-cloud-platform/WLCPGameServer/programs/" + gameId + ".js", false));
			PrintWriter pw = new PrintWriter(new FileOutputStream(finalProgramLocation + gameId + ".js", false));
			pw.println(transpiledCode);
			pw.close();
			return "";
		} else {
			return transpiledCode;
		}
	}

}
