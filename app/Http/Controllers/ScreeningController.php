<?php

// Controller
namespace App\Http\Controllers;

use App\Models\Screeningquestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ScreeningController extends Controller
{
    public function list(Request $request)
    {
        // Fetch all records from the Screeningquestion model
        $questions = Screeningquestion::all();

        // Generate the HTML for the table rows
        $tableRows = '';

        foreach ($questions as $index => $question) {
            $tableRows .= '
            <tr>
                <td>' . ($index + 1) . '</td>
                <td>' . htmlspecialchars($question->data) . '</td>
                <td class="text-center">0</td>
                <td>
                    <a href="/edit/' . $question->id . '" class="btn btn-sm btn-primary">Edit</a>
                    <a href="/delete/' . $question->id . '" class="btn btn-sm btn-danger">Delete</a>
                </td>
            </tr>';
        }

        // Return the JSON response
        return response()->json(['template' => $tableRows]);
    }

    // Method to save the title to the Screeningquestion table
    public function store(Request $request)
    {
        // 1. Valider les données reçues
        $validatedData = $request->validate([
            'data' => 'required|string|max:255', // ajustez les règles de validation selon vos besoins
        ]);

        try {
            // 2. Créer une nouvelle instance du modèle et y assigner les données
            $id = Screeningquestion::create([
                'data' => $validatedData['data'],
                'company_id' => Auth::user()->company->id,
            ]);

            // 4. Retourner une réponse JSON indiquant le succès
            return response()->json([
                'status' => 'created',
                'message' => 'Template created successfully',
                'redirect' => route('settings.screenquestion.show', $id), // Adaptez cette route si nécessaire
            ]);
        } catch (\Exception $e) {
            // En cas d'erreur, retourner une réponse JSON indiquant l'échec
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while creating the template: ' . $e->getMessage(),
            ], 500);
        }
    }
}
