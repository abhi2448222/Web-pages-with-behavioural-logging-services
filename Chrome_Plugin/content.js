document.addEventListener("click", function(e){
	//alert("Clicked "+ e);
    console.log("new Click");
    console.log(e);
    var userBehaviouralData;
    var flag=false;
    
    if(e.srcElement.className === 'question-hyperlink'){
    	console.log("question clicked");
    	 userBehaviouralData  = "Question clicked at : " + new Date(Date.now()) +" link = "+e.currentTarget.activeElement.href ;
    	 flag=true;
    }
    
    else if(e.srcElement.innerHTML === 'up vote'){
    	 console.log("upvoted");
    	 userBehaviouralData  = "Upvoted at : " + new Date(Date.now()) +" link = "+e.srcElement.baseURI ;
    	 flag=true;
    }
    
    else if(e.srcElement.innerHTML === 'down vote'){
    	console.log("downvoted");
    	 userBehaviouralData  = "DownVote at : " + new Date(Date.now()) +" link = "+e.srcElement.baseURI ;
    	 flag=true;
    }
    else if(e.srcElement.className === 'post-tag'){
    	console.log("Tags selected");
    	 userBehaviouralData  = "Tag selected : "+e.currentTarget.activeElement.innerText+": at : " + new Date(Date.now()) +" link = "+e.currentTarget.activeElement.href ;
    	 flag=true;
    }
    else if(e.srcElement.className === 'star-off star-on'){
    	console.log("Bookmarked added");
    	 userBehaviouralData  = "Bookmarked added at : " + new Date(Date.now()) +" link = "+e.currentTarget.activeElement.href ;
    	 flag=true;
    }
    else if(e.srcElement.className === 'star-off'){
    	console.log("Bookmarked removed");
    	 userBehaviouralData  = "Bookmarked removed at : " + new Date(Date.now()) +" link = "+e.currentTarget.activeElement.href ;
    	 flag=true;
    }
    else if(e.srcElement.innerText === 'frequent'){
    	console.log("Sorted list by most frequent");
    	 userBehaviouralData  = "Sorted list by most frequent : " + new Date(Date.now()) +" link = "+e.srcElement.href ;
    	 flag=true;
    }
    else if(e.srcElement.innerText === 'votes'){
    	console.log("Sorted list by most votes");
    	 userBehaviouralData  = "Sorted list by most votes : " + new Date(Date.now()) +" link = "+e.srcElement.href ;
    	 flag=true;
    }
    else if(e.srcElement.innerText === 'unanswered'){
    	console.log("Switched to unanswered questions");
    	 userBehaviouralData  = "Switched to unanswered questions : " + new Date(Date.now()) +" link = "+e.srcElement.href ;
    	 flag=true;
    }
    
    if(flag===true){
    	chrome.runtime.sendMessage({"monitor" : "selection made", "userBehaviouralData" : userBehaviouralData});   
    }
});

