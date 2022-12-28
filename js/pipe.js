class pipe{
    render(){
        // Current move has value index 1 = (binary: move along x or y)
        // index 2 = amount to move
        if(this.curMove[2] <= 0 && this.random){
            let axis = this.curMove[0]? 0:1;
            let direction = (Math.random() < 0.5? 0:1);
            let amount = ~~(Math.random()*this.hand.WH[axis])+1;

            this.curMove = [axis, direction, amount];
        }

        let gSize = this.hand.gridSize;
        let axis = this.curMove[0];
        let dir = this.curMove[1];
        
        this.pos[axis] += (dir? 1:-1)*this.hand.speed;

        // If the pipe overflowes in anny direction, overflow
        this.pos[axis] %= this.hand.WH[axis];
        if(this.pos[axis] < 0) this.pos[axis] = this.hand.WH[axis];

        // If dir == 1 (positive), then value on axis needs to be displaced by -1*gSize
        let curSegment = [this.pos[0]*gSize, this.pos[1]*gSize, this.hand.pipeWidth, this.hand.pipeWidth];
        curSegment[axis] -= (gSize*dir)*this.hand.speed;
        curSegment[2+axis] = gSize*this.hand.speed+2 + (this.hand.pipeWidth-2)*dir;

        this.segments.unshift(curSegment);
        if(this.segments.length*this.hand.speed > this.length) this.segments.pop();

        if(this.random) this.curMove[2] -= this.hand.speed;

        this.hand.ctx.fillStyle = this.color;
        for(const i in this.segments) this.hand.ctx.fillRect(...this.segments[i]);
    }
    constructor(hand, color=false, random = true){
        this.hand = hand;
        this.hand.pipes.push(this);

        this.random = random;
        this.color = (!color? this.hand.palette[~~(Math.random()*this.hand.palette.length)]:color);
        this.length = ~~(Math.random()*(hand.maxLen-hand.minLen)+hand.minLen);
        this.pos = this.random? [~~(Math.random()*hand.WH[0]), ~~(Math.random()*hand.WH[1])]:[~~(hand.WH[0]/2), ~~(hand.WH[1]/2)];
        this.curMove = this.random? [0, 0, 0]:[1,-1,1];
        this.segments = [];
    }
}

class pipeRenderer{
    renderPipes(that = this){
        let newTime = performance.now();
        that.ctx.clearRect(0, 0, that.el.width, that.el.height);
        that.offset = (that.gridSize-that.pipeWidth)/2;
        for(const i in that.pipes) that.pipes[i].render();

        // that.ctx.fillStyle = "#fff";
        // for(let x = 0; x < that.WH[0]; x++){
        //     for(let y = 0; y < that.WH[1]; y++){
        //         that.ctx.fillRect(x*that.gridSize+this.offset, y*that.gridSize+this.offset, 1, 1);
        //     }
        // }
        that.oldTime = newTime;
        window.requestAnimationFrame(()=>{that.renderPipes(that)});
        // setTimeout(that.renderPipes, that.timeout, that);
    }
    reColor(palette){
        for(const i in this.pipes){
            this.pipes[i].color = palette[~~(Math.random()*palette.length)];
        }
    }
    setup(){
        this.el.width = this.el.offsetWidth;
		this.el.height = this.el.offsetHeight;

        this.gridSize = this.el.width/this.rowCount;

        this.WH = [this.rowCount, ~~(this.el.height/this.gridSize)];
    }
    constructor(el, pipeCount, rowCount, pipeScale = 1, palette=["#fff", "#f00", "#0f0", "#00f"], speed=1, maxLen=undefined, minLen=1){
        this.el = el;
        this.rowCount = rowCount;

        this.setup();

        let sWH = [...this.WH].sort()
        this.maxLen = (maxLen == undefined? ~~(sWH[1]):maxLen);
        this.minLen = minLen < this.maxLen? minLen:this.maxLen;

        this.speed = speed/2;
        this.oldTime = 0;

        this.ctx = el.getContext("2d");
        // this.ctx.imageSmoothingEnabled = false;
        this.palette = palette;
        this.pipeWidth = pipeScale*this.gridSize;

        this.pipes = [];
        for(let i=0; i < pipeCount; i++){
            new pipe(this);
        }

        new ResizeObserver(()=>{this.setup();}).observe(el);
        this.renderPipes();
    }
}