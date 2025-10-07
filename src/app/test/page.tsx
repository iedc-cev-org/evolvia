"use client";
import React, { useState } from 'react';

export default function TestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addTestResult = (test: string, success: boolean, data?: any, error?: string) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      data,
      error,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    try {
      const result = await testFn();
      addTestResult(testName, true, result);
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      addTestResult(testName, false, null, errorMsg);
      throw error;
    }
  };

  const testDataFlow = async () => {
    setLoading(true);
    setTestResults([]);

    try {
      // Test 1: Database Connection
      await runTest('Database Connection', async () => {
        const res = await fetch('/api/test-db');
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        return data;
      });

      // Test 2: Seed Database
      await runTest('Seed Database', async () => {
        const res = await fetch('/api/seed', { method: 'POST' });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        return data;
      });

      // Test 3: Fetch Users
      await runTest('Fetch Users', async () => {
        const res = await fetch('/api/users');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        return { userCount: data.length, users: data };
      });

      // Test 4: Search Users
      await runTest('Search Users', async () => {
        const res = await fetch('/api/users/search?name=john');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        return { searchResults: data.length, users: data };
      });

      // Test 5: Update Score
      const users = await fetch('/api/users').then(r => r.json());
      if (users.length > 0) {
        await runTest('Update User Score', async () => {
          const res = await fetch('/api/users/update-score', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: users[0]._id, score: 100 })
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          return data;
        });
      }

    } catch (error) {
      console.error('Test flow stopped due to error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearDatabase = async () => {
    try {
      setLoading(true);
      await runTest('Clear Database', async () => {
        // We'll just reseed with empty data
        const res = await fetch('/api/seed', { method: 'POST' });
        const data = await res.json();
        return { message: 'Database cleared and reseeded' };
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Data Flow Test</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testDataFlow}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Running Tests...' : 'Test Complete Data Flow'}
          </button>
          
          <button
            onClick={clearDatabase}
            disabled={loading}
            className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 ml-4"
          >
            Clear & Reseed Database
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Test Results:</h2>
          {testResults.map((result, idx) => (
            <div
              key={idx}
              className={`p-4 rounded border ${
                result.success 
                  ? 'bg-green-900/20 border-green-500' 
                  : 'bg-red-900/20 border-red-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    {result.success ? '✅' : '❌'} {result.test}
                  </h3>
                  <p className="text-sm text-gray-400">{result.timestamp}</p>
                </div>
              </div>
              
              {result.error && (
                <div className="mt-2 text-red-300">
                  <strong>Error:</strong> {result.error}
                </div>
              )}
              
              {result.data && (
                <div className="mt-2">
                  <details className="text-sm">
                    <summary className="cursor-pointer text-gray-300">Show Details</summary>
                    <pre className="mt-2 p-2 bg-black/50 rounded overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500 rounded">
          <h3 className="font-semibold mb-2">Data Flow Test Steps:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Test MongoDB connection</li>
            <li>Seed database with sample users</li>
            <li>Fetch all users from database</li>
            <li>Test user search functionality</li>
            <li>Test score update functionality</li>
          </ol>
        </div>

        <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500 rounded">
          <h3 className="font-semibold mb-2">Quick Links to Test Pages:</h3>
          <div className="space-x-4">
            <a href="/leaderboard" className="text-blue-400 hover:underline">Leaderboard</a>
            <a href="/enter" className="text-blue-400 hover:underline">Enter Marks</a>
            <a href="/game" className="text-blue-400 hover:underline">Game (Sign-in)</a>
          </div>
        </div>
      </div>
    </div>
  );
}