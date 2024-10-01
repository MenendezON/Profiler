@push('styles')
<style>
    .job_desc {
        padding-right: 10px;
        line-height: 25px;
        display: inline-block;
    }

    .card-title-app {
        margin-top: 0px;
        margin-bottom: 0px;
    }

    .status {
        font-size: 1.2em;
        margin-bottom: -40px;
    }

    .card-hover:hover {
        background-color: #27ada6;
        color: white;
    }

    .card-hover:hover i {
        color: white !important;
    }

    .bg-dash {
        border-width: 1px;
        border-style: dashed;
        border-color: #DDDDDD;
        position: relative;
        margin-top: 60px;
        margin-bottom: -50px;
    }

    .readmore {
        margin-top: 10px;
    }

    .card-subtitle {
        color: #929494;
        font-size: 13px;
    }
</style>
<style type="text/css">
    .opening-title {
        margin-top: 15px;
        color: #000000;
        font-size: 16px;
        font-weight: 500;
        margin-bottom: -10px;
        margin-top: -20px;
    }

    .candidates {
        list-style: none;
        margin-left: -40px;
    }

    .candidates li {
        margin-bottom: 5px;
        margin-left: 2px;
        margin-right: 2px;
        font-size: 12px;
        font-weight: 600;
        text-align: center;
        background-color: #43A9CD;
        padding-top: 5px;
        padding-bottom: 5px;
        border-radius: 5px;
    }

    .candidates li a {
        color: #ffffff;
        text-decoration: none;

    }

    .candidates i {
        font-size: 8px;
    }

    .scroll {
        max-height: 500px;
        height: 400px;
        overflow-y: auto;
    }

    .card-bg {
        background-color: #F4F3EF;
        border: solid;
        border-top: 0px;
        border-color: #F4F3EF;
    }

    .card2 {
        border: solid;
        border-top: 0px;
        border-color: #F4F3EF;
        text-align: center;
    }

    .card2 .card-title {
        margin-top: -10px !important;
        margin-bottom: 0px !important;
        font-size: 20px;
        font-weight: 500;
    }

    .card-text {
        color: #94918D;
        margin-bottom: -10px !important;
    }

    .location {
        font-size: 10px;
    }

    .heading-card a {
        text-decoration: none;
    }

    .heading-card .nc-icon {
        color: #EF6739;
    }

    .pipeline .col {
        padding-left: 5px;
        padding-right: 5px;
    }

    .pipeline .row {
        padding-left: 10px;
        padding-right: 10px;
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
</style>
<style>
    .pipeline {
        text-align: center;
        padding-bottom: 20px;
        padding-left: 15px;
        padding-right: 15px;
    }

    .pipeline-item {

        padding: 10px;
    }

    .pipeline-item a {
        text-decoration: none;
    }

    .stage {
        background-color: #fff;
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .warning {
        background-color: #2c779c;
        color: #ffffff;
        padding: 0.15rem 1rem;
        font-weight: 800;
    }

    .warning button {
        background-color: #ffffff !important;
        color: #2c779c;
        font-weight: 800;
        text-transform: capitalize;
    }

    .card-title span {
        font-size: 0.5em;
        vertical-align: middle;
    }
</style>
<style>
    @media only screen and (max-width: 1200px) {

        .card-title {
            font-size: 1.5em;
        }
    }

    @media only screen and (max-width: 768px) {
        .status {
            font-size: 1em;
            margin-bottom: 0px;
        }
    }

    @media all and (max-width:480px) {
        .big-button-mobile {
            width: 100%;
            display: block;
        }
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
            <li class="breadcrumb-item">
                <a href="{{ route('dashboard') }}">Dashboard</a>
            </li>
            <li class="breadcrumb-item">
                <a href="{{ route('openings', 'all') }}">Openings</a>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
                {{$opening->title}}
            </li>
        </ol>
    </nav>
    <div class="row">
        <div class="col-lg-9 col-md-8">
            <div class="warning">&nbsp;</div>
            <div class="card">
                <div class="card-header card-header-primary text-right">
                    <div class="status">
                        <span class="badge badge-pill 
                         @if($opening->status==='published')
                            {{'badge-published'}}
                        @elseif($opening->status==='unpublished')
                            {{'badge-unpublished'}}
                        @else
                            {{'badge-internal'}}
                        @endif
                        ">{{$opening->status}}</span>
                    </div>
                    <div>
                        <h3 class="card-title text-center">
                            {{$opening->title}}
                            <span>(<i class="fas fa-hashtag"></i> {{$opening->code}})</span>
                        </h3>
                    </div>
                </div>
                <div class="card-body">
                    <h6 class="card-subtitle mb-2 text-center">
                        <span class="job_desc"><i class="fas fa-map-marker-alt"></i>
                            {{\App\Models\Location::findOrFail($opening->location_id)->city}}
                        </span>
                        <span class="job_desc"><i class="fas fa-user-graduate"></i> Entry Level</span>
                        <span class="job_desc"><i class="fas fa-briefcase"></i> {{$opening->type}}</span>
                        <span class="job_desc"><i class="fas fa-building"></i> {{\App\Models\Department::findOrFail($opening->department_id)->name}}</span>
                        <span class="job_desc"><i class="fas fa-landmark"></i> {{$opening->industry}}</span>
                    </h6>
                    <hr />
                    <div class="card card-plain pt-3">
                        <article>
                            {{html_entity_decode($opening->description)}}
                        </article>
                    </div>
                </div>
                <div class="card-footer text-muted">
                    <div class="row">
                        <div class="col">
                            <a href="{{ route('opening.edit', $opening->id) }}"><button type="button" class="btn btn-default m-1 big-button-mobile">Edit Opening</button></a>
                            <a name id class="btn btn-danger m-1 big-button-mobile" href="https://dash.recooty.com/openings/details/6b0ac5c5ab0f8939442c42704c5493b0/unpublish" role="button">{{($opening->status === 'published')?'Unpublish':'republish'}}</a>
                            <a name id class="btn btn-warning m-1 big-button-mobile" href="https://dash.recooty.com/openings/details/6b0ac5c5ab0f8939442c42704c5493b0/internal" role="button">{{($opening->status === 'internal')?'Unpublish':'Move to internal'}}</a>
                        </div>
                    </div>
                    <hr />
                    <div class="row">
                        <div class="col-6">
                            <span class="job_desc"><i class="fas fa-calendar-alt"></i> {{$opening->created_at->diffForHumans()}}
                            </span>
                        </div>
                        <div class="col-6 text-right">
                            <span class="job_desc"><i class="fas fa-user"></i> {{\App\Models\User::findOrFail($opening->user_id)->first_name}} {{\App\Models\User::findOrFail($opening->user_id)->last_name}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row pipeline">
                <div class="col-6 col-sm-4 col-lg-2 pipeline-item" data-toggle="tooltip" data-placement="top" title="Applied">
                    <a href="{{ route('applications', ['pipeline'=>['new'], 'state'=>'all', 'opening_id'=>$opening->id]) }}" target="_blank">
                        <div class="stage">
                            <span class="stat-bg"><i class="fa fa-user"></i>
                               {{$applicantStatusCounts->Where('opening_id', $opening->id)->firstWhere('stage', 'new')->total_records ?? 0}}
                            </span>
                            <div class="stat-text">New</div>
                        </div>
                    </a>
                </div>
                <div
                    class="col-6 col-sm-4 col-lg-2 pipeline-item"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Shorlisted">
                    <a
                        href="{{ route('applications', ['pipeline'=>['shortlisted'], 'state'=>'all', 'opening_id'=>$opening->id]) }}"
                        target="_blank">
                        <div class="stage">
                            <span class="stat-bg"><i class="fa fa-user"></i>
                                {{$applicantStatusCounts->Where('opening_id', $opening->id)->firstWhere('stage', 'shortlisted')->total_records ?? 0}}
                            </span>
                            <div class="stat-text">Shorlisted</div>
                        </div>
                    </a>
                </div>
                <div
                    class="col-6 col-sm-4 col-lg-2 pipeline-item"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Interview">
                    <a href="{{ route('applications', ['pipeline'=>['interview'], 'state'=>'all', 'opening_id'=>$opening->id]) }}" target="_blank">
                        <div class="stage">
                            <span class="stat-bg"><i class="fa fa-user"></i>
                               {{$applicantStatusCounts->Where('opening_id', $opening->id)->firstWhere('stage', 'interview')->total_records ?? 0}}
                            </span>
                            <div class="stat-text">Interview</div>
                        </div>
                    </a>
                </div>
                <div
                    class="col-6 col-sm-4 col-lg-2 pipeline-item"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Offered">
                    <a
                        href="{{ route('applications', ['pipeline'=>['offered'], 'state'=>'all', 'opening_id'=>$opening->id]) }}"
                        target="_blank">
                        <div class="stage">
                            <span class="stat-bg"><i class="fa fa-user"></i>
                                {{$applicantStatusCounts->Where('opening_id', $opening->id)->firstWhere('stage', 'offered')->total_records ?? 0}}
                            </span>
                            <div class="stat-text">Offered</div>
                        </div>
                    </a>
                </div>
                <div
                    class="col-6 col-sm-4 col-lg-2 pipeline-item"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Hired">
                    <a
                        href="{{ route('applications', ['pipeline'=>['hired'], 'state'=>'all', 'opening_id'=>$opening->id]) }}"
                        target="_blank">
                        <div class="stage">
                            <span class="stat-bg"><i class="fa fa-user"></i>
                               {{$applicantStatusCounts->Where('opening_id', $opening->id)->firstWhere('stage', 'hired')->total_records ?? 0}}
                            </span>
                            <div class="stat-text">Hired</div>
                        </div>
                    </a>
                </div>
                <div
                    class="col-6 col-sm-4 col-lg-2 pipeline-item"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Rejected">
                    <a href="{{ route('applications', ['pipeline'=>['rejected'], 'state'=>'all', 'opening_id'=>$opening->id]) }}"
                        target="_blank">
                        <div class="stage">
                            <span class="stat-bg"><i class="fa fa-user"></i>
                                {{$applicantStatusCounts->Where('opening_id', $opening->id)->firstWhere('stage', 'rejected')->total_records ?? 0}}
                            </span>
                            <div class="stat-text">Rejected</div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
        <div class="col-lg-3 col-md-4">
            <div class="card">
                <div class="card-body">
                    <h3 class="card-title">Share</h3>
                    <div class="row">
                        <div class="col-md-12">
                            <div
                                class="sharethis-inline-share-buttons"
                                data-url="https://rcty.co/w3Te7nd"
                                data-title="Job opening for HR Assistant in Mercy Corps. Apply here"></div>
                        </div>
                    </div>
                    <div class="row" style="margin-top: 10px">
                        <div class="col-md-12">
                            <div class="form-group">
                                <input
                                    class="form-control"
                                    style="font-size: 18px"
                                    value="https://rcty.co/w3Te7nd"
                                    onfocus="this.select()" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                    <h3 class="card-title">Partner Job Boards</h3>
                    <article>
                        <ul>
                            <li>Indeed</li>
                            <li>LinkedIn Jobs</li>
                            <li>Glassdoor</li>
                            <li>Google for Jobs</li>
                            <li>Monster</li>
                            <li>Career Jet</li>
                            <li>Zip Recruiter</li>
                            <li>Jora</li>
                            <li>Jooble</li>
                            <li>Dr.Job</li>
                            <li>Adzuna</li>
                            <li>Recooty Jobs</li>
                            <li>& More</li>
                        </ul>
                    </article>
                    <hr />
                    <h5>Reach More Candidates!</h5>
                    <a
                        href="https://dash.recooty.com/openings/details/6b0ac5c5ab0f8939442c42704c5493b0/publishonjobboard"><button class="btn btn-success btn-block">
                            Post on Partner Job Boards
                        </button></a>
                    <p>
                        <a
                            href="https://recooty.com/blog/user-guide/job-posting-guidelines-on-recooty/"
                            target="_blank"><small>Job Posting Guidelines</small></a>
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>

@push('scripts')
<script type="text/javascript">
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $(document).ajaxStart(function() {
        Pace.restart();
    });
</script>
<script src="{{ URL::asset('assets/js/openings.js?id=494bbf4318685ed99870') }}"></script>
<script src="{{ URL::asset('assets/js/plugins/readmore.js') }}"></script>
<script>
    new Readmore('article', {
        speed: 75,
        collapsedHeight: 100,
        lessLink: '<a href="#">Read less <i class="fas fa-caret-up"></i></a>',
        moreLink: '<a href="#" class="readmore">Read more <i class="fas fa-caret-down"></i></a>'
    });
</script>
@endpush