import { AssetManager, IAsset, IAssetLoader } from "./assetManager";


export class ImageAsset implements IAsset {
    public readonly name: string;
    public readonly data: HTMLImageElement;
    public constructor(name: string, data: HTMLImageElement) {
        this.data = data;
        this.name = name;
    }
    public get width(): number {
        return this.data.width;
    }

    public get height(): number {
        return this.data.height;
    }
}

export class ImageAssetLoader implements IAssetLoader {
    public get supportedExtensions(): string[] {
        return ["png", "jpg", "jpeg"];
    }

    loadAsset(assetName: string,onComplete:(res:IAsset)=>{}): void {
        let image: HTMLImageElement = new Image();
        image.onload = ()=>{
            let asset = new ImageAsset(assetName,image);
            AssetManager.onAssetLoaded(asset);
            onComplete(asset);
        };
        image.src = assetName;
    }
}