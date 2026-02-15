# Phase 5: Tax Classes & Advanced Tax System - Implementation Plan

## Objective
Complete the missing tax management system, allowing for different tax rates per product/region (e.g., Standard Rate, Reduced Rate, Zero Rate) and implementing logic to calculate taxes dynamically based on customer location and product tax class.

## 1. Backend Implementation

### 1.1 Database Verification
- Ensure `tax_classes` and `tax_rules` tables exist (as per previous plans, they should, but need verification).
- Verify relationships (`tax_rules` should link `tax_classes` and `tax_rates`).

### 1.2 Models & Relationships
- Update/Create `TaxClass` model (`app/Models/TaxClass.php`).
- Update/Create `TaxRule` model (`app/Models/TaxRule.php`).
- Update `Product` model to belong to a `TaxClass`.
- Update `TaxRate` model relationships.

### 1.3 Controllers & API
- **TaxClassController**: Implement CRUD operations for tax classes.
  - Location: `app/Http/Controllers/Api/v1/Admin/TaxClassController.php`
- **TaxRuleController**: Implement CRUD operations for tax rules.
  - Location: `app/Http/Controllers/Api/v1/Admin/TaxRuleController.php`
- **Requests**:
  - `app/Http/Requests/TaxClass/StoreTaxClassRequest.php`
  - `app/Http/Requests/TaxClass/UpdateTaxClassRequest.php`

### 1.4 Service Layer
- **TaxCalculationService**: Logic to calculate tax for a cart/order based on address and product tax classes.
  - Location: `app/Services/TaxCalculationService.php`

### 1.5 API Routes
- Register routes in `routes/api.php` under the admin group:
  - `apiResource('tax-classes', TaxClassController::class)`
  - `apiResource('tax-rules', TaxRuleController::class)`

## 2. Frontend Implementation

### 2.1 Tax Classes Management Page
- Create `src/app/admin/tax-classes/page.tsx`.
- Features: List table, Add button, Edit/Delete actions.

### 2.2 Tax Class Components
- `src/components/admin/tax-classes/TaxClassModal.tsx`: Form for creating/editing tax classes.
- `src/components/admin/tax-classes/TaxRuleModal.tsx`: Form for managing rules linking classes to rates.

### 2.3 Product Integration
- Update `src/components/admin/products/ProductModal.tsx`: Add "Tax Class" dropdown selector when creating/editing products.

## 3. Execution Steps

### Step 1: Backend Foundation
- [ ] Check/Migrate Database Tables.
- [ ] Create Models.
- [ ] Create Controllers & Routes.

### Step 2: Frontend Management
- [ ] Create Tax Classes Page.
- [ ] Create Tax Class Modal.
- [ ] Wire up API calls.

### Step 3: Product & Calculation
- [ ] Update Product Modal.
- [ ] Implement backend tax calculation logic (Service).
- [ ] Verify calculation on checkout/cart.

## 4. Current Status
- Pending Start.
