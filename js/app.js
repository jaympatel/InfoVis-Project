var data = null, list=[];
var width=300, height=200;
var list_map=[];
var active_api=["process", "file", "registry", "memory-section", "virtual-memory", "ipc"];
var th=null;
var minTime=0;
var maxTime =0;
var maxTemp=0;
var minTemp=0;
var behaviorcanvas=null;
var dataLength = null;
var noOfCallPerLine = 1220;
var noOfLines = null;

d3.csv("../data/7cd6edef-0b8c-4f6c-95ac-7b4e799c54a4.csv", function(result){
    dataLoaded(result);
});

function initiateSlider(minTime, maxTime){
    d3.select('#time-slider').call(d3.slider().axis(true).value([minTime, maxTime]).min(minTime).max(maxTime).on("slideend", function(evt, value) {
      minTime = parseInt(value[ 0 ]);
      maxTime = parseInt(value[ 1 ]);
      minTemp=minTime;
      maxTemp=maxTime;
      listdatacollector(value[0],value[1]);
      updatelist_data();
      var temp = getDataForTimeFrame(minTemp, maxTemp);
      generateThreadGraph([temp],minTemp,maxTemp);
      var rates = getCheckedRadioValue('malware');
      bartobehavior(rates);
    }));
}

function getCheckedRadioValue(name) {
    var elements = document.getElementsByName(name);

    for (var i=0, len=elements.length; i<len; ++i)
        if (elements[i].checked) return elements[i].value;
}
function getDataForTimeFrame(minTime, maxTime){
     console.log("**"+minTime);
      console.log("**"+maxTime);
    var temp = data.slice();
    temp = temp.filter(function(d){
        return d.instr>minTime && d.instr<maxTime && active_api.indexOf(d.call_category)!=-1;
    });
    return temp;
}
function dataLoaded(result)
{
    data = result.map(function(d){
        return {
            instr: parseInt(d.instr),
            call_name: d.call_name,
            pid: d.pid,
            pname: d.pname,
			call_category: getClassName(d.call_name)
        }
    });
	dataLength = data.length;
    noOfLines = dataLength/noOfCallPerLine;

    behaviorcanvas=d3.select('#behaviour-chart')
        .attr('height',(noOfLines+1)*20)
        .attr('width',1215);

    // console.log(getUniqueValues("call_name"));
    // console.log(getUniqueValues("pid"));
    // console.log(getUniqueValues("pid").length);
    // console.log(getUniqueValues("pname"));
    // console.log(getUniqueValues("pname").length);
    // console.log(getClassName("new_pid"));

    maxTime = d3.max(data, function(d) { return d.instr; });
    minTime = d3.min(data, function(d) { return d.instr; });
    minTemp=minTime;
    maxTemp=maxTime;

    initiateSlider(minTime, maxTime);
      var rates = getCheckedRadioValue('malware');
      

    listdatacollector(minTime, maxTime,rates);
    bargraphinitializelist();
      var rates = getCheckedRadioValue('malware');

    bartobehavior(rates);
    var temp = data.slice();
    generateThreadGraph([temp],minTemp,maxTemp);
	
    // console.log(getUniqueValues("call_name"));
    // console.log(getUniqueValues("pid"));
    // console.log(getUniqueValues("pid").length);
    // console.log(getUniqueValues("pname"));
    // console.log(getUniqueValues("pname").length);
    // console.log(getClassName("new_pid"));

}
// onclick radio button Full Data
function selectFullData(){

    // bar chart
    var rates = getCheckedRadioValue('malware');
    listdatacollector(minTime,maxTime,rates);
    updatelist_data();
    //behavoiur graph
    bartobehavior(rates);
    // theread graph
    var temp = getDataForTimeFrame(minTemp,maxTemp);
    generateThreadGraph([temp],minTemp,maxTemp);

}

function selectMalwareData(){

    var rates = getCheckedRadioValue('malware');
    // bar chart
    listdatacollector(minTime,maxTime,rates);
    updatelist_data();
    // behaviour chart
    bartobehavior(rates);
    // theread graph
    var temp = getDataForMalware(minTemp,maxTemp);
    generateThreadGraph([temp],minTemp,maxTemp);
    
}

function getDataForMalware(minTime,maxTime)
{
    var temp = data.slice();
    temp = temp.filter(function(d){
        return d.pname=="bbc03a5638e801" && d.instr>minTime && d.instr<maxTime && active_api.indexOf(d.call_category)!=-1;
    });
    return temp;
}
function bartobehavior(malwareFlag){
	//console.log('file');

	
    // console.log("minTime bartobehavior1="+minTime+" maxTime bartobehavior1="+maxTime);
	d3.select('#behaviour-chart').selectAll('*').remove();
    // console.log("minTime bartobehavior2="+minTime+" maxTime bartobehavior2="+maxTime);
	BarToBehaviourGraph(malwareFlag);
	// behaviorcanvas.selectAll('rect')
	// .attr('class',function(){
	// 	console.log(this.class);
	// 	if(this.class != 'file' ){
	// 		return 'white-color';
	// 	}
	// 	else
	// 	{
	// 		return this.class;
	// 	}
	// });
}

function BarToBehaviourGraph(malwareFlag){


	
    //console.log(keyword);
        // console.log("mintime BarToBehaviourGraph1="+minTime+" maxtime BarToBehaviourGraph1="+maxTime);
        // console.log("mintemp BarToBehaviourGraph1="+minTemp+" maxtemp BarToBehaviourGraph1="+maxTemp);
        console.log("lines:"+noOfLines)
        for(j=0;j<noOfLines;j++)
        {
            newdata=data.slice(j*noOfCallPerLine,Math.min(dataLength,j*noOfCallPerLine+(noOfCallPerLine-1)));
      
            newdata.forEach(function(d,i){
            behaviorcanvas.append('rect')
                .attr('y',j*20)
                .attr('x',i)
                .attr('width',1)
                .attr('height','15px')
                .attr('id',d.instr)
                .attr('class',function(){
                   // console.log("instr="+d.instr+" minTime="+minTime+" maxTime="+maxTime);
                    if(d.instr < minTemp || d.instr > maxTemp)
                    {
                        return 'white-color';
                    }
                    else if(d.pname!="bbc03a5638e801" && malwareFlag=="malware")
                    {
                        return 'white-color';

                    }
                    else
                    {  
                        if(active_api.indexOf(d.call_category)==-1){
                            return 'white-color';
                        }
                        else{
                            return d.call_category;
                        }
                    }
                	
                });
            });
        }
}

// function behaviorslider()
// {
//     if(d.call_category.size()==)
//     {
//             behaviorcanvas.selectAll('rect')
//             .style('fill',function(){
//             if(this.id < minTemp || this.id > maxTemp){
//                 return 'white';
//             }
//         });
//     }
//     else
//     {
//         bartobehavior();
//     }
	
// }
function generateThreadGraph(graphData,minTime,maxTime){
    // graphData = [[{instr: 2560842, call_name: "new_pid"},{instr: 69058869, call_name: "nt_create_key", pid: "1780"}]];
//************************************************************
// Create Margins and Axis and hook our zoom function
//************************************************************
var yLabels = [ "","new_pid","nt_create_user_process","nt_terminate_process","nt_create_file","nt_read_file","nt_write_file","nt_delete_file","nt_create_key", "nt_create_key_transacted", "nt_open_key", "nt_open_key_ex", "nt_open_key_transacted", "nt_open_key_transacted_ex","nt_delete_key","nt_query_key","nt_read_virtual_memory","nt_write_virtual_memory","nt_create_port","nt_connect_port","nt_listen_port","nt_accept_connect_port","nt_complete_connect_port","nt_request_port","nt_request_wait_reply_port","nt_reply_port","nt_reply_wait_reply_port","nt_reply_wait_receive_port","nt_impersonate_client_of_port","nt_create_section","nt_open_section","nt_map_view_of_section"," "];

var margin = {top: 20, right: 30, bottom: 30, left: 170},
    width = 1200 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .domain([minTime, maxTime])
    .range([0, width]);
 
var y = d3.scale.ordinal()
    .domain(yLabels)
    .rangePoints([height, 0]);
    
var xAxis = d3.svg.axis()
    .scale(x)
    .tickSize(-height)
    .tickPadding(10)    
    .tickSubdivide(true)    
    .orient("bottom");  
    
var yAxis = d3.svg.axis()
    .scale(y)
    .tickPadding(10)
    .tickSize(-width)
    .tickSubdivide(true)    
    .orient("left");
      
        
//************************************************************
// Generate our SVG object
//************************************************************  
d3.select("#thread-graph").remove();
var svg = d3.select("#thread-chart-container").append("svg")
    .attr("id","thread-graph")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
 
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);
 
svg.append("g")
    .attr("class", "y axis")
    .append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("y", (-margin.left) + 10)
    .attr("x", -height/2)
    .text('OS Call Name');    
 
svg.append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);
       
//************************************************************
// Create D3 line object and draw data on our SVG object
//************************************************************
var line = d3.svg.line()
    .interpolate("linear")  
    .x(function(d) { return x(d.instr); })
    .y(function(d) { return y(d.call_name); });     
    
svg.selectAll('.line')
    .data(graphData)
    .enter()
    .append("path")
    .attr("class", "line")
    .attr("clip-path", "url(#clip)")
    .attr('stroke', function(d,i){          
        return "steelblue";
    })
    .attr("d", line);    


//************************************************************
// Draw points on SVG object based on the data given
//************************************************************
var points = svg.selectAll('.dots')
    .data(graphData)
    .enter()
    .append("g")
    .attr("class", "dots")
    .attr("clip-path", "url(#clip)");   
 
points.selectAll('.dot')
    .data(function(d, index){       
        var a = [];
        d.forEach(function(point,i){
            a.push({'index': index, 'point': point});
        });     
        return a;
    })
    .enter()
    .append('circle')
    .attr('class','dot')
    .attr("r", 2.5)
    .attr('fill', function(d,i){    
        return "steelblue";
    })  
    .attr("transform", function(d) { 
        return "translate(" + x(d.point.instr) + "," + y(d.point.call_name) + ")"; }
    );
}

//To update which api call is currently active

function AddApiCalltoMap(){
	
    var flag=0;
    flag=active_api.indexOf(th.id);
    if(flag==-1){

        active_api[active_api.length]=th.id;
        var rates = getCheckedRadioValue('malware');
        bartobehavior(rates);
        var selectedCalls = getCallsDataForCallCategory();
        // console.log("min time initializelist2:"+minTime);
        generateThreadGraph([selectedCalls],minTime, maxTime);
    }
    //console.log(active_api);
}

//To remove the selected api calls 

function RemoveApiCallfromMap(){
    
    var flag=active_api.indexOf(th.id);
    if(flag>-1)
    {

        active_api.splice(flag,1);
        var rates = getCheckedRadioValue('malware');
        bartobehavior(rates);
        var selectedCalls = getCallsDataForCallCategory();
        // console.log("min time initializelist2:"+minTime);
        generateThreadGraph([selectedCalls],minTime, maxTime);
    }
}
// To parse data for the list
function listdatacollector(min,max,malwareFlag){
	
	// console.log("min listdatacollector1"+min+" max listdatacollector1:"+max);
	var list_data=data.filter(function(d){
		
		return (d.instr<=max && d.instr>=min);
	});
    if(malwareFlag=="malware")
    {
	list_data=list_data.filter(function(d){
		
		return d.pname == "bbc03a5638e801";
	});
        
    }
	var pdata=list_data.filter(function(d){
		
		return (d.call_name=="new_pid"||d.call_name=="nt_create_user_process"||d.call_name=="nt_terminate_process");
	});
	var count = 0;
	for (var k in pdata) {
		if (pdata.hasOwnProperty(k)) {
			++count;
		}
	}
	list_map[0]=count;
	console.log(count);
	var pdata=list_data.filter(function(d){
		
		return (d.call_name=="nt_create_file"||d.call_name=="nt_read_file"||d.call_name=="nt_write_file"||d.call_name=="nt_delete_file");
	});
	var count = 0;
	for (var k in pdata) {
		if (pdata.hasOwnProperty(k)) {
			++count;
		}
	}
	list_map[1]=count;
	var pdata=list_data.filter(function(d){
		
		return (d.call_name=="nt_create_key"||d.call_name=="nt_create_key_transacted"||d.call_name=="nt_open_key"||d.call_name=="nt_open_key_ex"||d.call_name=="nt_open_key_transacted"||d.call_name=="nt_open_key_transacted_ex"||d.call_name=="nt_delete_key"||d.call_name=="nt_query_key");
	});
	var count = 0;
	for (var k in pdata) {
		if (pdata.hasOwnProperty(k)) {
			++count;
		}
	}
	list_map[2]=count;
	var pdata=list_data.filter(function(d){
		
		return (d.call_name=="nt_create_section"||d.call_name=="nt_open_section"||d.call_name=="nt_map_view_of_section");
	});
	var count = 0;
	for (var k in pdata) {
		if (pdata.hasOwnProperty(k)) {
			++count;
		}
	}
	list_map[3]=count;
	var pdata=list_data.filter(function(d){
		
		return (d.call_name=="nt_read_virtual_memory"||d.call_name=="nt_write_virtual_memory");
	});
	var count = 0;
	for (var k in pdata) {
		if (pdata.hasOwnProperty(k)) {
			++count;
		}
	}
	list_map[4]=count;
	var pdata=list_data.filter(function(d){
		
		return (d.call_name=="nt_create_port"||d.call_name=="nt_connect_port"||d.call_name=="nt_listen_port"||d.call_name=="nt_accept_connect_port"||d.call_name=="nt_complete_connect_port"||d.call_name=="nt_request_port"||d.call_name=="nt_request_wait_reply_port"||d.call_name=="nt_reply_port"||d.call_name=="nt_reply_wait_reply_port"||d.call_name=="nt_reply_wait_receive_port"||d.call_name=="nt_impersonate_client_of_port");
	});
	var count = 0;
	for (var k in pdata) {
		if (pdata.hasOwnProperty(k)) {
			++count;
		}
	}
	list_map[5]=count;
	console.log(list_map);
}

function updatelist_data(){							// to update the bar graphs
													// only need to update the list_map value which is a globle variable
	//list_map[0]-=1000;
	d3.select("#bar-chart").selectAll("*").remove();
	bargraphinitializelist();		
}

// To initialize the SVG for bar graph data
function bargraphinitializelist(){
	
	list = ["Process","File","Registry","Memory Section","Virtual Memory","IPC"];
	var canvas = d3.select("#bar-chart")
				.attr("width", width+50)
				.attr("height", height)
				.append("g")
				.attr("transform","translate(78,20)");

	var lscaleX=d3.scale.linear()
				.range([0,width-50])
				.domain([0,d3.max(list_map,function(d){ return d;})]);

	var hscale = d3.scale.linear()
				.domain([0,120])
				.range([0,120]);
	
	var xaxis=d3.svg.axis()
				.scale(lscaleX)
				.ticks(3)
				.orient("top");
				
	var yaxis=d3.svg.axis()
				.scale(hscale)
				.ticks(0)
				.orient("left");
				
	canvas.selectAll("rect")
				.data(list_map)
				.enter()
					.append("rect")
					.attr("width", function(d) { 
						
						return lscaleX(d); 
					})
					.attr("height", 19)
					.attr("y", function(d,i){ return i*20; })
					.attr("class",function(d, i){

						return getClassNameFromDisplayName(list[i]);
					})
                    .style("opacity", function(d, i){

                        console.log("opacity for"+getClassNameFromDisplayName(list[i]));
                        if(active_api.indexOf(getClassNameFromDisplayName(list[i]))==-1)
                            return 0.5;
                    })
					.attr("id",function(d,i){ return getClassNameFromDisplayName(list[i]);})
					.on("mouseover",function(d){
						
						d3.select("#tooltip").select("#count").text("No. of Calls: "+d);
						d3.select("#tooltip").style({
                            
                            'display': 'block',
                            'top': d3.event.y + 10,
                            'left': d3.event.x + 10
                        });
					})
                    .on("click", function(d){

                        th=this;

                        // console.log(this.id);
                        // console.log("min time initializelist1:"+minTime);

                        d3.select(this).style("opacity",1.0);
                        AddApiCalltoMap();
                        
                        // console.log("min time initializelist3:"+minTime);
                    })
					.on("mouseout",function(d){
						
						d3.select("#tooltip").style({
                            
                            'display': 'none'
                        });
					})
					.on("contextmenu",function(d){
						
						d3.event.preventDefault();
						th=this;
						d3.select(this).style("opacity",0.5);
						RemoveApiCallfromMap();
					});
					
	canvas.selectAll("text")
				.data(list_map)
				.enter()
					.append("text")
					.attr("y", function(d,i){ return i*20+10;})
					.attr("x", function(d,i){ return -75;})
					.attr("font-family", "sans-serif")
					.attr("font-size", "10px")
					.text(function(d, i){ return list[i]; });
					
	canvas.append("g")
				.attr("class", "axis")
				.call(xaxis);
				
	canvas.append("g")
				.attr("transform","translate(-1,0)")
				.attr("class", "axis")
				.call(yaxis);			
}

function getCallsDataForCallCategory(callCategory){
    var temp = data.slice();
    temp = temp.filter(function(d){

        return active_api.indexOf(d.call_category)!=-1 && d.instr>minTime && d.instr<maxTime;
    });
    return temp;
}

function getClassNameFromDisplayName(displayName){
    if(displayName=="Process")
        return "process";
    if(displayName=="File")
        return "file";
    if(displayName=="Registry")
        return "registry";
    if(displayName=="Memory Section")
        return "memory-section";
    if(displayName=="Virtual Memory")
        return "virtual-memory";
    if(displayName=="IPC")
        return "ipc";
}

// Get unique values from the JSON for given variable
function getUniqueValues(variable_name){
    var uniqueValues = [];
    for(i = 0; i< data.length; i++){
        if(uniqueValues.indexOf(data[i][variable_name]) === -1){
            uniqueValues.push(data[i][variable_name]);
        }
    }
    return uniqueValues;
}

// Get parent class from given function call name
function getClassName(data){
    var process = ["new_pid","nt_create_user_process","nt_terminate_process"];
    var file = ["nt_create_file","nt_read_file","nt_write_file","nt_delete_file"];
    var registry = ["nt_create_key", "nt_create_key_transacted", "nt_open_key", "nt_open_key_ex", "nt_open_key_transacted", "nt_open_key_transacted_ex","nt_delete_key","nt_query_key"];
    var virtual = ["nt_read_virtual_memory","nt_write_virtual_memory"];
    var ipc = ["nt_create_port","nt_connect_port","nt_listen_port","nt_accept_connect_port","nt_complete_connect_port","nt_request_port","nt_request_wait_reply_port","nt_reply_port","nt_reply_wait_reply_port","nt_reply_wait_receive_port","nt_impersonate_client_of_port"];
    var memSection = ["nt_create_section","nt_open_section","nt_map_view_of_section"];
    
    if(process.indexOf(data)!=-1){
      return "process";
    }
    else if(file.indexOf(data)!=-1){
      return "file";
    }
    else if(registry.indexOf(data)!=-1){
      return "registry";
    }
    else if(virtual.indexOf(data)!=-1){
      return "virtual-memory";
    }
    else if(ipc.indexOf(data)!=-1){
      return "ipc";
    }
    else if(memSection.indexOf(data)!=-1){
      return "memory-section";
    }


}


// Reset the slider and all graph
function resetGraph(){
    d3.select("#handle-one").style("left","0%");
    d3.select("#handle-two").style("left","100%");
    d3.select(".d3-slider-range").style("left","0%").style("right","0%");
}

