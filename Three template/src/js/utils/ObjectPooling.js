export default class ObjectPooling {
    constructor(objects) {
        const objs = [];
        
        for(let i = 0; i < objects.length; i++){
            const idx = objs.indexOf(objects[i]);

            if(idx === -1){
                objs.push(objects[i]);
            }
        }

        this.queue = [];
        this.objects = objs;
    }

    add(object) {
        const idx = this.objects.indexOf(object);
        
        if(idx === -1){
            this.objects.push(object);
        }
    
        return this.call();
    }

    call() {
        if(this.objects.length && this.queue.length){
            const fn = this.queue.shift(),
                obj = this.objects.shift();
                
            fn(obj, this);
        }
        
        return this;
    }

    act(fn) {
        this.queue.push(fn);
        
        return this.call();
    }
}
    