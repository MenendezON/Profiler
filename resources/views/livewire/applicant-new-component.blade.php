@push('styles')
<style>

        .upload-area {
            /* height: ; */
            padding-bottom: 20px;
            border-style: dashed;
            border-width: 10px;
            border-color: rgb(243, 243, 243);
            border-radius: 30px;
            text-align: center;
            overflow:hidden;
        }
        .upload-area:hover{
            cursor: pointer;
        }
        #file{
            display: none;
        }
        .drag-text {
            font-weight: 500;
        }
        /* Thumbnail */
        .thumbnail{
            width: 80px;
            height: 80px;
            padding: 2px;
            border: 2px solid lightgray;
            border-radius: 3px;
            float: left;
        }

        .size{
            font-size:12px;
        }
        .upload-area p{
            text-align: center;
            vertical-align: middle;
            /*line-height: 500px;*/
            padding-top: 150px;
            padding-left: 50px;
            padding-right: 50px;
            padding-bottom: 150px;
        }
        @media (min-width: 320px) and (max-width: 991px) {

          .upload-area {
              max-width: 100% !important;
              width: 100%;
          }

        }

        label span {
        color: red;
    }

        .csv-import{
            font-size: 14px;
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
              <li class="breadcrumb-item">
                <a href="{{route('dashboard')}}">Dashboard</a>
              </li>
              <li class="breadcrumb-item">
                <a href="{{route('applications', ['pipeline'=>['new', 'shortlisted', 'interview', 'offered']])}}">Applications</a>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                Add Candidate
              </li>
            </ol>
          </nav>
          <div class="row">
            <div class="col-md-6">
              <div class="card">
                <div class="card-header">
                  <h4 class="card-title">
                    Drag and Drop Resume
                    <span class="pull-right csv-import"
                      ><a href="https://dash.recooty.com/settings/imports"
                        >Bulk Upload From CSV</a
                      ></span
                    >
                  </h4>
                </div>
                <div class="card-body">
                  <div class="container-fluid">
                    <input type="file" name="applicant_resume_drop" id="file" />

                    <div class="upload-area" id="uploadfile">
                      <p class="drag-text">
                        <strong>Drag and Drop Resume</strong
                        ><br />Or<br /><strong>Click here to select file</strong
                        ><br /><br />
                        <small
                          >(Must be less than 2MB. Only PDF, Doc and Docx are
                          allowed)</small
                        >
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card">
                <div class="card-header">
                  <h4 class="card-title">Add Candidate</h4>
                </div>
                <div class="card-body">
                  <form  method="post" action="https://dash.recooty.com/applications/add-candidate">
                    <input type="hidden" name="_token" value="a2jrzsPry1jQAlrb0GurF44pdmN0ObkFts6Wsm2X"/>
                    <div class="form-row">
                      <div class="form-group col-md-6">
                        <label for="application_fname">First Name <span>*</span></label>
                        <input type="text" class="form-control" name="application_fname" required maxlength="30"/>
                      </div>
                      <div class="form-group col-md-6">
                        <label for="application_lname">Last Name <span>*</span></label>
                        <input type="text" class="form-control" name="application_lname" required maxlength="30" />
                      </div>
                    </div>
                    <label>Email Address <span>*</span></label>
                    <div class="form-group">
                      <input type="email" class="form-control" name="application_email" required maxlength="100" />
                    </div>
                    <div class="form-group">
                      <label for="lastName">Mobile Number</label>
                      <input type="text" class="form-control" name="application_mobile" maxlength="30" />
                    </div>
                    <div class="form-row">
                      <div class="form-group col-md-6">
                        <label for="application_location">Current city</label>
                        <input type="text" class="form-control" name="application_location" maxlength="50" />
                      </div>
                      <div class="form-group col-md-6">
                        <label for="application_experience">Experience</label>
                        <select class="form-control" name="application_experience">
                          <option value>--SELECT--</option>
                          <option value="0">Fresher</option>
                          <option value="0-1">0-1 Years</option>
                          <option value="1-2">1-2 Years</option>
                          <option value="2-3">2-3 Years</option>
                          <option value="3-4">3-4 Years</option>
                          <option value="4-5">4-5 Years</option>
                          <option value="5-6">5-6 Years</option>
                          <option value="6-7">6-7 Years</option>
                          <option value="7-8">7-8 Years</option>
                          <option value="8-9">8-9 Years</option>
                          <option value="9-10">9-10 Years</option>
                          <option value="10+">10+ Years</option>
                        </select>
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group col-md-8">
                        <label for="job_id">Assign to Opening</label>
                        <select
                          class="form-control"
                          name="job_id"
                          required
                          onchange="showAssign(this.options[this.selectedIndex].value)"
                        >
                          <option value="1" selected>Talent Pool</option>
                        </select>
                      </div>
                      <div
                        class="form-group col-md-4"
                        id="pipeline_select"
                      ></div>
                      <script
                        data-cfasync="false"
                        src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"
                      ></script>
                      <script type="text/javascript">
                        function showAssign(name) {
                          var pipeline = `
                                                        <label for="application_status">Assign to Pipeline</label>
                                                        <select class="form-control" name="application_status" required>
                                                            <option value="0" selected>New</option>
                                                            <option value="1">Shortlisted</option>
                                                            <option value="3">Interview</option>
                                                            <option value="4">Offered</option>
                                                        </select>
                                                `;

                          if (name != "1")
                            document.getElementById(
                              "pipeline_select"
                            ).innerHTML = pipeline;
                          else
                            document.getElementById(
                              "pipeline_select"
                            ).innerHTML = "";
                        }
                      </script>
                    </div>
                    <div class="form-group">
                      <label for="exampleInputResume">Attach Resume</label>
                      <p class="drag_resume_name"></p>
                      <input
                        type="text"
                        class="form-control border-input"
                        name="application_resume"
                        readonly="true"
                        placeholder="Please upload a resume"
                        onclick="$('#file').click();"
                        style="cursor: pointer"
                      />
                    </div>
                    <button type="submit" class="btn btn-info btn-wd">
                      Add
                    </button>
                  </form>
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
    $(document).ajaxStart(function() { Pace.restart(); });
    </script>
<script src="{{ URL::asset('assets/js/dragndrop.js?id=04543ec7f77e61e5b3ca') }}"></script>
@endpush