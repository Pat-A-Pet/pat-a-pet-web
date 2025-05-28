import React from "react";
import { useState } from "react";
import Navbar from "../../component/Navbar";
import PetImageSlider from "../../component/petslider";
import { FiClock, FiMapPin } from 'react-icons/fi';

export default function PetDetail() {
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // Sample data - replace with your actual data
  const images = [
    '/german.webp',
    '/dog2.jpg',
    '/dog3.jpg',
    '/dog4.jpg',
    '/dog5.webp',
    '/dog6.jpg'
  ];

  const owner = {
    name: "Alex Johnson",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  };

  const petData = {
    name: "Max",
    breed: "German Shepherd",
    age: "3 years",
    gender: "Male",
    weight: "28 kg",
    color: "Black & Tan",
    size: "Large",
    vaccinated: true,
    neutered: true,
    microchipped: true,
    description: "Max is a loyal, intelligent, and energetic German Shepherd looking for his forever home. He's well-trained, great with families, and loves outdoor activities. Max would thrive in an active household where he can get plenty of exercise and mental stimulation.",
    traits: ["Loyal", "Energetic", "Intelligent", "Friendly", "Protective"],
    medicalHistory: "Up to date on all vaccinations, regular vet checkups, no known health issues.",
    adoptionFee: "$250",
    location: "San Francisco, CA",
    publishdate: "28-5-2025"
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">
      {/* Navbar Placeholder */}
      <div className="h-20 bg-white shadow-sm border-w flex items-center px-8"/>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left: Pet Image Slider (Reusable Component) */}
          <div>
            <PetImageSlider images={images} owner={owner} />
          </div>

          {/* Right: Pet Information */}
          <div className="space-y-6">
            
            {/* Pet Header */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {petData.name} the {petData.breed}
                  </h1>
                  <p className="text-lg text-gray-600 flex items-center gap-2">
                    <FiMapPin className="inline-block text-gray-500 mr-1" />
                    {petData.location}
                  </p>
                  <p className="text-lg text-gray-600 flex items-center gap-2">
                    <FiClock className="inline-block text-gray-500 mr-1" />
                    {petData.publishdate}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`p-3 rounded-full transition-all duration-300 ${
                      isLiked 
                        ? 'bg-red-500 text-white scale-110' 
                        : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500'
                    }`}
                  >
                    <svg className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button className="p-3 rounded-full bg-gray-100 text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-bold text-gray-900">{petData.age}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="font-bold text-gray-900">{petData.gender}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Size</p>
                  <p className="font-bold text-gray-900">{petData.size}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Weight</p>
                  <p className="font-bold text-gray-900">{petData.weight}</p>
                </div>
              </div>

              {/* Adoption Fee */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700 font-medium">Adoption Fee</p>
                    <p className="text-3xl font-bold text-green-800">{petData.adoptionFee}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 bg-[#A0C878] text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300">
                  Adopt {petData.name}
                </button>
                <button className="px-6 py-4 border-2 border-[#A0C878] text-gray-700 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300">
                  Message
                </button>
              </div>
            </div>

            {/* Information Tabs */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-200">
                {[
                  { id: 'details', label: 'Details', icon: '📋' },
                  { id: 'health', label: 'Health', icon: '🏥' },
                  { id: 'personality', label: 'Personality', icon: '🐕' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">About {petData.name}</h3>
                      <p className="text-gray-700 leading-relaxed text-lg">{petData.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Breed:</span>
                          <span className="font-medium text-gray-900">{petData.breed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Color:</span>
                          <span className="font-medium text-gray-900">{petData.color}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Age:</span>
                          <span className="font-medium text-gray-900">{petData.age}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Gender:</span>
                          <span className="font-medium text-gray-900">{petData.gender}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Weight:</span>
                          <span className="font-medium text-gray-900">{petData.weight}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Size:</span>
                          <span className="font-medium text-gray-900">{petData.size}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'health' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900">Health Status</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: 'Vaccinated', status: petData.vaccinated, icon: '💉' },
                        { label: 'Neutered', status: petData.neutered, icon: '✂️' },
                        { label: 'Microchipped', status: petData.microchipped, icon: '🔬' }
                      ].map((item, index) => (
                        <div key={index} className={`p-4 rounded-xl border-2 ${item.status ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                          <div className="text-center">
                            <div className="text-2xl mb-2">{item.icon}</div>
                            <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${item.status ? 'bg-green-500' : 'bg-red-500'}`}>
                              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                {item.status ? (
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                ) : (
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                )}
                              </svg>
                            </div>
                            <p className="text-sm font-medium">{item.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Medical History</h4>
                      <p className="text-gray-700">{petData.medicalHistory}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'personality' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Personality Traits</h3>
                      <div className="flex flex-wrap gap-3">
                        {petData.traits.map((trait, index) => (
                          <span
                            key={index}
                            className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <span>🏠</span>
                        Perfect Home For {petData.name}
                      </h4>
                      <ul className="text-gray-700 space-y-2">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          Active families or individuals
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          Homes with yards or nearby parks
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          Experienced dog owners preferred
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                          Those seeking a loyal companion
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
