import { useState } from "react";
import {
    FiCalendar,
    FiClock,
    FiEdit2,
    FiMapPin,
    FiPlus,
    FiTrash2,
    FiUsers,
} from "react-icons/fi";
import { ConfirmationModal } from "./confirmationModal/index.jsx";
import { EventModal } from "./eventModal/index.jsx";
import { GuestRoster } from "./guestRoster/index.jsx";
import { RsvpModal } from "./rsvpModal/index.jsx";
import styles from "./styles.module.css";

const dateAfterDays = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");
};

const startingEvents = [
    {
        id: "lantern-dinner",
        name: "Lanterns on the Lawn",
        category: "Community dinner",
        date: dateAfterDays(7),
        time: "18:30",
        venue: "Juniper Hall",
        capacity: 48,
        description:
            "One long table, good food, and new faces from around the block.",
        image: import.meta.env.BASE_URL + "images/event-cover.jpg",
        guests: [
            {
                id: "g-101",
                name: "Maya Chen",
                email: "maya.chen@example.com",
                partySize: 2,
                response: "Attending",
                checkedIn: true,
            },
            {
                id: "g-102",
                name: "Jonah Lewis",
                email: "jonah.lewis@example.com",
                partySize: 1,
                response: "Attending",
                checkedIn: false,
            },
            {
                id: "g-103",
                name: "Rina Wallace",
                email: "rina.wallace@example.com",
                partySize: 3,
                response: "Attending",
                checkedIn: false,
            },
            {
                id: "g-104",
                name: "Elliot James",
                email: "elliot.james@example.com",
                partySize: 2,
                response: "Maybe",
                checkedIn: false,
            },
            {
                id: "g-105",
                name: "Samira Okafor",
                email: "samira.okafor@example.com",
                partySize: 1,
                response: "Attending",
                checkedIn: false,
            },
            {
                id: "g-106",
                name: "Mateo Chen",
                email: "mateo.chen@example.com",
                partySize: 1,
                response: "Declined",
                checkedIn: false,
            },
        ],
    },
    {
        id: "open-studio",
        name: "Open Studio Saturday",
        category: "Workshop",
        date: dateAfterDays(14),
        time: "10:00",
        venue: "Millhouse Studio",
        capacity: 32,
        description:
            "A morning of printmaking, shared tools, and coffee in the yard.",
        image: "",
        guests: [
            {
                id: "g-201",
                name: "Priya Shah",
                email: "priya.shah@example.com",
                partySize: 1,
                response: "Attending",
                checkedIn: false,
            },
            {
                id: "g-202",
                name: "Theo Williams",
                email: "theo.williams@example.com",
                partySize: 2,
                response: "Maybe",
                checkedIn: false,
            },
            {
                id: "g-203",
                name: "Ava Morgan",
                email: "ava.morgan@example.com",
                partySize: 1,
                response: "Attending",
                checkedIn: false,
            },
        ],
    },
    {
        id: "backlot-film",
        name: "Backlot Film Night",
        category: "Outdoor screening",
        date: dateAfterDays(21),
        time: "19:15",
        venue: "Lantern Cinema Garden",
        capacity: 72,
        description:
            "Bring a blanket for an open-air story under the evening sky.",
        image: "",
        guests: [
            {
                id: "g-301",
                name: "Nora Ellis",
                email: "nora.ellis@example.com",
                partySize: 2,
                response: "Attending",
                checkedIn: false,
            },
            {
                id: "g-302",
                name: "Oliver James",
                email: "oliver.james@example.com",
                partySize: 1,
                response: "Attending",
                checkedIn: false,
            },
        ],
    },
];

const getSavedEvents = () => {
    try {
        const saved = localStorage.getItem("gatherwell-events-v1");
        if (!saved) return startingEvents;
        const events = JSON.parse(saved);
        return Array.isArray(events) ? events : startingEvents;
    } catch {
        return startingEvents;
    }
};

const formatDate = (dateValue, options) => {
    const date = new Date(dateValue + "T12:00:00");
    return new Intl.DateTimeFormat("en-US", options).format(date);
};

const countSeats = (guests, response) =>
    guests
        .filter((guest) => guest.response === response)
        .reduce((total, guest) => total + guest.partySize, 0);

const EventWorkspace = () => {
    const [events, setEvents] = useState(getSavedEvents);
    const [selectedEventId, setSelectedEventId] = useState(
        startingEvents[0].id,
    );
    const [eventModalOpen, setEventModalOpen] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);
    const [rsvpEventId, setRsvpEventId] = useState(null);
    const [itemToRemove, setItemToRemove] = useState(null);

    const saveEvents = (nextEvents) => {
        setEvents(nextEvents);
        try {
            localStorage.setItem(
                "gatherwell-events-v1",
                JSON.stringify(nextEvents),
            );
        } catch {
            return;
        }
    };

    const selectedEvent =
        events.find((event) => event.id === selectedEventId) ??
        events[0] ??
        null;
    const rsvpEvent = events.find((event) => event.id === rsvpEventId) ?? null;
    const attendingSeats = selectedEvent
        ? countSeats(selectedEvent.guests, "Attending")
        : 0;
    const maybeSeats = selectedEvent
        ? countSeats(selectedEvent.guests, "Maybe")
        : 0;
    const arrivedSeats = selectedEvent
        ? selectedEvent.guests
              .filter((guest) => guest.checkedIn)
              .reduce((total, guest) => total + guest.partySize, 0)
        : 0;
    const seatsLeft = selectedEvent
        ? Math.max(0, selectedEvent.capacity - attendingSeats)
        : 0;

    const saveEvent = (eventToSave) => {
        const alreadyExists = events.some(
            (event) => event.id === eventToSave.id,
        );
        const nextEvents = alreadyExists
            ? events.map((event) =>
                  event.id === eventToSave.id ? eventToSave : event,
              )
            : [eventToSave, ...events];
        saveEvents(nextEvents);
        setSelectedEventId(eventToSave.id);
        setEventModalOpen(false);
        setEventToEdit(null);
    };

    const addGuest = (guest) => {
        if (!rsvpEvent) return false;
        const seatsTaken = countSeats(rsvpEvent.guests, "Attending");
        if (
            guest.response === "Attending" &&
            seatsTaken + guest.partySize > rsvpEvent.capacity
        )
            return false;

        const nextEvents = events.map((event) =>
            event.id === rsvpEvent.id
                ? { ...event, guests: [...event.guests, guest] }
                : event,
        );
        saveEvents(nextEvents);
        setRsvpEventId(null);
        return true;
    };

    const updateResponse = (guestId, response) => {
        if (!selectedEvent) return false;
        const guest = selectedEvent.guests.find((item) => item.id === guestId);
        if (!guest) return false;
        const seatsTaken = countSeats(selectedEvent.guests, "Attending");
        const isNewAttendee =
            guest.response !== "Attending" && response === "Attending";
        if (
            isNewAttendee &&
            seatsTaken + guest.partySize > selectedEvent.capacity
        )
            return false;

        const guests = selectedEvent.guests.map((item) =>
            item.id === guestId
                ? {
                      ...item,
                      response,
                      checkedIn:
                          response === "Attending" ? item.checkedIn : false,
                  }
                : item,
        );
        saveEvents(
            events.map((event) =>
                event.id === selectedEvent.id ? { ...event, guests } : event,
            ),
        );
        return true;
    };

    const toggleCheckIn = (guestId) => {
        if (!selectedEvent) return;
        const guests = selectedEvent.guests.map((guest) =>
            guest.id === guestId
                ? { ...guest, checkedIn: !guest.checkedIn }
                : guest,
        );
        saveEvents(
            events.map((event) =>
                event.id === selectedEvent.id ? { ...event, guests } : event,
            ),
        );
    };

    const removeItem = () => {
        if (!itemToRemove) return;
        if (itemToRemove.type === "event") {
            const nextEvents = events.filter(
                (event) => event.id !== itemToRemove.id,
            );
            saveEvents(nextEvents);
            if (selectedEventId === itemToRemove.id)
                setSelectedEventId(nextEvents[0]?.id ?? "");
        } else if (selectedEvent) {
            const guests = selectedEvent.guests.filter(
                (guest) => guest.id !== itemToRemove.id,
            );
            saveEvents(
                events.map((event) =>
                    event.id === selectedEvent.id
                        ? { ...event, guests }
                        : event,
                ),
            );
        }
        setItemToRemove(null);
    };

    const exportGuests = () => {
        if (!selectedEvent) return;
        const headers = ["Name", "Email", "Response", "Seats", "Checked in"];
        const rows = selectedEvent.guests.map((guest) => [
            guest.name,
            guest.email,
            guest.response,
            guest.partySize,
            guest.checkedIn ? "Yes" : "No",
        ]);
        const csv = [headers, ...rows]
            .map((row) =>
                row
                    .map((cell) => '"' + String(cell).replace(/"/g, '""') + '"')
                    .join(","),
            )
            .join("\r\n");
        const file = new Blob([csv], { type: "text/csv;charset=utf-8" });
        const fileUrl = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download =
            selectedEvent.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "") + "-guests.csv";
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
    };

    const openNewEvent = () => {
        setEventToEdit(null);
        setEventModalOpen(true);
    };

    const openEditEvent = () => {
        setEventToEdit(selectedEvent);
        setEventModalOpen(true);
    };

    return (
        <div className={styles.workspace}>
            <div className={styles.pageHeading}>
                <div>
                    <h1>Event desk</h1>
                    <p>
                        Plan the gathering, follow every reply, and welcome
                        guests at the door.
                    </p>
                </div>
                <button
                    className={styles.newEventButton}
                    type="button"
                    onClick={openNewEvent}
                >
                    <FiPlus aria-hidden="true" /> New event
                </button>
            </div>

            <div className={styles.workspaceLayout}>
                <aside
                    className={styles.eventRail}
                    id="event-list"
                    aria-label="Your events"
                >
                    <div className={styles.railHeading}>
                        <h2>Your events</h2>
                        <span>{events.length}</span>
                    </div>
                    <div className={styles.eventOptions}>
                        {events.map((event) => (
                            <button
                                className={
                                    event.id === selectedEvent?.id
                                        ? styles.selectedEvent
                                        : styles.eventOption
                                }
                                key={event.id}
                                type="button"
                                aria-pressed={event.id === selectedEvent?.id}
                                onClick={() => setSelectedEventId(event.id)}
                            >
                                <span className={styles.dateTile}>
                                    <span>
                                        {formatDate(event.date, {
                                            month: "short",
                                        })}
                                    </span>
                                    <strong>
                                        {formatDate(event.date, {
                                            day: "numeric",
                                        })}
                                    </strong>
                                </span>
                                <span className={styles.eventOptionText}>
                                    <strong>{event.name}</strong>
                                    <span>{event.venue}</span>
                                </span>
                            </button>
                        ))}
                        {!events.length ? (
                            <p className={styles.noEvents}>
                                Create an event to start a guest list.
                            </p>
                        ) : null}
                    </div>
                    <button
                        className={styles.addEventButton}
                        type="button"
                        onClick={openNewEvent}
                    >
                        <FiPlus aria-hidden="true" /> Add event
                    </button>
                    <p className={styles.railNote}>
                        <FiCalendar aria-hidden="true" /> Your upcoming
                        gatherings
                    </p>
                </aside>

                {selectedEvent ? (
                    <div className={styles.eventContent}>
                        <section
                            className={styles.eventFeature}
                            aria-labelledby="event-title"
                        >
                            <div
                                className={
                                    selectedEvent.image
                                        ? styles.eventCoverWithImage
                                        : styles.eventCover
                                }
                            >
                                {selectedEvent.image ? (
                                    <img src={selectedEvent.image} alt="" />
                                ) : null}
                                <div className={styles.coverShade} />
                                <div className={styles.eventActions}>
                                    <button
                                        type="button"
                                        aria-label="Edit event details"
                                        onClick={openEditEvent}
                                    >
                                        <FiEdit2 aria-hidden="true" /> Edit
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Delete event"
                                        onClick={() =>
                                            setItemToRemove({
                                                type: "event",
                                                id: selectedEvent.id,
                                                name: selectedEvent.name,
                                            })
                                        }
                                    >
                                        <FiTrash2 aria-hidden="true" />
                                    </button>
                                </div>
                                <div className={styles.eventInfo}>
                                    <span className={styles.category}>
                                        {selectedEvent.category}
                                    </span>
                                    <h2 id="event-title">
                                        {selectedEvent.name}
                                    </h2>
                                    <p>{selectedEvent.description}</p>
                                    <div className={styles.eventMeta}>
                                        <span>
                                            <FiCalendar aria-hidden="true" />{" "}
                                            {formatDate(selectedEvent.date, {
                                                weekday: "long",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </span>
                                        <span>
                                            <FiClock aria-hidden="true" />{" "}
                                            {selectedEvent.time}
                                        </span>
                                        <span>
                                            <FiMapPin aria-hidden="true" />{" "}
                                            {selectedEvent.venue}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.eventStats}>
                                <div>
                                    <strong>
                                        {attendingSeats}
                                        <small>
                                            {" "}
                                            / {selectedEvent.capacity}
                                        </small>
                                    </strong>
                                    <span>seats reserved</span>
                                </div>
                                <div>
                                    <strong>
                                        {selectedEvent.guests.length}
                                    </strong>
                                    <span>responses</span>
                                </div>
                                <div>
                                    <strong>
                                        {arrivedSeats}
                                        <small> / {attendingSeats}</small>
                                    </strong>
                                    <span>seats checked in</span>
                                </div>
                                <div className={styles.seatStatus}>
                                    <span>
                                        <FiUsers aria-hidden="true" />{" "}
                                        {seatsLeft} seats left
                                    </span>
                                    <span className={styles.seatTrack}>
                                        <span
                                            style={{
                                                width:
                                                    Math.min(
                                                        100,
                                                        (attendingSeats /
                                                            selectedEvent.capacity) *
                                                            100,
                                                    ) + "%",
                                            }}
                                        />
                                    </span>
                                    <span>
                                        {maybeSeats} seats awaiting a reply
                                    </span>
                                </div>
                            </div>
                        </section>

                        <GuestRoster
                            key={selectedEvent.id}
                            guests={selectedEvent.guests}
                            onAddGuest={() => setRsvpEventId(selectedEvent.id)}
                            onExport={exportGuests}
                            onUpdateResponse={updateResponse}
                            onToggleCheckIn={toggleCheckIn}
                            onRemoveGuest={(guest) =>
                                setItemToRemove({
                                    type: "guest",
                                    id: guest.id,
                                    name: guest.name,
                                })
                            }
                        />
                    </div>
                ) : (
                    <section className={styles.emptyEvent}>
                        <span>
                            <FiCalendar aria-hidden="true" />
                        </span>
                        <h2>Your next event starts here</h2>
                        <p>
                            Add the date and venue, then keep every guest reply
                            in one list.
                        </p>
                        <button
                            className={styles.newEventButton}
                            type="button"
                            onClick={openNewEvent}
                        >
                            <FiPlus aria-hidden="true" /> Create an event
                        </button>
                    </section>
                )}
            </div>

            <section className={styles.howItWorks} id="how-it-works">
                <div>
                    <span>01</span>
                    <h2>Set the date</h2>
                    <p>Add the details guests need to make a plan.</p>
                </div>
                <div>
                    <span>02</span>
                    <h2>Collect replies</h2>
                    <p>
                        Record each response and keep an eye on available seats.
                    </p>
                </div>
                <div>
                    <span>03</span>
                    <h2>Welcome everyone</h2>
                    <p>Check guests in from the list as they arrive.</p>
                </div>
            </section>

            {eventModalOpen ? (
                <EventModal
                    key={eventToEdit?.id ?? "new-event"}
                    event={eventToEdit}
                    onClose={() => setEventModalOpen(false)}
                    onSave={saveEvent}
                />
            ) : null}
            {rsvpEvent ? (
                <RsvpModal
                    eventName={rsvpEvent.name}
                    existingEmails={rsvpEvent.guests.map((guest) =>
                        guest.email.toLowerCase(),
                    )}
                    onClose={() => setRsvpEventId(null)}
                    onSave={addGuest}
                />
            ) : null}
            {itemToRemove ? (
                <ConfirmationModal
                    title={
                        itemToRemove.type === "event"
                            ? "Remove this event?"
                            : "Remove this guest?"
                    }
                    description={
                        itemToRemove.type === "event"
                            ? itemToRemove.name +
                              " and its guest responses will be deleted from this browser."
                            : itemToRemove.name +
                              " will be removed from this event's guest list."
                    }
                    confirmLabel={
                        itemToRemove.type === "event"
                            ? "Remove event"
                            : "Remove guest"
                    }
                    onCancel={() => setItemToRemove(null)}
                    onConfirm={removeItem}
                />
            ) : null}
        </div>
    );
};

export { EventWorkspace };
