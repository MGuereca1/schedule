import EventForm from './EventForm';

export default function TimeSelectionModal({ selectedDate, onAddEvent, onClose }) {
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleFormSubmit = async (eventData) => {
    await onAddEvent(eventData);
    onClose();
  };

  return (
    <>
      <div className="date-display">
        <div className="calendar-icon">
          <i className="fa-solid fa-calendar"></i>
        </div>
        <span>{formatDate(selectedDate)}</span>
      </div>

      <EventForm
        selectedDate={selectedDate}
        onSubmit={handleFormSubmit}
        onCancel={onClose}
      />
    </>
  );
}