/*=========================
FAQ
=========================*/

const faq = document.querySelectorAll(".faq-question");

faq.forEach(button => {

    button.addEventListener("click", () => {

        const answer = button.nextElementSibling;

        if(answer.style.display === "block"){

            answer.style.display = "none";

        }else{

            answer.style.display = "block";

        }

    });

});


/*=========================
SCROLL SUAVE
=========================*/

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

    anchor.addEventListener("click",function(e){

        e.preventDefault();

        const target=document.querySelector(this.getAttribute("href"));

        if(target){

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});