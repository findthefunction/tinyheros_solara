import Head from 'next/head';
import dynamic from 'next/dynamic';
import styles from '../styles/Home.module.css';

// Dynamically import the Map component to avoid SSR issues with map libraries
const Map = dynamic(() => import('../components/Map'), { ssr: false });
const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Interactive Map with Blockchain</title>
        <meta name="description" content="Interactive map integrated with Solana blockchain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Interactive Solana Map</h1>
        <Map />
      </main>
    </div>
  );
};

export default Home;