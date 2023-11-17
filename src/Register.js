import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { addUser, getEmail } from './DBUtils';
import './Register.css'

export const RegisterModule = () => {
    const [netid, setNetid] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const createAccount = async () => {
        try {
            if (password !== confirmPassword) {
                setError('Password and confirm password do not match');
                return;
            }

            const email = getEmail(netid);
            await createUserWithEmailAndPassword(getAuth(), email, password);
            await addUser(netid, {
                netid: netid,
                confirmed_requests: [],
                availability: null,
                first_name: "firstname",
                last_name: "lastname",
                gender: "gender",
                grade: "grade",
                major: "major",
                profile_pic: "default",
                received_requests: [],
                sent_requests: []

            });
            navigate(`/profile/${netid}`);
        } catch (e) {
            setError(e.message);
        }
    }

    return (
        <div id="register">
            <h1>Register</h1>
            {error && <p className="error">{error}</p>}
            <input
                placeholder="Netid"
                value={netid}
                onChange={e => setNetid(e.target.value)} />
            <input
                type="password"
                placeholder="Password - must be at least 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)} />
            <input
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)} />
            <button onClick={createAccount}>Create Account</button>
            <Link to="/login">Already have an account? Log in here</Link>
        </div>
    );
}
