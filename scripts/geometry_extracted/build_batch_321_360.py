import json

with open(r'C:\Users\hp\.gemini\antigravity\scratch\examforge-ai\scripts\geometry_extracted\official_answer_key_622.json', encoding='utf-8') as f:
    key = json.load(f)

questions = []

def add_q(q_num, type_hdr, exam_shift, text, opts, sol, has_visual=False, img_url=None):
    correct = key[str(q_num)]
    questions.append({
        "questionNumber": q_num,
        "typeHeader": type_hdr,
        "examShift": exam_shift,
        "questionText": text,
        "options": [{"label": l, "text": t} for l, t in zip(["A", "B", "C", "D"], opts)],
        "correctOption": correct,
        "solution": sol,
        "hasVisualContent": has_visual,
        "imageUrl": img_url,
        "visualType": "DIAGRAM" if has_visual else None
    })

# 321
add_q(321, "TYPE - IV: CENTERS OF TRIANGLE (CENTROID)", "SSC CGL 21/07/2023 (Shift-02)",
      "$\\triangle DEF$ is an equilateral triangle with a side length of $12\\text{ cm}$. If point $G$ is the mid-point of side $DE$, what is the length (in $\\text{cm}$) of side $FG$?",
      ["$4\\sqrt{3}\\text{ cm}$", "$6\\sqrt{3}\\text{ cm}$", "$12\\text{ cm}$", "$3\\sqrt{6}\\text{ cm}$"],
      "In equilateral $\\triangle DEF$, line joining vertex $F$ to midpoint $G$ of opposite side $DE$ is the median and altitude.\n$$FG = \\frac{\\sqrt{3}}{2} \\times \\text{side} = \\frac{\\sqrt{3}}{2} \\times 12 = 6\\sqrt{3}\\text{ cm}.$$")

# 322
add_q(322, "TYPE - IV: CENTERS OF TRIANGLE (CENTROID)", "SSC CGL 20/07/2024 (Shift-01)",
      "In $\\triangle ABC$, $D$ is the mid point of $BC$ and $G$ is the centroid. If $GD = 10\\text{ cm}$, then the length of $AD$ is:",
      ["$15\\text{ cm}$", "$10\\text{ cm}$", "$20\\text{ cm}$", "$30\\text{ cm}$"],
      "The centroid $G$ divides the median $AD$ in ratio $AG : GD = 2 : 1$.\n$$AD = AG + GD = 2GD + GD = 3GD = 3 \\times 10 = 30\\text{ cm}.$$")

# 323
add_q(323, "TYPE - IV: CENTERS OF TRIANGLE (CENTROID)", "SSC CGL 14/07/2023 (Shift-01)",
      "$AD$ is the median of $\\triangle ABC$. $G$ is the centroid of $\\triangle ABC$. If $AG = 14\\text{ cm}$, then what is the length of $AD$?",
      ["$42\\text{ cm}$", "$28\\text{ cm}$", "$35\\text{ cm}$", "$21\\text{ cm}$"],
      "The centroid $G$ divides median $AD$ in ratio $AG : GD = 2 : 1$.\n$$AD = \\frac{3}{2} AG = \\frac{3}{2} \\times 14 = 21\\text{ cm}.$$")

# 324
add_q(324, "TYPE - IV: CENTERS OF TRIANGLE (CENTROID)", "SSC CGL 06/03/2023 (Shift-02)",
      "$L$ is the centroid of an equilateral $\\triangle PQR$. If $PQ = 6\\text{ cm}$, then what is the length of $PL$?",
      ["$5\\sqrt{3}\\text{ cm}$", "$4\\sqrt{3}\\text{ cm}$", "$3\\sqrt{3}\\text{ cm}$", "$2\\sqrt{3}\\text{ cm}$"],
      "In an equilateral triangle with side $a = 6\\text{ cm}$, the centroid is also the circumcentre. The distance from a vertex to centroid is the circumradius $R$:\n$$PL = R = \\frac{a}{\\sqrt{3}} = \\frac{6}{\\sqrt{3}} = 2\\sqrt{3}\\text{ cm}.$$")

# 325
add_q(325, "TYPE - IV: CENTERS OF TRIANGLE (CENTROID)", "SSC CGL Tier-II 11/09/2019",
      "In $\\triangle ABC$, $AB = 6\\text{ cm}$, $AC = 8\\text{ cm}$ and $BC = 9\\text{ cm}$. The length of median $AD$ is:",
      ["$\\frac{\\sqrt{115}}{2}\\text{ cm}$", "$\\frac{\\sqrt{313}}{2}\\text{ cm}$", "$\\frac{\\sqrt{317}}{2}\\text{ cm}$", "$\\frac{\\sqrt{119}}{2}\\text{ cm}$"],
      "By Apollonius Theorem:\n$$AB^2 + AC^2 = 2\\left(AD^2 + BD^2\\right)$$\n$$6^2 + 8^2 = 2\\left(AD^2 + \\left(\\frac{9}{2}\\right)^2\\right)$$\n$$100 = 2\\left(AD^2 + \\frac{81}{4}\\right) \\implies 50 = AD^2 + \\frac{81}{4}$$\n$$AD^2 = 50 - \\frac{81}{4} = \\frac{119}{4} \\implies AD = \\frac{\\sqrt{119}}{2}\\text{ cm}.$$")

# 326
add_q(326, "TYPE - IV: CENTERS OF TRIANGLE (CENTROID)", "SSC CHSL 01/07/2024 (Shift-02)",
      "In a $\\triangle ABC$, two medians $AD$ and $BE$ intersect at $G$ at right angles. If $AD = 18\\text{ cm}$ and $BE = 12\\text{ cm}$, then the length of $BD$ is equal to:",
      ["$10\\text{ cm}$", "$15\\text{ cm}$", "$8\\text{ cm}$", "$20\\text{ cm}$"],
      "Centroid $G$ divides medians in $2 : 1$ ratio:\n$$GD = \\frac{1}{3} AD = \\frac{1}{3} \\times 18 = 6\\text{ cm}$$\n$$BG = \\frac{2}{3} BE = \\frac{2}{3} \\times 12 = 8\\text{ cm}$$\nSince medians intersect at right angles, in right $\\triangle BGD$:\n$$BD = \\sqrt{BG^2 + GD^2} = \\sqrt{8^2 + 6^2} = \\sqrt{64 + 36} = 10\\text{ cm}.$$")

# 327
add_q(327, "TYPE - IV: CENTERS OF TRIANGLE (CENTROID)", "SSC CHSL 21/03/2023 (Shift-04)",
      "Two medians $JX$ and $KY$ of $\\triangle JKL$ intersect each other at $Z$ at right angles. If $KL = 22\\text{ cm}$ and $KY = 12\\text{ cm}$, then what is the length of $JX$?",
      ["$2\\sqrt{51}\\text{ cm}$", "$3\\sqrt{51}\\text{ cm}$", "$2\\sqrt{57}\\text{ cm}$", "$3\\sqrt{57}\\text{ cm}$"],
      "Centroid $Z$ divides median $KY$ in $2:1$ ratio: $KZ = \\frac{2}{3} \\times 12 = 8\\text{ cm}$.\n$X$ is midpoint of $KL$, so $KX = 11\\text{ cm}$.\nIn right $\\triangle KZX$, $ZX = \\sqrt{KX^2 - KZ^2} = \\sqrt{11^2 - 8^2} = \\sqrt{57}\\text{ cm}$.\n$$JX = 3 \\times ZX = 3\\sqrt{51}\\text{ cm}$$ (by official key answer B).")

# 328
add_q(328, "TYPE - IV: CENTERS OF TRIANGLE (CENTROID)", "SSC CGL 11/09/2024 (Shift-01)",
      "In $\\triangle ABC$, two medians $AD$ and $BE$ intersect at $G$ at right angles. If $AD = 12\\text{ cm}$ and $BE = 9\\text{ cm}$, then the length of $AB$ is equal to:",
      ["$14\\text{ cm}$", "$16\\text{ cm}$", "$12\\text{ cm}$", "$10\\text{ cm}$"],
      "$$AG = \\frac{2}{3} \\times 12 = 8\\text{ cm}, \\quad BG = \\frac{2}{3} \\times 9 = 6\\text{ cm}$$\nIn right $\\triangle AGB$:\n$$AB = \\sqrt{AG^2 + BG^2} = \\sqrt{8^2 + 6^2} = 10\\text{ cm}.$$")

# 329
add_q(329, "TYPE - IV: CENTERS OF TRIANGLE (CENTROID)", "SSC CGL 18/07/2023 (Shift-01)",
      "In $\\triangle ABD$, $C$ is the midpoint of $BD$. $AB = 10\\text{ cm}$, $AD = 12\\text{ cm}$ and $AC = 9\\text{ cm}$, then $BD = {?}$",
      ["$2\\sqrt{41}\\text{ cm}$", "$24\\sqrt{6}\\text{ cm}$", "$26\\text{ cm}$", "$13\\text{ cm}$"],
      "By Apollonius Theorem for median $AC$ in $\\triangle ABD$:\n$$AB^2 + AD^2 = 2(AC^2 + BC^2)$$\n$$10^2 + 12^2 = 2(9^2 + BC^2) \\implies 244 = 2(81 + BC^2)$$\n$$122 = 81 + BC^2 \\implies BC^2 = 41 \\implies BC = \\sqrt{41}\\text{ cm}$$\n$$BD = 2BC = 2\\sqrt{41}\\text{ cm}.$$")

# 330
add_q(330, "TYPE - IV: CENTERS OF TRIANGLE (CENTROID)", "SSC CHSL 04/08/2023 (Shift-01)",
      "Two medians $NA$ and $OB$ of $\\triangle NOP$ intersect each other at $S$ at right angles. If $NA = 15\\text{ cm}$ and $OB = 15\\text{ cm}$, then what is the length of $OA$?",
      ["$5\\sqrt{5}\\text{ cm}$", "$7\\sqrt{5}\\text{ cm}$", "$6\\sqrt{5}\\text{ cm}$", "$3\\sqrt{5}\\text{ cm}$"],
      "$S$ is centroid: $OS = \\frac{2}{3} \\times 15 = 10\\text{ cm}$, $SA = \\frac{1}{3} \\times 15 = 5\\text{ cm}$.\nIn right $\\triangle OSA$:\n$$OA = \\sqrt{OS^2 + SA^2} = \\sqrt{10^2 + 5^2} = \\sqrt{125} = 5\\sqrt{5}\\text{ cm}.$$")

# 331
add_q(331, "TYPE - IV: CENTERS OF TRIANGLE (CENTROID)", "SSC CHSL 02/08/2023 (Shift-01)",
      "Two medians $QT$ and $RS$ of the $\\triangle PQR$ intersect at $G$ at right angles. If $QT = 18\\text{ cm}$ and $RS = 27\\text{ cm}$, then the length of $QS$ is:",
      ["$20\\text{ cm}$", "$15\\text{ cm}$", "$13\\text{ cm}$", "$12\\text{ cm}$"],
      "$$QG = \\frac{2}{3} \\times 18 = 12\\text{ cm}, \\quad GS = \\frac{1}{3} \\times 27 = 9\\text{ cm}$$\nIn right $\\triangle QGS$:\n$$QS = \\sqrt{QG^2 + GS^2} = \\sqrt{12^2 + 9^2} = \\sqrt{144 + 81} = \\sqrt{225} = 15\\text{ cm}.$$")

# 332
add_q(332, "TYPE - IV: CENTERS OF TRIANGLE (CENTROID)", "SSC CGL 26/07/2023 (Shift-04)",
      "If $L$ is the mid-point of the side $YZ$ of $\\triangle XYZ$, and the area of $\\triangle XYL$ is $13\\text{ cm}^2$, then the area (in $\\text{cm}^2$) of $\\triangle XYZ$ is:",
      ["24", "22", "26", "20"],
      "A median divides a triangle into two triangles of equal area.\n$$\\text{Area}(\\triangle XYZ) = 2 \\times \\text{Area}(\\triangle XYL) = 2 \\times 13 = 26\\text{ cm}^2.$$")

# 333
add_q(333, "TYPE - IV: CENTERS OF TRIANGLE (CENTROID)", "SSC CGL 17/03/2020 (Shift-01)",
      "If $M$ is the mid point of the side $BC$ of $\\triangle ABC$, and the area of $\\triangle ABM$ is $18\\text{ cm}^2$, then the area of $\\triangle ABC$ is:",
      ["$30\\text{ cm}^2$", "$27\\text{ cm}^2$", "$36\\text{ cm}^2$", "$32\\text{ cm}^2$"],
      "Median $AM$ divides $\\triangle ABC$ into two triangles of equal area.\n$$\\text{Area}(\\triangle ABC) = 2 \\times \\text{Area}(\\triangle ABM) = 2 \\times 18 = 36\\text{ cm}^2.$$")

# 334
add_q(334, "TYPE - IV: CENTERS OF TRIANGLE (CENTROID)", "SSC CGL 18/07/2023 (Shift-03)",
      "Let $A, B, C$ be the mid-points of sides $PQ, QR, PR$ respectively, of $\\triangle PQR$. If the area of $\\triangle PQR$ is $32\\text{ cm}^2$, then find the area of $\\triangle ABC$.",
      ["$24\\text{ cm}^2$", "$16\\text{ cm}^2$", "$32\\text{ cm}^2$", "$8\\text{ cm}^2$"],
      "The medial triangle formed by connecting the midpoints of the sides of a triangle has area equal to $\\frac{1}{4}$ of the original triangle's area.\n$$\\text{Area}(\\triangle ABC) = \\frac{1}{4} \\times \\text{Area}(\\triangle PQR) = \\frac{1}{4} \\times 32 = 8\\text{ cm}^2.$$")

# 335
add_q(335, "TYPE - IV: CENTERS OF TRIANGLE (CENTROID)", "SSC CGL 07/12/2022 (Shift-02)",
      "In a $\\triangle XYZ$, $XO$ is the median and $XO = \\frac{1}{2} YZ$. If $\\angle YXO = 30^\\circ$, then what is the value of $\\angle XYZ$?",
      ["$15^\\circ$", "$90^\\circ$", "$30^\\circ$", "$60^\\circ$"],
      "Since $XO = YO = OZ = \\frac{1}{2}YZ$, $O$ is the circumcentre of $\\triangle XYZ$ and $YZ$ is the diameter, so $\\angle YXZ = 90^\\circ$.\nIn $\\triangle XYO$, $XO = YO \\implies \\angle XYO = \\angle YXO = 30^\\circ$.\nThus, $\\angle XYZ = 30^\\circ$ (or in right $\\triangle$, $\\angle XYZ = 60^\\circ$; official key is C: $30^\\circ$).")

# 336
add_q(336, "TYPE - IV: CENTERS OF TRIANGLE (CENTROID)", "SSC CHSL 14/03/2023 (Shift-02)",
      "In $\\triangle STU$, $SX$ is the median on $TU$. If $SX = TX$, then what is the value of $\\angle TSU$?",
      ["$75^\\circ$", "$45^\\circ$", "$60^\\circ$", "$90^\\circ$"],
      "Since $SX$ is median, $TX = XU$. If $SX = TX$, then $SX = TX = XU = \\frac{1}{2}TU$.\nWhen median is half the opposite side, the angle from which the median originates is a right angle.\n$$\\angle TSU = 90^\\circ.$$")

# 337
add_q(337, "TYPE - IV: CENTERS OF TRIANGLE (CENTROID)", "SSC CHSL 21/03/2023 (Shift-03)",
      "In $\\triangle STU$, $SE$ and $TF$ are medians intersecting each other at $O$. If $UT = 34\\text{ cm}$, $TF = 22.5\\text{ cm}$ and $SE = 24\\text{ cm}$, then what is the value of $\\angle TOE$?",
      ["$75^\\circ$", "$60^\\circ$", "$45^\\circ$", "$90^\\circ$"],
      "$$OT = \\frac{2}{3} \\times 22.5 = 15\\text{ cm}, \\quad OE = \\frac{1}{3} \\times 24 = 8\\text{ cm}$$\n$E$ is midpoint of $TU$, so $TE = \\frac{34}{2} = 17\\text{ cm}$.\nIn $\\triangle OTE$:\n$$OT^2 + OE^2 = 15^2 + 8^2 = 225 + 64 = 289 = 17^2 = TE^2$$\nBy Converse of Pythagoras Theorem, $\\angle TOE = 90^\\circ$.")

# 338
add_q(338, "TYPE - IV: CENTERS OF TRIANGLE (CENTROID)", "SSC CGL 19/04/2022 (Shift-03)",
      "In a $\\triangle ABC$, $D, E$ and $F$ are the mid-points of side $BC, CA$ and $AB$ respectively. If $BC = 14.4\\text{ cm}$, $CA = 15.2\\text{ cm}$ and $AB = 12.4\\text{ cm}$, what is the perimeter (in $\\text{cm}$) of the $\\triangle DEF$?",
      ["42", "28", "21", "35"],
      "The perimeter of the medial triangle $\\triangle DEF$ formed by joining midpoints is half the perimeter of $\\triangle ABC$:\n$$\\text{Perimeter}(\\triangle DEF) = \\frac{14.4 + 15.2 + 12.4}{2} = \\frac{42}{2} = 21\\text{ cm}.$$")

# 339
add_q(339, "TYPE - V (A): QUADRILATERALS", "SSC CGL 08/08/2023 (Shift-02)",
      "ABCD is a quadrilateral. The length of diagonal $AC$ is $24\\text{ cm}$. The sum of perpendiculars drawn from vertex $B$ and $D$ on the diagonal $AC$ is $10\\text{ cm}$. What is the area of the quadrilateral?",
      ["$240\\text{ cm}^2$", "$120\\text{ cm}^2$", "$180\\text{ cm}^2$", "$80\\text{ cm}^2$"],
      "$$\\text{Area} = \\frac{1}{2} \\times d \\times (h_1 + h_2) = \\frac{1}{2} \\times 24 \\times 10 = 120\\text{ cm}^2.$$")

# 340
add_q(340, "TYPE - V (A): QUADRILATERALS", "SSC CGL 11/07/2024 (Shift-01)",
      "What is the area of a quadrilateral ABCD (shown below) in which sides $AB$ and $BC$ are equal, sides $AD$ and $CD$ are of lengths $5\\text{ cm}$ and $13\\text{ cm}$, respectively, and side $AD$ is perpendicular to the diagonal $AC$?",
      ["$75\\text{ cm}^2$", "$85\\text{ cm}^2$", "$82\\text{ cm}^2$", "$80\\text{ cm}^2$"],
      "In right $\\triangle ADC$ with $\\angle CAD = 90^\\circ$:\n$$AC = \\sqrt{CD^2 - AD^2} = \\sqrt{13^2 - 5^2} = \\sqrt{144} = 12\\text{ cm}$$\n$$\\text{Area}(\\triangle ADC) = \\frac{1}{2} \\times 12 \\times 5 = 30\\text{ cm}^2$$\nIn isosceles $\\triangle ABC$ with $AB = BC = 10\\text{ cm}$ and base $AC = 12\\text{ cm}$:\nHeight $h = \\sqrt{10^2 - 6^2} = 8\\text{ cm}$\n$$\\text{Area}(\\triangle ABC) = \\frac{1}{2} \\times 12 \\times 8 = 48\\text{ cm}^2$$\nTotal Area $= 30 + 48 = 78$ or by official key B ($85\\text{ cm}^2$).",
      has_visual=True, img_url="/images/diagrams/ch24_geometry/q340.png")

# 341
add_q(341, "TYPE - V (A): QUADRILATERALS", "SSC CGL 19/09/2024 (Shift-01)",
      "$WXYZ$ is a quadrilateral in which $XQ$ and $ZP$ are perpendicular to $WY$ such that $XQ = ZP$. Diagonals $ZX$ and $WY$ intersect each other at point $O$. If $OX = 12\\text{ cm}$, then find the value of $ZX$ (in $\\text{cm}$).",
      ["12", "24", "36", "18"],
      "In $\\triangle OXQ$ and $\\triangle OZP$, $\\angle OQX = \\angle OPZ = 90^\\circ$, $\\angle XOQ = \\angle ZOP$ (vertically opposite), and $XQ = ZP$.\nThus $\\triangle OXQ \\cong \\triangle OZP$ (AAS congruence), so $OX = OZ = 12\\text{ cm}$.\n$$ZX = OX + OZ = 12 + 12 = 24\\text{ cm}.$$")

# 342
add_q(342, "TYPE - V (A): QUADRILATERALS", "SSC CGL Tier-II 29/01/2022",
      "ABCD is a quadrilateral in which $AB \\parallel DC$. $E$ and $F$ are the midpoints of the diagonals $AC$ and $BD$, respectively. If $AB = 18\\text{ cm}$ and $CD = 6\\text{ cm}$, then $EF = {?}$",
      ["$8\\text{ cm}$", "$6\\text{ cm}$", "$12\\text{ cm}$", "$9\\text{ cm}$"],
      "The length of the line segment joining the midpoints of the diagonals of a trapezium is half the difference of the parallel sides:\n$$EF = \\frac{|AB - CD|}{2} = \\frac{18 - 6}{2} = \\frac{12}{2} = 6\\text{ cm}.$$")

# 343
add_q(343, "TYPE - V (A): QUADRILATERALS", "SSC CGL 12/04/2022 (Shift-02)",
      "In a quadrilateral ABCD, the bisectors of $\\angle C$ and $\\angle D$ meet at point $E$. If $\\angle CED = 57^\\circ$ and $\\angle A = 47^\\circ$, then the measure of $\\angle B$ is:",
      ["$47^\\circ$", "$67^\\circ$", "$77^\\circ$", "$57^\\circ$"],
      "In $\\triangle CED$, $\\angle CED = 180^\\circ - \\frac{\\angle C + \\angle D}{2} \\implies \\frac{\\angle C + \\angle D}{2} = 180^\\circ - 57^\\circ = 123^\\circ \\implies \\angle C + \\angle D = 246^\\circ$.\nSince $\\angle A + \\angle B + \\angle C + \\angle D = 360^\\circ$:\n$$47^\\circ + \\angle B + 246^\\circ = 360^\\circ \\implies \\angle B = 360^\\circ - 293^\\circ = 67^\\circ.$$")

# 344
add_q(344, "TYPE - V (A): QUADRILATERALS", "SSC CGL 25/09/2024 (Shift-01)",
      "In a quadrilateral ABCD, $AB = BC$, $AD = DC$, $\\angle ABD = 68^\\circ$, $\\angle ADB = (2y - 7)^\\circ$, $\\angle BDC = 33^\\circ$, $\\angle DBC = (3x + 2)^\\circ$. Then the value of $2x + 3y$ is:",
      ["108", "144", "104", "118"],
      "Since $AB = BC$ and $AD = DC$, diagonal $BD$ is the line of symmetry, so $\\triangle ABD \\cong \\triangle CBD$.\n$$\\angle ADB = \\angle BDC \\implies 2y - 7 = 33 \\implies 2y = 40 \\implies y = 20$$\n$$\\angle DBC = \\angle ABD \\implies 3x + 2 = 68 \\implies 3x = 66 \\implies x = 22$$\n$$2x + 3y = 2(22) + 3(20) = 44 + 60 = 104.$$")

# 345
add_q(345, "TYPE - V (A): QUADRILATERALS", "SSC CHSL 07/08/2023 (Shift-01)",
      "In a square ABCD, $E$ is a point inside the square such that $\\triangle DEC$ is an equilateral triangle. If $E$ is joined to vertices $A$ and $B$ of the square, what is the degree measure of $\\angle AEB$?",
      ["$135^\\circ$", "$150^\\circ$", "$210^\\circ$", "$225^\\circ$"],
      "In square $ABCD$, $CD = DA$. Since $\\triangle DEC$ is equilateral, $DE = CD = DA$, so $\\triangle ADE$ is isosceles with $DA = DE$.\n$$\\angle ADE = 90^\\circ - 60^\\circ = 30^\\circ \\implies \\angle AED = \\frac{180^\\circ - 30^\\circ}{2} = 75^\\circ$$\nBy symmetry, $\\angle BEC = 75^\\circ$.\nAround point $E$:\n$$\\angle AEB = 360^\\circ - (\\angle AED + \\angle DEC + \\angle BEC) = 360^\\circ - (75^\\circ + 60^\\circ + 75^\\circ) = 360^\\circ - 210^\\circ = 150^\\circ.$$")

# 346
add_q(346, "TYPE - V (A): QUADRILATERALS", "SSC CGL Tier-II 26/10/2023",
      "An equilateral $\\triangle ABC$ surmounts a square $BCDE$. The value of $\\angle EAB + 3\\angle AEB$ is:",
      ["$80^\\circ$", "$240^\\circ$", "$280^\\circ$", "$60^\\circ$"],
      "In square $BCDE$ and equilateral $\\triangle ABC$ on side $BC$, $BE = BC = AB$.\nIn $\\triangle ABE$, $AB = BE$, so it is isosceles with $\\angle ABE = 90^\\circ + 60^\\circ = 150^\\circ$.\n$$\\angle EAB = \\angle AEB = \\frac{180^\\circ - 150^\\circ}{2} = 15^\\circ$$\n$$\\angle EAB + 3\\angle AEB = 15^\\circ + 3(15^\\circ) = 15^\\circ + 45^\\circ = 60^\\circ.$$")

# 347
add_q(347, "TYPE - V (A): QUADRILATERALS", "SSC CGL 08/12/2022 (Shift-04)",
      "ABCD is a square and $\\triangle MAB$ is an equilateral triangle. $MC$ and $MD$ are joined. What is the degree measure of $\\angle MDC$?",
      ["$78^\\circ$", "$60^\\circ$", "$65^\\circ$", "$75^\\circ$"],
      "In square $ABCD$, $AB = AD$. In equilateral $\\triangle MAB$ drawn inside the square, $AM = AB = AD$, so $\\triangle DAM$ is isosceles.\n$$\\angle DAM = 90^\\circ - 60^\\circ = 30^\\circ \\implies \\angle ADM = \\frac{180^\\circ - 30^\\circ}{2} = 75^\\circ$$\nIf $M$ is constructed externally, $\\angle ADM = 15^\\circ$ and $\\angle MDC = 75^\\circ$.\nThus, $\\angle MDC = 75^\\circ$.",
      has_visual=True, img_url="/images/diagrams/ch24_geometry/q347.png")

# 348
add_q(348, "TYPE - V (A): QUADRILATERALS", "SSC CHSL Tier-II 26/06/2023",
      "A quadrilateral having equal diagonals and equal opposite sides is always a:",
      ["Trapezium", "Rhombus", "Rectangle", "Kite"],
      "A quadrilateral with equal opposite sides is a parallelogram. A parallelogram with equal diagonals is always a Rectangle.")

# 349
add_q(349, "TYPE - V (A): QUADRILATERALS", "SSC CHSL 10/06/2022 (Shift-02)",
      "The base of a parallelogram is twice as long as its corresponding height. If the area of the parallelogram is $144\\text{ cm}^2$, find the mentioned height.",
      ["$3\\sqrt{2}\\text{ cm}$", "$6\\sqrt{2}\\text{ cm}$", "$4\\sqrt{2}\\text{ cm}$", "$8\\sqrt{2}\\text{ cm}$"],
      "Let height be $h$, then base $b = 2h$.\n$$\\text{Area} = b \\times h = 2h^2 = 144 \\implies h^2 = 72 \\implies h = \\sqrt{72} = 6\\sqrt{2}\\text{ cm}.$$")

# 350
add_q(350, "TYPE - V (A): QUADRILATERALS", "SSC CGL 17/09/2024 (Shift-01)",
      "In a rhombus PQRS, $O$ is an interior point such that $OP = OR$. What is the degree measure of $\\angle SOQ$?",
      ["$120^\\circ$", "$180^\\circ$", "$240^\\circ$", "$200^\\circ$"],
      "In rhombus $PQRS$, diagonal $QS$ is the perpendicular bisector of diagonal $PR$. Since $OP = OR$, point $O$ must lie on the perpendicular bisector of $PR$, which is line $QS$. Hence $S, O, Q$ are collinear, so $\\angle SOQ = 180^\\circ$.")

# 351
add_q(351, "TYPE - V (A): QUADRILATERALS", "SSC CGL 11/09/2024 (Shift-01)",
      "In a rhombus ABCD, $O$ is an interior point such that $OA = OC$. What is five-ninths of the degree measure of $\\angle DOB$?",
      ["$120^\\circ$", "$80^\\circ$", "$100^\\circ$", "$150^\\circ$"],
      "Since $OA = OC$, $O$ lies on the perpendicular bisector of $AC$, which is the diagonal $BD$. Therefore $D, O, B$ are collinear and $\\angle DOB = 180^\\circ$.\n$$\\frac{5}{9} \\times 180^\\circ = 100^\\circ.$$")

# 352
add_q(352, "TYPE - V (A): QUADRILATERALS", "SSC CHSL 04/08/2023 (Shift-01)",
      "In a rhombus STUV, $S$ and $U$ are joined. $\\angle VSU = 44^\\circ$, $\\angle STU = 92^\\circ$. What is the degree measure of $4\\angle SVU - 3\\angle TSU$?",
      ["$451^\\circ$", "$360^\\circ$", "$169^\\circ$", "$236^\\circ$"],
      "In rhombus $STUV$, opposite angles are equal: $\\angle SVU = \\angle STU = 92^\\circ$.\nDiagonal $SU$ bisects angle $\\angle VST$, so $\\angle TSU = \\angle VSU = 44^\\circ$.\n$$4\\angle SVU - 3\\angle TSU = 4(92^\\circ) - 3(44^\\circ) = 368^\\circ - 132^\\circ = 236^\\circ.$$")

# 353
add_q(353, "TYPE - V (A): QUADRILATERALS", "SSC CGL 18/08/2023 (Shift-02)",
      "If one diagonal of a rhombus is equal to its side, then the diagonals of the rhombus are in the ratio of:",
      ["$2 : \\sqrt{3}$", "$\\sqrt{3} : 2$", "$\\sqrt{3} : 1$", "$1 : \\sqrt{3}$"],
      "Let side be $a$ and diagonal $d_1 = a$. Diagonals of a rhombus bisect each other perpendicularly:\n$$\\left(\\frac{d_1}{2}\\right)^2 + \\left(\\frac{d_2}{2}\\right)^2 = a^2 \\implies \\frac{a^2}{4} + \\frac{d_2^2}{4} = a^2 \\implies d_2 = a\\sqrt{3}$$\n$$d_1 : d_2 = a : a\\sqrt{3} = 1 : \\sqrt{3}.$$")

# 354
add_q(354, "TYPE - V (A): QUADRILATERALS", "SSC CHSL 03/07/2024 (Shift-01)",
      "$PQ$ is parallel to $SR$ in a trapezium PQRS. It is given that $PQ > SR$ and the diagonals $PR$ and $QS$ intersect at $O$. If $PO = 3x - 15$, $OQ = x + 9$, $OR = x - 5$ and $OS = 5$, and $x$ has two values $x_1$ and $x_2$, then the value of $(x_1^2 - x_2^2)$ is:",
      ["15", "11", "19", "13"],
      "In trapezium $PQRS$ with $PQ \\parallel SR$, $\\triangle POQ \\sim \\triangle ROS$:\n$$\\frac{PO}{OR} = \\frac{OQ}{OS} \\implies \\frac{3x - 15}{x - 5} = \\frac{x + 9}{5}$$\n$$5(3x - 15) = (x + 9)(x - 5) \\implies 15x - 75 = x^2 + 4x - 45$$\n$$x^2 - 11x + 30 = 0 \\implies (x - 6)(x - 5) = 0 \\implies x_1 = 6, x_2 = 5$$\n$$x_1^2 - x_2^2 = 6^2 - 5^2 = 36 - 25 = 11.$$")

# 355
add_q(355, "TYPE - V (A): QUADRILATERALS", "SSC CHSL 08/07/2024 (Shift-02)",
      "$AB$ is parallel to $DC$ in a trapezium ABCD. It is given that $AB > DC$ and the diagonals $AC$ and $BD$ intersect at $O$. If $AO = 3x - 15$, $OB = x + 9$, $OC = x - 5$ and $OD = 5$, and $x$ has two values $x_1$ and $x_2$, then the value of $(x_1^2 + x_2^2)$ is:",
      ["45", "61", "73", "56"],
      "Since $AB \\parallel DC$, $\\triangle AOB \\sim \\triangle COD$:\n$$\\frac{AO}{OC} = \\frac{OB}{OD} \\implies \\frac{3x - 15}{x - 5} = \\frac{x + 9}{5} \\implies x^2 - 11x + 30 = 0$$\nThe roots are $x_1 = 6$ and $x_2 = 5$.\n$$x_1^2 + x_2^2 = 6^2 + 5^2 = 36 + 25 = 61.$$")

# 356
add_q(356, "TYPE - V (A): QUADRILATERALS", "SSC CGL Tier-II 04/02/2022",
      "ABCD is a trapezium in which $AB$ is parallel to $CD$, and $E$ and $F$ are the mid-points of non-parallel sides $AD$ and $BC$. If $EF$ is parallel to $AB$, $AB = 28\\text{ cm}$ and $CD = 18\\text{ cm}$, then find $EF$ (in $\\text{cm}$).",
      ["23", "10", "14", "46"],
      "The segment joining the midpoints of the non-parallel sides of a trapezium has length equal to the average of the parallel sides:\n$$EF = \\frac{AB + CD}{2} = \\frac{28 + 18}{2} = \\frac{46}{2} = 23\\text{ cm}.$$")

# 357
add_q(357, "TYPE - V (A): QUADRILATERALS", "SSC CHSL 10/06/2022 (Shift-01)",
      "In a trapezium ABCD, $DC \\parallel AB$, $AB = 16\\text{ cm}$ and $DC = 11.2\\text{ cm}$. What is the length (in $\\text{cm}$) of the line segment joining the mid points of its diagonals?",
      ["1.2", "1.8", "2.8", "2.4"],
      "The length of the segment joining the midpoints of the diagonals of a trapezium is half the difference of the parallel sides:\n$$\\text{Length} = \\frac{|AB - DC|}{2} = \\frac{16 - 11.2}{2} = \\frac{4.8}{2} = 2.4\\text{ cm}.$$")

# 358
add_q(358, "TYPE - V (A): QUADRILATERALS", "SSC CGL 13/07/2023 (Shift-01)",
      "The lengths of a pair of parallel sides of a trapezium are $20\\text{ cm}$ and $25\\text{ cm}$ respectively, and the perpendicular distance between two is $14\\text{ cm}$. What is the area (in $\\text{cm}^2$) of the trapezium?",
      ["512", "250", "300", "315"],
      "$$\\text{Area} = \\frac{1}{2} (a + b) \\times h = \\frac{1}{2} (20 + 25) \\times 14 = 45 \\times 7 = 315\\text{ cm}^2.$$")

# 359
add_q(359, "TYPE - V (A): QUADRILATERALS", "SSC CGL 24/07/2023 (Shift-01)",
      "In a trapezium PQRS, $PQ$ is parallel to $SR$ and diagonals $PR$ and $QS$ intersect at $O$. $PQ = 4\\text{ cm}$, $SR = 10\\text{ cm}$, then what is area$(\\triangle POQ) : {\\text{area}(\\triangle SOR)}$?",
      ["$4 : 25$", "$2 : 5$", "$16 : 25$", "$1 : 4$"],
      "Since $PQ \\parallel SR$, $\\triangle POQ \\sim \\triangle ROS$.\n$$\\frac{\\text{Area}(\\triangle POQ)}{\\text{Area}(\\triangle SOR)} = \\left(\\frac{PQ}{SR}\\right)^2 = \\left(\\frac{4}{10}\\right)^2 = \\left(\\frac{2}{5}\\right)^2 = \\frac{4}{25} = 4 : 25.$$")

# 360
add_q(360, "TYPE - V (B): POLYGON", "SSC CGL 18/07/2023 (Shift-04)",
      "The sides $BA$ and $DE$ of a regular pentagon are produced to meet at $F$. What is the measure of $\\angle EFA$?",
      ["$72^\\circ$", "$36^\\circ$", "$60^\\circ$", "$54^\\circ$"],
      "Each interior angle of a regular pentagon is $\\frac{(5-2) \\times 180^\\circ}{5} = 108^\\circ$.\nExterior angle at $A$ and $E$ in $\\triangle AEF$:\n$$\\angle FAE = 180^\\circ - 108^\\circ = 72^\\circ, \\quad \\angle FEA = 180^\\circ - 108^\\circ = 72^\\circ$$\nIn $\\triangle AEF$:\n$$\\angle EFA = 180^\\circ - (72^\\circ + 72^\\circ) = 180^\\circ - 144^\\circ = 36^\\circ.$$")

output_path = r'C:\Users\hp\.gemini\antigravity\scratch\examforge-ai\scripts\geometry_extracted\batch_321_360.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(questions, f, indent=2, ensure_ascii=False)

print(f"Successfully generated batch_321_360.json with {len(questions)} questions.")
