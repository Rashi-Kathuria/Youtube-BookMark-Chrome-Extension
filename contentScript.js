(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentVideo = "";
    let currentVideoBookmarks = [];
  // this func is created to fetch all the bookmarks and also we will return a promise in order to fetch all the bookmarks asynchronoulsy.
    const fetchBookmarks = () => {
      return new Promise((resolve) => {
        chrome.storage.sync.get([currentVideo], (obj) => {
            // Resolve function is typically used to fulfill the promise indicating that asynchronous function
            //has completed succesfully 
            //if it exists then we wil do json parse it beacuse we json.stringify before if it does not exists then we will return empty array.
          resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);//used conditional statement (?:)
        //obj[currentvideo] is checking whether obj has a propety name currentVideo
        //now if bookmark is present then we will parse the value of that property as JSON string and convert it into javascript object
        
        });
      });
    };
  
 
    const addNewBookmarkEventHandler = async () => {
        // storing the time at which bookmark icon is beign pressed and stor ethe time . 
      const currentTime = youtubePlayer.currentTime;
      //created bookmak variable which contain the time and description that can be display (it is dynamic)
      const newBookmark = {
        time: currentTime,
        desc: "Bookmark at " + getTime(currentTime),
        //caling gettime func down there.
      };
  
      currentVideoBookmarks = await fetchBookmarks();
  //mapping each bookmark with chrome storage so that it show evrytime whenevr you open the video.
      chrome.storage.sync.set({
        [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
    
        //[currentvideo] this creates a synamic object property. i.e property name will be the value of currentvideo
        //...this is creating a new arrya by using spread operator to copy all th elements from the currentvideo bookmar array.
        //it adds a new element bookmark to this array and also sorts the results in asc order based on 'time property'.
        //so it converts the sorted array into JSON string using .stringify

    });
    };


    //   (2-step if the type of video is new then new loaded func is called in order to add  buuton)
    const newVideoLoaded = async () => {
      const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
  
      currentVideoBookmarks = await fetchBookmarks();  // await i sused as it asynchronoly resolve this promise
      //and also it checks if current video having any bookmark or not thats why await is used 
  // checkimg if bookmark button existes or not
      if (!bookmarkBtnExists) {
        const bookmarkBtn = document.createElement("img");
  
        bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
        bookmarkBtn.className = "ytp-button " + "bookmark-btn";
        bookmarkBtn.title = "Click to bookmark current timestamp";

  //after creating bookmark button we will grab the youtube controls and players from the chrome
        youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
        youtubePlayer = document.getElementsByClassName('video-stream')[0];
// appending i.e attaching the bookmark button to the youtubeplayer left controls
        youtubeLeftControls.appendChild(bookmarkBtn);
        // also adding event listner so that it do something on when we click on to bookmark icon. 
        bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
      }
    };
  
    // (1st-mssg is send from background.js file that current video contain the bookmark button or not)
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId } = obj;
// if the type of video is new i.e if the message from background from js file is sending type new
        if (type === "NEW") {
          currentVideo = videoId;
          // in this case we will call new video loaded func
          newVideoLoaded();
        } else if (type === "PLAY") {
          youtubePlayer.currentTime = value;
        } else if ( type === "DELETE") {
            //filter by time
          currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value);
          //updating the chromestorage after deletion
          chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoBookmarks) });
    //sending the meesgae back to popup.js file.
          response(currentVideoBookmarks);
        }
      });
    
      newVideoLoaded();
    })();
    
    const getTime = t => {
      var date = new Date(0);
      date.setSeconds(t);
    
      return date.toISOString().substring(11, 8);
    }; 




