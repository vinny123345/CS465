import "bootstrap/dist/css/bootstrap.css";
import { React, useState } from "react";
import "./confirmedpage.css";
import Card from "react-bootstrap/Card";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { message, Popconfirm } from "antd";

export const UserCardSent = ({ userObject, onAccept, onReject }) => {
  // for user profile popup
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Card style={{ width: "21rem", margin: "auto", marginBottom: "10px" }}>
        <Card.Body onClick={handleShow}>
          <Card.Title>
            {userObject.last_name} {userObject.first_name} ({userObject.netid})
          </Card.Title>
          <Card.Text>
            {userObject.availability["Friday"].startTime}-
            {userObject.availability["Friday"].endTime} @{" "}
            {userObject.fav_locations}
            {/* "Friday" is hardcoded for now */}
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
            {onAccept ? <Button variant="success">Accept</Button> : <></>}
          </Popconfirm>

          <Popconfirm
            title="Delete"
            description="Are you sure to reject?"
            onConfirm={onReject}
            // onCancel={console.log('cancel')}
            okText="Yes"
            cancelText="No"
          >
            {onReject ? <Button variant="success">Reject</Button> : <></>}
          </Popconfirm>
        </Card.Body>
      </Card>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {userObject.last_name} {userObject.first_name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
      </Modal>
    </>
  );
};

export default UserCardSent;
