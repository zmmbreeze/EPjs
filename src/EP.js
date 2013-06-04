/*global exports:true */
(function(undefined) {
    var EP = function(text) {
        return new Plotting(text);
    };

    var Plotting = EP.Plotting = function(text) {
        this.q = new EP.Equation(text);
        this.c = new EP.Coordinator(this.q);
    };

    Plotting.prototype.rendTo = function(canvas) {
        this.c.rendTo(canvas);
    };

    if (typeof exports !== 'undefined') {
        exports.EP = EP;
    } else {
        window.EP = EP;
    }
})();
