import { AssetManager, IAsset, IAssetLoader } from "./assetManager";


export class TextAsset implements IAsset {
    public readonly name: string;
    public readonly data: string;
    public constructor(name: string, data: string) {
        this.data = data;
        this.name = name;
    }
}

export class TextAssetLoader implements IAssetLoader {
    public get supportedExtensions(): string[] {
        return ["txt","vs","fs","frag","vert","shader"];
    }

    loadAsset(assetName: string,onComplete?:(res:IAsset)=>{}): void {
        let request = new XMLHttpRequest();
        request.onreadystatechange = ()=>{
            if(request.readyState === XMLHttpRequest.DONE && request.status !== 404){
                let asset = new TextAsset(assetName,request.responseText);
                if(onComplete){
                    AssetManager.onAssetLoaded(asset);
                    onComplete(asset);
                }
            }
        }
        request.open("GET",assetName,true);
        request.send();
    }
}