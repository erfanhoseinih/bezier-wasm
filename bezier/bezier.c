

#include <emscripten.h>
#include <math.h>
#include <stdlib.h>
#include <stdio.h>
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

void openPath(float *input_array, int *len, int *chunkNum)
{
    if (input_array[0] == input_array[(*len) - 2] && input_array[1] == input_array[(*len) - 1])
    {
        if ((*chunkNum) >= (*len))
        {
            (*chunkNum) -= 2;
        }
        (*len) -= 2;
    }
}

float *setMidOfVerts(float *verts, int len)
{
    verts[0] = lerp(verts[0], verts[2], 0.5);
    verts[1] = lerp(verts[1], verts[3], 0.5);

    verts[len - 1] = lerp(verts[len - 3], verts[len - 1], 0.5);
    verts[len - 2] = lerp(verts[len - 4], verts[len - 2], 0.5);

    return verts;
}

int constrain(int n, int min, int max)
{
    if (n < min)
    {
        n = min;
    }
    else if (n > max)
    {
        n = max;
    }
    return n;
}

void setChunckVertices(float *vertices, float *chunkVertices, int *chunkVerticesIndex, int i, int chunkNum, int len)
{
     
    for (int j = i; j < constrain(i + chunkNum, 0, len+4); j += 2)
    {

        chunkVertices[(*chunkVerticesIndex)] = flexIndex(vertices, len, j);

        (*chunkVerticesIndex)++;
        chunkVertices[(*chunkVerticesIndex)] = flexIndex(vertices, len, j + 1);

        (*chunkVerticesIndex)++;
    }
}

EMSCRIPTEN_KEEPALIVE
void curveBezier(float *vertices, int len, int chunkNum, float detail, int mode, float *output, float *currentVertices, float *chunkVertices, int *outputLen)
{
    int outputIndex = 0;
    int shapeNum = 4;
    if (mode == SHAPE)
    {
        openPath(vertices, &len, &chunkNum);
        shapeNum = 0;
    }
    else
    {
        output[outputIndex] = vertices[0];
        outputIndex++;
        output[outputIndex] = vertices[1];
        outputIndex++;
    }

    detail = detail / (float)(len / chunkNum);
    
    // printf("len %d chunkNum %d detail %f mode %d\n",len, chunkNum, detail, mode);
   
    for (int i = 0; i < len - shapeNum; i += chunkNum - 4)
    {
  
        for (float k = 0; k < 1; k += 1 / detail)
        {

            int chunkVerticesIndex = 0;
            setChunckVertices(vertices, chunkVertices, &chunkVerticesIndex, i, chunkNum, len);
            if (mode == SHAPE)
            {
                chunkVertices = setMidOfVerts(chunkVertices, chunkVerticesIndex);
            }
            else
            {
                if (len > chunkNum)
                {
                    chunkVertices = setMidOfVerts(chunkVertices, chunkVerticesIndex);
                }
            }

            float lerpNum;
            while (chunkVerticesIndex > 2)
            {

                int currentVerticesIndex = 0;
                for (int m = 0; m < chunkVerticesIndex - 2; m += 2)
                {
                    // if (chunkVerticesIndex / 2 == 3)
                    // {
                    //     if (m == 0)
                    //     {
                    //         lerpNum = pow(k, 0.3);
                    //     }
                    //     else if (m == 2)
                    //     {
                    //         lerpNum = pow(k,4);
                    //     }
                    // }
                    // else
                    // {
                    //     lerpNum = k;
                    // }

                    lerpNum = k;

                    float x = lerp(chunkVertices[m], chunkVertices[m + 2], lerpNum);
                    float y = lerp(chunkVertices[m + 1], chunkVertices[m + 3], lerpNum);

                    currentVertices[currentVerticesIndex] = x;
                    currentVerticesIndex++;
                    currentVertices[currentVerticesIndex] = y;
                    currentVerticesIndex++;
                }

                for (int q = 0; q < currentVerticesIndex; q++)
                {
                    chunkVertices[q] = currentVertices[q];
                }
                chunkVerticesIndex = currentVerticesIndex;
            }

            output[outputIndex] = chunkVertices[0];
            outputIndex++;
            output[outputIndex] = chunkVertices[1];
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
    else
    {

        output[outputIndex] = vertices[len - 2];
        outputIndex++;
        output[outputIndex] = vertices[len - 1];
        outputIndex++;
    }

    outputLen[0] = outputIndex;
}

EMSCRIPTEN_KEEPALIVE
void *wasmmalloc(size_t n)
{
    return malloc(n);
}

EMSCRIPTEN_KEEPALIVE
void *wasmrealloc(void *ptr, size_t n)
{
    return realloc(ptr, n);
}

EMSCRIPTEN_KEEPALIVE
void wasmfree(void *ptr)
{
    free(ptr);
}
