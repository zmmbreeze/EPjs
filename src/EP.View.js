/*global EP:true */
(function(undefined) {
    var View = EP.View = function(canvas, defaultOpt) {
        this._cvs = canvas;
        this._ctx = canvas.getContext('2d');
        defaultOpt = defaultOpt || {};
        this.defaultColor = defaultOpt.color || '#4CBF2F';
        this.defaultPointRadius = defaultOpt.pointRadius || 5;
    };

    /**
     * clear this view.
     *
     */
    View.prototype.clear = function() {
        this._ctx.clearRect(0, 0, this._cvs.width, this._cvs.height);
    };

    /**
     * draw point
     *
     * @param {object} point center
     * @param {string} color
     * @param {number} radius
     */
    View.prototype.drawPoint = function(point, color, radius) {
        point = this.realPointToViewPoint(point);
        radius = radius || this.defaultPointRadius;
        color = color || this.defaultColor;
        this._ctx.fillStyle = color;
        this._ctx.strokeColor = color;
        this._ctx.arc(point.x, point.y, radius, 0, 360);
        this._ctx.stroke();
        this._ctx.arc(point.x, point.y, radius / 2, 0, 360);
        this._ctx.fill();
    };

    /**
     * draw points and connect them to lines
     *
     * @param {array<object>} points array of points.
     * @param {string} color
     */
    View.prototype.drawLine = function(points, color) {
        if (points.length) {
            var ctx = this._ctx;
            ctx.strokeStyle = color || this.defaultColor;
            ctx.beginPath();
            ctx.moveTo(points[0]);

            var i = 0;
            var l = points.length;
            var point;
            var scaleX = this._scaleX;
            var scaleY = this._scaleY;
            for (; i < l; i++) {
                point = points[i];
                ctx.lineTo(point.x * scaleX, point.y * scaleY);
            }
            ctx.stroke();
        }
    };

    /**
     *             /\
     *            /| \
     *           / |  \
     *          /  |   \
     *         /   |    \
     *        /    | n   \
     *       /     |      \
     *      ----------------
     *        m  (center point)
     *
     * @param {object} point real center point {x: 1, y: 2}
     * @param {number} m
     * @param {number} n
     * @param {string} color
     * @param {string} direction direction of triangle.
     */
    View.prototype.drawTriangle = function(point, m, n, color, direction) {
        var viewPoint = this.realPointToViewPoint(point);
        var viewX = viewPoint.x;
        var viewY = viewPoint.y;
        var viewM;
        var viewN;
        var viewM_2;    // = viewM / 2
        var ctx = this._ctx;

        ctx.fillStyle = color || this.defaultColor;
        switch(direction) {
        case 'up':
            viewM = m * this._scaleX;
            viewN = n * this._scaleY;
            viewM_2 = viewM / 2;
            ctx.beginPath();
            ctx.moveTo(viewX, viewY);
            ctx.lineTo(viewX + viewM_2, viewY);
            ctx.lineTo(viewX, viewY - viewN);
            ctx.lineTo(viewX - viewM_2, viewY);
            ctx.fill();
            break;
        case 'down':
            viewM = m * this._scaleX;
            viewN = n * this._scaleY;
            viewM_2 = viewM / 2;
            ctx.beginPath();
            ctx.moveTo(viewX, viewY);
            ctx.lineTo(viewX + viewM_2, viewY);
            ctx.lineTo(viewX, viewY + viewN);
            ctx.lineTo(viewX - viewM_2, viewY);
            ctx.fill();
            break;
        case 'right':
            viewM = m * this._scaleY;
            viewN = n * this._scaleX;
            viewM_2 = viewM / 2;
            ctx.beginPath();
            ctx.moveTo(viewX, viewY);
            ctx.lineTo(viewX, viewY + viewM_2);
            ctx.lineTo(viewX + viewN, viewY);
            ctx.lineTo(viewX, viewY - viewM_2);
            break;
        case 'left':
            viewM = m * this._scaleY;
            viewN = n * this._scaleX;
            viewM_2 = viewM / 2;
            ctx.beginPath();
            ctx.moveTo(viewX, viewY);
            ctx.lineTo(viewX, viewY + viewM_2);
            ctx.lineTo(viewX - viewN, viewY);
            ctx.lineTo(viewX, viewY - viewM_2);
            break;
        default:
            break;
        }
    };

    View.prototype.realPointToViewPoint = function(realPoint) {
        return {
            x: realPoint.x * this._scaleX,
            y: realPoint.y * this._scaleY
        };
    };

    View.prototype.viewPointToRealPoint = function(viewPoint) {
        return {
            x: viewPoint.x * this._rScaleX,
            y: viewPoint.y * this._rScaleW
        };
    };

    View.prototype.setRealWidth = function(w) {
        var viewW = this.getViewWidth();
        this._scaleX = viewW / w;
        this._rScaleX = w / viewW;
        this._realW = w;
    };

    View.prototype.setRealHeight = function(h) {
        var viewH = this.getViewHeight();
        this._scaleY = viewH / h;
        this._rScaleY = h / viewH;
        this._realH = h;
    };

    View.prototype.getRealWidth = function() {
        return this._realW;
    };

    View.prototype.getRealHeight = function() {
        return this._realH;
    };

    View.prototype.getViewWidth = function() {
        return this._cvs.width;
    };

    View.prototype.getViewHeight = function() {
        return this._cvs.height;
    };

})();
