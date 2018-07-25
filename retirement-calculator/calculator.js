// Copyright 2013 Emerald Connect, Inc. All Rights Reserved
// financial calculator js class written by c wasser
// last updated 03/07/2015 - Anthony Buchanan

// configurations
var sliderNavTimer = [5, 8, 13, 21, 34, 44, 34, 21, 13, 8, 5];
var sliderNavFrames = 10;
var calcWidth = 600;
var fullWidth = 1000;
var fixedHeight = 200;

var hAxisTitle = '';
var vAxisTitle = '';
var hAxisFormat = '#,###';
var vAxisFormat = '#,###';
var chartLeft = null;
var legendPosition = 'right';

var FinancialCalculator = function () {
  this.valid = true;
  this.validate = null;
  this.slider_maxWidth = 400;
  this.currentParams = null;
  this.currentInputElement = null;
  this.knob = null;
  this.knob_x_origin = 0;
  this.mouse_x = 0;
  this.mouse_x_origin = 0;
  this.mouse_diff = 0;
  this.dragging = false;
  this.formula = null;
  this.questions = null;
  this.answers = [];
  this.chartType = '';
  this.chartTitle = '';
  this.chartLabels = [];
  this.chartData = [];
  this.backgrounds = [];
  this.trackMouse = function (event) {
    if (this.dragging) {
      this.mouse_x = event.clientX;
      this.mouse_diff = this.mouse_x - this.mouse_x_origin;
      this.moveKnob(this.mouse_diff);
    }
  };
  this.moveKnob = function (x) {
    if (this.knob) {
      if (typeof this.knob.style.left != 'undefined' && this.knob.style.left != '') {
        if (this.knob_x_origin == 0) {
          var _lstr = this.knob.style.left;
          _lstr = _lstr.replace(/ /g, '') == '' ? 0 : _lstr;
          var _lnum = Number(_lstr.replace(/\D/g, ''));
          _lnum = _lstr.match('%') ? (_lnum / 100) * this.slider_maxWidth : _lnum;
          this.knob_x_origin = _lnum <= 0 ? 1 : _lnum;
        }
        x = this.knob_x_origin + x;
      }
      // keep x in bounds
      x = x > 0 ? x : 0;
      x = x < this.slider_maxWidth ? x : this.slider_maxWidth;
      // set x css-friendly string
      var xStr = x >= 0 ? Math.round(x) + 'px' : '0';
      // move knob, and set level
      this.knob.style.left = xStr;
      this.knob.previousSibling.style.width = xStr;
      this.setQuestionValue(x);
    }
  };
  this.setCurrentElements = function (knob) {
    if (knob) {
      this.knob = knob;
      var id = this.knob.id.split('_')[1];
      var paramsElement = $Gid('params_' + id);
      this.currentParams = paramsElement.innerHTML.split('~');
      this.currentInputElement = $Gid(id);
    }
    else {
      this.knob = null;
      this.knob_x_origin = 0;
      this.currentParams = null;
      this.currentInputElement = null;
    }
  };
  this.getMinMax = function () {
    var arr = [0, 0];
    if (this.currentParams) {
      var min = Number(this.currentParams[1]) || 0;
      var max = Number(this.currentParams[2]) || 0;
      // if segments are specific
      if (min == 0 && max == 0) {
        var lArr = this.currentParams[4];
        if (lArr != null) {
          lArr = lArr.split(',');
          min = Number(lArr[0]);
          max = Number(lArr[lArr.length - 1]);
        }
      }
      arr[0] = min;
      arr[1] = max;
    }
    return arr;
  };
  this.setQuestionValue = function (x) {
    if (this.currentParams) {
      var min = this.getMinMax()[0];
      var max = this.getMinMax()[1];
      var d = max - min;
      var mult = x / this.slider_maxWidth;
      var val = Math.ceil(d * mult);
      this.currentInputElement.value = min + val;
      var _slider = $Gid('slider_' + this.currentInputElement.id);
      if (_slider) {
        _slider.setAttribute('aria-valuenow', val);
      }
    }
  };
  this.setSliderValue = function (val, knob) {
    this.setCurrentElements(knob);
    var min = this.getMinMax()[0];
    var max = this.getMinMax()[1];
    // get % based on selected value's
    // distance from minimum, divided by the given range
    var x = Math.round(100 * ((val - min) / (max - min)));
    var xStr = x >= 0 ? Math.round(x) + '%' : '0%';
    // move knob, and set level
    this.knob.style.left = xStr;
    this.knob.previousSibling.style.width = xStr;
    this.currentInputElement.value = val;
    var _slider = $Gid('slider_' + this.currentInputElement.id);
    if (_slider) {
      _slider.setAttribute('aria-valuenow', val);
    }
  };
  this.setSliderControls = function () {
    var spans = $Gtag('span');
    for (var ii = 0; ii < spans.length; ii++) {
      var element = spans[ii];
      if (element.className == 'segment') {
        element.onclick = function () {
          var _mult = 1;
          if (this.innerHTML.match('m')) {
            _mult = 1000000;
          }
          else if (this.innerHTML.match('k')) {
            _mult = 1000;
          }
          var val = Number(this.innerHTML.replace(/[^0-9.]/g, '')) * _mult;
          var knob = $Gid('knob_' + this.id.split('_')[1]);
          calc.setSliderValue(val, knob);
        }
      }
      if (element.className.match('knob')) {
        var calc = this; // bind
        try {
          // non-ie
          element.addEventListener('mousedown', function (event) {
            calc.setCurrentElements(this);
            calc.mouse_x_origin = event.clientX;
            calc.dragging = true;
          }, false);
        }
        catch (error) {
          // ie < ie9
          element.onmousedown = function () {
            calc.setCurrentElements(this);
            calc.mouse_x_origin = event.clientX;
            calc.dragging = true;
          }
        }
      }
    }
    try {
      this.slider_maxWidth = $Gclass('slider')[0].offsetWidth;
    }
    catch (ex) {
      this.slider_max_width = 500;
    }
  };
  // draw calculator
  this.draw = function () {
    // loop to build questions
    for (var ii = 0; ii < this.questions.length; ii++) {
      var control = '';
      var _q = this.questions[ii];
      maxQuestionPages = maxQuestionPages < _q.page ? _q.page : maxQuestionPages;
      var params = '' + _q.defaultValue + '~' + _q.min + '~' + _q.max + '~' + _q.segments + '~' + _q.labelArray + '~' + _q.page;
      var seg = '';
      var limit = _q.labelArray ? _q.labelArray.length : _q.segments + 1;
      var width = 0;
      var segmentWidthArr = [];
      var buildSlider = function (_p) {
        if (_q.labelArray) {
          // for explicitly declared label values
          // create an array of mix-matced exact widths
          var arr = _q.labelArray;
          var arrLen = arr.length;
          var arrValueRange = arr[arrLen - 1] - arr[0];
          var totalWidthOfSegments = 0;
          if (arrValueRange > 0) {
            // loop to get the widths
            for (var kk = 0; kk < arrLen - 1; kk++) {
              var segmentPercentDecimalVal = 0;
              var segmentWidth = 0;
              segmentPercentDecimalVal = Math.round(Number(Number(arr[kk + 1] - arr[kk]) / arrValueRange) * 100) / 100;
              segmentWidth = Math.round(segmentPercentDecimalVal * 100);
              // split the first
              if (kk == 0) {
                segmentWidth = segmentWidth / 2;
              }
              // middle segments are full width
              segmentWidthArr.push(segmentWidth);
              // add the last
              if (kk == arrLen - 2) {
                segmentWidthArr.push(segmentWidth / 2);
              }
              totalWidthOfSegments = totalWidthOfSegments + segmentWidth;
            }
          }
          // guarantee the last width doesn't push the total past maximum
          if (totalWidthOfSegments > _p.slider_maxWidth) {
            segmentWidthArr[segmentWidthArr.length - 1] = segmentWidthArr[segmentWidthArr.length - 1] - Number(totalWidthOfSegments - this.slider_maxWidth);
          }
        }
        // loop to build the slider label segments
        for (var jj = 0; jj < limit; jj++) {
          var value = 0;
          var _w = 0;
          if (_q.labelArray) {
            // use the array of mix-matched widths
            value = _q.labelArray[jj];
            title = ' title="' + value + '"';
            value = value >= 1000000 ? (value / 1000000) + 'm' : value >= 1000 ? (value / 1000) + 'k' : value;
            switch (jj) {
              case 0:
                _w = segmentWidthArr[jj];
                width = width + _w;
                seg += '<span ' + title + ' aria-controls="knob_' + _q.name + '" class="segment" id="segment_' + _q.name + '_' + jj + '" style="background-position:0% 0%; text-align:left; width:' + _w + '%;">' + value + '</span>';
                break;
              case limit - 1:
                _w = 100 - width;
                width = width + _w;
                seg += '<span ' + title + ' aria-controls="knob_' + _q.name + '" class="segment" id="segment_' + _q.name + '_' + jj + '" style="background-position:100% 0%; text-align:right; width:' + _w + '%;">' + value + '</span>';
                break;
              default:
                _w = segmentWidthArr[jj];
                width = width + _w;
                seg += '<span ' + title + ' aria-controls="knob_' + _q.name + '" class="segment" id="segment_' + _q.name + '_' + jj + '" style="width:' + _w + '%;">' + value + '</span>';
                break;
            }
          }
          else if (_q.segments) {
            value = Math.round((jj * ((_q.max - _q.min) / _q.segments)) + _q.min);
            title = ' title="' + value + '"';
            value = value >= 1000000 ? (value / 1000000) + 'm' : value >= 1000 ? (value / 1000) + 'k' : value;
            switch (jj) {
              case 0:
                _w = Math.round((100 / (_q.segments)) / 2);
                width = width + _w;
                seg += '<span ' + title + ' aria-controls="knob_' + _q.name + '" class="segment" id="segment_' + _q.name + '_' + jj + '" style="background-position:0% 0%; text-align:left; width:' + _w + '%;">' + value + '</span>';
                break;
              case limit - 1:
                _w = 100 - width;
                width = width + _w;
                seg += '<span ' + title + ' aria-controls="knob_' + _q.name + '" class="segment" id="segment_' + _q.name + '_' + jj + '" style="background-position:100% 0%; text-align:right; width:' + _w + '%;">' + value + '</span>';
                break;
              default:
                _w = Math.round(100 / (_q.segments));
                width = width + _w;
                seg += '<span ' + title + ' aria-controls="knob_' + _q.name + '" class="segment" id="segment_' + _q.name + '_' + jj + '" style="width:' + _w + '%;">' + value + '</span>';
                break;
            }
          }
        }
        control = '<div class="question">' +
          '<label for="' + _q.name + '">' + _q.text + '</label>' +
          '<div>' +
            '<span role="slider" aria-controls="' + _q.name + '" aria-valuemin="' + _q.min + '" aria-valuemax="' + _q.max + '" aria-valuenow="' + _q.defaultValue + '" class="slider" id="slider_' + _q.name + '">' +
              '<span class="level" id="level_' + _q.name + '"></span>' +
              '<span class="knob" id="knob_' + _q.name + '"></span>' +
              '<span class="segments" id="segments_' + _q.name + '">' + seg + '</span>' +
              '<span class="params" id="params_' + _q.name + '" style="display:none;">' + params + '</span>' +
            '</span>' +
            '<input id="' + _q.name + '" type="text" value="' + _q.defaultValue + '" />' +
          '</div>' +
        '</div>';
      };
      var buildRadio = function (labels, values) {
        control = '<div class="question radio"><fieldset><legend class="question_text">' + _q.text + '</legend><input type="hidden" id="' + _q.name + '" value="' + _q.defaultValue + '" /><ul>';
        for (var _i = 0; _i < labels.length; _i++) {
          var checked = _q.defaultValue == values[_i] ? 'checked="checked"' : '';
          control += '<li><input onchange="$SparentValue(this);" name="' + _q.name + '" id="' + _q.name + '_' + _i + '" type="radio" value="' + values[_i] + '" ' + checked + ' />' +
          '<label for="' + _q.name + '_' + _i + '">' + labels[_i] + '</label></li>';
        }
        control += '</ul></fieldset></div>';
      };
      // choose which type of control to build
      if (_q.labelArray) {
        if (typeof _q.labelArray.type == 'string') {
          // labelArray is not an array
          // it is an object with properties:
          // type, labels, values
          switch (_q.labelArray.type) {
            case 'radio':
              buildRadio(_q.labelArray.labels, _q.labelArray.values);
              break;
          }
        }
        else {
          // labelArray is array
          buildSlider(this);
        }
      }
      else {
        // labelArray is null
        buildSlider(this);
      }
      // add questions to page
      $Gid('pg_' + _q.page).innerHTML = $Gid('pg_' + _q.page).innerHTML + control;
    }
    // prepopulate with defaults
    var spans = $Gtag('span');
    for (var ll = 0; ll < spans.length; ll++) {
      var element = spans[ll];
      if (element.className.match('knob')) {
        this.setCurrentElements(element);
        this.setSliderValue(this.currentParams[0], element);
        this.setCurrentElements();
      }
    }
    // set button initial states
    activateButtons();
  };
  // calculate answers based on formula
  this.calculate = function () {
    // lowercase are used for function vars
    var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z;
    // uppercase are used for solution vars
    var A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z;
    for (var ii = 0; ii < this.questions.length; ii++) {
      var qq = this.questions[ii];
      eval(qq.name + '=' + $Gid(qq.name).value + ';');
    }
    if (Calculator.validate()) {
      // Formula is used for calculation
      eval(this.formula);
      // answer values are populated from
      // answer variables in calculation results
      for (var jj = 0; jj < this.answers.length; jj++) {
        var id = '';
        var value = '';
        switch (this.answers[jj].substr(0, 1)) {
          case '$':
            id = this.answers[jj].replace('$', '');
            value = formatDollars(eval(id));
            break;
          case '%':
            id = this.answers[jj].replace('%', '');
            value = formatPercentage(eval(id));
            break;
          case 'Y':
            id = this.answers[jj].replace('Y', '');
            value = formatYears(eval(id));
            break;
          case '^':
            // ^ = string
            id = this.answers[jj].replace('^', '');
            value = eval(id);
            break;
          default:
            id = this.answers[jj];
            value = formatNumber(eval(id));
            break;
        }
        // add the value to the corresponding html element
        try {
          $Gid(id).innerHTML = value;
        }
        catch (error) {
          alert('missing element with id = ' + id);
        }
      }
      // show the results
      if (this.valid) {
        next();
      }
      // google chart
      var drawChart = function (calc) {
        // Create the data table.
        // Set chart options
        // Instantiate and draw our chart, passing in some options.
        var chart = null;
        var options = null;
        var data = new google.visualization.DataTable();
        var hAxis = { format: hAxisFormat, title: hAxisTitle, textPosition: 'out' };
        var vAxis = { format: vAxisFormat, title: vAxisTitle, textPosition: 'out' };
        switch (calc.chartType) {
          case 'pie':
            // pie chart
            // 2 columns (label,value)
            options = { pieSliceText: 'none', chartArea: { left: (chartLeft || 20) }, backgroundColor: { fill: 'transparent' }, is3D: true, title: calc.chartTitle, 'colors': ['#336699', '#339966', '#993366', '#669933', '#996666', '#663333'], width: 500 };
            data.addColumn('string', calc.chartLabels[0]);
            data.addColumn('number', calc.chartLabels[1]);
            // loop through data and add pairs
            for (var kk = 0; kk < calc.chartData.length; kk++) {
              var rowData = calc.chartData[kk];
              eval('data.addRow(["' + rowData[0] + '",' + eval(rowData[1]) + ']);');
            };
            chart = new google.visualization.PieChart($Gid('chart_div'));
            break;
          case 'column':
            // column chart
            // 2 columns (label,value)
            options = { chartArea: { width: 250, left: (chartLeft || 130) }, legend: { position: legendPosition }, hAxis: hAxis, vAxis: vAxis, backgroundColor: { fill: '#ffffff' }, is3D: true, title: calc.chartTitle, 'colors': ['#336699', '#ff9900', '#993366', '#669933'], width: 500 };
            // loop through data
            var rowCt = eval(calc.chartData[0]).length;
            var colCt = calc.chartData.length;
            options.legend.position = colCt > 2 ? legendPosition : 'none';
            for (var _l = 0; _l < colCt; _l++) {
              data.addColumn(_l == 0 ? 'string' : 'number', calc.chartLabels[_l]);
            }
            for (var _k = 0; _k < rowCt; _k++) {
              var rowData = [];
              for (_l = 0; _l < colCt; _l++) {
                var cellData = eval(calc.chartData[_l])[_k];
                rowData.push(cellData);
              }
              try {
                data.addRow(rowData);
              }
              catch (e) {
                alert(e);
              }
            }
            chart = new google.visualization.ColumnChart($Gid('chart_div'));
            break;
          default:
            // line chart
            // loop to get chart labels
            options = { chartArea: { width: 250, left: (chartLeft || 130) }, legend: { position: legendPosition }, hAxis: hAxis, vAxis: vAxis, backgroundColor: { fill: '#ffffff' }, 'is3D': true, 'title': calc.chartTitle, 'colors': ['#336699', '#ff9900', '#993366', '#669933'], width: 500 };
            options.legend.position = calc.chartLabels.length > 2 ? legendPosition : 'none';
            for (var hh = 0; hh < calc.chartLabels.length; hh++) {
              data.addColumn('number', calc.chartLabels[hh]);
            };
            // loop to gather data for chart
            var chartDataLength = eval(calc.chartData[0] + '.length');
            for (var kk = 0; kk < chartDataLength; kk++) {
              var addRowStr = '';
              for (var ll = 0; ll < calc.chartData.length; ll++) {
                var varName = calc.chartData[ll];
                var commaSep = ll != calc.chartData.length - 1 ? ',' : '';
                addRowStr = addRowStr + '_' + varName + commaSep;
                eval('var _' + varName + ' = Math.round(Number(' + varName + '[kk]));');
              }
              eval('data.addRow([' + addRowStr + ']);');
            };
            chart = new google.visualization.LineChart($Gid('chart_div'));
            break;
        }
        chart.draw(data, options);
      };
      //  if chart data exists, do the work
      if (this.chartData) {
        if (this.chartData.length > 0) {
          try {
            drawChart(this);
          }
          catch (error) {
            // do nothing
          }
        }
      }
      if (typeof CalcCallback != 'undefined') {
        CalcCallback();
      }
    }
  };
};

var getBody = function () {
	if (~document.querySelector('body').className.indexOf('stripped') || ~document.querySelector('#container').className.indexOf('pg_')) {
		return $Gid('container');
	}
	else {
		  return $Gtag('body')[0];
	}
};

var getPage = function () {
  var bodyElement = getBody();
  var pg = 1;
  var bodyClassList;

  if(bodyElement){
    bodyClassList = bodyElement.className.split(' ');
    for(var i = 0; i < bodyClassList.length; i++){
      if(bodyClassList[i].search(/pg_/) != -1) {
        pg = Number(bodyClassList[i].replace(/[^0-9]/g, ''));
      }
    }
  }

  return pg;
};

// how many pages within a given element
var getMaxPages = function (containingElement) {
  if (containingElement) {
    var divElements = containingElement.getElementsByTagName('div');
    var max = 1;
    for (var ii = 0; ii < divElements.length; ii++) {
      if (divElements[ii].className.match('pg')) {
        try {
          var pgNum = Number(divElements[ii].id.split('pg_')[1].split(' ')[0]);
          if (pgNum) {
            if (pgNum > max) {
              max = pgNum;
            }
          }
        }
        catch (error) {
          // do nothing
        }
      }
    }
    return max;
  }
  else {
    return null;
  }
};

// how many pages of questions?
var maxQuestionPages = 1;

// how many total pages?
var getMaxTotalPages = function () {
  return getMaxPages($Gid('financial_calculator'));
};

var deactivateButtons = function () {
  var buttons = $Gtag('button');
  for (var ii = 0; ii < buttons.length; ii++) {
    if (!buttons[ii].className.match('action_button')) {
      buttons[ii].disabled = 'disabled';
    }
  }
}

var activateButtons = function () {
  var isFirst = getPage() == 1 ? true : false;
  var isLast = false;
  var prevButton = $Gid('prevButton');
  var nextButton = $Gid('nextButton');
  var calcButton = $Gid('calculateButton');
  var qPage = getPage() <= maxQuestionPages;
  var actionButtons = $Gid('action_buttons');

  actionButtons.style.display = 'none';

  if (qPage) {
    isLast = getPage() == maxQuestionPages ? true : false;
  }
  else {
    isLast = getPage() == getMaxTotalPages() ? true : false;
  }

  if (isFirst) {
    prevButton.disabled = 'disabled';
  }
  else {
    prevButton.disabled = false;
  }
  if (isLast) {
    nextButton.disabled = 'disabled';
    if (qPage) {
      calcButton.disabled = false;
      calcButton.style.display = '';
    }
    else {
      actionButtons.style.display = '';
      if (getPage() > maxQuestionPages) {
        calcButton.style.display = 'none';
      }
    }
  }
  else {
    nextButton.disabled = false;
    calcButton.disabled = 'disabled';
    calcButton.style.display = 'none';
  }
}

// animates slide transitions
var slide = function (bodyElement, pg1, pg2, ii) {
  var timerIndex = ii > 0 ? Math.round((ii / calcWidth) * 10) : 0;
  // used for direction(s) and width(s) while animating
  var neg1 = pg1 < pg2 ? '' : '-';
  var neg2 = pg1 < pg2 ? '-' : '';
  // element 1 and 2
  var e1 = $Gid('pg_' + pg1);
  var e2 = $Gid('pg_' + pg2);
  if (!e1) { alert('missing element w/ id = pg_' + pg1); return false; }
  if (!e2) { alert('missing element w/ id = pg_' + pg2); return false; }
  // height 1 and 2
  var h1 = Math.max(e1.clientHeight, fixedHeight);
  var h2 = Math.max(e2.clientHeight, fixedHeight);
  // loop to slide
  if (ii <= 0) {
    // first frame
    // show new slide
    bodyElement.className = bodyElement.className + ' pg_' + String(pg2);
    deactivateButtons();
    e2.style.left = neg1 + calcWidth + 'px';
    setTimeout(function () {
      slide(bodyElement, pg1, pg2, ii + Math.round(calcWidth / sliderNavFrames));
    }, sliderNavTimer[timerIndex]);
  }
  else if (ii < calcWidth) {
    // between first and last frame
    var pos_l = calcWidth - ii;
    var pos_r = ii;
    e2.style.left = neg1 + pos_l + 'px';
    e1.style.left = neg2 + pos_r + 'px';
    setTimeout(function () {
      slide(bodyElement, pg1, pg2, ii + Math.round(calcWidth / sliderNavFrames));
    }, sliderNavTimer[timerIndex]);
    // adjust height
    var diff = h2 - h1;
    var factor = ii / calcWidth;
    var h3 = h1 + (diff * factor);
    $Gid('fixed_height_box').style.height = Math.round(h3) + 'px';
    // fade-out old background
    setTransitionAlpha(Number(factor + .1));
  }
  else {
    // done
    // hide old slide

    bodyElement.className = bodyElement.className.replace('pg_' + String(pg1), '');

    // zero out slider css
    e2.style.left = '';
    e1.style.left = '';
    // set height to new simple height
    $Gid('fixed_height_box').style.height = Math.round(h2) + 'px';
    activateButtons();
    // switch background image
    $Gid('financial_calculator').style.backgroundImage = typeof Calculator.backgrounds[pg2 - 1] != 'undefined' ? 'url(' + Calculator.backgrounds[pg2 - 1] + ')' : 'none';
    // fade-in new background
    showNewBackground(bodyElement, 0);
  }
};

// fade-in/out of background via loop to change alpha of masking element
var setTransitionAlpha = function (alpha) {
  var element = $Gid('transition_mask');
  if (element) {
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
      var alphaClassName = 'alpha' + String(Math.round(Number(alpha) * 10));
      element.className = element.className.replace(/alpha0|alpha1|alpha2|alpha3|alpha4|alpha5|alpha6|alpha7|alpha8|alpha9|alpha10/g, '');
      element.className = element.className + ' ' + alphaClassName;
    }
    else {
      element.style.backgroundColor = 'rgba(255,255,255,' + String(Math.round(alpha * 10) / 10) + ')';
    }
  }
}

// animates background fade-in
var showNewBackground = function (bodyElement, ii) {
  // match timer of "slide" function
  var timerIndex = ii > 0 ? Math.round((ii / calcWidth) * 10) : 0;
  // loop to slide
  if (ii <= 0) {
    setTimeout(function () {
      showNewBackground(bodyElement, ii + Math.round(calcWidth / sliderNavFrames));
    }, sliderNavTimer[timerIndex]);
  }
  else if (ii < calcWidth) {
    // between first and last frame
    var pos_l = calcWidth - ii;
    var pos_r = ii;
    setTimeout(function () {
      showNewBackground(bodyElement, ii + Math.round(calcWidth / sliderNavFrames));
    }, sliderNavTimer[timerIndex]);
    var factor = ii / calcWidth;
    setTransitionAlpha(Number(1 - (factor + .1)));
  }
};

// next slide
var next = function () {
  var bodyElement = getBody();
  if (bodyElement) {
    var pg = getPage();
    var nextPg = pg + 1;
    // animate
    slide(bodyElement, pg, nextPg, 0);
  }
  scrollUp();
};


// previous slide
var prev = function () {
  var bodyElement = getBody();
  if (bodyElement) {
    // var pg = Number(bodyElement.className.replace(/[^0-9]/g, ''));
    var pg = getPage();
    var prevPg = Math.max(1, pg - 1);
    // animate
    slide(bodyElement, pg, prevPg, 0);
  }
  scrollUp();
};

// after sliding align top
var scrollUp = function () {
  var _d1 = window.pageYOffset;
  if (_d1) {
    var _h1 = document.querySelector('h1.calc_title');
    if (_h1) {
      var _t = getTopPosition(_h1);
      if (_t) {
        _t = _t - 5;
        if (_d1 > _t) {
          window.scrollTo(0, _d1 - 10);
          setTimeout(scrollUp, 10);
        }
      }
    }
  }
}

function getTopPosition(element) {
    var yPosition = 0;

    while(element) {
        yPosition += element.offsetTop;
        element = element.offsetParent;
    }

    return yPosition;
}

// format whole number as 00,000,000
var formatCommas = function (wholeNumStr) {
  if (wholeNumStr.length > 3) {
    var wholeNumArr = wholeNumStr.split('');
    wholeNumArr = wholeNumArr.reverse();
    var jj = 0;
    var mx = Math.ceil(wholeNumArr.length / 3) * 3;
    for (var ii = 3; ii < mx; ii = ii + jj + 3) {
      wholeNumArr.splice(ii, 0, ',');
      jj = jj == 0 ? jj + 1 : jj;
    }
    wholeNumArr = wholeNumArr.reverse();
    return wholeNumArr.join('');
  }
  else {
    return wholeNumStr;
  }
};

// format currency as 00,000
var formatDollars = function (num) {
  if (num) {
    num = Math.round(num);
  }
  else {
    num = 0;
  }
  return formatCommas(String(num));
};

// format percentage from 0 - 100
var formatPercentage = function (num) {
  if (num) {
    num = num.toFixed(2);
  }
  else {
    num = 0;
  }
  num = Math.max(num, 0);
  num = Math.min(num, 100);
  var numStr = String(num);
  return numStr;
};

// format number as 1,2,3 etc.
var formatYears = function (num) {
  if (num) {
    num = Math.round(num);
  }
  else {
    num = 0;
  }
  var numStr = String(num);
  return numStr;
};

// format number as 000000.00
var formatNumber = function (num) {
  if (num) {
    num = Math.round(num * 100) / 100;
  }
  else {
    num = 0;
  }
  var numStr = String(num);
  return numStr;
};

var $Gid = function (elementId) {
  return document.getElementById(elementId);
};

var $Gtag = function (tagName) {
  return document.getElementsByTagName(tagName);
};

var $Gclass = function (className) {
  var arr = [];
  var elements = document.getElementsByTagName('body')[0].getElementsByTagName('*');
  for (var _i = 0; _i < elements.length; _i++) {
    if ((' ' + elements[_i].className + ' ').match(' ' + className + ' ')) {
      arr.push(elements[_i]);
    }
  }
  return arr;
};

var $SparentValue = function (_e) {
  if (_e.checked) {
    var id = _e.id.split('_')[0];
    var _p = $Gid(id);
    if (_p) {
      _p.value = _e.value;
    }
  }
};

// empty question class
var Question = function (t, d, n, min, max, s, lArr, pg, val_obj) {
  this.text = t;
  this.page = pg;
  this.name = n;

  var _new = false;

  if (val_obj != null) {
    if (val_obj.defaultvalue != null) {
      _new = true;
    }
    if (val_obj.slidervalues.length > 0) {
      _new = true;
    }
  }

  if (_new) {
    this.defaultValue = val_obj.defaultvalue;
    this.labelArray = val_obj.slidervalues;
    this.min = null;
    this.max = null;
    this.segments = null;
  }
  else {
    this.defaultValue = d;
    this.min = min;
    this.max = max;
    this.segments = s;
    this.labelArray = lArr;
  }
};

// new calculator instance
var Calculator = new FinancialCalculator();

// event handlers
var initCalc = function () {
  Calculator.questions = typeof Questions != 'undefined' ? Questions : null;
  Calculator.formula = typeof Formula != 'undefined' ? Formula : null;
  Calculator.answers = typeof Answers != 'undefined' ? Answers : null;
  Calculator.chartTitle = typeof ChartTitle != 'undefined' ? ChartTitle : '';
  Calculator.chartType = typeof ChartType != 'undefined' ? ChartType : '';
  Calculator.chartLabels = typeof ChartLabels != 'undefined' ? ChartLabels : null;
  Calculator.chartData = typeof ChartData != 'undefined' ? ChartData : null;
  Calculator.backgrounds = [];
  var bgs = $Gid('backgrounds').getElementsByTagName('img');
  for (var _i = 0; _i < bgs.length; _i++) {
    Calculator.backgrounds.push(bgs[_i].src);
  }
  Calculator.validate = typeof Validate != 'undefined' ? Validate : function () { return true; };
  Calculator.draw();
  Calculator.setSliderControls();
  $Gid('financial_calculator').style.backgroundImage = typeof Calculator.backgrounds[0] != 'undefined' ? 'url(' + Calculator.backgrounds[0] + ')' : 'none';
  $Gid('fixed_height_box').style.height = Math.max($Gid('pg_1').clientHeight, fixedHeight) + 'px';
  // non-ie
  if (document.addEventListener) {
    document.addEventListener('mousemove', function (event) { trackMouse(event); }, false);
    document.addEventListener('mouseup', setCalc, false);
    document.addEventListener('keypress', function (event) {
      if (document.activeElement.tagName.toLowerCase() != 'input') {
        code = event.charCode || event.keyCode;
        switch (code) {
          // case 33: // page up
          case 37: // left
            if (!$Gid('prevButton').disabled) {
              prev();
            }
            break;
          // case 34: // page down
          case 39: // right
            if (!$Gid('calculateButton').disabled) {
              Calculator.calculate();
            }
            else if (!$Gid('nextButton').disabled) {
              next();
            }
            break;
        }
      }
    }, false);
  }
  // ie < ie9
  else if ($Gid('financial_calculator').attachEvent) {
    $Gid('financial_calculator').attachEvent("onmousemove", trackMouse);
    $Gid('financial_calculator').attachEvent("onmouseup", setCalc);
  }
};

//Numbers Only and One Decimal
var isNumberKey = function(event) {
	var code = (event.which) ? event.which : event.keyCode;
	var target = event.target ? event.target : event.srcElement;
	var addedKeys = [190,110]
	 if (event.shiftKey && event.keyCode != 9) {
        (event.preventDefault) ? event.preventDefault() : event.returnValue = false;
	} else if ((code > 95 && code < 106) || (code > 7 && code < 58) || (code === 190 || code == 110) || code === 16) {
		if (code === 190 || code == 110) {
			checkForDecimals(target);
		}
		return true;
	} else {
		(event.preventDefault) ? event.preventDefault() : event.returnValue = false;
	}
};

var checkForDecimals = function (elem) {
	var inputval = elem.value;
	var checkFor = /\./g;
	var checkedInput = inputval.replace(/\./,'');
	if (checkFor.test(inputval)) {
		elem.value = checkedInput;
		alert('A number can only contain one decimal');
	} else {
		return true;
	}
};

var addEvent = function(elem,eventType,handler) {
	if (elem.addEventListener) {
		elem.addEventListener(eventType,handler,false);
	} else if (elem.attachEvent) {
		elem.attachEvent('on'+eventType,handler);
	}
};

addEvent($Gid('financial_calculator'),'keydown',isNumberKey);


// mouse move
var trackMouse = function (event) {
  Calculator.trackMouse(event);
};

// mouse up
var setCalc = function () {
  Calculator.dragging = false;
  Calculator.mouse_x = 0;
  Calculator.mouse_x_origin = 0;
  Calculator.setCurrentElements();
};

// load google charts api
if (typeof google != 'undefined') {
  google.load('visualization', '1.0', { 'packages': ['corechart'] });
};

// set event handler for target_blank links
var tbs = $Gclass('target_blank');
for (var _i = 0; _i < tbs.length; _i++) {
  tbs[_i].onclick = function () {
    window.open(this.href);
    return false;
  };
};
