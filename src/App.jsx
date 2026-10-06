import styles from "./App.module.css";

const App = () => (
  <div className={styles.appShell}>
    <main className={styles.pageContent}>
      <h1>Event RSVP Manager</h1>
      <p>Keep event details and guest responses together.</p>
    </main>
  </div>
);

export default App;
