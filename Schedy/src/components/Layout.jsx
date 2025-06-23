import { useState } from "react"
import Modal from "./Modal"
import Authentication from "./authentication"
import { useAuth } from "../context/AuthContext"

export default function Layout (props){
    const {children} = props

    const [showModal, setShowModal] = useState(false)
    const {globalUser, logout} = useAuth()

    const header = (
        <header>
            <div >
                <h1 className="text-gradient">Schedy</h1>
                <p>your schedule made easy</p>
            </div>
        {/* if user is logged in (global user) display loggout button */}
            {globalUser ? (
                <button onClick={()=>{logout()}}>
                    <p>Logout</p>
                </button>
            ):(
                <button onClick={()=>{setShowModal(true)}}>
                    <p>Sign up</p>
                </button>
            )}
        </header>
    )
    
    const footer = (
        <footer>
            <p><span className="text-gradient">Schedy </span>
            was made by <a target="_blank">Michelle Guereca Rochell.</a> See the project on <a target="_blank" href="https://github.com/MGuereca1">Github</a>!</p>
        </footer>
    )

    function handleCloseModal(){
        setShowModal(false)
    }

    return(
        <>
        {/* only show modal if true */}
            { showModal &&(
                <Modal handleCloseModal = {handleCloseModal}>
                <Authentication handleCloseModal = {handleCloseModal}/>
            </Modal>
            )}

            {header}
            <main>
                {children}
            </main>
            {footer}
        
        </>
    )
}