const out=document.getElementById("out");
document.getElementById("capture").addEventListener("click",async()=>{
  const [tab]=await chrome.tabs.query({active:true,lastFocusedWindow:true}); if(!tab?.id)return;
  const [result]=await chrome.scripting.executeScript({target:{tabId:tab.id},func:()=>({selection:window.getSelection()?.toString()||"",title:document.title||"",url:location.href})});
  out.textContent=JSON.stringify(result?.result||{},null,2);
});
document.getElementById("open").addEventListener("click",()=>chrome.tabs.create({url:"http://localhost:3000/research"}));
