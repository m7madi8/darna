<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('table_areas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('branch_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('type'); // indoor, outdoor, vip, garden, terrace
            $table->string('color')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
            $table->index(['branch_id', 'type']);
        });

        Schema::create('restaurant_tables', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('branch_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('area_id')->nullable()->constrained('table_areas')->nullOnDelete();
            $table->string('number');
            $table->string('name')->nullable();
            $table->unsignedSmallInteger('capacity');
            $table->unsignedSmallInteger('min_capacity')->default(1);
            $table->string('status')->default('available');
            $table->boolean('is_vip')->default(false);
            $table->boolean('is_combinable')->default(false);
            $table->decimal('pos_x', 8, 2)->default(0);
            $table->decimal('pos_y', 8, 2)->default(0);
            $table->decimal('width', 8, 2)->default(80);
            $table->decimal('height', 8, 2)->default(80);
            $table->decimal('rotation', 6, 2)->default(0);
            $table->string('shape')->default('rectangle'); // rectangle, circle, square
            $table->json('meta')->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['branch_id', 'number']);
            $table->index(['branch_id', 'status']);
            $table->index(['branch_id', 'capacity']);
        });

        Schema::create('table_maintenance', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('table_id')->constrained('restaurant_tables')->cascadeOnDelete();
            $table->foreignUuid('branch_id')->constrained()->cascadeOnDelete();
            $table->string('reason');
            $table->timestamp('starts_at');
            $table->timestamp('ends_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignUuid('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['table_id', 'starts_at', 'ends_at']);
        });

        Schema::create('working_hours', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('branch_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('day_of_week'); // 0=Sunday
            $table->time('opens_at');
            $table->time('closes_at');
            $table->boolean('is_closed')->default(false);
            $table->timestamps();
            $table->unique(['branch_id', 'day_of_week', 'opens_at']);
        });

        Schema::create('special_hours', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('branch_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->time('opens_at')->nullable();
            $table->time('closes_at')->nullable();
            $table->boolean('is_closed')->default(false);
            $table->string('label')->nullable();
            $table->timestamps();
            $table->unique(['branch_id', 'date']);
        });

        Schema::create('holidays', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('organization_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('branch_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->date('date');
            $table->boolean('is_closed')->default(true);
            $table->timestamps();
        });

        Schema::create('business_rules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('branch_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('max_duration_minutes')->default(120);
            $table->unsignedSmallInteger('min_duration_minutes')->default(60);
            $table->unsignedSmallInteger('min_party_size')->default(1);
            $table->unsignedSmallInteger('max_party_size')->default(20);
            $table->unsignedSmallInteger('slot_interval_minutes')->default(15);
            $table->unsignedSmallInteger('advance_booking_days')->default(30);
            $table->unsignedSmallInteger('no_show_blacklist_threshold')->default(3);
            $table->unsignedSmallInteger('vip_visit_threshold')->default(10);
            $table->boolean('require_approval')->default(true);
            $table->boolean('maintenance_mode')->default(false);
            $table->json('meta')->nullable();
            $table->timestamps();
            $table->unique('branch_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('business_rules');
        Schema::dropIfExists('holidays');
        Schema::dropIfExists('special_hours');
        Schema::dropIfExists('working_hours');
        Schema::dropIfExists('table_maintenance');
        Schema::dropIfExists('restaurant_tables');
        Schema::dropIfExists('table_areas');
    }
};
