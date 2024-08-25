@push('styles')
<style type="text/css">
    .nav-pills {
        margin-top: 0px;
        margin-bottom: 15px;
    }

    .icon-stats a {
        color: #e2e1de;
        margin-top: 0px;
        margin-bottom: 10px;

    }

    .card:hover .icon-stats a {
        color: #93999F;
    }

    .card-title {
        margin-top: 10px;
        color: #154B7C;
        font-size: 20px;
        font-weight: 500;
    }

    .can-timeline {
        border-style: dashed;
        margin-bottom: -20px;
        margin-top: 50px;
    }

    .stat-bg {
        background-color: white;
    }

    .stat-text {
        font-size: 10px;
    }

    .card-text {
        color: #e2e1de;
    }

    .card:hover .card-text a {
        color: #93999F;
    }

    .card:hover .blue a {
        color: #237ac6;
    }

    .card:hover .green a {
        color: #27ada6;
    }

    .job-code {
        font-size: 11px;
        color: #93999F;
    }

    .badge-jobcode {

        top: -10px;
        right: 0;
        position: absolute;
        border-radius: 0px;
    }

    .badge-published {
        background-color: #4AADA6;
        border-color: #4AADA6;
    }

    .badge-unpublished {
        background-color: #89949E;
        border-color: #89949E;
    }

    .badge-internal {
        background-color: #F8C558;
        border-color: #F8C558;
    }

    a:hover {
        text-decoration: none !important;
        /* Ensure no underline appears on hover for h6 */
    }

    @media only screen and (max-width: 768px) {

        .nav-pills .nav-item .nav-link {
            padding: 5px 5px;
            font-size: 10px;
        }
    }
</style>

<style>
    .offer-btn {
        background-color: aliceblue;
        color: #434343;
        text-transform: none;
    }
</style>
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
            <li class="breadcrumb-item"><a href="{{ route('dashboard') }}">Dashboard</a></li>
            <li class="breadcrumb-item active" aria-current="page">Job Openings</li>
        </ol>
    </nav>
    <ul class="nav nav-pills nav-pills-icons  justify-content-center" role="tablist">
        <li class="nav-item">
            <a class="nav-link " href="{{ route('openings', 'published') }}" role="tablist">
                <i class="now-ui-icons shopping_shop"></i> Published (2)
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link " href="{{ route('openings', 'internal') }}" role="tablist">
                <i class="now-ui-icons shopping_shop"></i> Internal (0)
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link " href="{{ route('openings', 'unpublished') }}" role="tablist">
                <i class="now-ui-icons ui-2_settings-90"></i> Unpublished (0)
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link active" href="{{ route('openings', 'all') }}" role="tablist">
                <i class="now-ui-icons objects_umbrella-13"></i> All (2)
            </a>
        </li>
    </ul>
    <div class="row">

        <a href="{{ route('opening.show', '6b0ac5c5ab0f8939442c42704c5493b0') }}">
            <div class="col-md-6 col-xl-4">
                <div style="width:100%; right:0px; background-color:#4AADA6; height:7px; "></div>
                <div class="card text-center">
                    <div class="card-body">

                        <span class="badge badge-pill badge-jobcode
                                                    badge-published
                                                ">Job Code: ME102</span>
                        <h4 class="card-title text-truncate">HR Assistant</h4>
                        <h6 class="card-subtitle mb-2 text-muted">
                            Dakar
                        </h6>
                        <p class="card-text"><i class="fas fa-calendar-check"></i> 08 Aug 2024 </p>
                        <hr class="can-timeline">
                        <div class="row icon-stats flex-row flex-nowrap">
                            <div class="col blue" data-toggle="tooltip" data-placement="top"
                                title="Applied">
                                <a href="{{ route('applications', ['pipeline'=>['new'], 'state'=>'all', 'opening_id'=>'6b0ac5c5ab0f8939442c42704c5493b0']) }}"
                                    target="_blank">
                                    <span class="stat-bg"><i class="fa fa-user"></i>
                                        0
                                    </span>
                                    <div class="stat-text">New</div>
                                </a>
                            </div>
                            <div class="col blue" data-toggle="tooltip" data-placement="top"
                                title="Shortlisted">
                                <a href="{{ route('applications', ['pipeline'=>['shortlisted'], 'state'=>'all', 'opening_id'=>'6b0ac5c5ab0f8939442c42704c5493b0']) }}"
                                    target="_blank">
                                    <span class="stat-bg"><i class="fa fa-user"></i>
                                        0
                                    </span>
                                    <div class="stat-text">Shortlisted</div>
                                </a>
                            </div>
                            <div class="col blue" data-toggle="tooltip" data-placement="top"
                                title="Interview">
                                <a href="{{ route('applications', ['pipeline'=>['interview'], 'state'=>'all', 'opening_id'=>'6b0ac5c5ab0f8939442c42704c5493b0']) }}"
                                    target="_blank">
                                    <span class="stat-bg"><i class="fa fa-user"></i>
                                        0
                                    </span>
                                    <div class="stat-text">Interview</div>
                                </a>
                            </div>
                            <div class="col blue" data-toggle="tooltip" data-placement="top"
                                title="Offered">
                                <a href="{{ route('applications', ['pipeline'=>['offered'], 'state'=>'all', 'opening_id'=>'6b0ac5c5ab0f8939442c42704c5493b0']) }}"
                                    target="_blank">
                                    <span class="stat-bg"><i class="fa fa-user"></i>
                                        0
                                    </span>
                                    <div class="stat-text">Offered</div>
                                </a>
                            </div>
                            <div class="col green" data-toggle="tooltip" data-placement="top" title="Hired">
                                <a href="{{ route('applications', ['pipeline'=>['hired'], 'state'=>'all', 'opening_id'=>'6b0ac5c5ab0f8939442c42704c5493b0']) }}"
                                    target="_blank">
                                    <span class="stat-bg"><i class="fa fa-user"></i>
                                        0
                                    </span>
                                    <div class="stat-text">Hired</div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a>


        <a href="{{route('opening.show', '2252b347a04841cf0c35467a47d2cc29')}}">
            <div class="col-md-6 col-xl-4">
                <div style="width:100%; right:0px; background-color:#4AADA6; height:7px; "></div>
                <div class="card text-center">
                    <div class="card-body">

                        <span class="badge badge-pill badge-jobcode
                                                    badge-published
                                                ">Job Code: ME101</span>
                        <h4 class="card-title text-truncate">IT Consultant</h4>
                        <h6 class="card-subtitle mb-2 text-muted">
                            Dakar
                        </h6>
                        <p class="card-text"><i class="fas fa-calendar-check"></i> 08 Aug 2024 </p>
                        <hr class="can-timeline">
                        <div class="row icon-stats flex-row flex-nowrap">
                            <div class="col blue" data-toggle="tooltip" data-placement="top"
                                title="Applied">
                                <a href="https://dash.recooty.com/applications?pipeline[]=new&state=all&opening_id=2252b347a04841cf0c35467a47d2cc29"
                                    target="_blank">
                                    <span class="stat-bg"><i class="fa fa-user"></i>
                                        0
                                    </span>
                                    <div class="stat-text">New</div>
                                </a>
                            </div>
                            <div class="col blue" data-toggle="tooltip" data-placement="top"
                                title="Shortlisted">
                                <a href="https://dash.recooty.com/applications?pipeline[]=shortlisted&state=all&opening_id=2252b347a04841cf0c35467a47d2cc29"
                                    target="_blank">
                                    <span class="stat-bg"><i class="fa fa-user"></i>
                                        0
                                    </span>
                                    <div class="stat-text">Shortlisted</div>
                                </a>
                            </div>
                            <div class="col blue" data-toggle="tooltip" data-placement="top"
                                title="Interview">
                                <a href="https://dash.recooty.com/applications?pipeline[]=interview&state=all&opening_id=2252b347a04841cf0c35467a47d2cc29"
                                    target="_blank">
                                    <span class="stat-bg"><i class="fa fa-user"></i>
                                        0
                                    </span>
                                    <div class="stat-text">Interview</div>
                                </a>
                            </div>
                            <div class="col blue" data-toggle="tooltip" data-placement="top"
                                title="Offered">
                                <a href="https://dash.recooty.com/applications?pipeline[]=offered&state=all&opening_id=2252b347a04841cf0c35467a47d2cc29"
                                    target="_blank">
                                    <span class="stat-bg"><i class="fa fa-user"></i>
                                        0
                                    </span>
                                    <div class="stat-text">Offered</div>
                                </a>
                            </div>
                            <div class="col green" data-toggle="tooltip" data-placement="top" title="Hired">
                                <a href="https://dash.recooty.com/applications?pipeline[]=hired&state=all&opening_id=2252b347a04841cf0c35467a47d2cc29"
                                    target="_blank">
                                    <span class="stat-bg"><i class="fa fa-user"></i>
                                        0
                                    </span>
                                    <div class="stat-text">Hired</div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a>

    </div>
</div>