import { useState } from "react";

export default function DaySchedule(props) {
    // Destructurize for parameter - added onClose, renamed onAddEvent to onOpenModal
    const { date, events, onAddEvent: onOpenModal, onClose } = props

    const [newEvent, setNewEvent] = useState('')
    const [newEventTime, setNewEventTime] = useState('')

    // Add debug logging
    console.log('DaySchedule received events:', events);
    console.log('DaySchedule selected date:', date);

    // Function handle event
    async function handleSubmit(e) {
        e.preventDefault()

        if (!newEvent.trim() || !newEventTime) {
            return
        }

        try {
            const eventData = {
                id: Date.now(),
                title: newEvent,
                date: date,
                time: newEventTime
            }

            // For now, just add to local state - the modal will handle real event adding
            console.log('Event would be added:', eventData)

            // Clear event - fixed the bug (was clearing newEvent twice)
            setNewEvent('')
            setNewEventTime('')

            console.log('Event added successfully')
            
        } catch (error) {
            console.error('Error submitting event:', error)
        }
    }

    // FIXED: Filter events of the selected date using same format as Calendar
    const dayEvents = events.filter(event => {
        const eventDateStr = event.date; // "YYYY-MM-DD" format from EventForm
        const selectedDateStr = date.toISOString().split('T')[0]; // Convert to same format
        console.log('Comparing:', eventDateStr, 'vs', selectedDateStr);
        return eventDateStr === selectedDateStr;
    })

    console.log('Filtered day events:', dayEvents);

    // Function to convert 24-hour time to 12-hour format with AM/PM
    const formatTimeFor12Hour = (time24) => {
        if (!time24) return '';
        const [hour, minute] = time24.split(':');
        const hour24 = parseInt(hour);
        const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
        const ampm = hour24 < 12 ? 'AM' : 'PM';
        return `${hour12}:${minute} ${ampm}`;
    };

    // Sort events by time - fixed typo (localCompare -> localeCompare)
    const sortedEvents = dayEvents.sort((a, b) => {
        return a.startTime.localeCompare(b.startTime) // Use startTime instead of time
    })

    console.log('Sorted events:', sortedEvents);

    // MODIFY SO EVENT TIME IS SEEN AND MAKE DAY EVENT QUICKER  
    return (
        <div className="day-schedule-container">
            <div className="day-schedule">
                {/* Back button and Add Event modal trigger */}
                <div className="day-schedule-header">
                    <h2>Schedule for {date.toDateString()}</h2>
                    <button onClick={onClose} className="back-btn">
                        <i className="fa-solid fa-left-long"></i>
                        <p>Back to Calendar</p>
                    </button>
                
                    <button onClick={onOpenModal} className="open-modal-btn">
                        <i className="fa-solid fa-plus"></i>
                        <p>Add event</p>
                    </button>
                </div>

                {/* ADDED: Display the events */}
                <div className="events-list">
                    {sortedEvents.length === 0 ? (
                        <div className="no-events">
                            <p>No events scheduled for this day</p>
                            <p>Click "Add event" to create one!</p>
                        </div>
                    ) : (
                        sortedEvents.map(event => (
                            <div key={event.id} className="event-item">
                                <div className="event-details">
                                    <h3 className="event-title">{event.title}</h3>
                                    {event.description && (
                                        <p className="event-description">{event.description}</p>
                                    )}
                                </div>
                                <div className="event-time">
                                    <span className="start-time">{formatTimeFor12Hour(event.startTime)}</span>
                                    {event.endTime && (
                                        <span className="end-time"> - {formatTimeFor12Hour(event.endTime)}</span>
                                    )}
                                    {event.isMultiDay && (
                                        <span className="multi-day-indicator"> (next day)</span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
    
}

