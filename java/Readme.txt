Setup details:
	• Eclipse Neon IDE
	• Java enviroment - JDK + JRE
	• MongoDB java driver 3.0.0

Install eclipse Neon from:
http://www.eclipse.org/downloads/packages/eclipse-ide-java-developers/heliosr

Install Java JDK and JRE from:
http://www.oracle.com/technetwork/java/javase/downloads/index.html

Create new project in eclipse neon and add MongoDB java driver to Maven pom.xml:
<dependency>
<groupId>org.mongodb</groupId>
<artifactId>mongo-java-driver</artifactId>
<version>3.0.0</version>
</dependency>
