

#include <emscripten.h>
#include <stdlib.h>

int LINE = 1;
int SHAPE = 2;

float flexIndex(float *vertices, int vertices_len, int n)
{
    if (n < 0)
    {
        return vertices[vertices_len + n];
    }
    else
    {
        return vertices[n % vertices_len];
    }
}

float lerp(float o0, float o1, float n)
{
    return (o1 - o0) * n + o0;
}

int closePath(float *input_array, int len)
{
    if (input_array[0] != input_array[len - 2] || input_array[1] != input_array[len - 1])
    {
        input_array[len] = input_array[0];
        len++;
        input_array[len] = input_array[1];
        len++;
    }

    return len;
}

float *setMidOfVerts(float *vertices, int len)
{
    vertices[0] = lerp(vertices[0], vertices[2], 0.5);
    vertices[1] = lerp(vertices[1], vertices[3], 0.5);

    vertices[len - 1] = lerp(vertices[len - 3], vertices[len - 1], 0.5);
    vertices[len - 2] = lerp(vertices[len - 4], vertices[len - 2], 0.5);

    return vertices;
}
 


EMSCRIPTEN_KEEPALIVE
void curveBezier(float *vertices, int len, int chunkNum, float detail, int mode, float *output, float *currnetVerts, float *chunkVerts)
{
  

    if (len / 2 < 3)
    {
        return ;
    }
  
    detail = detail / (float)((len) / chunkNum);
    int outputIndex = 0;
    for (int i = 0; i < len - chunkNum / 2; i += chunkNum)
    {
        int extraVertsLen = (((chunkNum / 9) / 2) * 2);
        for (float k = (1 / detail) * (detail / 11); k < 1 - (1 / detail) * (detail / 11); k += 1 / detail)
        {

            int chunkVertsIndex = 0;

            for (int ik = i - extraVertsLen; ik < i + chunkNum + extraVertsLen; ik++)
            {
                chunkVerts[chunkVertsIndex] = flexIndex(vertices, len, ik);

                chunkVertsIndex++;
            }
 
            int extraDiv = chunkVertsIndex / extraVertsLen;

            chunkVerts = setMidOfVerts(chunkVerts, chunkVertsIndex);
            int bizLen = chunkVertsIndex - 2;
            for (int j = 0; j < bizLen; j += 1)
            {
                int currnetVertsIndex = 0;
                for (int m = 0; m < chunkVertsIndex - 2; m += 2)
                {

                    float x = lerp(chunkVerts[m], chunkVerts[m + 2], k);
                    float y = lerp(chunkVerts[m + 1], chunkVerts[m + 3], k);

                    currnetVerts[currnetVertsIndex] = x;
                    currnetVertsIndex++;
                    currnetVerts[currnetVertsIndex] = y;
                    currnetVertsIndex++;
                }

                for (int q = 0; q < currnetVertsIndex; q++)
                {
                    chunkVerts[q] = currnetVerts[q];
                }
                chunkVertsIndex = currnetVertsIndex;
            }

            output[outputIndex] = chunkVerts[0];
            outputIndex++;
            output[outputIndex] = chunkVerts[1];
            outputIndex++;
        }
    }

    if (mode == SHAPE)
    {
        if (output[0] != output[outputIndex - 2] || output[1] != output[outputIndex - 1])
        {
            output[outputIndex] = output[0];
            outputIndex++;
            output[outputIndex] = output[1];
            outputIndex++;
        }
    }

    // adding length num in fist element of array
    for (int i = outputIndex - 1; i >= 0; i--)
    {
        output[i + 1] = output[i];
    }
    outputIndex++;
    output[0] = outputIndex;
 
}

// EMSCRIPTEN_KEEPALIVE
// float *curveBezier(float *vertices, int len, int chunk, float detail, int mode)
// {

//     float *output = malloc((detail * len) * sizeof(float));
//     float *currnetVerts = malloc(len * sizeof(float));
//     int outputIndex = 0;

//     if (len / 2 < 3)
//     {
//         return vertices;
//     }

//     chunk /= 2;
//     chunk *= 2;
//     int chunkNum;

//     if (chunk > len)
//     {
//         chunkNum = len;
//     }
//     else if (chunk < 4)
//     {
//         chunkNum = 4;
//     }
//     else
//     {
//         chunkNum = chunk;
//     }

//     float *chunkVerts = malloc(chunkNum * sizeof(float));
 
//     detail = detail / (float)((len) / chunkNum);

//     for (int i = 0; i < len - chunkNum / 2; i += chunkNum)
//     {
//         int extraVertsLen = (((chunkNum / 9) / 2) * 2);
//         for (float k = (1 / detail) * (detail / 11); k < 1 - (1 / detail) * (detail / 11); k += 1 / detail)
//         {

//             int chunkVertsIndex = 0;

//             for (int ik = i - extraVertsLen; ik < i + chunkNum + extraVertsLen; ik++)
//             {
//                 chunkVerts[chunkVertsIndex] = flexIndex(vertices, len, ik);

//                 chunkVertsIndex++;
//             }

//             // printf("%d\n",);

//             int extraDiv = chunkVertsIndex / extraVertsLen;

//             chunkVerts = setMidOfVerts(chunkVerts, chunkVertsIndex);
//             int bizLen = chunkVertsIndex - 2;
//             for (int j = 0; j < bizLen; j += 1)
//             {
//                 int currnetVertsIndex = 0;
//                 for (int m = 0; m < chunkVertsIndex - 2; m += 2)
//                 {

//                     float x = lerp(chunkVerts[m], chunkVerts[m + 2], k);
//                     float y = lerp(chunkVerts[m + 1], chunkVerts[m + 3], k);

//                     currnetVerts[currnetVertsIndex] = x;
//                     currnetVertsIndex++;
//                     currnetVerts[currnetVertsIndex] = y;
//                     currnetVertsIndex++;
//                 }

//                 for (int q = 0; q < currnetVertsIndex; q++)
//                 {
//                     chunkVerts[q] = currnetVerts[q];
//                 }
//                 chunkVertsIndex = currnetVertsIndex;
//             }

//             output[outputIndex] = chunkVerts[0];
//             outputIndex++;
//             output[outputIndex] = chunkVerts[1];
//             outputIndex++;
//         }
//     }

//     if (mode == SHAPE)
//     {
//         if (output[0] != output[outputIndex - 2] || output[1] != output[outputIndex - 1])
//         {
//             output[outputIndex] = output[0];
//             outputIndex++;
//             output[outputIndex] = output[1];
//             outputIndex++;
//         }
//     }

//     // adding length num in fist element of array
//     for (int i = outputIndex - 1; i >= 0; i--)
//     {
//         output[i + 1] = output[i];
//     }
//     outputIndex++;
//     output[0] = outputIndex;

//     return output;
// }

EMSCRIPTEN_KEEPALIVE
void *wasmmalloc(size_t n)
{
    return malloc(n);
}

EMSCRIPTEN_KEEPALIVE
void *wasmrealloc(void *ptr , size_t n)
{
    return realloc(ptr, n); 
}

 
EMSCRIPTEN_KEEPALIVE
void wasmfree(void *ptr)
{
    free(ptr);
}
