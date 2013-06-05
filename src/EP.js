/*global exports:true */
(function(undefined) {
    var EP = function(canvas) {
        return new Plotting(canvas);
    };

    var Plotting = EP.Plotting = function(canvas) {
        this._view = new EP.View(canvas);
        this._c = new EP.Coordinator(this._view);
    };

    Plotting.prototype.rend = function(text) {
        this._c.push(text);
        this._c.update();
    };

    Plotting.prototype.clear = function(text) {
        this._c.pop(text);
        this._c.update();
    };

    Plotting.prototype.update = function() {
        this._c.update();
    };

    Plotting.prototype.setWH = function() {

    };

    Plotting.prototype.zoomIn = function() {

    };

    Plotting.prototype.zoomOut = function() {

    };

    if (typeof exports !== 'undefined') {
        exports.EP = EP;
    } else {
        window.EP = EP;
    }
})();
