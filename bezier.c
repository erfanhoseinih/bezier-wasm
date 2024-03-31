

#include <emscripten.h>
#include <stdio.h>
#include <stdlib.h>

float lerp(float o0, float o1, float n)
{
    return (o1 - o0) * n + o0;
}

EMSCRIPTEN_KEEPALIVE
float *curveBezier(float a[], int lena, float s)
{
    float *mainvert = malloc(sizeof(float) * (lena));
 
    float *vertss = malloc(sizeof(float) * (lena));
    // float *currnArr = malloc(sizeof(float) * (lena ));
    static float currnArr[] = {};
    unsigned long idxVerts = 0;
    for (float k = 0.0; k < 1; k += 1.0 / s)
    {

        for (int i = 0; i < lena; i++)
        {
            currnArr[i] = a[i];
        }

        int currnArrlen = lena;

        while (currnArrlen > 0)
        {

            for (int i = 0; i < currnArrlen - 2; i += 2)
            {

                float x = lerp(currnArr[i], currnArr[i + 2], k);
                float y = lerp(currnArr[i + 1], currnArr[i + 2 + 1], k);

                currnArr[i] = x;
                currnArr[i + 1] = y;
            }

            currnArrlen -= 2;
        }

        vertss[idxVerts] = currnArr[0];
        vertss[idxVerts + 1] = currnArr[1];
        idxVerts += 2;
    }

    return vertss;
}

int main() { return 0; }