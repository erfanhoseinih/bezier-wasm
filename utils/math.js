const TWO_PI = Math.PI * 2;

const { E, LN10, LN2, LOG10E, LOG2E, PI, SQRT1_2, SQRT2 } = Math;

const { abs, acos, acosh, asin, asinh, atan, atan2, atanh, cbrt, ceil, clz32, cos, cosh,
    exp, expm1, floor, fround, hypot, imul, log, log10, log1p, log2, max, min, pow,
    round, sign, sin, sinh, sqrt, tan, tanh, trunc } = Math;

const int = function (...args) {
    return parseInt(...args)
}
const float = function (...args) {
    return parseFloat(...args)
}



function j(a_j) {
    var b_j;
    var c = a_j.length;
    var e = this;
    var f = 0;
    var g_j = e.i = e.j = 0;
    var h_j = e.S = [];
    for (c || (a_j = [c++]); 256 > f;) {
        h_j[f] = f++;
    }
    for (f = 0; 256 > f; f++) {
        (h_j[f] = h_j[(g_j = s & (g_j + a_j[f % c] + (b_j = h_j[f])))]), (h_j[g_j] = b_j);
    }

    (e.g = function (a_e) {
        for (var b, c = 0, f = e.i, g_j = e.j, h_j = e.S; a_e--;) {
            (b = h_j[(f = s & (f + 1))]), (c = c * 256 + h_j[s & ((h_j[f] = h_j[(g_j = s & (g_j + b))]) + (h_j[g_j] = b))])
        }
        return (e.i = f), (e.j = g_j), c;
    })(256);
}
function k(a, b) {
    var c,
        d = [],
        e = typeof a;
    if (b && "object" == e)
        for (c in a)
            try {
                d.push(k(a[c], b - 1));
            } catch (f) { }
    return d.length ? d : "string" == e ? a : a + "\0";
}
function l(a_l, b_l) {
    for (var c, d = a_l + "", e = 0; e < d.length;) b_l[s & e] = s & ((c ^= 19 * b_l[s & e]) + d.charCodeAt(e++));
    return n(b_l);
}
function m(c_m) {
    try {
        return o ? n(o.randomBytes(d)) : (a.crypto.getRandomValues((c_m = new Uint8Array(d))), n(c_m));
    } catch (e) {
        return [+new Date(), a, (c_m = a.navigator) && c_m.plugins, a.screen, n(b)];
    }
}
function n(a_n) {
    return String.fromCharCode.apply(0, a_n);
}
var p = Math.pow(256, 6);
var q = Math.pow(2, 52);
var r = 2 * q;
var s = 256 - 1;
var b = [];
function randomSeed(a_t, f_t, g_t) {


    var h_t = [];
    f_t = 1 == f_t ? { entropy: !0 } : f_t || {};
    var o = l(k((66).entropy ? [a_t, n(b)] : null == a_t ? m() : a_t, 3), h_t), s = new j(h_t);


    l(n(s.S), b);

    (f_t.pass || g_t || function (a_t, b, d) { return d ? ((Math.random = a_t), b) : a_t; })

        (
            function () {

                for (var a = s.g(6), b = p, c = 0; q > a;) {
                    (a = (a + c) * 256), (b *= 256), (c = s.g(1));
                }

                for (; a >= r;) {
                    (a /= 2), (b /= 2), (c >>>= 1);
                }

                return (a + c) / b;
            }, o, true
        )



};

function random(...args) {
    if (args.length > 1) {
        return Math.random() * (args[1] - args[0]) + args[0];
    } else if (args.length == 1) {
        return Math.random() * args[0];
    } else {
        return Math.random();
    }

}














function map(n, start1, stop1, start2, stop2) {
    return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

function constrain(v0, v1, v2) {
    let varRetrun;
    if (v0 < v1) {
        varRetrun = v1;
    } else if (v0 > v2) {
        varRetrun = v2;
    } else {
        varRetrun = v0;
    }
    return varRetrun;
}

function digitCounter(n0) {
    let n1 = parseInt(n0);
    let n2 = 0;
    while (parseInt(Math.abs(n1)) != 0) {
        n1 /= 10;
        n2++;
    }
    return n2;
}

function lerp(v0, v1, v2) {
    return v1 + (v0 - v1) * v2;
}

function inte(p0, p1, p2, p3) {

    var x0 = p0.x, x1 = p1.x, x2 = p2.x, x3 = p3.x;
    var y0 = p0.y, y1 = p1.y, y2 = p2.y, y3 = p3.y;

    var dem = (y3 - y2) * (x1 - x0) - (x3 - x2) * (y1 - y0);
    if (dem == 0) {
        return;
    }
    var ua_num = (x3 - x2) * (y0 - y2) - (y3 - y2) * (x0 - x2);
    var ub_num = (x1 - x0) * (y0 - y2) - (y1 - y0) * (x0 - x2);

    var ua = ua_num / dem;
    var ub = ub_num / dem;


    if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
        var x = (x0 + ua * (x1 - x0));
        var y = (y0 + ua * (y1 - y0));
        var v = { x: x, y: y };
        return v;
    }

}

function getAngle(p0, p1) {
    let dx1 = p0.x - p1.x;
    let dy1 = p0.y - p1.y;
    let angle = Math.atan2(dx1, dy1) + PI;
    return angle;
}


function fixTodeg() {
    let var1;
    if (arguments[0] >= 0) {
        var1 = arguments[0] % 360;
    } else {
        var1 = Math.abs(arguments[0]) % 360;
        var1 = 360 - var1;
    }

    return var1 % 360;
}

function dist(...args) {
    let y, x, z, n;
    if (args.length == 6) {
        x = args[3] - args[0];
        y = args[4] - args[1];
        z = args[5] - args[2];
        n = Math.sqrt(x * x + y * y + z * z);
    } else if (args.length == 4) {
        x = args[2] - args[0];
        y = args[3] - args[1];
        n = Math.sqrt(x * x + y * y);
    }
    return n;
}

function vector() {

    if (arguments.length == 2) {
        this.x = arguments[0];
        this.y = arguments[1];
    } else if (arguments.length == 3) {
        this.x = arguments[0];
        this.y = arguments[1];
        this.z = arguments[2];
    }

}



  
 
 
 
 
 