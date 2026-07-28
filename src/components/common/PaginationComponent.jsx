import React from "react";
import { Pagination as BootstrapPagination } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <BootstrapPagination className="mb-0 gap-1 align-items-center">
        <BootstrapPagination.Prev
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-3"
        >
          <ChevronLeft size={16} />
        </BootstrapPagination.Prev>

        {pages[0] > 1 && (
          <>
            <BootstrapPagination.Item onClick={() => onPageChange(1)}>
              1
            </BootstrapPagination.Item>
            {pages[0] > 2 && <BootstrapPagination.Ellipsis disabled />}
          </>
        )}

        {pages.map((page) => (
          <BootstrapPagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </BootstrapPagination.Item>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <BootstrapPagination.Ellipsis disabled />
            )}
            <BootstrapPagination.Item onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </BootstrapPagination.Item>
          </>
        )}

        <BootstrapPagination.Next
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-3"
        >
          <ChevronRight size={16} />
        </BootstrapPagination.Next>
      </BootstrapPagination>
    </div>
  );
};

export default PaginationComponent;