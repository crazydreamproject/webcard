/*!
 * WebCard paint manipulation
 */

import interact from 'interactjs';
import listener from './listener.js';
import WcMode from './mode.js';
import WcTextAttr from './textattr.js';
import WcTool from './tool.js';
import WcCommon from './common.js';

// list of vars
var canvas, // set in setup
    context,
    mousePressed = false,
    strokeColor, // string, rgba(r,g,b,a)
    strokeAlpha,
    fillColor, // string, rgba(r,g,b,a)
    fillRule = 'nonzero',
    strokeWidth = 1, // default to 1 px
    strokeStyle = "solid", // solid, dash, etc
    dashDistance = [], // in form of [4,8]
    dashOffset = 0,
    startX, prevX, currX,
    startY, prevY, currY,
    paintTool,
    mousePoints,
    workingRect = { left:0, top:0, right:0, bottom:0 },
    canvasImage; // set in setup

var properties = {
    // brush: 1, // use above strokeWidth
    centered: false, // to draw polygon from center or not
    filled: false,
    grid: false,
    //lineSize: range [1-8] // currently using strokeWidth
    multiple: false,
    multiSpace: 1,
    pattern: 12, // range [1-40]
    polySides: 4, // range 0 or [3-50]
    //! todo: sync to textattr below
    //textAlign: 'left'
    //textFont: 'Osaka'
    //textHeight: 18
    //textSize: 16
    //textStyle: 'plain'
};

function setup(canvasId) {
    canvas = $(canvasId);
    if (canvas[0].getContext) {
        context= canvas[0].getContext('2d');
    } else {
        alert("Your browser does not support HTML5 canvas.");
    }

    canvas.mousedown( canvasMouseDown );
    canvas.mousemove( canvasMouseMove );
    canvas.mouseup( canvasMouseUp );
    canvas.mouseleave( canvasMouseLeave );

//    canvasImage = getCanvasImage();
}

// delay setCanvasImage if same image is get -> set immediately (where img is not ready)
var isCanvasImageLoaded = true;
var delaySetCanvasImage = false;
var tmpImage;
function getCanvasImage() {
    console.log("get canvas img");
    var img = new Image();
    img.src = canvas[0].toDataURL('image/png', 1);
    return img;

//    var img = new Image();
    img.src = canvas[0].toDataURL('image/png', 1);
    isCanvasImageLoaded = false;
    img.onload = function() {
        isCanvasImageLoaded = true;
        if (delaySetCanvasImage === true) {
            delaySetCanvasImage = false;
            setCanvasImage(tmpImage);
        }
    };
    return img;
}

function setCanvasImage(img) {
    // console.log("set img to canvas");
    context.clearRect(0, 0, canvas[0].width, canvas[0].height);
    context.drawImage(img, 0, 0);
    return;

    if (isCanvasImageLoaded === true) {
        // map entire image to canvas. 1:1
        context.clearRect(0, 0, canvas[0].width, canvas[0].height);
        context.drawImage(img, 0, 0);
    } else {
        delaySetCanvasImage = true;
        tmpImage = img;
    }
}

function getCanvasData() {
    var data = context.getImageData(0, 0, canvas[0].width, canvas[0].height);
    return data;
}

function setCanvasData(data) {
    context.putImageData(data, 0, 0);
}

function contextPrologue() {
    context.save();
    // setup context to paint
    context.strokeStyle = strokeColor;
    //context.globalAlpha = strokeAlpha;
    context.globalAlpha = 1.0; // alpha is included in strokeColor
    context.lineWidth = strokeWidth;
    context.setLineDash(dashDistance);
    context.lineDashOffset = dashOffset;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    //context.beginPath(); // to be done in each paint tool
    //context.moveTo(startX, startY);
}

function contextEpilogue() {
    //context.closePath();
    context.restore();
}

function resetWorkingArea() {
    var s2 = strokeWidth;
    var x = workingRect.left - s2;
    var y = workingRect.top - s2;
    var w = workingRect.right - workingRect.left + s2 * 2;
    var h = workingRect.bottom - workingRect.top + s2 * 2;
    context.save();
    context.globalAlpha = 1.0;
    context.clearRect(x, y, w, h);
    context.drawImage(canvasImage,
                        x, y, w, h, // source area
                        x, y, w, h  // dest area
    );
    context.restore();
}

// helper funcs. canvas.position gives float value like 123.5...
function getRelativeX(e) {
    return parseInt(e.pageX - canvas.offset().left);
}

function getRelativeY(e) {
    return parseInt(e.pageY - canvas.offset().top);
}

function preUpdatePoints(e) {
    currX = getRelativeX(e);
    currY = getRelativeY(e);
    mousePoints.push([currX, currY]);
    // update workingRect area.
    if (currX < workingRect.left) {
        workingRect.left = currX;
    }
    if (workingRect.right < currX) {
        workingRect.right = currX;
    }
    if (currY < workingRect.top) {
        workingRect.top = currY;
    }
    if (workingRect.bottom < currY) {
        workingRect.bottom = currY;
    }
}

// mouse event handling
function canvasMouseDown(e) {
    if (WcMode.getMode() != WcMode.modes.paint) {
        return;
    }
    mousePressed = true;
    startX = prevX = currX = getRelativeX(e);
    startY = prevY = currY = getRelativeY(e);
    workingRect.left = workingRect.right = startX;
    workingRect.top = workingRect.bottom = startY;
    mousePoints = [[prevX,prevY]];
    if (paintTool !== paintInstance.tool.select) {
        selectedArea.remove();
        canvasImage = getCanvasImage();
    } else {
        if (selectedArea.getState() === SelectedArea.state.removed) {
            // get canvas image on first click of selectTool.
            canvasImage = getCanvasImage();
        }
    }
    contextPrologue();
    paintTool.callback(e);
}

function canvasMouseMove(e) {
    if (!mousePressed) {
        return;
    }
    preUpdatePoints(e);
    paintTool.callback(e);
    // post update
    prevX = currX;
    prevY = currY;
}

function mouseEventEpilogue(e) {
    if (!mousePressed) {
        return;
    }
    preUpdatePoints(e);
    paintTool.callback(e);
    contextEpilogue();
    mousePressed = false;
}

function canvasMouseUp(e) {
    mouseEventEpilogue(e);
}

function canvasMouseLeave(e) {
    mouseEventEpilogue(e);
}

var selectBgType = 'white';
var selectedAreaInstance;
function SelectedArea () {
    if (typeof selectedAreaInstance === "object") {
        return selectedAreaInstance;
    }
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.from = {x:0, y:0, width:0, height:0};
    this.strokeDash = [4,2];
    this.dashOffset = 0;
    this.state = SelectedArea.state.removed;
    this.timerId = undefined;
    this.selectedImage = null;
    selectedAreaInstance = this;
}
SelectedArea.state = {
    removed: "No area is selected",
    resizable: "Selected area is now resizable",
    draggable: "Selected area is now draggable"
};
SelectedArea.prototype = {
    constructor: SelectedArea,
    movePict: function() {
        setCanvasImage(canvasImage);
        context.clearRect(this.from.x, this.from.y, this.from.width, this.from.height);
        if (selectBgType === 'white') {
            context.clearRect(this.x, this.y, this.width, this.height);
        }
        context.drawImage(canvasImage,
                        this.from.x, this.from.y, this.from.width, this.from.height, // source
                        this.x, this.y, this.width, this.height); // dest
    },
    createRect: function(x,y,w,h) {
        if (this.state === SelectedArea.state.draggable) {
            // burn current image to canvas
            this.movePict();
            canvasImage = getCanvasImage();
        }
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.setState(SelectedArea.state.resizable);
        this.timerId = setTimeout(this.march, 20);
    },
    clearRect: function() {
        this.movePict();
    },
    copyImage: function() {
        setCanvasImage(canvasImage);
        if (this.width < 0) {
            this.x += this.width;
            this.width = -this.width;
        }
        if (this.height < 0) {
            this.y += this.height;
            this.height = -this.height;
        }
        var data = context.getImageData(this.x, this.y, this.width, this.height);
        // transform raw data to imgUrl. fixme: there maybe better way to do this
        var dest = $('<div>',  { "id": "temporaryCanvasDiv" }).append($('<canvas>', { "class": "", "id": "hiddenTemporaryCanvas" }));
        dest.hide();
        $('body').append(dest);
        var tmpCanvas = $('body').find('#hiddenTemporaryCanvas');
        var tmpContext = tmpCanvas[0].getContext('2d');
        tmpCanvas[0].width = this.width;
        tmpCanvas[0].height = this.height;
        tmpContext.clearRect(0, 0, this.width, this.height);
        tmpContext.putImageData(data, 0, 0);
        var img = new Image();
        img.src = tmpCanvas[0].toDataURL('image/png');
        $('#temporaryCanvasDiv').remove();
        this.selectedImage = img;
    },
    march: function() {
        var me = new SelectedArea(); // its singleton, so get myself inside setTimeout context.
        // clear original from rect and copy its image to current rect.
        if (me.from.width !== 0 || me.from.height !== 0) {
            me.movePict();
        } else {
            resetWorkingArea();
        }

        // stroke marching ant effect.
        me.dashOffset = (me.dashOffset + 1) % 6; // 4 + 2 of strokeDash
        {
            context.save();
            context.setLineDash(me.strokeDash);
            context.lineDashOffset = -me.dashOffset;
            context.strokeStyle = 'black';
            context.lineWidth = 1;
            context.strokeRect(me.x, me.y, me.width, me.height);
            context.restore();
        }
        me.stop();
        me.timerId = setTimeout(me.march, 20);
    },
    stop: function() {
        clearTimeout(this.timerId);
        this.timerId = 0;
    },
    remove: function() {
        if (this.state !== SelectedArea.state.removed) {
            this.setState(SelectedArea.state.removed);
        }
    },
    resize: function(w, h) {
        if (this.state == SelectedArea.state.resizable) {
            this.width = w;
            this.height = h;
        }
    },
    move: function(x, y) {
        if (this.state == SelectedArea.state.draggable) {
            this.x = x;
            this.y = y;
        }
    },
    getRect: function() {
        return { x: this.x, y: this.y, width: this.width, height: this.height};
    },
    inArea: function(x, y) {
        var left = (this.width < 0) ? this.x + this.width : this.x;
        var right = (this.width < 0) ? this.x : this.x + this.width;
        var top = (this.height < 0) ? this.y + this.height : this.y;
        var bottom = (this.height < 0) ? this.y :this.y + this.height;
        // check x-axis
        if (left <= x && x <= right) {
            // check y-axis
            if (top <= y && y <= bottom) {
                return true;
            }
        }
        return false;
    },
    setState: function(s) {
        switch (s) {
            case SelectedArea.state.removed:
            {
                this.stop();
                this.clearRect();
                this.from.x = this.x = 0;
                this.from.y = this.y = 0;
                this.from.width = this.width = 0;
                this.from.height = this.height = 0;
            }
            break;
            case SelectedArea.state.resizable:
            {
                this.from.x = this.from.y = 0;
                this.from.width = 0;
                this.from.height = 0;
            }
            break;
            case SelectedArea.state.draggable:
            {
                this.from.x = this.x;
                this.from.y = this.y;
                this.from.width = this.width;
                this.from.height = this.height;
            }
            break;
            default:
            alert("Internal error: no such state: " + s);
        }
        this.state = s;
    },
    getState: function() {
        return this.state;
    }
};
var selectedArea = new SelectedArea();

var textAttr = new WcTextAttr();
var textAreaInstance;
function TextArea() {
    if (typeof textAreaInstance === 'object') {
        return textAreaInstance;
    }
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.state = TextArea.state.removed;
    this.elementId = "paint_text_tool_input";
    this.elementHtml = '<textarea id="' + this.elementId + '" autocomplete="off" ' +
                        'style="overflow: hidden; background: transparent; border: none; position:relative; ">' +
                        '</textarea>';
    this.element = null;
    textAreaInstance = this;
}
TextArea.state = {
    removed: "No area of text input",
    draggable: "Text area is now draggable"
};
TextArea.prototype = {
    constructor: TextArea,
    getWidth: function() {
        var text = this.element.val();
        var width = 0;
        var lines = this.element.val().split('\n');
        // find max width from multiple lines
        for (var i = 0; i < lines.length; i++) {
            var len = context.measureText(lines[i]).width;
            width = (width < len) ? len : width;
        }
        width += parseFloat(textAttr.size()); // margine to prevent blinking bug...
        return width;
    },
    getHeight: function() {
        var text = this.element.val();
        var lines = text.split('\n').length;
        lines = (0 < lines) ? lines : 1;
        var height = parseFloat(textAttr.lineHeight()) * lines;
        return height;
    },
    setElement: function() {
        if (this.element) {
            this.element.remove();
        }
        this.element = $(this.elementHtml);
        canvas.after(this.element);
        var that = this;
        // make textarea element draggable
        interact('#' + this.elementId).draggable({
            inertia: true,
            restrict: { restriction: "parent" },
            onmove: listener.dragMove,
            onend: function(event) {
                // fix the position of data-x and data-y
                var elem = $('#' + event.target.id);
                var dx = parseInt(event.pageX - event.x0);
                var dy = parseInt(event.pageY - event.y0);
                var x = parseInt(elem.css('left')) + dx;
                var y = parseInt(elem.css('top')) + dy;
                elem.css({left: x + 'px', top: y + 'px', transform: ''});
                elem.removeAttr('data-x');
                elem.removeAttr('data-y');
                x += canvas.position().left;
                y += canvas.position().top;
                that.move(x,y);
            }
        });
        this.element.keyup(function(e) {
            that.update();
        });
        this.element.val('');
        this.element.hide();
    },
    create: function(x, y) {
        var width, height;
        this.setElement();
        this.x = x + canvas.position().left;
        this.y = y + canvas.position().top;
        this.element.css({left: x+'px', top: y+'px'});
        this.setCss();
        // get w, h from empty text. this must be after setCss()!
        width = this.getWidth();
        height = this.getHeight();
        this.element.width(width);
        this.element.height(height);
        this.element.show();
        this.state = TextArea.state.draggable;
    },
    move: function(x, y) {
        if (this.state == TextArea.state.draggable) {
            this.x = x;
            this.y = y;
        }
    },
    focus: function() {
        this.element.focus();
    },
    setCss: function() {
        // set to context for measureText()
        context.font = textAttr.fontCss();
        context.textAlign = textAttr.textAlign();
        context.textBaseline = textAttr.textBaseline();
        // set same val to element
        // todo: set it in css() {} object notation
        this.element.css('font', textAttr.fontCss());
        this.element.css('text-align', textAttr.textAlign());
        this.element.css('line-height', textAttr.lineHeight());
        this.element.css('color', textAttr.color());
    },
    update: function() {
        this.setCss();
        this.element.width(this.getWidth());
        this.element.height(this.getHeight());
    },
    fill: function() {
        var x = this.x - canvas.position().left;
        // todo: fix a few pixel diff of Y due to textBaseline and textarea input...
        var y = this.y - canvas.position().top + parseFloat(textAttr.size());
        var lineHeight = parseFloat(textAttr.lineHeight());
        var text = this.element.val();
        // adjust x according to text-align
        switch (textAttr.textAlign()) {
            case 'right':
                x += this.getWidth();
            break;
            case 'center':
                x += this.getWidth() / 2;
            break;
        }
        context.save();
        this.setCss();
        context.font = textAttr.fontCss();
        context.fillStyle = textAttr.color(); // todo: change to fillColor when outline is there
        var lines = text.split('\n');
        for (var i = 0; i < lines.length; i++) {
            context.fillText(lines[i], x, (y + (i * lineHeight)));
        }
        context.restore();
    },
    remove: function() {
        if (this.state !== TextArea.state.removed) {
            this.fill(); // only draw to canvas when textarea element change to hidden.
            this.setState(TextArea.state.removed);
        }
    },
    setState: function(s) {
        switch(s) {
            case TextArea.state.removed:
            {
                this.x = this.y = this.width = this.height = 0;
                this.element.hide();
            }
            break;
        }
        this.state = s;
    }
};
var textArea = new TextArea();

// paint tool fn
function paintPencil(e) {
    // set path and stroke
    {
        resetWorkingArea();
        context.beginPath();
        context.moveTo(startX, startY);
        for (var p = 1; p < mousePoints.length; p += 1) {
            context.lineTo(mousePoints[p][0], mousePoints[p][1]);
        }
        context.stroke();
    }
}

// helper class for smoothing and adaptive size brush stroke
function SmoothBrush() {
    this.SMOOTHING_INIT = 0.85;
    this.WEIGHT_SPREAD = 10;
    this.smoothing = this.SMOOTHING_INIT;
    this.maxWeight = 12;
    this.thickness = 2;
    this.targetThickness = 2;
    this.weight = 2;
    this.smoothPoints = [[]];
}
SmoothBrush.prototype = {
    constructor: SmoothBrush,
    lineDistance: function(x1, y1, x2, y2) {
        var xs = Math.pow(x2 - x1, 2);
        var ys = Math.pow(y2 - y1, 2);
        return Math.sqrt(xs + ys);
    },
    init: function() {
        this.targetThickness = strokeWidth;
        this.thickness = strokeWidth;
        this.weight = strokeWidth;
        this.maxWeight = this.weight + this.WEIGHT_SPREAD;
        this.smoothing = this.SMOOTHING_INIT;
    },
    start: function() {
        this.smoothPoints = [[]];
        // setup for smooth brush (will be restored by contextEpilogue)
        {
            context.save();
            context.globalAlpha = (strokeAlpha > 0.999) ? 1.0 : strokeAlpha / 4;
            context.beginPath();
            context.moveTo(startX, startY);
        }
    },
    stop: function() {
        context.restore();
        return;
    },
    draw: function() {
        // equation from atrament.js
        var rawDist = this.lineDistance(currX, currY, prevX, prevY);
        var smoothingFactor = Math.min(0.87, this.smoothing + (rawDist - 60) / 3000);
        var smoothX = currX - (currX - prevX) * smoothingFactor;
        var smoothY = currY - (currY - prevY) * smoothingFactor;
        var dist = this.lineDistance(smoothX, smoothY, prevX, prevY);
        this.targetThickness = (dist - 1) / (50 - 1) * (this.maxWeight - this.weight) + this.weight;
        if (this.thickness > this.targetThickness) {
            this.thickness -= 0.5;
        } else if (this.thickness < this.targetThickness) {
            this.thickness += 0.5;
        }
        // calculation is done. now setup values.
        currX = smoothX;
        currY = smoothY;
        this.smoothPoints.push([prevX, prevY, currX, currY, this.thickness]);
        // set path and stroke
        {
            context.lineWidth = this.thickness;
            context.quadraticCurveTo(prevX, prevY, currX, currY);
            context.stroke();
        }
    }
};
var sbrush = new SmoothBrush();

function paintBrush(e){
    if (e.type === "mousedown") {
        sbrush.start();
    }
    // draw with smooth curve, adaptive stroke, like in atrament.
    sbrush.draw();
    if (e.type === "mouseup" || e.type === "mouseleave") {
        sbrush.stop();
    }
}

function paintSpray(e) {
    // TBD
}

function paintPattern(e) {
    // set path and stroke, just for now.
    // fixme: actually, need pattern dialog to set repeated pattern drawing like ichimatsu...
    {
        resetWorkingArea();
        context.lineCap = 'square';
        context.lineJoin = 'bevel';
        context.beginPath();
        context.moveTo(startX, startY);
        for (var p = 1; p < mousePoints.length; p += 1) {
            context.lineTo(mousePoints[p][0], mousePoints[p][1]);
        }
        context.stroke();
    }
    
}

var eraserRGB;
var eraserAlpha;
var eraserStyle = 'round';
function paintEraser(e) {
    if (e.type === "mousedown") {
        // value to cancel previous stroke with alpha when double stroked on top.
        eraserRGB = 'rgba(' + strokeColor.replace(/^rgba\((.+),.+\)/,'$1') + ',1.0)';
        eraserAlpha = (1 - strokeAlpha) / (2 - strokeAlpha);
        eraserAlpha = (strokeAlpha < 1.0) ? eraserAlpha : 1.0;
    }
    // set path and stroke
    {
        resetWorkingArea();
        context.save();
        context.globalCompositeOperation = 'destination-out';
        context.strokeStyle = eraserRGB;
        context.globalAlpha = eraserAlpha;
        context.lineCap = eraserStyle;
        if (eraserStyle === 'round') {
            context.lineJoin = 'round';
        } else {
            context.lineJoin = 'miter';
        }
        context.beginPath();
        context.moveTo(startX, startY);
        for (var p = 1; p < mousePoints.length; p += 1) {
            context.lineTo(mousePoints[p][0], mousePoints[p][1]);
        }
        context.stroke();
        context.restore();
    }
}

function paintSelect(e) {
    if (e.type === "mousedown") {
        if (!selectedArea.inArea(startX, startY)) {
            selectedArea.createRect(startX, startY, currX - startX, currY - startY);
            // now, state will be "resizable".
        }
    }
    var state = selectedArea.getState();
    if (state == SelectedArea.state.resizable) {
        selectedArea.resize(currX - startX, currY - startY);
    }
    if (state == SelectedArea.state.draggable) {
        var rect = selectedArea.getRect();
        var dx = (currX - prevX);
        var dy = (currY - prevY);
        var x = rect.x + dx;
        var y = rect.y + dy;
        selectedArea.move(x, y);
    }
    if ((e.type === "mouseup") || (e.type === "mouseleave")) {
        if (state == SelectedArea.state.resizable) {
            selectedArea.setState(SelectedArea.state.draggable);
            selectedArea.copyImage();
        }
    }
}

// from http://www.williammalone.com/articles/html5-canvas-javascript-paint-bucket-tool/
// bug: when same area, same color is picked to fill, pixelStack increase infinite. fixed using matchFillColor().
// todo: need optimization, change traverse from y to x
var bucketStartColor = { r:0, g:0, b:0, a:0 }; // to be updated at mousedown of bucket tool.
var bucketFillColor = { r:0, g:0, b:0, a:0 }; // to be updated at mousedown of bucket tool.
var canvasData;
var alphaTolerance = 0.0; // [0.0 - 1.0]
function matchStartColor(pixelPos) {
    var c = {
        r: canvasData.data[pixelPos + 0],
        g: canvasData.data[pixelPos + 1],
        b: canvasData.data[pixelPos + 2],
        a: canvasData.data[pixelPos + 3]
    };
    var checkAlpha = (c.a == bucketStartColor.a);
    var check = (c.r == bucketStartColor.r && c.g == bucketStartColor.g &&
                    c.b == bucketStartColor.b && checkAlpha);
    return check;
}
function matchFillColor(pixelPos) {
    var c = {
        r: canvasData.data[pixelPos + 0],
        g: canvasData.data[pixelPos + 1],
        b: canvasData.data[pixelPos + 2],
        a: canvasData.data[pixelPos + 3]
    };
    var check = (c.r == bucketFillColor.r && c.g == bucketFillColor.g &&
                    c.b == bucketFillColor.b && c.a == bucketFillColor.a);
    return check;        
}
function colorPixel(pixelPos) {
    canvasData.data[pixelPos + 0] = bucketFillColor.r;
    canvasData.data[pixelPos + 1] = bucketFillColor.g;
    canvasData.data[pixelPos + 2] = bucketFillColor.b;
    canvasData.data[pixelPos + 3] = bucketFillColor.a;
}
function bucketFill() {
    var canvasWidth = canvas[0].width,
        canvasHeight = canvas[0].height,
        pixelStack = [[startX, startY]];
    var startPos = (startY * canvasWidth + startX) * 4;
    if (matchFillColor(startPos)) { // do nothing
        return;
    }
    while (pixelStack.length) {
        var newPos, x, y, pixelPos, reachLeft, reachRight;
        newPos = pixelStack.pop();
        x = newPos[0];
        y = newPos[1];
        pixelPos = (y * canvasWidth + x) * 4;
        while (y-- >= 0 && matchStartColor(pixelPos)) {
            pixelPos -= canvasWidth * 4;
        }
        pixelPos += canvasWidth * 4;
        ++y;
        reachLeft = reachRight = false;
        while (y++ < canvasHeight - 1 && matchStartColor(pixelPos)) {
            colorPixel(pixelPos);
            if (x > 0) {
                if (matchStartColor(pixelPos - 4)) {
                    if (!reachLeft) {
                        pixelStack.push([x - 1, y]);
                        reachLeft = true;
                    }
                } else if (reachLeft) {
                    reachLeft = false;
                }
            }
            if (x < canvasWidth - 1) {
                if (matchStartColor(pixelPos + 4)) {
                    if (!reachRight) {
                        pixelStack.push([x + 1, y]);
                        reachRight = true;
                    }
                } else if (reachRight) {
                    reachRight = false;
                }
            }
            pixelPos += canvasWidth * 4;
        }
    }
}

function paintBucket(e){
    if (e.type === "mousedown") {
        // setup vars
        canvasData = getCanvasData();
        var xyColor = context.getImageData(startX, startY, 1, 1);
        bucketStartColor.r = xyColor.data[0];
        bucketStartColor.g = xyColor.data[1];
        bucketStartColor.b = xyColor.data[2];
        bucketStartColor.a = xyColor.data[3];
        var rgba = fillColor.replace(/^rgba\(/,'').replace(/\)$/,'').replace(/\s/g,'').split(',');
        bucketFillColor.r = parseInt(rgba[0]);
        bucketFillColor.g = parseInt(rgba[1]);
        bucketFillColor.b = parseInt(rgba[2]);
        bucketFillColor.a = parseInt(255 * rgba[3]); // change range from 0.0 - 1.0 to 0 - 255.
        // fill canvas data
        bucketFill();
        setCanvasData(canvasData);
    }
}

function paintCrop(e) {
}

var lineStyle = 'round';
function paintLine(e) {
    // set path and stroke
    {
        resetWorkingArea();
        context.save();
        context.lineCap = lineStyle;
        if (lineStyle === 'round') {
            context.lineJoin = 'round';
        } else {
            context.lineJoin = 'miter';
        }
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(currX, currY);
        context.stroke();
        context.restore();
    }
}

var polygonSides = 4;
function paintPolygon(e) {
    // set path and stroke, currently, just sides with 4, so just draw rect...
    // todo: UI to change polygonSides, draw n side polygon. (with starting angle theta)
    {
        var width = currX - startX;
        var height = currY - startY;
        resetWorkingArea();
        context.fillStyle = fillColor;
        context.fillRect(startX, startY, width, height);
        context.lineCap = 'square';
        context.lineJoin = 'miter';
        context.strokeStyle = strokeColor;
        context.strokeRect(startX, startY, width, height);
    }
}

function paintOval(e){
    // set path and stroke
    {
        var kappa = 0.5522848, // strange magic number...
            width = currX - startX,
            height = currY - startY,
            ox = (width/2) * kappa, // cp offset horiz
            oy = (height/2) * kappa, // cp offset vert
            xe = currX, // x-end
            ye = currY, // y-end
            xm = startX + width/2, // x-middle
            ym = startY + height/2, // y-middle
            x = startX,
            y = startY;

        resetWorkingArea();
        context.beginPath();
        context.moveTo(x, ym);
        context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        context.fillStyle = fillColor;
        context.fill();
        context.stroke();
        context.closePath();
    }
}

function paintArrows(e){}

var eyedropPickup = 'stroke';
function paintEyedrop(e){
//        if (e.type === "mouseup") {
        var img, rgba;
        img = context.getImageData(currX, currY, 1, 1);
        rgba = 'rgba(' + img.data[0] + ',' + img.data[1] + ',' + img.data[2] + ',' + (img.data[3]/255) + ')';
        if (eyedropPickup === 'stroke') {
            WcTool.setStrokeColor(rgba);
            strokeColor = rgba;
            strokeAlpha = img.data[3]/255;
        } else {
            WcTool.setFillColor(rgba);
            fillColor = rgba;
        }
//        }
}

function paintText(e){
    if (e.type === "mousedown") {
        textAttr.color(strokeColor);
        // stroke previous text. adhoc.
        textArea.remove();
        // start new text input in new pos
        textArea.create(startX, startY);
    }
    if ((e.type === "mouseup") || (e.type === "mouseleave")) {
        textArea.focus();
    }
}

function paintMagicwand(e){}

// singleton to represent paint manipulations
var paintInstance;
function WcPaint() {
    if (typeof paintInstance === "object") {
        return paintInstance;
    }
    paintInstance = this;
}
WcPaint.prototype = {
    constructor: WcPaint,

    tool: {
        pencil: { text: "Pencil Tool", callback: paintPencil },
        brush: { text: "Brush Tool", callback: paintBrush },
        pattern: { text: "Pattern Tool", callback: paintPattern },
        eraser: { text: "Eraser Tool", callback: paintEraser },
        select: { text: "Select Tool", callback: paintSelect },
        crop: { text: "Crop Tool", callback: paintCrop },
        line: { text: "Line Tool", callback: paintLine },
        polygon: { text: "Polygon Tool", callback: paintPolygon },
        oval: { text: "Oval Tool", callback: paintOval },
        arrows: { text: "Arrows Tool", callback: paintArrows },
        eyedrop: { text: "Eyedrop Tool", callback: paintEyedrop },
        magic: { text: "Magic Wand", callback: paintMagicwand },
        text: { text: "Text Tool", callback: paintText },
        bucket: { text: "Bucket Tool", callback: paintBucket }
    },

    setup: function(canvasId) {
        setup(canvasId);
    },

    setStrokeWidth: function(w) {
        if (w) {
            strokeWidth = w;
        }
    },
    getStrokeWidth: function() {
        return strokeWidth;
    },
    setStrokeColor: function(rgba) {
        strokeColor = rgba;
        strokeAlpha = parseFloat(strokeColor.replace(/^.*,(.+)\)/,'$1'));
    },
    getStrokeColor: function() {
        return strokeColor;
    },
    setFillColor: function(rgba) {
        fillColor = rgba;
    },
    getFillColor: function() {
        return fillColor;
    },
    setStrokeStyle: function(style, dashDist, dashOff) {
        strokeStyle = style;
        if (dashDist) { // assume string "4,8" change to [4,8]
            var arr = dashDist.split(',');
            dashDistance = arr;
        }
        if (dashOff) {
            dashOffset = parseInt(dashOff);
        }
        if (style === "solid") {
            dashDistance = [];
            dashOffset = 0;
        }
    },
    getStrokeStyle: function() {
        return { style: strokeStyle, dist: dashDistance.join(','), offset: dashOffset };
    },
    setEraserStyle: function(s) {
        eraserStyle = s;
    },
    getEraserStyle: function() {
        return eraserStyle;
    },
    setLineStyle: function(s) {
        lineStyle = s;
    },
    getLineStyle: function() {
        return lineStyle;
    },
    setSelectBgType: function(t) {
        selectBgType = t;
    },
    getSelectBgType: function() {
        return selectBgType;
    },
    setBucketTolerance: function(t) {
        alphaTolerance = t;
    },
    getBucketTolerance: function() {
        return alphaTolerance;
    },
    setEyedropPickup: function(p) {
        eyedropPickup = p;
    },
    getEyedropPickup: function() {
        return eyedropPickup;
    },
    setTextAttr: function(attr) {
        // reflect color to strokeColor
        strokeColor = attr.color();
        WcTool.setStrokeColor(attr.color());
        textArea.update();
    },
    getTextAttr: function() {
        return textAttr;
    },
    setPaintTool: function(tool) {
        selectedArea.remove();
        textArea.remove();
        if (tool) {
            paintTool = tool;
        } else {
            console.log("in setPaintTool, tool unknown: ");
            console.log(tool);
        }
    },
    setCanvasImage: function(img) {
        setCanvasImage(img);
    },
    getCanvasImage: function() {
        return getCanvasImage();
    },
    getSelectedImage: function() {
        return selectedArea.selectedImage;
    },
    clearCanvas: function() {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    },
    resizeCanvas: function(width, height) {
        context.canvas.width = width;
        context.canvas.height = height;
        context.clearRect(0, 0, width, height);
    },
    // get/set properties, via script
    //! todo: rewrite strokeWidth, etc to fit to property object.
    properties: {
        // painting properties
        brush: function (val) {
            if (val) {
                val = parseInt(val);
                if (isNaN(val)) return strokeWidth;
                // clip value
                if (val < 1) val = 1;
                if (val > 100) val = 100;
                strokeWidth = val;
            }
            return strokeWidth;
        },
        centered: function (val) {
            if (val) {
                properties.centerd = WcCommon.toBoolean(val);
            }
            return properties.centerd;
        },
        filled: function (val) {
            if (val) {
                properties.filled = WcCommon.toBoolean(val);
            }
            return properties.filled;
        },
        grid: function (val) {
            if (val) {
                properties.grid = WcCommon.toBoolean(val);
            }
            return properties.grid;
        },
        lineSize: function (val) { // currently same as strokeWidth
            return this.brush(val);
        },
        multiple: function (val) {
            if (val) {
                properties.multiple = WcCommon.toBoolean(val);
            }
            return properties.multiple;
        },
        multiSpace: function (val) {
            if (val) {
                val = parseInt(val);
                if (isNaN(val)) return properties.multiSpace;
                // clip value
                if (val < 1) val = 1;
                if (val > 100) val = 100;
                properties.multiSpace = val;
            }
            return properties.multiSpace;
        },
        pattern: function (val) {
            if (val) {
                val = parseInt(val);
                if (isNaN(val)) return properties.pattern;
                // clip value
                if (val < 1) val = 1;
                if (val > 40) val = 40;
                properties.pattern = val;
            }
            return properties.pattern;
        },
        polySides: function (val) {
            if (val) {
                val = parseInt(val);
                if (isNaN(val)) return properties.polySides;
                // clip value, its 0 or [3-50]
                if (val < 3) val = 0;
                if (val > 50) val = 50;
                properties.polySides = val;
            }
            return properties.polySides;
        },
        textAlign: function (val) { return WcCommon.textAlign(textAttr, val) },
        textFont: function (val) { return WcCommon.textFont(textAttr, val) },
        textHeight: function (val) { return WcCommon.textHeight(textAttr, val) },
        textSize: function (val) { return WcCommon.textSize(textAttr, val) },
        textStyle: function (val) { return WcCommon.textSstyle(textAttr, val) },
    },
};

paintInstance = new WcPaint();

export default paintInstance;
