import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: 'white', minHeight: '100vh' }}>
      <h1>Test Page</h1>
      <p>If you can see this, the routing is working!</p>
      <div style={{ backgroundColor: 'lightblue', padding: '10px', margin: '10px 0' }}>
        This is a simple test component to verify routing works.
      </div>
    </div>
  );
};



export default TestPage;