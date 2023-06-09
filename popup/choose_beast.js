/**
 * CSS to hide everything on the page,
 * except for elements that have the "beastify-image" class.
 */
const hidePage = `body > :not(.beastify-image) {
                    display: none;
                  }`;
console.log("choose...js")



  browser.runtime.onMessage.addListener( (message) => {

    if(message.success)
    {
      document.getElementById("popup-content").innerHTML="found a patch!<pre> "+JSON.stringify(message,true,2)+"</pre>";

    }
    else
    {
      document.getElementById("popup-content").innerHTML="no cables patch found :/";
    }

    // console.log(message)
  });


/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks(a) {


  document.getElementById("popup-content").innerHTML="welcome";

  document.addEventListener("click", (e) => {

    /**
     * Given the name of a beast, get the URL to the corresponding image.
     */
    function beastNameToURL(beastName) {
      switch (beastName) {
        case "Frog":
          return browser.runtime.getURL("beasts/frog.jpg");
        case "Snake":
          return browser.runtime.getURL("beasts/snake.jpg");
        case "Turtle":
          return browser.runtime.getURL("beasts/turtle.jpg");
      }
    }

    /**
     * Insert the page-hiding CSS into the active tab,
     * then get the beast URL and
     * send a "beastify" message to the content script in the active tab.
     */
    function beastify(tabs) {
      browser.tabs.insertCSS({code: hidePage}).then(() => {
        const url = beastNameToURL(e.target.textContent);
        browser.tabs.sendMessage(tabs[0].id, {
          command: "beastify",
          beastURL: url
        });
      });
    }

    /**
     * Remove the page-hiding CSS from the active tab,
     * send a "reset" message to the content script in the active tab.
     */
    function reset(tabs) {
      browser.tabs.removeCSS({code: hidePage}).then(() => {
        browser.tabs.sendMessage(tabs[0].id, {
          command: "reset",
        });
      });
    }

    /**
     * Just log the error to the console.
     */
    function reportError(error) {
      console.error(`Could not beastify: ${error}`);
    }

    /**
     * Get the active tab,
     * then call "beastify()" or "reset()" as appropriate.
     */
    if (e.target.tagName !== "BUTTON" || !e.target.closest("#popup-content")) {
      // Ignore when click is not on a button within <div id="popup-content">.
      return;
    } 
    if (e.target.type === "reset") {
      browser.tabs.query({active: true, currentWindow: true})
        .then(reset)
        .catch(reportError);
    } else {
      browser.tabs.query({active: true, currentWindow: true})
        .then(beastify)
        .catch(reportError);
    }
  });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute beastify content script: ${error.message}`);

  document.querySelector("#error-content").innerHTML=error.message;
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
let str="";
  browser.tabs.query({active: true, currentWindow: true}).then(
    (tabs)=>
    {
      str+=JSON.stringify(tabs,false,4);
      // document.getElementById("popup-content").innerHTML=str;
    
      console.log(tabs);

      let gettingFrames = browser.webNavigation.getAllFrames({tabId: tabs[0].id}).then(
        (a)=>
        {

          // console.log(JSON.stringify(a[0]));

          for(let i=0;i<a.length;i++)
            // console.log(a[i].tabId,JSON.stringify(a[i]));
            browser.tabs.executeScript(a[i].tabId, {"file": "/content_scripts/beastify.js", "frameId": a[i].frameId});
  

        },
        (err)=>{document.getElementById("popup-content").innerHTML=JSON.stringify(err);});

        // document.getElementById("popup-content").innerHTML=gettingFrames.length+"!!!!";//str+JSON.stringify(gettingFrames,false,5);

      

    }, (err)=>{document.getElementById("popup-content").innerHTML=JSON.stringify(err);});
  // console.log(tab);

// browser.webNavigation.onCompleted.addListener(function(details)
// {
//   console.log("completed",details);
//   // don't inject into the main frame (id = 0)
//   // if(details.frameId != 0) {
//     chrome.tabs.executeScript(details.tabId, {file: "js/contentScript.js", frameId: details.frameId});
//   // }
// });

// browser.tabs.executeScript({file: "/content_scripts/beastify.js"})
// .catch(reportExecuteScriptError);


// browser.tabs.executeScript(()=>{return 12345;},result=>{
//   document.getElementById("popup-content").innerHTML="r:"+result;
// });


