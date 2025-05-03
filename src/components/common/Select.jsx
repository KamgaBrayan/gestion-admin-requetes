// components/Select.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Search, X, AlertCircle } from 'lucide-react';

const Select = ({
  // Props pour personnaliser le comportement
  options = [],
  value = null,
  onChange = () => {},
  placeholder = "Sélectionnez une option",
  searchable = false,
  multiple = false,
  disabled = false,
  error = '',
  label = '',
  required = false,
  clearable = false,
  loading = false,
  onCreate = null, // Fonction pour créer une nouvelle option
  className = '',
  size = 'md',
  name = '',
  variant = 'default'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOptions, setSelectedOptions] = useState(multiple ? (value || []) : []);
  const selectRef = useRef(null);
  const inputRef = useRef(null);

  // Tailles prédéfinies
  const sizes = {
    sm: 'py-1 px-2 text-sm',
    md: 'py-2 px-3 text-base',
    lg: 'py-3 px-4 text-lg'
  };

  const sizeClass = sizes[size] || sizes.md;

  // Filtrer les options selon la recherche
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fermer le dropdown au clic à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Gérer la sélection d'une option
  const handleSelect = (option) => {
    if (multiple) {
      const newSelection = selectedOptions.includes(option)
        ? selectedOptions.filter(item => item !== option)
        : [...selectedOptions, option];
      
      setSelectedOptions(newSelection);
      onChange(newSelection);
    } else {
      setSelectedOptions([option]);
      onChange(option);
      setIsOpen(false);
    }
  };

  // Effacer la sélection
  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedOptions([]);
    onChange(multiple ? [] : null);
  };

  // Créer une nouvelle option
  const handleCreate = () => {
    if (onCreate && searchTerm.trim()) {
      const newOption = { 
        value: searchTerm.toLowerCase().replace(/\s+/g, '-'),
        label: searchTerm 
      };
      onCreate(newOption);
      handleSelect(newOption);
      setSearchTerm('');
    }
  };

  // Afficher la valeur sélectionnée
  const getDisplayValue = () => {
    if (multiple) {
      if (selectedOptions.length === 0) return placeholder;
      if (selectedOptions.length === 1) return selectedOptions[0].label;
      return `${selectedOptions.length} sélectionné(s)`;
    }
    
    const option = options.find(opt => opt.value === value);
    return option ? option.label : placeholder;
  };

  // Vérifier si une option est sélectionnée
  const isSelected = (option) => {
    if (multiple) return selectedOptions.includes(option);
    return value === option.value;
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {/* Label */}
      {label && (
        <label 
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor={name}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Trigger */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          relative cursor-pointer rounded-lg border transition-all duration-200
          ${disabled 
            ? 'bg-gray-50 cursor-not-allowed' 
            : isOpen
              ? 'border-primary shadow-sm' 
              : 'border-gray-300 hover:border-primary'
          }
          ${error ? 'border-red-500' : ''}
          ${sizeClass}
        `}
        style={{ 
          borderColor: !error && isOpen ? '#3B82F6' : undefined,
          boxShadow: isOpen ? '0 0 0 2px rgba(59, 130, 246, 0.1)' : undefined
        }}
      >
        <div className="flex items-center justify-between">
          <span className={`truncate ${selectedOptions.length > 0 ? 'text-gray-900' : 'text-gray-500'}`}>
            {getDisplayValue()}
          </span>
          
          <div className="flex items-center">
            {clearable && (value || selectedOptions.length > 0) && (
              <button
                onClick={handleClear}
                className="mr-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <ChevronDown 
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg py-1"
          style={{ 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderColor: '#E5E7EB'
          }}
        >
          {/* Barre de recherche */}
          {searchable && (
            <div className="relative px-2 py-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                style={{ borderColor: '#D1D5DB' }}
                autoFocus
              />
            </div>
          )}

          {/* Liste d'options */}
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={`
                    cursor-pointer px-3 py-2 flex items-center justify-between
                    ${isSelected(option) 
                      ? 'bg-primary/10' 
                      : 'hover:bg-gray-50'
                    }
                  `}
                  style={{ backgroundColor: isSelected(option) ? '#3B82F610' : undefined }}
                >
                  <span className={`
                    ${isSelected(option) ? 'text-primary font-medium' : 'text-gray-900'}
                  `}
                    style={{ color: isSelected(option) ? '#3B82F6' : undefined }}
                  >
                    {option.label}
                  </span>
                  {isSelected(option) && (
                    <Check className="w-4 h-4" style={{ color: '#3B82F6' }} />
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                {searchTerm && onCreate ? (
                  <button
                    onClick={handleCreate}
                    className="w-full text-left px-2 py-1 rounded hover:bg-gray-50"
                  >
                    Créer "{searchTerm}"
                  </button>
                ) : searchTerm ? (
                  `Aucun résultat pour "${searchTerm}"`
                ) : (
                  'Aucune option disponible'
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-1 flex items-center text-sm text-red-500">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </div>
      )}
    </div>
  );
};

// Variant pour Select Group
const SelectGroup = ({
  options = [],
  value = {},
  onChange = () => {},
  columns = 2,
  label = '',
  className = ''
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div 
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {options.map((option, index) => (
          <div key={option.name}>
            <Select
              options={option.options}
              value={value[option.name]}
              onChange={(selected) => {
                const newValue = { ...value, [option.name]: selected };
                onChange(newValue);
              }}
              placeholder={option.placeholder}
              label={option.label}
              searchable={option.searchable}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

Select.Group = SelectGroup;

export default Select;


/*

Comment utiliser ce composant

########## Utilisation basique : ##########

const DepartmentSelect = () => {
  const [department, setDepartment] = useState(null);
  
  const departments = [
    { value: 'cs', label: 'Informatique' },
    { value: 'math', label: 'Mathématiques' },
    { value: 'physics', label: 'Physique' },
    { value: 'biology', label: 'Biologie' }
  ];
  
  return (
    <Select
      options={departments}
      value={department}
      onChange={setDepartment}
      placeholder="Sélectionnez un département"
      label="Département"
      searchable
    />
  );
};

########## Select multiple avec recherche : ##########

const TagSelect = () => {
  const [tags, setTags] = useState([]);
  
  const tagOptions = [
    { value: 'urgent', label: 'Urgent' },
    { value: 'important', label: 'Important' },
    { value: 'review', label: 'À réviser' },
    { value: 'draft', label: 'Brouillon' }
  ];
  
  return (
    <Select
      options={tagOptions}
      value={tags}
      onChange={setTags}
      multiple
      searchable
      clearable
      placeholder="Ajouter des tags..."
      label="Tags"
    />
  );
};

######### Select avec création d'options : #########

const RequestTypeSelect = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [requestTypes, setRequestTypes] = useState([
    { value: 'purchase', label: 'Achat' },
    { value: 'travel', label: 'Mission' },
    { value: 'training', label: 'Formation' }
  ]);
  
  const handleCreateType = (newOption) => {
    setRequestTypes(prev => [...prev, newOption]);
    setSelectedType(newOption);
  };
  
  return (
    <Select
      options={requestTypes}
      value={selectedType}
      onChange={setSelectedType}
      searchable
      onCreate={handleCreateType}
      placeholder="Type de requête"
      label="Type"
    />
  );
};

########## Groupe de selects : ##########

const AdministrativeForm = () => {
  const [formValues, setFormValues] = useState({});
  
  const selectOptions = [
    {
      name: 'department',
      label: 'Département',
      placeholder: 'Choisir un département',
      searchable: true,
      options: [
        { value: 'cs', label: 'Informatique' },
        { value: 'math', label: 'Mathématiques' }
      ]
    },
    {
      name: 'year',
      label: 'Année',
      placeholder: 'Choisir une année',
      options: [
        { value: '2024', label: '2024' },
        { value: '2025', label: '2025' }
      ]
    }
  ];
  
  return (
    <Select.Group
      options={selectOptions}
      value={formValues}
      onChange={setFormValues}
      columns={2}
      label="Information Académique"
    />
  );
};

######## Gestion des états d'erreur : ########

const RequiredSelect = () => {
  const [value, setValue] = useState(null);
  const [error, setError] = useState('');
  
  const validate = () => {
    if (!value) {
      setError('Ce champ est requis');
      return false;
    }
    setError('');
    return true;
  };
  
  return (
    <Select
      options={options}
      value={value}
      onChange={(val) => {
        setValue(val);
        setError('');
      }}
      error={error}
      required
      label="Sélection obligatoire"
    />
  );
};

######### Préchargement avec Firebase : #########

const FirebaseSelect = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  
  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await db.collection('users').get();
      const usersData = usersSnapshot.docs.map(doc => ({
        value: doc.id,
        label: doc.data().name
      }));
      setUsers(usersData);
      setLoading(false);
    };
    
    fetchUsers();
  }, []);
  
  return (
    <Select
      options={users}
      value={selectedUser}
      onChange={setSelectedUser}
      loading={loading}
      searchable
      placeholder={loading ? "Chargement..." : "Sélectionner un utilisateur"}
      label="Utilisateur"
    />
  );
};

*/