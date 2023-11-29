import "bootstrap/dist/css/bootstrap.css";
import { React, useState } from "react";
import "./confirmedpage.css";
import Card from "react-bootstrap/Card";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { message, Popconfirm } from "antd";

export const UserCardSent = ({
  userObject,
  requestObject,
  onAccept,
  onReject,
}) => {
  // for user profile popup
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Card style={{ width: "21rem", margin: "auto", marginBottom: "10px" }}>
        <Card.Body onClick={handleShow}>
          <Card.Title>
            {userObject.last_name ? userObject.last_name : "Last Name"}{" "}
            {userObject.first_name ? userObject.first_name : "First Name"} (
            {userObject.netid ? userObject.netid : "netid"})
          </Card.Title>
          <Card.Text>
            {requestObject.date ? requestObject.date : "Date"}:
            {requestObject.time
              ? requestObject.time.startTime + "-" + requestObject.time.endTime
              : "time"}{" "}

          <p>
              Location:{" "}
              {userObject.fav_locations === undefined
                ? "No favorite locations"
                : userObject.fav_locations.map((location) => {
                    return location + ", ";
                  })}
          </p>


            {/* @ {requestObject.location ? requestObject.location : "location"} */}

          
          </Card.Text>
        </Card.Body>
        <Card.Body>
          <Popconfirm
            title="Accept"
            description="Are you sure to accept?"
            onConfirm={onAccept}
            // onCancel={console.log('cancel')}
            okText="Yes"
            cancelText="No"
          >
            {onAccept ? <Button variant="success" style={{ float: "left" }}>Accept</Button> : <></>}
          </Popconfirm>

          <Popconfirm
            title="Delete"
            description="Are you sure to reject?"
            onConfirm={onReject}
            // onCancel={console.log('cancel')}
            okText="Yes"
            cancelText="No"
          >
            {onReject ? (
              <Button variant="danger" style={{ float: "right" }}>
                Cancel
              </Button>
            ) : (
              <></>
            )}
          </Popconfirm>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {userObject.last_name ? userObject.last_name : "Last Name"}{" "}
            {userObject.first_name ? userObject.first_name : "First Name"} (
            {userObject.netid ? userObject.netid : "netid"})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Gender: {userObject.gender}</p>
          <p>Grade: {userObject.grade}</p>
          <p>Major: {userObject.major}</p>

          <p>
              Location:{" "}
              {userObject.fav_locations === undefined
                ? "No favorite locations"
                : userObject.fav_locations.map((location) => {
                    return location + ", ";
                  })}
          </p>


          {requestObject.date ? requestObject.date : "Date"}:
          {requestObject.time
            ? requestObject.time.startTime + "-" + requestObject.time.endTime
            : "time"}{" "}

          {/* @ {requestObject.location ? requestObject.location : "location"} */}
        </Modal.Body>
        <Modal.Footer>
          Contact {userObject.first_name ? userObject.first_name : "First Name"}{" "}
          at {userObject.netid ? userObject.netid : "netid"}@illinois.edu !
        </Modal.Footer>
      </Modal>
    </>
  );
};

export const UserCardSearch = ({
  userObject,
  onAccept,
  onReject,
  dayOfWeek,
}) => {
  // for user profile popup
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  if (
    userObject.availability === null ||
    userObject.availability === undefined
  ) {
    return null;
  }
  if (
    userObject.availability[dayOfWeek] === null ||
    userObject.availability[dayOfWeek] === undefined
  ) {
    return null;
  }
  return (
    <>
      <Card style={{ width: "21rem", margin: "auto", marginBottom: "10px" }}>
        <Card.Body onClick={handleShow}>
          <Card.Title>
            {userObject.last_name} {userObject.first_name} ({userObject.netid})
          </Card.Title>
          <Card.Text>
            <p>
              Time: {userObject.availability[dayOfWeek].startTime}-
              {userObject.availability[dayOfWeek].endTime}
            </p>
            <p>
              Location:{" "}
              {userObject.fav_locations === undefined
                ? "No favorite locations"
                : userObject.fav_locations.map((location) => {
                    return location + ", ";
                  })}
            </p>
          </Card.Text>
        </Card.Body>
        <Card.Body>
          <Popconfirm
            title="Invitation"
            description="Are you sure to invite?"
            onConfirm={onAccept}
            // onCancel={console.log('cancel')}
            okText="Yes"
            cancelText="No"
          >
            {onAccept ? (
              <Button variant="success">Send Invitation</Button>
            ) : (
              <></>
            )}
          </Popconfirm>

          <Popconfirm
            title="Delete"
            description="Are you sure to reject?"
            onConfirm={onReject}
            // onCancel={console.log('cancel')}
            okText="Yes"
            cancelText="No"
          >
            {onReject ? (
              <Button variant="danger" style={{ float: "right" }}>
                Reject
              </Button>
            ) : (
              <></>
            )}
          </Popconfirm>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {userObject.last_name} {userObject.first_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Gender: {userObject.gender}</p>
          <p>Grade: {userObject.grade}</p>
          <p>Major: {userObject.major}</p>
        </Modal.Body>
      </Modal>
    </>
  );
};
