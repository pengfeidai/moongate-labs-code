// pages/index.tsx
import type { NextPage } from 'next';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Navigation UI</title>
        <meta name="description" content="A simple navigation UI" />
      </Head>

      <nav className={styles.nav}>
        <Link href="/" className={styles.navLink}>
          Home
        </Link>
        <Link href="/featured" className={styles.navLink}>
          Featured
        </Link>
        <Link href="/table" className={styles.navLink}>
          Table
        </Link>
        <Link href="/history" className={styles.navLink}>
          History
        </Link>
      </nav>

      <main className={styles.main}>
        <h1>Welcome to the Home Page</h1>
        <p>Select a tab to navigate to different pages.</p>
      </main>
    </div>
  );
};

export default Home;
