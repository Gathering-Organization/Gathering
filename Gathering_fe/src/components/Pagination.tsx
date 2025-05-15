interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // totalPages = 120;
  const renderPageButtons = () => {
    const windowSize = 10;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > windowSize) {
      if (currentPage <= Math.floor(windowSize / 2)) {
        startPage = 1;
        endPage = windowSize;
      } else if (currentPage + Math.floor(windowSize / 2) - 1 >= totalPages) {
        startPage = totalPages - windowSize + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - Math.floor(windowSize / 2) + 1;
        endPage = currentPage + Math.floor(windowSize / 2);
      }
    }

    const pages = [];

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className={`px-3 py-1 rounded-lg ${currentPage === 1 ? 'bg-[#3387E5] text-white' : 'bg-gray-200'}`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="start-ellipsis" className="px-2">
            ...
          </span>
        );
      }
    }
    for (let page = startPage; page <= endPage; page++) {
      pages.push(
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-lg ${currentPage === page ? 'bg-[#3387E5] text-white' : 'bg-gray-200'}`}
        >
          {page}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="end-ellipsis" className="px-2">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`px-3 py-1 rounded-lg ${currentPage === totalPages ? 'bg-[#3387E5] text-white' : 'bg-gray-200'}`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1 rounded-lg bg-gray-200 disabled:opacity-50"
      >
        &lt;
      </button>

      {renderPageButtons()}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 rounded-lg bg-gray-200 disabled:opacity-50"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
