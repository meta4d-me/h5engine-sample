
/** HDR + glTF 样例 */
class HDR_sample implements IState {
    dec: string = "GLTF HDR";
    isEnableGUI: boolean = true;
    /** 是否显示 实时灯源模型 */
    isShowLightModel: boolean = false;
    app: m4m.framework.application;
    scene: m4m.framework.scene;
    assetMgr: m4m.framework.assetMgr;
    sceneConfig = `
    {"preZ":true,"materials":[{"name":"floor_wood","transparent":false,"color":"#8f4117","emission":"#000000","alpha":1,"alphaCutoff":0.23,"emissionIntensity":1,"uvRepeat":[20,20],"parallaxOcclusionScale":0,"diffuseMap":"floor_wood.png","normalMap":"floor_wood_nm.png","parallaxOcclusionMap":"","emissiveMap":"","metalness":0.33,"roughness":0.64,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["RongGallery"]},{"name":"Tiles_Color","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":[10,10],"parallaxOcclusionScale":0.08,"diffuseMap":"Tiles_Color.png","normalMap":"Tiles_Normal.png","parallaxOcclusionMap":"","emissiveMap":"","metalness":0.8,"roughness":0.88,"metalnessMap":"Marble01_Roughness.png","roughnessMap":"Marble01_Roughness.png","type":"pbrMetallicRoughness","targetMeshes":["RongGallery$1"]},{"name":"LiRirong","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"LiRirong.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["RongGallery$2"]},{"name":"Bottom","transparent":false,"color":"#262626","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"black.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["RongGallery$3","RongGallery$5","RongGallery$7","RongGallery$9","Wall$1"]},{"name":"Glass1","transparent":true,"color":"#006e9f","emission":"#000000","alpha":0.503501952,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["RongGallery$4"]},{"name":"Spontaneouslight","transparent":false,"color":"#ececec","emission":"#0e0e0d","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":[1,1],"parallaxOcclusionScale":0.02,"diffuseMap":"Spontaneouslight.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"Spontaneouslight.png","metalness":0.72,"roughness":0.4,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["RongGallery$6","RongGallery$8","RongGallery$10","Top2"]},{"name":"Wall2","transparent":false,"color":"#919191","emission":"#000000","alpha":1,"alphaCutoff":0.65,"emissionIntensity":23.8,"uvRepeat":[3,3],"parallaxOcclusionScale":0.04,"diffuseMap":"Wall_White1.png","normalMap":"Wall_White_nm.png","parallaxOcclusionMap":"","emissiveMap":"","metalness":0.32,"roughness":0.24,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["RongGallery$11","Top","Wall"]},{"name":"wall_blue","transparent":false,"color":"#bad2f5","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":[8,8],"parallaxOcclusionScale":0.01,"diffuseMap":"wall_blue.png","normalMap":"wall_nm.png","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":1,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["outWall1","Wall$2"]},{"name":"Gallery_text","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"Gallery_text.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0.21699999272823334,"roughness":0.7650000005960464,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Gallery_text"]},{"name":"threshold","transparent":false,"color":"#6a6a6a","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"black.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0.07500000298023224,"roughness":0.17799997329711914,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["threshold (1)","threshold"]},{"name":"wood_d","transparent":false,"color":"#733232","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":200,"uvRepeat":[2,2],"parallaxOcclusionScale":0.05,"diffuseMap":"wood_d.png","normalMap":"wood_Normal.png","parallaxOcclusionMap":"","emissiveMap":"","metalness":0.4,"roughness":0.45,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Chair (3)","Chair (4)","Chair (5)","Chair (6)","Chair (7)","Chair (8)","Chair (9)","Chair (10)","Chair (11)","Chair (12)","Chair (13)","Chair (14)","Chair (15)","Chair (16)","Chair (17)","Chair (18)","Chair (1)","Chair (2)","Chair","Doorframe","Doorframe (1)"]},{"name":"label","transparent":false,"color":"#ececec","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"label.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0.19200000166893005,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Label","Label (1)","Label (2)","Label (3)","Label (4)","Label (5)","Label (6)","Label (7)","Label (8)","Label (9)","Label (10)","Label (11)","Label (12)","Label (13)","Label (14)","Label (15)","Label (16)","Label (17)","Label (18)","Label (19)","Label (20)","Label (21)","Label (22)","Label (23)","Label (24)","Label (25)","Label (26)","Label (27)","Label (28)","Label (29)","Label (30)","Label (31)","Label (32)","Label (33)","Label (34)","Label (35)","Label (36)","Label (37)","Label (38)","Label (39)","Label (40)","Label (41)","Label (42)","Label (43)","Label (44)","Label (45)","Label (46)","Label (47)"]},{"name":"Frame_25","transparent":false,"color":"#b9b9b9","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"Frame21.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_nq"]},{"name":"Frame_8","transparent":false,"color":"#e0e0e0","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"Frame15.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_nh","Frame_nh (2)"]},{"name":"Frame_b","transparent":false,"color":"#cacaca","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"Frame_b.png","normalMap":"Frame_bnm.png","parallaxOcclusionMap":"","emissiveMap":"","metalness":0.675000011920929,"roughness":0.7100000083446503,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_bv","Frame_bv","Frame_bv","Frame_bv","Frame_bv"]},{"name":"Frame_22","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"Frame21.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_bv$1","Frame_bv$1","Frame_bv$1","Frame_bv$1","Frame_bv$1"]},{"name":"Frame_a","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"Frame_a.png","normalMap":"Frame_anm.png","parallaxOcclusionMap":"","emissiveMap":"","metalness":0.11900000274181366,"roughness":0.8680000007152557,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_av","Frame_aq","Frame_ah (2)","Frame_aq","Frame_aq","Frame_ah (2)","Frame_aq","Frame_ah (2)","Frame_aq","Frame_ah (2)","Frame_aq","Frame_aq","Frame_aq","Frame_ah (2)","Frame_ah (2)","Frame_aq","Frame_ah (2)","Frame_aq","Frame_aq"]},{"name":"Frame_19","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"Frame21.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_av$1","Frame_nq (7)"]},{"name":"Frame_5","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"art_h_4.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_aq$1","Frame_aq$1","Frame_aq$1","Frame_aq$1","Frame_aq$1","Frame_aq$1","Frame_aq$1","Frame_aq$1","Frame_aq$1","Frame_aq$1","Frame_aq$1"]},{"name":"Frame_1","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"art_h_4.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_1"]},{"name":"Frame_2","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"Frame2.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0.03999999910593033,"roughness":0.7759999930858612,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_2"]},{"name":"Frame_9","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"Frame15.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0.15600000321865082,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_3","Frame_ah (2)$1","Frame_ah (2)$1","Frame_ah (2)$1","Frame_ah (2)$1","Frame_ah (2)$1","Frame_ah (2)$1","Frame_ah (2)$1"]},{"name":"Frame_4","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"Frame2.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_4","Frame_nh (1)"]},{"name":"Frame_15","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"Frame18.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_5"]},{"name":"Frame_16","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"Frame18.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_nq (10)"]},{"name":"Frame_20","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"Frame21.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_nq (5)"]},{"name":"Frame_21","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"Frame21.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_nq (6)"]},{"name":"Frame_18","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"Frame18.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_nq (9)"]},{"name":"Frame_17","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"Frame18.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_nq (8)"]},{"name":"art_h_1","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"art_h_1.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_nq (2)"]},{"name":"art_v_3","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"art_v_3.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_nq (4)"]},{"name":"Frame_11","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"Frame22.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_nh (6)"]},{"name":"art_v_2","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"art_v_2.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_nq (12)"]},{"name":"Frame_14","transparent":false,"color":"#d4d4d4","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"Frame22.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_nh (5)","Frame_nh"]},{"name":"Frame_3","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"art_h_4.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_nh (4)"]},{"name":"Frame_13","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"Frame22.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_nh (7)"]},{"name":"art_h_7","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"art_h_7.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0.7430000007152557,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Frame_nq (3)"]},{"name":"Exit","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"Exit.png","normalMap":"Exitnm.png","parallaxOcclusionMap":"","emissiveMap":"","metalness":0.5519999861717224,"roughness":0.4570000171661377,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["exit","exit (2)","exit (1)"]},{"name":"door01","transparent":false,"color":"#ffffff","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"door01.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0.6639999747276306,"roughness":0.5290000140666962,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Door01"]},{"name":"Glass01","transparent":true,"color":"#ffffff","emission":"#000000","alpha":0.05490196,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"Glass01.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0.47099998593330383,"roughness":0.15200001001358032,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Door01$1"]},{"name":"point_lighter_ao","transparent":false,"color":"#000000","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0.699999988079071,"roughness":0.17000001668930054,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)","Pointlight (9)"]},{"name":"light","transparent":false,"color":"#c9c9c9","emission":"#fffffe","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"light.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","spotlight 1$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1","Pointlight (9)$1"]},{"name":"spotlight","transparent":false,"color":"#000000","emission":"#000000","alpha":1,"alphaCutoff":0,"emissionIntensity":1,"uvRepeat":{"0":1,"1":1},"parallaxOcclusionScale":0.02,"diffuseMap":"spotlight.png","normalMap":"","parallaxOcclusionMap":"","emissiveMap":"","metalness":0,"roughness":0.6579999923706055,"metalnessMap":"","roughnessMap":"","type":"pbrMetallicRoughness","targetMeshes":["Joint","spotlight 1","stick","spotlight 1","spotlight 1","Joint (1)","Joint (2)","Joint (3)","stick1","stick1 (1)","stick1 (2)","stick1 (3)","Joint","spotlight 1","stick","spotlight 1","spotlight 1","Joint (1)","Joint (2)","Joint (3)","stick1","stick1 (1)","stick1 (2)","stick1 (3)","Joint","spotlight 1","stick","spotlight 1","spotlight 1","spotlight 1","spotlight 1","spotlight 1","Joint (1)","Joint (2)","Joint (3)","Joint (4)","Joint (6)","Joint (7)","Joint (8)","stick1","stick1 (1)","stick1 (2)","stick1 (3)","stick1 (4)","stick1 (6)","stick1 (7)","stick1 (8)","spotlight 1","Joint","spotlight 1","stick","Joint (1)","stick1","stick1 (1)","Joint","spotlight 1","stick","Joint (1)","stick1","stick1 (1)","Joint","spotlight 1","stick","Joint (1)","stick1","stick1 (1)","Joint","spotlight 1","stick","spotlight 1","spotlight 1","Joint (1)","Joint (2)","stick1","stick1 (1)","stick1 (2)","Joint (3)","stick1 (3)","Joint","spotlight 1","stick","spotlight 1","Joint (1)","Joint (2)","stick1","stick1 (1)","stick1 (2)","Joint","spotlight 1","stick","spotlight 1","spotlight 1","Joint (3)","Joint (4)","stick1","stick1 (1)","Joint (5)","stick1 (2)","stick1 (3)","Joint","spotlight 1","stick","spotlight 1","spotlight 1","Joint (3)","Joint (4)","stick1 (1)","stick1","Joint (5)","stick1 (2)","stick1 (3)","Joint","spotlight 1","stick","spotlight 1","Joint (3)","Joint (4)","stick1 (1)","stick1","Joint (5)","stick1 (2)","stick1 (3)","Joint","spotlight 1","stick","spotlight 1","spotlight 1","spotlight 1","spotlight 1","spotlight 1","Joint (1)","Joint (2)","Joint (3)","Joint (4)","Joint (5)","Joint (6)","Joint (7)","Joint (8)","stick1","stick1 (1)","stick1 (2)","stick1 (3)","stick1 (4)","stick1 (5)","stick1 (6)","stick1 (7)","stick1 (8)","Joint","spotlight 1","stick","spotlight 1","spotlight 1","Joint (1)","Joint (2)","Joint (3)","stick1","stick1 (1)","stick1 (2)","stick1 (3)","Joint","spotlight 1","stick","spotlight 1","spotlight 1","Joint (1)","Joint (2)","Joint (3)","stick1","stick1 (1)","stick1 (2)","stick1 (3)","Joint","spotlight 1","stick","spotlight 1","spotlight 1","Joint (1)","Joint (2)","stick1","stick1 (1)","stick1 (2)","Joint (3)","stick1 (3)","Joint","spotlight 1","stick","spotlight 1","Joint (1)","Joint (2)","stick1","stick1 (1)","stick1 (2)","Joint","spotlight 1","stick","Joint (1)","stick1","stick1 (1)","Joint","spotlight 1","stick","spotlight 1","spotlight 1","Joint (3)","stick1","Joint (4)","stick1 (1)","Joint (5)","stick1 (2)","stick1 (3)"]}],"takes":[],"textureFlipY":false,"zUpToYUp":false,"shadow":true,"environment":"auto","viewControl":{"center":[-1.5810825948372709,-0.32943921837648704,-0.9510663665344571],"alpha":4.391482546857949,"beta":-73.35563343334012,"distance":2.432148623182876},"ground":{"show":true,"grid":false},"mainLight":{"shadow":false,"shadowQuality":"medium","intensity":0.0000184,"color":"#fff","alpha":0.7964601769911517,"beta":14.33628318584069,"$padAngle":[0.07964601769911495,0.008849557522123908]},"secondaryLight":{"shadow":true,"shadowQuality":"medium","intensity":1.08,"color":"#fff","alpha":60,"beta":-125,"$padAngle":[0.23893805309734506,0.34513274336283184]},"tertiaryLight":{"shadow":true,"shadowQuality":"medium","intensity":0.88,"color":"#fff","alpha":43.80530973451327,"beta":43.00884955752211,"$padAngle":[0.23893805309734506,0.48672566371681414]},"ambientLight":{"intensity":0.88,"color":"#fff"},"ambientCubemapLight":{"texture":"./asset/texture/pisa.hdr","$texture":"pisa","$textureOptions":["pisa","Barce_Rooftop_C","Factory_Catwalk","Grand_Canyon_C","Ice_Lake","Hall","Old_Industrial_Hall"],"exposure":3,"diffuseIntensity":0.18,"specularIntensity":0.68},"postEffect":{"enable":true,"bloom":{"enable":true,"intensity":0.6},"depthOfField":{"enable":false,"focalDistance":3.64,"focalRange":0.98,"blurRadius":5,"fstop":9.96,"quality":"medium","$qualityOptions":["low","medium","high","ultra"]},"screenSpaceAmbientOcclusion":{"enable":true,"radius":1.74,"quality":"medium","intensity":1,"$qualityOptions":["low","medium","high","ultra"]},"screenSpaceReflection":{"enable":false,"physical":false,"quality":"medium","maxRoughness":0.8,"$qualityOptions":["low","medium","high","ultra"]},"colorCorrection":{"enable":true,"exposure":0.26,"brightness":0.06,"contrast":0.98,"saturation":1.2,"lookupTexture":""},"FXAA":{"enable":false}}}
    `;

    gltfModels = [
        {
            gltfFolder: `${resRootPath}pbrRes/artRoom/`,
            file: 'artRoom.gltf',
            scale: 1,
            cb: root => { }
        },
        {
            gltfFolder: `${resRootPath}pbrRes/pbrLightMap/`,
            file: 'pbrLightMap.gltf',
            scale: 1,
            cb: root => { }
        },
        {
            gltfFolder: `${resRootPath}pbrRes/002LightMap/`,
            file: '002LightMap.gltf',
            scale: 1,
            cb: root => { }
        },
        {
            gltfFolder: `${resRootPath}pbrRes/FlightHelmet/glTF/`,
            file: 'FlightHelmet.gltf',
            scale: 20,
            cb: root => { }
        },
        {
            gltfFolder: `${resRootPath}pbrRes/realtimeLight/`,
            file: 'realtimeLight.gltf',
            scale: 1,
            cb: root => { }
        },
        // {
        //     gltfFolder: 'res/pbrRes/model/',
        //     file: 'demo.gltf',
        //     scale: 2,
        //     cb: (root) => root.localTranslate.x += 0,
        // },
        // {
        //     gltfFolder: 'res/pbrRes/BoomBoxWithAxes/glTF/',
        //     file: 'BoomBoxWithAxes.gltf',
        //     scale: 300,
        //     cb: (root) => root.localTranslate.x += 8,
        // },
    ];


    HDRList: string[] = ["helipad"];
    HDRpath: string = `${resRootPath}pbrRes/HDR/`;
    _HDR: string = "helipad";
    _Model: string = "FlightHelmet";
    ModelList: string[] = [];
    _enableLight: boolean = true;
    lightRoot: m4m.framework.transform;
    modelRoot: m4m.framework.transform;

    _load(path: string, type = m4m.framework.AssetTypeEnum.Auto) {
        return new Promise((resolve) => {
            this.assetMgr?.load(path, type, (res) => {
                if (res.isfinish)
                    resolve(res);
                else
                    resolve(null);
            });
        });
    }
    async load<T extends m4m.framework.IAsset>(path: string, name: string, type?: m4m.framework.AssetTypeEnum) {
        await this._load(path + name, type);
        return this.assetMgr.getAssetByName<T>(name);
    }

    async loadCubeTexture(folder: string,
        images = [
            'negx.hdr',
            'negy.hdr',
            'negz.hdr',
            'posx.hdr',
            'posy.hdr',
            'posz.hdr',
        ]
    ) {
        const tex: m4m.framework.texture[] = await Promise.all(images.map(n => this.load<m4m.framework.texture>(folder, n)));
        const cubeTex = new m4m.framework.texture(folder.split('/').pop());
        cubeTex.glTexture = new m4m.render.glTextureCube(this.app.webgl, m4m.render.TextureFormatEnum.RGBA, true, true);
        cubeTex.use();
        (<m4m.render.glTextureCube>cubeTex.glTexture).uploadImages(
            tex[0],
            tex[1],
            tex[2],
            tex[3],
            tex[4],
            tex[5],
            WebGLRenderingContext.LINEAR_MIPMAP_LINEAR, WebGLRenderingContext.LINEAR, WebGLRenderingContext.TEXTURE_CUBE_MAP
        );
        return cubeTex;
    }

    async start(app: m4m.framework.application) {
        this.app = app;
        this.scene = this.app.getScene();
        this.assetMgr = this.app.getAssetMgr();
        //放到引擎里了
        // // m4m.framework.assetMgr.openGuid = true;
        // if (this.app.webgl.extensions.EXT_shader_texture_lod != null) {
        //     this.app.globalMacros.push('TEXTURE_LOD');
        // }


        const scene = app.getScene();
        scene.autoCollectlightCamera = true;
        scene.addChild(this.modelRoot = new m4m.framework.transform());
        scene.addChild(this.lightRoot = new m4m.framework.transform());

        //initCamera
        const objCam = new m4m.framework.transform();
        scene.addChild(objCam);
        const cam = objCam.gameObject.addComponent("camera") as m4m.framework.camera;
        cam.near = 0.1;
        cam.far = 1000;
        // cam.fov = Math.PI * 0.3;

        objCam.localTranslate = new m4m.math.vector3(0, 15, -15);
        objCam.lookatPoint(new m4m.math.vector3(0, 0, 0));
        //相机控制
        let hoverc = cam.gameObject.addComponent("HoverCameraScript") as m4m.framework.HoverCameraScript;
        hoverc.panAngle = 180;
        hoverc.tiltAngle = 45;
        hoverc.distance = 30;

        hoverc.scaleSpeed = 0.1;
        hoverc.lookAtPoint = new m4m.math.vector3(0, 0, 0);
        //
        let par = new URL(window.location.href).searchParams;
        if (par.has('file')) this.isEnableGUI = false;

        //开启GUI
        if (this.isEnableGUI) {
            await this.enableGUI();
        } else {
            this._Model = par.get('file');
            if (this._Model) this._Model.replace(".gltf", "");
            this.toLoad();
        }
    }

    async toLoadGLTF(gltfModels: any[]) {
        const config = JSON.parse(this.sceneConfig);
        console.log(config);
        const { ambientCubemapLight, mainLight, secondaryLight, tertiaryLight } = config;
        // const tex = await this.load<m4m.framework.texture>(HDRpath, 'flower_road_2k.hdr');
        // mr.materials[0].setTexture("_MainTex", tex);
        await demoTool.loadbySync(`${resRootPath}shader/shader.assetbundle.json`, this.app.getAssetMgr());
        // await demoTool.loadbySync(`${resRootPath}test/shader/customShader/customShader.assetbundle.json`, this.app.getAssetMgr());  //项目shader
        // await datGui.init();

        let exp = ambientCubemapLight.exposure ?? 4;

        const env = await this.loadCubeTexture(`${this.HDRpath}${this._HDR}/`);
        const irradianceSH = await this.loadCubeTexture(`${this.HDRpath}${this._HDR}_diff/`);
        const skybox = new m4m.framework.transform();
        skybox.localScale.x = skybox.localScale.y = skybox.localScale.z = 600;
        // this.scene.addChild(skybox);
        this.modelRoot.addChild(skybox);
        let mf_c = skybox.gameObject.addComponent("meshFilter") as m4m.framework.meshFilter;
        mf_c.mesh = this.assetMgr.getDefaultMesh("cube");
        let mr_c = skybox.gameObject.addComponent("meshRenderer") as m4m.framework.meshRenderer;
        mr_c.materials[0] = new m4m.framework.material("skyboxmat");
        mr_c.materials[0].setShader(this.assetMgr.getShader("skybox.shader.json"));
        // let pass = mr_c.materials[0].getShader().passes["base"][0];
        // pass.state_showface = m4m.render.ShowFaceStateEnum.CW;
        mr_c.materials[0].setCubeTexture("u_sky", env);
        mr_c.materials[0].setFloat("u_Exposure", exp);

        // const brdf = await this.load<m4m.framework.texture>('res/pbrRes/', 'lut_ggx.png');

        let realtimeLights: m4m.framework.gltfRealtimeLight[] = [];

        const loadGLTF = async ({ gltfFolder, file, scale }) => {
            const gltf = await this.load<m4m.framework.gltf>(gltfFolder, file);
            const root = await gltf.load(this.assetMgr, this.app.webgl, gltfFolder, null, env, irradianceSH, exp, ambientCubemapLight.specularIntensity, ambientCubemapLight.diffuseIntensity);
            let rtLights = gltf.getRealtimeLights();
            if (rtLights) { realtimeLights = rtLights; }
            m4m.math.vec3SetAll(root.localScale, scale ?? 1);
            root.localScale.x *= -1;
            // this.app.getScene().addChild(root);
            this.modelRoot.addChild(root);
            return root;
        }
        const par = new URL(window.location.href).searchParams;
        exp = par.has('exp') ? parseFloat(par.get('exp')) : exp;
        if (!gltfModels) gltfModels = [];

        if (par.has('folder')) {
            gltfModels.push({
                gltfFolder: par.get('folder'),
                file: par.get('file'),
                scale: par.get('scale') ? parseFloat(par.get('scale')) : 1,
                cb: root => root.localTranslate.x += par.get('x') ? parseFloat(par.get('x')) : 0,
            })
        }

        for (let i = 0, len = gltfModels.length; i < len; i++) {
            let cfg = gltfModels[i];
            const root = await loadGLTF(cfg);
            if (cfg.cb) cfg.cb(root);
        }
        // gltfModels.map(async (cfg) => {
        //     const root = await loadGLTF(cfg);
        //     if (cfg.cb) cfg.cb(root);
        // });

        const hexToRgb = hex =>
            hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
                , (m, r, g, b) => '#' + r + r + g + g + b + b)
                .substring(1).match(/.{2}/g)
                .map(x => parseInt(x, 16));

        const addLightModel = (rot: m4m.math.quaternion, pos: m4m.math.vector3, color: number[]) => {
            if (!this.isShowLightModel) return;
            //灯源模型显示
            let lCube = m4m.framework.TransformUtil.CreatePrimitive(m4m.framework.PrimitiveType.Cube);
            let renderer = lCube.gameObject.renderer as m4m.framework.meshRenderer;
            let sh = m4m.framework.sceneMgr.app.getAssetMgr().getShader("simple.shader.json");
            if (sh) {
                renderer.materials[0].setShader(sh);
                renderer.materials[0].setVector4("_MainColor", new m4m.math.vector4(color[0], color[1], color[2], 1));
            }
            lCube.localScale = new m4m.math.vector3(0.2, 0.2, 0.6);
            lCube.localPosition = pos;
            lCube.localRotate = rot;
            this.lightRoot.addChild(lCube);
        }


        //gltf有实时灯光 ,走gltf 实时灯光配置
        if (realtimeLights.length > 0) {
            realtimeLights.forEach((l, i) => {
                //
                const node = new m4m.framework.transform();
                node.name = `Light_${m4m.framework.LightTypeEnum[l.type]}_${i}`;
                const comp = node.gameObject.addComponent("light") as m4m.framework.light;
                comp.type = l.type;
                //shadow
                if (l.shadowQuality != m4m.framework.ShadowQualityType.None) {
                    l.shadowQuality;
                }
                if (comp.type == m4m.framework.LightTypeEnum.Spot || comp.type == m4m.framework.LightTypeEnum.Point) {
                    //range
                    comp.range = l.range;
                    if (comp.type == m4m.framework.LightTypeEnum.Spot) {
                        //spotAngelCos
                        comp.spotAngelCos = Math.cos(l.spotAngle * 0.5 * Math.PI / 180);
                    }
                }
                //intensity
                comp.intensity = l.intensity;
                //color
                m4m.math.colorSet(comp.color, l.color[0], l.color[1], l.color[2], l.color[3]);
                //RTS
                let pos = node.localPosition;
                m4m.math.vec3Set(pos, l.pos[0], l.pos[1], l.pos[2]);
                node.localPosition = pos;
                let rot = node.localRotate;
                m4m.math.quatFromEulerAngles(l.angles[0], l.angles[1], 0, rot);
                node.localRotate = rot;

                this.lightRoot.addChild(node);

                //灯源模型显示
                addLightModel(rot, pos, l.color);
            });
        } else {
            //Clay Viewer 配置
            let count = 0;
            let lightCount = 3;
            [mainLight, secondaryLight, tertiaryLight].map(light => {
                // return;
                const lightObj = new m4m.framework.transform();
                lightObj.name = "Light" + light.name;
                const mlight = lightObj.gameObject.addComponent("light") as m4m.framework.light;
                mlight.type = m4m.framework.LightTypeEnum.Direction;
                m4m.math.quatFromEulerAngles(light.alpha, light.beta, 0, lightObj.localRotate);
                mlight.intensity = light.intensity;
                const rgb = hexToRgb(light.color).map(x => x / 255);
                mlight.color.r = rgb[0];
                mlight.color.g = rgb[1];
                mlight.color.b = rgb[2];
                lightObj.markDirty();
                // this.scene.addChild(lightObj);
                this.lightRoot.addChild(lightObj);

                //灯源模型显示
                let val = count / lightCount * Math.PI * 2;
                let s = 5;
                addLightModel(lightObj.localRotate, new m4m.math.vector3(Math.sin(val) * s, 0, Math.cos(val) * s), rgb);
                count++;
            });
        }
    }

    async enableGUI() {
        this.ModelList = this.gltfModels.map((val) => { return val.file.split(".")[0] });
        await datGui.init();
        let gui = new dat.GUI();;
        gui.add(this, 'dec');
        //
        gui.add(this, "_HDR", this.HDRList).name("天空盒");
        gui.add(this, "Model", this.ModelList).name("快捷选择");
        gui.add(this, "Model").listen().name("模型名");
        gui.add(this, "enableLight").name("开启灯光");
        gui.add(this, "isShowLightModel").name("显示光源模型");
        gui.add(this, "toLoad").name("加载");
    }

    get Model() { return this._Model; }
    set Model(val) { this._Model = val; }

    get enableLight() { return this._enableLight; }
    set enableLight(val) {
        this._enableLight = val;
        this.lightRoot.children.forEach((l) => { l.gameObject.visible = val; });
    }

    toLoad() {
        this.clearGLTF();

        if (!this._Model) {
            console.warn(`没有指定 model !`);
            return;
        }

        let par = new URL(window.location.href).searchParams;
        let model: any;
        let needCKModels = true;
        if (!this.isEnableGUI && !par.get('folder')) { needCKModels = false; }   //没配置路径，走固定路径关掉查指定配置

        if (needCKModels) {
            //在默认配置指向中找
            for (let i = 0, len = this.gltfModels.length; i < len; i++) {
                let obj = this.gltfModels[i];
                if (obj && obj.file.indexOf(this._Model) != -1) {
                    model = obj;
                    break;
                }
            }
        }

        //没有默认配置指向 ，走固定结构
        if (!model) {
            let _scale = 1;
            let _cb = root => { };
            let _file = `${this._Model}.gltf`;
            let _gltfFolder = `${resRootPath}pbrRes/${this._Model}/`;

            if (!this.isEnableGUI) {
                //没有GUI的选择输入，看是否有有效 url 参数。
                _gltfFolder = par.get('folder') || _gltfFolder;
                _scale = par.get('scale') ? parseFloat(par.get('scale')) : 1;
            }

            model = {
                gltfFolder: _gltfFolder,
                file: _file,
                scale: _scale,
                cb: _cb
            }
        }
        this.toLoadGLTF([model]);
    }

    clearGLTF() {
        this.lightRoot.removeAllChild();
        this.modelRoot.removeAllChild();
    }

    update(delta: number) {


    }
}