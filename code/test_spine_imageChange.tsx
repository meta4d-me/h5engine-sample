// import React from "react";
// import { AtlasAttachmentLoader, SkeletonJson, SpineAssetMgr, spineSkeleton } from "../../../src";

// export class ImageChange extends React.Component {

//     componentDidMount(): void {
//         let app = new m4m.framework.application();
//         app.bePlay = true;
//         let div = document.getElementById("container") as HTMLDivElement;
//         app.start(div);
//         let scene = app.getScene();
//         //相机
//         var objCam = new m4m.framework.transform();
//         scene.addChild(objCam);
//         let camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
//         //2dUI root
//         let root2d = new m4m.framework.overlay2D();
//         camera.addOverLay(root2d);
//         this.init(app, root2d);
//     }

//     private init(app: m4m.framework.application, root2d: m4m.framework.overlay2D) {
//         let assetManager = new SpineAssetMgr(app.getAssetMgr(), "./assets/");
//         let skeletonFile = "demos.json";
//         let atlasFile = "atlas1.atlas"
//         let animation = "death";
//         Promise.all([
//             new Promise<void>((resolve, reject) => {
//                 assetManager.loadJson(skeletonFile, () => resolve())
//             }),
//             new Promise<void>((resolve, reject) => {
//                 assetManager.loadTextureAtlas(atlasFile, () => resolve());
//             })])
//             .then(() => {
//                 let atlasLoader = new AtlasAttachmentLoader(assetManager.get(atlasFile));
//                 let skeletonJson = new SkeletonJson(atlasLoader);
//                 skeletonJson.scale = 0.4;
//                 let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).alien);
//                 let comp = new spineSkeleton(skeletonData);
//                 comp.state.setAnimation(0, animation, true);
//                 let spineNode = new m4m.framework.transform2D;
//                 spineNode.addComponentDirect(comp);
//                 root2d.addChild(spineNode);
//             })
//     }
//     render(): React.ReactNode {
//         return <div id="container"></div>
//     }
// }

class test_spine_imageChange implements IState
{
    start(app: m4m.framework.application)
    {
        let scene = app.getScene();
        //相机
        var objCam = new m4m.framework.transform();
        scene.addChild(objCam);
        let camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        //2dUI root
        let root2d = new m4m.framework.overlay2D();
        camera.addOverLay(root2d);
        let assetManager = new spine_m4m.SpineAssetMgr(app.getAssetMgr(), `${resRootPath}spine/`);
        let skeletonFile = "demos.json";
        let atlasFile = "atlas1.atlas"
        let animation = "death";
        Promise.all([
            new Promise<void>((resolve, reject) =>
            {
                assetManager.loadJson(skeletonFile, () => resolve())
            }),
            new Promise<void>((resolve, reject) =>
            {
                assetManager.loadTextureAtlas(atlasFile, () => resolve());
            })])
            .then(() =>
            {
                let atlasLoader = new spine_m4m.AtlasAttachmentLoader(assetManager.get(atlasFile));
                let skeletonJson = new spine_m4m.SkeletonJson(atlasLoader);
                skeletonJson.scale = 0.4;
                let skeletonData = skeletonJson.readSkeletonData(assetManager.get(skeletonFile).alien);
                let comp = new spine_m4m.spineSkeleton(skeletonData);
                //设置播放动画
                comp.state.setAnimation(0, animation, true);
                let spineNode = new m4m.framework.transform2D;
                spineNode.localTranslate.x = root2d.canvas.pixelWidth / 2;
                spineNode.localTranslate.y = root2d.canvas.pixelHeight / 2;
                spineNode.addComponentDirect(comp);
                root2d.addChild(spineNode);
            })
    }
    update(delta: number) { }
}