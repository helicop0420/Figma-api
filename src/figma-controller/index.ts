// clear console on reload
console.clear();


// default plugin size
const pluginFrameSize = {
  width: 512,
  height: 500,
};


var usedNode = []
var removedNode = []
var previousStickies = []
var username = []
// show plugin UI
figma.showUI(__html__, pluginFrameSize);

// listen for messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === "appInit") {
    setInterval(checkSticky, 500)
  } else if(msg.type == "clearSticky") {
    previousStickies = []
    const curStickies = figma.currentPage.findChildren(node => node.type === "STICKY" && removedNode[node.id] != 1)
    curStickies.forEach(item => {
      removedNode[item.id] = 1
    })
  }
};



const checkSticky = () => {
  // const blankStickies = figma.currentPage.findChildren(node => node.type === "STICKY" && removedNode[node.id] != 1 && node['authorName'] == " ")
  // if(blankStickies.length > 0) {
  //   figma.ui.postMessage({
  //     type: 'clear-sticky',
  //   });
  //   return;
  // }
  const curStickies = figma.currentPage.findChildren(node => node.type === "STICKY" && removedNode[node.id] != 1 && node['authorVisible'])
  const stickies = figma.currentPage.findChildren(node => node.type === "STICKY" && usedNode[node.id] != 1 && removedNode[node.id] != 1 && node['authorVisible']);
  var stickyList = [];
  if(previousStickies.length > curStickies.length) {
    console.log('pre', previousStickies)
    previousStickies.forEach((sticky) => {
      if(curStickies.filter(item => item.id == sticky.id)?.length > 0) {
       
      } else {
        console.log('erasedsti', sticky)
        let newSticky = {
          name: username[sticky.id],
        }
        stickyList.push(newSticky)
      }
    })
    if(stickyList.length > 0) {
      figma.ui.postMessage({
          type: 'remove-sticky',
          stickyList
      });
    }
  } else {
    console.log(stickies)
    stickies.forEach((sticky) => {
      usedNode[sticky.id] = 1
      username[sticky.id] = sticky['authorName']
      let fill = sticky['fills'][0];
      let newSticky = {
        name: sticky['authorName'],
        stickyColor: `#${Math.floor(fill.color.r * 255).toString(16).padStart(2, '0')}${Math.floor(fill.color.g * 255).toString(16).padStart(2, '0')}${Math.floor(fill.color.b * 255).toString(16).padStart(2, '0')}`,
      }
      if(sticky['authorName'] != " ") stickyList.push(newSticky)
    })
    if(stickyList.length > 0) {
      figma.ui.postMessage({
          type: 'get-sticky',
          stickyList
      });
    }
  }
  
  previousStickies = [...curStickies]
}

