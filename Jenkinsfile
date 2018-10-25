node {
   def mvnHome
   
  // Pull the source code from git
  stage('Preparation') {
      git 'https://github.com/mmicciolo/wearable-learning-cloud-platform.git'
      mvnHome = tool 'M3'
  }
  stage('Build') {
      // Run the maven build
      sh "'${mvnHome}/bin/mvn' clean package -DskipTests"
  }
  //stage('Unit Testing') {
      //sh "'${mvnHome}/bin/mvn' test"
      //junit "WLCPDataModel/target/surefire-reports/*.xml"
      //junit "WLCPFrontEnd/target/surefire-reports/*.xml"
      //junit "WLCPGameServer/target/surefire-reports/*.xml"
      //junit "WLCPWebApp/target/surefire-reports/*.xml"
  //}
  stage('Integration Testing') {
  	  sh "cd WLCPFrontEnd"
  	  sh "'${mvnHome}/bin/mvn' test -Pintegration-tests"
  	  sh "cd .."
  	  junit "WLCPFrontEnd/target/surefire-reports/*.xml"
  }
  stage('Publish') {
    withCredentials([file(credentialsId: 'settingsFile', variable: 'FILE')]) {
        sh "'${mvnHome}/bin/mvn' clean deploy -DskipTests -s $FILE"
    }
   }
   stage('Deploy') {
       if(params.deploy) {
        sh "cp WLCPFrontEnd/target/*.war /home/wlcp/tomcat/webapps/WLCPFrontEnd.war"
        sh "cp WLCPTestData/target/*.war /home/wlcp/tomcat/webapps/WLCPTestData.war"
        sh "cp WLCPWebApp/target/*.war /home/wlcp/tomcat/webapps/WLCPWebApp.war"
       }
   }
}
