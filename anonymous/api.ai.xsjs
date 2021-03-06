var bookstore = $.import("de.linuxdozent.gittest.anonymous", "bookstore");
var speech;
var apiResponse = {
    "fulfillmentText": "",
    "payload": {
      "google": {
        "expectUserResponse": true,
        "richResponse": {
          "items": [
            {
              "simpleResponse": {
                "textToSpeech": ""
              }
            }
          ]
        }
      },
      "facebook": {
        "text": ""
      },
      "slack": {
        "text": ""
      }
    }
};

$.response.contentType = "application/json";
if($.request.method === $.net.http.POST) {
    var content = $.request.body.asString();
    $.trace.error("request: " + content);    
    var request = JSON.parse(content);
    if(request.queryResult) {
        $.trace.error("action: " + request.queryResult.action);
        if(request.queryResult.action === "ListBooks") {
            var books = bookstore.readBooks();
            if(books.length > 0) {
                speech = "Wir führen: ";
                var arrayLength = books.length;
                for (var i = 0; i < arrayLength; i++) {
                    speech += books[i].BookTitle + " ";
                }
            } else {
                speech = "Leider sind noch keine Bücher gelistet.";
            }
            apiResponse.fulfillmentText = speech;
            apiResponse.payload.google.richResponse.items[0].simpleResponse.textToSpeech = speech;
            apiResponse.payload.facebook.text = speech;
            apiResponse.payload.slack.text = speech;
            $.trace.error("Response: " + speech);
        } else {
            apiResponse.fulfillmentText = 'Keine passende Aktion gefunden';
        }
    } else {
        apiResponse.fulfillmentText = 'request.result not found';
    }
    $.response.setBody(JSON.stringify(apiResponse));
}
