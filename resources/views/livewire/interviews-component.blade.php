@push('styles')
<style type="text/css">
    .nav-pills {
      margin-top: 0px;
      margin-bottom: 10px;

    }

    .badge-completed {
      background-color: rgba(107, 208, 152, 0.2) !important;
      border: none;
      color: #2c2c2c;
      text-transform: none;
      font-weight: normal;
    }

    .badge-pending {
      background-color: rgba(251, 198, 88, 0.2) !important;
      border: none;
      color: #2c2c2c;
      text-transform: none;
      font-weight: normal;
    }

    .badge-cancelled {
      background-color: rgba(239, 129, 87, 0.2) !important;
      border: none;
      color: #2c2c2c;
      text-transform: none;
      font-weight: normal;
    }
  </style>
  <style>
    .applicant_name {
      /* font-size: 18px; */
      font-weight: 500;
      color: #044b7c;
      padding-left: 10px;
    }

    .app_rating {
      padding-left: 12px;
      letter-spacing: 5px;
      color: #ffb500;
    }
  </style>
<link rel="stylesheet" href="{{ URL::asset('assets/css/application.css') }}">
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
      <li class="breadcrumb-item"><a href="https://dash.recooty.com">Dashboard</a></li>
      <li class="breadcrumb-item active" aria-current="page">Interviews</li>
    </ol>
  </nav>
  <div class="row">
    <div class="col-md-8">
      <div class="card card-calendar">
        <div class="card-header">
          <h4 class="card-title">Interviews</h4>
        </div>
        <div class="card-body">
          <div id="fullCalendar"></div>
          <span class="badge badge-completed">Feedback Given</span>
          <span class="badge badge-pending">Pending Feedback</span>
          <span class="badge badge-cancelled">Interview Cancelled</span>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card">
        <div class="card-body">
          <div class="nav-tabs-navigation mt-3 text-center"
            style="border-bottom: 1px solid #F1EAE0; margin-bottom:0">
            <div class="nav-tabs-wrapper">
              <ul id="tabs" class="nav nav-tabs" role="tablist">
                <li class="nav-item">
                  <a class="nav-link active" data-toggle="tab" href="#upcoming" role="tab"
                    aria-expanded="true">Upcoming Interviews</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" data-toggle="tab" href="#past" role="tab" aria-expanded="false">Past
                    Interviews</a>
                </li>
              </ul>
            </div>
          </div>
          <div id="my-tab-content" class="tab-content">
            <div class="tab-pane active" id="upcoming" role="tabpanel" aria-expanded="true">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
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
            <div class="tab-pane" id="past" role="tabpanel" aria-expanded="false">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Applicant Name</th>
                    <th>Date Time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colspan="3" class="text-center py-5">
                      <p>No past interviews</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });
  $(document).ajaxStart(function() {
    Pace.restart();
  });
</script>
<script>
  (function() {
    var w = window;
    var ic = w.Intercom;
    if (typeof ic === "function") {
      ic('reattach_activator');
      ic('update', w.intercomSettings);
    } else {
      var d = document;
      var i = function() {
        i.c(arguments);
      };
      i.q = [];
      i.c = function(args) {
        i.q.push(args);
      };
      w.Intercom = i;
      var l = function() {
        var s = d.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://widget.intercom.io/widget/qpacrxnm';
        var x = d.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
      };
      if (w.attachEvent) {
        w.attachEvent('onload', l);
      } else {
        w.addEventListener('load', l, false);
      }
    }
  })();
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
        events: [{
            "title": "Menendez NELSON",
            "start": "Thu Aug 09 2024 03:45:00 PM",
            "end": "Thu Aug 09 2024 03:45:00 PM",
            "url": "javascript:sibc('a03b6150d443b2884a49831d5d47978c')",
            "className": "event-blue"
          },
          {
            "title": "Menendez NELSON",
            "start": "Thu Aug 12 2024 03:45:00 PM",
            "end": "Thu Aug 12 2024 03:45:00 PM",
            "url": "javascript:sibc('a03b6150d443b2884a49831d5d47978c')",
            "className": "event-green"
          },
          {
            "title": "Menendez NELSON",
            "start": "Thu Aug 08 2024 03:45:00 PM",
            "end": "Thu Aug 08 2024 03:45:00 PM",
            "url": "javascript:sibc('a03b6150d443b2884a49831d5d47978c')",
            "className": "event-orange"
          }
        ]
      });
    }
  }
  $(document).ready(function() {
    interview.initFullCalendar();
  });
</script>
<script>
  var pageType = "interviews_only"
</script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/pdfmake.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/vfs_fonts.js"></script>
<script type="text/javascript"
  src="https://cdn.datatables.net/v/bs4/jszip-2.5.0/dt-1.10.18/b-1.5.6/b-html5-1.5.6/r-2.2.2/rg-1.1.0/sc-2.0.0/datatables.min.js"></script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/corejs-typeahead/1.2.1/typeahead.bundle.min.js" integrity="sha256-VCsWOz+0GuHdS/sIICtQNTFJdbaDI80rxvoB7BXabrU=" crossorigin="anonymous"></script>

<script src="{{ URL::asset('assets/js/applications.js?id=54d2b3eb7146e3066003') }}"></script>
<script>
  //   Script to dim the background of Modal 2
  $(document).ready(function() {
    $(document).on('show.bs.modal', '.modal', function(event) {
      var zIndex = 1040 + (10 * $('.modal:visible').length);
      $(this).css('z-index', zIndex);
      setTimeout(function() {
        $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
      }, 0);
      setTimeout(() => {
        refresh_table();
      }, 1000);
    });
    $(document).on('hide.bs.modal', '#ApplicantModal', function(event) {
      $('body').removeClass('modal-open');
      $('.modal-backdrop.fade').remove();
    });


  });
</script>
@endpush