import { useState } from 'react';
import { Link} from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

export const LogoutModule = () => {
    const [error, setError] = useState('');
    const auth = getAuth();
        signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((e) => {
        setError(e.message);
    });

    return (
        error?
        <p className="error">Error logging out: {error}</p>
        :
        <div>
        <h1>Logged Out Successfully</h1>
        <Link to="/login">Already have an account? Log in here</Link>
        </div>
    );
}
