<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vip_tiers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('organization_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->unsignedInteger('min_visits')->default(0);
            $table->unsignedInteger('priority')->default(0);
            $table->json('perks')->nullable();
            $table->timestamps();
            $table->unique(['organization_id', 'slug']);
        });

        Schema::create('customers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('organization_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->foreignUuid('vip_tier_id')->nullable()->constrained('vip_tiers')->nullOnDelete();
            $table->boolean('is_vip')->default(false);
            $table->boolean('is_blacklisted')->default(false);
            $table->text('preferences')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['organization_id', 'phone']);
            $table->index(['organization_id', 'name']);
        });

        Schema::create('customer_stats', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('customer_id')->unique()->constrained()->cascadeOnDelete();
            $table->unsignedInteger('total_visits')->default(0);
            $table->unsignedInteger('completed_reservations')->default(0);
            $table->unsignedInteger('cancelled_reservations')->default(0);
            $table->unsignedInteger('no_shows')->default(0);
            $table->timestamp('last_visit_at')->nullable();
            $table->decimal('average_party_size', 5, 2)->default(0);
            $table->foreignUuid('favorite_table_id')->nullable()->constrained('restaurant_tables')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('customer_notes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('customer_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('type')->default('general'); // birthday, allergy, etc.
            $table->text('body');
            $table->boolean('is_internal')->default(true);
            $table->timestamps();
        });

        Schema::create('blacklist_entries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('customer_id')->constrained()->cascadeOnDelete();
            $table->string('reason');
            $table->string('status')->default('active'); // active, lifted, pending_review
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('lifted_at')->nullable();
            $table->timestamps();
            $table->index(['organization_id', 'status']);
        });

        Schema::create('reservations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('code')->unique();
            $table->foreignUuid('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('branch_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('customer_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('table_id')->nullable()->constrained('restaurant_tables')->nullOnDelete();
            $table->foreignUuid('preferred_table_id')->nullable()->constrained('restaurant_tables')->nullOnDelete();
            $table->foreignUuid('area_id')->nullable()->constrained('table_areas')->nullOnDelete();
            $table->string('status')->default('pending');
            $table->unsignedSmallInteger('party_size');
            $table->timestamp('starts_at');
            $table->timestamp('ends_at');
            $table->unsignedSmallInteger('duration_minutes')->default(120);
            $table->string('source')->default('online'); // online, phone, walk_in
            $table->text('notes')->nullable();
            $table->text('internal_notes')->nullable();
            $table->string('guest_name');
            $table->string('guest_phone');
            $table->boolean('is_vip')->default(false);
            $table->timestamp('checked_in_at')->nullable();
            $table->timestamp('checked_out_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->foreignUuid('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('rejection_reason')->nullable();
            $table->string('cancellation_reason')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['branch_id', 'starts_at']);
            $table->index(['branch_id', 'status']);
            $table->index(['customer_id']);
            $table->index(['table_id', 'starts_at']);
            $table->index(['guest_phone']);
            $table->index(['guest_name']);
        });

        // Overlap prevention via exclusion constraint (PostgreSQL)
        DB::statement('CREATE EXTENSION IF NOT EXISTS btree_gist');
        DB::statement("
            ALTER TABLE reservations
            ADD CONSTRAINT reservations_no_overlap
            EXCLUDE USING gist (
                table_id WITH =,
                tstzrange(starts_at, ends_at, '[)') WITH &&
            )
            WHERE (table_id IS NOT NULL AND status IN ('approved', 'checked_in') AND deleted_at IS NULL)
        ");

        Schema::create('reservation_status_histories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('reservation_id')->constrained()->cascadeOnDelete();
            $table->string('from_status')->nullable();
            $table->string('to_status');
            $table->foreignUuid('changed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('note')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
            $table->index(['reservation_id', 'created_at']);
        });

        Schema::create('reservation_extensions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('reservation_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('minutes');
            $table->timestamp('previous_ends_at');
            $table->timestamp('new_ends_at');
            $table->foreignUuid('extended_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('reason')->nullable();
            $table->timestamps();
        });

        Schema::create('waiting_list_entries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('branch_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('customer_id')->nullable()->constrained()->nullOnDelete();
            $table->string('guest_name');
            $table->string('guest_phone');
            $table->unsignedSmallInteger('party_size');
            $table->date('preferred_date');
            $table->time('preferred_time')->nullable();
            $table->foreignUuid('preferred_area_id')->nullable()->constrained('table_areas')->nullOnDelete();
            $table->string('status')->default('waiting'); // waiting, notified, converted, cancelled, expired
            $table->unsignedInteger('priority')->default(0);
            $table->text('notes')->nullable();
            $table->foreignUuid('converted_reservation_id')->nullable()->constrained('reservations')->nullOnDelete();
            $table->timestamp('notified_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->index(['branch_id', 'status', 'preferred_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('waiting_list_entries');
        Schema::dropIfExists('reservation_extensions');
        Schema::dropIfExists('reservation_status_histories');
        DB::statement('ALTER TABLE reservations DROP CONSTRAINT IF EXISTS reservations_no_overlap');
        Schema::dropIfExists('reservations');
        Schema::dropIfExists('blacklist_entries');
        Schema::dropIfExists('customer_notes');
        Schema::dropIfExists('customer_stats');
        Schema::dropIfExists('customers');
        Schema::dropIfExists('vip_tiers');
    }
};
