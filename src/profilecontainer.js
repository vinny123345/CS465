import { Link, useParams } from "react-router-dom";
import { getUser } from "./utilities";

export const Profilecontainer = () => {
  const { user } = useParams();

  //beware that this may take a while to get user and may need to use a hook
  const sample_user = getUser(user);
  console.log(sample_user);
  return (
    <div className="hi">
      This is the profile page!
      <br></br>
      Name: {sample_user.first_name} {sample_user.last_name}
      <br></br>
      netid: {sample_user.netid}
    </div>
  );
};
