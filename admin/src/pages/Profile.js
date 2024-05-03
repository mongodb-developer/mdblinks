import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { H2 } from "@leafygreen-ui/typography";
import { Combobox, ComboboxOption } from "@leafygreen-ui/combobox";
import TextInput from "@leafygreen-ui/text-input";
import Button from "@leafygreen-ui/button";
import { css } from "@leafygreen-ui/emotion";

import { useApi } from "../providers/Api";
import { useAuth0 } from "@auth0/auth0-react";

const floatRight = css`
  float: right;
`;

export default function Profile() {
  const api = useApi();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0();

  const [userProfile, setUserProfile] = useState({});
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const loadUserProfile = async () => {
      const profile = await api.getUserData();
      if (isAuthenticated && !profile._id) {
        profile._id = user.sub;
      }
      if (isAuthenticated && !profile?.name) {
        profile.name = user.name;
      }
      setUserProfile(profile);
      const teamList = await api.getTeams();
      setTeams(teamList);
    }
    loadUserProfile();
  }, [isAuthenticated, user]);

  const handleProfileChange = (field, value) => {
    const profile = {...userProfile};
    profile[field] = value;
    setUserProfile(profile);
  }

  const saveProfile = async () => {
    await api.saveUserData(userProfile);
    navigate("/");
  }

  return(
    <Fragment>
      <H2>Profile and Settings</H2>

      <p>
        <form>
          <TextInput
            label="Name"
            onChange={e => handleProfileChange("name", e.target.value)}
            value={userProfile.name}
          />
          <Combobox
            label="Team"
            description="Which MongoDB team are you on? If your team is not listed here, please contact the mdblink team on Slack channel #devrel-committee-mdblink."
            onChange={value => handleProfileChange("team", value)}
            value={userProfile.team}

          >
            {teams.map(s => <ComboboxOption {...s} />)}
          </Combobox>
          <br/>
          <div className={floatRight}>
            <Button
              variant="primary"
              type="button"
              disabled={!userProfile.name || !userProfile.team}
              onClick={_ => saveProfile()}
            >
              Save
            </Button>
          </div>
        </form>
      </p>

   </Fragment>
  )
}