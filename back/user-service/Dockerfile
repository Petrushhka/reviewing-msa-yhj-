FROM openjdk:17-jdk-slim

COPY build/libs/*.jar /app.jar
# 여기에 curl 설치 추가!
RUN apt-get update && apt-get install -y curl

ENTRYPOINT ["java", "-jar", "app.jar"]