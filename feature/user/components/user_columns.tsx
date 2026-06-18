// user_columns.tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import type { User } from "@/interface/userType";
import { Checkbox } from "../../../components/ui/checkbox";
import { Button } from "../../../components/ui/button";
import { Trash2 } from "lucide-react";
import { Badge } from "../../../components/ui/badge";

export const columns = (
  deleteUser: (id: string) => Promise<void>,
): ColumnDef<User>[] => [
  {
    id: "action",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(value === true)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "img",
    header: "Profile",
    cell: ({ row }) => (
      <Avatar className="h-9 w-9 rounded-lg border border-gray-200">
        <AvatarImage
          className="rounded-lg object-cover"
          src={row.original.img || "/default-avatar.png"}
        />
        <AvatarFallback className="rounded-lg bg-[#264c43] text-white text-xs font-semibold">
          {row.original.name?.charAt(0).toUpperCase() ?? "U"}
        </AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <span className="font-medium text-gray-800">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <Badge className="bg-[#e8f5e9] text-[#2e7d32] border border-[#a5d6a7] hover:bg-[#e8f5e9] font-medium text-xs">
        {row.original.role}
      </Badge>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-gray-600 text-sm">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <span className="text-gray-600 text-sm">{row.original.phone}</span>
    ),
  },
  {
    accessorKey: "createdat",
    header: "Created at",
    cell: ({ row }) => (
      <span className="text-gray-500 text-xs">{row.original.created_at}</span>
    ),
  },
  {
    accessorKey: "updatedat",
    header: "Updated at",
    cell: ({ row }) => (
      <span className="text-gray-500 text-xs">{row.original.updated_at}</span>
    ),
  },
  {
    id: "Actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="icon"
        className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
        onClick={() => deleteUser(row.original.id)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    ),
  },
];