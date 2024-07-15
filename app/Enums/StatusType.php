<?php
namespace App\Enums;

enum StatusType: String
{
    case OUVERT = "Ouvert";
    case FERMEE = "Fermée";
    case ATTENTE = "En attente";
    case ARCHIVEE = "Archivée";
}