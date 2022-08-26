
$('#general-stats-btn').click(function () {
    $.ajax({
        url: '/send/ordercount',
        type: 'POST',
        data: JSON.stringify({
        }),
        datatype: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
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
            console.log("upload was Unsuccesful");
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



$("#party-date-select").change(function () {
    var value = $("#party-date-select option:selected");
    $.ajax({
        url: '/send/ordersbydate',
        type: 'POST',
        data: JSON.stringify({
            date: value.text()
        }),
        datatype: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            const myNode = document.getElementById("stats-beverages-1");
            myNode.innerHTML = '';

            var i = 0;
            var div = $("<div>");
            div.attr("class", "list-group");
            data.forEach(element => {
                console.log(element.user_id);
                var item_count = 0;
                var pret_tot = 0;

                element.beverage.forEach(el => {
                    item_count += el.quantity;
                    pret_tot += el.price * el.quantity;
                });
                div.append($("<button></button>")
                    .attr("type", "button")
                    .attr("id", "bev-item_" + i)
                    .attr("bev_id", element.user_id)
                    .attr("class", "list-group-item list-group-item-action")
                    .text('Barman: ' + element.user.username + ' Nr. prod. ' + item_count + ' Suma comanda: ' + pret_tot));

                $('#stats-beverages-1').append(div);
                $('#bev-item_' + i).click(function () {
                    if (document.getElementById('pdf-modal')) {
                        var element = document.getElementById("pdf-modal");
                        element.parentNode.removeChild(element);
                    }
                    $.ajax({
                        url: '/send/generatePDF',
                        type: 'POST',
                        data: JSON.stringify({
                            id: $(this).attr('bev_id')
                        }),
                        contentType: 'application/json; charset=utf-8',
                        xhrFields: { responseType: 'arraybuffer' },
                        success: function (data) {
                            let blob = new Blob([data], { type: 'application/pdf' });//arraybuffer
                            let link = document.createElement('a');
                            let objectURL = window.URL.createObjectURL(blob);
                            link.href = objectURL;
                            link.className += "link-primary"
                            link.target = '_self';
                            link.textContent = "DownloadPDF"
                            link.download = "myInvoice.pdf";
                            /*    (document.body || document.documentElement).appendChild(link);
                                link.click();
                                setTimeout(() => {
                                    window.URL.revokeObjectURL(objectURL);
                                    link.remove();
                                }, 100);*/

                            var container = document.getElementById('root');
                            var div_root = document.createElement("div");
                            div_root.className += 'modal fade';
                            div_root.setAttribute("id", "pdf-modal");
                            div_root.setAttribute("tabindex", "-1");
                            div_root.setAttribute("role", "dialog");

                            var div_modal_dialog = document.createElement("div");
                            div_modal_dialog.className += 'modal-dialog modal-xl';

                            var div_modal_content = document.createElement('div');
                            div_modal_content.className += 'modal-content modal-xl';

                            var div_modal_body = document.createElement('div');
                            div_modal_body.className += 'modal-body modal-xl';


                            var div_modal_header = document.createElement('div')
                            div_modal_header.className += 'modal-header';

                            var div_modal_header_title = document.createElement('h4');
                            div_modal_header_title.textContent = 'My Generated PDF';
                            div_modal_header.appendChild(link);

                            var div_modal_header_close = document.createElement('button');
                            div_modal_header_close.className += 'btn-close';
                            div_modal_header_close.setAttribute("type", "button");
                            div_modal_header_close.setAttribute("id", "modal-close");
                            div_modal_header_close.setAttribute("data-bs-dismiss", "modal");
                            div_modal_header_close.setAttribute("aria-label", "Close");


                            div_modal_header.appendChild(div_modal_header_close);

                            var embed = document.createElement('iframe');
                            embed.setAttribute("type", "application/pdf");
                            embed.setAttribute("frameborder", "0");
                            embed.setAttribute("width", "100%");
                            embed.setAttribute("height", "500px");
                            embed.setAttribute("src", objectURL);



                            div_modal_body.appendChild(embed);
                            div_modal_content.appendChild(div_modal_header)
                            div_modal_content.appendChild(div_modal_body);
                            div_modal_dialog.appendChild(div_modal_content);
                            div_root.appendChild(div_modal_dialog);
                            container.appendChild(div_root);
                            $('#pdf-modal').modal('show');
                        }
                    });
                });

                i++;
            });



        }
    });

});

$('#alert_message-btn').click(function () {

    document.getElementById('alert-date').valueAsDate = new Date();
    document.querySelector('#alert-date').dispatchEvent(new Event('change', { 'bubbles': true }));
    $.ajax({
        url: '/send/getinfomessage',
        type: 'POST',
        data: JSON.stringify({
        }),
        datatype: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (typeof data === 'object') {
                var message = data.message;
                document.getElementById('alert-message').textContent = message;

            }
        }
    });


});


function alert_message_validation() {
    var msg_item = document.getElementById('alert-message');
    var curr_str = msg_item.value;
    var ret = false;
    if (curr_str.length < 6) {
        msg_item.style.setProperty("color", "red", "important");
        ret = false;
    } else {
        msg_item.style.setProperty("color", "black", "important");
        ret = true;
    }
    return ret;
}

function alert_date_validation() {
    var msg_date = document.getElementById('alert-date');
    var curr_date = new Date(msg_date.value);
    var date_now = new Date();
    //console.log(curr_date.getTime() < date_now.getTime() );
    var ret = false;
    if (!(curr_date.getTime() <= date_now.getTime())) {
        msg_date.style.setProperty("background-color", "green", "important");
        ret = true;
    } else {
        msg_date.style.setProperty("background-color", "red", "important");
        ret = false;
    }
    return ret;

}

var validateForm = function () {

    if (!alert_message_validation()) {
        return false;
    }
    if (!alert_date_validation()) {
        return false;
    }
    return true;
}

var checkValid = function () {
    document.getElementById('set-message').disabled = !validateForm();
}






$('#set-message').click(function () {
    $.ajax({
        url: '/send/setinfomessage',
        type: 'POST',
        data: JSON.stringify({
            message: $('#alert-message').val(),
            date: $('#alert-date').val()
        }),
        datatype: "json",
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            console.log(data);
        }
    });
});