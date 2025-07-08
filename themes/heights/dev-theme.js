/*
$(document).ready(function(){

    $(".lesson-header").click(function(){
      $(".lesson-info").slideToggle("slow");
      $("body").addClass("dark");
    });

    //$( ".lesson-header h1" ).html( "Next Step..." );
});
*/

var ready;

ready = function() {
$('.second-nav li:nth-child(3)').append('<li><a href="/formations"><i class="far fa-newspaper"></i> Formations</a></li>');
};

/*$(document).ready(ready);
$(document).on('page:load', ready);*/
