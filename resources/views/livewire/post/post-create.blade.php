<div class="card">
    <form>
        <div class="flex justify-between px-4 py-2 mb-4 bg-gray-200 ">
            <span>&nbsp;</span>
            <x-button wire:click.prevent="store">
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
        <div class="flex">
            <div class="w-full md:w-2/3 mr-4 ml-4">
                <label class="block mt-4 text-sm">
                    <span class="text-gray-700 dark:text-gray-400">
                        Créer une offre d'emploi
                    </span>
                    <input wire:model="title" type="text" placeholder="Titre de l'offre" class="block w-full mt-1 text-sm p-2 border-1 border-gray-400" />
                    @error('title')
                    <span class="text-xs text-red-600 dark:text-gray-400">{{ $message }}</span>
                    @enderror
                </label>
                <label class="block mt-4 text-sm">
                    <textarea wire:model="description" class="block w-full h-x hover:h-full mt-1 p-2 border-1 border-gray-400 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"></textarea>
                    @error('description')
                    <span class="text-xs text-red-600 dark:text-gray-400">{{ $message }}</span>
                    @enderror
                </label>
            </div>
            <div class="w-full md:w-1/3 mr-4 ml-4">
                <label class="block mt-4 text-sm">
                    <span class="text-gray-700 dark:text-gray-400">
                        Status
                    </span>
                    <select wire:model="status" class="block w-full mt-1 text-sm p-2 border-1 border-gray-400">
                        <option disabled value="">Type de publication</option>
                        @foreach(\App\Enums\StatusType::cases() as $country)
                        <option value="{{ $country->value }}">{{ $country->name }}</option>
                        @endforeach
                    </select>
                    @error('status')
                    <span class="text-xs text-red-600 dark:text-gray-400">{{ $message }}</span>
                    @enderror
                </label>
                <label class="block mt-4 text-sm">
                    <span class="text-gray-700 dark:text-gray-400">
                        Catégorie
                    </span>
                    <select wire:model="category" class="block w-full mt-1 p-2 text-sm border-1 border-gray-400">
                        <option>Sélectionner une catégorie...</option>
                        @foreach($categories as $category)
                        <option value="{{ $category->id }}">{{ $category->name }}</option>
                        @endforeach
                    </select>
                    @error('category')
                    <span class="text-xs text-red-600 dark:text-gray-400">{{ $message }}</span>
                    @enderror
                </label>
                <label class="block mt-4 text-sm">
                    <span class="text-gray-700 dark:text-gray-400">
                        Date de clotûre
                    </span>
                    <input wire:model="deadline" type="date" class="block w-full mt-1 text-sm  p-2 border-1 border-gray-400" />
                    @error('deadline')
                    <span class="text-xs text-red-600 dark:text-gray-400">{{ $message }}</span>
                    @enderror
                </label>
                <label class="block mt-4 text-sm">
                    <span class="text-gray-700 dark:text-gray-400">
                        Ville
                    </span>
                    <select wire:model="location" class="block w-full mt-1 text-sm p-2 border-1 border-gray-400">
                        <option>Sélectionner une ville</option>
                        @foreach(\App\Enums\CountryType::cases() as $country)
                        <option value="{{ $country->value }}">{{ $country->name }}</option>
                        @endforeach
                    </select>
                    @error('location')
                    <span class="text-xs text-red-600 dark:text-gray-400">{{ $message }}</span>
                    @enderror
                </label>
                <label class="block mt-4 text-sm">
                    <span class="text-gray-700 dark:text-gray-400">
                        Type de contrat
                    </span>
                    <select wire:model="type" class="block w-full mt-1 text-sm  p-2 border-1 border-gray-400">
                        <option>Type contrat</option>
                        @foreach(\App\Enums\ContractType::cases() as $contrat)
                        <option value="{{ $contrat->value }}">{{ $contrat->name }}</option>
                        @endforeach
                    </select>
                    @error('type')
                    <span class="text-xs text-red-600 dark:text-gray-400">{{ $message }}</span>
                    @enderror
                </label>
                <label class="block mt-4 text-sm">
                    <span class="text-gray-700 dark:text-gray-400">
                        Année d'expérience
                    </span>
                    <select wire:model="year_experience" class="block w-full mt-1 text-sm p-2 border-1 border-gray-400">
                        <option>Sélectionner une ville</option>
                        <option value="2">0 - 2 ans</option>
                        <option value="5">3 - 5 ans</option>
                        <option value="9">6 - 9 ans</option>
                        <option value="10">10 ans et plus</option>
                    </select>
                    @error('year_experience')
                    <span class="text-xs text-red-600 dark:text-gray-400">{{ $message }}</span>
                    @enderror
                </label>
            </div>
        </div>
        <div class="flex justify-between px-4 py-2 mt-4 bg-gray-200 ">
            <span>&nbsp;</span>
            <x-button wire:click.prevent="store">
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
    </form>

</div>