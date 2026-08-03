-- Drop the old overloaded signature of match_perfumes to resolve Postgres RPC ambiguity

DROP FUNCTION IF EXISTS match_perfumes(uuid[]);
