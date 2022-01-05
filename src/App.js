import styles from './styles/App.css'
import Screen from './screen'

export default function App() {
  return (
    <div className={styles.container}>
      <Screen />

      <footer className={styles.footer}>
        <a
          href="https://github.com/min-hieu"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created by Hieu
        </a>
      </footer>
    </div>
  )
}
