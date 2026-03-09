"use client";

import * as React from "react";
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";

type ItemResult = {
  id: number;
  code: string;
  name: string;
  kind: string;
  status: string;
  baseUom: string | null;
  stock?: number;
};

type Props = {
  value: string;
  onChange: (code: string) => void;
  commitMode?: "blur" | "change";
  /** Auto-infer kind from context: "FG" for Pro.partNumber, "WIP" for Proses.partNumber */
  defaultKind?: "RAW" | "WIP" | "FG" | "CONSUMABLE";
  /** Auto-fill name saat buat item baru (misal: "NamaMesin + NamaPRO") */
  defaultName?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export default function ItemCodeInput({
  value,
  onChange,
  commitMode = "blur",
  defaultKind = "FG",
  defaultName = "",
  placeholder = "Cari / ketik Part Number...",
  disabled = false,
  className = "",
}: Props) {
  const [query, setQuery] = React.useState(value);
  const [debouncedQuery, setDebouncedQuery] = React.useState(value);
  const [open, setOpen] = React.useState(false);
  const [showCreate, setShowCreate] = React.useState(false);
  const [createName, setCreateName] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  // Ref selalu menyimpan query terbaru agar bisa dibaca segera saat blur/save
  const queryRef = React.useRef(value);

  // Sync external value
  React.useEffect(() => {
    setQuery(value);
    setDebouncedQuery(value);
    queryRef.current = value;
  }, [value]);

  React.useEffect(() => {
    if (!open) {
      setDebouncedQuery(query);
      return;
    }
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);
    return () => clearTimeout(timer);
  }, [open, query]);

  // Search query
  const searchEnabled = debouncedQuery.length >= 1 && open;
  const { data: results } = api.items.search.useQuery(
    { q: debouncedQuery, limit: 10 },
    {
      enabled: searchEnabled,
      staleTime: 5_000,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  );

  // Create mutation
  const utils = api.useUtils();
  const createItem = api.items.create.useMutation({
    onSuccess: async (item) => {
      onChange(item.code);
      setQuery(item.code);
      setOpen(false);
      setShowCreate(false);
      setCreateName("");
      await Promise.all([
        utils.items.search.invalidate(),
        utils.materials.list.invalidate(),
      ]);
    },
  });

  // Click outside handler
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setShowCreate(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (item: ItemResult) => {
    onChange(item.code);
    setQuery(item.code);
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    queryRef.current = val; // Selalu update ref agar blur/save bisa baca nilai terbaru
    setOpen(true);

    if (commitMode === "change") {
      const normalized = val.trim().toUpperCase().replace(/\s+/g, "_");
      onChange(normalized);
    }
  };

  const handleBlur = () => {
    if (commitMode === "change") {
      setTimeout(() => {
        setOpen(false);
        setShowCreate(false);
      }, 150);
      return;
    }

    // Flush commit segera (tanpa setTimeout) agar tidak race dengan klik tombol Save
    const current = queryRef.current;
    const normalized = current.trim().toUpperCase().replace(/\s+/g, "_");
    if (normalized !== value) {
      onChange(normalized);
    }
    // Tutup dropdown setelah delay kecil agar onMouseDown item bisa jalan dulu
    setTimeout(() => {
      setOpen(false);
      setShowCreate(false);
    }, 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      setShowCreate(false);
    }
  };

  const exactMatch = results?.find(
    (r) => r.code === query.trim().toUpperCase().replace(/\s+/g, "_"),
  );

  const handleCreateSubmit = () => {
    const normalizedCode = query.trim().toUpperCase().replace(/\s+/g, "_");
    createItem.mutate({
      code: normalizedCode,
      name: createName.trim() || normalizedCode,
      kind: defaultKind,
    });
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <Input
        value={query}
        onChange={handleInputChange}
        onFocus={() => setOpen(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="text-xs"
      />

      {/* Note under input */}
      {!open && query.trim() && (
        <div className="mt-1 text-[10px]">
          {exactMatch ? (
            <span className="text-green-500">
              ✓ Item ditemukan — Stok: {exactMatch.stock ?? 0}{" "}
              {exactMatch.baseUom || "Pcs"}
            </span>
          ) : (
            <span className="text-amber-500">
              ⚠ PN belum terdaftar, akan membuat item master baru (DRAFT)
            </span>
          )}
        </div>
      )}

      {/* Dropdown */}
      {open && query.length >= 1 && (
        <div className="border-border bg-popover absolute z-50 mt-1 max-h-60 w-full min-w-[280px] overflow-auto rounded-md border shadow-lg">
          {/* Results */}
          {results && results.length > 0 && (
            <div className="p-1">
              {results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="hover:bg-muted flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(item);
                  }}
                >
                  <span className="font-mono font-semibold">{item.code}</span>
                  {item.name !== item.code && (
                    <span className="text-muted-foreground truncate">
                      {item.name}
                    </span>
                  )}
                  <div className="ml-auto flex items-center gap-1">
                    <span className="text-muted-foreground mr-1 font-mono text-[10px]">
                      Stok: {item.stock ?? 0}
                    </span>
                    <Badge variant="outline" className="px-1 py-0 text-[10px]">
                      {item.kind}
                    </Badge>
                    {item.status === "DRAFT" && (
                      <Badge
                        variant="secondary"
                        className="bg-amber-500/20 px-1 py-0 text-[10px] text-amber-400"
                      >
                        DRAFT
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {results && results.length === 0 && (
            <div className="text-muted-foreground p-2 text-center text-xs">
              Tidak ditemukan
            </div>
          )}

          {/* Create new option */}
          {!exactMatch && query.length >= 2 && !showCreate && (
            <div className="border-border border-t p-1">
              <button
                type="button"
                className="hover:bg-muted flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs text-cyan-400"
                onMouseDown={(e) => {
                  e.preventDefault();
                  setShowCreate(true);
                  setCreateName(defaultName);
                }}
              >
                <span className="text-lg leading-none">+</span>
                <span>
                  Buat Item baru:{" "}
                  <span className="font-mono font-semibold">
                    {query.trim().toUpperCase().replace(/\s+/g, "_")}
                  </span>
                </span>
                <Badge
                  variant="outline"
                  className="ml-auto px-1 py-0 text-[10px]"
                >
                  {defaultKind}
                </Badge>
              </button>
            </div>
          )}

          {/* Create form */}
          {showCreate && (
            <div className="border-border space-y-2 border-t p-2">
              <div className="text-muted-foreground text-xs">
                Kode:{" "}
                <span className="text-foreground font-mono font-semibold">
                  {query.trim().toUpperCase().replace(/\s+/g, "_")}
                </span>{" "}
                ({defaultKind})
              </div>
              <Input
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="Nama item (opsional, default = kode)"
                className="h-7 text-xs"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateSubmit();
                  }
                }}
              />
              <div className="flex gap-1">
                <button
                  type="button"
                  className="flex-1 rounded bg-cyan-600 px-2 py-1 text-xs text-white hover:bg-cyan-500 disabled:opacity-50"
                  disabled={createItem.isPending}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleCreateSubmit();
                  }}
                >
                  {createItem.isPending ? "Menyimpan..." : "Simpan (DRAFT)"}
                </button>
                <button
                  type="button"
                  className="border-border hover:bg-muted rounded border px-2 py-1 text-xs"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setShowCreate(false);
                  }}
                >
                  Batal
                </button>
              </div>
              {createItem.error && (
                <div className="text-xs text-red-400">
                  {createItem.error.message}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
