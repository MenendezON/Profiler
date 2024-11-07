<?php

// Controller
namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Location;
use App\Models\Screeningquestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApplicantController extends Controller
{
    public function view(Request $request)
    {
        
        $html = '<div class="modal fade show" id="ApplicantModal" tabindex="-1" role="dialog" aria-labelledby="ApplicantModalLabel" style="z-index: 1040; padding-right: 17px; display: block;">
        <div class="modal-dialog modal-dialog-slideout modal-lg" role="document">

          <div class="modal-content modal-content-applicant">
                <div class="modal-navigation" id="buttons_a">
                        <div class="buttons">
                            <button class="btn btn-icon" data-dismiss="modal" aria-label="Close"><i class="fas fa-times"></i></button>
                        </div>
                        <script>
                            var sdbvjasdbvsdkjvbsasjkndkasdnadsjndkansdaknsjd = `
                        <div class="buttons">
                                <button class="btn btn-icon" onclick="go_next()"><i class="fas fa-chevron-right"></i></button>
                            </div>
                            <div class="buttons">
                                <button class="btn btn-icon" onclick="go_previous()"><i class="fas fa-chevron-left"></i></button>
                            </div>`;

                            if(pageType != "dashboard" && pageType != "interviews_only" && pageType != "activity_feed")
                            {
                                document.querySelector("#buttons_a").insertAdjacentHTML("beforeend", sdbvjasdbvsdkjvbsasjkndkasdnadsjndkansdaknsjd);
                            }
                        </script>

                    
                        </div>
            <div class="modal-header">
                <div class="row">
                    <div class="col-md-12 col-lg-8">
                        <h5 class="modal-title">
                            <span class="applicant_name_modal"><img width="30" src="https://ui-avatars.com/api/?name=Mohamed+MBOUP&amp;bold=true&amp;rounded=true"> &nbsp;Mohamed MBOUP </span>

                            <span class="rating">
                                <input type="radio" id="star5" class="name_rating" name="rating" value="5"><label class="full" for="star5" title="Awesome - 5 stars"></label>

                                <input type="radio" id="star4" class="name_rating" name="rating" value="4"><label class="full" for="star4" title="Pretty good - 4 stars"></label>

                                <input type="radio" id="star3" class="name_rating" name="rating" value="3"><label class="full" for="star3" title="Meh - 3 stars"></label>

                                <input type="radio" id="star2" class="name_rating" name="rating" value="2"><label class="full" for="star2" title="Kinda bad - 2 stars"></label>

                                <input type="radio" id="star1" class="name_rating" name="rating" value="1"><label class="full" for="star1" title="Sucks big time - 1 star"></label>

                            </span>

                        </h5>

                        <button type="button" class="close d-block d-sm-none" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div class="col-md-12 col-lg-4 text-right">
                        <div class="btn-group bootstrap-select">
                            <button type="button" class="dropdown-toggle btn btn-success btn-sm" data-toggle="dropdown" role="button" data-id="cd2ace9eae43b8b8940b89f3dbf1bb59" title="New">
                                <span class="filter-option pull-left">New</span>&nbsp;<span class="bs-caret"></span>
                            </button><div class="dropdown-menu open" role="combobox">
                            <ul class="dropdown-menu inner" role="listbox" aria-expanded="false">
                                <li data-original-index="1" class="selected"><a tabindex="0" class="" data-tokens="null" role="option" aria-disabled="false" aria-selected="true"><span class="text">New</span><span class="glyphicon glyphicon-ok check-mark"></span></a></li>
                                <li data-original-index="2"><a tabindex="0" class="" data-tokens="null" role="option" aria-disabled="false" aria-selected="false"><span class="text">Shortlisted</span><span class="glyphicon glyphicon-ok check-mark"></span></a></li>
                                <li data-original-index="3"><a tabindex="0" class="" data-tokens="null" role="option" aria-disabled="false" aria-selected="false"><span class="text">Interview</span><span class="glyphicon glyphicon-ok check-mark"></span></a></li>
                                <li data-original-index="4"><a tabindex="0" class="" data-tokens="null" role="option" aria-disabled="false" aria-selected="false"><span class="text">Offered</span><span class="glyphicon glyphicon-ok check-mark"></span></a></li>
                                <li data-original-index="5"><a tabindex="0" class="" data-tokens="null" role="option" aria-disabled="false" aria-selected="false"><span class="text">Hired</span><span class="glyphicon glyphicon-ok check-mark"></span></a></li>
                                <li data-original-index="6"><a tabindex="0" class="" data-tokens="null" role="option" aria-disabled="false" aria-selected="false"><span class="text">Rejected</span><span class="glyphicon glyphicon-ok check-mark"></span></a></li>
                            </ul>
                        </div>
                        
                        
                    </div>
                        
                                                    <a data-toggle="modal" href="#ScheduleInterviewModal">
                                <button class="btn btn-sm btn-primary" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Schedule Interview"><i class="far fa-calendar-alt"></i></button>
                            </a>
                        
                        

                            <span class="dropdown">
                                <button class="btn btn-sm" style="background-color:#ABA69E" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i class="fas fa-ellipsis-v"></i>
                                </button>
                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                    <a class="dropdown-item" href="#" data-toggle="modal" data-target="#MoveToAnotherJob"><i class="fas fa-share"></i> Move to another job</a>
                                                                        <a class="dropdown-item" href="#" onclick="move_to_talent(this)" id="move_talent_cd2ace9eae43b8b8940b89f3dbf1bb59"><i class="fas fa-user-friends"></i> Move to Talent pool</a>
                                                                      
                                    <a class="dropdown-item remove" id="delete_applicant_cd2ace9eae43b8b8940b89f3dbf1bb59" href="#"><i class="far fa-trash-alt"></i> Delete</a>
                                                                </div>
                            </span>
                    </div>
                </div>

                <div class="card card-nav-tabs card-plain">
                        <div class="card-header card-header-danger">

                            <div class="nav-tabs-navigation">
                                <div class="nav-tabs-wrapper">
                                    <ul class="nav nav-tabs" data-tabs="tabs">
                                        <li class="nav-item">
                                            <a class="nav-link  active" href="#profile" data-toggle="tab" onclick="set_session(\'profile\')">Profile</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link " href="#interviews" data-toggle="tab">Interviews</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link " href="#timeline" data-toggle="tab">Timeline</a>
                                        </li>
                                        <li class="nav-item">
                                            <a class="nav-link " href="#comments" data-toggle="tab">Comments 
                                                (0)
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                </div>

            </div>
            <div class="modal-body modal-dark-bg">
                <div class="card card-nav-tabs card-plain">
                    <div class="card-body">
                        <div class="tab-content text-center">
                            <div class="tab-pane  active" id="profile">
                                <div class="candidate-profile">
                                    <div class="row">
                                        <div class="col">
                                            <div class="photo">
                                                <img src="https://ui-avatars.com/api/?name=Mohamed+MBOUP&amp;bold=true&amp;rounded=true">
                                                <span class="candidate-name">Mohamed MBOUP
                                        
                                                </span>
                                                <span class="profile-actions">
                                                    <a data-toggle="modal" href="#EditProfileModal"><button class="btn btn-link btn-sm"><i class="fa fa-edit"></i> Edit Profile</button></a>
                                                    <a href="javascript:click_copy(\'https://dash.recooty.com/applications?pipeline=[]=new&amp;pipeline[]=shortlisted&amp;pipeline[]=interview&amp;pipeline[]=offered&amp;application=cd2ace9eae43b8b8940b89f3dbf1bb59\')"><button class="btn btn-link btn-sm"><i class="far fa-copy"></i> Copy URL</button></a>

                                                </span>
                                            </div>
                                            
                                            
                                            <div class="applicant-opening">
                                                                                                    <small><i class="fas fa-circle text-success"></i></small>
                                                
                                                                                                PI101 - Full Stack Web Developer
                                                                                                    <small>(
                                                                                                                    Dakar
                                                                                                                )
                                                    </small>
                                                
                                            </div>
                                                                                                                                </div>

                                    </div>
                                    <div class="row">
                                        <div class="col">
                                            <div class="profile-details">
                                                                                                    <span class="profile-details-col">
                                                        <i class="fas fa-map-marker-alt"></i> Thies
                                                    </span>
                                                                                                                                                    <span class="profile-details-col">
                                                        <i class="fas fa-briefcase"></i> 6-7 Years
                                                    </span>
                                                                                                    <span class="profile-details-col">
                                                        <i class="far fa-calendar-alt"></i> 06 Nov 2024
                                                    </span>
                                                     <span class="profile-details-col">
                                                        <i class="far fa-folder"></i> Dashboard
                                                    </span>
                                            </div>
                                            <div class="applicant-contact-details">
                                                <span class="profile-details-col">
                                                    <i class="far fa-envelope"></i> kikitraiteursn@yahoo.fr
                                                </span>
                                                                                                    <span class="profile-details-col">
                                                        <i class="fas fa-mobile-alt"></i>
                                                        776749191
                                                    </span>

                                                
                                            </div>
                                        </div>
                                    </div>
                                <div class="custom-answers-block">
                                                                        
                                </div>
                                    <!--                                     <span class="badge badge-pill badge-default"></span>
                                     -->


                                                                
                                                        <span class="badge badge-pill badge-default"></span>
                                
                            
                                <div>

                                </div>
                                    <div class="row">
                                                                                    <div id="holds-the-iframe" class="col holds-the-iframe-blank">
                                                                                                
                                                

                                                
                                                    <div id="resumepdf" class=" pdfobject-container"><embed class="pdfobject" src="https://recooty.s3.ap-south-1.amazonaws.com/resumes/Mohamed-MBOUP-1730932492.pdf?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&amp;X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Credential=AKIA5A7SJY73OFYWWR6L%2F20241106%2Fap-south-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20241106T225035Z&amp;X-Amz-SignedHeaders=host&amp;X-Amz-Expires=60&amp;X-Amz-Signature=eb4f794139df43e42ab4e9b3dae0710a60de0c254189f8730f1b9823c52d401f#toolbar=0" type="application/pdf" style="overflow: auto; width: 100%; height: 100%;"></div>
                                                    <script>PDFObject.embed("https://recooty.s3.ap-south-1.amazonaws.com/resumes/Mohamed-MBOUP-1730932492.pdf?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&amp;X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Credential=AKIA5A7SJY73OFYWWR6L%2F20241106%2Fap-south-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20241106T225035Z&amp;X-Amz-SignedHeaders=host&amp;X-Amz-Expires=60&amp;X-Amz-Signature=eb4f794139df43e42ab4e9b3dae0710a60de0c254189f8730f1b9823c52d401f#toolbar=0", "#resumepdf");</script>
                                                    <style>
                                                        .pdfobject-container { height: 30rem; border: 0; padding-left: 5%; padding-right: 5%; }
                                                    </style>

                                                    
                                                                                            </div>
                                                                            </div>
                                </div>
                            </div>
                            <div class="tab-pane " id="interviews">

                                <div class="row">
                                    <div class="col">
                                                                    <!-- interview-->
                                    <div class="row interview-block text-center">
                                        <div class="col">
                                            <div class="">
                                                No interterviews found.
                                            </div>
                                            <div>
                                                <a data-toggle="modal" href="#ScheduleInterviewModal">
                                                    <button class="btn btn-primary btn-wd">Schedule Interview</button>
                                                </a>

                                            </div>

                                        </div>

                                    </div>
                                    <!-- interview end-->
                                



                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane " id="timeline">
                                    <ol class="activity-feed " id="feedContent">
                                        <span style="display: none;" class="serverOffset">10</span>








<li class="feed-item">
        <time class="date" datetime="11-06">06 Nov 2024</time>
        <span class="text">

            <strong onclick="sibc(this)" id="applicant_detail_cd2ace9eae43b8b8940b89f3dbf1bb59" style="cursor:pointer;">Mohamed MBOUPs</strong> application has been added by <strong>Marthe DIATTA</strong>
        </span>
</li>















                                    </ol>
                            </div>
                            <div class="tab-pane " id="comments">
                                <div class="card card-timeline card-plain text-left">
                                    <div class="card-body">
                                       <!-- comment-->
                                       <div class="row comment-block text-center">
                                                <div class="col">
                                                    <button class="btn btn-primary" data-toggle="modal" data-target="#AddComment">Add New Comment</button>

                                            </div>
                                        </div>
                                        <!-- comment end-->



                                            
                                                

                                            

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
            <div class="modal-footer">
                              <button type="button" class="btn btn-primary btn-sm footer-btns" onclick="actions.shortlist_candidate(\'cd2ace9eae43b8b8940b89f3dbf1bb59\')" id="shortlist"><i class="far fa-thumbs-up"></i> Shortlist</button>
                <button class="btn btn-sm btn-danger" data-toggle="modal" data-target="#RejectCandidate"><i class="far fa-thumbs-down"></i> Reject </button>
              
              
              

              
              
              
              
                                          <a href="https://recooty.s3.ap-south-1.amazonaws.com/resumes/Mohamed-MBOUP-1730932492.pdf" target="_blank">
                
                <button class="btn btn-sm"><i class="fas fa-download"></i> Download <span class="hide-on-mobile">Resume</span></button>
              </a>
                          </div>
          </div>
        </div>
      </div>

  <div class="modal fade rotate" id="EditProfileModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    
                        <h4 class="modal-title">Edit Profile</h4>

                </div>
                <div class="container"></div>
                <div class="modal-body modal-edit-profile">
                        <form id="edit_profile">
                                <input type="hidden" name="_token" value="1qJz6h8GeRs0tPoYVX4L0urdjndCeqNiJbmhk4c7">                                <input type="hidden" name="application_id" value="cd2ace9eae43b8b8940b89f3dbf1bb59">
                          <div class="form-row">
                                        <div class="form-group col-md-6">
                                          <label for="application_fname">First Name <span>*</span></label>
                                          <input type="text" class="form-control" name="application_fname" required="" value="Mohamed">
                                        </div>
                                        <div class="form-group col-md-6">
                                          <label for="application_lname">Last Name <span>*</span></label>
                                          <input type="text" class="form-control" name="application_lname" required="" value="MBOUP">
                                        </div>
                                    </div>
                                  <label>Email Address <span>*</span></label>
                                  <div class="form-group">
                                    <input type="email" class="form-control" name="application_email" required="" value="kikitraiteursn@yahoo.fr">
                                  </div>

                                    <div class="form-group">
                                            <label for="lastName">Mobile Number</label>
                                            <input type="text" class="form-control" name="application_mobile" required="" value="776749191">
                                    </div>
                                    <div class="form-row">
                                            <div class="form-group col-md-6">
                                              <label for="application_location">Current city</label>
                                              <input type="text" class="form-control" name="application_location" required="" value="Thies">
                                            </div>
                                            <div class="form-group col-md-6">
                                              <label for="application_experience">Experience</label>
                                              <select class="form-control" name="application_experience" required="">
                                                  <option value="null">Select Experience </option>
                                                    <option value="0">Fresher</option>
                                                    <option value="0-1">0-1 Years</option>
                                                    <option value="1-2">1-2 Years</option>
                                                    <option value="2-3">2-3 Years</option>
                                                    <option value="3-4">3-4 Years</option>
                                                    <option value="4-5">4-5 Years</option>
                                                    <option value="5-6">5-6 Years</option>
                                                    <option value="6-7" selected="">6-7 Years</option>
                                                    <option value="7-8">7-8 Years</option>
                                                    <option value="8-9">8-9 Years</option>
                                                    <option value="9-10">9-10 Years</option>
                                                    <option value="10+">10+ Years</option>

                                              </select>
                                            </div>
                                        </div>


                                        <div class="form-group">
                                            <label for="application_skills">Skills <small>(Enter skill and press enter)</small></label>
                                            <div class="bootstrap-tagsinput"><input type="text" placeholder=""></div><input type="text" value="" name="tags" class="tagsinput form-control" data-role="tagsinput" data-color="danger" style="display: none;">
                                        </div>


                </form></div>
                <div class="modal-footer">
                    <a href="#" data-dismiss="modal" class="btn">Close</a>
                    <button type="submit" data-dismiss="modal" onclick="edit_profile(\'cd2ace9eae43b8b8940b89f3dbf1bb59\')" class="btn btn-primary">Save changes</button>
                </div>
            

            </div>
        </div>
    </div>

    <!-- Modal 3-->
    <div class="modal fade rotate" id="ScheduleInterviewModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    
                        <h4 class="modal-title">Schedule Interview</h4>

                </div>
                <div class="container"></div>
                <div class="modal-body modal-edit-profile">
                    <form id="schedule_interview">
                        <input type="hidden" name="_token" value="1qJz6h8GeRs0tPoYVX4L0urdjndCeqNiJbmhk4c7">                        <input type="hidden" name="interview_candidate" value="cd2ace9eae43b8b8940b89f3dbf1bb59">

                        
                        <label for="interview_date">Interview Date &amp; Time <span>*</span></label>
                        <div class="form-row">
                                <div class="input-group col">
                                    <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="nc-icon nc-calendar-60"></i></span>
                                    </div>
                                    <input type="text" class="form-control datepicker" name="interview_date" required="">
                                </div>
                                <div class="input-group col">
                                    <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="nc-icon nc-watch-time"></i></span>
                                    </div>
                                    <input type="text" class="form-control timepicker" name="interview_time" required="">
                                </div>
                        </div>
                        <div class="form-group">
                                <label for="interview_type">Interview Type <span>*</span></label>
                                <select class="form-control" name="interview_type" id="interview_type" onchange="showfield(this.options[this.selectedIndex].value)" required="">
                                    <option value="">--Select--</option>
                                    <option value="Walk-in">Walk-in</option>
                                    <option value="Telephonic">Telephonic</option>
                                    <option value="Video Conferencing">Video Conferencing</option>

                                </select>
                            </div>

                            <div id="VenueID"></div>

                            <script type="text/javascript">
                            function showfield(name){
                                var locations = `
                            <div class="form-group">
                                <label for="interview_location">Interview Venue <span>*</span></label>
                                <select class="form-control" name="interview_location">
                                                                                                                                        <option value="Dakar (Almadies, Dakar, Dakar - Senegal)">Dakar (Almadies, Dakar, Dakar - Senegal)</option>
                                                                                                                            </select>
                            </div>
                            `;
                            if(name==\'Walk-in\')document.getElementById(\'VenueID\').innerHTML=locations;
                            else document.getElementById(\'VenueID\').innerHTML="";
                            }
                            </script>
                            <div class="form-group">
                                <label for="application_experience">Interviewer <span>*</span></label>
                                <select class="form-control" name="interviewer" required="">
                                    <option selected="" disabled="">--Select--</option>
                                                                    <option value="e4baa6e2182735b091d8ebe8534bb6cf">
                                        Marthe DIATTA
                                    </option>
                                                                </select>
                            </div>

                            <div class="form-group">
                                <label for="lastName">Message (Optional)</label>
                                <textarea class="form-control" name="interview_message"></textarea>
                            </div>

                            <div class="form-check mt-3">
                                <div class="form-check">
                                    <label class="form-check-label">
                                    <input class="form-check-input" type="checkbox" value="yes" name="notify_candidate" checked=""> Notify candidate via email.
                                    <span class="form-check-sign"></span>
                                    </label>
                                </div>
                            </div>
                            <div class="form-check mt-3">
                                <div class="form-check">
                                    <label class="form-check-label">
                                    <input class="form-check-input" type="checkbox" value="yes" name="notify_interviewer" checked=""> Notify interviewer via email.
                                    <span class="form-check-sign"></span>
                                    </label>
                                </div>
                            </div>
                    </form>

                </div>
                <div class="modal-footer">	<a href="#" data-dismiss="modal" class="btn">Close</a>
                <a href="#" class="btn btn-primary" data-dismiss="modal" onclick="schedule_interview(\'cd2ace9eae43b8b8940b89f3dbf1bb59\')">Schedule Interview</a>

                </div>
            </div>
        </div>
    </div>

    <!-- Modal 4-->
    <div class="modal fade" id="InterviewFeedbackModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    
                        <h4 class="modal-title">Interview Feedback</h4>

                </div>
                <div class="container"></div>
                <div class="modal-body modal-edit-profile">
                    <form id="interview_feedback">
                        <input type="hidden" name="_token" value="1qJz6h8GeRs0tPoYVX4L0urdjndCeqNiJbmhk4c7">                        <input type="hidden" name="interview_id" value="" id="interview_id_feedback">
                        <input type="hidden" name="application_id" value="cd2ace9eae43b8b8940b89f3dbf1bb59">

                            <div class="form-group">
                                <label for="rating"></label>
                                <div class="rating-interview">
                                    <input type="radio" id="star55" name="interview_rating" value="5"><label class="full" for="star55" title="Awesome - 5 stars"></label>

                                    <input type="radio" id="star44" name="interview_rating" value="4"><label class="full" for="star44" title="Pretty good - 4 stars"></label>

                                    <input type="radio" id="star33" name="interview_rating" value="3"><label class="full" for="star33" title="Meh - 3 stars"></label>

                                    <input type="radio" id="star22" name="interview_rating" value="2"><label class="full" for="star22" title="Kinda bad - 2 stars"></label>

                                    <input type="radio" id="star11" name="interview_rating" value="1"><label class="full" for="star11" title="Sucks big time - 1 star"></label>

                                </div>
                            </div>
                            <br><br>


                            <div class="form-group">
                                <div class="form-check-radio form-check-inline">
                                    <label class="form-check-label">
                                        <input class="form-check-input" type="radio" name="interview_decision" id="interview_decision" value="1">
                                       Hire
                                        <span class="form-check-sign"><i class="fas fa-thumbs-up text-success"></i></span>
                                    </label>
                                </div>
                                <div class="form-check-radio form-check-inline ">
                                    <label class="form-check-label">
                                        <input class="form-check-input" type="radio" name="interview_decision" id="interview_decision" value="0">
                                        No Hire
                                        <span class="form-check-sign"><i class="fas fa-thumbs-down text-danger"></i></span>
                                    </label>
                                </div>
                            </div>


                            <div class="form-group">
                                <label for="interview_feedback">Remarks <small>(Optional)</small></label>
                                <textarea class="form-control" name="interview_feedback"></textarea>
                            </div>


                    </form>

                </div>
                <div class="modal-footer">	<a href="#" data-dismiss="modal" class="btn">Close</a>
        <a href="#" class="btn btn-primary" onclick="interview_feedback(\'cd2ace9eae43b8b8940b89f3dbf1bb59\')">Submit Feedback</a>

                </div>
            </div>
        </div>
    </div>
<!-- Modal 5-->
<div class="modal fade" id="EditInterviewFeedbackModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                
                    <h4 class="modal-title">Edit Interview Feedback</h4>

            </div>
            <div class="container"></div>
            <div class="modal-body modal-edit-profile">
                <form id="interview_feedback_2">
                    <input type="hidden" name="_token" value="1qJz6h8GeRs0tPoYVX4L0urdjndCeqNiJbmhk4c7">                    <input type="hidden" name="interview_id" id="interview_id_edit_feedback">
                    <input type="hidden" name="application_id" value="cd2ace9eae43b8b8940b89f3dbf1bb59">

                        <div class="form-group">
                            <label for="rating"></label>
                            <div class="rating-interview">
                                <input type="radio" id="estar55" name="interview_rating" value="5"><label class="full" for="estar55" title="Awesome - 5 stars"></label>

                                <input type="radio" id="estar44" name="interview_rating" value="4"><label class="full" for="estar44" title="Pretty good - 4 stars"></label>

                                <input type="radio" id="estar33" name="interview_rating" value="3"><label class="full" for="estar33" title="Meh - 3 stars"></label>

                                <input type="radio" id="estar22" name="interview_rating" value="2"><label class="full" for="estar22" title="Kinda bad - 2 stars"></label>

                                <input type="radio" id="estar11" name="interview_rating" value="1"><label class="full" for="estar11" title="Sucks big time - 1 star"></label>

                            </div>
                        </div>
                        <br><br>


                        <div class="form-group">
                            <div class="form-check-radio form-check-inline">
                                <label class="form-check-label">
                                    <input class="form-check-input" type="radio" name="interview_decision" id="edit_interview_decision_hire" value="1">
                                   Hire
                                    <span class="form-check-sign"><i class="fas fa-thumbs-up text-success"></i></span>
                                </label>
                            </div>
                            <div class="form-check-radio form-check-inline ">
                                <label class="form-check-label">
                                    <input class="form-check-input" type="radio" name="interview_decision" id="edit_interview_decision_nohire" value="0">
                                    No Hire
                                    <span class="form-check-sign"><i class="fas fa-thumbs-down text-danger"></i></span>
                                </label>
                            </div>
                        </div>


                        <div class="form-group">
                            <label for="interview_feedback">Remarks <small>(Optional)</small></label>
                            <textarea class="form-control" name="interview_feedback" id="edit_interview_feedback">  </textarea>
                        </div>
                </form>

            </div>
            <div class="modal-footer">	<a href="#" data-dismiss="modal" class="btn">Close</a>
    <a href="#" class="btn btn-primary" onclick="interview_feedback(\'cd2ace9eae43b8b8940b89f3dbf1bb59\', true)">Edit Feedback</a>

            </div>
        </div>
    </div>
</div>


<!-- Modal 6-->
<div class="modal fade" id="MoveToAnotherJob">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    
                        <h4 class="modal-title">Move to Another Job</h4>

                </div>
                <div class="container"></div>
                <div class="modal-body modal-edit-profile">
                    <form id="move_to_another">
                        <input type="hidden" name="_token" value="1qJz6h8GeRs0tPoYVX4L0urdjndCeqNiJbmhk4c7">                        <input type="hidden" name="application_id" value="cd2ace9eae43b8b8940b89f3dbf1bb59">
                            <div class="form-group">
                                    <label for="job_id">Assign to Opening <span>*</span></label>
                                    <select class="form-control" name="job_id" required="">
                                                                                        <option value="52668" selected="">Full Stack Web Developer (PI101)</option>
                                                                              </select>
                            </div>
                            <div class="form-group">
                                <label for="application_status">Stage <span>*</span></label>
                                <select class="form-control" name="application_status" required="">
                                    <option value="0" selected="">New</option>
                                    <option value="1">Shortlisted</option>
                                    <option value="3">Interview</option>
                                    <option value="4">Offered</option>
                                    <option value="5">Hired</option>
                                    <option value="2">Rejected</option>
                                </select>
                        </div>
                    </form>

                </div>
                <div class="modal-footer">	<a href="#" data-dismiss="modal" class="btn">Close</a>
        <a href="#" class="btn btn-primary" onclick="move_to_another(\'cd2ace9eae43b8b8940b89f3dbf1bb59\')">Move</a>

                </div>
            </div>
        </div>
</div>

<!-- Modal 7-->
<div class="modal fade" id="RejectCandidate">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                
                    <h4 class="modal-title">Reject Candidate</h4>
            </div>
            <div class="container"></div>
            <div class="modal-body modal-edit-profile">
                <form id="reject_candidate">
                    <input type="hidden" name="_token" value="1qJz6h8GeRs0tPoYVX4L0urdjndCeqNiJbmhk4c7">                    <input type="hidden" name="application_id" value="cd2ace9eae43b8b8940b89f3dbf1bb59">

                        <div class="form-group">
                            <label for="rejection_reason">Rejection Reason <small><span> Visible to your team only. (Optional) </span></small></label>
                            <textarea class="form-control" name="application_rejection_reason"></textarea>
                        </div>

                        <div class="form-check mt-3">
                            <div class="form-check">
                                <label class="form-check-label">
                                <input class="form-check-input" type="checkbox" value="yes" name="application_rejection_notify" checked=""> Notify candidate via email.
                                <span class="form-check-sign"></span>
                                </label>
                            </div>
                        </div>
                </form>
            </div>
            <div class="modal-footer">
                <a href="#" data-dismiss="modal" class="btn">Close</a>
                <a href="#" class="btn btn-danger" onclick="actions.reject_candidate(\'cd2ace9eae43b8b8940b89f3dbf1bb59\')" id="candidate_reject_btn">Reject Candidate</a>
            </div>
        </div>
    </div>
</div>

<!-- Modal 8-->
<div class="modal fade" id="CancelInterview">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    
                        <h4 class="modal-title">Cancel Interview</h4>
                </div>
                <div class="container"></div>
                <div class="modal-body modal-edit-profile">
                    <form id="cancel_interview">
                        <input type="hidden" name="_token" value="1qJz6h8GeRs0tPoYVX4L0urdjndCeqNiJbmhk4c7">                        <input type="hidden" name="interview_id" id="interview_id" value="">

                            <div class="form-group">
                                <label for="interview_cancel_reason">Cancellation Reason <span>*</span><small><span> Visible to your team and candidate. </span></small></label>
                                <textarea class="form-control" name="interview_cancel_reason" required=""></textarea>
                            </div>

                            <div class="form-check mt-3">
                                <div class="form-check">
                                    <label class="form-check-label">
                                    <input class="form-check-input" type="checkbox" value="yes" name="interview_cancel_notify" checked=""> Notify candidate via email.
                                    <span class="form-check-sign"></span>
                                    </label>
                                </div>
                            </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <a href="#" data-dismiss="modal" class="btn">Close</a>
                    <a href="#" class="btn btn-danger" onclick="actions.cancel_interview(\'cd2ace9eae43b8b8940b89f3dbf1bb59\')">Cancel Interview</a>
                </div>
            </div>
        </div>
    </div>
<!-- Modal 9-->
<div class="modal fade rotate" id="RecheduleInterviewModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                        <h4 class="modal-title">Reschedule Interview</h4>

                </div>
                <div class="container"></div>
                <div class="modal-body modal-edit-profile">
                    <form id="reschedule_interview">
                        <input type="hidden" name="_token" value="1qJz6h8GeRs0tPoYVX4L0urdjndCeqNiJbmhk4c7">                        <input type="hidden" name="interview_id" id="res_interview_id" value="">
                        <input type="hidden" name="interview_candidate" value="cd2ace9eae43b8b8940b89f3dbf1bb59">



                        <label for="interview_date">Interview Date &amp; Time <span>*</span></label>
                        <div class="form-row">
                                <div class="input-group col">
                                    <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="nc-icon nc-calendar-60"></i></span>
                                    </div>
                                    <input type="text" class="form-control datepicker" name="interview_date" required="">
                                </div>
                                <div class="input-group col">
                                    <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="nc-icon nc-watch-time"></i></span>
                                    </div>
                                    <input type="text" class="form-control timepicker" name="interview_time" required="">
                                </div>
                        </div>
                        <div class="form-group">
                                <label for="interview_type">Interview Type <span>*</span></label>
                                <select class="form-control" name="interview_type" id="interview_type" onchange="showfieldre(this.options[this.selectedIndex].value)" required="">
                                    <option value="">--Select--</option>
                                    <option value="Walk-in">Walk-in</option>
                                    <option value="Telephonic">Telephonic</option>
                                    <option value="Video Conferencing">Video Conferencing</option>

                                </select>
                            </div>

                            <div id="VenueID2"></div>

                            <script type="text/javascript">
                            function showfieldre(name){
                                var locations = `
                            <div class="form-group">
                                <label for="interview_location">Interview Venue <span>*</span></label>
                                <select class="form-control" name="interview_location">
                                                                                                                                        <option value="Dakar (Almadies, Dakar, Dakar - Senegal)">Dakar (Almadies, Dakar, Dakar - Senegal)</option>
                                                                                                                            </select>
                            </div>
                            `;
                            if(name==\'Walk-in\')document.getElementById(\'VenueID2\').innerHTML=locations;
                            else document.getElementById(\'VenueID2\').innerHTML="";
                            }
                            </script>
                            <div class="form-group">
                                <label for="application_experience">Interviewer <span>*</span></label>
                                <select class="form-control" name="interviewer" required="">
                                    <option selected="" disabled="">--Select--</option>
                                                                    <option value="e4baa6e2182735b091d8ebe8534bb6cf">
                                        Marthe DIATTA
                                    </option>
                                                                </select>
                            </div>

                            <div class="form-group">
                                <label for="lastName">Message (Optional)</label>
                                <textarea class="form-control" name="interview_message"></textarea>
                            </div>

                            <div class="form-check mt-3">
                                <div class="form-check">
                                    <label class="form-check-label">
                                    <input class="form-check-input" type="checkbox" value="yes" name="notify_candidate" checked=""> Notify candidate via email.
                                    <span class="form-check-sign"></span>
                                    </label>
                                </div>
                            </div>
                            <div class="form-check mt-3">
                                <div class="form-check">
                                    <label class="form-check-label">
                                    <input class="form-check-input" type="checkbox" value="yes" name="notify_interviewer" checked=""> Notify interviewer via email.
                                    <span class="form-check-sign"></span>
                                    </label>
                                </div>
                            </div>
                    </form>

                </div>
                <div class="modal-footer">	<a href="#" data-dismiss="modal" class="btn">Close</a>
                <a href="#" class="btn btn-primary" data-dismiss="modal" onclick="reschedule_interview(\'cd2ace9eae43b8b8940b89f3dbf1bb59\')">Rechedule Interview</a>

                </div>
            </div>
        </div>
    </div>
<!-- Modal 10 -->
    <div class="modal fade" id="AddComment">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        
                            <h4 class="modal-title">Add Comment</h4>

                    </div>
                    <div class="container"></div>
                    <div class="modal-body modal-edit-profile">
                        <form id="application_comment">
                            <input type="hidden" name="_token" value="1qJz6h8GeRs0tPoYVX4L0urdjndCeqNiJbmhk4c7">                            <input type="hidden" name="application_id" value="cd2ace9eae43b8b8940b89f3dbf1bb59">
                                <div class="form-group">
                                    <label for="comment">Comment</label>
                                    <textarea class="form-control" name="comment"></textarea>
                                </div>
                        </form>
                    </div>
                    <div class="modal-footer">	<a href="#" data-dismiss="modal" class="btn">Close</a>
                        <a href="#" class="btn btn-primary" onclick="application_comment(\'cd2ace9eae43b8b8940b89f3dbf1bb59\', false)">Submit Comment</a>
                    </div>
                </div>
            </div>
        </div>
<!-- Modal 11 -->
        <div class="modal fade" id="EditComment">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                                <h4 class="modal-title">Edit Comment</h4>

                        </div>
                        <div class="container"></div>
                        <div class="modal-body modal-edit-profile">
                            <form id="application_comment_2">
                                <input type="hidden" name="_token" value="1qJz6h8GeRs0tPoYVX4L0urdjndCeqNiJbmhk4c7">                                <input type="hidden" name="comment_id" value="" id="comment_id">
                                <input type="hidden" name="application_id" value="cd2ace9eae43b8b8940b89f3dbf1bb59">
                                    <div class="form-group">
                                        <label for="comment">Comment</label>
                                        <textarea class="form-control" name="comment" id="comment_msg"></textarea>
                                    </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <a href="#" data-dismiss="modal" class="btn">Close</a>
                            <a href="#" class="btn btn-primary" onclick="application_comment(\'cd2ace9eae43b8b8940b89f3dbf1bb59\', true)" id="edit_comment_btn">Edit Comment</a>
                        </div>
                    </div>
                </div>
            </div>
<!-- Modal 12 -->
        

<!-- Test Modal-->

<div class="modal fade" id="UpdateResume">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                        <h4 class="modal-title">Upload Resume</h4>

                </div>
                <div class="container"></div>
                <div class="modal-body modal-edit-profile">
                        <form id="update_resume">
                                <input type="hidden" name="_token" value="1qJz6h8GeRs0tPoYVX4L0urdjndCeqNiJbmhk4c7">                                <input type="hidden" name="application_id" value="cd2ace9eae43b8b8940b89f3dbf1bb59">
                                <div class="">
                                        <label for="application_resume">Resume file</label>
                                        <input type="file" name="application_resume" id="application_resume" class="form-control">
                                </div>
                            </form>
                </div>
                <div class="modal-footer">
                        <a href="#" data-dismiss="modal" class="btn">Close</a>
                        <a href="#" class="btn btn-primary" onclick="update_resume()">Upload</a>
                </div>
            </div>
        </div>
    </div>

    <script>

        var header = $("#holds-the-iframe");
        setTimeout(function() {
            header.removeClass("holds-the-iframe");
            header.addClass("holds-the-iframe-blank");
        }, 2000);
    </script>';

        // Return the JSON response
        return response()->json(['modal' => $html]);
    }

    public function listlocation(Request $request)
    {
        // Fetch all records from the Screeningquestion model
        $locations = Location::all();

        // Generate the HTML for the table rows
        $tableRows = '<option disabled selected>Please select your location</option>';

        foreach ($locations as $location) {
            $tableRows .= '<option value="'.$location->id.'">'.htmlspecialchars($location->name).'</option>';
        }

        // Return the JSON response
        return response()->json(['location' => $tableRows]);
    }

    public function listdepartment(Request $request)
    {
        // Fetch all records from the Screeningquestion model
        $departments = Department::all();

        // Generate the HTML for the table rows
        $tableRows = '<option disabled selected>Please select your department</option>';

        foreach ($departments as $department) {
            $tableRows .= '<option value="'.$department->id.'">'.htmlspecialchars($department->name).'</option>';
        }

        // Return the JSON response
        return response()->json(['department' => $tableRows]);
    }

    public function listtemplate(Request $request)
    {
        // Fetch all records from the Screeningquestion model
        $screens = Screeningquestion::all();

        // Generate the HTML for the table rows
        $tableRows = '<option disabled selected>Please select your template</option>';

        foreach ($screens as $screen) {
            $tableRows .= '<option value="'.$screen->id.'">'.htmlspecialchars($screen->data).'</option>';
        }

        // Return the JSON response
        return response()->json(['screen' => $tableRows]);
    }

    // Method to save the title to the Screeningquestion table
    public function store(Request $request)
    {
        // 1. Valider les données reçues
        $validatedData = $request->validate([
            'data' => 'required|string|max:255', // ajustez les règles de validation selon vos besoins
        ]);

        try {
            // 2. Créer une nouvelle instance du modèle et y assigner les données
            $id = Screeningquestion::create([
                'data' => $validatedData['data'],
                'company_id' => Auth::user()->company->id,
            ]);

            // 4. Retourner une réponse JSON indiquant le succès
            return response()->json([
                'status' => 'created',
                'message' => 'Template created successfully',
                'redirect' => route('settings.screenquestion.show', $id), // Adaptez cette route si nécessaire
            ]);
        } catch (\Exception $e) {
            // En cas d'erreur, retourner une réponse JSON indiquant l'échec
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while creating the template: ' . $e->getMessage(),
            ], 500);
        }
    }
}
