@push('styles')
<style>
    .card-settings :hover {
    background-color: #27ada6;
    color:white;
    text-decoration: none;
    border-radius: 5px;

    }
    .card-setting:hover .card-footer .stats {
    color: white !important;
    }

    .card-setting{
    color: #6a6a6a;
    }

    .card-settings .card-title{
    font-size: 20px !important;
    }
    </style>
<style>
      .offer-btn {
          background-color: aliceblue;
          color: #434343;
          text-transform:none;
      }
      
  </style>
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
            <li class="breadcrumb-item"><a href="{{ route('dashboard') }}">Dashboard</a></li>
            <li class="breadcrumb-item active" aria-current="page">Settings</li>
        </ol>
    </nav>
    <div class="row">
        <!--div class="col-lg-4 col-md-6 col-sm-6 card-settings">
            <a href="https://dash.recooty.com/settings/preferences">
                <div class="card card-stats card-setting">
                    <div class="card-body ">
                        <div class="row">
                            <div class="col-12 col-md-12">
                                <div class="text-center icon-warning">
                                    <i class="icon-big fas fa-sliders-h"></i>
                                </div>
                            </div>
                            <div class="col-12 col-md-12">
                                <div class="numbers text-center">
                                    <p class="card-title">Preferences</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer text-center">
                        <hr>
                        <div class="stats">
                            Language & notification preferences
                        </div>
                    </div>
                </div>
            </a>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-6 card-settings">
            <a href="https://dash.recooty.com/settings/job-widget">
                <div class="card card-stats card-setting">
                    <div class="card-body ">
                        <div class="row">
                            <div class="col-12 col-md-12">
                                <div class="text-center icon-warning">
                                    <i class="icon-big fas fa-laptop-code"></i>
                                </div>
                            </div>
                            <div class="col-12 col-md-12">
                                <div class="numbers text-center">
                                    <p class="card-title">Job Widget</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer text-center">
                        <hr>
                        <div class="stats">
                            Embed jobs on website & Wordpress plugin
                        </div>
                    </div>
                </div>
            </a>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-6 card-settings">
            <a href="https://dash.recooty.com/settings/career-page">
                <div class="card card-stats card-setting">
                    <div class="card-body ">
                        <div class="row">
                            <div class="col-12 col-md-12">
                                <div class="text-center icon-warning">
                                    <i class="icon-big fa fas fa-newspaper"></i>
                                </div>
                            </div>
                            <div class="col-12 col-md-12">
                                <div class="numbers text-center">
                                    <p class="card-title">Career Page</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer text-center">
                        <hr>
                        <div class="stats">
                            Company profile & logo
                        </div>
                    </div>
                </div>
            </a>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-6 card-settings">
            <a href="https://dash.recooty.com/settings/api">
                <div class="card card-stats card-setting">
                    <div class="card-body ">
                        <div class="row">
                            <div class="col-12 col-md-12">
                                <div class="text-center icon-warning">
                                    <i class="icon-big fas fa-code"></i>
                                </div>
                            </div>
                            <div class="col-12 col-md-12">
                                <div class="numbers text-center">
                                    <p class="card-title">API</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer text-center">
                        <hr>
                        <div class="stats">
                            API key & documentation
                        </div>
                    </div>
                </div>
            </a>
        </div-->
        <div class="col-lg-4 col-md-6 col-sm-6 card-settings">
            <a href="{{ route('settings.locations') }}">
                <div class="card card-stats card-setting">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12 col-md-12">
                                <div class="text-center icon-warning">
                                    <i class="icon-big fas fa-map-marker-alt"></i>
                                </div>
                            </div>
                            <div class="col-12 col-md-12">
                                <div class="numbers text-center">
                                    <p class="card-title">Locations</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer text-center">
                        <hr>
                        <div class="stats">
                            Company offices
                        </div>
                    </div>
                </div>
            </a>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-6 card-settings">
            <a href="{{ route('settings.departments') }}">
                <div class="card card-stats card-setting">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12 col-md-12">
                                <div class="text-center icon-warning">
                                    <i class="icon-big far fa-building"></i>
                                </div>
                            </div>
                            <div class="col-12 col-md-12">
                                <div class="numbers text-center">
                                    <p class="card-title">Departments</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer text-center">
                        <hr>
                        <div class="stats">
                            Internal company departments
                        </div>
                    </div>
                </div>
            </a>
        </div>
        <!--div class="col-lg-4 col-md-6 col-sm-6 card-settings">
            <a href="https://dash.recooty.com/settings/subscription">
                <div class="card card-stats card-setting">
                    <div class="card-body ">
                        <div class="row">
                            <div class="col-12 col-md-12">
                                <div class="text-center icon-warning">
                                    <i class="icon-big fas fa-credit-card"></i>
                                </div>
                            </div>
                            <div class="col-12 col-md-12">
                                <div class="numbers text-center">
                                    <p class="card-title">Billing</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer text-center">
                        <hr>
                        <div class="stats">
                            Manage subscription & payments
                        </div>
                    </div>
                </div>
            </a>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-6 card-settings">
            <a href="https://dash.recooty.com/settings/integrations">
                <div class="card card-stats card-setting">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12 col-md-12">
                                <div class="text-center icon-warning">
                                    <i class="icon-big fas fa-plug"></i>
                                </div>
                            </div>
                            <div class="col-12 col-md-12">
                                <div class="numbers text-center">
                                    <p class="card-title">Integrations</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer text-center">
                        <hr>
                        <div class="stats">
                            Linkedin, Slack integration
                        </div>
                    </div>
                </div>
            </a>
        </div-->
        <div class="col-lg-4 col-md-6 col-sm-6 card-settings">
            <a href="https://dash.recooty.com/settings/users">
                <div class="card card-stats card-setting">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12 col-md-12">
                                <div class="text-center icon-warning">
                                    <i class="icon-big fas fa-users"></i>
                                </div>
                            </div>
                            <div class="col-12 col-md-12">
                                <div class="numbers text-center">
                                    <p class="card-title">Users</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer text-center">
                        <hr>
                        <div class="stats">
                            Manage teammates
                        </div>
                    </div>
                </div>
            </a>
        </div>
        <div class="col-lg-4 col-md-6 col-sm-6 card-settings">
            <a href="{{ route('settings.screenquestion') }}">
                <div class="card card-stats card-setting">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12 col-md-12">
                                <div class="text-center icon-warning">
                                    <i class="icon-big fas fa-file-invoice"></i>
                                </div>
                            </div>
                            <div class="col-12 col-md-12">
                                <div class="numbers text-center">
                                    <p class="card-title">Screening Questions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer text-center">
                        <hr>
                        <div class="stats">
                            Customize application form
                        </div>
                    </div>
                </div>
            </a>
        </div>
        <!--div class="col-lg-4 col-md-6 col-sm-6 card-settings">
            <a href="https://dash.recooty.com/settings/imports">
                <div class="card card-stats card-setting">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12 col-md-12">
                                <div class="text-center icon-warning">
                                    <i class="icon-big fas fa-file-import"></i>
                                </div>
                            </div>
                            <div class="col-12 col-md-12">
                                <div class="numbers text-center">
                                    <p class="card-title">Bulk Imports</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer text-center">
                        <hr>
                        <div class="stats">
                            Applications import
                        </div>
                    </div>
                </div>
            </a>
        </div-->
        <div class="col-lg-4 col-md-6 col-sm-6 card-settings">
            <a href="{{ route('settings.emailtemplate') }}">
                <div class="card card-stats card-setting">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12 col-md-12">
                                <div class="text-center icon-warning">
                                    <i class="icon-big far fa-envelope"></i>
                                </div>
                            </div>
                            <div class="col-12 col-md-12">
                                <div class="numbers text-center">
                                    <p class="card-title">Email Templates</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer text-center">
                        <hr>
                        <div class="stats">
                            Customize email content
                        </div>
                    </div>
                </div>
            </a>
        </div>
        <!--div class="col-lg-4 col-md-6 col-sm-6 card-settings">
            <a href="https://dash.recooty.com/settings/migrate">
                <div class="card card-stats card-setting">
                    <div class="card-body ">
                        <div class="row">
                            <div class="col-12 col-md-12">
                                <div class="text-center icon-warning">
                                    <i class="icon-big fas fa-file-export"></i>
                                </div>
                            </div>
                            <div class="col-12 col-md-12">
                                <div class="numbers text-center">
                                    <p class="card-title">Migrate to Recooty AI</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer text-center">
                        <hr>
                        <div class="stats">
                            Generate a key to export the data to Recooty AI.
                        </div>
                    </div>
                </div>
            </a>
        </div-->
        <div class="col-lg-4 col-md-6 col-sm-6 card-settings">
            <a href="{{ route('settings.activitylog') }}">
                <div class="card card-stats card-setting">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-12 col-md-12">
                                <div class="text-center icon-warning">
                                    <i class="icon-big fas fa-history"></i>
                                </div>
                            </div>
                            <div class="col-12 col-md-12">
                                <div class="numbers text-center">
                                    <p class="card-title">Activity Logs</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer text-center">
                        <hr>
                        <div class="stats">
                            Log of recent activities
                        </div>
                    </div>
                </div>
            </a>
        </div>
    </div>
</div>