import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useApi } from '../providers/Api';
import { Navigate } from "react-router-dom";

export default function Callback() {
  const api = useApi();
  const { isLoading, isAuthenticated } = useAuth0();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      const data = await api.getUserData();
      setUser(data);
    }
    loadUserData();
  }, [api])

  return (
    <>
    Loading...
    { !isLoading && !isAuthenticated &&
      <>
        <div>Not authenticated, redirect to login</div>
        <Navigate to="/login" />
      </>
    }
    { isAuthenticated && user && !user?._id &&
      <>
        <div>No user found, redirect to profile</div>
        <Navigate to="/app/profile" />
      </>
    }
    { isAuthenticated && user && user?._id && !user?.team &&
      <>
        <div>User exists, but team is missing, redirect to profile</div>
        <Navigate to="/app/profile" />
      </>
    }
    { isAuthenticated && user && user.team &&
      <>
        <div>User exists, and is up to date, Redirect to application</div>
        <Navigate to="/" />
      </>
    }
    </>
  )
}