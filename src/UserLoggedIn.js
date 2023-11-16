import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const useUserLoggedIn = () => {
    const [userObj, setUserObj] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), user => {
            setUserObj(user);
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    return { userObj, isLoading };
}
