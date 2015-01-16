'use strict';

var Formation = function (opts) {
    var self = this;
    $.extend(self, opts);

    self._notValidatedInputs = [];
    self._validating = false;

    self.selector.submit(function () {
        if (!self._validating) {
            if (self.validating) {
                self.validating();
            }
            self.validate().then(
                function () {
                    return self.success();
                },
                function (inputs) {
                    self.error(self._notValidatedInputs);
                }
            );
        }
        return false;
    });
};

Formation.prototype.submit = function () {
    self.selector.submit();
};

Formation.prototype.validate = function () {
    var self = this;
    var validation = $.Deferred();
    self._validating = true;
    self._validatedInputs = [];
    self._notValidatedInputs = [];
    self._promises = [];

    if (self.selector) {
        if (typeof(self.selector) === 'function') {
            self._formSelector = self.selector();
        } else {
            self._formSelector = $(self.selector);
        }
    }

    $.each(self.inputs, function (i, input) {
        var selector;
        if (typeof(input.selector) === 'function') {
            selector = self._formSelector ? self._formSelector.find(input.selector()) : input.selector();
        } else {
            selector = self._formSelector ? self._formSelector.find(input.selector) : input.selector;
        }
        var value = selector.val();
        self._promises.push(self.handleValidator(input, value));
    });

    $.when.apply($, self._promises).then(
        function () {
            if (self._validatedInputs.length === self.inputs.length) {
                self.success();
            } else {
                self.error(self._notValidatedInputs);
            }
        },
        function () {
            self.error(self._notValidatedInputs);
        }
    ).always(function () {
        self._validating = false;
    });

    return validation.promise();
};

Formation.prototype.handleValidator = function (input, value) {
    var self = this;
    var deferred = $.Deferred();
    if (!input.validator) {
        return 1;
    }

    if (typeof(input.validator) === 'function') {
        if (input.validating) {
            input.validating(input, value);
        }
        $.when(input.validator(input, value)).then(
            function (response) {
                response ? deferred.resolve(self.handleSuccess(input, value)) : deferred.resolve(self.handleError(input, value));
            },
            function () {
                deferred.reject(self.handleError(input, value));
            }
        );
    } else {
        input.validator.test(value) ? deferred.resolve(self.handleSuccess(input, value)) : deferred.resolve(self.handleError(input, value));
    }

    return deferred.promise();
};

Formation.prototype.handleSuccess = function (input, value) {
    this._validatedInputs.push(input);
    input.success ? input.success(input, value) : undefined;
    return 1;
};

Formation.prototype.handleError = function (input, value) {
    this._notValidatedInputs.push(input);
    input.error ? input.error(input, value) : undefined
    return 0;
};

Formation.VALIDATORS = {
    'EMAIL': /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};