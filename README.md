# Formation

Formation aims to provide an easy way to validate forms on frontend

##Example
Full example is also included in index.html .
```javascript
var form = new Formation({
    selector: $form,
    error: function (inputs) {
        console.log('Failed to validate form');
    },
    validating: function () {
        console.log('Validating form');
    },
    success: function () {
        console.log('Form validated');
    },
    inputs: [
        {
            optionalCustomNameOrSomething: 'username',
            selector: function () {
                return $inputUserName;
            },
            validator: function (input, value) {
                return value.length > 3;
            },
            validating: function (input, value) {
                console.log('Validating ' + input.optionalCustomNameOrSomething);
            },
            error: function (input, value) {
                console.log('Failed to validate ' + input.optionalCustomNameOrSomething);
            },
            success: function (input, value) {
                console.log('Validated ' + input.optionalCustomNameOrSomething);
            }
        },
        {
            optionalCustomNameOrSomething: 'email',
            selector: $inputEmail,
            validator: function (input, value) {
                var deferred = $.Deferred();
                $.ajax('http://example.api.com', {
                    data: { email: value }
                }).done(function (isUnique) {
                    deferred.resolve(isUnique);
                });
                return deferred.promise();
            },
            validating: function (input, value) {
                console.log('Validating ' + input.optionalCustomNameOrSomething);
            },
            error: function (input, value) {
                console.log('Failed to validate ' + input.optionalCustomNameOrSomething);
            },
            success: function (input, value) {
                console.log('Validated ' + input.optionalCustomNameOrSomething);
            }
        }
    ]
});
```

## Installation

Just include formation.js in your scripts after jQuery.

## API

The form element. It's not really needed but if present, any of the input selectors will be searched from given form element.
```javascript
/**
 * @type {string|jQuery selector|function}
 * @return jQuery selector
 */
form.selector: $('.example')
form.selector: '#example'
form.selector: function () {
    return $('.example');
}
```
Function that will run on validation.
```javascript
/**
 * @type {function} 
 */
form.validating: function () {
    console.log('Validating form');
}
```
Function that will run if form validates successfully
```javascript
/**
 * @type {function} 
 */
form.success: function () {
    console.log('Form successfully validated');
}
```
Function that will run if form fails to validate
```javascript
/**
 * @type {function} 
 * @param {array} array of failed input objects
 */
form.error: function (inputs) {
    console.log('Number of inputs that failed to validate: ' + inputs.length);
}
```
Array of input elements in form
```javascript
/**
 * @type {array}
 */
form.inputs: []
```
The input element.
```javascript
/**
 * @type {string|jQuery selector|function}
 * @return {jQuery selector}
 */
form.inputs: [
    {
        selector: $('.example')
        // or
        form.selector: '#example'
        // or
        form.selector: function () {
            return $('.example');
        }
    }
]
```
Method of how the input gets validated

Any:
* Regular expression
* Function that returns true (successful validation) or false (unsuccessful validation)
* Promise

```javascript
/**
 * @type {function|RegExp}
 * @param {object} Current input object that is being validated
 * @param {value} Value of current input
 * @return {boolean|jQuery.Deferred.promise}
 */

form.inputs: [
    {
        validator: Formation.VALIDATORS.EMAIL
        // or
        validator: function (input, value) {
            return value.length > 3;
        }
        // or
        validator: function (input, value) {
            var deferred = $.Deferred();
            $.ajax('http://example.api.com', {
                data: { email: value }
            }).done(function (isUnique) {
                deferred.resolve(isUnique);
            });
            return deferred.promise();
        }
    }
]
```
Function that gets triggered once as input is being validated
```javascript
/**
 * @type {function} 
 * @param {object} Current input object that is being validated
 * @param {value} Value of current input
 */
form.inputs: [
    {
        validating: function (input, value) {
            console.log('Validating input');
        }
    }
]
```
Function that gets triggered if input validation succeeds.
```javascript
/**
 * @type {function} 
 * @param {object} Current input object that is being validated
 * @param {value} Value of current input
 */
form.inputs: [
    {
        success: function (input, value) {
            console.log('Validating input');
        }
    }
]
```
Function that gets triggered if input validation fails.
```javascript
/**
 * @type {function} 
 * @param {object} Current input object that is being validated
 * @param {value} Value of current input
 */
form.inputs: [
    {
        error: function (input, value) {
            console.log('Validating input');
        }
    }
]
```