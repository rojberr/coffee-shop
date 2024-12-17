FROM openjdk:23

LABEL "MAINTAINER"="rojberr"

ARG JAR_FILE=backend-0.0.1-SNAPSHOT.jar

COPY ./build/libs/${JAR_FILE} ${JAR_FILE}

ENTRYPOINT ["java","-jar","backend-0.0.1-SNAPSHOT.jar"]
