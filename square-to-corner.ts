const w : number = window.innerWidth, h : number = window.innerHeight, size : number = Math.min(w, h)/3
class SquareToCornerStage {

    canvas : HTMLCanvasElement = document.createElement('canvas')

    context : CanvasRenderingContext2D

    constructor() {
        this.initCanvas()
    }

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = '#212121'
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }
}

class State {

    scale : number = 0

    dir : number = 0

    prevScale : number = 0

    update(stopcb : Function) {
        this.scale += this.dir * 0.1
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            stopcb()
        }
    }

    startUpdating(startcb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            startcb()
        }
    }
}


class Animator {

    animated : Boolean = false

    interval : number

    start(updatecb : Function) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(() => {
                updatecb()
            }, 50)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = true
            clearInterval(this.interval)
        }
    }
}

class Square {

    state : State = new State()

    constructor(private i : number){

    }

    draw(context : CanvasRenderingContext2D) {
        const a : number  = (size)/9, x : number = ((i%3)-1) * (a), y : number = (Math.floor(i/3) - 1) * a
        context.fillStyle = '#ecf0f1'
        context.fillRect(x * this.state.scale, y * state.scale, a, a)
    }

    update(stopcb : Function) {
        this.state.update(stopcb)
    }

    startUpdating(startcb : Function) {
        this.state.startUpdating(startcb)
    }
}

class ContainerState {
    private j : number = 0
    private dir : number = 1
    constructor(private n : number) {

    }

    incrementCounter(stopcb : Function) {
        this.j += this.dir
        if (this.j == this.n || this.j == -1) {
            stopcb()
        }
    }

    execute(cb : Function) {
        cb(this.j)
    }
}

class SquareContainer {

    private state : ContainerState = ContainerState(9)

    private squares : Array<Square> = []

    constructor() {
        this.initSquares()
    }

    initSquares() {
        for (var i = 0; i < 9; i++) {
            this.squares.push(new Square(i))
        }
    }

    draw(context : CanvasRenderingContext2D) {
        this.squares.forEach((square) => {
            square.draw(context)
        })
    }

    update(stopcb : Function) {
        this.state.execute(() => {
            this.squares[this.j].update(() => {
                this.state.incrementCounter()
            })
        })
    }

    startUpdating(startcb : Function) {
        this.state.execute(() => {
            this.squares[this.j].startUpdating(startcb)
        })
    }
}
