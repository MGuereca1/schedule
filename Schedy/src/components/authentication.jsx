import { useState } from "react"
import { useAuth } from "../context/AuthContext"

export default function Authentication (props){
    const { handleCloseModal} = props
    const { signup, login} = useAuth()

    const [ isRegistered, setIsRegistered] = useState(false)
    const [ email, setEmail] = useState('')
    const [ password, setPassword] = useState('')
    const [ confirmPassword, setConfirmPassword] = useState('')
    const [ isAuthenticating, setIsAuthenticating] = useState(false)
    const [ error, setError] = useState(null)

    async function handleAuthenticate() {
        
        setError(null)
        
        // guard clause for what the user inputs
        if(!email||!email.includes('@')){
            setError("please use a valid email address")
            return
        }

        if(!password || password.length < 8){
            setError("please use a valid email address")
            return
        }

        // make sure passwords match if signing up
        if(isRegistered){
            if(password !== confirmPassword){
                setError("passwords fo not match")
                return
            }
        }
   
    setIsAuthenticating(true)

        try {
            // authenticating logic here
            if(isRegistered){
                await signup(email, password)
            }else{
                await login(email, password)
            }

            //close modal when authentication is successful
            handleCloseModal()

        } catch (err) {
            console.log(err.message)
            setError(err.message)
        } finally{
            setIsAuthenticating(false)
        }
    }  

    function handleModeSwitch(){
        setIsRegistered(!isRegistered)
        setError(null)

        //clear when switching to logged in
        setConfirmPassword('')
        setPassword('')
        setEmail('')
    }
    
    // TODO: CREATE POP MESSAGE WITH ERRORS, MAKE A SEE PASSWORD OPTION, 
    // FIXME: EVENTS ARE NOT STORED IN DB AND NEED TO MAKE THE BUTTON SAY LOGOUT INSTEAD OF SIGNUP 
    // VIDEO: 7:20
    // email: testemail@gmail.com Forgotten456

    return (
        <>
            <button className="authen-close-btn" onClick={handleCloseModal}>close</button>
            <h2 className="sign-up-text">{isRegistered ? 'Sign Up' : 'Login'}</h2>
            <p>{isRegistered ? 'Create an account!' : 'Sign in to your account!'}</p>
            
            { error && (
                <p>❌{error} </p>
            )} 

            <input 
            value={email} 
            onChange={(e) => { setEmail(e.target.value) }} 
            placeholder="Email"
            type = 'email'
            disabled={isAuthenticating} />

            <input value={password} 
            onChange={(e) => { setPassword(e.target.value) }} 
            placeholder="**********" 
            type="password"
            disabled={isAuthenticating}  />

            {/* only show confirm password when signing-up */}
            {isRegistered && (
                <input value={confirmPassword} 
                onChange={(e) => { setConfirmPassword(e.target.value) }} 
                placeholder="Confirm password" 
                type="password"
                disabled={isAuthenticating}  />
            )}

            <button onClick={handleAuthenticate} disabled={isAuthenticating} ><p>{isAuthenticating ? 'Authenticating...' : 'Submit'}</p></button>
            
            <hr />

            <div className="register-content">
                <p>{isRegistered ? 'Already have an account?' : 'Don\'t have an account?'}</p>
                <button onClick={handleModeSwitch} disabled={isAuthenticating}>
                    <p>{isRegistered ? 'Sign in' : 'Sign up'}</p>
                </button>
            </div>
        </>
    )
}   
