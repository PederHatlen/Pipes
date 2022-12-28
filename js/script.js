let canvasEl = document.getElementById("canvas");
let pCtrl = "none";

let ctrlLUT = {
    "w":[1, 0, 1],
    "a":[0, 0, 1],
    "s":[1, 1, 1],
    "d":[0, 1, 1]
};

function randomColors(amount = 1){
    return Array(amount).fill("0").map(x=>{
        return "#"+(Math.random()*0xFFFFFF<<0).toString(16)
    });
}

let renderer = new pipeRenderer(canvasEl, 25, 100, 0.5, randomColors(25), 0.5, undefined, 25);

window.addEventListener("keydown", (e)=>{
    let key = e.key.toLowerCase();
    if("wasd".includes(key) && pCtrl != "none" && pCtrl.curMove[0] != ctrlLUT[key][0]){
        pCtrl.curMove = ctrlLUT[key];
        return;
    }
    switch (key) {
        case "f":
            if(window.innerHeight != screen.height) document.body.requestFullscreen();
            else document.exitFullscreen();
            break;
        case "arrowup":
            renderer.speed += (renderer.mps <= 1? renderer.mps/10:0.1);
            break;
        case "arrowdown":
            renderer.speed -= (renderer.mps <= 1? renderer.mps/10:0.1);
            break;
        case "arrowright":
            renderer.pipeWidth += (renderer.pipeWidth <= 1? renderer.pipeWidth:1);
            break;
        case "arrowleft":
            renderer.pipeWidth -= (renderer.pipeWidth <= 1? renderer.pipeWidth/10:1);
            break;
        case " ":
            if(pCtrl == "none"){pCtrl = new pipe(renderer, "#ffffff", false)}
            else{
                renderer.pipes.splice(renderer.pipes.indexOf(pCtrl), 1);
                pCtrl = "none";
            }
            return;
    }
});