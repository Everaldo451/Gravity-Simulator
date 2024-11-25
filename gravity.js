
const x = document.querySelector('div')
console.log(x.style["button"])


class Gravity {
    constructor(object,scale=null) {

        this.prop = scale
        
        if (!object.nodeType){
            return console.log("The selector isn't valid")
            
        }else{
            let text = object.tagName.toLocaleLowerCase()
            let id = object.id
            let classe = object.className
            if (id) {text+=`#${id}`}
            if (classe.search(/\s+/)!=-1 && classe){
                var str = ""
                classe.replace(/\s+/,".")
                {text += `.${classe}`}
            } else if (classe) {text+=`.${classe}`}
            this.selector = text
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
                        //eval("var" + x + " = " + number)
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

    //JUMP METHOD
    jump(height=null,width=null,vy0=null,left=false){

        if (this.position=="static"){return console.log("Determine uma posição não estática")}
        if (height==null && vy0==null){return console.log("Determine uma velocidade inicial ou altura")}
        /*Calcs:
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
        let el = document.querySelector(`${this.selector}`)
        this.prop!=null ? this.vy0 = Number(Math.sqrt(20*(height-this.bottom)/this.prop).toFixed(2)) : this.vy0 = Number(Math.sqrt(20*(height-this.bottom)).toFixed(2))
        this.prop!=null ? this.s0 = Number((this.bottom/this.prop).toFixed(2)):this.s0 = Number((this.bottom).toFixed(2))
        let t =0.005
        //width event
        if (width) {
            this.t= Number((this.vy0/5).toFixed(2))
            this.vx0 = width/this.t
            this.x0 = this.left
        }

        this.jumpinterval = setInterval(()=>{
            //bottom
            this.prop!=null ? this.bottom = Number(((this.s0 + this.vy0*t - 5*(t**2))*this.prop).toFixed(2)):this.bottom = Number(((this.s0 + this.vy0*t - 5*(t**2))).toFixed(2))
            el.style.bottom = `${this.bottom}px`
            //width event
            if (width){
                if (left==true){
                    this.left = Number((-this.vx0*t + this.x0).toFixed(2))
                    el.style.left = `${this.left}px`
                }else{
                    console.log(typeof(this.x0))
                    this.left = Number((this.vx0*t + this.x0).toFixed(2))
                    el.style.left = `${this.left}px`
                }
            }
            //time add
            t += 0.005
            if (t>0.5 && this.bottom<0.1){clearInterval(this.jumpinterval),console.log(this.left.toFixed(2),this.right.toFixed(2),el.style.right)}
            //else if (this.left<0.1 && t>0.01|| this.right<0.1 && t>0.01) {
                //console.log(this.left.toFixed(2),this.right.toFixed(2)),clearInterval(this.interval),this.down()//}                   
        },5)
        this.intervals.push(this.jumpinterval)
    }

    //DOWN METHOD
    down(width=null,left=false){
        if (this.position=="static"){return console.log("Determine uma posição não estática")}
        if (this.bottom<=0){return console.log("determine uma altura válida")}
        //v0^2 = -2aS --> v0 = 20*S
        let el = document.querySelector(`${this.selector}`)
        let t =0.005
        this.prop!=null ? this.s0 = Number((this.bottom/this.prop).toFixed(2)):this.s0 = Number((this.bottom).toFixed(2))
        //width event
        // s = s0 + at2/2 --> 0 = height -5t2 --> t = height/5 raiz
        if (width) {
            this.t= Number((Math.sqrt(this.s0/5)).toFixed(2))
            this.vx0 = width/this.t
            this.x0=this.left
        }

        this.downinterval = setInterval(()=>{
            //bottom
            this.prop!=null ? this.bottom = Number(((this.s0 - 5*(t**2))*this.prop).toFixed(2)):this.bottom = Number(((this.s0 - 5*(t**2))).toFixed(2))
            el.style.bottom = `${this.bottom}px`
            //width event
            if (width){
                if (left==true){
                    this.left = Number((-this.vx0*t + this.x0).toFixed(2))
                    el.style.left = `${this.left}px`
                }else{
                this.left = Number((this.vx0*t + this.x0).toFixed(2))
                el.style.left = `${this.left}px`
                }
            }
            //time add
            t += 0.005
            if (this.bottom<0.1){clearInterval(this.downinterval)}
        },5)
        this.intervals.push(this.downinterval)
    }
    
    //CLEAR METHOD
    clear(interval=null){
        if (interval){clearInterval(interval)}
        else {
            for (const x of this.intervals){
                clearInterval(x)
            }
        }
    }
}

//var y = new Gravity(x,"div")

var y = new Gravity(x,100)

console.log(y.bottom)

x.addEventListener('mousedown', (even)=>{
    if (y.intervals) {y.clear()}
    number = Number(x.style.bottom.slice(0,x.style.bottom.indexOf('px')))
    if (even.offsetX<x.clientWidth/2) {
        y.jump(number+100,200)
    } else {y.jump(number+100,200,null,true)}
})

/*x.addEventListener('mousemove',(even)=>{
    if (even.buttons==1){
        console.log(even.buttons,even.offsetX,x.clientLeft)
        x.style.left = `${even.clientX - x.clientWidth/2}px`
        x.style.top = `${even.clientY - x.clientHeight/2}px`
    }
})*/