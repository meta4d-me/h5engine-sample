type decodeAttribute = { name: string, array: any, itemSize: number };
type decodeIndex = { array: any, itemSize: number };

class test_load_draco implements IState {

    private AttributeIDs = {
        position: 'POSITION',
        normal: 'NORMAL',
        color: 'COLOR',
        uv: 'TEX_COORD'
    }

    private AttributeTypes = {
        position: Float32Array,
        normal: Float32Array,
        color: Float32Array,
        uv: Float32Array
    };


    async start(app: m4m.framework.application) {
        let scene = app.getScene();
        // let obj = m4m.framework.TransformUtil.CreatePrimitive(m4m.framework.PrimitiveType.Cube, app);
        // scene.addChild(obj);
        //initCamera
        let objCam = new m4m.framework.transform();
        scene.addChild(objCam);
        let cam = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        cam.near = 0.01;
        cam.far = 120;
        cam.fov = Math.PI * 0.3;
        objCam.localTranslate = new m4m.math.vector3(0, 15, -15);
        objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
        //相机控制
        let hoverc = cam.gameObject.addComponent("HoverCameraScript") as m4m.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 20;
        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new m4m.math.vector3(0, 0, 0);

        //加一个灯光
        let lNdoe = new m4m.framework.transform();
        const light = lNdoe.gameObject.addComponent("light") as m4m.framework.light;
        light.type = m4m.framework.LightTypeEnum.Direction;
        scene.addChild(lNdoe);

        //加载shader包
        await util.loadShader(app.getAssetMgr());

        //------------------------------------------------------------
        //加载draco JS
        await util.loadJSLib(`lib/draco_decoder.js`);

        //加载 draco mesh
        const _mesh = await this.loadDraco(`${resRootPath}draco/ring.drc`);
        // const _mesh = await this.loadDraco(`${resRootPath}draco/bunny.drc`);

        //包装 渲染节点
        const model = new m4m.framework.transform();
        model.name = "test Draco";
        m4m.math.vec3ScaleByNum(model.localScale, 0.1, model.localScale);
        const mf = model.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
        mf.mesh = _mesh;
        const mr = model.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
        const mat = mr.materials[0] = new m4m.framework.material();
        const sh = app.getAssetMgr().getShader("diffuse_bothside.shader.json");
        mat.setShader(sh);

        //加到场景
        scene.addChild(model);
    }

    /**
     * 创建 引擎 mesh资源
     * @param index 
     * @param attributes    
     * @param resName 
     */
    private makeMesh(index: decodeIndex, attributes: decodeAttribute[], resName = "dracoMesh") {
        let webgl = m4m.framework.sceneMgr.app.webgl;
        // let fileName = fileUrl;
        // let _idx = fileUrl.lastIndexOf("/");
        // if (_idx != -1) { fileName = fileUrl.substring(_idx + 1); }
        // const outMesh = new m4m.framework.mesh(fileName);
        const outMesh = new m4m.framework.mesh();
        const meshData = outMesh.data = new m4m.render.meshData();
        let vfs = 0;
        let vLen = 0;
        let vIdxMap: { [vf: number]: number } = {};
        //收集 顶点格式
        for (let i = 0, len = attributes.length; i < len; i++) {
            const att = attributes[i];
            let _vf: m4m.render.VertexFormatMask;
            switch (att.name) {
                case "position":
                    meshData.pos = [];
                    _vf = m4m.render.VertexFormatMask.Position;
                    vLen = (att.array as Float32Array).length / 3;
                    break;

                case "normal": _vf = m4m.render.VertexFormatMask.Normal; meshData.normal = []; break;
                case "color": _vf = m4m.render.VertexFormatMask.Color; meshData.color = []; break;
                case "uv": _vf = m4m.render.VertexFormatMask.UV0; meshData.uv = []; break;
            }

            vfs |= _vf;
            vIdxMap[_vf] = i;
        }

        meshData.originVF = vfs;
        //所有 顶点数据 填入  meshData
        for (let i = 0; i < vLen; i++) {
            if (vfs & m4m.render.VertexFormatMask.Position) {
                const att = attributes[vIdxMap[m4m.render.VertexFormatMask.Position]];
                const arr = att.array as Float32Array;
                const offset = i * 3;
                meshData.pos.push(new m4m.math.vector3(arr[0 + offset], arr[1 + offset], arr[2 + offset]));
            }
            if (vfs & m4m.render.VertexFormatMask.Normal) {
                const att = attributes[vIdxMap[m4m.render.VertexFormatMask.Normal]];
                const arr = att.array as Float32Array;
                const offset = i * 3;
                meshData.normal.push(new m4m.math.vector3(arr[0 + offset], arr[1 + offset], arr[2 + offset]));
            }
            if (vfs & m4m.render.VertexFormatMask.Color) {
                const att = attributes[vIdxMap[m4m.render.VertexFormatMask.Color]];
                const arr = att.array as Float32Array;
                const offset = i * 4;
                meshData.color.push(new m4m.math.color(arr[0 + offset], arr[1 + offset], arr[2 + offset], arr[3 + offset]));
            }
            if (vfs & m4m.render.VertexFormatMask.UV0) {
                const att = attributes[vIdxMap[m4m.render.VertexFormatMask.UV0]];
                const arr = att.array as Float32Array;
                const offset = i * 2;
                meshData.uv.push(new m4m.math.vector2(arr[0 + offset], arr[1 + offset]));
            }
        }

        //三角面索引 处理
        const triIndexArr = index.array as Uint32Array;
        const _triIndexNums = meshData.trisindex = [];
        for (let i = 0, len = triIndexArr.length / 3; i < len; i++) {
            const offset = i * 3;
            _triIndexNums.push(triIndexArr[0 + offset], triIndexArr[1 + offset], triIndexArr[2 + offset]);
        }

        //加一个 submesh
        const _subMeshInfo = new m4m.framework.subMeshInfo();
        outMesh.submesh.push(_subMeshInfo);
        _subMeshInfo.size = _triIndexNums.length;
        _subMeshInfo.start = 0;
        _subMeshInfo.matIndex = 0;

        //glMesh 处理 设置webgl状态 将数据设置到 GPU
        const glMesh = outMesh.glMesh = new m4m.render.glMesh();
        const vertexs = meshData.genVertexDataArray(meshData.originVF);
        const indices = meshData.genIndexDataArray();

        glMesh.initBuffer(webgl, meshData.originVF, meshData.pos.length);
        glMesh.uploadVertexData(webgl, vertexs);
        glMesh.addIndex(webgl, indices.length);
        glMesh.uploadIndexData(webgl, 0, indices);
        glMesh.initVAO();

        return outMesh;
    }

    /**
     * 加载draco 格式mesh
     * @param fileUrl draco文件
     * @returns mesh
     */
    private async loadDraco(fileUrl: string): Promise<m4m.framework.mesh> {
        //加载draco 数据
        const buf = await util.loadArrayBuffer(fileUrl);
        const u8Buf = new Uint8Array(buf);

        //创建 draco decoder
        const draco = await globalThis.DracoDecoderModule();
        const buffer = new draco.DecoderBuffer();
        buffer.Init(u8Buf, u8Buf.length);

        //创建一个容纳解码数据的缓存器
        const decoder = new draco.Decoder();
        const geometryType = decoder.GetEncodedGeometryType(buffer);

        // 解码 draco 的 几何结构.
        let outputGeometry;
        let status;
        if (geometryType == draco.TRIANGULAR_MESH) {
            outputGeometry = new draco.Mesh();
            status = decoder.DecodeBufferToMesh(buffer, outputGeometry);
        } else {
            outputGeometry = new draco.PointCloud();
            status = decoder.DecodeBufferToPointCloud(buffer, outputGeometry);
        }

        //检查解码解析是否成功
        if (!status.ok() || status.ptr === 0) {
            throw new Error(`draco 解码失败 URL : ${buf},error: ${status.error_msg()}`);
        }

        let attributes: decodeAttribute[] = [];
        //收集 所有的 顶点 attributes.
        for (const attName in this.AttributeIDs) {
            const attType = this.AttributeTypes[attName];

            const attributeID = decoder.GetAttributeId(outputGeometry, draco[this.AttributeIDs[attName]]);;
            if (attributeID === -1) continue;    //不包含该att
            const attribute = decoder.GetAttribute(outputGeometry, attributeID);
            const decodeAtt = this.getDecodeAttribute(draco, decoder, outputGeometry, attName, attType, attribute);
            attributes.push(decodeAtt);
        }

        let index: decodeIndex;
        //收集 index
        if (geometryType == draco.TRIANGULAR_MESH) {
            index = this.getDecodeIndex(draco, decoder, outputGeometry);
        }

        //销毁draco
        draco.destroy(outputGeometry);
        draco.destroy(decoder);
        draco.destroy(buffer);

        //生成 引擎mesh
        let fileName = fileUrl;
        let _idx = fileUrl.lastIndexOf("/");
        if (_idx != -1) { fileName = fileUrl.substring(_idx + 1); }
        let outMesh = this.makeMesh(index, attributes, fileName);

        return outMesh;
    }

    /**
     * 获取解码索引
     * @param draco draco
     * @param decoder 解码器
     * @param dracoGeometry draco几何体
     * @returns decodeIndex
     */
    private getDecodeIndex(draco, decoder, dracoGeometry): decodeIndex {

        const numFaces = dracoGeometry.num_faces();
        const numIndices = numFaces * 3;
        const byteLength = numIndices * 4;

        const ptr = draco._malloc(byteLength);
        decoder.GetTrianglesUInt32Array(dracoGeometry, byteLength, ptr);
        const index = new Uint32Array(draco.HEAPF32.buffer, ptr, numIndices).slice();
        draco._free(ptr);

        return { array: index, itemSize: 1 };

    }

    /**
     * 获取解码属性
     * @param draco draco
     * @param decoder 解码器
     * @param dracoGeometry draco几何体
     * @param attributeName 属性名
     * @param attributeType 属性类型
     * @param attribute 属性
     * @returns 解码属性
     */
    private getDecodeAttribute(draco, decoder, dracoGeometry, attributeName: string, attributeType, attribute): decodeAttribute {
        const numComponents = attribute.num_components();
        const numPoints = dracoGeometry.num_points();
        const numValues = numPoints * numComponents;
        const byteLength = numValues * attributeType.BYTES_PER_ELEMENT;
        const dataType = this.getDracoDataType(draco, attributeType);

        const ptr = draco._malloc(byteLength);
        decoder.GetAttributeDataArrayForAllPoints(dracoGeometry, attribute, dataType, byteLength, ptr);
        const array = new attributeType(draco.HEAPF32.buffer, ptr, numValues).slice();
        draco._free(ptr);

        return {
            name: attributeName,
            array: array,
            itemSize: numComponents
        };
    }

    /**
     * 获取draco数据类型
     * @param draco draco
     * @param attributeType 属性类型
     */
    private getDracoDataType(draco, attributeType) {
        switch (attributeType) {
            case Float32Array: return draco.DT_FLOAT32;
            case Int8Array: return draco.DT_INT8;
            case Int16Array: return draco.DT_INT16;
            case Int32Array: return draco.DT_INT32;
            case Uint8Array: return draco.DT_UINT8;
            case Uint16Array: return draco.DT_UINT16;
            case Uint32Array: return draco.DT_UINT32;
        }
    }

    update(delta: number) {

    }

}