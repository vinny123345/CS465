import "bootstrap/dist/css/bootstrap.css";
import React, { Suspense, useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./confirmedpage.css";
import { db } from './DBUtils'; 
import { ref, query, orderByChild, equalTo, get, set, onValue, push } from "firebase/database";
import { Link, useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

  
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { message, Popconfirm } from 'antd';

  const UserCardSent =  ({userObject, onAccept, onReject}) => {
    // for user profile popup
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



  return (
    <>

    <Card style={{ width: '21rem', margin: 'auto', marginBottom: '10px' }} >
      <Card.Body onClick={handleShow}>
        <Card.Title>{userObject.last_name} {userObject.first_name} ({userObject.netid})</Card.Title>
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
        const userRef = ref(db, `/users`);
        onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                console.log(snapshot.val())
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
                    // sentlist.push(userobj)
                    // sentlist.push(userobj)
                    // sentlist.push(userobj)
                    // sentlist.push(userobj)
                    // sentlist.push(userobj)
                    // sentlist.push(userobj)
                    // sentlist.push(userobj)
                    // sentlist.push(userobj)
                    // sentlist.push(userobj)
                    // sentlist.push(userobj)
                    // sentlist.push(userobj)
                    // sentlist.push(userobj)
                    // sentlist.push(userobj)
                    // sentlist.push(userobj)
                    setSent(sentlist)
    
                    let receivedlist = snapshot.val().filter((e)=>{
                        return userobj.received_requests.includes(e.netid);
                    })
                    // for testing only
                    // receivedlist.push(userobj)
                    // receivedlist.push(userobj)
                    // receivedlist.push(userobj)
                    // receivedlist.push(userobj)
                    // receivedlist.push(userobj)
                    // receivedlist.push(userobj)
                    // receivedlist.push(userobj)
                    // receivedlist.push(userobj)
                    setReceived(receivedlist)
                    
                    let confirmedlist = snapshot.val().filter((e)=>{
                        return userobj.confirmed_requests.includes(e.netid);
                    })
                    // for testing only
                    // confirmedlist.push(userobj)
                    // confirmedlist.push(userobj)
                    // confirmedlist.push(userobj)
                    // confirmedlist.push(userobj)
                    // confirmedlist.push(userobj)
                    // confirmedlist.push(userobj)
                    // confirmedlist.push(userobj)
                    // confirmedlist.push(userobj)
                    // confirmedlist.push(userobj)
                    // confirmedlist.push(userobj)

                    setConfirmed(confirmedlist)
                }
            }
        });

        // for test only: 
        // 0: Jones1
        // 1: vadamo2
        // 2: Freddy3
        // confirmed_requests, received_requests, sent_requests

        // set(push(ref(db, `/users/0/sent_requests`)), 'freddy3');
        // set(push(ref(db, `/users/2/received_requests`)), 'Jones1');


      }, []);

      // current user: remove from current user - sent
      // effected user: remove from target user - received
      const sentReject = async (currnetid, effectednetid) => {

        get(ref(db, `/users`)).then((snapshot) => {
        if (snapshot.exists() && snapshot.val().length > 0) {
            console.log('sentreject test start')
            console.log(snapshot.val());
            console.log('sentreject test finish')

            // current user: remove from current user - sent
            let currUserfbIndex = snapshot.val().findIndex((e) => e.netid == currnetid)
            let currUserObj = snapshot.val().filter((e)=> e.netid == currnetid )
            if (currUserObj.length >= 1){ 
                currUserObj = currUserObj[0] 
                let updatedCurrUserSentList = currUserObj.sent_requests.filter((e) => e != effectednetid)
                console.log(updatedCurrUserSentList)
                set(ref(db, `/users/${currUserfbIndex}/sent_requests`), updatedCurrUserSentList);
            }

            // effected user: remove from target user - received
            let effUserfbIndex = snapshot.val().findIndex((e) => e.netid == effectednetid)
            let effUserObj = snapshot.val().filter((e)=> e.netid == effectednetid )

            if (effUserObj.length >= 1){ 
                effUserObj = effUserObj[0] 

                let updatedEffUserReceivedList = effUserObj.received_requests.filter((e) => e != currnetid)
                console.log(updatedEffUserReceivedList)
                set(ref(db, `/users/${effUserfbIndex}/received_requests`), updatedEffUserReceivedList);
            }

        } else {
            console.log("No data available");
        }
        }).catch((error) => {
        console.error(error);
        });

      }

      // current user: move from received to confirmed
      // effected user: move from sent to confirmed
      const receivedAccept = async (currnetid, effectednetid) => {

        get(ref(db, `/users`)).then((snapshot) => {
            if (snapshot.exists() && snapshot.val().length > 0) {

    
                // current user: move from received to confirmed
                let currUserfbIndex = snapshot.val().findIndex((e) => e.netid == currnetid)
                let currUserObj = snapshot.val().filter((e)=> e.netid == currnetid )
                if (currUserObj.length >= 1){ 
                    currUserObj = currUserObj[0] 
                    
                    currUserObj.received_requests = currUserObj.received_requests.filter((e) => e != effectednetid)
                    currUserObj.confirmed_requests.push(effectednetid)
                    

                    console.log(currUserObj)
                    set(ref(db, `/users/${currUserfbIndex}`), currUserObj);
                }
    
                // effected user: move from sent to confirmed
                let effUserfbIndex = snapshot.val().findIndex((e) => e.netid == effectednetid)
                let effUserObj = snapshot.val().filter((e)=> e.netid == effectednetid )
    
                if (effUserObj.length >= 1){ 
                    effUserObj = effUserObj[0] 
    
                    effUserObj.sent_requests = effUserObj.sent_requests.filter((e) => e != currnetid)
                    effUserObj.confirmed_requests.push(currnetid)

                    console.log(effUserObj)
                    set(ref(db, `/users/${effUserfbIndex}`), effUserObj);
                }
    
            } else {
                console.log("No data available");
            }
            }).catch((error) => {
            console.error(error);
            });



      }

      // current user: remove from received
      // effected user: remove from sent
      const receivedReject = async (currnetid, effectednetid) => {

        get(ref(db, `/users`)).then((snapshot) => {
            if (snapshot.exists() && snapshot.val().length > 0) {

                // current user: remove from received
                let currUserfbIndex = snapshot.val().findIndex((e) => e.netid == currnetid)
                let currUserObj = snapshot.val().filter((e)=> e.netid == currnetid )
                if (currUserObj.length >= 1){ 
                    currUserObj = currUserObj[0] 
                    
                    let updatedCurrUserList = currUserObj.received_requests.filter((e) => e != effectednetid)
                    console.log(updatedCurrUserList)
                    set(ref(db, `/users/${currUserfbIndex}/received_requests`), updatedCurrUserList);
                }
    
                // effected user: remove from sent
                let effUserfbIndex = snapshot.val().findIndex((e) => e.netid == effectednetid)
                let effUserObj = snapshot.val().filter((e)=> e.netid == effectednetid )
    
                if (effUserObj.length >= 1){ 
                    effUserObj = effUserObj[0] 
    
                    let updatedEffUserList = effUserObj.sent_requests.filter((e) => e != currnetid)
                    console.log(updatedEffUserList)
                    set(ref(db, `/users/${effUserfbIndex}/sent_requests`), updatedEffUserList);
                }
    
            } else {
                console.log("No data available");
            }
            }).catch((error) => {
            console.error(error);
            });



      }

      // current user: remove from confirmed
      // effected user: remove from confirmed
      const confirmedReject = async (currnetid, effectednetid) => {

        get(ref(db, `/users`)).then((snapshot) => {
            if (snapshot.exists() && snapshot.val().length > 0) {

    
                // current user: remove from confirmed
                let currUserfbIndex = snapshot.val().findIndex((e) => e.netid == currnetid)
                let currUserObj = snapshot.val().filter((e)=> e.netid == currnetid )
                if (currUserObj.length >= 1){ 
                    currUserObj = currUserObj[0] 
                    
                    let updatedCurrUserList = currUserObj.confirmed_requests.filter((e) => e != effectednetid)
                    console.log(updatedCurrUserList)
                    set(ref(db, `/users/${currUserfbIndex}/confirmed_requests`), updatedCurrUserList);
                }
    
                // effected user: remove from confirmed
                let effUserfbIndex = snapshot.val().findIndex((e) => e.netid == effectednetid)
                let effUserObj = snapshot.val().filter((e)=> e.netid == effectednetid )
    
                if (effUserObj.length >= 1){ 
                    effUserObj = effUserObj[0] 
    
                    let updatedEffUserList = effUserObj.confirmed_requests.filter((e) => e != currnetid)
                    console.log(updatedEffUserList)
                    set(ref(db, `/users/${effUserfbIndex}/confirmed_requests`), updatedEffUserList);
                }
    
            } else {
                console.log("No data available");
            }
            }).catch((error) => {
            console.error(error);
            });




      }
      



  return (
    <Tabs defaultActiveKey="Sent" id="fill-tab-example" className="mb-3" fill>
      <Tab eventKey="Sent" title="Sent">
        <div className="confirmed-page-window">
            {sent.map((e,i) => {
                return <UserCardSent key={i} userObject={e} onAccept={null} onReject={()=>sentReject(user,e.netid)}/>
            })}
        </div>

      </Tab>
      <Tab eventKey="Received" title="Received">
      <div className="confirmed-page-window">
      {received.map((e,i) => {
            return <UserCardSent key={i} userObject={e} onAccept={receivedAccept(user,e.netid)} onReject={receivedReject(user,e.netid)}/>
        })}
        </div>
      </Tab>
    
      <Tab eventKey="Confirmed" title="Confirmed">
      <div className="confirmed-page-window">
      {confirmed.map((e,i) => {
            return <UserCardSent key={i} userObject={e}  onAccept={null} onReject={confirmedReject(user,e.netid)}/>
        })}
        </div>
      </Tab>
    </Tabs>
  );
}

export default ComfirmedPage;
