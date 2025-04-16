import { useState, useEffect, useRef } from 'react';
import anime from 'animejs';

const LapList = ({ laps }) => {
  const listRef = useRef(null);
  const [listHeight, setListHeight] = useState('auto');

  const formatTime = (timeInMs) => {
    const minutes = Math.floor(timeInMs / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    const centiseconds = Math.floor((timeInMs % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${centiseconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (laps.length > 0) {
      const newLapElements = listRef.current?.querySelectorAll('.lap-item:first-child');

      if (newLapElements?.length) {
        anime({
          targets: newLapElements,
          translateX: ['-100%', '0%'],
          opacity: [0, 1],
          duration: 500,
          easing: 'easeOutExpo'
        });
      }

      if (listRef.current) {
        if (laps.length > 5) {
          setListHeight('300px');
        } else {
          setListHeight('auto');
        }
      }
    }
  }, [laps.length]);

  const getLapDiff = (index) => {
    if (index === laps.length - 1) return laps[index];
    return laps[index] - laps[index + 1];
  };

  const findFastestAndSlowest = () => {
    if (laps.length <= 1) return { fastest: -1, slowest: -1 };

    const lapDiffs = laps.map((_, index) => getLapDiff(index));
    const fastestIndex = lapDiffs.indexOf(Math.min(...lapDiffs.slice(0, -1)));
    const slowestIndex = lapDiffs.indexOf(Math.max(...lapDiffs.slice(0, -1)));

    return { fastest: fastestIndex, slowest: slowestIndex };
  };

  const { fastest, slowest } = findFastestAndSlowest();

  return (
    <div className="lap-list-container">
      <h3 className="lap-list-title">Laps</h3>
      <div
        className="lap-list"
        ref={listRef}
        style={{ maxHeight: listHeight, overflowY: laps.length > 5 ? 'auto' : 'visible' }}
      >
        {laps.length === 0 ? (
          <div className="no-laps">No laps recorded</div>
        ) : (
          laps.map((_, index) => {
            const reversedIndex = laps.length - 1 - index;
            const lapNumber = laps.length - reversedIndex;
            const lapTime = getLapDiff(reversedIndex);
            const isFastest = reversedIndex === fastest;
            const isSlowest = reversedIndex === slowest;

            return (
              <div
                key={`lap-${reversedIndex}`}
                className={`lap-item ${isFastest ? 'fastest' : ''} ${isSlowest ? 'slowest' : ''}`}
              >
                <span className="lap-number">Lap {lapNumber}</span>
                <span className="lap-time">{formatTime(lapTime)}</span>
                {isFastest && laps.length > 1 && <span className="lap-tag fastest-tag">Fastest</span>}
                {isSlowest && laps.length > 1 && <span className="lap-tag slowest-tag">Slowest</span>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LapList;