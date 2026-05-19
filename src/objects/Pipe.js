import Phaser from 'phaser';

export const PipeTypes = {
    STRAIGHT: 'pipe_straight',
    ELBOW: 'pipe_elbow',
    T_JUNCTION: 'pipe_t',
    FILTER: 'pipe_filter',
    PUMP: 'pipe_pump'
};

export const PipeCosts = {
    [PipeTypes.STRAIGHT]: 0.50,
    [PipeTypes.ELBOW]: 0.50,
    [PipeTypes.T_JUNCTION]: 0.50,
    [PipeTypes.FILTER]: 2.00,
    [PipeTypes.PUMP]: 3.00
};

// Base openings for unrotated pipes
const BaseOpenings = {
    [PipeTypes.STRAIGHT]: [false, true, false, true], // Top, Right, Bottom, Left
    [PipeTypes.ELBOW]: [true, true, false, false],    // Top, Right, Bottom, Left
    [PipeTypes.T_JUNCTION]: [true, true, false, true], // Top, Right, Bottom, Left
    [PipeTypes.FILTER]: [false, true, false, true],   // Top, Right, Bottom, Left
    [PipeTypes.PUMP]: [false, true, false, true]      // Top, Right, Bottom, Left
};

export default class Pipe extends Phaser.GameObjects.Container {
    constructor(scene, x, y, pipeType) {
        super(scene, x, y);
        this.scene = scene;
        this.pipeType = pipeType;
        this.rotations = 0; // 0 to 3, representing 90 degree increments

        // Create the sprite for the pipe
        this.sprite = scene.add.sprite(0, 0, pipeType);
        this.add(this.sprite);

        // Water overlay to show it's filled
        this.waterOverlay = scene.add.sprite(0, 0, 'water_overlay');
        this.waterOverlay.setVisible(false);
        this.add(this.waterOverlay);

        this.setSize(64, 64);
        this.setInteractive();

        // Rotate on click (if not locked in inventory)
        this.on('pointerdown', () => {
            if (this.isDraggable) {
                // If we are dragging, don't rotate. handled in drag events.
            } else {
                this.rotatePipe();
            }
        });
    }

    rotatePipe() {
        this.rotations = (this.rotations + 1) % 4;
        this.sprite.setAngle(this.rotations * 90);
    }

    getOpenings() {
        const base = BaseOpenings[this.pipeType];
        // Shift the array to the right by `this.rotations`
        const openings = [...base];
        for (let i = 0; i < this.rotations; i++) {
            openings.unshift(openings.pop());
        }
        // Returns [top, right, bottom, left]
        return {
            top: openings[0],
            right: openings[1],
            bottom: openings[2],
            left: openings[3]
        };
    }

    setFilled(isFilled, waterType = 'clean') {
        if (!isFilled) {
            this.waterOverlay.setVisible(false);
            return;
        }
        
        if (waterType === 'polluted') {
            this.waterOverlay.setTexture('polluted_water_overlay');
        } else {
            this.waterOverlay.setTexture('water_overlay');
        }
        this.waterOverlay.setVisible(true);
    }
}
