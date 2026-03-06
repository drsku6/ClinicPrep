
'use client'

import { useState } from 'react';

const specialists = [
  { name: 'Dr. John Doe', specialty: 'Cardiologist', location: 'New York, NY' },
  { name: 'Dr. Jane Smith', specialty: 'Dermatologist', location: 'Los Angeles, CA' },
  { name: 'Dr. Peter Jones', specialty: 'Orthopedic Surgeon', location: 'Chicago, IL' },
  { name: 'Dr. Mary Williams', specialty: 'Neurologist', location: 'Houston, TX' },
];

const SpecialistFinderPage = () => {
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [filteredSpecialists, setFilteredSpecialists] = useState(specialists);

  const handleSearch = () => {
    const filtered = specialists.filter(specialist =>
      specialist.specialty.toLowerCase().includes(specialty.toLowerCase()) &&
      specialist.location.toLowerCase().includes(location.toLowerCase())
    );
    setFilteredSpecialists(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Find a Specialist</h1>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-6 flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <label className="block text-gray-400 mb-2">Specialty</label>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="w-full md:w-1/2">
            <label className="block text-gray-400 mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline self-end"
          >
            Search
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpecialists.map((specialist, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-2">{specialist.name}</h2>
              <p className="text-gray-400 mb-2">{specialist.specialty}</p>
              <p className="text-gray-400">{specialist.location}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialistFinderPage;
