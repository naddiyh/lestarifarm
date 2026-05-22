"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import TableUser from "./components/user_table";
import { AddUserDialog } from "@/components/modal/addUserDialog";
import { useUsers } from "@/hooks/useUsers";

export const User = () => {
  const [open, setOpen] = useState(false);
  const { addUser } = useUsers();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-[22px] text-black">User Data</h1>
        <p className="text-gray-400">Manage application user accounts</p>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => setOpen(true)}
          className="cursor-pointer hover:opacity-80"
        >
          + Add User
        </Button>
      </div>

      <TableUser />

      <AddUserDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={addUser}
      />
    </div>
  );
};
