@push('styles')
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
            <li class="breadcrumb-item"><a href="{{route('dashboard')}}">Dashboard</a></li>
            <li class="breadcrumb-item active" aria-current="page">Reports</li>
        </ol>
    </nav>
    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <form action method="GET">
                        <div class="row">
                            <div class="col-md-3">
                                <div class="form-group">
                                    <label for>Job Opening:</label>
                                    <select class="form-control" name="opening_id">
                                        <option value="all">All Openings</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-2x">
                                <div class="form-group">
                                    <label for>From Date:</label>
                                    <input type="text" class="form-control datepicker" value placeholder="All" name="from_date">
                                </div>
                            </div>
                            <div class="col-md-2">
                                <div class="form-group">
                                    <label for>To Date:</label>
                                    <input type="text" class="form-control datepicker" value placeholder="All" name="to_date">
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="form-group">
                                    <button type="submit" class="btn btn-primary btn-wd mt-4">Apply</button>
                                    <a href="{{route('reports')}}" class="btn btn-secondary mt-4">Reset</a>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-4">
            <div class="card">
                <div class="card-body">
                    <h4 class="card-title text-center">Candidate Pipeline Status</h4>
                    <hr>
                    <div class="card card-plain">
                        <div class="row">
                            <div class="col text-center">
                                <canvas id="pipelineChart" width="400" height="400"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card">
                <div class="card-body">
                    <h4 class="card-title text-center">Application Sources</h4>
                    <hr>
                    <div class="card card-plain">
                        <div class="row">
                            <div class="col text-center">
                                <canvas id="sourcesChart" width="400" height="400"></canvas>
                            </div>
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
    $(document).ajaxStart(function() { Pace.restart(); });
    </script>
<script>
    demo = {
        initDateTimePicker: function() {
        if ($(".datetimepicker").length != 0) {
        $('.datetimepicker').datetimepicker({
            icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-chevron-up",
            down: "fa fa-chevron-down",
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-screenshot',
            clear: 'fa fa-trash',
            close: 'fa fa-remove'
            }
        });
        }

        if ($(".datepicker").length != 0) {
        $('.datepicker').datetimepicker({
            ignoreReadonly: true,
            // maxDate: moment(),
            format: 'DD-MM-YYYY',
            icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-chevron-up",
            down: "fa fa-chevron-down",
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-screenshot',
            clear: 'fa fa-trash',
            close: 'fa fa-remove'
            }
        });
        }

        if ($(".timepicker").length != 0) {
        $('.timepicker').datetimepicker({
            //          format: 'H:mm',    // use this format if you want the 24hours timepicker
            format: 'h:mm A', //use this format if you want the 12hours timpiecker with AM/PM toggle
            icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-chevron-up",
            down: "fa fa-chevron-down",
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-screenshot',
            clear: 'fa fa-trash',
            close: 'fa fa-remove'
            },
            stepping: 15
        });
        }
    }
}
    </script>
<script>
    $(document).ready(function() {
      // initialise Datetimepicker
      demo.initDateTimePicker();
    });
  </script>
<script>
        var ctx = document.getElementById('pipelineChart').getContext('2d');
        var pipelineChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['New', 'Shortlisted', 'Interview', 'Offered', 'Hired', 'Rejected'],
                datasets: [{
                    label: '# of Candidates',
                    data: [0,0,0,0,0,0],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(255, 159, 64, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(255, 99, 132, 0.8)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
        </script>
<script>
        var ctx2 = document.getElementById('sourcesChart').getContext('2d');
            // For a pie chart
        var myPieChart = new Chart(ctx2, {
            type: 'pie',
            data : {
                datasets: [{
                    data: [5, 4, 1, 10, 6],
                    backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#f4eb42", "#f48642","#26bf60","#455fd6","#0c2389","#ED4145","#E9EBEE","#f733d3"],
                }],


                // These labels appear in the legend and in the tooltips when hovering different arcs
                labels: ['Career Page', 'LinkedIn', 'Facebook', 'Relief', 'Others']
            }
        });
        </script>
@endpush