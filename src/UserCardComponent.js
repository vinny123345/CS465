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
        <Card.Body onClick={handleShow} style={{ paddingBottom: "0" }}>
          <Card.Title>
            {userObject.first_name ? userObject.first_name : "First Name"}{" "}
            {userObject.last_name ? userObject.last_name : "Last Name"} (
            {userObject.netid ? userObject.netid : "netid"})
          </Card.Title>
          <Card.Text>
            <p>
              Location:{" "}
              {userObject.fav_locations === undefined
                ? "No favorite locations"
                : userObject.fav_locations.map((location) => {
                    return location + ", ";
                  })}
            </p>
            <p>
              {requestObject.date ? requestObject.date : "Date"}:
              {requestObject.date &&
              userObject.availability &&
              userObject.availability[requestObject.date] &&
              userObject.availability[requestObject.date].startTime
                ? userObject.availability[requestObject.date].startTime
                : "N/A"}
              -
              {requestObject.date &&
              userObject.availability &&
              userObject.availability[requestObject.date] &&
              userObject.availability[requestObject.date].endTime
                ? userObject.availability[requestObject.date].endTime
                : "N/A"}
              {/* {userObject.availability[requestObject.date].startTime}-
            {userObject.availability[requestObject.date].endTime} */}
              {/* {requestObject.time
              ? requestObject.time.startTime + "-" + requestObject.time.endTime
              : "time"}{" "} */}
            </p>
            {/* @ {requestObject.location ? requestObject.location : "location"} */}
          </Card.Text>
        </Card.Body>
        <Card.Body style={{ paddingTop: "0" }}>
          <Popconfirm
            title="Accept"
            description="Are you sure to accept?"
            onConfirm={onAccept}
            // onCancel={console.log('cancel')}
            okText="Yes"
            cancelText="No"
          >
            {onAccept ? (
              <Button variant="success" style={{ float: "left" }}>
                Accept
              </Button>
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
            {userObject.first_name ? userObject.first_name : "First Name"}{" "}
            {userObject.last_name ? userObject.last_name : "Last Name"} (
            {userObject.netid ? userObject.netid : "netid"})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Gender: {userObject.gender ? userObject.gender : "N/A"}</p>
          <p>Grade: {userObject.grade ? userObject.grade : "N/A"}</p>
          <p>Major: {userObject.major ? userObject.major : "N/A"}</p>
          <p>
            Location:{" "}
            {userObject.fav_locations === undefined
              ? "No favorite locations"
              : userObject.fav_locations.map((location) => {
                  return location + ", ";
                })}
          </p>
          {requestObject.date ? requestObject.date : "Date"}:
          {requestObject.date &&
          userObject.availability &&
          userObject.availability[requestObject.date] &&
          userObject.availability[requestObject.date].startTime
            ? userObject.availability[requestObject.date].startTime
            : "N/A"}
          -
          {requestObject.date &&
          userObject.availability &&
          userObject.availability[requestObject.date] &&
          userObject.availability[requestObject.date].endTime
            ? userObject.availability[requestObject.date].endTime
            : "N/A"}
          {/* {userObject.availability[requestObject.date].startTime}-{userObject.availability[requestObject.date].endTime} */}
          {/* {requestObject.time
            ? requestObject.time.startTime + "-" + requestObject.time.endTime
            : "time"}{" "} */}
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
            {userObject.first_name ? userObject.first_name : "First Name"}{" "}
            {userObject.last_name ? userObject.last_name : "Last Name"} (
            {userObject.netid ? userObject.netid : "netid"})
          </Card.Title>
          <Card.Text>
            <p>
              Location:{" "}
              {userObject.fav_locations === undefined
                ? "No favorite locations"
                : userObject.fav_locations.map((location) => {
                    return location + ", ";
                  })}
            </p>
            <p>
              Time:{" "}
              {userObject.availability &&
              userObject.availability[dayOfWeek] &&
              userObject.availability[dayOfWeek].startTime
                ? userObject.availability[dayOfWeek].startTime
                : "N/A"}
              -
              {userObject.availability &&
              userObject.availability[dayOfWeek] &&
              userObject.availability[dayOfWeek].endTime
                ? userObject.availability[dayOfWeek].endTime
                : "N/A"}
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
            {userObject.first_name ? userObject.first_name : "First Name"}{" "}
            {userObject.last_name ? userObject.last_name : "Last Name"} (
            {userObject.netid ? userObject.netid : "netid"})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Gender: {userObject.gender ? userObject.gender : "N/A"}</p>
          <p>Grade: {userObject.grade ? userObject.grade : "N/A"}</p>
          <p>Major: {userObject.major ? userObject.major : "N/A"}</p>
          <p>
            Location:{" "}
            {userObject.fav_locations === undefined
              ? "No favorite locations"
              : userObject.fav_locations.map((location) => {
                  return location + ", ";
                })}
          </p>
          {dayOfWeek}:
          {/* {userObject.availability[requestObject.date].startTime}-{userObject.availability[requestObject.date].endTime} */}
          {userObject.availability &&
          userObject.availability[dayOfWeek] &&
          userObject.availability[dayOfWeek].startTime
            ? userObject.availability[dayOfWeek].startTime
            : "N/A"}
          -
          {userObject.availability &&
          userObject.availability[dayOfWeek] &&
          userObject.availability[dayOfWeek].endTime
            ? userObject.availability[dayOfWeek].endTime
            : "N/A"}
        </Modal.Body>
      </Modal>
    </>
  );
};
