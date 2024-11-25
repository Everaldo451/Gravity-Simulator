
const x = document.querySelector('div')
console.log(x.style["button"])


class Gravity {
    constructor(object,scale=1) {

        /*
        O parâmetro "scale" tem como próposito permitir que seja simulada a gravidade em diferentes escalas
        métricas. Por exemplo, ao dizer que a escala é 100, isso equivale a dizer que, neste código, 100 pixels
        equivalem a 1 metro. Da mesma forma, com a escala 1, 1 pixel passa a ser o equivalente a 1 metro, de
        forma que se tornaria possível até mesmo simular a queda livre de um objeto a uma altura de
        1000 metros.
        */
        this.prop = scale
        
        if (!object.nodeType){
            return console.log("The selector isn't valid")
        }

        if (!object.style.right && !object.style.left){
            return console.log("The object hasn't correct coordenates")
        } else if (!object.style.bottom && !object.style.top) {
            return console.log("The object hasn't correct coordenates")}

        this.object = object
        this.parent = object.parentElement
        this.position = object.style.position
        this.intervals = []

        const coords = ["bottom","right","top","left"]

        for (const x of coords) {


            if (object.style[x]){
                //Verifica se da pra transformar em número
                if (isNaN(Number(object.style[x]))) {
                    //Verifica se tem pixel
                    if (object.style[x].search('px')!=-1){

                        let number = Number(object.style[x].slice(0,eval("object.style." + x).indexOf('px')))
                        this[x] = number 

                    } else if (object.style[x]!=-1) {

                        let number = Number(object.style[x].slice(0,object.style[x].indexOf('%')))
                        console.log(number, x)

                        if (Number.isInteger(coords.indexOf(x)/2)) {
                            number = Number(((number/100) * this.parent.clientHeight).toFixed(2))
                        }
                        else {
                            number = Number(((number/100) * this.parent.clientWidth).toFixed(2))
                        }
                        this[x] = number

                    }
                }

                console.log(x,this[x])
            }
        }
       
        this.objheight = object.clientHeight
        this.objwidth = object.clientWidth

            if(!this.bottom && this.bottom!=0){
                this.bottom = this.parent.clientHeight - this.objheight - this.top
                console.log(this.top, this.parent.clientHeight,this.objheight,this.bottom)
            }

            
            if(!this.left && this.left!=0){
                this.left = this.parent.clientWidth - this.objwidth - this.right
                console.log(this.left, this.parent.clientWidth,this.objwidth,this.right)
            }

            if(!this.right && this.right!=0){
                this.right = this.parent.clientWidth - this.objwidth - this.left
                console.log(this.left, this.parent.clientWidth,this.objwidth,this.right)
            }
    }


    toLeft(el, t, self) {
        self.left = Number((-self.vx0*t + self.x0).toFixed(2))
        el.style.left = `${self.left}px`
    }

    toRight(el, t, self) {
        self.left = Number((self.vx0*t + self.x0).toFixed(2))
        el.style.left = `${self.left}px`
    }


    //JUMP METHOD
    /*
    Esse método é responsável pelos lançamentos, seja oblíquos ou retilíneos
    Cálculos:
        v1^2 = v0^2 + 2aS
        0 = v0^2 + 2aS
        -v0^2 = 2aS

        a = g = -10

        -v0^2 = -20S

        Onde v é a velocidade no ponto de altura máxima, ou seja:
        S = height - this.bottom
        ou
        S = (heigh - this.bottom)/this.props
    */
    jump(height=null,width=null,vy0=null,left=false){

        if (this.position=="static"){console.log("Determine uma posição não estática");return}
        if (height==null && vy0==null){console.log("Determine uma velocidade inicial ou altura");return}
        if (height - this.bottom < 0){console.log("insira uma altura maior que a atual");return}

        let el = this.object
        this.vy0 = Number(Math.sqrt(20*(height-this.bottom)/this.prop).toFixed(2))
        this.s0 = Number((this.bottom/this.prop).toFixed(2))

        const v1 = Number(Math.sqrt(20*(height)/this.prop).toFixed(2))
        const t1 = v1/10
        const t2 = this.vy0/10
        const tempoPrevisto = Number((t1 + t2).toFixed(2))
        
        let horizontalFunc = (el, t, self) => {}
        let t =0.005
        //width event

        if (width) {
            this.t = Number((this.vy0/5).toFixed(2))
            this.vx0 = width/this.t
            this.x0 = this.left

            if (left==true) {
                horizontalFunc = this.toLeft
            } else {
                horizontalFunc = this.toRight
            }
        }

        const time = new Date()

        this.jumpinterval = setInterval(()=>{
            //bottom
            this.bottom = Number(((this.s0 + this.vy0*t - 5*(t**2))*this.prop).toFixed(2))
            el.style.bottom = `${this.bottom}px`
            //width event
            horizontalFunc(el, t, this)
            //time add
            t += 0.005
            if (t>0.5 && this.bottom<0.1){
                clearInterval(this.jumpinterval)
                console.log(`tempo previsto:${tempoPrevisto}\n`,`tempo passado:${(new Date() - time)/1000}`)
            }                   
        },5)
        this.intervals.push(this.jumpinterval)
    }

    //DOWN METHOD
    /*
    Esse método simplesmente simula queda livre ou lançamentos, 
    mas não aqueles que são para cima
    */
    down(width=null,left=false){

        if (this.position=="static"){return console.log("Determine uma posição não estática")}
        if (this.bottom<=0){return console.log("determine uma altura válida")}
        //v0^2 = -2aS --> v0 = 20*S
        let el = this.object
        this.s0 = Number((this.bottom/this.prop).toFixed(2))

        let horizontalFunc = (el, t, self) => {}
        let t =0.005
        //width event
        // s = s0 + at2/2 --> 0 = height -5t2 --> t = height/5 raiz
        if (width) {
            this.t= Number((Math.sqrt(this.s0/5)).toFixed(2))
            this.vx0 = width/this.t
            this.x0=this.left

            if (left==true) {
                horizontalFunc = this.toLeft
            } else {
                horizontalFunc = this.toRight
            }
        }

        this.downinterval = setInterval(()=>{
            //bottom
            this.bottom = Number(((this.s0 - 5*(t**2))*this.prop).toFixed(2))
            el.style.bottom = `${this.bottom}px`
            //width event
            horizontalFunc(el, t, this)
            //time add
            t += 0.005
            if (t>0.5 && this.bottom<0.1){clearInterval(this.downinterval)}
        },5)
        this.intervals.push(this.downinterval)
    }
    
    //CLEAR METHOD
    /*
    Esse método faz com que a execução de todos os métodos da classe seja interrompida
    */
    clear(interval=null){
        if (interval){clearInterval(interval)}
        else {
            for (const x of this.intervals){
                clearInterval(x)
            }
        }
    }
}

var y = new Gravity(x,100)

console.log(y.bottom)

/* Essa é uma forma de uso interessante: ao clicar em um dos lados do quadrado ele pula na direção oposta.
*/

x.addEventListener('mousedown', (even)=>{
    if (y.intervals) {y.clear()}
    number = Number(x.style.bottom.slice(0,x.style.bottom.indexOf('px')))
    if (even.offsetX<x.clientWidth/2) {
        y.jump(number+100,200)
    } else {y.jump(number+100,200,null,true)}
})
