import "bootstrap/dist/css/bootstrap.css";
import React, { Suspense, useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./confirmedpage.css";
import { db } from './DBUtils'; 
import { ref, query, orderByChild, equalTo, get, set } from "firebase/database";
import { Link, useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

  
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { message, Popconfirm } from 'antd';


const tempuser  = {
    "availability": [
      {
        "day": "Tuesday",
        "end": "1:30 PM",
        "start": "12:30 PM"
      },
      {
        "day": "Thursday",
        "end": "1:00 PM",
        "start": "12:00 PM"
      }
    ],
    "confirmed_requests": [
      "bonnie5",
      "foxy8"
    ],
    "fav_locations": "default",
    "first_name": "ChancellorNew",
    "gender": "male",
    "grade": "senior",
    "last_name": "Jones",
    "major": "computer science",
    "netid": "jones1",
    "password": "1234",
    "profile_pic": "default",
    "received_requests": [
      "freddy3",
      "chica4"
    ],
    "sent_requests": [
      "vadamo2",
      "killeen2"
    ]
  }


  const UserCardSent =  ({userObject, onAccept, onReject}) => {
    // for user profile popup
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showAccept, setShowAccept] = useState(false);
  const handleAcceptClose = () => setShowAccept(false);
  const handleAcceptShow = () => setShowAccept(true);


  return (
    <>

    <Card style={{ width: '21rem', margin: 'auto', marginBottom: '10px' }} >
      <Card.Body onClick={handleShow}>
        <Card.Title>{userObject.last_name} {userObject.first_name}</Card.Title>
        <Card.Text >
          {userObject.availability[0].start}-{userObject.availability[0].end} @ {userObject.fav_locations}
        </Card.Text>


      </Card.Body>
      <Card.Body>
        
      <Popconfirm
        title="Accept"
        description="Are you sure to accept?"
        onConfirm={onAccept}
        // onCancel={console.log('cancel')}
        okText="Yes"
        cancelText="No">
            {onAccept ? <Button variant="success" >Accept</Button> : <></>}
        
        </Popconfirm>

    <Popconfirm
        title="Delete"
        description="Are you sure to reject?"
        onConfirm={onReject}
        // onCancel={console.log('cancel')}
        okText="Yes"
        cancelText="No"
    >
        <Button variant="danger" style={{float: 'right'}}>Reject</Button>
        </Popconfirm>
      </Card.Body>


    </Card>

    <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{userObject.last_name} {userObject.first_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>

    </Modal>
    </>
  );
}




function ComfirmedPage() {
    const [users, setUsers] = useState([]);
    const [userObject, setUserObject] = useState({})
    const [sent, setSent] = useState([])
    const [received, setReceived] = useState([])
    const [confirmed, setConfirmed] = useState([])

    const { user } = useParams();


    useEffect(() => {
        const readallusers = async () => {
            try {
                // Use the 'db' to query the database and fetch user data based on the 'netId'
                const userRef = ref(db, `/users`);
                const snapshot = await get(userRef);
                setUsers(snapshot.val())
                console.log(snapshot.val())
                console.log(user)
                

              } catch (error) {
                // Handle any potential errors
                console.error("Error fetching user:", error);
                throw error;
              }
        };
        // readallusers()

        const userRef = ref(db, `/users`);
        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                setUsers(snapshot.val())
                let userobj = snapshot.val().filter((e)=>{
                    return e.netid == user
                })
                if (userobj.length >= 1){
                    userobj = userobj[0]
                    setUserObject(userobj)
                    let sentlist = snapshot.val().filter((e)=>{
                        return userobj.sent_requests.includes(e.netid);
                    })
                    // for testing only
                    sentlist.push(userobj)
                    sentlist.push(userobj)
                    sentlist.push(userobj)
                    sentlist.push(userobj)
                    sentlist.push(userobj)
                    sentlist.push(userobj)
                    sentlist.push(userobj)
                    sentlist.push(userobj)
                    sentlist.push(userobj)
                    sentlist.push(userobj)
                    sentlist.push(userobj)
                    sentlist.push(userobj)
                    sentlist.push(userobj)
                    sentlist.push(userobj)
                    setSent(sentlist)
    
                    let receivedlist = snapshot.val().filter((e)=>{
                        return userobj.received_requests.includes(e.netid);
                    })
                    // for testing only
                    receivedlist.push(userobj)
                    receivedlist.push(userobj)
                    receivedlist.push(userobj)
                    receivedlist.push(userobj)
                    receivedlist.push(userobj)
                    receivedlist.push(userobj)
                    receivedlist.push(userobj)
                    receivedlist.push(userobj)
                    setReceived(receivedlist)
                    
                    let confirmedlist = snapshot.val().filter((e)=>{
                        return userobj.confirmed_requests.includes(e.netid);
                    })
                    // for testing only
                    confirmedlist.push(userobj)
                    confirmedlist.push(userobj)
                    confirmedlist.push(userobj)
                    confirmedlist.push(userobj)
                    confirmedlist.push(userobj)
                    confirmedlist.push(userobj)
                    confirmedlist.push(userobj)
                    confirmedlist.push(userobj)
                    confirmedlist.push(userobj)
                    confirmedlist.push(userobj)

                    setConfirmed(confirmedlist)
                }
   
            }
        })





      }, []);


      const sentReject = () => {

      }
      const receivedAccept = () => {

      }
      const receivedReject = () => {

      }

      const confirmedReject = () => {

      }
      



  return (
    <Tabs defaultActiveKey="Sent" id="fill-tab-example" className="mb-3" fill>
      <Tab eventKey="Sent" title="Sent">
        <div className="confirmed-page-window">
            {sent.map((e,i) => {
                return <UserCardSent key={i} userObject={e} onAccept={null} onReject={sentReject}/>
            })}
        </div>

      </Tab>
      <Tab eventKey="Received" title="Received">
      <div className="confirmed-page-window">
      {received.map((e,i) => {
            return <UserCardSent key={i} userObject={e} onAccept={receivedAccept} onReject={receivedReject}/>
        })}
        </div>
      </Tab>
    
      <Tab eventKey="Confirmed" title="Confirmed">
      <div className="confirmed-page-window">
      {confirmed.map((e,i) => {
            return <UserCardSent key={i} userObject={e}  onAccept={null} onReject={confirmedReject}/>
        })}
        </div>
      </Tab>
    </Tabs>
  );
}

export default ComfirmedPage;
