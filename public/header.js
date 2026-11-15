// I didn't want to redo every page's navbar after reorganizing the files, 
// so I decided to fetch it into each page using javascript as extra practice
// and if we have to change it again in the future...

//to eliminate flicker - playing around with different ways to do this - maybe a little faster load
fetch("/header.html")
    .then(function(response){
        return response.text();
    })
    .then(function(html){
        document.getElementById("header-placeholder").innerHTML = html;
    })
    .catch(function(error){
        console.error("Failed to load header:", error);
    });

/* create an eventlistener
document.addEventListener("DOMContentLoaded", function(){
    fetch("/header.html")
        .then(function(response){
            return response.text();
        })
        .then(function(html){
            document.getElementById("header-placeholder").innerHTML = html;
        })
        .catch(function(error){
            console.error("Failed to load header:",error);
        });
});
*/