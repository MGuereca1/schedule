import { useState } from 'react';
import DaySchedule from './DaySchedule';
import Modal from './Modal';
import TimeSelectionModal from './TimeSelectionModal';

export default function Calendar (){
    // create own calendar for more flexibility when it comes to adding certain functionalities
    
    const [currDate, setCurrDate] = useState(new Date())

    // usestate to be selectthe date and create events for later
    const [selectedDate, setSelectedDate] = useState(null)
    const [events, setEvents] = useState([]) //array to store events

    //modal state
    const [showTimeModal, setShowTimeModal] = useState(false)

    // handler for when day is clicked
    const handleDateClick = (day) => {
        setSelectedDate(day)
        console.log(`selected date: ${day}`)
    }

    // handler for add event modal
    const handleOpenAddEventModal = () =>{
        setShowTimeModal(true)
    } 

    const handleAddEvent = (eventData) =>{
        setEvents(prevEvents => [...prevEvents, eventData])
        setShowTimeModal(false)
        console.log('Event added', eventData)
    }

    // close modal handler
    const handleCloseModal = () =>{
        setShowTimeModal(false)
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