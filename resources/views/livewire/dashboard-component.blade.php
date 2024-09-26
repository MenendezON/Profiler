
  @push('styles')
  <style>
    .card {
      border-radius: 12px;
    }

    .activity-feed {
      /* margin-top: -28px !important;
    margin-bottom: -41px !important; */
    }

    .activity-feed {
      padding-left: 15px;
      padding-right: 15px;
      list-style: none;
    }

    .activity-feed .feed-item {
      position: relative;
      padding-bottom: 20px;
      padding-left: 30px;
      border-left: 2px solid #e4e8eb;
    }

    .activity-feed .feed-item:last-child {
      border-color: transparent;
    }

    .activity-feed .feed-item::after {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      left: -6px;
      width: 10px;
      height: 10px;
      border-radius: 6px;
      background: #fff;
      border: 1px solid #f37167;
    }

    .activity-feed .feed-item .date {
      display: block;
      position: relative;
      top: -5px;
      color: #8c96a3;
      text-transform: uppercase;
      font-size: 13px;
    }

    .activity-feed .feed-item .text {
      position: relative;
      top: -3px;
    }

    .scroll {
      max-height: 235px;
      overflow-y: auto;
    }

    .dashed-line {
      border-style: dashed;
    }

    .stat-bg {
      color: #4aada6;
      font-size: 18px;
    }

    .stat-bg i {
      color: #a3aab5;
      font-size: 18px;
    }

    .stat-text {
      color: #8c96a3;
    }

    .blue:hover {
      text-decoration-line: none;
    }

    .card-footer a {
      color: #8c96a3;
    }

    .card-footer {
      min-height: 80px;
    }

    .stat-pointers a {
      text-decoration: none;
    }

    .stat-pointers:hover .stat-bg {
      color: #2a9a9d;
    }

    .stat-pointers:hover i {
      color: #2a9a9d;
    }

    .stat-pointers:hover .stat-text {
      color: #2a9a9d;
    }
  </style>
  @endpush
  <!-- start of the main content -->
  <div class="content pt-3">
    <div class="row">
      <div class="col-lg-4 col-md-6 col-sm-6">
        <div class="card card-stats">
          <div class="card-body">
            <div class="row">
              <div class="col-12 col-md-12">
                <span class="numbers text-left">
                  <span style="
                            font-size: 16px;
                            padding-left: 10px;
                            padding-top: 10px;
                          ">Job Openings
                    <span style="font-weight: 500; font-size: 18px">- {{$jobStatusCounts->sum('total_records');}}</span></span>
                </span>
                <a href="{{ route('opening.new') }}"><button
                    class="btn btn-sm btn-info pull-right d-none d-md-block">
                    Add Job Opening
                  </button>
                  <button type="button" class="btn btn-info btn-sm px-2 d-md-none pull-right">
                    <i class="fas fa-plus"></i></button></a>
              </div>
            </div>
          </div>
          <div class="card-footer text-center">
            <hr class="dashed-line" />
            <div class="row">
              <div class="col stat-pointers" data-toggle="tooltip" data-placement="top" title="Published">
                <a href="{{ route('openings', 'published') }}">
                  <span class="stat-bg"><i class="fas fa-briefcase"></i>
                  {{$jobStatusCounts->firstWhere('status', 'published')->total_records ?? 0;}}
                  </span>
                  <div class="stat-text">Published</div>
                </a>
              </div>
              <div class="col stat-pointers" data-toggle="tooltip" data-placement="top" title="Internal">
                <a href="{{ route('openings', 'internal') }}">
                  <span class="stat-bg"><i class="fas fa-briefcase"></i>
                  {{$jobStatusCounts->firstWhere('status', 'internal')->total_records ?? 0;}}
                  </span>
                  <div class="stat-text">Internal</div>
                </a>
              </div>
              <div class="col stat-pointers" data-toggle="tooltip" data-placement="top" title="Unpublished">
                <a href="{{ route('openings', 'unpublished') }}">
                  <span class="stat-bg"><i class="fas fa-briefcase"></i>
                  {{$jobStatusCounts->firstWhere('status', 'unpublished')->total_records ?? 0;}}
                  </span>
                  <div class="stat-text">Unpublished</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-8 col-md-6 col-sm-6">
        <div class="card card-stats">
          <div class="card-body">
            <div class="row">
              <div class="col-12 col-md-12">
                <span style="
                          font-size: 16px;
                          padding-top: 10px;
                          padding-left: 10px;
                        ">Total Applications
                  <span style="font-weight: 500; font-size: 18px">- 0</span></span>
                <a href="{{ route('applicant.new' )}}">
                  <button class="btn btn-sm btn-info d-none d-md-block pull-right">
                    Add Applicant
                  </button>
                  <button type="button" class="btn btn-info btn-sm px-2 d-md-none pull-right">
                    <i class="fas fa-plus"></i>
                  </button>
                </a>
              </div>
            </div>
          </div>
          <div class="card-footer text-center">
            <hr class="dashed-line" />
            <div class="row">
              <div class="col-6 col-md-4 col-lg-2 mb-3 mb-md-0 stat-pointers" data-toggle="tooltip"
                data-placement="top" title="Applied">
                <a href="{{ route('applications', ['pipeline'=>['new'], 'state'=>'all']) }}">
                  <span class="stat-bg"><i class="fa fa-user"></i>
                    0
                  </span>
                  <div class="stat-text">New</div>
                </a>
              </div>
              <div class="col-6 col-md-4 col-lg-2 mb-4 mb-md-0 3 stat-pointers" data-toggle="tooltip"
                data-placement="top" title="Shortlisted">
                <a href="{{ route('applications', ['pipeline'=>['shortlisted'], 'state'=>'all']) }}">
                  <span class="stat-bg"><i class="fa fa-user"></i>
                    0
                  </span>
                  <div class="stat-text">Shortlisted</div>
                </a>
              </div>
              <div class="col-6 col-md-4 col-lg-2 mb-4 mb-md-0 stat-pointers" data-toggle="tooltip"
                data-placement="top" title="Interview">
                <a href="{{ route('applications', ['pipeline'=>['interview'], 'state'=>'all']) }}">
                  <span class="stat-bg"><i class="fa fa-user"></i>
                    0
                  </span>
                  <div class="stat-text">Interview</div>
                </a>
              </div>
              <div class="col-6 col-md-4 col-lg-2 mb-4 mb-md-0 stat-pointers" data-toggle="tooltip"
                data-placement="top" title="Offered">
                <a href="{{ route('applications', ['pipeline'=>['offered'], 'state'=>'all']) }}">
                  <span class="stat-bg"><i class="fa fa-user"></i>
                    0
                  </span>
                  <div class="stat-text">Offered</div>
                </a>
              </div>
              <div class="col-6 col-md-4 col-lg-2 mb-4 mb-md-0 stat-pointers" data-toggle="tooltip"
                data-placement="top" title="Hired">
                <a href="{{ route('applications', ['pipeline'=>['hired'], 'state'=>'all']) }}">
                  <span class="stat-bg"><i class="fa fa-user"></i>
                    0
                  </span>
                  <div class="stat-text">Hired</div>
                </a>
              </div>
              <div class="col-6 col-md-4 col-lg-2 mb-4 mb-md-0 stat-pointers" data-toggle="tooltip"
                data-placement="top" title="Talent Pool">
                <a href="{{ route('applications', ['pipeline'=>['talentpool'],]) }}">
                  <span class="stat-bg"><i class="fa fa-user"></i>
                    0
                  </span>
                  <div class="stat-text">Talent Pool</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-4 col-sm-6">
        <div class="card">
          <div class="card-header">
            <div class="row">
              <div class="col-sm-7">
                <div class="numbers pull-left">2</div>
              </div>
              <div class="col-sm-5">
                <div class="pull-right">
                  <span class="stat-text"> Statistics </span>
                </div>
              </div>
            </div>
          </div>
          <div class="card-body">
            <h6 class="big-title">Jobs performance last week</h6>
            <canvas id="activeUsers" width="826" height="580"></canvas>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card">
          <div class="card-header">
            <div class="card-text">
              <h4 class="card-title">Upcoming Interviews</h4>
            </div>
          </div>
          <div class="card-body table-responsive scroll" style="min-height: 230px">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Applicant Name</th>
                  <th>Date Time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="3" class="text-center py-5">
                    <p>No upcoming interviews</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-footer">
            <hr />
            <div class="row">
              <div class="col-sm-7">
                <div class="stats">
                  <i class="far fa-calendar"></i>
                  <a href="{{ route('interviews') }}">View All</a>
                </div>
              </div>
              <div class="col-sm-5">
                <div class="pull-right"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-sm-6">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Setup Your Account</h4>
            <div class="progress-container progress-success">
              <div class="progress" style="
                        height: 25px;
                        margin-bottom: 10px;
                        border-radius: 50px;
                      ">
                <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40"
                  aria-valuemin="0" aria-valuemax="100" style="width: 40%">
                  <span class="progress-value">40%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="card-body">
            <ul class="list-unstyled" style="
                      font-size: 16px;
                      line-height: 35px;
                      margin-left: 20px;
                    ">
              <li class="text-success">
                <i class="fas fa-check"></i> Email Confirmed
              </li>
              <li>
                <a href="https://dash.recooty.com/settings/users"><i class="fas fa-plus"></i> Invite Teammates</a>
              </li>
              <li>
                <a href="https://dash.recooty.com/settings/locations/new"><i class="fas fa-plus"></i> Add Company
                  Location</a>
              </li>
              <li>
                <a href="https://dash.recooty.com/openings/new"><i class="fas fa-plus"></i> Post a Job</a>
              </li>
              <li class="text-success">
                <i class="fas fa-check"></i> Build Career Page
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-4 col-sm-6">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Recent Activities</h4>
          </div>
          <div class="card-body scroll">
            <ol class="activity-feed">
              <span style="display: none;" class="serverOffset">10</span>
              <li class="feed-item">
                <time class="date" datetime="08-08">08 Aug 2024</time>
                <span class="text">
                  <strong onclick="sibc(this)" id="applicant_detail_a03b6150d443b2884a49831d5d47978c" style="cursor:pointer;">Menendez NELSON's</strong> application has been moved to <strong>Interview</strong> by <strong>Menendez NELSON</strong>
                </span>
              </li>
              <li class="feed-item">
                <time class="date" datetime="08-08">08 Aug 2024</time>
                <span class="text">
                  <strong onclick="sibc(this)" id="applicant_detail_a03b6150d443b2884a49831d5d47978c" style="cursor:pointer;">Menendez NELSON's</strong> application has been moved to <strong>New</strong> by <strong>Menendez NELSON</strong>
                </span>
              </li>
              <li class="feed-item">
                <time class="date" datetime="08-08">08 Aug 2024</time>
                <span class="text">
                  <strong onclick="sibc(this)" id="applicant_detail_a03b6150d443b2884a49831d5d47978c" style="cursor:pointer;">Menendez NELSON's</strong> interview scheduled by <strong>Menendez NELSON</strong>
                </span>
              </li>
              <li class="feed-item">
                <time class="date" datetime="08-08">08 Aug 2024</time>
                <span class="text">
                  <strong onclick="sibc(this)" id="applicant_detail_a03b6150d443b2884a49831d5d47978c" style="cursor:pointer;">Menendez NELSON's</strong> application is shortlisted by <strong>Menendez NELSON</strong>
                </span>
              </li>
              <li class="feed-item">
                <time class="date" datetime="08-08">08 Aug 2024</time>
                <span class="text">
                  A Form template was deleted by <strong>Menendez NELSON</strong>
                </span>
              </li>
              <li class="feed-item">
                <time class="date" datetime="08-08">08 Aug 2024</time>
                <span class="text">
                  <strong onclick="sibc(this)" id="applicant_detail_eae626e454a1259aea9d5a5f34678718" style="cursor:pointer;">Odysseus Wagner Leigh Bird's</strong> application has been moved to <strong>talent pool</strong> by <strong>Menendez NELSON</strong>
                </span>
              </li>
              <li class="feed-item">
                <time class="date" datetime="08-08">08 Aug 2024</time>
                <span class="text">
                  <strong onclick="sibc(this)" id="applicant_detail_bb297fa5ab8fd5d893cacd78aa78be30" style="cursor:pointer;">Julie Cline Brandon Day's</strong> application has been moved to <strong>Shortlisted</strong> by <strong>Menendez NELSON</strong>
                </span>
              </li>
              <li class="feed-item">
                <time class="date" datetime="08-08">08 Aug 2024</time>
                <span class="text">
                  <strong onclick="sibc(this)" id="applicant_detail_eae626e454a1259aea9d5a5f34678718" style="cursor:pointer;">Odysseus Wagner Leigh Bird</strong> applied for <a href="https://dash.recooty.com/openings/details/6b0ac5c5ab0f8939442c42704c5493b0" style="text-decoration:none; color:#6b6a67;">
                    <strong>HR Assistant</strong></a>
                </span>
              </li>
            </ol>
          </div>
          <div class="card-footer ">
            <hr>
            <div class="stats">
              <i class="far fa-clock"></i> <a href="{{route('settings.activitylog')}}">View More</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- end of the main content -->

  @push('scripts')
  <script type="text/javascript">
    // $.ajaxSetup({
    //   headers: {
    //     "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content"),
    //   },
    // });
    // $(document).ajaxStart(function () {
    //   Pace.restart();
    // });
  </script>
  <script>
    // window.intercomSettings = {
    //   app_id: "qpacrxnm",
    //   name: "Menendez NELSON", // Full name
    //   user_hash:
    //     "7fd2f261af8fee8d9dc68984818d98aaedd92cf281f8cf22ff84b0c7def3784d", // HMAC using SHA-256
    //   email: "menelson@mercycorps.org", // Email address
    //   pricing_plan: "ULTRA",
    //   email_confirmed: "1",
    //   hide_default_launcher: true,
    //   alignment: "left",
    //   horizontal_padding: 100,
    //   vertical_padding: 50,
    //   company: {
    //     id: "mercy-corps",
    //     name: "Mercy Corps",
    //     created_at: 1723117734,
    //     plan: "ULTRA",
    //   },
    // };
  </script>
  <script>
    // (function () {
    //   var w = window;
    //   var ic = w.Intercom;
    //   if (typeof ic === "function") {
    //     ic("reattach_activator");
    //     ic("update", w.intercomSettings);
    //   } else {
    //     var d = document;
    //     var i = function () {
    //       i.c(arguments);
    //     };
    //     i.q = [];
    //     i.c = function (args) {
    //       i.q.push(args);
    //     };
    //     w.Intercom = i;
    //     var l = function () {
    //       var s = d.createElement("script");
    //       s.type = "text/javascript";
    //       s.async = true;
    //       s.src = "https://widget.intercom.io/widget/qpacrxnm";
    //       var x = d.getElementsByTagName("script")[0];
    //       x.parentNode.insertBefore(s, x);
    //     };
    //     if (w.attachEvent) {
    //       w.attachEvent("onload", l);
    //     } else {
    //       w.addEventListener("load", l, false);
    //     }
    //   }
    // })();
  </script>
  <script>
    interview = {
      initFullCalendar: function() {
        $calendar = $('#fullCalendar');

        today = new Date();
        y = today.getFullYear();
        m = today.getMonth();
        d = today.getDate();
        $calendar.fullCalendar({
          viewRender: function(view, element) {
            // We make sure that we activate the perfect scrollbar when the view isn't on Month
            if (view.name != 'month') {
              $(element).find('.fc-scroller').perfectScrollbar();
            }
          },
          header: {
            left: 'title',
            center: 'month,agendaWeek,agendaDay',
            right: 'prev,next,today'
          },
          defaultDate: today,
          selectable: true,
          selectHelper: true,
          views: {
            month: { // name of view
              titleFormat: 'MMMM YYYY'
              // other view-specific options here
            },
            week: {
              titleFormat: " MMMM D YYYY"
            },
            day: {
              titleFormat: 'D MMM, YYYY'
            }
          },

          select: function(start, end) {
            // Do Nothing
            // on select we show the Sweet Alert modal with an input
            // swal({
            //   title: 'Create an Event',
            //   html: '<div class="form-group">' +
            //     '<input class="form-control" placeholder="Event Title" id="input-field">' +
            //     '</div>',
            //   showCancelButton: true,
            //   confirmButtonClass: 'btn btn-success',
            //   cancelButtonClass: 'btn btn-danger',
            //   buttonsStyling: false
            // }).then(function(result) {

            //   var eventData;
            //   event_title = $('#input-field').val();

            //   if (event_title) {
            //     eventData = {
            //       title: event_title,
            //       start: start,
            //       end: end
            //     };
            //     $calendar.fullCalendar('renderEvent', eventData, true); // stick? = true
            //   }

            //   $calendar.fullCalendar('unselect');

            // });
          },
          eventLimit: true, // allow "more" link when too many events


          // color classes: [ event-blue | event-azure | event-green | event-orange | event-red ]
          events: []
        });
      }
    }
    $(document).ready(function() {
      interview.initFullCalendar();
    });
  </script>
  <script>
    stat = {
      initDashboardPageCharts: function() {
        chartColor = "#FFFFFF";
        ctx = document.getElementById("activeUsers").getContext("2d");

        gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
        gradientStroke.addColorStop(0, "#80b6f4");
        gradientStroke.addColorStop(1, chartColor);

        gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
        gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
        gradientFill.addColorStop(1, "rgba(249, 99, 59, 0.40)");

        myChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: [
              "01 Aug",
              "02 Aug",
              "03 Aug",
              "04 Aug",
              "05 Aug",
              "06 Aug",
              "07 Aug",
              "08 Aug",
            ],
            datasets: [{
              label: "Active Jobs",
              borderColor: "#6bd098",
              pointRadius: 0,
              pointHoverRadius: 0,
              fill: false,
              borderWidth: 3,
              data: [0, 4, 2, 8, 6, 12, 10, 16],
            }, ],
          },
          options: {
            legend: {
              display: false,
            },

            tooltips: {
              enabled: false,
            },

            scales: {
              yAxes: [{
                ticks: {
                  fontColor: "#9f9f9f",
                  beginAtZero: false,
                  maxTicksLimit: 5,
                  //padding: 20
                },
                gridLines: {
                  drawBorder: false,
                  borderDash: [8, 5],
                  zeroLineColor: "transparent",
                  color: "#eaeaea",
                },
              }, ],

              xAxes: [{
                barPercentage: 1.6,
                gridLines: {
                  drawBorder: false,
                  borderDash: [8, 5],
                  color: "#eaeaea",
                  zeroLineColor: "transparent",
                },
                ticks: {
                  padding: 20,
                  fontColor: "#9f9f9f",
                },
              }, ],
            },
          },
        });
      },
    };
  </script>
  <script>
    $(document).ready(function() {
      stat.initDashboardPageCharts();
    });
  </script>
  <!-- <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async></script> -->
  <script>
    // var OneSignal = window.OneSignal || [];
    // OneSignal.push(function () {
    //   OneSignal.init({
    //     appId: "981a4901-4199-4ed2-83e2-6e0ee8876486",
    //   });
    //   OneSignal.getUserId(function (userId) {
    //     if (userId == null) {
    //       //console.info("Unregistered");
    //     } else {
    //       jQuery.ajax({
    //         type: "POST",
    //         url: "https://dash.recooty.com/ajax/subscribe_notification",
    //         data: { player_id: userId },
    //         success: function (data) { },
    //       });
    //     }
    //   });
    // });
  </script>
  <script>
    var pageType = "dashboard";
  </script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/pdfmake.min.js"></script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/vfs_fonts.js"></script>
  <script type="text/javascript" src="https://cdn.datatables.net/v/bs4/jszip-2.5.0/dt-1.10.18/b-1.5.6/b-html5-1.5.6/r-2.2.2/rg-1.1.0/sc-2.0.0/datatables.min.js"></script>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/corejs-typeahead/1.2.1/typeahead.bundle.min.js" integrity="sha256-VCsWOz+0GuHdS/sIICtQNTFJdbaDI80rxvoB7BXabrU=" crossorigin="anonymous"></script>
  <script>
    // var routes = {
    //   activity_feed: "https://dash.recooty.com/ajax/feed",
    //   list_applications: "https://dash.recooty.com/ajax/list_applications/dashboard",
    //   application_action: "https://dash.recooty.com/ajax/application_action/dashboard",
    //   delete_application: "https://dash.recooty.com/ajax/delete_application/dashboard",
    //   view_application: "https://dash.recooty.com/ajax/view_application",
    //   update_application: "https://dash.recooty.com/ajax/update_application",
    //   schedule_interview: "https://dash.recooty.com/ajax/schedule_interview",
    //   reschedule_interview: "https://dash.recooty.com/ajax/reschedule_interview",
    //   move_stages: "https://dash.recooty.com/ajax/move_stages",
    //   interview_feedback: "https://dash.recooty.com/ajax/interview_feedback",
    //   interview_cancel: "https://dash.recooty.com/ajax/interview_cancel",
    //   set_session: "https://dash.recooty.com/ajax/set_session",
    //   move_to_talent: "https://dash.recooty.com/ajax/move_to_talent",
    //   move_to_another: "https://dash.recooty.com/ajax/move_to_another",
    //   set_rating: "https://dash.recooty.com/ajax/set_rating",
    //   application_comment: "https://dash.recooty.com/ajax/application_comment",
    //   delete_comment: "https://dash.recooty.com/ajax/delete_comment",
    //   update_resume: "https://dash.recooty.com/ajax/update_resume",
    //   tags_ajax: "https://dash.recooty.com/tags_ajax",
    //   get_openings_from_state: "https://dash.recooty.com/ajax/get_openings_from_state",
    // };
    // var md5_ids = [];
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

  <script src="https://cdnjs.cloudflare.com/ajax/libs/typeahead.js/0.11.1/typeahead.bundle.min.js"></script>

  <script src="https://dash.recooty.com/ckeditor/ckeditor.js"></script>
  <script>
    $(document).ready(function() {
      // Initialise the wizard
      demo.initWizard();
      setTimeout(function() {
        $(".card.card-wizard").addClass("active");
      }, 600);
    });
  </script>
  <script>
    //Function to count the words using regex
    var counter = function(value) {
      if (value.length == 0) {
        return 0;
      }
      var regex = /\s+/gi;
      var wordCount = value.trim().replace(regex, " ").split(" ").length;
      return wordCount;
    };
    jQuery(document).ready(function() {
      $("#btnNext").prop("disabled", true);

      CKEDITOR.replace("jobdesc");
      var jobdesc = CKEDITOR.instances.jobdesc;
      var jobdesccount = 30;
      jobdesc.on("change", function(e) {
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

    });

    //updation locations dynamically
    function refresh_locations() {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          document.getElementById("location_id").innerHTML = this.responseText;
        }
      };
      xhttp.open("POST", "https://dash.recooty.com/ajax/refresh_locations", true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.setRequestHeader("X-CSRF-TOKEN", document.head.querySelector("[name=csrf-token]").content);
      xhttp.send();
    }

    //updation templates dynamically
    function refresh_templates() {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          document.getElementById("template_id").innerHTML =
            this.responseText;
        }
      };
      xhttp.open("POST", "https://dash.recooty.com/ajax/refresh_templates", true);
      xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.setRequestHeader("X-CSRF-TOKEN", document.head.querySelector("[name=csrf-token]").content);
      xhttp.send();
    }

    //updation departments dynamically
    function refresh_departments() {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
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
  <!-- <script defer src="https://static.cloudflareinsights.com/beacon.min.js/vcd15cbe7772f49c399c6a5babf22c1241717689176015"
    integrity="sha512-ZpsOmlRQV6y907TI0dKBHq9Md29nnaEIPlkf84rnaERnq6zvWvPUqr2ft8M1aS28oN72PdrCzSjY4U6VaAw1EQ=="
    data-cf-beacon='{"rayId":"8affd68488b1c79c","serverTiming":{"name":{"cfL4":true}},"version":"2024.7.0","token":"69a9e84e010d46b3bf1aad4e167953d2"}'
    crossorigin="anonymous"></script> -->
  @endpush