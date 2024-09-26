@push('styles')
<style type="text/css">
  .nav-pills {
    margin-top: 0px;
    margin-bottom: 10px;
  }

  .badge-stage {
    padding: 1px 5px;
    font-size: 10px;
  }

  .badge-skill {
    padding: 1px 5px;
    font-size: 10px;
    background-color: #bdb6ad !important;
    border-color: #bdb6ad !important;
  }

  .badge-source {
    background-color: #bdb6ad !important;
    border-color: #bdb6ad !important;
    padding: 1px 5px;
    font-size: 10px;
  }

  .nav-pills .nav-item:first-child .nav-link,
  .nav-pills .nav-item:last-child .nav-link {
    border-radius: 0 0 0 0 !important;
    margin: 0;
  }

  .nav-pills .nav-item .nav-link {
    font-weight: 500 !important;
    padding: 5px 10px !important;
    font-size: 13px;
  }

  .nav-pills-success .nav-item .nav-link.active {
    border-left-color: #ffffff;
    border-right-color: #ffffff;
  }
</style>
<style>
  .applicant_name {
    /* font-size: 18px; */
    font-weight: 500;
    color: #044b7c;
    padding-left: 10px;
    text-transform: capitalize;
    white-space: nowrap;
  }

  .app_rating {
    padding-left: 12px;
    letter-spacing: 5px;
    color: #ffb500;
    display: inline-block;
    white-space: nowrap;
  }

  .app-date {
    white-space: nowrap;
  }

  .stages-filter {
    margin-bottom: 10px;
  }

  .sources-filter {
    margin-top: 10px;
  }
</style>
<link href="{{ URL::asset('assets/css/application.css?ver=1.5')}}" rel="stylesheet" />
<link rel="stylesheet" type="text/css"
  href="https://cdn.datatables.net/v/bs4/jszip-2.5.0/dt-1.10.18/b-1.5.6/b-html5-1.5.6/r-2.2.2/rg-1.1.0/sc-2.0.0/datatables.min.css" />
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
      <li class="breadcrumb-item">
        <a href="{{route('dashboard')}}">Dashboard</a>
      </li>
      <li class="breadcrumb-item active" aria-current="page">
        Applications
      </li>
    </ol>
  </nav>
  <div class="row">
    <div class="col-lg-3">
      <div class="card">
        <div class="card-body">
          <div id="filters" role="tablist" aria-multiselectable="true" class="card-collapse">
            <div class="card card-plain">
              <div class="card-header" role="tab" id="filterHeading">
                <a class="collapsed" data-toggle="collapse" data-parent="#filters" href="#toggleFilters"
                  aria-expanded="false" aria-controls="toggleFilters">
                  Application Filters
                  <i class="nc-icon nc-icon nc-minimal-down"></i>
                </a>
              </div>
              <div id="toggleFilters" class="collapse show" role="tabpanel" aria-labelledby="filterHeading">
                <form id="filters">
                  <div class="text-center">
                    <a href="{{ route('applications',  ['pipeline' => ['new', 'shortlisted', 'interview', 'offered']]) }}">
                      <button type="button" class="btn btn-warning btn-sm">
                        Reset Filters
                      </button></a>
                    <button type="submit" class="btn btn-primary btn-sm text-right">
                      Apply Filter
                    </button>
                  </div>
                  <div class="modal-body modal-edit-profile">
                    <div class="stages-filter">
                      <h6>Stages</h6>
                      <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="new" name="pipeline[]" value="new" wire:model="pipelines" />
                        <label class="custom-control-label" for="new">New</label>
                      </div>
                      <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="shortlisted" name="pipeline[]" value="shortlisted" wire:model="pipelines" />
                        <label class="custom-control-label" for="shortlisted">Shortlisted</label>
                      </div>
                      <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="interview" name="pipeline[]" value="interview" wire:model="pipelines" />
                        <label class="custom-control-label" for="interview">Interview</label>
                      </div>
                      <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="offered" name="pipeline[]" value="offered" wire:model="pipelines" />
                        <label class="custom-control-label" for="offered">Offered</label>
                      </div>
                      <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="hired" name="pipeline[]" value="hired" wire:model="pipelines" />
                        <label class="custom-control-label" for="hired">Hired</label>
                      </div>
                      <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="rejected" name="pipeline[]" value="rejected" wire:model="pipelines" />
                        <label class="custom-control-label" for="rejected">Rejected</label>
                      </div>
                      <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="talentpool" name="pipeline[]" value="talentpool" wire:model="pipelines" />
                        <label class="custom-control-label" for="talentpool">Talent Pool</label>
                      </div>
                    </div>
                    <div class="form-group">
                      <label>Search By Name:</label>
                      <input type="text" class="form-control" id="search_name" name="search_name" value />
                    </div>
                    <div id="accordion" role="tablist" aria-multiselectable="true" class="card-collapse">
                      <div class="card card-plain">
                        <div class="card-header" role="tab" id="headingThree">
                          <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                            Filter By Openings
                            <i class="nc-icon nc-icon nc-minimal-down"></i>
                          </a>
                        </div>
                        <div id="collapseThree" class="collapse" role="tabpanel" aria-labelledby="headingThree">
                          <div class="card-body">
                            <div class="form-group">
                              <label for="opening">Opening Status</label>
                              <div class="form-row">
                                <select class="form-control" name="state" id="opening_state" required>
                                  <option value="pub">Published</option>
                                  <option value="unpub">
                                    Unpublished
                                  </option>
                                  <option value="intr">Internal</option>
                                  <option value="all" selected>
                                    All
                                  </option>
                                </select>
                              </div>
                            </div>
                            <div class="form-group">
                              <label for="opening">Filter by Opening</label>
                              <div class="form-row">
                                <select class="form-control" name="opening_id" required id="openings">
                                  <option value="all">All</option>
                                  @foreach (\App\Models\Opening::all() as $opening)
                                  <option value="{{$opening->id}}">{{$opening->title}} ({{$opening->code}})</option>
                                  @endforeach
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="card card-plain">
                        <div class="card-header" role="tab" id="headingTwo">
                          <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                            Rating, Skills & Experience
                            <i class="nc-icon nc-icon nc-minimal-down"></i>
                          </a>
                        </div>
                        <div id="collapseTwo" class="collapse" role="tabpanel" aria-labelledby="headingTwo">
                          <div class="card-body">
                            <div class="form-row">
                              <div class="form-group col-md-12">
                                <label for="opening">Filter by Rating</label>
                                <select class="form-control" name="rating" id="rating" required>
                                  <option value="all">Any</option>
                                  <option value="5">5 stars</option>
                                  <option value="4">4 stars and above</option>
                                  <option value="3">3 stars and above</option>
                                  <option value="2">2 stars and above</option>
                                  <option value="-4">4 stars and below</option>
                                  <option value="-3">3 stars and below</option>
                                  <option value="-2">2 stars and below</option>
                                  <option value="-1">1 star</option>
                                  <option value="0">Unrated</option>
                                </select>
                              </div>
                            </div>
                            <div class="form-row">
                              <div class="form-group col-md-12">
                                <label for="application_skills">Experience<small>(in years)</small></label>
                                <div id="sliderDouble" class="slider slider-danger" style="margin-top: 30px; margin-bottom: 20px;"></div>
                                <input type="hidden" class="not-disabled" name="experience" value="0-10" id="exp_val" />
                              </div>
                            </div>
                            <div class="form-row">
                              <div class="form-group col-md-12">
                                <label for="application_skills">Skills<small>(Enter skill and press enter)</small></label>
                                <input type="text" value id="tags" name="tags" class="tagsinput form-control" data-role="tagsinput" data-color="danger" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="card card-plain">
                        <div class="card-header" role="tab" id="headingOne">
                          <a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="false"
                            aria-controls="collapseOne">
                            Application Sources
                            <i class="nc-icon nc-icon nc-minimal-down"></i>
                          </a>
                        </div>
                        <div id="collapseOne" class="collapse" role="tabpanel" aria-labelledby="headingOne">
                          <div class="card-body">
                            <div class="sources-filter">
                              <div class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input not-disabled" id="Career Page" name="jb[]" value="career page" wire:model="sources" />
                                <label class="custom-control-label" for="Career Page">Career Page</label>
                              </div>
                              <div class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input not-disabled" id="dashboard" name="jb[]" value="dashboard" wire:model="sources" />
                                <label class="custom-control-label" for="dashboard">Dashboard</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="text-center">
                    <a href="{{route('applications', ['pipeline' => ['new', 'shortlisted', 'interview', 'offered']])}}">
                      <button type="button" class="btn btn-warning btn-sm">Reset Filters</button>
                    </a>
                    <button type="submit" class="btn btn-primary btn-sm">
                      Apply Filter
                    </button>
                    <hr />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-9">
      <div class="card">
        <div class="card-header">
          <ul class="nav nav-pills nav-pills-icons justify-content-center" role="tablist">
            <li class="nav-item mt-1">
              <a class="nav-link {{(in_array('new', $pipelines))?'active':''}}" href="{{ route('applications', ['pipeline' => ['new'], 'state' => 'all', 'opening_id' => $opening_id]) }}" role="tablist">
                <i class="now-ui-icons objects_umbrella-13"></i> New
              </a>
            </li>
            <li class="nav-item mt-1">
              <a class="nav-link {{(in_array('shortlisted', $pipelines))?'active':''}}" href="{{ route('applications', ['pipeline' => ['shortlisted'], 'state' => 'all', 'opening_id' => $opening_id]) }}" role="tablist">
                <i class="now-ui-icons shopping_shop"></i> Shortlisted
              </a>
            </li>
            <li class="nav-item mt-1">
              <a class="nav-link {{(in_array('interview', $pipelines))?'active':''}}" href="{{ route('applications', ['pipeline' => ['interview'], 'state' => 'all', 'opening_id' => $opening_id]) }}" role="tablist">
                <i class="now-ui-icons shopping_shop"></i> Interviews
              </a>
            </li>
            <li class="nav-item mt-1">
              <a class="nav-link {{(in_array('offered', $pipelines))?'active':''}}" href="{{ route('applications', ['pipeline' => ['offered'], 'state' => 'all', 'opening_id' => $opening_id]) }}" role="tablist">
                <i class="now-ui-icons shopping_shop"></i> Offered
              </a>
            </li>
            <li class="nav-item mt-1">
              <a class="nav-link {{(in_array('hired', $pipelines))?'active':''}}" href="{{ route('applications', ['pipeline' => ['hired'], 'state' => 'all', 'opening_id' => $opening_id]) }}"
                role="tablist">
                <i class="now-ui-icons shopping_shop"></i> Hired
              </a>
            </li>
            <li class="nav-item mt-1">
              <a class="nav-link {{(in_array('rejected', $pipelines))?'active':''}}" href="{{ route('applications', ['pipeline' => ['rejected'], 'state' => 'all', 'opening_id' => $opening_id]) }}"
                role="tablist">
                <i class="now-ui-icons ui-2_settings-90"></i> Rejected
              </a>
            </li>
            <li class="nav-item mt-1">
              <a class="nav-link {{(in_array('talentpool', $pipelines))?'active':''}}" href="{{ route('applications', ['pipeline' => ['talentpool']]) }}" role="tablist">
                <i class="now-ui-icons ui-2_settings-90"></i> Talent
                Pool
              </a>
            </li>
          </ul>
        </div>
        <form name="bulk_actions" action="https://dash.recooty.com/applications/bulk_actions" method="POST">
          <input type="hidden" name="return_to"
            value="https://dash.recooty.com/applications?pipeline[]=new&amp;state=all" />
          <input type="hidden" name="bulk_rejection_reason" value="NULL" id="bulk_hidden_reject_reason" />
          <input type="hidden" name="bulk_rejection_send_mail" value="NULL" id="bulk_hidden_send_mail" />
          <input type="hidden" name="_token" value="a2jrzsPry1jQAlrb0GurF44pdmN0ObkFts6Wsm2X" />
          <div class="row" id="bulkActionsComamands" style="display: none">
            <div class="col-md-3 text-right">
              <div class="pt-3">Move Application to:</div>
            </div>
            <div class="col-md-9">
              <div class>
                <button class="btn btn-sm" value="bulk_new" type="submit" name="bulk_op">New</button>
                <button class="btn btn-primary btn-sm" value="bulk_shortlist" type="submit" name="bulk_op">Shortlist</button>
                <button class="btn btn-warning btn-sm" value="bulk_interview" type="submit" name="bulk_op">Interview</button>
                <button class="btn btn-info btn-sm" value="bulk_offer" type="submit" name="bulk_op">Offer</button>
                <button class="btn btn-success btn-sm" value="bulk_hire" type="submit" name="bulk_op">Hire</button>
                <button class="btn btn-danger btn-sm" value="bulk_reject" type="submit" name="bulk_op" id="bulkRejectSubmit" style="display: none">Reject</button>
                <button class="btn btn-danger btn-sm" type="button" id="bulkRejectBtn">Reject</button>
                <button class="btn btn-sm" value="bulk_talentpool" type="submit" name="bulk_op">Move to Talentpool</button>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped table-bordered" cellspacing="0" width="100%">
                <thead>
                  <tr>
                    <th class="text-center">
                      <input type="checkbox" class id="selectAll" />
                    </th>
                    <th style="padding-left: 20px">Name</th>
                    <th class="text-center">Stage</th>
                    <th class="text-center">Date</th>
                    <th class="text-center">Opening Title</th>
                    <th class="disabled-sorting text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody id="applicationsTableData">
                  @if($listOfApplicants && $listOfApplicants->isNotEmpty())
                  @foreach($listOfApplicants as $applicant)
                 
                  <tr id="applicant_details_a03b6150d443b2884a49831d5d47978c">
                    <td class="text-center">
                      <input type="checkbox" class="applicant_checkbox" value="{{$applicant->idap}}"
                        name="bulk_ids[]" />
                    </td>
                    <td style="width: 30%">
                      <span style="display: inline-flex">
                        <a href="#!" onclick="sibc(this)" id="applicant_detail_a03b6150d443b2884a49831d5d47978c">
                          <span class="applicant_name" id="applicant_name_a03b6150d443b2884a49831d5d47978c">
                            {{$applicant->first_name}} {{$applicant->last_name}}
                          </span>
                        </a>
                        <i class="fas fa-file-pdf m-1"></i>
                      </span>
                      <br />
                      <span class="app_rating" id="app_rating_a03b6150d443b2884a49831d5d47978c">

                        <i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i
                          class="far fa-star"></i><i class="far fa-star"></i>
                      </span>
                      <br />
                      <div style="padding-left: 10px; font-size: 12px">
                        <span class="badge badge-pill badge-default badge-skill"></span>
                      </div>
                    </td>
                    <td class="text-center">
                      <span class="badge badge-default badge-stage">{{$applicant->stage}}</span>
                    </td>
                    <td class="text-center app-date">
                      {{\Carbon\Carbon::parse($applicant->created_at)->format('d M Y')}}<br />
                      <span class="badge badge-default badge-source">
                        {{$applicant->source}}
                      </span>
                    </td>
                    <td style="padding-left: 20px; white-space: nowrap">
                      <small><i class="fas fa-circle
                      @if($applicant->status==='published')
                            {{'text-success'}}
                        @elseif($applicant->status==='unpublished')
                            {{'text-warning'}}
                        @endif
                      "></i></small>
                      <strong>{{$applicant->title}}</strong><br />
                      <small class="pl-3">{{$applicant->code}}</small>
                    </td>
                    <td class="text-center" style="white-space: nowrap">
                      <a href="#!" class="btn btn-primary btn-link btn-icon" onclick="sibc(this)"
                        id="applicant_detail_a03b6150d443b2884a49831d5d47978c"><i class="fas fa-eye"></i></a>
                      <a href="#" class="btn btn-danger btn-link btn-icon remove"
                        id="delete_applicant_a03b6150d443b2884a49831d5d47978c"><i class="fa fa-times"></i></a>
                    </td>
                  </tr>
                  @endforeach
                  @else
                  <tr>
                    <td colspan="6" class="text-center">No applications available on selected critera</td>
                  </tr>
                  @endif
                </tbody>
              </table>
            </div>
          </div>
        </form>
        <div class="card-footer">
          <div class="row">
            <div class="col">
              <select name class="form-control" id="paginationCount" style="width: auto">
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div class="col"></div>
            <div class="col text-right">Total Results : {{$listOfApplicants->count()}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

@push('scripts')
<script type="text/javascript">
  $.ajaxSetup({
    headers: {
      "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
    },
  });
  $(document).ajaxStart(function() {
    Pace.restart();
  });
</script>
<script>
  var pageType = "1";
</script>
<script>
  var slider2 = document.getElementById("sliderDouble");

  noUiSlider.create(slider2, {
    start: [0, 10],
    start: [0, 10],
    connect: true,
    tooltips: [wNumb({
      decimals: 0
    }), wNumb({
      decimals: 0
    })],
    range: {
      min: 0,
      max: 10,
    },
    step: 1,
  });

  slider2.noUiSlider.on("change", function() {
    exp = slider2.noUiSlider.get();

    $("#exp_val").val(Math.round(exp[0]) + "-" + Math.round(exp[1]));
  });
</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/pdfmake.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/vfs_fonts.js"></script>
<script type="text/javascript"
  src="https://cdn.datatables.net/v/bs4/jszip-2.5.0/dt-1.10.18/b-1.5.6/b-html5-1.5.6/r-2.2.2/rg-1.1.0/sc-2.0.0/datatables.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/corejs-typeahead/1.2.1/typeahead.bundle.min.js"
  integrity="sha256-VCsWOz+0GuHdS/sIICtQNTFJdbaDI80rxvoB7BXabrU=" crossorigin="anonymous"></script>
<script>
  var routes = {
    activity_feed: "https://dash.recooty.com/ajax/feed",
    list_applications: "https://dash.recooty.com/ajax/list_applications/1",
    application_action: "https://dash.recooty.com/ajax/application_action/1",
    delete_application: "https://dash.recooty.com/ajax/delete_application/1",
    view_application: "https://dash.recooty.com/ajax/view_application",
    update_application: "https://dash.recooty.com/ajax/update_application",
    schedule_interview: "https://dash.recooty.com/ajax/schedule_interview",
    reschedule_interview: "https://dash.recooty.com/ajax/reschedule_interview",
    move_stages: "https://dash.recooty.com/ajax/move_stages",
    interview_feedback: "https://dash.recooty.com/ajax/interview_feedback",
    interview_cancel: "https://dash.recooty.com/ajax/interview_cancel",
    set_session: "https://dash.recooty.com/ajax/set_session",
    move_to_talent: "https://dash.recooty.com/ajax/move_to_talent",
    move_to_another: "https://dash.recooty.com/ajax/move_to_another",
    set_rating: "https://dash.recooty.com/ajax/set_rating",
    application_comment: "https://dash.recooty.com/ajax/application_comment",
    delete_comment: "https://dash.recooty.com/ajax/delete_comment",
    update_resume: "https://dash.recooty.com/ajax/update_resume",
    tags_ajax: "https://dash.recooty.com/tags_ajax",
    get_openings_from_state: "https://dash.recooty.com/ajax/get_openings_from_state",
  };
  var md5_ids = [
    "eae626e454a1259aea9d5a5f34678718",
    "30d152d60373c03eee510d23ff18b06c",
    "c20a27ea8a253826787ea2dff0b825b0",
    "bb297fa5ab8fd5d893cacd78aa78be30",
    "a03b6150d443b2884a49831d5d47978c",
  ];
</script>
<script src="{{ URL::asset('assets/js/applications.js?id=54d2b3eb7146e3066003') }}"></script>
<script>
  //   Script to dim the background of Modal 2
  $(document).ready(function() {
    $(document).on("show.bs.modal", ".modal", function(event) {
      var zIndex = 1040 + 10 * $(".modal:visible").length;
      $(this).css("z-index", zIndex);
      setTimeout(function() {
        $(".modal-backdrop")
          .not(".modal-stack")
          .css("z-index", zIndex - 1)
          .addClass("modal-stack");
      }, 0);
      setTimeout(() => {
        refresh_table();
      }, 1000);
    });
    $(document).on("hide.bs.modal", "#ApplicantModal", function(event) {
      $("body").removeClass("modal-open");
      $(".modal-backdrop.fade").remove();
    });
  });
</script>
<script>
  $(document).ready(function() {
    var windowWidth = $(window).width();
    if (windowWidth <= 1024)
      //for iPad & smaller devices
      $("#toggleFilters").removeClass("show");
  });
</script>
<script>
  $(".pagination li").addClass("page-item");
  $(".pagination li a").addClass("page-link");
  $(".pagination span").addClass("page-link");
</script>
@endpush