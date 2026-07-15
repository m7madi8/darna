# Darna Architecture

## Tenancy

`Organization → Branch` is the tenancy spine. Operational data (tables, hours, reservations) is branch-scoped. Staff membership is via `branch_user`. Permissions can be branch-pivoted on `role_user`.

## Layers (API)

```
Controller → Form Request → Action/Service → Repository/Eloquent → DB
                 ↓
         Events → Broadcast (Reverb) + Jobs (Redis)
                 ↓
            ActivityLogService
```

## Reservation integrity

1. Application-level conflict detection (`ConflictDetectionService`)
2. PostgreSQL GiST exclusion constraint on `reservations` for overlapping approved/checked_in ranges on the same table
3. Working hours + business rules validation before create/approve/extend

## Smart assignment

`SmartTableAssignmentService` ranks free tables by smallest capacity ≥ party size, excludes OOS/cleaning/VIP-restricted, and skips maintenance windows.

## Realtime

| Channel | Payload |
|---------|---------|
| `private-branch.{id}.floor` | table statuses |
| `private-branch.{id}.reservations` | reservation updates |
| `private-user.{id}` | personal notifications |

## Future modules

Waiting list conversion, VIP tiers, blacklist enforcement UI, analytics/heatmap computation, POS/CRM webhooks — schema + routes + permissions exist; extend services without changing tenancy model.
