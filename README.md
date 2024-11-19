How to run the mars_rover_api

1. Creating the postgresql container on your docker (windows)
   - docker pull postgres -- will download the latest version of postgresql database.
   - docker run --name postgresDocker -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 postgres -v pg_data:/var/lib/postgresql/data postgres -- the -v pg_data is optional, to persist the data after you shutdown the container
   - docker ps -- to ensure the postgresql is running.
  
2. Creating the application container on your docker (windows)
   - docker build -t mars_rover_api . --inside the project folder, where the dockerfile is located.
   - docker run -d -p 3333:3333 --name mars_rover_api_container mars_rover_api -- to create and run the container with the name mars_rover_api
   - docker ps -- to check out if the application is running

3. You can access the api documentation on http://localhost:3333/docs after
