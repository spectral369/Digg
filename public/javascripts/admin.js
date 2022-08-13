
$('#general-stats-btn').click(function () {
    $.ajax({
        url: '/send/ordercount',
        type: 'POST',
        data: JSON.stringify({
        }),
        datatype: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            console.log(data);
            $("#stats-total-comenzi").text(data);
        }
    });
});

$('#general-stats-btn').click(function () {
    $.ajax({
        url: '/send/usercount',
        type: 'POST',
        data: JSON.stringify({
        }),
        datatype: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $("#stats-total-useri").text(data);
            $("#stats-total-bauturi").text(bev.length);
        }
    });
});

$('#general-stats-btn').click(function () {
    $.ajax({
        url: '/send/partydates',
        type: 'POST',
        data: JSON.stringify({
        }),
        datatype: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            data.forEach(element => {
                $('#party-date-select').append($("<option></option>")
                    .attr("value", (element[0] + '/' + element[1]))
                    .text((element[0] + '/' + element[1])));
            });
        }
    });
});


$('#carousel-btn').click(function () {
    $.ajax({
        url: '/send/getimagelist',
        type: 'POST',
        data: JSON.stringify({
        }),
        datatype: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            const myNode = document.getElementById("carousel-img-select");
            myNode.innerHTML = '';
            var i = 0;
            data.forEach(element => {

                if (element.active == true) {
                    $('#carousel-img-select').append($("<button></button>")
                        .attr("type", "button")
                        .attr("id", "img-item_" + i)
                        .attr("class", "list-group-item list-group-item-action active")
                        .text(element.src));

                } else {
                    $('#carousel-img-select').append($("<button></button>")
                        .attr("type", "button")
                        .attr("id", "img-item_" + i)
                        .attr("class", "list-group-item list-group-item-action")
                        .text(element.src));
                }

                //test for touch
                $('#img-item_' + i).bind('touchstart', function () { });

                //test for mouseover
                $("#img-item_" + i).on("mouseover", function (event) {
                    $("#preview-image").attr("src", "/images/carousel/" + $(this).text());
                });
                $("#img-item_" + i).on("click", function (event) {
                    $(this).toggleClass('active');
                    if ($(this).is('.active')) {
                        addCarouselImgs($(this).text());
                    } else {
                        removeCarouselImgs($(this).text());
                    }
                });
                i++;
            });
        }

    });
});

//submit-file

$('#submit-file').click(function () {
    var file_data = $('#file-upload').prop('files')[0];
    var form_data = new FormData();
    form_data.append('file', file_data);
    $.ajax({
        url: '/send/uploadcarouselimg', 
        dataType: 'text', 
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'post',
        success: function (response) {
           console.log("upload was succesful");
           $('#file-upload').val('')
           $('#carousel-btn').click();
        },
        error: function (response) {
            console.log("upload was UNsuccesful");
        }
    });

  });
  


function addCarouselImgs(item) {

    $.ajax({
        url: '/send/addcarouselimg',
        type: 'POST',
        data: JSON.stringify({
            item: item
        }),
        datatype: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            console.log(data);
        }
    });
}

function removeCarouselImgs(item) {

    $.ajax({
        url: '/send/removecarouselimg',
        type: 'POST',
        data: JSON.stringify({
            item: item
        }),
        datatype: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            console.log(data);
        }
    });
}

$('#delete-files').click(function () {
    $.ajax({
        url: '/send/deletecarouselimgs',
        type: 'POST',
        data: JSON.stringify({
        }),
        datatype: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            console.log("deleted");
            $('#carousel-btn').click();
        }
    });
});


