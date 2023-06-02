(function() {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */


console.log(1);
const cbl=window.wrappedJSObject.CABLES;

if(cbl)
{
  const cblPatch=window.wrappedJSObject.CABLES.patch||window.wrappedJSObject.CABLES.exportedPatch;

  if(!cblPatch)return noPatchFound();

  const errors=[];

  for(let i=0;i<cblPatch.ops.length;i++)
  {
    if(cblPatch.ops[i].uiAttribs.uierrors)
      for(let j=0;j<cblPatch.ops[i].uiAttribs.uierrors.length;j++)
      {
        const item=cblPatch.ops[i].uiAttribs.uierrors[j]

        if(item.level>=2)
        {
          errors.push(cblPatch.ops[i].uiAttribs.uierrors[j]);
        }
        

      }
      
  }





  browser.runtime.sendMessage({"success":true,"export":cblPatch.export,"build":window.wrappedJSObject.CABLES.build,"errors":errors});

}
else noPatchFound();


function noPatchFound()
{
  browser.runtime.sendMessage({"success":false,"msg":"no patch found..."});
}


// document.getElementById("popup-content").innerHTML="huhuhuhu12121212";

  // if (window.hasRun) {
  //   return;
  // }
  // window.hasRun = true;

  /**
   * Given a URL to a beast image, remove all existing beasts, then
   * create and style an IMG node pointing to
   * that image, then insert the node into the document.
   */
  function insertBeast(beastURL) {
    removeExistingBeasts();
    let beastImage = document.createElement("img");
    beastImage.setAttribute("src", beastURL);
    beastImage.style.height = "100vh";
    beastImage.className = "beastify-image";
    document.body.appendChild(beastImage);
  }

  /**
   * Remove every beast from the page.
   */
  function removeExistingBeasts() {
    let existingBeasts = document.querySelectorAll(".beastify-image");
    for (let beast of existingBeasts) {
      beast.remove();
    }
  }

  /**
   * Listen for messages from the background script.
   * Call "beastify()" or "reset()".
   */
  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "beastify") {
      insertBeast(message.beastURL);
    } else if (message.command === "reset") {
      removeExistingBeasts();
    }
  });

return "hurz";
})();
