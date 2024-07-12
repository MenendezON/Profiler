<!-- Start Recent Sales -->
<div class="col-span-2 xl:col-span-1">

    @foreach ($posts as $post )
    <div class="card w-full mb-2">
        <div class="card-header font-bold">
            <span class="bg-gray-200 px-3 py-2 rounded-md">{{$post->location}}</span> | 
            <span>{{$post->title}}</span>
        </div>
        <div class="flex px-6 py-2 justify-between">
            <span>Date de publication : {{\Carbon\Carbon::parse($post->created_at)->format('d M Y')}}</span>
            <span>Date de cloture : {{\Carbon\Carbon::parse($post->deadline)->format('d M Y')}}</span>
        </div>
    </div>
    
    @endforeach

</div>
<!-- End Recent Sales -->