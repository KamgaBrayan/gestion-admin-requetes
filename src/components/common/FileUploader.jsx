// components/FileUploader.jsx
'use client';

import { useState, useRef } from 'react';
import { Upload, X, File, Image, FileText, Paperclip } from 'lucide-react';

const FileUploader = ({
  // Props pour personnaliser le comportement
  multiple = false,
  acceptedTypes = '',
  maxSize = 5 * 1024 * 1024, // 5MB par défaut
  maxFiles = 5,
  onFileSelect = () => {},
  onFileRemove = () => {},
  existingFiles = [],
  disabled = false,
  label = "Glisser-déposer vos fichiers ici",
  subLabel = "ou cliquer pour parcourir",
  className = ""
}) => {
  const [files, setFiles] = useState(existingFiles);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Fonction pour définir l'icône selon le type de fichier
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (fileType.includes('pdf')) return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  // Validation de fichier
  const validateFile = (file) => {
    if (maxSize && file.size > maxSize) {
      return `Le fichier ${file.name} dépasse la taille maximale de ${Math.round(maxSize / 1024 / 1024)}MB`;
    }
    if (acceptedTypes && !acceptedTypes.split(',').some(type => file.type.includes(type))) {
      return `Le type de fichier ${file.type} n'est pas accepté`;
    }
    return null;
  };

  // Gestion des fichiers
  const handleFiles = (newFiles) => {
    const fileArray = Array.from(newFiles);
    let validFiles = [];
    let errorMessages = [];

    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errorMessages.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (errorMessages.length > 0) {
      setError(errorMessages[0]);
      return;
    }

    const totalFiles = files.length + validFiles.length;
    if (totalFiles > maxFiles) {
      setError(`Vous ne pouvez télécharger que ${maxFiles} fichiers maximum`);
      return;
    }

    const updatedFiles = [...files, ...validFiles];
    setFiles(updatedFiles);
    onFileSelect(updatedFiles);
    setError('');
  };

  // Gestion du drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;
    
    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  // Suppression de fichier
  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFileRemove(index);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Zone de dépôt */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'}
        `}
        style={{ borderColor: isDragging ? '#3B82F6' : undefined }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center justify-center">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: '#3B82F6', color: 'white' }}
          >
            <Upload className="w-6 h-6" />
          </div>
          
          <p className="text-lg font-medium text-gray-700 mb-1">
            {label}
          </p>
          <p className="text-sm text-gray-500">
            {subLabel}
          </p>
          
          {acceptedTypes && (
            <p className="text-xs text-gray-400 mt-2">
              Types acceptés: {acceptedTypes}
            </p>
          )}
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mt-2 p-2 text-sm text-red-600 bg-red-50 rounded">
          {error}
        </div>
      )}

      {/* Liste des fichiers */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="text-gray-500">
                  {getFileIcon(file.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;

/*

#########  RECUPERER LES FICHERS SELECTIONNEES  ##########
const ParentComponent = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileSelection = (files) => {
    // Les fichiers sont automatiquement passés ici
    setUploadedFiles(files);
    
    // Vous pouvez les envoyer à votre backend
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    // uploadToBackend(formData);
  };

  return (
    <FileUploader
      onFileSelect={handleFileSelection}
      multiple={true}
      acceptedTypes="image/*,application/pdf"
      maxSize={5 * 1024 * 1024} // 5MB
    />
  );
};



############# ENVOYER DES FICHIERS EXISTANTS ##############
const EditComponent = () => {
  const [existingFiles, setExistingFiles] = useState([]);
  
  // Charger des fichiers existants depuis le backend
  useEffect(() => {
    // Supposons que vous récupériez des fichiers du backend
    const loadedFiles = // fetch from backend
    setExistingFiles(loadedFiles);
  }, []);

  return (
    <FileUploader
      existingFiles={existingFiles}
      onFileSelect={(files) => console.log('New files:', files)}
      onFileRemove={(index) => console.log('Removed file at index:', index)}
    />
  );
};


############## Exemples de personnalisation :  #################
// Upload d'images uniquement
<FileUploader
  acceptedTypes="image/*"
  maxSize={2 * 1024 * 1024} // 2MB
  label="Téléchargez vos images"
/>

// Upload multiple avec limitation
<FileUploader
  multiple={true}
  maxFiles={3}
  acceptedTypes="application/pdf,image/*"
  label="Documents administratifs"
/>

// Upload désactivé
<FileUploader
  disabled={true}
  label="Upload temporairement indisponible"
/>

*/