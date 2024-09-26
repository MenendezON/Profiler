<?php

namespace App\Livewire;

use Livewire\Attributes\Layout;
use Livewire\Component;

#[Layout('layouts/app')]
class SettingActivityLogsComponent extends Component
{
    public function render()
    {
        return view('livewire.setting-activity-logs-component');
    }
}
