// adding a new bookmark row to the popup
import { getActiveTabURL } from "./utils.js";

const addNewBookmark = (bookmarks, bookmark) => {
  const bookmarkTitleElement = document.createElement("div");//contains the tittle
  const controlsElement = document.createElement("div");
  const newBookmarkElement = document.createElement("div");//will contain all the elements

  bookmarkTitleElement.textContent = bookmark.desc;//contains the description of the bookmark
  bookmarkTitleElement.className = "bookmark-title";//this is for styling
  controlsElement.className = "bookmark-controls";

  setBookmarkAttributes("play", onPlay, controlsElement);
  setBookmarkAttributes("delete", onDelete, controlsElement);

  newBookmarkElement.id = "bookmark-" + bookmark.time;
  newBookmarkElement.className = "bookmark";
  newBookmarkElement.setAttribute("timestamp", bookmark.time);//this will be display the timestamp in row

  newBookmarkElement.appendChild(bookmarkTitleElement);
  newBookmarkElement.appendChild(controlsElement);
  bookmarks.appendChild(newBookmarkElement);
};

//here we will view the bookmark associated with the video
const viewBookmarks = (currentBookmarks=[]) => {
    const bookmarksElement = document.getElementById("bookmarks");
    bookmarksElement.innerHTML = "";
  //if bookmark is not empty
    if (currentBookmarks.length > 0) {
      for (let i = 0; i < currentBookmarks.length; i++) {
        const bookmark = currentBookmarks[i];
        addNewBookmark(bookmarksElement, bookmark);// if in order to add new bookamrk we will call this func.
      }
    } else {
        // if there are no bookmarks to show.
      bookmarksElement.innerHTML = '<i class="row">No bookmarks to show</i>';
    }
  
    return;
  };

  //adding play button so that it can be directly used
  const onPlay = async e => {
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
    const activeTab = await getActiveTabURL();
  
    chrome.tabs.sendMessage(activeTab.id, {
      type: "PLAY",
      value: bookmarkTime,
    });
  };
  
  const onDelete = async e => {
    const activeTab = await getActiveTabURL();//grabbing user active tab
    //grabing time stamp
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
    //grab the elememnt by id to delete
    const bookmarkElementToDelete = document.getElementById(
      "bookmark-" + bookmarkTime
    );
//on  deleteing moving to th eparent node and then removing 
    bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);

    chrome.tabs.sendMessage(activeTab.id, {
      type: "DELETE",
      value: bookmarkTime,
    }, viewBookmarks);//send meesage fun cwhich also accepts the callback function to videw the updated bookmark  
  };
  //control elements are the play and delete button 
  const setBookmarkAttributes =  (src, eventListener, controlParentElement) => {
    const controlElement = document.createElement("img");
  
    controlElement.src = "assets/" + src + ".png";
    controlElement.title = src;
    controlElement.addEventListener("click", eventListener);
    //containng this func in control element 
    controlParentElement.appendChild(controlElement);
  };


  document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getActiveTabURL();
    // to get the url parameters
    const queryParameters = activeTab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);
  
    const currentVideo = urlParameters.get("v");//here v is the unique identifier
    
  //checking if the current video contain any bookmarks.
    if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
      chrome.storage.sync.get([currentVideo], (data) => {
        const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];
  
        //then we willhave to go and have to view the bokmark associated with the storage.
        viewBookmarks(currentVideoBookmarks);
      });
    } else {
      const container = document.getElementsByClassName("container")[0];
  
      //if the chrome page is not a youtube video page so inn thi scase else statement executes.
      container.innerHTML = '<div class="title">This is not a youtube video page.</div>';
    }
  });





// import{getActiveTabURL} from "./utils.js";
// const addNewBookmark = (bookmarksElement, bookmark) => {
//     const bookmarkTitlelemenet=document.createElement("div");
//     const newBookmarkelement=document.createElement("div");

//     bookmarkTitlelemenet.textContent=bookmark.desc;
//     bookmarkTitlelemenet.classname="nookmark-title";

//     newBookmarkelement.id="bookmark-"+ bookmark.time;
//     newBookmarkelement.className="bookmark";
// };

// const viewBookmarks = (currentBookmarks=[]) => {
//     const bookmarksElement=documenr.getElementById("bookmarks");
//     bookmarksElement.innerHTML= "";

//     if(currentBookmarks.length>0){
//         for(let i=0;i<currentBookmarks.length;i++){
//             const bookmark=currentBookmarks[i];
//             addNewBookmark(bookmarksElement,bookmark);
//         }
//     }
//     else{
//         bookmarksElement.innerHTML='<i class="row">No Bookmarks To Show</i>';
//     }
// };

// const onPlay = e => {};

// const onDelete = e => {};

// const setBookmarkAttributes =  () => {};

// document.addEventListener("DOMContentLoaded", async() => {
//     const activeTab= await getActiveTabURL();
//     const queryParameters=activeTab.url.split("?")[1];
//     const urlParameters=new URLSearchParams(queryParameters);

//     const currentVideo= urlParameters.get("v");

//     if(activeTab.url.includes("youtube.com/watch")&& currentVideo){

//     chrome.storage.syc.get([currentVideo],(data)=>{
//         const currentVideoBookmarks=data[currentVideo]? JSON.parse(data[currentVideo]): [];

//         //view bookmarks
//         viewBookmarks(currentVideoBookmarks);

//     })
//     } 
//     else{
//         const container= document.getElementsByClassName("classname")[0];
//         container.innerHTML= '<div class="title"> This is not a youtube video page. </div>';
//     }
// });