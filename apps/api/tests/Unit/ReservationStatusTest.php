<?php

namespace Tests\Unit;

use App\Domain\Enums\ReservationStatus;
use PHPUnit\Framework\TestCase;

class ReservationStatusTest extends TestCase
{
    public function test_terminal_statuses(): void
    {
        $this->assertTrue(ReservationStatus::Completed->isTerminal());
        $this->assertTrue(ReservationStatus::Cancelled->isTerminal());
        $this->assertTrue(ReservationStatus::Rejected->isTerminal());
        $this->assertTrue(ReservationStatus::Expired->isTerminal());
        $this->assertFalse(ReservationStatus::Approved->isTerminal());
        $this->assertFalse(ReservationStatus::Pending->isTerminal());
        $this->assertFalse(ReservationStatus::CheckedIn->isTerminal());
    }
}
