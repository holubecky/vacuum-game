function resetVisibility() {
    const cells = grid.querySelectorAll('.can-move, .blocked, .collision');
    cells.forEach(cell => {
        cell.classList.remove('can-move', 'blocked', 'collision');
    });
}

function move(item) {
    resetVisibility(); // Reset visibility colors before processing the next action

    const prevPos2 = { ...movingVacuum.pos };

    const nextPos2 = {
        x: movingVacuum.pos.x + movingVacuum.direction.x,
        y: movingVacuum.pos.y + movingVacuum.direction.y
    };
    const nextCell2 = grid.children[nextPos2.y * gridSize + nextPos2.x];

    switch(item.action) {
        case 'moveForward':
            movingVacuum.moveForward();
            break;
        case 'turnLeft':
            movingVacuum.turnLeft();
            break;
        case 'turnRight':
            movingVacuum.turnRight();
            break;
    }

    const prevCell2 = grid.children[prevPos2.y * gridSize + prevPos2.x];
    const newCell2 = grid.children[movingVacuum.pos.y * gridSize + movingVacuum.pos.x];

    prevCell2.classList.remove('player2', 'can-move', 'blocked', 'collision');
    newCell2.classList.add('player2');

    // Handle the new "direction" color after moving the player2
    const newDirectionPos2 = {
        x: movingVacuum.pos.x + movingVacuum.direction.x,
        y: movingVacuum.pos.y + movingVacuum.direction.y
    };
    const newDirectionCell2 = grid.children[newDirectionPos2.y * gridSize + newDirectionPos2.x];

    if (newDirectionCell2.classList.contains('wall') || newDirectionCell2.classList.contains('obstacle')) {
        newDirectionCell2.classList.add('blocked');  // Highlight as blocked path
    } else {
        newDirectionCell2.classList.add('can-move');  // Highlight as clear path
    }

    if (item.action === 'moveForward' && !movingVacuum.canMoveForward) {
        newDirectionCell2.classList.remove('blocked');  // Remove blocked highlight
        newDirectionCell2.classList.add('collision');   // Highlight collision
    }
}


function executeMovements(index) {
    if (index=== movements.length && index !== 0) {
        if (movingVacuum.pos.x === 38 && movingVacuum.pos.y === 38) {
            alert('Vacuum is in chargin pad, required moves forward: ' + globalSteps);
        } else {
            alert('Your vacuum did not reach the charging pad');
        }


    }
    if (index >= movements.length) return;

    move(movements[index]);

    setTimeout(() => {
        executeMovements(index + 1);
    }, 50); 
}

executeMovements(0);



