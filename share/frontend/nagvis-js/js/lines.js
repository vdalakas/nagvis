/*****************************************************************************
 *
 * lines.js - Functions for drawing lines in javascript
 *
 * Copyright (c) 2004-2008 NagVis Project (Contact: lars@vertical-visions.de)
 *
 * License:
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 2 as
 * published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
 *
 *****************************************************************************/
 
/**
 * @author	Lars Michelsen <lars@vertical-visions.de>
 */

// Calculates the middle between two integers
function middle(x1,x2) {
	return (x1+(x2-x1)/2);
}

// Returns the maximum value in an array
function max(arr) {
	var max = arr[0];
	
	for (var i = 1, len = arr.length; i < len; i++) {
		if (arr[i] > max) {
			max = arr[i];
		}
	}
	
	return max;
}

// Returns the minimum value in an array
function min(arr) {
	var min = arr[0];
	
	for (var i = 1, len = arr.length; i < len; i++) {
		if (arr[i] < min) {
			min = arr[i];
		}
	}
	
	return min;
}

function newX(a, b, x, y) {
	return (Math.cos(Math.atan2(y,x)+Math.atan2(b,a))*Math.sqrt(x*x+y*y));
}

function newY(a, b, x, y) {
	return (Math.sin(Math.atan2(y,x)+Math.atan2(b,a))*Math.sqrt(x*x+y*y));
}

// Draws polygon based object. By default it draws lines (arrows and also plain lines)
function drawPolygonBasedObject(objectId, lineType, xCoord, yCoord, z, w, colorFill, perfdataA, perfdataB, colorBorder, bLinkArea) {
	
	var xMin = Math.round(min(xCoord));
	var yMin = Math.round(min(yCoord));
	var xMax = Math.round(max(xCoord));
	var yMax = Math.round(max(yCoord));
	
	// Detect if the browser is able to render canvas objects
	// If so: Use canvas rendering which performs much better
	//        than using the jsGraphics library
	var oCanvas = document.createElement('canvas');
	if(oCanvas.getContext) {
		var oLineContainer = document.getElementById(objectId+'-line');
		
		// Draw the line
		oCanvas.setAttribute('id', objectId+'-canvas');
		oCanvas.style.position = 'absolute';
		oCanvas.style.left = xMin+"px";
		oCanvas.style.top = yMin+"px";
		oCanvas.width = Math.round(xMax-xMin);
		oCanvas.height = Math.round(yMax-yMin);
		oCanvas.style.zIndex = z;
		
		var ctx = oCanvas.getContext('2d');
		
		ctx.fillStyle = colorFill;
		ctx.beginPath();
		ctx.moveTo(xCoord[0]-xMin, yCoord[0]-yMin);
		
		// Loop all coords
		for(var i = 1, len = xCoord.length; i < len; i++) {
			ctx.lineTo(xCoord[i]-xMin, yCoord[i]-yMin);
		}
		
		ctx.fill();
		
		oLineContainer.appendChild(oCanvas);
		ctx = null;
		oCanvas = null;
		oLineContainer = null;
	} else {
		var oLineContainer = document.getElementById(objectId+'-line');
		
		// Fallback to old line style
		var oLine = new jsGraphics(document.getElementById(objectId+'-line'));
		oLine.setColor(colorFill);
		oLine.fillPolygon(xCoord, yCoord);
		oLine.paint();
		
		oLine = null;
		oLineContainer = null;
	}
	
	oCanvas = null;
	
	// Now draw the link 
	// FIXME: Would be better to have a link allover the line
	// -------------------------------------------------------------------------
	
	if(bLinkArea && bLinkArea === true) {
		var oLinkContainer = document.getElementById(objectId+'-linelinkdiv');

		if(lineType == '13') {
			var labelShift = (perfdataA.length / 2) * 9;
			var label = drawNagVisTextbox(objectId, 'box', '#ffffff', '#000000', (middle(xMin, xMax)-labelShift), (middle(yMin, yMax)-10), z, 'auto', 'auto', '<b>' + perfdataA + '</b>');
			oLinkContainer.appendChild(label);
		} else if(lineType == '14') {
			var labelShift = (perfdataA.length / 2) * 9;
			label = drawNagVisTextbox(objectId, 'box', '#ffffff', '#000000', (middle(xMin, xMax)-labelShift), (middle(yMin, yMax)-10), z, 'auto', 'auto', '<b>' + perfdataA + '</b>');
			oLinkContainer.appendChild(label);
			labelShift = (perfdataB.length / 2) * 8;
			label = drawNagVisTextbox(objectId, 'box', '#ffffff', '#000000', (middle(xMin, xMax)-labelShift), (middle(yMin, yMax)+10), z, 'auto', 'auto', '<b>' + perfdataB + '</b>');
			oLinkContainer.appendChild(label);
		
		} else {
			var oImg = document.createElement('img');
			oImg.setAttribute('id', objectId+'-link');
			oImg.src = oGeneralProperties.path_iconsets+'20x20.gif';
			oImg.style.position = 'absolute';
			oImg.style.left = (middle(xMin, xMax)-10)+"px";
			oImg.style.top = (middle(yMin, yMax)-10)+"px";
			oImg.style.width = 10;
			oImg.style.height = 10;
			oImg.style.zIndex = z+1;
		
			oLinkContainer.appendChild(oImg);
			oImg = null;
		}

		oLinkContainer = null;
	}
}

// This function draws an arrow like it is used on NagVis maps
// It draws following line types: ---> and ---><---
//function drawArrow(objectId, x1, y1, x2, y2, z, w, colorFill, colorBorder, bLinkArea lineType, perfdata) {
function drawArrow(objectId, lineType, x1, y1, x2, y2, z, w, colorFill, perfdataA, perfdataB, colorBorder, bLinkArea) {
	var xCoord = [];
	var yCoord = [];
	
	xCoord[0] = x1 + newX(x2-x1, y2-y1, 0, w);
	xCoord[1] = x2 + newX(x2-x1, y2-y1, -4*w, w);
	xCoord[2] = x2 + newX(x2-x1, y2-y1, -4*w, 2*w);
	xCoord[3] = x2;
	xCoord[4] = x2 + newX(x2-x1, y2-y1, -4*w, -2*w);
	xCoord[5] = x2 + newX(x2-x1, y2-y1, -4*w, -w);
	xCoord[6] = x1 + newX(x2-x1, y2-y1, 0, -w);
	
	yCoord[0] = y1 + newY(x2-x1, y2-y1, 0, w);
	yCoord[1] = y2 + newY(x2-x1, y2-y1, -4*w, w);
	yCoord[2] = y2 + newY(x2-x1, y2-y1, -4*w, 2*w);
	yCoord[3] = y2;
	yCoord[4] = y2 + newY(x2-x1, y2-y1, -4*w, -2*w);
	yCoord[5] = y2 + newY(x2-x1, y2-y1, -4*w, -w);
	yCoord[6] = y1 + newY(x2-x1, y2-y1, 0, -w);
	
	drawPolygonBasedObject(objectId, lineType, xCoord, yCoord, z, w, colorFill, perfdataA, perfdataB, colorBorder, bLinkArea);
//	drawPolygonBasedObject(objectId, xCoord, yCoord, z, w, colorFill, colorBorder, bLinkArea);
	
	yCoord = null;
	xCoord = null;
}

// This function draws simple lines (without arrow)
function drawSimpleLine(objectId, lineType, x1, y1, x2, y2, z, w, colorFill, perfdataA, perfdataB, colorBorder, bLinkArea) {
	var xCoord = [];
	var yCoord = [];
	
	xCoord[0] = x1 + newX(x2-x1, y2-y1, 0, w);
	xCoord[1] = x2 + newX(x2-x1, y2-y1, -4*w, w);
	xCoord[2] = x2 + newX(x2-x1, y2-y1, -4*w, -w);
	xCoord[3] = x1 + newX(x2-x1, y2-y1, 0, -w);
	
	yCoord[0] = y1 + newY(x2-x1, y2-y1, 0, w);
	yCoord[1] = y2 + newY(x2-x1, y2-y1, -4*w, w);
	yCoord[2] = y2 + newY(x2-x1, y2-y1, -4*w, -w);
	yCoord[3] = y1 + newY(x2-x1, y2-y1, 0, -w);
	
	drawPolygonBasedObject(objectId, lineType, xCoord, yCoord, z, w, colorFill, perfdataA, perfdataB, colorBorder, bLinkArea);
	
	yCoord = null;
	xCoord = null;
}

// This function is being called by NagVis for drawing the lines
function drawNagVisLine(objectId, type, x1, y1, x2, y2, z, width, colorFill, colorFill2, perfdata, colorBorder, bLinkArea) {
	// Ensure format
	x1 = parseInt(x1, 10);
	x2 = parseInt(x2, 10);
	y1 = parseInt(y1, 10);
	y2 = parseInt(y2, 10);
	width = parseInt(width, 10);
	var perfdataA = null;
	var perfdataB = null;
	
	switch (type) {
		case '10':
			// ---><--- lines
			var xMid = middle(x1,x2);
			var yMid = middle(y1,y2);

			drawArrow(objectId, type, x1, y1, xMid, yMid, z, width, colorFill, perfdataA, perfdataB, colorBorder, bLinkArea);
			drawArrow(objectId, type, x2, y2, xMid, yMid, z, width, colorFill, perfdataA, perfdataB, colorBorder, bLinkArea);
			break;
		case '11':
			// ---> lines
			drawArrow(objectId, type, x1, y1, x2, y2, z, width, colorFill, perfdataA, perfdataB, colorBorder, bLinkArea);
			break;
		case '12':
			// --- lines
			drawSimpleLine(objectId, type, x1, y1, x2, y2, z, width, colorFill, perfdataA, perfdataB, colorBorder, bLinkArea);
			break;
		case '13':
	                // -%-><-%- lines
	                var xMid = middle(x1,x2);
	                var yMid = middle(y1,y2);
			perfdataA = perfdata[0][1] + perfdata[0][2];

        	        drawArrow(objectId, type, x1, y1, xMid, yMid, z, width, colorFill, perfdataA, perfdataB, colorBorder, bLinkArea);
			perfdataA = perfdata[1][1] + perfdata[1][2];
        	        drawArrow(objectId, type, x2, y2, xMid, yMid, z, width, colorFill2, perfdataA, perfdataB, colorBorder, bLinkArea);
			break;
		case '14':
	                // -%+BW-><-%+BW- lines
	                var xMid = middle(x1,x2);
	                var yMid = middle(y1,y2);
			perfdataA = perfdata[0][1] + perfdata[0][2];
			perfdataB = perfdata[2][1] + ' ' + perfdata[2][2];

        	        drawArrow(objectId, type, x1, y1, xMid, yMid, z, width, colorFill, perfdataA, perfdataB, colorBorder, bLinkArea);
			perfdataA = perfdata[1][1] + perfdata[1][2];
			perfdataB = perfdata[3][1] + ' ' + perfdata[3][2];
        	        drawArrow(objectId, type, x2, y2, xMid, yMid, z, width, colorFill2, perfdataA, perfdataB, colorBorder, bLinkArea);
			break;
		default:
			// FIXME: Error handling
			alert('Error: Unknown line type');
	}
}

/*
 * Split perfdata into mutlidimensional array
 *      Each 1st dimension is a set of perfdata such as 'inUsage=19.34%;85;98')
 *      The 2nd dimension is each set broken apart (label, value, uom, etc.)
 *
 * Inspired by parsePerfdata function by Lars Michelsen which was
 * adapted from PNP process_perfdata.pl.  Thanks to Jörg Linge..
 * The function was originally taken from Nagios::Plugin::Performance
 * Thanks to Gavin Carr and Ton Voon
 *
 * @param       String  raw perfdata like 'inUsage=19.34%;85;98 outUsage=0.89%;85;98 inAbsolut=3362060 outAbsolut=14884975'
 * @return      Multi dimensional array of indexed perfdata
 * @author      Greg Frater <greg@fraterfactory.com>
 *
 */
function splicePerfdata(nagiosPerfdata) {
        var oMsg = {};
        var setMatches = [];

        // Check if we got any perfdata
        if(nagiosPerfdata == '') {

                // No perfdata
                return 'empty';

        } else {

                // Clean up perfdata
                nagiosPerfdata = nagiosPerfdata.replace('/\s*=\s*/', '=');

                // Break perfdata string into array of individual sets
                var re = /([^=]+)=([\d\.\-]+)([\w%]*);?([\d\.\-:~@]+)?;?([\d\.\-:~@]+)?;?([\d\.\-]+)?;?([\d\.\-]+)?\s*/g;
                var perfdataMatches = nagiosPerfdata.match(re);

                // Check for empty perfdata
                if(perfdataMatches == null) {

                        oMsg.type = 'WARNING';
                        oMsg.message = 'No performance data found in perfdata string - lines.js (271)';
                        oMsg.title = "Data error";
                        frontendMessage(oMsg);

                } else {

                        // Break perfdata parts into array
                        for (var i = 0; i < perfdataMatches.length; i++) {
                                var tmpMatches = perfdataMatches[i];
                                var tmpSetMatches = [];

                                // Get parts of perfdata from string
                                tmpSetMatches = tmpMatches.match(/(&#145;)?([\w\s\=\']*)(&#145;)?\=([\d\.\-\+]*)([\w%]*)[\;|\s]?([\d\.\-:~@]+)*[\;|\s]?([\d\.\-:~@]+)*[\;|\s]?([\d\.\-\+]*)[\;|\s]?([\d\.\-\+]*)/);

                                // Check if we got any perfdata
                                if(tmpSetMatches !== null) {

                                        setMatches[i] = new Array(7);
                                        // Label
                                        setMatches[i][0] = tmpSetMatches[2];
                                        // Value
                                        setMatches[i][1] = tmpSetMatches[4];
                                        // UOM
                                        setMatches[i][2] = tmpSetMatches[5];
                                        // Warn
                                        setMatches[i][3] = tmpSetMatches[6];
                                        // Crit
                                        setMatches[i][4] = tmpSetMatches[7];
                                        // Min
                                        setMatches[i][5] = tmpSetMatches[8];
                                        // Max
                                        setMatches[i][6] = tmpSetMatches[9];

                                } else {

                                        oMsg.type = 'WARNING';
                                        oMsg.message = 'No valid performance data in perfdata string - lines.js (305)';
                                        oMsg.title = "Data error";
                                        frontendMessage(oMsg);
                                }
                        }
                        return setMatches;
                }
		oMsg = null;
        }
}

 /**
 * Sets fill color for bandwidth based lines
 *
 * @param       Number  Percent value
 * @return      String  Hex value for fill color
 * @author      Greg Frater <greg@fraterfactory.com>
 *
 */
function getColorFill(percent) {
        // set color based on percent level

        var percent;
        var color = '';

        eventlog("test", "debug", "Percent:" + percent);
        if(percent >= 0 && percent <= 10) {
                // purple
                return '#8c00ff';
        } else if (percent > 10 && percent <= 25) {
                // blue
                return '#2020ff';
        } else if (percent > 25 && percent <= 40) {
                // light blue
                return '#00c0ff';
        } else if (percent > 40 && percent <= 55) {
                // green
                return '#00f000';
        } else if (percent > 55 && percent <= 70) {
                // yellow
                return '#f0f000';
        } else if (percent > 70 && percent <= 85) {
                // orange
                return '#ffc000';
        } else if (percent > 85 && percent <= 100) {
                // red
                return '#ffc000';
        } else {
                return '#000000';
        }
}
