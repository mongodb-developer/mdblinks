import { useState, useEffect } from "react";
import { H3, Body } from "@leafygreen-ui/typography";
import Modal from "@leafygreen-ui/modal";
import { useApi } from "../../providers/Api";

export default function ChartModal(props) {
  const { open, setOpen, chartRoute, className } = props;

  const { getRouteStats } = useApi();

  let [routeStats, setRouteStats] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      let stats = await getRouteStats(chartRoute);
      setRouteStats(stats);
    }
    fetchStats();
  }, [chartRoute])

  return (
    <Modal open={open} setOpen={setOpen} className={className}>
      <H3>Stats for {chartRoute}</H3>
      <Body>
        Number of visitors in the last 7 days: {routeStats?.stats?.visits || "0"}<br/>
        Number of visitors in the last 30 days: {routeStats?.stats?.visits30 || "0"}<br/>
        Number of visitors all time: {routeStats?.stats?.visitsAllTime || "0"}<br/>
      </Body>
      <Body>
        Top referrers:
        <ul>
          {(routeStats?.stats?.topReferrers || []).map(r => {
            return (
              <li>{r._id} ({r.count})</li>
            )
          })}
        </ul>
      </Body>
    </Modal>
  )
}