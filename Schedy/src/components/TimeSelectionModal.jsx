import EventForm from './EventForm';

export default function TimeSelectionModal({ selectedDate, onAddEvent, editingEvent, onClose }) {
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleFormSubmit = async (eventId, eventData = null) => {
    if (editingEvent && eventData){
      await onAddEvent(eventId, eventData)
    }else{
      await onAddEvent(eventId)
    }
    onClose()
  }

  return (
    <>
      <div className="date-display">
        <div className="calendar-icon">
          <i className="fa-solid fa-calendar"></i>
        </div>
        <span>{formatDate(selectedDate)}</span>
        <div className='editing-indicator'>
          <i className="fa-solid fa-pen-nib"></i>
          <span> Editing event</span>
        </div>
      </div>

      <EventForm
        selectedDate={selectedDate}
        onSubmit={handleFormSubmit}
        onCancel={onClose}
        editingEvent={editingEvent}
      />
    </>
  );
}