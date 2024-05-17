import React, { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

const Map: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const handleAreaClick = (area: string): void => {
    setSelectedArea(area);
    console.log(`Area selected: ${area}`);
  };

  return (
    <div className={styles.mapContainer}>
      <Image
        src="/map.png"
        alt="Interactive Map"
        layout="fill"
        objectFit="contain"
      />
      {/* Example interactive area */}
      <button style={{ position: 'absolute', top: '20%', left: '15%' }} onClick={() => handleAreaClick('Enchanted Forest')}>
        Enchanted Forest
      </button>
    </div>
  );
};

export default Map;
