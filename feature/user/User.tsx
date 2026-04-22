import TableStudent from "./components/user_table";
export const User = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-semibold text-[22px] text-black">User Data</h1>
        <p className="text-gray-400">Manage application user accounts</p>
      </div>
      <TableStudent />
    </div>
  );
};
