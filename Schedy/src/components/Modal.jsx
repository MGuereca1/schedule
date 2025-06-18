import { useEffect } from 'react'
import ReactDom from 'react-dom'
// use modal to make schedule form
export default function Modal (props){
    const {children, handleCloseModal, title} = props

    //Close modal on esc
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleCloseModal()
            }
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [handleCloseModal])

    // prevent body scroll when modal is open
    useEffect(()=>{
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = 'unset'
        }  
    }, [])

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget){
            handleCloseModal()
        }
    }

    return(
        <div className='modal-overlay' onClick={handleBackdropClick}>

            <div className='modal-content'>
                {children}
            </div>

        </div>
    )
}