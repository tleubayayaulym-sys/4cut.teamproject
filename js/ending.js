// ============================================================
// ending.js
// ============================================================

function drawEndingScreen() {

push();

background("#fff0f5");

// ============================================================
// FLOATING DECORATIONS
// ============================================================

for (let i=0; i<15; i++) {

fill(i%2===0 ? "#ffd1df" : "#ffeaa7");

textSize(20 + sin(frameCount*0.03+i)*5);

text(
i%2===0 ? "♡" : "✦",
(width * (i*73 % 100))/100,
(height * (i*37 % 100))/100
);

}

// ============================================================
// MAIN CARD
// ============================================================

fill(255);

noStroke();

rect(
width/2 - 250,
40,
500,
height - 80,
35
);

// ============================================================
// TITLE
// ============================================================

fill("#ff4d6d");

textSize(42);

text(
"📸 4CUT BOOTH",
width/2,
100
);

fill("#999");

textSize(16);

text(
"Art & Technology Team Project",
width/2,
140
);

// ============================================================
// MEMBER CARDS
// ============================================================

let members = [

{
name: "틀레우바이 아야으름",
role: "Camera · UI · Main System"
},

{
name: "응웬 바오 담",
role: "AR Filter · FaceMesh"
},

{
name: "마이티투짱",
role: "Result · Design · Save"
}

];

for (let i=0; i<members.length; i++) {

let y = 220 + i*110;

// shadow

fill(0,0,0,15);

rect(
width/2 - 185 + 4,
y + 4,
370,
82,
24
);

// card

fill("#fff0f5");

stroke("#ffb6c1");
strokeWeight(3);

rect(
width/2 - 185,
y,
370,
82,
24
);

// number

fill("#ff4d6d");

noStroke();

circle(
width/2 - 145,
y + 41,
46
);

fill(255);

textSize(22);

text(
i+1,
width/2 - 145,
y + 42
);

// name

fill("#333");

textSize(22);

textAlign(LEFT,CENTER);

text(
members[i].name,
width/2 - 110,
y + 28
);

// role

fill("#777");

textSize(15);

text(
members[i].role,
width/2 - 110,
y + 55
);

}

// ============================================================
// TECH STACK
// ============================================================

fill("#fff");

stroke("#ffd1df");
strokeWeight(3);

rect(
width/2 - 190,
height - 220,
380,
90,
24
);

fill("#ff4d6d");

textSize(18);

text(
"💻 TECH STACK",
width/2,
height - 190
);

fill("#777");

textSize(14);

text(
"p5.js · MediaPipe · FaceMesh",
width/2,
height - 160
);

text(
"HandPose · GitHub Pages",
width/2,
height - 138
);

// ============================================================
// HOME BUTTON
// ============================================================

fill("#ff4d6d");

noStroke();

rect(
width/2 - 140,
height - 95,
280,
60,
30
);

fill(255);

textSize(28);

text(
"🏠 START AGAIN",
width/2,
height - 64
);

pop();

}

// ============================================================
// ENDING BUTTONS
// ============================================================

function handleEndingButtons() {

if (
mouseX > width/2 - 140 &&
mouseX < width/2 + 140 &&
mouseY > height - 95 &&
mouseY < height - 35
) {

currentScreen = "start";

}

}
