# jQuery.ServerState - simple load and save form values with an ajax request

This library is designed to simplify a data exchange between a HTML form and a server using Ajax.
Use this software for small, simple projects or to modify existing ones. For new projects it is better to use popular web frameworks, for example, React/Redux or Vue.js.

* Significantly less code
* The page does not reload when submitting the form.
* Users will not receive "Document expired" or "Resubmit" messages when clicking "Back"
* It is not required to initialize a form on a server side.

Typically, data exchange with Ajax is as follows:

```javascript
    var fd = new FormData();
    fd.append('tst', $("#tst-data").val());
    $.ajax({
      type : 'POST',
      url : '/setsomething',
      data: fd,
      contentType: false,
      processData: false
    }).done(function (data) {
       $("#tst-data").val(data.tst-data);
       $("#message").val(data.message);
    });
```

If the number of fields is greater, the code becomes much longer. In addition, this code does not validate the form. With jQuery Server State it will one string:

```javascript
    $("#jsonForm").stateSubmit({},{url:"/setsomething"});
```

Or even simpler if a form has the action attribure:

```javascript
    $("#jsonForm").stateSubmit();
```

## Features

* Server interaction functions, JSON result processing. Library expects only JSON as server response;
* Change other form elements when receiving server response (not only fields);
* Built-in form validation for "required" fields when sending data to the server (can be disabled in options);

## Requirements

jQuery Server State is not standalone library. It uses several good libraries and it is their add-in to simplify working with forms.

* jQuery version 1.4.3+.

* [jQuery Form Plugin](https://github.com/jquery-form/form)

* [jQuery Deserialize](https://github.com/kflorence/jquery-deserialize). This library has been modified. Previously, the library allowed working only with direct descendants of the form tag.

* [Ben Alman jQuery serializeObject](http://benalman.com/projects/jquery-misc-plugins/#serializeobject). Note: jQuery serializeObject required for stateJsonSave/stateJsonSubmit functions only. 

* [Axios - Promise based HTTP client for the browser and node.js](https://github.com/axios/axios). Note: Axios library required for stateJsonSave/stateJsonSubmit functions only.


## Installing

Using the minimized serverstate.min.js file from /dist folder (without Axios library):

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="serverstate.min.js"></script>
```

Or all libraries one by one:

```
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery.form/4.2.2/jquery.form.min.js"></script>
<script src="jquery.deserialize.js"></script>
<script src="jquery.serverstate.js"></script>
<script src="jquery.serializeobject.js"></script>
```

Add Axios for stateJsonSave/stateJsonSubmit functions (see below):

```
<script src="//cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js"></script>
```

## Simple usage

```javascript
<form id="jsonForm" method="post" action="simpletest.php">
    Message: <input type="text" name="message" value="test" required=""/>
    <div id="result"></div>
    <br/>
    <input id="mSubmit" type="button" value="Send" /><br/>
</form>

<script>
+function($) {
  $(function () {

    $("#jsonForm").on('submit', function(event){
        event.preventDefault();
    });

    $("#mSubmit").on("click", function(e){
       $("#jsonForm").stateSubmit();
    });

  });
}(jQuery);
</script>
```

Server side - simpletest.php:

```php
<?php
header('Content-Type: application/json');
$message = array_key_exists("message", $_REQUEST) ? $_REQUEST["message"] : "";
echo json_encode((object)["message"=>$message, "result"=>"Cool! You type: $message"]);
```

Simple server response is php file. You can use any programming language. Note: always check input request parameters.

## Functions

* **stateLoad** - Load form values from a remote server with an Ajax request.
* **stateSave** - Save form values to a remote server with an Ajax request.
* **stateInit** - Init form for submit as ajax request, form values can be sent using the submit button or stateSave function. 
* **stateSubmit** - Save and Load values with an ajax request. Uses single request with the stateSave function. Results will be deserialized.
* **stateJsonSave** - Save form values to a remote server with a raw ajax request. Values sended as json string. Uses Axios library.
* **stateJsonSubmit** - Save and Load values with a raw ajax request. Uses single request with the stateJsonSave function. Results will be deserialized.

Options for stateSave/stateJsonSave methods:
* **disableFormValidation** - undefined by default, any value will disable the form validation. For example, `disableFormValidation:false`
* **validationCallback** - Callback function to be invoked if there are validation errors. For example, `validationCallback:function(){console.log("Form not valid");}`

All [options](http://jquery.malsup.com/form/#options-object) from jQuery Form Plugin are supported.

Usefull options from jQuery Form Plugin:

* **error** - Callback function to be invoked upon error. For example, `error:function(){console.log("Server error");}`
* **success** - Callback function to be invoked after the data has been sended. For example, `success:function(){console.log("Form Saved");}`

## Samples

See examples in the /examples folder.

## License

Copyright (c) 2019 Max Butenko
jQuery.ServerState is dual licensed under MIT and GPLv2 licenses.

