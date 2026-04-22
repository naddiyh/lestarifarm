"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarImage } from "../../../components/ui/avatar";
import type { User } from "@/interface/userType";
import { Checkbox } from "../../../components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../../components/ui/dropdown-menu";
import { Button } from "../../../components/ui/button";
import { MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<User>[] = [
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
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: " img ",
    header: "Profile",
    cell: ({ row }) => (
      <Avatar className="h-10 w-10">
        <AvatarImage
          className=" rounded-md "
          src={row.original.img || "/default-avatar.png"}
        />
      </Avatar>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },

  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "createdat",
    header: "Created at",
  },
  {
    accessorKey: "updated at",
    header: "Updated at",
  },

  {
    id: "Actions",
    header: "Actions",
    cell: ({ row }) => (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="text-green-600">Edit</DropdownMenuItem>

          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
