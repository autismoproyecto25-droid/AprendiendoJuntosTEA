const faq = document.querySelectorAll(".faq-question");

faq.forEach(button=>{

button.addEventListener("click",()=>{

const answer = button.nextElementSibling;

if(answer.style.display==="block"){

answer.style.display="none";

}else{

answer.style.display="block";

}

});

});

const topBtn = document.getElementById("topBtn");

window.onscroll = function(){

if(document.documentElement.scrollTop>500){

topBtn.style.display="block";

}

else{

topBtn.style.display="none";

}

};

topBtn.onclick=function(){

window.scrollTo({

top:0,

behavior:"smooth"

});

};

const observer = new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

});

const hiddenElements=document.querySelectorAll(".hidden");

hiddenElements.forEach(el=>observer.observe(el));

const toggle=document.querySelector(".menu-toggle");

const nav=document.querySelector(".nav-links");

toggle.addEventListener("click",()=>{

nav.classList.toggle("active");

});