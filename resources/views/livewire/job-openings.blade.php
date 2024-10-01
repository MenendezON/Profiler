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
    @if(Session::has('message'))
    <p class="alert {{ Session::get('alert-class', 'alert-info') }}">{{ Session::get('message') }}</p>
    @endif
    <ul class="nav nav-pills nav-pills-icons  justify-content-center" role="tablist">
        <li class="nav-item">
            <a class="nav-link {{($activeLink==='published')?'active':''}}" href="{{ route('openings', 'published') }}" role="tablist">
                <i class="now-ui-icons shopping_shop"></i> Published ({{$jobStatusCounts->firstWhere('status', 'published')->total_records ?? 0;}})
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link {{($activeLink==='internal')?'active':''}}" href="{{ route('openings', 'internal') }}" role="tablist">
                <i class="now-ui-icons shopping_shop"></i> Internal ({{$jobStatusCounts->firstWhere('status', 'internal')->total_records ?? 0;}})
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link {{($activeLink==='unpublished')?'active':''}}" href="{{ route('openings', 'unpublished') }}" role="tablist">
                <i class="now-ui-icons ui-2_settings-90"></i> Unpublished ({{$jobStatusCounts->firstWhere('status', 'unpublished')->total_records ?? 0;}})
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link {{($activeLink==='all')?'active':''}}" href="{{ route('openings', 'all') }}" role="tablist">
                <i class="now-ui-icons objects_umbrella-13"></i> All ({{$jobStatusCounts->sum('total_records');}})
            </a>
        </li>
    </ul>
    <div class="row">

        @foreach ($openings as $opening)
        <a href="{{ route('opening.show', $opening->id) }}">
            <div class="col-md-6 col-xl-4">
                <div style="width:100%; right:0px; height:7px;" class="
                    @if($opening->status==='published')
                        {{'badge-published'}}
                    @elseif($opening->status==='unpublished')
                        {{'badge-unpublished'}}
                    @else
                        {{'badge-internal'}}
                    @endif
                "></div>
                <div class="card text-center">
                    <div class="card-body">
                        <span class="badge badge-pill badge-jobcode 
                        @if($opening->status==='published')
                            {{'badge-published'}}
                        @elseif($opening->status==='unpublished')
                            {{'badge-unpublished'}}
                        @else
                            {{'badge-internal'}}
                        @endif
                        ">Job Code: {{$opening->code}}</span>
                        <h4 class="card-title text-truncate">{{$opening->title}}</h4>
                        <h6 class="card-subtitle mb-2 text-muted">
                            {{\App\Models\Location::findOrFail($opening->location_id)->city}}, {{\App\Models\Location::findOrFail($opening->location_id)->country}}
                        </h6>
                        <p class="card-text"><i class="fas fa-calendar-check"></i> {{$opening->created_at->diffForHumans()}}</p>
                        <hr class="can-timeline">
                        <div class="row icon-stats flex-row flex-nowrap">
                            <div class="col blue" data-toggle="tooltip" data-placement="top"
                                title="Applied">
                                <a href="{{ route('applications', ['pipeline'=>['new'], 'state'=>'all', 'opening_id'=>$opening->id]) }}"
                                    target="_blank">
                                    <span class="stat-bg"><i class="fa fa-user"></i>
                                        {{$applicantStatusCounts->Where('opening_id', $opening->id)->firstWhere('stage', 'new')->total_records ?? 0}}
                                    </span>
                                    <div class="stat-text">New</div>
                                </a>
                            </div>
                            <div class="col blue" data-toggle="tooltip" data-placement="top"
                                title="Shortlisted">
                                <a href="{{ route('applications', ['pipeline'=>['shortlisted'], 'state'=>'all', 'opening_id'=>$opening->id]) }}"
                                    target="_blank">
                                    <span class="stat-bg"><i class="fa fa-user"></i>
                                        {{$applicantStatusCounts->Where('opening_id', $opening->id)->firstWhere('stage', 'shortlisted')->total_records ?? 0}}
                                    </span>
                                    <div class="stat-text">Shortlisted</div>
                                </a>
                            </div>
                            <div class="col blue" data-toggle="tooltip" data-placement="top"
                                title="Interview">
                                <a href="{{ route('applications', ['pipeline'=>['interview'], 'state'=>'all', 'opening_id'=>$opening->id]) }}"
                                    target="_blank">
                                    <span class="stat-bg"><i class="fa fa-user"></i>
                                        {{$applicantStatusCounts->Where('opening_id', $opening->id)->firstWhere('stage', 'interview')->total_records ?? 0}}
                                    </span>
                                    <div class="stat-text">Interview</div>
                                </a>
                            </div>
                            <div class="col blue" data-toggle="tooltip" data-placement="top"
                                title="Offered">
                                <a href="{{ route('applications', ['pipeline'=>['offered'], 'state'=>'all', 'opening_id'=>$opening->id]) }}"
                                    target="_blank">
                                    <span class="stat-bg"><i class="fa fa-user"></i>
                                        {{$applicantStatusCounts->Where('opening_id', $opening->id)->firstWhere('stage', 'offered')->total_records ?? 0}}
                                    </span>
                                    <div class="stat-text">Offered</div>
                                </a>
                            </div>
                            <div class="col green" data-toggle="tooltip" data-placement="top" title="Hired">
                                <a href="{{ route('applications', ['pipeline'=>['hired'], 'state'=>'all', 'opening_id'=>$opening->id]) }}"
                                    target="_blank">
                                    <span class="stat-bg"><i class="fa fa-user"></i>
                                        {{$applicantStatusCounts->Where('opening_id', $opening->id)->firstWhere('stage', 'hired')->total_records ?? 0}}
                                    </span>
                                    <div class="stat-text">Hired</div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a>
        @endforeach

    </div>
</div>