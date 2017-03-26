import { Pnj } from "./game/pnj";
import { Player } from "./game/player";
import { World } from "./world";
import { Map } from "./game/map";
import { GameHud } from "./game/ui";
import { AnimatedSprite } from "./engine/animatedSprite";
import { DEBUGGING } from "./debug";

let stats: Stats | null = null;

if (DEBUGGING) {
    stats = new Stats();
}

export class Game {
    private renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    private world: World;
    private map: Map;
    private player: Player;
    private pnjs: Pnj[];
    private hud: GameHud;

    constructor() {
        if (DEBUGGING) {
            console.log("Loading game in debugging mode !");
            console.log("Zone with mentor desactivated !");
        }
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        this.renderer = PIXI.autoDetectRenderer(800, 600, {
            antialias: false
        });

        document.body.appendChild(this.renderer.view);
        if (stats) {
            stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild( stats.dom );
        }
        this.world = new World(this.renderer);
        this.hud = new GameHud(this.world);

        this.renderer.backgroundColor = 0x061639;
        this.renderer.view.style.border = "1px dashed red";

        let stage = this.world.stage;
        this.load().then(() => this.start());
    }

    private load() {
        PIXI.loader.baseUrl = "./assets/";

        this.hud.preload();

        // LOADING : sprites player & mentor + dialogs.json
        PIXI.loader.add("images/player_f.png");
        PIXI.loader.add("mentor", "images/mentor_ghost.png");
        PIXI.loader.add("dialogs", "dialogs.json");
        // LOADING : creatures
        PIXI.loader.add("grey_wolf", "images/creatures/grey_wolf.png"); // Grey wolf
        PIXI.loader.add("ostrich", "images/creatures/chocobo.png"); // Ostrich
        PIXI.loader.add("bee", "images/creatures/bee.png"); // Bee
        PIXI.loader.add("fish", "images/creatures/fish.png"); // Fish
        PIXI.loader.add("wild_rabbit", "images/creatures/wild_rabbit.png"); // Wild rabbit
        PIXI.loader.add("mouse", "images/creatures/mouse.png"); // Mouse
        PIXI.loader.add("rabbit", "images/creatures/rabbit.png"); // Rabbit (white one)
        PIXI.loader.add("snake", "images/creatures/snake.png"); // Snake
        PIXI.loader.add("butterfly", "images/creatures/butterfly.png"); // Butterfly
        PIXI.loader.add("chicken", "images/creatures/chicken.png"); // Chicken
        PIXI.loader.add("white_wolf", "images/creatures/white_wolf.png"); // White wolf
        PIXI.loader.add("frog", "images/creatures/frog.png"); // Frog

        return new Promise(r => {
            PIXI.loader.load(r);
        }).then(() => this.loadMap("./map.json"))
            .then(() => this.loadPlayer())
            .then(() => this.loadCreatures())
            .then(() => this.loadHud());
    }

    private loadMap(mapName: string) {
        let map = new Map(this.world, mapName);
        this.map = map;
        return map.load();
    }

    private loadPlayer() {
        this.player = new Player(this.world,
                                 PIXI.loader.resources["images/player_f.png"].texture,
                                 this.map.findSpawnZone());
    }

    private loadCreatures() {
        this.pnjs = this.map.loadCreatures(this.player);
    }

    private loadHud() {
        this.hud.setup();
    }

    private start() {
        console.log(this);
        requestAnimationFrame(() => this.gameLoop());
    }

    public gameLoop() {
        requestAnimationFrame(() => this.gameLoop());

        if (stats) {
            stats.begin();
        }

        this.world.updatePhysics();
        this.player.update();
        this.pnjs.forEach(p => p.update());
        this.world.preRender();
        this.world.render();

        if (stats) {
            stats.end();
        }
    }
}
