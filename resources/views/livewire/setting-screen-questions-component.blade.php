@push('styles')
<style>
  .modal-body {
    padding: 20px 20px;
  }
</style>
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
      <li class="breadcrumb-item">
        <a href="{{route('settings')}}">Settings</a>
      </li>
      <li class="breadcrumb-item active" aria-current="page">
        Screening Question Templates
      </li>
    </ol>
  </nav>
  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <div class="card-body">
          <div class="card-title">
            <h4>Screening Question Templates</h4>
          </div>
          <div class="card card-plain">
            <div class="card-content">
              <div class="toolbar">
                <a href="#!">
                  <button class="btn btn-fill btn-success" onclick="add_form_template()">
                    Create New Template
                  </button>
                </a>
                
              </div>
              <div class="table-responsive">
                <table class="table" style="white-space: nowrap">
                  <thead>
                    <tr>
                      <th>S.no</th>
                      <th>Name</th>
                      <th class="text-center">Total Questions</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody id="listTemplates">
                    <tr>
                      <td colspan="4" class="text-center">
                        <h4>
                          <i class="fas fa-circle-notch fa-spin"></i>
                          Loading
                        </h4>
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
<script src="{{ URL::asset('assets/js/templates.js?id=24fd005bc6653566e7e8') }}"></script>
@endpush