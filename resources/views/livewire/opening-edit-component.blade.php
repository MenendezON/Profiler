<div class="content">
          <nav aria-label="breadcrumb" role="navigation">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <a href="{{ route('dashboard') }}">Dashboard</a>
              </li>
              <li class="breadcrumb-item">
                <a href="{{ route('openings', 'all') }}">Openings</a>
              </li>
              <li class="breadcrumb-item">
                <a
                  href="{{ route('opening.show', '6b0ac5c5ab0f8939442c42704c5493b0') }}"
                  >HR Assistant</a
                >
              </li>
              <li class="breadcrumb-item active" aria-current="page">Edit</li>
            </ol>
          </nav>
          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="card-header card-header-primary">
                  <h3 class="card-title">Edit Opening</h3>
                </div>
                <div class="card-body">
                  <form
                    method="post"
                    action="{{ route('opening.edit', '6b0ac5c5ab0f8939442c42704c5493b0') }}"
                  >
                    <div class="row">
                      <div class="col-md-9">
                        <input
                          type="hidden"
                          name="_token"
                          value="r9NQWCLvHcGjF0cCDSDWRgHvYHTEAqR09yAVUBD8"
                        />
                        <label>Job Title <span>*</span></label>
                        <div class="form-group">
                          <input
                            type="text"
                            name="job_title"
                            class="form-control"
                            value="HR Assistant"
                            required
                          />
                        </div>
                        <label for="job_responsibilities"
                          >Job Description <span>*</span></label
                        >
                        <div class="form-group">
                          <div
                            class="alert alert-danger"
                            id="validNotifyResp"
                            style="display: none"
                          >
                            <span
                              >Please make sure that Job Description has minimum
                              30 words</span
                            >
                          </div>
                          <textarea
                            name="job_responsibilities"
                            id="job_responsibilities"
                            class="form-control"
                          >
<p>Job Responsibilities:</p>

<ul>
	<li>Assist with day to day operations of the HR functions and duties</li>
	<li>Provide clerical and administrative support to Human Resources executives</li>
	<li>Compile and update employee records (hard and soft copies)</li>
	<li>Process documentation and prepare reports relating to personnel activities (staffing, recruitment, training, grievances, performance evaluations etc)</li>
	<li>Coordinate HR projects (meetings, training, surveys etc) and take minutes</li>
	<li>Deal with employee requests regarding human resources issues, rules, and regulations</li>
	<li>Assist in payroll preparation by providing relevant data (absences, bonus, leaves, etc)</li>
	<li>Communicate with public services when necessary</li>
	<li>Properly handle complaints and grievance procedures</li>
	<li>Coordinate communication with candidates and schedule interviews</li>
	<li>Conduct initial orientation to newly hired employees</li>
	<li>Assist our recruiters to source candidates and update our database</li>
</ul>

<p><br />
Job Skills:</p>

<ul>
	<li>Proven experience as an HR assistant,&nbsp;staff assistant&nbsp;or relevant human resources/administrative position</li>
	<li>Fast computer typing skills (MS Office, in particular)</li>
	<li>Hands-on experience with an HRIS or HRMS</li>
	<li>Familiarity with ATS software and resume databases</li>
	<li>Basic knowledge of labor laws</li>
	<li>Excellent organizational skills</li>
	<li>Strong communications skills</li>
	<li>Degree in Human Resources or related field</li>
</ul></textarea
                          >
                        </div>
                      </div>
                      <div class="col-md-3">
                        <div class="form-group">
                          <label for="job_code">Job Code <span>*</span></label>
                          <input
                            type="text"
                            class="form-control"
                            name="job_code"
                            value="ME102"
                            required
                          />
                        </div>
                        <div class="form-group">
                          <label for="company_email"
                            >Location <span>*</span></label
                          >
                          <select class="form-control" name="job_location_id">
                            <option value="12206" selected>
                              SN Office - Dakar
                            </option>
                          </select>
                        </div>
                        <div class="form-group">
                          <label for="company_telephone">Remote Job?</label
                          ><br />
                          <input
                            class="bootstrap-switch"
                            name="job_remote"
                            type="checkbox"
                            data-toggle="switch"
                            data-on-label="<i class='nc-icon nc-check-2'></i>"
                            data-off-label="<i class='nc-icon nc-simple-remove'></i>"
                            data-on-color="success"
                            data-off-color="success"
                          />
                        </div>
                        <div class="form-group">
                          <label for="company_facebook"
                            >Employment Type <span>*</span></label
                          >
                          <select
                            name="job_employment_type"
                            class="form-control"
                            data-size="7"
                            title="Single Select"
                            required
                          >
                            <option selected value="Full Time">
                              Full Time
                            </option>
                            <option value="Part Time">Part Time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div class="form-group">
                          <label for="job_experience"
                            >Experience Required <span>*</span></label
                          >
                          <select
                            class="form-control"
                            name="job_experience"
                            data-size="7"
                            title="Single Select"
                            required
                          >
                            <option value="Internship">Internship</option>
                            <option selected value="Entry Level">
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
                        <div class="form-group">
                          <label
                            >Screening Questions Template <span>*</span></label
                          >
                          <select class="form-control" name="ft_id">
                            <option value="0">Default</option>
                            <option value="2670" selected>HR Assistant</option>
                            <option value="2671">IT Consultant</option>
                          </select>
                        </div>
                        <div class="form-group">
                          <label>Department </label>
                          <select
                            class="form-control"
                            name="company_department"
                          >
                            <option value>--default--</option>
                            <option value="2931">ICT</option>
                            <option value="2932" selected>Logistic</option>
                          </select>
                        </div>
                        <div class="form-group">
                          <label>Job Industry <span>*</span></label>
                          <select
                            class="form-control"
                            name="job_industry"
                            required
                          >
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
                            <option value="Biotechnology">Biotechnology</option>
                            <option value="Broadcast Media">
                              Broadcast Media
                            </option>
                            <option value="Civic &amp; Social Organization">
                              Civic &amp; Social Organization
                            </option>
                            <option value="Computer Software">
                              Computer Software
                            </option>
                            <option value="Construction">Construction</option>
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
                            <option value="Human Resources" selected>
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
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Marketing and Advertising">
                              Marketing and Advertising
                            </option>
                            <option
                              value="Mechanical or Industrial Engineering"
                            >
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
                    <div class="row">
                      <div class="col-md-12 text-right">
                        <button
                          type="submit"
                          class="btn btn-info btn-wd"
                          id="btnSave"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>