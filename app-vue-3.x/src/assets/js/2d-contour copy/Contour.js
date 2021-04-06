function tracingContourLines(S0,X,Y,contour,undefData) {
    var S1 = [];
    var borders=tracingBorders(S0,X,Y,S1,undefData);
    return createContourLines_UndefData(S0, X, Y, contour, S1, undefData, borders);
}
function tracingBorders(S0,X,Y,S1,undefData) {
    var borderLines = [];

    var m, n, i, j;
    m = S0.length;    //Y
    n = S0[0].length;    //X

    //S1 = new int[m][n];    //---- New array (0 with undefine data, 1 with data)
    for (i = 0; i < m; i++) {
        S1[i] = [];
        for (j = 0; j < n; j++) {
            if (S0[i][j]==undefData) //Undefine data
            {
                S1[i][j] = 0;
            } else {
                S1[i][j] = 1;
            }
        }
    }

    //---- Border points are 1, undefine points are 0, inside data points are 2
    //l - Left; r - Right; b - Bottom; t - Top; lb - LeftBottom; rb - RightBottom; lt - LeftTop; rt - RightTop
    var l, r, b, t, lb, rb, lt, rt;
    for (i = 1; i < m - 1; i++) {
        for (j = 1; j < n - 1; j++) {
            if (S1[i][j] == 1) //data point
            {
                l = S1[i][j - 1];
                r = S1[i][j + 1];
                b = S1[i - 1][j];
                t = S1[i + 1][j];
                lb = S1[i - 1][j - 1];
                rb = S1[i - 1][j + 1];
                lt = S1[i + 1][j - 1];
                rt = S1[i + 1][j + 1];

                if (l > 0 && r > 0 && b > 0 && t > 0 && lb > 0 && rb > 0 && lt > 0 && rt > 0) {
                    S1[i][j] = 2;    //Inside data point
                }
                if (l + r + b + t + lb + rb + lt + rt <= 2) {
                    S1[i][j] = 0;    //Data point, but not more than 3 continued data points together.
                }                        //So they can't be traced as a border (at least 4 points together).

            }
        }
    }

    //---- Remove isolated data points (up, down, left and right points are all undefine data).
    var isContinue;
    while (true) {
        isContinue = false;
        for (i = 1; i < m - 1; i++) {
            for (j = 1; j < n - 1; j++) {
                if (S1[i][j] == 1) //data point
                {
                    l = S1[i][j - 1];
                    r = S1[i][j + 1];
                    b = S1[i - 1][j];
                    t = S1[i + 1][j];
                    lb = S1[i - 1][j - 1];
                    rb = S1[i - 1][j + 1];
                    lt = S1[i + 1][j - 1];
                    rt = S1[i + 1][j + 1];
                    if ((l == 0 && r == 0) || (b == 0 && t == 0)) //Up, down, left and right points are all undefine data
                    {
                        S1[i][j] = 0;
                        isContinue = true;
                    }
                    if ((lt == 0 && r == 0 && b == 0) || (rt == 0 && l == 0 && b == 0)
                        || (lb == 0 && r == 0 && t == 0) || (rb == 0 && l == 0 && t == 0)) {
                        S1[i][j] = 0;
                        isContinue = true;
                    }
                }
            }
        }
        if (!isContinue) //untile no more isolated data point.
        {
            break;
        }
    }
    //Deal with grid data border points
    for (j = 0; j < n; j++) //Top and bottom border points
    {
        if (S1[0][j] == 1) {
            if (S1[1][j] == 0) //up point is undefine
            {
                S1[0][j] = 0;
            } else if (j == 0) {
                if (S1[0][j + 1] == 0) {
                    S1[0][j] = 0;
                }
            } else if (j == n - 1) {
                if (S1[0][n - 2] == 0) {
                    S1[0][j] = 0;
                }
            } else if (S1[0][j - 1] == 0 && S1[0][j + 1] == 0) {
                S1[0][j] = 0;
            }
        }
        if (S1[m - 1][j] == 1) {
            if (S1[m - 2][j] == 0) //down point is undefine
            {
                S1[m - 1][j] = 0;
            } else if (j == 0) {
                if (S1[m - 1][j + 1] == 0) {
                    S1[m - 1][j] = 0;
                }
            } else if (j == n - 1) {
                if (S1[m - 1][n - 2] == 0) {
                    S1[m - 1][j] = 0;
                }
            } else if (S1[m - 1][j - 1] == 0 && S1[m - 1][j + 1] == 0) {
                S1[m - 1][j] = 0;
            }
        }
    }
    for (i = 0; i < m; i++) //Left and right border points
    {
        if (S1[i][0] == 1) {
            if (S1[i][1] == 0) //right point is undefine
            {
                S1[i][0] = 0;
            } else if (i == 0) {
                if (S1[i + 1][0] == 0) {
                    S1[i][0] = 0;
                }
            } else if (i == m - 1) {
                if (S1[m - 2][0] == 0) {
                    S1[i][0] = 0;
                }
            } else if (S1[i - 1][0] == 0 && S1[i + 1][0] == 0) {
                S1[i][0] = 0;
            }
        }
        if (S1[i][n - 1] == 1) {
            if (S1[i][n - 2] == 0) //left point is undefine
            {
                S1[i][n - 1] = 0;
            } else if (i == 0) {
                if (S1[i + 1][n - 1] == 0) {
                    S1[i][n - 1] = 0;
                }
            } else if (i == m - 1) {
                if (S1[m - 2][n - 1] == 0) {
                    S1[i][n - 1] = 0;
                }
            } else if (S1[i - 1][n - 1] == 0 && S1[i + 1][n - 1] == 0) {
                S1[i][n - 1] = 0;
            }
        }
    }

    //---- Generate S2 array from S1, add border to S2 with undefine data.
    var S2 = [];
    for (i = 0; i < m + 2; i++) {
        S2[i] = [];
        for (j = 0; j < n + 2; j++) {
            if (i == 0 || i == m + 1) //bottom or top border
            {
                S2[i][j] = 0;
            } else if (j == 0 || j == n + 1) //left or right border
            {
                S2[i][j] = 0;
            } else {
                S2[i][j] = S1[i - 1][j - 1];
            }
        }
    }

    //---- Using times number of each point during chacing process.
    var UNum = [];
    for (i = 0; i < m + 2; i++) {
        UNum[i] = [];
        for (j = 0; j < n + 2; j++) {
            if (S2[i][j] == 1) {
                l = S2[i][j - 1];
                r = S2[i][j + 1];
                b = S2[i - 1][j];
                t = S2[i + 1][j];
                lb = S2[i - 1][j - 1];
                rb = S2[i - 1][j + 1];
                lt = S2[i + 1][j - 1];
                rt = S2[i + 1][j + 1];
                //---- Cross point with two boder lines, will be used twice.
                if (l == 1 && r == 1 && b == 1 && t == 1 && ((lb == 0 && rt == 0) || (rb == 0 && lt == 0))) {
                    UNum[i][j] = 2;
                } else {
                    UNum[i][j] = 1;
                }
            } else {
                UNum[i][j] = 0;
            }
        }
    }

    //---- Tracing borderlines
    var aPoint;
    var aijPoint;
    var aBLine;
    var pointList;
    var ijPList;
    var sI, sJ, i1, j1, i2, j2, i3 = 0, j3 = 0;
    for (i = 1; i < m + 1; i++) {
        for (j = 1; j < n + 1; j++) {
            if (S2[i][j] == 1) //Tracing border from any border point
            {
                pointList = [];
                ijPList = [];
                aPoint = {};
                aPoint.X = X[j - 1];
                aPoint.Y = Y[i - 1];
                aijPoint = {};
                aijPoint.I = i - 1;
                aijPoint.J = j - 1;
                pointList.push(aPoint);
                ijPList.push(aijPoint);
                sI = i;
                sJ = j;
                i2 = i;
                j2 = j;
                i1 = i2;
                j1 = -1;    //Trace from left firstly

                while (true) {
                    var ij3 = [];
                    ij3[0] = i3;
                    ij3[1] = j3;
                    if (traceBorder(S2, i1, i2, j1, j2, ij3)) {
                        i3 = ij3[0];
                        j3 = ij3[1];
                        i1 = i2;
                        j1 = j2;
                        i2 = i3;
                        j2 = j3;
                        UNum[i3][j3] = UNum[i3][j3] - 1;
                        if (UNum[i3][j3] == 0) {
                            S2[i3][j3] = 3;    //Used border point
                        }
                    } else {
                        break;
                    }

                    aPoint = {};
                    aPoint.X = X[j3 - 1];
                    aPoint.Y = Y[i3 - 1];
                    aijPoint = {};
                    aijPoint.I = i3 - 1;
                    aijPoint.J = j3 - 1;
                    pointList.push(aPoint);
                    ijPList.push(aijPoint);
                    if (i3 == sI && j3 == sJ) {
                        break;
                    }
                }
                UNum[i][j] = UNum[i][j] - 1;
                if (UNum[i][j] == 0) {
                    S2[i][j] = 3;    //Used border point
                }                        //UNum[i][j] = UNum[i][j] - 1;
                if (pointList.length > 1) {
                    aBLine = {extent:{}};
                    aBLine.area = getExtentAndArea(pointList, aBLine.extent);
                    aBLine.isOutLine = true;
                    aBLine.isClockwise = true;
                    aBLine.pointList = pointList;
                    aBLine.ijPointList = ijPList;
                    borderLines.push(aBLine);
                }
            }
        }
    }

    //---- Form borders
    var borders = [];
    var aBorder;
    var aLine, bLine;
    //---- Sort borderlines with area from small to big.
    //For inside border line analysis
    //从大到小？
    // for (i = 1; i < borderLines.length; i++) {
    //     aLine = borderLines[i];
    //     for (j = 0; j < i; j++) {
    //         bLine = borderLines.get(j);
    //         if (aLine.area > bLine.area) {
    //             borderLines.remove(i);
    //             borderLines.add(j, aLine);
    //             break;
    //         }
    //     }
    // }
    borderLines.sort(function (a,b) {
        return b.area - a.area;
    });
    var lineList=[];
    if (borderLines.length == 1) //Only one boder line
    {
        aLine = borderLines[0];
        if (!isClockwise(aLine.pointList)) {
            aLine.pointList.reverse()
            aLine.ijPointList.reverse()
        }
        aLine.isClockwise = true;
        lineList = [];
        lineList.push(aLine);
        aBorder = {};
        aBorder.LineList = lineList;
        borders.push(aBorder);
    } else //muti border lines
    {
        for (i = 0; i < borderLines.length; i++) {
            aLine = borderLines[i];
            if (!isClockwise(aLine.pointList)) {
                aLine.pointList.reverse();
                aLine.ijPointList.reverse();
            }
            aLine.isClockwise = true;
            lineList = [];
            lineList.push(aLine);
            //Try to find the boder lines are inside of aLine.
            for (j = i + 1; j < borderLines.length; j++) {
                bLine = borderLines[j];
                if (bLine.extent.xMin > aLine.extent.xMin && bLine.extent.xMax < aLine.extent.xMax
                    && bLine.extent.yMin > aLine.extent.yMin && bLine.extent.yMax < aLine.extent.yMax) {
                    aPoint = bLine.pointList[0];
                    if (pointInPolygon(aLine.pointList, aPoint)) //bLine is inside of aLine
                    {
                        bLine.isOutLine = false;
                        if (isClockwise(bLine.pointList)) {
                            bLine.pointList.reverse();
                            bLine.ijPointList.reverse();
                        }
                        bLine.isClockwise = false;
                        lineList.push(bLine);
                        borderLines.splice(j,1);
                        j = j - 1;
                    }
                }
            }
            aBorder = {}
            aBorder.LineList = lineList;
            borders.push(aBorder);
        }
    }

    return borders;
}

/**
 * Create contour lines from the grid data with undefine data
 *
 * @param S0 input grid data
 * @param X X coordinate array
 * @param Y Y coordinate array
 * @param contour contour value array
 * @param S1 flag array
 * @param undefData undefine data
 * @param borders border line list
 * @return contour line list
 */
function createContourLines_UndefData(S0,X,Y,contour,S1,undefData,borders) {
    var nc = contour.length;
    var contourLineList = [];
    var cLineList;
    var m, n, i, j;
    m = S0.length;    //---- Y
    n = S0[0].length;    //---- X

    //---- Add a small value to aviod the contour point as same as data point
    var dShift;
    dShift = contour[0] * 0.00001;
    if (dShift == 0) {
        dShift = 0.00001;
    }
    for (i = 0; i < m; i++) {
        for (j = 0; j < n; j++) {
            if (S0[i][j]!=undefData) //S0[i, j] = S0[i, j] + (contour[1] - contour[0]) * 0.0001;
            {
                S0[i][j] = S0[i][j] + dShift;
            }
        }
    }

    //---- Define if H S are border
    var SB = [[],[]], HB = [[],[]];   //---- Which border and trace direction
    for (i = 0; i < m; i++) {
        SB[0][i]=[],HB[0][i]=[]
        SB[1][i]=[],HB[1][i]=[]
        for (j = 0; j < n; j++) {
            if (j < n - 1) {
                SB[0][i][j] = -1;
                SB[1][i][j] = -1;
            }
            if (i < m - 1) {
                HB[0][i][j] = -1;
                HB[1][i][j] = -1;
            }
        }
    }
    var aBorder;
    var aBLine;
    var ijPList;
    var k, si, sj;
    var aijP, bijP;
    for (i = 0; i < borders.length; i++) {
        aBorder = borders[i];
        for (j = 0; j < aBorder.LineList.length; j++) {
            aBLine = aBorder.LineList[j];
            ijPList = aBLine.ijPointList;
            for (k = 0; k < ijPList.length - 1; k++) {
                aijP = ijPList[k];
                bijP = ijPList[k + 1];
                if (aijP.I == bijP.I) {
                    si = aijP.I;
                    sj = Math.min(aijP.J, bijP.J);
                    SB[0][si][sj] = i;
                    if (bijP.J > aijP.J) //---- Trace from top
                    {
                        SB[1][si][sj] = 1;
                    } else {
                        SB[1][si][sj] = 0;    //----- Trace from bottom
                    }
                } else {
                    sj = aijP.J;
                    si = Math.min(aijP.I, bijP.I);
                    HB[0][si][sj] = i;
                    if (bijP.I > aijP.I) //---- Trace from left
                    {
                        HB[1][si][sj] = 0;
                    } else {
                        HB[1][si][sj] = 1;    //---- Trace from right
                    }
                }
            }
        }
    }

    //---- Define horizontal and vertical arrays with the position of the tracing value, -2 means no tracing point.
    var S = [];
    var H = [];
    var w;    //---- Tracing value
    var c;
    //ArrayList _endPointList = new ArrayList();    //---- Contour line end points for insert to border
    for (c = 0; c < nc; c++) {
        w = contour[c];
        for (i = 0; i < m; i++) {
            S[i]=[],H[i]=[];
            for (j = 0; j < n; j++) {
                if (j < n - 1) {
                    if (S1[i][j] != 0 && S1[i][j + 1] != 0) {
                        if ((S0[i][j] - w) * (S0[i][j + 1] - w) < 0) //---- Has tracing value
                        {
                            S[i][j] = (w - S0[i][j]) / (S0[i][j + 1] - S0[i][j]);
                        } else {
                            S[i][j] = -2;
                        }
                    } else {
                        S[i][j] = -2;
                    }
                }
                if (i < m - 1) {
                    if (S1[i][j] != 0 && S1[i + 1][j] != 0) {
                        if ((S0[i][j] - w) * (S0[i + 1][j] - w) < 0) //---- Has tracing value
                        {
                            H[i][j] = (w - S0[i][j]) / (S0[i + 1][j] - S0[i][j]);
                        } else {
                            H[i][j] = -2;
                        }
                    } else {
                        H[i][j] = -2;
                    }
                }
            }
        }

        cLineList = isoline_UndefData(S0, X, Y, w, S, H, SB, HB, contourLineList.length);
        contourLineList=contourLineList.concat(cLineList);
    }

    //---- Set border index for close contours
    var aLine;
    //List pList = new ArrayList();
    var aPoint;
    for (i = 0; i < borders.length; i++) {
        aBorder = borders[i];
        aBLine = aBorder.LineList[0];
        for (j = 0; j < contourLineList.length; j++) {
            aLine = contourLineList[j];
            if (aLine.Type=="Close") {
                aPoint = aLine.PointList[0];
                if (pointInPolygon(aBLine.pointList, aPoint)) {
                    aLine.BorderIdx = i;
                }
            }
            // contourLineList.remove(j);
            // contourLineList.add(j, aLine);
            contourLineList.splice(j,1,aLine)
        }
    }

    return contourLineList;
}
function traceIsoline_UndefData(i1,i2,H,S,j1,j2,X,Y,a2x,ij3,a3xy,IsS) {
    var canTrace = true;
    var a3x = 0, a3y = 0;
    var i3 = 0, j3 = 0;
    var isS = true;
    if (i1 < i2) //---- Trace from bottom
    {
        if (H[i2][j2] != -2 && H[i2][j2 + 1] != -2) {
            if (H[i2][j2] < H[i2][j2 + 1]) {
                a3x = X[j2];
                a3y = Y[i2] + H[i2][j2] * (Y[i2 + 1] - Y[i2]);
                i3 = i2;
                j3 = j2;
                H[i3][j3] = -2;
                isS = false;
            } else {
                a3x = X[j2 + 1];
                a3y = Y[i2] + H[i2][j2 + 1] * (Y[i2 + 1] - Y[i2]);
                i3 = i2;
                j3 = j2 + 1;
                H[i3][j3] = -2;
                isS = false;
            }
        } else if (H[i2][j2] != -2 && H[i2][j2 + 1] == -2) {
            a3x = X[j2];
            a3y = Y[i2] + H[i2][j2] * (Y[i2 + 1] - Y[i2]);
            i3 = i2;
            j3 = j2;
            H[i3][j3] = -2;
            isS = false;
        } else if (H[i2][j2] == -2 && H[i2][j2 + 1] != -2) {
            a3x = X[j2 + 1];
            a3y = Y[i2] + H[i2][j2 + 1] * (Y[i2 + 1] - Y[i2]);
            i3 = i2;
            j3 = j2 + 1;
            H[i3][j3] = -2;
            isS = false;
        } else if (S[i2 + 1][j2] != -2) {
            a3x = X[j2] + S[i2 + 1][j2] * (X[j2 + 1] - X[j2]);
            a3y = Y[i2 + 1];
            i3 = i2 + 1;
            j3 = j2;
            S[i3][j3] = -2;
            isS = true;
        } else {
            canTrace = false;
        }
    } else if (j1 < j2) //---- Trace from left
    {
        if (S[i2][j2] != -2 && S[i2 + 1][j2] != -2) {
            if (S[i2][j2] < S[i2 + 1][j2]) {
                a3x = X[j2] + S[i2][j2] * (X[j2 + 1] - X[j2]);
                a3y = Y[i2];
                i3 = i2;
                j3 = j2;
                S[i3][j3] = -2;
                isS = true;
            } else {
                a3x = X[j2] + S[i2 + 1][j2] * (X[j2 + 1] - X[j2]);
                a3y = Y[i2 + 1];
                i3 = i2 + 1;
                j3 = j2;
                S[i3][j3] = -2;
                isS = true;
            }
        } else if (S[i2][j2] != -2 && S[i2 + 1][j2] == -2) {
            a3x = X[j2] + S[i2][j2] * (X[j2 + 1] - X[j2]);
            a3y = Y[i2];
            i3 = i2;
            j3 = j2;
            S[i3][j3] = -2;
            isS = true;
        } else if (S[i2][j2] == -2 && S[i2 + 1][j2] != -2) {
            a3x = X[j2] + S[i2 + 1][j2] * (X[j2 + 1] - X[j2]);
            a3y = Y[i2 + 1];
            i3 = i2 + 1;
            j3 = j2;
            S[i3][j3] = -2;
            isS = true;
        } else if (H[i2][j2 + 1] != -2) {
            a3x = X[j2 + 1];
            a3y = Y[i2] + H[i2][j2 + 1] * (Y[i2 + 1] - Y[i2]);
            i3 = i2;
            j3 = j2 + 1;
            H[i3][j3] = -2;
            isS = false;
        } else {
            canTrace = false;
        }

    } else if (X[j2] < a2x) //---- Trace from top
    {
        if (H[i2 - 1][j2] != -2 && H[i2 - 1][j2 + 1] != -2) {
            if (H[i2 - 1][j2] > H[i2 - 1][j2 + 1]) //---- < changed to >
            {
                a3x = X[j2];
                a3y = Y[i2 - 1] + H[i2 - 1][j2] * (Y[i2] - Y[i2 - 1]);
                i3 = i2 - 1;
                j3 = j2;
                H[i3][j3] = -2;
                isS = false;
            } else {
                a3x = X[j2 + 1];
                a3y = Y[i2 - 1] + H[i2 - 1][j2 + 1] * (Y[i2] - Y[i2 - 1]);
                i3 = i2 - 1;
                j3 = j2 + 1;
                H[i3][j3] = -2;
                isS = false;
            }
        } else if (H[i2 - 1][j2] != -2 && H[i2 - 1][j2 + 1] == -2) {
            a3x = X[j2];
            a3y = Y[i2 - 1] + H[i2 - 1][j2] * (Y[i2] - Y[i2 - 1]);
            i3 = i2 - 1;
            j3 = j2;
            H[i3][j3] = -2;
            isS = false;
        } else if (H[i2 - 1][j2] == -2 && H[i2 - 1][j2 + 1] != -2) {
            a3x = X[j2 + 1];
            a3y = Y[i2 - 1] + H[i2 - 1][j2 + 1] * (Y[i2] - Y[i2 - 1]);
            i3 = i2 - 1;
            j3 = j2 + 1;
            H[i3][j3] = -2;
            isS = false;
        } else if (S[i2 - 1][j2] != -2) {
            a3x = X[j2] + S[i2 - 1][j2] * (X[j2 + 1] - X[j2]);
            a3y = Y[i2 - 1];
            i3 = i2 - 1;
            j3 = j2;
            S[i3][j3] = -2;
            isS = true;
        } else {
            canTrace = false;
        }
    } else //---- Trace from right
    {
        if (S[i2 + 1][j2 - 1] != -2 && S[i2][j2 - 1] != -2) {
            if (S[i2 + 1][j2 - 1] > S[i2][j2 - 1]) //---- < changed to >
            {
                a3x = X[j2 - 1] + S[i2 + 1][j2 - 1] * (X[j2] - X[j2 - 1]);
                a3y = Y[i2 + 1];
                i3 = i2 + 1;
                j3 = j2 - 1;
                S[i3][j3] = -2;
                isS = true;
            } else {
                a3x = X[j2 - 1] + S[i2][j2 - 1] * (X[j2] - X[j2 - 1]);
                a3y = Y[i2];
                i3 = i2;
                j3 = j2 - 1;
                S[i3][j3] = -2;
                isS = true;
            }
        } else if (S[i2 + 1][j2 - 1] != -2 && S[i2][j2 - 1] == -2) {
            a3x = X[j2 - 1] + S[i2 + 1][j2 - 1] * (X[j2] - X[j2 - 1]);
            a3y = Y[i2 + 1];
            i3 = i2 + 1;
            j3 = j2 - 1;
            S[i3][j3] = -2;
            isS = true;
        } else if (S[i2 + 1][j2 - 1] == -2 && S[i2][j2 - 1] != -2) {
            a3x = X[j2 - 1] + S[i2][j2 - 1] * (X[j2] - X[j2 - 1]);
            a3y = Y[i2];
            i3 = i2;
            j3 = j2 - 1;
            S[i3][j3] = -2;
            isS = true;
        } else if (H[i2][j2 - 1] != -2) {
            a3x = X[j2 - 1];
            a3y = Y[i2] + H[i2][j2 - 1] * (Y[i2 + 1] - Y[i2]);
            i3 = i2;
            j3 = j2 - 1;
            H[i3][j3] = -2;
            isS = false;
        } else {
            canTrace = false;
        }
    }

    ij3[0] = i3;
    ij3[1] = j3;
    a3xy[0] = a3x;
    a3xy[1] = a3y;
    IsS[0] = isS;

    return canTrace;
}
function isoline_UndefData(S0,X,Y,W,S,H,SB,HB,lineNum) {
    var _endPointList = [];
    var cLineList = [];
    var m, n, i, j;
    m = S0.length;
    n = S0[0].length;

    var i1, i2, j1, j2, i3 = 0, j3 = 0;
    var a2x, a2y, a3x = 0, a3y = 0, sx, sy;
    var aPoint;
    var aLine;
    var pList;
    var isS = true;
    var aEndPoint = {sPoint:{}};
    //---- Tracing from border
    for (i = 0; i < m; i++) {
        for (j = 0; j < n; j++) {
            if (j < n - 1) {
                if (SB[0][i][j] > -1) //---- Border
                {
                    if (S[i][j] != -2) {
                        pList = [];
                        i2 = i;
                        j2 = j;
                        a2x = X[j2] + S[i2][j2] * (X[j2 + 1] - X[j2]);    //---- x of first point
                        a2y = Y[i2];                   //---- y of first point
                        if (SB[1][i][j] == 0) //---- Bottom border
                        {
                            i1 = -1;
                            aEndPoint.sPoint.X = X[j + 1];
                            aEndPoint.sPoint.Y = Y[i];
                        } else {
                            i1 = i2;
                            aEndPoint.sPoint.X = X[j];
                            aEndPoint.sPoint.Y = Y[i];
                        }
                        j1 = j2;
                        aPoint = {};
                        aPoint.X = a2x;
                        aPoint.Y = a2y;
                        pList.push(aPoint);

                        aEndPoint.Index = lineNum + cLineList.length;
                        aEndPoint.Point = aPoint;
                        aEndPoint.BorderIdx = SB[0][i][j];
                        _endPointList.push(aEndPoint);

                        aLine = {};
                        aLine.Type = "Border";
                        aLine.BorderIdx = SB[0][i][j];
                        while (true) {
                            var ij3 = [i3, j3];
                            var a3xy = [a3x, a3y];
                            var IsS = [isS];
                            if (traceIsoline_UndefData(i1, i2, H, S, j1, j2, X, Y, a2x, ij3, a3xy, IsS)) {
                                i3 = ij3[0];
                                j3 = ij3[1];
                                a3x = a3xy[0];
                                a3y = a3xy[1];
                                isS = IsS[0];
                                aPoint = {};
                                aPoint.X = a3x;
                                aPoint.Y = a3y;
                                pList.push(aPoint);
                                if (isS) {
                                    if (SB[0][i3][j3] > -1) {
                                        if (SB[1][i3][j3] == 0) {
                                            aEndPoint.sPoint.X = X[j3 + 1];
                                            aEndPoint.sPoint.Y = Y[i3];
                                        } else {
                                            aEndPoint.sPoint.X = X[j3];
                                            aEndPoint.sPoint.Y = Y[i3];
                                        }
                                        break;
                                    }
                                } else if (HB[0][i3][j3] > -1) {
                                    if (HB[1][i3][j3] == 0) {
                                        aEndPoint.sPoint.X = X[j3];
                                        aEndPoint.sPoint.Y = Y[i3];
                                    } else {
                                        aEndPoint.sPoint.X = X[j3];
                                        aEndPoint.sPoint.Y = Y[i3 + 1];
                                    }
                                    break;
                                }
                                a2x = a3x;
                                //a2y = a3y;
                                i1 = i2;
                                j1 = j2;
                                i2 = i3;
                                j2 = j3;
                            } else {
                                aLine.Type = "Error";
                                break;
                            }
                        }
                        S[i][j] = -2;
                        if (pList.length > 1 && aLine.Type!="Error") {
                            aEndPoint.Point = aPoint;
                            _endPointList.push(aEndPoint);

                            aLine.Value = W;
                            aLine.PointList = pList;
                            cLineList.push(aLine);
                        } else {
                            _endPointList.splice(_endPointList.length - 1,1);
                        }

                    }
                }
            }
            if (i < m - 1) {
                if (HB[0][i][j] > -1) //---- Border
                {
                    if (H[i][j] != -2) {
                        pList = [];
                        i2 = i;
                        j2 = j;
                        a2x = X[j2];
                        a2y = Y[i2] + H[i2][j2] * (Y[i2 + 1] - Y[i2]);
                        i1 = i2;
                        if (HB[1][i][j] == 0) {
                            j1 = -1;
                            aEndPoint.sPoint.X = X[j];
                            aEndPoint.sPoint.Y = Y[i];
                        } else {
                            j1 = j2;
                            aEndPoint.sPoint.X = X[j];
                            aEndPoint.sPoint.Y = Y[i + 1];
                        }
                        aPoint = {};
                        aPoint.X = a2x;
                        aPoint.Y = a2y;
                        pList.push(aPoint);

                        aEndPoint.Index = lineNum + cLineList.length;
                        aEndPoint.Point = aPoint;
                        aEndPoint.BorderIdx = HB[0][i][j];
                        _endPointList.push(aEndPoint);

                        aLine = {};
                        aLine.Type = "Border";
                        aLine.BorderIdx = HB[0][i][j];
                        while (true) {
                            var ij3 = [i3, j3];
                            var a3xy = [a3x, a3y];
                            var IsS = [isS];
                            if (traceIsoline_UndefData(i1, i2, H, S, j1, j2, X, Y, a2x, ij3, a3xy, IsS)) {
                                i3 = ij3[0];
                                j3 = ij3[1];
                                a3x = a3xy[0];
                                a3y = a3xy[1];
                                isS = IsS[0];
                                aPoint = {};
                                aPoint.X = a3x;
                                aPoint.Y = a3y;
                                pList.push(aPoint);
                                if (isS) {
                                    if (SB[0][i3][j3] > -1) {
                                        if (SB[1][i3][j3] == 0) {
                                            aEndPoint.sPoint.X = X[j3 + 1];
                                            aEndPoint.sPoint.Y = Y[i3];
                                        } else {
                                            aEndPoint.sPoint.X = X[j3];
                                            aEndPoint.sPoint.Y = Y[i3];
                                        }
                                        break;
                                    }
                                } else if (HB[0][i3][j3] > -1) {
                                    if (HB[1][i3][j3] == 0) {
                                        aEndPoint.sPoint.X = X[j3];
                                        aEndPoint.sPoint.Y = Y[i3];
                                    } else {
                                        aEndPoint.sPoint.X = X[j3];
                                        aEndPoint.sPoint.Y = Y[i3 + 1];
                                    }
                                    break;
                                }
                                a2x = a3x;
                                //a2y = a3y;
                                i1 = i2;
                                j1 = j2;
                                i2 = i3;
                                j2 = j3;
                            } else {
                                aLine.Type = "Error";
                                break;
                            }
                        }
                        H[i][j] = -2;
                        if (pList.length > 1 && aLine.Type!="Error") {
                            aEndPoint.Point = aPoint;
                            _endPointList.push(aEndPoint);

                            aLine.Value = W;
                            aLine.PointList = pList;
                            cLineList.push(aLine);
                        } else {
                            _endPointList.splice(_endPointList.length - 1,1);
                        }

                    }
                }
            }
        }
    }

    //---- Clear border points
    for (j = 0; j < n - 1; j++) {
        if (S[0][j] != -2) {
            S[0][j] = -2;
        }
        if (S[m - 1][j] != -2) {
            S[m - 1][j] = -2;
        }
    }

    for (i = 0; i < m - 1; i++) {
        if (H[i][0] != -2) {
            H[i][0] = -2;
        }
        if (H[i][n - 1] != -2) {
            H[i][n - 1] = -2;
        }
    }

    //---- Tracing close lines
    for (i = 1; i < m - 2; i++) {
        for (j = 1; j < n - 1; j++) {
            if (H[i][j] != -2) {
                var pointList = [];
                i2 = i;
                j2 = j;
                a2x = X[j2];
                a2y = Y[i] + H[i][j2] * (Y[i + 1] - Y[i]);
                j1 = -1;
                i1 = i2;
                sx = a2x;
                sy = a2y;
                aPoint = {};
                aPoint.X = a2x;
                aPoint.Y = a2y;
                pointList.push(aPoint);
                aLine = {};
                aLine.Type = "Close";

                while (true) {
                    var ij3 = [], a3xy = [],IsS = [];
                    if (traceIsoline_UndefData(i1, i2, H, S, j1, j2, X, Y, a2x, ij3, a3xy, IsS)) {
                        i3 = ij3[0];
                        j3 = ij3[1];
                        a3x = a3xy[0];
                        a3y = a3xy[1];
                        //isS = IsS[0];
                        aPoint = {};
                        aPoint.X = a3x;
                        aPoint.Y = a3y;
                        pointList.push(aPoint);
                        if (Math.abs(a3y - sy) < 0.000001 && Math.abs(a3x - sx) < 0.000001) {
                            break;
                        }

                        a2x = a3x;
                        //a2y = a3y;
                        i1 = i2;
                        j1 = j2;
                        i2 = i3;
                        j2 = j3;
                        //If X[j2] < a2x && i2 = 0 )
                        //    aLine.type = "Error"
                        //    Exit Do
                        //End If
                    } else {
                        aLine.Type = "Error";
                        break;
                    }
                }
                H[i][j] = -2;
                if (pointList.length > 1 && aLine.Type!="Error") {
                    aLine.Value = W;
                    aLine.PointList = pointList;
                    cLineList.push(aLine);
                }
            }
        }
    }

    for (i = 1; i < m - 1; i++) {
        for (j = 1; j < n - 2; j++) {
            if (S[i][j] != -2) {
                var pointList = [];
                i2 = i;
                j2 = j;
                a2x = X[j2] + S[i][j] * (X[j2 + 1] - X[j2]);
                a2y = Y[i];
                j1 = j2;
                i1 = -1;
                sx = a2x;
                sy = a2y;
                aPoint = {};
                aPoint.X = a2x;
                aPoint.Y = a2y;
                pointList.push(aPoint);
                aLine = {};
                aLine.Type = "Close";

                while (true) {
                    var ij3 = [], a3xy = [], IsS = [];
                    if (traceIsoline_UndefData(i1, i2, H, S, j1, j2, X, Y, a2x, ij3, a3xy, IsS)) {
                        i3 = ij3[0];
                        j3 = ij3[1];
                        a3x = a3xy[0];
                        a3y = a3xy[1];
                        //isS = IsS[0];
                        aPoint = {};
                        aPoint.X = a3x;
                        aPoint.Y = a3y;
                        pointList.push(aPoint);
                        if (Math.abs(a3y - sy) < 0.000001 && Math.abs(a3x - sx) < 0.000001) {
                            break;
                        }

                        a2x = a3x;
                        //a2y = a3y;
                        i1 = i2;
                        j1 = j2;
                        i2 = i3;
                        j2 = j3;
                    } else {
                        aLine.Type = "Error";
                        break;
                    }
                }
                S[i][j] = -2;
                if (pointList.length > 1 && aLine.Type!="Error") {
                    aLine.Value = W;
                    aLine.PointList = pointList;
                    cLineList.push(aLine);
                }
            }
        }
    }

    return cLineList;
}
function traceBorder(S1,i1,i2,j1,j2,ij3) {
    var canTrace = true;
    var a, b, c, d;
    if (i1 < i2) //---- Trace from bottom
    {
        if (S1[i2][j2 - 1] == 1 && S1[i2][j2 + 1] == 1) {
            a = S1[i2 - 1][j2 - 1];
            b = S1[i2 + 1][j2];
            c = S1[i2 + 1][j2 - 1];
            if ((a != 0 && b == 0) || (a == 0 && b != 0 && c != 0)) {
                ij3[0] = i2;
                ij3[1] = j2 - 1;
            } else {
                ij3[0] = i2;
                ij3[1] = j2 + 1;
            }
        } else if (S1[i2][j2 - 1] == 1 && S1[i2 + 1][j2] == 1) {
            a = S1[i2 + 1][j2 - 1];
            b = S1[i2 + 1][j2 + 1];
            c = S1[i2][j2 - 1];
            d = S1[i2][j2 + 1];
            if (a == 0 || b == 0 || c == 0 || d == 0) {
                if ((a == 0 && d == 0) || (b == 0 && c == 0)) {
                    ij3[0] = i2;
                    ij3[1] = j2 - 1;
                } else {
                    ij3[0] = i2 + 1;
                    ij3[1] = j2;
                }
            } else {
                ij3[0] = i2;
                ij3[1] = j2 - 1;
            }
        } else if (S1[i2][j2 + 1] == 1 && S1[i2 + 1][j2] == 1) {
            a = S1[i2 + 1][j2 - 1];
            b = S1[i2 + 1][j2 + 1];
            c = S1[i2][j2 - 1];
            d = S1[i2][j2 + 1];
            if (a == 0 || b == 0 || c == 0 || d == 0) {
                if ((a == 0 && d == 0) || (b == 0 && c == 0)) {
                    ij3[0] = i2;
                    ij3[1] = j2 + 1;
                } else {
                    ij3[0] = i2 + 1;
                    ij3[1] = j2;
                }
            } else {
                ij3[0] = i2;
                ij3[1] = j2 + 1;
            }
        } else if (S1[i2][j2 - 1] == 1) {
            ij3[0] = i2;
            ij3[1] = j2 - 1;
        } else if (S1[i2][j2 + 1] == 1) {
            ij3[0] = i2;
            ij3[1] = j2 + 1;
        } else if (S1[i2 + 1][j2] == 1) {
            ij3[0] = i2 + 1;
            ij3[1] = j2;
        } else {
            canTrace = false;
        }
    } else if (j1 < j2) //---- Trace from left
    {
        if (S1[i2 + 1][j2] == 1 && S1[i2 - 1][j2] == 1) {
            a = S1[i2 + 1][j2 - 1];
            b = S1[i2][j2 + 1];
            c = S1[i2 + 1][j2 + 1];
            if ((a != 0 && b == 0) || (a == 0 && b != 0 && c != 0)) {
                ij3[0] = i2 + 1;
                ij3[1] = j2;
            } else {
                ij3[0] = i2 - 1;
                ij3[1] = j2;
            }
        } else if (S1[i2 + 1][j2] == 1 && S1[i2][j2 + 1] == 1) {
            c = S1[i2 - 1][j2];
            d = S1[i2 + 1][j2];
            a = S1[i2 - 1][j2 + 1];
            b = S1[i2 + 1][j2 + 1];
            if (a == 0 || b == 0 || c == 0 || d == 0) {
                if ((a == 0 && d == 0) || (b == 0 && c == 0)) {
                    ij3[0] = i2 + 1;
                    ij3[1] = j2;
                } else {
                    ij3[0] = i2;
                    ij3[1] = j2 + 1;
                }
            } else {
                ij3[0] = i2 + 1;
                ij3[1] = j2;
            }
        } else if (S1[i2 - 1][j2] == 1 && S1[i2][j2 + 1] == 1) {
            c = S1[i2 - 1][j2];
            d = S1[i2 + 1][j2];
            a = S1[i2 - 1][j2 + 1];
            b = S1[i2 + 1][j2 + 1];
            if (a == 0 || b == 0 || c == 0 || d == 0) {
                if ((a == 0 && d == 0) || (b == 0 && c == 0)) {
                    ij3[0] = i2 - 1;
                    ij3[1] = j2;
                } else {
                    ij3[0] = i2;
                    ij3[1] = j2 + 1;
                }
            } else {
                ij3[0] = i2 - 1;
                ij3[1] = j2;
            }
        } else if (S1[i2 + 1][j2] == 1) {
            ij3[0] = i2 + 1;
            ij3[1] = j2;
        } else if (S1[i2 - 1][j2] == 1) {
            ij3[0] = i2 - 1;
            ij3[1] = j2;
        } else if (S1[i2][j2 + 1] == 1) {
            ij3[0] = i2;
            ij3[1] = j2 + 1;
        } else {
            canTrace = false;
        }
    } else if (i1 > i2) //---- Trace from top
    {
        if (S1[i2][j2 - 1] == 1 && S1[i2][j2 + 1] == 1) {
            a = S1[i2 + 1][j2 - 1];
            b = S1[i2 - 1][j2];
            c = S1[i2 - 1][j2 + 1];
            if ((a != 0 && b == 0) || (a == 0 && b != 0 && c != 0)) {
                ij3[0] = i2;
                ij3[1] = j2 - 1;
            } else {
                ij3[0] = i2;
                ij3[1] = j2 + 1;
            }
        } else if (S1[i2][j2 - 1] == 1 && S1[i2 - 1][j2] == 1) {
            a = S1[i2 - 1][j2 - 1];
            b = S1[i2 - 1][j2 + 1];
            c = S1[i2][j2 - 1];
            d = S1[i2][j2 + 1];
            if (a == 0 || b == 0 || c == 0 || d == 0) {
                if ((a == 0 && d == 0) || (b == 0 && c == 0)) {
                    ij3[0] = i2;
                    ij3[1] = j2 - 1;
                } else {
                    ij3[0] = i2 - 1;
                    ij3[1] = j2;
                }
            } else {
                ij3[0] = i2;
                ij3[1] = j2 - 1;
            }
        } else if (S1[i2][j2 + 1] == 1 && S1[i2 - 1][j2] == 1) {
            a = S1[i2 - 1][j2 - 1];
            b = S1[i2 - 1][j2 + 1];
            c = S1[i2][j2 - 1];
            d = S1[i2][j2 + 1];
            if (a == 0 || b == 0 || c == 0 || d == 0) {
                if ((a == 0 && d == 0) || (b == 0 && c == 0)) {
                    ij3[0] = i2;
                    ij3[1] = j2 + 1;
                } else {
                    ij3[0] = i2 - 1;
                    ij3[1] = j2;
                }
            } else {
                ij3[0] = i2;
                ij3[1] = j2 + 1;
            }
        } else if (S1[i2][j2 - 1] == 1) {
            ij3[0] = i2;
            ij3[1] = j2 - 1;
        } else if (S1[i2][j2 + 1] == 1) {
            ij3[0] = i2;
            ij3[1] = j2 + 1;
        } else if (S1[i2 - 1][j2] == 1) {
            ij3[0] = i2 - 1;
            ij3[1] = j2;
        } else {
            canTrace = false;
        }
    } else if (j1 > j2) //---- Trace from right
    {
        if (S1[i2 + 1][j2] == 1 && S1[i2 - 1][j2] == 1) {
            a = S1[i2 + 1][j2 + 1];
            b = S1[i2][j2 - 1];
            c = S1[i2 - 1][j2 - 1];
            if ((a != 0 && b == 0) || (a == 0 && b != 0 && c != 0)) {
                ij3[0] = i2 + 1;
                ij3[1] = j2;
            } else {
                ij3[0] = i2 - 1;
                ij3[1] = j2;
            }
        } else if (S1[i2 + 1][j2] == 1 && S1[i2][j2 - 1] == 1) {
            c = S1[i2 - 1][j2];
            d = S1[i2 + 1][j2];
            a = S1[i2 - 1][j2 - 1];
            b = S1[i2 + 1][j2 - 1];
            if (a == 0 || b == 0 || c == 0 || d == 0) {
                if ((a == 0 && d == 0) || (b == 0 && c == 0)) {
                    ij3[0] = i2 + 1;
                    ij3[1] = j2;
                } else {
                    ij3[0] = i2;
                    ij3[1] = j2 - 1;
                }
            } else {
                ij3[0] = i2 + 1;
                ij3[1] = j2;
            }
        } else if (S1[i2 - 1][j2] == 1 && S1[i2][j2 - 1] == 1) {
            c = S1[i2 - 1][j2];
            d = S1[i2 + 1][j2];
            a = S1[i2 - 1][j2 - 1];
            b = S1[i2 + 1][j2 - 1];
            if (a == 0 || b == 0 || c == 0 || d == 0) {
                if ((a == 0 && d == 0) || (b == 0 && c == 0)) {
                    ij3[0] = i2 - 1;
                    ij3[1] = j2;
                } else {
                    ij3[0] = i2;
                    ij3[1] = j2 - 1;
                }
            } else {
                ij3[0] = i2 - 1;
                ij3[1] = j2;
            }
        } else if (S1[i2 + 1][j2] == 1) {
            ij3[0] = i2 + 1;
            ij3[1] = j2;
        } else if (S1[i2 - 1][j2] == 1) {
            ij3[0] = i2 - 1;
            ij3[1] = j2;
        } else if (S1[i2][j2 - 1] == 1) {
            ij3[0] = i2;
            ij3[1] = j2 - 1;
        } else {
            canTrace = false;
        }
    }

    return canTrace;
}
function getExtentAndArea( pList, aExtent) {
    var bArea, minX, minY, maxX, maxY;
    var i;
    var aPoint;
    aPoint = pList[0];
    minX = aPoint.X;
    maxX = aPoint.X;
    minY = aPoint.Y;
    maxY = aPoint.Y;
    for (i = 1; i < pList.length; i++) {
        aPoint = pList[i];
        if (aPoint.X < minX) {
            minX = aPoint.X;
        }

        if (aPoint.X > maxX) {
            maxX = aPoint.X;
        }

        if (aPoint.Y < minY) {
            minY = aPoint.Y;
        }

        if (aPoint.Y > maxY) {
            maxY = aPoint.Y;
        }
    }

    aExtent.xMin = minX;
    aExtent.yMin = minY;
    aExtent.xMax = maxX;
    aExtent.yMax = maxY;
    bArea = (maxX - minX) * (maxY - minY);

    return bArea;
}
/**
 * Determine if the point list is clockwise
 *
 * @param pointList point list
 * @return is or not clockwise
 */
function isClockwise(pointList) {
    var i,aPoint,yMax = 0,yMaxIdx = 0;
    for (i = 0; i < pointList.length - 1; i++) {
        aPoint = pointList[i];
        if (i == 0) {
            yMax = aPoint.Y;
            yMaxIdx = 0;
        } else if (yMax < aPoint.Y) {
            yMax = aPoint.Y;
            yMaxIdx = i;
        }
    }
    var p1, p2, p3;
    var p1Idx, p2Idx, p3Idx;
    p1Idx = yMaxIdx - 1;
    p2Idx = yMaxIdx;
    p3Idx = yMaxIdx + 1;
    if (yMaxIdx == 0) {
        p1Idx = pointList.length - 2;
    }

    p1 = pointList[p1Idx];
    p2 = pointList[p2Idx];
    p3 = pointList[p3Idx];
    if ((p3.X - p1.X) * (p2.Y - p1.Y) - (p2.X - p1.X) * (p3.Y - p1.Y) > 0) {
        return true;
    } else {
        return false;
    }
}
function pointInPolygon(poly, aPoint) {
    var xNew, yNew, xOld, yOld;
    var x1, y1, x2, y2;
    var i;
    var inside = false;
    var nPoints = poly.length;

    if (nPoints < 3) {
        return false;
    }

    xOld = poly[nPoints - 1].X;
    yOld = poly[nPoints - 1].Y;
    for (i = 0; i < nPoints; i++) {
        xNew = poly[i].X;
        yNew = poly[i].Y;
        if (xNew > xOld) {
            x1 = xOld;
            x2 = xNew;
            y1 = yOld;
            y2 = yNew;
        } else {
            x1 = xNew;
            x2 = xOld;
            y1 = yNew;
            y2 = yOld;
        }

        //---- edge "open" at left end
        if ((xNew < aPoint.X) == (aPoint.X <= xOld)
            && (aPoint.Y - y1) * (x2 - x1) < (y2 - y1) * (aPoint.X - x1)) {
            inside = !inside;
        }

        xOld = xNew;
        yOld = yNew;
    }

    return inside;
}

export default tracingContourLines;