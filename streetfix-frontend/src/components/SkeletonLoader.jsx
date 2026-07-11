import React from 'react';

const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  return (
    <div className="skeleton-container" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className={`skeleton skeleton-${type}`}>
          {type === 'card' && (
            <>
              <div className="skeleton-title" style={{ height: '24px', width: '60%', marginBottom: '10px', borderRadius: '4px' }}></div>
              <div className="skeleton-text" style={{ height: '14px', width: '100%', marginBottom: '6px', borderRadius: '4px' }}></div>
              <div className="skeleton-text" style={{ height: '14px', width: '80%', borderRadius: '4px' }}></div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
