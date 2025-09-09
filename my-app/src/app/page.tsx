"use client";

import React, { useState, useEffect } from "react";
import {
  Upload,
  FileText,
  Database,
  Search,
  Download,
  Filter,
  AlertCircle,
  CheckCircle,
  Clock,
  Microscope,
  X,
  ChevronRight,
  BarChart3,
  MapPin,
  Layers,
  User,
  HelpCircle,
  Bell,
  Plus,
} from "lucide-react";

// Type definitions
type SpeciesData = {
  id: string;
  name: string;
  confidence: number;
  depth: number;
  location: string;
  taxa: string;
  abundance: number;
  status: "endangered" | "common" | "rare";
};

type UnknownTaxa = {
  id: string;
  sequence: string;
  similarity: number;
  closestMatch: string;
  length: number;
  gcContent: number;
};

type ProcessStage = {
  name: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  progress: number;
};

type Tab = {
  id: string;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  notification?: number;
};

type FileInfo = {
  name: string;
  size: string;
  sequences: number;
  date: string;
};

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [processingStage, setProcessingStage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [confidenceFilter, setConfidenceFilter] = useState<number>(0);
  const [taxaFilter, setTaxaFilter] = useState<string>("all");
  // const [expandedTaxa, setExpandedTaxa] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileInfo[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  // Mock data for visualization
  const speciesData: SpeciesData[] = [
    {
      id: "1",
      name: "Bathymodiolus thermophilus",
      confidence: 0.95,
      depth: 2200,
      location: "Hydrothermal Vent Site A",
      taxa: "Mollusca",
      abundance: 125,
      status: "common",
    },
    {
      id: "2",
      name: "Calyptogena magnifica",
      confidence: 0.89,
      depth: 2100,
      location: "Cold Seep Site B",
      taxa: "Mollusca",
      abundance: 87,
      status: "rare",
    },
    {
      id: "3",
      name: "Riftia pachyptila",
      confidence: 0.92,
      depth: 2300,
      location: "Hydrothermal Vent Site C",
      taxa: "Annelida",
      abundance: 210,
      status: "common",
    },
    {
      id: "4",
      name: "Alvinella pompejana",
      confidence: 0.87,
      depth: 2400,
      location: "Hydrothermal Vent Site A",
      taxa: "Annelida",
      abundance: 76,
      status: "endangered",
    },
    {
      id: "5",
      name: "Pyrococcus furiosus",
      confidence: 0.94,
      depth: 2150,
      location: "Deep Sea Plain",
      taxa: "Archaea",
      abundance: 342,
      status: "common",
    },
    {
      id: "6",
      name: "Desulfovibrio profundus",
      confidence: 0.91,
      depth: 2250,
      location: "Sediment Core D",
      taxa: "Bacteria",
      abundance: 198,
      status: "common",
    },
    {
      id: "7",
      name: "Shewanella piezotolerans",
      confidence: 0.83,
      depth: 2350,
      location: "Hydrothermal Vent Site C",
      taxa: "Bacteria",
      abundance: 112,
      status: "rare",
    },
  ];

  const unknownTaxa: UnknownTaxa[] = [
    {
      id: "UNK_001",
      sequence: "ATCGATCGATCGATCGATCGATCG...",
      similarity: 0.76,
      closestMatch: "Bathymodiolus sp.",
      length: 2456,
      gcContent: 0.42,
    },
    {
      id: "UNK_002",
      sequence: "GCTAGCTAGCTAGCTAGCTAGCTA...",
      similarity: 0.68,
      closestMatch: "Deep-sea bacteria sp.",
      length: 1872,
      gcContent: 0.38,
    },
    {
      id: "UNK_003",
      sequence: "TTACGGTACCAATTACGGTACCAA...",
      similarity: 0.72,
      closestMatch: "Marine archaeon",
      length: 3124,
      gcContent: 0.56,
    },
  ];

  const processStages: ProcessStage[] = [
    {
      name: "Data Upload",
      description: "Validating and preparing sequence data",
      icon: Upload,
      progress: 100,
    },
    {
      name: "Quality Control",
      description: "Filtering low-quality sequences",
      icon: Filter,
      progress: 100,
    },
    {
      name: "Feature Extraction",
      description: "Identifying genetic markers",
      icon: Database,
      progress: 100,
    },
    {
      name: "Autoencoder Analysis",
      description: "Pattern recognition and clustering",
      icon: Layers,
      progress: 80,
    },
    {
      name: "CNN Classification",
      description: "Species prediction and confidence scoring",
      icon: Microscope,
      progress: 60,
    },
    {
      name: "Results Compilation",
      description: "Generating final report",
      icon: FileText,
      progress: 30,
    },
  ];

  const tabs: Tab[] = [
    { id: "upload", name: "Upload", icon: Upload },
    { id: "processing", name: "Processing", icon: Clock, notification: 1 },
    { id: "results", name: "Results", icon: Database },
    { id: "unknown", name: "Unknown Taxa", icon: AlertCircle, notification: 3 },
    { id: "analytics", name: "Analytics", icon: BarChart3 },
  ];

  const taxaTypes = ["all", "Mollusca", "Annelida", "Archaea", "Bacteria"];
  // const statusTypes = ["all", "common", "rare", "endangered"];

  // // Group species by taxa for better organization
  // const speciesByTaxa = speciesData.reduce((acc, species) => {
  //   if (!acc[species.taxa]) {
  //     acc[species.taxa] = [];
  //   }
  //   acc[species.taxa].push(species);
  //   return acc;
  // }, {} as Record<string, SpeciesData[]>);

  useEffect(() => {
    if (activeTab === "processing" && processingStage < 5) {
      const timer = setTimeout(() => {
        setProcessingStage((prev) => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activeTab, processingStage]);

  const filteredSpecies = speciesData.filter(
    (species) =>
      species.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      species.confidence >= confidenceFilter &&
      (taxaFilter === "all" || species.taxa === taxaFilter)
  );

  // Handle drag and drop events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    // Mock file processing
    if (selectedFiles.length === 0) {
      setSelectedFiles([
        {
          name: "deep_sea_samples.csv",
          size: "124MB",
          sequences: 450,
          date: new Date().toLocaleDateString(),
        },
      ]);
      setActiveTab("processing");
    }
  };

  const handleFileUpload = () => {
    // Mock file processing
    if (selectedFiles.length === 0) {
      setSelectedFiles([
        {
          name: "deep_sea_samples.csv",
          size: "124MB",
          sequences: 450,
          date: new Date().toLocaleDateString(),
        },
      ]);
      setActiveTab("processing");
    }
  };

  // const toggleTaxaExpansion = (taxa: string) => {
  //   if (expandedTaxa.includes(taxa)) {
  //     setExpandedTaxa(expandedTaxa.filter((t) => t !== taxa));
  //   } else {
  //     setExpandedTaxa([...expandedTaxa, taxa]);
  //   }
  // };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "endangered":
        return "bg-red-100 text-red-800";
      case "rare":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "endangered":
        return "🔴";
      case "rare":
        return "🟣";
      default:
        return "🟢";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200/70 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Microscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  eDNA Biodiversity Classifier
                </h1>
                <p className="text-xs text-gray-500">
                  Deep-Sea Marine Species Identification
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <HelpCircle className="h-5 w-5 text-gray-500" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="h-5 w-5 text-gray-500" />
              </button>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3 px-4 border-b-2 font-medium text-sm rounded-t-lg transition-all ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600 bg-white shadow-sm"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
                {tab.notification && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {tab.notification}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Upload Tab */}
        {activeTab === "upload" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Upload eDNA Sequences
                </h2>
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="text-blue-600 text-sm font-medium flex items-center"
                >
                  <HelpCircle className="h-4 w-4 mr-1" />
                  {showHelp ? "Hide Guide" : "Show Guide"}
                </button>
              </div>

              {showHelp && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-blue-900 mb-2">
                    File Requirements
                  </h3>
                  <ul className="text-sm text-blue-800 list-disc pl-5 space-y-1">
                    <li>
                      CSV format with sequence ID and nucleotide data columns
                    </li>
                    <li>Maximum file size: 500MB</li>
                    <li>Optional metadata: depth, location, collection date</li>
                    <li>
                      Accepted formats: FASTA, FASTQ (will be converted
                      automatically)
                    </li>
                  </ul>
                </div>
              )}

              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  isDragging
                    ? "border-blue-400 bg-blue-50/50"
                    : "border-blue-300 bg-blue-50/30"
                }`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drag & drop your file here
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Supports CSV, FASTA, and FASTQ files up to 500MB
                </p>

                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Select Files
                  </span>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>

                <p className="text-xs text-gray-400 mt-4">
                  By uploading, you agree to our data processing terms
                </p>
              </div>

              {selectedFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-3">
                    Selected Files
                  </h3>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 rounded-lg p-3"
                      >
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {file.size} • {file.sequences} sequences
                            </p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setActiveTab("processing")}
                      className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                    >
                      Start Processing
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200/50">
                  <div className="bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Format Requirements
                  </h3>
                  <p className="text-sm text-gray-600">
                    CSV with sequence ID and nucleotide data columns
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border border-green-200/50">
                  <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                    <Database className="h-5 w-5 text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    Metadata Support
                  </h3>
                  <p className="text-sm text-gray-600">
                    Include depth, location, and collection information
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg border border-purple-200/50">
                  <div className="bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                    <Microscope className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    AI Classification
                  </h3>
                  <p className="text-sm text-gray-600">
                    Advanced autoencoder + CNN species prediction
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 p-6">
              <h3 className="font-medium text-gray-900 mb-4">Recent Uploads</h3>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">No recent uploads</p>
              </div>
            </div>
          </div>
        )}

        {/* Processing Tab */}
        {activeTab === "processing" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Processing Pipeline
                </h2>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Elapsed: 12m 34s</span>
                </div>
              </div>

              <div className="mb-8 bg-gray-100 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (processingStage / (processStages.length - 1)) * 100
                    }%`,
                  }}
                ></div>
              </div>

              <div className="space-y-3">
                {processStages.map((stage, index) => {
                  const Icon = stage.icon;
                  const isActive = index === processingStage;
                  const isComplete = index < processingStage;

                  return (
                    <div
                      key={index}
                      className={`flex items-start p-4 rounded-xl border transition-all ${
                        isActive
                          ? "bg-blue-50/50 border-blue-200 shadow-sm"
                          : isComplete
                          ? "bg-green-50/50 border-green-200"
                          : "bg-gray-50/50 border-gray-200"
                      }`}
                    >
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                          isActive
                            ? "bg-blue-100 text-blue-600"
                            : isComplete
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3
                              className={`font-medium ${
                                isActive
                                  ? "text-blue-900"
                                  : isComplete
                                  ? "text-green-900"
                                  : "text-gray-700"
                              }`}
                            >
                              {stage.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {stage.description}
                            </p>
                          </div>

                          {isComplete ? (
                            <div className="flex items-center text-green-600 text-sm">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Complete
                            </div>
                          ) : isActive ? (
                            <div className="flex items-center text-blue-600 text-sm">
                              <div className="animate-pulse bg-blue-500 h-2 w-2 rounded-full mr-2"></div>
                              In Progress
                            </div>
                          ) : (
                            <div className="text-gray-400 text-sm">Pending</div>
                          )}
                        </div>

                        {isActive && (
                          <div className="mt-3 bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${stage.progress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {processingStage >= 5 && (
                <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-full mr-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-green-900">
                        Processing Complete!
                      </h3>
                      <p className="text-sm text-green-700">
                        Successfully classified 450 sequences • Identified 135
                        known species • Detected 25 unknown taxa
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-3">
                    <button
                      onClick={() => setActiveTab("results")}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      View Species Results
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>

                    <button
                      onClick={() => setActiveTab("unknown")}
                      className="bg-white text-green-700 border border-green-300 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      Review Unknown Taxa
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 p-5">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  File Processed
                </h3>
                <p className="text-2xl font-semibold text-gray-900">
                  deep_sea_samples.csv
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 p-5">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Sequences Analyzed
                </h3>
                <p className="text-2xl font-semibold text-gray-900">450</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 p-5">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Estimated Completion
                </h3>
                <p className="text-2xl font-semibold text-gray-900">2m 15s</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === "results" && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 p-5">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Total Species
                </h3>
                <p className="text-2xl font-semibold text-gray-900">135</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 p-5">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Average Confidence
                </h3>
                <p className="text-2xl font-semibold text-gray-900">89.2%</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 p-5">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Taxonomic Groups
                </h3>
                <p className="text-2xl font-semibold text-gray-900">12</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 p-5">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Rare Species
                </h3>
                <p className="text-2xl font-semibold text-gray-900">8</p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 p-5">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search species, location, or taxa..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <select
                    value={taxaFilter}
                    onChange={(e) => setTaxaFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Taxa</option>
                    {taxaTypes
                      .filter((t) => t !== "all")
                      .map((taxa) => (
                        <option key={taxa} value={taxa}>
                          {taxa}
                        </option>
                      ))}
                  </select>

                  <div className="bg-gray-100 rounded-lg px-3 py-2.5 flex items-center">
                    <label className="text-sm text-gray-700 mr-2">
                      Confidence:
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={confidenceFilter}
                      onChange={(e) =>
                        setConfidenceFilter(parseFloat(e.target.value))
                      }
                      className="w-20"
                    />
                    <span className="text-sm font-medium text-gray-900 ml-2 w-10">
                      {Math.round(confidenceFilter * 100)}%
                    </span>
                  </div>

                  <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Species Results */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Classified Species
                </h3>
                <span className="text-sm text-gray-500">
                  {filteredSpecies.length} results
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Species
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Taxa
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Confidence
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Abundance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Depth
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSpecies.map((species) => (
                      <tr key={species.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {species.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {species.taxa}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              species.status
                            )}`}
                          >
                            {getStatusIcon(species.status)} {species.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{
                                  width: `${species.confidence * 100}%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {(species.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {species.abundance}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {species.depth}m
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {species.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-800">
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredSpecies.length === 0 && (
                  <div className="text-center py-12">
                    <Database className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      No species match your search criteria
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Unknown Taxa Tab */}
        {activeTab === "unknown" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Unknown Taxa
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Sequences that couldnot be classified with high confidence
                  </p>
                </div>
                <button className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2.5 rounded-lg hover:bg-orange-700 transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Export for Review</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {unknownTaxa.map((taxa) => (
                  <div
                    key={taxa.id}
                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{taxa.id}</h3>
                        <p className="text-xs text-gray-500 font-mono truncate max-w-[180px]">
                          {taxa.sequence}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Unclassified
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Similarity:</span>
                        <span className="font-medium">
                          {(taxa.similarity * 100).toFixed(1)}%
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Closest match:</span>
                        <span className="font-medium text-right">
                          {taxa.closestMatch}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Sequence length:</span>
                        <span className="font-medium">{taxa.length} bp</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">GC content:</span>
                        <span className="font-medium">
                          {(taxa.gcContent * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex space-x-2">
                      <button className="flex-1 bg-blue-50 text-blue-700 text-sm py-1.5 rounded-md hover:bg-blue-100 transition-colors">
                        BLAST
                      </button>
                      <button className="flex-1 bg-gray-100 text-gray-700 text-sm py-1.5 rounded-md hover:bg-gray-200 transition-colors">
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-orange-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-orange-800">
                      Next Steps for Unknown Taxa
                    </h3>
                    <p className="text-sm text-orange-700 mt-1">
                      These sequences may represent novel species or variants.
                      Consider submitting to genomic databases for further
                      analysis and comparison with global datasets.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/70 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Analysis Overview
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl p-5 border border-gray-200/50">
                  <h3 className="font-medium text-gray-700 mb-4">
                    Taxonomic Distribution
                  </h3>
                  <div className="h-48 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-400">
                      Taxa distribution chart will appear here
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-50 to-green-50/30 rounded-xl p-5 border border-gray-200/50">
                  <h3 className="font-medium text-gray-700 mb-4">
                    Confidence Distribution
                  </h3>
                  <div className="h-48 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-400">
                      Confidence histogram will appear here
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-gradient-to-br from-slate-50 to-purple-50/30 rounded-xl p-5 border border-gray-200/50">
                <h3 className="font-medium text-gray-700 mb-4">
                  Depth vs. Species Distribution
                </h3>
                <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-400">
                    Depth distribution chart will appear here
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-8 border-t border-gray-200/70">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © 2023 eDNA Biodiversity Classifier • CMLRE Marine Research Portal
          </p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <button className="text-sm text-gray-500 hover:text-gray-700">
              Privacy Policy
            </button>
            <button className="text-sm text-gray-500 hover:text-gray-700">
              Terms of Service
            </button>
            <button className="text-sm text-gray-500 hover:text-gray-700">
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
