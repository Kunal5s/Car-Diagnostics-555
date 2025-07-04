'use client';

import { useState, useEffect } from 'react';

export function ClientDate() {
  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    // This will only run on the client, after initial hydration
    setDate(new Date().toLocaleDateString());
  }, []);

  // Render a placeholder or nothing on the server and initial client render
  return <>{date || '...'}</>;
}
