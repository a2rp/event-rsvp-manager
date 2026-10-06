import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import styles from "./styles.module.css";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 50);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  if (!visible) return null;

  return (
    <a className={styles.button} href="#top" aria-label="Back to top" title="Back to top">
      <FiArrowUp aria-hidden="true" />
    </a>
  );
};

export { BackToTop };
