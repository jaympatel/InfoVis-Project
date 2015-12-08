var data = null;
d3.csv("../MalwareVis/data/7cd6edef-0b8c-4f6c-95ac-7b4e799c54a4.csv", function(result){
    dataLoaded(result);
});

function dataLoaded(result){
    // console.log(result.length);

    //converting data to JSON
    data = result.map(function(d){
        return {
            instr: d.instr,
            call_name: d.call_name,
            pid: d.pid,
            pname: d.pname
        }
    });

    
    console.log(getUniqueValues("call_name"));
    console.log(getUniqueValues("pid"));
    console.log(getUniqueValues("pid").length);
    console.log(getUniqueValues("pname"));
    console.log(getUniqueValues("pname").length);
    console.log(getClassName("new_pid"));
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