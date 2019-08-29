function showData() {
    var x = document.getElementById("input").value;
    document.getElementById("output").innerHTML = x;
}

function sendData() {
    var code = document.getElementById("input").value;
    $.ajax({url:"http://localhost",
        type: "POST",
        data: {code: code},
        success: function() {
            var succ = "Success";
            document.getElementById("output").innerHTML = succ;
        }, 
        error: function() {
            var err = "Error";
            document.getElementById("output").innerHTML = err;
        }
    });

    var data = new XMLHttpRequest();
    data.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            document.getElementById("output").innerHTML = data.responseText;
        }
    };
    data.open("GET", "output.txt", true);
    data.send();
}