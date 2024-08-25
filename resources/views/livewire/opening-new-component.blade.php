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
            <li class="breadcrumb-item">
                <a href="{{route('dashboard')}}">Dashboard</a>
            </li>
            <li class="breadcrumb-item">
                <a href="{{route('openings', 'all')}}">Job Openings</a>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
                New Opening
            </li>
        </ol>
    </nav>
    <div class="col-md-10">
        <div class="wizard-container">
            <div class="card card-wizard" data-color="primary" id="wizardProfile">
                <form action="https://dash.recooty.com/openings/new" method="GET">
                    <input type="hidden" name="_token" value="a2jrzsPry1jQAlrb0GurF44pdmN0ObkFts6Wsm2X" />
                    <div class="card-header text-center">
                        <div class="wizard-navigation">
                            <ul>
                                <li class="nav-item">
                                    <a class="nav-link active" href="#about" data-toggle="tab" role="tab"
                                        aria-controls="about" aria-selected="true">
                                        <i class="nc-icon nc-briefcase-24"></i>
                                        Basic Info
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="#account" data-toggle="tab" role="tab"
                                        aria-controls="account" aria-selected="true">
                                        <i class="nc-icon nc-settings"></i>
                                        Options
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="tab-content">
                            <div class="tab-pane show active" id="about">
                                <div class="row justify-content-center">
                                    <div class="col-lg-7">
                                        <div class="form-group">
                                            <div class="row">
                                                <div class="col-md-8">
                                                    <label>Job Title</label>
                                                </div>
                                            </div>
                                            <input class="form-control" type="text" name="job_title"
                                                placeholder="eg: PHP developer" id="job_title" size="260"
                                                style="text-transform: capitalize" />
                                        </div>
                                    </div>
                                    <div class="col-lg-3">
                                        <div class="form-group">
                                            <label>Job Code
                                                <i class="fas fa-info-circle" data-toggle="tooltip" data-placement="top"
                                                    title="This job code is system generated, you can also use your own job code if required."></i></label>
                                            <input class="form-control" type="text" name="job_code" value="ME101"
                                                id="job_code" size="20" style="text-transform: uppercase" />
                                        </div>
                                    </div>
                                    <div class="col-lg-10 mt-3">
                                        <div class="form-group">
                                            <label>Job Description
                                                <small>(responsibilities, required skills, perks
                                                    etc.)</small></label>
                                            <textarea class="form-control" name="job_description" id="jobdesc">
Job Brief:
<br><br><br>
Responsibilities:
<br><br><br>
Skills Required:</textarea>
                                            <div class="alert alert-danger" id="validNotifyResp" style="display: none">
                                                <span>Please make sure that Job Description has
                                                    minimum 30 words</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane" id="account">
                                <div class="row justify-content-center">
                                    <div class="col-sm-8">
                                        <div class="form-group select-wizard">
                                            <div class="row">
                                                <div class="col-md-8">
                                                    <label class="control-label">
                                                        Location <star>*</star>
                                                        <a href="#" onclick="refresh_locations()"><i
                                                                class="fa fa-refresh" aria-hidden="true"></i>
                                                            <small>Refresh List</small></a>
                                                    </label>
                                                </div>
                                                <div class="col-md-4 pull-right text-right">
                                                    <label class="control-label"><a
                                                            href="https://dash.recooty.com/settings/locations/new"
                                                            target="_blank">Add New</a>
                                                    </label>
                                                </div>
                                            </div>
                                            <select class="form-control" name="job_location_id" data-size="7"
                                                title="Single Select" required id="location_id" value="ddd">
                                                <option disabled selected>
                                                    Please add a location first
                                                </option>
                                                <option value="toctoc">Toc toc</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-sm-2">
                                        <div class="form-group select-wizard remote-toggle">
                                            <label>Remote Job?
                                                <i class="fas fa-info-circle" data-toggle="tooltip" data-placement="top"
                                                    title="In case of remote jobs, location is compulsory to appear on the third party job boards. "></i></label><br />
                                            <input class="bootstrap-switch" name="job_remote" type="checkbox"
                                                data-toggle="switch" data-on-label="<i class='nc-icon nc-check-2'></i>"
                                                data-off-label="<i class='nc-icon nc-simple-remove'></i>"
                                                data-on-color="success" data-off-color="success" />
                                        </div>
                                    </div>
                                </div>
                                <div class="row justify-content-center pt-5">
                                    <div class="col-sm-3">
                                        <div class="form-group select-wizard">
                                            <label>Experience Required</label>
                                            <select class="form-control" name="job_experience" data-size="7"
                                                title="Single Select" required>
                                                <option value="Internship">Internship</option>
                                                <option value="Entry Level" selected>
                                                    Entry Level
                                                </option>
                                                <option value="Associate">Associate</option>
                                                <option value="Mid-Senior Level">
                                                    Mid-Senior Level
                                                </option>
                                                <option value="Director/ Vice-President">
                                                    Director/ Vice-President
                                                </option>
                                                <option value="Executive/ President">
                                                    Executive/ President
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-sm-3">
                                        <div class="form-group select-wizard">
                                            <label>Employment Type</label>
                                            <select name="job_employment_type" class="form-control" data-size="7"
                                                title="Single Select" required>
                                                <option selected value="Full Time">
                                                    Full Time
                                                </option>
                                                <option value="Part Time">Part Time</option>
                                                <option value="Contract">Contract</option>
                                                <option value="Internship">Internship</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-sm-4">
                                        <div class="form-group select-wizard">
                                            <div class="row">
                                                <div class="col-md-8">
                                                    <label class="control-label">
                                                        Department
                                                        <a href="#" onclick="refresh_departments()"><i
                                                                class="fa fa-refresh" aria-hidden="true"></i>
                                                            <small>Refresh List</small></a>
                                                    </label>
                                                </div>
                                                <div class="col-md-4 pull-right text-right">
                                                    <label class="control-label"><a
                                                            href="https://dash.recooty.com/settings/departments/new"
                                                            target="_blank">Add New</a>
                                                    </label>
                                                </div>
                                            </div>
                                            <select class="form-control" name="company_department"
                                                id="company_department" data-size="7" title="Single Select">
                                                <option value>--default--</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="row justify-content-center pt-5">
                                    <div class="col-sm-6">
                                        <div class="form-group select-wizard">
                                            <div class="row">
                                                <div class="col-md-8">
                                                    <label class="control-label">
                                                        Screening Question Template <star>*</star>
                                                        <a href="#" onclick="refresh_templates()"><i
                                                                class="fa fa-refresh" aria-hidden="true"></i>
                                                            <small>Refresh List</small></a>
                                                    </label>
                                                </div>
                                                <div class="col-md-4 pull-right text-right">
                                                    <label class="control-label"><a
                                                            href="https://dash.recooty.com/settings/form-templates"
                                                            target="_blank">
                                                            (view)</a>
                                                    </label>
                                                </div>
                                            </div>
                                            <select name="ft_id" class="form-control" data-size="7"
                                                title="Single Select" required id="template_id">
                                                <option value="0">Default</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-sm-4">
                                        <div class="form-group select-wizard">
                                            <label>Job Industry</label>
                                            <select class="form-control" name="job_industry" data-size="7"
                                                title="Single Select" required>
                                                <option value>--select--</option>
                                                <option value="Accounting">Accounting</option>
                                                <option value="Apparel &amp; Fashion">
                                                    Apparel &amp; Fashion
                                                </option>
                                                <option value="Architecture &amp;amp; Planning">
                                                    Architecture &amp;amp; Planning
                                                </option>
                                                <option value="Arts and Crafts">
                                                    Arts and Crafts
                                                </option>
                                                <option value="Automotive">Automotive</option>
                                                <option value="Banking">Banking</option>
                                                <option value="Biotechnology">
                                                    Biotechnology
                                                </option>
                                                <option value="Broadcast Media">
                                                    Broadcast Media
                                                </option>
                                                <option value="Civic &amp; Social Organization">
                                                    Civic &amp; Social Organization
                                                </option>
                                                <option value="Computer Software">
                                                    Computer Software
                                                </option>
                                                <option value="Construction">
                                                    Construction
                                                </option>
                                                <option value="Customer Support">
                                                    Customer Support
                                                </option>
                                                <option value="Education Management">
                                                    Education Management
                                                </option>
                                                <option value="Environmental Services">
                                                    Environmental Services
                                                </option>
                                                <option value="Event Services">
                                                    Event Services
                                                </option>
                                                <option value="Executive Office">
                                                    Executive Office
                                                </option>
                                                <option value="Facilities Services">
                                                    Facilities Services
                                                </option>
                                                <option value="Financial Services">
                                                    Financial Services
                                                </option>
                                                <option value="Government Administration">
                                                    Government Administration
                                                </option>
                                                <option value="Health, Wellness and Fitness">
                                                    Health, Wellness and Fitness
                                                </option>
                                                <option value="Hospital &amp;amp; Health Care">
                                                    Hospital &amp;amp; Health Care
                                                </option>
                                                <option value="Hospitality">Hospitality</option>
                                                <option value="Human Resources">
                                                    Human Resources
                                                </option>
                                                <option value="Individual &amp; Family Services">
                                                    Individual &amp; Family Services
                                                </option>
                                                <option value="Industrial Automation">
                                                    Industrial Automation
                                                </option>
                                                <option value="Information Technology and Services">
                                                    Information Technology and Services
                                                </option>
                                                <option value="Insurance">Insurance</option>
                                                <option value="Internet">Internet</option>
                                                <option value="Law Enforcement">
                                                    Law Enforcement
                                                </option>
                                                <option value="Legal Services">
                                                    Legal Services
                                                </option>
                                                <option value="Leisure, Travel &amp;amp; Tourism">
                                                    Leisure, Travel &amp;amp; Tourism
                                                </option>
                                                <option value="Logistics and Supply Chain">
                                                    Logistics and Supply Chain
                                                </option>
                                                <option value="Management Consulting">
                                                    Management Consulting
                                                </option>
                                                <option value="Manufacturing">
                                                    Manufacturing
                                                </option>
                                                <option value="Marketing and Advertising">
                                                    Marketing and Advertising
                                                </option>
                                                <option value="Mechanical or Industrial Engineering">
                                                    Mechanical or Industrial Engineering
                                                </option>
                                                <option value="Media &amp; Entertainment">
                                                    Media &amp; Entertainment
                                                </option>
                                                <option value="Non-Profit Organization Management">
                                                    Non-Profit Organization Management
                                                </option>
                                                <option value="Oil &amp; Energy">
                                                    Oil &amp; Energy
                                                </option>
                                                <option value="Public Relations and Communications">
                                                    Public Relations and Communications
                                                </option>
                                                <option value="Real Estate">Real Estate</option>
                                                <option value="Research">Research</option>
                                                <option value="Restaurants">Restaurants</option>
                                                <option value="Retail">Retail</option>
                                                <option value="Staffing and Recruiting">
                                                    Staffing and Recruiting
                                                </option>
                                                <option value="Telecommunications">
                                                    Telecommunications
                                                </option>
                                                <option value="Transportation/Trucking/Railroad">
                                                    Transportation/Trucking/Railroad
                                                </option>
                                                <option value="Utilities">Utilities</option>
                                                <option value="Veterinary">Veterinary</option>
                                                <option value="Warehousing">Warehousing</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="pull-right">
                            <input type="button" class="btn btn-next btn-fill btn-rose btn-success btn-wd" name="next"
                                value="Next" id="btnNext" />
                            <input type="submit" class="btn btn-finish btn-fill btn-rose btn-success btn-wd"
                                name="finish" value="Finish" />
                        </div>
                        <div class="pull-left">
                            <input type="button" class="btn btn-previous btn-fill btn-default btn-wd" name="previous"
                                value="Previous" />
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </form>
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
      $(document).ajaxStart(function () {
        Pace.restart();
      });
    </script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/typeahead.js/0.11.1/typeahead.bundle.min.js"></script>

    <script src="https://dash.recooty.com/ckeditor/ckeditor.js"></script>
    <script>
      $(document).ready(function () {
        // Initialise the wizard
        demo.initWizard();
        setTimeout(function () {
          $(".card.card-wizard").addClass("active");
        }, 600);
      });
    </script>
    <script>
      //Function to count the words using regex
      var counter = function (value) {
        if (value.length == 0) {
          return 0;
        }
        var regex = /\s+/gi;
        var wordCount = value.trim().replace(regex, " ").split(" ").length;
        return wordCount;
      };
      jQuery(document).ready(function () {
        $("#btnNext").prop("disabled", true);

        CKEDITOR.replace("jobdesc");
        var jobdesc = CKEDITOR.instances.jobdesc;
        var jobdesccount = 30;
        jobdesc.on("change", function (e) {
          var count = counter(jobdesc.getData());
          console.log(count);
          if (count < jobdesccount) {
            //Word count is less, disable next button and show error notification
            $("#btnNext").prop("disabled", true);
            $("#validNotifyResp").show();
          } else {
            $("#btnNext").prop("disabled", false);
            $("#validNotifyResp").hide();
          }
        });

        // partner job boards start
        $("#job_google_status").on("change", function () {
          if ($(this).prop("checked")) {
            $(".partner-logo-icons").removeClass("partner-logo");
            $("#unselect_msg").hide();
          } else {
            $(".partner-logo-icons").addClass("partner-logo");
            $("#unselect_msg").show();
          }
        }),
          // facebook job boards start
          $("#job_fb_status").on("change", function () {
            if ($(this).prop("checked")) {
              $(".partner-logo-icons-fb").removeClass("partner-logo");
            } else {
              $(".partner-logo-icons-fb").addClass("partner-logo");
            }
          });
      });

      //updation locations dynamically
      function refresh_locations() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            document.getElementById("location_id").innerHTML =
              this.responseText;
          }
        };
        xhttp.open(
          "POST",
          "https://dash.recooty.com/ajax/refresh_locations",
          true
        );
        xhttp.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );
        xhttp.setRequestHeader(
          "X-CSRF-TOKEN",
          document.head.querySelector("[name=csrf-token]").content
        );
        xhttp.send();
      }
      //updation templates dynamically
      function refresh_templates() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            document.getElementById("template_id").innerHTML =
              this.responseText;
          }
        };
        xhttp.open(
          "POST",
          "https://dash.recooty.com/ajax/refresh_templates",
          true
        );
        xhttp.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );
        xhttp.setRequestHeader(
          "X-CSRF-TOKEN",
          document.head.querySelector("[name=csrf-token]").content
        );
        xhttp.send();
      }

      //updation departments dynamically
      function refresh_departments() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            document.getElementById("company_department").innerHTML =
              this.responseText;
          }
        };
        xhttp.open(
          "POST",
          "https://dash.recooty.com/ajax/refresh_departments",
          true
        );
        xhttp.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );
        xhttp.setRequestHeader(
          "X-CSRF-TOKEN",
          document.head.querySelector("[name=csrf-token]").content
        );
        xhttp.send();
      }
    </script>
@endpush