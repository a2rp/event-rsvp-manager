import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const getDateAfterDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
};

const EventModal = ({ event: currentEvent, onClose, onSave }) => {
  const [name, setName] = useState(currentEvent?.name ?? "");
  const [category, setCategory] = useState(currentEvent?.category ?? "Dinner");
  const [date, setDate] = useState(currentEvent?.date ?? getDateAfterDays(7));
  const [time, setTime] = useState(currentEvent?.time ?? "18:30");
  const [venue, setVenue] = useState(currentEvent?.venue ?? "");
  const [capacity, setCapacity] = useState(currentEvent?.capacity ?? 40);
  const [description, setDescription] = useState(currentEvent?.description ?? "");

  useEffect(() => {
    const closeOnEscape = (keyEvent) => {
      if (keyEvent.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const submitEvent = (formEvent) => {
    formEvent.preventDefault();
    onSave({
      id: currentEvent?.id ?? crypto.randomUUID(),
      name: name.trim(),
      category,
      date,
      time,
      venue: venue.trim(),
      capacity: Number(capacity),
      description: description.trim(),
      image: currentEvent?.image ?? import.meta.env.BASE_URL + "images/event-cover.jpg",
      guests: currentEvent?.guests ?? [],
    });
  };

  return (
    <div
      className={styles.backdrop}
      onMouseDown={(mouseEvent) => {
        if (mouseEvent.target === mouseEvent.currentTarget) onClose();
      }}
    >
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="event-modal-title">
        <header className={styles.modalHeader}>
          <div>
            <h2 id="event-modal-title">{currentEvent ? "Edit event" : "Create an event"}</h2>
            <p>Add the details guests need before they reply.</p>
          </div>
          <button className={styles.closeButton} type="button" aria-label="Close event form" onClick={onClose}>
            <FiX aria-hidden="true" />
          </button>
        </header>
        <form className={styles.form} onSubmit={submitEvent}>
          <label className={styles.field}>
            Event name
            <input autoFocus required maxLength="80" value={name} onChange={(changeEvent) => setName(changeEvent.target.value)} placeholder="Lanterns on the Lawn" />
          </label>
          <label className={styles.field}>
            Description
            <textarea maxLength="180" rows="2" value={description} onChange={(changeEvent) => setDescription(changeEvent.target.value)} placeholder="A short note about the gathering" />
          </label>
          <div className={styles.fieldsTwo}>
            <label className={styles.field}>
              Event type
              <select value={category} onChange={(changeEvent) => setCategory(changeEvent.target.value)}>
                <option>Dinner</option>
                <option>Music</option>
                <option>Workshop</option>
                <option>Market</option>
                <option>Social</option>
              </select>
            </label>
            <label className={styles.field}>
              Guest capacity
              <input type="number" min="1" max="5000" required value={capacity} onChange={(changeEvent) => setCapacity(changeEvent.target.value)} />
            </label>
            <label className={styles.field}>
              Date
              <input type="date" required min={getDateAfterDays(0)} value={date} onChange={(changeEvent) => setDate(changeEvent.target.value)} />
            </label>
            <label className={styles.field}>
              Start time
              <input type="time" required value={time} onChange={(changeEvent) => setTime(changeEvent.target.value)} />
            </label>
          </div>
          <label className={styles.field}>
            Venue
            <input required maxLength="90" value={venue} onChange={(changeEvent) => setVenue(changeEvent.target.value)} placeholder="Juniper Hall" />
          </label>
          <div className={styles.actions}>
            <button className={styles.cancelButton} type="button" onClick={onClose}>Cancel</button>
            <button className={styles.saveButton} type="submit">{currentEvent ? "Save changes" : "Create event"}</button>
          </div>
        </form>
      </section>
    </div>
  );
};

export { EventModal };
