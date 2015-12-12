var data = null;
var list_map=[];
d3.csv("/data/7cd6edef-0b8c-4f6c-95ac-7b4e799c54a4.csv", function(result){
    dataLoaded(result);
	initializelist();
});

function dataLoaded(result)
{
    data = result.map(function(d){
        return {
            instr: d.instr,
            call_name: d.call_name,
            pid: d.pid,
            pname: d.pname
        }
    });

    // var slidercanvas=d3.select('body').select('#thread-graph').attr('height',10)
    //     .attr('width',50);
        // var a=d3.slider();
        // slidercanvas.append(a);
    datalength=data.length;
    noofrectangles=datalength/200;
     data.sort(function(a, b) { return a.instr - b.instr });
     
        var canvas=d3.select('#behaviour-chart')
        .attr('height',noofrectangles*20)
        .attr('width',250);
        
        for(j=0;j<noofrectangles;j++)
        {
            newdata=data.slice(j*200,j*200+199);
      
            newdata.forEach(function(d,i){
            canvas.append('rect')
                .attr('y',j*20)
                .attr('x',i)
                .attr('width',1)
                .attr('height','15px')
                .style('fill',function(){
                    if(d.call_name=='new_pid')
                    {
                        return 'red';
                    }
                    else
                    {
                        return 'blue';
                    }
                });
            });
        }

    

	
    listdatacollector();
	
    // console.log(getUniqueValues("call_name"));
    // console.log(getUniqueValues("pid"));
    // console.log(getUniqueValues("pid").length);
    // console.log(getUniqueValues("pname"));
    // console.log(getUniqueValues("pname").length);
    // console.log(getClassName("new_pid"));

}

// To parse data for the list
function listdatacollector(){
	
	var list_data=data.filter(function(d){
		
		return d.pname == "bbc03a5638e801";
	});
	var pdata=list_data.filter(function(d){
		
		return (d.call_name=="new_pid"||d.call_name=="nt_create_user_process"||d.call_name=="nt_terminate_process");
	});
    console.log(pdata);
	var count = 0;
	for (var k in pdata) {
		if (pdata.hasOwnProperty(k)) {
			++count;
		}
	}
	list_map[0]=count;
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

// To initialize the SVG data
function initializelist(){
	
	var list = ["process","file","registry","section","memory","port"];
	var width=300, height=200;
	var canvas = d3.select("#bar-chart")
				.attr("width", width)
				.attr("height", height)
				.append("g")
				.attr("transform","translate(48,20)");

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
						
						return lscaleX(d); })
					.attr("height", 19)
					.attr("y", function(d,i){ return i*20; })
					.attr("fill", "red")
					.on("mouseover",function(d){
						
						d3.select(this).attr("fill","blue");
						d3.select("#tooltip").select("#count").text("No. of Calls: "+d);
						d3.select("#tooltip").style({
                            
                            'display': 'block',
                            'top': d3.event.y + 10,
                            'left': d3.event.x + 10
                        });
					})
					.on("mouseout",function(d){
						
						d3.select(this).attr("fill","red");
						d3.select("#tooltip").style({
                            
                            'display': 'none'
                        });
					});
					
	canvas.selectAll("text")
				.data(list_map)
				.enter()
					.append("text")
					.attr("y", function(d,i){ return i*20+10;})
					.attr("x", function(d,i){ return -40;})
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
      return "Process";
    }
    else if(file.indexOf(data)!=-1){
      return "File";
    }
    else if(registry.indexOf(data)!=-1){
      return "Registry";
    }
    else if(virtual.indexOf(data)!=-1){
      return "Virtual Memory";
    }
    else if(ipc.indexOf(data)!=-1){
      return "IPC";
    }
    else if(memSection.indexOf(data)!=-1){
      return "Memory Section";
    }
}
