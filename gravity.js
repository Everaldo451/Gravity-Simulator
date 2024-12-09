
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
        this.horizontalFunc = () => {}
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


    toLeft(intervalDuration) {
        this.left -= parseFloat((this.horizontal_v0*intervalDuration).toFixed(4))
        this.object.style.left = `${this.left}px`
    }

    toRight(intervalDuration) {
        this.left += parseFloat((this.horizontal_v0*intervalDuration).toFixed(4))
        this.object.style.left = `${this.left}px`
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

        Suponha agora o seguinte:

        S = S0 + V0t + a(t**2)/2
        S1 = S0 + V0(t+0,005) + a(t1**2)/2
        S - S1 = V0*0,005 + (g/2)*[t**2 - t1**2] 
        S - S1 = V0*0,005 + (g/2)*(t+t1)*(t-t1) --> t-t1 = 0,005
        S - S1 = V0*0,005 + 0,005*(g/2)*(t+t1)
        S - S1 = V0*0,005 + 0,005*(g/2)*(2t1 + 0,005)
    */
    jump(height=null,width=null,vy0=null,left=false){

        if (this.position=="static"){console.log("Determine uma posição não estática");return}
        if (height==null && vy0==null){console.log("Determine uma velocidade inicial ou altura");return}
        if (height<this.bottom){console.log("insira uma altura maior que a atual");return}

        const element = this.object

        const vertical_v0 = parseFloat(Math.sqrt(20*(height-this.bottom)/this.prop).toFixed(4))
        const v1 = parseFloat(Math.sqrt(20*(height)/this.prop).toFixed(4))

        const t1 = v1/10
        const t2 = vertical_v0/10
        const tempoPrevisto = parseFloat((t1 + t2).toFixed(4))
        
        const intervalDuration=0.005
        //width event

        if (width) {
            let horizontal_duration = parseFloat((vertical_v0/5).toFixed(4))
            this.horizontal_v0 = width/horizontal_duration

            if (left==true) {
                this.horizontalFunc = this.toLeft
            } else if (left==false) {
                this.horizontalFunc = this.toRight
            }
        }

        const time = new Date()

        const verticalVelociyConstant = vertical_v0*intervalDuration
        const gravityConstant = intervalDuration*-5
        let timePassed = 0

        this.jumpinterval = setInterval(()=>{
            if (timePassed>0.5 && this.bottom<0.1) {
                this.horizontalFunc = () => {}
                clearInterval(this.jumpinterval)
                console.log(`tempo previsto:${tempoPrevisto}\n`,`tempo passado:${(new Date() - time)/1000}`)
                return
            }  
            //bottom
            this.bottom += parseFloat(((verticalVelociyConstant + gravityConstant*(2*timePassed+intervalDuration))*this.prop).toFixed(2))
            element.style.bottom = `${this.bottom}px`
            //width event
            this.horizontalFunc(intervalDuration)
            //time add
            timePassed += intervalDuration                 
        },intervalDuration*1000)

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
        const element = this.object

        const vertical_v = parseFloat(Math.sqrt(20*(this.bottom)/this.prop).toFixed(4))
        const tempoPrevisto = vertical_v/10

        const intervalDuration=0.005
        //width event
        if (width) {
            let horizontal_duration = parseFloat((vertical_v0/5).toFixed(4))
            this.horizontal_v0 = width/horizontal_duration

            if (left==true) {
                this.horizontalFunc = this.toLeft
            } else if (left==false) {
                this.horizontalFunc = this.toRight
            }
        }

        const time = new Date()

        const gravityConstant = intervalDuration*-5
        let timePassed = 0

        this.downinterval = setInterval(()=>{
            if (timePassed>0.5 && this.bottom<0.1){
                this.horizontalFunc = () => {}
                clearInterval(this.downinterval)
                console.log(`tempo previsto:${tempoPrevisto}\n`,`tempo passado:${(new Date() - time)/1000}`)
            }
            //bottom
            this.bottom += parseFloat((gravityConstant*(2*timePassed+intervalDuration)).toFixed(2))
            element.style.bottom = `${this.bottom}px`
            //width event
            this.horizontalFunc(intervalDuration)
            //time add
            timePassed += 0.005
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
