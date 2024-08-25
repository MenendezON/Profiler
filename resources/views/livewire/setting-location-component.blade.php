@push('styles')
<style>
    .nav-shortcuts li {
        margin-top: -15px;
        margin-left: 5px;

    }

    .btn-black {
        background-color: #161616;
    }

    .btn-darkblue {
        background-color: #233c63; 
    }

    .btn-darkblue:hover !important {
        background-color: #135b8e;
    }

    .dropdown-menu .dropdown-item:hover,
    .dropdown-menu .dropdown-item:focus {
        background-color: #2c7db7;
    }

    .navbar.navbar-absolute {
        padding-top: 7px;
        padding-bottom: 7px;
    }
</style>
@endpush
<div class="content">
    <nav aria-label="breadcrumb" role="navigation">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="{{route('dashboard')}}">Dashboard</a></li>
            <li class="breadcrumb-item"><a href="{{route('settings')}}">Settings</a></li>
            <li class="breadcrumb-item active" aria-current="page">Locations</li>
        </ol>
    </nav>
    <div class="row">

        <div class="col-md-4" id="view_location_dfcebbaf79842c2e6fca7b77741de3a6">
            <div class="card text-center">
                <div class="card-body">
                    <h4 class="card-title">SN Office</h4>
                    <p class="card-text">Ngor, Dakar<br>
                        Dakar, Dakar<br>
                        Senegal - 15000</p>
                    <a href="{{route('settings.locations.edit', 'dfcebbaf79842c2e6fca7b77741de3a6')}}" class="btn btn-primary">Edit</a> <a href="#" id="delete_location_dfcebbaf79842c2e6fca7b77741de3a6" onclick="action(this)" class="btn">Delete</a>
                </div>
            </div>
        </div>


        <div class="col-md-4">
            <div class="card text-center">
                <div class="card-body">
                    <br>
                    <h4 class="card-title"><i class="fas fa-map-marker-alt fa-3x text-success"></i></h4>
                    <br>
                    <a href="{{ route('settings.locations.new') }}" class="btn btn-info">Add Company Location</a>
                </div>
            </div>
        </div>

    </div>
</div>