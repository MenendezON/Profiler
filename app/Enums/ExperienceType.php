<?php
namespace App\Enums;

enum ExperienceType: String
{
    case CERTIFICAT = "1";
    case LICENCE = "2";
    case MASTER = "3";
    case DOCTORAT = "4";
    case AUTRE = "5";
}