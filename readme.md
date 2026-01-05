## Start the app

- rename .env-template to .env
- go to your profile settings in github then go to developer settings and create a fine-grained personal access token and copy the key into the .env file under API_KEY

- now build the app and run it
```bash
docker compose up --build
```

hit the endpoint with forexample curl and view the returned result 
```bash
curl -H "x-api-key: secretkey" \
     http://localhost:3002/analyze/jeppeOEM

```

## Assumptions
- Assuming the app needs to be maintainable and loosely coupled, I designed it with a Layered Architecture and Dependency Injection, despite it being more verbose for a small app.

## Improvements
- I could have created middleware for general Error handling middleware utilizing the next() function of express.
