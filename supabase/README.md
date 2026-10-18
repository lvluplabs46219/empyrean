# Supabase schema (Empyrean)

## Apply migration

### Supabase CLI

```bash
supabase db push
# or
supabase migration up
```

### Dashboard SQL editor

Paste and run:

`migrations/20261018000000_init_multi_tenant.sql`

Requires the **vector** extension (Database → Extensions → `vector`).

## Embedding dimension

`documents.embedding` is `vector(1536)` (OpenAI `text-embedding-3-small` / many compatible models).

If you use another model, change the type and rebuild the HNSW index, e.g.:

```sql
ALTER TABLE public.documents ALTER COLUMN embedding TYPE vector(768);
DROP INDEX IF EXISTS documents_embedding_hnsw_idx;
CREATE INDEX documents_embedding_hnsw_idx
  ON public.documents USING hnsw (embedding vector_cosine_ops);
```

Also update `match_documents` argument type to match.

## RAG RPC

```sql
SELECT * FROM public.match_documents(
  query_embedding := $1::vector(1536),
  match_count := 5,
  match_threshold := 0.6,
  filter_project_id := '<project-uuid>',
  filter_organization_id := '<org-uuid>'
);
```

Always pass `filter_organization_id` and/or `filter_project_id` from the application so tenants cannot search across orgs when using the service role.

## RLS summary

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| profiles | own row | (signup trigger) | own row | — |
| organizations | members | any authenticated | admin | owner |
| organization_members | members | admin / first member | admin | admin or self |
| projects | members | members | members | admin |
| documents | project members | project members | project members | project members |
| audit_logs | members | members (org-scoped) | — | — |

Service role bypasses RLS (use only on the server / Empyrean daemon).

## Org bootstrap pattern

1. Insert `organizations`
2. Insert `organization_members` with `role = 'owner'` for `auth.uid()`
3. Create `projects` / `documents` under that org
