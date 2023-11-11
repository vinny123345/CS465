import "bootstrap/dist/css/bootstrap.css";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

// type, list
function UserCard(props) {
  return <h1>Hello, {props.name}</h1>;
}

function ComfirmedPage() {
  return (
    <Tabs defaultActiveKey="Sent" id="fill-tab-example" className="mb-3" fill>
      <Tab eventKey="Sent" title="Sent">
        Sent
      </Tab>
      <Tab eventKey="Received" title="Received">
        Received
      </Tab>
      <Tab eventKey="Confirmed" title="Confirmed">
        Confirmed
      </Tab>
    </Tabs>
  );
}

export default ComfirmedPage;
