import { useState, useEffect } from "react";
import { Body, Subtitle } from "@leafygreen-ui/typography";
import { Tabs, Tab } from "@leafygreen-ui/tabs";
import Copyable from "@leafygreen-ui/copyable";
import Card from "@leafygreen-ui/card";
import ConfirmationModal from "@leafygreen-ui/confirmation-modal";
import TextInput from '@leafygreen-ui/text-input';
import { spacing } from '@leafygreen-ui/tokens';
import { css } from "@leafygreen-ui/emotion";
import MultiBox from "../../components/MultiBox";
import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from "../../providers/Api";

const tabCardStyle = css`
margin-top: 10px;
`

const copyableInputStyle = css`
  width: 100%;
`

const ERROR_MESSAGES = {
  START_WITH_SLASH: "Route must start with a forward slash (/)",
  ALREADY_EXISTS: "Route is already used for another URL",
  EMPTY: "Route cannot be empty"
}
const LINKTYPES = {UTM: "UTM", LANDING: "LANDING", DIRECT: "DIRECT"};

export default function ShortieModal(props) {
  const {open, modalMode, setOpen, routeToEdit, setModalMode, allRoutes, refreshData} = props;

  const { user } = useAuth0();
  const { profile, insertRoute, updateRoute } = useApi();

  let [routeValid, setRouteValid] = useState(false);
  let [errorMessage, setErrorMessage] = useState(ERROR_MESSAGES.EMPTY);
  let [route, setRoute] = useState("");
  let [routeId, setRouteId] = useState(null);
  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [to, setTo] = useState("");
  let [isPublic, setIsPublic] = useState(false);
  let [utmDataOptions, setUtmDataOptions] = useState(null);
  let [linkType, setLinkType] = useState(LINKTYPES.UTM);
  let [url, setURL] = useState("");
  let [campaign, setCampaign] = useState("");
  let [source, setSource] = useState("");
  let [medium, setMedium] = useState("");
  let [content, setContent] = useState("");
  let [term, setTerm] = useState(user?.nickname);
  let [urlValid, setUrlValid] = useState(true);
  let [linkWithUTM, setLinkWithUTM] = useState("");

  useEffect(() => {
    setUtmDataOptions(profile.utms);
  }, [profile]);

  useEffect(() => {
    if (route.substring(0,1) !== "/") {
      setRouteValid(false);
      setErrorMessage(ERROR_MESSAGES.START_WITH_SLASH);
    } else if (modalMode === "add" && allRoutes.map(r => r.route).includes(route)) {
      setRouteValid(false);
      setErrorMessage(ERROR_MESSAGES.ALREADY_EXISTS);
    } else if (route === "" || route === "/") {
      setRouteValid(false);
      setErrorMessage(ERROR_MESSAGES.EMPTY);
    } else {
      setRouteValid(true);
      setErrorMessage("");
    }
  }, [route]);

  useEffect(() => {
    let trueURL = url;
    if (url && !trueURL.match(/http[s?]/)) trueURL = "https://" + trueURL;
    trueURL = trueURL.replace("http://", "https://");

    if (campaign || source || medium || content || term) {
      trueURL = trueURL + "?";
      if (campaign) trueURL = `${trueURL}utm_campaign=${encodeURIComponent(campaign)}&`;
      if (source) trueURL = `${trueURL}utm_source=${encodeURIComponent(source)}&`;
      if (medium) trueURL = `${trueURL}utm_medium=${encodeURIComponent(medium)}&`;
      if (content) trueURL = `${trueURL}utm_content=${encodeURIComponent(content)}&`;
      if (term) trueURL = `${trueURL}utm_term=${encodeURIComponent(term)}&`;
    }
    if (trueURL.slice(-1) === "&") trueURL = trueURL.substring(0, trueURL.length-1);
    setLinkWithUTM(trueURL);
    setTo(trueURL);
  }, [url, campaign, source, medium, content, term]);

  const handleModalConfirm = async() => {
    let newRoute = {route, to, title, description, isPublic, owner: user.sub};
    if (modalMode === "add") await insertRoute(newRoute);
    if (modalMode === "edit") await updateRoute(routeId, newRoute);
    await refreshData();
    setOpen(false);
    setModalMode("add");
  }

  const editRoute = (route) => {
    let editRoute = allRoutes.find(r => r.route === route);
    setRouteId(editRoute._id);
    setRoute(editRoute.route);
    setTo(editRoute.to);
    setDescription(editRoute.description);
    setTitle(editRoute.title);
    setIsPublic(editRoute.isPublic);

    //Route type
    if (editRoute.to.match(/\?utm/)) {
      const url = new URL(editRoute.to);
      const params = new URLSearchParams(url.searchParams);
      setLinkType(LINKTYPES.UTM);
      setURL(url.origin + url.pathname);
      setCampaign(params.get("utm_campaign"));
      setSource(params.get("utm_source"));
      setMedium(params.get("utm_medium"));
      setContent(params.get("utm_content"));
      setTerm(params.get("utm_term"));
    } else {
      setLinkType(LINKTYPES.DIRECT);
    }
  }

  const emptyForm = () => {
    setRoute("");
    setRouteId(null)
    setTo("");
    setDescription("");
    setTitle("");
    setIsPublic(false);
    setURL("");
    setCampaign("");
    setSource("");
    setMedium("");
    setContent("");
    setTerm(user?.nickname);
    setUrlValid(true);
    setLinkWithUTM("");
  }

  useEffect(() => {
    if (modalMode === "add") {
      emptyForm();
    }
    if (modalMode === "edit") {
      editRoute(routeToEdit);
    }
  }, [open, modalMode])

  return (
    <ConfirmationModal
        open={open}
        onConfirm={handleModalConfirm}
        onCancel={() => { setOpen(false); emptyForm(); }}
        title="Add New Short URL"
        buttonText="Save New Shortie"
        submitDisabled={!routeValid}
      >
        Create a new short route here.
        <TextInput
          label="Short Route"
          description="Route starting with '/'"
          placeholder="/route"
          onChange={e => {
            setRoute(e.target.value);
          }}
          errorMessage={errorMessage}
          state={routeValid ? "valid" : "error"}
          value={route}
          disabled={modalMode === "edit"}
        />

        <Tabs aria-label="Tabs for URL type selection">

          <Tab name="With UTM codes" default={linkType === LINKTYPES.UTM} aria-label="With UTM">
            <Card className={tabCardStyle}>
              <Subtitle>Generate a mongodb.com link with UTMs</Subtitle>
              <Body>
                <TextInput
                  label="URL"
                  description="This should be a page on the MongoDB website"
                  placeholder="mongodb.com/..."
                  onChange={e => { setURL(e.target.value) }}
                  onKeyUp={e => {
                    if (!url.match(/mongodb\.com/)) {
                      setUrlValid(false);
                    } else {
                      setUrlValid(true);
                    }
                  }}
                  errorMessage="URL must be leading to a MongoDB website"
                  state={urlValid ? "valid" : "error"}
                  value={url}
                /><br/>
                <MultiBox
                  label="Campaign"
                  description="Should always be set to `devrel` for the DevRel team"
                  onChange={value => setCampaign(value)}
                  value={campaign}
                  possibleValues={utmDataOptions?.campaigns}
                /><br/>
                <MultiBox
                  label="Source"
                  description="Focus area this link tracks to"
                  onChange={value => setSource(value)}
                  value={source}
                  possibleValues={utmDataOptions?.sources}
                /><br/>
                <MultiBox
                  label="Medium"
                  description="How was the link shared?"
                  onChange={value => setMedium(value)}
                  value={medium}
                  possibleValues={utmDataOptions?.mediums}
                /><br/>
                <MultiBox
                  label="Content"
                  description="More details to the medium (episode number, video title, conference name)"
                  onChange={value => setContent(value)}
                  value={content}
                  possibleValues={utmDataOptions?.contents}
                /><br/>
                <MultiBox
                  label="Term"
                  description="Used to identify who used or created this link"
                  onChange={value => setTerm(value)}
                  value={term}
                  possibleValues={utmDataOptions?.terms}
                /><br/>
                <Copyable className={copyableInputStyle} label="Your Link" description="Use this link to start tracking your impact.">
                  {linkWithUTM}
                </Copyable>
              </Body>
            </Card>
          </Tab>

          <Tab name="Direct link" default={linkType === LINKTYPES.DIRECT} aria-label="Direct Link">
            <Card className={tabCardStyle}>
              <Subtitle>Link directly to another page</Subtitle>
              <Body>

                <TextInput
                  label="Destination"
                  description="Enter a destination URL"
                  placeholder="https://example.com"
                  onChange={e => setTo(e.target.value)}
                  value={to}
                />

              </Body>
            </Card>
          </Tab>
        </Tabs>

        <span style={{ margin: spacing[3] }}>

        </span>

      </ConfirmationModal>
  )
}