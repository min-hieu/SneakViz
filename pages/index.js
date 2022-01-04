import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Screen from './screen'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Sneaker Visualization</title>
        <meta name="description" content="Visualizing 20-year History of Sneaker" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
