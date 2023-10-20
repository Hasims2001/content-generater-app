const searchBtn = document.querySelector("#search-btn");
const searchInput = document.querySelector("#search-input");
const category = document.querySelector("#category");
const language = document.querySelector("#language-input");
const historyWrapper = document.querySelector("#history-wrapper");
let history = JSON.parse(localStorage.getItem('history')) || [];
if(history.length > 0){
    updateHistory();
}

function updateHistory(){
    historyWrapper.innerHTML = '';
    history.map((item, ind)=>{
        historyWrapper.innerHTML += `<div class="historyBox">
        <p class="userBox">${item.user}</p>
        <div class="outputDiv">
        <p class="outputBox">${item.output} </p>
        <svg class="copyBtn" onclick="handleCopy('${ind}')"  xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clipboard-copy"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/><path d="M16 4h2a2 2 0 0 1 2 2v4"/><path d="M21 14H11"/><path d="m15 10-4 4 4 4"/></svg>
        <svg class="shareBtn" onclick="handleShare('${ind}')" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-share-2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
        </div>
        </div>`
    })
    
}

async function callAPI(query){
    try {
        let res = await fetch('https://cyan-agile-dove.cyclic.app', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(query)
        })
        res = await res.json();
        history.push({user: `${query.searchInput}[${query.category}]`, output: res.msg})
        localStorage.setItem('history', JSON.stringify(history));
        updateHistory();
        searchBtn.removeAttribute('disabled');
    } catch (error) {
        makeToast(error.message);
    }
}
searchBtn.addEventListener('click', ()=>{

    if(!searchInput.value){
        makeToast('please write your query in input box.')
    }else if(!category.value){
        makeToast('please select category.')
    }else{
        // making request for query.
        searchBtn.setAttribute('disabled', true);
        let obj = {
            searchInput : searchInput.value,
            category : category.value,
            language : language.value,
        }
        callAPI(obj);
    }
})

// const shareBtn = document.querySelectorAll(".shareBtn");

// shareBtn.addEventListener('click', ()=>{

// })

function handleCopy(ind){
    for(let i=0; i<history.length; i++){
        if(ind == i){
            navigator.clipboard.writeText(history[i].output);
            makeToast(`Text copied!`)
            break;
        }
       }
}
function handleShare(ind){
    shareToast();
    let value = "";
    const shareButtons = document.querySelectorAll('.share-button');
    for(let i=0; i<history.length; i++){
        if(ind == i){
            value = history[i].output;
            break;
        }
       }
    shareButtons.forEach(button => {
        button.addEventListener('click', () => {
           const url = window.location.href;
           let t = document.querySelector('#shareToast');
           t.className = t.className.replace("show", "");
           const platform = button.classList[1];
           let shareUrl;
           switch (platform) {
              case 'facebook':
              shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${value}`;
              break;
              case 'twitter':
              shareUrl = `https://twitter.com/share?text=${value}`;
              break;
              case 'linkedin':
              shareUrl = `https://www.linkedin.com/shareArticle?text=${value}`;
              break;
              case 'pinterest':
              shareUrl = `https://pinterest.com/pin/create/button/?text=${value}`;
              break;
              case 'reddit':
              shareUrl = `https://reddit.com/submit?text=${value}`;
              break;
              case 'whatsapp':
              shareUrl = `https://api.whatsapp.com/send?text=${value}`;
              break;
           }
     
           window.open(shareUrl, '_blank');
        });
     });

  
}
function shareToast(){
    let t = document.querySelector('#shareToast');
    t.className = "show";
}

function makeToast(msg) {
    var x = document.getElementById("snackbar");
    x.innerHTML = msg;
    x.className = "show";
  
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000);
  }