/*global EP:true */
(function(undefined) {
    var Equation = EP.Coordinator = function(view) {
        this._v = view;
        this._eqs = [];
    };

    Equation.prototype.drawAxes = function() {
    };

    Equation.prototype.remove = function(text) {
        var i = 0;
        var l = this._eqs.length;
        for (; i < l; i++) {
            if (this._eqs[i].text === text) {
                this._eqs.splice(i, 1);
            }
        }
    };

    Equation.prototype.add = function(text, color) {
        var eq = new EP.Equation(text);
        this._eqs.push({
            eq: eq,
            text: text,
            color: color
        });
    };

    Equation.prototype.update = function() {
        // draw axes
        if (!this._v.inited) {
            this._v.inited = true;
        }

        // draw lines
        var i = 0;
        var l = this._eqs.length;
        for (; i < l; i++) {
            this.drawEquation(this._eqs[i]);
        }
    };

    Equation.prototype.drawEquation = function(eq) {
        if (eq.eq.canUse) {
            // TODO
        }
    };
})();
