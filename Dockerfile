FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# 复制文件 & 编译
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests clean package

########## runtime ##########
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar


RUN mkdir -p /etc/featurequiz \
    touch /etc/featurequiz/application.yaml

EXPOSE 13145
ENTRYPOINT ["java", "-jar", "/app/app.jar", "--spring.config.location=file:/etc/featurequiz/application.yaml"]