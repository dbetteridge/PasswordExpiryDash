function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = JSON.parse(httpRequest.responseText);
                if (callback) callback(data);
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send(); 
}

// this requests the file and executes a callback with the parsed result once
//   it is available
fetchJSONFile('./expiry.json', function(data) {
    // do something with your data
    var rootNode = document.getElementById('root')
   
    var expirys = [];
    data.map(function(item){
    	expirys.push([item.Name,item.ExpiryDate,item.RemainingDays,item.Photo, item.Username]);    	
    })

    expirys = uniq(expirys);

    document.getElementById("minDaysButton").onclick = function() { displayMinDays(rootNode, expirys)}
    document.getElementById("maxDaysButton").onclick = function() { displayMaxDays(rootNode, expirys)}
    document.getElementById("minNameButton").onclick = function() { displayMinNames(rootNode, expirys)}
    document.getElementById("maxNameButton").onclick = function() { displayMaxNames(rootNode, expirys)}
    document.getElementById("search-box").onkeypress = function(e) { if(e.keyCode === 13){search(rootNode, expirys)}}
    document.getElementById("searchButton").onclick = function() { search(rootNode, expirys )}
    document.getElementById("searchClear").onclick = function() { document.getElementById("search-box").value = ""; displayExpirys(rootNode, expirys) }
    displayExpirys(rootNode, expirys);
    
});


function displayExpirys(rootNode, expirys){
	expirys.map(function(expiry){
    	let newchild = document.createElement("div")
    	newchild.className = "row data";
    	if(expiry[2]>=0){
    	newchild.innerHTML = "<div class='photo col-xs-2 col-md-2'><div class='state'></div><img src=data:image/png;base64,"+expiry[3]+"></div><div class='username col-xs-5 col-sm-2 col-md-2'>"+expiry[4]+"</div><div class='name col-xs-3 col-sm-3 col-md-2 smallhide'>"+expiry[0]+"</div><div class='date col-xs-5 col-sm-3 col-md-3'>"+expiry[1]+"</div><div class='days col-xs-2 smallhide'>"+expiry[2]+"</div>"
    	}
    	else
    	{
    		newchild.innerHTML = "<div class='photo col-xs-2 col-md-2'><div class='state'></div><img src=data:image/png;base64,"+expiry[3]+"></div><div class='username col-xs-5 col-sm-2 col-md-2'>"+expiry[4]+"</div><div class='name col-xs-3 col-sm-3 col-md-2 smallhide'>"+expiry[0]+"</div><div class='date col-xs-5 col-sm-3 col-md-3'>"+expiry[1]+"</div><div class='days col-xs-2 smallhide'>Expired " + -expiry[2]+" days</div>"
    	}
    	rootNode.appendChild( newchild)
    	if(expiry[2]<0){
    		rootNode.lastChild.className += ' black'
    	}else if( expiry[2] < 5 && expiry[2] >= 0){
    		rootNode.lastChild.className += ' red'
    	}else if(expiry[2] >= 5 && expiry[2]< 10){
    		rootNode.lastChild.className += ' orange'
    	}else {
    		rootNode.lastChild.className += ' green'
    	}
    })
}

function minDays(expirys){
	expirys.sort(function(itema, itemb){

		if(itema[2]>itemb[2]){
			return 1
		}
		if(itema[2]< itemb[2]){
			return -1
		}
		return 0
	})
	return expirys
}

function maxDays(expirys){
	expirys.sort(function(itema, itemb){

		if(itema[2]>itemb[2]){
			return -1
		}
		if(itema[2]< itemb[2]){
			return 1
		}
		return 0
	})
	return expirys
}

function emptyNode(rootNode){
	while(rootNode.firstChild){
		rootNode.removeChild(rootNode.firstChild)
	}

}



function displayMinDays(rootNode,expirys) {	
	emptyNode(rootNode);
	
	displayExpirys(rootNode, minDays(expirys));
}

function displayMaxDays(rootNode, expirys) {
	emptyNode(rootNode);
	
	displayExpirys(rootNode, maxDays(expirys));
}


function minNames(expirys){
	expirys.sort(function(itema, itemb){

		if(itema[0].toLowerCase()>itemb[0].toLowerCase()){
			return 1
		}
		if(itema[0].toLowerCase()< itemb[0].toLowerCase()){
			return -1
		}
		return 0
	})
	return expirys
}

function maxNames(expirys){
	expirys.sort(function(itema, itemb){

		if(itema[0].toLowerCase()>itemb[0].toLowerCase()){
			return -1
		}
		if(itema[0].toLowerCase()< itemb[0].toLowerCase()){
			return 1
		}
		return 0
	})
	return expirys
}

function displayMinNames(rootNode,expirys) {	
	emptyNode(rootNode);
	
	displayExpirys(rootNode, minNames(expirys));
}

function displayMaxNames(rootNode, expirys) {
	emptyNode(rootNode);
	
	displayExpirys(rootNode, maxNames(expirys));
}

function search(rootNode, expirys) {
	emptyNode(rootNode);
	

	var searchTerm = new RegExp(document.getElementById("search-box").value.toLowerCase());
	
	var results = expirys.filter(function(item){
		if(item[0].toLowerCase().search(searchTerm) != -1){
			
			return item
		}
	})
	
	displayExpirys(rootNode, results)
}