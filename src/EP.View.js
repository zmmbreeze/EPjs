/*global EP:true */
(function(undefined) {
    var View = EP.View = function(canvas) {
        this._cvs = canvas;
        this._ctx = canvas.getContext('2d');
    };

    View.prototype.rendTo = function() {
        
    };

    /**
     * set the height of x
     */
    View.prototype.setView = function(w, h) {
        this._vW = w;
        this._vH = h;
    };

    View.prototype.update = function() {
        
    };

})();
