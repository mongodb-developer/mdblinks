import React, { useEffect, useState, useCallback } from "react";
import { H2, H3, Label, Description } from "@leafygreen-ui/typography";
import Toggle from "@leafygreen-ui/toggle";
import Button from "@leafygreen-ui/button";
import ConfirmationModal from "@leafygreen-ui/confirmation-modal";
import Icon from "@leafygreen-ui/icon";
import TextInput from '@leafygreen-ui/text-input';
import TextArea from '@leafygreen-ui/text-area';
import ExpandableCard from '@leafygreen-ui/expandable-card';
import { Table, TableHeader, Row, Cell } from '@leafygreen-ui/table';
import IconButton from "@leafygreen-ui/icon-button";
import { css } from "@leafygreen-ui/emotion";
import Config from "../config";
import Modal from "@leafygreen-ui/modal";
import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from "../providers/Api";

import { QRCode } from "react-qrcode-logo";
const QRCODE_SIZE = 480;

let topbarStyle = css`
  display: grid;
  margin-top: 20px;
  margin-botton: 20px;
  grid-template-columns: 50% 50%;
  div:first {
    text-align: left;
  }
  div:last-of-type {
    text-align: right;
  }
`;

let toggleButtonStyle = css`
  padding-right: 30px;
  display: block;
  float: left;
  text-align: left;
`;

const insertFormStyle = css`
  input {
    margin-bottom: 20px;
  }
  section {
    margin-bottom: 40px
  }
`

const otherSectionsStyle = css`
  h3 {
    display: inline-block;
  }
  > button {
    display: inline-block;
    float: right;
  }
  > div {
    margin: 20px 0;
    button {
      margin-top: 20px;
    }
  }
`

const qrCodeModalStyle = css`
text-align: center;
`
export default function Landings() {
  const { user } = useAuth0();
  let currentUserId = user.sub;

  const { fetchLandings, insertLanding, updateLanding } = useApi();

  const getLandings = useCallback(async () => {
    let results = await fetchLandings();
    setLandings(results);
  }, [fetchLandings]);

  useEffect(() => {
    getLandings();
  }, [getLandings]);

  let [showMyLandings, setShowMyLandings] = useState(true);
  let [insertModalOpened, setInsertModalOpened] = useState(false);
  let [landings, setLandings] = useState([]);
  let [modalMode, setModalMode] = useState("add");

  // New Landing form
  let [identifier, setIdentifier] = useState("");
  let [identifierState, setIdentifierState] = useState("none");
  let [title, setTitle] = useState("");
  let [subtitle, setSubtitle] = useState("");
  let [summary, setSummary] = useState("");
  let [ctaLabel, setCtaLabel] = useState("Try MongoDB Now");
  let [ctaLink, setCtaLink] = useState("https://mongodb.com");
  let [otherSections, setOtherSections] = useState([{ title: "Other content", content: "" }]);
  let [additionalResources, setAdditionalResources] = useState([{ title: "", link: "" }, { title: "", link: "" }, { title: "", link: "" }])

  let [qrCodeModalOpened, setQrCodeModalOpened] = useState(false);
  let [qrCodeDestination, setQrCodeDestination] = useState("");

  const showQrCode = async (route) => {
    await setQrCodeModalOpened(true);
    setQrCodeDestination(`landing.mdb.link/${route}`);
  }

  const handleNewSection = () => {
    setOtherSections([...otherSections, { title: "New Section", content: "" }])
  }

  const removeSection = (index) => {
    setOtherSections([...otherSections.slice(0, index), ...otherSections.slice(index + 1)])
  }

  const sectionTitleChange = (index, value) => {
    let sections = otherSections.map((s, i) => {
      if (i === index) s.title = value;
      return s;
    });
    setOtherSections(sections);
  }

  const sectionContentChange = (index, value) => {
    let sections = otherSections.map((s, i) => {
      if (i === index) s.content = value;
      return s;
    });
    setOtherSections(sections);
  }

  const resourceTitleChange = (index, value) => {
    let resources = additionalResources.map((r, i) => {
      if (i === index) r.title = value;
      return r;
    });
    setAdditionalResources(resources);
  }

  const resourceLinkChange = (index, value) => {
    let resources = additionalResources.map((r, i) => {
      if (i === index) r.link = value;
      return r;
    });
    setAdditionalResources(resources);
  }

  const handleNewResource = () => {
    setAdditionalResources([...(additionalResources || []), {title: "", link: ""}])
  }

  const handleIdentifierChange = value => {
    setIdentifierState(value.match(/^[a-z0-9-]*$/) ? "valid" : "error");
    setIdentifier(value);
  }

  const saveNewLanding = async () => {
    const ctaButton = {label: ctaLabel, linkTo: ctaLink};
    const landing = { title, subtitle, summary, ctaButton, otherSections, additionalResources, identifier };
    if (modalMode === "add") await insertLanding(landing);
    if (modalMode === "edit") await updateLanding(identifier, landing);
    await getLandings();
    setInsertModalOpened(false);
    emptyForm();
    setModalMode("add");
  }

  const emptyForm = () => {
    setIdentifier("");
    setTitle("");
    setSubtitle("");
    setSummary("");
    setCtaLabel("Try MongoDB Now");
    setCtaLink("https://mongodb.com");
    setOtherSections([{title: "Other content", content: ""}]);
    setAdditionalResources([{title: "", link: ""}, {title: "", link: ""}, {title: "", link: ""}]);
  }

  const fillForm = identifier => {
    let landing = landings.find(l => l.identifier === identifier);
    setIdentifier(landing.identifier);
    setTitle(landing.title);
    setSubtitle(landing.subtitle);
    setSummary(landing.summary);
    setCtaLabel(landing.ctaButton.label);
    setCtaLink(landing.ctaButton.linkTo);
    setOtherSections(landing.otherSections);
    setAdditionalResources(landing.additionalResources);
  }

  const editLanding = identifier => {
    fillForm(identifier);
    setInsertModalOpened(true);
    setModalMode("edit");
  }

  const cloneLanding = identifier => {
    fillForm(identifier);
    setInsertModalOpened(true);
    setModalMode("add");
  }

  return(
    <React.Fragment>
      <H2>List of landing pages</H2>
      <H3>Note: With the new Events landing pages, you shouldn't have the need for these for events.</H3>


      <section className={topbarStyle}>
        <div>
          <div className={toggleButtonStyle}>
            <Label id="toggleLabel" htmlFor="myLandingsToggle">
              Show Mine
            </Label>
            <Description>Show only landing pages that I have created</Description>
          </div>
          <div style={{display: "block", float: "left"}}>
            <Toggle
              id="myLandingsToggle"
              aria-labelledby="toggleLabel"
              onChange={(checked) => setShowMyLandings(checked)}
              checked={showMyLandings}
            />
          </div>
        </div>
        <div>
          <Button
            onClick={() => setInsertModalOpened(true)}
            variant="primary"
            leftGlyph={<Icon glyph="Plus" />}
          >
            Create New Landing Page
          </Button>
        </div>
      </section>

      <ConfirmationModal
        open={insertModalOpened}
        onCancel={() => setInsertModalOpened(false)}
        title={`${modalMode === "edit" ? "Update" : "Create"} a landing page`}
        buttonText="Save"
        onConfirm={saveNewLanding}
      >
        <form className={insertFormStyle}>
          <section>
            <H3>Internal</H3>
            <TextInput
              label="Internal Identifier"
              description="Used only by this application so you can recognize this landing page, and as the URL."
              value={identifier}
              errorMessage="You may only use lowercase letters, numbers, and hypens."
              state={identifierState}
              disabled={modalMode === "edit"}
              onChange={e => handleIdentifierChange(e.target.value)} />
          </section>
          <section>
            <H3>Page header</H3>
            <TextInput label="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <TextInput optional={true} label="Subtitle" value={subtitle} onChange={e => setSubtitle(e.target.value)} />
            <TextArea label="Summary" value={summary} onChange={e => setSummary(e.target.value)} />
          </section>
          <section>
            <H3>CTA Button</H3>
            <TextInput label="Label" value={ctaLabel} onChange={e => setCtaLabel(e.target.value)} />
            <TextInput label="Link To" value={ctaLink} onChange={e => setCtaLink(e.target.value)} />
          </section>
          <section className={otherSectionsStyle}>
            <H3>Page content</H3>
            <Button onClick={handleNewSection} variant="primaryOutline" leftGlyph={<Icon glyph="Plus" />}>Add Section</Button>
            {otherSections.map((section, index) => {
                return(
                  <ExpandableCard
                    title={section.title}
                  >
                    <TextInput label="Section Title" value={section.title} onChange={(e) => sectionTitleChange(index, e.target.value)}/>
                    <TextArea
                      label="Summary"
                      description="Support for full markdown. Use H3 (### section title) for sub headers."
                      value={section.content} onChange={(e) => sectionContentChange(index, e.target.value)}
                    />
                    <Button onClick={() => removeSection(index)} variant="dangerOutline" leftGlyph={<Icon glyph="Trash" />}>Remove Section</Button>
                  </ExpandableCard>
                )
              })}
          </section>
          <section className={otherSectionsStyle}>
            <H3>Additional Resources</H3>
            <Button onClick={handleNewResource} variant="primaryOutline" leftGlyph={<Icon glyph="Plus" />}>Add Resource</Button>
            {additionalResources?.map((resource, index) => {
                return(
                  <div>
                    <TextInput label="Title" value={resource.title} onChange={(e) => resourceTitleChange(index, e.target.value)}/>
                    <TextInput label="Link" value={resource.link} onChange={(e) => resourceLinkChange(index, e.target.value)}/>
                  </div>
                )
              })}
          </section>
        </form>
      </ConfirmationModal>

      <Modal open={qrCodeModalOpened} setOpen={setQrCodeModalOpened} className={qrCodeModalStyle}>
        <H3>QR Code for {qrCodeDestination}</H3>
        <QRCode
            value={qrCodeDestination}
            size={QRCODE_SIZE}
            ecLevel={"Q"}
            quietZone={20}
            bgColor={"#FFFFFF"}
            fgColor={"#023430"}
            logoImage="/logo-square-dark-green.png"
            logoWidth={QRCODE_SIZE * 0.2}
            logoOpacity={0.8}
            logoPadding={1}
            logoPaddingStyle={"square"}
            removeQrCodeBehindLogo={true}
            qrStyle={"square"}
            eyeRadius={undefined}
            eyeColor={"#023430"}
          />
      </Modal>

      <Table
        data={landings}
        columns={[
          <TableHeader label="Identifier"  sortBy={datum => datum.identifier}/>,
          <TableHeader label="Title"  sortBy={datum => datum.title}/>,
          <TableHeader label="Actions" />
        ]}
      >
        {({ datum }) => {
          const isOneOfMyRoutes = Array.isArray(datum.owner) ? datum.owner.includes(currentUserId) : (datum.owner === currentUserId);
          if (showMyLandings && !isOneOfMyRoutes) { return null; }
          else { return (
          <Row key={datum._id}>
            <Cell>{datum.identifier}</Cell>
            <Cell>{datum.title || " "}</Cell>
            <Cell>
              {isOneOfMyRoutes &&
              <IconButton darkMode={true} aria-label="Delete">
                <Icon glyph="Trash" fill="#aa0000" />
              </IconButton>
              }
              {isOneOfMyRoutes &&
              <IconButton darkMode={false} aria-label="Edit" onClick={() => editLanding(datum.identifier)}>
                <Icon glyph="Edit" fill="#023430" />
              </IconButton>
              }
              <IconButton aria-label="Clone" onClick={() => cloneLanding(datum.identifier)}>
                <Icon glyph="Clone" fill="#023430" />
              </IconButton>
              <IconButton darkMode={true} aria-label="QRCode" onClick={() => showQrCode(datum.identifier)}>
                <Icon glyph="Sweep" />
              </IconButton>
              <IconButton aria-label="Preview" href={`${Config.LANDING.URL}/${datum.identifier}`} target="_blank">
                <Icon glyph="Link" fill="#023430" />
              </IconButton>
            </Cell>
          </Row>
        )}}}
      </Table>
    </React.Fragment>
  )
}