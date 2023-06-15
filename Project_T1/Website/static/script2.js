$(".showDiv").click(function () {
    var divId = $(this).data("div");
    $(this).toggleClass("in");
    $("#" + divId).toggle();
});
