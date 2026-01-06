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
- I could have created middleware for general error handling, utilizing the next() function of express.
- It only returns the first 2 repos right now because of rate limiting
- Currently, API errors are typed using a TypeScript intersection type (Error & { statusCode: number }). While this provides development convenience, TypeScript cannot enforce that required properties (like statusCode) are actually initialized at runtime, which can lead to silent bugs (e.g. returning HTTP 200 instead of 500). Planned improvement: migrate to a real ApiError class that extends Error. This will enforce required fields via the constructor, enable reliable instanceof checks, and provide stronger runtime guarantees for consistent and safe error handling.
