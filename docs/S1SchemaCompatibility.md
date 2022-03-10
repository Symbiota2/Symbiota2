# S1 Schema Compatibility
We will use the following vocabulary:
  - S1 - Schema of Symbiota
  - S2Feb22 - Schema of Symbiota2 as of Feb. 1, 2022
  - S2Compat - Schema of Symbiota2 after Feb. 1, 2022
  compatible with S1

We decided to remain backwards compatible (as of Spring 2022)
with S1's schema to support the S1 front-end and 
user tools.  This requires modifying S2Feb22 to become 
S2Compat.

An analysis of the migrations to convert S1 to S2Feb22
yielded the following strategy to "undo" the migration
and create a migration from S1 to S2Compat.  This migration will 
then become the official S2 migration.  We will create
the migration by editing the existing migrations (both up
and down) to "undo" incompatible changes.

- All columns dropped by S2Feb22 with respect to S1 need 
to be restored (not dropped in the first place)

- All tables dropped also need to be restored (no tables
  were dropped)
  
- (Optional, cosmetic) All created tables to be prefixed with "S2"

- (Optional, cosmetic) All added columns to be prefixed with "S2", but since
S1 uses field names in INSERTs we do not have to factor
  the new columns out into new tables.  The columns will however
  need to have Default values specified and not be part of
  keys or other constraints that would be violated with a 
  default value.
  

