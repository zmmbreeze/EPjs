/*global EP:true */
(function(undefined) {
    var View = EP.View = function(canvas, defaultOpt) {
        this._cvs = canvas;
        this._ctx = canvas.getContext('2d');
        defaultOpt = defaultOpt || {};
        this.defaultAxesColor = defaultOpt.axesColor || '#666';
        this.defaultColor = defaultOpt.color || '#4CBF2F';
        this.defaultPointRadius = defaultOpt.pointRadius || 5;
        var viewHeight = this.getViewHeight() / 2;
        var viewWidth = this.getViewWidth() / 2;
        this.view(-viewWidth, viewWidth, -viewHeight, viewHeight);
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
        radius = radius || this.defaultPointRadius;
        color = color || this.defaultColor;
        var ctx = this._ctx;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius / 2, 0, 360);
        ctx.fill();
        ctx.moveTo(x + radius, y);
        ctx.arc(x, y, radius, 0, 360);
        ctx.stroke();
        ctx.closePath();
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
                    point.x,
                    point.y
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
        var viewX = point.x;
        var viewY = point.y;
        var m_2;    // = m / 2
        var ctx = this._ctx;

        ctx.fillStyle = color || this.defaultColor;
        switch (direction) {
        case 'up':
            m_2 = m / 2;
            ctx.beginPath();
            ctx.moveTo(viewX, viewY);
            ctx.lineTo(viewX + m_2, viewY);
            ctx.lineTo(viewX, viewY + n);
            ctx.lineTo(viewX - m_2, viewY);
            ctx.fill();
            ctx.closePath();
            break;
        case 'down':
            m_2 = m / 2;
            ctx.beginPath();
            ctx.moveTo(viewX, viewY);
            ctx.lineTo(viewX + m_2, viewY);
            ctx.lineTo(viewX, viewY - n);
            ctx.lineTo(viewX - m_2, viewY);
            ctx.fill();
            ctx.closePath();
            break;
        case 'right':
            m_2 = m / 2;
            ctx.beginPath();
            ctx.moveTo(viewX, viewY);
            ctx.lineTo(viewX, viewY + m_2);
            ctx.lineTo(viewX + n, viewY);
            ctx.lineTo(viewX, viewY - m_2);
            ctx.closePath();
            break;
        case 'left':
            m_2 = m / 2;
            ctx.beginPath();
            ctx.moveTo(viewX, viewY);
            ctx.lineTo(viewX, viewY + m_2);
            ctx.lineTo(viewX - n, viewY);
            ctx.lineTo(viewX, viewY - m_2);
            ctx.closePath();
            break;
        default:
            break;
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
        if ((maxX - minX <= 0) || (maxY - minY <= 0)) {
            return;
        }

        var w = this.getViewWidth();
        if (minX < 0 && maxX > 0) {
            this.scaleX = w / (maxX - minX);
            this.translateX = -minX * this.scaleX;
            this.minX = minX;
            this.maxX = maxX;
        } else if (minX >= 0) {
            this.scaleX = w / maxX;
            this.translateX = 0;
            this.minX = 0;
            this.maxX = maxX;
        } else {
            this.scaleX = w / -minX;
            this.translateX = w * this.scaleX;
            this.minX = minX;
            this.maxX = 0;
        }

        var h = this.getViewHeight();
        if (minY < 0 && maxY > 0) {
            this.scaleY = h / (minY - maxY);
            this.translateY = minY * this.scaleY;
            this.minY = minY;
            this.maxY = maxY;
        } else if (minY >= 0) {
            this.scaleY = -h / maxY;
            this.translateY = -h * this.scaleY;
            this.minY = 0;
            this.maxY = maxY;
        } else {
            this.scaleY = h / minY;
            this.translateY = 0;
            this.minY = minY;
            this.maxY = 0;
        }

        this._ctx.transform(this.scaleX, 0, 0, this.scaleY, this.translateX, this.translateY);
    };

    View.prototype.drawAxes = function() {
        var axesColor = this.defaultAxesColor;
        this.drawPoint({x: 0, y: 0}, axesColor);
        this.drawLine([
            {x: 0, y: this.maxY},
            {x: 0, y: this.minY}
        ], axesColor);
        this.drawLine([
            {x: this.minX, y: 0},
            {x: this.maxX, y: 0}
        ], axesColor);
        this.drawTriangle({x: 0, y: 0}, 30, 80, axesColor, 'left');
        // test TODO
        this.drawPoint({x: 100, y: 100}, '#000');
        this.drawPoint({x: -100, y: 100}, 'blue');
        this.drawPoint({x: 100, y: -100}, 'pink');
        this.drawPoint(-100, -100, 'red');
    };

})();
