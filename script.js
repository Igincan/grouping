var canvas = document.getElementById('ctx');

var ctx = canvas.getContext('2d');

var objects = [];

var groups = ['red', 'green', 'blue', 'brown', 'yellow', 'purple', 'pink', 'orange', 'grey', 'cyan', 'darkgoldenrod', 'darkolivegreen', 'darkslateblue', 'lightgreen', 'coral'];

var k = prompt('How many groups? (max ' + groups.length + ')');

var numberOfObjects = 30000;

var delayInAnimation = 500;

var spacePressed = false;

var centroids = [];
for (let i = 0; i < k; i++) {
    centroids.push({
        color: groups[i],
        members: {
            size: 0,
            sumOfXs: 0,
            sumOfYs: 0,
        },
        x: null,
        y: null
    });
}

var nothingHasChanged = 0;

var drawObjects = function() {
    objects.forEach(object => {
        ctx.fillStyle = groups[object.group];
        ctx.fillRect(object.x - 2, object.y - 2, 5, 5);
    });
};

var generateRandomObjects = function() {
    for (let i = 0; i < numberOfObjects; i++) {
        objects.push({
            x: Math.random() * 500,
            y: Math.random() * 500,
            group: 8,
        });
    }
};

var getDistance = function(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));
};

var generateRandomGroups = function() {
    for (let i = 0; i < objects.length; i++) {
        objects[i].group = Math.floor(Math.random() * k);
        centroids[objects[i].group].members.size++;
        centroids[objects[i].group].members.sumOfXs += objects[i].x;
        centroids[objects[i].group].members.sumOfYs += objects[i].y;
    }
};

var calculateCentroids = function() {
    for (let i = 0; i < k; i++) {
        if (centroids[i].members.size === 0) {
            continue;
        }
        let oldX = centroids[i].x;
        let oldY = centroids[i].y;
        centroids[i].x = centroids[i].members.sumOfXs / centroids[i].members.size;
        centroids[i].y = centroids[i].members.sumOfYs / centroids[i].members.size;
        if (oldX === centroids[i].x && oldY === centroids[i].y) {
            nothingHasChanged++;
        } else {
            nothingHasChanged = 0;
        }
    }
};

var drawCentroids = function() {
    for (let i = 0; i < k; i++) {
        ctx.fillStyle = groups[i];
        ctx.fillRect(centroids[i].x - 4, centroids[i].y - 4, 9, 9);
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.rect(centroids[i].x - 4, centroids[i].y - 4, 9, 9);
        ctx.stroke();
    }
};

var assignAllObjectsToClosestCentroid = function() {
    for (let i = 0; i < k; i++) {
        centroids[i].members.size = 0;
        centroids[i].members.sumOfXs = 0;
        centroids[i].members.sumOfYs = 0;
    }
    for (let i = 0; i < objects.length; i++) {
        objects[i].group = getIndexOfClosestCentroid(objects[i].x, objects[i].y);
        centroids[objects[i].group].members.size++;
        centroids[objects[i].group].members.sumOfXs += objects[i].x;
        centroids[objects[i].group].members.sumOfYs += objects[i].y;
    }
};

var getIndexOfClosestCentroid = function(x, y) {
    let closestDistance = 9999999;
    let closestIndex;
    for (let i = 0; i < k; i++) {
        let distance = getDistance(x, y, centroids[i].x, centroids[i].y);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i;
        }
    }
    return closestIndex;
};

var clearScreen = function() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 500, 500);
};

getPreciseMousePostition = function(x, y) {
    return {
        x: x - canvas.getBoundingClientRect().left + 1,
        y: y - canvas.getBoundingClientRect().top + 1
    };
};

document.onclick = function(event) {
    let mousePosition = getPreciseMousePostition(event.clientX, event.clientY);
    console.log(centroids[getIndexOfClosestCentroid(mousePosition.x, mousePosition.y)]);
};

var loop = function(multiplicator) {
    assignAllObjectsToClosestCentroid();
    clearScreen();
    drawObjects();
    drawCentroids();
    setTimeout(function() {
        calculateCentroids();
        clearScreen();
        drawObjects();
        drawCentroids();
        setTimeout(function() {
            if (nothingHasChanged < 2) {// if (!nothingHasChanged) {
                loop(multiplicator - 1);
            } else {
                console.log('Done!');
                console.log('Groups:', centroids);
                alert('Done!')
            }
        }, delayInAnimation * (multiplicator > 1 ? 2 : (multiplicator < -3 ? 0.2 : 1)));
    }, delayInAnimation * (multiplicator > 1 ? 2 : (multiplicator < -3 ? 0.2 : 1)));
};

console.log('Start!');
setTimeout(function() {
    generateRandomObjects();
    drawObjects();
    setTimeout(function() {
        generateRandomGroups();
        console.log('Groups:', JSON.parse(JSON.stringify(centroids)));
        clearScreen();
        drawObjects();
        setTimeout(function() {
            calculateCentroids();
            drawCentroids();
            setTimeout(function() {
                loop(4);
            }, delayInAnimation * 2);
        }, delayInAnimation * 2);
    }, delayInAnimation * 2);
}, delayInAnimation * 2);
