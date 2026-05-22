"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
  }) => Promise<void>;
}

const ROLES = ["super-admin", "admin"];

export function AddUserDialog({ open, onClose, onSubmit }: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleChange = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.phone ||
      !form.role
    ) {
      setErr("Semua field wajib diisi.");
      return;
    }
    try {
      setSubmitting(true);
      setErr(null);
      await onSubmit(form);
      setForm({ name: "", email: "", password: "", phone: "", role: "" });
      onClose();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {err && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">
              {err}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <Label>Name</Label>
            <Input
              placeholder="Full name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="email@example.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Min. 6 karakter"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Phone</Label>
            <Input
              type="tel"
              placeholder="08xxxxxxxxxx"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Role</Label>
            <Select
              onValueChange={(val) => handleChange("role", val)}
              value={form.role}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Menyimpan..." : "Save User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
