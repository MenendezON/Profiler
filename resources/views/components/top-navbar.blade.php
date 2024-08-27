<!-- Start of the header -->
<nav class="navbar navbar-expand-lg navbar-absolute fixed-top navbar-transparent">
        <div class="container-fluid">
          <div class="navbar-wrapper">
            <div class="navbar-toggle">
              <button type="button" class="navbar-toggler">
                <span class="navbar-toggler-bar bar1"></span>
                <span class="navbar-toggler-bar bar2"></span>
                <span class="navbar-toggler-bar bar3"></span>
              </button>
            </div>
            <a class="navbar-brand" href="./">{{Auth::user()->company->name}}</a>
          </div>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navigation"
            aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-bar navbar-kebab"></span>
            <span class="navbar-toggler-bar navbar-kebab"></span>
            <span class="navbar-toggler-bar navbar-kebab"></span>
          </button>
          <div class="collapse navbar-collapse justify-content-end" id="navigation">
            <form action="https://dash.recooty.com/applications" method="get">
              <div class="input-group no-border">
                <input type="hidden" name="show" value="all" />
                <input type="text" name="search_name" class="form-control" placeholder="Search Applicants..." value
                  required />
                <div class="input-group-append">
                  <div class="input-group-text">
                    <i class="nc-icon nc-zoom-split"></i>
                  </div>
                </div>
              </div>
            </form>
            <ul class="navbar-nav ml-2">
              <li class="nav-item btn-magnify dropdown">
                <a class="nav-link" target="_blank" href="https://careerpage.co/mercy-corps">
                  <button class="btn btn-black" style="margin: 0">
                    <i class="fas fa-external-link-alt"></i> View Career Page
                  </button>
                </a>
              </li>
              <li class="nav-item btn-magnify dropdown">
                <a class="nav-link" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true"
                  aria-expanded="false">
                  <button class="btn btn-darkblue" style="margin: 0">
                    <i class="fas fa-plus"></i> New
                  </button>
                </a>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                  <a class="dropdown-item" href="{{ route('opening.new') }}"><i
                      class="nc-icon nc-briefcase-24 mr-1 mt-1"></i> Job
                    Opening</a>
                  <a class="dropdown-item" href="{{ route('applicant.new') }}"><i
                      class="nc-icon nc-single-02 mr-1 mt-1"></i>
                    Applicant</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <!-- end of the header -->