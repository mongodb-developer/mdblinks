import { Link } from "@leafygreen-ui/typography";
import IconButton from '@leafygreen-ui/icon-button';
import InlineDefinition from "@leafygreen-ui/inline-definition";
import { Table, TableHeader, Row, Cell } from '@leafygreen-ui/table';
import Icon from '@leafygreen-ui/icon';
import config from "../../config";

const TRUNCATE_LENGTH = 50;

export default function ShortiesTable(props) {
  const { data, currentUserId, showMyRoutes, editRoute, handleDelete, showQrCode, showChartModal } = props;

  return (
    <Table
      data={data}
      columns={[
        <TableHeader label="Short URL"  sortBy={datum => datum.route}/>,
        <TableHeader label="Destination"  sortBy={datum => datum.to}/>,
        <TableHeader label="Title"  sortBy={datum => datum.title}/>,
        <TableHeader label="Public" />,
        <TableHeader label="Actions" />
      ]}
    >
      {({ datum }) => {
        const isOneOfMyRoutes = Array.isArray(datum.owner) ? datum.owner.includes(currentUserId) : (datum.owner === currentUserId);
        if (showMyRoutes && !isOneOfMyRoutes) return;
        return (
        <Row key={datum._id}>
          <Cell><Link href={`${config.REDIRECTOR.URL}${datum.route}`} rel="noreferrer" target="_blank">{datum.route}</Link></Cell>
          <Cell>
            <InlineDefinition definition={datum.to}>
              <Link href={datum.to} rel="noreferrer" target="_blank">{`${datum.to.substr(0, TRUNCATE_LENGTH)}${datum.to.length > TRUNCATE_LENGTH ? "..." : ""}`}</Link>
            </InlineDefinition>
          </Cell>
          <Cell>{datum.title || " "}</Cell>
          <Cell>{datum.isPublic ? "Yes" : "No"}</Cell>
          <Cell>
            {isOneOfMyRoutes &&
            <IconButton darkMode={true} aria-label="Delete" onClick={() => handleDelete(datum._id.toString())}>
              <Icon glyph="Trash" fill="#aa0000" />
            </IconButton>
            }
            {isOneOfMyRoutes &&
            <IconButton aria-label="Edit" onClick={() => editRoute(datum.route)}>
              <Icon glyph="Edit" />
            </IconButton>
            }
            <IconButton darkMode={true} aria-label="QRCode" onClick={() => showQrCode(datum.route)}>
              <Icon glyph="Sweep" />
            </IconButton>
            <IconButton darkMode={true} aria-label="Chart" onClick={() => showChartModal(datum.route)}>
              <Icon glyph="Charts" />
            </IconButton>
          </Cell>
        </Row>
      )
      }}
    </Table>
  )
}