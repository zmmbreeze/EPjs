/*global EP:true */
(function(undefined) {
    var Equation = EP.Coordinator = function(equation) {
        this._q = equation;
    };

    Equation.prototype._init = function() {

    };

    Equation.prototype.rendTo = function(canvas) {
        var cvs = new EP.Canvas(canvas);
        if (!cvs.inited) {
            // rend coordinator
        }
    };
})();
