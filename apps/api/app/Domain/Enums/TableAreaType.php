<?php

namespace App\Domain\Enums;

enum TableAreaType: string
{
    case Indoor = 'indoor';
    case Outdoor = 'outdoor';
    case Vip = 'vip';
    case Garden = 'garden';
    case Terrace = 'terrace';
}
