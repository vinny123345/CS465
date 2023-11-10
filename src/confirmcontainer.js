import { Link, Outlet, useParams } from "react-router-dom"


export const Confirmcontainer = () => {
    const { user }= useParams();
    console.log("confirmcontainer");
    return (
        <div className= "confirm">
            <div className="confirmnavtab">
                  <div className= "sentlink">
                  <Link to={`/confirm/sent/${user}`}
                      id = "link1" >Sent
                  </Link>
                  </div>
                  <div className= "receivedlink">
                  <Link to={`/confirm/received/${user}`}
                      id = "link2"> Received
                  </Link>
                  </div>
                  <div className= "confirmlink">
                  <Link to = {`/confirm/${user}`}
                    id = "link3"> Confirmed
                  </Link>
                  </div>
          </div>
          <Outlet/>
        </div>
    )
}