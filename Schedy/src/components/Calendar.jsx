import { useEffect, useState } from 'react';
import DaySchedule from './DaySchedule';
import Modal from './Modal';
import TimeSelectionModal from './TimeSelectionModal';

// ADD AUTH AND DB TO ADJUST HOW EVENTS ARE STORED IN THE APP
import { auth, db } from '../../firebase'; // Add db import
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore'; // Add missing imports

export default function Calendar (){
    // create own calendar for more flexibility when it comes to adding certain functionalities
    
    const [currDate, setCurrDate] = useState(new Date())

    // get current user
    const {globalUser} = useAuth()

    // usestate to be selectthe date and create events for later
    const [selectedDate, setSelectedDate] = useState(null)
    const [events, setEvents] = useState([]) //array to store events and sync with firestone

    //modal state
    const [showTimeModal, setShowTimeModal] = useState(false)
    const [showLoginPrompt, setShowLoginPrompt] = useState(false) // Add login prompt state
    const [loading, setLoading] = useState(false)

    // add a loading useEffect
    useEffect(() => {
        //  if user is found load their evente else clear the events
        if (globalUser) {
            loadEvents()
        } else{
            setEvents([])
        }
    }, [globalUser]) // Add dependency array

    // function to load events
    async function loadEvents() {
        if(!globalUser){
            return
        }

        try{
            setLoading(true)

            const q = query(collection(db, 'events'),
                where('userId', '==', globalUser.uid)
            )

            const querySnapshot = await getDocs(q)
            const loadedEvents = []

            querySnapshot.forEach((doc)=>{
                loadedEvents.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
            
            setEvents(loadedEvents) // Fix typo: was loadEvents, should be loadedEvents
            console.log('Loaded events from firestone', loadedEvents)
        
        } catch (err){
            console.log('Error loading events: ', err)

        }finally{
            setLoading(false)
        }
    }

    // save event to firestone
    const handleAddEvent = async (eventData) =>{
        if (!globalUser){
            console.error('No user logged in')
            return
        }

        try {
            // add userId and the timestamps to the event data
            const firestoreEventData = {
                ...eventData,
                userId: globalUser.uid,
                createdAt: new Date(),
                updatedAt: new Date() // Fix typo: was upDatedAt
            }

            // save to db
            const docRef = await addDoc(collection(db,'events'), firestoreEventData)

            // update local state with new event
            const newEvent = {
                id: docRef.id,
                ...firestoreEventData
            }

            setEvents(prevEvents => [...prevEvents, newEvent])

            setShowTimeModal(false)
            console.log("event saved to Firestore with ID: ", docRef.id)

        } catch (err) {
            console.log("Error saving event with Firestore: ", err)
            alert('Failed to save event. Try again')
        }
    }

    

    // handler for when day is clicked
    const handleDateClick = (day) => {
        setSelectedDate(day)
        console.log(`selected date: ${day}`)
    }

    // handler for add event modal - CHECK LOGIN HERE
    const handleOpenAddEventModal = () =>{
        if (!globalUser) {
            // Show login prompt instead of opening event modal
            setShowLoginPrompt(true)
            return
        }
        setShowTimeModal(true)
    } 

    // close modal handler
    const handleCloseModal = () =>{
        setShowTimeModal(false)
    }

    // close login prompt handler
    const handleCloseLoginPrompt = () => {
        setShowLoginPrompt(false)
    }

    // close modal handler (go back to calendar view)
    const handleCloseDaySchedule = () => {
        setSelectedDate(null)
    }

    // +1 helps get the current day of the month (I assume its because some index thing)
    const getDaysinMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayofMonth = (date) =>{
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    }

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const daysoftheweek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const goToPreviousMonth = () => {
        setCurrDate(new Date(currDate.getFullYear(), currDate.getMonth() - 1, 1))
    }

    const goToNextMonth = () => {
        setCurrDate(new Date(currDate.getFullYear(), currDate.getMonth() + 1, 1))
    }

    // FIXED DayCell COMPONENT - Now shows dots instead of text previews:
    const DayCell = ({ day, isToday, isEmptyCell, onClick, isSelected, dayEvents }) => {
        if (isEmptyCell) {
            return <div className="calendar-day empty"></div>;
        }
        
        return (
            <div
                className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${dayEvents.length > 0 ? 'has-events' : ''} ${dayEvents.length > 1 ? 'has-multiple-events' : ''}`}
                onClick={onClick}
            >
                <span className="day-number">{day}</span>
                {/* Replace text preview with dots */}
                {dayEvents.length > 0 && (
                    <div className="event-dots">
                        {dayEvents.slice(0, 3).map((event, index) => (
                            <div 
                                key={index} 
                                className="event-dot"
                                style={{ backgroundColor: getEventColor(index) }}
                            ></div>
                        ))}
                        {dayEvents.length > 3 && (
                            <div className="more-events-indicator">+</div>
                        )}
                    </div>
                )}
            </div>
        )
    }

    // Helper function to assign different colors to event dots
    const getEventColor = (index) => {
        const colors = ['#ff4444', '#4444ff', '#44ff44', '#ffaa44', '#ff44aa'];
        return colors[index % colors.length];
    }

    // NOW your RenderCalendarDays function will work:
    const RenderCalendarDays = (onDateClick = null, events = [], selectedDate = null) => {
        const daysinMonth = getDaysinMonth(currDate)
        const firstDay = getFirstDayofMonth(currDate)
        const days = []

        // empty cells
        for (let i=0; i<firstDay; i++){
            days.push(<DayCell key = {`empty-${i}`} isEmptyCell={true}/>)
        }

        // days of the month
        for (let day = 1; day <= daysinMonth; day++){
            const currDay = new Date(currDate.getFullYear(), currDate.getMonth(), day)
            const isToday = new Date().toDateString() === currDay.toDateString()
            const isSelected = selectedDate?.toDateString() === currDay.toDateString()
        
            // Get events for this specific day - updated to work with new date format
            const dayEvents = events.filter(event => {
                const eventDateStr = event.date
                const currDayStr = currDay.toISOString().split('T')[0]
                return eventDateStr === currDayStr
            })

            days.push(
                <DayCell
                key = {day}
                day = {day}
                isToday = {isToday}
                isSelected = {isSelected}
                dayEvents = {dayEvents}
                onClick = {() => onDateClick ? onDateClick(currDay) : 
                console.log(`Selected: ${currDay}`)}
            />
            )
        }
        return days
    }

    // show loading state
    if(loading){
        return (
            <div className='calendar-container loading'>
                <p>Loading your events...</p>
            </div>
        )
    }

    return (
        <div className='calendar-container'>
            {/* Show calendar view when no date is selected */}
            {!selectedDate && (
                <>
                    <div className='nav-buttons'>
                        <button className='calendar-header' onClick={goToPreviousMonth}>
                            <p>prev-month</p>
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>

                        <h2 className='calendar-title'>
                            {monthNames[currDate.getMonth()]} {currDate.getFullYear()}
                        </h2>

                        <button className='next-month' onClick={goToNextMonth}>
                            <p>next month</p>
                            <i className="fa-solid fa-arrow-right"></i>
                        </button>
                    </div>

                    {/* days of the week */}
                    <div className='weekdays-header'>
                        {daysoftheweek.map(day => (
                            <div key={day} className='weekday'>
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* calendar grid */}
                    <div className='calendar-grid'>
                        {RenderCalendarDays(handleDateClick, events, selectedDate)}
                    </div>
                </>
            )}

            {/* Show day schedule when date is selected and modal is not open */}
            {selectedDate && !showTimeModal && (
                <DaySchedule
                    date={selectedDate}
                    events={events}
                    onAddEvent={handleOpenAddEventModal}
                    onClose={handleCloseDaySchedule}
                />
            )}

            {/* Login Prompt Modal - Only shows when logged out user tries to add event */}
            {showLoginPrompt && (
                <Modal 
                    handleCloseModal={handleCloseLoginPrompt}
                    title="Login Required"
                >
                    <div >
                        <p>Please log in to create and manage events.</p>
                        <button className='login-close-btn' onClick={handleCloseLoginPrompt}>
                            <p>Close</p>
                        </button>
                    </div>
                </Modal>
            )}

            {/* Time Selection Modal */}
            {showTimeModal && selectedDate && (
                <Modal 
                    handleCloseModal={handleCloseModal}
                    title="Schedule New Event"
                >
                    <TimeSelectionModal
                        selectedDate={selectedDate}
                        onAddEvent={handleAddEvent}
                        onClose={handleCloseModal}
                    />
                </Modal>
            )}
        </div>
    )
}