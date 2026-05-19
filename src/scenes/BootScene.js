import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    create() {
        this.generateTextures();
        this.scene.start('Stage01');
    }

    generateTextures() {
        const graphics = this.add.graphics();
        const size = 64;
        const half = size / 2;
        const pipeThickness = 24;
        const pipeOffset = (size - pipeThickness) / 2;

        const drawBase = () => {
            graphics.clear();
            graphics.fillStyle(0x333333);
            graphics.fillRect(0, 0, size, size);
            graphics.lineStyle(2, 0x555555);
            graphics.strokeRect(0, 0, size, size);
        };

        const drawPipeSegment = (x, y, w, h, color = 0x888888) => {
            graphics.fillStyle(color);
            graphics.fillRect(x, y, w, h);
            graphics.lineStyle(2, 0x444444);
            graphics.strokeRect(x, y, w, h);
        };

        // 1. Straight Pipe (Horizontal by default)
        drawBase();
        drawPipeSegment(0, pipeOffset, size, pipeThickness);
        graphics.generateTexture('pipe_straight', size, size);

        // 2. Elbow Pipe (Top to Right)
        drawBase();
        // Top segment
        drawPipeSegment(pipeOffset, 0, pipeThickness, half + pipeThickness / 2);
        // Right segment
        drawPipeSegment(half - pipeThickness / 2, pipeOffset, half + pipeThickness / 2, pipeThickness);
        graphics.generateTexture('pipe_elbow', size, size);

        // 3. T-Junction Pipe (Top, Left, Right)
        drawBase();
        drawPipeSegment(0, pipeOffset, size, pipeThickness); // Left to right
        drawPipeSegment(pipeOffset, 0, pipeThickness, half + pipeThickness / 2); // Top
        graphics.generateTexture('pipe_t', size, size);

        // 4. Source (Well)
        graphics.clear();
        graphics.fillStyle(0x00aaff);
        graphics.fillCircle(half, half, half - 4);
        graphics.lineStyle(4, 0xffffff);
        graphics.strokeCircle(half, half, half - 4);
        graphics.generateTexture('source', size, size);

        // 5. Destination (Garden Plot)
        graphics.clear();
        graphics.fillStyle(0x228b22);
        graphics.fillRect(4, 4, size - 8, size - 8);
        graphics.lineStyle(4, 0x8b4513);
        graphics.strokeRect(4, 4, size - 8, size - 8);
        graphics.generateTexture('garden', size, size);

        // 6. Filled Water Overlay (Blue center)
        graphics.clear();
        graphics.fillStyle(0x00ffff, 0.6);
        graphics.fillCircle(half, half, pipeThickness / 2 - 2);
        graphics.generateTexture('water_overlay', size, size);

        // 7. Empty Cell
        graphics.clear();
        graphics.lineStyle(1, 0x444444);
        graphics.strokeRect(0, 0, size, size);
        graphics.generateTexture('empty_cell', size, size);

        // --- STAGE 02 TEXTURES ---
        // 8. Polluted Source (Lake)
        graphics.clear();
        graphics.fillStyle(0x800080); // Purple
        graphics.fillCircle(half, half, half - 4);
        graphics.lineStyle(4, 0xffffff);
        graphics.strokeCircle(half, half, half - 4);
        graphics.generateTexture('polluted_source', size, size);

        // 9. Polluted Water Overlay
        graphics.clear();
        graphics.fillStyle(0xff00ff, 0.6); // Magenta/Purple
        graphics.fillCircle(half, half, pipeThickness / 2 - 2);
        graphics.generateTexture('polluted_water_overlay', size, size);

        // 10. Sand Filter (Straight Pipe with sand color)
        drawBase();
        drawPipeSegment(0, pipeOffset, size, pipeThickness, 0xddaa55); // Sand color
        graphics.generateTexture('pipe_filter', size, size);

        // --- STAGE 03 TEXTURES ---
        // 11. Hospital (White block with Red Cross)
        graphics.clear();
        graphics.fillStyle(0xffffff);
        graphics.fillRect(4, 4, size - 8, size - 8);
        graphics.fillStyle(0xff0000);
        graphics.fillRect(half - 4, 16, 8, size - 32); // Vertical line
        graphics.fillRect(16, half - 4, size - 32, 8); // Horizontal line
        graphics.lineStyle(4, 0xff0000);
        graphics.strokeRect(4, 4, size - 8, size - 8);
        graphics.generateTexture('hospital', size, size);

        // 12. School (Blue block with yellow text or just blue block)
        graphics.clear();
        graphics.fillStyle(0x4169E1); // Royal Blue
        graphics.fillRect(4, 4, size - 8, size - 8);
        graphics.lineStyle(4, 0xffd700); // Gold border
        graphics.strokeRect(4, 4, size - 8, size - 8);
        graphics.generateTexture('school', size, size);

        // 13. Market (Yellow/Orange block)
        graphics.clear();
        graphics.fillStyle(0xffa500); // Orange
        graphics.fillRect(4, 4, size - 8, size - 8);
        graphics.lineStyle(4, 0x8b4500);
        graphics.strokeRect(4, 4, size - 8, size - 8);
        graphics.generateTexture('market', size, size);

        // --- STAGE 04 TEXTURES ---
        // 14. Water Pump (Grey mechanical block with a circle in the middle)
        drawBase();
        drawPipeSegment(0, pipeOffset, size, pipeThickness, 0x666666); // Dark grey pipe
        graphics.fillStyle(0x444444);
        graphics.fillCircle(half, half, pipeThickness);
        graphics.lineStyle(2, 0x000000);
        graphics.strokeCircle(half, half, pipeThickness);
        graphics.generateTexture('pipe_pump', size, size);

        // --- STAGE 05 TEXTURES ---
        // 15. Industrial Zone (Dark grey block with a smokestack)
        graphics.clear();
        graphics.fillStyle(0x555555); // Dark grey building
        graphics.fillRect(4, 16, size - 8, size - 20);
        graphics.fillStyle(0x333333); // Smokestack
        graphics.fillRect(size - 24, 4, 12, 12);
        graphics.lineStyle(2, 0x222222);
        graphics.strokeRect(4, 16, size - 8, size - 20);
        graphics.generateTexture('industrial', size, size);

        graphics.destroy();
    }
}
