// TableUser.tsx
"use client";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/pagination/pagination";
import { columns } from "./user_columns";
import { useUsers } from "@/hooks/useUsers";

const TableUser = () => {
  const { users, loading, error, deleteUser } = useUsers();

  const table = useReactTable({
    data: users,
    columns: columns(deleteUser),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  if (loading)
    return <p className="text-sm text-gray-400 py-4">Memuat data...</p>;
  if (error) return <p className="text-sm text-red-500 py-4">{error}</p>;

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden ">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow
              key={hg.id}
              className="bg-[#1F2D2E] hover:bg-[#1F2D2E] border-b-0"
            >
              {hg.headers.map((h) => (
                <TableHead
                  key={h.id}
                  className="text-white/80 text-xs font-semibold uppercase tracking-wider py-3"
                >
                  {h.isPlaceholder
                    ? null
                    : flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center text-gray-400 text-sm py-10"
              >
                Tidak ada data pengguna.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row, i) => (
              <TableRow
                key={row.id}
                className={`
                  border-b border-gray-100 transition-colors
                  ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                  hover:bg-[#f0faf0]
                `}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
        <TableFooter className="bg-white border-t border-gray-100">
          <TableRow className="hover:bg-white">
            <TableCell colSpan={9}>
              <Pagination table={table} />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default TableUser;
