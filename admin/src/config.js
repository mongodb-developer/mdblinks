const settings = {
  AUTH0: {
    domain: process.env.REACT_APP_AUTH0_DOMAIN || "",
    clientId: process.env.REACT_APP_AUTH0_CLIENTID || "",
    redirectUri: `${window.location.origin}`,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE || ""
  },
  REALM: {
    appId: process.env.REACT_APP_REALM_APP_ID
  },
  LANDING: {
    URL: process.env.REACT_APP_LANDING_URL
  },
  API: {
    URL: process.env.REACT_APP_API_URL
  },
  VERSION: {
    ENV: process.env.REACT_APP_ENV,
    SHA: process.env.REACT_APP_SHA
  }
}

export default settings;