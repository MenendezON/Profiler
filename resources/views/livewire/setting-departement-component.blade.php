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
            <li class="breadcrumb-item active" aria-current="page">Departments</li>
        </ol>
    </nav>
    <div class="row">
        <div class="col-md-8 card-settings">
            <div class="card card-stats card-setting">
                <div class="card-body">
                    <h4 class="card-title">Departments</h4>
                    <div class="toolbar">
                        <a href="{{route('settings.departments.new')}}"><button class="btn btn-fill btn-primary">Add New Department</button></a>
                    </div>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>Department Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($departments as $index => $department)
                            <tr>
                                <td>{{$index+1}}</td>
                                <td>{{$department->name}}</td>
                                <td>
                                    <a href="{{route('settings.departments.edit', $department->id)}}"><button class="btn btn-sm btn-warning">Edit</button></a>
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>