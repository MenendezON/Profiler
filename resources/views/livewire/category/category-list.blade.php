<!-- Start Recent Sales -->
<div class="card col-span-2 xl:col-span-1">
    <div class="card-header">Recent Sales</div>

    <table class="table-auto w-full text-left">
        <thead>
            <tr>
                <th class="px-4 py-2 border-r"></th>
                <th class="px-4 py-2 border-r">Catégorie</th>
                <th class="px-4 py-2 border-r">Création</th>
                <th class="px-4 py-2 border-r">Créé par</th>
                <th class="px-4 py-2">&nbsp;</th>
            </tr>
        </thead>
        <tbody class="text-gray-600">
            @foreach ($categories as $category )
            <tr>
                <td class="border border-l-0 px-2 text-center text-green-500"><i class="fad fa-circle"></i></td>
                <td class="border border-l-0 px-2 py-2 text-sm">{{$category->name}}</td>
                <td class="border border-l-0 px-2 py-2 text-sm">{{\Carbon\Carbon::parse($category->created_at)->format('d M Y')}}</td>
                <td class="border border-l-0 px-2 py-2 text-sm">{{$category->user->name}}</td>
                <td class="border border-l-0 border-r-0 px-2 py-2">
                    <div class="flex items-center space-x-2 text-sm">
                        <x-button type="button" wire:click="$dispatch('edit-student', {id: 2})" class="bg-green-500 hover:bg-green-700" aria-label="Edit">
                            <svg class="w-4 h-3" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z">
                                </path>
                            </svg>
                        </x-button>
                        <x-button type="button" wire:click="deleteStudent()" wire:confirm="Etes-vous sûr de vouloir supprimer cet élève?" class="bg-red-500 hover:bg-red-700" aria-label="Delete">
                            <svg class="w-4 h-3" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                            </svg>
                        </x-button>
                    </div>
                </td>
            </tr>
            @endforeach

        </tbody>
    </table>
    
</div>
<!-- End Recent Sales -->