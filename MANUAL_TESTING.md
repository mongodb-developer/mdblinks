# Test list before merging
Automated testing is not yet implemented for this project. Therefore, it's your responsibility to test the changes and make sure that they work as expected. If you have added a new feature or fixed a bug, please copy and paste the following test list and check the boxes that apply to this PR. If you made changes to the existing features, make sure that they haven't been broken.

## Admin UI
- [] User can log in
- [] User can log out

### Short URLs
- [] User sees their list of short URLs by default
- [] User can see all the short URLs
- [] Only the URLs created by the user should have a delete/update button
- [] User can create a new short URL
- [] User can update a short URL
- [] User can delete a short URL
- [] User can see the QR code for a short URL
- [] Short URL redirects to the right URL
- [] User can see statistics on the URL
- [] Newly created routes should have a utm object with the right data
- [] Updating a short URL should update the utm object

### Landing Pages
- [] User can see the list of landing pages
- [] User can create a new landing page
- [] User can access newly created page
- [] User can update a landing page
- [] User can delete a landing page
- [] User can see the QR code for a landing page
- [] User can clone a landing page

### Dashboard
- [] User can see the dashboard
- [] User can update the filters to see the right data

## API
- [] Health check endpoing (`$API_URL/health`) returns correct data
- [] Routes are protected with JWT (test with `$API_URL/routes`)

## Landing
- [] User can access a landing page created with the admin UI

## Redirector
- [] User is redirected to the right page
- [] Visitor information is registered in the database
- [] Location information is valid for a user
- [] `routeDetails.utms` contains the right data