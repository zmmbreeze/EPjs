/*global EP:true */
(function(undefined) {
    var View = EP.View = function(canvas, defaultOpt) {
        this._cvs = canvas;
        this._ctx = canvas.getContext('2d');
        defaultOpt = defaultOpt || {};
        this.defaultColor = defaultOpt.color || '#4CBF2F';
        this.defaultPointRadius = defaultOpt.pointRadius || 5;
        this.view(-2, 2, -2, 2);
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
     * @param {object} point center.
     * @param {string} color .
     * @param {number} radius .
     */
    View.prototype.drawPoint = function(point, color, radius) {
        var x;
        var y;
        if (typeof arguments[1] === 'number') {
            x = point;
            y = color;
            color = radius;
            radius = arguments[4];
        } else {
            x = point.x;
            y = point.y;
        }
        x = this.translateX(x);
        y = this.translateY(y);
        radius = radius || this.defaultPointRadius;
        color = color || this.defaultColor;
        var ctx = this._ctx;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius / 2, 0, 360);
        ctx.fill();
        ctx.moveTo(x + radius, y);
        ctx.arc(x, y, radius, 0, 360);
        ctx.stroke();
    };

    /**
     * draw points and connect them to lines
     *
     * @param {array<object>} points array of points.
     * @param {string} color .
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
            for (; i < l; i++) {
                point = points[i];
                ctx.lineTo(
                    this.translateX(point.x),
                    this.translateY(point.y)
                );
            }
            ctx.stroke();
            ctx.closePath();
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
     * @param {object} point real center point {x: 1, y: 2}.
     * @param {number} m .
     * @param {number} n .
     * @param {string} color .
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
        switch (direction) {
        case 'up':
            viewM = m * this.scale;
            viewN = n * this.scale;
            viewM_2 = viewM / 2;
            ctx.beginPath();
            ctx.moveTo(viewX, viewY);
            ctx.lineTo(viewX + viewM_2, viewY);
            ctx.lineTo(viewX, viewY - viewN);
            ctx.lineTo(viewX - viewM_2, viewY);
            ctx.fill();
            break;
        case 'down':
            viewM = m * this.scale;
            viewN = n * this.scale;
            viewM_2 = viewM / 2;
            ctx.beginPath();
            ctx.moveTo(viewX, viewY);
            ctx.lineTo(viewX + viewM_2, viewY);
            ctx.lineTo(viewX, viewY + viewN);
            ctx.lineTo(viewX - viewM_2, viewY);
            ctx.fill();
            break;
        case 'right':
            viewM = m * this.scale;
            viewN = n * this.scale;
            viewM_2 = viewM / 2;
            ctx.beginPath();
            ctx.moveTo(viewX, viewY);
            ctx.lineTo(viewX, viewY + viewM_2);
            ctx.lineTo(viewX + viewN, viewY);
            ctx.lineTo(viewX, viewY - viewM_2);
            break;
        case 'left':
            viewM = m * this.scale;
            viewN = n * this.scale;
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

    /**
     * real point to view point
     * @param {object} realPoint .
     * @return {object} view point.
     */
    View.prototype.realPointToViewPoint = function(realPoint) {
        return {
            x: realPoint.x * this.scale + this.zX,
            y: (-realPoint.y) * this.scale + this.zY
        };
    };

    /**
     * view point to real point
     * @param {object} viewPoint .
     * @return {object} real point.
     */
    View.prototype.viewPointToRealPoint = function(viewPoint) {
        return {
            x: (viewPoint.x - this.zX) * this.rScale,
            y: (this.zY - viewPoint.y) * this.rScale
        };
    };

    /**
     * translate X
     *
     * @param {number} x .
     * @param {boolean} viewToReal .
     * @return {number} x.
     */
    View.prototype.translateX = function(x, viewToReal) {
        if (viewToReal) {
            return (x - this.zX) * this.rScale;
        } else {
            return x * this.scale + this.zX;
        }
    };

    /**
     * translate Y
     *
     * @param {number} y .
     * @param {boolean} viewToReal .
     * @return {number} y.
     */
    View.prototype.translateY = function(y, viewToReal) {
        if (viewToReal) {
            return (this.zY - y) * this.rScale;
        } else {
            return (-y) * this.scale + this.zY;
        }
    };

    /**
     * get view width
     *
     * @return {number} width of canvas.
     */
    View.prototype.getViewWidth = function() {
        return this._cvs.width;
    };

    /**
     * get view height
     *
     * @return {number} height of canvas.
     */
    View.prototype.getViewHeight = function() {
        return this._cvs.height;
    };

    /**
     * setup view
     *
     * @param {number} minX .
     * @param {number} maxX .
     * @param {number} minY .
     * @param {number} maxY .
     */
    View.prototype.view = function(minX, maxX, minY, maxY) {
        var needWidth = maxX - minX;
        var needHeight = maxY - minY;
        var viewH = this.getViewHeight();
        var viewW = this.getViewWidth();
        var scaleX = viewW / needWidth;
        var scaleY = viewH / needHeight;
        if (scaleX < scaleY) {
            this.scale = scaleX;
            this.rScale = 1 / scaleX;
        } else {
            this.scale = scaleY;
            this.rScale = 1 / scaleY;
        }

        // zero point in view
        this.zX = -minX * this.scale;
        this.zY = maxY * this.scale;

        // real point
        this.realMinX = minX;
        this.realMaxX = this.translateX(viewW, true);
        this.realMinY = this.translateY(viewH, true);
        this.realMaxY = maxY;
    };

    View.prototype.drawAxes = function() {
        this.drawPoint({x: 0, y: 0});
        this.drawLine([
            {x: 0, y: this.realMaxY},
            {x: 0, y: this.realMinY}
        ]);
        this.drawLine([
            {x: this.realMinX, y: 0},
            {x: this.realMaxX, y: 0}
        ]);
        // test TODO
        this.drawPoint({x: 1, y: 1}, '#000');
        this.drawPoint({x: -1, y: 1}, 'blue');
        this.drawPoint({x: 1, y: -1}, 'pink');
        this.drawPoint(-1, -1, 'red');
    };

})();
