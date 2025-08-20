import React from 'react';

const TestPage = () => {
  console.log('TestPage component loaded!');
  console.log('Current URL:', window.location.href);
  console.log('Hash:', window.location.hash);
  console.log('Pathname:', window.location.pathname);
  console.log('Search:', window.location.search);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-900">Test Page Working!</h2>
          <div className="mt-4 text-sm">
            <div>URL: {window.location.href}</div>
            <div>Hash: {window.location.hash}</div>
            <div>Pathname: {window.location.pathname}</div>
            <div>Search: {window.location.search}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;