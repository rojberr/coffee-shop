# coffee-shop

## To run

Use Java 23. From root
```
JAR_FILE=backend-0.0.1-SNAPSHOT.jar
./backend/gradlew -p backend build && java -jar backend/build/libs/${JAR_FILE}
docker-compose up --build
```

Now you can go to:
```
localhost:80 -> for frontend
localhost:8080 -> for backend
localhost:7432 -> psql db entrypoint
```