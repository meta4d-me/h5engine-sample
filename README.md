# Sample for M4M engine

M4M engine is a 3D game engine with Web3 capability that supports identity presentation cross-verse.

Download engine package from https://github.com/meta4d-me/m4m-engine/archive/refs/tags/v0.0.2.zip and save engine.
E.g.,
```
mkdir engine
wget https://github.com/meta4d-me/m4m-engine/archive/refs/tags/v0.0.2.zip
unzip m4m-engine-0.0.2.zip engine
```

And then, execute npm build

```
npm install
npm run build
```

* engineExample // sample code to use M4M engine
* &emsp;|---code
* &emsp;|---exampleResource&emsp;(git submodule)&emsp;// resources been used for example
* &emsp;|---lib&emsp;// libs used by example
* &emsp;|---engine&emsp;// engine resource, retrieved from M4M engine project
* &emsp;|---dist&emsp;// example code will be compiled to this folder
