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

Link to [article](https://onedrive.live.com/edit?id=7FCCCBF3665A9E5A!436&resid=7FCCCBF3665A9E5A!436&ithint=file%2cdocx&authkey=!AK2jr9tAVps_J3w&wdo=2&cid=7fcccbf3665a9e5a)
