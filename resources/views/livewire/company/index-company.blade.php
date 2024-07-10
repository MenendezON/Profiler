<div>
    <livewire:company.create-company />

    <ul>
    @foreach ($companies as $company)   
        <li>{{$company->name}} - {{$company->users[0]->email}}</li>
    @endforeach
    </ul>
</div>