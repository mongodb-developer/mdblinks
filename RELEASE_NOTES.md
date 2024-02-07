# MDBLink Release Notes

## 2.0.4
February 8, 2024

In preparation for migration to prod, ownerId for routes will need to be an array to support both Realm user id, and Google user id provided by Auth0.

### New Features
- Added support for multiple ownerIds for routes in the admin UI

## 2.0.3
February 7, 2024

This version was a full rewrite of the MDBLink API to remove the Realm SDK dependency. This version also includes a new Docker development environment and cloudbuild files for GCP deployment. The goal of this new major version is to make it easier for developers to contribute to the project.

### New Features
- Created a new API for the MDBLink to remove Realm SDK dependency
- Added cloudbuild files for GCP deployment
- Added Docker development environment

### Bug Fixes
- Visitor location should now be fixed