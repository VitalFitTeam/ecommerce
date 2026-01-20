import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  const delta = 1;

  const getPageNumbers = () => {
    const range: number[] = [];
    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }
    return range;
  };

  return (
    <Pagination className="mt-6">
      <PaginationContent className="flex-wrap justify-center gap-1 sm:gap-2">
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page > 1) {
                onPageChange(page - 1);
              }
            }}
            className={page <= 1 ? "pointer-events-none opacity-40" : ""}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(1);
            }}
            isActive={page === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>

        {page - delta > 2 && (
          <PaginationItem className="hidden sm:block">
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {getPageNumbers().map((num) => (
          <PaginationItem
            key={num}
            className={Math.abs(page - num) > 0 ? "hidden xs:block" : ""}
          >
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(num);
              }}
              isActive={page === num}
            >
              {num}
            </PaginationLink>
          </PaginationItem>
        ))}

        {page + delta < totalPages - 1 && (
          <PaginationItem className="hidden sm:block">
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(totalPages);
              }}
              isActive={page === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (page < totalPages) {
                onPageChange(page + 1);
              }
            }}
            className={
              page >= totalPages ? "pointer-events-none opacity-40" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
