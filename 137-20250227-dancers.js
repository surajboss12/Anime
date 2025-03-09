var w = $(window).width();
var h = $(window).height();
var agent = navigator.userAgent;
var hash = location.hash;

//タブレット
$(function(){
//alert(agent);
if(agent.search(/iPad/) != -1 || (agent.search(/Android/) != -1 && agent.search(/Mobile/) == -1)){
$('head').prepend('<meta name="viewport" content="width=640">');
}
//iPad
if(agent.search(/iPad/) > -1 || (agent.search(/Macintosh/) > -1 && 'ontouchend' in document)){
$('head').prepend('<meta name="viewport" content="width=640">');
}
});


$(function() {
if(w >= 640){
$('a img').hover(
function(){
$(this).fadeTo(200, 0.5);
},
function(){
$(this).fadeTo(100, 1.0);
});
}
});


$(function () {
$('a[href^="#"]').click(function(){
var href= $(this).attr('href');
var target = $(href == '#' || href == '' ? 'html' : href);
var position = target.offset().top;
$('html, body').animate({scrollTop:position}, 500, 'swing');
return false;
});
});


$(function () {
$("#menuOpen").click(function(){
$("#menu").slideDown(300);
$("#menuOpen").css("display", "none");
$("#menuClose").css("display", "block");
});
$("#menuClose").click(function(){
$("#menu").slideUp(200);
$("#menuOpen").css("display", "block");
$("#menuClose").css("display", "none");
});
$("#menu").click(function(){
$("#menu").slideUp(200);
$("#menuOpen").css("display", "block");
$("#menuClose").css("display", "none");
});
$("#menu a").click(function(){
$("#menu").slideUp(200);
$("#menuOpen").css("display", "block");
$("#menuClose").css("display", "none");
});
});


$(window).on('load',function(){
$('#simplyScroll').simplyScroll({
autoMode: 'loop',
speed: 2,
frameRate: 24,
horizontal: true,
pauseOnHover:false,
pauseOnTouch:false,
});
});


function eizoChange(n){
let youtubeArray = ["OYqcEByaIOs","WBeirS6zzhs","f_rpIqVOq1Y"];
let eizoAltArray = ["超特報","特報①","予告①"];
$("#eizo .eizo").html('<iframe src="https://www.youtube.com/embed/'+youtubeArray[n]+'?rel=0" frameborder="0" allowfullscreen></iframe>');
for(i=0;i<youtubeArray.length;i++){
$("#b"+i).html('<img src = "20250227/images/btn_eizo'+i+'.png" class="responsive" alt = "'+eizoAltArray[i]+'">');
}
$("#b"+n).html('<img src = "20250227/images/btn_eizo'+n+'_on.png" class="responsive" alt = "'+eizoAltArray[n]+'">');
}

function btnReset(){
$("#b0").html('<img src = "20250227/images/btn_eizo0.png" class="responsive" alt = "超特報">');
$("#b1").html('<img src = "20250227/images/btn_eizo1.png" class="responsive" alt = "特報①">');
$("#b2").html('<img src = "20250227/images/btn_eizo2.png" class="responsive" alt = "予告①">');
}


$(function() {
var iframeW = w*0.9;
var iframeH = w*1.5;
/*$('.colorbox').colorbox({
iframe:true,
innerWidth:iframeW,
innerHeight:iframeH,
initialWidth:100,
returnFocus:false,
scrolling:false,
opacity:1,
});*/
$('.mvtk').colorbox({
iframe:true,
innerWidth:iframeW,
innerHeight:h,
initialWidth:100,
returnFocus:false,
scrolling:false,
opacity:1,
});
});


$(window).on('load',function(){
$("#curtain .loading").fadeOut(1000);
$("#curtain").fadeOut(1000);
if(hash == ""){
if(w < 640){//スマホ
gsap.set("html, body", {scrollTop:0,delay:0.1});
setTimeout(function(){
gsap.timeline()
.fromTo("header .shinnosuke", {scale:0},{scale:1, opacity:1, duration:0.8, ease: "power4.in"})
.fromTo("header .nene", {x:"+=100"}, {x:"-=100", opacity:1, duration:0.5, ease: "power4.out"},"+=0.2")
.fromTo("header .masao", {x:"-=100"}, {x:"+=100", opacity:1, duration:0.5, ease: "power4.out"},"-=0.1")
.fromTo("header .kazama", {x:"+=100"}, {x:"-=100", opacity:1, duration:0.5, ease: "power4.out"},"-=0.1")
.fromTo("header .shiro", {x:"-=100"}, {x:"+=100", opacity:1, duration:0.5, ease: "power4.out"},"-=0.1")
.fromTo("header .logo", {y:"-=100", scale:0.2}, { y:"+=100", scale:1, opacity:1, duration:1.5, delay:0.5, ease: "elastic.out(1,0.3)"})
.fromTo("#menuOpen", {x:"+=100", y:"+=100", scale:0.2}, {x:"-=100", y:"-=100", scale:1, opacity:1, duration:1.5, ease: "elastic.out(1,0.3)"},"<")
.fromTo("header .catch", {y:"+=100", scale:0.2}, {y:"-=100", scale:1, opacity:1, duration:1.5, ease: "elastic.out(1,0.3)"},"<")
.fromTo("header .credit", {y:"-=100", scale:0.2}, {y:"+=100", scale:1, opacity:1, duration:1.5, ease: "elastic.out(1,0.3)"},"<")
.fromTo("header #mbtc", {y:"-=160", scale:0.2}, {y:"+=160", scale:1, opacity:1, duration:1.5, ease: "elastic.out(1,0.3)"},"<")
.fromTo("header .icon", {x:"-=100", y:"-=20", scale:0.2}, {x:"+=100", y:"+=20", scale:1, opacity:1, duration:1.5, ease: "elastic.out(1,0.3)"},"<")
.fromTo("header .btn.mobile", {y:"-=200", scale:0.2}, {y:"+=200", scale:1, opacity:1, duration:1.5, ease: "elastic.out(1,0.3)"},"<")
gsap.fromTo('header .sns', {y:'+=100'}, {
opacity:1, y:'-=100', duration:1, ease:'power4.out', scrollTrigger:{trigger: 'header .sns',start: 'top 100%'}
});
gsap.fromTo('header .maepre', {y:'+=100'}, {
opacity:1, y:'-=100', duration:1, ease:'power4.out', scrollTrigger:{trigger: 'header .maepre',start: 'top 100%'}
});
gsap.from('#b2 > img', {
opacity:0, y:'+=100', duration:1, ease:'power4.out', scrollTrigger:{trigger: '#eizo .btn',start: 'top 100%'}
});
gsap.from('#b1 > img', {
opacity:0, y:'+=100', duration:1, delay:0.2, ease:'power4.out', scrollTrigger:{trigger: '#eizo .btn',start: 'top 100%'}
});
gsap.from('#b0 > img', {
opacity:0, y:'+=100', duration:1, delay:0.4, ease:'power4.out', scrollTrigger:{trigger: '#eizo .btn',start: 'top 100%'}
});
gsap.timeline({
scrollTrigger:{trigger: '#ohanashi .text',start: 'top 80%',onEnter:() => {blur()}}
});
},600);
}
else{//PC
gsap.set("html, body", {scrollTop:0,delay:0.1});
setTimeout(function(){
gsap.timeline()
.fromTo("header .shinnosuke", {y:"+=200",scale:0},{y:"-=200", scale:1, opacity:1, duration:0.8, ease: "power4.in"})
.fromTo("header .nene", {x:"+=200"}, {x:"-=200", opacity:1, duration:0.5, ease: "power4.out"},"+=0.2")
.fromTo("header .masao", {x:"-=200"}, {x:"+=200", opacity:1, duration:0.5, ease: "power4.out"},"-=0.1")
.fromTo("header .kazama", {x:"+=200"}, {x:"-=200", opacity:1, duration:0.5, ease: "power4.out"},"-=0.1")
.fromTo("header .shiro", {x:"-=200"}, {x:"+=200", opacity:1, duration:0.5, ease: "power4.out"},"-=0.1")
.fromTo("header .logo", {x:"+=200", y:"+=250", scale:0.2}, {x:"-=200", y:"-=250", scale:1, opacity:1, duration:1.5, delay:0.5, ease: "elastic.out(1,0.3)"})
.fromTo("header .sns", {x:"+=200", y:"+=150", scale:0.2}, {x:"-=200", y:"-=150", scale:1, opacity:1, duration:1.5, ease: "elastic.out(1,0.3)"},"<")
.fromTo("header .maepre", {x:"+=200", y:"+=100", scale:0.2}, {x:"-=200", y:"-=100", scale:1, opacity:1, duration:1.5, ease: "elastic.out(1,0.3)"},"<")
.fromTo("header .btn.pc", {x:"-=80", y:"+=300", scale:0.2}, {x:"+=80", y:"-=300", scale:1, opacity:1, duration:1.5, ease: "elastic.out(1,0.3)"},"<")
.fromTo("header .catch", {x:"-=250", y:"+=200", scale:0.2}, {x:"+=250", y:"-=200", scale:1, opacity:1, duration:1.5, ease: "elastic.out(1,0.3)"},"<")
.fromTo("header .credit", {y:"-=150", scale:0.2}, {y:"+=170", scale:1, opacity:1, duration:1.5, ease: "elastic.out(1,0.3)"},"<")
.fromTo("header #mbtc", {y:"-=210", scale:0.2}, {y:"+=210", scale:1, opacity:1, duration:1.5, ease: "elastic.out(1,0.3)"},"<")
.fromTo("header .icon", {x:"-=250", y:"-=150", scale:0.2}, {x:"+=250", y:"+=150", scale:1, opacity:1, duration:1.5, ease: "elastic.out(1,0.3)"},"<")
gsap.from('#b2 > img', {
opacity:0, y:'+=200', duration:1, ease:'power4.out', scrollTrigger:{trigger: '#eizo .btn',start: 'top 100%'}
});
gsap.from('#b1 > img', {
opacity:0, y:'+=200', duration:1, delay:0.2, ease:'power4.out', scrollTrigger:{trigger: '#eizo .btn',start: 'top 100%'}
});
gsap.from('#b0 > img', {
opacity:0, y:'+=200', duration:1, delay:0.4, ease:'power4.out', scrollTrigger:{trigger: '#eizo .btn',start: 'top 100%'}
});
gsap.timeline({
scrollTrigger:{trigger: '#ohanashi .text',start: 'top 100%',onEnter:() => {blur()}}
});
},600);
}
}
//他ページからtop
else if(hash != ""){
gsap.set("header .shinnosuke", {opacity:1});
gsap.set("header .nene", {opacity:1});
gsap.set("header .masao", {opacity:1});
gsap.set("header .kazama", {opacity:1});
gsap.set("header .shiro", {opacity:1});
gsap.set("header .logo", {opacity:1});
gsap.set("header .sns", {opacity:1});
gsap.set("header .maepre", {opacity:1});
gsap.set("header .btn.pc", {opacity:1});
gsap.set("header .catch", {opacity:1});
gsap.set("header .credit", {opacity:1});
gsap.set("header .icon", {opacity:1});
gsap.set("#ohanashi .text picture", {opacity:1});
if(w < 640){
gsap.set("#menuOpen", {opacity:1});
}
}
});

function blur(){
//alert("blur");
$('#ohanashi .text picture').addClass('img-blur');
}