var CenterX = 0,
    CenterY = 0,
    TopX,
    TopY,
    LeftX,
    LeftY,
    RightX,
    RightY;

var svg, arc, needleG,chartName,ColorsPercent,CurrentLimit;


    var chartHeight,chartWidth;

class GaugeChart{   

    constructor(input) {
        this.ChartColor = input.ChartColor ||"#143759";
        this.innerRadius = input.innerRadius||50;
        this.outerRadius = input.outerRadius||60;
        this.TextColor = input.TextColor||"#000000";
        this.NeedleColor = input.NeedleColor || "black";
        this.margin = { "Left": 0, "Right": 0, "Top": 0, "Bottom": 0 };
        if (input.margin != undefined) {
            this.margin.Left = input.margin.Left || 1;
            this.margin.Right = input.margin.Right || 1;
            this.margin.Top = input.margin.Top || 1;
            this.margin.Bottom = input.margin.Bottom || 1;
        }
        this.NeedleHeight = input.NeedleHeight || this.outerRadius;
        this.NeedleRadius = input.NeedleRadius||3;
        this.valueAsPercent = input.valueAsPercent;
        this.ColorPerPercent = input.ColorPerPercent;
        this.id = input.id;
        this.Limit = input.Limit || 100000;

    }

    CreateGaugeChart() {
        chartHeight = this.outerRadius + (this.margin.Top + this.margin.Bottom) + (this.NeedleRadius*2);
        chartWidth = (this.outerRadius * 2) + (this.margin.Left+this.margin.Right);

        chartName = "Gauge_" + this.id.replace(/\s+/g, "");     

        svg = d3.select("#"+this.id)
            .append("svg")
            .attr("id", chartName)
            .attr("height", chartHeight)
            .attr("width", chartWidth)
            .append("g")
            .attr("transform", "translate(" + (this.margin.Left + this.outerRadius) + "," + (this.margin.Top + this.outerRadius) + ")");

        d3.select("#" + chartName).append("g")
            .attr("transform", "translate(" + (this.margin.Left + this.outerRadius) + "," + (this.margin.Top) + ")");
        arc = d3.svg.arc().innerRadius(this.innerRadius).outerRadius(this.outerRadius).startAngle(Math.PI / 2).endAngle(-Math.PI / 2);

        svg.append("path")
            .attr("d", arc)
            .attr("class", "GaugeArc")
            .attr("fill", this.ChartColor)
            .attr("stroke-width", 1)
            .attr("stroke", this.ChartColor);

        needleG = svg.append("g")
            .attr("tranform", "translate(" + (this.margin.Left + this.outerRadius) + "," + (this.margin.Top + this.outerRadius + this.NeedleRadius) + ")")
            .attr('class', 'needle');

        var thetaRad = percToRad(0) / 2;

        TopX = CenterX - this.NeedleHeight * Math.cos(thetaRad);
        TopY = CenterY - this.NeedleHeight * Math.sin(thetaRad);

        LeftX = CenterX - this.NeedleRadius * Math.cos(thetaRad - Math.PI / 2);
        LeftY = CenterY - this.NeedleRadius * Math.sin(thetaRad - Math.PI / 2);

        RightX = CenterX - this.NeedleRadius * Math.cos(thetaRad + Math.PI / 2);
        RightY = CenterY - this.NeedleRadius * Math.sin(thetaRad + Math.PI / 2);

        needleG.append("path").attr('d', "M " + LeftX + ' ' + LeftY + ' L ' + TopX + ' ' + TopY + ' L ' + RightX + ' ' + RightY);

        needleG.append("circle").attr("r", this.NeedleRadius+2).attr("fill", this.NeedleColor);

        
    }

    updateGaugeChart(percent) {
        var current = this;
        ColorsPercent = this.ColorPerPercent;
        CurrentLimit = this.Limit;
        svg.transition().delay(0).ease('linear').duration(1000).selectAll('.needle').tween('progress', function () {
            return function (percentOfPercent) {
                var progress;
                progress = (percentOfPercent * percent);
                var thetaRad = percToRad(progress) / 2;

                CenterX = 0;
                CenterY = 0;

                TopX = CenterX - current.NeedleHeight * Math.cos(thetaRad);
                TopY = CenterY - current.NeedleHeight * Math.sin(thetaRad);

                LeftX = CenterX - current.NeedleRadius * Math.cos(thetaRad - Math.PI / 2);
                LeftY = CenterY - current.NeedleRadius * Math.sin(thetaRad - Math.PI / 2);

                RightX = CenterX - current.NeedleRadius * Math.cos(thetaRad + Math.PI / 2);
                RightY = CenterY - current.NeedleRadius * Math.sin(thetaRad + Math.PI / 2);
                d3.select("#" + chartName).select('.needle').select("path").attr('d', "M " + LeftX + ' ' + LeftY + ' L ' + TopX + ' ' + TopY + ' L ' + RightX + ' ' + RightY);

                var color = selectColor(progress *100);

                d3.select("#" + chartName).select('.GaugeArc').attr('fill', color).attr("stroke", color );        
              
            };
        });
    }

  
 }


percToDeg = function (perc) {
    return perc * 360;
};

percToRad = function (perc) {
    return degToRad(percToDeg(perc));
};

degToRad = function (deg) {
    return deg * Math.PI / 180;
};


function selectColor(progress) {
    var keys = Object.keys(ColorsPercent);

    for (var i = 0; i < keys.length; i++) {
        if ((parseInt(progress) >= (ColorsPercent[keys[i]].start)) && (parseInt(progress) <= (ColorsPercent[keys[i]].end))) {
            return keys[i];
        }

    }
}