import Phaser from 'phaser';
import Pipe, { PipeTypes, PipeCosts } from '../objects/Pipe.js';

export default class Stage05 extends Phaser.Scene {
    constructor() {
        super('Stage05');
        this.gridSize = 10;
        this.cellSize = 48; // Scaled down to fit
        this.gridOffsetX = 160; 
        this.gridOffsetY = 48;  
        
        this.grid = []; 
        this.sourcePos = { x: 0, y: 2 };
        this.pollutedSourcePos = { x: 0, y: 7 };
        
        // Distinct Targets
        this.targetPos = [
            { x: 9, y: 1, type: 'hospital' }, // Needs clean
            { x: 9, y: 5, type: 'school' },   // Needs clean
            { x: 9, y: 8, type: 'industrial' } // Accepts either
        ];

        this.budget = 30.00;
        this.budgetUI = null;
    }

    init(data) {
        this.carryoverBudget = data.budget || 0;
    }

    create() {
        this.budget = 30.00 + this.carryoverBudget;
        this.cameras.main.setBackgroundColor('#2d2d2d');
        
        // Grid
        for (let y = 0; y < this.gridSize; y++) {
            this.grid[y] = [];
            for (let x = 0; x < this.gridSize; x++) {
                this.grid[y][x] = null;
                const cell = this.add.sprite(
                    this.gridOffsetX + x * this.cellSize + this.cellSize / 2,
                    this.gridOffsetY + y * this.cellSize + this.cellSize / 2,
                    'empty_cell'
                ).setDepth(0);
                cell.setScale(this.cellSize / 64);
            }
        }

        // Clean Source
        const source1 = this.add.sprite(
            this.gridOffsetX + this.sourcePos.x * this.cellSize + this.cellSize / 2,
            this.gridOffsetY + this.sourcePos.y * this.cellSize + this.cellSize / 2,
            'source'
        ).setDepth(1);
        source1.setScale(this.cellSize / 64);
        source1.setAlpha(0.6); // Low pressure

        // Polluted Source
        const p2x = this.gridOffsetX + this.pollutedSourcePos.x * this.cellSize + this.cellSize / 2;
        const p2y = this.gridOffsetY + this.pollutedSourcePos.y * this.cellSize + this.cellSize / 2;
        const source2 = this.add.sprite(p2x, p2y, 'polluted_source').setDepth(1);
        source2.setScale(this.cellSize / 64);
        source2.setAlpha(0.6); // Low pressure

        this.add.text(p2x, p2y - 30, 'POLLUTED', {
            font: '10px Arial', fill: '#ff00ff', backgroundColor: '#000000', padding: {x: 2, y: 2}
        }).setOrigin(0.5).setDepth(1);

        // Draw Distinct Targets
        this.targetPos.forEach(t => {
            const px = this.gridOffsetX + t.x * this.cellSize + this.cellSize / 2;
            const py = this.gridOffsetY + t.y * this.cellSize + this.cellSize / 2;
            
            const targetSprite = this.add.sprite(px, py, t.type).setDepth(1);
            targetSprite.setScale(this.cellSize / 64);
            
            this.add.text(px, py - 30, t.type.toUpperCase(), {
                font: '10px Arial', fill: '#ffffff', backgroundColor: '#000000', padding: {x: 2, y: 2}
            }).setOrigin(0.5).setDepth(1);
        });

        // Setup Inventory Panel
        this.add.rectangle(400, 560, 800, 80, 0x111111).setDepth(2);
        
        this.createInventoryPipe(PipeTypes.STRAIGHT, 150, 560);
        this.createInventoryPipe(PipeTypes.ELBOW, 275, 560);
        this.createInventoryPipe(PipeTypes.T_JUNCTION, 400, 560);
        this.createInventoryPipe(PipeTypes.FILTER, 525, 560);
        this.createInventoryPipe(PipeTypes.PUMP, 650, 560);

        // Test Flow Button
        const flowBtn = this.add.text(750, 575, 'TEST', {
            backgroundColor: '#0055aa', padding: { x: 10, y: 5 }, font: '16px Arial'
        }).setOrigin(0.5).setInteractive().setDepth(3);
        
        flowBtn.on('pointerdown', () => {
            flowBtn.setBackgroundColor('#00aaff');
            this.simulateFlow();
            this.time.delayedCall(200, () => flowBtn.setBackgroundColor('#0055aa'));
        });

        // Restart Button
        const restartBtn = this.add.text(750, 540, 'RESTART', {
            backgroundColor: '#aa0000', padding: { x: 10, y: 5 }, font: '16px Arial'
        }).setOrigin(0.5).setInteractive().setDepth(3);
        
        restartBtn.on('pointerdown', () => {
            restartBtn.setBackgroundColor('#ff0000');
            this.time.delayedCall(100, () => this.scene.restart());
        });

        // Footnote
        this.add.text(10, 585, 'AquaEngineer by Eric Ng & Aqil Rudi @ 2026', {
            font: '12px Arial', fill: '#888888'
        }).setOrigin(0, 0.5).setDepth(4);

        // UI Headers
        this.add.text(200, 20, 'Stage 05: The Ultimate Challenge', {
            font: '24px Arial', fill: '#ffffff'
        }).setOrigin(0.5);

        this.budgetUI = this.add.text(600, 20, `Budget: RM ${this.budget.toFixed(2)}`, {
            font: '24px Arial', fill: '#00ff00'
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

    createInventoryPipe(type, x, y) {
        const createDraggable = () => {
            const pipe = new Pipe(this, x, y, type);
            this.add.existing(pipe);
            this.input.setDraggable(pipe);
            pipe.isDraggable = true;
            pipe.setDepth(3);

            const costLabel = this.add.text(x, y + 25, `RM ${PipeCosts[type].toFixed(2)}`, {
                font: '12px Arial', fill: '#ffff00'
            }).setOrigin(0.5).setDepth(4);

            pipe.on('dragstart', () => {
                createDraggable();
                pipe.setDepth(10);
                pipe.setScale(this.cellSize / 64); // Scale down when dragging over grid
                costLabel.destroy(); 
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
                    const isSource = (gridX === this.sourcePos.x && gridY === this.sourcePos.y) || 
                                     (gridX === this.pollutedSourcePos.x && gridY === this.pollutedSourcePos.y);
                    const isTarget = this.targetPos.some(t => t.x === gridX && t.y === gridY);
                    const cost = PipeCosts[pipe.pipeType];
                    
                    if (isSource || isTarget) {
                        pipe.destroy();
                        return;
                    }

                    if (this.budget < cost) {
                        this.flashError('INSUFFICIENT FUNDS!');
                        pipe.destroy();
                        return;
                    }

                    // Snap to grid
                    pipe.x = this.gridOffsetX + gridX * this.cellSize + this.cellSize / 2;
                    pipe.y = this.gridOffsetY + gridY * this.cellSize + this.cellSize / 2;
                    
                    if (this.grid[gridY][gridX]) {
                        this.grid[gridY][gridX].destroy();
                    }
                    
                    this.grid[gridY][gridX] = pipe;
                    pipe.gridX = gridX;
                    pipe.gridY = gridY;
                    pipe.setDepth(2);
                    this.input.setDraggable(pipe, false);
                    
                    this.budget -= cost;
                    this.updateBudgetUI();
                } else {
                    pipe.destroy();
                }
            });
        };
        createDraggable();
    }

    flashError(msg) {
        const errText = this.add.text(400, 300, msg, {
            font: '32px Arial', fill: '#ff0000', backgroundColor: '#000000', padding: {x: 10, y: 10}
        }).setOrigin(0.5).setDepth(20);
        
        this.time.delayedCall(1000, () => errText.destroy());
    }

    updateBudgetUI() {
        this.budgetUI.setText(`Budget: RM ${this.budget.toFixed(2)}`);
        if (this.budget < 0.50) {
            this.budgetUI.setColor('#ff0000');
        }
    }

    simulateFlow() {
        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                if (this.grid[y][x]) {
                    this.grid[y][x].setFilled(false);
                    this.grid[y][x].setAlpha(1); // Reset alpha
                }
            }
        }

        const visited = new Set();
        // Start from both sources
        const queue = [
            { x: this.sourcePos.x, y: this.sourcePos.y, waterType: 'clean', pressure: 5 },
            { x: this.pollutedSourcePos.x, y: this.pollutedSourcePos.y, waterType: 'polluted', pressure: 5 }
        ];
        
        let targetsReached = 0;
        let contaminationDetected = false;

        while (queue.length > 0) {
            const curr = queue.shift();
            const key = `${curr.x},${curr.y}`;
            if (visited.has(key)) continue;
            visited.add(key);

            const targetObj = this.targetPos.find(t => t.x === curr.x && t.y === curr.y);
            if (targetObj) {
                if (curr.waterType === 'polluted' && (targetObj.type === 'hospital' || targetObj.type === 'school')) {
                    contaminationDetected = true;
                    break; // Fail immediately
                }
                targetsReached++;
                continue;
            }

            let currOpenings = { top: false, right: false, bottom: false, left: false };
            let outgoingWaterType = curr.waterType;
            let currentPressure = curr.pressure;
            
            const isSource1 = curr.x === this.sourcePos.x && curr.y === this.sourcePos.y;
            const isSource2 = curr.x === this.pollutedSourcePos.x && curr.y === this.pollutedSourcePos.y;

            if (isSource1 || isSource2) {
                currOpenings = { top: true, right: true, bottom: true, left: true };
            } else {
                const pipe = this.grid[curr.y][curr.x];
                if (!pipe) continue;
                
                if (pipe.pipeType === PipeTypes.FILTER) {
                    outgoingWaterType = 'clean';
                } else if (pipe.pipeType === PipeTypes.PUMP) {
                    currentPressure = 5; 
                }
                
                currOpenings = pipe.getOpenings();
                pipe.setFilled(true, outgoingWaterType);
                pipe.setAlpha(Math.max(0.3, currentPressure / 5));
            }

            if (currentPressure <= 0) continue;

            const nextPressure = currentPressure - 1;

            if (currOpenings.top && curr.y > 0) {
                const neighbor = this.grid[curr.y - 1][curr.x];
                if (neighbor && neighbor.getOpenings().bottom) queue.push({ x: curr.x, y: curr.y - 1, waterType: outgoingWaterType, pressure: nextPressure });
                else if (this.targetPos.some(t => t.x === curr.x && t.y === curr.y - 1)) queue.push({ x: curr.x, y: curr.y - 1, waterType: outgoingWaterType, pressure: nextPressure });
            }
            if (currOpenings.right && curr.x < this.gridSize - 1) {
                const neighbor = this.grid[curr.y][curr.x + 1];
                if (neighbor && neighbor.getOpenings().left) queue.push({ x: curr.x + 1, y: curr.y, waterType: outgoingWaterType, pressure: nextPressure });
                else if (this.targetPos.some(t => t.x === curr.x + 1 && t.y === curr.y)) queue.push({ x: curr.x + 1, y: curr.y, waterType: outgoingWaterType, pressure: nextPressure });
            }
            if (currOpenings.bottom && curr.y < this.gridSize - 1) {
                const neighbor = this.grid[curr.y + 1][curr.x];
                if (neighbor && neighbor.getOpenings().top) queue.push({ x: curr.x, y: curr.y + 1, waterType: outgoingWaterType, pressure: nextPressure });
                else if (this.targetPos.some(t => t.x === curr.x && t.y === curr.y + 1)) queue.push({ x: curr.x, y: curr.y + 1, waterType: outgoingWaterType, pressure: nextPressure });
            }
            if (currOpenings.left && curr.x > 0) {
                const neighbor = this.grid[curr.y][curr.x - 1];
                if (neighbor && neighbor.getOpenings().right) queue.push({ x: curr.x - 1, y: curr.y, waterType: outgoingWaterType, pressure: nextPressure });
                else if (this.targetPos.some(t => t.x === curr.x - 1 && t.y === curr.y)) queue.push({ x: curr.x - 1, y: curr.y, waterType: outgoingWaterType, pressure: nextPressure });
            }
        }

        if (contaminationDetected) {
            this.flashError('CONTAMINATION!\nLEVEL FAILED');
        } else if (targetsReached === this.targetPos.length) {
            this.triggerWin();
        } else {
             const msg = this.add.text(400, 300, 'INCOMPLETE FLOW OR LOW PRESSURE', {
                font: '24px Arial', fill: '#ff0000', backgroundColor: '#000000', padding: {x: 10, y: 10}
            }).setOrigin(0.5).setDepth(20);
            this.time.delayedCall(2000, () => msg.destroy());
        }
    }

    triggerWin() {
        this.levelComplete = true;

        let msg = 'CONGRATULATIONS!\nYOU BEAT AQUACITY ENGINEER!';
        
        this.add.text(400, 300, msg, {
            font: '32px Arial', fill: '#ffff00', backgroundColor: '#0000ff', padding: {x: 20, y: 20}, align: 'center'
        }).setOrigin(0.5).setDepth(20);
    }
}
