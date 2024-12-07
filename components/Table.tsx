import classNames from "classnames";
import React from "react";

export const TableColumn = ({
  children,
  className,
  sorted,
  asc,
  onClick,
  loading,
}: {
  children?: React.ReactNode;
  className?: string;
  sorted?: boolean;
  asc?: boolean;
  onClick?: () => void;
  loading?: boolean;
}) => {
  const sortIndicator = asc ? (
    <i className="fa fa-arrow-up" aria-hidden="true"></i>
  ) : (
    <i className="fa fa-arrow-down" aria-hidden="true"></i>
  );

  return (
    <th
      scope="col"
      className={classNames(
        "text-sm font-medium bg-gray-800 text-white sm:px-6 sm:py-4 px-1 py-2",
        onClick && "hover:cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-center">
        {loading ? (
          <div className="h-4 bg-gray-600 rounded animate-pulse w-20"></div>
        ) : (
          <>
            <div>{children}</div>
            <div className="ml-2">{sorted && sortIndicator}</div>
          </>
        )}
      </div>
    </th>
  );
};

export const TableCell = ({
  isIndex,
  children,
  className,
  colSpan,
  loading,
  width = "w-20",
}: {
  isIndex?: boolean;
  children?: React.ReactNode;
  className?: string;
  colSpan?: number;
  loading?: boolean;
  width?: string;
}) => {
  return (
    <td
      className={classNames(
        "text-sm sm:px-6 sm:py-4 px-1 py-2 whitespace-nowrap",
        isIndex ? "font-medium text-gray-900" : "text-sm font-light",
        className
      )}
      colSpan={colSpan}
    >
      {loading ? (
        <div className={`h-4 bg-gray-200 rounded animate-pulse ${width}`}></div>
      ) : (
        children
      )}
    </td>
  );
};

export const TableRow = ({ children }: { children: React.ReactNode }) => {
  return <tr className="bg-white border-b">{children}</tr>;
};

export const TableHead = ({ children }: { children: React.ReactNode }) => {
  return <thead className="border-b bg-gray-800">{children}</thead>;
};

export const TableBody = ({
  children,
  className,
  loading,
  rowCount = 10,
  columnCount = 6,
}: {
  children?: React.ReactNode;
  className?: string;
  loading?: boolean;
  rowCount?: number;
  columnCount?: number;
}) => {
  if (loading) {
    return (
      <tbody className={className}>
        {[...Array(rowCount)].map((_, rowIndex) => (
          <TableRow key={`skeleton-row-${rowIndex}`}>
            {[...Array(columnCount)].map((_, colIndex) => (
              <TableCell key={`skeleton-cell-${colIndex}`} loading={true} />
            ))}
          </TableRow>
        ))}
      </tbody>
    );
  }

  return <tbody className={className}>{children}</tbody>;
};

const Table = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <table
      className={classNames(
        "text-center block w-full overflow-x-auto",
        className ? className : "2xl:table"
      )}
    >
      {children}
    </table>
  );
};

export default Table;
