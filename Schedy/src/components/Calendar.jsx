import React, { useState } from 'react';

export default function Calendar (){
    // create own calendar for more flexibility when it comes to adding certain functionalities
    
    const [currDate, setCurrDate] = useState(new Date())

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


    // all of these are arrow functions
   // ADD THIS DayCell COMPONENT HERE:
    const DayCell = ({ day, isToday, isEmptyCell, onClick, isSelected, hasEvents }) => {
        if (isEmptyCell) {
            return <div className="calendar-day empty"></div>;
        }
        
        return (
            <div
                className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasEvents ? 'has-events' : ''}`}
                onClick={onClick}
            >
                {day}
            </div>
        );
    };

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
            const hasEvents = events.some(event =>
                new Date(event.date).toDateString() === currDay.toDateString()
            )

            days.push(
                <DayCell
                key = {day}
                day = {day}
                isToday = {isToday}
                isSelected = {isSelected}
                hasEvents = {hasEvents}
                onClick = {() => onDateClick ? onDateClick(currDay) : console.log(`Selected: ${currDay}`)}
            />
            )
        }
        return days
    }
    return(
        <div className='calender-container'>
            <div>
                <button className='calendar-header'onClick={goToPreviousMonth}>
                    <p>prev-month</p>
                    {/* DELETE SVG AND ADD ICON IN NAV-BUTTPM */}
                    <svg className='nav-icon' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7'/>
                    </svg>
                </button>

                <h2 className='calendar-title'>
                    {monthNames[currDate.getMonth()]} {currDate.getFullYear()}
                </h2>

                <button className ='nav-button' onClick={goToNextMonth}>
                    <p>next month</p>
                    <svg className='nav-icon' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7'/>
                    </svg>
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
            {RenderCalendarDays()}
        </div>

    </div>
    )
}
