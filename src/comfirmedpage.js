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
} from "firebase/database";
import { Link, useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { message, Popconfirm } from "antd";
import UserCardSent from "./UserCardComponent";

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
        console.log(user)
        setUsers(snapshot.val());
        let userobj = snapshot.val()[user]

        if (userobj) {
          setUserObject(userobj);

          let sentlist = []
          if (userobj.sent_requests){
            sentlist = userobj.sent_requests.map((eid)=>{
              return snapshot.val()[eid]
            })
            sentlist = sentlist.filter(
              (e) => e
            );
          }

          console.log(sentlist)


          // snapshot.val().filter((e) => {
          //   return userobj.sent_requests.includes(e.netid);
          // });
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
          setSent(sentlist);

          let receivedlist = []
          if (userobj.received_requests){
            receivedlist = userobj.received_requests.map((eid)=>{
              return snapshot.val()[eid]
            })
            receivedlist = receivedlist.filter(
              (e) => e
            );
          }
          

          console.log(receivedlist)
          
          // snapshot.val().filter((e) => {
          //   return userobj.received_requests.includes(e.netid);
          // });
          // for testing only
          // receivedlist.push(userobj)
          // receivedlist.push(userobj)
          // receivedlist.push(userobj)
          // receivedlist.push(userobj)
          // receivedlist.push(userobj)
          // receivedlist.push(userobj)
          // receivedlist.push(userobj)
          // receivedlist.push(userobj)
          setReceived(receivedlist);

          let confirmedlist = []
          if (userobj.confirmed_requests){
            confirmedlist = userobj.confirmed_requests.map((eid)=>{
              return snapshot.val()[eid]
            })
            confirmedlist = confirmedlist.filter(
              (e) => e
            );
          }
          console.log(confirmedlist)
          
          
          // snapshot.val().filter((e) => {
          //   return userobj.confirmed_requests.includes(e.netid);
          // });
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

  // current user: remove from current user - sent
  // effected user: remove from target user - received
  const sentReject = async (currnetid, effectednetid) => {
    get(ref(db, `/users`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log("sentreject test start");
          console.log(snapshot.val());
          console.log("sentreject test finish");

          // current user: remove from current user - sent


          let currUserObj = snapshot.val()[currnetid];
          if (currUserObj) {
            let updatedCurrUserSentList = currUserObj.sent_requests.filter(
              (e) => e != effectednetid
            );
            console.log(updatedCurrUserSentList);
            set(
              ref(db, `/users/${currnetid}/sent_requests`),
              updatedCurrUserSentList
            );
          }

          // effected user: remove from target user - received

          let effUserObj = snapshot.val()[effectednetid];

          if (effUserObj) {

            let updatedEffUserReceivedList =
              effUserObj.received_requests.filter((e) => e != currnetid);
            console.log(updatedEffUserReceivedList);
            set(
              ref(db, `/users/${effectednetid}/received_requests`),
              updatedEffUserReceivedList
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

  // current user: move from received to confirmed
  // effected user: move from sent to confirmed
  const receivedAccept = async (currnetid, effectednetid) => {
    get(ref(db, `/users`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          // current user: move from received to confirmed

          let currUserObj = snapshot.val()[currnetid]
          if (currUserObj) {

            currUserObj.received_requests =
              currUserObj.received_requests.filter((e) => e != effectednetid);
            currUserObj.confirmed_requests.push(effectednetid);

            console.log(currUserObj);
            set(ref(db, `/users/${currnetid}`), currUserObj);
          }

          // effected user: move from sent to confirmed

          let effUserObj = snapshot.val()[effectednetid]
          if (effUserObj) {

            effUserObj.sent_requests = effUserObj.sent_requests.filter(
              (e) => e != currnetid
            );
            effUserObj.confirmed_requests.push(currnetid);

            console.log(effUserObj);
            set(ref(db, `/users/${effectednetid}`), effUserObj);
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
  const receivedReject = async (currnetid, effectednetid) => {
    get(ref(db, `/users`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          // current user: remove from received

          let currUserObj = snapshot.val()[currnetid]
          if (currUserObj) {
            let updatedCurrUserList = currUserObj.received_requests.filter(
              (e) => e != effectednetid
            );
            console.log(updatedCurrUserList);
            set(
              ref(db, `/users/${currnetid}/received_requests`),
              updatedCurrUserList
            );
          }

          // effected user: remove from sent

          let effUserObj = snapshot.val()[effectednetid]

          if (effUserObj) {

            let updatedEffUserList = effUserObj.sent_requests.filter(
              (e) => e != currnetid
            );
            console.log(updatedEffUserList);
            set(
              ref(db, `/users/${effectednetid}/sent_requests`),
              updatedEffUserList
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
  const confirmedReject = async (currnetid, effectednetid) => {
    get(ref(db, `/users`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          // current user: remove from confirmed

          let currUserObj = snapshot.val()[currnetid]
          if (currUserObj) {

            let updatedCurrUserList = currUserObj.confirmed_requests.filter(
              (e) => e != effectednetid
            );
            console.log(updatedCurrUserList);
            set(
              ref(db, `/users/${currnetid}/confirmed_requests`),
              updatedCurrUserList
            );
          }

          // effected user: remove from confirmed

          let effUserObj = snapshot
            .val()[effectednetid]

          if (effUserObj) {

            let updatedEffUserList = effUserObj.confirmed_requests.filter(
              (e) => e != currnetid
            );
            console.log(updatedEffUserList);
            set(
              ref(db, `/users/${effectednetid}/confirmed_requests`),
              updatedEffUserList
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

  return (
    <Tabs defaultActiveKey="Sent" id="fill-tab-example" className="mb-3" fill>
      <Tab eventKey="Sent" title="Sent">
        <div className="confirmed-page-window">
          {sent.map((e, i) => {
            return (
              <UserCardSent
                key={i}
                userObject={e}
                onAccept={null}
                onReject={() => sentReject(user, e.netid)}
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
                userObject={e}
                onAccept={receivedAccept(user, e.netid)}
                onReject={receivedReject(user, e.netid)}
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
                userObject={e}
                onAccept={null}
                onReject={confirmedReject(user, e.netid)}
              />
            );
          })}
        </div>
      </Tab>
    </Tabs>
  );
}

export default ComfirmedPage;
