

#include <emscripten.h>
#include <stdlib.h>
 
float lerp(float o0, float o1, float n)
{
    return (o1 - o0) * n + o0;
}

EMSCRIPTEN_KEEPALIVE
float curveBezier(float *input_array, float *output_array,float *currnArr  , int lena, int s)
{
 
    int idxVerts = 0;
    for (float k = 0.0; k < 1; k += 1.0 / s)
    {

 
        for (int ik = 0; ik < lena; ik++)
        {
            currnArr[ik] = input_array[ik];
        }

        int currnArrlen = lena;

        while (currnArrlen > 0)
        {

            for (int i = 0; i < currnArrlen-2 ; i += 2)
            {

                float x = lerp(currnArr[i], currnArr[i + 2], k);
                float y = lerp(currnArr[i + 1], currnArr[i + 2 + 1], k);

                currnArr[i] = x;
                currnArr[i + 1] = y;
            }

            currnArrlen -= 2;
        }

        output_array[idxVerts] = currnArr[0];
        output_array[idxVerts + 1] = currnArr[1];
        idxVerts += 2;
 
    }
 
    return input_array[0];
}

EMSCRIPTEN_KEEPALIVE
void *wasmmalloc(size_t n)
{
    return malloc(n);
}

EMSCRIPTEN_KEEPALIVE
void wasmfree(void *ptr)
{
    free(ptr);
}
