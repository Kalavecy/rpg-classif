export class World {
    public readonly stage: PIXI.Container;
    public readonly uiStage: PIXI.Container;

    private root: PIXI.Container;

    private cameraTarget: PIXI.DisplayObject;

    constructor(
        public readonly renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer
    ) {
        this.stage = new PIXI.Container();
        this.uiStage = new PIXI.Container();
        this.root = new PIXI.Container();
        this.root.addChild(this.stage);
        this.root.addChild(this.uiStage);
    }

    public render() {
        this.renderer.render(this.root);
    }

    public cameraFollow(target: PIXI.DisplayObject) {
        this.cameraTarget = target;
    }

    public update() {
        if (this.cameraTarget) {
            this.stage.x = -this.cameraTarget.x + this.renderer.width / 2;
            this.stage.y = -this.cameraTarget.y + this.renderer.height / 2;
        }
    }
}