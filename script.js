var ctx = document.getElementById('ctx').getContext('2d');

var objects = [];

var k = prompt('How many groups? (max 9)');

var numberOfObjects = 30000;

var delayInAnimation = 1000;

var spacePressed = false;

var groups = ['red', 'green', 'blue', 'brown', 'yellow', 'purple', 'pink', 'orange', 'grey'];

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

var nothingHasChanged = false;

var drawAllObjects = function() {
    objects.forEach(object => {
        ctx.fillStyle = groups[object.group];
        ctx.fillRect(object.x - 2, object.y - 2, 5, 5);
    });
};

var createRandomObjects = function() {
    for (let i = 0; i < numberOfObjects; i++) {
        objects.push({
            x: Math.random() * 500,
            y: Math.random() * 500,
            group: 8,
        });
    }
};

var getDistanceBetweenObjectAndCentroid = function(object, centroid) {
    return Math.sqrt((object.x - centroid.x)*(object.x - centroid.x) + (object.y - centroid.y)*(object.y - centroid.y));
};

var createRandomGroups = function() {
    for (let i = 0; i < objects.length; i++) {
        objects[i].group = Math.floor(Math.random() * k);
        centroids[objects[i].group].members.size++;
        centroids[objects[i].group].members.sumOfXs += objects[i].x;
        centroids[objects[i].group].members.sumOfYs += objects[i].y;
    }
};

var calculateCentroids = function() {
    for (let i = 0; i < k; i++) {
        let oldX = centroids[i].x;
        let oldY = centroids[i].y;
        centroids[i].x = centroids[i].members.sumOfXs / centroids[i].members.size;
        centroids[i].y = centroids[i].members.sumOfYs / centroids[i].members.size;
        if (oldX === centroids[i].x && oldY === centroids[i].y) {
            nothingHasChanged = true;
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
        objects[i].group = getIndexOfClosestCentroid(objects[i]);
        centroids[objects[i].group].members.size++;
        centroids[objects[i].group].members.sumOfXs += objects[i].x;
        centroids[objects[i].group].members.sumOfYs += objects[i].y;
    }
};

var getIndexOfClosestCentroid = function(object) {
    let closestDistance = 9999999;
    let closestIndex;
    for (let i = 0; i < k; i++) {
        let distance = getDistanceBetweenObjectAndCentroid(object, centroids[i]);
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

var loop = function(multiplicator) {
    assignAllObjectsToClosestCentroid();
    clearScreen();
    drawAllObjects();
    drawCentroids();
    setTimeout(function() {
        calculateCentroids();
        clearScreen();
        drawAllObjects();
        drawCentroids();
        setTimeout(function() {
            if (!nothingHasChanged) {
                loop(multiplicator - 1);
            } else {
                console.log('Finish!');
                console.log('Groups:', centroids);
            }
        }, delayInAnimation * (multiplicator > 1 ? 2 : (multiplicator < -3 ? 0.2 : 1)));
    }, delayInAnimation * (multiplicator > 1 ? 2 : (multiplicator < -3 ? 0.2 : 1)));
};

console.log('Start!');
setTimeout(function() {
    createRandomObjects();
    drawAllObjects();
    setTimeout(function() {
        createRandomGroups();
        console.log('Groups:', JSON.parse(JSON.stringify(centroids)));
        clearScreen();
        drawAllObjects();
        setTimeout(function() {
            calculateCentroids();
            drawCentroids();
            setTimeout(function() {
                loop(4);
            }, delayInAnimation * 2);
        }, delayInAnimation * 2);
    }, delayInAnimation * 2);
}, delayInAnimation * 2);
