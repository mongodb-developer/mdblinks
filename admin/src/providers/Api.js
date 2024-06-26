import { createContext, useContext, useState, useEffect } from "react";
import config from "../config";
import { useAuth0 } from "@auth0/auth0-react";

const BASE_URL = config.API.URL;

function ApiProvider(props) {
  let { getAccessTokenSilently } = useAuth0();
  let [jwt, setJwt] = useState(null);
  let [profile, setProfile] = useState({});

  useEffect(() => {
    async function init() {
      let token = await getAccessTokenSilently({
        audience: 'mdb-atlas'
      });
      setJwt(token);
    }
    init();
  }, [getAccessTokenSilently]);

  useEffect(() => {
    async function loadUser() {
      let profile = await getUserData();
      setProfile(profile);
    }
    loadUser();
  }, []);

  const generateHeaders = async () => {
    let token = jwt ? jwt : await getAccessTokenSilently();
    if (!jwt) {
      setJwt(token);
    }
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  }

  const deleteRoute = async (id) => {
    const url = `${BASE_URL}/routes/${id}`;
    const result = await fetch(url, {
      method: "DELETE",
      headers: await generateHeaders()
    }).then(resp => resp.json());
    return result;
  }

  const fetchLandings = async () => {
    const url = `${BASE_URL}/landings`;
    const landings = await fetch(url, {
      method: "GET",
      headers: await generateHeaders()
    }).then(resp => resp.json());
    return landings;
  }

  const fetchRoutes = async () => {
    const url = `${BASE_URL}/routes`;
    const routes = await fetch(url, {
      method: "GET",
      headers: await generateHeaders()
    }).then(resp => resp.json());
    return routes;
  }

  const insertRoute = async (route) => {
    const url = `${BASE_URL}/routes`;
    const result = await fetch(url, {
      method: "POST",
      headers: await generateHeaders(),
      body: JSON.stringify(route)
    }).then(resp => resp.json());
    return result;
  }

  const insertLanding = async (landing) => {
    const url = `${BASE_URL}/landings`;
    const result = await fetch(url, {
      method: "POST",
      headers: await generateHeaders(),
      body: JSON.stringify(landing)
    }).then(resp => resp.json());
    return result;
  }

  const updateRoute = async (id, route) => {
    const url = `${BASE_URL}/routes/${id}`;
    const result = await fetch(url, {
      method: "PUT",
      headers: await generateHeaders(),
      body: JSON.stringify(route)
    }).then(resp => resp.json());
    return result;
  }

  const updateLanding = async (id, landing) => {
    const url = `${BASE_URL}/landings/${id}`;
    const result = await fetch(url, {
      method: "PUT",
      headers: await generateHeaders(),
      body: JSON.stringify(landing)
    }).then(resp => resp.json());
    return result;
  }

  const getRouteStats = async (route) => {
    const url = `${BASE_URL}/routes/stats?route=${route}`;
    const stats = await fetch(url, {
      method: "GET",
      headers: await generateHeaders()
    }).then(resp => resp.json());
    return stats;
  }

  const getDashboardFilters = async () => {
    const url = `${BASE_URL}/dashboard/filters`;
    const filters = await fetch(url, {
      method: "GET",
      headers: await generateHeaders()
    }).then(resp => resp.json());
    return filters;
  }

  const getUserData = async (props) => {
    if (profile._id && !props?.force) {
      return profile;
    }
    const url = `${BASE_URL}/users/me`;
    const user = await fetch(url, {
      method: "GET",
      headers: await generateHeaders()
    }).then(resp => resp.json());
    setProfile(user);
    return user;
  }

  const saveUserData = async (data) => {
    const url = `${BASE_URL}/users/me`;
    const newProfile = {
      _id: data._id,
      name: data.name,
      team: data.team
    };
    const user = await fetch(url, {
      method: "PUT",
      headers: await generateHeaders(),
      body: JSON.stringify(newProfile)
    }).then(resp => resp.json());
    setProfile(await getUserData({force: true}));
    return user;
  }

  const getTeams = async () => {
    const url = `${BASE_URL}/users/teams`;
    const teams = await fetch(url, {
      method: "GET",
      headers: await generateHeaders()
    }).then(resp => resp.json());
    return teams;
  }

  let providerState = {
    jwt,
    profile,
    deleteRoute,
    fetchLandings,
    fetchRoutes,
    getDashboardFilters,
    getRouteStats,
    insertRoute,
    insertLanding,
    updateRoute,
    updateLanding,
    getUserData,
    saveUserData,
    getTeams
  }

  return (
    <ApiContext.Provider value={providerState}>
      {props.children}
    </ApiContext.Provider>
  );
}

const ApiContext = createContext({});
const useApi = () => useContext(ApiContext);

export {
  ApiContext,
  useApi,
  ApiProvider
}
