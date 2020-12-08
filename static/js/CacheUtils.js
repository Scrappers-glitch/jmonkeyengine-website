export default class Cache {
    static buildFullKey(key){
        key="jme-"+key+"-cache";
        return key;
    }
    static get(key){
        const cacheExpiration=86400000;
        try{
            key=this.buildFullKey(key);
            let item=localStorage.getItem(key);
            if(!item) throw key+" not cached!";
            item=JSON.parse(item);
            if(!item.date|| (Date.now()-item.date )>cacheExpiration)    throw key+" expired!";
            return item.content;            
        }catch(e){
            console.warn(e);
            return undefined;
        }
    }
    static cachedCycle(id,min,max,time){
        const key="cycle-"+id;
        let data=this.get(key);
        if(!data||data.min!=min||data.max!=max){
            console.warn("Invalidate cache",id);
            data={
                time:0,
                min:min,
                max:max,
                value:-1
            };
        }
        if(Date.now()-data.time>time){
            console.warn("Cache exceed the time limit",time);

            data.time=Date.now();
            data.value++;
            if(data.value>max)data.value=min;
        }
        this.set(key,data);
        return data.value;
    }
    static set(key,value){
        try{
            key=this.buildFullKey(key);
            localStorage.setItem(key,JSON.stringify({
                date: Date.now(),
                content:value
            }));          
        }catch(e){
            console.warn(e);
        } 
    }
}
