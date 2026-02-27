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
};

type Props = {
  value: string;
  onChange: (code: string) => void;
  /** Auto-infer kind from context: "FG" for Pro.partNumber, "WIP" for Proses.partNumber */
  defaultKind?: "RAW" | "WIP" | "FG" | "CONSUMABLE";
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export default function ItemCodeInput({
  value,
  onChange,
  defaultKind = "FG",
  placeholder = "Cari / ketik Part Number...",
  disabled = false,
  className = "",
}: Props) {
  const [query, setQuery] = React.useState(value);
  const [open, setOpen] = React.useState(false);
  const [showCreate, setShowCreate] = React.useState(false);
  const [createName, setCreateName] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Sync external value
  React.useEffect(() => {
    setQuery(value);
  }, [value]);

  // Search query
  const searchEnabled = query.length >= 1 && open;
  const { data: results } = api.items.search.useQuery(
    { q: query, limit: 10 },
    { enabled: searchEnabled },
  );

  // Create mutation
  const utils = api.useUtils();
  const createItem = api.items.create.useMutation({
    onSuccess: (item) => {
      onChange(item.code);
      setQuery(item.code);
      setOpen(false);
      setShowCreate(false);
      setCreateName("");
      void utils.items.search.invalidate();
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
    setOpen(true);
    // Don't update parent until user selects or blurs
  };

  const handleBlur = () => {
    // On blur, commit whatever is typed
    setTimeout(() => {
      if (query !== value) {
        onChange(query.trim().toUpperCase().replace(/\s+/g, "_"));
      }
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      setShowCreate(false);
    }
  };

  const exactMatch = results?.some(
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
                  <div className="ml-auto flex gap-1">
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
                  setCreateName("");
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
