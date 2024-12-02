
import React from 'react';

const Card = ({ title, count, additionalData }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 m-2 flex flex-col items-center">
      <h2 className="text-gray-500">{title}</h2>
      <p className="text-3xl font-bold">{count}</p>
      {additionalData && <p className="text-blue-500">{additionalData}</p>}
    </div>
  );
};

export default Card;
