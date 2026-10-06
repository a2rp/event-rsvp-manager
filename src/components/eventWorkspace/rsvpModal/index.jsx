import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const RsvpModal = ({ eventName, existingEmails, onClose, onSave }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [partySize, setPartySize] = useState(1);
    const [response, setResponse] = useState("Attending");
    const [error, setError] = useState("");

    useEffect(() => {
        const closeOnEscape = (keyEvent) => {
            if (keyEvent.key === "Escape") onClose();
        };
        window.addEventListener("keydown", closeOnEscape);
        return () => window.removeEventListener("keydown", closeOnEscape);
    }, [onClose]);

    const submitRsvp = (formEvent) => {
        formEvent.preventDefault();
        const cleanEmail = email.trim().toLowerCase();
        if (existingEmails.includes(cleanEmail)) {
            setError("This email already has a response for this event.");
            return;
        }

        const saved = onSave({
            id: crypto.randomUUID(),
            name: name.trim(),
            email: cleanEmail,
            partySize: Number(partySize),
            response,
            checkedIn: false,
        });
        if (!saved)
            setError(
                "This event has no seats left. Increase its capacity to add this guest.",
            );
    };

    return (
        <div
            className={styles.backdrop}
            onMouseDown={(mouseEvent) => {
                if (mouseEvent.target === mouseEvent.currentTarget) onClose();
            }}
        >
            <section
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="rsvp-modal-title"
            >
                <header className={styles.modalHeader}>
                    <div>
                        <p className={styles.eventName}>{eventName}</p>
                        <h2 id="rsvp-modal-title">Record a response</h2>
                    </div>
                    <button
                        className={styles.closeButton}
                        type="button"
                        aria-label="Close RSVP form"
                        onClick={onClose}
                    >
                        <FiX aria-hidden="true" />
                    </button>
                </header>
                <form className={styles.form} onSubmit={submitRsvp}>
                    <label className={styles.field}>
                        Guest name
                        <input
                            autoFocus
                            required
                            maxLength="90"
                            value={name}
                            onChange={(changeEvent) =>
                                setName(changeEvent.target.value)
                            }
                            placeholder="Taylor Morgan"
                        />
                    </label>
                    <label className={styles.field}>
                        Email address
                        <input
                            type="email"
                            required
                            maxLength="120"
                            value={email}
                            onChange={(changeEvent) =>
                                setEmail(changeEvent.target.value)
                            }
                            placeholder="taylor@example.com"
                        />
                    </label>
                    <div className={styles.fieldsTwo}>
                        <label className={styles.field}>
                            Response
                            <select
                                value={response}
                                onChange={(changeEvent) =>
                                    setResponse(changeEvent.target.value)
                                }
                            >
                                <option>Attending</option>
                                <option>Maybe</option>
                                <option>Declined</option>
                            </select>
                        </label>
                        <label className={styles.field}>
                            Seats requested
                            <input
                                type="number"
                                min="1"
                                max="6"
                                required
                                value={partySize}
                                onChange={(changeEvent) =>
                                    setPartySize(changeEvent.target.value)
                                }
                            />
                        </label>
                    </div>
                    {error ? (
                        <p className={styles.error} role="alert">
                            {error}
                        </p>
                    ) : null}
                    <div className={styles.actions}>
                        <button
                            className={styles.cancelButton}
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button className={styles.saveButton} type="submit">
                            Save response
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export { RsvpModal };
