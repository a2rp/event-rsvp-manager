import { useState } from "react";
import { FiCheck, FiDownload, FiPlus, FiTrash2 } from "react-icons/fi";
import styles from "./styles.module.css";

const GuestRoster = ({ guests, onAddGuest, onExport, onUpdateResponse, onToggleCheckIn, onRemoveGuest }) => {
  const [search, setSearch] = useState("");
  const [responseFilter, setResponseFilter] = useState("All responses");
  const [error, setError] = useState("");
  const matchingGuests = guests.filter((guest) => {
    const textMatches = (guest.name + " " + guest.email).toLowerCase().includes(search.toLowerCase());
    return textMatches && (responseFilter === "All responses" || guest.response === responseFilter);
  });

  const changeResponse = (guest, nextResponse) => {
    const saved = onUpdateResponse(guest.id, nextResponse);
    setError(saved ? "" : "This event does not have enough seats for another attendee.");
  };

  return (
    <section className={styles.guestRoster} id="guest-list" aria-labelledby="guest-list-title">
      <div className={styles.heading}>
        <div>
          <h2 id="guest-list-title">Guest list</h2>
          <p>{matchingGuests.length} of {guests.length} guests</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.exportButton} type="button" onClick={onExport} disabled={!guests.length}>
            <FiDownload aria-hidden="true" /> Export CSV
          </button>
          <button className={styles.addButton} type="button" onClick={onAddGuest}>
            <FiPlus aria-hidden="true" /> Add response
          </button>
        </div>
      </div>

      <div className={styles.toolbar}>
        <label className={styles.search}>
          <span>Search guests</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name or email" />
        </label>
        <label className={styles.filter}>
          <span>Show</span>
          <select value={responseFilter} onChange={(event) => setResponseFilter(event.target.value)}>
            <option>All responses</option>
            <option>Attending</option>
            <option>Maybe</option>
            <option>Declined</option>
          </select>
        </label>
      </div>

      {error ? <p className={styles.error} role="alert">{error}</p> : null}

      {matchingGuests.length ? (
        <ul className={styles.guestRows} aria-label="Guest responses">
          {matchingGuests.map((guest) => (
            <li className={styles.guestRow} key={guest.id}>
              <div className={styles.guestIdentity}>
                <span className={styles.avatar} aria-hidden="true">{guest.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span>
                <span className={styles.guestText}>
                  <strong>{guest.name}</strong>
                  <span>{guest.email}</span>
                </span>
              </div>
              <div className={styles.partySize}>
                <span className={styles.cellLabel}>Seats</span>
                <strong>{guest.partySize}</strong>
              </div>
              <label className={styles.responseField}>
                <span className={styles.cellLabel}>Response</span>
                <select aria-label={"RSVP from " + guest.name} value={guest.response} onChange={(event) => changeResponse(guest, event.target.value)}>
                  <option>Attending</option>
                  <option>Maybe</option>
                  <option>Declined</option>
                </select>
              </label>
              <div className={styles.arrival}>
                <span className={styles.cellLabel}>Arrival</span>
                <button
                  className={guest.checkedIn ? styles.checkedIn : styles.checkInButton}
                  type="button"
                  disabled={guest.response !== "Attending"}
                  aria-pressed={guest.checkedIn}
                  onClick={() => onToggleCheckIn(guest.id)}
                >
                  {guest.checkedIn ? <><FiCheck aria-hidden="true" /> Arrived</> : "Check in"}
                </button>
              </div>
              <button className={styles.removeButton} type="button" aria-label={"Remove " + guest.name} onClick={() => onRemoveGuest(guest)}>
                <FiTrash2 aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>No guest responses match these filters.</p>
      )}
      <p className={styles.storageNote}>Guest details stay in this browser on this device.</p>
    </section>
  );
};

export { GuestRoster };
