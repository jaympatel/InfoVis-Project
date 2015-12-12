var data = null;
d3.csv("../data/7cd6edef-0b8c-4f6c-95ac-7b4e799c54a4.csv", function(result){
    dataLoaded(result);
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
     
        var canvas=d3.select('body').select('#behaviour-chart')
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

    
}



              



