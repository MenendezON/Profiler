@push('styles')
<style>
    .nav-shortcuts li{
        margin-top:-15px;
        margin-left:5px;
      
    }
    .btn-black {
      background-color: #161616;
    }
    .btn-darkblue {
      background-color: #233c63;
    }
    .btn-darkblue:hover !important{
      background-color: #135b8e;
    }
    .dropdown-menu .dropdown-item:hover, .dropdown-menu .dropdown-item:focus {
    background-color: #2c7db7;
    }

    .navbar.navbar-absolute {
      padding-top:7px;
      padding-bottom: 7px;
    }
  </style>
@endpush

<div class="content">
    <nav aria-label="breadcrumb" role="navigation">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="{{route('dashboard')}}">Dashboard</a></li>
            <li class="breadcrumb-item"><a href="{{route('settings')}}">Settings</a></li>
            <li class="breadcrumb-item"><a href="{{route('settings.departments')}}">Departments</a></li>
            <li class="breadcrumb-item active" aria-current="page">Add Department</li>
        </ol>
    </nav>
    <div class="row">
        <div class="col-md-5">
            <div class="card ">
                <div class="card-header ">
                    <h4 class="card-title">Add New Department</h4>
                </div>
                <div class="card-body ">
                    <form method="post" action="https://dash.recooty.com/settings/departments/new">
                        <input type="hidden" name="_token" value="r9NQWCLvHcGjF0cCDSDWRgHvYHTEAqR09yAVUBD8"> <label for="location_name">Department Name <span>*</span></label>
                        <div class="form-group">
                            <input type="text" class="form-control" name="department_name" placeholder="eg. Human Resources" required="">
                        </div>
                        <button type="submit" class="btn btn-info btn-wd">Add Department</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>