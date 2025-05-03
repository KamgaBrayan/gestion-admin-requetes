// components/Pagination.jsx
'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const Pagination = ({
  // Props pour personnaliser le comportement
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  totalItems = 0,
  itemsPerPage = 10,
  showItemsCount = true,
  showFirstLast = true,
  maxPagesToShow = 5,
  className = '',
  customLabels = {}
}) => {
  // Labels par défaut
  const defaultLabels = {
    first: 'Premier',
    previous: 'Précédent',
    next: 'Suivant',
    last: 'Dernier',
    showing: 'Affichage de',
    to: 'à',
    of: 'sur',
    items: 'éléments'
  };

  const labels = { ...defaultLabels, ...customLabels };

  // Calculer les pages à afficher
  const getVisiblePages = () => {
    const delta = Math.floor(maxPagesToShow / 2);
    let start = Math.max(currentPage - delta, 1);
    let end = Math.min(start + maxPagesToShow - 1, totalPages);

    // Ajuster si on est en fin de liste
    if (end - start + 1 < maxPagesToShow) {
      start = Math.max(end - maxPagesToShow + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // Calculer les infos de l'affichage actuel
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageButton = (page, isActive = false) => {
    return (
      <button
        key={page}
        onClick={() => handlePageChange(page)}
        className={`
          relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
          transition-all duration-150 ease-in-out
          ${isActive 
            ? 'z-10 text-white shadow' 
            : 'text-gray-700 hover:bg-gray-50'
          }
        `}
        style={{
          backgroundColor: isActive ? '#3B82F6' : undefined,
          color: isActive ? 'white' : undefined
        }}
      >
        {page}
      </button>
    );
  };

  const renderEllipsis = (key) => {
    return (
      <span
        key={key}
        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700"
      >
        <MoreHorizontal className="w-5 h-5" />
      </span>
    );
  };

  const renderNavigationButton = (icon, onClick, disabled, label) => {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
          transition-all duration-150 ease-in-out
          ${disabled 
            ? 'text-gray-300 cursor-not-allowed' 
            : 'text-gray-700 hover:text-white hover:bg-secondary'
          }
        `}
        style={{
          '&:hover': !disabled ? { backgroundColor: '#10B981', color: 'white' } : {}
        }}
        title={label}
      >
        {icon}
        <span className="ml-2 hidden sm:inline">{label}</span>
      </button>
    );
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();
  const showLeftEllipsis = visiblePages[0] > 2;
  const showRightEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between py-3 px-4 sm:px-6 ${className}`}>
      {/* Compteur d'items */}
      {showItemsCount && totalItems > 0 && (
        <div className="mb-3 sm:mb-0">
          <p className="text-sm text-gray-700">
            {labels.showing}{' '}
            <span className="font-medium" style={{ color: '#3B82F6' }}>{startItem}</span>
            {' '}{labels.to}{' '}
            <span className="font-medium" style={{ color: '#3B82F6' }}>{endItem}</span>
            {' '}{labels.of}{' '}
            <span className="font-medium" style={{ color: '#3B82F6' }}>{totalItems}</span>
            {' '}{labels.items}
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="relative z-0 inline-flex shadow-sm rounded-md" aria-label="Pagination">
        {/* Bouton Premier (optionnel) */}
        {showFirstLast && currentPage > 1 && (
          <>
            {renderNavigationButton(<ChevronLeft className="w-4 h-4" />, () => handlePageChange(1), false, labels.first)}
            <div className="w-px h-8 bg-gray-200" />
          </>
        )}

        {/* Bouton Précédent */}
        {renderNavigationButton(
          <ChevronLeft className="w-4 h-4" />, 
          () => handlePageChange(currentPage - 1), 
          currentPage === 1, 
          labels.previous
        )}

        <div className="w-px h-8 bg-gray-200" />

        {/* Page 1 */}
        {visiblePages[0] > 1 && renderPageButton(1, currentPage === 1)}

        {/* Ellipsis gauche */}
        {showLeftEllipsis && renderEllipsis('left-ellipsis')}

        {/* Pages visibles */}
        {visiblePages.map(page => renderPageButton(page, page === currentPage))}

        {/* Ellipsis droite */}
        {showRightEllipsis && renderEllipsis('right-ellipsis')}

        {/* Dernière page */}
        {visiblePages[visiblePages.length - 1] < totalPages && 
          renderPageButton(totalPages, currentPage === totalPages)}

        <div className="w-px h-8 bg-gray-200" />

        {/* Bouton Suivant */}
        {renderNavigationButton(
          <ChevronRight className="w-4 h-4" />, 
          () => handlePageChange(currentPage + 1), 
          currentPage === totalPages, 
          labels.next
        )}

        {/* Bouton Dernier (optionnel) */}
        {showFirstLast && currentPage < totalPages && (
          <>
            <div className="w-px h-8 bg-gray-200" />
            {renderNavigationButton(<ChevronRight className="w-4 h-4" />, () => handlePageChange(totalPages), false, labels.last)}
          </>
        )}
      </nav>
    </div>
  );
};

// Component avec Input pour page
const PaginationWithInput = ({
  currentPage,
  totalPages,
  onPageChange,
  ...props
}) => {
  const [inputPage, setInputPage] = useState(currentPage);

  const handleSubmit = (e) => {
    e.preventDefault();
    const page = parseInt(inputPage);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="space-y-4">
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        {...props}
      />
      
      <form onSubmit={handleSubmit} className="flex items-center justify-center gap-2">
        <span className="text-sm text-gray-700">Aller à la page:</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          style={{ borderColor: '#3B82F6' }}
        />
        <button
          type="submit"
          className="px-3 py-1 text-sm text-white rounded-md"
          style={{ backgroundColor: '#3B82F6' }}
        >
          Ok
        </button>
      </form>
    </div>
  );
};

Pagination.WithInput = PaginationWithInput;

export default Pagination;

/*

Comment utiliser ce composant

########## Utilisation basique : ##########

const PageWithPagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = 150;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Fetch data for the new page
    fetchData(page, itemsPerPage);
  };

  return (
    <div>
      {// Votre contenu paginé }
      <TableComponent currentPage={currentPage} />
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

########## Avec fetch de données : ##########

const RequestsList = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchRequests = async () => {
      const response = await getRequests(currentPage, itemsPerPage);
      setData(response.data);
      setTotalItems(response.total);
    };
    fetchRequests();
  }, [currentPage]);

  return (
    <div>
      <RequestsTable data={data} />
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalItems / itemsPerPage)}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

########### Pagination avec saut de page ###########

<Pagination.WithInput
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  maxPagesToShow={7}
/>

########### Personnalisation complète ###########

<Pagination
  currentPage={2}
  totalPages={10}
  onPageChange={handlePageChange}
  totalItems={100}
  itemsPerPage={10}
  showItemsCount={true}
  showFirstLast={true}
  maxPagesToShow={5}
  customLabels={{
    first: 'Début',
    previous: 'Prec.',
    next: 'Suiv.',
    last: 'Fin',
    showing: 'Montrer',
    to: '-',
    of: 'de',
    items: 'résultats'
  }}
/>

########### Pagination infinie (avec scroll) : ###########

const InfiniteScroll = () => {
  const [page, setPage] = useState(1);
  const { data, loading, hasMore } = useInfiniteQuery('requests', 
    ({ pageParam = 1 }) => fetchRequests(pageParam),
    {
      getNextPageParam: (lastPage, pages) => 
        lastPage.hasMore ? pages.length + 1 : undefined,
    }
  );

  const loadMore = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div>
      <DataList data={data.pages.flat()} />
      {loading ? (
        <Spinner />
      ) : (
        <Pagination
          currentPage={page}
          totalPages={data.pageParams.length}
          onPageChange={loadMore}
          showItemsCount={false}
          showFirstLast={false}
          maxPagesToShow={1}
        />
      )}
    </div>
  );
};

*/