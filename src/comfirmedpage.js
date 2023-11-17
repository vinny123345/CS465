import "bootstrap/dist/css/bootstrap.css";
import React, { Suspense, useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./confirmedpage.css";
import { db } from "./DBUtils";
import {
  ref,
  query,
  orderByChild,
  equalTo,
  get,
  set,
  onValue,
  push,
  update
} from "firebase/database";
import { Link, useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { message, Popconfirm } from "antd";
import { UserCardSent } from "./UserCardComponent";

function ComfirmedPage() {
  const [users, setUsers] = useState([]);
  const [userObject, setUserObject] = useState({});
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [confirmed, setConfirmed] = useState([]);

  const { user } = useParams();

  useEffect(() => {
    const userRef = ref(db, `/users`);
    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        console.log(user);
        setUsers(snapshot.val());
        let userobj = snapshot.val()[user];

        if (userobj) {
          setUserObject(userobj);
          //sent_requests: {uniqueid: {netid: , date:, time: , location: }, uniqueid2:{},......}
          // requestId: {requestId, netid, time, date, location}
          let sentlist = [];
          if (userobj.sent_requests) {
            for (const reqid in userobj.sent_requests){

              if(!userobj.sent_requests[reqid]){continue}
              let eid = userobj.sent_requests[reqid].netid

              if(!eid){continue}
              if(!snapshot.val()[eid]){continue}
              

              // requestId: {requestId, netid, time, date, location}
              let tempobj = {
                userData: snapshot.val()[eid],
                requestData: userobj.sent_requests[reqid]
              }
              sentlist.push(tempobj)
            }
          }

          console.log(sentlist);
          setSent(sentlist);

          let receivedlist = [];
          // if (userobj.received_requests) {
          //   receivedlist = userobj.received_requests.map((eid) => {
          //     return snapshot.val()[eid];
          //   });
          //   receivedlist = receivedlist.filter((e) => e);
          // }


          if (userobj.received_requests) {
            for (const reqid in userobj.received_requests){

              if(!userobj.received_requests[reqid]){continue}
              let eid = userobj.received_requests[reqid].netid

              if(!eid){continue}
              if(!snapshot.val()[eid]){continue}
              

              
              let tempobj = {
                userData: snapshot.val()[eid],
                requestData: userobj.received_requests[reqid]
              }
              receivedlist.push(tempobj)
            }
          }


          console.log(receivedlist);



          setReceived(receivedlist);

          let confirmedlist = [];
          // if (userobj.confirmed_requests) {
          //   confirmedlist = userobj.confirmed_requests.map((eid) => {
          //     return snapshot.val()[eid];
          //   });
          //   confirmedlist = confirmedlist.filter((e) => e);
          // }

          if (userobj.confirmed_requests) {
            for (const reqid in userobj.confirmed_requests){

              if(!userobj.confirmed_requests[reqid]){continue}
              let eid = userobj.confirmed_requests[reqid].netid

              if(!eid){continue}
              if(!snapshot.val()[eid]){continue}
              

              
              let tempobj = {
                userData: snapshot.val()[eid],
                requestData: userobj.confirmed_requests[reqid]
              }
              confirmedlist.push(tempobj)
            }
          }



          console.log(confirmedlist);


          setConfirmed(confirmedlist);
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

  //sent_requests: {uniqueid: {netid: , date:, time: , location: , requestid: }, uniqueid2:{},......}
  // current user: remove from current user - sent
  // effected user: remove from target user - received
  const sentReject = async (currnetid, effectednetid, requestid) => {
    get(ref(db, `/users`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log("sentreject test start");
          console.log(snapshot.val());
          console.log("sentreject test finish");

          // current user: remove from current user - sent

          let currUserObj = snapshot.val()[currnetid];
          if (currUserObj) {
            // let updatedCurrUserSentList = currUserObj.sent_requests.filter(
            //   (e) => e != effectednetid
            // );
            // console.log(updatedCurrUserSentList);
            set(
              ref(db, `/users/${currnetid}/sent_requests/${requestid}`),
              null
            );
          }

          // effected user: remove from target user - received

          let effUserObj = snapshot.val()[effectednetid];

          if (effUserObj) {
            // let updatedEffUserReceivedList =
            //   effUserObj.received_requests.filter((e) => e != currnetid);
            // console.log(updatedEffUserReceivedList);
            set(
              ref(db, `/users/${effectednetid}/received_requests/${requestid}`),
              null
            );
          }
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  //sent_requests: {uniqueid: {netid: , date:, time: , location: , requestid: }, uniqueid2:{},......}
  // current user: move from received to confirmed
  // effected user: move from sent to confirmed

  // {
  //   userData: snapshot.val()[eid],
  //   requestData: userobj.sent_requests[reqid]
  // }

  const receivedAccept = async (currnetid, effectednetid, requestid) => {
    get(ref(db, `/users`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          // current user: move from received to confirmed

          let currUserObj = snapshot.val()[currnetid];
          if (currUserObj) {
            // currUserObj.received_requests = currUserObj.received_requests.filter((e) => e != effectednetid);

            

            if (currUserObj.confirmed_requests) {
              currUserObj.confirmed_requests[requestid] = {...currUserObj.received_requests[requestid]}
            } else {
              currUserObj['confirmed_requests'] = {}
              currUserObj.confirmed_requests[requestid] = {...currUserObj.received_requests[requestid]}
            }
            delete currUserObj.received_requests[requestid]
            console.log('receivedAccept curr')
            console.log(currUserObj);
            update(ref(db, `/users/${currnetid}`), currUserObj);
          }

          // effected user: move from sent to confirmed

          let effUserObj = snapshot.val()[effectednetid];
          if (effUserObj) {
            // effUserObj.sent_requests = effUserObj.sent_requests.filter(
            //   (e) => e != currnetid
            // );
            console.log('before if')
            console.log(requestid)
            console.log(effectednetid)
           // console.log(currUserObj.confirmed_requests[requestid])
            console.log(effUserObj.sent_requests[requestid])


            if (effUserObj.confirmed_requests) {
              console.log('if 1')
              effUserObj.confirmed_requests[requestid] = {...effUserObj.sent_requests[requestid]}

            } else {
              console.log('if 2')
              effUserObj['confirmed_requests'] = {}
              effUserObj.confirmed_requests[requestid] = {...effUserObj.sent_requests[requestid]}
            }

            delete effUserObj.sent_requests[requestid]
            console.log('receivedAccept eff')
            console.log(effUserObj);
            console.log('____________receivedAccept eff______________')
            update(ref(db, `/users/${effectednetid}`), effUserObj);
          }
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // current user: remove from received
  // effected user: remove from sent
  const receivedReject = async (currnetid, effectednetid, requestid) => {
    get(ref(db, `/users`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          // current user: remove from received

          let currUserObj = snapshot.val()[currnetid];
          if (currUserObj) {
            // let updatedCurrUserList = currUserObj.received_requests.filter(
            //   (e) => e != effectednetid
            // );
            // console.log(updatedCurrUserList);
            set(
              ref(db, `/users/${currnetid}/received_requests/${requestid}`),
              null
            );
          }

          // effected user: remove from sent

          let effUserObj = snapshot.val()[effectednetid];

          if (effUserObj) {
            // let updatedEffUserList = effUserObj.sent_requests.filter(
            //   (e) => e != currnetid
            // );
            // console.log(updatedEffUserList);
            set(
              ref(db, `/users/${effectednetid}/sent_requests/${requestid}`),
              null
            );
          }
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // current user: remove from confirmed
  // effected user: remove from confirmed
  const confirmedReject = async (currnetid, effectednetid, requestid) => {
    get(ref(db, `/users`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          // current user: remove from confirmed

          let currUserObj = snapshot.val()[currnetid];
          if (currUserObj) {
            // let updatedCurrUserList = currUserObj.confirmed_requests.filter(
            //   (e) => e != effectednetid
            // );
            // console.log(updatedCurrUserList);
            set(
              ref(db, `/users/${currnetid}/confirmed_requests/${requestid}`),
              null
            );
          }

          // effected user: remove from confirmed

          let effUserObj = snapshot.val()[effectednetid];

          if (effUserObj) {
            // let updatedEffUserList = effUserObj.confirmed_requests.filter(
            //   (e) => e != currnetid
            // );
            // console.log(updatedEffUserList);
            set(
              ref(db, `/users/${effectednetid}/confirmed_requests/${requestid}`),
              null
            );
          }
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };


                // requestId: {requestId, netid, time, date, location}
                // let tempobj = {
                //   userData: snapshot.val()[eid],
                //   requestData: userobj.sent_requests[reqid]
                // }

  return (
    <Tabs defaultActiveKey="Sent" id="fill-tab-example" className="mb-3" fill>
      <Tab eventKey="Sent" title="Sent">
        <div className="confirmed-page-window">
          {sent.map((e, i) => {
            return (
              <UserCardSent
                key={i}
                userObject={e.userData}
                requestObject={e.requestData}
                onAccept={null}
                onReject={() => sentReject(user, e.userData.netid, e.requestData.requestId)}
              />
            );
          })}
        </div>
      </Tab>
      <Tab eventKey="Received" title="Received">
        <div className="confirmed-page-window">
          {received.map((e, i) => {
            return (
              <UserCardSent
                key={i}
                userObject={e.userData}
                requestObject={e.requestData}
                onAccept={() => receivedAccept(user, e.userData.netid, e.requestData.requestId)}
                onReject={() => receivedReject(user, e.userData.netid, e.requestData.requestId)}
              />
            );
          })}
        </div>
      </Tab>

      <Tab eventKey="Confirmed" title="Confirmed">
        <div className="confirmed-page-window">
          {confirmed.map((e, i) => {
            return (
              <UserCardSent
                key={i}
                userObject={e.userData}
                requestObject={e.requestData}
                onAccept={null}
                onReject={() => confirmedReject(user, e.userData.netid, e.requestData.requestId)}
              />
            );
          })}
        </div>
      </Tab>
    </Tabs>
  );
}

export default ComfirmedPage;
