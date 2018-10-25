node {
   def mvnHome
   
  stage('Preparation') {
      git 'https://github.com/mmicciolo/wearable-learning-cloud-platform.git'
      mvnHome = tool 'M3'
  }
  stage('Build') {
      sh "'${mvnHome}/bin/mvn' clean package -DskipTests"
  }
  stage('Unit Testing') {
      sh "'${mvnHome}/bin/mvn' test"
  }
  stage('Integration Testing') {
  	  sh "'${mvnHome}/bin/mvn' -f WLCPFrontEnd/pom.xml test -Pintegration-tests"
  }
  stage('Publish Test Results') {
      junit "WLCPDataModel/target/surefire-reports/*.xml"
      junit "WLCPFrontEnd/target/surefire-reports/*.xml"
      junit "WLCPGameServer/target/surefire-reports/*.xml"
      junit "WLCPWebApp/target/surefire-reports/*.xml"
  }
  stage('Publish Artifacts') {
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
