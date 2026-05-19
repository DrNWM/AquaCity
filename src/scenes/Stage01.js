import Phaser from 'phaser';
import Pipe, { PipeTypes } from '../objects/Pipe.js';

export default class Stage01 extends Phaser.Scene {
    constructor() {
        super('Stage01');
        this.gridSize = 8;
        this.cellSize = 64;
        this.gridOffsetX = 144; // Center horizontally (800 - 512) / 2
        this.gridOffsetY = 48;  // Top padding
        
        this.grid = []; // 2D array [y][x] to store placed pipes
        this.sourcePos = { x: 0, y: 0 };
        this.targetPos = [
            { x: 7, y: 2 },
            { x: 7, y: 4 },
            { x: 7, y: 6 }
        ];
    }

    init(data) {
        this.carryoverBudget = data.budget || 0;
    }

    create() {
        this.cameras.main.setBackgroundColor('#2d2d2d');
        
        // Initialize Grid Array
        for (let y = 0; y < this.gridSize; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.gridSize; x++) {
                this.grid[y][x] = null;
                // Draw empty cell
                this.add.sprite(
                    this.gridOffsetX + x * this.cellSize + this.cellSize / 2,
                    this.gridOffsetY + y * this.cellSize + this.cellSize / 2,
                    'empty_cell'
                ).setDepth(0);
            }
        }

        // Draw Source
        this.add.sprite(
            this.gridOffsetX + this.sourcePos.x * this.cellSize + this.cellSize / 2,
            this.gridOffsetY + this.sourcePos.y * this.cellSize + this.cellSize / 2,
            'source'
        ).setDepth(1);

        // Draw Targets
        this.targetPos.forEach(t => {
            this.add.sprite(
                this.gridOffsetX + t.x * this.cellSize + this.cellSize / 2,
                this.gridOffsetY + t.y * this.cellSize + this.cellSize / 2,
                'garden'
            ).setDepth(1);
        });

        // Setup Inventory Panel
        this.add.rectangle(400, 560, 800, 80, 0x111111).setDepth(2);
        
        this.createInventoryPipe(PipeTypes.STRAIGHT, 250, 560);
        this.createInventoryPipe(PipeTypes.ELBOW, 400, 560);
        this.createInventoryPipe(PipeTypes.T_JUNCTION, 550, 560);

        // Restart Button
        const restartBtn = this.add.text(750, 540, 'RESTART', {
            backgroundColor: '#aa0000', padding: { x: 10, y: 5 }, font: '16px Arial'
        }).setOrigin(0.5).setInteractive().setDepth(3);
        
        restartBtn.on('pointerdown', () => {
            restartBtn.setBackgroundColor('#ff0000');
            this.time.delayedCall(100, () => this.scene.restart());
        });

        // Test Flow Button
        const flowBtn = this.add.text(750, 575, 'TEST', {
            backgroundColor: '#0055aa', padding: { x: 10, y: 5 }, font: '16px Arial'
        }).setOrigin(0.5).setInteractive().setDepth(3);
        
        flowBtn.on('pointerdown', () => {
            flowBtn.setBackgroundColor('#00aaff');
            this.simulateFlow();
            this.time.delayedCall(200, () => flowBtn.setBackgroundColor('#0055aa'));
        });

        // Footnote
        this.add.text(10, 585, 'AquaEngineer by Eric Ng & Aqil Rudi @ 2026', {
            font: '12px Arial', fill: '#888888'
        }).setOrigin(0, 0.5).setDepth(4);

        // Header Text
        this.add.text(400, 20, 'Stage 01: The Village Well', {
            font: '24px Arial', fill: '#ffffff'
        }).setOrigin(0.5);

        // Timer
        this.startTime = this.time.now;
        this.timerText = this.add.text(780, 20, '0s', {
            font: '24px Arial', fill: '#ffff00'
        }).setOrigin(1, 0.5);
        this.add.text(780, 45, 'Tip: Finish under 60s for +RM 5.00', {
            font: '12px Arial', fill: '#aaaaaa'
        }).setOrigin(1, 0.5);

        // Cheat Code
        const combo = this.input.keyboard.createCombo('cheat');
        this.input.keyboard.on('keycombomatch', (event) => {
            if (event.keyCodes.join(',') === combo.keyCodes.join(',')) {
                this.triggerWin();
            }
        });
    }

    update() {
        if (this.timerText && !this.levelComplete) {
            const elapsed = Math.floor((this.time.now - this.startTime) / 1000);
            this.timerText.setText(`${elapsed}s`);
        }
    }

    triggerWin() {
        this.levelComplete = true;
        
        const elapsedMs = this.time.now - this.startTime;
        const winBonus = 5;
        const speedBonus = elapsedMs <= 60000 ? 5 : 0;
        const nextBudget = this.carryoverBudget + winBonus + speedBonus;

        let msg = 'LEVEL COMPLETE!\n';
        msg += `+RM ${winBonus.toFixed(2)} Win Bonus\n`;
        if (speedBonus > 0) msg += `+RM ${speedBonus.toFixed(2)} Speed Bonus (< 1 min)\n`;
        msg += `Total Budget for Next Level: RM ${nextBudget.toFixed(2)}`;

        this.add.text(400, 300, msg, {
            font: '24px Arial', fill: '#00ff00', backgroundColor: '#000000', padding: {x: 20, y: 20}, align: 'center'
        }).setOrigin(0.5).setDepth(20);

        const nextBtn = this.add.text(400, 420, 'NEXT ROUND', {
            font: '24px Arial', fill: '#ffffff', backgroundColor: '#0055aa', padding: {x: 10, y: 10}
        }).setOrigin(0.5).setInteractive().setDepth(20);

        nextBtn.on('pointerdown', () => {
            this.scene.start('Stage02', { budget: nextBudget });
        });
    }

    createInventoryPipe(type, x, y) {
        const createDraggable = () => {
            const pipe = new Pipe(this, x, y, type);
            this.add.existing(pipe);
            this.input.setDraggable(pipe);
            pipe.isDraggable = true;
            pipe.setDepth(3);

            pipe.on('dragstart', () => {
                // Create a replacement in the inventory
                createDraggable();
                pipe.setDepth(10); // Bring to front while dragging
            });

            pipe.on('drag', (pointer, dragX, dragY) => {
                pipe.x = dragX;
                pipe.y = dragY;
            });

            pipe.on('dragend', (pointer) => {
                pipe.isDraggable = false;
                const gridX = Math.floor((pipe.x - this.gridOffsetX) / this.cellSize);
                const gridY = Math.floor((pipe.y - this.gridOffsetY) / this.cellSize);

                if (gridX >= 0 && gridX < this.gridSize && gridY >= 0 && gridY < this.gridSize) {
                    // Cannot place on source or target
                    const isSource = (gridX === this.sourcePos.x && gridY === this.sourcePos.y);
                    const isTarget = this.targetPos.some(t => t.x === gridX && t.y === gridY);
                    
                    if (isSource || isTarget) {
                        pipe.destroy();
                        return;
                    }

                    // Snap to grid
                    pipe.x = this.gridOffsetX + gridX * this.cellSize + this.cellSize / 2;
                    pipe.y = this.gridOffsetY + gridY * this.cellSize + this.cellSize / 2;
                    
                    // Remove existing
                    if (this.grid[gridY][gridX]) {
                        this.grid[gridY][gridX].destroy();
                    }
                    this.grid[gridY][gridX] = pipe;
                    pipe.gridX = gridX;
                    pipe.gridY = gridY;
                    pipe.setDepth(2); // On top of grid, below dragging
                    this.input.setDraggable(pipe, false); // No longer draggable, but click rotates it
                } else {
                    pipe.destroy();
                }
            });
        };

        createDraggable();
    }

    simulateFlow() {
        // Clear all filled states
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                if (this.grid[y][x]) this.grid[y][x].setFilled(false);
            }
        }

        // BFS from source
        const visited = new Set();
        const queue = [{ x: this.sourcePos.x, y: this.sourcePos.y }];
        let targetsReached = 0;

        while (queue.length > 0) {
            const curr = queue.shift();
            const key = `${curr.x},${curr.y}`;
            if (visited.has(key)) continue;
            visited.add(key);

            // Is this a target?
            const isTarget = this.targetPos.find(t => t.x === curr.x && t.y === curr.y);
            if (isTarget) {
                targetsReached++;
                continue;
            }

            // Get cell pipe openings
            let currOpenings = { top: false, right: false, bottom: false, left: false };
            
            if (curr.x === this.sourcePos.x && curr.y === this.sourcePos.y) {
                // Source is open on all sides
                currOpenings = { top: true, right: true, bottom: true, left: true };
            } else {
                const pipe = this.grid[curr.y][curr.x];
                if (!pipe) continue;
                currOpenings = pipe.getOpenings();
                pipe.setFilled(true);
            }

            // Check neighbors
            // Up
            if (currOpenings.top && curr.y > 0) {
                const neighbor = this.grid[curr.y - 1][curr.x];
                if (neighbor && neighbor.getOpenings().bottom) queue.push({ x: curr.x, y: curr.y - 1 });
                else if (this.targetPos.some(t => t.x === curr.x && t.y === curr.y - 1)) queue.push({ x: curr.x, y: curr.y - 1 });
            }
            // Right
            if (currOpenings.right && curr.x < this.gridSize - 1) {
                const neighbor = this.grid[curr.y][curr.x + 1];
                if (neighbor && neighbor.getOpenings().left) queue.push({ x: curr.x + 1, y: curr.y });
                else if (this.targetPos.some(t => t.x === curr.x + 1 && t.y === curr.y)) queue.push({ x: curr.x + 1, y: curr.y });
            }
            // Down
            if (currOpenings.bottom && curr.y < this.gridSize - 1) {
                const neighbor = this.grid[curr.y + 1][curr.x];
                if (neighbor && neighbor.getOpenings().top) queue.push({ x: curr.x, y: curr.y + 1 });
                else if (this.targetPos.some(t => t.x === curr.x && t.y === curr.y + 1)) queue.push({ x: curr.x, y: curr.y + 1 });
            }
            // Left
            if (currOpenings.left && curr.x > 0) {
                const neighbor = this.grid[curr.y][curr.x - 1];
                if (neighbor && neighbor.getOpenings().right) queue.push({ x: curr.x - 1, y: curr.y });
                else if (this.targetPos.some(t => t.x === curr.x - 1 && t.y === curr.y)) queue.push({ x: curr.x - 1, y: curr.y });
            }
        }

        if (targetsReached === this.targetPos.length) {
            this.triggerWin();
        }
    }
}
