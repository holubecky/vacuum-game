const grid = document.getElementById('grid');
const gridSize = 40;
let movements = [];
let globalSteps = 0

const movingVacuum = {
    pos: { x: 1, y: 1 },
    direction: { x: 1, y: 0 },
    canMoveForward: true,
    moveForward: function() {
        const fromPosition = { ...this.pos };
        const toPosition = { x: this.pos.x + this.direction.x, y: this.pos.y + this.direction.y };

        if (this.canMoveForward) {
            this.pos.x = toPosition.x;
            this.pos.y = toPosition.y;
        }
    },
    turnLeft: function() {
        [this.direction.x, this.direction.y] = [this.direction.y, -this.direction.x];
    },
    turnRight: function() {
        [this.direction.x, this.direction.y] = [-this.direction.y, this.direction.x];
    },
    getDirectionPos: function() {
        return { x: this.pos.x + this.direction.x, y: this.pos.y + this.direction.y };
    },
    get canMoveForward() {
        const nextPos = {
            x: this.pos.x + this.direction.x,
            y: this.pos.y + this.direction.y
        };
        const nextCell = grid.children[nextPos.y * gridSize + nextPos.x];
        return !(nextCell.classList.contains('wall') || nextCell.classList.contains('obstacle'));
    }
}
const vacuum = {
    isInFinish: false,
    pos: { x: 1, y: 1 },
    direction: { x: 1, y: 0 },
    executeForward: function() {
        this.moveForward();
    },

    executeLeft: function() {
        this.turnLeft();
    },

    executeRight: function() {
        this.turnRight();
    },

    moveForward: function() {
        globalSteps++
        const fromPosition = { ...this.pos };
        const toPosition = { x: this.pos.x + this.direction.x, y: this.pos.y + this.direction.y };

        if (this.canMoveForward) {
            this.pos.x = toPosition.x;
            this.pos.y = toPosition.y;
        }

        movements.push({ action: "moveForward", from: fromPosition, to: toPosition, success: this.canMoveForward });

        if (this.pos.x === 38 && this.pos.y === 38) {
            this.isInFinish = true;
        }
    },


    turnLeft: function() {
        [this.direction.x, this.direction.y] = [this.direction.y, -this.direction.x];
        movements.push({ action: "turnLeft" });
    },

    turnRight: function() {
        [this.direction.x, this.direction.y] = [-this.direction.y, this.direction.x];
        movements.push({ action: "turnRight" });
    },

    getDirectionPos: function() {
        return { x: this.pos.x + this.direction.x, y: this.pos.y + this.direction.y };
    },

    get canMoveForward() {
        const nextPos = this.getDirectionPos();
        const nextCell = grid.children[nextPos.y * gridSize + nextPos.x];
        return !(nextCell.classList.contains('wall') || nextCell.classList.contains('obstacle'));
    },
    get canMoveLeft() {
        this.turnLeft();
        const result = this.canMoveForward;
        this.turnRight(); // return to the original direction
        return result;
    },
    get canMoveRight() {
        this.turnRight();
        const result = this.canMoveForward;
        this.turnLeft(); // return to the original direction
        return result;
    }
};

// Helper function to add an obstacle
function placeObstacle(topLeftX, topLeftY, width, height) {
    for (let x = topLeftX; x < topLeftX + width; x++) {
        for (let y = topLeftY; y < topLeftY + height; y++) {
            const obstacleCell = grid.children[y * gridSize + x];
            obstacleCell.classList.add('obstacle');
        }
    }
}

function initializeGrid() {
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            if (x === 0 || y === 0 || x === gridSize - 1 || y === gridSize - 1) {
                cell.classList.add('wall');
            } else if (x === vacuum.pos.x && y === vacuum.pos.y) {
                cell.classList.add('player');
                cell.classList.add('player2');
            } else if (x === vacuum.getDirectionPos().x && y === vacuum.getDirectionPos().y) {
                cell.classList.add('direction');
            } else if (x === 38 && y === 38) {
                cell.classList.add('target');
            }

            grid.appendChild(cell);
        }
    }

    // Placing 12 obstacles. Adjust the coordinates as needed.
    // placeObstacle(10, 1, 25,4);
    // placeObstacle(1, 15, 4,8);
    // placeObstacle(1, 27, 4,4);
    // placeObstacle(15, 15, 15,6);
    // placeObstacle(37,24, 2,4);
    // placeObstacle(15,33, 12,6);

    placeObstacle(6, 1, 8, 6);
    placeObstacle(26, 1, 8, 6);
    placeObstacle(1, 10, 5, 6);
    placeObstacle(35, 25, 5, 6);
    placeObstacle(10, 8, 5, 5); 
    placeObstacle(25, 8, 5, 5);
    placeObstacle(10, 28, 5, 5);
    placeObstacle(25, 23, 5, 14);
    placeObstacle(17, 15, 7, 7);
    placeObstacle(17, 5, 7, 4);
    placeObstacle(17, 28, 7, 4);
    placeObstacle(7, 18, 12, 5);
    placeObstacle(30, 18, 4, 5);
    placeObstacle(10, 30, 4, 10);

}

function handleKeyPress(e) {

    const prevPos = { ...vacuum.pos };
    const prevDirectionPos = vacuum.getDirectionPos();

    switch(e.key) {
        case 'ArrowUp':
            vacuum.moveForward();
            break;
        case 'ArrowLeft':
            vacuum.turnLeft();
            break;
        case 'ArrowRight':
            vacuum.turnRight();
            break;
    }


    const newDirectionPos = vacuum.getDirectionPos();
    const newCell = grid.children[vacuum.pos.y * gridSize + vacuum.pos.x];
    const newDirectionCell = grid.children[newDirectionPos.y * gridSize + newDirectionPos.x];

    // Prevent movement if the destination cell is a wall or obstacle
    if (newCell.classList.contains('wall') || newCell.classList.contains('obstacle')) {
        vacuum.pos = prevPos;
        return;
    }

    const prevCell = grid.children[prevPos.y * gridSize + prevPos.x];
    const prevDirectionCell = grid.children[prevDirectionPos.y * gridSize + prevDirectionPos.x];

    prevCell.classList.remove('player');
    prevDirectionCell.classList.remove('direction');
    newCell.classList.add('player');
    newDirectionCell.classList.add('direction');
}

initializeGrid();
