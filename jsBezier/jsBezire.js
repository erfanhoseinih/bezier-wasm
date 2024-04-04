var lerpB = (v0, v1, v2) => {
    return v1 + (v0 - v1) * v2;
}
var lerpXYB = (o0, o1, n) => {
    return { x: lerpB(o0.x, o1.x, n), y: lerpB(o0.y, o1.y, n) };
}
function curveBeziertest(v, s) {
    
    let verts = v;
    let finalVerts = [];
    if (verts.length > 2) {

        let letvrt = verts.length - 1;
        for (let k = 0; k < 1; k += 1 / s) {
            let secVert = verts;

            for (let j = 0; j < letvrt; j += 1) {
                let currntVerts = [];
 
                for (let i = 0; i < secVert.length - 1; i += 1) {

                    let p0 = lerpXYB(secVert[i], secVert[i + 1], k);
                    currntVerts.push(p0);
                }


                secVert = currntVerts;
            }

            finalVerts.push(secVert[0])

        }
        
    } else {
        finalVerts = verts;
    }

    return finalVerts;

}
