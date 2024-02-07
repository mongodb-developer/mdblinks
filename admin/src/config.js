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
  REDIRECTOR: {
    URL: process.env.REACT_APP_REDIRECTOR_URL
  },
  LANDING: {
    URL: process.env.REACT_APP_LANDING_URL
  },
  API: {
    URL: process.env.REACT_APP_API_URL
  }
}

export default settings;