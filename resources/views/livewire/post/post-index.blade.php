<!-- start quick Info -->
<div>
    <div class="flex justify-between my-3">
        <x-nav-link href="{{ route('post-create') }}" class="flex items-center text-sm" wire:navigate>
            Ajouter une offre
        </x-nav-link>
    </div>
    <div class="grid grid-cols-3 gap-6 mt-3 xl:grid-cols-1">
        @livewire('post.post-filter')
        @livewire('post.post-list')
    </div>
</div>

<!-- end quick Info -->