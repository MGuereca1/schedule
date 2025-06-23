import { useState, useEffect } from 'react';

export default function EventForm({ selectedDate, onSubmit, onCancel, editingEvent }) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeError, setTimeError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isNextDay, setIsNextDay] = useState(false);

  // Populate form when editing an existing event
  useEffect(() => {
    if (editingEvent) {
      setEventTitle(editingEvent.title || '');
      setEventDescription(editingEvent.description || '');
      setStartTime(editingEvent.startTime || '');
      setEndTime(editingEvent.endTime || '');
      setIsNextDay(editingEvent.isMultiDay || false);
    } else {
      // Reset form for new event
      setEventTitle('');
      setEventDescription('');
      setStartTime('');
      setEndTime('');
      setIsNextDay(false);
    }
    setTimeError('');
    setSubmitError('');
  }, [editingEvent]);

  // Convert 24-hour time to 12-hour format for display
  const formatTimeFor12Hour = (time24) => {
    if (!time24) return '';
    const [hour, minute] = time24.split(':');
    const hour24 = parseInt(hour);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 < 12 ? 'AM' : 'PM';
    return `${hour12}:${minute} ${ampm}`;
  };

  // Validate time selection (allows cross-day events)
  const validateTimes = (start, end, isNextDay) => {
    if (!start || !end) return '';
    
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;
    
    // If it's next day, add 24 hours worth of minutes
    if (isNextDay) {
      endMinutes += 24 * 60;
    }
    
    // For same-day events, end must be after start
    // For next-day events, this check is automatically satisfied due to +24 hours
    if (endMinutes <= startMinutes) {
      if (isNextDay) {
        // This shouldn't happen with next day logic, but just in case
        return 'Invalid time combination';
      } else {
        return 'End time must be after start time, or check "ends next day"';
      }
    }
    
    return '';
  };

  const handleStartTimeChange = (time) => {
    setStartTime(time);
    const error = validateTimes(time, endTime, isNextDay);
    setTimeError(error);
    setSubmitError('');
  };

  const handleEndTimeChange = (time) => {
    setEndTime(time);
    const error = validateTimes(startTime, time, isNextDay);
    setTimeError(error);
    setSubmitError('');
  };

  const handleNextDayToggle = (checked) => {
    setIsNextDay(checked);
    const error = validateTimes(startTime, endTime, checked);
    setTimeError(error);
    setSubmitError('');
  };

  const formatDuration = () => {
    if (!startTime || !endTime || timeError) return '';
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;
    
    // Add 24 hours if it's next day
    if (isNextDay) {
      endMinutes += 24 * 60;
    }
    
    const durationMinutes = endMinutes - startMinutes;
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    if (hours === 0) return `${minutes} minutes`;
    if (minutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submission attempted:', {
      startTime,
      endTime,
      eventTitle: eventTitle.trim(),
      isNextDay,
      timeError,
      isEditing: !!editingEvent
    });
    
    if (!startTime || !endTime || !eventTitle.trim()) {
      console.log('Missing required fields');
      setSubmitError('Please fill in all required fields');
      return;
    }
    
    const error = validateTimes(startTime, endTime, isNextDay);
    if (error) {
      console.log('Validation error:', error);
      setTimeError(error);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Calculate end date (could be next day)
      const startDate = new Date(selectedDate);
      const endDate = new Date(selectedDate);
      if (isNextDay) {
        endDate.setDate(endDate.getDate() + 1);
      }

      const eventData = {
        title: eventTitle.trim(),
        description: eventDescription.trim(),
        date: selectedDate.toISOString().split('T')[0],
        startTime: startTime,
        endTime: endTime,
        endDate: endDate.toISOString().split('T')[0],
        isMultiDay: isNextDay,
        // Keep legacy 'time' field for backward compatibility
        time: formatTimeFor12Hour(startTime)
      };
      
      console.log('Submitting event data:', eventData);
      
      if (editingEvent) {
        // Call onSubmit with eventId and updated data for editing
        await onSubmit(editingEvent.id, eventData);
      } else {
        // Call onSubmit with just event data for adding
        await onSubmit(eventData);
      }
      
      // Reset form after successful submission
      setEventTitle('');
      setEventDescription('');
      setStartTime('');
      setEndTime('');
      setIsNextDay(false);
      setTimeError('');
      
    } catch (error) {
      console.error('Error submitting event:', error);
      setSubmitError(editingEvent ? 'Failed to update event. Please try again.' : 'Failed to save event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      {submitError && (
        <div className="error-message">{submitError}</div>
      )}

      <div className="form-group">
        <label htmlFor="event-title">Event Title *</label>
        <input
          id="event-title"
          type="text"
          value={eventTitle}
          onChange={(e) => {
            setEventTitle(e.target.value);
            setSubmitError('');
          }}
          placeholder="What's the event about?"
          className="form-input"
          maxLength={100}
          required
        />
        <div className="char-count">{eventTitle.length}/100</div>
      </div>

      <div className="form-group">
        <label htmlFor="event-description">Description</label>
        <textarea
          id="event-description"
          value={eventDescription}
          onChange={(e) => {
            setEventDescription(e.target.value);
            setSubmitError('');
          }}
          placeholder="Add more details (optional)"
          className="form-textarea"
          rows="3"
          maxLength={250}
        />
        <div className="char-count">{eventDescription.length}/250</div>
      </div>

      <div className="form-group">
        <label htmlFor="start-time">Start Time *</label>
        <input
          id="start-time"
          type="time"
          value={startTime}
          onChange={(e) => handleStartTimeChange(e.target.value)}
          className="form-input"
          required
        />
        {startTime && (
          <div className="time-display">
            {formatTimeFor12Hour(startTime)}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="end-time">End Time *</label>
        <input
          id="end-time"
          type="time"
          value={endTime}
          onChange={(e) => handleEndTimeChange(e.target.value)}
          className="form-input"
          required
        />
        {endTime && (
          <div className="time-display">
            {formatTimeFor12Hour(endTime)} {isNextDay && '(next day)'}
          </div>
        )}
      </div>

      <div className="form-group">
        {/* htmlFor and is was added so checkbox for nextday has an appropraite id attribute */}
        <label htmlFor="next-day-checkbox" className="checkbox-label">
          <input
            id="next-day-checkbox"
            type="checkbox"
            checked={isNextDay}
            onChange={(e) => handleNextDayToggle(e.target.checked)}
            className="form-checkbox"
          />
          <span className="checkbox-text">Event ends the next day</span>
        </label>
        <div className="help-text">
          Check this if your event goes past midnight (e.g., 4 PM to 2 AM)
        </div>
      </div>

      {timeError && (
        <div className="error-message">{timeError}</div>
      )}

      {startTime && endTime && !timeError && (
        <div className="duration-display">
          Duration: {formatDuration()}
        </div>
      )}

      <div className="form-actions">
        <button 
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button 
          type="submit"
          disabled={!startTime || !endTime || !eventTitle.trim() || isSubmitting || !!timeError}
          className="btn-primary"
        >
          {isSubmitting ? (
            <>
              <div className="spinner"></div>
              {editingEvent ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            editingEvent ? 'Update Event' : 'Add Event'
          )}
        </button>
      </div>
    </form>
  );
}