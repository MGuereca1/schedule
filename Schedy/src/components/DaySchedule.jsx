import { useState } from "react";

export default function DaySchedule(props) {
    // Destructurize for parameter - added onClose, renamed onAddEvent to onOpenModal
    const { date, events, onAddEvent: onOpenModal, onClose } = props

    // Add debug logging
    console.log('DaySchedule received events:', events);
    console.log('DaySchedule selected date:', date);

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
        // Ensure both events have startTime before comparing
        if (!a.startTime || !b.startTime) {
            return 0; // Keep original order if times are missing
        }
        return a.startTime.localeCompare(b.startTime);
    })

    console.log('Sorted events:', sortedEvents);

    // Format date for better display
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    //  create editing event
    // create ability to delete event

    return (
        <div className="day-schedule-container">
            <div className="day-schedule">
                {/* Back button and Add Event modal trigger */}
                <div className="day-schedule-header">
                    <h2>Schedule for {formatDate(date)}</h2>
                    <div className="header-actions">
                        <button onClick={onClose} className="back-btn">
                            <i className="fa-solid fa-left-long"></i>
                            <span> Back to Calendar</span>
                        </button>
                    
                        <button onClick={onOpenModal} className="open-modal-btn">
                            <i className="fa-solid fa-plus"></i>
                            <span> Add Event</span>
                        </button>
                    </div>
                </div>

                {/* Display the events */}
                <div className="events-list">
                    {sortedEvents.length === 0 ? (
                        <div className="no-events">
                            <div className="no-events-icon">
                                <i className="fa-regular fa-calendar-xmark"></i>
                            </div>
                            <h3>No events scheduled</h3>
                            <p>Click "Add Event" to create your first event for this day!</p>
                        </div>
                    ) : (
                        <>
                            <div className="events-count">
                                {sortedEvents.length} event{sortedEvents.length !== 1 ? 's' : ''} scheduled
                            </div>
                            {sortedEvents.map(event => (
                                <div key={event.id} className="event-item">
                                    
                                    <div className="event-time-badge">
                                        <span className="start-time">{formatTimeFor12Hour(event.startTime)}</span>
                                        {event.endTime && (
                                            <span className="end-time">-{formatTimeFor12Hour(event.endTime)}</span>
                                        )}
                                        {event.isMultiDay && (
                                            <span className="multi-day-badge">Next Day</span>
                                        )}
                                    </div>

                                    <div className="event-content">
                                        <h3 className="event-title">{event.title}</h3>
                                        {event.description && (
                                            <p className="event-description">{event.description}</p>
                                        )}
                                    </div>

                                    {/* add edit and delete button */}
                                    <div key={event.id} className="event-action">
                                        <button className="Edit-btn" onClick={() => {EditEvent()}}>Edit</button>
                                        <button className="delete-btn" onClick={() => {DeleteEvent()}}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
