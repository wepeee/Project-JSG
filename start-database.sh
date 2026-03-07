#!/usr/bin/env bash
set -euo pipefail

cat <<'EOF'
This project has migrated from MySQL Docker to Supabase PostgreSQL.

Use Supabase for app runtime DB.
If you need local PostgreSQL for integration tests, run:

docker run --name belajar-test-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=belajar_test \
  -p 5432:5432 \
  -d postgres:16
EOF
