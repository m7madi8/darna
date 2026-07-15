<?php

namespace App\Domain\Enums;

enum TableStatus: string
{
    case Available = 'available';
    case Pending = 'pending';
    case Reserved = 'reserved';
    case Occupied = 'occupied';
    case OutOfService = 'out_of_service';
    case Cleaning = 'cleaning';
    case VipReserved = 'vip_reserved';

    public function color(): string
    {
        return match ($this) {
            self::Available => 'green',
            self::Pending => 'yellow',
            self::Reserved => 'blue',
            self::Occupied => 'orange',
            self::OutOfService => 'red',
            self::Cleaning => 'gray',
            self::VipReserved => 'purple',
        };
    }
}
