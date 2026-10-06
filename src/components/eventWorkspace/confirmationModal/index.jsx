import { useEffect, useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import styles from "./styles.module.css";

const ConfirmationModal = ({
    title,
    description,
    confirmLabel = "Remove",
    onCancel,
    onConfirm,
}) => {
    const dialogRef = useRef(null);
    const cancelButtonRef = useRef(null);

    useEffect(() => {
        cancelButtonRef.current?.focus();
        const handleKeys = (event) => {
            if (event.key === "Escape") {
                onCancel();
                return;
            }
            if (event.key !== "Tab") return;

            const buttons = dialogRef.current?.querySelectorAll("button");
            if (!buttons?.length) return;
            const firstButton = buttons[0];
            const lastButton = buttons[buttons.length - 1];
            if (event.shiftKey && document.activeElement === firstButton) {
                event.preventDefault();
                lastButton.focus();
            } else if (
                !event.shiftKey &&
                document.activeElement === lastButton
            ) {
                event.preventDefault();
                firstButton.focus();
            }
        };

        document.addEventListener("keydown", handleKeys);
        return () => document.removeEventListener("keydown", handleKeys);
    }, [onCancel]);

    return (
        <div
            className={styles.backdrop}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onCancel();
            }}
        >
            <section
                className={styles.modal}
                ref={dialogRef}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                aria-describedby="confirm-description"
            >
                <span className={styles.warningIcon}>
                    <FiAlertTriangle aria-hidden="true" />
                </span>
                <h2 id="confirm-title">{title}</h2>
                <p id="confirm-description">{description}</p>
                <div className={styles.actions}>
                    <button
                        ref={cancelButtonRef}
                        type="button"
                        onClick={onCancel}
                    >
                        Keep it
                    </button>
                    <button
                        className={styles.confirmButton}
                        type="button"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </section>
        </div>
    );
};

export { ConfirmationModal };
