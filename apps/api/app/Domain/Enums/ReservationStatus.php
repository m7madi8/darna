<?php



namespace App\Domain\Enums;



enum ReservationStatus: string

{

    case Pending = 'pending';

    case Approved = 'approved';

    case Rejected = 'rejected';

    case CheckedIn = 'checked_in';

    case Completed = 'completed';

    case Cancelled = 'cancelled';

    case NoShow = 'no_show';

    case Expired = 'expired';



    public function label(): string

    {

        return match ($this) {

            self::Pending => 'Pending',

            self::Approved => 'Approved',

            self::Rejected => 'Rejected',

            self::CheckedIn => 'Checked In',

            self::Completed => 'Completed',

            self::Cancelled => 'Cancelled',

            self::NoShow => 'No Show',

            self::Expired => 'Expired',

        };

    }



    public function isTerminal(): bool

    {

        return in_array($this, [

            self::Rejected,

            self::Completed,

            self::Cancelled,

            self::NoShow,

            self::Expired,

        ], true);

    }

}


