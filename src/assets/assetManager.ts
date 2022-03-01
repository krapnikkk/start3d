import { EventDispatcher } from "../event/eventDispatcher";
import { ImageAssetLoader } from "./imageLoader";

enum AssetType {
    TEXT = "text",
    IMAGE = "image"
}



export interface IAsset{
    readonly name:string;
    readonly data:any;
}

export interface IAssetLoader{
    readonly supportedExtensions:string[];
    loadAsset(assetName:string,callback:(res:IAsset)=>{}):void;
}


export class AssetManager extends EventDispatcher{
    private static _loaders:IAssetLoader[]=[];
    private static _loaderAssets: { [name: string]: IAsset } = {};

        private constructor() {
            super();
        }

        public static initialize(): void {
            AssetManager._loaders.push(new ImageAssetLoader());
        }

        public static registerLoader(loader: IAssetLoader): void {
            AssetManager._loaders.push(loader);
        }

        public static loadAsset(assetName: string,onComplete:(res:IAsset)=>{}): void {
            if(this._loaderAssets[assetName]){
                if(onComplete){
                    onComplete(this._loaderAssets[assetName]);
                }
                return;
            }
            let extension = assetName.split(".").pop().toLowerCase();
            for (let loader of AssetManager._loaders) {
                if (loader.supportedExtensions.indexOf(extension) !== -1) {
                    loader.loadAsset(assetName,onComplete);
                    return;
                }
            }
            console.warn("Unable to load asset with extension "+extension+"because there is no loader associated with it.")
        }

        public static isAssetLoaded(assetName: string): boolean {
            return AssetManager._loaderAssets[assetName] !== undefined;
        }

        public static getAsset(assetName: string): IAsset {
            if (AssetManager._loaderAssets[assetName] != undefined) {
                return AssetManager._loaderAssets[assetName];
            }
            return undefined;
        }
}