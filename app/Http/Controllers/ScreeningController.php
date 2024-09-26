<?php

// Controller
namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Location;
use App\Models\Screeningquestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ScreeningController extends Controller
{
    public function list(Request $request)
    {
        // Fetch all records from the Screeningquestion model
        $screeningquestions = Screeningquestion::where('company_id', Auth::user()->company->id)
                                                //->orWhere('company_id', 'default')
                                                ->get();

        // Generate the HTML for the table rows
        $tableRows = '';

        foreach ($screeningquestions as $index => $screen) {
            $tableRows .= '
            <tr>
                <td>' . ($index + 1) . '</td>
                <td>' . htmlspecialchars($screen->data) . '</td>
                <td class="text-center">'.$screen->question .'</td>
                <td>
                    <a href="'.route('settings.screenquestion.show', $screen->id).'" class="btn btn-sm btn-primary">Edit</a>
                    <a href="/delete/' . $screen->id . '" class="btn btn-sm btn-danger">Delete</a>
                </td>
            </tr>';
        }

        // Return the JSON response
        return response()->json(['template' => $tableRows]);
    }

    public function listlocation(Request $request)
    {
        // Fetch all records from the Screeningquestion model
        $locations = Location::all();

        // Generate the HTML for the table rows
        $tableRows = '<option disabled selected>Please select your location</option>';

        foreach ($locations as $location) {
            $tableRows .= '<option value="'.$location->id.'">'.htmlspecialchars($location->name).'</option>';
        }

        // Return the JSON response
        return response()->json(['location' => $tableRows]);
    }

    public function listdepartment(Request $request)
    {
        // Fetch all records from the Screeningquestion model
        $departments = Department::all();

        // Generate the HTML for the table rows
        $tableRows = '<option disabled selected>Please select your department</option>';

        foreach ($departments as $department) {
            $tableRows .= '<option value="'.$department->id.'">'.htmlspecialchars($department->name).'</option>';
        }

        // Return the JSON response
        return response()->json(['department' => $tableRows]);
    }

    public function listtemplate(Request $request)
    {
        // Fetch all records from the Screeningquestion model
        $screens = Screeningquestion::all();

        // Generate the HTML for the table rows
        $tableRows = '<option disabled selected>Please select your template</option>';

        foreach ($screens as $screen) {
            $tableRows .= '<option value="'.$screen->id.'">'.htmlspecialchars($screen->data).'</option>';
        }

        // Return the JSON response
        return response()->json(['screen' => $tableRows]);
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
