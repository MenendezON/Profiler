<!-- start quick Info -->
<div class="grid grid-cols-3 gap-6 mt-3 xl:grid-cols-1">
    @if(session('success'))
    <div class="flex justify-between w-full bg-green-100 rounded-md mt-4 p-4 shadow-xs">
        <span class="text-green-500 text-md">{{ session('success') }}</span>
        <button class="text-green-500" wire:click="removeflash">x</button>
    </div>
    @endif

    @livewire('category.category-create')

    @livewire('category.category-list')

</div>
<!-- end quick Info -->