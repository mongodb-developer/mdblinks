import React from "react";
import {Link} from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Disclaimer } from "@leafygreen-ui/typography";
import packageInfo from "../../package.json";

export default function Home () {
  let { isAuthenticated } = useAuth0();
  return  (
    <React.Fragment>
      Welcome to <a href="http://mdb.link">mdb.link</a> admin UI.<br/><br/>
      {!isAuthenticated &&
        <Link to="/login">Login</Link>
      }
      <Disclaimer>
        Running {packageInfo.name} {packageInfo.version}
      </Disclaimer>
    </React.Fragment>
  )
}