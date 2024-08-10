<!-- start quick Info -->
<div class="container px-6 mx-auto">

    @if(session('success'))
    <div class="flex justify-between w-full bg-green-100 rounded-md mt-4 p-2 shadow-xs">
        <span class="text-green-500 text-md">{{ session('success') }}</span>
        <button class="text-green-500" wire:click="removeflash">x</button>
    </div>
    @endif

    <div class="flex justify-between my-3" >
        <x-button wire:click="showCreateCategoryModal" class="h-14">
            {{ __('Nouvelle catégorie') }}
        </x-button>
        <!-- Create post modal -->
        <x-dialog-modal wire:model="showCategoryModal" style="background:red">
            <x-slot name="title">
                {{ __('Créer une catégorie') }}
            </x-slot>

            <form>
                <x-slot name="content">
                    <div class="flex px-2 my-2">
                        <div class="max-w-80 md:w-1/1 mr-4 ml-4">
                            <label class="block mt-4 text-sm">
                                <span class="text-gray-700 dark:text-gray-400">
                                    Nom
                                </span>
                                <input wire:model.live="name" class="w-full mt-1 p-2 text-sm border-1 border-gray-400" />
                                <span class="text-sm text-gray-300">Slug: {{strtolower($getSlugProperty)}}</span><br>
                                @error('name')
                                <span class="text-xs text-red-600 dark:text-gray-400">{{ $message }}</span>
                                @enderror
                            </label>
                        </div>
                    </div>
                </x-slot>
                <x-slot name="footer">
                    <div class="px-2 my-2">
                        <div class="w-full md:w-2/3 mr-4 ml-4">
                            <x-button wire:click="store">
                                {{ __('Valider') }}
                                <div wire:loading>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="12" y1="2" x2="12" y2="6"></line>
                                        <line x1="12" y1="18" x2="12" y2="22"></line>
                                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                                        <line x1="2" y1="12" x2="6" y2="12"></line>
                                        <line x1="18" y1="12" x2="22" y2="12"></line>
                                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                                    </svg>
                                </div>
                            </x-button>
                        </div>
                    </div>
                </x-slot>
            </form>
        </x-dialog-modal>
        <div class="relative max-w-xl h-14">
            <div class="absolute inset-y-0 flex items-center pl-2">
                <svg class="w-4 h-4" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
                </svg>
            </div>
            <input wire:model.live="search" type="search" class="p-2 pl-6 pb-3 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input" placeholder="Saisissez votre mot-clé" aria-label="Search" />
        </div>
    </div>

    <!-- display the list of categories -->
    <div class="card col-span-3 xl:col-span-1">
        <div class="card-header">Liste des catégories</div>

        <table class="table-auto w-full text-left">
            <thead>
                <tr>
                    <th class="px-4 py-2 border-r"></th>
                    <th class="px-4 py-2 border-r">Catégorie</th>
                    <th class="w-32 px-4 py-2 border-r">Création</th>
                    <th class="px-4 py-2 border-r">Créé par</th>
                    <th class="w-32 px-4 py-2">&nbsp;</th>
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
        <div class="p-2">
            {{$categories->links()}}
        </div>
    </div>
    <!-- end of the list of categories -->

</div>
<!-- end quick Info -->