// wraps the entire application in a global state
// will define our states here

import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useState, useEffect, useContext, createContext } from "react";
import { auth, db } from "../../firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

const AuthContext = createContext()

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider(props){
    const { children } = props
    const [globalUser, setGlobalUser] = useState(null)
    const [globalData, setGlobalData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    async function signup(email, password) {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password)

            //create user doc in firestore
            const userDoc = {
                email: email,
                createdAt: new Date(),
                schedules: []
            }

            await setDoc(doc(db, 'users', result.user.uid), userDoc)
            return result

        } catch (error) {
            console.log("SignUp Error: ", error)
            throw error
        }
    }

    async function login(email, password) {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password)
            return result

        } catch (error) {
            console.log("Login Error: ", error)
            throw error
        }
    }

    async function resetPassword(email) {
        try {
            return await sendPasswordResetEmail(auth, email)

        } catch (error) {
            console.log("Login Error: ", error)
            throw error
        }
    }

    async function logout() {
        try {
            setGlobalUser(null)
            setGlobalData(null)
            return await signOut(auth)

        } catch (error) {
            console.log("Logout Error: ", error)
            throw error
        }
    }

    async function updateUserData(newData) {
        if(!globalUser) return

        try {
            const userDocRef = doc(db, 'users', globalUser.uid)
            await setDoc(userDocRef, newData, {merge:true})
            setGlobalData(prev => ({...prev, ...newData}))

        } catch (error) {
            console.log("Error on updating user data: ", error)
            throw error
        }
    }

    const value = {globalUser, globalData, setGlobalData, isLoading, signup, login, logout, resetPassword, updateUserData}

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, async(user) =>{
            console.log('Current user: ', user)
            setGlobalUser(user)
            
            if(!user){
                console.log("No active user")
                setGlobalData(null)
                return
            }

            try {
                setIsLoading(true)
                const docRef = doc(db, 'users', user.uid)
                const docSnap = await getDoc(docRef)

                let firebaseData = {}

                if(docSnap.exists()){
                    firebaseData = docSnap.data()
                    console.log("Found user data", firebaseData)
                } else{
                    //create userdoc if doesnt exist
                    firebaseData = {
                        email: user.email,
                        createdAt: new Date(),
                        schedules:[]
                    }
                    await setDoc(docRef, firebaseData)
                }
                setGlobalData(firebaseData)

            } catch (error) {
                console.log("Authentication state error", error.message)
            } finally{
                setIsLoading(false)
            }

        })
        return unsubscribe
    },[])

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}