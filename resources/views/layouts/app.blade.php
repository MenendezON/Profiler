<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="shortcut icon" href="{{ URL::asset('assets/img/fav.png') }}" type="image/x-icon">
    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->

    <!-- Styles -->
    <link rel="stylesheet" href="https://kit-pro.fontawesome.com/releases/v5.12.1/css/pro.min.css">
    <link rel="stylesheet" type="text/css" href="{{ URL::asset('assets/css/style.css') }}">
    @livewireStyles
</head>

<body class="bg-gray-100">

    <!-- start navbar -->
    <x-top-navbar />
    <!-- end navbar -->


    <!-- strat wrapper -->
    <div class="h-screen flex flex-row flex-wrap">
        <!-- start sidebar -->
        <x-side-navbar />
        <!-- end sidbar -->

        <div class="flex-1 p-6 md:mt-16">
            <!-- Start of the main content -->
            {{ $slot }}
            <!-- End of the main content -->
        </div>

    </div>
    <!-- end wrapper -->

    <!-- script -->

    @stack('modals')

    @livewireScripts
    
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
    <script src="{{ URL::asset('assets/js/scripts.js') }}"></script>
    <!-- end script -->
</body>

</html>