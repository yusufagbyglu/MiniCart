# Schema Gap Analysis & Implementation Plan

After comparing `docs/database_schema.txt`, `docs/phase2_implementation_plan.md`, and the existing database migrations, the following discrepancies and missing items have been identified.

## 1. Identified Gaps

### 1.1 Tax System (Phase 5)
- **Documentation**: `docs/phase2_implementation_plan.md` (Section 5.2) specifies "Date-based rules (effective from/to)".
- **Schema**: `docs/database_schema.txt` for `tax_rule` lacks date columns.
- **Migration**: `2025_12_16_183715_create_tax_rules_table.php` contains `id`, `tax_class_id`, `tax_rate_id`, `priority`.
- **MISSING**: `valid_from` (timestamp/date) and `valid_until` (timestamp/date) columns in `tax_rules` table.

### 1.2 Settings System (Phase 9)
- **Documentation**: `docs/phase2_implementation_plan.md` (Section 9.2) requires a `settings` table.
- **Schema**: Completely missing from `docs/database_schema.txt`.
- **Migration**: No migration file exists.
- **MISSING**: `settings` table.

### 1.3 Exchange Rates (Phase 12)
- **Documentation**: Section 12.1 mentions `exchange_rates` table.
- **Schema**: Missing from `docs/database_schema.txt`.
- **Migration**: No migration file exists.
- **MISSING**: `exchange_rates` table.

## 2. Recommended Actions

### Action 1: Update Tax Rules Table
Create a new migration to add date range columns to support the "Date-based rules" feature.

**Migration Name**: `xxxx_xx_xx_xxxxxx_add_validity_dates_to_tax_rules_table.php`
**Columns to Add**:
- `valid_from` (timestamp, nullable)
- `valid_until` (timestamp, nullable)

### Action 2: Create Settings Table
Create the foundational table for site-wide settings.

**Migration Name**: `2026_01_XX_XXXXXX_create_settings_table.php`
**Schema**:
```php
Schema::create('settings', function (Blueprint $table) {
    $table->id();
    $table->string('key')->unique();
    $table->text('value')->nullable(); // Can store JSON strings
    $table->string('type')->default('string'); // string, boolean, integer, json
    $table->string('group')->default('general'); // general, payment, email, etc.
    $table->string('description')->nullable();
    $table->timestamps();
});
```

### Action 3: Update Documentation
Update `docs/database_schema.txt` to reflect these changes so it remains the source of truth.

## 3. Execution Plan
1. Run command to create tax rule migration.
2. Run command to create settings migration.
3. Run `php artisan migrate`.
4. Update `docs/database_schema.txt`.
