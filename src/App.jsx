import { EventWorkspace } from "./components/eventWorkspace/index.jsx";
import { SiteFooter } from "./components/siteFooter/index.jsx";
import { SiteHeader } from "./components/siteHeader/index.jsx";
import styles from "./App.module.css";

const App = () => (
  <div className={styles.appShell}>
    <SiteHeader />
    <main className={styles.pageContent}>
      <EventWorkspace />
    </main>
    <SiteFooter />
  </div>
);

export default App;
