<!-- start quick Info -->
<div class="container px-6 mx-auto">

    @if(session('success'))
    <div class="flex justify-between w-full bg-green-100 rounded-md mt-4 p-2 shadow-xs">
        <span class="text-green-500 text-md">{{ session('success') }}</span>
        <button class="text-green-500" wire:click="removeflash">x</button>
    </div>
    @endif

    <div class="flex justify-between my-3">
        <x-button wire:click="showCreatePostModal" class="mb-2">
            {{ __("Offre d'emploi") }}
        </x-button>
        <!-- Create post modal -->
        <x-dialog-modal wire:model="createPostModal">
            <x-slot name="title">
                {{ __('Créer une offre') }}
            </x-slot>

            <form>
                <x-slot name="content">
                    <div class="flex">
                        <div class="w-2/3 md:w-2/3 mr-4 ml-4">
                            <label class="block mt-4 text-sm">
                                <input wire:model="title" type="text" placeholder="Titre de l'offre" class="block w-full mt-1 text-sm p-2 border-1 border-gray-400" />
                                @error('title')
                                <span class="text-xs text-red-600 dark:text-gray-400">{{ $message }}</span>
                                @enderror
                            </label>

                            <div class="card p-2 mt-6">
                                <h2>Description de l'offre d'emploi</h2>
                                <label class="block text-sm">
                                    <textarea wire:model="description" class="block w-full h-x hover:h-full mt-1 p-2 border-1 border-gray-400 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"></textarea>
                                    @error('description')
                                    <span class="text-xs text-red-600 dark:text-gray-400">{{ $message }}</span>
                                    @enderror
                                </label>
                            </div>
                            <div class="card p-2 mt-6">
                                <h2>Pré-requis du poste</h2>
                                <label class="block text-sm">
                                    <textarea wire:model="prerequis" class="block w-full h-x hover:h-full mt-1 p-2 border-1 border-gray-400 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray form-input"></textarea>
                                    @error('prerequis')
                                    <span class="text-xs text-red-600 dark:text-gray-400">{{ $message }}</span>
                                    @enderror
                                </label>
                            </div>
                        </div>
                        <div class="card p-3 w-1/3 md:w-1/3 mr-4 ml-4">
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
                                    <option>Sélectionner une catégorie</option>
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
                                <select wire:model="experience_level" class="block w-full mt-1 text-sm p-2 border-1 border-gray-400">
                                    <option>Sélectionner le niveau d'expérience</option>
                                    @foreach(\App\Enums\ExperienceType::cases() as $exp)
                                    <option value="{{ $exp->value }}">{{ $exp->name }}</option>
                                    @endforeach
                                </select>
                                @error('experience_level')
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
    <div class="col-span-2 xl:col-span-1">
        @foreach ($posts as $post )
        <div class="card w-full mb-2">
            <div class="card-header font-bold">
                <span class="bg-gray-200 px-3 py-2 rounded-md">{{$post->location}}</span> |
                <x-nav-link href="{{ route('post-show', ['slug' => $post->slug]) }}" class="text-lg text-gray-900" wire:navigate>
                    {{$post->title}}
                </x-nav-link>
            </div>
            <div class="flex px-6 py-2 justify-between">
                <span>Date de publication : {{\Carbon\Carbon::parse($post->created_at)->format('d M Y')}}</span>
                <span>Date de cloture : {{\Carbon\Carbon::parse($post->deadline)->format('d M Y')}}</span>
            </div>
        </div>

        @endforeach

    </div>
</div>

<!-- end quick Info -->