'use client';

import { useState, useEffect } from 'react';

export default function Test() {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCount = async () => {
    try {
      const response = await fetch('/api/counter');
      const data = await response.json();
      setCount(data.count);
      setError(null);
    } catch (err) {
      setError('Failed to fetch count');
      console.error(err);
    }
  };

  const incrementCount = async () => {
    try {
      const response = await fetch('/api/counter', {
        method: 'POST',
      });
      const data = await response.json();
      setCount(data.count);
      setError(null);
    } catch (err) {
      setError('Failed to increment count');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">API Test</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p>Current count: {count !== null ? count : 'Loading...'}</p>
      )}
      <button
        onClick={incrementCount}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Increment Counter
      </button>
    </div>
  );
}
