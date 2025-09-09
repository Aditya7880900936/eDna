"use client"

import React, { useState, useEffect } from 'react';
import { Upload, FileText, Database, Search, Download, Filter, AlertCircle, CheckCircle, Clock, Microscope } from 'lucide-react';

// Type definitions
type SpeciesData = {
  name: string;
  confidence: number;
  depth: number;
  location: string;
  taxa: string;
};

type UnknownTaxa = {
  id: string;
  sequence: string;
  similarity: number;
  closestMatch: string;
};

type ProcessStage = {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type Tab = {
  id: string;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};


const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('upload');
  const [processingStage, setProcessingStage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [confidenceFilter, setConfidenceFilter] = useState<number>(0);

  // Mock data for visualization
  const speciesData: SpeciesData[] = [
    { name: 'Bathymodiolus thermophilus', confidence: 0.95, depth: 2200, location: 'Hydrothermal Vent Site A', taxa: 'Mollusca' },
    { name: 'Calyptogena magnifica', confidence: 0.89, depth: 2100, location: 'Cold Seep Site B', taxa: 'Mollusca' },
    { name: 'Riftia pachyptila', confidence: 0.92, depth: 2300, location: 'Hydrothermal Vent Site C', taxa: 'Annelida' },
    { name: 'Alvinella pompejana', confidence: 0.87, depth: 2400, location: 'Hydrothermal Vent Site A', taxa: 'Annelida' },
    { name: 'Pyrococcus furiosus', confidence: 0.94, depth: 2150, location: 'Deep Sea Plain', taxa: 'Archaea' }
  ];

  const unknownTaxa: UnknownTaxa[] = [
    { id: 'UNK_001', sequence: 'ATCGATCGATCG...', similarity: 0.76, closestMatch: 'Bathymodiolus sp.' },
    { id: 'UNK_002', sequence: 'GCTAGCTAGCTA...', similarity: 0.68, closestMatch: 'Deep-sea bacteria sp.' },
    { id: 'UNK_003', sequence: 'TTACGGTACCAA...', similarity: 0.72, closestMatch: 'Marine archaeon' }
  ];

  const processStages: ProcessStage[] = [
    { name: 'Data Preprocessing', icon: FileText },
    { name: 'Feature Extraction', icon: Database },
    { name: 'Autoencoder Segregation', icon: Filter },
    { name: 'CNN Prediction', icon: Microscope },
    { name: 'Results Ready', icon: CheckCircle }
  ];

  const tabs: Tab[] = [
    { id: 'upload', name: 'Upload & Process', icon: Upload },
    { id: 'processing', name: 'AI Pipeline', icon: Clock },
    { id: 'results', name: 'Species Results', icon: Database },
    { id: 'unknown', name: 'Unknown Taxa', icon: AlertCircle },
  ];

  useEffect(() => {
    if (activeTab === 'processing' && processingStage < 4) {
      const timer = setTimeout(() => {
        setProcessingStage(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [activeTab, processingStage]);

  const filteredSpecies = speciesData.filter(species => 
    species.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    species.confidence >= confidenceFilter
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Microscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">eDNA Biodiversity Classifier</h1>
                <p className="text-sm text-gray-600">Deep-Sea Marine Species Identification System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 px-3 py-1 rounded-full">
                <span className="text-green-800 text-sm font-medium">CMLRE Portal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-xl font-semibold mb-6">Upload eDNA Sequences</h2>
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-12 text-center">
                <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">Drop your CSV file here</p>
                <p className="text-sm text-gray-500 mb-4">Supports nucleotide sequence files up to 500MB</p>
                <button 
                  onClick={() => setActiveTab('processing')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Select Files
                </button>
              </div>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Format Requirements</h3>
                  <p className="text-sm text-gray-600">CSV with sequence ID and nucleotide data</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <Database className="h-6 w-6 text-green-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Metadata Support</h3>
                  <p className="text-sm text-gray-600">Include depth, location, and sample info</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <Microscope className="h-6 w-6 text-purple-600 mb-2" />
                  <h3 className="font-medium text-gray-900">AI Classification</h3>
                  <p className="text-sm text-gray-600">Autoencoder + CNN species prediction</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Processing Tab */}
        {activeTab === 'processing' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-xl font-semibold mb-6">AI Pipeline Status</h2>
              <div className="space-y-4">
                {processStages.map((stage, index) => {
                  const Icon = stage.icon;
                  const isActive = index === processingStage;
                  const isComplete = index < processingStage;
                  
                  return (
                    <div key={index} className={`flex items-center space-x-4 p-4 rounded-lg ${
                      isActive ? 'bg-blue-50 border border-blue-200' : 
                      isComplete ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                    }`}>
                      <div className={`p-2 rounded-full ${
                        isActive ? 'bg-blue-600' : 
                        isComplete ? 'bg-green-600' : 'bg-gray-400'
                      }`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{stage.name}</p>
                        {isActive && <p className="text-sm text-blue-600">Processing...</p>}
                        {isComplete && <p className="text-sm text-green-600">Complete</p>}
                      </div>
                      {isActive && (
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {processingStage >= 4 && (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Processing Complete!</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Classified 400 sequences • Found 135 known species • 25 unknown taxa
                  </p>
                  <button 
                    onClick={() => setActiveTab('results')}
                    className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    View Results
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search species..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="sm:w-64">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Confidence: {confidenceFilter.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={confidenceFilter}
                    onChange={(e) => setConfidenceFilter(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Species Results Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Classified Species ({filteredSpecies.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Species</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taxa</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Depth</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSpecies.map((species, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{species.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {species.taxa}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{width: `${species.confidence * 100}%`}}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{(species.confidence * 100).toFixed(1)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{species.depth}m</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{species.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Unknown Taxa Tab */}
        {activeTab === 'unknown' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Unknown Taxa ({unknownTaxa.length})</h3>
                <button className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Export for Manual Review</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {unknownTaxa.map((taxa, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{taxa.id}</h4>
                        <p className="text-sm text-gray-500 font-mono">{taxa.sequence}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Unclassified
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="text-gray-600">Closest match: </span>
                        <span className="font-medium">{taxa.closestMatch}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600">Similarity: </span>
                        <span className="font-medium ml-1">{(taxa.similarity * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;