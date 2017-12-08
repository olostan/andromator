const util = require('util');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);
const PNG = require('pngjs').PNG;


console.log("Starting...");

const config = require('./config.json');

main();

async function main() {
    let conditions = await Promise.all(config.conditions.map(conditionLoader));
    console.log("Loaded conditions: "+config.conditions.length);
    while (true) {
        // 1-st: get screenshot:
        let screenshotPNG = await exec("adb exec-out screencap -p", {encoding: 'binary', maxBuffer: 10*1024*1024});
        let out = new Buffer(screenshotPNG.stdout, "binary");
//        await util.promisify(fs.writeFile)("out.png",out, {econding:'binary'});
//        console.log("Screenshot saved");
        let png = PNG.sync.read(out);
//        let data = await util.promisify(new PNG().parse)(out);
        //console.log("Got screenshot");
        for (let cond of conditions) {
            let matched = true;
            for (let y = cond.area[1];y<cond.area[3];y++) {
                if (!matched) break;
                for (let x = cond.area[0];x<cond.area[2];x++) {
                    let p = (y*png.width+x)*4;
                    if (png.data[p]!=cond.data[p]) {
                       // console.log(`Failed to match ${x}x${y} (${p}: ${png.data[p]}!=${cond.data[p]}`);
                        matched = false;
                        break;
                    }
                }
            }
            if (matched) {
                console.log("Match:", cond.comment);
                if (cond.action.type=='tap') {
                    await exec("adb shell input tap "+cond.action.coord[0]+" "+cond.action.coord[1]);
                }
            }
        }
        await timer(500);
    }
}

async function conditionLoader(conditionDef) {
    let img = await util.promisify(fs.readFile)(conditionDef.image,{encoding:'binary'});
    img = new Buffer(img, "binary");
    const png = PNG.sync.read(img);
    return {data: png.data, area: conditionDef.area, action: conditionDef.action, comment: conditionDef.comment}
}

function timer(time) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time);
    });
}