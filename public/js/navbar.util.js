$(document).ready(function(){

    $("#bigNav").hide();
    $("#hide").click(function(){
        $("#bigNav").hide();
        $("#littleNav").show();
    });
    $("#show").click(function(){
        $("#bigNav").show();
        $("#littleNav").hide();
    });

    $("#littleNav").hover(function () {
        $("#bigNav").show();
        $("#littleNav").hide();
    }, function () {

    });
    $("#bigNav").hover(function(){

    }, function () {
        $("#bigNav").hide();
        $("#littleNav").show();

    });

});