import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from './firebase.init';
const googleAuthProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const createUser = async (email, password) => {
        setLoading(true);
        return await createUserWithEmailAndPassword(auth, email, password)
    }

    const SignInUser = async (email, password) => {
        setLoading(true);
        return await signInWithEmailAndPassword(auth, email, password)
    }
    const signOutUser = async () => {
        setLoading(true);
        return await signOut(auth);
    }
    const signInWithGoogle = async () => {
        setLoading(true);
        return await signInWithPopup(auth, googleAuthProvider)
    }

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            setLoading(false);
        })
        return () => {
            unSubscribe();
        }
    }, [])

    const authInfo = {
        loading,
        user,
        createUser,
        SignInUser,
        signOutUser,
        signInWithGoogle,
    }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
}
export default AuthProvider;
