var data = null, list=[];;
var width=300, height=200;
var list_map=[];
var active_api=null;
var th=null;
var behaviorcanvas;
var minTime=0;
var maxTime =0;

d3.csv("/data/7cd6edef-0b8c-4f6c-95ac-7b4e799c54a4.csv", function(result){
    dataLoaded(result);
});

function initiateSlider(minTime, maxTime){
    d3.select('#time-slider').call(d3.slider().axis(true).value([minTime, maxTime]).min(minTime).max(maxTime).on("slideend", function(evt, value) {
      listdatacollector(value[0],value[1]);
      updatelist_data();
      minTime = parseInt(value[ 0 ]);
      maxTime = parseInt(value[ 1 ]);
      var temp = getDataForTimeFrame(minTime, maxTime);
      generateThreadGraph([temp],minTime,maxTime);
      behaviorslider(value[ 0 ],value[ 1 ]);

    }));
}

function getDataForTimeFrame(minTime, maxTime){
    var temp = data.slice();
    temp = temp.filter(function(d){
        return d.instr>minTime && d.instr<maxTime;
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
	
    // console.log(getUniqueValues("call_name"));
    // console.log(getUniqueValues("pid"));
    // console.log(getUniqueValues("pid").length);
    // console.log(getUniqueValues("pname"));
    // console.log(getUniqueValues("pname").length);
    // console.log(getClassName("new_pid"));

    var minTime = d3.min(data, function(d) { return d.instr; });
    var maxTime = d3.max(data, function(d) { return d.instr; });
    initiateSlider(minTime, maxTime);
    listdatacollector(minTime, maxTime);
    initializelist();
    generateBehaviourGraph();
    var temp = data.slice();
    generateThreadGraph([temp],minTime,maxTime);
	
    // console.log(getUniqueValues("call_name"));
    // console.log(getUniqueValues("pid"));
    // console.log(getUniqueValues("pid").length);
    // console.log(getUniqueValues("pname"));
    // console.log(getUniqueValues("pname").length);
    // console.log(getClassName("new_pid"));

}

function bartobehavior(keyword){
	//console.log('file');
	d3.select('#behaviour-chart').selectAll('*').remove();
    console.log(keyword)
	BarToBehaviourGraph(keyword);
	// behaviorcanvas.selectAll('rect')
	// .attr('class',function(){
	// 	console.log(this.class);
	// 	if(this.class != 'file' ){
	// 		return 'gray-color';
	// 	}
	// 	else
	// 	{
	// 		return this.class;
	// 	}
	// });
}

function BarToBehaviourGraph(keyword){

	dataLength = data.length;
    var noOfCallPerLine = 400;
    noOfLines = dataLength/noOfCallPerLine;

        
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
                    if(d.id < minTime || d.id > maxTime)
                    {
                        return 'gray-color';
                    }
                    else
                    {
                        if(d.call_category != keyword){
                            return 'gray-color';
                        }
                        else{
                            return d.call_category;
                        }
                    }
                	
                });
            });
        }
}

function behaviorslider(low,high)
{
	behaviorcanvas.selectAll('rect')
	.style('fill',function(){
		if(this.id < low || this.id > high){
			return 'black';
		}
	});
}
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

function generateBehaviourGraph(){

    dataLength = data.length;
    var noOfCallPerLine = 400;
    noOfLines = dataLength/noOfCallPerLine;
    data.sort(function(a, b) { return a.instr - b.instr });
     
        behaviorcanvas=d3.select('#behaviour-chart')
        .attr('height',(noOfLines+1)*20)
        .attr('width',700);
        
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
                .attr('class',getClassName(d.call_name));
            });
        }
}

//To add selection of bar to map
function mapadd(){
	
	if(active_api==null)							// to check if the data is already selected
		active_api=th.id;						
	else{

		if((active_api).indexOf(th.id)==-1){

			active_api=active_api.concat(th.id);
			console.log("added "+active_api);
		}
	}	
}

//To remove selection of bar to map
function mapremove(){
	

}
// To parse data for the list
function listdatacollector(min,max){
	
	console.log("min "+min+" max:"+max);
	var list_data=data.filter(function(d){
		
		return (d.instr<=max && d.instr>=min);
	});
	// list_data=list_data.filter(function(d){
		
	// 	return d.pname == "bbc03a5638e801";
	// });
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
	initializelist();		
}

// To initialize the SVG for bar graph data
function initializelist(){
	
	list = ["Process","File","Registry","Memory Section","Virtual Memory","IPC"];
	var canvas = d3.select("#bar-chart")
				.attr("width", width)
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

						if(list[i]=="Process")
							return "process";
						if(list[i]=="File")
							return "file";
						if(list[i]=="Registry")
							return "registry";
						if(list[i]=="Memory Section")
							return "memory-section";
						if(list[i]=="Virtual Memory")
							return "virtual-memory";
						if(list[i]=="IPC")
							return "ipc";
					})
					.attr("id",function(d,i){ return list[i];})
					.on("mouseover",function(d){
						
						d3.select(this).attr("fill","blue");
						d3.select("#tooltip").select("#count").text("No. of Calls: "+d);
						d3.select("#tooltip").style({
                            
                            'display': 'block',
                            'top': d3.event.y + 10,
                            'left': d3.event.x + 10
                        });
					})
                    .on("click", function(d){

                        th=this;
                        console.log("hello"+th.id);
                        bartobehavior(th.id)
                    })
					.on("mouseout",function(d){
						
						d3.select(this).attr("fill","red");
						d3.select("#tooltip").style({
                            
                            'display': 'none'
                        });
					})
					.on("contextmenu",function(d){
						
						d3.event.preventDefault();
						th=this;
						d3.select(this).style("opacity",0.5);
						mapremove();
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
