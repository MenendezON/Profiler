
    <!-- start of the sidebar -->
    <div class="sidebar" data-color="white" data-active-color="success">
      <div class="logo">
        <a href="./}}" class="simple-text logo-mini">
          <div class="logo-image-small">
            <img src="https://dash.recooty.com/assets/img/logo-mini-n.png" width="37" height="40" />
          </div>
        </a>
        <a href="https://dash.recooty.com" class="simple-text logo-normal">
          <div class="logo-image-big">
            <img src="https://dash.recooty.com/assets/img/logo-text-n.png" width="120" height="44" />
          </div>
        </a>
      </div>
      <div class="sidebar-wrapper">
        <div class="user">
          <div class="photo">
            <img src="https://ui-avatars.com/api/?name=Menendez+NELSON" />
          </div>
          <div class="info">
            <a data-toggle="collapse" href="#miniProfile" class="collapsed">
              <span>
                Menendez NELSON
                <b class="caret"></b>
              </span>
              <span class="text-truncate" style="font-size: 10px"><span class="__cf_email__"
                  data-cfemail="bad7dfd4dfd6c9d5d4fad7dfc8d9c3d9d5c8cac994d5c8dd">[email&#160;protected]</span></span>
            </a>
            <div class="clearfix"></div>
            <div class="collapse" id="miniProfile">
              <ul class="nav nav-shortcuts">
                <li>
                  <a href="https://dash.recooty.com/settings/edit-profile">
                    <span class="sidebar-mini-icon"><i class="fas fa-user-edit"></i></span>
                    <span class="sidebar-normal">Edit Profile</span>
                  </a>
                </li>
                <li>
                  <a href="https://dash.recooty.com/settings/subscription">
                    <span class="sidebar-mini-icon"><i class="fas fa-credit-card"></i></span>
                    <span class="sidebar-normal">Billing</span>
                  </a>
                </li>
                <li>
                  <a href="https://dash.recooty.com/logout">
                    <span class="sidebar-mini-icon"><i class="fas fa-sign-out-alt"></i></span>
                    <span class="sidebar-normal">Logout</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <ul class="nav">
          <li class="active">
            <a href="{{ route('dashboard') }}">
              <i class="nc-icon nc-palette"></i>
              <p>Dashboard</p>
            </a>
          </li>
          <li class="  ">
            <a href="{{ route('openings', 'published') }}">
              <i class="nc-icon nc-briefcase-24"></i>
              <p>Job Openings</p>
            </a>
          </li>
          <li class=" ">
            <a href="{{ route('applications',  ['pipeline' => ['new', 'shortlisted', 'interview', 'offered']]) }}">
              <i class="nc-icon nc-badge"></i>
              <p>Applications</p>
            </a>
          </li>
          <li class=" ">
            <a href="{{ route('interviews') }}">
              <i class="nc-icon nc-calendar-60"></i>
              <p>Interviews</p>
            </a>
          </li>
          <li class=" ">
            <a href="{{ route('reports') }}">
              <i class="nc-icon nc-chart-pie-36"></i>
              <p>Reports</p>
            </a>
          </li>
          <li class="active-pro">
            <a href="{{ route('settings') }}">
              <i class="nc-icon nc-settings"></i>
              <p>Settings</p>
            </a>
          </li>
          <!--li class="active-pro2">
            <a href="javascript:Intercom('show');">
              <i class="nc-icon nc-support-17"></i>
              <p>Support</p>
            </a>
          </li>
          <li class="active-pro3">
            <a href="https://dash.recooty.com/settings/subscription-plans">
              <i class="nc-icon nc-spaceship"></i>
              <p>Upgrade Plan</p>
            </a>
          </li-->
        </ul>
      </div>
    </div>
    <!-- end of the sidebar -->
   