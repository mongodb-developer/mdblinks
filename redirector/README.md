# MDBLink Redirection Service

This service redirects users to the correct URL based on the short URL provided. It also registers the visitor information in the database. It's a PHP page that communicates with the API to get the right URL and register the visitor information.

## Development environment

From the parent folder, run

```bash
docker-compose up
```

This will start the API on [http://localhost:8080](http://localhost:8080).

## Staging environment

Create a PR to the `staging` branch to see the changes in the staging environment. The staging environment is available at [https://mdblink-staging.com](https://mdblink-staging.com).