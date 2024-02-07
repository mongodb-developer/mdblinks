# Mdb Links - The DevRel Short URL Redirector
Mdblinks is a simple URL shortener that uses a MongoDB database to store the short URLs. You can use it to create short URLs that can be easily shared, tweeted, or emailed to friends.

Mdblinks makes it easier to insert UTM parameters to your URLs, so you can track the performance of your links in Google Analytics.

_You should use a short URL for any link that points back to the `mongodb.com` website_

## How to use Mdblinks

Mdblinks can be accessed via the following URL:

```
https://admin.mdblink.com
```

Log in with your @mongodb.com email address, and you will be able to create short URLs.

## How to contribute

Please contact the MongoDB DevRel team if you would like to contribute to this project.

### Running the dev environment

To run the application in your local environment, clone the repository, install dependencies for each component, and run the project with `docker-compose`.

```bash
git clone git@github.com:mongodb-developer/mdblinks.git
cd mdblinks
cd api && npm install && cd ..
cd admin && npm install && cd ..
cd landing && npm install && cd ..
docker-compose up
```

#### What's running in the dev environment?

- The `api` service is running on port `5050`
- The `redirector` service is running on port `8080`
- The `admin` service is running on port `3000`
- The `landing` service is running on port `3002`
- A local community MongoDB instance is running on port `27017`

#### Testing the dev environment

Once you have the dev environment running, you can test the application by visiting the following URLs:
- `http://localhost:3000` to access the admin interface and create a short URL
- `http://localhost:8080/short-url` to test your newly created short URL