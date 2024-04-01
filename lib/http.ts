export const http = {
    get:(url:string)=>{
        return fetch(url).then(res=>res.json());
    }
}