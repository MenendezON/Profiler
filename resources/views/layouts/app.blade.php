<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <link rel="apple-touch-icon" sizes="76x76" href="{{ URL::asset('assets/img/apple-icon.png')}}" />
    <link rel="icon" type="image/png" href="{{ URL::asset('assets/img/favicon.png')}}" />
    <title>{{ $title ?? config('app.name', 'Laravel') }}</title>
    <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no" name="viewport" />

    <link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700,200|Roboto:400,500,600,700,200" rel="stylesheet" />
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous" />

    <link href="{{ URL::asset('assets/css/bootstrap.min.css?ver=1.1')}}" rel="stylesheet" />
    <link href="{{ URL::asset('assets/css/paper-dashboard.css?v=2.0.3')}}" rel="stylesheet" />
    <link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.7/css/select2.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="{{ URL::asset('assets/css/pace.min.css')}}" />
    <link href="{{ URL::asset('assets/css/demo.css')}}" rel="stylesheet" />
    
    @stack('styles')
    @livewireStyles
</head>

<body class="sidebar-mini">
    <div class="wrapper">
        <!-- start sidebar -->
        <x-side-navbar />
        <!-- end sidbar -->

        <!-- start of the div content -->
        <div class="main-panel">
            <!-- start sidebar -->
            <x-top-navbar />
            <!-- end sidbar -->

            {{ $slot }}

            <div id="applicant_modal"></div>
            <!-- end of the main content -->

            <!-- start to the foooter -->
            <x-footer />
            <!-- end of the footer -->
        </div>
        <!-- end of the div content -->
    </div>

    <script src="{{ URL::asset('assets/js/core/jquery.min.js') }}"></script>
    <script src="{{ URL::asset('assets/js/core/popper.min.js') }}"></script>

    <script src="{{ URL::asset('assets/js/plugins/jasny-bootstrap.min.js') }}"></script>
    <script src="{{ URL::asset('assets/js/core/bootstrap.min.js') }}"></script>

    <script src="{{ URL::asset('assets/js/plugins/moment.min.js') }}"></script>

    <script src="{{ URL::asset('assets/js/plugins/bootstrap-switch.js') }}"></script>

    <script src="{{ URL::asset('assets/js/plugins/sweetalert2.min.js') }}"></script>

    <script src="{{ URL::asset('assets/js/plugins/jquery.validate.min.js') }}"></script>

    <script src="{{ URL::asset('assets/js/plugins/jquery.bootstrap-wizard.js') }}"></script>

    <script src="{{ URL::asset('assets/js/plugins/bootstrap-selectpicker.js') }}"></script>

    <script src="{{ URL::asset('assets/js/plugins/bootstrap-datetimepicker.js') }}"></script>

    <script src="{{ URL::asset('assets/js/plugins/jquery.dataTables.min.js') }}"></script>

    <script src="{{ URL::asset('assets/js/plugins/bootstrap-tagsinput.js') }}"></script>

    <script src="{{ URL::asset('assets/js/plugins/fullcalendar.min.js') }}"></script>

    <script src="{{ URL::asset('assets/js/plugins/jquery-jvectormap.js') }}"></script>
    <script src="{{ URL::asset('assets/js/plugins/wNumb.min.js') }}"></script>

    <script src="{{ URL::asset('assets/js/plugins/nouislider.min.js') }}"></script>

    <script src="{{ URL::asset('assets/js/plugins/chartjs.min.js') }}"></script>

    <script src="{{ URL::asset('assets/js/plugins/bootstrap-notify.js') }}"></script>

    <script src="{{ URL::asset('assets/js/paper-dashboard.min.js?v=2.0.1') }}" type="text/javascript"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.7/js/select2.min.js"></script>
    <script src="{{ URL::asset('assets/js/pace.min.js') }}"></script>
    <script src="{{ URL::asset('assets/js/plugins/pdfobject.min.js?ver=1.0') }}"></script>
    <script src="{{ URL::asset('assets/js/demo.js') }}"></script>

    @stack('scripts')
    @livewireScripts
    
</body>

</html>