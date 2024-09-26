<?php
namespace App\Enums;

enum ContractType: String
{
    case CDD = "CDD";
    case CDI = "CDI";
    case CONSULTANT = "Consultant";
    case PRESTATAIRE = "Prestataire";
    case STAGIAIRE = "Stagiaire";
}