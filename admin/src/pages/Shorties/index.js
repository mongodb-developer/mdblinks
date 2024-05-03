import React, {useEffect, useState, useCallback} from "react";
import { H2, Label, Description } from "@leafygreen-ui/typography";
import Toggle from "@leafygreen-ui/toggle";
import Button from "@leafygreen-ui/button";
import Icon from '@leafygreen-ui/icon';
import { css } from "@leafygreen-ui/emotion";
import { Spinner } from "@leafygreen-ui/loading-indicator";
import ShortiesTable from "./ShortiesTable";
import ChartModal from "./ChartModal";
import QrCodeModal from "./QrCodeModal";
import { useAuth0 } from "@auth0/auth0-react";
import { useApi } from "../../providers/Api";
import ShortieModal from "./ShortieModal";

export default function Routes () {
  let [insertModalOpened, setInsertModalOpened] = useState(false);
  let [qrCodeModalOpened, setQrCodeModalOpened] = useState(false);
  let [qrCodeDestination, setQrCodeDestination] = useState("");
  let [chartModalOpened, setChartModalOpened] = useState(false);
  let [chartRoute, setChartRoute] = useState("");
  let [data, setData] = useState([]);
  let [modalMode, setModalMode] = useState("add");
  let [showMyRoutes, setShowMyRoutes] = useState(true);
  let [routeToEdit, setRouteToEdit] = useState({});
  let [doneLoading, setDoneLoading] = useState(false);

  const { user } = useAuth0();
  let currentUserId = user.sub;

  const { fetchRoutes, deleteRoute } = useApi();

  const qrCodeModalStyle = css`
    text-align: center;
    max-height: 100vh;
  `

  const topBarStyle = css`
    text-align: right;
  `

  const toggleButtonStyle = css`
    padding-right: 30px;
    display: block;
    float: left;
    text-align: left;
  `;

  const getData = useCallback(async () => {
    setDoneLoading(false);
    let results = await fetchRoutes();
    setData(results);
    setDoneLoading(true);
  }, [fetchRoutes]);

  const showQrCode = async (route) => {
    await setQrCodeModalOpened(true);
    setQrCodeDestination(`mdb.link${route}`);
  }

  const showChartModal = async (route) => {
    setChartModalOpened(true);
    setChartRoute(route);
  }

  const handleDelete = async (id) => {
    await deleteRoute(id);
    getData();
  }

  const handleEditRoute = async (route) => {
    setModalMode("edit");
    setInsertModalOpened(true);
    setRouteToEdit(route);
  }

  useEffect(() => {
    const loadRoutes = async () => {
      let routes = await fetchRoutes();
      setData(routes);
      setDoneLoading(true);
    }
    loadRoutes();
  }, []);

  return  (
    <React.Fragment>
      <H2>List of Short URLs</H2>

      <p className={topBarStyle}>
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
              onChange={(checked) => setShowMyRoutes(checked)}
              checked={showMyRoutes}
            />
          </div>
        </div>
        <div>
          <Button
            onClick={() => setInsertModalOpened(true)}
            variant="primary"
            leftGlyph={<Icon glyph="Plus" />}
          >
            Insert New Short URL
          </Button>
        </div>
      </p>

      <ShortieModal
        open={insertModalOpened}
        modalMode={modalMode}
        setOpen={setInsertModalOpened}
        setModalMode={setModalMode}
        allRoutes={data}
        refreshData={getData}
        routeToEdit={routeToEdit}
      />

      <QrCodeModal
        open={qrCodeModalOpened}
        setOpen={setQrCodeModalOpened}
        qrCodeDestination={qrCodeDestination}
        className={qrCodeModalStyle}
      />

      <ChartModal
        open={chartModalOpened}
        setOpen={setChartModalOpened}
        chartRoute={chartRoute}
      />

      {doneLoading &&
        <ShortiesTable
          data={data}
          currentUserId={currentUserId}
          showMyRoutes={showMyRoutes}
          getData={getData}
          editRoute={handleEditRoute}
          allRoutes={data}
          handleDelete={handleDelete}
          showQrCode={showQrCode}
          showChartModal={showChartModal}
        />
      }
      {!doneLoading &&
        <Spinner
          description="Loading..."
          displayOption="large-vertical"
        />
      }

    </React.Fragment>
  )
}