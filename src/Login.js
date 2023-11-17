import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getEmail } from './DBUtils';
import './Login.css'

export const LoginModule = () => {
    const [netid, setNetid] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const logIn = async () => {
        try {
            const email = getEmail(netid);
            await signInWithEmailAndPassword(getAuth(), email, password);
            navigate(`/profile/${netid}`);
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <div id="login">
            <h1>Log In</h1>
            {error && <p className="error">{error}</p>}
            <input
                placeholder="Netid"
                value={netid}
                onChange={e => setNetid(e.target.value)} />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)} />
            <button onClick={logIn}>Log In</button>
            <Link to="/register">Don't have an account? Create one here</Link>
        </div>
    );
}
