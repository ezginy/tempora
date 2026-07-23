# start from an image that already has Java 17 and Maven installed
FROM maven:3.9-eclipse-temurin-17

# set the working directory inside the container
WORKDIR /app

# copy the project files into the container
COPY . .

# build the project (creates a runnable .jar file)
RUN mvn clean package -DskipTests

# start the server when the container runs
CMD ["mvn", "compile", "exec:java"]