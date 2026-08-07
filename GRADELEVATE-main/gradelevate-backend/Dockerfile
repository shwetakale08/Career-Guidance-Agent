# Stage 1: Build the application
FROM eclipse-temurin:17-jdk-focal AS builder

WORKDIR /app

# Copy Maven wrapper and config
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Copy source code
COPY src src

# Give execute permission to mvnw
RUN chmod +x mvnw

# Build jar
RUN ./mvnw clean package -DskipTests

# Stage 2: Runtime image
FROM eclipse-temurin:17-jre-focal

WORKDIR /app

# Copy jar from builder
COPY --from=builder /app/target/*.jar app.jar

# Render provides PORT dynamically
ENV PORT=10000

# Expose port
EXPOSE 10000

# Run application
ENTRYPOINT ["java", "-jar", "app.jar"]
