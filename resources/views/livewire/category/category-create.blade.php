<!-- Browser Stats -->
<div class="card">
    <div class="card-header">Nouvelle catégorie</div>

    <form class="">
        <div class="flex px-2 my-2">
            <div class="w-full md:w-1/2 mr-4 ml-4">
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
        <div class="px-2 my-2">
            <div class="w-full md:w-2/3 mr-4 ml-4">
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
        </div>
    </form>

</div>
<!-- end Browser Stats -->