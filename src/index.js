import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Link,
  useLocation,
  useParams,
} from "react-router-dom";
import { Profilecontainer } from "./profilecontainer";
import { Searchcontainer } from "./searchcontainer";
import ComfirmedPage from "./comfirmedpage";
import { getUser } from "./DBUtils";
import { LoginModule } from './Login';
import { RegisterModule } from './Register';
import { LogoutModule } from './Logout'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSearch, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faUser as farUser } from '@fortawesome/free-regular-svg-icons';

import {Button} from 'react-bootstrap';

// TODO: Replace the following with your app's Firebase project configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyB6OMDiGIuzU0o-is8CLn_yAqIdiORk-vc",
//   authDomain: "ieatcs465.firebaseapp.com",
//   projectId: "ieatcs465",
//   storageBucket: "ieatcs465.appspot.com",
//   messagingSenderId: "86450940860",
//   appId: "1:86450940860:web:8b798a96c3292a626d19b9",
//   measurementId: "G-WC6BY9CG6S",
// };

// const app = initializeApp(firebaseConfig);

const App = () => {
  var { user } = useParams();

  useEffect(() => {
    user = getUser(user);
  }, []);

  return (
    <div className="App">
      <div className="header-container">
        <img src= "/iEat.png" alt="iEat Logo" />
        <div className="logoutlink">
          <Button type="button" className="btn btn-primary" onClick={() => window.location.href = '/logout'}>
            Logout</Button>
        </div>
      </div>
      <div className="navtab">
      <div className="profilelink">
          <Link to={`/profile/${user}`} id="link1">
            <FontAwesomeIcon icon={farUser} /> Profile
          </Link>
        </div>
        <div className="searchlink">
          <Link to={`/search/${user}`} id="link2">
            <FontAwesomeIcon icon={faSearch} /> Search
          </Link>
        </div>
        <div className="confirmlink">
          <Link to={`/confirm/${user}`} id="link3">
            <FontAwesomeIcon icon={faCheck} /> Confirm
          </Link>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <Routes>
      <Route path= "" element={<RegisterModule />} /> 
      <Route path= "/login" element={<LoginModule />} /> 
      <Route path= "/register" element={<RegisterModule />} /> 
      <Route path= "/logout" element={<LogoutModule />} /> 
      <Route path="/" element={<App />}>
        <Route path=":user" element={<Profilecontainer />} />
        <Route path="profile/:user" element={<Profilecontainer />} />
        <Route path="search/:user" element={<Searchcontainer />} />
        <Route path="confirm/:user" element={<ComfirmedPage />} />

        {/* <Route path= "confirm" element={<Confirmcontainer />}>
        <Route path= "sent/:user" element= {<Sentcontainer/>}/>
        <Route path= "received/:user" element= {<Receivedcontainer/>}/>
        <Route path= ":user" element= {<Confirmconfirmcontainer />}/>
      </Route> */}
      </Route>
    </Routes>
  </BrowserRouter>
);
