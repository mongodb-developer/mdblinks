import Header from "./Header";
import Navigation from "./Navigation";
import { css } from "@leafygreen-ui/emotion";
import { Outlet } from "react-router-dom";

const gridStyle = css`
  display: grid;
  grid-template:
    [header-start] "header header" 107px [header-end body-start]
    "side-nav body" auto [body-end] / auto 1fr;
  width: 100vw;
  max-width: 100%;
  height: 100vh;
  min-width: 767px;
  margin: 0px;
`;

const headerStyle = css`
  grid-area: header;
  padding: 24px;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.2);
`;

const sideNavStyle = css`
  grid-area: side-nav;
  margin-top: 3px;
`;

const mainStyle = css`
  grid-area: body;
  padding: 12px;
`;

export default function Layout(props) {
  return(
    <div className={gridStyle}>
      <section className={headerStyle}>
        <Header title="URL Shortener"/>
      </section>
      <Navigation className={sideNavStyle} />

      <section className={mainStyle}>
        <Outlet />
      </section>
    </div>
  )
}