/** 加载分步资源包 */
class test_f4skin implements IState {
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    camera: m4m.framework.camera;

    boneConfig(bone: m4m.framework.transform, yOffset = 4, rotate = 10) {
        const mf = bone.gameObject.addComponent('meshFilter') as m4m.framework.meshFilter;
        mf.mesh = this.app.getAssetMgr().getDefaultMesh("cube");
        const mr = bone.gameObject.addComponent('meshRenderer') as m4m.framework.meshRenderer;

        bone.localTranslate.x = yOffset;
        // m4m.math.quatFromEulerAngles(0, 0, rotate, bone.localRotate);
        bone.markDirty();
    }

    assembSkeleton(segment: number) {
        let bones: m4m.framework.transform[] = [];
        for (let i = 0; i < segment; i++) {
            const bone = new m4m.framework.transform();
            bone.name = 'bone_' + i;
            bones[i] = bone;
            if (i) {
                this.boneConfig(bone);
                const parent = bones[i - 1];
                parent.addChild(bone);
            } else {
                this.boneConfig(bone, 0);
                // bone.localTranslate.z = 0.5;
            }
        }
        return bones;
    }

    createMesh(ctx: WebGLRenderingContext) {
        let mesh = new m4m.framework.mesh();

        const NumVertsPerRow = 5;
        const NumVertsPerCol = 2;
        const CellSpacing = 2;

        const boneAmount = 3;

        let _NumCellsPerRow;
        let _NumCellsPerCol;
        let _Width;
        let _Depth;
        let _NumVertices;
        let _NumTriangles;

        _NumCellsPerRow = NumVertsPerRow - 1;
        _NumCellsPerCol = NumVertsPerCol - 1;
        _Width = _NumCellsPerRow * CellSpacing;
        _Depth = _NumCellsPerCol * CellSpacing;
        _NumVertices = NumVertsPerRow * NumVertsPerCol;
        _NumTriangles = _NumCellsPerRow * _NumCellsPerCol * 2;

        let data = mesh.data = new m4m.render.meshData();

        let _Vertices: m4m.math.vector3[] = data.pos = [];
        // let _UV: m4m.math.vector2[] = data.uv = [];
        // let _UV2: m4m.math.vector2[] = data.uv2 = [];
        let _Colours: m4m.math.vector4[] = data.color = [];
        let _BoneIndex: m4m.math.vector4[] = data.blendIndex = [];
        let _BoneWeight: m4m.math.vector4[] = data.blendWeight = [];
        let _Indices = data.trisindex = [];

        const StartZ = -1;
        const EndZ = _Depth;
        const StartX = 0;
        // const StartX = -(_Width / 2);
        const EndX = _Width;
        // const EndX = _Width / 2;

        const fUI = _NumCellsPerRow * 0.5 / _NumCellsPerRow;
        const fVI = _NumCellsPerCol * 0.5 / _NumCellsPerCol;

        let i = 0;

        let fWaterStep = 0.0;

        const bw = [
            [1, 0, 0, 0],
            [0.7, 0.3, 0, 0],
            [0.5, 0.5, 0, 0],
            [0, 0.6, 0.4, 0],
            [0, 0, 1, 0],
        ]
        const bi = [
            [0, 1, 2, 3],
            [0, 1, 2, 3],
            [0, 1, 2, 3],
            [0, 1, 2, 3],
            [0, 1, 2, 3],
        ];

        for (let z = StartZ; z <= EndZ; z += CellSpacing) {
            let j = 0;

            for (let x = StartX; x <= EndX; x += CellSpacing) {
                let iIndex = i * NumVertsPerRow + j;

                _Vertices[iIndex] = new m4m.math.vector3();
                _Colours[iIndex] = new m4m.math.vector4();
                _BoneIndex[iIndex] = new m4m.math.vector4();
                _BoneWeight[iIndex] = new m4m.math.vector4();
                // _UV[iIndex] = new m4m.math.vector2();
                // _UV2[iIndex] = new m4m.math.vector2();

                _Vertices[iIndex].x = x;
                _Vertices[iIndex].y = 0;
                _Vertices[iIndex].z = z;
                console.log('j ' + j);
                console.log('x ' + x);


                _BoneWeight[iIndex].x = _Colours[iIndex].x = bw[j][0];
                _BoneWeight[iIndex].y = _Colours[iIndex].y = bw[j][1];
                _BoneWeight[iIndex].z = _Colours[iIndex].z = bw[j][2];
                _BoneWeight[iIndex].w = bw[j][3];
                _Colours[iIndex].w = 1;

                _BoneIndex[iIndex].x = bi[j][0];
                _BoneIndex[iIndex].y = bi[j][1];
                _BoneIndex[iIndex].z = bi[j][2];
                _BoneIndex[iIndex].w = bi[j][3] = 1;
                // const absZ = Math.abs(z);
                // if(absZ < 1.0 && absZ >= 0.0) {
                //     _Colours[iIndex].y = 0;
                // }

                // _Colours[iIndex].x = Math.sin(fWaterStep);
                // // fWaterStep += 0.01 + this.RandomRange(0.01, 0.02);
                // _Colours[iIndex].z = 1; // Unnecessary

                // _Vertices[iIndex].z = z;

                // _UV[iIndex].x = j * fUI;
                // _UV[iIndex].y = i * fVI;
                // _UV2[iIndex].x = j * fUI;
                // _UV2[iIndex].y = i * fVI;

                ++j;
            }

            // fWaterStep += 0.3 + this.RandomRange(0.1, 1.4);
            ++i;
        }

        let iBaseIndex = 0;
        for (let i = 0; i < _NumCellsPerCol; ++i) {
            for (let j = 0; j < _NumCellsPerRow; ++j) {
                _Indices[iBaseIndex] = i * NumVertsPerRow + j;
                _Indices[iBaseIndex + 1] = i * NumVertsPerRow + j + 1;
                _Indices[iBaseIndex + 2] = (i + 1) * NumVertsPerRow + j;

                _Indices[iBaseIndex + 3] = (i + 1) * NumVertsPerRow + j;
                _Indices[iBaseIndex + 4] = i * NumVertsPerRow + j + 1;
                _Indices[iBaseIndex + 5] = (i + 1) * NumVertsPerRow + j + 1;

                iBaseIndex += 6;
            }
        }
        // this._Vertices = _Vertices;
        // this._UV = _UV;
        // this._UV2 = _UV2;
        // this._Colours = _Colours;
        // this._Indices = _Indices;
        // this._Position = this.m_transform.localTranslate;



        // Update mesh
        // const mf = this.gameObject.getComponent('meshFilter') as m4m.framework.meshFilter;
        mesh.glMesh = new m4m.render.glMesh();
        let vf = m4m.render.VertexFormatMask.Position
            | m4m.render.VertexFormatMask.Color
            | m4m.render.VertexFormatMask.BlendIndex4
            | m4m.render.VertexFormatMask.BlendWeight4;
        mesh.glMesh.initBuffer(ctx, vf, _Vertices.length, m4m.render.MeshTypeEnum.Dynamic);

        // create binary buffer
        const bs = 3 + 4 + 4 + 4;	// byteStride
        // const bs = 3 + 4;	// byteStride
        // const bs = 3 + 4 + 4;	// byteStride
        let vbo = new Float32Array(_Vertices.length * bs);
        for (let v = 0; v < _Vertices.length; v++) {
            let cur = vbo.subarray(v * bs); // offset
            let position = cur.subarray(0, 3);
            let color = cur.subarray(3, 7);
            let boneIndex = cur.subarray(7, 11);
            let boneWeight = cur.subarray(11, 15);
            // let uv = cur.subarray(7, 9);
            // let uv2 = cur.subarray(9);
            position[0] = _Vertices[v].x;
            position[1] = _Vertices[v].y;
            position[2] = _Vertices[v].z;

            boneIndex[0] = _BoneIndex[v].x;
            boneIndex[1] = _BoneIndex[v].y;
            boneIndex[2] = _BoneIndex[v].z;
            boneIndex[3] = _BoneIndex[v].w;

            boneWeight[0] = _BoneWeight[v].x;
            boneWeight[1] = _BoneWeight[v].y;
            boneWeight[2] = _BoneWeight[v].z;
            boneWeight[3] = _BoneWeight[v].w;

            color[0] = _Colours[v].x;
            color[1] = _Colours[v].y;
            color[2] = _Colours[v].z;
            color[3] = _Colours[v].w;
            // uv[0] = _UV[v].x;
            // uv[1] = _UV[v].y;
            // uv2[0] = _UV2[v].x;
            // uv2[1] = _UV2[v].y;
        }
        let ebo = new Uint16Array(_Indices);

        mesh.glMesh.uploadVertexData(ctx, vbo);
        mesh.glMesh.addIndex(ctx, ebo.length);
        mesh.glMesh.uploadIndexData(ctx, 0, ebo);

        mesh.submesh = [];
        let sm = new m4m.framework.subMeshInfo();
        sm.matIndex = 0;
        sm.useVertexIndex = 0;
        sm.start = 0;
        sm.size = ebo.length;
        sm.line = false;
        mesh.submesh.push(sm);

        mesh.glMesh.uploadIndexSubData(ctx, 0, ebo);

        return mesh;
    }


    async start(app: m4m.framework.application) {
        console.log("i am here.");
        this.app = app;
        this.scene = this.app.getScene();
        m4m.framework.assetMgr.openGuid = false;
        //添加一个摄像机
        var objCam = new m4m.framework.transform();
        objCam.name = "sth.";
        this.scene.addChild(objCam);
        this.camera = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        this.camera.near = 0.01;
        this.camera.far = 100;
        objCam.localTranslate = new m4m.math.vector3(0, 10, -10); //?
        objCam.markDirty();//标记为需要刷新
        await util.loadShader(app.getAssetMgr());

        const sample = new m4m.framework.transform();
        // mf.mesh = this.app.getAssetMgr().getDefaultMesh("cube");
        // const mr = sample.gameObject.addComponent('meshRenderer') as m4m.framework.meshRenderer;
        const mr = sample.gameObject.addComponent('f4skinnedMeshRenderer') as m4m.framework.f4skinnedMeshRenderer;
        mr.materials = [];
        mr.materials[0] = new m4m.framework.material('mat');
        // debugger
        mr.materials[0].setShader(this.app.getAssetMgr().getShader("f4skin.shader.json"));
        mr.mesh = this.createMesh(this.app.webgl);

        let joints = this.assembSkeleton(3);

        this.scene.addChild(sample);
        this.scene.addChild(joints[0]);

        this.bones = mr.bones = joints;
        mr.initStaticPoseMatrices();
        mr.initBoneMatrices();
        // mr.materials[0].setTexture("boneSampler", mr.boneMatricesTexture);


        objCam.lookat(sample);
        // PF_PlayerSharkAlien
        // PF_EnemySharkAlien

        let loadNameRes = "PF_PlayerSharkAlien";
        // let loadNameRes = "DragonHigh_prefab_boss";
        await util.loadModel(this.app.getAssetMgr(), loadNameRes);
        let pf = (this.app.getAssetMgr().getAssetByName(`${loadNameRes}.prefab.json`, `${loadNameRes}.assetbundle.json`) as m4m.framework.prefab).getCloneTrans();

        let orig = pf.clone();
        this.scene.addChild(orig);
        let [anip11] = orig.gameObject.getComponentsInChildren("keyFrameAniPlayer") as m4m.framework.keyFrameAniPlayer[];
        // anip11.play();
        let cName = anip11.clips[0].getName();
        anip11.play(cName);
        // this.scene.addChild(pf);
        let [f4, f5] = pf.gameObject.getComponentsInChildren('f4skinnedMeshRenderer') as m4m.framework.f4skinnedMeshRenderer[];
        f4.materials[0].setShader(this.app.getAssetMgr().getShader("f4skin.shader.json"));

        pf.gameObject.getComponentsInChildren("ParticleSystem").forEach(v => {
            var ps = (<m4m.framework.ParticleSystem>v);
            ps.main.loop = true;
            ps.play();
        });

        let anim = f5.gameObject.transform.parent;
        anim.parent.removeChild(anim);
        f4.bones[3].addChild(anim);
        pf.localTranslate.x = 0;
        pf.localTranslate.z -= 2;
        pf.localTranslate.y = 4;
        console.log(f4)
        window['f4'] = f4;
        window['f5'] = f5;
        this.f4 = pf;
        let [anip, anip2] = pf.gameObject.getComponentsInChildren("keyFrameAniPlayer") as m4m.framework.keyFrameAniPlayer[];
        console.log(anip)
        console.log(anip2)
        // anip.playByName('bite.keyframeAniclip.json');
        // anip2.play();
        anip.play();
        window['anip'] = anip2;

        let bite = (value = 190) => {
            anip.rewind();
            anip.play('bite.keyframeAniclip.json');
            setTimeout(() => {
                anip2.rewind();
                anip2.play();
            }, value);
        }
        window['bite'] = bite;
        app.showFps();
    }

    bones: m4m.framework.transform[];
    f4: m4m.framework.transform;

    rotate(bone: m4m.framework.transform, valuey: number, valuez: number) {
        m4m.math.quatFromEulerAngles(0, valuey, valuez, bone.localRotate);
    }

    timer: number = 0;
    update(delta: number) {
        this.timer += delta;
        if (this.bones && this.bones.length) {
            this.rotate(this.bones[0], Math.sin(this.timer * 2) * 50, Math.cos(this.timer * 4) * 40 * 0);
            this.rotate(this.bones[1], Math.sin(this.timer * 2) * 80, Math.cos(this.timer * 4) * -80 * 0);
            this.rotate(this.bones[2], Math.sin(this.timer * 2) * 60, Math.cos(this.timer * 4) * 80 * 0);
        }
        if (window['f4']) {
            m4m.math.quatFromEulerAngles(0, this.timer * 10, 0, this.f4.localRotate);
        }
    }
}