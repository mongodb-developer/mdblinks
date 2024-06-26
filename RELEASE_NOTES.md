# MDBLink Release Notes

## 2.1.3
June 3, 2024

Fixes issue #32 where the redirection service would break if query parameters were added to the short link.

### Bug Fixes
- Fixed issue #32 by removing everything after the `?` in the short link redirector service.

## 2.1.2
June 1, 2024

Fixes issue #20 where a page refresh would break the application. A new nginx configuration file was added and the admin container uses it.

### Bug Fixes
- Fixed issue #20 about page refreshes breaking the application

## 2.1.1
June 1, 2024

Fixes issue #30 about malformed UTMs in the UTM builder, and the new short link modal. The issue was in the new MultiBox component introced in 2.1.0.

### Bug Fixes
- Fixed issue #30 about malformed UTMs in the UTM builder.

## 2.1.0
May 3, 2024

Major changes including new user management and profile page. This version also cleans up the code base

### New Features
- Added a user profile page
- List of UTMs loaded from the database, based on the user profile

### Improvements
- Cleaned up the Shortie page to split it into smaller components
- Removed the tab to create short links for landing pages

### Bug Fixes
- Well, not really a fix, but hiding an issue... Added a loader to the Shortie page to avoid multiple re-renders of the table upon loading.

## 2.0.9
April 16, 2024

Updated the QR Code library using the fluid style.

## 2.0.8
April 10, 2024

Changed the QR Code to now also display the logomark. It also has the possibility to render a high resolution version of the QR Code for printing.

## Improvements
- Implements issue #26 to display the logomark in the QR Code


## 2.0.7
February 14, 2024

Fixed a bug in the admin UI for landing pages.

### Bug Fixes
- Fixed a bug in the admin UI for landing pages where the user could not see his own landing pages. The owner id in the prod database was also updated to match both the realm and Auth0 id.

## 2.0.6
February 13, 2024

Small bug fixes and clean up.

## Improvements
- Added readme files for each service

## Bug Fixes
- Removed unused files
- Changes the index.html pages to remove references to create-react-app
- Fixes issue #13 to prevent empty routes from being created
- Fixes issue #21 preventing the admin UI from deleting or editing routes

## 2.0.5
February 7, 2024

Small bug fixes as the manual testing list is written.

### New Features
- Added a list of manual tests that should be performed before merging a PR

### Bug Fixes
- Dashboard in staging now shows data from the staging database
- Fixed the route link in the admin UI

## 2.0.4
February 7, 2024

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