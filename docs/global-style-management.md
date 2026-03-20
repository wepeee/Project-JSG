# Global Style Management (GSM)

GSM dipakai sebagai sumber tunggal warna aplikasi.

## Lokasi

- Token + utility GSM: `src/styles/gsm.css`
- Theme base shadcn: `src/styles/globals.css`

## Prinsip

1. Gunakan token semantic (`primary`, `success`, `warning`, `info`, `destructive`), jangan hardcode `blue-500`, `emerald-500`, dll.
2. Untuk status badge/panel, prioritaskan utility:
- `gsm-status-success`
- `gsm-status-warning`
- `gsm-status-info`
- `gsm-status-danger`
3. Untuk label section sidebar:
- `text-nav-section`
4. Untuk highlight role/department:
- `text-role-highlight`

## Contoh

```tsx
<span className="gsm-status-warning rounded-md border px-2 py-0.5 text-xs font-semibold">
  Menunggu Verifikasi
</span>
```

```tsx
<Button className="bg-info text-info-foreground hover:bg-info/90">
  Lihat Detail
</Button>
```

## Catatan Migrasi

Jika masih menemukan class warna hardcoded, ubah ke token GSM agar konsisten lintas light/dark mode.

Audit cepat:

```bash
pnpm gsm:audit
```
