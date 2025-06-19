import { useState } from "react"
import Modal from "./Modal"
import Authentication from "./authentication"

export default function Layout (props){
    const {children} = props

    const [showModal, setShowModal] = useState(false)

    const header = (
        <header>
            <div >
                <h1 className="text-gradient">Schedy</h1>
                <p>your schedule made easy</p>
            </div>

            <button onClick={()=>{setShowModal(true)}}>
                <p>Sign up</p>
                
            </button>
        </header>
    )
    
    const footer = (
        <footer>
            <p><span className="text-gradient">Schedy </span>
            was made by <a>Me</a></p>
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