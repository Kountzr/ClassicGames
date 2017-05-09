// Global Variables Height and Width
var h = 200
var w = 400
var On=new Array(
         [0, 2, 3, 4, 5, 6],
         [3, 4],
         [0, 5, 1, 4, 2],
         [0, 5, 1, 2, 6],
         [1, 3, 5, 6],
         [0, 1, 2, 3, 6],
         [1, 2, 3, 4, 6],
         [0, 5, 6],
         [0, 1, 2, 3, 4, 5, 6],
         [0, 1, 3, 5, 6]);
//Run Function to Initialize Game
run = function () {
  
        Court = new CCourt({ h: h, w: w });
        document.body.appendChild(Court);
        Net = new CNet(
            { x: w / 2, y: 0 },
            { h: h, w: 3 }, 20);
        Court.appendChild(Net);

        Ball = new CBall(
            { x: 2, y: 1 },
            { x: 2, y: 1 },
            10);
        Court.appendChild(Ball);

        BatL = new CBat(
            {x: 15, y: (h /2 - 20)}, {h:40, w:10});
        Court.appendChild(BatL);

        BatR = new CBat(
            {x: w - 15 - 10, y: (h / 2 -20)}, {h:40, w: 10});
        Court.appendChild(BatR);
        
        Timer = new CTimer(20, update);
        
        document.onkeypress = batupdate;

        ScoreL = new CScore({x:w / 4,y:5},
                    { w: 20, h: 40 });
        ScoreL.setValue(0);
        Court.appendChild(ScoreL);
        ScoreR = new CScore( {x:3 * w / 4,y:5 },
                        { w: 20, h: 40 });
        ScoreR.setValue(0);
        Court.appendChild(ScoreR);
        
}

//Creating the Court Object
CBlock = function (position, size, c) {
    var DOMObj =
        document.createElement("div");
    DOMObj.style.position = "abolute";
    DOMObj.style.width = size.w + 'px';
    DOMObj.style.height = size.h + 'px';
    DOMObj.style.top = position.y + 'px';
    DOMObj.style.left = position.x + 'px';
    DOMObj.style.backgroundColor = c;
    return DOMObj;
}
//Function to Create court object
CCourt = function (size) {
    var DOMObj = new CBlock({ x: 10, y: 10 }, size, "black");
    return DOMObj;
}

//Function to create new Net
CNet = function (position, size, nodash) {
    DOMObj = new CBlock(position, size, "black");
    DOMObj.p = position;
    DOMObj.s = size;
    for (i = 0; i < nodash; i++) {
        dash = new CBlock(
            { x: 0, y: i * 2 * DOMObj.s.h / (2 * nodash) }, { h: size.h / (2 * nodash), w: size.w }, "white");
        DOMObj.appendChild(dash);
    }
    return DOMObj;
};

//Function to create the ball
CBall = function (position, velocity, radius) {
    DOMObj = new CBlock(position, { h: radius, w: radius }, "white");
    DOMObj.p = position;
    DOMObj.v = velocity;
    DOMObj.r = radius;

    DOMObj.move = function () {
        this.p.x += this.v.x;
        this.p.y += this.v.y;
        this.style.top = this.p.y + 'px';
        this.style.left = this.p.x + 'px';
        this.play = 0;
        if (this.p.x + this.r > parseInt(this.parentNode.style.width))
            this.play = 1;
        if (this.p.x < 0)
            this.play = 2;
        if (this.p.y + this.r > parseInt(this.parentNode.style.height))
            this.v.y = -this.v.y;
        if (this.p.y < 0)
            this.v.y = -this.v.y;
        return this.play;
    };
    return DOMObj;
}

CBat = function (position, size) {
    DOmObj = CBlock(position, size, "white");
    DOmObj.p = position;
    DOmObj.s = size;
    DOmObj.move = function (d) {
        this.p.y += d;
        this.style.top = this.p.y + 'px';
    };

    DOmObj.hit = function (B) {
        if ((B.p.x + b.r) >= this.p.x) && (B.p.x <= (this.p.x + this.s.w))){
            if (B.p.y >= this.p.y && B.p.y <= (this.p.y + this.s.h)) {
                B.v.x = -B.v.x;
            }
        }
    }
    return DOmObj;
}
CTimer = function(tick, code){
    this.timer = window.setInterval(code, tick);
    this.clearTimer = function(){
        window.clearInterval(this.timer)
    };
}
update = function() {
    var state = Ball.move();
    if (state != 0) {
        Timer.clearTimer();
        if (state == 1) {
            ScoreL.setValue(ScoreL.value + 1);
        } else {
            ScoreR.setValue(ScoreR.value + 1);
        }
        if (ScoreL.value == 9 || 
                   ScoreR.value == 9) {
            Timer.clearTimer()
        } else {
            restartGame();
        }
    }
        BatL.hit(Ball);
        BatR.hit(Ball);
    }


batupdate = function(e){
    var e = window.event ? event : e;
    if (e.keyCode) { key = e.keyCode }
    else if (typeof (e.which) != 'undefined') { key = e.which; }
    switch (key) {
        case (122):
            BatL.move(1);
            break;
        case (97):
            BatL.move(-1);
        case (107):
            BatR.move(-1);
            break;
        case (109):
            BatR.move(1);
            break;

    }
}
CScore = function(position, size) {
    DOMObj = new CBlock(position, 
                         size, "black");
    DOMObj.p = position;
    DOMObj.s = size;
    DOMObj.score = 0;
    DOMObj.dash = [];
    for (i = 0; i < 3; i++) {
        DOMObj.dash[i] = new CBlock(
          { x: 1, y: (i * DOMObj.s.h / 2) },
          { h: 3, w: DOMObj.s.w - 2 }, 
            "white");
        DOMObj.appendChild(DOMObj.dash[i]);
    }
    for (i = 0; i < 2; i++) {
        DOMObj.dash[i + 3] = new CBlock(
          { x: 0, y: i * DOMObj.s.h / 2 + 4 },
          { h: DOMObj.s.h / 2 - 5, w: 3 },
           "white");
        DOMObj.appendChild(
                      DOMObj.dash[i + 3]);
        DOMObj.dash[i + 5] = new CBlock(
         {x: DOMObj.s.w - 3,
             y: i * DOMObj.s.h / 2 + 4 },
         { h: DOMObj.s.h / 2 - 5, w: 3 },
          "white");
        DOMObj.appendChild(
                      DOMObj.dash[i + 5]);
    }
    DOMObj.setValue = function(value) {
        this.value = value;
        for (i = 0; i < 7; i++) {
            this.dash[i].style.
                 backgroundColor = "black";
        }
        for (i in On[value]) {
            this.dash[On[value][i]].style.
                 backgroundColor = "white";
        }
    }
    return DOMObj;
};
restartGame=function()
{
    BatL.p={x : 15,y : (h / 2 - 20)};
    BatL.move(0);
    BatR.p={x:w-15-10,y:(h/2-20)};
    BatR.move(0);
    Ball.p= {x : 2,y : 1};
    Ball.v={x:2,y:1};
    Timer = new CTimer(20, update);
}